import { useEffect, useId, useMemo, useState, type CSSProperties } from 'react'
import { formatTotal, products, siteConfig, wa, type CartLine, type Product } from './config'
import { Assistant } from './Assistant'
import { KIMI_PHOTO, openKimi } from './kimi'
import { BeforeAfter } from './BeforeAfter'
import { CreamHero } from './CreamHero'
import { HeroFilm } from './HeroFilm'
import { Icon } from './Icon'
import { I18nContext, useI18n, useLanguage } from './i18n'
import { prefersReducedMotion, Title, trackPointer, useReveal, useScrollEffects } from './motion'
import { useTheme, type Theme } from './theme'

const CART_KEY = 'sculpt-move-cart-v1'
const CART_REMINDER_KEY = 'sculpt-move-cart-reminded'
const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties
const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

function readCart(): CartLine[] {
  try {
    const value = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]') as CartLine[]
    return Array.isArray(value) ? value.filter((line) => products.some((product) => product.slug === line.slug) && Number.isFinite(line.quantity) && line.quantity > 0) : []
  } catch {
    return []
  }
}

function usePath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  const navigate = (to: string) => {
    const [requestedPath, hash] = to.split('#')
    const destination = requestedPath || window.location.pathname
    window.history.pushState({}, '', `${destination}${window.location.search}${hash ? `#${hash}` : ''}`)
    setPath(destination)
    window.setTimeout(() => {
      if (hash) scrollToId(hash)
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 40)
  }
  return { path, navigate }
}

// Soleil en mode nuit, lune en mode jour : l'icône se transforme de l'une à l'autre.
function ThemeIcon() {
  const mask = `theme-mask-${useId().replace(/[^\w-]/g, '')}`
  return <svg className="theme-icon" width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
    <mask id={mask}><rect width="24" height="24" fill="#fff"/><circle className="theme-icon-cut" cx="20" cy="4" r="7" fill="#000"/></mask>
    <circle className="theme-icon-core" cx="12" cy="12" r="5" fill="currentColor" mask={`url(#${mask})`}/>
    <path className="theme-icon-rays" d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
  </svg>
}

function Prefs({ className, theme, onTheme }: { className: string; theme: Theme; onTheme: (origin: HTMLElement) => void }) {
  const { lang, setLang, t } = useI18n()
  const themeLabel = theme === 'dark' ? t.prefs.toLight : t.prefs.toDark
  return <div className={`prefs ${className}`}>
    <div className="lang-switch" role="group" aria-label={t.prefs.language} data-lang={lang}>
      <button type="button" lang="fr" aria-label="Français" aria-pressed={lang === 'fr'} onClick={() => setLang('fr')}>FR</button>
      <button type="button" lang="en" aria-label="English" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
    </div>
    <button type="button" className="theme-toggle" aria-label={themeLabel} title={themeLabel} onClick={(event) => onTheme(event.currentTarget)}><ThemeIcon/></button>
  </div>
}

function Brand({ onClick }: { onClick: () => void }) {
  const { t } = useI18n()
  return <button className="brand" onClick={onClick} aria-label={t.brandHome}><span className="brand-logo"><img src="/images/sculpt-move-logo.jpg" alt="" width="1280" height="960"/></span><span className="brand-name">SCULPT MOVE<small>WELLNESS PARTNER</small></span></button>
}

function Header({ onNavigate, cartCount, onCart, theme, onTheme }: { onNavigate: (to: string) => void; cartCount: number; onCart: () => void; theme: Theme; onTheme: (origin: HTMLElement) => void }) {
  const { t } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const links = [[t.nav.home, '/'], [t.nav.products, '/#produits'], [t.nav.duo, '/produit/beauty-duo'], [t.nav.tips, '/#conseils'], [t.nav.shop, '/#boutique'], [t.nav.contact, '/#contact']]
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])
  const go = (to: string) => {
    setMenuOpen(false)
    if (to.includes('#')) {
      const [path, id] = to.split('#')
      if (window.location.pathname !== path) onNavigate(path || '/')
      window.setTimeout(() => scrollToId(id), 40)
    } else onNavigate(to)
  }
  return <header className="site-header"><div className="header-inner">
    <Brand onClick={() => go('/')}/>
    <button className="menu-toggle icon-button" aria-label={menuOpen ? t.nav.close : t.nav.open} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><Icon name={menuOpen ? 'close' : 'menu'}/></button>
    <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label={t.nav.label}>
      {links.map(([label, to], index) => <a href={to} key={to} style={{ '--i': index } as CSSProperties} onClick={(event) => { event.preventDefault(); go(to) }}>{label}</a>)}
      <Prefs className="menu-prefs" theme={theme} onTheme={onTheme}/>
    </nav>
    <div className="header-actions">
      <Prefs className="header-prefs" theme={theme} onTheme={onTheme}/>
      <button className="cart-trigger" onClick={onCart} aria-label={t.header.cartLabel(cartCount)}><i className="cart-icon"><Icon name="bag"/>{cartCount > 0 && <b key={cartCount}>{cartCount > 99 ? '99+' : cartCount}</b>}</i><span>{t.header.selection}</span></button>
    </div>
  </div><span className="scroll-progress" aria-hidden="true"/></header>
}

