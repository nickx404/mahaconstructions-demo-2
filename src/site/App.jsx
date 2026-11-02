import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Buildings,
  Car,
  Compass,
  Drop,
  Elevator,
  Lightning,
  PencilRuler,
  SecurityCamera,
  Waves,
  CaretDown,
  CaretLeft,
  CaretRight,
  Check,
  Clock,
  Diamond,
  Eye,
  GoogleLogo,
  Handshake,
  Key,
  List as Menu,
  MagnifyingGlassPlus,
  MapPin,
  MapPinLine,
  Medal,
  Plant,
  Pause,
  Play,
  Sparkle,
  Star,
  UsersThree,
  WhatsappLogo,
  X,
} from '@phosphor-icons/react';
import AboutPage from './AboutPage.jsx';
import ContactPage from './ContactPage.jsx';
import Footer from './Footer.jsx';
import RollingNumber from './RollingNumber.jsx';
import GalleryPage from './GalleryPage.jsx';
import { sitePath, siteRoute } from './paths.js';
import { services as serviceContent, ongoingProjects as ongoingContent, completedProjects as completedContent } from './siteContent.js';

gsap.registerPlugin(ScrollTrigger);

const heroSlides = [
  {
    desktop: sitePath('/images/hero-maha-kuber-desktop-v3.jpg'),
    mobile: sitePath('/images/hero-maha-kuber-mobile.jpg'),
    mobileHref: sitePath('/projects/maha-kuber-thirumangalam'),
    alt: 'Maha Kuber by Maha Constructions. Luxury homes in the heart of Thirumangalam. Just 2 mins from Anna Nagar West. Exclusive 1 & 2 BHK Homes. 100% Vaastu, covered parking and automatic lift. CMDA approved. QR code opens the location in Google Maps.',
    mobileLinkLabel: 'Explore Maha Kuber: luxury homes in the heart of Thirumangalam, Chennai. 1 & 2 BHK homes. View project details.',
  },
  {
    desktop: sitePath('/images/hero-joint-venture-banner.jpg'),
    mobile: sitePath('/images/hero-joint-venture-banner-mobile.jpg'),
    alt: 'Open to Joint Ventures with Maha Constructions',
  },
];

const services = serviceContent.map((service) => ({ ...service, image: sitePath(service.image) }));

const projects = [
  {
    name: 'A quieter kind of arrival',
    type: 'Residential · Chennai',
    image:
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1500&q=86',
    alt: 'Light-filled contemporary residential architecture',
  },
  {
    name: 'Room to grow into',
    type: 'Residential · Chennai',
    image:
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1500&q=86',
    alt: 'Warm modern home with an open garden-facing interior',
  },
  {
    name: 'Made for the everyday',
    type: 'Community · Chennai',
    image:
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1500&q=86',
    alt: 'Minimal architecture with a sheltered outdoor living space',
  },
];

const ongoingProjects = ongoingContent.map((project) => ({ ...project, image: sitePath(project.image) }));
const completedProjects = completedContent.map((project) => ({ ...project, image: sitePath(project.image) }));

const googleReviews = [
  {
    author: 'Divya Singaravelu',
    rating: 5,
    tag: 'Delivered in time · High quality',
    text: 'The professional approach and dedication of the staff of Sai Maha Foundation to deliver the flat in time is highly appreciated. The quality of work and materials they used are very good. The co-operation and support from all staff is excellent.',
    date: 'Google Review',
  },
  {
    author: 'Raji Lakshmi',
    rating: 5,
    tag: 'Fulfilled dream · Perfect handover',
    text: 'We are very happy and pleased with their dealings. Our joy was complete because the finished product was exactly in line with what was promised at the time of agreement. Our sincere gratitude to the entire Sai Maha Team for fulfilling our dream. Thank You!!',
    date: 'Google Review',
  },
  {
    author: 'Annakkili Thangavel',
    rating: 5,
    tag: 'Apartment Owner, Madhavaram',
    text: 'I am thankful for the fact that Sai Maha handed over the apartment within the promised time. We are proud to be the owner of an apartment at Madhavaram. We are very much satisfied with the quality of construction & materials used. Thank you.',
    date: 'Google Review',
  },
  {
    author: 'Narmadha Nive',
    rating: 5,
    tag: 'First-time home buyer',
    text: 'We were initial buyers with very little knowledge about how to find the right place to buy flats. And finally we met Sai Maha Foundation really helped to take the pressure off of us. Many thanks once again for all the support.',
    date: 'Google Review',
  },
  {
    author: 'Sujatha RK',
    rating: 5,
    tag: 'Ethical & Quality Construction',
    text: 'It’s very hard to find a construction company which follows ethics and principles and the one that I have found is Sai Maha and remained focused on quality, budget and timeliness. I was completely satisfied with the project and I will continue to recommend your project to everyone.',
    date: 'Google Review',
  },
];

