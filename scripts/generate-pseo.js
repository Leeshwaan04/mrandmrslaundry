import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { LOCATIONS } from './locations-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public');
const LOCATIONS_DIR = path.resolve(PUBLIC_DIR, 'locations');

const DOMAIN = 'https://mrandmrslaundry.com';
const PHONE_NUMBER = '+91 9152233822';
const PHONE_CLEAN = '919152233822';
const EMAIL = 'mrmrslaundry29@gmail.com';
const CURRENT_DATE = new Date().toISOString().split('T')[0];

// Same GTM container as the main site's index.html, so pSEO traffic rolls into one place.
const GTM_ID = 'GTM-P38X3JKJ';

function gtmHeadSnippet(pagePath) {
  return `
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');</script>
    <!-- End Google Tag Manager -->
    <script>
      // Sitewide click tracking, pushed to the dataLayer — attach a GA4 Event tag in GTM
      // to a Custom Event trigger named "whatsapp_click" / "call_click" to forward these.
      window.dataLayer = window.dataLayer || [];
      document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href]');
        if (!a) return;
        var href = a.getAttribute('href') || '';
        if (href.indexOf('wa.me') !== -1) {
          window.dataLayer.push({ event: 'whatsapp_click', page_path: '${pagePath}' });
        } else if (href.indexOf('tel:') === 0) {
          window.dataLayer.push({ event: 'call_click', page_path: '${pagePath}' });
        }
      });
    </script>`;
}

const GTM_BODY_SNIPPET = `
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->`;

// Wipe and recreate so a location removed from LOCATIONS doesn't leave a stale,
// un-sitemapped page sitting in public/ (and therefore in every future dist/ build) forever.
if (fs.existsSync(LOCATIONS_DIR)) {
  fs.rmSync(LOCATIONS_DIR, { recursive: true, force: true });
}
fs.mkdirSync(LOCATIONS_DIR, { recursive: true });

// Tracks a content hash + lastmod per page so a rebuild where nothing actually
// changed doesn't stamp every URL with today's date — that false "everything
// changed" signal wastes crawl budget and erodes trust in lastmod for pages
// that genuinely did change. This file is committed to the repo so the cache
// persists across the next person's regeneration (CI never commits).
const LASTMOD_CACHE_PATH = path.resolve(__dirname, 'pseo-lastmod-cache.json');
const lastmodCache = fs.existsSync(LASTMOD_CACHE_PATH)
  ? JSON.parse(fs.readFileSync(LASTMOD_CACHE_PATH, 'utf-8'))
  : {};
const lastmodBySlug = {};

function resolveLastmod(slug, content) {
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  const cached = lastmodCache[slug];
  const lastmod = cached && cached.hash === hash ? cached.lastmod : CURRENT_DATE;
  lastmodCache[slug] = { hash, lastmod };
  lastmodBySlug[slug] = lastmod;
  return lastmod;
}

console.log(`🚀 Starting Programmatic Local SEO (pSEO) generation for ${LOCATIONS.length} Mumbai micro-markets...`);