function ProductCard({ product, index, onNavigate, onAdd }: { product: Product; index: number; onNavigate: (to: string) => void; onAdd: (slug: string, quantity?: number) => void }) {
  const { t, price } = useI18n()
  return <article className={`product-card product-${product.slug}`} data-reveal="up" style={delay(index * 110)} onPointerMove={trackPointer}>
    <a className="product-image" data-reveal="image" style={delay(index * 110 + 120)} href={`/produit/${product.slug}`} onClick={(event) => { event.preventDefault(); onNavigate(`/produit/${product.slug}`) }}><img src={product.image} alt={product.imageAlt} loading="lazy"/><span className="image-arrow"><Icon name="arrow"/></span></a>
    <div className="product-copy"><div className="eyebrow">{product.eyebrow}</div><h3>{product.name}</h3><p>{product.summary}</p><div className="product-bottom"><span className="price">{price(product.price)}</span><button className="text-link" onClick={() => onNavigate(`/produit/${product.slug}`)}>{t.card.view} <Icon name="arrow" size={16}/></button></div><button className="outline-button add-button" onClick={() => onAdd(product.slug)}><Icon name="bag" size={17}/> {t.card.add}</button></div>
  </article>
}

function CartDrawer({ cart, setCart, onClose }: { cart: CartLine[]; setCart: React.Dispatch<React.SetStateAction<CartLine[]>>; onClose: () => void }) {
  const { t, lang, price, products: localized } = useI18n()
  const [city, setCity] = useState('')
  const [closing, setClosing] = useState(false)
  const close = () => {
    if (prefersReducedMotion()) { onClose(); return }
    setClosing(true)
    window.setTimeout(onClose, 340)
  }
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  const lines = cart.map((line) => ({ ...line, product: localized.find((product) => product.slug === line.slug)! }))
  const total = lines.reduce((sum, { product, quantity }) => sum + (product.price ?? 0) * quantity, 0)
  const totalLabel = formatTotal(total, lines.some(({ product }) => product.price == null), lang)
  const message = t.wa.order(lines.map(({ product, quantity }) => ({ name: product.name, quantity, price: price(product.price == null ? null : product.price * quantity) })), totalLabel, city.trim())
  const update = (slug: string, change: number) => setCart((current) => current.map((line) => line.slug === slug ? { ...line, quantity: Math.max(1, line.quantity + change) } : line))
  return <div className={`drawer-backdrop ${closing ? 'is-closing' : ''}`} onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}><section className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
    <div className="drawer-head"><div><div className="eyebrow">{t.cart.eyebrow}</div><h2 id="cart-title">{t.cart.title}</h2></div><button className="icon-button" aria-label={t.cart.close} onClick={close}><Icon name="close"/></button></div>
    {lines.length === 0 ? <div className="empty-cart"><span className="empty-icon"><Icon name="bag" size={25}/></span><h3>{t.cart.emptyTitle}</h3><p>{t.cart.emptyText}</p><button className="button button-primary" onClick={close}>{t.cart.discover} <Icon name="arrow"/></button></div> : <>
      <div className="cart-lines">{lines.map(({ product, quantity }, index) => <article className="cart-line" key={product.slug} style={{ '--i': index } as CSSProperties}><img src={product.image} alt=""/><div className="cart-line-copy"><h3>{product.name}</h3><span>{price(product.price)}</span><div className="quantity"><button aria-label={t.cart.less(product.name)} onClick={() => update(product.slug, -1)}><Icon name="minus" size={15}/></button><span key={quantity}>{quantity}</span><button aria-label={t.cart.more(product.name)} onClick={() => update(product.slug, 1)}><Icon name="plus" size={15}/></button></div></div><button className="remove-item" aria-label={t.cart.remove(product.name)} onClick={() => setCart((current) => current.filter((line) => line.slug !== product.slug))}><Icon name="trash" size={18}/></button></article>)}</div>
      <div className="drawer-checkout"><div className="cart-total"><span>{t.cart.total} <small>{t.cart.excl}</small></span><b key={`${total}-${lang}`}>{totalLabel}</b></div><label htmlFor="city">{t.cart.city} <span>{t.cart.cityHint}</span></label><input id="city" value={city} onChange={(event) => setCity(event.target.value)} placeholder={t.cart.cityPlaceholder} autoComplete="address-level2"/><p>{t.cart.note}</p><a className="button button-primary checkout-button" href={wa(message)} target="_blank" rel="noreferrer"><Icon name="whatsapp"/> {t.cart.checkout} <Icon name="arrow" size={17}/></a><button type="button" className="cart-kimi" onClick={() => { close(); openKimi() }}>{t.cart.askKimi}</button></div>
    </>}
  </section></div>
}

