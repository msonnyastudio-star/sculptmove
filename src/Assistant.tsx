import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { CartLine } from './config'
import { formatTotal, wa } from './config'
import { Icon } from './Icon'
import { useI18n } from './i18n'
import { acceptsOrder, cityFrom, KIMI_PHOTO, kimiCopy, kimiWelcomeActions, looksLikeQuestion, orderIntent, orderWithTranscript, type KimiAction, type KimiRequest } from './kimi'
import { prefersReducedMotion } from './motion'
import './assistant.css'

type Card = 'picker' | 'summary'
// flow : étape du parcours de commande ou accueil, sans intérêt dans la discussion transmise à l'équipe.
type Message = { id: number; from: 'kimi' | 'user'; text: string; actions?: KimiAction[]; card?: Card; flow?: boolean }
type Saved = { messages: Message[]; city: string; waitingCity: boolean }

const SESSION_KEY = 'sculpt-move-kimi-v1'
const TEASER_KEY = 'sculpt-move-kimi-teaser-v1'
const TEASER_DELAY = 5000
const TEASER_DURATION = 14000
const REQUEST_TIMEOUT = 25000
const HISTORY_SENT = 6

// Invitations déjà montrées dans la session, par page. « off » : la cliente l'a fermée ou a ouvert la discussion.
function readTeasers(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(TEASER_KEY) ?? '[]') as string[]
  } catch {
    return []
  }
}

function markTeaser(value: string) {
  try { sessionStorage.setItem(TEASER_KEY, JSON.stringify([...readTeasers(), value])) } catch { /* stockage indisponible */ }
}

// Temps de réponse naturel : quelques secondes, selon la longueur du message.
const replyDelay = (text: string) => prefersReducedMotion() ? 0 : Math.min(4500, Math.max(1500, 1000 + text.length * 18))
const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

function readSession(): Saved | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null') as Saved | null
    return value && Array.isArray(value.messages) ? value : null
  } catch {
    return null
  }
}

async function askServer(body: unknown) {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
  try {
    const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: controller.signal })
    return await response.json() as { kind: string; text: string; products?: string[] }
  } finally {
    window.clearTimeout(timer)
  }
}

