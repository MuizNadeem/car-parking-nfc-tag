# NFC Car Tag Tracker

Static React + Vite app for storing NFC parking scans in browser local storage.

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS
- shadcn/ui

## What it does

- Reads current coordinates directly from the browser Geolocation API.
- Uses the **device/browser timestamp** when a scan is saved.
- Saves valid scans to local storage and keeps only the latest 20 entries.
- Displays a modern mobile-first history UI.
- Opens saved spots directly in Google Maps.
- Resolves a short **place name** from coordinates using [OpenStreetMap Nominatim](https://nominatim.org/) (no API key). Labels are cached in local storage with each scan.
- Supports a history-only mode using `?history=true` to view saved entries without adding a new record.

## Component structure

- `src/components/parking/` contains feature components (`PageHeader`, `LatestSpotCard`, `HistoryCard`).
- `src/components/ui/` contains reusable shadcn/ui primitives.
- `src/App.tsx` handles state and orchestration only.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to GitHub Pages (no Actions required)

This project is configured for manual deploy with the `gh-pages` package.

```bash
npm run deploy
```

That command runs:

1. `npm run build:pages`
2. Publishes `dist/` to the `gh-pages` branch

Then configure GitHub Pages in your repo settings to serve from the `gh-pages` branch.

## URL modes

```text
Default (add new record from browser geolocation):
https://<username>.github.io/<repo>/

History-only (do not request location or add a record):
https://<username>.github.io/<repo>/?history=true
```

## Reverse geocoding

Place names are fetched client-side from Nominatim. Their [usage policy](https://operations.osmfoundation.org/policies/nominatim/) asks for light traffic (this app requests about one lookup per second when backfilling missing labels). For heavy or production use, consider running your own Nominatim instance or a server-side proxy.
