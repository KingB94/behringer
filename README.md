# ib-behringer.de

Website des Ingenieurbüros Behringer & Partner mbB — Next.js (App Router, TypeScript).
Migriert von einem früheren Flask-Setup; Design, URLs und SEO-Signale sind 1:1 übernommen.

## Entwicklung

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # Produktions-Build (SSG)
npm start        # Produktions-Server
```

Für das Kontaktformular werden lokal SMTP-Zugangsdaten aus `.env` gelesen
(`MAIL_SERVER`, `MAIL_PORT`, `MAIL_USE_TLS`, `MAIL_USERNAME`, `MAIL_PASSWORD`).

## Struktur

- `app/` — Routen (App Router). Statische Inhaltsseiten rendern HTML-Fragmente
  aus `content/` via `lib/fragment.ts`.
- `components/` — Interaktive Client-Komponenten (Hero-Slideshow, News-Slider,
  Projekt-Galerie, 2-Klick Maps/YouTube, Kontaktformular u. a.).
- `content/` — Aus den alten Templates extrahierte HTML-Fragmente (statische
  Seiten + 32 Projekte).
- `data/` — `news.json`, `projects.ts`, `jobs.ts`.
- `lib/` — Mailer (Nodemailer), Rate-Limit, News-Zugriff, Metadaten-Helfer.
- `public/images/` — Bilder (früher `static/images/`).
- `scripts/convertimages.py` — Hilfsskript zur WebP-Konvertierung (nicht Teil des Builds).

## Kontaktformular

`POST /api/kontakt` (Route Handler) → Nodemailer über die `MAIL_*`-Env-Vars an
`info@ib-behringer.de`. Schutz: Honeypot-Feld `fax`, In-Memory-Rate-Limit
(3/min pro IP), Same-Origin-Prüfung. Kein CSRF-Token nötig, da keine Cookies gesetzt werden.

## Deployment (Render.com)

Node Web Service, Build `npm ci && npm run build`, Start `npm start`
(siehe `render.yaml`). Env-Vars: die fünf `MAIL_*` + `NODE_VERSION=22`.

Empfohlener Cut-over: neuen Service auf Branch `nextjs-migration` aufsetzen,
prüfen, dann die Custom-Domain vom alten Flask-Service auf den neuen umhängen.
Rollback = Domain zurückhängen.

## Offener Punkt

Die fünf Karriere-Seiten (`/karriere/*`) zeigen aktuell alle denselben
Praktikums-Text (Stand der alten Seite). Echte Stellentexte können je Slug in
`app/karriere/[slug]/page.tsx` bzw. über `data/jobs.ts` ergänzt werden.