function Marquee() {
  const { t } = useI18n()
  const group = (hidden: boolean) => <div className="marquee-group" aria-hidden={hidden || undefined}>{t.marquee.map((item) => <span key={item}>{item}<i className="marquee-separator" aria-hidden="true"/></span>)}</div>
  return <div className="marquee"><div className="marquee-track">{group(false)}{group(true)}</div></div>
}

function Delivery() {
  const { t, lang } = useI18n()
  return <section className="delivery-section" id="livraison"><div className="delivery-inner">
    <div className="delivery-copy">
      <div className="eyebrow eyebrow-gold" data-reveal="up">{t.delivery.eyebrow}</div>
      <Title lead={t.delivery.title[0]} accent={t.delivery.title[1]} br/>
      <p data-reveal="up" style={delay(200)}>{t.delivery.text}</p>
      <div className="delivery-contact" data-reveal="up" style={delay(300)}><Icon name="pin" size={17}/><span>{siteConfig.address[lang]}</span></div>
    </div>
    <div className="delivery-map">
      <div className="delivery-route" data-reveal="route"><span className="route-line" aria-hidden="true"/><ol>
        {t.delivery.steps.map(([title, text], index) => <li className="route-step" key={index} style={{ '--i': index } as CSSProperties}><span className="route-dot" aria-hidden="true"/><b>0{index + 1}</b><h3>{title}</h3><p>{text}</p></li>)}
      </ol></div>
      <div className="delivery-foot" data-reveal="up" style={delay(500)}><p>{t.delivery.note}</p><a className="button button-gold" href={wa(t.wa.delivery)} target="_blank" rel="noreferrer"><Icon name="whatsapp"/> {t.delivery.cta} <Icon name="arrow" size={17}/></a></div>
    </div>
  </div></section>
}

