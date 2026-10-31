# Vérification v4 (un produit par scène) — 31 octobre 2026

- `hyperframes check` : 0 erreur. Avertissements : film muet (choix demandé), petites capitales et lecture : citation de la scène 14 à 3,9 s pour 4,2 s conseillées, derniers noms de la scène 15 entre 1,3 et 1,7 s.
- Boucle : images 0 et 56,567 s comparées sans perte, écart maximal de 1 sur 255 (ordinateur français, mobile anglais).
- Masters des quatre versions : 56,6 s, 1 698 images, sans audio. MP4 web : crf 24 ordinateur, crf 25 mobile. Affiches inchangées.
- Images clés inspectées aux onze nouvelles scènes et à leurs transitions, en paysage et en portrait ; planches tirées des MP4 livrés.
- Site dans Chrome headless : les quatre MP4 se lisent en boucle, muets, durée 56,6 s, aucune erreur console.

---

# Vérification v2.2 (vrai logo) — 31 octobre 2026

- `hyperframes check` : 0 erreur. Avertissements : film muet (choix demandé), petites capitales, et contraste signalé à t = 1,11 s sur le titre encore masqué derrière le volet ivoire.
- Boucle : images 0 et 19,967 s comparées sans perte, écart maximal de 1 sur 255.
- Masters et MP4 web des quatre versions rendus : 20,0 s, 600 images, sans audio. Affiches inchangées (la scène à 3,4 s ne change pas).

---

# Vérification v2.1 (version anglaise) — 30 octobre 2026

- `hyperframes check` sur `en/` et `en-mobile/` : 0 erreur ; contraste WCAG AA 92/92 (paysage) et 89/89 (portrait). Avertissements identiques à la version française (film muet, petites capitales, ligne d'ouverture).
- Images clés inspectées aux quatre scènes de produit dans les deux formats ; titre de la scène 3 raccourci en portrait (chevauchement corrigé).
- Masters : `renders/sculpt-move-accueil-en-master.mp4` et `renders/sculpt-move-mobile-en-master.mp4`, 20,0 s, sans audio.
- MP4 web (mêmes réglages que le français : crf 22 ordinateur, crf 23 mobile) : `sculpt-move-accueil-en.mp4` 2708139 octets, `sculpt-move-mobile-en.mp4` 2276867 octets ; affiches `-en` extraites à 3,4 s.
- Site vérifié dans Chrome headless : le passage en anglais charge `sculpt-move-accueil-en.mp4`, aucune erreur console.

---

# Vérification v2 — 29 octobre 2026

- `hyperframes check` ordinateur et portrait : 0 erreur de lint, d'exécution, de disposition ou de mouvement ; contraste WCAG AA 96/96 (ordinateur) et 93/93 (portrait). Avertissements restants : film muet (choix demandé) et mentions en petites capitales sous 28 px sur la version ordinateur (chrome éditorial).
- Images clés inspectées aux milieux des cinq scènes, autour des quatre volets et pendant la fermeture ; version portrait inspectée séparément.
- Boucle : première et dernière image du master identiques (signature SM sur prune).
- Masters HyperFrames : 1920 × 1080 et 1080 × 1350, 30 i/s, 600 images, 20,000 s, sans piste audio.
- MP4 web (H.264 yuv420p, faststart, sans audio) : ordinateur 2848113 octets, mobile 2335016 octets, copiés dans `public/videos/` ; affiches régénérées à 3,4 s.
- `npm run build` du site : réussi. Lecture dans le navigateur du site non revérifiée pour cette v2 (le composant HeroFilm et les chemins de fichiers sont inchangés).
- v1 archivée dans `archive/v1/`.

---

# Vérification — 29 octobre 2026

- Compilation du site réussie avec `npm.cmd run build` après intégration des deux MP4.
- Contrôles HyperFrames ordinateur et portrait : aucune erreur de syntaxe, d’exécution, de disposition ou de contraste. L’avertissement « film muet » correspond au choix explicite de l’utilisateur.
- Lint de l’éditeur : 0 erreur, 0 avertissement. Les extraits Registry de référence sont conservés en `.html.txt` pour ne pas être traités comme des compositions autonomes.
- Images clés inspectées aux milieux des quatre scènes et autour des trois transitions. Version portrait inspectée séparément.
- Masters réellement rendus par HyperFrames en capture drawElement, GPU matériel ; comparaison automatique des images de rendu réussie.
- MP4 web ordinateur : H.264, 1920 × 1080, 30 fps, durée 20,000 s, 1 629 407 octets, une piste vidéo et aucune piste audio.
- MP4 web mobile : H.264, 1080 × 1350, 30 fps, durée 20,000 s, 1 196 136 octets, une piste vidéo et aucune piste audio.
- Navigateur ordinateur : le MP4 est chargé, lecture automatique active, `muted=true`, `loop=true`, durée 20 s. Le bouton pause arrête la lecture.
- Navigateur à 390 px : le lecteur charge le MP4 portrait 1080 × 1350, reste muet et en boucle ; aucun débordement horizontal. Pause vérifiée sur la vidéo réellement chargée.
- Nouvelle fiche PDRN Repair Cream : format 50 g, informations cosmétique et usage externe. Ajout de 2 unités au panier et URL WhatsApp contenant le nom et la quantité vérifiés. Les articles de vérification ont été retirés.
- Aucun message WhatsApp envoyé. Aucun déploiement effectué.

Les quatre scènes peuvent être modifiées dans `compositions/frames/01-signature.html`, `02-duo.html`, `03-creme.html` et `04-collection.html`.