// 1. Generate Individual Location Pages
LOCATIONS.forEach((loc) => {
  const locDir = path.resolve(LOCATIONS_DIR, loc.slug);
  if (!fs.existsSync(locDir)) {
    fs.mkdirSync(locDir, { recursive: true });
  }

  // Find nearby locations in same region for internal cross-linking mesh
  const nearbyLocations = LOCATIONS
    .filter((l) => l.slug !== loc.slug && l.region === loc.region)
    .slice(0, 6);
  // Fallback to any other locations if same region has few
  if (nearbyLocations.length < 5) {
    const extra = LOCATIONS.filter((l) => l.slug !== loc.slug && !nearbyLocations.includes(l)).slice(0, 6 - nearbyLocations.length);
    nearbyLocations.push(...extra);
  }

  const pageTitle = `Best Laundry & Dry Clean in ${loc.name} | Wash & Fold ₹99/Kg | Mr & Mrs Laundry`;
  const metaDesc = `Doorstep laundry & dry cleaning in ${loc.name}, Mumbai (${loc.pincode}). 100% individual drums, ₹99/Kg wash & fold, Italian steam iron & 24h express delivery. Book online or WhatsApp +91 9152233822!`;
  const canonicalUrl = `${DOMAIN}/locations/${loc.slug}/`;
  const waUrl = `https://wa.me/${PHONE_CLEAN}?text=${encodeURIComponent(`Hi Mr & Mrs Laundry, I would like to book a laundry pickup in ${loc.name} (${loc.pincode})`)}`;

  // Built as a real object and JSON.stringify'd (rather than hand-interpolated into the
  // <script> tag) so a stray quote/backslash in location data can't produce invalid JSON-LD,
  // and `<` is escaped so a value can't prematurely close the surrounding <script> tag.
  // This page is modeled as a Service of the one real business (not its own LocalBusiness
  // branch with a fabricated street address), since Mr & Mrs Laundry has only two physical
  // premises (Tardeo store, Malad East facility) and no branch in every neighborhood listed.
  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${canonicalUrl}#service`,
        name: `Doorstep Laundry & Dry Cleaning Pickup — ${loc.name}`,
        serviceType: 'Laundry and Dry Cleaning Pickup & Delivery',
        url: canonicalUrl,
        provider: { '@id': `${DOMAIN}/#localbusiness` },
        areaServed: {
          '@type': 'Place',
          name: loc.name,
          address: {
            '@type': 'PostalAddress',
            addressLocality: loc.name,
            addressRegion: 'Maharashtra',
            postalCode: loc.pincode,
            addressCountry: 'IN'
          }
        },
        offers: {
          '@type': 'OfferCatalog',
          name: `Laundry & Dry Cleaning Rates in ${loc.name}`,
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: `Wash & Fold (${loc.name})`,
                description: 'Daily garments sanitized in 100% individual drum wash, tumble dried and folded.'
              },
              price: '99',
              priceCurrency: 'INR'
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: `Wash & Steam Iron (${loc.name})`,
                description: 'Full wash cycle with wrinkle-free high pressure Italian steam pressing.'
              },
              price: '129',
              priceCurrency: 'INR'
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: `Designer Dry Cleaning (${loc.name})`,
                description: 'Hydrocarbon eco dry cleaning for suits, lehengas, silk sarees and blazers.'
              },
              price: '199',
              priceCurrency: 'INR'
            }
          ]
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${DOMAIN}/` },
          { '@type': 'ListItem', position: 2, name: 'Mumbai Locations', item: `${DOMAIN}/locations/` },
          { '@type': 'ListItem', position: 3, name: loc.name, item: canonicalUrl }
        ]
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: `Do you provide free doorstep laundry pickup in ${loc.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes! Mr & Mrs Laundry provides daily doorstep pickup and delivery across ${loc.name} (${loc.pincode}). Pickup and delivery is completely free on orders of ₹399 and above.`
            }
          },
          {
            '@type': 'Question',
            name: `How much does laundry cost per kg in ${loc.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Our Wash & Fold service starts at just ₹99/Kg, and Wash & Steam Iron is ₹129/Kg. All garments are washed in dedicated individual drums with hospital-grade sanitization.'
            }
          },
          {
            '@type': 'Question',
            name: `What landmarks in ${loc.name} do you cover?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `We cover all major landmarks across ${loc.name} including ${loc.landmarks.join(', ')} and surrounding societies.`
            }
          },
          {
            '@type': 'Question',
            name: `What are your pickup timings for ${loc.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `We operate two convenient pickup and delivery shifts in ${loc.name}: ${loc.pickupSlots.join(' and ')}. Express 24-hour turnaround is also available upon request.`
            }
          }
        ]
      }
    ]
  };
  const jsonLdScript = JSON.stringify(jsonLdGraph, null, 2).replace(/</g, '\\u003c');

  const htmlContent = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${gtmHeadSnippet(`/locations/${loc.slug}/`)}

    <!-- Localized SEO Title & Meta -->
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}" />
    <meta name="keywords" content="Laundry in ${loc.name}, Dry Cleaning ${loc.name}, Wash and fold ${loc.name}, Laundry ${loc.pincode}, Shoe Cleaning ${loc.name}, Steam Ironing ${loc.name}, Express Laundry Mumbai" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonicalUrl}" />

    <!-- Open Graph / Social Sharing -->
    <meta property="og:type" content="business.business" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="Mr & Mrs Laundry" />
    <meta property="og:title" content="${pageTitle}" />
    <meta property="og:description" content="${metaDesc}" />
    <meta property="og:image" content="${DOMAIN}/favicon-192x192.png" />
    <meta property="og:locale" content="en_IN" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${pageTitle}" />
    <meta name="twitter:description" content="${metaDesc}" />
    <meta name="twitter:image" content="${DOMAIN}/favicon-192x192.png" />

    <!-- Favicon & Styles -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />

    <!-- JSON-LD Structured Data: Service (provided by the real LocalBusiness, see index.html) -->
    <script type="application/ld+json">
