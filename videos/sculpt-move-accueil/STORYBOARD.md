---
format: 1920x1080
duration: 20s
message: "Votre beauté, votre rituel : de l’intérieur à l’extérieur."
arc: "Signature → Routine intérieure → Soin extérieur → Collection"
audience: "Visiteurs du site Sculpt Move"
mode: autonomous
music: none
---

## Video direction
Un éditorial beauté en mouvement, avec une typographie généreuse et les vraies photos produits. Quatre plans de 5 secondes. Violet profond dominant, alternance avec des panneaux ivoire/rose. Des cadres de photos glissent et se posent, puis une ligne de texte complémentaire s’inscrit au second temps. Le texte reste au-dessus de 83% de la hauteur, bas réservé aux commandes vidéo du site. Zéro piste audio. Les plans gardent une réserve pour respirer et lire. La dernière image retrouve le violet de l’ouverture. Version portrait construite avec les mêmes scènes : container queries, titre dans le tiers supérieur, photos dans la moitié inférieure, lecture sans recadrage du titre.

## Frame 1 — Votre rituel
- status: animated
- src: compositions/frames/01-signature.html
- duration: 5s
- poster: 3.2s
- transition_in: cut
- scene: "Votre beauté. Votre rituel."
- type: hook
- blueprint: compose
- motion_rules: svg-path-draw
- asset_candidates: assets/sculpt-move-duo.jpg
- focal: assets/sculpt-move-duo.jpg
- roles: "Affiche duo = hero photo ; titre = premier niveau ; règle dorée = accent"

Scene 1 (0–1.2s): fond violet solide et signature SCULPT MOVE déjà visible en haut à gauche. Deux lignes de très grand titre ivoire/doré « Votre beauté. » puis « Votre rituel. » arrivent de la gauche dans leurs masques, adaptées du composant registry line-by-line-slide. Composition asymétrique : texte à gauche, photo encore en retrait à droite.
Scene 2 (1.2–2.8s): la photo verticale de la femme et du duo rejoint le panneau droit, petite rotation qui se redresse, transform-only. Cadre ivoire, produits et visage entiers. Une courbe/ligne SVG dorée se dessine près du titre. « De l’intérieur à l’extérieur. » s’inscrit en petit à partir de 2.4s.
Scene 3 (2.8–5s): un cartouche « BEAUTÉ & BIEN-ÊTRE » arrive à 3.2s. Maintien de lecture ensuite. Aucun autre slogan ni allégation. En portrait : titre au-dessus, photo verticale en dessous à droite, petit monogramme à gauche ; contenu toujours avant 83% de la hauteur.

## Frame 2 — De l’intérieur
- status: animated
- src: compositions/frames/02-duo.html
- duration: 5s
- poster: 3.4s
- transition_in: push-slide LEFT 0.65s
- scene: "De l’intérieur…"
- type: product_intro
- blueprint: compose
- motion_rules: waterfall-entry
- asset_candidates: assets/multi-collagene.jpg, assets/glutathion-glow-skin.jpg
- focal: assets/multi-collagene.jpg
- roles: "Collagène = photo principale ; gummies = photo secondaire ; titres = hiérarchie"

Scene 1 (0–1.3s): fond ivoire, mot de marque violet au même point d’ancrage. Titre « De l’intérieur… » grand, violet, haut/gauche. Photo collagène dans un panneau photo vertical à droite et photo gummies légèrement en retrait. Le collagène entre depuis le bas, la photo gummies arrive depuis le bord droit avec une rotation opposée très modérée.
Scene 2 (1.3–3.3s): « Multi-Collagène » et « Gummies Glutathion » entrent en deux temps, waterfall-entry depuis le bas, étiquettes séparées ancrées aux deux cadres. « Deux formats, un même rituel. » se révèle à 2.6s. Les clichés sont entièrement visibles dans les cadres, sans étirement.
Scene 3 (3.3–5s): petit index « 01 / LE DUO BEAUTÉ » doré et fin trait arrivent à 3.4s, puis temps de lecture fixe. Portrait : grand titre au-dessus, photos côte à côte sous le titre, labels sous les cadres, échelle de texte adaptée.

