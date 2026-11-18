# Maha Constructions website

React/Vite website for Maha Constructions. Production domain: `https://mahaconstructions.in`.

## Development and builds

```sh
npm ci
npx playwright install chromium
npm run dev
```

- `npm run build`: prerendered **preview**, with `noindex` on every page and an empty sitemap. The GitHub Pages workflow uses this command.
- `npm run build:production`: prerendered, indexable release for the production domain at `/`. Upload the contents of `dist/` when hosting is ready.
- `npm run preview`: inspect the latest build. Vite preview is a local development tool; production hosts must serve the generated page files and return actual 404 responses.
- `npm test`: contact, chatbot, receiver and SEO unit checks.
- `npm run check:site`: check the latest build's raw HTML, no-JavaScript pages, metadata, internal links/assets, missing pages, mobile overflow and key interactions. Does not send enquiries.
- `npm run audit:mobile`: mobile Lighthouse for all eight canonical public pages, against a local static server with gzip enabled. Run against a production build with other browser checks stopped for cleaner measurements.

Browser checks and reports go to `output/seo-audit/` (ignored by Git). On Linux CI, install browser system libraries with `npx playwright install --with-deps chromium`. To use an installed Edge browser locally instead, set `PLAYWRIGHT_CHANNEL=msedge` for build and interaction checks; the Lighthouse script uses downloaded Chromium.

`SITE_BASE_PATH` optionally sets a preview mount path, such as `/mahaconstructions-demo-2/`. The GitHub workflow reads the Pages configuration so it uses the repository path before a custom domain is connected and `/` afterwards. Production builds always use `/`. Presentation previews deliberately remain `noindex`; use `build:production` only when the client approves the public launch.

## SEO and launch

Route metadata, sitemap membership and structured data share `src/site/seo.js`; project facts come from `src/site/siteContent.js`. Adding an approved project there automatically includes its detail page in prerendering and the production sitemap. Unknown routes render the Not Found view. The original approved artwork stays in `public/images/`; the site uses smaller derivatives.

To regenerate favicon, social preview, logo and image derivatives, install Pillow and run `python scripts/prepare-seo-assets.py`. This is optional for builds; generated assets are checked in. The favicon extracts the existing roof/A from the approved logo, without drawing a new mark.

See [SEO audit](docs/SEO_AUDIT.md), [hosting launch checklist](docs/SEO_LAUNCH.md), and [presentation hosting setup](docs/PRESENTATION_HOSTING.md).

The enquiry backend remains Google Apps Script, independent of the website host. Follow [receiver setup](integrations/google-apps-script/README.md). Do not put email credentials or personal details into client code or URLs.
