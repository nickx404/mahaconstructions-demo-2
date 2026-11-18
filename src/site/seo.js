import { ongoingProjects } from './siteContent.js';

export const siteOrigin = 'https://mahaconstructions.in';
export const socialImage = `${siteOrigin}/images/maha-social-preview.jpg`;

const pages = {
  '/': { title: 'Maha Constructions | Homes & Joint Ventures in Chennai', description: 'Maha Constructions has been building in Chennai since 1990. Explore residential projects, construction services and joint ventures for landowners.', label: 'Home' },
  '/about-2': { title: 'About Maha Constructions | Chennai Builders Since 1990', description: 'Discover Maha Constructions, our Chennai roots since 1990, founder philosophy and approach to planning, material quality and coordinated construction.', label: 'About us' },
  '/about': { title: 'Our Story | Maha Constructions', description: 'Explore the history, founder philosophy and building principles behind Maha Constructions in Chennai.', label: 'Our story', noindex: true },
  '/projects': { title: 'Residential Projects in Chennai | Maha Constructions', description: 'Explore Maha Constructions residential projects in Chennai, including Maha Kuber in Thirumangalam, Mahaa Achyuda in Periyar Nagar and our completed-project archive.', label: 'Projects' },
  '/joint-venture': { title: 'Joint Venture Builders in Chennai | Maha Constructions', description: 'Explore a landowner partnership with Maha Constructions in Chennai. Learn about our joint venture approach and process, and enquire about your land.', label: 'Joint venture' },
  '/contact': { title: 'Contact Maha Constructions | Chennai Project Enquiries', description: 'Contact Maha Constructions in Chennai on +91 99404 07777. Enquire about residential projects, construction services or a joint venture for your land.', label: 'Contact' },
  '/gallery': { title: 'Photo & Video Gallery | Maha Constructions Chennai', description: 'View Maha Constructions Bhoomi Pooja photographs and company videos. Discover moments shared with landowners, families and our construction team.', label: 'Gallery' },
};

for (const project of ongoingProjects) {
  pages[`/projects/${project.slug}`] = {
    title: `${project.name}, ${project.location.split(',')[0]} | Maha Constructions`,
    description: `Explore ${project.name} in ${project.location}: ${project.details[1]} homes, ${project.details[2]}. View project details, floor plans and location, and contact Maha Constructions.`,
    label: project.name,
  };
}

export const pageRoutes = [...Object.keys(pages), '/about-us'];

export function pageMetadata(path, indexable = false) {
  const requested = path.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  const canonicalPath = requested === '/about-us' ? '/about-2' : requested;
  const page = pages[canonicalPath];
  return {
    ...(page || { title: 'Page Not Found | Maha Constructions', description: 'This page could not be found. Explore Maha Constructions projects or contact our Chennai team.', label: 'Page not found' }),
    canonicalPath,
    canonical: `${siteOrigin}${canonicalPath === '/' ? '/' : canonicalPath}`,
    robots: indexable && page && !page.noindex ? 'index, follow, max-image-preview:large' : 'noindex, follow',
    found: Boolean(page),
  };
}

export function structuredData(metadata) {
  if (!metadata.found || metadata.noindex) return null;
  const graph = [{ '@type': 'WebPage', '@id': `${metadata.canonical}#webpage`, url: metadata.canonical, name: metadata.title, description: metadata.description, isPartOf: { '@id': `${siteOrigin}/#website` } }];
  if (metadata.canonicalPath === '/') {
    graph.push(
      { '@type': 'Organization', '@id': `${siteOrigin}/#organization`, name: 'Maha Constructions', url: `${siteOrigin}/`, logo: `${siteOrigin}/images/maha-constructions-logo.png`, telephone: '+919940407777', email: 'saimaha1000@gmail.com', foundingDate: '1990', areaServed: { '@type': 'City', name: 'Chennai' } },
      { '@type': 'WebSite', '@id': `${siteOrigin}/#website`, url: `${siteOrigin}/`, name: 'Maha Constructions', publisher: { '@id': `${siteOrigin}/#organization` } },
    );
  } else {
    const crumbs = [{ name: 'Home', item: `${siteOrigin}/` }];
    if (metadata.canonicalPath.startsWith('/projects/')) crumbs.push({ name: 'Projects', item: `${siteOrigin}/projects` });
    crumbs.push({ name: metadata.label, item: metadata.canonical });
    graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs.map((crumb, index) => ({ '@type': 'ListItem', position: index + 1, ...crumb })) });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

export function seoHead(path, indexable = false) {
  const page = pageMetadata(path, indexable);
  const meta = (attribute, name, value) => `<meta data-seo ${attribute}="${name}" content="${escapeHtml(value)}">`;
  const schema = structuredData(page);
  return [
    `<title data-seo>${escapeHtml(page.title)}</title>`,
    meta('name', 'description', page.description),
    meta('name', 'robots', page.robots),
    ...(page.found ? [`<link data-seo rel="canonical" href="${page.canonical}">`] : []),
    meta('property', 'og:type', 'website'), meta('property', 'og:site_name', 'Maha Constructions'),
    meta('property', 'og:locale', 'en_IN'), meta('property', 'og:title', page.title),
    meta('property', 'og:description', page.description), meta('property', 'og:url', page.canonical),
    meta('property', 'og:image', socialImage), meta('property', 'og:image:width', '1200'), meta('property', 'og:image:height', '630'),
    meta('property', 'og:image:alt', 'Maha Constructions — Chennai, since 1990'),
    meta('name', 'twitter:card', 'summary_large_image'), meta('name', 'twitter:title', page.title),
    meta('name', 'twitter:description', page.description), meta('name', 'twitter:image', socialImage),
    ...(schema ? [`<script data-seo type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`] : []),
  ].join('\n');
}

export function sitemapXml() {
  const urls = Object.keys(pages).filter((path) => !pages[path].noindex);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((path) => `  <url><loc>${pageMetadata(path).canonical}</loc></url>`).join('\n')}\n</urlset>\n`;
}