function KimiBand() {
  const { t } = useI18n()
  return <section className="kimi-band" id="kimi"><div className="kimi-band-inner" data-reveal="up">
    <img className="kimi-band-photo" src={KIMI_PHOTO} alt="" width="256" height="256" loading="lazy"/>
    <div>
      <div className="eyebrow">{t.kimiBand.eyebrow}</div>
      <Title lead={t.kimiBand.title[0]} accent={t.kimiBand.title[1]}/>
      <p>{t.kimiBand.text}</p>
      <div className="kimi-band-actions">
        <button type="button" className="button button-primary" onClick={() => openKimi()}>{t.kimiBand.cta} <Icon name="arrow" size={17}/></button>
        {t.kimiBand.questions.map((question) => <button type="button" className="kimi-band-question" key={question} onClick={() => openKimi({ ask: question })}>{question}</button>)}
      </div>
    </div>
  </div></section>
}

function Shop() {
  const { t, lang } = useI18n()
  return <section className="shop-section" id="boutique">
    <div className="shop-head">
      <div className="shop-copy">
        <div className="eyebrow" data-reveal="up">{t.shop.eyebrow}</div>
        <Title lead={t.shop.title[0]} accent={t.shop.title[1]}/>
        <p data-reveal="up" style={delay(200)}>{t.shop.text}</p>
      </div>
      <div className="shop-visit" data-reveal="up" style={delay(280)}>
        <span className="shop-address"><Icon name="pin" size={17}/> {siteConfig.address[lang]}</span>
        <a className="button button-primary" href={wa(t.wa.shop)} target="_blank" rel="noreferrer"><Icon name="whatsapp"/> {t.shop.cta} <Icon name="arrow" size={17}/></a>
        <small>{t.shop.note}</small>
      </div>
    </div>
    <div className="shop-photos">
      <div className="shop-photo" data-reveal="image"><img src="/images/boutique-facade.jpg" alt={t.shop.altFront} width="1280" height="853" loading="lazy"/></div>
      <div className="shop-photo" data-reveal="image" style={delay(140)}><img src="/images/boutique-accueil.jpg" alt={t.shop.altCounter} width="1280" height="853" loading="lazy"/></div>
    </div>
  </section>
}

