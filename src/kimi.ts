// Textes et règles de Kimi côté navigateur. Les questions libres partent vers /api/chat ;
// le parcours de commande et les boutons d'accueil restent ici et ne consomment aucun quota d'IA.
import type { CartLine, Lang, Product } from './config'
import { hasKeyword, mentionedProducts, normalize } from './productMatch'

export type KimiAction =
  | { type: 'ask'; label: string; text: string }
  | { type: 'local'; label: string; text: string }
  | { type: 'order'; label: string; items?: CartLine[] }
  | { type: 'human'; label: string; slugs?: string[] }
  | { type: 'page'; label: string; to: string }

export const KIMI_PHOTO = '/images/kimi.jpg'

export type KimiRequest = { slug?: string; quantity?: number; ask?: string }

// Ouvre la discussion depuis n'importe quelle page : une fiche produit, ou une question déjà choisie.
export const openKimi = (request: KimiRequest = {}) => window.dispatchEvent(new CustomEvent<KimiRequest>('kimi:open', { detail: request }))

const STRONG_ORDER = ['commander', 'acheter', 'passer commande', 'je commande', 'buy', 'purchase', 'place an order', 'to order']
const WEAK_ORDER = ['je veux', 'je voudrais', 'j aimerais', 'je prends', 'je prend', 'donnez moi', 'i want', 'i would like', 'i ll take']
const NOT_ORDER = ['comment commander', 'comment acheter', 'comment passer', 'how to order', 'how do i order', 'how to buy', 'how can i order', 'deja commande', 'ma commande', 'my order', 'suivi', 'annuler', 'cancel', 'remboursement', 'refund', 'non merci', 'veux pas', 'souhaite pas', 'pas commander', 'pas acheter', 'pas maintenant', 'plus tard', 'no thanks', 'no thank you', 'not now', 'maybe later', 'don t want', 'do not want', 'not ready']
const YES = new Set(['oui', 'oui svp', 'oui s il vous plait', 'oui merci', 'ok', 'okay', 'd accord', 'daccord', 'volontiers', 'allez y', 'vas y', 'je veux bien', 'avec plaisir', 'yes', 'yes please', 'sure', 'go ahead', 'please do'])
const NOT_WEAK = ['prix', 'coute', 'combien', 'utiliser', 'savoir', 'price', 'cost', 'how much', 'how to', 'know']

// Une envie d'acheter : renvoie les produits et quantités demandés, ou null s'il s'agit d'une simple question.
export function orderIntent(text: string): CartLine[] | null {
  if (hasKeyword(text, NOT_ORDER)) return null
  const items = mentionedProducts(text)
  if (hasKeyword(text, STRONG_ORDER)) return items
  if (items.length > 0 && hasKeyword(text, WEAK_ORDER) && !hasKeyword(text, NOT_WEAK)) return items
  return null
}

// Un « oui » répond à la dernière phrase de Kimi : il ne lance la commande que si elle vient de la proposer.
export function acceptsOrder(answer: string, kimiText: string) {
  const sentences = kimiText.split(/[.!\n]+/).map((sentence) => sentence.trim()).filter(Boolean)
  const last = sentences[sentences.length - 1] ?? ''
  return YES.has(normalize(answer)) && last.includes('?') && hasKeyword(last, ['prepare', 'preparer', 'commande', 'commander', 'order'])
}

const QUESTION_WORDS = ['comment', 'combien', 'pourquoi', 'quand', 'quel', 'quelle', 'quels', 'quelles', 'est ce que', 'livraison', 'prix', 'how', 'what', 'when', 'why', 'which', 'delivery', 'price']

// Une question plutôt qu'un nom de ville, pendant que Kimi attend la ville de livraison.
export function looksLikeQuestion(text: string) {
  return text.includes('?') || normalize(text).split(' ').length > 6 || hasKeyword(text, QUESTION_WORDS)
}

// Coupe sans casser un emoji, qui ferait échouer l'encodage du lien WhatsApp.
const cut = (text: string, max: number) => Array.from(text).slice(0, max).join('')

