# Wanderlust - Frontend (Frosted Glass Landing Page)

This workspace contains a front-end landing page implementing a modern, Apple-like, frosted-glass aesthetic for a travel website called "Wanderlust".

Files added/updated:

- `index.html` — Main HTML for the landing page. Includes links to Google Fonts and Font Awesome.
- `styles.css` — Styling (frosted glass, layout, responsive behavior, animations).
- `script.js` — Interactivity: mobile nav toggle, header scroll behavior, form validation, lazy-loading previews, and hero video fallback.

Preview locally

1. Open the workspace folder in your editor (already here).
2. Start a simple HTTP server from the project root (recommended to avoid CORS and autoplay issues with local file://):

```bash
# Python 3
python3 -m http.server 8000
```

3. Open `http://localhost:8000` in your browser.

Notes

- The hero uses a remote MP4 video (Vimeo link) and a fallback image. If autoplay is blocked by the browser, the script will fall back to the image.
- Icons use Font Awesome CDN.
- The page is static and intended as front-end prototype. Replace image/video URLs with your assets as needed.

Next steps you might consider:

- Hook the search form to a real backend or a client-side search results page.
- Add accessibility improvements and keyboard focus styles.
- Add unit tests or an E2E visual regression test for UI stability.
