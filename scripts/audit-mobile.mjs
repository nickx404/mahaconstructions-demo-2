import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { serveBuild } from './static-server.mjs';
import { pageRoutes } from '../src/site/seo.js';

const server = await serveBuild('/', 4177);
let chrome;
try {
  chrome = await launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless', '--disable-gpu', '--no-first-run'] });
  await mkdir('output/seo-audit', { recursive: true });
  const summaries = [];
  const routes = process.argv.length > 2 ? process.argv.slice(2) : pageRoutes.filter((route) => !['/about', '/about-us'].includes(route));
  for (const route of routes) {
    console.log(`Mobile Lighthouse: ${route}`);
    const result = await lighthouse(`http://127.0.0.1:4177${route}`, {
      port: chrome.port, output: ['json', 'html'], logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      maxWaitForLoad: 30000,
    });
    const name = route === '/' ? 'home' : route.split('/').at(-1);
    await writeFile(`output/seo-audit/lighthouse-${name}.json`, result.report[0]);
    await writeFile(`output/seo-audit/lighthouse-${name}.html`, result.report[1]);
    const { lhr } = result;
    const summary = {
      route, fetchedAt: lhr.fetchTime,
      scores: Object.fromEntries(Object.entries(lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)])),
      metrics: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index'].map((key) => [key, lhr.audits[key].displayValue])),
      failures: Object.values(lhr.audits).filter((audit) => audit.score !== null && audit.score < 1 && ['binary', 'numeric'].includes(audit.scoreDisplayMode)).map((audit) => ({ id: audit.id, title: audit.title, value: audit.displayValue, score: audit.score })),
      warnings: lhr.runWarnings,
    };
    summaries.push(summary);
    console.log(JSON.stringify(summary));
  }
  await writeFile('output/seo-audit/lighthouse-summary.json', JSON.stringify(summaries, null, 2));
} finally {
  await chrome?.kill();
  await new Promise((resolve) => server.close(resolve));
}
