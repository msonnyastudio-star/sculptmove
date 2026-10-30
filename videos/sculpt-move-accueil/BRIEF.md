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
