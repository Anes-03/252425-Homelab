# 252425 Homelab

252425 Homelab ist eine persönliche, statische Website, auf der ich mein Homelab, Projekte und eigene Dienste (z. B. Cloud und KI) vorstelle. Die Seite ist komplett in HTML, CSS und Vanilla JavaScript umgesetzt, responsiv gestaltet und unterstützt mehrere Farbmodi. Inhalte sind derzeit auf Deutsch, optional kann eine englische Variante bereitgestellt werden.

## Live

- Website: https://252425.xyz/
- Blog: https://blog.252425.xyz/

## Inhalte & Seiten

- **Home (`index.html`)**: Übersicht über Homelab-Dienste, Projekte, aktuelle Highlights, Karten mit Detailmodals und Blog-Preview.
- **HOMELAB (`index.html`)**: Hardware, Software, Netzwerk- und Sicherheitskomponenten, geplante Erweiterungen sowie AR/3D-Modelle.
- **Support (`support.html`)**: Formular für Supportanfragen per E‑Mail inklusive Mailto-Generator (`support.js`).
- **FAQ (`faq.html`)**: Antworten auf häufige Fragen rund um Homelab, Datenschutz und organisatorische Themen.
- **Kontakt (`kontakt.html`)**: Kontaktmöglichkeiten, Social Links und PGP-Hinweise.
- **Sitemap (`sitemap.html` & `sitemap.xml`)**: Besucher- und Crawler-Übersichten.
- **Richtlinien (`robots.txt`, `ai.txt`)**: Steuerung von Suchmaschinen- und KI-Crawlern.

## Funktionen

- Modernes, responsives Layout mit Karten, Modals und thematischer Navigation.
- Dark-/Light-/Pitch-Black-Mode mit Persistenz (`theme.js`, `theme.css`).
- Wiederverwendbare Navigation & Footer (`navbar.html`, `footer.html`, `navbar.css`, `footer.css`).
- Spotlight-Modals und Auto-Hinweise (`modal.js`, `auto-modal.js`).
- Clientseitige Suche mit Highlighting (`search.js`, `search-index.json`).
- Blog-Preview mit Aggregation mehrerer Feed-Quellen (`blog-preview.js`).

## Dienste (Auszug)

- 252425 Cloud: https://mynextcloud.252425.xyz
- 252425 AI: https://ai.252425.xyz
- Weitere Dienste geplant: Intranet

## HOMELAB

- HTML5, CSS3, JavaScript (Vanilla)
- Icons: Font Awesome (CDN)
- Hosting: Cloudflare Pages/Workers (konfiguriert über `wrangler.toml`)
- Domain: `CNAME` zeigt auf 252425.xyz
- GitHub als Source of Truth, Deployments erfolgen direkt aus dem Main-Branch

## Projektstruktur (Kurz)

- Seiten: `index.html`, `index.html`, `support.html`, `faq.html`, `kontakt.html`, `sitemap.html`
- Komponenten/Assets: `navbar.html`, `footer.html`, `navbar.css`, `footer.css`, `theme.css`, `theme.js`, `modal.js`, `auto-modal.js`, `load-navbar.js`, `search.js`
- Daten: `search-index.json`, `ar-models/`, `blog-preview.js`
- Medien: `banner.jpeg`, Favicons/Icons, `logo.jpeg`

## Lokale Entwicklung

- Variante 1: `index.html` direkt im Browser öffnen (funktioniert ohne Build-Setup).
- Variante 2: Lokalen Server starten, z. B. `python -m http.server 8000` und `http://localhost:8000` öffnen, damit Fetch-Aufrufe für Navbar/Footer/Suche funktionieren.

## Deployment & Wartung

- Deployments laufen über Cloudflare Pages; Änderungen im Main-Branch werden automatisch veröffentlicht.
- `search-index.json` bei neuen Inhalten aktualisieren, damit die Suche korrekte Treffer liefert.
- Spotlight-Hinweise über `auto-modal.js` steuern (`data-frequency`, `data-cooldown-hours`).
- Navigation/Footer ändern sich global über Updates in `navbar.html` bzw. `footer.html`.
- Bei Anpassungen an Crawler-Richtlinien `robots.txt` und `ai.txt` überprüfen.

## Beiträge & Issues

Feedback und Vorschläge sind willkommen. Erstelle gern ein Issue oder einen PR.

## Kontakt & Support

- E‑Mail: info@252425.xyz
- Support: `support.html` nutzen oder direkt an support@252425.xyz schreiben
- Blog: https://blog.252425.xyz/

## Lizenz

Aktuell keine öffentliche Lizenzdatei. Inhalte sind urheberrechtlich geschützt; auf Wunsch kann später eine `LICENSE` ergänzt werden.
