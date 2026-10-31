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

// La citation de la scène 14 apparaît mot à mot : chaque mot a son élément.
const words = (text, cls = '') => text.split(' ').map(word => `<span class="s14-w ${cls}">${word}</span>`).join(' ')

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
  ['<span class="s3-l">Le duo</span>', '<span class="s3-l">Beauty</span>'],
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
  ['>Tout un univers,<', '>A whole world,<'],
  ['<em>un seul rituel.</em>', '<em>one ritual.</em>'],
  ['LES ESSENTIELS SCULPT MOVE', 'THE SCULPT MOVE ESSENTIALS'],
  ['POUDRE À MÉLANGER', 'POWDER TO MIX'],
  ['GEL-CRÈME · POT DE 50 G', 'GEL-CREAM · 50 G JAR'],
  ['<span>Le shilajit</span>', '<span>Shilajit</span>'],
  ['>Le trésor<', '>Treasure<'],
  ['<em>de l’Himalaya.</em>', '<em>of the Himalayas.</em>'],
  ['SHILAJIT RESIN · POT DE 50 G', 'SHILAJIT RESIN · 50 G JAR'],
  ['<span>Le thé</span>', '<span>The tea</span>'],
  ['>Le rituel<', '>The evening<'],
  ['<em>du soir.</em>', '<em>ritual.</em>'],
  ['FLAT TUMMY TEA · AU MORINGA', 'FLAT TUMMY TEA · WITH MORINGA'],
  ['<span>Le pack</span>', '<span>The pack</span>'],
  ['PACK SCULPT MOVE · 3 ACTIONS', 'SCULPT MOVE PACK · 3 ACTIONS'],
  ['Ce n’est pas un régime,&nbsp;', 'It’s not a diet,&nbsp;'],
  ['<em>c’est un mode de vie.</em>', '<em>it’s a way of life.</em>'],
  ['<span>Matin</span>', '<span>Morning</span>'],
  ['<span>Journée</span>', '<span>Daytime</span>'],
  ['<span>Soirée</span>', '<span>Evening</span>'],
  ['>20X Collagène · Café au chia<', '>20X Collagen · Chia coffee<'],
  ['>Keto + ACV gélifiés<', '>Keto + ACV gummies<'],
  ['>Thé ventre plat au moringa<', '>Flat tummy tea with moringa<'],
  ['<span>Le Pilates</span>', '<span>Pilates</span>'],
  ['>Pack complet<', '>Complete<'],
  ['<em>Pilates.</em>', '<em>Pilates pack.</em>'],
  ['TAPIS · BANDES · BARRE · SERVIETTE · GOURDE', 'MAT · BANDS · BAR · TOWEL · BOTTLE'],
  ['<span>La routine</span>', '<span>The routine</span>'],
  ['<em>Le matin</em>', '<em>Morning</em>'],
  ['<em>Le soir</em>', '<em>Evening</em>'],
  ['AVEC UN GRAND VERRE D’EAU', 'WITH A LARGE GLASS OF WATER'],
  ['<span>La semaine</span>', '<span>The week</span>'],
  ['>Nouvelle semaine,<', '>New week,<'],
  ['<em>nouvelle toi.</em>', '<em>new you.</em>'],
  ['<i>L</i><i>M</i><i>M</i><i>J</i><i>V</i><i>S</i><i>D</i>', '<i>M</i><i>T</i><i>W</i><i>T</i><i>F</i><i>S</i><i>S</i>'],
  ['DETOX · GLUTATHIONE · COLLAGÈNE · KETO BURN', 'DETOX · GLUTATHIONE · COLLAGEN · KETO BURN'],
  ['<span>Le soir</span>', '<span>Evening</span>'],
  ['>Pack<', '>Harmony<'],
  ['<em>Harmonie.</em>', '<em>Pack.</em>'],
  ['ASHWAGANDHA · MAGNÉSIUM THRÉONATE', 'ASHWAGANDHA · MAGNESIUM THREONATE'],
  ['>Prenez soin de vous,<', '>Take care of yourself,<'],
  ['<em>de l’intérieur.</em>', '<em>from within.</em>'],
  ['DISPONIBLE À DOUALA', 'AVAILABLE IN DOUALA'],
  ['LIVRAISON PARTOUT AU CAMEROUN', 'DELIVERY ACROSS CAMEROON'],
  ['>Corps &amp; Esprit<', '>Body &amp; Mind<'],
  ['<span>Le duo</span>', '<span>The duo</span>'],
  ['>Le Duo<', '>The Duo<'],
  ['DEUX PRODUITS, UNE ROUTINE', 'TWO PRODUCTS, ONE ROUTINE'],
  ['<span>Ménopause</span>', '<span>Menopause</span>'],
  [words('Oui, mon corps change… Je traverse une nouvelle étape.'), words('Yes, my body is changing… I am entering a new stage.')],
  [words('Et je choisis de prendre soin de moi.', 's14-strong'), words('And I choose to take care of myself.', 's14-strong')],
  ['3 ESSENTIELS · UNE SEULE ROUTINE', '3 ESSENTIALS · ONE ROUTINE'],
  ['<span>Les essentiels</span>', '<span>The essentials</span>'],
  ['>Ménopause &amp;<', '>Menopause &amp;<'],
  ['<em>périménopause.</em>', '<em>perimenopause.</em>'],
  ['>Magnésium L-Thréonate<', '>Magnesium L-Threonate<'],
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
