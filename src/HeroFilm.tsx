import { useEffect, useRef, useState } from 'react'
import { useI18n } from './i18n'
import { Title } from './motion'
import './film.css'

export function HeroFilm({ onDiscover, whatsappUrl }: { onDiscover: () => void; whatsappUrl: string }) {
  const { t, lang } = useI18n()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 760px)').matches)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [playing, setPlaying] = useState(false)
  const suffix = lang === 'en' ? '-en' : ''

  useEffect(() => {
    const size = window.matchMedia('(max-width: 760px)')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateSize = () => setMobile(size.matches)
    const updateMotion = () => setReducedMotion(motion.matches)
    size.addEventListener('change', updateSize)
    motion.addEventListener('change', updateMotion)
    return () => {
      size.removeEventListener('change', updateSize)
      motion.removeEventListener('change', updateMotion)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (reducedMotion) video.pause()
    else video.play().catch(() => setPlaying(false))
  }, [mobile, reducedMotion, lang])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play().catch(() => setPlaying(false))
    else video.pause()
  }

  return <section className="hero-film" aria-labelledby="hero-title">
    <div className="hero-film-stage">
      <video
        ref={videoRef}
        className="hero-film-video"
        src={mobile ? `/videos/sculpt-move-mobile${suffix}.mp4` : `/videos/sculpt-move-accueil${suffix}.mp4`}
        poster={mobile ? `/images/sculpt-move-film-mobile${suffix}.jpg` : `/images/sculpt-move-film-poster${suffix}.jpg`}
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label={t.hero.video}
      />
      <div className="film-controls">
        <span>{t.hero.film} <i /> {t.hero.silent}</span>
        <button type="button" onClick={toggle} aria-label={playing ? t.hero.pauseLabel : t.hero.playLabel}>
          {playing ? <svg width="13" height="14" viewBox="0 0 13 14" aria-hidden="true"><path d="M2 1h3v12H2zM8 1h3v12H8z" fill="currentColor"/></svg> : <svg width="13" height="14" viewBox="0 0 13 14" aria-hidden="true"><path d="M2 1l10 6-10 6z" fill="currentColor"/></svg>}
          {playing ? t.hero.pause : t.hero.play}
        </button>
      </div>
    </div>
    <div className="hero-film-bar">
      <div><span className="eyebrow eyebrow-gold" data-reveal="up">{t.hero.eyebrow}</span><Title as="h1" id="hero-title" lead={t.hero.title[0]} accent={t.hero.title[1]}/></div>
      <div className="hero-film-actions" data-reveal="up" style={{ '--d': '350ms' } as React.CSSProperties}><button className="button button-gold" onClick={onDiscover}>{t.hero.discover} <span aria-hidden="true">↗</span></button><a className="button button-glass" href={whatsappUrl} target="_blank" rel="noreferrer">{t.hero.talk} <span aria-hidden="true">↗</span></a></div>
    </div>
  </section>
}
