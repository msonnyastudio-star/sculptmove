import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useI18n } from './i18n'
import './cream-hero.css'

const scenes = [
  { image: '/images/pdrn-jar.jpg', detail: '/images/pdrn-ritual.jpg', kind: 'jar' },
  { image: '/images/pdrn-texture.jpg', detail: '/images/pdrn-jar.jpg', kind: 'texture' },
  { image: '/images/pdrn-open-jar.jpg', detail: '/images/pdrn-ingredients.jpg', kind: 'formula' },
] as const

const copy = {
  fr: {
    eyebrow: 'SCULPT MOVE · LA COLLECTION SKINCARE',
    intro: 'Un geste.',
    titles: ['Le rituel.', 'La texture.', 'L’éclat.'],
    description: 'Des perles de soin, une texture gel-crème. Découvrez PDRN Repair Cream et faites une place à la douceur dans votre routine.',
    discover: 'Découvrir la crème',
    collection: 'Tous les essentiels',
    chapter: 'Explorer la crème',
    chapters: ['Le soin', 'La texture', 'La formule'],
    captions: ['Le soin se fait précieux.', 'La douceur prend forme.', 'Votre rituel, réinventé.'],
    details: ['Le rituel en trois gestes', 'Les perles de soin', 'Les ingrédients à découvrir'],
    imageAlts: [
      'Pot Sculpt Move PDRN Repair Cream de 50 g, capsules lavande et blanches, couvercle doré',
      'Texture gel de la crème et capsules sur une spatule au-dessus du pot ouvert',
      'Crème PDRN Sculpt Move ouverte, gel et capsules, avec les ingrédients présentés autour du pot',
    ],
    detailAlts: [
      'Coffret rose, pot et spatule de la crème Sculpt Move',
      'Pot de crème PDRN Repair Cream fermé',
      'Présentation des ingrédients sur le visuel de la crème Sculpt Move',
    ],
    format: '50 g · Gel-crème en capsules',
    origin: 'COSMÉTIQUE CORÉENNE',
    pause: 'Pause',
    play: 'Animer',
    pauseLabel: 'Mettre le motion design en pause',
    playLabel: 'Lire le motion design',
    motion: 'L’ESSENTIEL, EN MOUVEMENT',
  },
  en: {
    eyebrow: 'SCULPT MOVE · THE SKINCARE COLLECTION',
    intro: 'One touch.',
    titles: ['The ritual.', 'The texture.', 'The glow.'],
    description: 'Skincare pearls. A gel-cream texture. Discover PDRN Repair Cream and make a little room for softness in your daily routine.',
    discover: 'Discover the cream',
    collection: 'All the essentials',
    chapter: 'Explore the cream',
    chapters: ['The cream', 'The texture', 'The formula'],
    captions: ['A little everyday luxury.', 'Softness takes shape.', 'Your ritual, reimagined.'],
    details: ['The ritual in three steps', 'The skincare pearls', 'Discover the ingredients'],
    imageAlts: [
      'Sculpt Move PDRN Repair Cream 50 g jar, lavender and white capsules, golden lid',
      'Gel cream texture and capsules on a spatula above the open jar',
      'Open Sculpt Move PDRN cream, gel and capsules, with ingredients displayed around the jar',
    ],
    detailAlts: [
      'Pink gift box, cream jar and spatula by Sculpt Move',
      'Closed PDRN Repair Cream jar',
      'Ingredients shown in the Sculpt Move cream visual',
    ],
    format: '50 g · Gel-cream capsules',
    origin: 'KOREAN SKINCARE',
    pause: 'Pause',
    play: 'Play',
    pauseLabel: 'Pause the motion design',
    playLabel: 'Play the motion design',
    motion: 'ESSENTIALS IN MOTION',
  },
}

function MotionText({ text }: { text: string }) {
  return <span className="cream-motion-text" aria-hidden="true">{Array.from(text).map((letter, index) => <span className="cream-letter-mask" key={index}><span style={{ '--letter': index } as CSSProperties}>{letter === ' ' ? '\u00a0' : letter}</span></span>)}</span>
}

function Arrow() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>
}