## Frame 3 — La nouvelle crème
- status: animated
- src: compositions/frames/03-creme.html
- duration: 5s
- poster: 3.5s
- transition_in: push-slide LEFT 0.65s
- scene: "… à l’extérieur."
- type: feature_showcase
- blueprint: compose
- motion_rules: svg-path-draw
- asset_candidates: assets/pdrn-repair-cream.jpg
- focal: assets/pdrn-repair-cream.jpg
- roles: "Photo crème supérieure gauche = panneau principal ; nom et format = preuve produit"

Scene 1 (0–1.5s): fond rose/ivoire doux, titre géant violet « … à l’extérieur. » à gauche, badge violet « NOUVEAU » au-dessus. À droite une fenêtre photo paysage recadre seulement le panneau supérieur gauche de la planche : pot et boîte entiers dans un cadre. Masquage CSS statique ; animation du cadre depuis la droite, rotation modérée vers zéro.
Scene 2 (1.5–3.4s): « PDRN Repair Cream » entre sur deux lignes généreuses, puis « Gel-crème en capsules » et « 50 g » à 2.5s. Un arc doré au trait contourne la fenêtre photo, svg-path-draw. Aucun bénéfice de santé ou efficacité n’est ajouté.
Scene 3 (3.4–5s): « Un nouveau geste dans votre routine. » arrive à 3.5s. Maintien de lecture. Portrait : photo dans un grand cadre horizontal entre 36% et 70% de hauteur, titres au-dessus, nom et format sous la photo, zone basse libre. Ne pas réduire la photo au point de rendre le pot minuscule.

## Frame 4 — La collection
- status: animated
- src: compositions/frames/04-collection.html
- duration: 5s
- poster: 3.3s
- transition_in: push-slide LEFT 0.65s
- scene: "Une routine qui vous ressemble."
- type: cta
- blueprint: compose
- motion_rules: waterfall-entry
- asset_candidates: assets/multi-collagene.jpg, assets/glutathion-glow-skin.jpg, assets/pdrn-repair-cream.jpg
- focal: assets/pdrn-repair-cream.jpg
- roles: "Trois cadres produits = collection ; titre = signature finale"

Scene 1 (0–1.5s): retour au violet profond. Trois cadres photos sur une ligne à droite, grille décalée ; collage crème dans le panneau de droite recadré sur la moitié supérieure, photos collagène et gummies entières. Cadres entrent l’un après l’autre avec des décalages y et des rotations qui se redressent. À gauche, « Trois essentiels. » grand titre ivoire.
Scene 2 (1.5–3.4s): « Une routine qui vous ressemble. » en sérif doré se révèle en deux lignes, adaptée du composant line-by-line-slide. Puis cartouche « DÉCOUVRIR SCULPT MOVE » à 2.8s. Les noms des trois produits arrivent en cascade sous les cadres. Portrait : titre centré en haut, triptyque de photos dans le milieu, étiquettes assez grandes, signature sous le triptyque.
Scene 3 (3.4–5s): maintien lisible jusqu’à 4.3s. De 4.3 à 4.85s, les cadres et les grandes phrases se dissolvent doucement sur le violet. Seule la signature de marque déjà présente en haut gauche demeure, au même endroit que l’ouverture. Le dernier état est le violet de marque, jamais noir, pour relancer la boucle.

---

# v2 — 29 octobre 2026 (remplace les plans v1 ci-dessus)

Format 1920 × 1080 (portrait 1080 × 1350 par container queries), 20 s, 30 i/s, muet, boucle.

