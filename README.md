# Fasting Companion

Vite + React + TypeScript + Tailwind prototype focused on a guided fasting/prayer/journal workflow.

## App structure

- **Tabs:** Today, Journey Map, Library, Profile
- **Journey Map sections:** Timeline, Reflections, Insights
- **Confirmation Recorder:**
  - Journal chips selectable, max 2
  - Prayer fruit selectable, max 2
  - FAST and PRAYER have required fields before save
- **Entry detail modal** for viewing stored structured event payloads
- **Local storage persistence** with seeded demo events

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

This app is a client-side routed SPA and includes fallback rules to `index.html`:

- `netlify.toml` redirect + build/publish settings
- `public/_redirects` with `/* /index.html 200`
