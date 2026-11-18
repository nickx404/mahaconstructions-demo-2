import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './site/App.jsx';
import Chatbot from './site/Chatbot.jsx';
import './styles.css';
import { seoHead } from './site/seo.js';
import { siteRoute } from './site/paths.js';

// Keep direct loads and client-rendered fallbacks on the same metadata source.
document.head.querySelectorAll('[data-seo]').forEach((element) => element.remove());
document.head.insertAdjacentHTML('beforeend', seoHead(siteRoute(), import.meta.env.VITE_SITE_INDEXABLE));

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <React.Suspense fallback={null}><App /></React.Suspense>
    {!window.__MAHA_PRERENDER__ && <Chatbot />}
  </React.StrictMode>,
);
