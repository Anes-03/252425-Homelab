# Repository Guidelines

## Project Structure & Module Organization
The site is a static bundle served from the repository root. Top-level HTML entry points such as `index.html`, `support.html`, `faq.html`, and `kontakt.html` pull in shared fragments. Reusable layout pieces live in `navbar.html`, `footer.html`, their companion CSS files, and loader scripts (`load-navbar.js`, `footer.js`). Interactive behaviour is kept in focused modules (`theme.js`, `modal.js`, `auto-modal.js`, `search.js`). Long-form references and design rationales live in `docs/`. Keep any new assets alongside their feature to simplify static hosting.

## Build, Test, and Development Commands
- `python3 -m http.server 8000` — Serve the site locally from the repository root for quick validation.
- `npx serve .` — Alternative static server with correct MIME types when testing progressive enhancement.
- `npx lighthouse http://localhost:8000` — Optional accessibility/performance audit once changes are running. Ship assets minified before publishing.

## Coding Style & Naming Conventions
Follow the existing vanilla stack: semantic HTML sections, BEM-inspired utility classes, and descriptive IDs. Keep HTML attributes lowercase and file names kebab-cased. CSS uses 4-space indentation; JavaScript modules use 2 spaces, `const`/`let`, and single quotes. Prefer early returns in functions and guard for missing elements (`if (!node) return`). When extending components, reuse existing custom properties from `theme.css` instead of hard-coded colors.

## Testing Guidelines
Run the site locally and smoke-test primary flows: navigation load (`load-navbar.js`), theme switcher states, modal open/close, and support form validation. Validate search by generating `search-index.json` and confirming keyboard support. Test on both dark/light modes and narrow viewports, ensuring cards and FAQ accordions remain accessible. Before pushing, preload assets in the inspector to catch 404s and check the console for warnings.

## Commit & Pull Request Guidelines
Use Conventional Commit prefixes (`feat`, `fix`, `docs`, `chore`) with optional scopes matching the section, e.g. `feat(search)` reflects the existing history. Keep commit bodies concise, listing user-facing changes and follow-up tasks. Pull requests should include a short summary, test notes (or explicit "no automated tests"), and screenshots/gifs for visual tweaks. Link related issues or TODO references so deployment logs remain traceable.
