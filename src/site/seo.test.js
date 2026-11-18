import assert from 'node:assert/strict';
import test from 'node:test';
import { pageRoutes, pageMetadata, seoHead, sitemapXml, structuredData } from './seo.js';
import { ongoingProjects } from './siteContent.js';

test('canonical pages have unique descriptions/titles and previews stay noindex', () => {
  const canonical = pageRoutes.filter((route) => route !== '/about-us');
  for (const key of ['title', 'description']) assert.equal(new Set(canonical.map((route) => pageMetadata(route)[key])).size, canonical.length);
  for (const route of pageRoutes) {
    assert.match(pageMetadata(route).robots, /^noindex/);
    assert.match(pageMetadata(route, true).canonical, /^https:\/\/mahaconstructions\.in\//);
    assert.equal((seoHead(route).match(/rel="canonical"/g) || []).length, 1);
  }
});

test('aliases, query filters and trailing slashes resolve to the approved canonical', () => {
  assert.equal(pageMetadata('/about-us/').canonical, pageMetadata('/about-2').canonical);
  assert.equal(pageMetadata('/projects?status=completed').canonical, 'https://mahaconstructions.in/projects');
  assert.match(pageMetadata('/about', true).robots, /^noindex/);
  assert.equal(pageMetadata('/missing', true).found, false);
  assert.match(pageMetadata('/missing', true).robots, /^noindex/);
  assert.doesNotMatch(seoHead('/missing'), /rel="canonical"/);
});

test('sitemap contains canonical approved routes and no concepts, aliases or placeholders', () => {
  const sitemap = sitemapXml();
  assert.doesNotMatch(sitemap, /about-us|<loc>[^<]*\/about<|ongoing-project|<loc>[^<]*\?|404/);
  for (const project of ongoingProjects) assert.ok(sitemap.includes(`/projects/${project.slug}</loc>`));
  assert.equal((sitemap.match(/<loc>/g) || []).length, pageRoutes.length - 2);
});

test('schema uses confirmed company facts, project breadcrumbs and no unverified ratings/address', () => {
  const home = structuredData(pageMetadata('/', true));
  assert.equal(home['@graph'].find((entry) => entry['@type'] === 'Organization').telephone, '+919940407777');
  assert.doesNotMatch(JSON.stringify(home), /aggregateRating|streetAddress|priceRange|sameAs/);
  const project = structuredData(pageMetadata(`/projects/${ongoingProjects[0].slug}`, true));
  assert.equal(project['@graph'].find((entry) => entry['@type'] === 'BreadcrumbList').itemListElement.length, 3);
  assert.equal(structuredData(pageMetadata('/about', true)), null);
});
