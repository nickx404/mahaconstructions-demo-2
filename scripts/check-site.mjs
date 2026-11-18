import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { pageRoutes, pageMetadata } from '../src/site/seo.js';
import { serveBuild } from './static-server.mjs';

const base = process.env.SITE_BASE_PATH || '/';
const origin = 'http://127.0.0.1:4176';
const server = await serveBuild(base);
const production = (await readFile('dist/robots.txt', 'utf8')).includes('Sitemap:');
const output = 'output/seo-audit';
await mkdir(output, { recursive: true });
let browser;
const report = { routes: [], interactions: [], screenshots: [] };
try {
  browser = await chromium.launch({ ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  // Keep checks read-only: external frames/images can render, receiver requests never run.
  await context.route('https://script.google.com/**', (request) => request.abort());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  async function visit(route) {
    const response = await page.goto(`${origin}${base}${route.slice(1)}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main h1');
    await page.waitForSelector('.maha-chat-launcher');
    return response;
  }
  // Validate raw responses and no-JavaScript rendering, not only React's live DOM.
  const staticContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } });
  await staticContext.route('**/*', (request) => new URL(request.request().url()).origin === origin ? request.continue() : request.abort());
  const staticPage = await staticContext.newPage();
  const localLinks = new Set();
  for (const route of pageRoutes) {
    console.log(`Checking ${route}`);
    const response = await visit(route);
    assert.equal(response.status(), 200, route);
    const expected = pageMetadata(route, production);
    assert.equal(await page.title(), expected.title, route);
    assert.equal(await page.locator('h1').count(), 1, route);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), expected.canonical);
    assert.equal(await page.locator('[name="robots"]').getAttribute('content'), expected.robots);
    assert.equal(await page.locator('input[type="email"]').count() > 0 || !['/', '/contact', '/joint-venture'].includes(route), true);
    const schema = await page.locator('script[type="application/ld+json"]').allTextContents();
    schema.forEach((value) => assert.ok(JSON.parse(value)['@context']));
    const links = await page.locator('a[href]').evaluateAll((anchors) => anchors.map((anchor) => anchor.href));
    for (const link of links) if (link.startsWith(origin) && !link.includes('#')) localLinks.add(link);
    const staticResponse = await staticPage.goto(`${origin}${base}${route.slice(1)}`);
    assert.equal(staticResponse.status(), 200);
    assert.ok((await staticPage.locator('main').innerText()).length > 100, `Static body on ${route}`);
    assert.ok(await staticPage.locator('main h1').isVisible(), `Visible static heading on ${route}`);
    const html = await staticResponse.text();
    assert.equal((html.match(/<title[ >]/g) || []).length, 1);
    assert.doesNotMatch(html, /maha-chat-panel|maha-lead-name/);
    assert.doesNotMatch(html, /https?:\/\/(?:localhost|127\.0\.0\.1)/, `Leaked build origin on ${route}`);
    const assets = await staticPage.locator('img[src], script[src], link[rel="stylesheet"], link[rel="modulepreload"], link[rel="icon"]').evaluateAll((elements) => elements.map((element) => element.src || element.href));
    for (const asset of assets) if (asset.startsWith(origin)) localLinks.add(asset);
    report.routes.push({ route, status: 200, title: expected.title, canonical: expected.canonical, robots: await page.locator('[name="robots"]').getAttribute('content'), staticText: true });
  }
  for (const link of localLinks) {
    const response = await context.request.get(link);
    assert.equal(response.status(), 200, `Broken internal link: ${link}`);
  }
  const missing = await visit('/this-page-does-not-exist');
  assert.equal(missing.status(), 404);
  assert.match(await page.title(), /Not Found/);
  assert.match(await page.locator('[name="robots"]').getAttribute('content'), /noindex/);
  assert.equal(await page.locator('link[rel="canonical"]').count(), 0);
  assert.equal((await context.request.get(`${origin}${base}assets/does-not-exist.js`)).status(), 404);
  report.interactions.push('Missing page and missing assets return HTTP 404; missing page stays noindex.');

  await visit('/');
  assert.equal(await page.locator('.hero-slide.is-active').count(), 1);
  await page.getByRole('button', { name: 'Next image', exact: true }).click();
  assert.ok((await page.locator('.hero-slide.is-active').getAttribute('class')).includes('is-active'));
  assert.match(await page.locator('.hero-slide.is-active img').getAttribute('alt'), /Achyuda/);
  await page.getByRole('button', { name: 'Previous image', exact: true }).click();
  assert.match(await page.locator('.hero-slide.is-active img').getAttribute('alt'), /Maha Kuber/);
  await page.screenshot({ path: `${output}/home-desktop.png` });
  report.screenshots.push('home-desktop.png');
  report.interactions.push('Hero arrows select Kuber/Achyuda correctly.');

  await visit('/projects');
  await page.getByRole('button', { name: 'Completed', exact: true }).click();
  assert.equal(await page.locator('.completed-project-card').count(), 18);
  await page.locator('.completed-project-card').first().click();
  await page.waitForSelector('.completed-media-stage');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.completed-media-stage').count(), 0);
  await visit('/projects?status=completed');
  assert.equal(await page.locator('.completed-project-card').count(), 18);
  report.interactions.push('Completed filter, query handoff and project lightbox work.');

  await visit('/projects/maha-kuber-thirumangalam');
  const galleryToggle = page.getByRole('button', { name: 'More photos', exact: true });
  await galleryToggle.click();
  assert.equal(await page.getByRole('button', { name: 'Show fewer photos', exact: true }).getAttribute('aria-expanded'), 'true');
  const firstTab = page.getByRole('tab', { name: 'Ground Floor', exact: true });
  await firstTab.focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.getByRole('tab', { name: 'First Floor', exact: true }).getAttribute('aria-selected'), 'true');
  assert.match(await page.locator('#plan-panel img').getAttribute('src'), /first-floor/);
  report.interactions.push('Project gallery expands and floor-plan keyboard navigation works.');

  await visit('/gallery');
  await page.getByRole('button', { name: 'Video gallery', exact: true }).click();
  assert.equal(await page.locator('.gallery-grid > *').count(), 2);
  await page.getByRole('button', { name: 'Photo gallery', exact: true }).click();
  assert.ok(await page.locator('.gallery-grid > *').count() > 2);
  report.interactions.push('Photo/video gallery toggles preserve the approved collections.');

  for (const route of ['/', '/contact', '/joint-venture']) {
    await visit(route);
    const form = page.locator('form.site-enquiry-form, form.contact-page-form').first();
    assert.equal(await form.locator('[name="name"]').getAttribute('required'), '');
    assert.equal(await form.locator('[name="phone"]').getAttribute('required'), '');
    assert.equal(await form.locator('[name="email"]').getAttribute('required'), null);
    assert.equal(await form.evaluate((element) => element.checkValidity()), false);
  }
  report.interactions.push('All three enquiry forms retain required name/phone, optional email and empty-form validation. No leads submitted.');
  await visit('/');
  await page.locator('.maha-chat-launcher').click();
  await page.waitForSelector('#maha-chat-panel');
  await page.getByRole('button', { name: 'Ongoing projects', exact: true }).click();
  await page.waitForSelector('#maha-lead-name');
  await page.locator('#maha-lead-name').fill('SEO check');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#maha-chat-panel').count(), 0);
  report.interactions.push('Chatbot opens, offers contact capture and dismisses by keyboard. No contact saved.');

  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/about-2', '/projects', '/contact', '/gallery', '/joint-venture', '/projects/maha-kuber-thirumangalam', '/projects/mahaa-achyuda-periyar-nagar']) {
    await visit(route);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Mobile overflow on ${route}`);
    await page.screenshot({ path: `${output}/${route === '/' ? 'home' : route.split('/').at(-1)}-mobile.png` });
  }
  await visit('/');
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForSelector('.site-header.is-scrolled');
  await page.locator('.menu-toggle').click();
  assert.ok(await page.locator('.main-nav.is-open').isVisible());
  report.interactions.push('Eight mobile routes fit 390px; homepage menu opens after scrolling.');
  assert.deepEqual(errors, [], 'Browser JavaScript errors');
  report.checkedInternalLinks = localLinks.size;
  await writeFile(`${output}/checks${production ? '' : '-preview'}.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
