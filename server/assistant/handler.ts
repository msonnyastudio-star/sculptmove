import type { Lang } from '../../src/config.js'
import { buildSystemPrompt, priceList, pricesAreValid, productsToShow, relevantProducts } from './catalog.js'
import { allowRequest, historyForProvider, isInjection, isMedical, MAX_BODY_BYTES, parseChatInput, type ChatInput } from './guards.js'
import { generateWithFailover, type Env, type ProviderName } from './providers.js'

export type ChatKind = 'answer' | 'medical' | 'refusal' | 'fallback' | 'limited' | 'invalid'
export type ChatResult = { kind: ChatKind; text: string; products: string[]; provider?: ProviderName }

const MESSAGES = {
  fr: {
    fallback: 'Je ne peux pas vous répondre pour le moment. Notre équipe peut vous aider directement sur WhatsApp.',
    medical: 'Je ne peux pas poser de diagnostic, et aucun de nos produits ne soigne une maladie. Par précaution, si vous avez un problème de santé, suivez un traitement, êtes enceinte ou allaitez, veuillez consulter votre médecin avant de consommer ou d’utiliser nos produits, et montrez-lui l’emballage. En cas de symptômes préoccupants, consultez sans attendre.',
    refusal: 'Je suis là pour vous conseiller sur les produits Sculpt Move. Quelle est votre question sur nos produits ?',
    limited: 'Vous envoyez beaucoup de messages. Merci de patienter un instant avant de réessayer, ou écrivez à notre équipe sur WhatsApp.',
    invalid: 'Je n’ai pas pu lire ce message. Pouvez-vous le reformuler en quelques phrases ?',
    prices: 'Voici nos prix exacts, hors frais de livraison :',
  },
  en: {
    fallback: 'I can’t reply right now. Our team can help you directly on WhatsApp.',
    medical: 'I can’t give a diagnosis, and none of our products treats an illness. As a precaution, if you have a health condition, are undergoing treatment, are pregnant or are breastfeeding, please consult your doctor before consuming or using our products, and show them the packaging. If you have worrying symptoms, see a doctor without delay.',
    refusal: 'I’m here to advise you on Sculpt Move products. What would you like to know about them?',
    limited: 'You are sending many messages. Please wait a moment before trying again, or write to our team on WhatsApp.',
    invalid: 'I couldn’t read that message. Could you rephrase it in a few sentences?',
    prices: 'Here are our exact prices, excluding delivery:',
  },
} satisfies Record<Lang, Record<string, string>>

function tidy(text: string) {
  const plain = text.replace(/\*\*|__|^#+\s*/gm, '').replace(/^\s*[-*]\s+/gm, '• ').trim()
  if (plain.length <= 900) return plain
  const cut = plain.slice(0, 900)
  return cut.slice(0, Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('\n'), 200) + 1).trim()
}

export async function answerChat({ message, history, lang }: ChatInput, env: Env): Promise<ChatResult> {
  const text = MESSAGES[lang]
  if (isInjection(message)) return { kind: 'refusal', text: text.refusal, products: [] }

  // Les questions médicales sont traitées ici, sans jamais partir chez un fournisseur d'IA.
  if (isMedical(message)) {
    const concerned = relevantProducts(message, lang)
    const notes = concerned.flatMap((product) => product.precautions ?? []).join(' ')
    return { kind: 'medical', text: notes ? `${text.medical}\n${notes}` : text.medical, products: concerned.map((product) => product.slug) }
  }

  const turns = historyForProvider(history)
  const recent = turns.map((turn) => turn.content).join(' ')
  const result = await generateWithFailover({ system: buildSystemPrompt(lang, message, recent), turns: [...turns, { role: 'user', content: message }] }, env)
  if (!result) return { kind: 'fallback', text: text.fallback, products: relevantProducts(message, lang).map((product) => product.slug) }

  const reply = tidy(result.text)
  // Un montant absent du catalogue ne doit jamais atteindre la cliente.
  if (!pricesAreValid(reply)) {
    console.warn(JSON.stringify({ event: 'assistant_price_guard', provider: result.provider }))
    return { kind: 'answer', text: `${text.prices}\n${priceList(lang)}`, products: [], provider: result.provider }
  }
  return { kind: 'answer', text: reply, products: productsToShow(reply, message, lang), provider: result.provider }
}

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } })

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  if (!origin || !host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export async function handleChat(request: Request): Promise<Response> {
  const invalid = (status: number) => json({ kind: 'invalid', text: MESSAGES.fr.invalid, products: [] }, status)
  if (!sameOrigin(request)) return invalid(403)
  if (!(request.headers.get('content-type') ?? '').includes('application/json')) return invalid(415)
  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) return invalid(413)
  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return invalid(400)
  }
  const input = parseChatInput(body)
  if (!input) return invalid(400)

  const ip = request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!allowRequest(ip)) return json({ kind: 'limited', text: MESSAGES[input.lang].limited, products: [] }, 429)

  try {
    const { provider, ...result } = await answerChat(input, process.env)
    console.log(JSON.stringify({ event: 'assistant_reply', kind: result.kind, provider }))
    return json(result)
  } catch (error) {
    // Jamais de détail technique pour le visiteur ; le contenu des messages n'est pas journalisé non plus.
    console.error(JSON.stringify({ event: 'assistant_error', name: error instanceof Error ? error.name : 'unknown' }))
    return json({ kind: 'fallback', text: MESSAGES[input.lang].fallback, products: [] })
  }
}

