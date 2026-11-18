# Maha Constructions SEO audit

Audit date: **18 November 2026**. Target: **https://mahaconstructions.in**, company-name searches and relevant Chennai project/service searches. Implementation and measurements are local; production hosting, DNS and Google account setup remain deferred.

## Findings and changes

| Priority | Finding | Implemented result |
| --- | --- | --- |
| High | Every route originally received the same empty React HTML shell. | Build-time browser prerendering now produces readable HTML and metadata for ten implemented URLs, plus a standalone 404 document. Raw-response and JavaScript-disabled checks verify content. |
| High | Generic description, inconsistent page titles, no canonical URLs. | One shared route metadata source supplies unique canonical-page titles and descriptions, company/location context, canonical URLs and social metadata. Existing component title effects no longer conflict. Project metadata uses approved shared facts. |
| High | No crawl discovery files or preview indexing policy. | Production builds generate an eight-URL sitemap and robots file. Preview builds keep all pages `noindex`, allow crawlers to read that directive and publish an empty sitemap. The GitHub workflow uses preview mode. |
| High | Unknown URLs rendered the homepage. | Unknown routes now show a Not Found page, carry `noindex` and omit canonical links. A generated `404.html` supports true missing-page responses; production hosting must configure those responses. |
| Medium | Duplicate About URLs and project filter variations. | `/about-us` canonicals to `/about-2`; `/about` remains available but `noindex`. Project filter query URLs canonical to `/projects`. Aliases, filters, concept and missing pages stay out of the sitemap. Host-level alias redirects are documented for launch. |
| Medium | No favicon or link-preview artwork. | Site-wide ICO (16/32/48px), 96px PNG, 180px Apple touch icon and a 1200×630 social preview. The favicon uses the existing roof/A symbol from the approved logo. |
| Medium | No company/entity structured data. | Organization and WebSite data on the homepage, WebPage data on canonical public pages, and breadcrumb data on inner pages. Confirmed phone, email, founding year and Chennai service area only; no invented address, owned profiles, prices, availability or rating markup. |
| Medium | Oversized images, globally loaded route modules and early floor-plan downloads. | Smaller WebP derivatives, responsive mobile hero sources, resized lossless logo derivatives, priority hints on visible hero images, lazy floor-plan images and separate About/Contact/Gallery JavaScript chunks. Approved original files remain intact. |
| Medium | Accessibility findings affecting navigation and reading. | Corrected accessible names on chatbot/project/gallery controls, gallery heading order, review-star semantics, small review targets, form-button contrast and project-label/tab contrast. Existing layouts and motion remain. |
| Low | Project directory copy described development work rather than the company portfolio. | Replaced with a concise description of current and completed Chennai projects. Homepage heading now includes accessible company/location context while retaining its visible wording. |

No redesign, keyword stuffing, invented project claims, backlink purchases or review/rating schema were introduced. Stock imagery and existing review content were preserved rather than treated as verified company evidence.

## Verification

- **38 unit checks passed**, covering the new SEO rules and existing chatbot/contact/receiver behavior.
- Production and nested-path preview builds passed browser checks on all ten implemented URLs, including `/about-us` and `/about`.
- Verified one primary heading, one title, correct canonical/robots metadata, valid JSON-LD syntax, readable static HTML, visible headings without JavaScript and no serialized chatbot/contact capture data.
- Checked **39 distinct internal links/assets**, including route files, favicon, lazy-loaded modules/styles and local imagery. Generated output is checked for leaked localhost/build-server URLs.
- Tested actual missing-page and missing-asset HTTP 404 responses on the verification server. This does not configure the future public host.
- Verified carousel arrows, completed-project filter/query handoff, archive lightbox, expanded project gallery, keyboard floor-plan tabs, photo/video toggles, chatbot opening/contact capture/dismissal, empty-form validation and the mobile menu.
- Eight public page layouts fit a 390px viewport without horizontal overflow. Screenshots are saved locally under `output/seo-audit/`.
- Both the original and optimized desktop Kuber QR decode to the approved Google Maps URL. Original approved artwork is retained.
- No test enquiry was delivered and no Google, DNS or hosting account was changed.

## Mobile performance and SEO measurements

Lighthouse runs use the production build, downloaded Chromium, default mobile simulation and a local static verification server with gzip enabled. They include existing motion and external resources. These are lab diagnostics, not live Core Web Vitals or a forecast of Google rankings. Measurements vary with the machine and external services.

