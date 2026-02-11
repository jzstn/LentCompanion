# Fasting Companion

A Vite + React + TypeScript + Tailwind app for recording fasting-related entries and exploring a Journey Map with Timeline, Reflections, and Insights views.

## Features

- **Recorder flow** with confirmation modal and selectable chips.
- **Chip constraints**:
  - Journal entries: max 2 chips
  - Prayer entries: max 2 chips
- **Journey Map** with three views:
  - Timeline
  - Reflections
  - Insights
- **Entry detail modal** with in-place notes updates.
- **Local storage persistence** with seed entries.

## Run locally

```bash
npm install
npm run dev
```

## Test

```bash
npm test
```

## Netlify deployment

This app is a client-side routed SPA, so Netlify needs a fallback to `index.html`.

Included in this repo:

- `netlify.toml` with build/publish settings and SPA redirect
- `public/_redirects` with `/* /index.html 200`

If you still see a 404 on Netlify, verify the site is pointing at this repository root and that publish directory is `dist`.
