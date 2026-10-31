import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { formatPrice, productsFor, type Lang } from './config'
import { withViewTransition } from './motion'

type OrderLine = { name: string; quantity: number; price: string }

const fr = {
  htmlTitle: 'SCULPT MOVE — La beauté commence aussi de l’intérieur',
  skip: 'Aller au contenu',
  brandHome: 'SCULPT MOVE, accueil',
  nav: { label: 'Navigation principale', home: 'Accueil', products: 'Nos produits', duo: 'Le duo beauté', tips: 'Conseils', delivery: 'Livraison', shop: 'La boutique', contact: 'Contact', open: 'Ouvrir le menu', close: 'Fermer le menu' },
  prefs: { language: 'Langue', toDark: 'Activer le mode nuit', toLight: 'Activer le mode jour' },
  header: { selection: 'Ma sélection', cartLabel: (n: number) => `Ouvrir la sélection, ${n} article${n === 1 ? '' : 's'}` },
  wa: {
    delivery: 'Bonjour Sculpt Move, je souhaite connaître les frais et délais de livraison pour ma ville : ',
    shop: 'Bonjour Sculpt Move, je souhaite venir à la boutique. Pouvez-vous m’indiquer l’adresse exacte et les horaires d’ouverture ?',
    contact: 'Bonjour Sculpt Move, je souhaite obtenir des informations sur vos produits.',
    footer: 'Bonjour Sculpt Move, je souhaite vous contacter.',
    product: (name: string) => `Bonjour Sculpt Move, je souhaite avoir des informations sur ${name}. Merci de me confirmer la disponibilité.`,
    order: (lines: OrderLine[], total: string, city: string) => `Bonjour Sculpt Move, je souhaite commander :\n${lines.map((line) => `• ${line.name} — quantité : ${line.quantity} — ${line.price}`).join('\n')}\nTotal : ${total} (hors livraison)\nMa ville : ${city || '[ville]'}\nMerci de me confirmer la disponibilité et les modalités de livraison.`,
  },
  card: { view: 'Voir le produit', add: 'Ajouter à ma sélection' },
  toast: 'Ajouté à votre sélection',
  cartReminder: { text: (n: number) => `Votre sélection contient déjà ${n} article${n === 1 ? '' : 's'}`, view: 'Voir' },
  cart: {
    eyebrow: 'Votre sélection', title: 'Ma routine', close: 'Fermer le panier',
    emptyTitle: 'Votre sélection est vide', emptyText: 'Ajoutez un essentiel pour préparer votre demande sur WhatsApp.', discover: 'Découvrir les produits',
    less: (name: string) => `Réduire la quantité de ${name}`, more: (name: string) => `Augmenter la quantité de ${name}`, remove: (name: string) => `Supprimer ${name}`,
    total: 'Total', excl: 'hors livraison',
    city: 'Votre ville', cityHint: '(au Cameroun ou dans la sous-région)', cityPlaceholder: 'Ex. Douala, Yaoundé, Libreville…',
    note: 'Expédition partout au Cameroun et dans la sous-région. Votre demande sera envoyée à Sculpt Move pour confirmer la disponibilité, les frais et le délai de livraison.',
    checkout: 'Préparer la demande WhatsApp',
    askKimi: 'Une question avant de commander ? Demander à Kimi',
  },
  hero: {
    eyebrow: 'BEAUTÉ & BIEN-ÊTRE · SCULPT MOVE', title: ['Votre beauté.', 'Votre rituel.'] as [string, string],
    discover: 'Découvrir les essentiels', talk: 'Demander conseil à Kimi',
    video: 'Présentation animée Sculpt Move : collagène, gummies, crème PDRN, shilajit, thé au moringa, pack Pilates, pack Harmonie et routine ménopause. Vidéo sans son.',
    film: 'LE FILM SCULPT MOVE', silent: 'SANS SON', pauseLabel: 'Mettre la vidéo en pause', playLabel: 'Lire la vidéo', pause: 'Pause', play: 'Lire',
  },
  marquee: ['Multi-Collagène Peptides', 'Glutathion Glow Skin', 'PDRN Repair Cream', 'Beauty Duo', 'Expédition partout au Cameroun et dans la sous-région'],
  intro: { text: 'Le plaisir d’une routine simple, des informations claires et des essentiels pensés pour accompagner vos habitudes.', link: 'Notre approche' },
  productsSection: { eyebrow: 'LES ESSENTIELS SCULPT MOVE', title: ['Choisissez votre', 'rituel.'] as [string, string], text: 'Des soins, des compléments et des accessoires pour découvrir l’univers Sculpt Move. La disponibilité et la livraison se confirment simplement sur WhatsApp.' },
  kimiBand: {
    eyebrow: 'BESOIN D’UN CONSEIL ?', title: ['Kimi vous aide à choisir', 'et à commander.'] as [string, string],
    text: 'Dites-lui ce que vous cherchez : elle répond à vos questions sur les produits, puis prépare votre commande, prête à envoyer sur WhatsApp.',
    cta: 'Discuter avec Kimi',
    questions: ['Quel produit choisir pour ma peau ?', 'Comment utiliser la crème PDRN ?', 'Je veux commander'],
  },
  delivery: {
    eyebrow: 'LIVRAISON & EXPÉDITION', title: ['Partout au Cameroun,', 'et dans la sous-région.'] as [string, string],
    text: 'Nous expédions vos essentiels depuis Akwa, à Douala, dans tout le territoire camerounais et vers les pays de la sous-région.',
    steps: [
      ['Douala — Akwa', 'Notre point de départ, au cœur d’Akwa.'],
      ['Tout le Cameroun', 'Expédition dans toute l’étendue du territoire.'],
      ['La sous-région', 'Envois vers les pays de la sous-région.'],
    ] as [string, string][],
    note: 'Délais et frais confirmés sur WhatsApp selon votre ville.', cta: 'Demander les frais de livraison',
  },
  shop: {
    eyebrow: 'NOTRE BOUTIQUE', title: ['Venez nous voir', 'à Douala.'] as [string, string],
    text: 'Envie de découvrir nos produits de près ? Passez nous voir à la boutique : vous pouvez commander directement sur place.',
    cta: 'Demander l’adresse et les horaires', note: 'L’adresse exacte et les horaires vous sont donnés sur WhatsApp.',
    altFront: 'Façade de la boutique Sculpt Move, avec le logo au-dessus de l’entrée et les produits en vitrine',
    altCounter: 'Conseillère au comptoir de la boutique Sculpt Move, devant le logo et les étagères de produits',
  },
  duo: {
    alt: 'Visuel du Beauty Duo Sculpt Move : une femme, le Multi-Collagène Peptides et les gummies Glutathion',
    eyebrow: 'LE BEAUTY DUO', title: ['Deux essentiels.', 'Une même routine.'] as [string, string],
    text: 'Les gummies Glutathion Glow Skin et le Multi-Collagène en poudre, réunis pour composer une routine qui vous ressemble.',
    items: [['Les gummies', 'Un format pratique à emporter.'], ['La poudre', 'À mélanger à une boisson ou préparation.']] as [string, string][],
    cta: 'Découvrir le Beauty Duo',
  },
  brand: {
    eyebrow: 'L’UNIVERS SCULPT MOVE', title: ['Prendre soin de soi,', 'à sa manière.'] as [string, string],
    text: 'Une routine n’a pas besoin d’être compliquée. Nous croyons à la régularité, au plaisir de prendre un moment pour soi et à des informations faciles à comprendre.',
    link: 'En savoir plus', alt: 'Visuel de marque Sculpt Move avec une femme et les deux produits',
    values: [['Régularité', 'Des habitudes qui vous conviennent.'], ['Plaisir', 'Un rituel qui trouve sa place au quotidien.'], ['Clarté', 'Des informations simples, sans promesses excessives.']] as [string, string][],
  },
  guidance: {
    alt: 'Visuel de conseils d’utilisation des gummies Glutathion Glow Skin', eyebrow: 'UN CONSEIL SIMPLE', title: 'Les indications du produit d’abord.',
    p1: 'Chaque complément a ses propres recommandations. Lisez l’étiquette du produit et respectez la portion qui y est inscrite.',
    p2: 'Besoin d’une précision sur le format ou l’utilisation ? Kimi vous aide à retrouver l’information disponible.',
    link: 'Poser ma question à Kimi',
  },
  faq: {
    eyebrow: 'ON VOUS RÉPOND', title: ['Questions', 'fréquentes.'] as [string, string], text: 'Besoin d’une précision ? Nous sommes à votre écoute.', contact: 'Nous contacter',
    items: (prices: string): [string, string][] => [
      ['Comment commander ?', 'Le plus simple : demandez à Kimi. Elle répond à vos questions, note vos produits et votre ville, puis prépare votre message WhatsApp. Vous pouvez aussi ajouter des produits à votre sélection et préparer votre demande vous-même. Votre message ne vaut pas confirmation de commande.'],
      ['Puis-je commander directement en boutique ?', 'Oui. Vous pouvez venir à notre boutique à Akwa, à Douala, et commander sur place. Écrivez-nous sur WhatsApp pour connaître l’adresse exacte et les horaires.'],
      ['Quels sont les prix ?', `${prices}. Les frais de livraison sont confirmés sur WhatsApp selon votre ville.`],
      ['Livrez-vous en dehors de Douala ?', 'Oui. Nous expédions depuis Akwa (Douala) dans toute l’étendue du territoire camerounais et vers les pays de la sous-région. Les délais et les frais sont confirmés selon votre destination : indiquez votre ville dans votre demande WhatsApp.'],
      ['Comment utiliser chaque produit ?', 'Suivez les indications et la portion inscrites sur l’emballage de chaque produit. N’hésitez pas à nous demander les informations disponibles.'],
      ['Comment vérifier la disponibilité ?', 'Contactez-nous sur WhatsApp en précisant le produit souhaité. Nous vous confirmerons sa disponibilité.'],
    ],
  },
  contact: {
    eyebrow: 'UNE QUESTION ?', title: ['Parlons de votre', 'routine.'] as [string, string],
    text: 'Prix, conseils d’utilisation ou commande : Kimi vous répond ici. Pour le reste, notre équipe reste joignable sur WhatsApp.', cta: 'Discuter avec Kimi', whatsapp: 'Écrire à l’équipe sur WhatsApp',
  },
  product: {
    home: 'Accueil', essentials: 'Nos essentiels', zoom: (name: string) => `Agrandir l’image de ${name}`, enlarge: 'Agrandir',
    format: 'Format', quantity: 'Quantité', less: 'Réduire la quantité', more: 'Augmenter la quantité', order: 'Commander avec Kimi',
    usage: 'Conseils d’utilisation',
    benefits: 'LES BIENFAITS',
    benefitsNote: 'Ces informations ne remplacent pas un avis médical et les résultats peuvent varier d’une personne à l’autre. Si vous avez un problème de santé, suivez un traitement médical, êtes enceinte ou allaitez, veuillez consulter votre médecin avant de consommer ce produit.',
    skincareNote: 'Soin cosmétique à usage externe. Consultez les précautions figurant sur le conditionnement.',
    supplementNote: 'Les compléments alimentaires ne remplacent pas une alimentation variée et un mode de vie sain.',
    moreEyebrow: 'À DÉCOUVRIR AUSSI', moreTitle: ['Composez votre', 'routine.'] as [string, string],
    lightbox: (name: string) => `Image agrandie de ${name}`, closeImage: 'Fermer l’image',
    notFound: 'Ce produit n’a pas été trouvé.', backHome: 'Retour à l’accueil',
  },
  beforeAfter: {
    eyebrow: 'AVANT / APRÈS', title: ['Le duo', 'en images.'] as [string, string],
    text: 'Des visages avant et après l’utilisation du duo Collagène + Glutathion. Touchez une image pour l’agrandir.',
    note: 'Résultats individuels, non garantis : ils varient d’une personne à l’autre. Ces produits ne sont pas des médicaments et ne remplacent pas un avis médical.',
    enlarge: (n: number) => `Agrandir la comparaison avant et après numéro ${n}`,
    alt: (n: number) => `Comparaison avant et après numéro ${n}, duo Collagène + Glutathion Sculpt Move`,
  },
  footer: {
    tagline: 'La beauté commence aussi de l’intérieur.', explore: 'Explorer', info: 'Informations',
    legal: 'Mentions légales',
    shipping: 'Expédition partout au Cameroun et dans la sous-région.',
  },
  legal: {
    eyebrow: 'INFORMATIONS', title: 'Mentions légales', updated: 'Dernière mise à jour : 31 octobre 2026',
    publisher: 'Éditeur du site', host: 'Hébergement',
    labels: { brand: 'Marque', company: 'Dénomination sociale', form: 'Forme juridique', rccm: 'RCCM', niu: 'NIU', director: 'Responsable de la publication', address: 'Adresse', email: 'E-mail', whatsapp: 'WhatsApp', site: 'Site' },
    sections: [
      { title: 'Produits', text: ['Les informations présentées sur ce site reprennent celles des conditionnements. Elles ne remplacent ni les indications figurant sur l’emballage ni l’avis d’un professionnel de santé.', 'Si vous avez un problème de santé, suivez un traitement médical, êtes enceinte ou allaitez, veuillez consulter votre médecin avant de consommer ou d’utiliser nos produits.', 'Les compléments alimentaires ne remplacent pas une alimentation variée et un mode de vie sain. Les soins cosmétiques sont réservés à l’usage externe.'] },
      { title: 'Commandes et prix', text: ['Les prix sont indiqués en francs CFA (FCFA), hors frais de livraison. Les frais et les délais de livraison sont confirmés sur WhatsApp selon votre ville.', 'Le site ne propose pas de paiement en ligne. Le message préparé depuis votre sélection est une demande : il ne vaut pas confirmation de commande. La commande est confirmée par Sculpt Move, après vérification de la disponibilité.'] },
      { title: 'Données personnelles', text: ['Le site n’utilise ni compte client, ni outil publicitaire ou de mesure d’audience. Votre sélection, votre langue et votre thème sont enregistrés uniquement dans votre navigateur ; vous pouvez les effacer depuis ses réglages.', 'Lorsque vous nous écrivez sur WhatsApp ou par e-mail, nous recevons les informations que vous transmettez (numéro ou adresse, ville, produits demandés). Elles servent uniquement à vous répondre et à traiter votre demande. WhatsApp applique sa propre politique de confidentialité.', 'Les polices de caractères sont chargées depuis Google Fonts : votre adresse IP est donc transmise à Google lors de l’affichage du site.', 'Kimi, la conseillère beauté virtuelle du site, est une intelligence artificielle. Pour répondre, vos messages sont transmis par notre serveur à Google (Gemini) ou, si besoin, à Groq. Sculpt Move ne les conserve pas sur son site ; ils restent dans votre navigateur le temps de la session. Si vous envoyez une commande sur WhatsApp, votre message contient aussi cette discussion, que vous pouvez relire et modifier avant l’envoi. Ces services appliquent leurs propres conditions et, dans le cadre de leur offre gratuite, Google peut utiliser ces contenus pour améliorer ses produits : n’indiquez donc pas d’informations personnelles ou médicales. Les questions de santé reconnues par le site reçoivent une réponse automatique sans être transmises. Les réponses de Kimi peuvent comporter des erreurs et ne constituent pas un avis médical.', 'Pour consulter, corriger ou supprimer vos données, écrivez-nous à l’adresse e-mail indiquée ci-dessus.'] },
      { title: 'Propriété intellectuelle', text: ['La marque Sculpt Move, son logo, les textes, les photos et les vidéos de ce site sont protégés. Toute reproduction ou réutilisation sans l’accord préalable de Sculpt Move est interdite.'] },
    ],
  },
}

