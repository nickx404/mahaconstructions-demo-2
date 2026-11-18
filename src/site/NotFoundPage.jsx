import Footer from './Footer.jsx';
import { sitePath } from './paths.js';

export default function NotFoundPage() {
  return <>
    <main id="top" className="not-found-page">
      <a href={sitePath('/')} aria-label="Maha Constructions home"><img src={sitePath('/images/maha-constructions-logo.webp')} width="220" height="72" alt="Maha Constructions" /></a>
      <p className="eyebrow">404 · Page not found</p>
      <h1>Let’s find your way.</h1>
      <p>The page you’re looking for isn’t here. Explore our projects or speak with our team.</p>
      <div className="not-found-actions"><a className="button button-green" href={sitePath('/')}>Back to home</a><a className="text-link" href={sitePath('/projects')}>Explore projects</a><a className="text-link" href={sitePath('/contact')}>Contact us</a></div>
    </main>
    <Footer />
  </>;
}
