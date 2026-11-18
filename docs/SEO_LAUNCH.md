# SEO launch checklist

Canonical origin: **https://mahaconstructions.in**. Code remains in GitHub. Hosting selection and DNS changes are deferred; the existing Google Apps Script enquiry receiver does not require a website backend server.

## Build and verify before upload

1. Install with `npm ci` and `npx playwright install chromium` (Linux CI: `--with-deps chromium`).
2. Supply the existing public `VITE_CHATBOT_LEAD_URL` build variable when enquiry delivery is configured; keep credentials in Apps Script properties only.
3. Run `npm test`, `npm run build:production`, then `npm run check:site`. Run `npm run audit:mobile` separately.
4. Upload **the contents of `dist/`**, including all generated route directories, assets, favicon files, `robots.txt`, `sitemap.xml` and `404.html`.
5. Confirm the homepage response contains `index, follow`; `/about` and missing pages must retain `noindex`. The sitemap must contain eight canonical URLs and no preview hosts, aliases, query strings or concept pages.

Use `npm run build` for GitHub Pages previews. Its intentionally empty sitemap and page-level `noindex` prevent competing preview listings. Crawling remains allowed so search engines can see `noindex`. Do not add a blanket robots disallow to an already indexed preview.

## Required hosting behavior

- Serve the generated `/<route>/index.html` for each approved route. Do not send every request to the homepage.
- Use `https://mahaconstructions.in` as the preferred origin. Permanently redirect HTTP and `www` to that origin, preserving the path and query string. Verify HTTPS certificates cover both names before forcing redirects.
- Prefer the extensionless, slash-free canonical URLs for inner pages. If the host automatically adds trailing slashes for directories, configure internal index-file resolution and canonical redirects without creating a redirect loop. Redirect direct `/index.html` page URLs to their matching canonical paths.
- Redirect `/about-us` to `/about-2` permanently when the host supports redirects. Keep `/about` available with its existing `noindex`. Do not restore a redirect or alias for the removed Kuber slug.
- Return **HTTP 404** with `404.html` for missing pages and missing assets. Do not rewrite them to `index.html` with status 200.
- Enable Brotli or gzip for HTML, CSS, JS, XML and JSON. Cache hashed `/assets/` files for one year with `immutable`; revalidate HTML, robots and sitemap. Give stable-name image files a short cache lifetime or version their names when changing them.
- Keep Googlebot able to fetch CSS, JavaScript, favicon, images and sitemap. Verify no host password, staging header or `X-Robots-Tag: noindex` remains on production.

GoDaddy Linux/cPanel can serve these static output files if chosen. Provider-specific redirect/404 rules must be set and tested on the chosen host. The local verification server models proper static responses; it does not configure the public host.

## Once the domain is live

1. Verify an owning client account's **Domain property** in Google Search Console using its DNS TXT record. Preserve existing email and other DNS records.
2. Submit `https://mahaconstructions.in/sitemap.xml`. Inspect the homepage, About, projects, both project detail pages, Joint Venture, Gallery and Contact. Confirm the rendered content, crawl access, canonical selection and indexing eligibility.
3. Test HTTPS and `www` redirects, direct deep links, missing-page status, favicon fetches and social preview image fetches on the real domain. External social preview tools cannot verify assets that only exist locally.
4. Run PageSpeed Insights on the live site and review Search Console's field Core Web Vitals when enough real traffic is available. Local Lighthouse measurements are diagnostic; they are not field measurements or ranking forecasts.
5. Using client-owned test details, submit one clearly marked enquiry from each entry point and verify the Sheet receipt and notification email. Confirm both apex and `www` origins are allowed by the receiver. This step sends real enquiries and was not performed during the local audit.
6. Confirm the business's office address, opening hours and owned Google Business Profile. Keep the company name, phone and website consistent. Only add address-based LocalBusiness schema and owned profile links after confirmation.
7. Replace remaining stock/watermarked imagery and any unapproved testimonial claims when approved material is supplied. Do not represent visual stand-ins as documented company projects.
8. Review indexing, branded queries, Chennai project/service queries and crawl errors after launch, then periodically. Search inclusion, favicon display and rankings are controlled by search engines; no first-place result or deadline is guaranteed.

## Official references

- [Google: JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google: canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google: favicon requirements](https://developers.google.com/search/docs/appearance/favicon-in-search)
- [Google: sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Google: Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [GitHub Pages usage limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