export function CreamHero({ onDiscover, onCollection }: { onDiscover: () => void; onCollection: () => void }) {
  const { lang } = useI18n()
  const text = copy[lang]
  const section = useRef<HTMLElement>(null)
  const [scene, setScene] = useState(0)
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [inView, setInView] = useState(true)
  const [pageVisible, setPageVisible] = useState(() => !document.hidden)
  const activeScene = scenes[scene]

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onPreference = () => {
      setReduced(preference.matches)
      setPaused(preference.matches)
    }
    const onVisibility = () => setPageVisible(!document.hidden)
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.08 })
    if (section.current) observer.observe(section.current)
    preference.addEventListener('change', onPreference)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer.disconnect()
      preference.removeEventListener('change', onPreference)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const togglePlayback = () => {
    setReduced(false)
    setPaused((current) => !current)
  }

  return <section className="cream-hero" ref={section} aria-labelledby="cream-title" data-scene={activeScene.kind} data-paused={paused || !inView || !pageVisible} data-reduced={reduced}>
    <div className="cream-hero-inner">
      <div className="cream-copy">
        <div className="cream-eyebrow"><span className="cream-live-dot" aria-hidden="true"/>{text.eyebrow}</div>
        <h2 id="cream-title" aria-label={`${text.intro} ${text.titles[scene]}`}>
          <MotionText text={text.intro}/>
          <em key={`${lang}-${scene}`}><MotionText text={text.titles[scene]}/></em>
        </h2>
        <p className="cream-description">{text.description}</p>
        <div className="cream-product-name"><span>PDRN</span><div>REPAIR CREAM<small>& EVEN TONE CREAM</small></div></div>
        <div className="cream-hero-actions">
          <button type="button" className="cream-primary" onClick={onDiscover}>{text.discover}<Arrow/></button>
          <button type="button" className="cream-collection" onClick={onCollection}>{text.collection}<span aria-hidden="true">↗</span></button>
        </div>
        <div className="cream-format">{text.format}<i/>{text.origin}</div>
      </div>

      <div className="cream-art" aria-label="PDRN Repair Cream">
        <div className="cream-backtype" aria-hidden="true">PDRN</div>
        <div className="cream-orbit cream-orbit-one" aria-hidden="true"><span/></div>
        <div className="cream-orbit cream-orbit-two" aria-hidden="true"/>
        <div className="cream-pearl cream-pearl-one" aria-hidden="true"/>
        <div className="cream-pearl cream-pearl-two" aria-hidden="true"/>
        <div className="cream-pearl cream-pearl-three" aria-hidden="true"/>
        <div className="cream-product-shadow" aria-hidden="true"/>
        {scenes.map((item, index) => <div className="cream-scene" data-kind={item.kind} data-active={scene === index} aria-hidden={scene !== index} key={item.kind}>
          <div className={`cream-main-image cream-main-${item.kind}`}><img src={item.image} alt={text.imageAlts[index]} width={index === 1 ? 853 : 1280} height={index === 1 ? 1280 : index === 0 ? 1230 : 1224} fetchPriority={index === 0 ? 'high' : 'low'} decoding="async"/></div>
          <figure className="cream-detail"><div className={`cream-detail-photo${index === 1 ? ' cream-detail-packshot' : ''}`}><img src={item.detail} alt={text.detailAlts[index]} width="1280" height={index === 0 ? 823 : index === 1 ? 1230 : 1224} decoding="async"/></div><figcaption><span>0{index + 1}</span>{text.details[index]}<span aria-hidden="true">↗</span></figcaption></figure>
        </div>)}
        <div className="cream-art-label"><span>SCULPT MOVE</span><span>SKINCARE / 01</span></div>
        <div className="cream-art-caption" key={`caption-${scene}-${lang}`}>{text.captions[scene]}</div>
      </div>
    </div>

    <div className="cream-director-bar">
      <span className="cream-motion-label">{text.motion}</span>
      <div className="cream-chapters" role="group" aria-label={text.chapter}>
        {scenes.map((item, index) => <button type="button" key={item.kind} className={scene === index ? 'is-active' : ''} aria-pressed={scene === index} onClick={() => setScene(index)}><span className="cream-chapter-number">0{index + 1}</span>{text.chapters[index]}<span className="cream-chapter-meter" aria-hidden="true">{scene === index && <i key={`${scene}-${lang}`} onAnimationEnd={() => setScene((current) => (current + 1) % scenes.length)}/>}</span></button>)}
      </div>
      <button type="button" className="cream-playback" onClick={togglePlayback} aria-label={paused ? text.playLabel : text.pauseLabel} aria-pressed={paused}>
        <svg width="12" height="13" viewBox="0 0 12 14" aria-hidden="true">{paused ? <path d="M2 1l9 6-9 6z" fill="currentColor"/> : <path d="M2 1h3v12H2zM8 1h3v12H8z" fill="currentColor"/>}</svg>{paused ? text.play : text.pause}
      </button>
    </div>
  </section>
}
