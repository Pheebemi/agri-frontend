# AgriScan — Frontend

Next.js 16 app for AgriScan, a crop scanning and diagnostic platform. A farmer
photographs a leaf; the app identifies the crop, diagnoses the disease, grades
severity, and returns a treatment plan.

Backend: [`Pheebemi/agri-backend`](https://github.com/Pheebemi/agri-backend)

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Point it at a running backend:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_MEDIA_URL=http://localhost:8000
```

### Demo accounts

| Role | Email | Password | Lands on |
|---|---|---|---|
| Farmer | `farmer@agriscan.app` | `farmer12345` | `/dashboard` |
| Agronomist | `agronomist@agriscan.app` | `agro12345` | `/admin` |

The login page has one-tap buttons for both.

## Screens

| Route | What it is |
|---|---|
| `/` | Landing page |
| `/login`, `/register` | Auth — registration always creates a farmer |
| `/dashboard` | Farmer home: stats, activity chart, severity mix, recent scans |
| `/scan` | Camera capture or upload → analysing → diagnosis |
| `/scans` | Scan history, filterable by severity |
| `/scans/[id]` | Full diagnosis report + treatment plan |
| `/crops`, `/crops/[slug]` | Crop and disease field guide |
| `/settings` | Profile |
| `/admin` | Agronomist: platform stats, outbreak watch, regional spread |
| `/admin/scans` | Every user's scans |
| `/admin/review` | Confirm or correct low-confidence diagnoses |
| `/admin/users` | All accounts |

`/admin` requires `role === "AGRONOMIST"` and redirects farmers to `/dashboard`.
The backend enforces the same rule — the layout guard is not the only gate.

## Design system

Dark-first: near-black with a faint green cast, sweet green (`#16C172`) as the
only saturated colour. Light mode is fully supported via the toggle.

The full token reference, the severity ramp, the theme wiring and the unDraw
conventions are documented in `CLAUDE.md`. Read that before adding a component.

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Illustrations

`public/illustrations/` ships in-house stand-ins drawn in unDraw's flat style
with the brand green baked in, so the app is complete out of the box. To swap in
the real thing, set the unDraw colour picker to `#16C172` first, then overwrite
the file keeping its filename. See `public/illustrations/_palette.md`.