${jsonLdScript}
    </script>

    <style>
      :root {
        --bg-main: #050508;
        --bg-card: #0e121d;
        --bg-card-hover: #131929;
        --border-color: #1e293b;
        --accent-blue: #2563eb;
        --accent-cyan: #38bdf8;
        --accent-green: #10b981;
        --text-white: #f8fafc;
        --text-muted: #94a3b8;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background-color: var(--bg-main);
        color: var(--text-white);
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        padding-bottom: 80px;
      }
      a { color: var(--accent-cyan); text-decoration: none; }
      a:hover { text-decoration: underline; }
      .container { max-width: 1040px; margin: 0 auto; padding: 0 20px; }

      /* Header */
      header {
        background: rgba(5, 5, 8, 0.9);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--border-color);
        position: sticky;
        top: 0;
        z-index: 50;
        padding: 14px 0;
      }
      .nav-row { display: flex; align-items: center; justify-content: space-between; }
      .brand-title { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 1.25rem; color: #fff; display: flex; align-items: center; gap: 8px; }
      .brand-title span { color: var(--accent-cyan); }
      .nav-actions { display: flex; gap: 10px; align-items: center; }
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.88rem;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
      }
      .btn-primary { background: var(--accent-blue); color: #fff; }
      .btn-primary:hover { background: #1d4ed8; text-decoration: none; }
      .btn-whatsapp { background: #16a34a; color: #fff; }
      .btn-whatsapp:hover { background: #15803d; text-decoration: none; }
      .btn-outline { background: transparent; border: 1px solid var(--border-color); color: var(--text-white); }
      .btn-outline:hover { background: #1e293b; text-decoration: none; }

      /* Breadcrumbs */
      .breadcrumbs { padding: 16px 0 0 0; font-size: 0.85rem; color: var(--text-muted); }
      .breadcrumbs a { color: var(--text-muted); }
      .breadcrumbs a:hover { color: var(--accent-cyan); }

      /* Hero */
      .hero { padding: 36px 0 24px 0; }
      .badge-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
      .badge {
        display: inline-flex;
        align-items: center;
        padding: 4px 12px;
        background: rgba(56, 189, 248, 0.1);
        border: 1px solid rgba(56, 189, 248, 0.25);
        color: var(--accent-cyan);
        border-radius: 9999px;
        font-size: 0.82rem;
        font-weight: 600;
      }
      .badge-green {
        background: rgba(16, 185, 129, 0.1);
        border-color: rgba(16, 185, 129, 0.25);
        color: #34d399;
      }
      h1 {
        font-family: 'Sora', sans-serif;
        font-size: 2.35rem;
        font-weight: 800;
        line-height: 1.25;
        margin-bottom: 16px;
        background: linear-gradient(135deg, #ffffff 60%, #94a3b8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .hero-desc { font-size: 1.1rem; color: var(--text-muted); max-width: 800px; margin-bottom: 24px; line-height: 1.6; }
      .hero-ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 32px; }
      .hero-ctas .btn { padding: 12px 24px; font-size: 1rem; border-radius: 10px; }

      /* Local Logistics Info Box */
      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
        margin-bottom: 40px;
      }
      .info-card {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 18px;
      }
      .info-label { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-cyan); font-weight: 700; margin-bottom: 6px; }
      .info-val { font-size: 0.98rem; font-weight: 600; color: #fff; }

      /* Rates Section */
      .section-title { font-family: 'Sora', sans-serif; font-size: 1.65rem; font-weight: 700; margin-bottom: 12px; }
      .section-subtitle { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px; }
      .rates-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
        margin-bottom: 48px;
      }
      .rate-card {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 14px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: transform 0.2s, border-color 0.2s;
      }
      .rate-card:hover { transform: translateY(-3px); border-color: rgba(56, 189, 248, 0.4); }
      .rate-card.featured { border-color: var(--accent-blue); background: linear-gradient(180deg, #0f182c 0%, #0e121d 100%); }
      .rate-header { margin-bottom: 16px; }
      .rate-title { font-size: 1.2rem; font-weight: 700; color: #fff; margin-bottom: 6px; }
      .rate-price { font-size: 1.75rem; font-weight: 800; color: var(--accent-cyan); font-family: 'Sora', sans-serif; }
      .rate-price span { font-size: 0.9rem; font-weight: 500; color: var(--text-muted); }
      .rate-desc { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 16px; }
      .rate-features { list-style: none; margin-bottom: 20px; }
      .rate-features li { font-size: 0.85rem; color: #cbd5e1; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
      .rate-features li::before { content: "✓"; color: #34d399; font-weight: bold; }

      /* Why Us Section */
      .why-section {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 32px 24px;
        margin-bottom: 48px;
      }
      .features-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 24px;
        margin-top: 24px;
      }
      .feature-item h3 { font-size: 1.05rem; font-weight: 700; color: #fff; margin-bottom: 8px; }
      .feature-item p { font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; }

      /* Landmarks List */
      .landmarks-box {
        background: #090d16;
        border: 1px dashed #243247;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 48px;
      }
      .landmarks-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
      .landmark-pill {
        background: #131b2e;
        border: 1px solid #1f2c45;
        color: #cbd5e1;
        font-size: 0.82rem;
        padding: 6px 12px;
        border-radius: 6px;
      }

      /* FAQs */
      .faq-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 48px; }
      details {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 10px;
        padding: 16px 20px;
        cursor: pointer;
      }
      details[open] { border-color: rgba(56, 189, 248, 0.4); }
      summary { font-weight: 600; font-size: 1rem; color: #f1f5f9; outline: none; }
      details p { margin-top: 12px; font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; }

      /* Nearby Neighborhoods Internal Links */
      .nearby-box {
        border-top: 1px solid var(--border-color);
        padding-top: 32px;
        margin-bottom: 48px;
      }
      .nearby-links { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; }
      .nearby-link {
        display: inline-block;
        background: #0c101a;
        border: 1px solid var(--border-color);
        padding: 8px 14px;
        border-radius: 8px;
        font-size: 0.85rem;
        color: #94a3b8;
      }
      .nearby-link:hover { color: #fff; border-color: var(--accent-cyan); text-decoration: none; }

      /* Sticky Mobile CTA Bar */
      .mobile-cta-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(14, 18, 29, 0.96);
        backdrop-filter: blur(12px);
        border-top: 1px solid var(--border-color);
        padding: 12px 20px;
        display: flex;
        gap: 12px;
        z-index: 100;
      }
      .mobile-cta-bar .btn { flex: 1; justify-content: center; padding: 12px; font-size: 0.92rem; }

      /* Footer */
      footer { border-top: 1px solid var(--border-color); padding: 32px 0 40px 0; font-size: 0.85rem; color: var(--text-muted); text-align: center; }

      @media (min-width: 768px) {
        .mobile-cta-bar { display: none; }
        body { padding-bottom: 0; }
      }
    </style>
  </head>
  <body>
    ${GTM_BODY_SNIPPET}
    <!-- Top Navigation -->
    <header>
      <div class="container nav-row">
        <a href="${DOMAIN}/" class="brand-title">
          <span>Mr &amp; Mrs</span> Laundry
        </a>
        <div class="nav-actions">
          <a href="${DOMAIN}/services" class="btn btn-outline">All Services</a>
          <a href="tel:${PHONE_CLEAN}" class="btn btn-outline">📞 ${PHONE_NUMBER}</a>
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">💬 WhatsApp Booking</a>
        </div>
      </div>
    </header>

    <main class="container">
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="${DOMAIN}/">Home</a> &gt; 
        <a href="${DOMAIN}/locations/">Mumbai Locations</a> &gt; 
        <span>${loc.name}</span>
      </nav>

      <!-- Hero Section -->
      <section class="hero">
        <div class="badge-row">
          <span class="badge">📍 Doorstep Service: ${loc.name} (${loc.pincode})</span>
          <span class="badge badge-green">★ 4.9 Rating (520+ Reviews)</span>
          <span class="badge">⚡ 100% Individual Drum Wash</span>
        </div>
        <h1>Professional Doorstep Laundry &amp; Dry Cleaning in ${loc.name}, Mumbai</h1>
        <p class="hero-desc">
          ${loc.intro} We pick up from your doorstep, sanitize garments in dedicated individual machines with eco-friendly detergents, and return fresh, wrinkle-free clothes within 24 to 48 hours.
        </p>
        <div class="hero-ctas">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">💬 Book Pickup in ${loc.name}</a>
          <a href="tel:${PHONE_CLEAN}" class="btn btn-primary">📞 Call ${PHONE_NUMBER}</a>
          <a href="${DOMAIN}/#book" class="btn btn-outline">📅 Schedule Online (From ₹99/Kg)</a>
        </div>
      </section>

      <!-- Local Logistics & Turnaround -->
      <section class="info-grid">
        <div class="info-card">
          <div class="info-label">Postal Pincode</div>
          <div class="info-val">${loc.pincode} (${loc.name})</div>
        </div>
        <div class="info-card">
          <div class="info-label">Estimated Turnaround</div>
          <div class="info-val">${loc.avgTurnaround}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Daily Pickup Shifts</div>
          <div class="info-val" style="font-size: 0.88rem;">${loc.pickupSlots.join(' &bull; ')}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Delivery Guarantee</div>
          <div class="info-val" style="color: #34d399;">Free Doorstep Pickup (₹399+)</div>
        </div>
      </section>

      <!-- Rates & Services -->
      <section>
        <h2 class="section-title">Transparent Laundry &amp; Dry Clean Rates in ${loc.name}</h2>
        <p class="section-subtitle">No hidden charges. 100% hygienic processing in individual drums.</p>
        <div class="rates-grid">
          <!-- Wash & Fold -->
          <div class="rate-card featured">
            <div class="rate-header">
              <h3 class="rate-title">Wash &amp; Fold</h3>
              <div class="rate-price">₹99 <span>/ kg</span></div>
            </div>
            <p class="rate-desc">Daily apparel from ${loc.name} homes near ${loc.landmarks[0]}, weighed and sanitized with gentle detergents in your own dedicated drum, tumble dried and folded.</p>
            <ul class="rate-features">
              <li>100% Individual wash drums</li>
              <li>Hospital-grade microbial sanitization</li>
              <li>Delicate fabric softener included</li>
              <li>Neat packaging &amp; ready to wear</li>
            </ul>
            <a href="${waUrl}" class="btn btn-whatsapp" style="justify-content: center;">Book Wash &amp; Fold</a>
          </div>

          <!-- Wash & Steam Iron -->
          <div class="rate-card">
            <div class="rate-header">
              <h3 class="rate-title">Wash &amp; Steam Iron</h3>
              <div class="rate-price">₹129 <span>/ kg</span></div>
            </div>
            <p class="rate-desc">Complete wash cycle followed by high-pressure Italian steam press on hangers or precision folded.</p>
            <ul class="rate-features">
              <li>Wrinkle-free Italian steam pressing</li>
              <li>Collar, cuff &amp; pleat sharpening</li>
              <li>Delivered on hangers or crisp fold</li>
              <li>Ideal for formal shirts &amp; trousers</li>
            </ul>
            <a href="${waUrl}" class="btn btn-primary" style="justify-content: center;">Book Wash &amp; Iron</a>
          </div>

          <!-- Premium Dry Cleaning -->
          <div class="rate-card">
            <div class="rate-header">
              <h3 class="rate-title">Premium Dry Cleaning</h3>
              <div class="rate-price">₹199 <span>/ piece onwards</span></div>
            </div>
            <p class="rate-desc">Specialized hydrocarbon dry clean for suits, blazers, silk sarees, lehengas, and designer wear.</p>
            <ul class="rate-features">
              <li>Eco-safe solvent technology</li>
              <li>Zari, bead &amp; embroidery protection</li>
              <li>Custom stain lifting treatment</li>
              <li>Deluxe dust-proof garment bags</li>
            </ul>
            <a href="${waUrl}" class="btn btn-primary" style="justify-content: center;">Book Dry Cleaning</a>
          </div>

          <!-- Sneaker Spa -->
          <div class="rate-card">
            <div class="rate-header">
              <h3 class="rate-title">Sneaker &amp; Shoe Spa</h3>
              <div class="rate-price">₹299 <span>/ pair onwards</span></div>
            </div>
            <p class="rate-desc">Deep sole scrubbing, upper restoration, and microbial deodorization for sports shoes, leather &amp; sneakers.</p>
            <ul class="rate-features">
              <li>Midsole de-yellowing treatment</li>
              <li>Antibacterial ozone deodorization</li>
              <li>Suede, canvas &amp; knit conditioning</li>
            </ul>
            <a href="${waUrl}" class="btn btn-primary" style="justify-content: center;">Book Shoe Spa</a>
          </div>

          <!-- Quilts & Curtains -->
          <div class="rate-card">
            <div class="rate-header">
              <h3 class="rate-title">Blankets, Quilts &amp; Curtains</h3>
              <div class="rate-price">₹349 <span>/ item onwards</span></div>
            </div>
            <p class="rate-desc">Heavy-duty dust extraction, deep allergen wash, and delicate sanitization with free de-hanging support.</p>
            <ul class="rate-features">
              <li>Down &amp; fiber-fill fluffing</li>
              <li>Deep dust mite extraction</li>
              <li>Steam sanitization finish</li>
            </ul>
            <a href="${waUrl}" class="btn btn-primary" style="justify-content: center;">Book Heavy Care</a>
          </div>

          <!-- Express 24h -->
          <div class="rate-card">
            <div class="rate-header">
              <h3 class="rate-title">Express 24-Hour Laundry</h3>
              <div class="rate-price">Fast <span>Turnaround</span></div>
            </div>
            <p class="rate-desc">Need garments ready tomorrow? Guaranteed 24-hour return delivery straight to your door in ${loc.name}.</p>
            <ul class="rate-features">
              <li>Priority facility routing</li>
              <li>Fast doorstep collection</li>
              <li>Available across ${loc.pincode}</li>
            </ul>
            <a href="${waUrl}" class="btn btn-whatsapp" style="justify-content: center;">Request Express Delivery</a>
          </div>
        </div>
      </section>

      <!-- Landmarks Covered -->
      <section class="landmarks-box">
        <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff;">Key Landmarks &amp; Societies We Serve in ${loc.name}</h3>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 4px;">Our doorstep pickup van operates regularly around:</p>
        <div class="landmarks-tags">
          ${loc.landmarks.map((l) => `<span class="landmark-pill">📍 ${l}</span>`).join('')}
          <span class="landmark-pill">📍 All Societies in ${loc.pincode}</span>
        </div>
      </section>

      <!-- Why Us -->
      <section class="why-section">
        <h2 class="section-title">Why ${loc.name} Residents Trust Mr &amp; Mrs Laundry</h2>
        <div class="features-row">
          <div class="feature-item">
            <h3>🚫 Zero Clothes Mixing</h3>
            <p>Every order from ${loc.landmarks[0]} and ${loc.landmarks[Math.min(1, loc.landmarks.length - 1)]} is washed in its own isolated, dedicated drum — your garments never touch another household's clothes.</p>
          </div>
          <div class="feature-item">
            <h3>💧 Soft RO-Purified Water</h3>
            <p>We use mineral-balanced water on every ${loc.name} order, which matters most for the ${loc.popularServices[0].replace(/\s*\(.*?\)/, '')} requests we handle daily in this neighborhood.</p>
          </div>
          <div class="feature-item">
            <h3>⏱ ${loc.avgTurnaround} Turnaround</h3>
            <p>Our ${loc.name} route runs ${loc.pickupSlots.join(' and ')} — pick whichever window fits your day, and our executive comes right to your door or lobby.</p>
          </div>
          <div class="feature-item">
            <h3>⭐ Loved Across ${loc.region}</h3>
            <p>From ${loc.landmarks[Math.min(2, loc.landmarks.length - 1)]} to ${loc.landmarks[Math.min(3, loc.landmarks.length - 1)]}, we're backed by a 4.9/5 rating from verified customers across Mumbai.</p>
          </div>
        </div>
      </section>

      <!-- FAQs -->
      <section>
        <h2 class="section-title">Frequently Asked Questions — ${loc.name} Laundry</h2>
        <div class="faq-list">
          <details open>
            <summary>Do you provide free doorstep laundry pickup in ${loc.name}?</summary>
            <p>Yes, absolutely. We provide daily doorstep pickup and delivery across ${loc.name} (${loc.pincode}) including ${loc.landmarks.slice(0, 3).join(', ')}. Doorstep service is free on all orders of ₹399 and above.</p>
          </details>
          <details>
            <summary>How much does wash &amp; fold laundry cost in ${loc.name}?</summary>
            <p>Our Wash &amp; Fold service starts at just ₹99/Kg, and Wash &amp; Steam Iron is ₹129/Kg. All orders receive 100% individual drum wash with premium hospital-grade sanitization.</p>
          </details>
          <details>
            <summary>What are your pickup timings for ${loc.name}?</summary>
            <p>We provide two convenient shifts: ${loc.pickupSlots.join(' and ')}. Express 24-hour turnaround is also available upon request.</p>
          </details>
          <details>
            <summary>How can I schedule a pickup?</summary>
            <p>You can book instantly by messaging or calling our team on WhatsApp at <a href="${waUrl}">+91 9152233822</a>, or by scheduling directly on our website.</p>
          </details>
        </div>
      </section>

      <!-- Nearby Localities Mesh -->
      <section class="nearby-box">
        <h3 style="font-size: 1.1rem; font-weight: 700; color: #fff;">Also Serving Nearby ${loc.region} Areas</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Explore our doorstep laundry and dry cleaning services across neighboring suburbs:</p>
        <div class="nearby-links">
          ${nearbyLocations.map((nl) => `<a href="${DOMAIN}/locations/${nl.slug}/" class="nearby-link">📍 Laundry in ${nl.name} (${nl.pincode})</a>`).join('')}
          <a href="${DOMAIN}/locations/" class="nearby-link" style="color: var(--accent-cyan); border-color: rgba(56, 189, 248, 0.4);">→ View All ${LOCATIONS.length} Mumbai Locations</a>
        </div>
      </section>
    </main>

    <!-- Sticky Mobile CTA Bar -->
    <div class="mobile-cta-bar">
      <a href="tel:${PHONE_CLEAN}" class="btn btn-primary">📞 Call Now</a>
      <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">💬 WhatsApp Booking</a>
    </div>

    <!-- Footer -->
    <footer>
      <div class="container">
        <p><strong>Mr &amp; Mrs Laundry</strong> — Mumbai’s Trusted Laundry &amp; Dry Cleaning Service Since 2012.</p>
        <p style="margin-top: 6px;">Tardeo Store: Shop no. 3/4, No. 508, Ganjawala Tower, Tardeo, Mumbai - 400034 | Facility: Malad East Eco Hub, Mumbai.</p>
        <p style="margin-top: 6px;">Customer Helpline: <a href="tel:${PHONE_CLEAN}" style="color: var(--accent-cyan);">${PHONE_NUMBER}</a> | Email: <a href="mailto:${EMAIL}" style="color: var(--accent-cyan);">${EMAIL}</a></p>
        <p style="margin-top: 12px; color: #64748b;">&copy; ${new Date().getFullYear()} Mr &amp; Mrs Laundry. All Rights Reserved. • <a href="${DOMAIN}/">Home</a> • <a href="${DOMAIN}/services">Services</a> • <a href="${DOMAIN}/locations/">Locations Directory</a></p>
      </div>
    </footer>
  </body>
</html>`;

  fs.writeFileSync(path.resolve(locDir, 'index.html'), htmlContent, 'utf-8');
  resolveLastmod(loc.slug, htmlContent);
});

console.log(`✅ Generated ${LOCATIONS.length} individual static micro-market location pages!`);

// 2. Generate Master Locations Directory Page: public/locations/index.html
const regionsMap = {};
LOCATIONS.forEach((loc) => {
  if (!regionsMap[loc.region]) regionsMap[loc.region] = [];
  regionsMap[loc.region].push(loc);
});

const directoryHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${gtmHeadSnippet('/locations/')}
    <title>Doorstep Laundry Pickup Locations in Mumbai | Mr &amp; Mrs Laundry</title>
    <meta name="description" content="Explore Mr &amp; Mrs Laundry doorstep pickup and delivery across South Mumbai, Western Suburbs &amp; Central Mumbai. 100% individual drums from ₹99/Kg." />
    <link rel="canonical" href="${DOMAIN}/locations/" />
    <meta name="robots" content="index, follow" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />
    <style>
      :root {
        --bg-main: #050508;
        --bg-card: #0e121d;
        --border-color: #1e293b;
        --accent-blue: #2563eb;
        --accent-cyan: #38bdf8;
        --text-white: #f8fafc;
        --text-muted: #94a3b8;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: var(--bg-main); color: var(--text-white); font-family: 'Plus Jakarta Sans', sans-serif; line-height: 1.6; }
      a { color: var(--accent-cyan); text-decoration: none; }
      .container { max-width: 1040px; margin: 0 auto; padding: 0 20px; }
      header { background: rgba(5,5,8,0.9); border-bottom: 1px solid var(--border-color); padding: 14px 0; }
      .brand-title { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 1.25rem; color: #fff; }
      .brand-title span { color: var(--accent-cyan); }
      .hero { padding: 48px 0 32px 0; text-align: center; }
      h1 { font-family: 'Sora', sans-serif; font-size: 2.2rem; font-weight: 800; margin-bottom: 12px; }
      .hero p { color: var(--text-muted); font-size: 1.05rem; max-width: 700px; margin: 0 auto; }
      .region-section { margin-bottom: 48px; }
      .region-title { font-family: 'Sora', sans-serif; font-size: 1.45rem; font-weight: 700; color: #fff; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; }
      .locations-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
      .location-card {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 18px 20px;
        transition: transform 0.2s, border-color 0.2s;
        display: block;
      }
      .location-card:hover { transform: translateY(-2px); border-color: var(--accent-cyan); text-decoration: none; }
      .loc-card-title { font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 4px; display: flex; justify-content: space-between; }
      .loc-card-pin { font-size: 0.82rem; color: var(--accent-cyan); font-weight: 600; }
      .loc-card-desc { font-size: 0.84rem; color: var(--text-muted); margin-top: 6px; }
      footer { border-top: 1px solid var(--border-color); padding: 32px 0; text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-top: 60px; }
    </style>
  </head>
  <body>
    ${GTM_BODY_SNIPPET}
    <header>
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <a href="${DOMAIN}/" class="brand-title"><span>Mr &amp; Mrs</span> Laundry</a>
        <div>
          <a href="${DOMAIN}/" style="margin-right: 16px; color: var(--text-muted);">Home</a>
          <a href="${DOMAIN}/services" style="color: var(--text-muted);">Services</a>
        </div>
      </div>
    </header>

    <main class="container">
      <div class="hero">
        <h1>Doorstep Laundry Pickup Locations Across Mumbai</h1>
        <p>Providing 100% individual drum wash, Italian steam iron &amp; eco-dry cleaning with scheduled doorstep pickup across ${LOCATIONS.length}+ prime Mumbai micro-markets.</p>
      </div>

      ${Object.entries(regionsMap)
        .map(
          ([region, locs]) => `
      <section class="region-section">
        <h2 class="region-title">📍 ${region} (${locs.length} Localities)</h2>
        <div class="locations-grid">
          ${locs
            .map(
              (l) => `
          <a href="${DOMAIN}/locations/${l.slug}/" class="location-card">
            <div class="loc-card-title">
              <span>${l.name}</span>
              <span class="loc-card-pin">${l.pincode}</span>
            </div>
            <div class="loc-card-desc">Turnaround: ${l.avgTurnaround} &bull; ${l.landmarks.slice(0, 2).join(', ')}</div>
          </a>`
            )
            .join('')}
        </div>
      </section>`
        )
        .join('')}
    </main>

    <footer>
      <div class="container">
        <p>&copy; ${new Date().getFullYear()} Mr &amp; Mrs Laundry Mumbai. Doorstep pickup across South Mumbai, Western Suburbs &amp; Central Mumbai.</p>
      </div>
    </footer>
  </body>
</html>`;

fs.writeFileSync(path.resolve(LOCATIONS_DIR, 'index.html'), directoryHtml, 'utf-8');
console.log(`✅ Generated Master Locations Directory at public/locations/index.html!`);

// 3. Generate XML Sitemaps
// A. public/sitemap-main.xml
// NOTE: /services, /about, /contact, /gallery are client-side-only routes (hash-based,
// see src/App.jsx) with no matching static file — a direct/crawler request to those paths
// gets a real HTTP 404 from GitHub Pages, so they must NOT be submitted as indexable URLs.
const mainPages = [
  { url: `${DOMAIN}/`, priority: '1.0', changefreq: 'daily', lastmod: CURRENT_DATE },
  { url: `${DOMAIN}/locations/`, priority: '0.9', changefreq: 'weekly', lastmod: CURRENT_DATE }
];

const sitemapMainXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mainPages
  .map(
    (p) => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
fs.writeFileSync(path.resolve(PUBLIC_DIR, 'sitemap-main.xml'), sitemapMainXml, 'utf-8');

// B. public/sitemap-locations.xml — lastmod per location comes from resolveLastmod()
// above (same hash-cached date as the comprehensive sitemap below), not a blanket "today".
const sitemapLocationsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/locations/</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
${LOCATIONS.map(
  (l) => `  <url>
    <loc>${DOMAIN}/locations/${l.slug}/</loc>
    <lastmod>${lastmodBySlug[l.slug] || CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`
).join('\n')}
</urlset>`;
fs.writeFileSync(path.resolve(PUBLIC_DIR, 'sitemap-locations.xml'), sitemapLocationsXml, 'utf-8');

// C. public/sitemap.xml (Comprehensive Multi-URL Sitemap including all main + 32 location URLs)
// Having all URLs directly in sitemap.xml ensures instant GSC parsing without requiring nested traversal,
// while also generating sitemap-main.xml and sitemap-locations.xml for segmented tracking!
const allPages = [
  ...mainPages,
  ...LOCATIONS.map((l) => ({
    url: `${DOMAIN}/locations/${l.slug}/`,
    priority: '0.85',
    changefreq: 'weekly',
    lastmod: lastmodBySlug[l.slug] || CURRENT_DATE
  }))
];

const sitemapComprehensiveXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (p) => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
fs.writeFileSync(path.resolve(PUBLIC_DIR, 'sitemap.xml'), sitemapComprehensiveXml, 'utf-8');

fs.writeFileSync(LASTMOD_CACHE_PATH, JSON.stringify(lastmodCache, null, 2) + '\n', 'utf-8');

console.log(`✅ Generated Sitemaps:`);
console.log(`   - public/sitemap.xml (${allPages.length} URLs)`);
console.log(`   - public/sitemap-main.xml (${mainPages.length} URLs)`);
console.log(`   - public/sitemap-locations.xml (${LOCATIONS.length + 1} URLs)`);
console.log(`🎉 Programmatic Local SEO generation finished successfully!`);
