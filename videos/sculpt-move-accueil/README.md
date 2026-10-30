# SCULPT MOVE — Film d’accueil (v2)

Film HyperFrames muet de **20 secondes**, 30 images/seconde, en boucle parfaite (la dernière image est identique à la première). Cinq scènes : ouverture, collagène, gummies, crème PDRN, collection + signature. Le site utilise les MP4 optimisés dans `../../public/videos/`.

- Ordinateur : 1920 × 1080, `index.html`.
- Mobile : 1080 × 1350, `mobile/` — généré par `node prepare-release.mjs` à partir des mêmes scènes (adaptation portrait par container queries).
- Anglais : `en/` (1920 × 1080) et `en-mobile/` (1080 × 1350), générés par le même script ; les textes anglais sont dans la table `ENGLISH` de `prepare-release.mjs`. Ne pas éditer ces dossiers à la main.
- Sources éditables : `compositions/frames/01-ouverture.html` … `05-collection.html`. Plan et timing dans `STORYBOARD.md` (section v2).
- Photos : recadrages agrandis dans `assets/v2/`, tirés des visuels fournis (`public/images/`, laissés intacts).
- Polices et GSAP sont locaux, aucune ressource distante n’est nécessaire au rendu.
- La version précédente (v1) est archivée dans `archive/v1/` (compositions en `.html.txt`, rendus et MP4 du site).

## Éditer et vérifier

```powershell
npx.cmd hyperframes preview --background
npm.cmd run check
npx.cmd hyperframes snapshot --at 3.3,7.2,11.1,15.2,18.2,19.95
node prepare-release.mjs
cd mobile; npx.cmd hyperframes check; cd ..
cd en; npx.cmd hyperframes check; cd ..
cd en-mobile; npx.cmd hyperframes check; cd ..
```

## Rendre

Les fichiers temporaires sont placés sur G: pour préserver l’espace disponible sur C:.

```powershell
$env:TEMP = (Join-Path $PWD '.render-temp')
$env:TMP = $env:TEMP
New-Item -ItemType Directory -Force $env:TEMP | Out-Null
npx.cmd hyperframes render --quality delivery --fps 30 --frames-cache-dir off --output renders/sculpt-move-accueil-master.mp4
npx.cmd hyperframes render mobile --quality delivery --fps 30 --frames-cache-dir off --output renders/sculpt-move-mobile-master.mp4
npx.cmd hyperframes render en --quality delivery --fps 30 --frames-cache-dir off --output renders/sculpt-move-accueil-en-master.mp4
npx.cmd hyperframes render en-mobile --quality delivery --fps 30 --frames-cache-dir off --output renders/sculpt-move-mobile-en-master.mp4
```

Les copies web sont encodées en H.264 (yuv420p, `faststart`, sans piste audio ; crf 22 ordinateur, crf 23 mobile) puis copiées dans `../../public/videos/` (suffixe `-en` pour l’anglais). Les affiches `public/images/sculpt-move-film-poster.jpg` et `sculpt-move-film-mobile.jpg` sont extraites des masters à 3,4 s.
