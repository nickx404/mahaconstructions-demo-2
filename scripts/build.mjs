import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { build, preview } from 'vite';
import { chromium } from 'playwright';
import { pageRoutes, pageMetadata, sitemapXml, siteOrigin } from '../src/site/seo.js';

const production = process.argv.includes('--production');
process.env.SITE_INDEXABLE = String(production);
if (production) process.env.SITE_BASE_PATH = '/';

await build();
const server = await preview({ preview: { host: '127.0.0.1', port: 4175, strictPort: true, open: false } });
let browser;
try {
  browser = await chromium.launch({ ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  const base = server.config.base;
  const origin = 'http://127.0.0.1:4175';
  const template = await readFile(path.join(server.config.build.outDir, 'index.html'), 'utf8');
  for (const route of [...pageRoutes, '/404']) {
    const context = await browser.newContext({ reducedMotion: 'reduce', serviceWorkers: 'block' });
    await context.addInitScript(() => { window.__MAHA_PRERENDER__ = true; });
    // Never load external embeds, contact receivers or third-party resources during a build.
    await context.route('**/*', (request) => new URL(request.request().url()).origin === origin ? request.continue() : request.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    // Render each route from the untouched shell, including on repeat builds.
    await page.route('**/*', (request) => request.request().isNavigationRequest() && request.request().frame() === page.mainFrame()
      ? request.fulfill({ contentType: 'text/html', body: template }) : request.fallback());
    await page.goto(`${origin}${base}${route.slice(1)}`, { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('#root main h1') && document.querySelector('[data-seo][name="robots"]'));
    assert.deepEqual(errors, [], `Browser errors on ${route}`);
    const metadata = pageMetadata(route, production);
    assert.equal(await page.title(), metadata.title, `Title on ${route}`);
    assert.equal(await page.locator('h1').count(), 1, `One primary heading on ${route}`);
    assert.equal(await page.locator('link[rel="canonical"]').count(), metadata.found ? 1 : 0);
    assert.equal(await page.locator('[name="robots"]').getAttribute('content'), metadata.robots);
    // Snapshot only page content: no visitor/session data or auto-opening chat UI.
    assert.equal(await page.locator('.maha-chat').count(), 0);
    const root = await page.locator('#root').innerHTML();
    const head = await page.locator('head').innerHTML();
    // Vite's lazy imports insert absolute preload URLs; never publish the build server origin.
    const html = template.replace(/<head>[\s\S]*?<\/head>/, `<head>${head}</head>`).replace('<div id="root"></div>', `<div id="root">${root}</div>`).replaceAll(origin, '');
    assert.doesNotMatch(html, /https?:\/\/(?:localhost|127\.0\.0\.1)/, `Local origin leaked on ${route}`);
    const target = route === '/404' ? path.join(server.config.build.outDir, '404.html') : path.join(server.config.build.outDir, route.slice(1), 'index.html');
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, html);
    console.log(`Prerendered ${route} (${metadata.robots})`);
    await context.close();
  }
  await writeFile(path.join(server.config.build.outDir, 'robots.txt'), `User-agent: *\nAllow: /\n${production ? `\nSitemap: ${siteOrigin}/sitemap.xml\n` : '# Preview: pages carry noindex; crawling remains allowed to read it.\n'}`);
  await writeFile(path.join(server.config.build.outDir, 'sitemap.xml'), production ? sitemapXml() : '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n');
  console.log(`Built ${production ? 'PRODUCTION (indexable)' : 'PREVIEW (noindex)'} site at ${base}`);
} finally {
  await browser?.close();
  await new Promise((resolve, reject) => server.httpServer.close((error) => error ? reject(error) : resolve()));
}
