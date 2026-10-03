# CLAUDE.md — ib-behringer.de

Leitfaden für künftige Bearbeitungen dieses Projekts.

## Überblick

Website des Ingenieurbüros Behringer & Partner mbB.

- **Stack:** Next.js 16 (App Router, TypeScript), vollständig statisch
  vorgerendert, ausgeliefert als **Cloudflare Worker** über OpenNext
  (`@opennextjs/cloudflare`). Gleiches Muster wie reifenrol.
- **Hosting:** GitHub (`KingB94/behringer`) → GitHub Actions
  (`.github/workflows/deploy.yml`) → Cloudflare Workers. Jeder Push auf `main`
  veröffentlicht.
- **Domain:** https://ib-behringer.de (kanonisch **ohne** `www`; `www` → 301).
  Domain und E-Mail-Postfächer liegen bei **IONOS** (Konto des Kunden, wir
  haben keinen Zugriff), DNS bei Cloudflare. Ablauf des Umzugs: `LAUNCH.md`.
- **Früher:** Flask auf Render (bis Oktober 2026). Der Flask-Stand steckt in
  der Git-History vor dem Merge des Branches `cloudflare`.

## Wichtige Rahmenbedingungen (bitte immer einhalten)

- **Cookieless / DSGVO-konform.** Die Seite setzt **keine** Cookies. **Kein**
  Google Analytics, GTM, Meta-Pixel o. Ä. hinzufügen.
- **Kein Cookie-Banner** — er ist bewusst nicht nötig, weil nichts Einwilligungs­pflichtiges
  ohne Interaktion geladen wird.
- **2-Klick-Lösung für Drittinhalte.** Google Maps (Kontaktbereich der Startseite,
  `components/TwoClickMap.tsx`) und YouTube (Mädchenschule Chato,
  `components/ChatoVideoLoader.tsx`) werden erst nach aktivem Klick geladen.
  Neue Einbettungen von Drittanbietern (Karten, Videos, Schriften von
  Google Fonts usw.) müssen genauso gehandhabt werden — nichts ohne Zustimmung
  von externen Servern nachladen.
- **Kein Kontaktformular.** Kontakt läuft bewusst über `mailto:` und Telefon
  (Startseite, Abschnitt `#contact`). Ein Formular bräuchte einen Mail-Dienst
  im Worker plus Spam-Schutz und Anpassung der Datenschutzerklärung.
- **Datenschutz-Text** steht im Impressum (`content/impressum.html`, Anker
  `#datenschutz`). Bei Änderungen an der Datenverarbeitung dort mit aktualisieren.
- **SEO nicht brechen:** URLs stabil halten. Alte WordPress-URLs werden per
  Redirect umgeleitet (`next.config.ts`); solche Redirects nicht entfernen.
  Neue Seiten in die Sitemap (`app/sitemap.ts`) aufnehmen.

## Projektstruktur

- `app/` — Routen (App Router). Inhaltsseiten rendern HTML-Fragmente aus
  `content/` über `lib/fragment.ts`; `app/robots.ts`, `app/sitemap.ts`.
- `components/` — Client-Komponenten (Hero-Slideshow, News-Slider,
  Projekt-Galerie, 2-Klick Maps/YouTube u. a.).
- `content/` — HTML-Fragmente (statische Seiten, Impressum, 32 Projekte).
- `data/` — `news.json` (Objekt nach Slug; `content` ist Roh-HTML),
  `projects.ts`, `jobs.ts`.
- `public/` — `images/`, `favicon/`, `_headers` (Cache-Header für Cloudflare).
- `wrangler.jsonc`, `open-next.config.ts` — Cloudflare-Konfiguration.

## Lokal ausführen

```bash
npm install
npm run dev        # Entwicklung → http://localhost:3000
npm run preview    # wie live, im Cloudflare-Worker → http://localhost:8787
```

`lib/fragment.ts` liest `content/` mit `fs` — das klappt nur, weil alle Seiten
beim Bauen vorgerendert werden. Im Worker gibt es kein `fs`. Neue Seiten also
statisch halten (kein `dynamic = "force-dynamic"`, keine `searchParams`).

## Deployment

- `main` pushen → GitHub Action baut und veröffentlicht (Secrets
  `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` im Repo).
- Von Hand: `npm run deploy` (nach `npx wrangler login`).
- **Nie `wrangler deploy` direkt** — dann fehlen die vorgerenderten Seiten im
  Cache und die Inhaltsseiten antworten mit 500. Immer über
  `opennextjs-cloudflare deploy` bzw. `npm run deploy`.
- Ebenso zum lokalen Testen `npm run preview`, nicht `wrangler dev`.

## Häufige Aufgaben

- **Neuigkeit hinzufügen:** Eintrag in `data/news.json` (Slug als Key, Felder
  `title`, `date`, `category`, `image`, `summary`, `content`). Bild nach
  `public/images/news/`. Für Chato-Beiträge `category: "chato"` (blendet die
  Spendenbox ein).
- **Referenzprojekt hinzufügen:** Fragment unter `content/projekte/<bereich>/`,
  Eintrag in `data/projects.ts`, Bilder nach
  `public/images/referenzen/<bereich>/<projekt>/`, Link auf der passenden
  Leistungsseite ergänzen. Die Sitemap übernimmt Projekte und News automatisch.
- **Stellenangebot ändern:** `data/jobs.ts` bzw. Übersicht in
  `content/unternehmen/stellenangebote.html`.

## Bilder

Cloudflare hat kein Bandbreiten-Limit, große Bilder kosten aber Ladezeit.

- **Bilder vor dem Einchecken optimieren:** `venv/bin/python optimize_images.py`
  (Regeln pro Ordner unter `public/images`, `--dry-run` zeigt nur an).
  Faustregel: lange Kante auf das Doppelte der Anzeigegröße begrenzen.
- Bilder als `.webp` (bestehende Konvention).
- **Crawler-Sperren** für KI- und SEO-Crawler stehen in `app/robots.ts`.
  Google/Bing bleiben ausdrücklich erlaubt; `Google-Extended` betrifft nur
  KI-Training, nicht das Ranking. In Cloudflare die „verwaltete robots.txt"
  ausgeschaltet lassen, sonst wird die eigene überschrieben.

## Bekannte Punkte

- Der Projektordner wird von iCloud/Dropbox synchronisiert. Werden viele
  Dateien auf einmal geändert (z. B. durch `optimize_images.py`), legt der
  Sync-Dienst Konfliktkopien an (`slide1 2.webp`, …). Sie sind per
  `.gitignore` ausgeschlossen und können nach kurzer Prüfung gelöscht werden.
- Die fünf Karriere-Seiten zeigen denselben Praktikums-Text (Stand der alten
  Seite), siehe `data/jobs.ts`.

## Konventionen

- Sprache der Inhalte: **Deutsch**. Kommentare/Doku ebenfalls auf Deutsch halten.
- Bei sichtbaren Änderungen möglichst nah am bestehenden Stil von
  `app/globals.css` bleiben (CSS-Variablen nutzen, kein neues Framework).
