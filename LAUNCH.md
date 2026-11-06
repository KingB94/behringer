# Umzug ib-behringer.de: Render → Cloudflare Workers

Ziel: `https://ib-behringer.de` wird von Cloudflare Workers ausgeliefert
(kostenlos, ohne Bandbreiten-Limit) statt von Render (7 $/Monat).
Muster wie bei reifenrol (`../reifenrol/LAUNCH.md`).

**Was gleich bleibt:** Die Domain bleibt bei IONOS registriert, die
40 E-Mail-Postfächer bleiben bei IONOS. Nur die **Nameserver** wandern zu
Cloudflare; die Mail-Einträge (MX, SPF, DKIM …) stehen dort 1:1 und zeigen
weiterhin auf IONOS. DNS-Änderungen bei IONOS wirken danach nicht mehr —
gepflegt wird in Cloudflare.

**Wer macht was:**
- **Wir** (Cloudflare-Konto „Bayern Digital“): Zone, Einträge, Worker.
- **IT des Kunden** (Herbert Feuchtgruber, Feuchtgruber-EDV; IONOS-Konto):
  nur Etappe 4, die Nameserver umstellen. Sonst nichts bei IONOS ändern,
  löschen oder kündigen.

**Grundsatz für einen Umzug ohne Ausfall:** Nameserver-Wechsel und
Website-Umzug passieren getrennt. Bei `.de` dauert es bis zu 24 Stunden, bis
alle Resolver die neuen Nameserver kennen; so lange müssen IONOS und
Cloudflare dieselben Antworten geben. Deshalb stehen die Render-Einträge
zunächst auch in Cloudflare, und die Website wird erst umgeschaltet, wenn
die Zone aktiv ist.

---

## Etappe 1 — Code ✅ (03.10.2026, Branch `cloudflare`)

- [x] Next.js-Fassung auf Cloudflare Workers (OpenNext), Cache-Header in
      `public/_headers`, `www` → nackte Domain als 301
- [x] Kontaktformular ohne Server (`mailto:`), Datenschutz angepasst
- [x] `.github/workflows/deploy.yml`: jeder Push auf `main` veröffentlicht
- [x] 28.10.2026: Commit `8653dcb` von `main` (KI-Crawler erlaubt,
      Schema.org, „Ort / Landkreis“) in die Next.js-Fassung übernommen

## Etappe 2 — Testlauf auf workers.dev ✅ (28.10.2026)

- [x] `npm run deploy` (routes auskommentiert) →
      https://ib-behringer.landingpage-next.workers.dev
- [x] Geprüft: alle 60 Sitemap-URLs 200, Alt-Redirects 308, unbekannte
      Adresse 404, kein Set-Cookie, Canonical zeigt auf `ib-behringer.de`
- [ ] Link dem Kunden zur Abnahme schicken

## Etappe 3 — Zone in Cloudflare ✅ (28.10.2026)

Zone `ib-behringer.de` (Free, ID `387f223abf1f9fb4de133f57ce428d31`) ohne
Auto-Scan angelegt, Einträge per API nach den IONOS-Screenshots vom
28.10.2026 eingetragen. Alle **DNS only (graue Wolke)**:

| Typ | Name | Inhalt |
| --- | --- | --- |
| MX | `@` | `mx00.ionos.de` (Prio 10) |
| MX | `@` | `mx01.ionos.de` (Prio 10) |
| TXT | `@` | `v=spf1 include:_spf-eu.ionos.com ~all` |
| TXT | `_dmarc` | `v=DMARC1;p=none;sp=none;pct=100;rua=mailto:info@ib-behringer.de;ruf=mailto:info@ib-behringer.de;ri=86400;aspf=r;adkim=s;fo=1` |
| CNAME | `s1-ionos._domainkey` | `s1.dkim.ionos.com` |
| CNAME | `s2-ionos._domainkey` | `s2.dkim.ionos.com` |
| CNAME | `s42582890._domainkey` | `s42582890.dkim.ionos.com` |
| CNAME | `autodiscover` | `adsredir.ionos.info` |
| A | `ftp` | `217.160.223.17` |
| A | `@` | `216.24.57.1` (Render, vorerst) |
| A | `@` | `216.24.57.253` (Render, vorerst) |
| CNAME | `www` | `behringer.onrender.com` (Render, vorerst) |
| CAA | `@` | `0 issue "letsencrypt.org"` / `"pki.goog"` / `"ssl.com"` |

- Bewusst **nicht** übernommen: CNAME `_domainconnect` →
  `_domainconnect.1and1.com` (IONOS-Dienst, würde nach dem Umzug falsch
  verweisen).
- Bot-Einstellungen geprüft: AI-Bots-Blockade aus, verwaltete robots.txt
  aus. „Always Use HTTPS“ an. DNSSEC aus. Email Routing **nicht**
  aktivieren (würde die MX-Einträge ersetzen).
- Nameserver für IONOS: **`laila.ns.cloudflare.com`**,
  **`sterling.ns.cloudflare.com`**

## Etappe 4 — Nameserver umstellen (IT des Kunden, IONOS) ✅ (05.11.2026)