function Home({ onNavigate, onAdd }: { onNavigate: (to: string) => void; onAdd: (slug: string, quantity?: number) => void }) {
  const { t, products: localized } = useI18n()
  return <main>
    <HeroFilm onDiscover={() => scrollToId('produits')} onTalk={() => openKimi()}/>
    <CreamHero onDiscover={() => onNavigate('/produit/pdrn-repair-cream')} onCollection={() => scrollToId('produits')}/>
    <Marquee/>
    <section className="intro-band"><div className="intro-inner" data-reveal="up"><span className="intro-logo"><img src="/images/sculpt-move-logo.jpg" alt="" width="1280" height="960" loading="lazy"/></span><p>{t.intro.text}</p><a href="#univers" onClick={(event) => { event.preventDefault(); scrollToId('univers') }}>{t.intro.link} <Icon name="arrow" size={16}/></a></div></section>
    <section className="products-section section-shell" id="produits"><div className="section-heading"><div><div className="eyebrow" data-reveal="up">{t.productsSection.eyebrow}</div><Title lead={t.productsSection.title[0]} accent={t.productsSection.title[1]}/></div><p data-reveal="up" style={delay(250)}>{t.productsSection.text}</p></div><div className="products-grid">{localized.map((product, index) => <ProductCard key={product.slug} index={index % 3} product={product} onNavigate={onNavigate} onAdd={onAdd}/>)}</div></section>
    <KimiBand/>
    <Delivery/>
    <Shop/>
    <section className="duo-section" id="duo"><div className="duo-inner"><div className="duo-photo" data-reveal="image"><img src="/images/sculpt-move-duo.jpg" alt={t.duo.alt} loading="lazy"/></div><div className="duo-content"><div className="eyebrow" data-reveal="up">{t.duo.eyebrow}</div><Title lead={t.duo.title[0]} accent={t.duo.title[1]} br/><p data-reveal="up" style={delay(200)}>{t.duo.text}</p><div className="duo-pair">{t.duo.items.map(([title, text], index) => <div className="duo-item" key={index} data-reveal="up" style={delay(280 + index * 120)}><span className="duo-number">0{index + 1}</span><div><b>{title}</b><small>{text}</small></div></div>)}</div><div data-reveal="up" style={delay(500)}><button className="button button-dark" onClick={() => onNavigate('/produit/beauty-duo')}>{t.duo.cta} <Icon name="arrow"/></button></div></div></div></section>
    <BeforeAfter/>
    <section className="brand-section" id="univers"><div className="brand-copy"><div className="eyebrow eyebrow-gold" data-reveal="up">{t.brand.eyebrow}</div><Title lead={t.brand.title[0]} accent={t.brand.title[1]} br/><p data-reveal="up" style={delay(200)}>{t.brand.text}</p><a href="#conseils" data-reveal="up" style={delay(300)} onClick={(event) => { event.preventDefault(); scrollToId('conseils') }}>{t.brand.link} <Icon name="arrow" size={17}/></a></div><div className="brand-image" data-reveal="image" data-parallax="30"><img src="/images/sculpt-move-duo.jpg" alt={t.brand.alt} loading="lazy"/><div className="brand-image-caption"><span>BEAUTY STARTS</span><em>from within</em></div></div><div className="brand-values" data-reveal="line">{t.brand.values.map(([title, text], index) => <div key={index} data-reveal="up" style={delay(index * 140)}><span>0{index + 1}</span><b>{title}</b><small>{text}</small></div>)}</div></section>
    <section className="guidance-section" id="conseils"><div className="guidance-image" data-reveal="image" data-parallax="22"><img src="/images/conseils-gummies.jpg" alt={t.guidance.alt} loading="lazy"/></div><div className="guidance-copy"><div className="eyebrow" data-reveal="up">{t.guidance.eyebrow}</div><Title lead={t.guidance.title}/><p data-reveal="up" style={delay(200)}>{t.guidance.p1}</p><p data-reveal="up" style={delay(280)}>{t.guidance.p2}</p><button type="button" className="text-link" data-reveal="up" style={delay(360)} onClick={() => openKimi()}>{t.guidance.link} <Icon name="arrow" size={17}/></button></div></section>
    <Faq onNavigate={onNavigate}/><Contact/>
  </main>
}

function Faq({ onNavigate }: { onNavigate: (to: string) => void }) {
  const { t, products: localized, price } = useI18n()
  const items = t.faq.items(localized.map((product) => `${product.name} : ${price(product.price)}`).join(' · '))
  return <section className="faq-section" id="faq"><div className="faq-heading"><div className="eyebrow" data-reveal="up">{t.faq.eyebrow}</div><Title lead={t.faq.title[0]} accent={t.faq.title[1]}/><p data-reveal="up" style={delay(200)}>{t.faq.text}</p><button className="text-link" data-reveal="up" style={delay(280)} onClick={() => onNavigate('/#contact')}>{t.faq.contact} <Icon name="arrow" size={16}/></button></div><div className="faq-list">{items.map(([question, answer], index) => <details key={index} data-reveal="up" style={delay(index * 90)}><summary>{question}<span className="faq-plus"><Icon name="plus" size={17}/></span></summary><p>{answer}</p></details>)}</div></section>
}

