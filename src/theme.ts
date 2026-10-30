import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { withViewTransition } from './motion'

export type Theme = 'light' | 'dark'
const THEME_KEY = 'sculpt-move-theme'

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

// Le thème initial est posé sur <html> par le script de index.html, avant le premier affichage.
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])

  // Sans choix enregistré, le site suit le réglage clair/sombre de l'appareil.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const follow = () => { if (!storedTheme()) setTheme(media.matches ? 'dark' : 'light') }
    media.addEventListener('change', follow)
    return () => media.removeEventListener('change', follow)
  }, [])

  // Le nouveau thème s'ouvre en cercle depuis le bouton cliqué.
  const toggle = (origin: HTMLElement) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    try { localStorage.setItem(THEME_KEY, next) } catch { /* stockage indisponible */ }
    const box = origin.getBoundingClientRect()
    const x = box.left + box.width / 2
    const y = box.top + box.height / 2
    const root = document.documentElement
    root.style.setProperty('--vt-x', `${x}px`)
    root.style.setProperty('--vt-y', `${y}px`)
    root.style.setProperty('--vt-r', `${Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))}px`)
    withViewTransition('theme', () => {
      flushSync(() => setTheme(next))
      root.dataset.theme = next
    })
  }

  return { theme, toggle }
}