1. [x] Bei IONOS: *Domains & SSL* → `ib-behringer.de` → Reiter
       *Nameserver* → „Eigene Nameserver verwenden“ →
       `laila.ns.cloudflare.com` und `sterling.ns.cloudflare.com`
       eintragen, alle `ns1050.ui-dns.*` entfernen, speichern. Die Warnung,
       dass die DNS-Einstellungen bei IONOS dann nicht mehr gelten,
       bestätigen.
       Nicht: DNS-Einträge bei IONOS löschen, DNSSEC einschalten, SSL oder
       Domain Guard bestellen, Verträge ändern.
2. [x] (aktiv seit 05.11.2026 11:51 UTC) Warten, bis Cloudflare die Zone als **Active** meldet (Minuten bis
       wenige Stunden). Die Website läuft in dieser Zeit weiter über Render.

## Etappe 5 — Kontrolle nach dem DNS-Umzug (wir) ✅ (05.11.2026)

3. [x] `dig +short NS ib-behringer.de` → Cloudflare-Nameserver
       (05.11.2026: DENIC, 1.1.1.1, 8.8.8.8, 9.9.9.9 liefern laila/sterling)
4. [x] (05.11.2026: MX, SPF, DMARC, alle DKIM-CNAMEs, autodiscover korrekt) `dig +short MX ib-behringer.de @1.1.1.1` → `mx00/mx01.ionos.de`
5. [x] (05.11.2026 erfolgreich) **Mail testen:** eine Mail von außen an `info@ib-behringer.de` und
       eine von dort nach außen. Im Header SPF und DKIM „pass“.

## Etappe 6 — Website umschalten ✅ (05.11.2026)

> **Voraussetzung: Zone im Dashboard „Aktiv“ (nicht „ausstehend“).** Dass
> DENIC und die Resolver schon die Cloudflare-Nameserver liefern, reicht
> nicht. Erster Versuch am 05.11.2026: Zone noch ausstehend → Cloudflare
> gibt für die Worker-Domain keine Adresse aus → Seite rund 15 Minuten
> offline, zurückgerollt auf Render.
>
> Weitere Lehren aus dem Versuch:
> - wrangler überschreibt die von Hand angelegten Render-Einträge **nicht**
>   (Fehler 100117) — sie müssen vorher im Dashboard gelöscht werden.
>   Erst löschen, dann sofort `npm run deploy`.
> - Rückweg: Worker-Domains entfernen (Workers → ib-behringer → Domains,
>   oder API `DELETE /accounts/<id>/workers/domains/<id>`), Render-Einträge
>   wieder anlegen — **„Nur DNS“ (graue Wolke)**, sonst kommt bei
>   ausstehender Zone nichts durch.
> - Seit dem Deploy ist die workers.dev-Adresse aus (kein `workers_dev` in
>   `wrangler.jsonc`).

6. [x] (05.11.2026) Render: **Auto-Deploy des Flask-Services aus** — vor dem Merge, sonst
       versucht Render, den Next.js-Stand von `main` als Flask zu bauen.
7. [x] (05.11.2026) In Cloudflare die drei Render-Einträge löschen (A `@` ×2, CNAME `www`).
8. [x] (05.11.2026) In `wrangler.jsonc` die `routes` einkommentieren, `npm run deploy`.
       Legt die Einträge für `ib-behringer.de` und `www` samt Zertifikat an
       (ein bis zwei Minuten Lücke).
9. [x] (05.11.2026, alles wie erwartet) Prüfen: `https://ib-behringer.de/`, `/impressum`, `/robots.txt`,
       `/sitemap.xml` → 200; `http://` und `www` → 301 auf
       `https://ib-behringer.de/…`; `/leistung/wasserbau` → 308.
10. [x] (05.11.2026) GitHub `KingB94/behringer` → Settings → Secrets → Actions:
        `CLOUDFLARE_API_TOKEN` (nur Workers + Zone ib-behringer.de) und
        `CLOUDFLARE_ACCOUNT_ID`.
11. [x] (05.11.2026, Merge `b4e525e`, erste Action grün) `origin/main` in `cloudflare` mergen (Konflikte bei `CLAUDE.md`,
        `static/robots.txt`, `templates/…`: Flask-Dateien mit `git rm`
        löschen), dann `cloudflare` nach `main` → Workflow veröffentlicht.

## Etappe 7 — Aufräumen (nach etwa einer Woche)

12. [x] (06.11.2026) Render: Service `behringer` gelöscht (Custom Domain
        damit weg). Letzte Abrechnung November: 1,29 $. Workspace bleibt im
        kostenlosen Hobby-Plan.
13. [x] (06.11.2026, gelesen, 60 Seiten) Google Search Console: Bestätigung läuft über das Meta-Tag in
        `app/layout.tsx`, bleibt gültig. Sitemap erneut einreichen.
14. [ ] API-Token „ib-behringer Einrichtung“ löschen (läuft sonst am
        04.11.2026 ab) und `.dev.vars` leeren.

## Rückweg

> **Seit 06.11.2026 nicht mehr möglich** — der Render-Service ist gelöscht.
> Der Flask-Stand liegt weiter in der Git-History (vor Merge `b4e525e`).

Bis Schritt 12 ist alles umkehrbar: In Cloudflare die Render-Einträge
wiederherstellen (A `@` → `216.24.57.1` / `216.24.57.253`, CNAME `www` →
`behringer.onrender.com`) oder die Nameserver bei IONOS zurück auf
`ns1050.ui-dns.org/.de/.com/.biz` stellen — die alten Einträge bei IONOS
bleiben dafür unangetastet.