function Contact() {
  const { t, lang } = useI18n()
  return <section className="contact-section" id="contact"><div className="contact-inner"><div><div className="eyebrow eyebrow-gold" data-reveal="up">{t.contact.eyebrow}</div><Title lead={t.contact.title[0]} accent={t.contact.title[1]}/><p data-reveal="up" style={delay(200)}>{t.contact.text}</p><div className="contact-details" data-reveal="up" style={delay(280)}><a href={`mailto:${siteConfig.email}`}><Icon name="mail" size={16}/> {siteConfig.email}</a><span><Icon name="pin" size={16}/> {siteConfig.address[lang]}</span></div></div><div className="contact-actions" data-reveal="up" style={delay(320)}><button type="button" className="button button-gold" onClick={() => openKimi()}><img className="kimi-face" src={KIMI_PHOTO} alt=""/> {t.contact.cta} <Icon name="arrow"/></button><a className="contact-whatsapp" href={wa(t.wa.contact)} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={15}/> {t.contact.whatsapp}</a></div></div></section>
}

function ProductPage({ product, onNavigate, onAdd }: { product: Product; onNavigate: (to: string) => void; onAdd: (slug: string, quantity?: number) => void }) {
  const { t, price, products: localized } = useI18n()
  const [quantity, setQuantity] = useState(1)
  const [zoomOpen, setZoomOpen] = useState(false)
  useEffect(() => {
    if (!zoomOpen) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setZoomOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoomOpen])
  return <main className={`detail-page detail-${product.slug}`}>
    <div className="breadcrumbs"><button onClick={() => onNavigate('/')}>{t.product.home}</button><span>/</span><button onClick={() => onNavigate('/#produits')}>{t.product.essentials}</button><span>/</span><span>{product.name}</span></div>
    <section className="detail-layout">
      <div className="detail-gallery"><button className="detail-image" data-reveal="image" onClick={() => setZoomOpen(true)} aria-label={t.product.zoom(product.name)}><img src={product.image} alt={product.imageAlt}/><span>{t.product.enlarge} <Icon name="plus" size={15}/></span></button>{product.detailImage && <div className="detail-secondary-wrap" data-reveal="image" style={delay(200)}><img className="detail-secondary" src={product.detailImage} alt={product.detailImageAlt ?? ''} loading="lazy"/></div>}</div>
      <div className="detail-copy">
        <div className="eyebrow" data-reveal="up">{product.eyebrow}</div>
        <Title as="h1" lead={product.name}/>
        <p className="detail-lead" data-reveal="up" style={delay(180)}>{product.description}</p>
        <div className="detail-price" data-reveal="up" style={delay(240)}>{price(product.price)}</div>
        <div className="detail-format" data-reveal="up" style={delay(300)}><span>{t.product.format}</span><b>{product.format}</b>{product.confirmationNote && <small>{product.confirmationNote}</small>}</div>
        <div className="detail-points" data-reveal="up" style={delay(360)}>{product.highlights.map((point) => <div key={point}><span className="check-mark">✓</span>{point}</div>)}</div>
        <div className="detail-quantity" data-reveal="up" style={delay(420)}><span>{t.product.quantity}</span><div className="quantity"><button aria-label={t.product.less} onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Icon name="minus" size={15}/></button><span key={quantity}>{quantity}</span><button aria-label={t.product.more} onClick={() => setQuantity((value) => value + 1)}><Icon name="plus" size={15}/></button></div></div>
        <div className="detail-actions" data-reveal="up" style={delay(480)}><button className="button button-primary" onClick={() => onAdd(product.slug, quantity)}><Icon name="bag"/> {t.card.add}</button><button type="button" className="button button-soft" onClick={() => openKimi({ slug: product.slug, quantity })}><img className="kimi-face" src={KIMI_PHOTO} alt=""/> {t.product.order}</button></div>
        <div className="usage-card" data-reveal="up" style={delay(540)}><div><b>{t.product.usage}</b><p>{product.usage}</p></div></div>
        {product.category !== 'equipment' && <p className="supplement-note">{product.category === 'skincare' ? t.product.skincareNote : t.product.supplementNote}</p>}
      </div>
    </section>
    {product.story && <section className="detail-story"><div className="eyebrow" data-reveal="up">{t.product.benefits}</div><div className="detail-story-grid">{product.story.map((section) => <div className="detail-story-block" key={section.title} data-reveal="up"><h2>{section.title}</h2>{section.paragraphs?.map((text) => <p key={text}>{text}</p>)}{section.points && <ul>{section.points.map((point) => typeof point === 'string' ? <li key={point}>{point}</li> : <li key={point.label}><b>{point.label}</b> : {point.text}</li>)}</ul>}</div>)}</div><p className="detail-story-note">{t.product.benefitsNote}</p></section>}
    {product.slug === 'beauty-duo' && <BeforeAfter/>}
    <section className="detail-more"><div><div className="eyebrow" data-reveal="up">{t.product.moreEyebrow}</div><Title lead={t.product.moreTitle[0]} accent={t.product.moreTitle[1]}/></div><div className="detail-more-products">{localized.filter((item) => item.slug !== product.slug).slice(0, 4).map((item, index) => <button key={item.slug} data-reveal="up" style={delay(index * 100)} onClick={() => onNavigate(`/produit/${item.slug}`)}><img src={item.image} alt=""/><span>{item.name}<small>{price(item.price)}</small></span><Icon name="arrow" size={18}/></button>)}</div></section>
    {zoomOpen && <div className="lightbox" role="dialog" aria-modal="true" aria-label={t.product.lightbox(product.name)} onClick={() => setZoomOpen(false)}><button className="icon-button" aria-label={t.product.closeImage} onClick={() => setZoomOpen(false)}><Icon name="close"/></button><img src={product.image} alt={product.imageAlt}/></div>}
  </main>
}