export type Copy = typeof fr

const en: Copy = {
  htmlTitle: 'SCULPT MOVE — Beauty also starts from within',
  skip: 'Skip to content',
  brandHome: 'SCULPT MOVE, home',
  nav: { label: 'Main navigation', home: 'Home', products: 'Our products', duo: 'The beauty duo', tips: 'Advice', delivery: 'Delivery', shop: 'The shop', contact: 'Contact', open: 'Open menu', close: 'Close menu' },
  prefs: { language: 'Language', toDark: 'Switch to dark mode', toLight: 'Switch to light mode' },
  header: { selection: 'My selection', cartLabel: (n: number) => `Open selection, ${n} item${n === 1 ? '' : 's'}` },
  wa: {
    delivery: 'Hello Sculpt Move, I would like to know the delivery fees and times for my city: ',
    shop: 'Hello Sculpt Move, I would like to visit the shop. Could you give me the exact address and opening hours?',
    contact: 'Hello Sculpt Move, I would like some information about your products.',
    footer: 'Hello Sculpt Move, I would like to get in touch.',
    product: (name: string) => `Hello Sculpt Move, I would like some information about ${name}. Please confirm availability.`,
    order: (lines: OrderLine[], total: string, city: string) => `Hello Sculpt Move, I would like to order:\n${lines.map((line) => `• ${line.name} — quantity: ${line.quantity} — ${line.price}`).join('\n')}\nTotal: ${total} (excluding delivery)\nMy city: ${city || '[city]'}\nPlease confirm availability and delivery details.`,
  },
  card: { view: 'View product', add: 'Add to my selection' },
  toast: 'Added to your selection',
  cartReminder: { text: (n: number) => `You already have ${n} item${n === 1 ? '' : 's'} in your selection`, view: 'View' },
  cart: {
    eyebrow: 'Your selection', title: 'My routine', close: 'Close cart',
    emptyTitle: 'Your selection is empty', emptyText: 'Add an essential to prepare your WhatsApp request.', discover: 'Discover the products',
    less: (name: string) => `Decrease quantity of ${name}`, more: (name: string) => `Increase quantity of ${name}`, remove: (name: string) => `Remove ${name}`,
    total: 'Total', excl: 'excluding delivery',
    city: 'Your city', cityHint: '(in Cameroon or the sub-region)', cityPlaceholder: 'e.g. Douala, Yaoundé, Libreville…',
    note: 'Shipping across Cameroon and the sub-region. Your request will be sent to Sculpt Move to confirm availability, delivery fees and timing.',
    checkout: 'Prepare the WhatsApp request',
    askKimi: 'A question before ordering? Ask Kimi',
  },
  hero: {
    eyebrow: 'BEAUTY & WELLNESS · SCULPT MOVE', title: ['Your beauty.', 'Your ritual.'],
    discover: 'Discover the essentials', talk: 'Ask Kimi for advice',
    video: 'Sculpt Move animated presentation: collagen, gummies, PDRN cream, shilajit, moringa tea, Pilates pack, Harmony pack and menopause routine. Silent video.',
    film: 'THE SCULPT MOVE FILM', silent: 'SILENT', pauseLabel: 'Pause the video', playLabel: 'Play the video', pause: 'Pause', play: 'Play',
  },
  marquee: ['Multi-Collagène Peptides', 'Glutathion Glow Skin', 'PDRN Repair Cream', 'Beauty Duo', 'Shipping across Cameroon and the sub-region'],
  intro: { text: 'The pleasure of a simple routine, clear information and essentials designed to fit your daily habits.', link: 'Our approach' },
  productsSection: { eyebrow: 'THE SCULPT MOVE ESSENTIALS', title: ['Choose your', 'ritual.'], text: 'Skincare, supplements and accessories to discover the Sculpt Move world. Availability and delivery are simply confirmed on WhatsApp.' },
  kimiBand: {
    eyebrow: 'NEED SOME ADVICE?', title: ['Kimi helps you choose', 'and order.'],
    text: 'Tell her what you are looking for: she answers your questions about the products, then prepares your order, ready to send on WhatsApp.',
    cta: 'Chat with Kimi',
    questions: ['Which product should I choose for my skin?', 'How do I use the PDRN cream?', 'I want to order'],
  },
  delivery: {
    eyebrow: 'DELIVERY & SHIPPING', title: ['Across Cameroon,', 'and the sub-region.'],
    text: 'We ship your essentials from Akwa, Douala, to every part of Cameroon and to countries across the sub-region.',
    steps: [
      ['Douala — Akwa', 'Our starting point, in the heart of Akwa.'],
      ['All of Cameroon', 'Shipping throughout the whole country.'],
      ['The sub-region', 'Shipping to countries across the sub-region.'],
    ],
    note: 'Delivery times and fees are confirmed on WhatsApp for your city.', cta: 'Ask for delivery fees',
  },
  shop: {
    eyebrow: 'OUR SHOP', title: ['Come and see us', 'in Douala.'],
    text: 'Want to discover our products up close? Visit us at the shop: you can place your order right there.',
    cta: 'Ask for the address and hours', note: 'We share the exact address and opening hours on WhatsApp.',
    altFront: 'Front of the Sculpt Move shop, with the logo above the entrance and products in the window',
    altCounter: 'Advisor at the counter of the Sculpt Move shop, in front of the logo and shelves of products',
  },
  duo: {
    alt: 'Sculpt Move Beauty Duo visual: a woman, Multi-Collagène Peptides and Glutathion gummies',
    eyebrow: 'THE BEAUTY DUO', title: ['Two essentials.', 'One routine.'],
    text: 'Glutathion Glow Skin gummies and Multi-Collagène powder, brought together for a routine that suits you.',
    items: [['The gummies', 'A practical format to take anywhere.'], ['The powder', 'To mix into a drink or recipe.']],
    cta: 'Discover the Beauty Duo',
  },
  brand: {
    eyebrow: 'THE SCULPT MOVE WORLD', title: ['Taking care of yourself,', 'your way.'],
    text: 'A routine doesn’t need to be complicated. We believe in consistency, in the pleasure of taking a moment for yourself and in information that is easy to understand.',
    link: 'Learn more', alt: 'Sculpt Move brand visual with a woman and the two products',
    values: [['Consistency', 'Habits that suit you.'], ['Pleasure', 'A ritual that finds its place in your day.'], ['Clarity', 'Simple information, no overblown promises.']],
  },
  guidance: {
    alt: 'Usage tips visual for Glutathion Glow Skin gummies', eyebrow: 'ONE SIMPLE TIP', title: 'Product directions come first.',
    p1: 'Every supplement has its own recommendations. Read the product label and follow the serving size stated on it.',
    p2: 'Need details about a format or how to use it? Kimi helps you find the available information.',
    link: 'Ask Kimi my question',
  },
  faq: {
    eyebrow: 'WE’RE HERE TO HELP', title: ['Frequently asked', 'questions.'], text: 'Need more details? We are here to listen.', contact: 'Contact us',
    items: (prices: string): [string, string][] => [
      ['How do I order?', 'The easiest way: ask Kimi. She answers your questions, notes your products and city, then prepares your WhatsApp message. You can also add products to your selection and prepare your request yourself. Your message is not an order confirmation.'],
      ['Can I order directly at the shop?', 'Yes. You can come to our shop in Akwa, Douala, and order on the spot. Write to us on WhatsApp for the exact address and opening hours.'],
      ['What are the prices?', `${prices}. Delivery fees are confirmed on WhatsApp depending on your city.`],
      ['Do you deliver outside Douala?', 'Yes. We ship from Akwa (Douala) throughout Cameroon and to countries across the sub-region. Delivery times and fees are confirmed according to your destination: include your city in your WhatsApp request.'],
      ['How do I use each product?', 'Follow the directions and serving size printed on each product’s packaging. Feel free to ask us for the available information.'],
      ['How can I check availability?', 'Contact us on WhatsApp and mention the product you want. We will confirm its availability.'],
    ],
  },
  contact: {
    eyebrow: 'A QUESTION?', title: ['Let’s talk about your', 'routine.'],
    text: 'Prices, usage tips or orders: Kimi answers you here. For anything else, our team is available on WhatsApp.', cta: 'Chat with Kimi', whatsapp: 'Write to the team on WhatsApp',
  },
  product: {
    home: 'Home', essentials: 'Our essentials', zoom: (name: string) => `Enlarge the image of ${name}`, enlarge: 'Enlarge',
    format: 'Format', quantity: 'Quantity', less: 'Decrease quantity', more: 'Increase quantity', order: 'Order with Kimi',
    usage: 'How to use',
    benefits: 'BENEFITS',
    benefitsNote: 'This information does not replace medical advice and results may vary from person to person. If you have a health condition, are undergoing medical treatment, are pregnant or are breastfeeding, please consult your doctor before consuming this product.',
    skincareNote: 'Cosmetic product for external use. See the precautions on the packaging.',
    supplementNote: 'Food supplements are not a substitute for a varied diet and a healthy lifestyle.',
    moreEyebrow: 'YOU MAY ALSO LIKE', moreTitle: ['Build your', 'routine.'],
    lightbox: (name: string) => `Enlarged image of ${name}`, closeImage: 'Close the image',
    notFound: 'This product could not be found.', backHome: 'Back to home',
  },
  beforeAfter: {
    eyebrow: 'BEFORE / AFTER', title: ['The duo', 'in pictures.'],
    text: 'Faces before and after using the Collagen + Glutathione duo. Tap an image to enlarge it.',
    note: 'Individual results, not guaranteed: they vary from person to person. These products are not medicines and do not replace medical advice.',
    enlarge: (n) => `Enlarge before and after comparison number ${n}`,
    alt: (n) => `Before and after comparison number ${n}, Sculpt Move Collagen + Glutathione duo`,
  },
  footer: {
    tagline: 'Beauty also starts from within.', explore: 'Explore', info: 'Information',
    legal: 'Legal notice',
    shipping: 'Shipping across Cameroon and the sub-region.',
  },
  legal: {
    eyebrow: 'INFORMATION', title: 'Legal notice', updated: 'Last updated: October 31, 2026',
    publisher: 'Site publisher', host: 'Hosting',
    labels: { brand: 'Brand', company: 'Company name', form: 'Legal form', rccm: 'RCCM', niu: 'NIU', director: 'Publication manager', address: 'Address', email: 'Email', whatsapp: 'WhatsApp', site: 'Website' },
    sections: [
      { title: 'Products', text: ['The information on this site is taken from the packaging. It does not replace the directions on the packaging or the advice of a healthcare professional.', 'If you have a health condition, are undergoing medical treatment, are pregnant or are breastfeeding, please consult your doctor before consuming or using our products.', 'Food supplements do not replace a varied diet and a healthy lifestyle. Skincare products are for external use only.'] },
      { title: 'Orders and prices', text: ['Prices are shown in CFA francs (FCFA), excluding delivery. Delivery fees and times are confirmed on WhatsApp according to your city.', 'The site does not offer online payment. The message prepared from your selection is a request and is not an order confirmation. Sculpt Move confirms the order after checking availability.'] },
      { title: 'Personal data', text: ['The site has no customer account and no advertising or audience measurement tool. Your selection, language and theme are stored only in your browser; you can clear them in its settings.', 'When you contact us on WhatsApp or by email, we receive the information you send (number or address, city, requested products). It is used only to reply to you and handle your request. WhatsApp applies its own privacy policy.', 'Fonts are loaded from Google Fonts, so your IP address is sent to Google when the site is displayed.', 'Kimi, the site’s virtual beauty advisor, is an artificial intelligence. To reply, your messages are sent by our server to Google (Gemini) or, if needed, to Groq. Sculpt Move does not keep them on its site; they stay in your browser for the session. If you send an order on WhatsApp, your message also includes this chat, which you can review and edit before sending. These services apply their own terms and, under its free tier, Google may use this content to improve its products, so please do not share personal or medical information. Health questions recognised by the site receive an automatic reply without being sent. Kimi’s replies may contain mistakes and are not medical advice.', 'To access, correct or delete your data, write to us at the email address shown above.'] },
      { title: 'Intellectual property', text: ['The Sculpt Move brand, its logo and the texts, photos and videos on this site are protected. Any reproduction or reuse without the prior consent of Sculpt Move is prohibited.'] },
    ],
  },
}

const LANG_KEY = 'sculpt-move-lang'

function initialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (fromUrl === 'fr' || fromUrl === 'en') return fromUrl
  try {
    const stored = localStorage.getItem(LANG_KEY)
    if (stored === 'fr' || stored === 'en') return stored
  } catch { /* stockage indisponible */ }
  return /^en\b/i.test(navigator.language) ? 'en' : 'fr'
}

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>(initialLang)
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  const setLang = (next: Lang) => {
    if (next === lang) return
    try { localStorage.setItem(LANG_KEY, next) } catch { /* stockage indisponible */ }
    withViewTransition('lang', () => flushSync(() => setLangState(next)))
  }
  return useMemo(() => {
    const products = productsFor(lang)
    const price = (value: number | null) => formatPrice(value, lang)
    return { lang, setLang, t: lang === 'en' ? en : fr, products, price }
  }, [lang])
}

export type I18n = ReturnType<typeof useLanguage>
export const I18nContext = createContext<I18n | null>(null)
export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n doit être utilisé dans I18nContext')
  return value
}
