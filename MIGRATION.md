# Migration ib-behringer.de: Flask → Next.js

Zusammenfassung der Migration von der alten Flask-Seite auf ein modernes
Next.js-Setup. Design, alle URLs und SEO-Signale wurden **1:1 übernommen**.

- **Branch:** `nextjs-migration` (committet, noch nicht gepusht)
- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Nodemailer
- **Status:** vollständig gebaut & lokal verifiziert (67 Seiten, Build/Lint/TS grün)

---

## Was gemacht wurde

### Grundgerüst
- Next.js-Projekt (App Router, TypeScript, kein Tailwind) im Repo-Root angelegt.
- Bestehendes CSS 1:1 nach `app/globals.css` übernommen; die relativen
  `url("../images/…")`-Pfade auf absolute `/images/…` umgestellt.
- Bilder `static/images/` → `public/images/`, Favicons → `public/favicon/`.
- Ordner mit Umlaut `gep-mühldorf` → `gep-muehldorf` umbenannt.
- Alte Flask-Dateien entfernt (`app.py`, `templates/`, `requirements.txt`, `static/`).

### Seiten & Routen
| Bereich | Umsetzung |
|---|---|
| Startseite (One-Pager) | `app/page.tsx` mit Hero-Slideshow, News-Slider, Reveal-Effekt, 2-Klick-Karte, Kontaktformular |
| Neuigkeiten (Liste + Detail) | aus `data/news.json`, inkl. Chato-Spendenbox |
| 8 Leistungsseiten | statische HTML-Fragmente aus `content/leistungen/` |
| 5 Unternehmensseiten | statische Fragmente (Team, Firmengeschichte mit Timeline-Effekt, Netzwerk, Stellenangebote, Standorte) |
| 32 Projektseiten | datengetrieben (`data/projects.ts`) + **eine** wiederverwendbare `ProjectGallery`-Komponente statt 32 kopierter Skripte |
| 5 Karriere-Seiten | gemeinsamer Renderer über `data/jobs.ts` |
| Impressum, Mädchenschule Chato | eigene Seiten (Chato mit Bildergalerie + 2-Klick-YouTube) |
| 404 / 500 | echte Fehlerseiten (die alte Flask-404 lief ins 500) |

### Kontaktformular
- `POST /api/kontakt` (Route Handler) → **Nodemailer** über die vorhandenen
  SMTP-Env-Vars (`MAIL_SERVER`, `MAIL_PORT`, `MAIL_USE_TLS`, `MAIL_USERNAME`,
  `MAIL_PASSWORD`), Empfänger `info@ib-behringer.de`.
- Schutz: Honeypot-Feld `fax`, In-Memory-Rate-Limit (3/min pro IP),
  Same-Origin-Prüfung. Kein CSRF-Token nötig (es werden keine Cookies gesetzt).
- Erfolg/Fehler wird inline im Formular angezeigt (ersetzt die alten Flash-Meldungen).

### SEO
- Titel/Description/OpenGraph/Canonical je Seite über die Metadata-API.
- `app/sitemap.ts` (60 URLs) und `app/robots.ts` erzeugen `/sitemap.xml` und `/robots.txt`.
- Alle alten WordPress-301-Redirects in `next.config.ts` (jetzt 308, SEO-gleichwertig),
  plus Sicherheitsnetz `/static/images/…` → `/images/…`.
- `google-site-verification` und Favicon-/Manifest-Einträge übernommen.

### Bereinigt / korrigiert
- Falsche Meta-Description auf `/wasserbau` (zeigte Straßenbau-Text) korrigiert.
- Toter „Rückantwortbogen (DOCX)"-Link auf den Karriere-Seiten entfernt.
- Datums-Platzhalter im Bewerbungs-Betreff durch echtes Datum ersetzt.

---

## Verifiziert (lokal)
- Startseite & Leistungsseite optisch 1:1 (Screenshot-Abgleich).
- Kontakt-API: Validierung, Honeypot, Rate-Limit.
- Alle Legacy-Redirects → 308 mit korrektem Ziel.
- Unbekannte URLs → echtes 404.
- Sitemap/robots inhaltlich passend.

---

## Noch offen (manuell)
1. **Branch pushen** und nach erfolgreichem Cut-over nach `main` mergen.
2. **Cut-over auf Render:** neuen Node-Web-Service (siehe `render.yaml`) auf den
   Branch aufsetzen, `MAIL_*` + `NODE_VERSION=22` eintragen, testen, dann die
   Domain vom alten Flask-Service umhängen. Rollback = Domain zurückhängen.
3. **Echte Stellentexte:** alle 5 Karriere-Seiten zeigen aktuell denselben
   Praktikums-Text; echte Inhalte können in `data/jobs.ts` ergänzt werden.

---

## Seite lokal ansehen

```bash
# im Projektordner
npm install        # nur beim ersten Mal nötig
npm run dev        # startet den Entwicklungsserver
```

Dann im Browser öffnen: **http://localhost:3000**

Alternativ der echte Produktions-Build (so wie später auf Render):

```bash
npm run build
npm start          # http://localhost:3000
```

> Für das Kontaktformular müssen lokal die `MAIL_*`-Werte in der Datei `.env`
> stehen (ist bereits vorhanden und wird von Next automatisch geladen). Ohne
> gültige SMTP-Daten funktioniert alles außer dem tatsächlichen Mailversand.

Ein paar Seiten zum Reinschauen:
`/` · `/wasserbau` · `/neuigkeiten` · `/team` · `/maedchenschule-chato` ·
`/projekt/wasserbau/gelting`

---

## Nachtrag Oktober 2026: Cloudflare statt Render

Die Next.js-Fassung geht nicht auf Render, sondern auf **Cloudflare Workers**
(Branch `cloudflare`, Ablauf in `LAUNCH.md`). Dabei geändert:

- Kontaktformular samt Nodemailer, Rate-Limit und `/api/kontakt` entfernt;
  stattdessen `mailto:`- und `tel:`-Links. `render.yaml` entfernt.
- `main` (optimierte Bilder, Crawler-Sperren, Favicons) übernommen.
- Next.js auf 16.3.x (Voraussetzung für `@opennextjs/cloudflare`).
