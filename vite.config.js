import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { seoHead } from './src/site/seo.js';

export default defineConfig({
  base: process.env.SITE_BASE_PATH || (process.env.GITHUB_ACTIONS ? `/${process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'mahaconstructions-demo'}/` : '/'),
  define: { 'import.meta.env.VITE_SITE_INDEXABLE': JSON.stringify(process.env.SITE_INDEXABLE === 'true') },
  plugins: [react(), {
    name: 'maha-seo',
    transformIndexHtml: (html) => html.replace('<!-- page-seo -->', seoHead('/', process.env.SITE_INDEXABLE === 'true')),
  }],
});