## Video direction
- Palette : prune #321044 (dégradé radial #41185a → #240a31), ivoire #fbf7f0, rose #f2dce3, lilas #eee5f3, or #c59a52 / #d0ad66 / #d6b06a ; or foncé #835a22 pour les petits textes sur fonds clairs.
- Typo : Cormorant Garamond 500 (titres, italique doré ou prune pour l'accent), Montserrat 500 capitales espacées pour les mentions.
- Mouvement : courbes longues (power4.out / expo.out), aucun rebond ; chaque scène révèle titre → nom → mention → vignette en cascade, puis tient la lecture. Seule vie pendant la tenue : un reflet lumineux unique.
- Transitions : volet masqué 0,85 s power4.inOut avec filet doré lumineux au front ; le plan sortant glisse de 10 % dans la même direction (racine `index.html`).
- Zone basse (~10 %) laissée libre pour les commandes vidéo du site.
- Interdits : affiches entières avec leur texte incrusté, fondus génériques, respiration en boucle, fin sur écran vide.

## Plans
| # | Fichier | Début | Durée hôte | Fond | Contenu |
|---|---|---|---|---|---|
| 1 | compositions/frames/01-ouverture.html | 0,0 | 4,7 | ivoire → prune | Vrai logo Sculpt Move sur ivoire, qui traverse l'écran (zoom-through) ; volet ivoire descendant, portrait ouvert depuis une fente centrale, « Votre beauté, / votre rituel. », « DE L'INTÉRIEUR À L'EXTÉRIEUR » |
| 2 | compositions/frames/02-collagene.html | 3,8 | 4,8 | ivoire + bloc rose | Volet montant ; « De / l'intérieur. », Multi-Collagène Peptides, pot en panneau, geste en incrustation, reflet |
| 3 | compositions/frames/03-gummies.html | 7,7 | 4,8 | lilas | Volet latéral ; photo plein cadre, « Le duo / beauté. », Glutathion Glow Skin, vignette du Beauty Duo |
| 4 | compositions/frames/04-creme.html | 11,6 | 5,0 | prune | Volet montant ; badge NOUVEAU, « … à / l'extérieur. », PDRN Repair Cream, mosaïque pot / étui / gélules / texture, ingrédients du conditionnement |
| 5 | compositions/frames/05-collection.html | 15,7 | 4,3 | ivoire | Volet latéral ; « Trois essentiels, / un seul rituel. », trois cartes produit ; volet ivoire descendant et vrai logo recomposé (= image 0) |

## Révision v2.1 — 30 octobre 2026 : version anglaise
Générée par `node prepare-release.mjs` dans `en/` (paysage) et `en-mobile/` (portrait) à partir des scènes françaises, par la table `ENGLISH` du script. Aucune scène n'est éditée à la main dans ces dossiers.

| # | Français | Anglais |
|---|---|---|
| 1 | Votre beauté, / *votre rituel.* — DE L'INTÉRIEUR À L'EXTÉRIEUR | Your beauty, / *your ritual.* — FROM THE INSIDE OUT |
| 2 | De / *l'intérieur.* — POUDRE · SAVEUR FRUITS ROUGES | From / *the inside.* — POWDER · RED BERRY FLAVOUR |
| 3 | Le duo / *beauté.* — GUMMIES · FLACON DE 60 — Collagène + Glutathion | Beauty / *duo.* — GUMMIES · BOTTLE OF 60 — Collagen + Glutathione |
| 4 | NOUVEAU — … à / *l'extérieur.* — GEL-CRÈME EN CAPSULES · POT DE 50 G | NEW — … to / *the outside.* — GEL-CREAM CAPSULES · 50 G JAR |
| 5 | Trois essentiels, / *un seul rituel.* — LES ESSENTIELS SCULPT MOVE | Three essentials, / *one ritual.* — THE SCULPT MOVE ESSENTIALS |

Scène 3 : « The beauty / duo. » passait sous la carte produit en portrait ; le titre anglais est raccourci en « Beauty / *duo.* ».