function GoogleReviewsSection({ id = 'reviews', title = 'What our customers say.' }) {
  const [activeReview, setActiveReview] = useState(0);
  const [reviewPaused, setReviewPaused] = useState(false);
  const [autoplayStopped, setAutoplayStopped] = useState(false);
  const [reviewsInView, setReviewsInView] = useState(false);
  const [reviewsReducedMotion, setReviewsReducedMotion] = useState(false);
  const reviewSection = useRef(null);
  const [reviewAnnouncement, setReviewAnnouncement] = useState('');
  const automaticReviews = id === 'home-reviews' || id === 'jv-testimonial';

  useEffect(() => {
    if (!automaticReviews) return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReviewsReducedMotion(media.matches);
    updateMotion();
    media.addEventListener('change', updateMotion);
    let inView = false;
    const updateVisibility = () => setReviewsInView(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateVisibility();
    });
    observer.observe(reviewSection.current);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      observer.disconnect();
      media.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, [automaticReviews]);

  useEffect(() => {
    if (!automaticReviews || !reviewsInView || reviewPaused || autoplayStopped || reviewsReducedMotion) return undefined;
    const timer = window.setTimeout(() => setActiveReview((current) => (current + 1) % googleReviews.length), 7000);
    return () => window.clearTimeout(timer);
  }, [automaticReviews, reviewsInView, reviewPaused, autoplayStopped, reviewsReducedMotion, activeReview]);

  const selectReview = (index) => {
    setActiveReview(index);
    setReviewAnnouncement(`${googleReviews[index].author}: ${googleReviews[index].text}`);
  };
  const nextReview = () => selectReview((activeReview + 1) % googleReviews.length);
  const prevReview = () => selectReview((activeReview - 1 + googleReviews.length) % googleReviews.length);

  const current = googleReviews[activeReview];

  return (
    <section
      className="jv-testimonial"
      id={id}
      ref={reviewSection}
      aria-labelledby={`${id}-title`}
      onFocusCapture={(event) => setReviewPaused(event.target.matches(':focus-visible'))}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setReviewPaused(false);
      }}
    >
      <div className="jv-testimonial-copy" data-reveal>
        <div className="jv-google-pill">
          <GoogleLogo size={18} weight="bold" className="google-icon-colored" aria-hidden="true" />
          <span>4.4 ★ on Google · 37 Reviews</span>
        </div>
        <h2 id={`${id}-title`}>{title}</h2>

        <div className="jv-review-card-container">
          <div className="jv-review-stars" aria-label={`${current.rating} out of 5 stars`}>
            {Array.from({ length: current.rating }).map((_, i) => (
              <Star key={i} size={18} weight="fill" className="star-icon" aria-hidden="true" />
            ))}
          </div>

          {automaticReviews ? (
            <div className="review-quotes">
              {googleReviews.map((review, index) => (
                <blockquote className={`jv-review-quote${index === activeReview ? ' is-current' : ''}`} key={review.author} aria-hidden={index !== activeReview}>
                  “{review.text}”
                </blockquote>
              ))}
            </div>
          ) : (
            <blockquote className="jv-review-quote">“{current.text}”</blockquote>
          )}

          <div className="jv-review-author-wrap">
            <div className="jv-author-avatar" aria-hidden="true">
              {current.author.charAt(0)}
            </div>
            <div>
              <strong className="jv-review-author">{current.author}</strong>
              <span className="jv-review-meta">
                <Check size={13} weight="bold" className="check-verified" aria-hidden="true" />
                Verified Google Review · {current.tag}
              </span>
            </div>
          </div>
        </div>

        <span className="sr-only" role="status">{reviewAnnouncement}</span>
        <div className="jv-testimonial-nav">
          <div className="jv-testimonial-dots" role="tablist" aria-label="Choose review">
            {googleReviews.map((r, idx) => (
              <button
                key={r.author}
                type="button"
                role="tab"
                aria-selected={activeReview === idx}
                aria-label={`View review by ${r.author}`}
                className={`jv-dot-btn${activeReview === idx ? ' is-active' : ''}`}
                onClick={() => selectReview(idx)}
              />
            ))}
          </div>
          <div className="jv-nav-arrows">
            {automaticReviews && !reviewsReducedMotion && (
              <button
                type="button"
                className="jv-nav-arrow-btn"
                aria-label={autoplayStopped ? 'Resume automatic reviews' : 'Pause automatic reviews'}
                onClick={() => setAutoplayStopped((stopped) => !stopped)}
              >
                {autoplayStopped ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
              </button>
            )}
            <button
              type="button"
              className="jv-nav-arrow-btn"
              onClick={prevReview}
              aria-label="Previous review"
            >
              <CaretLeft size={16} />
            </button>
            <span className="jv-nav-counter">
              0{activeReview + 1} / 0{googleReviews.length}
            </span>
            <button
              type="button"
              className="jv-nav-arrow-btn"
              onClick={nextReview}
              aria-label="Next review"
            >
              <CaretRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="jv-testimonial-summary-panel">
        <div className="jv-google-summary-card">
          <div className="google-badge-header">
            <div className="google-brand-row">
              <GoogleLogo size={28} weight="bold" className="google-icon-colored" aria-hidden="true" />
              <div>
                <span className="google-brand-title">Maha Construction</span>
                <span className="google-brand-sub">Google Business Profile</span>
              </div>
            </div>
            <span className="google-verified-pill">Verified</span>
          </div>

          <div className="google-score-box">
            <span className="google-score-num">4.4</span>
            <div className="google-score-details">
              <div className="google-stars-row">
                {[1, 2, 3, 4].map((s) => (
                  <Star key={s} size={20} weight="fill" className="star-icon" aria-hidden="true" />
                ))}
                <Star size={20} weight="regular" className="star-icon" aria-hidden="true" />
              </div>
              <span className="google-count-text">Based on 37 customer reviews</span>
            </div>
          </div>

          <p className="google-business-desc">
            Verified homeowners and partners across Chennai sharing feedback on craftsmanship, timeliness, and trust.
          </p>

          <ul className="google-highlights-list">
            <li>
              <Check size={16} weight="bold" aria-hidden="true" />
              <span>Timely handover & reliable delivery</span>
            </li>
            <li>
              <Check size={16} weight="bold" aria-hidden="true" />
              <span>High construction & material quality</span>
            </li>
            <li>
              <Check size={16} weight="bold" aria-hidden="true" />
              <span>Transparent agreement & dealings</span>
            </li>
            <li>
              <Check size={16} weight="bold" aria-hidden="true" />
              <span>Supportive staff & client-first ethics</span>
            </li>
          </ul>

          <a
            href="https://share.google/2z735taNEQxBJfbMn"
            target="_blank"
            rel="noopener noreferrer"
            className="google-cta-btn"
          >
            <span>View all 37 reviews on Google</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

function App() {
  const path = siteRoute();
  if (path === '/about-2' || path === '/about-us') return <AboutPage variant="company" />;
  if (path === '/about') return <AboutPage />;
  if (path === '/joint-venture') return <JointVenturePage />;
  if (path === '/contact') return <ContactPage />;
  if (path === '/gallery') return <GalleryPage />;
  const ongoingProject = ongoingProjects.find((project) => `/projects/${project.slug}` === path);
  if (ongoingProject) return <OngoingProjectPage project={ongoingProject} />;
  if (path === '/projects') return <ProjectsPage />;
  return <HomePage />;
}

function JointVenturePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const videoRef = useRef(null);
  const pageRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const steps = [
    ['Land enquiry', 'Share your property details with us.'],
    ['Site evaluation', 'The property and its development potential can be reviewed.'],
    ['JV discussion', 'Discuss your requirements and the opportunity.'],
    ['Agreement', 'Review and document the proposed partnership.'],
    ['Planning & design', 'Develop the project plan and pursue required approvals.'],
    ['Construction & handover', 'Project execution through to completion and handover.'],
  ];
  const benefits = [
    { title: 'Experience', detail: 'Construction experience built over time.', icon: Medal },
    { title: 'Local market knowledge', detail: 'Understanding of the Chennai market.', icon: MapPinLine },
    { title: 'Construction expertise', detail: 'Residential building experience.', icon: Buildings },
    { title: 'End-to-end execution', detail: 'Planning through construction and handover.', icon: Key },
    { title: 'Customer trust', detail: 'A growing base of customers.', icon: Handshake },
    { title: 'Land development', detail: 'Exploring development potential with landowners.', icon: Plant },
  ];
  const strengths = [
    { text: 'Established construction experience', icon: Medal },
    { text: 'Understanding of the Chennai market', icon: MapPinLine },
    { text: 'Residential development experience', icon: Buildings },
    { text: 'End-to-end project execution', icon: Key },
    { text: 'Focus on quality construction', icon: Sparkle },
    { text: 'Clear partnership discussions', icon: Handshake },
    { text: 'Customer-focused development', icon: UsersThree },
    { text: 'Long-term value creation', icon: Plant },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    const previousTitle = document.title;
    document.title = 'Joint Venture | Maha Constructions';
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPlayback = () => {
      setVideoReady(false);
      video.playbackRate = 0.75;
      if (media.matches) video.pause();
      else video.play().catch(() => setVideoReady(false));
    };
    syncPlayback();
    media.addEventListener('change', syncPlayback);
    return () => {
      media.removeEventListener('change', syncPlayback);
      video.pause();
    };
  }, []);

  useEffect(() => {
    const media = gsap.matchMedia(pageRef);
    media.add({ motion: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 700px)' }, ({ conditions }) => {
      if (!conditions.motion) return;
      const reveal = (elements, trigger, stagger = 0) => gsap.fromTo(elements,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger, ease: 'power2.out',
          scrollTrigger: { trigger, start: 'top 88%', once: true } });

      const headline = conditions.mobile ? '.jv-hero-lead > span, .jv-hero-promise' : '.jv-hero-content h1 > span';
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('.jv-pill-badge', { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 0.65 })
        .fromTo(headline, { autoAlpha: 0, y: -28 }, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.12 }, 0.12)
        .fromTo('.jv-hero-content p', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.4)
        .fromTo('.jv-hero-actions', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.65 }, 0.52);
      gsap.fromTo('.jv-hero-media-card', { autoAlpha: 0, y: 32, scale: 0.975 }, {
        autoAlpha: 1, y: 0, scale: 1, duration: 0.95, delay: 0.25, ease: 'power3.out',
        scrollTrigger: { trigger: '.jv-hero-media-card', start: 'top 95%', once: true },
      });
      gsap.utils.toArray('[data-jv-reveal], #jv-testimonial .jv-google-pill, #jv-testimonial h2, #jv-testimonial .jv-testimonial-summary-panel').forEach((element) => reveal(element, element));
      const mobile = conditions.mobile;
      ['.jv-benefit-grid', '.jv-process-grid', '.jv-why-grid'].forEach((selector) => {
        const grid = pageRef.current.querySelector(selector);
        if (mobile) Array.from(grid.children).forEach((card) => reveal(card, card));
        else reveal(Array.from(grid.children), grid, 0.09);
      });
      gsap.utils.toArray('.jv-flow-card, .jv-flow-connector').forEach((element) => reveal(element, element));
      gsap.utils.toArray('.jv-trust-strip .rolling-digit-strip').forEach((strip) => {
        gsap.fromTo(strip, { y: '0em', yPercent: 0 }, {
          y: `${-Number(strip.dataset.stop) * 1.1}em`, yPercent: 0,
          duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: strip.closest('strong'), start: 'top 88%', once: true },
        });
      });
    });
    return () => media.revert();
  }, []);

  const closeMenu = () => setMenuOpen(false);
  return (
    <div className="joint-venture-page" ref={pageRef}>
      <header className={`site-header jv-header${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}>
        <a className="wordmark" href={sitePath('/')} aria-label="Maha Constructions home" onClick={closeMenu}>
          <img src={sitePath('/images/maha-constructions-logo.png')} alt="Maha Constructions" />
        </a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          <a href={sitePath('/')} onClick={closeMenu}>Home</a>
          <a href={sitePath('/about-2')} onClick={closeMenu}>About Us</a>
          <a href={sitePath('/projects')} onClick={closeMenu}>Projects</a>
          <a href={sitePath('/joint-venture')} aria-current="page" onClick={closeMenu}>Joint Venture</a>
          <a href={sitePath('/gallery')} onClick={closeMenu}>Gallery</a>
          <a href={sitePath('/contact')} onClick={closeMenu}>Contact</a>
          <a className="nav-enquiry" href={sitePath('/contact#contact-form')} onClick={closeMenu}>Enquire <ArrowUpRight size={14} aria-hidden="true" /></a>
        </nav>
      </header>

      <main className="jv-main">
        <section className="jv-hero" aria-labelledby="jv-title">
          <div className="jv-hero-container">
            <div className="jv-hero-content">
              <div className="jv-pill-badge">
                <span className="pulse-beacon" aria-hidden="true" />
                <span>Landowner Collaboration</span>
              </div>
              <h1 id="jv-title"><span className="jv-hero-lead"><span>Your land.</span>{' '}<span>Our expertise.</span></span>{' '}<span className="jv-hero-promise">A partnership built to grow.</span></h1>
              <p><span className="jv-hero-copy-desktop">Unlock the prime residential value of your property in Chennai. Maha Constructions brings 30+ years of construction mastery to deliver maximum returns with complete transparency and zero landowner capital investment.</span><span className="jv-hero-copy-mobile">Explore your land’s potential in Chennai with Maha Constructions. A partnership shaped around your property.</span></p>

              <div className="jv-hero-actions">
                <a className="button button-dark" href="#jv-enquiry">Discuss your land <ArrowRight size={16} aria-hidden="true" /></a>
                <a className="button button-outline-dark" href="#jv-clarity">How it works</a>
              </div>
            </div>

            <div className={`jv-hero-media-card${videoReady ? ' is-ready' : ''}`}>
              <img className="jv-hero-poster" src={sitePath('/images/jv-family-video-poster.jpg')} alt="" aria-hidden="true" />
              <video
                ref={videoRef}
                className="jv-hero-video"
                poster={sitePath('/images/jv-family-video-poster.jpg')}
                preload="auto"
                onPlaying={(event) => {
                  const video = event.currentTarget;
                  const showFrame = () => {
                    if (!video.paused && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) setVideoReady(true);
                  };
                  if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(showFrame);
                  else if (video.readyState >= 2) showFrame();
                }}
                onPause={() => setVideoReady(false)}
                onError={() => setVideoReady(false)}
                loop
                muted
                playsInline
                onLoadedMetadata={(e) => {
                  e.currentTarget.playbackRate = 0.75;
                }}
              >
                <source src={sitePath('/videos/happy-family-home.mp4')} type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        <section className="jv-trust-strip" aria-label="Maha Constructions at a glance">
          <div><strong>Since 1990</strong><span>Construction experience</span></div>
          <div><strong><RollingNumber value={80} />+</strong><span>Residential projects</span></div>
          <div><strong><RollingNumber value={509} />+</strong><span>Customers</span></div>
          <div><strong>Chennai</strong><span>Local expertise</span></div>
        </section>

        <section className="jv-clarity section-shell" id="jv-clarity" aria-labelledby="jv-clarity-title">
          <div className="jv-section-heading" data-jv-reveal>
            <span className="eyebrow">Why partner with Maha?</span>
            <h2 id="jv-clarity-title">Your land, together with our expertise.</h2>
          </div>
          <div className="jv-benefit-grid">
            {benefits.map(({ title, detail, icon: Icon }, index) => (
              <article key={title}>
                <div className="jv-benefit-top">
                  <span>0{index + 1}</span>
                  <Icon size={26} className="jv-benefit-icon" aria-hidden="true" />
                </div>
                <h3>{title}</h3>
                <p>{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="jv-process" id="jv-process" aria-labelledby="jv-process-title">
          <div className="jv-process-heading section-shell" data-jv-reveal><span className="eyebrow">How our joint venture works</span><h2 id="jv-process-title">A clear path from land to development.</h2><p>Each opportunity is specific to the property and subject to review.</p></div>
          <div className="jv-process-grid section-shell">
            {steps.map(([title, detail], index) => <article key={title}><span className="jv-step-number">0{index + 1}</span><span className="jv-step-rule" aria-hidden="true" /><h3>{title}</h3><p>{detail}</p></article>)}
          </div>
        </section>

        <section className="jv-approach" aria-labelledby="jv-approach-title">
          <div className="jv-approach-heading" data-jv-reveal>
            <span className="eyebrow">Our approach to JV</span>
            <h2 id="jv-approach-title">From land to value creation.</h2>
            <p className="jv-approach-intro">
              We partner with landowners to unlock maximum property value—managing architectural planning, approvals, and construction with zero capital required from you.
            </p>

            <ul className="jv-approach-assurances">
              <li><Check size={16} weight="bold" className="jv-check-icon" aria-hidden="true" /> 100% Legal &amp; title due diligence</li>
              <li><Check size={16} weight="bold" className="jv-check-icon" aria-hidden="true" /> Transparent &amp; fair sharing ratios</li>
              <li><Check size={16} weight="bold" className="jv-check-icon" aria-hidden="true" /> Zero landowner capital investment</li>
            </ul>

            <a className="jv-approach-btn" href="#jv-enquiry">
              Discuss your property <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>

          <div className="jv-approach-flow">
            {/* Step 1: Your land */}
            <article className="jv-flow-card jv-flow-card-1">
              <div className="jv-flow-card-header">
                <span className="jv-flow-step-badge">STEP 01</span>
                <MapPinLine size={24} className="jv-flow-icon" aria-hidden="true" />
              </div>
              <h3>Your land</h3>
              <p>Your property becomes the foundation. We evaluate location, title clarity, road width, and maximum developmental viability.</p>
              <div className="jv-flow-tags">
                <span>Site Feasibility</span>
                <span>Title Due Diligence</span>
                <span>FSI & Zoning Study</span>
              </div>
            </article>

            <div className="jv-flow-connector" aria-hidden="true">
              <span className="jv-connector-line" />
              <span className="jv-connector-circle"><CaretDown size={14} weight="bold" /></span>
              <span className="jv-connector-line" />
            </div>

            {/* Step 2: Maha's expertise */}
            <article className="jv-flow-card jv-flow-card-2">
              <div className="jv-flow-card-header">
                <span className="jv-flow-step-badge">STEP 02</span>
                <Buildings size={24} className="jv-flow-icon" aria-hidden="true" />
              </div>
              <h3>Maha’s expertise</h3>
              <p>Comprehensive architectural planning, CMDA approvals, structural engineering, and precision construction managed end-to-end.</p>
              <div className="jv-flow-tags">
                <span>Architectural Design</span>
                <span>CMDA Approvals</span>
                <span>Quality Materials</span>
                <span>Project Execution</span>
              </div>
            </article>

            <div className="jv-flow-connector" aria-hidden="true">
              <span className="jv-connector-line" />
              <span className="jv-connector-circle"><CaretDown size={14} weight="bold" /></span>
              <span className="jv-connector-line" />
            </div>

            {/* Step 3: Development */}
            <article className="jv-flow-card jv-flow-card-3">
              <div className="jv-flow-card-header">
                <span className="jv-flow-step-badge">STEP 03</span>
                <Key size={24} className="jv-flow-icon" aria-hidden="true" />
              </div>
              <h3>Development</h3>
              <p>A premium residential landmark shaped around agreed terms, delivered on schedule with enduring market appreciation.</p>
              <div className="jv-flow-tags">
                <span>Clear Ownership Split</span>
                <span>Timely Handover</span>
                <span>Long-Term Appreciation</span>
              </div>
            </article>
          </div>
        </section>

        <section className="jv-why section-shell" aria-labelledby="jv-why-title">
          <div className="jv-why-heading" data-jv-reveal>
            <span className="eyebrow">Why Maha Constructions</span>
            <h2 id="jv-why-title">Built on experience.<br />Driven by trust.</h2>
            <p className="jv-why-sub">
              Every partnership is grounded in three decades of construction excellence, transparent agreements, and enduring craftsmanship.
            </p>
          </div>
          <div className="jv-why-grid">
            {strengths.map(({ text, icon: Icon }, index) => (
              <div className="jv-why-card" key={text}>
                <div className="jv-why-card-inner">
                  <div className="jv-why-icon-wrap" aria-hidden="true">
                    <Icon size={22} weight="regular" />
                  </div>
                  <div className="jv-why-card-content">
                    <span className="jv-why-card-index">0{index + 1}</span>
                    <span className="jv-why-card-text">{text}</span>
                  </div>
                </div>
                <div className="jv-why-card-line" aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        <section className="jv-enquiry-section" id="jv-enquiry" aria-labelledby="jv-enquiry-title">
          <div className="jv-enquiry-intro" data-jv-reveal><span className="eyebrow">Landowner enquiry</span><h2 id="jv-enquiry-title">Have land you want to develop?</h2><p>Tell us about your property. Let’s explore the opportunity together.</p><a href="mailto:saimaha1000@gmail.com">saimaha1000@gmail.com <ArrowUpRight size={15} aria-hidden="true" /></a></div>
          <form className="contact-page-form site-enquiry-form" onSubmit={(event) => { event.preventDefault(); setFormSubmitted(true); }}>
            <div className="contact-page-form-heading">
              <div>
                <span className="eyebrow">Your enquiry</span>
                <h2>How can we help?</h2>
              </div>
              <span className="form-req-pill">All fields required</span>
            </div>
            <div className="form-row">
              <label className="animated-input-group">
                <span>Name</span>
                <input name="name" autoComplete="name" placeholder="Your full name" required />
              </label>
              <label className="animated-input-group">
                <span>Phone number</span>
                <input name="phone" type="tel" autoComplete="tel" placeholder="Your phone number" required />
              </label>
            </div>
            <label className="animated-input-group">
              <span>Email address</span>
              <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            </label>
            <fieldset className="contact-enquiry-types">
              <legend>What would you like to discuss?</legend>
              <div className="enquiry-chips-row">
                {['General Inquiry', 'Building Contract', 'Joint Venture'].map((type) => (
                  <label className="enquiry-chip-label" key={type}>
                    <input type="checkbox" name="enquiryType" value={type} defaultChecked={type === 'Joint Venture'} />
                    <span className="chip-indicator" aria-hidden="true"><Check size={13} weight="bold" /></span>
                    <span className="chip-text">{type}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="animated-input-group">
              <span>Message</span>
              <textarea name="message" rows="5" placeholder="Share a few details about your property or enquiry" required />
            </label>
            <button className="button button-green magnetic-button" type="submit">
              Send enquiry <ArrowUpRight size={16} aria-hidden="true" />
            </button>
            <p className={`contact-page-form-note form-note${formSubmitted ? ' is-visible' : ''}`} aria-live="polite">
              {formSubmitted ? 'Thanks for reaching out. Form submission will be enabled once the enquiry service is connected.' : 'This form is a preview and does not send messages yet.'}
            </p>
          </form>
        </section>

        <GoogleReviewsSection id="jv-testimonial" title="What our customers say." />

        <section className="jv-closing" aria-labelledby="jv-closing-title" data-jv-reveal>
          <svg className="jv-closing-blueprint" viewBox="0 0 1200 640" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
            <g stroke="currentColor" strokeWidth="1">
              <path d="M-40 580H1240M-40 600H1240M40 0V640M1160 0V640" strokeDasharray="5 9" />
              <path d="M-30 520L240 110M-30 110L240 520M960 90L1230 550M960 550L1230 90" opacity=".5" />
              <path d="M20 580V250L100 210L180 250V580M100 210V580M20 300L100 260L180 300M20 360L100 320L180 360M20 420L100 380L180 420M20 480L100 440L180 480M20 540L100 500L180 540" />
              <path d="M-20 580V370L20 350M180 580V340L230 310V580M195 375H215M195 415H215M195 455H215M195 495H215M195 535H215" />
              <path d="M970 580V330H1040V160L1110 120L1180 160V580M1110 120V580M1040 220L1110 180L1180 220M1040 280L1110 240L1180 280M1040 340L1110 300L1180 340M1040 400L1110 360L1180 400M1040 460L1110 420L1180 460M1040 520L1110 480L1180 520M1180 370H1230V580M990 360V550M1015 360V550" />
              <path d="M0 190H205M20 180V200M180 180V200M1015 90H1205M1040 80V100M1180 80V100" />
            </g>
          </svg>
          <h2 id="jv-closing-title">Have land?<br />Let’s build something valuable.</h2>
          <p>Explore a joint development opportunity with Maha Constructions.</p>
          <div><a className="button button-light" href="#jv-enquiry">Start a conversation <ArrowRight size={16} aria-hidden="true" /></a></div>
          <p className="jv-contact-links"><a href="tel:+919940407777">Call: +91 99404 07777</a><a href="https://wa.me/919940407777" target="_blank" rel="noopener noreferrer">WhatsApp: +91 99404 07777</a><a href="#jv-enquiry">Enquire</a></p>
        </section>
      </main>

      <Footer backToTopTarget="#jv-title" className="jv-footer" />
    </div>
  );
}

function OngoingProjectPage({ project }) {
  const [activePlan, setActivePlan] = useState(0);
  const [activeSection, setActiveSection] = useState('overview');
  const planTabsRef = useRef(null);
  const plans = ['1 BHK Layout', '2 BHK Layout', 'Master Plan'];
  const sections = [['overview', 'Overview'], ['project-details', 'Project details'], ['amenities', 'Amenities'], ['gallery', 'Gallery'], ['floor-plans', 'Floor plans'], ['location', 'Location']];
  const amenityIcons = { 'Covered Car Parking': Car, '100% Vaastu': Compass, 'Rainwater Harvesting': Drop, 'Automatic Elevator': Elevator, 'CCTV Surveillance Camera': SecurityCamera, 'Architect Designed': PencilRuler, '24/7 Water Supply': Waves, 'Three-Phase EB': Lightning };
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    const previousTitle = document.title;
    document.title = `${project.name} | Maha Constructions`;
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.title = previousTitle;
    };
  }, [project.name]);

  useEffect(() => {
    const media = gsap.matchMedia(pageRef);
    media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 701px)' }, ({ conditions }) => {
      if (!conditions.motion) return;
      gsap.fromTo('.project-detail-hero-content > *', { autoAlpha: 0, y: -24 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' });
      gsap.fromTo('.project-detail-hero-image img', { scale: 1.025 }, { scale: 1, duration: 1.2, ease: 'power2.out' });
      gsap.fromTo('[data-project-overview-reveal]', { autoAlpha: 0, y: 24 }, {
        autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '#overview', start: 'top 82%', once: true },
      });
      gsap.utils.toArray('[data-project-detail-reveal]').forEach((element) => {
        const index = Number(element.dataset.projectDetailReveal) || 0;
        gsap.fromTo(element, { autoAlpha: 0, y: 20 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          delay: conditions.desktop ? index * 0.08 : 0,
          ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        });
      });
    });
    return () => media.revert();
  }, []);

  useEffect(() => {
    const root = pageRef.current;
    const targets = [...root.querySelectorAll('.project-detail-main > section[id]')];
    const media = gsap.matchMedia(root);
    media.add('(min-width: 701px)', () => {
      const updateActiveSection = () => {
        const nav = root.querySelector('.project-section-nav');
        const line = nav.getBoundingClientRect().bottom + 80;
        const current = targets.filter((section) => section.getBoundingClientRect().top <= line).at(-1);
        setActiveSection(current?.id || 'overview');
      };
      window.addEventListener('scroll', updateActiveSection, { passive: true });
      window.addEventListener('resize', updateActiveSection);
      updateActiveSection();
      return () => {
        window.removeEventListener('scroll', updateActiveSection);
        window.removeEventListener('resize', updateActiveSection);
      };
    });
    return () => media.revert();
  }, []);

  const handlePlanKeyDown = (event) => {
    let next;
    if (event.key === 'ArrowRight') next = (activePlan + 1) % plans.length;
    else if (event.key === 'ArrowLeft') next = (activePlan + plans.length - 1) % plans.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = plans.length - 1;
    else return;
    event.preventDefault();
    setActivePlan(next);
    planTabsRef.current.querySelectorAll('[role="tab"]')[next].focus();
  };

  const closeMenu = () => setMenuOpen(false);
  const projectFacts = [
    ['Location', project.location],
    ['Building type', project.details[0]],
    ['Unit type', project.details[1]],
    ['Unit size', project.details[2]],
    ['Bank loan', project.details[3]],
    ['Status', 'Ongoing'],
  ];

  return (
    <div className="projects-page project-detail-page" ref={pageRef}>
      <header className={`site-header projects-header${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}>
        <a className="wordmark" href={sitePath('/')} aria-label="Maha Constructions home" onClick={closeMenu}>
          <img src={sitePath('/images/maha-constructions-logo.png')} alt="Maha Constructions" />
        </a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          <a href={sitePath('/')} onClick={closeMenu}>Home</a>
          <a href={sitePath('/about-2')} onClick={closeMenu}>About Us</a>
          <a href={sitePath('/projects')} onClick={closeMenu}>Projects</a>
          <a href={sitePath('/joint-venture')} onClick={closeMenu}>Joint Venture</a>
          <a href={sitePath('/gallery')} onClick={closeMenu}>Gallery</a>
          <a href={sitePath('/contact')} onClick={closeMenu}>Contact</a>
          <a className="nav-enquiry" href={sitePath('/contact#contact-form')} onClick={closeMenu}>Enquire <ArrowUpRight size={14} aria-hidden="true" /></a>
        </nav>
      </header>

      <main className="project-detail-main">
        <section className="project-detail-hero" aria-labelledby="project-detail-title">
          <div className="project-detail-hero-image" aria-label={`${project.name} image`}>
            {project.image ? (
              <img src={project.image} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Buildings size={64} weight="thin" aria-hidden="true" />
            )}
          </div>
          <div className="project-detail-hero-content section-shell">
            <span className="eyebrow">Ongoing project</span>
            <h1 id="project-detail-title">{project.name}</h1>
            <p><MapPin size={16} aria-hidden="true" /> {project.location}</p>
            <a className="button button-light" href={sitePath('/contact#contact-form')}>Enquire now <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </section>

        <nav className="project-section-nav" aria-label="Project sections">
          {sections.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined}>{label}</a>)}
        </nav>

        <section className="project-about section-shell" id="overview">
          <div data-project-overview-reveal><span className="eyebrow">About the project</span></div>
          <div className="project-about-copy">
            <h2 data-project-overview-reveal>{project.name}</h2>
            <p data-project-overview-reveal>{project.intro || 'A short introduction to this project will be added when approved project information is available.'}</p>
          </div>
        </section>

        <section className="project-specs section-shell" id="project-details">
          <div className="project-detail-section-title" data-project-detail-reveal>
            <span className="eyebrow">Project details</span>
            <h2>At a glance</h2>
          </div>
          <dl className="project-spec-grid">
            {projectFacts.map(([label, value], index) => (
              <div className="project-spec" key={label} data-project-detail-reveal={index % 3}><div className="project-spec-content"><dt>{label}</dt><dd>{value}</dd></div></div>
            ))}
          </dl>
          <p className="project-spec-note">Additional approved project information will appear here.</p>
        </section>

        <section className="project-amenities section-shell" id="amenities">
          <div className="project-detail-section-title" data-project-detail-reveal>
            <span className="eyebrow">Amenities &amp; features</span>
            <h2>Considered for everyday living.</h2>
          </div>
          <div className="project-amenity-grid">
            {(project.amenities || Array.from({ length: 8 })).map((amenity, index) => {
              const Icon = amenityIcons[amenity] || Diamond;
              return <div className="project-amenity" key={index} data-project-detail-reveal={index % 4}>
                <div className="project-amenity-content">
                  <Icon size={26} weight="regular" aria-hidden="true" />
                  <span>{amenity || 'Feature details to be updated'}</span>
                </div>
              </div>;
            })}
          </div>
        </section>

        <section className="project-gallery section-shell" id="gallery">
          <div className="project-detail-section-title" data-project-detail-reveal>
            <span className="eyebrow">Project gallery</span>
            <h2>A closer look.</h2>
          </div>
          <div className="project-gallery-grid">
            {[0, 1, 2].map((item) => (
              <div className={`project-gallery-placeholder project-gallery-placeholder-${item + 1}`} key={item} data-project-detail-reveal={item}>
                <Buildings size={36} weight="thin" aria-hidden="true" />
                <span>Project photography pending</span>
              </div>
            ))}
          </div>
          <span className="project-placeholder-note">Construction updates available on request.</span>
        </section>

        <section className="project-floorplans section-shell" id="floor-plans">
          <div className="project-detail-section-title" data-project-detail-reveal>
            <span className="eyebrow">Floor plans</span>
            <h2>Plan your space.</h2>
          </div>
          <div className="project-plan-tabs" ref={planTabsRef} role="tablist" aria-label="Floor plan configurations" onKeyDown={handlePlanKeyDown}>
            {plans.map((plan, index) => (
              <button className={activePlan === index ? 'is-active' : ''} id={`plan-tab-${index}`} type="button" role="tab" tabIndex={activePlan === index ? 0 : -1} aria-selected={activePlan === index} aria-controls="plan-panel" key={plan} onClick={() => setActivePlan(index)}>{plan}</button>
            ))}
          </div>
          <div className="project-plan-placeholder" id="plan-panel" role="tabpanel" tabIndex={0} aria-labelledby={`plan-tab-${activePlan}`}>
            <Buildings size={42} weight="thin" aria-hidden="true" />
            <span>{plans[activePlan]}: approved drawing pending.</span>
          </div>
        </section>

        <section className="project-location section-shell" id="location" data-project-detail-reveal>
          <div className="project-location-copy">
            <div className="project-detail-section-title"><span className="eyebrow">Location</span><h2>Close to what matters.</h2></div>
            <h3>Project address</h3>
            <p>{project.location}<br />{project.fullAddress || 'Project address pending confirmation.'}</p>
            <h3>Nearby landmarks</h3>
            <ul>
              <li>Thirumangalam Metro Station (2 mins)</li>
              <li>Anna Nagar West Depot & Villivakkam Station</li>
              <li>VR Chennai Mall, schools, and hospitals</li>
            </ul>
            <a className="text-link" href={sitePath('/projects')}>Explore all projects <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
          <div className="project-map-placeholder"><MapPin size={34} weight="thin" aria-hidden="true" /><span>{project.fullAddress || 'Project address pending confirmation.'}</span><span>Project map pending</span></div>
        </section>

        <section className="project-all-projects" data-project-detail-reveal>
          <span className="eyebrow">Explore all projects</span>
          <h2>Discover more from Maha Constructions.</h2>
          <a className="button button-light" href={sitePath('/projects')}>View all projects <ArrowRight size={16} aria-hidden="true" /></a>
        </section>
      </main>

      <Footer backToTopTarget="#project-detail-title" />
    </div>
  );
}

function ProjectsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [projectStatus, setProjectStatus] = useState(() => new URLSearchParams(window.location.search).get('status') === 'completed' ? 'completed' : 'ongoing');
  const [selectedCompletedIndex, setSelectedCompletedIndex] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const pageRef = useRef(null);

  useEffect(() => {
    if (selectedCompletedIndex === null) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedCompletedIndex(null);
        setZoomLevel(1);
      } else if (event.key === 'ArrowRight') {
        setSelectedCompletedIndex((prev) => (prev + 1) % completedProjects.length);
        setZoomLevel(1);
      } else if (event.key === 'ArrowLeft') {
        setSelectedCompletedIndex((prev) => (prev - 1 + completedProjects.length) % completedProjects.length);
        setZoomLevel(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCompletedIndex]);

  useEffect(() => {
    if (selectedCompletedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCompletedIndex]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    const previousTitle = document.title;
    document.title = 'Projects | Maha Constructions';
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 50);
    return () => window.clearTimeout(refresh);
  }, [projectStatus]);

  useEffect(() => {
    const media = gsap.matchMedia(pageRef);

    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.projects-page-hero-copy > *', { autoAlpha: 0, y: -24 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' });
      gsap.utils.toArray('[data-projects-reveal]').filter((element) => !element.matches('.ongoing-project-card, .completed-project-card')).forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: 'power2.out',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          },
        );
      });
    });

    return () => media.revert();
  }, []);

  useEffect(() => {
    const media = gsap.matchMedia(pageRef);
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('.ongoing-project-card, .completed-project-card').forEach((card, index) => {
        gsap.fromTo(card, { autoAlpha: 0, y: 24 }, {
          autoAlpha: 1, y: 0, duration: 0.7,
          delay: window.matchMedia('(min-width: 701px)').matches ? (index % 3) * 0.08 : 0,
          ease: 'power2.out', clearProps: 'transform',
          scrollTrigger: { trigger: card, start: 'top 90%', once: true },
        });
      });
      gsap.utils.toArray('[data-projects-image]').forEach((image) => {
        gsap.fromTo(
          image,
          { scale: 0.92 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: image,
              start: 'top 95%',
              end: 'top 35%',
              scrub: 0.7,
            },
          },
        );
      });
    });
    return () => media.revert();
  }, [projectStatus]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="projects-page" ref={pageRef}>
      <header className={`site-header projects-header${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}>
        <a className="wordmark" href={sitePath('/')} aria-label="Maha Constructions home" onClick={closeMenu}>
          <img src={sitePath('/images/maha-constructions-logo.png')} alt="Maha Constructions" />
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          <a href={sitePath('/')} onClick={closeMenu}>Home</a>
          <a href={sitePath('/about-2')} onClick={closeMenu}>About Us</a>
          <a href={sitePath('/projects')} aria-current="page" onClick={closeMenu}>Projects</a>
          <a href={sitePath('/joint-venture')} onClick={closeMenu}>Joint Venture</a>
          <a href={sitePath('/gallery')} onClick={closeMenu}>Gallery</a>
          <a href={sitePath('/contact')} onClick={closeMenu}>Contact</a>
          <a className="nav-enquiry" href={sitePath('/contact#contact-form')} onClick={closeMenu}>
            Enquire <ArrowUpRight size={14} weight="regular" aria-hidden="true" />
          </a>
        </nav>
      </header>

      <main className="projects-page-main">
        <section className="projects-page-hero section-shell" aria-labelledby="projects-page-title">
          <div className="projects-page-hero-copy">
            <span className="eyebrow">Projects</span>
            <h1 id="projects-page-title">The things we <br className="hero-mobile-br" />have made.</h1>
            <p>
              A clean project archive for Maha Constructions, ready for approved photography,
              final names and detailed ongoing-project pages.
            </p>
          </div>
        </section>

        <section className="project-directory section-shell" id="projects-list" aria-labelledby="project-list-title">
          <div className="project-directory-heading" data-projects-reveal>
            <span className="eyebrow">Our portfolio</span>
            <h2 id="project-list-title">{projectStatus === 'ongoing' ? 'Current developments.' : 'Completed projects.'}</h2>
            <p>{projectStatus === 'ongoing'
              ? 'Explore the projects taking shape now.'
              : 'A visual archive of places we have completed.'}</p>
            <div className="project-status-toggle" role="group" aria-label="Choose project status">
              <button
                type="button"
                className={projectStatus === 'ongoing' ? 'is-active' : ''}
                aria-pressed={projectStatus === 'ongoing'}
                onClick={() => setProjectStatus('ongoing')}
              >Ongoing</button>
              <button
                type="button"
                className={projectStatus === 'completed' ? 'is-active' : ''}
                aria-pressed={projectStatus === 'completed'}
                onClick={() => setProjectStatus('completed')}
              >Completed</button>
            </div>
          </div>
          {projectStatus === 'ongoing' ? (
            <div className="ongoing-project-grid" key="ongoing">
              {ongoingProjects.map((project, index) => (
                <a className="ongoing-project-card" href={sitePath(`/projects/${project.slug}`)} aria-label={`View details for ${project.name}, ${project.location}`} key={`${project.name}-${index}`} data-projects-reveal>
                  <div className="project-placeholder ongoing-project-image" data-projects-image aria-label={`${project.name} image`}>
                    {project.image ? (
                      <img src={project.image} alt={`${project.name} building elevation`} loading="lazy" />
                    ) : (
                      <Buildings size={46} weight="thin" aria-hidden="true" />
                    )}
                  </div>
                  <div className="ongoing-project-details">
                    <span className="project-card-index">0{index + 1}</span>
                    <h3>{project.name}</h3>
                    <p><MapPin size={14} aria-hidden="true" /> {project.location}</p>
                    <div className="project-detail-list" aria-label="Project specifications">
                      {project.details.map((detail) => <span key={detail}>{detail}</span>)}
                    </div>
                    <span className="ongoing-project-card-link">View project details <ArrowUpRight size={15} aria-hidden="true" /></span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="completed-project-grid" key="completed">
              {completedProjects.map((project, index) => (
                <button
                  type="button"
                  className="completed-project-card"
                  key={project.name}
                  data-projects-reveal
                  onClick={() => {
                    setSelectedCompletedIndex(index);
                    setZoomLevel(1);
                  }}
                  aria-label={`View photo of ${project.name}`}
                >
                  <div className="completed-project-image">
                    <img src={project.image} alt={project.name} loading="lazy" data-projects-image />
                    <div className="completed-project-overlay" aria-hidden="true">
                      <span className="completed-project-view-badge">
                        <Eye size={16} weight="bold" />
                        <span>View photo</span>
                      </span>
                    </div>
                  </div>
                  <div className="completed-project-info">
                    <h3>{project.name}</h3>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>

      {selectedCompletedIndex !== null && completedProjects[selectedCompletedIndex] && (
        <div
          className="cinematic-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Completed Project photo: ${completedProjects[selectedCompletedIndex].name}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedCompletedIndex(null);
              setZoomLevel(1);
            }
          }}
        >
          <div className="cinematic-modal-panel completed-modal-panel">
            <div className="lightbox-header-bar">
              <div className="lightbox-title-wrap">
                <span className="lightbox-category-pill">
                  Completed Project • Residential
                </span>
                <span className="lightbox-counter-pill">
                  {selectedCompletedIndex + 1} / {completedProjects.length}
                </span>
              </div>

              <div className="lightbox-actions-group">
                <button
                  type="button"
                  className="lightbox-tool-btn"
                  title={zoomLevel === 1 ? 'Zoom in' : 'Reset zoom'}
                  onClick={() => setZoomLevel((z) => (z === 1 ? 1.35 : 1))}
                >
                  <MagnifyingGlassPlus size={18} weight="bold" />
                  <span>{zoomLevel === 1 ? 'Zoom In' : 'Reset Zoom'}</span>
                </button>

                <button
                  type="button"
                  className="gallery-lightbox-close"
                  aria-label="Close viewer"
                  onClick={() => {
                    setSelectedCompletedIndex(null);
                    setZoomLevel(1);
                  }}
                >
                  <X size={22} weight="bold" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="lightbox-media-stage completed-media-stage">
              <div className="cinema-photo-wrapper">
                <div className="lightbox-photo-stage">
                  <img
                    src={completedProjects[selectedCompletedIndex].image}
                    alt={completedProjects[selectedCompletedIndex].name}
                    className="lightbox-actual-image"
                    onClick={() => setZoomLevel((z) => (z === 1 ? 1.35 : 1))}
                    title={zoomLevel === 1 ? 'Click to zoom in' : 'Click to reset zoom'}
                    style={{
                      transform: `scale(${zoomLevel})`,
                      transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      cursor: zoomLevel === 1 ? 'zoom-in' : 'zoom-out',
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                className="lightbox-nav-btn nav-prev"
                aria-label="Previous completed project"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCompletedIndex(
                    (prev) => (prev - 1 + completedProjects.length) % completedProjects.length
                  );
                  setZoomLevel(1);
                }}
              >
                <CaretLeft size={24} weight="bold" />
              </button>

              <button
                type="button"
                className="lightbox-nav-btn nav-next"
                aria-label="Next completed project"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCompletedIndex(
                    (prev) => (prev + 1) % completedProjects.length
                  );
                  setZoomLevel(1);
                }}
              >
                <CaretRight size={24} weight="bold" />
              </button>
            </div>

            <div className="lightbox-details-footer">
              <div className="lightbox-desc-block">
                <h3>{completedProjects[selectedCompletedIndex].name}</h3>
              </div>
              <div className="lightbox-spec-matrix">
                <div className="spec-item">
                  <span className="spec-label">Status</span>
                  <span className="spec-value">Handed Over</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Location</span>
                  <span className="spec-value">Chennai</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer backToTopTarget="#projects-page-title" />
    </div>
  );
}



function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [heroCycle, setHeroCycle] = useState(0);
  const [activeService, setActiveService] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formState, setFormState] = useState('idle');
  const [formValues, setFormValues] = useState({ name: '', phone: '', email: '', message: '' });

  const heroProgressRef = useRef(null);
  const heroProgressAnimation = useRef(null);
  const homeRef = useRef(null);
  const serviceHoverTimer = useRef(null);
  const servicePointer = useRef({ x: null, y: null });

  const moveSlide = (direction) => {
    setActiveSlide((current) => (current + direction + heroSlides.length) % heroSlides.length);
    setHeroCycle((current) => current + 1);
  };

  useEffect(() => () => window.clearTimeout(serviceHoverTimer.current), []);

  useEffect(() => {
    const updateHeader = () => {
      const visible = window.scrollY > 32;
      setScrolled(visible);
      if (!visible) {
        setMenuOpen(false);
        if (document.activeElement?.closest('.home-header')) document.activeElement.blur();
      }
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateHeader);
    };
  }, []);

  useEffect(() => {
    const animation = heroProgressRef.current.animate(
      [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      { duration: 10000, fill: 'both' },
    );
    animation.pause();
    heroProgressAnimation.current = animation;
    return () => animation.cancel();
  }, [activeSlide, heroCycle]);

  useEffect(() => {
    const animation = heroProgressAnimation.current;
    if (heroPaused) {
      animation.pause();
      return undefined;
    }
    // Restart the visible countdown with the same interval as autoplay.
    animation.currentTime = 0;
    animation.play();
    const timer = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 10000);
    return () => window.clearTimeout(timer);
  }, [activeSlide, heroPaused, heroCycle]);

  useEffect(() => {
    const media = gsap.matchMedia(homeRef);
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('[data-reveal], #home-reviews .jv-testimonial-summary-panel').forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          },
        );
      });

      gsap.utils.toArray('.rolling-digit-strip').forEach((strip) => {
        gsap.fromTo(strip, { y: '0em', yPercent: 0 }, {
          y: `${-Number(strip.dataset.stop) * 1.1}em`,
          yPercent: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.home-stats', start: 'top 85%', once: true },
        });
      });

      // Parallax scrub on about-image
      gsap.fromTo(
        '.about-image',
        { y: 12 },
        {
          y: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        },
      );

      gsap.fromTo('.joint-venture-mark', { y: 35 }, {
        y: -35,
        ease: 'none',
        scrollTrigger: { trigger: '#joint-venture', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
      });

      // Restrained image motion and project stacking.
      const cards = gsap.utils.toArray('[data-project-card]');
      cards.forEach((card, index) => {
        gsap.fromTo(
          card.querySelector('img'),
          { scale: 1.035 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              end: 'top 30%',
              scrub: 0.8,
            },
          },
        );
        card.style.setProperty('--stack-index', index);

        if (index < cards.length - 1) {
          const nextCard = cards[index + 1];
          gsap.to(card, {
            scale: 0.98,
            opacity: 0.94,
            ease: 'none',
            scrollTrigger: {
              trigger: nextCard,
              start: 'top 65%',
              end: 'top 20%',
              scrub: true,
            },
          });
        }
      });
    });

    return () => media.revert();
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const handleFormChange = (event) => {
    setFormValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setFormState('submitted');
  };

  const handleJvMouseMove = (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--jv-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    event.currentTarget.style.setProperty('--jv-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <div className="home-page" ref={homeRef}>
      <header inert={!scrolled} aria-hidden={!scrolled} className={`site-header home-header${activeSlide === 1 ? ' is-jv' : ''}${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}>
        <a className="wordmark" href="#home" aria-label="Maha Constructions home" onClick={closeMenu}>
          <img src={sitePath('/images/maha-constructions-logo.png')} alt="" />
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          <a href={sitePath('/about-2')} onClick={closeMenu}>About Us</a>
          <a href={sitePath('/projects')} onClick={closeMenu}>Projects</a>
          <a href={sitePath('/joint-venture')} onClick={closeMenu}>Joint Venture</a>
          <a href={sitePath('/gallery')} onClick={closeMenu}>Gallery</a>
          <a href={sitePath('/contact')} onClick={closeMenu}>Contact</a>
          <a className="nav-enquiry" href="#enquiry" onClick={closeMenu}>
            <span className="pulse-beacon" aria-hidden="true" />
            Enquire <ArrowUpRight size={14} weight="regular" />
          </a>
        </nav>
      </header>

      <main id="home">
        <section
          className={`hero${activeSlide === 1 ? ' is-jv' : ''}`}
          aria-label="Featured Maha Constructions developments"
          onFocusCapture={() => setHeroPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setHeroPaused(false);
          }}
        >
          {heroSlides.map((slide, index) => (
            <div className={`hero-slide${index === 1 ? ' hero-slide-jv' : ''}${activeSlide === index ? ' is-active' : ''}`} key={slide.desktop} aria-hidden={activeSlide !== index} inert={activeSlide !== index}>
              <picture className="hero-picture">
                {slide.mobile && <source media="(max-width: 700px)" srcSet={slide.mobile} />}
                <img src={slide.desktop} alt={slide.alt} fetchPriority={index === 0 ? 'high' : 'auto'} />
              </picture>
              {slide.mobileHref && <a className="hero-mobile-link" href={slide.mobileHref} aria-label={slide.mobileLinkLabel} />}
            </div>
          ))}
          <div className="hero-controls" aria-label="Hero image controls">
            <button type="button" aria-label="Previous image" onClick={() => moveSlide(-1)}>
              <ArrowLeft size={16} weight="light" aria-hidden="true" />
            </button>
            <div className="hero-progress" aria-hidden="true">
              <div className="hero-progress-bar" ref={heroProgressRef} />
            </div>
            <button type="button" aria-label="Next image" onClick={() => moveSlide(1)}>
              <ArrowRight size={16} weight="light" aria-hidden="true" />
            </button>
          </div>
        </section>

        <section className="home-stats section-shell" aria-label="Maha Constructions at a glance">
          <div className="home-stat"><strong>Since 1990</strong><span>Construction experience</span></div>
          <div className="home-stat"><strong><RollingNumber value={30} /><span>+</span></strong><span>Years of experience</span></div>
          <div className="home-stat"><strong><RollingNumber value={80} /><span>+</span></strong><span>Projects completed</span></div>
          <div className="home-stat"><strong><RollingNumber value={509} /><span>+</span></strong><span>Happy customers</span></div>
        </section>

        <section className="about section-shell" id="about">
          <div className="about-copy" id="story">
            <span className="eyebrow" data-reveal>Since 1990 · Chennai</span>
            <h1 data-reveal>
              Three decades of building <span className="inline-image" aria-hidden="true" /> trust.
            </h1>
            <p className="body-copy">
              Since 1990, Maha Constructions has been shaping thoughtful places and property opportunities with a long view of what makes a community thrive.
            </p>
            <a className="text-link" href={sitePath('/about-2')} data-reveal>
              Discover our story <ArrowRight size={16} />
            </a>
          </div>
          <figure className="about-image image-frame" data-reveal>
            <img
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1500&q=86"
              alt="A calm, naturally lit home interior"
              loading="lazy"
            />
          </figure>
        </section>

        <section className="services section-shell" id="services">
          <div className="services-heading" data-reveal>
            <span className="eyebrow">What we do</span>
            <h2>From land to<br />lived-in places.</h2>
            <p className="body-copy">A considered approach at every stage, shaped around people and the potential of a place.</p>
          </div>
          <div className="service-list">
            {services.map((service, index) => (
              <article
                className={`service-item${activeService === index ? ' is-open' : ''}`}
                key={service.title}
                data-reveal
              >
                <button
                  className="service-trigger"
                  type="button"
                  aria-expanded={activeService === index}
                  aria-controls={`home-service-${index}`}
                  onPointerMove={(event) => {
                    if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
                    const previous = servicePointer.current;
                    if (previous.x === event.clientX && previous.y === event.clientY) return;
                    servicePointer.current = { x: event.clientX, y: event.clientY };
                    window.clearTimeout(serviceHoverTimer.current);
                    if (activeService === index || document.activeElement?.closest('.service-detail')) return;
                    serviceHoverTimer.current = window.setTimeout(() => setActiveService(index), 140);
                  }}
                  onPointerLeave={() => window.clearTimeout(serviceHoverTimer.current)}
                  onPointerDown={() => window.clearTimeout(serviceHoverTimer.current)}
                  onClick={(event) => {
                    window.clearTimeout(serviceHoverTimer.current);
                    const toggle = event.detail === 0 || event.nativeEvent.pointerType !== 'mouse';
                    setActiveService((current) => toggle && current === index ? -1 : index);
                  }}
                >
                  <span className="service-number">0{index + 1}</span>
                  <span className="service-title">{service.title}</span>
                  <span className="service-arrow"><ArrowUpRight size={18} /></span>
                </button>
                <div className="service-detail" id={`home-service-${index}`} aria-hidden={activeService !== index} inert={activeService !== index}>
                  <div className="service-detail-content">
                    <p>{service.detail}</p>
                    <a href="#enquiry" aria-label={`Enquire about ${service.title}`}>Talk to our team <ArrowRight size={15} /></a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="projects section-shell" id="projects">
          <div className="projects-intro" data-reveal>
            <span className="eyebrow">A few places we’re proud of</span>
            <h2>Built with care.<br />Made to belong.</h2>
            <p className="body-copy">Every project begins with listening—to the land, the neighbourhood and the people who will call it home.</p>
            <a className="text-link" href={sitePath('/projects')}>Explore all projects <ArrowRight size={16} /></a>
          </div>
          <div className="project-stack" aria-label="Featured project photography">
            {projects.map((project) => (
              <article className="project-card" data-project-card key={project.name}>
                <a href="#enquiry" className="project-image image-frame" aria-label={`Enquire about ${project.name}`}>
                  <img src={project.image} alt={project.alt} loading="lazy" />
                  <span className="project-visit"><ArrowUpRight size={18} /></span>
                </a>
                <div className="project-caption">
                  <div><h3>{project.name}</h3><p>{project.type}</p></div>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </div>
              </article>
            ))}
          </div>
        </section>

        <GoogleReviewsSection id="home-reviews" title="What our customers say." />

        <section className="joint-venture" id="joint-venture" onMouseMove={handleJvMouseMove}>
          <div className="joint-venture-inner" data-reveal>
            <span className="eyebrow">A partnership with possibility</span>
            <h2>Have land?<br />Let’s build together.</h2>
            <p>Bring your land. Bring your vision. We’ll bring the experience to make the next step count.</p>
            <a className="button button-light" href={sitePath('/joint-venture')}>Explore joint ventures <ArrowUpRight size={16} /></a>
          </div>
          <span className="joint-venture-mark" aria-hidden="true">MC</span>
        </section>

        <section className="contact section-shell" id="contact">
          <div className="contact-copy" data-reveal>
            <span className="eyebrow">Start a conversation</span>
            <h2>Let’s build<br />something<br />together.</h2>
            <p className="body-copy">Have a project in mind? Tell us a little about it and our team will be in touch.</p>
            <div className="contact-quick-links">
              <a className="contact-email" href="mailto:saimaha1000@gmail.com">
                saimaha1000@gmail.com <ArrowUpRight size={15} />
              </a>
              <a className="contact-whatsapp" href="https://wa.me/919940407777" target="_blank" rel="noreferrer">
                <WhatsappLogo size={18} weight="fill" /> +91 99404 07777
              </a>
            </div>
          </div>
          <form className="contact-page-form site-enquiry-form" id="enquiry" onSubmit={handleSubmit}>
            <div className="contact-page-form-heading">
              <div>
                <span className="eyebrow">Your enquiry</span>
                <h2>How can we help?</h2>
              </div>
              <span className="form-req-pill">All fields required</span>
            </div>
            <div className="form-row">
              <label className="animated-input-group">
                <span>Name</span>
                <input
                  name="name"
                  autoComplete="name"
                  value={formValues.name}
                  onChange={handleFormChange}
                  placeholder="Your full name"
                  required
                />
              </label>
              <label className="animated-input-group">
                <span>Phone number</span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formValues.phone}
                  onChange={handleFormChange}
                  placeholder="Your phone number"
                  required
                />
              </label>
            </div>
            <label className="animated-input-group">
              <span>Email address</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={formValues.email}
                onChange={handleFormChange}
                placeholder="you@example.com"
                required
              />
            </label>
            <fieldset className="contact-enquiry-types">
              <legend>What would you like to discuss?</legend>
              <div className="enquiry-chips-row">
                {['General Inquiry', 'Building Contract', 'Joint Venture'].map((type) => (
                  <label className="enquiry-chip-label" key={type}>
                    <input type="checkbox" name="enquiryType" value={type} />
                    <span className="chip-indicator" aria-hidden="true"><Check size={13} weight="bold" /></span>
                    <span className="chip-text">{type}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="animated-input-group">
              <span>Message</span>
              <textarea
                name="message"
                rows="5"
                value={formValues.message}
                onChange={handleFormChange}
                placeholder="Share a few details about your enquiry"
                required
              />
            </label>
            <button className="button button-green magnetic-button" type="submit">
              Send enquiry <ArrowUpRight size={16} aria-hidden="true" />
            </button>
            <p className={`form-note${formState === 'submitted' ? ' is-visible' : ''}`} role="status">
              {formState === 'submitted'
                ? 'Thanks for reaching out. Form submission will be enabled once the enquiry service is connected.'
                : 'This form is a preview and does not send messages yet.'}
            </p>
          </form>
        </section>
      </main>

      <Footer backToTopTarget="#home" className="home-footer" />
    </div>
  );
}

export default App;
