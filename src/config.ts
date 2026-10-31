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

export type CartLine = { slug: string; quantity: number }

export const wa = (text: string) => `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`

export type ProductStory = { title: string; paragraphs?: string[]; points?: (string | { label: string; text: string })[] }

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
  category?: 'skincare' | 'equipment'
  // Facultatifs : renseignés ici, ils sont aussitôt connus de l'assistante Kimi.
  story?: ProductStory[]
  ingredients?: string
  skinTypes?: string
  precautions?: string
  inStock?: boolean
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
    story: [
      { title: 'La beauté commence aussi de l’intérieur', paragraphs: ['Un multi-collagène en peptides, conçu pour accompagner votre routine beauté et bien-être au quotidien.', 'Le collagène est une protéine naturellement présente dans l’organisme et participe notamment à la structure de la peau et de différents tissus.'] },
      { title: 'Pourquoi l’intégrer à votre routine ?', points: ['Soutient votre routine beauté de l’intérieur', 'Raffermit et accompagne l’entretien de l’apparence de la peau', 'Soutient les articulations', 'Fortifie et favorise la pousse des cheveux et des ongles', 'S’intègre facilement à votre quotidien', 'Idéal pour une routine beauté régulière'] },
    ],
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
    story: [
      { title: 'Qu’est-ce que c’est ?', paragraphs: ['Une formule exclusive de Glutathion 13-en-1 présentée sous forme de gummies pratiques et gourmands (60 unités), conçue pour intégrer facilement les actifs antioxydants à votre routine quotidienne.'] },
      { title: 'Quel est son rôle ?', points: [
        { label: 'Protection antioxydante', text: 'neutralise les radicaux libres et protège les cellules contre le stress oxydatif.' },
        { label: 'Régénération', text: 'participe au maintien du système antioxydant et au recyclage des molécules protectrices.' },
        { label: 'Soutien cellulaire et détox', text: 'intervient dans l’équilibre oxydatif et soutient les processus naturels d’élimination, notamment au niveau du foie.' },
        { label: 'Éclat de la peau et anti-taches', text: 'accompagne les mécanismes cutanés pour unifier le teint et préserver la beauté de la peau de l’intérieur.' },
      ] },
      { title: 'Quels besoins peut-il accompagner ?', points: ['Peaux ternes en quête d’éclat et d’uniformité', 'Besoins de protection contre le stress oxydatif et le vieillissement cutané prématuré, et volonté d’estomper les taches pigmentaires', 'Volonté d’adopter une routine beauté et bien-être simple, sans contrainte'] },
      { title: 'Pourquoi Sculpt Move ?', paragraphs: ['Une approche honnête et ciblée : une formule 13-en-1 hautement qualitative qui soutient la beauté de l’intérieur, sans promesses artificielles, pour des résultats authentiques.'] },
    ],
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
    story: [
      { title: 'Deux essentiels réunis dans une même routine', points: [
        { label: 'Le Glutathion', text: 'aide à révéler un teint plus lumineux et uniforme, tout en contribuant à atténuer l’apparence des taches pigmentaires grâce à son action antioxydante.' },
        { label: 'Le Multi-Collagène Peptides', text: 'contribue à améliorer la fermeté et l’élasticité de la peau, favorise son hydratation et aide à prévenir les signes visibles du vieillissement.' },
      ] },
      { title: 'Pourquoi les associer ?', paragraphs: ['Parce que le collagène et le glutathion occupent deux rôles complémentaires dans une routine beauté globale.', 'Ensemble, ils accompagnent votre peau de l’intérieur pour lui redonner éclat, fermeté et un aspect plus sain, en complément d’une bonne hygiène de vie.'] },
    ],
    highlights: ['Deux formats à découvrir', 'Gummies et poudre à mélanger', 'Disponibilité à confirmer sur WhatsApp'],
    usage: 'Consultez les conseils d’utilisation de chaque produit et suivez les indications de leurs emballages respectifs.',
  },
  {
    slug: 'shilajit-resin',
    name: 'Shilajit Resin',
    shortName: 'Shilajit',
    eyebrow: 'La résine de l’Himalaya',
    summary: 'Une résine de shilajit présentée comme originaire de l’Himalaya, en pot de 50 g.',
    description: 'Shilajit Resin est présentée sur son emballage comme une résine 100 % naturelle, originaire de l’Himalaya, en pot de 50 g.',
    format: 'Pot de 50 g',
    image: '/images/produit-shilajit.jpg',
    imageAlt: 'Pot noir et étui de Shilajit Resin aux montagnes dorées',
    price: null,
    confirmationNote: 'Prix, format et disponibilité confirmés par l’équipe sur WhatsApp.',
    highlights: ['Résine en pot', '50 g indiqués sur l’emballage', 'Origine Himalaya indiquée sur l’emballage'],
    usage: 'Respecter les conseils d’utilisation et la portion indiqués sur l’emballage de chaque produit. Demandez-nous les informations disponibles si vous avez un doute.',
  },
  {
    slug: 'flat-tummy-tea',
    name: 'Flat Tummy Tea',
    shortName: 'Thé au moringa',
    eyebrow: 'Le rituel du soir',
    summary: 'Un thé au moringa en sachet, gamme Boost Night, pour votre rituel du soir.',
    description: 'Flat Tummy Tea est un thé au moringa de la gamme Boost Night, présenté en sachet et en infusettes, à savourer le soir.',
    format: 'Sachet d’infusettes au moringa',
    image: '/images/produit-flat-tummy-tea.jpg',
    imageAlt: 'Sachet noir Sculpt Move Flat Tummy Tea au moringa, Boost Night',
    detailImage: '/images/produit-flat-tummy-tea-tasse.jpg',
    detailImageAlt: 'Tasse de thé au moringa et infusettes',
    price: 8000,
    confirmationNote: 'Disponibilité confirmée par l’équipe sur WhatsApp.',
    highlights: ['Thé au moringa', 'En infusettes', 'À savourer le soir'],
    usage: 'Respecter les conseils d’utilisation et la portion indiqués sur l’emballage de chaque produit. Demandez-nous les informations disponibles si vous avez un doute.',
  },
  {
    slug: 'pack-3-actions',
    name: 'Pack Sculpt Move 3 actions',
    shortName: 'Pack 3 actions',
    eyebrow: 'Matin, journée, soirée',
    summary: 'Trois produits pour trois moments : un café au collagène, des gélifiés et un thé.',
    description: 'Le matin, le 20X Collagène café au chia. Dans la journée, les Keto + ACV gélifiés. Le soir, le thé ventre plat au moringa.',
    format: '20X Collagène café au chia + Keto + ACV gélifiés + thé au moringa',
    image: '/images/produit-pack-3-actions.jpg',
    imageAlt: 'Les trois produits du pack : café au collagène, gélifiés Keto + ACV et thé au moringa',
    price: null,
    confirmationNote: 'Prix, format et disponibilité confirmés par l’équipe sur WhatsApp.',
    highlights: ['Le matin : 20X Collagène café au chia', 'La journée : Keto + ACV gélifiés', 'La soirée : thé au moringa'],
    usage: 'Respecter les conseils d’utilisation et la portion indiqués sur l’emballage de chaque produit. Demandez-nous les informations disponibles si vous avez un doute.',
  },
  {
    slug: 'pack-pilates',
    name: 'Pack complet Pilates',
    shortName: 'Pack Pilates',
    eyebrow: 'Tout pour bouger',
    summary: 'Tapis, bandes, barre, serviette et gourde : l’essentiel pour pratiquer chez vous.',
    description: 'Le Pack complet Pilates réunit un tapis, des bandes de résistance, une barre de Pilates avec ses élastiques, une serviette et une gourde.',
    format: 'Tapis, bandes, barre avec élastiques, serviette et gourde',
    image: '/images/produit-pack-pilates.jpg',
    imageAlt: 'Tapis violet, bandes de résistance, barre rose, serviette bleue et gourde',
    detailImage: '/images/produit-pack-pilates-exercice.jpg',
    detailImageAlt: 'Femme en plein exercice avec la barre de Pilates',
    price: 25000,
    category: 'equipment',
    confirmationNote: 'Disponibilité confirmée par l’équipe sur WhatsApp.',
    highlights: ['Tapis et bandes de résistance', 'Barre de Pilates avec élastiques', 'Serviette et gourde'],
    usage: 'Pratiquez à votre rythme et adaptez les exercices à votre niveau. En cas de doute sur votre condition physique, demandez l’avis d’un professionnel de santé.',
  },
  {
    slug: 'gamme-nouvelle-semaine',
    name: 'Gamme Nouvelle semaine',
    shortName: 'Gamme Nouvelle semaine',
    eyebrow: 'Nouvelle semaine, nouvelle toi',
    summary: 'Detox, Glutathione Gummies, Collagène Gummies et Keto Burn : faites votre choix.',
    description: 'Quatre produits parmi lesquels choisir pour commencer votre routine : Detox, Glutathione Gummies, Collagène Gummies et Keto Burn en capsules.',
    format: 'Detox · Glutathione Gummies · Collagène Gummies · Keto Burn',
    image: '/images/produit-gamme-nouvelle-semaine.jpg',
    imageAlt: 'Flacons Detox, Glutathione Gummies, Collagène Gummies et Keto Burn',
    price: null,
    confirmationNote: 'Prix, format et disponibilité confirmés par l’équipe sur WhatsApp.',
    highlights: ['Detox', 'Glutathione et Collagène en gummies', 'Keto Burn en capsules'],
    usage: 'Respecter les conseils d’utilisation et la portion indiqués sur l’emballage de chaque produit. Demandez-nous les informations disponibles si vous avez un doute.',
  },
  {
    slug: 'pack-harmonie',
    name: 'Pack Harmonie Corps & Esprit',
    shortName: 'Pack Harmonie',
    eyebrow: 'Votre rituel bien-être au quotidien',
    summary: 'Des gummies Ashwagandha et des gouttes de Magnésium Thréonate réunis en un rituel.',
    description: 'Le Pack Harmonie Corps & Esprit associe les Ashwagandha Gummies aux fruits rouges et le Magnésium Thréonate en gouttes liposomales (60 mL), pour un rituel bien-être quotidien.',
    format: 'Ashwagandha Gummies + Magnésium Thréonate 60 mL',
    image: '/images/produit-pack-harmonie.jpg',
    imageAlt: 'Flacon Ashwagandha Gummies et flacon compte-gouttes Magnésium Thréonate Sculpt Move',
    detailImage: '/images/produit-pack-harmonie-rituel.jpg',
    detailImageAlt: 'Femme souriante savourant une gummy',
    price: null,
    confirmationNote: 'Prix, format et disponibilité confirmés par l’équipe sur WhatsApp.',
    highlights: ['Gummies aux fruits rouges', 'Gouttes liposomales, 60 mL', 'Disponible à Douala, livraison partout au Cameroun'],
    usage: 'Respecter les conseils d’utilisation et la portion indiqués sur l’emballage de chaque produit. Demandez-nous les informations disponibles si vous avez un doute.',
  },
  {
    slug: 'duo-flat-tummy-keto',
    name: 'Duo Flat Tummy + Keto ACV',
    shortName: 'Duo Flat Tummy + Keto',
    eyebrow: 'Deux produits, une routine',
    summary: 'Les comprimés Flat Tummy au garcinia cambogia et les gummies Keto + ACV réunis.',
    description: 'Ce duo réunit les comprimés Flat Tummy au garcinia cambogia et les gummies Keto + ACV (60 gummies).',
    format: 'Comprimés Flat Tummy + 60 gummies Keto + ACV',
    image: '/images/produit-duo-flat-tummy-keto.jpg',
    imageAlt: 'Flacons Flat Tummy Garcinia Cambogia et Keto + ACV Gummies',
    price: null,
    confirmationNote: 'Prix, format et disponibilité confirmés par l’équipe sur WhatsApp.',
    highlights: ['Comprimés au garcinia cambogia', '60 gummies Keto + ACV', 'Deux formats complémentaires'],
    usage: 'Respecter les conseils d’utilisation et la portion indiqués sur l’emballage de chaque produit. Demandez-nous les informations disponibles si vous avez un doute.',
  },
  {
    slug: 'pack-menopause',
    name: 'Pack Ménopause & Périménopause',
    shortName: 'Pack Ménopause',
    eyebrow: '3 essentiels, une seule routine',
    summary: 'Evening Primrose Oil, Ashwagandha et Magnésium L-Thréonate réunis en une routine.',
    description: 'Trois essentiels pour une routine bien-être à cette étape de la vie : Evening Primrose Oil 1300 mg (90 softgels), Ashwagandha Gummies et Magnésium L-Thréonate en gouttes (60 mL).',
    format: 'Evening Primrose Oil 1300 mg + Ashwagandha Gummies + Magnésium L-Thréonate 60 mL',
    image: '/images/produit-pack-menopause.jpg',
    imageAlt: 'Flacons Evening Primrose Oil, Ashwagandha Gummies et Magnésium L-Thréonate Sculpt Move',
    detailImage: '/images/produit-pack-menopause-routine.jpg',
    detailImageAlt: 'Femme souriante et sereine',
    price: null,
    confirmationNote: 'Prix, format et disponibilité confirmés par l’équipe sur WhatsApp.',
    highlights: ['Evening Primrose Oil, 90 softgels', 'Ashwagandha Gummies', 'Magnésium L-Thréonate, 60 mL'],
    usage: 'Respecter les conseils d’utilisation et la portion indiqués sur l’emballage de chaque produit. Demandez-nous les informations disponibles si vous avez un doute. Parlez-en à votre médecin si vous suivez un traitement.',
  },
]