function LegalPage({ onNavigate }: { onNavigate: (to: string) => void }) {
  const { t, lang } = useI18n()
  const { labels } = t.legal
  const { company, form, rccm, niu, director, host } = siteConfig.legal
  const publisher = [[labels.brand, siteConfig.brand], [labels.company, company], [labels.form, form], [labels.rccm, rccm], [labels.niu, niu], [labels.director, director], [labels.address, siteConfig.address[lang]], [labels.email, siteConfig.email], [labels.whatsapp, siteConfig.whatsappDisplay], [labels.site, siteConfig.domain]].filter(([, value]) => value)
  return <main className="legal-page">
    <div className="breadcrumbs"><button onClick={() => onNavigate('/')}>{t.product.home}</button><span>/</span><span>{t.legal.title}</span></div>
    <div className="legal-body">
      <div className="eyebrow">{t.legal.eyebrow}</div>
      <h1>{t.legal.title}</h1>
      <p className="legal-updated">{t.legal.updated}</p>
      <section><h2>{t.legal.publisher}</h2><dl>{publisher.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
      {host && <section><h2>{t.legal.host}</h2><p>{host}</p></section>}
      {t.legal.sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.text.map((text) => <p key={text}>{text}</p>)}</section>)}
    </div>
  </main>
}

function Footer({ onNavigate }: { onNavigate: (to: string) => void }) {
  const { t, lang } = useI18n()
  return <footer className="site-footer"><div className="footer-main">
    <div className="footer-brand"><Brand onClick={() => onNavigate('/')}/><p>{t.footer.tagline}</p><a href={wa(t.wa.footer)} target="_blank" rel="noreferrer"><Icon name="whatsapp"/> {siteConfig.whatsappDisplay}</a></div>
    <div className="footer-nav"><b>{t.footer.explore}</b><button onClick={() => onNavigate('/')}>{t.nav.home}</button><button onClick={() => onNavigate('/#produits')}>{t.nav.products}</button><button onClick={() => onNavigate('/produit/beauty-duo')}>{t.nav.duo}</button><button onClick={() => onNavigate('/#livraison')}>{t.nav.delivery}</button><button onClick={() => onNavigate('/#boutique')}>{t.nav.shop}</button><button onClick={() => onNavigate('/#conseils')}>{t.nav.tips}</button></div>
    <div className="footer-legal"><b>{t.footer.info}</b><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><span>{siteConfig.address[lang]}</span><span>{t.footer.shipping}</span><a href="/mentions-legales" onClick={(event) => { event.preventDefault(); onNavigate('/mentions-legales') }}>{t.footer.legal}</a></div>
  </div><div className="footer-bottom"><span>© {new Date().getFullYear()} SCULPT MOVE · WELLNESS PARTNER</span><span>{t.product.supplementNote}</span></div></footer>
}

