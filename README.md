# Whee! Photobooth

Whee photobooth built with React + Vite. Pick a template, capture photos, apply filters, and download your strip.

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Copy `.env.example` to `.env` and set `VITE_API_URL` if you run the filter backend locally (default `http://localhost:8000`). Leave it empty to develop without the API—only CSS filters will appear.

Optional: start **whee-photobooth-api** on port 8000 for backend filters (Blush, Cat Ears, BG Replace, etc.).

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base URL of the filter API (no trailing slash). Empty = frontend-only deploy. |

Example `.env`:

```env
VITE_API_URL=http://localhost:8000
```

Production build reads env at **build time**—set `VITE_API_URL` in your host’s environment variables before `npm run build`.

## Production build

```bash
npm run build
npm run preview   # optional local check of dist/
```

Deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.).

### Static host checklist

1. **HTTPS** — required for camera access (`getUserMedia`).
2. **SPA routing** — rewrite all paths to `index.html` (routes: `/`, `/layout`, `/camera`, `/customise`).
3. **`VITE_API_URL`** — set in the host’s build settings to your deployed API origin, e.g. `https://api.yourdomain.com`.

### Vercel / Netlify

- Build command: `npm run build`
- Output directory: `dist`
- Environment: `VITE_API_URL=https://your-api.example.com`
- Enable SPA fallback / redirects to `index.html` (often automatic).

### GitHub Pages

If the site is not at the domain root, set `base` in `vite.config.js` to your repo path (e.g. `/whee-photobooth/`).

## Filter API (optional)

The frontend calls `POST {VITE_API_URL}/apply-filter` with JSON:

```json
{ "image": "<base64>", "filter": "<id>", "preview": true, "bg_filename": "bg1.jpg" }
```

**Backend recommendations:**

- HTTPS only
- CORS: allow only your frontend origin (not `*` in production)
- Rate limiting and max image size
- Do not expose secrets in the frontend

Without the API, the app still works with CSS filters and template strips.

## Background images (BG Replace)

Place JPEGs in `public/assets/backgrounds/`:

- `bg1.jpg`, `bg2.jpg`, `bg3.jpg`

These paths match `Camera.jsx` (`/assets/backgrounds/...`).

## Privacy note

Photos are processed in the browser and stored in `sessionStorage` until the tab closes. Backend filters send image data to your API—mention that in any public privacy copy if you enable them.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production bundle → `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run lint` | ESLint |
