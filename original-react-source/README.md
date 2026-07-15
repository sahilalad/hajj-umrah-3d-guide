# Hajj & Umrah 3D Guide - English + Gujarati

A functional React/Vite PWA prototype for an interactive Hajj and Umrah learning experience based on the uploaded Gujarati book **Hajj ane Umra na Masail**.

## Implemented

- Interactive Three.js Kaaba scene with orbit controls and animated Tawaf markers
- Guided Umrah journey
- Guided day-by-day Hajj journey
- Complete mapped chapter index from the uploaded book's table of contents
- Original scanned Gujarati PDF embedded as the primary source
- English / Gujarati switching
- Arabic dua cards with transliteration, Gujarati pronunciation and meaning
- Browser speech synthesis for English, Gujarati and Arabic
- Local progress, chapter/step bookmarks, favourite duas and private notes
- Export/import of all local data without an account
- Basic offline PWA service worker
- Responsive desktop, tablet and mobile layout

## Important editorial status

The user requested that the final content follow the uploaded book exactly and that references be verified and corrected where necessary. The application architecture supports this workflow, but the complete 243-page Gujarati transcription, full English translation and reference-by-reference verification are **not yet complete**. Chapters without a completed editorial layer open the exact scanned source page and display a clear verification notice rather than invented content.

The `duas.ts` file includes a small starter set. Items marked `review` must be compared against the scanned book and verified before publication.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Content workflow

1. Transcribe one chapter from the scanned Gujarati source.
2. Preserve the Gujarati meaning and rulings exactly.
3. Translate the same chapter into clear English.
4. Verify every Quran reference and Arabic verse.
5. Verify every hadith collection/reference and note numbering variants.
6. Mark the chapter publish-ready only after a second review.
7. Add the final content in structured JSON/TypeScript data files.

## Audio notes

The current implementation uses the browser's built-in Web Speech API. Voice quality and Gujarati/Arabic voice availability depend on the device. Production can later use reviewed pre-recorded audio files without changing the page structure.
