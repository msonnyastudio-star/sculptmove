// Reconnaissance des produits dans un texte libre, partagée entre le navigateur et le serveur.
import type { CartLine } from './config'

export const normalize = (value: string) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

function distance(a: string, b: string) {
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    for (let j = 1; j <= b.length; j++) current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    previous = current
  }
  return previous[b.length]
}

// Tolère les fautes de frappe sur les mots assez longs : « livraizon », « santer », « comander ».
export const sameWord = (token: string, keyword: string) => token === keyword || (keyword.length >= 5 && token.length >= 5 && distance(token, keyword) <= (keyword.length >= 8 ? 2 : 1))

export function hasKeyword(text: string, keywords: string[]) {
  const clean = normalize(text)
  const tokens = clean.split(' ')
  return keywords.some((keyword) => keyword.includes(' ') ? ` ${clean} `.includes(` ${keyword} `) : tokens.some((token) => sameWord(token, keyword)))
}

const PRODUCT_WORDS: Record<string, string[]> = {
  'pdrn-repair-cream': ['pdrn', 'creme', 'cremes', 'cream', 'creams', 'repair', 'capsule', 'capsules', 'gel'],
  'multi-collagene': ['collagene', 'collagen', 'poudre', 'powder', 'peptides', 'multi'],
  'glutathion-glow-skin': ['glutathion', 'glutathione', 'gummies', 'gummy', 'gomme', 'gommes', 'bonbon', 'bonbons', 'ourson', 'oursons', 'glow'],
  'beauty-duo': ['duo'],
  'shilajit-resin': ['shilajit', 'resine', 'resin'],
  'flat-tummy-tea': ['tea', 'moringa', 'tisane', 'infusion', 'tummy', 'ventre'],
  'pack-3-actions': ['fitgum', 'chia'],
  'pack-pilates': ['pilates', 'tapis', 'barre'],
  'gamme-nouvelle-semaine': ['detox', 'burn', 'semaine'],
  'pack-harmonie': ['harmonie', 'harmony', 'ashwagandha', 'magnesium', 'threonate'],
  'pack-menopause': ['menopause', 'perimenopause', 'primrose', 'onagre'],
  'duo-flat-tummy-keto': ['keto', 'acv', 'garcinia'],
}

const NUMBER_WORDS: Record<string, number> = { un: 1, une: 1, one: 1, a: 1, deux: 2, two: 2, trois: 3, three: 3, quatre: 4, four: 4, cinq: 5, five: 5, six: 6, sept: 7, seven: 7, huit: 8, eight: 8, neuf: 9, nine: 9, dix: 10, ten: 10 }

export function mentionedProducts(text: string): CartLine[] {
  // « thé » perd son accent en normalisant et se confondrait avec l'anglais « the ».
  const tokens = normalize(text.replace(/(?<!\p{L})thé(?!\p{L})/giu, 'tea')).split(' ')
  const found: CartLine[] = []
  tokens.forEach((token, index) => {
    const slug = Object.keys(PRODUCT_WORDS).find((key) => PRODUCT_WORDS[key].some((word) => sameWord(token, word)))
    if (!slug) return
    const before = tokens[index - 1] ?? ''
    const quantity = /^\d{1,2}$/.test(before) ? Number(before) : (NUMBER_WORDS[before] ?? 1)
    const line = found.find((item) => item.slug === slug)
    if (line) line.quantity = Math.max(line.quantity, quantity)
    else if (quantity > 0) found.push({ slug, quantity })
  })
  return found
}