function Site() {
  const i18n = useI18n()
  const { t } = i18n
  const { path, navigate } = usePath()
  const { theme, toggle } = useTheme()
  const [cart, setCart] = useState<CartLine[]>(readCart)
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState({ id: 0, text: '', reminder: false })
  useReveal(path)
  useScrollEffects(path)
  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cart)) }, [cart])
  const productMatch = path.match(/^\/produit\/([^/]+)/)
  const product = productMatch ? i18n.products.find((item) => item.slug === productMatch[1]) : undefined
  const isLegal = path === '/mentions-legales'
  useEffect(() => { document.title = product ? `${product.name} | SCULPT MOVE` : isLegal ? `${t.legal.title} | SCULPT MOVE` : t.htmlTitle }, [product, isLegal, t])
  useEffect(() => {
    if (!toast.text) return
    const timer = window.setTimeout(() => setToast((current) => ({ ...current, text: '' })), toast.reminder ? 7000 : 2400)
    return () => window.clearTimeout(timer)
  }, [toast])
  const count = useMemo(() => cart.reduce((sum, line) => sum + line.quantity, 0), [cart])
  // Au retour sur le site, signale une fois par session qu'une sélection attend déjà.
  useEffect(() => {
    if (count === 0) return
    try {
      if (sessionStorage.getItem(CART_REMINDER_KEY)) return
      sessionStorage.setItem(CART_REMINDER_KEY, '1')
    } catch {}
    setToast((current) => ({ id: current.id + 1, text: t.cartReminder.text(count), reminder: true }))
  }, [])
  const add = (slug: string, quantity = 1) => {
    setCart((current) => current.some((line) => line.slug === slug) ? current.map((line) => line.slug === slug ? { ...line, quantity: line.quantity + quantity } : line) : [...current, { slug, quantity }])
    setToast((current) => ({ id: current.id + 1, text: t.toast, reminder: false }))
  }
  return <div className="app-shell"><a className="skip-link" href="#contenu">{t.skip}</a>
    <Header onNavigate={navigate} cartCount={count} onCart={() => setCartOpen(true)} theme={theme} onTheme={toggle}/>
    <div id="contenu">{isLegal ? <LegalPage onNavigate={navigate}/> : product ? <ProductPage key={product.slug} product={product} onNavigate={navigate} onAdd={add}/> : path.startsWith('/produit/') ? <main className="not-found"><div className="eyebrow">SCULPT MOVE</div><h1>{t.product.notFound}</h1><button className="button button-primary" onClick={() => navigate('/')}>{t.product.backHome} <Icon name="arrow"/></button></main> : <Home onNavigate={navigate} onAdd={add}/>}</div>
    <Footer onNavigate={navigate}/>
    {cartOpen && <CartDrawer cart={cart} setCart={setCart} onClose={() => setCartOpen(false)}/>}
    <Assistant cart={cart} setCart={setCart} onNavigate={navigate} productSlug={product?.slug}/>
    {toast.text && <div className="toast" role="status" key={toast.id}><Icon name="bag" size={16}/> {toast.text}{toast.reminder && <button type="button" onClick={() => { setCartOpen(true); setToast((current) => ({ ...current, text: '' })) }}>{t.cartReminder.view}</button>}</div>}
  </div>
}

export default function App() {
  const i18n = useLanguage()
  return <I18nContext.Provider value={i18n}><Site/></I18nContext.Provider>
}
