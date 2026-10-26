# Integration Handoff

## Frontend

- Folder: repository root (`.`)
- Install: `npm install`
- Build: `npm run build`
- Tests: `npm test`
- Dev server: `npm run dev` (Vite, host `0.0.0.0`, default port 5173 with automatic fallback)
- API seam: `src/api/index.js`
- Mock client: `src/api/mockClient.js`
- Mock content: `src/content/wedding.js`
- Preview state override: `src/api/previewState.js`
- Dev-only state UI: `src/components/DataStateSwitcher.jsx`
- Shared backend types: none; frontend contract uses JSDoc in `src/api/types.js`.
- Live-data wiring: not applicable to this approved plan. There is no backend or API service; keep the invitation as a static SPA and preserve the mock client unless the plan is amended and approved.

## Routes

- `GET /`: static invitation SPA and local public assets; `?to=` is safely rendered as a guest name.
- `GET /assets/*`: static bundled media and Open Graph image.
- Netlify SPA fallback: all other paths rewrite to `/index.html` with status 200.

## Backend, Database, And Services

- Backend project/run command/port/health endpoint: none planned.
- Azure Functions and API routes: none planned.
- Database: none. No migrations or seed data are required or authorized by the approved plan.
- Azure services: none. Static hosting target in the approved plan is Netlify Free; no provisioning or deployment is included.

## Publication Caveats

- Couple names, event details, and venue are editable demo content and must be verified.
- Venue street address is unverified; keep the venue-name search link and do not add an unverified map pin.
- Hero and gallery photos are illustrative Unsplash stock images, not personal couple photos. Verify license terms and replace with approved local imagery before publication.
- No video or soundtrack was supplied. Do not invent either; the interface reports the missing `/bg-music.mp3` file.
- Confirm the eventual public domain before adding canonical URL or absolute Open Graph metadata.