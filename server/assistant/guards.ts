// Contrôles avant tout appel d'IA : taille et forme des messages, abus, injections, sujets médicaux.
import type { Lang } from '../../src/config.js'
import { hasKeyword } from '../../src/productMatch.js'
import type { Turn } from './providers.js'

export const MAX_BODY_BYTES = 12_000
export const MAX_MESSAGE_CHARS = 500
const MAX_HISTORY_TURNS = 6

export type ChatInput = { message: string; history: Turn[]; lang: Lang; page?: string }

const clean = (value: string) => value.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, ' ').trim()

export function parseChatInput(body: unknown): ChatInput | null {
  if (typeof body !== 'object' || body === null) return null
  const { message, history, lang, page } = body as Record<string, unknown>
  if (typeof message !== 'string') return null
  const text = clean(message)
  if (!text || text.length > MAX_MESSAGE_CHARS) return null
  const turns = (Array.isArray(history) ? history : []).flatMap((item): Turn[] => {
    const turn = item as Partial<Turn> | null
    if (!turn || (turn.role !== 'user' && turn.role !== 'assistant') || typeof turn.content !== 'string') return []
    const content = clean(turn.content).slice(0, MAX_MESSAGE_CHARS)
    return content ? [{ role: turn.role, content }] : []
  })
  return { message: text, history: turns.slice(-MAX_HISTORY_TURNS), lang: lang === 'en' ? 'en' : 'fr', page: typeof page === 'string' ? page : undefined }
}

const MEDICAL = ['maladie', 'malade', 'enceinte', 'grossesse', 'allaite', 'allaitante', 'allaitement', 'diabete', 'diabetique', 'hypertension', 'cancer', 'medicament', 'medicaments', 'sous traitement', 'traitement medical', 'ordonnance', 'allergie', 'allergies', 'allergique', 'infection', 'infecte', 'brulure', 'brulures', 'eczema', 'psoriasis', 'mycose', 'plaie', 'plaies', 'saignement', 'lupus', 'medecin', 'docteur', 'effet secondaire', 'effets secondaires', 'sante', 'pregnant', 'pregnancy', 'breastfeeding', 'illness', 'disease', 'diabetes', 'medication', 'allergy', 'allergic', 'burn', 'burns', 'eczema', 'doctor', 'side effect', 'side effects', 'health condition']

export const isMedical = (text: string) => hasKeyword(text, MEDICAL)

const INJECTION = /(ignore|oublie|forget|disregard)\b.{0,40}\b(instructions?|consignes?|regles?|rules?|prompt)|(system|systeme)\s*prompt|prompt\s*(system|systeme)|(tes|vos|your)\s+(instructions|consignes)|jailbreak|developer mode|mode developpeur|(act|agis|fais)\s+(as|comme)\b.{0,20}\b(admin|developer|dan|developpeur)/

export const isInjection = (text: string) => INJECTION.test(text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase())

// Prépare l'historique pour l'IA : retire les échanges médicaux et remet les tours en alternance.
export function historyForProvider(history: Turn[]) {
  const kept: Turn[] = []
  for (let index = 0; index < history.length; index++) {
    const turn = history[index]
    if (turn.role === 'user' && isMedical(turn.content)) {
      if (history[index + 1]?.role === 'assistant') index++
      continue
    }
    if (kept.at(-1)?.role === turn.role) kept[kept.length - 1] = turn
    else kept.push(turn)
  }
  while (kept[0]?.role === 'assistant') kept.shift()
  while (kept.at(-1)?.role === 'user') kept.pop()
  return kept
}

// Limitation en mémoire, par instance : elle freine le spam courant, mais n'est pas une protection
// persistante, car chaque instance Vercel a son propre compteur, remis à zéro au redémarrage.
const WINDOWS = { perMinute: { ms: 60_000, ip: 8, all: 30 }, perHour: { ms: 3_600_000, ip: 40, all: 600 } }
const hits = new Map<string, number[]>()

export function resetRateLimit() {
  hits.clear()
}

export function allowRequest(ip: string, now = Date.now()) {
  const recent = (key: string) => (hits.get(key) ?? []).filter((time) => now - time < WINDOWS.perHour.ms)
  const count = (list: number[], ms: number) => list.filter((time) => now - time < ms).length
  const mine = recent(ip)
  const everyone = recent('*')
  const blocked = count(mine, WINDOWS.perMinute.ms) >= WINDOWS.perMinute.ip || mine.length >= WINDOWS.perHour.ip
    || count(everyone, WINDOWS.perMinute.ms) >= WINDOWS.perMinute.all || everyone.length >= WINDOWS.perHour.all
  if (blocked) return false
  hits.set(ip, [...mine, now])
  hits.set('*', [...everyone, now])
  if (hits.size > 5000) hits.clear()
  return true
}