| Page | Performance | Accessibility | Best practices | SEO | LCP |
| --- | ---: | ---: | ---: | ---: | ---: |
| Home | 77 | 96 | 100 | 100 | 5.5 s |
| About us | 80 | 100 | 100 | 100 | 4.2 s |
| Projects | 77 | 100 | 100 | 100 | 5.9 s |
| Joint venture | 87 | 100 | 100 | 100 | 3.6 s |
| Contact | 74 | 100 | 100 | 100 | 4.5 s |
| Gallery | 73 | 100 | 100 | 100 | 5.5 s |
| Maha Kuber | 73 | 100 | 100 | 100 | 7.2 s |
| Mahaa Achyuda | 81 | 100 | 100 | 100 | 4.7 s |

All eight public pages passed Lighthouse's technical SEO checks. That checklist does not establish indexing, content authority, Business Profile ownership, search demand or first-place rankings.

### Image reductions

| Asset | Original | Derivative used by site |
| --- | ---: | ---: |
| Desktop Kuber banner | 1,075,162 bytes | 466,778 bytes, same dimensions |
| Mobile Kuber banner | 484,494 bytes | 274,232 bytes at 800px; 394,636-byte full-resolution option |
| Kuber elevation | 2,675,282 bytes | 426,378 bytes, same dimensions |
| Light-background logo | 465,153 bytes | 41,736 bytes at 600px wide |
| Dark-background logo | 178,407 bytes | 18,328 bytes at 600px wide |

The main JavaScript bundle is approximately 173 kB gzipped; About, Contact and Gallery code load separately. Font choices, artwork proportions and motion timings are retained.

## Remaining findings and launch dependencies

1. **Mobile loading remains the main performance gap.** Several pages exceed the 2.5-second LCP goal in simulation. The large hero/elevation imagery, JavaScript-driven entrances, React's interactive rendering, shared styles and external fonts/media contribute. Smaller derivatives and loading hints are implemented; measure the real host with compression/CDN caching before deciding on further image variants or a larger rendering/animation refactor. Do not remove approved text or crop banners to improve a score.
2. **The faint homepage MC watermark is decorative.** Lighthouse flags its intentionally low contrast even though it is `aria-hidden`. Its approved appearance is preserved; essential controls/text contrast issues found in this pass were corrected.
3. **Source maps are not published.** Lighthouse's source-map diagnostic remains. This affects debugging, not crawlable page content; public source maps were not added solely to change the score.
4. **Tooling dependency advisory remains.** Vite/plugin patch updates were applied during installation. `npm audit` still reports five high-severity entries through the tooling's `picomatch` dependency chain; the registry's latest 4.x release is 4.0.7. No forced downgrade or unrelated toolchain migration was performed. Recheck upstream fixes before exposing development tooling; the deployed website consists of static output.
5. **Company address and profile details need confirmation.** Do not add address-dependent LocalBusiness schema, map ownership claims, social profile identity links or further claims until confirmed. Keep existing approved metrics unchanged.
6. **Visual/content stand-ins remain.** Some photos, watermarked family artwork and testimonial/review claims require client approval or evidence. They are not used to invent structured-data ratings or project claims. Genuine company photography and verified local business/profile details will strengthen the eventual site.
7. **Live host behavior is unverified.** HTTPS, canonical hostname/path redirects, real 404 responses, caching/compression, public favicon/social fetches and the custom-domain form receiver need live checks.
8. **Google indexing and rankings are unverified.** Search Console verification, sitemap submission, URL inspection, Google Business Profile review and field performance monitoring require the launched domain and client-owned accounts.

See [the launch checklist](SEO_LAUNCH.md) for exact build commands, required host behavior and post-launch checks. Prioritize launch verification and approved company identity/content after the code is hosted; indexing and rankings cannot be guaranteed.

## Reproducing the audit

```sh
npm ci
npx playwright install chromium
npm test
npm run build:production
npm run check:site
npm run audit:mobile
```

Run Lighthouse separately from browser checks for cleaner timing. HTML/JSON Lighthouse reports, checks and screenshots are regenerated under `output/seo-audit/` and ignored by Git. For nested previews, set `SITE_BASE_PATH` before `npm run build` and `npm run check:site`; restore `npm run build:production` for the launch package.
