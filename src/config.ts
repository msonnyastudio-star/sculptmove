export type Lang = 'fr' | 'en'

export const siteConfig = {
  brand: 'SCULPT MOVE',
  whatsappNumber: '237695669694',
  whatsappDisplay: '+237 6 95 66 96 94',
  domain: 'sculptmove.online',
  email: 'contact@sculptmove.online',
  address: { fr: 'Akwa, Douala — Cameroun', en: 'Akwa, Douala — Cameroon' },
  // Identité légale affichée sur /mentions-legales. Une valeur vide masque sa ligne.
  legal: {
    company: '',
    form: '',
    rccm: '',
    niu: '',
    director: '',
    host: '',
  },
}

export type Product = {
  slug: string
  name: string
  shortName: string
  eyebrow: string
  summary: string
  description: string
  format: string
  image: string
  imageAlt: string
  detailImage?: string
  detailImageAlt?: string
  price: number | null
  confirmationNote?: string
  highlights: string[]
  usage: string
  category?: 'skincare'
}

export const products: Product[] = [
  {
    slug: 'pdrn-repair-cream',
    name: 'PDRN Repair Cream',
    shortName: 'Crème PDRN',
    eyebrow: 'Le soin en gel-capsules',
    summary: 'Une gel-crème en capsules violettes et blanches, pour compléter votre rituel de soin.',
    description: 'PDRN Repair Cream & Even Tone Cream est un soin visage en gel-capsules. Le conditionnement présente une texture fraîche et légère, avec PDRN, niacinamide, collagène et acide hyaluronique.',
    format: 'Pot de 50 g · gel-crème en capsules',
    image: '/images/pdrn-jar.jpg',
    imageAlt: 'Crème Sculpt Move PDRN Repair Cream en capsules violettes et blanches, pot de 50 g au couvercle doré',
    detailImage: '/images/pdrn-ritual.jpg',
    detailImageAlt: 'Coffret rose, pot et texture gel de la crème Sculpt Move PDRN',
    price: 15000,
    category: 'skincare',
    highlights: ['Soin du visage en gel-capsules', 'Texture fraîche et légère présentée sur le visuel', 'Pot de 50 g indiqué sur le conditionnement'],
    usage: 'Prélever une capsule à l’aide de la spatule puis appliquer sur une peau propre et sèche, en massant délicatement. Respecter les conseils et précautions figurant sur le conditionnement. Usage externe.',
  },
  {
    slug: 'multi-collagene',
    name: 'Multi-Collagène Peptides',
    shortName: 'Multi-Collagène',
    eyebrow: 'La poudre à mélanger',
    summary: 'Une poudre saveur fruits rouges à intégrer facilement à vos habitudes.',
    description: 'Le Multi-Collagène Peptides se présente sous forme de poudre à mélanger dans une boisson ou une préparation, en suivant les indications figurant sur l’emballage.',
    format: 'Pot de 250 g · saveur fruits rouges',
    image: '/images/multi-collagene.jpg',
    imageAlt: 'Pot de Multi-Collagène Peptides Sculpt Move, fruits rouges, sur un décor ivoire',
    detailImage: '/images/multi-collagene-routine.jpg',
    detailImageAlt: 'Le Multi-Collagène en poudre ajouté à une boisson',
    price: 15000,
    confirmationNote: 'Le poids et la saveur sont repris du visuel fourni. À confirmer avant publication.',
    highlights: ['Poudre à mélanger', 'Saveur fruits rouges indiquée sur le visuel', 'Informations du format à confirmer'],
    usage: 'Mélanger dans une boisson ou une préparation en respectant les conseils inscrits sur l’emballage. La portion exacte est à vérifier sur le produit.',
  },
  {
    slug: 'glutathion-glow-skin',
    name: 'Glutathion Glow Skin',
    shortName: 'Gummies Glutathion',
    eyebrow: 'Les gummies',
    summary: 'Des gummies au glutathion, présentés en format 60 unités sur le flacon.',
    description: 'Glutathion Glow Skin est un complément alimentaire sous forme de gummies. La formule est présentée comme 13-en-1 sur le conditionnement fourni.',
    format: 'Flacon de 60 gummies · formule présentée comme 13-en-1',
    image: '/images/glutathion-glow-skin.jpg',
    imageAlt: 'Flacon rose de gummies Glutathion Glow Skin Sculpt Move avec une femme souriante',
    price: 10000,
    highlights: ['Format gummies', '60 gummies indiqués sur le flacon', 'Suivre la portion indiquée sur l’emballage'],
    usage: 'Respecter la portion et les conseils d’utilisation indiqués sur le flacon. Demandez-nous les informations produit si vous avez un doute.',
  },
  {
    slug: 'beauty-duo',
    name: 'Beauty Duo',
    shortName: 'Beauty Duo',
    eyebrow: 'Deux essentiels, une routine',
    summary: 'Le Multi-Collagène en poudre et les gummies Glutathion réunis.',
    description: 'Le Beauty Duo associe deux formats complémentaires dans une même routine : les gummies Glutathion Glow Skin et la poudre Multi-Collagène Peptides.',
    format: '1 poudre Multi-Collagène + 1 flacon de gummies Glutathion',
    image: '/images/sculpt-move-duo.jpg',
    imageAlt: 'Visuel de marque Sculpt Move présentant une femme et les deux produits de la routine',
    price: 25000,
    highlights: ['Deux formats à découvrir', 'Gummies et poudre à mélanger', 'Disponibilité à confirmer sur WhatsApp'],
    usage: 'Consultez les conseils d’utilisation de chaque produit et suivez les indications de leurs emballages respectifs.',
  },
]