export function cityFrom(text: string) {
  return cut(text.trim().replace(/^(je suis|j[’']habite|je vis|je vais|je reste|livrez|livraison|ma ville|ville|i am|i'm|i live|deliver|city)\b[\s:]*(à|a|au|sur|de|est|in|to|at|is)?\s*/i, '').replace(/[.!]+$/, '').trim(), 60)
}

// Longueur maximale du lien WhatsApp, une fois encodé. Au-delà, certains téléphones n'ouvrent plus le message.
const MAX_WHATSAPP_URL_TEXT = 3000
const MAX_TRANSCRIPT_LINE = 280

type TranscriptMessage = { from: 'kimi' | 'user'; text: string; flow?: boolean }

// Ajoute la discussion sous la commande. La commande passe toujours en entier ;
// si la place manque, ce sont les plus anciens échanges qui sont retirés.
export function orderWithTranscript(order: string, messages: TranscriptMessage[], lang: Lang) {
  const c = kimiCopy(lang)
  const lines = messages.filter((message) => !message.flow).map((message) => {
    const text = message.text.replace(/\s+/g, ' ').trim()
    return `${message.from === 'user' ? c.transcriptClient : 'Kimi'} : ${Array.from(text).length > MAX_TRANSCRIPT_LINE ? `${cut(text, MAX_TRANSCRIPT_LINE - 1)}…` : text}`
  })
  if (lines.length === 0) return order
  const build = (kept: string[], cut: boolean) => [order, '', c.transcriptTitle, ...(cut ? [c.transcriptCut] : []), ...kept].join('\n')
  let kept = lines
  while (kept.length > 0 && encodeURIComponent(build(kept, kept.length < lines.length)).length > MAX_WHATSAPP_URL_TEXT) kept = kept.slice(1)
  return kept.length > 0 ? build(kept, kept.length < lines.length) : order
}

const FR = {
  intro: 'Bonjour et bienvenue ! 🌸 Je suis Kimi, conseillère beauté chez Sculpt Move. Posez-moi vos questions sur nos produits, et je prépare votre commande quand vous le souhaitez.',
  teaser: 'Bonjour 🌸 Besoin d’un conseil ? Je réponds à vos questions et je prépare votre commande.',
  teaserProduct: (name: string) => `Une question sur ${name} ? Je vous réponds et je prépare votre commande si vous le souhaitez 🌸`,
  teaserClose: 'Fermer l’invitation de Kimi',
  productIntro: (name: string) => `Bonjour ! 🌸 Je suis Kimi, conseillère beauté chez Sculpt Move. Que souhaitez-vous savoir sur ${name} ? Je peux aussi préparer votre commande.`,
  productAsk: (name: string) => `Bien sûr ! Que souhaitez-vous savoir sur ${name} ? Je peux aussi préparer votre commande.`,
  chipBenefits: 'À quoi ça sert ?', askBenefits: (name: string) => `À quoi sert ${name} ?`,
  chipUse: 'Comment l’utiliser ?', askUse: (name: string) => `Comment utiliser ${name} ?`,
  notice: 'Pour votre confidentialité, n’indiquez pas d’informations personnelles ou médicales ici. En cas de doute, l’emballage du produit fait foi.',
  unavailable: 'Je ne peux pas vous répondre pour le moment. Notre équipe peut vous aider directement sur WhatsApp.',
  delivery: 'Nous expédions depuis Akwa (Douala) partout au Cameroun et vers les pays de la sous-région. Les frais et les délais dépendent de votre ville : l’équipe vous les confirme lorsque vous envoyez votre commande.',
  shop: 'Vous pouvez venir à notre boutique à Akwa (Douala) et commander directement sur place. L’équipe vous donne l’adresse exacte et les horaires sur WhatsApp.',
  catalogue: 'Voici nos essentiels :',
  prices: 'Voici nos prix, hors frais de livraison :',
  chipProducts: 'Les produits', chipPrices: 'Les prix', chipDelivery: 'La livraison', chipShop: 'La boutique', chipOrder: 'Commander', chipOrderWa: 'Commander sur WhatsApp', chipHuman: 'Écrire à l’équipe', chipHealth: 'Une question de santé',
  askHealth: 'J’ai un problème de santé, puis-je consommer ces produits ?',
  view: (name: string) => `Voir ${name}`,
  human: 'Parler à un conseiller sur WhatsApp',
  open: 'Demander à Kimi', openLabel: 'Ouvrir la discussion avec Kimi, conseillère beauté', close: 'Fermer la discussion', role: 'Conseillère beauté · Sculpt Move',
  placeholder: 'Écrivez votre question…', cityPlaceholder: 'Votre ville…', send: 'Envoyer', log: 'Discussion avec Kimi',
  orderStart: 'Très bien ! Choisissez vos produits et les quantités :',
  orderContinue: 'Continuer', orderEmpty: 'Ajoutez au moins un produit pour continuer.',
  askCity: 'Dans quelle ville devons-nous livrer ?',
  remindCity: 'Et pour votre commande : dans quelle ville devons-nous livrer ?',
  summary: 'Voici votre commande. Vérifiez-la, puis envoyez-la sur WhatsApp :',
  city: 'Ville', total: 'Total', excl: 'hors livraison', edit: 'Modifier',
  sendOrder: 'Envoyer ma commande sur WhatsApp',
  note: 'WhatsApp s’ouvre avec votre message déjà écrit, qui contient aussi cette discussion pour aider l’équipe. Vous pouvez le relire et le modifier avant d’appuyer sur Envoyer. Ce message ne vaut pas confirmation : l’équipe confirme la disponibilité et la livraison.',
  transcriptTitle: 'Discussion avec Kimi :', transcriptClient: 'Client', transcriptCut: '[début de la discussion non inclus]',
  sent: 'Merci ! 💜 Appuyez sur Envoyer dans WhatsApp si ce n’est pas encore fait. L’équipe vous répondra pour confirmer la disponibilité et la livraison.',
  less: (name: string) => `Retirer un ${name}`, more: (name: string) => `Ajouter un ${name}`,
}

type Copy = typeof FR

const EN: Copy = {
  intro: 'Hello and welcome! 🌸 I’m Kimi, a beauty advisor at Sculpt Move. Ask me about our products, and I’ll prepare your order whenever you like.',
  teaser: 'Hello 🌸 Need some advice? I answer your questions and prepare your order.',
  teaserProduct: (name) => `A question about ${name}? I’ll answer and prepare your order if you wish 🌸`,
  teaserClose: 'Close Kimi’s invitation',
  productIntro: (name) => `Hello! 🌸 I’m Kimi, a beauty advisor at Sculpt Move. What would you like to know about ${name}? I can also prepare your order.`,
  productAsk: (name) => `Of course! What would you like to know about ${name}? I can also prepare your order.`,
  chipBenefits: 'What is it for?', askBenefits: (name) => `What is ${name} for?`,
  chipUse: 'How do I use it?', askUse: (name) => `How do I use ${name}?`,
  notice: 'For your privacy, please don’t share personal or medical information here. If in doubt, the product packaging prevails.',
  unavailable: 'I can’t reply right now. Our team can help you directly on WhatsApp.',
  delivery: 'We ship from Akwa (Douala) across Cameroon and to countries in the sub-region. Fees and delivery times depend on your city: the team confirms them when you send your order.',
  shop: 'You can come to our shop in Akwa (Douala) and order right there. The team gives you the exact address and opening hours on WhatsApp.',
  catalogue: 'Here are our essentials:',
  prices: 'Here are our prices, excluding delivery:',
  chipProducts: 'The products', chipPrices: 'Prices', chipDelivery: 'Delivery', chipShop: 'The shop', chipOrder: 'Order', chipOrderWa: 'Order on WhatsApp', chipHuman: 'Write to the team', chipHealth: 'A health question',
  askHealth: 'I have a health condition, can I use these products?',
  view: (name) => `View ${name}`,
  human: 'Talk to an advisor on WhatsApp',
  open: 'Ask Kimi', openLabel: 'Open the chat with Kimi, beauty advisor', close: 'Close the chat', role: 'Beauty advisor · Sculpt Move',
  placeholder: 'Type your question…', cityPlaceholder: 'Your city…', send: 'Send', log: 'Chat with Kimi',
  orderStart: 'Great! Choose your products and quantities:',
  orderContinue: 'Continue', orderEmpty: 'Add at least one product to continue.',
  askCity: 'Which city should we deliver to?',
  remindCity: 'And for your order: which city should we deliver to?',
  summary: 'Here is your order. Check it, then send it on WhatsApp:',
  city: 'City', total: 'Total', excl: 'excl. delivery', edit: 'Edit',
  sendOrder: 'Send my order on WhatsApp',
  note: 'WhatsApp opens with your message already written, which also includes this chat to help the team. You can review and edit it before pressing Send. This message is not a confirmation: the team confirms availability and delivery.',
  transcriptTitle: 'Chat with Kimi:', transcriptClient: 'Customer', transcriptCut: '[start of the chat not included]',
  sent: 'Thank you! 💜 Press Send in WhatsApp if you haven’t already. The team will reply to confirm availability and delivery.',
  less: (name) => `Remove one ${name}`, more: (name) => `Add one ${name}`,
}

export const kimiCopy = (lang: Lang) => (lang === 'en' ? EN : FR)

export function kimiWelcomeActions(lang: Lang, products: Product[], price: (value: number | null) => string): KimiAction[] {
  const c = kimiCopy(lang)
  return [
    { type: 'local', label: c.chipProducts, text: [c.catalogue, ...products.map((item) => `• ${item.name} : ${item.summary}`)].join('\n') },
    { type: 'local', label: c.chipPrices, text: [c.prices, ...products.map((item) => `• ${item.name} : ${price(item.price)}`)].join('\n') },
    { type: 'local', label: c.chipDelivery, text: c.delivery },
    { type: 'local', label: c.chipShop, text: c.shop },
    { type: 'ask', label: c.chipHealth, text: c.askHealth },
    { type: 'order', label: c.chipOrder },
  ]
}
