# Hajj & Umrah 3D Guide — Clean V15 Source

This repository is the single maintainable source for the live GitHub Pages website.

The previous `app-v5.js → app-v10.js → app-v11.js → app-v14.js` runtime patch chain has been removed. All V15 behavior is integrated into normal source modules under `src/`.

## Project structure

```text
.
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js
│   ├── app.js
│   ├── photoGallery.js
│   ├── styles.css
│   ├── data/
│   │   ├── index.js
│   │   ├── ui.js
│   │   ├── shared.js
│   │   ├── hajj.js
│   │   └── haram.js
│   └── three/
│       ├── helpers.js
│       ├── kaaba.js
│       ├── siteModels.js
│       └── scenes.js
└── .github/workflows/pages.yml
```

## Local development

```bash
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## Validate and build

```bash
npm run check
npm run build
npm run preview
```

The production website is generated in `dist/`.

## GitHub Pages

Every push to `main` runs the Pages workflow. It installs dependencies, validates the source, builds the Vite application, uploads `dist/`, and deploys it to:

`https://sahilalad.github.io/hajj-umrah-3d-guide/`

## Included V15 behavior

- Sacred Sites and detailed Masjid al-Haram 3D views
- Corrected Kaaba door-side orientation
- Hajar al-Aswad, Rukn al-Yamani, Multazam, Hatim/Hijr Ismail, Mizab and Maqam Ibrahim
- Correctly oriented miniature Haram in the Sacred Sites view
- Automatic guided route-camera following
- Manual camera control after pausing or moving the route slider
- English and Gujarati interface and location content
- Wikimedia image retries, optimized delivery and local illustrated fallbacks
- Local completion tracking without an account
- Responsive desktop and mobile layout

## Editorial status

This is an educational 3D orientation guide. The complete 243-page Gujarati source-book transcription, translation and reference-by-reference religious verification remain separate editorial work and should be completed before treating the app as a complete fiqh reference.