// Textes anglais des fiches. Les noms de produits restent ceux des emballages.
type ProductText = Pick<Product, 'shortName' | 'eyebrow' | 'summary' | 'description' | 'format' | 'imageAlt' | 'detailImageAlt' | 'confirmationNote' | 'highlights' | 'usage'>
const englishText: Record<string, ProductText> = {
  'pdrn-repair-cream': {
    shortName: 'PDRN cream',
    eyebrow: 'The gel-capsule cream',
    summary: 'A gel-cream in purple and white capsules to complete your skincare ritual.',
    description: 'PDRN Repair Cream & Even Tone Cream is a facial skincare product in gel capsules. The packaging presents a fresh, light texture with PDRN, niacinamide, collagen and hyaluronic acid.',
    format: '50 g jar · gel-cream in capsules',
    imageAlt: 'Sculpt Move PDRN Repair Cream in purple and white capsules, 50 g jar with golden lid',
    detailImageAlt: 'Pink gift box, jar and gel texture of Sculpt Move PDRN cream',
    highlights: ['Facial care in gel capsules', 'Fresh, light texture shown in the visual', '50 g jar stated on the packaging'],
    usage: 'Scoop out one capsule with the spatula, then apply to clean, dry skin with a gentle massage. Follow the directions and precautions on the packaging. For external use.',
  },
  'multi-collagene': {
    shortName: 'Multi-Collagène',
    eyebrow: 'The powder to mix',
    summary: 'A red-berry flavoured powder that fits easily into your daily habits.',
    description: 'Multi-Collagène Peptides comes as a powder to mix into a drink or recipe, following the directions on the packaging.',
    format: '250 g jar · red-berry flavour',
    imageAlt: 'Jar of Sculpt Move Multi-Collagène Peptides, red berries, on an ivory background',
    detailImageAlt: 'Multi-Collagène powder added to a drink',
    confirmationNote: 'Weight and flavour are taken from the supplied visual. To be confirmed before publication.',
    highlights: ['Powder to mix', 'Red-berry flavour shown on the visual', 'Size details to be confirmed'],
    usage: 'Mix into a drink or recipe following the directions on the packaging. Check the exact serving size on the product.',
  },
  'glutathion-glow-skin': {
    shortName: 'Glutathion gummies',
    eyebrow: 'The gummies',
    summary: 'Glutathione gummies, presented in a 60-count bottle.',
    description: 'Glutathion Glow Skin is a food supplement in gummy form. The formula is presented as 13-in-1 on the supplied packaging.',
    format: 'Bottle of 60 gummies · formula presented as 13-in-1',
    imageAlt: 'Pink bottle of Sculpt Move Glutathion Glow Skin gummies with a smiling woman',
    highlights: ['Gummy format', '60 gummies stated on the bottle', 'Follow the serving size on the packaging'],
    usage: 'Follow the serving size and directions on the bottle. Ask us for the product information if you have any doubt.',
  },
  'beauty-duo': {
    shortName: 'Beauty Duo',
    eyebrow: 'Two essentials, one routine',
    summary: 'Multi-Collagène powder and Glutathion gummies, together.',
    description: 'The Beauty Duo combines two complementary formats in one routine: Glutathion Glow Skin gummies and Multi-Collagène Peptides powder.',
    format: '1 Multi-Collagène powder + 1 bottle of Glutathion gummies',
    imageAlt: 'Sculpt Move brand visual showing a woman and the two products of the routine',
    highlights: ['Two formats to discover', 'Gummies and powder to mix', 'Availability to be confirmed on WhatsApp'],
    usage: 'See the directions for each product and follow the instructions on their respective packaging.',
  },
}

const englishProducts = products.map((product) => ({ ...product, ...englishText[product.slug] }))

export function productsFor(lang: Lang) {
  return lang === 'en' ? englishProducts : products
}

export function formatPrice(price: number | null, lang: Lang = 'fr') {
  if (price == null) return lang === 'en' ? 'Price on request' : 'Prix sur demande'
  return `${price.toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')} FCFA`
}

export function productBySlug(slug: string, lang: Lang = 'fr') {
  return productsFor(lang).find((product) => product.slug === slug)
}
