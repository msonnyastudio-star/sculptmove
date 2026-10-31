// Appels Gemini et Groq, classement des erreurs et basculement automatique.
// Les temps de refroidissement vivent en mémoire : ils évitent des appels inutiles sur une instance
// active, mais disparaissent à chaque démarrage à froid. Aucune donnée n'est conservée ailleurs.

export type Turn = { role: 'user' | 'assistant'; content: string }
export type Prompt = { system: string; turns: Turn[] }
export type Env = Record<string, string | undefined>
export type FailureKind = 'quota' | 'unavailable' | 'timeout' | 'auth' | 'model' | 'request' | 'empty'

const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash-lite'
const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-120b'
const CALL_TIMEOUT = 9000
const MAX_OUTPUT_TOKENS = 600
const MAX_COOLDOWN = 60 * 60 * 1000
const DEFAULT_COOLDOWN: Record<FailureKind, number> = {
  quota: 60 * 1000,
  unavailable: 30 * 1000,
  timeout: 20 * 1000,
  auth: 10 * 60 * 1000,
  model: 10 * 60 * 1000,
  request: 0,
  empty: 0,
}

export class ProviderFailure extends Error {
  constructor(readonly kind: FailureKind, readonly status?: number, readonly retryAfterMs?: number) {
    super(kind)
  }
}

export function parseRetryAfter(value: string | null, now = Date.now()) {
  if (!value) return undefined
  const seconds = Number(value)
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000)
  const date = Date.parse(value)
  return Number.isNaN(date) ? undefined : Math.max(0, date - now)
}

type ErrorBody = { error?: { status?: string; details?: { reason?: string; retryDelay?: string }[] } }

export function classifyHttpError(status: number, retryAfter: string | null, body: ErrorBody | null): ProviderFailure {
  const details = body?.error?.details ?? []
  const delay = details.find((item) => item.retryDelay)?.retryDelay
  const retryAfterMs = parseRetryAfter(retryAfter) ?? (delay ? parseFloat(delay) * 1000 : undefined)
  if (status === 429) return new ProviderFailure('quota', status, retryAfterMs)
  // Gemini répond 400 à une clé invalide : le motif précis est dans le détail de l'erreur.
  if (status === 401 || status === 403 || details.some((item) => item.reason === 'API_KEY_INVALID')) return new ProviderFailure('auth', status)
  if (status === 404) return new ProviderFailure('model', status)
  if (status >= 500) return new ProviderFailure('unavailable', status, retryAfterMs)
  return new ProviderFailure('request', status)
}

async function post(url: string, headers: Record<string, string>, body: unknown) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), CALL_TIMEOUT)
  let response: Response
  try {
    response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body), signal: controller.signal })
  } catch {
    throw new ProviderFailure('timeout')
  } finally {
    clearTimeout(timer)
  }
  const data = await response.json().catch(() => null) as unknown
  if (!response.ok) throw classifyHttpError(response.status, response.headers.get('retry-after'), data as ErrorBody | null)
  return data
}

type GeminiBody = { candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[] }

async function callGemini(prompt: Prompt, env: Env, apiKey: string) {
  const model = env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL
  const data = await post(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, { 'x-goog-api-key': apiKey }, {
    systemInstruction: { parts: [{ text: prompt.system }] },
    contents: prompt.turns.map((turn) => ({ role: turn.role === 'assistant' ? 'model' : 'user', parts: [{ text: turn.content }] })),
    generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS, temperature: 0.4 },
  }) as GeminiBody
  return (data.candidates?.[0]?.content?.parts ?? []).filter((part) => !part.thought).map((part) => part.text ?? '').join('').trim()
}

type GroqBody = { choices?: { message?: { content?: string | null } }[] }

async function callGroq(prompt: Prompt, env: Env, apiKey: string) {
  const data = await post('https://api.groq.com/openai/v1/chat/completions', { Authorization: `Bearer ${apiKey}` }, {
    model: env.GROQ_MODEL || DEFAULT_GROQ_MODEL,
    messages: [{ role: 'system', content: prompt.system }, ...prompt.turns],
    max_completion_tokens: MAX_OUTPUT_TOKENS,
    temperature: 0.4,
    reasoning_effort: 'low',
    include_reasoning: false,
  }) as GroqBody
  return (data.choices?.[0]?.message?.content ?? '').trim()
}

const PROVIDERS = [
  { name: 'gemini', keyName: 'GEMINI_API_KEY', call: callGemini },
  { name: 'groq', keyName: 'GROQ_API_KEY', call: callGroq },
] as const

export type ProviderName = (typeof PROVIDERS)[number]['name']

const cooldownUntil = new Map<ProviderName, number>()
const warnedMissing = new Set<string>()

export function resetProviderState() {
  cooldownUntil.clear()
  warnedMissing.clear()
}

const logFailure = (name: ProviderName, failure: ProviderFailure) => {
  const line = { event: 'assistant_provider_failure', provider: name, kind: failure.kind, status: failure.status }
  // Une clé ou un modèle invalides sont des erreurs de configuration à corriger, pas un manque de quota.
  if (failure.kind === 'auth' || failure.kind === 'model' || failure.kind === 'request') console.error(JSON.stringify(line))
  else console.warn(JSON.stringify(line))
}

// Interroge Gemini d'abord, puis Groq. Gemini reprend la main dès la fin de son refroidissement.
export async function generateWithFailover(prompt: Prompt, env: Env): Promise<{ text: string; provider: ProviderName } | null> {
  for (const provider of PROVIDERS) {
    const apiKey = env[provider.keyName]
    if (!apiKey) {
      if (!warnedMissing.has(provider.keyName)) {
        warnedMissing.add(provider.keyName)
        console.error(JSON.stringify({ event: 'assistant_config_missing', variable: provider.keyName }))
      }
      continue
    }
    if ((cooldownUntil.get(provider.name) ?? 0) > Date.now()) continue
    try {
      const text = await provider.call(prompt, env, apiKey)
      if (!text) throw new ProviderFailure('empty')
      cooldownUntil.delete(provider.name)
      return { text, provider: provider.name }
    } catch (error) {
      const failure = error instanceof ProviderFailure ? error : new ProviderFailure('unavailable')
      logFailure(provider.name, failure)
      const wait = Math.min(failure.retryAfterMs ?? DEFAULT_COOLDOWN[failure.kind], MAX_COOLDOWN)
      if (wait > 0) cooldownUntil.set(provider.name, Date.now() + wait)
    }
  }
  return null
}
