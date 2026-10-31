---
workflow: product-launch-video
flow: automation
storyboard: no
mode: autonomous
message: "Votre beauté, votre rituel : les essentiels Sculpt Move de l’intérieur à l’extérieur."
destination: website
aspect: 1920x1080
language: fr
length: 20s
angle: editorial-product-reveal
narration: no
music: none
---

## Intent
Demande utilisateur : « ajoute cette cream aussi et fait une video de presentation en motion design sans son pour l’accueil du site avec des jolis textes, fais-le avec HyperFrames ».
Créer une vidéo réellement rendue puis intégrée à l’accueil du site existant. Le rendu local et son intégration sont couverts par cette demande. Aucun déploiement.

## Stated requirements
- Ajouter PDRN Repair Cream, photo fournie, au catalogue et au panier WhatsApp.
- Motion design, textes français soignés, sans narration, musique ni effets sonores.
- Utiliser HyperFrames et présenter la marque et ses produits sur l’accueil.

## Decisions for this build
- 20 secondes en boucle, 1920 × 1080 pour ordinateur et 1080 × 1350 pour mobile.
- Direction éditoriale beauté : violet profond, or, ivoire et rose, titres sérif et textes sans sérif.
- Quatre plans : marque ; collagène et gummies ; nouvelle crème ; collection et signature.
- Animation de lignes de titres, déplacement doux des cadres photo, repères graphiques et transitions de panneaux.
- Prix sur demande, aucune promesse de résultat ni allégation de santé ajoutée.
- Les visuels produits sont ceux de l’utilisateur, recadrés dans les cadres HTML sans modifier leurs fichiers.
- Lecture muette en boucle, contrôle pause et respect de la préférence de mouvement réduit.

## Assets
Sources locales : ../../public/images/{sculpt-move-duo,multi-collagene,glutathion-glow-skin,pdrn-repair-cream}.jpg.
L’image de crème originale est conservée dans public/images/pdrn-repair-cream.jpg.

## Révision v2 — 29 octobre 2026
Demande utilisateur : « refais le motion design qui a été fait avec HyperFrames pour l'accueil, car ce que Codex a fait n'est pas pro ».
Même film (même workflow, mêmes formats 1920 × 1080 et 1080 × 1350, 20 s, muet, en boucle). Diagnostic de la v1 : affiches publicitaires entières posées en petites vignettes avec leurs textes incrustés, fondus et glissements génériques, plans figés après l'entrée, dernière seconde sur un écran vide.
Décisions v2 :
- Cinq scènes au lieu de quatre : ouverture / collagène / gummies / crème PDRN / collection + signature.
- Les photos sont recadrées sur leurs zones purement photographiques (visage, pots, gélules, texture) et agrandies en Lanczos dans `assets/v2/` ; les originaux de `public/images/` restent intacts.
- Grammaire unique : volets masqués avec filet doré au front du volet, plan sortant qui accompagne le mouvement (même courbe), titres révélés ligne par ligne dans des masques, images qui se posent (échelle 1,3 → 1), resserrement d'interlettrage par lettre, un reflet lumineux unique sur le produit.
- Boucle parfaite : la dernière image (signature SM sur prune) est identique à la première.
- La v1 est archivée dans `archive/v1/`.

## Révision v2.1 — 30 octobre 2026 : version anglaise
Demande utilisateur : le site passe en bilingue (français / anglais).
Le film v2 reçoit une version anglaise identique en tout point sauf les textes : mêmes scènes, mêmes durées, mêmes formats (1920 × 1080 et 1080 × 1350), muet, en boucle. Les noms de produits restent ceux des emballages (Multi-Collagène Peptides, Glutathion Glow Skin, PDRN Repair Cream). Le site charge la version de la langue choisie.

## Révision v3 — 30 octobre 2026 : demande de film 3D (en attente)
Demande utilisateur : film d'accueil en 3D, en 16:9 : boîtes des produits qui s'ouvrent et pivotent à 360°, contenus qui en sortent, une femme en train de boire, titres 3D très colorés, mélange 3D / 2D, les trois produits mis en valeur.
Trois pistes proposées dans `STORYLINES.md` (recommandation : A). Rien n'est construit avant le choix de la piste, de la source pour la femme qui boit et des photos de dos des emballages. Le film v2 reste en ligne sur le site jusque-là.

## Révision v4 — 31 octobre 2026 : un produit par scène
Demande utilisateur : « ces photos doivent communiquer séparément, ne doivent pas être regroupées comme un bloc, car ce sont des produits différents que Sculpt Move propose ; crée du motion design HyperFrames en 2D dans l'accueil et anime bien les éléments ».
Onze scènes de 3,2 s ajoutées avant la collection (la citation de la scène 14 reste 1,4 s de plus), film de 56,6 s, boucle conservée. Chaque visuel a son univers de couleurs, sa transition et son geste 2D dessiné : montagnes et lune (shilajit), vapeur et feuilles (thé), trois volets (pack), bande élastique (Pilates), soleil et lune (routine), jours de la semaine, étoiles et gouttes (Harmonie nuit), lotus (Harmonie jour), rayons (duo), citation mot à mot et lavande (ménopause), trois flacons révélés tour à tour (essentiels).
Décisions :
- Les affiches sont recadrées sur les produits, comme en v2 ; tous les textes sont recomposés et animés.
- Ne sont pas repris : les silhouettes avant / après, « Perte de poids rapide », « Supprime l'appétit », « Réduit les graisses », « Équilibre hormonal » et les autres promesses d'effet. Les textes s'en tiennent aux noms, formats, prix fournis (8 000 F et 25 000 F) et aux phrases sans promesse des visuels.
- Le visuel Pack Harmonie et le visuel Ménopause fournis en double gardent chacun leur propre scène.
- « Trois essentiels » devient « Tout un univers » à la scène de collection, qui suit maintenant onze autres produits.
- Les produits montrés ont aussi leur fiche dans « Nos produits » (`src/config.ts`), sauf le visuel de routine matin / soir, qui concerne les gummies et le collagène déjà au catalogue.

## Révision v2.2 — 31 octobre 2026 : vrai logo
Demande utilisateur : « ce n'est pas le vrai logo du site, il y a déjà le vrai logo, donc il faut ça dans le motion design ».
Le monogramme « SM » composé en Cormorant est remplacé par le vrai logo (`public/images/sculpt-move-logo.jpg`, détouré dans `assets/logo/sculpt-move-logo.png`) à l'ouverture et à la fermeture, dans les quatre versions. Le logo est violet : il serait illisible sur le fond prune, la signature passe donc sur fond ivoire, en gardant ses couleurs d'origine. Durées et scènes inchangées, la boucle reste parfaite.