export function Assistant({ cart, setCart, onNavigate, productSlug }: { cart: CartLine[]; setCart: React.Dispatch<React.SetStateAction<CartLine[]>>; onNavigate: (to: string) => void; productSlug?: string }) {
  const { t, lang, price, products } = useI18n()
  const c = kimiCopy(lang)
  const [saved] = useState(readSession)
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState<KimiRequest | null>(null)
  const [teaser, setTeaser] = useState(false)
  const [messages, setMessages] = useState<Message[]>(saved?.messages ?? [])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const [waitingCity, setWaitingCity] = useState(saved?.waitingCity ?? false)
  const [city, setCity] = useState(saved?.city ?? '')
  const [lastSlugs, setLastSlugs] = useState<string[]>([])
  const nextId = useRef((saved?.messages ?? []).reduce((max, message) => Math.max(max, message.id), 0) + 1)
  const timers = useRef<number[]>([])
  const log = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const launcher = useRef<HTMLButtonElement>(null)
  const activeCard = [...messages].reverse().find((message) => message.card)?.id
  const pointerFine = () => window.matchMedia('(pointer: fine)').matches
  const nameOf = (slug: string) => products.find((item) => item.slug === slug)?.name

  const push = (message: Omit<Message, 'id'>) => setMessages((current) => [...current, { ...message, id: nextId.current++ }])
  const say = (message: Omit<Message, 'id' | 'from'>) => {
    const delay = replyDelay(message.text)
    if (!delay) { push({ ...message, from: 'kimi' }); return }
    setTyping(true)
    timers.current.push(window.setTimeout(() => { setTyping(false); push({ ...message, from: 'kimi' }) }, delay))
  }
  useEffect(() => () => timers.current.forEach(window.clearTimeout), [])

  useEffect(() => {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ messages: messages.slice(-40), city, waitingCity })) } catch { /* stockage indisponible */ }
  }, [messages, city, waitingCity])

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight })
  }, [messages, typing, open])

  const openChat = (request: KimiRequest = {}) => {
    setTeaser(false)
    markTeaser('off')
    setPending(request)
    setOpen(true)
  }

  useEffect(() => {
    const onOpen = (event: Event) => openChat((event as CustomEvent<KimiRequest>).detail)
    window.addEventListener('kimi:open', onOpen)
    return () => window.removeEventListener('kimi:open', onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    if (messages.length === 0 && !pending?.slug) push({ from: 'kimi', text: c.intro, actions: kimiWelcomeActions(lang, products, price), flow: true })
    if (pointerFine()) input.current?.focus()
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') closeChat() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (!open || !pending) return
    setPending(null)
    const { slug, quantity, ask } = pending
    const name = slug && nameOf(slug)
    if (ask) submit(ask)
    else if (slug && name) {
      setLastSlugs([slug])
      push({ from: 'kimi', text: messages.length ? c.productAsk(name) : c.productIntro(name), flow: true, actions: [
        { type: 'ask', label: c.chipBenefits, text: c.askBenefits(name) },
        { type: 'ask', label: c.chipUse, text: c.askUse(name) },
        { type: 'order', label: c.chipOrderWa, items: [{ slug, quantity: quantity ?? cart.find((line) => line.slug === slug)?.quantity ?? 1 }] },
      ] })
    }
  }, [open, pending])

  // Une seule invitation par page et par session, jamais après le début d'une discussion.
  const teaserPage = productSlug ?? 'home'
  useEffect(() => {
    if (open || messages.length > 0) return
    const seen = readTeasers()
    if (seen.includes('off') || seen.includes(teaserPage)) return
    let hide = 0
    const show = window.setTimeout(() => {
      markTeaser(teaserPage)
      setTeaser(true)
      hide = window.setTimeout(() => setTeaser(false), TEASER_DURATION)
    }, TEASER_DELAY)
    return () => {
      window.clearTimeout(show)
      window.clearTimeout(hide)
      setTeaser(false)
    }
  }, [teaserPage, open])

  const closeChat = () => {
    setOpen(false)
    window.setTimeout(() => launcher.current?.focus(), 0)
  }

  const setQuantity = (slug: string, quantity: number) => setCart((current) => {
    if (quantity <= 0) return current.filter((line) => line.slug !== slug)
    return current.some((line) => line.slug === slug) ? current.map((line) => line.slug === slug ? { ...line, quantity } : line) : [...current, { slug, quantity }]
  })

  const startOrder = (items: CartLine[] = []) => {
    setWaitingCity(false)
    // Les quantités demandées dans le message remplacent celles de la sélection pour ces produits.
    if (items.length) setCart((current) => [...current.filter((line) => !items.some((item) => item.slug === line.slug)), ...items])
    say({ text: c.orderStart, card: 'picker', flow: true })
  }

  const askKimi = async (text: string) => {
    const history = messages.filter((message) => message.text).slice(-HISTORY_SENT).map((message) => ({ role: message.from === 'user' ? 'user' : 'assistant', content: message.text }))
    setTyping(true)
    const startedAt = Date.now()
    let reply: { kind: string; text: string; products?: string[] }
    try {
      reply = await askServer({ message: text, history, lang, page: productSlug })
    } catch {
      reply = { kind: 'fallback', text: c.unavailable }
    }
    await wait(replyDelay(reply.text) - (Date.now() - startedAt))
    setTyping(false)
    const slugs = (reply.products ?? []).filter(nameOf)
    if (slugs.length) setLastSlugs(slugs)
    const actions: KimiAction[] = [
      ...slugs.map((slug): KimiAction => ({ type: 'page', label: c.view(nameOf(slug)!), to: `/produit/${slug}` })),
      // Un seul produit cité : il est présélectionné. Plusieurs : la cliente choisit dans la liste.
      // Toujours une porte vers la commande, sauf après une question de santé ou un refus.
      ...(reply.kind === 'answer' || reply.kind === 'fallback' ? [{ type: 'order', label: slugs.length ? c.chipOrderWa : c.chipOrder, items: slugs.length === 1 ? [{ slug: slugs[0], quantity: cart.find((line) => line.slug === slugs[0])?.quantity ?? 1 }] : [] } satisfies KimiAction] : []),
      ...(reply.kind === 'fallback' ? [{ type: 'human', label: c.chipHuman, slugs } satisfies KimiAction] : []),
    ]
    push({ from: 'kimi', text: waitingCity ? `${reply.text}\n\n${c.remindCity}` : reply.text, actions })
  }

  const submit = (raw: string) => {
    const text = raw.trim()
    if (!text || typing) return
    const isCity = waitingCity && !looksLikeQuestion(text)
    push({ from: 'user', text, flow: isCity })
    setDraft('')
    if (isCity) {
      setCity(cityFrom(text) || Array.from(text).slice(0, 60).join(''))
      setWaitingCity(false)
      say({ text: c.summary, card: 'summary', flow: true })
      return
    }
    const last = messages[messages.length - 1]
    const offered = last?.from === 'kimi' ? last.actions?.find((action) => action.type === 'order') : undefined
    const items = offered && acceptsOrder(text, last.text) ? offered.items ?? [] : orderIntent(text)
    if (items) startOrder(items)
    else void askKimi(text)
  }

  const runAction = (action: KimiAction) => {
    if (typing) return
    if (action.type === 'ask') submit(action.text)
    else if (action.type === 'local') { push({ from: 'user', text: action.label }); say({ text: action.text, actions: [{ type: 'order', label: c.chipOrder }] }) }
    else if (action.type === 'order') { push({ from: 'user', text: action.label, flow: true }); startOrder(action.items) }
    else if (action.type === 'page') {
      if (window.matchMedia('(max-width: 760px)').matches) closeChat()
      onNavigate(action.to)
    }
  }

  const continueOrder = () => {
    if (cart.length === 0 || typing) return
    setWaitingCity(true)
    say({ text: c.askCity, flow: true })
    if (pointerFine()) input.current?.focus()
  }

  const humanLink = (slugs: string[] = lastSlugs) => {
    const names = slugs.flatMap((slug) => nameOf(slug) ?? [])
    return wa(names.length ? t.wa.product(names.join(', ')) : t.wa.contact)
  }

  const lines = cart.flatMap((line) => {
    const product = products.find((item) => item.slug === line.slug)
    return product ? [{ ...line, product }] : []
  })
  const total = lines.reduce((sum, { product, quantity }) => sum + (product.price ?? 0) * quantity, 0)
  const totalLabel = formatTotal(total, lines.some(({ product }) => product.price == null), lang)
  const orderMessage = t.wa.order(lines.map(({ product, quantity }) => ({ name: product.name, quantity, price: price(product.price == null ? null : product.price * quantity) })), totalLabel, city)
  const orderLink = wa(orderWithTranscript(orderMessage, messages, lang))
  const onSubmit = (event: FormEvent) => { event.preventDefault(); submit(draft) }

  const picker = <div className="kimi-card">
    {products.map((product) => {
      const quantity = cart.find((line) => line.slug === product.slug)?.quantity ?? 0
      return <div className="kimi-pick" key={product.slug}>
        <img src={product.image} alt=""/>
        <span>{product.name}<small>{price(product.price)}</small></span>
        <div className="kimi-qty">
          <button type="button" aria-label={c.less(product.name)} disabled={quantity === 0} onClick={() => setQuantity(product.slug, quantity - 1)}><Icon name="minus" size={14}/></button>
          <span>{quantity}</span>
          <button type="button" aria-label={c.more(product.name)} onClick={() => setQuantity(product.slug, quantity + 1)}><Icon name="plus" size={14}/></button>
        </div>
      </div>
    })}
    <div className="kimi-total"><span>{c.total} <small>{c.excl}</small></span><b>{totalLabel}</b></div>
    <button type="button" className="button button-primary kimi-continue" disabled={cart.length === 0} onClick={continueOrder}>{c.orderContinue} <Icon name="arrow" size={17}/></button>
    {cart.length === 0 && <p className="kimi-note">{c.orderEmpty}</p>}
  </div>

  const summary = <div className="kimi-card">
    {lines.map(({ product, quantity }) => <div className="kimi-line" key={product.slug}><span>{quantity} × {product.name}</span><b>{price(product.price == null ? null : product.price * quantity)}</b></div>)}
    <div className="kimi-line"><span>{c.city}</span><b>{city}</b></div>
    <div className="kimi-total"><span>{c.total} <small>{c.excl}</small></span><b>{totalLabel}</b></div>
    <a className="button button-primary kimi-send" href={orderLink} target="_blank" rel="noreferrer" onClick={() => say({ text: c.sent, flow: true })}><Icon name="whatsapp" size={18}/> {c.sendOrder}</a>
    <button type="button" className="kimi-edit" onClick={() => startOrder()}>{c.edit}</button>
    <p className="kimi-note">{c.note}</p>
  </div>

  const productName = productSlug && nameOf(productSlug)
  const launcherRequest = productSlug && messages.length === 0 ? { slug: productSlug } : {}

  if (!open) return <>
    {teaser && <div className="kimi-teaser" role="status">
      <button type="button" className="kimi-teaser-open" onClick={() => openChat(launcherRequest)}>{productName ? c.teaserProduct(productName) : c.teaser}</button>
      <button type="button" className="kimi-teaser-close" aria-label={c.teaserClose} onClick={() => { setTeaser(false); markTeaser('off') }}><Icon name="close" size={15}/></button>
    </div>}
    <button ref={launcher} type="button" className="kimi-launcher" aria-label={c.openLabel} onClick={() => openChat(launcherRequest)}><img src={KIMI_PHOTO} alt="" width="256" height="256"/><span>{c.open}</span></button>
  </>

  return <section className="kimi-panel" role="dialog" aria-label={c.log}>
    <header className="kimi-head">
      <img src={KIMI_PHOTO} alt="" width="256" height="256"/>
      <div><b>Kimi</b><small>{c.role}</small></div>
      <button type="button" className="icon-button" aria-label={c.close} onClick={closeChat}><Icon name="close"/></button>
    </header>
    <div className="kimi-log" ref={log} role="log" aria-live="polite" aria-label={c.log}>
      <p className="kimi-notice">{c.notice}</p>
      {messages.map((message) => <div className={`kimi-row is-${message.from}`} key={message.id}>
        <p className="kimi-bubble">{message.text}</p>
        {message.card === 'picker' && message.id === activeCard && picker}
        {message.card === 'summary' && message.id === activeCard && summary}
        {message.actions && message.id === messages[messages.length - 1].id && <div className="kimi-actions">
          {message.actions.map((action) => action.type === 'human'
            ? <a key={action.label} className="kimi-chip" href={humanLink(action.slugs)} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={14}/> {action.label}</a>
            : <button key={action.label} type="button" className={`kimi-chip ${action.type === 'order' ? 'is-order' : ''}`} onClick={() => runAction(action)}>{action.label}</button>)}
        </div>}
      </div>)}
      {typing && <div className="kimi-row is-kimi"><p className="kimi-bubble kimi-typing" aria-hidden="true"><i/><i/><i/></p></div>}
    </div>
    <form className="kimi-form" onSubmit={onSubmit}>
      <input ref={input} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={waitingCity ? c.cityPlaceholder : c.placeholder} aria-label={waitingCity ? c.cityPlaceholder : c.placeholder} maxLength={500} autoComplete="off"/>
      <button type="submit" aria-label={c.send} disabled={!draft.trim() || typing}><Icon name="arrow" size={18}/></button>
    </form>
    <a className="kimi-human" href={humanLink()} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={13}/> {c.human}</a>
  </section>
}
