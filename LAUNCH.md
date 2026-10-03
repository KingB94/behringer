# Umzug ib-behringer.de: Render → Cloudflare Workers

Ziel: `https://ib-behringer.de` wird von Cloudflare Workers ausgeliefert
(kostenlos, ohne Bandbreiten-Limit) statt von Render (7 $/Monat).
Muster wie bei reifenrol (`../reifenrol/LAUNCH.md`).

**Was gleich bleibt:** Die Domain bleibt bei IONOS registriert, die
E-Mail-Postfächer bleiben bei IONOS. Nur die **Nameserver** wandern zu
Cloudflare; die Mail-Einträge (MX, SPF, DKIM …) werden dort 1:1
übernommen und zeigen weiterhin auf IONOS.

**Wer macht was:**
- **Wir** (Cloudflare-Konto): Zone anlegen, Einträge prüfen, Worker veröffentlichen.
- **IT-Verantwortlicher des Kunden** (IONOS-Konto): nur Schritt 5, die
  Nameserver umstellen. Sonst nichts bei IONOS ändern oder kündigen.

Stand bei Beginn (03.10.2026):

| | |
| --- | --- |
| Nameserver | `ns1050.ui-dns.org/.de/.com/.biz` (IONOS) |
| Webseite | A `216.24.57.1`, `216.24.57.253`, `www` CNAME `behringer.onrender.com` (Render) |
| DNSSEC | **aus** (kein DS bei der DENIC) — nichts abzuschalten |
| CAA | `0 issue "letsencrypt.org"` |

---

## Etappe 1 — Code ✅ (03.10.2026, Branch `cloudflare`)

- [x] Next.js-Fassung (`nextjs-migration`) auf den Stand von `main`
      gebracht: optimierte Bilder, Crawler-Sperren in `app/robots.ts`,
      Favicons 16/32
- [x] OpenNext + Wrangler (`wrangler.jsonc`, `open-next.config.ts`),
      Cache-Header in `public/_headers`
