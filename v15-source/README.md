# V15 Live Website Source

This directory is the canonical source for the website deployed at:

`https://sahilalad.github.io/hajj-umrah-3d-guide/`

It is the same static Three.js application currently served by GitHub Pages. The older `original-react-source/` directory is an earlier React prototype and is not the source of the main live V15 website.

## Runtime files

- `index.html` — live page markup and controls
- `styles.css` — complete responsive interface styles
- `photo-resilience.js` — Wikimedia retry, optimized delivery, and local illustration fallback
- `compat.js` — browser compatibility and startup fallback
- `app-v14.js` — V15 entry loader and guided route-camera patch
- `app-v11.js` — corrected Kaaba and Masjid al-Haram geometry
- `app-v10.js` — geographic sacred-sites scene and detailed models
- `app-v5.js` — base bilingual data, UI, interaction, route, and Three.js application

The loader chain is intentionally preserved because this is an exact copy of the deployed V15 application:

`index.html → app-v14.js → app-v11.js → app-v10.js → app-v5.js`

## Run locally

The application must be served over HTTP because it dynamically loads JavaScript modules and source files.

```bash
cd v15-source
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deployment

`.github/workflows/pages.yml` deploys this directory to the main GitHub Pages URL after every push to `main`. It also builds the older React prototype separately under `/react-app/` for comparison.
