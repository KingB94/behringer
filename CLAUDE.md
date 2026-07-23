# CLAUDE.md — ib-behringer.de

Leitfaden für künftige Bearbeitungen dieses Projekts.

## Überblick

Website des Ingenieurbüros Behringer & Partner mbB.

- **Live-Stack (Branch `main`):** Flask (Python) + Jinja2-Templates, ausgeliefert
  über gunicorn.
- **Hosting:** GitHub (`KingB94/behringer`) → **Render.com** (Auto-Deploy von `main`).
- **Domain:** https://ib-behringer.de (kanonisch **ohne** `www`).
- **Alternative Version:** Auf Branch `nextjs-migration` liegt eine vollständige,
  optisch 1:1-gleiche Portierung auf Next.js 16 (aufbewahrt, **nicht** live).
  Details dort in `MIGRATION.md`. Bewusste Entscheidung: vorerst bei Flask bleiben.
  Änderungen am Live-Betrieb also immer auf `main` / im Flask-Code.

## Wichtige Rahmenbedingungen (bitte immer einhalten)

- **Cookieless / DSGVO-konform.** Die Seite setzt **keine** Marketing-/Tracking-Cookies.
  Einziges Cookie ist das technisch notwendige Session-Cookie für den CSRF-Schutz
  des Kontaktformulars. **Kein** Google Analytics, GTM, Meta-Pixel o. Ä. hinzufügen.
- **Kein Cookie-Banner** — er ist bewusst nicht nötig, weil nichts Einwilligungs­pflichtiges
  ohne Interaktion geladen wird.
- **2-Klick-Lösung für Drittinhalte.** Google Maps (Kontaktbereich der Startseite)
  und YouTube (Seite Mädchenschule Chato) werden erst nach aktivem Klick geladen.
  Neue Einbettungen von Drittanbietern (Karten, Videos, Fonts, Schriften von
  Google Fonts usw.) müssen genauso gehandhabt werden — nichts ohne Zustimmung
  von externen Servern nachladen.
- **Datenschutz-Text** steht im Impressum (`templates/impressum.html`, Anker
  `#datenschutz`). Bei Änderungen an der Datenverarbeitung dort mit aktualisieren.
- **SEO nicht brechen:** URLs stabil halten. Kanonische Domain ist
  `https://ib-behringer.de`. Alte WordPress-URLs werden per 301 umgeleitet
  (siehe `app.py`); solche Redirects nicht entfernen. Neue Seiten in die
  Sitemap (`/sitemap.xml`, generiert in `app.py`) aufnehmen.

## Projektstruktur

- `app.py` — gesamte Flask-App: Routen, 301-Redirects alter Seiten, dynamische
  Sitemap, Kontaktformular (Versand + Validierung).
- `templates/` — Jinja2:
  - `base.html` — Grundgerüst (Header/Nav, Footer, globales Inline-JS: Hamburger,
    Dropdowns, Hero-Slideshow, News-Slider, Lightbox, Maps-2-Klick).
  - `index.html` — One-Pager (Über uns / Neuigkeiten / Leistungen / Unternehmen / Kontakt).
  - `leistungen/` (8), `unternehmen/` (5), `jobs/` (5 Karriere-Detailseiten),
    `projekte/<bereich>/<name>.html` (Referenzprojekte),
    `news.html`, `news_detail.html`, `impressum.html`, `maedchenschule-chato.html`.
- `static/` — `css/styles.css` (Custom-CSS, CSS-Variablen, kein Framework),
  `images/`, `favicon/`, `robots.txt`.
- `data/news.json` — Neuigkeiten (Objekt nach Slug; `content` ist Roh-HTML).

## Lokal ausführen

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask run          # oder: python app.py  → http://127.0.0.1:5000
```

Benötigt eine `.env` (nicht im Repo) mit:
`SECRET_KEY`, `MAIL_SERVER`, `MAIL_PORT`, `MAIL_USE_TLS`, `MAIL_USERNAME`,
`MAIL_PASSWORD`. Ohne gültige SMTP-Daten funktioniert alles außer dem echten
Mailversand des Kontaktformulars.

## Kontaktformular

`POST /kontakt` → Flask-Mail an `info@ib-behringer.de`. Schutzmechanismen, die
erhalten bleiben müssen: **CSRF** (Flask-WTF), **Honeypot**-Feld `fax`,
**Rate-Limit** (3/min pro IP, Flask-Limiter), Pflicht-Checkbox `privacy_consent`.

## Deployment (Render.com)

- `main` pushen → Render deployt automatisch.
- Start-Command auf Render: `gunicorn app:app` (im Dashboard konfiguriert; keine
  `render.yaml`/`Procfile` im Flask-Zweig).
- Env-Vars (die o. g. `MAIL_*` + `SECRET_KEY`) sind im Render-Dashboard gesetzt,
  nicht im Repo.

## Häufige Aufgaben

- **Neuigkeit hinzufügen:** Eintrag in `data/news.json` (Slug als Key, Felder
  `title`, `date`, `category`, `image`, `summary`, `content`). Bild nach
  `static/images/news/`. Für Chato-Beiträge `category: "chato"` (blendet die
  Spendenbox ein).
- **Referenzprojekt hinzufügen:** Template unter `templates/projekte/<bereich>/`
  anlegen, Bilder nach `static/images/referenzen/<bereich>/<projekt>/`, Link auf
  der passenden Leistungsseite ergänzen, URL in die Sitemap (`app.py`) aufnehmen.
- **Stellenangebot ändern:** `templates/jobs/*.html` bzw. Übersicht in
  `templates/unternehmen/stellenangebote.html`.

## Bekannte Punkte

- Die Error-Handler in `app.py` verweisen auf `templates/404.html` / `500.html`,
  die **nicht existieren** — unbekannte URLs können dadurch einen 500 statt 404
  auslösen. Bei Gelegenheit echte Fehlerseiten ergänzen.
- Bildkonvertierung nach WebP: Hilfsskript `convertimages.py` (nur lokal, nicht
  Teil des Betriebs).

## Konventionen

- Sprache der Inhalte: **Deutsch**. Kommentare/Doku ebenfalls auf Deutsch halten.
- Bilder als `.webp` (bestehende Konvention).
- Bei sichtbaren Änderungen möglichst nah am bestehenden Stil von
  `static/css/styles.css` bleiben (CSS-Variablen nutzen, kein neues Framework).
