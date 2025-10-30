# Architektur & Dokumentation – 252425 Homelab

Diese Datei beschreibt Struktur, Komponenten und Abläufe der statischen Website. Sie ergänzt das Repository-README um technische Details.

## Verzeichnisstruktur (Top-Level)
- `index.html`, `faq.html`, `support.html`, `kontakt.html`, `index.html` – Hauptseiten.
- `navbar.html`, `footer.html` – Inkludierte Layout-Bausteine.
- `theme.css`, `navbar.css`, `footer.css`, `form-styles.css` – Stylesheets.
- `theme.js`, `navbar.js`, `load-navbar.js`, `footer.js`, `modal.js`, `auto-modal.js`, `search.js`, `blog-preview.js`, `support.js` – Client-Skripte.
- `search-index.json` – Datenquelle für die On-Site-Suche.
- `ar-models/` – Platz für GLB/USdz-Modelle.
- `sitemap.*`, `robots.txt`, `ai.txt`, `CNAME`, `wrangler.toml` – Meta- und Deployment-Dateien.

## Seitenaufbau
Jede Seite enthält einen Platzhalter für Navigation (`<div id="navbar-placeholder">`) sowie Footer (`<div id="footer-container">`). Die Inhalte der Seiten konzentrieren sich auf Sections mit Kartenlayouts und Callouts.

- **Index**: Startkarten für Dienste & Projekte, Spotlight-Modals, FAQ-Auszug, Blog-Vorschau und Kontaktmöglichkeiten.
- **HOMELAB**: Tabellarische Auflistung nach Kategorien (Hardware, Software, Netzwerk, Monitoring, Backups, Roadmap).
- **Support**: Formular mit Input-Feldern, Auswahl der Problemkategorie und direkter Mailto-Auslösung.
- **FAQ**: Accordion-/Cardstruktur für Fragen und Antworten.
- **Kontakt**: Kontaktdaten, Social Links, PGP-Informationen.

## Komponenten
### Navigation (`navbar.html`)
- Desktop- und Mobilnavigation.
- Burger-Button (`#navbar-toggle`) zur Steuerung der Mobile Navigation.
- Links tragen `.nav-link` zum Aktivieren/Deaktivieren des aktiven Zustands.

### Footer (`footer.html`)
- Kontakt- und Social-Links.
- Copyright, Impressums-/Datenschutzhinweise.

### Modals (`modal.js`, `auto-modal.js`)
- Klassische Informationsfenster (`.modal`) werden über `data-modal`-Attribute geöffnet.
- Auto-Spotlight-Modals erhalten zusätzliche Datenattribute:
  - `data-frequency` (z. B. `always`, `once`, `daily`, `weekly`, `interval`).
  - `data-cooldown-hours` für Intervallsteuerung.
  - Buttons mit `.quiet-close` setzen eine Tages-Sperre (LocalStorage).
  - Preview über `?spotlightPreview=<modal-id>`.

### Theme Switcher (`theme.js`)
- Unterstützt `light`, `dark`, `pitch` sowie `system`.
- Persistenz via `localStorage` (`themePreference`).
- Dropdown-Menü wird beim Klick auf `#themeSwitch` erzeugt.
- Anpassung des Icons (`#themeIcon`).
- Reagiert auf `prefers-color-scheme`-Änderungen, wenn die Präferenz `system` ist.

### Suche (`search.js`)
- Overlay mit Eingabefeld, Ergebnissen und leeren Zuständen.
- Lädt `search-index.json` Lazy, sobald das Overlay geöffnet oder eine Eingabe erfolgt.
- Snippet-Generierung mit Kontext & Hervorhebung (`<mark>`).
- Body-Scroll-Lock während der Suche.

### Blog-Vorschau (`blog-preview.js`)
- Greift auf mehrere Feed-Formate (JSON, RSS/Atom) zu.
- Normalisiert Beiträge (Titel, URL, Beschreibung, Datum, Bild).
- Zeigt Statusmeldungen bei Fehlern oder Inkompatibilitäten an.
- Extrahiert Bilder aus JSON-Feldern, Anhängen oder HTML-Inhalten.

### Supportformular (`support.js`)
- Abfang des Submit-Events.
- Zusammenbau eines `mailto:`-Links mit Formularwerten.
- Kein Backend erforderlich – Nutzerin/Nutzer sendet E-Mail über lokales Mailprogramm.

## Styling
- Globale Variablen, Themes und Utility-Klassen in `theme.css`.
- Navigationsspezifische Styles in `navbar.css` (inkl. Mobile Breakpoints).
- Footer-spezifische Styles in `footer.css`.
- Formular-Styles (`form-styles.css`) für Support- und Kontaktformulare.

## Deployment-Workflow
1. Änderungen committen und ins Repository pushen.
2. Cloudflare Wrangler (Workers/Pages) deployt das Wurzelverzeichnis (`wrangler.toml` mit `bucket = "."`).
3. Domain-Setup über `CNAME`.

## Wartung & Erweiterung
- **Neue Seiten**: HTML-Datei im Root anlegen, Platzhalter für Navbar/Footer integrieren, `search-index.json` und ggf. `sitemap.*` aktualisieren.
- **Weitere Modals**: HTML-Struktur kopieren, `id` vergeben, `data-modal` oder `auto-spotlight`-Klassen ergänzen.
- **Blog-Feeds**: Falls der externe Blog umzieht, die URLs in `SOURCES` (in `blog-preview.js`) anpassen.
- **AR-Modelle**: Modelle im `ar-models/`-Verzeichnis ablegen und in `index.html` referenzieren.
- **Crawler-Policies**: `robots.txt` und `ai.txt` pflegen, um Zugriff von Bots/AI zu steuern.

## Tests
- Aufgrund der statischen Natur existieren keine automatisierten Tests. Manuelle Smoke-Tests: Navigation, Theme-Switcher, Modals, Suche, Supportformular, Blog-Vorschau.

