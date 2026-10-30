import { Fragment, useEffect, type CSSProperties } from 'react'

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Enchaîne un changement d'interface dans une View Transition quand le navigateur la propose.
// `kind` choisit l'animation dans motion.css (thème : cercle depuis le bouton, langue : fondu).
export function withViewTransition(kind: 'theme' | 'lang', update: () => void) {
  const root = document.documentElement
  if (!document.startViewTransition || prefersReducedMotion()) { update(); return }
  root.dataset.vt = kind
  const transition = document.startViewTransition(update)
  transition.finished.finally(() => { delete root.dataset.vt })
}

function Words({ text, from }: { text: string; from: number }) {
  return <>{text.split(' ').map((word, i) => <Fragment key={i}>{i > 0 && ' '}<span className="w"><span style={{ '--i': from + i } as CSSProperties}>{word}</span></span></Fragment>)}</>
}

// Titre dont chaque mot monte hors de son propre masque, la partie en italique en dernier.
export function Title({ as: Tag = 'h2', lead, accent, br, id }: { as?: 'h1' | 'h2'; lead: string; accent?: string; br?: boolean; id?: string }) {
  return <Tag id={id} data-reveal="title"><Words text={lead} from={0}/>{accent && <>{br ? <br/> : ' '}<em><Words text={accent} from={lead.split(' ').length}/></em></>}</Tag>
}

// Révèle les éléments [data-reveal] quand ils entrent dans l'écran (une seule fois).
export function useReveal(key: unknown) {
  useEffect(() => {
    const pending = [...document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-in])')]
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      pending.forEach((element) => element.setAttribute('data-in', ''))
      return
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.setAttribute('data-in', '')
      observer.unobserve(entry.target)
    }), { rootMargin: '0px 0px -8% 0px' })
    pending.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [key])
}

// Effets liés au défilement : barre de progression, en-tête masqué en descendant, parallaxe des images.
export function useScrollEffects(key: unknown) {
  useEffect(() => {
    const root = document.documentElement
    const bar = document.querySelector<HTMLElement>('.scroll-progress')
    const layers = prefersReducedMotion() ? [] : [...document.querySelectorAll<HTMLElement>('[data-parallax]')]
    let lastY = window.scrollY
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      const height = window.innerHeight
      bar?.style.setProperty('--progress', String(Math.min(1, y / Math.max(1, root.scrollHeight - height))))
      root.toggleAttribute('data-scrolled', y > 8)
      if (Math.abs(y - lastY) > 6) {
        root.toggleAttribute('data-scroll-down', y > lastY && y > 260)
        lastY = y
      }
      for (const layer of layers) {
        const box = layer.getBoundingClientRect()
        if (box.bottom < 0 || box.top > height) continue
        const offset = Math.max(-1, Math.min(1, (box.top + box.height / 2 - height / 2) / height))
        layer.style.setProperty('--parallax', `${(-offset * Number(layer.dataset.parallax || 28)).toFixed(1)}px`)
      }
    }
    const request = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
    return () => {
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
      cancelAnimationFrame(frame)
    }
  }, [key])
}

// Halo doré qui suit le pointeur sur une carte.
export function trackPointer(event: React.PointerEvent<HTMLElement>) {
  const box = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty('--mx', `${event.clientX - box.left}px`)
  event.currentTarget.style.setProperty('--my', `${event.clientY - box.top}px`)
}