// Textes anglais des fiches. Les noms de produits restent ceux des emballages.
type ProductText = Pick<Product, 'shortName' | 'eyebrow' | 'summary' | 'description' | 'format' | 'imageAlt' | 'detailImageAlt' | 'confirmationNote' | 'highlights' | 'usage' | 'story'>
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
    story: [
      { title: 'Beauty also starts from within', paragraphs: ['A multi-collagen in peptides, designed to support your daily beauty and wellness routine.', 'Collagen is a protein naturally present in the body and contributes in particular to the structure of the skin and various tissues.'] },
      { title: 'Why add it to your routine?', points: ['Supports your beauty routine from within', 'Firms and helps maintain the appearance of the skin', 'Supports the joints', 'Strengthens and promotes the growth of hair and nails', 'Fits easily into your daily life', 'Ideal for a regular beauty routine'] },
    ],
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
    story: [
      { title: 'What is it?', paragraphs: ['An exclusive 13-in-1 Glutathione formula in practical, tasty gummies (60 count), designed to make antioxidant actives easy to add to your daily routine.'] },
      { title: 'What does it do?', points: [
        { label: 'Antioxidant protection', text: 'neutralises free radicals and protects cells against oxidative stress.' },
        { label: 'Regeneration', text: 'helps maintain the antioxidant system and recycle protective molecules.' },
        { label: 'Cellular support and detox', text: 'plays a part in oxidative balance and supports natural elimination processes, particularly in the liver.' },
        { label: 'Skin radiance and anti-spot', text: 'supports skin mechanisms to even out the complexion and preserve the skin’s beauty from within.' },
      ] },
      { title: 'What needs can it support?', points: ['Dull skin looking for radiance and evenness', 'Protection against oxidative stress and premature skin ageing, and the wish to fade pigment spots', 'The wish to adopt a simple, effortless beauty and wellness routine'] },
      { title: 'Why Sculpt Move?', paragraphs: ['An honest, targeted approach: a high-quality 13-in-1 formula that supports beauty from within, without artificial promises, for authentic results.'] },
    ],
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
    story: [
      { title: 'Two essentials in one routine', points: [
        { label: 'Glutathione', text: 'helps reveal a brighter, more even complexion, while helping to reduce the appearance of pigment spots through its antioxidant action.' },
        { label: 'Multi-Collagène Peptides', text: 'helps improve skin firmness and elasticity, promotes hydration and helps prevent the visible signs of ageing.' },
      ] },
      { title: 'Why combine them?', paragraphs: ['Because collagen and glutathione play two complementary roles in a complete beauty routine.', 'Together, they support your skin from within to restore radiance, firmness and a healthier appearance, alongside a healthy lifestyle.'] },
    ],
    highlights: ['Two formats to discover', 'Gummies and powder to mix', 'Availability to be confirmed on WhatsApp'],
    usage: 'See the directions for each product and follow the instructions on their respective packaging.',
  },
  'shilajit-resin': {
    shortName: 'Shilajit',
    eyebrow: 'The Himalayan resin',
    summary: 'A shilajit resin presented as originating from the Himalayas, in a 50 g jar.',
    description: 'Shilajit Resin is presented on its packaging as a 100% natural resin originating from the Himalayas, in a 50 g jar.',
    format: '50 g jar',
    imageAlt: 'Black jar and box of Shilajit Resin with golden mountains',
    confirmationNote: 'Price, format and availability are confirmed by the team on WhatsApp.',
    highlights: ['Resin in a jar', '50 g stated on the packaging', 'Himalayan origin stated on the packaging'],
    usage: 'Follow the directions and serving size on each product’s packaging. Ask us for the available information if you have any doubt.',
  },
  'flat-tummy-tea': {
    shortName: 'Moringa tea',
    eyebrow: 'The evening ritual',
    summary: 'A moringa tea in a pouch, from the Boost Night range, for your evening ritual.',
    description: 'Flat Tummy Tea is a moringa tea from the Boost Night range, presented in a pouch of tea bags, to enjoy in the evening.',
    format: 'Pouch of moringa tea bags',
    imageAlt: 'Black Sculpt Move Flat Tummy Tea pouch with moringa, Boost Night',
    detailImageAlt: 'Cup of moringa tea and tea bags',
    confirmationNote: 'Availability is confirmed by the team on WhatsApp.',
    highlights: ['Moringa tea', 'In tea bags', 'To enjoy in the evening'],
    usage: 'Follow the directions and serving size on each product’s packaging. Ask us for the available information if you have any doubt.',
  },
  'pack-3-actions': {
    shortName: '3-action pack',
    eyebrow: 'Morning, daytime, evening',
    summary: 'Three products for three moments: a collagen coffee, gummies and a tea.',
    description: 'In the morning, 20X Collagen chia coffee. During the day, Keto + ACV gummies. In the evening, moringa flat tummy tea.',
    format: '20X Collagen chia coffee + Keto + ACV gummies + moringa tea',
    imageAlt: 'The three products in the pack: collagen coffee, Keto + ACV gummies and moringa tea',
    confirmationNote: 'Price, format and availability are confirmed by the team on WhatsApp.',
    highlights: ['Morning: 20X Collagen chia coffee', 'Daytime: Keto + ACV gummies', 'Evening: moringa tea'],
    usage: 'Follow the directions and serving size on each product’s packaging. Ask us for the available information if you have any doubt.',
  },
  'pack-pilates': {
    shortName: 'Pilates pack',
    eyebrow: 'All you need to move',
    summary: 'Mat, bands, bar, towel and bottle: the essentials to practise at home.',
    description: 'The Complete Pilates Pack brings together a mat, resistance bands, a Pilates bar with its cords, a towel and a bottle.',
    format: 'Mat, bands, bar with cords, towel and bottle',
    imageAlt: 'Purple mat, resistance bands, pink bar, blue towel and bottle',
    detailImageAlt: 'Woman exercising with the Pilates bar',
    confirmationNote: 'Availability is confirmed by the team on WhatsApp.',
    highlights: ['Mat and resistance bands', 'Pilates bar with cords', 'Towel and bottle'],
    usage: 'Practise at your own pace and adapt the exercises to your level. If you have any doubt about your fitness, ask a healthcare professional.',
  },
  'gamme-nouvelle-semaine': {
    shortName: 'New Week range',
    eyebrow: 'New week, new you',
    summary: 'Detox, Glutathione Gummies, Collagen Gummies and Keto Burn: make your choice.',
    description: 'Four products to choose from to start your routine: Detox, Glutathione Gummies, Collagen Gummies and Keto Burn capsules.',
    format: 'Detox · Glutathione Gummies · Collagen Gummies · Keto Burn',
    imageAlt: 'Bottles of Detox, Glutathione Gummies, Collagen Gummies and Keto Burn',
    confirmationNote: 'Price, format and availability are confirmed by the team on WhatsApp.',
    highlights: ['Detox', 'Glutathione and Collagen gummies', 'Keto Burn capsules'],
    usage: 'Follow the directions and serving size on each product’s packaging. Ask us for the available information if you have any doubt.',
  },
  'pack-harmonie': {
    shortName: 'Harmony pack',
    eyebrow: 'Your daily wellness ritual',
    summary: 'Ashwagandha gummies and Magnesium Threonate drops brought together in one ritual.',
    description: 'The Pack Harmonie Corps & Esprit combines mixed-berry Ashwagandha Gummies with liposomal Magnesium Threonate drops (60 mL), for a daily wellness ritual.',
    format: 'Ashwagandha Gummies + Magnesium Threonate 60 mL',
    imageAlt: 'Sculpt Move Ashwagandha Gummies bottle and Magnesium Threonate dropper bottle',
    detailImageAlt: 'Smiling woman enjoying a gummy',
    confirmationNote: 'Price, format and availability are confirmed by the team on WhatsApp.',
    highlights: ['Mixed-berry gummies', 'Liposomal drops, 60 mL', 'Available in Douala, delivery across Cameroon'],
    usage: 'Follow the directions and serving size on each product’s packaging. Ask us for the available information if you have any doubt.',
  },
  'duo-flat-tummy-keto': {
    shortName: 'Flat Tummy + Keto duo',
    eyebrow: 'Two products, one routine',
    summary: 'Flat Tummy garcinia cambogia tablets and Keto + ACV gummies, together.',
    description: 'This duo brings together Flat Tummy garcinia cambogia tablets and Keto + ACV gummies (60 gummies).',
    format: 'Flat Tummy tablets + 60 Keto + ACV gummies',
    imageAlt: 'Bottles of Flat Tummy Garcinia Cambogia and Keto + ACV Gummies',
    confirmationNote: 'Price, format and availability are confirmed by the team on WhatsApp.',
    highlights: ['Garcinia cambogia tablets', '60 Keto + ACV gummies', 'Two complementary formats'],
    usage: 'Follow the directions and serving size on each product’s packaging. Ask us for the available information if you have any doubt.',
  },
  'pack-menopause': {
    shortName: 'Menopause pack',
    eyebrow: '3 essentials, one routine',
    summary: 'Evening Primrose Oil, Ashwagandha and Magnesium L-Threonate in one routine.',
    description: 'Three essentials for a wellness routine at this stage of life: Evening Primrose Oil 1300 mg (90 softgels), Ashwagandha Gummies and Magnesium L-Threonate drops (60 mL).',
    format: 'Evening Primrose Oil 1300 mg + Ashwagandha Gummies + Magnesium L-Threonate 60 mL',
    imageAlt: 'Sculpt Move bottles of Evening Primrose Oil, Ashwagandha Gummies and Magnesium L-Threonate',
    detailImageAlt: 'Smiling, serene woman',
    confirmationNote: 'Price, format and availability are confirmed by the team on WhatsApp.',
    highlights: ['Evening Primrose Oil, 90 softgels', 'Ashwagandha Gummies', 'Magnesium L-Threonate, 60 mL'],
    usage: 'Follow the directions and serving size on each product’s packaging. Ask us for the available information if you have any doubt. Talk to your doctor if you are on medication.',
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

// Total d'une sélection : un produit sans prix affiché ne doit jamais faire croire à un total complet.
export function formatTotal(total: number, unknownPrice: boolean, lang: Lang = 'fr') {
  if (!unknownPrice) return formatPrice(total, lang)
  const pending = lang === 'en' ? 'price to confirm' : 'prix à confirmer'
  return total > 0 ? `${formatPrice(total, lang)} + ${pending}` : pending[0].toUpperCase() + pending.slice(1)
}

export function productBySlug(slug: string, lang: Lang = 'fr') {
  return productsFor(lang).find((product) => product.slug === slug)
}
