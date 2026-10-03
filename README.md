# ib-behringer.de

Website des Ingenieurbüros Behringer & Partner mbB — Next.js (App Router, TypeScript).
Migriert von einem früheren Flask-Setup; Design, URLs und SEO-Signale sind 1:1 übernommen.

## Entwicklung

```bash
npm install
npm run dev      # http://localhost:3000
npm run preview  # wie live im Cloudflare-Worker, http://localhost:8787
npm run deploy   # von Hand veröffentlichen (sonst per GitHub Action)
```

## Struktur

- `app/` — Routen (App Router). Statische Inhaltsseiten rendern HTML-Fragmente
  aus `content/` via `lib/fragment.ts`.
- `components/` — Interaktive Client-Komponenten (Hero-Slideshow, News-Slider,
  Projekt-Galerie, 2-Klick Maps/YouTube u. a.).
- `content/` — Aus den alten Templates extrahierte HTML-Fragmente (statische
  Seiten + 32 Projekte).
- `data/` — `news.json`, `projects.ts`, `jobs.ts`.
- `lib/` — News-Zugriff, Metadaten-Helfer, Fragment-Loader.
- `public/images/` — Bilder (früher `static/images/`), `public/_headers` — Cache-Header.
- `optimize_images.py` — Bilder verkleinern (lokal, nicht Teil des Builds).
- `scripts/convertimages.py` — Hilfsskript zur WebP-Konvertierung (nicht Teil des Builds).

## Kontakt

Kein Formular: Der Kontaktbereich der Startseite verlinkt per `mailto:` auf
`info@ib-behringer.de` und per `tel:` auf die Zentrale. Dadurch setzt die Seite
keinerlei Cookies und braucht kein Mail-Backend.

## Deployment (Cloudflare Workers)

OpenNext (`@opennextjs/cloudflare`) übersetzt den Next-Build in einen Worker
(`wrangler.jsonc`, `open-next.config.ts`). Jeder Push auf `main` veröffentlicht
über `.github/workflows/deploy.yml`. Nie `wrangler deploy` direkt verwenden —
siehe `CLAUDE.md`. Ablauf des Umzugs von Render: `LAUNCH.md`.

## Offener Punkt

Die fünf Karriere-Seiten (`/karriere/*`) zeigen aktuell alle denselben
Praktikums-Text (Stand der alten Seite). Echte Stellentexte können je Slug in
`app/karriere/[slug]/page.tsx` bzw. über `data/jobs.ts` ergänzt werden.