- [x] Kontaktformular → `mailto:`-Link + Telefon (kein Mail-Backend mehr)
- [x] Datenschutz: Hosting Cloudflare statt Render, Abschnitt
      Kontaktformular und CSRF-Cookie ersetzt („setzt keine Cookies")
- [x] `www` → nackte Domain als 301 in `next.config.ts`
- [x] `.github/workflows/deploy.yml`: jeder Push auf `main` veröffentlicht
- [x] Örtlich geprüft mit `npm run preview`: alle 60 Sitemap-URLs 200,
      unbekannte Adresse 404, Alt-Redirects 308, `www` 301, kein Set-Cookie

## Etappe 2 — Testlauf auf workers.dev (wir)

1. [ ] `npx wrangler login` (Cloudflare-Konto, in dem die Zone liegen soll)
2. [ ] `npm run deploy` — `routes` in `wrangler.jsonc` sind noch
       auskommentiert, die Seite landet unter
       `https://ib-behringer.<konto>.workers.dev`.
       **Wichtig:** immer `npm run deploy` (bzw. `opennextjs-cloudflare deploy`),
       nie `wrangler deploy` direkt — sonst fehlen die vorgerenderten Seiten
       und die Inhaltsseiten antworten mit 500.
3. [ ] Dort durchklicken, dem Kunden den Link zur Abnahme schicken.

## Etappe 3 — Zone in Cloudflare anlegen (wir)

4. [ ] *Add a site* → `ib-behringer.de` → Free. Cloudflare scannt die
       bestehenden Einträge. Danach **mit dieser Soll-Liste abgleichen**
       (Stand 03.10.2026, öffentlich abgefragt). Alle Einträge auf
       **„DNS only" (graue Wolke)**, nicht „Proxied":

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

       Der Scan findet nur Namen, die er errät. **Den IT-Verantwortlichen
       bitten, einen Screenshot/Export der DNS-Seite bei IONOS zu schicken**,
       und Einträge, die dort zusätzlich stehen, von Hand nachtragen.

   - [ ] **Löschen:** die zwei A-Einträge `@` → `216.24.57.x` und den
         CNAME `www` → `behringer.onrender.com` (Render). Die legt der
         Worker in Schritt 6 selbst neu an; stehen sie noch da, schlägt
         das Veröffentlichen fehl.
   - [ ] **CAA:** Der Eintrag erlaubt nur Let's Encrypt. Cloudflare stellt
         Zertifikate auch über Google Trust Services aus — CAA-Eintrag
         entweder löschen oder um `0 issue "pki.goog"` und
         `0 issue "ssl.com"` ergänzen.
   - [ ] **Kein „Email Routing" aktivieren** — das würde die MX-Einträge
         ersetzen.

5. [ ] Cloudflare nennt zwei Nameserver (`xxx.ns.cloudflare.com`).
       Diese an den IT-Verantwortlichen geben, **noch nicht umstellen**.

6. [ ] In `wrangler.jsonc` die `routes` einkommentieren, `npm run deploy`.
       Legt die Einträge für `ib-behringer.de` und `www` samt Zertifikat
       an. Solange die Nameserver noch bei IONOS stehen, merkt davon
       niemand etwas.

## Etappe 4 — Nameserver umstellen (IT-Verantwortlicher, IONOS)

7. [ ] Bei IONOS: *Domains & SSL* → `ib-behringer.de` → *Nameserver* →
       „Eigene Nameserver verwenden" → die zwei von Cloudflare eintragen,
       alle IONOS-Nameserver entfernen. IONOS warnt, dass die dortigen
       DNS-Einstellungen dann nicht mehr gelten — das ist so gewollt, sie
       stehen ja in Cloudflare.
       Der Domainvertrag und das Mail-Paket bleiben unverändert.
8. [ ] Warten, bis Cloudflare die Zone als **Active** meldet (meist
       Minuten bis wenige Stunden).

## Etappe 5 — Nachkontrolle (wir)

9.  [ ] `dig +short NS ib-behringer.de` → Cloudflare-Nameserver
10. [ ] `dig +short MX ib-behringer.de @1.1.1.1` → `mx00/mx01.ionos.de`
11. [ ] **Mail testen:** eine Mail von außen an `info@ib-behringer.de`
        schicken und eine von dort nach außen — kommen beide an?
12. [ ] `https://ib-behringer.de/`, `/impressum`, `/robots.txt`,
        `/sitemap.xml` → 200; `http://` und `www` → 301 auf
        `https://ib-behringer.de/…`
13. [ ] Cloudflare: SSL/TLS → Edge Certificates → **„Always Use HTTPS" an**;
        AI Crawl Control → **verwaltete robots.txt aus** (sonst überschreibt
        Cloudflare `app/robots.ts`). Beides stand bei Dandl/reifenrol falsch.
14. [ ] GitHub `KingB94/behringer` → Settings → Secrets → Actions:
        `CLOUDFLARE_API_TOKEN` (nur Workers + Zone ib-behringer.de) und
        `CLOUDFLARE_ACCOUNT_ID`.
15. [ ] Branch `cloudflare` nach `main` mergen → Workflow veröffentlicht.

## Etappe 6 — Render abschalten

16. [ ] Render: Auto-Deploy des Flask-Services sofort aus (sonst versucht
        Render, den Next.js-Stand von `main` als Flask zu bauen).
17. [ ] Nach ein paar Tagen ohne Auffälligkeiten (Render-Dashboard zeigt
        keinen Traffic mehr): Service löschen, Abo kündigen.
18. [ ] Google Search Console: Die Bestätigung läuft über das Meta-Tag im
        Seitenkopf, bleibt also gültig. Einmal *Sitemap erneut einreichen*.

## Rückweg

Bis Schritt 17 ist alles umkehrbar: In Cloudflare die Einträge von Render
wiederherstellen (A `@` → `216.24.57.1` / `216.24.57.253`, CNAME `www` →
`behringer.onrender.com`) oder die Nameserver bei IONOS zurück auf
`ns1050.ui-dns.*` stellen.
