# Sean Heffernan Site (Vanilla Static)

Framework-free, no-build multi-page static site.

## Structure
- `index.html`: homepage
- `journal/index.html`: journal listing page
- `journal/entries/index.html`: journal entry renderer (uses `?slug=`)
- `assets/css/main.css`: shared styles
- `assets/js/site-shell.js`: shared header/footer shell
- `assets/js/journal.js`: journal list + entry rendering logic
- `assets/images/`: image assets
- `assets/icons/`: icon assets
- `content/journal/*.md`: markdown journal entry content
- `manifest.json`: journal metadata + markdown file paths

## Add a new journal entry
1. Create a markdown file in `content/journal/` (example: `2026-week-11.md`).
2. Add an item to `manifest.json` with:
   - `slug`
   - `title`
   - `date` (`YYYY-MM-DD`)
   - `week`
   - `summary`
   - `file` (example: `/content/journal/2026-week-11.md`)
3. Refresh the site.

## Local preview
Run from repo root:

```bash
python3 -m http.server 8000
```

Then open:
- `http://localhost:8000/`
- `http://localhost:8000/journal/`
