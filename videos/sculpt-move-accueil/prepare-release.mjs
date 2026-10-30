// Recopie le film ordinateur (1920 × 1080) vers les autres versions :
//   mobile/     portrait 1080 × 1350, français
//   en/         paysage 1920 × 1080, anglais
//   en-mobile/  portrait 1080 × 1350, anglais
// Les scènes s'adaptent seules au format portrait par container queries : seules les dimensions changent.
// La version anglaise remplace les textes affichés à l'aide de la table ENGLISH ci-dessous.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, cpSync, rmSync } from 'node:fs'

const root = new URL('./', import.meta.url)
const read = p => readFileSync(new URL(p, root), 'utf8')
const write = (p, s) => writeFileSync(new URL(p, root), s)
const portrait = html => html
  .replaceAll('data-width="1920"', 'data-width="1080"')
  .replaceAll('data-height="1080"', 'data-height="1350"')
  .replace('width=1920, height=1080', 'width=1080, height=1350')
  .replaceAll('width: 1920px;', 'width: 1080px;')
  .replaceAll('height: 1080px;', 'height: 1350px;')

const ENGLISH = [
  ['<html lang="fr">', '<html lang="en">'],
  ['<span>Le rituel</span>', '<span>The ritual</span>'],
  ['>Votre beauté,<', '>Your beauty,<'],
  ['<em>votre rituel.</em>', '<em>your ritual.</em>'],
  ['DE L’INTÉRIEUR À L’EXTÉRIEUR', 'FROM THE INSIDE OUT'],
  ['<span>Le collagène</span>', '<span>The collagen</span>'],
  ['>De<', '>From<'],
  ['<em>l’intérieur.</em>', '<em>the inside.</em>'],
  ['POUDRE · SAVEUR FRUITS ROUGES', 'POWDER · RED BERRY FLAVOUR'],
  ['<span>Les gummies</span>', '<span>The gummies</span>'],
  ['>Le duo<', '>Beauty<'],
  ['<em>beauté.</em>', '<em>duo.</em>'],
  ['GUMMIES · FLACON DE 60', 'GUMMIES · BOTTLE OF 60'],
  ['LE BEAUTY DUO', 'THE BEAUTY DUO'],
  ['Collagène + Glutathion', 'Collagen + Glutathione'],
  ['COLLAGÈNE&nbsp;· ACIDE HYALURONIQUE', 'COLLAGEN&nbsp;· HYALURONIC ACID'],
  ['<span>La nouveauté</span>', '<span>New in</span>'],
  ['>NOUVEAU<', '>NEW<'],
  ['>… à<', '>… to<'],
  ['<em>l’extérieur.</em>', '<em>the outside.</em>'],
  ['GEL-CRÈME EN CAPSULES · POT DE 50 G', 'GEL-CREAM CAPSULES · 50 G JAR'],
  ['<span>La collection</span>', '<span>The collection</span>'],
  ['>Trois essentiels,<', '>Three essentials,<'],
  ['<em>un seul rituel.</em>', '<em>one ritual.</em>'],
  ['LES ESSENTIELS SCULPT MOVE', 'THE SCULPT MOVE ESSENTIALS'],
  ['POUDRE À MÉLANGER', 'POWDER TO MIX'],
  ['GEL-CRÈME · POT DE 50 G', 'GEL-CREAM · 50 G JAR'],
]
const english = html => ENGLISH.reduce((out, [fr, en]) => out.replaceAll(fr, en), html)

function release(dir, meta, transform) {
  rmSync(new URL(`${dir}/compositions/`, root), { recursive: true, force: true })
  mkdirSync(new URL(`${dir}/compositions/frames/`, root), { recursive: true })
  cpSync(new URL('assets/', root), new URL(`${dir}/assets/`, root), { recursive: true })
  cpSync(new URL('hyperframes.json', root), new URL(`${dir}/hyperframes.json`, root))
  write(`${dir}/meta.json`, JSON.stringify(meta, null, 2))
  write(`${dir}/index.html`, transform(read('index.html'), 'index.html'))
  for (const file of readdirSync(new URL('compositions/frames/', root))) {
    if (file.endsWith('.html')) write(`${dir}/compositions/frames/${file}`, transform(read(`compositions/frames/${file}`), file))
  }
}

release('mobile', { id: 'sculpt-move-accueil-mobile', name: 'SCULPT MOVE — Accueil mobile' }, portrait)
release('en', { id: 'sculpt-move-accueil-en', name: 'SCULPT MOVE — Home film (English)' }, english)
release('en-mobile', { id: 'sculpt-move-accueil-en-mobile', name: 'SCULPT MOVE — Home film mobile (English)' }, html => portrait(english(html)))

// Signale une entrée de la table qui ne correspond plus à aucun texte des sources.
const missing = ENGLISH.filter(([fr]) => ![read('index.html'), ...readdirSync(new URL('compositions/frames/', root)).map(file => read(`compositions/frames/${file}`))].some(html => html.includes(fr)))
if (missing.length) throw new Error(`Entrées introuvables dans les sources : ${missing.map(([fr]) => fr).join(', ')}`)
console.log('Versions mobile/, en/ et en-mobile/ mises à jour.')
