# Cont — Gujarati Markdown Reader

A minimal, responsive Gujarati-first reading site for the provided Markdown document.

## Files
- `index.html` — page layout
- `styles.css` — typography and layout
- `app.js` — Markdown rendering, table of contents, search, font-size and theme controls
- `content/shreeramtools.md` — original uploaded document
- `content/book.json` — title metadata

## Run locally
Run any static server from this directory, for example:
```bash
python -m http.server 8000
```
Then open http://localhost:8000. The page loads Markdown and renderer libraries in the browser.

## Deploy with GitHub Pages
1. Create a public GitHub repository.
2. Upload all files and folders from this directory to its root.
3. In repository Settings → Pages, choose `Deploy from a branch`, branch `main`, folder `/ (root)`, then Save.
4. After GitHub Pages finishes building, open the URL shown in Settings → Pages.

The original Markdown is preserved. The reader uses marked.js plus DOMPurify for safe display of Markdown content.
