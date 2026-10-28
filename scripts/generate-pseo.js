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

// Load Official 84-Item Price List
const PRICE_LIST_PATH = path.resolve(ROOT_DIR, 'content', 'price-list.json');
const PRICE_LIST = JSON.parse(fs.readFileSync(PRICE_LIST_PATH, 'utf-8'));

const ALL_RATE_ITEMS = [
  ...PRICE_LIST.laundryServices.map((i) => ({ ...i, cat: 'laundry', catLabel: '🧺 Laundry by Kg', item: i.name })),
  ...PRICE_LIST.mensDryCleaning.map((i) => ({ ...i, cat: 'mens', catLabel: "👔 Men's Wear" })),
  ...PRICE_LIST.womensDryCleaning.map((i) => ({ ...i, cat: 'womens', catLabel: "👗 Women's Wear" })),
  ...PRICE_LIST.householdDryCleaning.map((i) => ({ ...i, cat: 'household', catLabel: '🏠 Household & Linens' })),
  ...PRICE_LIST.woolenDryCleaning.map((i) => ({ ...i, cat: 'woolen', catLabel: '🧥 Woolen Wear' })),
  ...PRICE_LIST.shoeLaundry.map((i) => ({ ...i, cat: 'shoes', catLabel: '👟 Shoe Laundry' }))
];

// Same GTM container as main site
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

if (fs.existsSync(LOCATIONS_DIR)) {
  fs.rmSync(LOCATIONS_DIR, { recursive: true, force: true });
}
fs.mkdirSync(LOCATIONS_DIR, { recursive: true });

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

function renderRateCards(loc) {
  return ALL_RATE_ITEMS.map((item) => {
    const waText = encodeURIComponent(`Hi Mr & Mrs Laundry, I would like to book doorstep pickup for ${item.item} (${item.rate}) in ${loc.name} (${loc.pincode})`);
    const waItemUrl = `https://wa.me/${PHONE_CLEAN}?text=${waText}`;
    const cleanItemName = item.item.replace(/'/g, "\\'");

    return `
      <div class="rate-item-card" data-cat="${item.cat}" data-name="${item.item.toLowerCase()}">
        <div class="card-top">
          <span class="cat-pill cat-${item.cat}">${item.catLabel}</span>
          <div class="item-rate">${item.rate}</div>
        </div>
        <div class="item-title">${item.item}</div>
        ${item.note ? `<div class="item-note">${item.note}</div>` : ''}
        <div class="card-actions">
          <a href="${waItemUrl}" target="_blank" rel="noopener noreferrer" class="card-wa-btn">
            💬 WhatsApp
          </a>
          <button type="button" class="card-book-btn" onclick="openConciergeModalWithService('${cleanItemName} (${item.rate})')">
            ⚡ Book (30s)
          </button>
        </div>
      </div>`;
  }).join('\n');
}

console.log(`🚀 Starting Programmatic Local SEO (pSEO) generation for ${LOCATIONS.length} Mumbai micro-markets...`);

// 1. Generate Individual Location Pages
LOCATIONS.forEach((loc) => {
  const locDir = path.resolve(LOCATIONS_DIR, loc.slug);
  if (!fs.existsSync(locDir)) {
    fs.mkdirSync(locDir, { recursive: true });
  }

  const nearbyLocations = LOCATIONS
    .filter((l) => l.slug !== loc.slug && l.region === loc.region)
    .slice(0, 6);
  if (nearbyLocations.length < 5) {
    const extra = LOCATIONS.filter((l) => l.slug !== loc.slug && !nearbyLocations.includes(l)).slice(0, 6 - nearbyLocations.length);
    nearbyLocations.push(...extra);
  }

  const pageTitle = `Best Laundry & Dry Clean in ${loc.name} | Wash & Fold ₹99/Kg | Mr & Mrs Laundry`;
  const metaDesc = `Doorstep laundry & dry cleaning in ${loc.name}, Mumbai (${loc.pincode}). 100% individual drums, ₹99/Kg wash & fold, Italian steam iron & 24h express delivery. Book online or WhatsApp +91 9152233822!`;
  const canonicalUrl = `${DOMAIN}/locations/${loc.slug}/`;
  const waUrl = `https://wa.me/${PHONE_CLEAN}?text=${encodeURIComponent(`Hi Mr & Mrs Laundry, I would like to book a laundry pickup in ${loc.name} (${loc.pincode})`)}`;

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
          name: `Official Laundry & Dry Cleaning Rates in ${loc.name}`,
          itemListElement: ALL_RATE_ITEMS.map((it) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: `${it.item} (${loc.name})`,
              description: it.note || `Professional ${it.catLabel} service with free doorstep pickup in ${loc.name}.`
            },
            price: String(it.rateNum),
            priceCurrency: 'INR'
          }))
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
              text: 'Our Wash & Fold service starts at just ₹99/Kg, and Wash & Steam Iron is ₹159/Kg. Steam Ironing alone is ₹99/Kg. All garments are washed in dedicated individual drums with hospital-grade sanitization.'
            }
          },
          {
            '@type': 'Question',
            name: `What landmarks in ${loc.name} do you cover?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `We cover all major landmarks across ${loc.name} including ${loc.landmarks.join(', ')} and surrounding residential societies.`
            }
          },
          {
            '@type': 'Question',
            name: `What are your pickup timings for ${loc.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `We operate two daily shifts in ${loc.name}: ${loc.pickupSlots.join(' and ')}. Express 24-hour turnaround is also available upon request.`
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

    <!-- Structured Data (JSON-LD) -->
    <script type="application/ld+json">
${jsonLdScript}
    </script>

    <style>
      :root {
        --bg-main: #050811;
        --bg-card: rgba(14, 20, 32, 0.85);
        --border-color: rgba(255, 255, 255, 0.08);
        --accent-blue: #0071e3;
        --accent-cyan: #38bdf8;
        --accent-green: #10b981;
        --text-white: #f8fafc;
        --text-muted: #94a3b8;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background-color: var(--bg-main);
        background-image: radial-gradient(ellipse 100% 60% at 50% -10%, rgba(37, 99, 235, 0.2), transparent 75%);
        color: var(--text-white);
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        padding-bottom: 90px;
        -webkit-font-smoothing: antialiased;
      }
      a { color: var(--accent-cyan); text-decoration: none; }
      a:hover { text-decoration: underline; }
      .container { max-width: 1120px; margin: 0 auto; padding: 0 20px; }

      /* Header */
      header {
        background: rgba(5, 8, 17, 0.85);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
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
        border-radius: 9999px;
        font-weight: 700;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
      }
      .btn-primary { background: linear-gradient(135deg, #0071e3 0%, #2563eb 100%); color: #fff; box-shadow: 0 2px 12px rgba(37, 99, 235, 0.35); }
      .btn-primary:hover { transform: scale(1.02); text-decoration: none; }
      .btn-whatsapp { background: #16a34a; color: #fff; box-shadow: 0 2px 10px rgba(22, 163, 74, 0.35); }
      .btn-whatsapp:hover { background: #15803d; transform: scale(1.02); text-decoration: none; }
      .btn-outline { background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-color); color: var(--text-white); }
      .btn-outline:hover { background: rgba(255, 255, 255, 0.1); text-decoration: none; }

      /* Breadcrumbs */
      .breadcrumbs { padding: 18px 0 0 0; font-size: 0.85rem; color: var(--text-muted); }
      .breadcrumbs a { color: var(--text-muted); }
      .breadcrumbs a:hover { color: var(--accent-cyan); }

      /* Hero */
      .hero { padding: 36px 0 28px 0; }
      .badge-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
      .badge {
        display: inline-flex;
        align-items: center;
        padding: 5px 14px;
        background: rgba(56, 189, 248, 0.1);
        border: 1px solid rgba(56, 189, 248, 0.25);
        color: var(--accent-cyan);
        border-radius: 9999px;
        font-size: 0.82rem;
        font-weight: 700;
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
        background: linear-gradient(135deg, #ffffff 50%, #94a3b8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .hero-desc { font-size: 1.08rem; color: var(--text-muted); max-width: 840px; margin-bottom: 24px; line-height: 1.6; }
      .hero-ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 36px; }
      .hero-ctas .btn { padding: 12px 24px; font-size: 0.95rem; }

      /* Local Logistics Info Box */
      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        gap: 16px;
        margin-bottom: 48px;
      }
      .info-card {
        background: var(--bg-card);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid var(--border-color);
        border-radius: 14px;
        padding: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }
      .info-label { font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-cyan); font-weight: 800; margin-bottom: 6px; }
      .info-val { font-size: 1.02rem; font-weight: 700; color: #fff; }

      /* ======================================================== */
      /* Interactive Rates Section (All 84 Items)                */
      /* ======================================================== */
      .rates-section {
        margin: 48px 0 64px 0;
        position: relative;
      }
      .rates-header-wrap {
        text-align: center;
        max-width: 820px;
        margin: 0 auto 32px auto;
      }
      .rates-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 14px;
        background: rgba(56, 189, 248, 0.12);
        border: 1px solid rgba(56, 189, 248, 0.3);
        border-radius: 9999px;
        color: var(--accent-cyan);
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        margin-bottom: 12px;
      }
      .section-title { font-family: 'Sora', sans-serif; font-size: 1.95rem; font-weight: 800; margin-bottom: 12px; color: #fff; }
      .section-subtitle { color: var(--text-muted); font-size: 1rem; margin-bottom: 16px; }
      .delivery-perk-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.28);
        border-radius: 9999px;
        padding: 8px 18px;
        color: #34d399;
        font-size: 0.88rem;
        font-weight: 600;
        margin-top: 10px;
      }
      .perk-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #34d399;
        box-shadow: 0 0 8px #34d399;
        display: inline-block;
      }

      /* Search & Filters Controls */
      .rates-controls {
        background: rgba(15, 23, 42, 0.7);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 18px;
        padding: 16px;
        margin-bottom: 24px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
      }
      .rate-search-wrap {
        position: relative;
        width: 100%;
      }
      .rate-search-wrap .search-icon {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1rem;
        color: #94a3b8;
        pointer-events: none;
      }
      .rate-search-input {
        width: 100%;
        background: rgba(8, 12, 22, 0.9);
        border: 1px solid rgba(56, 189, 248, 0.25);
        border-radius: 12px;
        padding: 12px 42px 12px 46px;
        color: #fff;
        font-size: 0.95rem;
        font-family: inherit;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      .rate-search-input:focus {
        border-color: var(--accent-cyan);
        box-shadow: 0 0 16px rgba(56, 189, 248, 0.25);
      }
      .rate-search-clear {
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        color: #94a3b8;
        font-size: 1.1rem;
        cursor: pointer;
        padding: 4px;
      }

      /* Category Tabs Scroll */
      .rate-tabs-scroll {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding-bottom: 4px;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
      }
      .rate-tabs-scroll::-webkit-scrollbar { display: none; }
      .rate-tab-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 9999px;
        padding: 8px 16px;
        color: #cbd5e1;
        font-size: 0.85rem;
        font-weight: 700;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s ease;
      }
      .rate-tab-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
      }
      .rate-tab-btn.active {
        background: linear-gradient(135deg, #0071e3 0%, #2563eb 100%);
        border-color: #38bdf8;
        color: #ffffff;
        box-shadow: 0 2px 12px rgba(37, 99, 235, 0.4);
      }

      /* Results Meta */
      .rate-results-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding: 0 4px;
        font-size: 0.85rem;
        color: #94a3b8;
      }

      /* Rate Cards Grid */
      .rate-cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 14px;
      }
      .rate-item-card {
        background: var(--bg-card);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid var(--border-color);
        border-radius: 14px;
        padding: 18px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
      }
      .rate-item-card:hover {
        transform: translateY(-3px);
        border-color: rgba(56, 189, 248, 0.35);
        box-shadow: 0 10px 24px -4px rgba(0, 0, 0, 0.5), 0 0 16px rgba(37, 99, 235, 0.15);
      }
      .card-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      .cat-pill {
        font-size: 0.72rem;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.06);
        color: #94a3b8;
      }
      .cat-laundry { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
      .cat-mens { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
      .cat-womens { background: rgba(236, 72, 153, 0.15); color: #f472b6; }
      .cat-household { background: rgba(168, 85, 247, 0.15); color: #c084fc; }
      .cat-woolen { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
      .cat-shoes { background: rgba(16, 185, 129, 0.15); color: #34d399; }

      .item-rate {
        font-family: 'Sora', sans-serif;
        font-size: 1.3rem;
        font-weight: 800;
        color: #38bdf8;
      }
      .item-title {
        font-size: 1rem;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 6px;
        line-height: 1.35;
      }
      .item-note {
        font-size: 0.78rem;
        color: #94a3b8;
        margin-bottom: 12px;
        line-height: 1.4;
      }
      .card-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
      }
      .card-wa-btn {
        background: #16a34a;
        color: #fff !important;
        font-size: 0.78rem;
        font-weight: 700;
        padding: 8px 6px;
        border-radius: 8px;
        text-align: center;
        text-decoration: none !important;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        transition: transform 0.15s, background 0.15s;
      }
      .card-wa-btn:hover {
        background: #15803d;
        transform: scale(1.02);
      }
      .card-book-btn {
        background: linear-gradient(135deg, #0071e3 0%, #2563eb 100%);
        color: #fff;
        border: none;
        font-size: 0.78rem;
        font-weight: 700;
        padding: 8px 6px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        transition: transform 0.15s;
      }
      .card-book-btn:hover {
        transform: scale(1.02);
      }

      .no-results-card {
        grid-column: 1 / -1;
        background: rgba(15, 23, 42, 0.6);
        border: 1px dashed rgba(255, 255, 255, 0.15);
        border-radius: 16px;
        padding: 36px 20px;
        text-align: center;
        color: #cbd5e1;
      }

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
        padding: 24px;
        margin-bottom: 48px;
      }
      .landmarks-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
      .landmark-pill {
        background: #131b2e;
        border: 1px solid #1f2c45;
        color: #cbd5e1;
        font-size: 0.82rem;
        padding: 6px 14px;
        border-radius: 9999px;
      }

      /* FAQs */
      .faq-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 48px; }
      details {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 16px 20px;
        cursor: pointer;
      }
      details[open] { border-color: rgba(56, 189, 248, 0.4); }
      summary { font-weight: 700; font-size: 1rem; color: #f1f5f9; outline: none; }
      details p { margin-top: 12px; font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; }

      /* Nearby Neighborhoods */
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

      /* Floating VisionOS Concierge Island */
      .concierge-island {
        position: fixed;
        bottom: calc(24px + env(safe-area-inset-bottom, 0px));
        right: calc(24px + env(safe-area-inset-right, 0px));
        z-index: 900;
        background: rgba(10, 14, 23, 0.92);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 9999px;
        padding: 4px 5px 4px 12px;
        box-shadow: 0 12px 32px -4px rgba(0, 0, 0, 0.75), 0 0 20px -2px rgba(37, 99, 235, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        display: inline-flex;
        align-items: center;
        gap: 7px;
        user-select: none;
      }
      .island-status {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding-right: 4px;
        cursor: pointer;
        height: 32px;
      }
      .status-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #34d399;
        box-shadow: 0 0 8px #34d399;
        display: inline-block;
        flex-shrink: 0;
        transition: background 0.3s ease, box-shadow 0.3s ease;
      }
      .status-carousel-wrap {
        position: relative;
        height: 20px;
        min-width: 158px;
        overflow: hidden;
        display: flex;
        align-items: center;
      }
      .status-text {
        font-size: 0.78rem;
        font-weight: 700;
        line-height: 20px;
        color: #f8fafc;
        letter-spacing: 0.01em;
        white-space: nowrap;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        transition: opacity 0.25s ease, transform 0.25s ease, filter 0.25s ease;
      }
      .island-divider {
        width: 1px;
        height: 14px;
        background: rgba(255, 255, 255, 0.16);
        flex-shrink: 0;
      }
      .island-wa-btn {
        background: #16a34a;
        color: #ffffff !important;
        border: none;
        border-radius: 9999px;
        height: 32px;
        padding: 0 13px;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 0.80rem;
        font-weight: 700;
        line-height: 32px;
        cursor: pointer;
        text-decoration: none !important;
        box-shadow: 0 2px 8px rgba(22, 163, 74, 0.35);
        transition: transform 0.2s;
        flex-shrink: 0;
      }
      .island-wa-btn:hover { transform: scale(1.04); }
      .island-book-btn {
        background: linear-gradient(135deg, #0071e3 0%, #2563eb 100%);
        color: #ffffff;
        border: none;
        border-radius: 9999px;
        height: 32px;
        padding: 0 14px;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 0.80rem;
        font-weight: 700;
        line-height: 32px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(37, 99, 235, 0.45);
        transition: transform 0.2s;
        flex-shrink: 0;
      }
      .island-book-btn:hover { transform: scale(1.04); }

      /* Concierge Modal Backdrop & Card */
      .concierge-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 999;
        background: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }
      .concierge-modal-card {
        background: rgba(10, 14, 23, 0.95);
        border: 1px solid rgba(56, 189, 248, 0.35);
        border-radius: 20px;
        max-width: 360px;
        width: 100%;
        padding: 22px;
        box-shadow: 0 20px 48px rgba(0, 0, 0, 0.85);
        animation: modalPop 0.25s ease-out;
      }
      @keyframes modalPop {
        from { opacity: 0; transform: scale(0.92); }
        to { opacity: 1; transform: scale(1); }
      }
      .modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
      .modal-close-btn { background: transparent; border: none; color: #94a3b8; font-size: 1.4rem; cursor: pointer; }
      .c-input {
        width: 100%;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 10px;
        padding: 10px 14px;
        color: #fff;
        font-size: 0.88rem;
        outline: none;
      }
      .c-input:focus { border-color: var(--accent-cyan); }
      .c-service-pill {
        display: flex;
        align-items: center;
        gap: 6px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 8px 10px;
        font-size: 0.75rem;
        cursor: pointer;
        color: #cbd5e1;
      }
      .c-submit-btn {
        width: 100%;
        background: linear-gradient(135deg, #16a34a 0%, #2563eb 100%);
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 12px;
        font-size: 0.92rem;
        font-weight: 800;
        cursor: pointer;
        margin-top: 10px;
        box-shadow: 0 4px 16px rgba(37, 99, 235, 0.45);
      }

      /* Footer */
      footer { border-top: 1px solid var(--border-color); padding: 36px 0 90px 0; font-size: 0.85rem; color: var(--text-muted); text-align: center; }

      @media (max-width: 640px) {
        .concierge-island {
          bottom: calc(16px + env(safe-area-inset-bottom, 0px));
          left: 50%;
          right: auto;
          transform: translateX(-50%);
          width: max-content;
          max-width: calc(100vw - 24px);
          padding: 4px 5px 4px 10px;
          gap: 6px;
        }
        .island-status {
          gap: 5px;
          padding-right: 2px;
          height: 32px;
        }
        .status-carousel-wrap {
          min-width: 106px;
          height: 20px;
        }
        .status-text {
          font-size: 0.72rem;
          line-height: 20px;
        }
        .island-wa-btn {
          height: 32px;
          padding: 0 10px;
          font-size: 0.75rem;
          line-height: 32px;
        }
        .island-book-btn {
          height: 32px;
          padding: 0 11px;
          font-size: 0.75rem;
          line-height: 32px;
        }
        .rates-controls {
          padding: 12px;
        }
        .rate-cards-grid {
          grid-template-columns: 1fr;
        }
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
        <h1>#1 Doorstep Laundry &amp; Dry Cleaning in ${loc.name}, Mumbai</h1>
        <p class="hero-desc">
          ${loc.intro} We pick up from your doorstep in ${loc.name}, sanitize garments in dedicated individual machines with eco-friendly detergents, and return fresh, wrinkle-free clothes within 24 to 48 hours.
        </p>
        <div class="hero-ctas">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">💬 Book Doorstep Pickup in ${loc.name}</a>
          <a href="tel:${PHONE_CLEAN}" class="btn btn-primary">📞 Call ${PHONE_NUMBER}</a>
          <a href="#rates" class="btn btn-outline">📋 View Official Rate Card (84 Items)</a>
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
          <div class="info-val" style="font-size: 0.9rem;">${loc.pickupSlots.join(' &bull; ')}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Delivery Guarantee</div>
          <div class="info-val" style="color: #34d399;">Free Doorstep Pickup (₹399+)</div>
        </div>
      </section>

      <!-- ======================================================== -->
      <!-- Interactive Rate Card Section (Official 84-Item Tariff) -->
      <!-- ======================================================== -->
      <section id="rates" class="rates-section">
        <div class="rates-header-wrap">
          <div class="rates-badge">Official Mumbai Rate Card</div>
          <h2 class="section-title">Transparent Laundry &amp; Dry Cleaning Rates in ${loc.name}</h2>
          <p class="section-subtitle">Zero hidden costs. 100% individual drums, hospital-grade sanitized wash, and Italian steam iron.</p>
          
          <div class="delivery-perk-pill">
            <span class="perk-dot"></span>
            <span>⚡ Minimum order <strong>₹399</strong> for <strong>100% FREE Doorstep Pickup &amp; Delivery</strong> in ${loc.name} (${loc.pincode})</span>
          </div>
        </div>

        <!-- Search & Category Filters -->
        <div class="rates-controls">
          <!-- Live Instant Search -->
          <div class="rate-search-wrap">
            <span class="search-icon">🔍</span>
            <input type="text" id="rate-search-input" class="rate-search-input" placeholder="Search any item (e.g. Saree, Blazer, Blanket, Shoes, Kurta, Curtain)..." oninput="filterRateItems(this.value)" />
            <button type="button" id="rate-search-clear" class="rate-search-clear" onclick="clearRateSearch()" style="display: none;">✕</button>
          </div>

          <!-- Category Tabs -->
          <div class="rate-tabs-scroll">
            <button class="rate-tab-btn active" data-cat="all" onclick="setRateTab('all')">✨ All Items (84)</button>
            <button class="rate-tab-btn" data-cat="laundry" onclick="setRateTab('laundry')">🧺 Laundry by Kg (6)</button>
            <button class="rate-tab-btn" data-cat="mens" onclick="setRateTab('mens')">👔 Men's Wear (21)</button>
            <button class="rate-tab-btn" data-cat="womens" onclick="setRateTab('womens')">👗 Women's Wear (21)</button>
            <button class="rate-tab-btn" data-cat="household" onclick="setRateTab('household')">🏠 Household &amp; Curtains (20)</button>
            <button class="rate-tab-btn" data-cat="woolen" onclick="setRateTab('woolen')">🧥 Woolen &amp; Quilts (12)</button>
            <button class="rate-tab-btn" data-cat="shoes" onclick="setRateTab('shoes')">👟 Shoe Spa (4)</button>
          </div>
        </div>

        <!-- Results Counter -->
        <div class="rate-results-meta">
          <span id="rate-results-count">Showing all 84 items across official tariff</span>
        </div>

        <!-- 84 Rate Cards Grid -->
        <div id="rate-cards-grid" class="rate-cards-grid">
          ${renderRateCards(loc)}
          <div id="rate-no-results" class="no-results-card" style="display: none;">
            <div style="font-size: 2rem; margin-bottom: 8px;">🧺</div>
            <div style="font-weight: 700; font-size: 1.1rem; color: #fff; margin-bottom: 6px;">No exact item found</div>
            <p style="font-size: 0.88rem; color: #94a3b8; max-width: 440px; margin: 0 auto 16px auto;">
              We clean almost every garment and fabric! Message our team on WhatsApp for an instant custom rate for ${loc.name}.
            </p>
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
              💬 Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <!-- Key Landmarks & Societies -->
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
            <p>Our Wash &amp; Fold service starts at just ₹99/Kg, and Wash &amp; Steam Iron is ₹159/Kg. Steam Ironing alone is ₹99/Kg. All garments receive 100% individual drum wash with premium hospital-grade sanitization.</p>
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

    <!-- Floating VisionOS Concierge Island -->
    <div id="concierge-island" class="concierge-island">
      <div class="island-status" onclick="openConciergeModal()" title="Click to book express pickup">
        <span class="status-dot" id="island-status-dot"></span>
        <div class="status-carousel-wrap">
          <span class="status-text" id="island-status-carousel">Pickup Slots Open Today</span>
        </div>
      </div>
      <span class="island-divider"></span>
      <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="island-wa-btn" id="island-wa-link">
        💬 WhatsApp
      </a>
      <button type="button" class="island-book-btn" onclick="openConciergeModal()">
        ⚡ Book (30s)
      </button>
    </div>

    <!-- Express Concierge Modal -->
    <div id="concierge-modal" class="concierge-modal-backdrop" style="display: none;" onclick="closeConciergeModal(event)">
      <div class="concierge-modal-card" onclick="event.stopPropagation()">
        <div class="modal-head">
          <div>
            <h3 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #fff;">Fast Doorstep Pickup</h3>
            <p style="margin: 2px 0 0 0; font-size: 0.78rem; color: #94a3b8;">${loc.name} (${loc.pincode}) &bull; Free pickup ₹399+</p>
          </div>
          <button class="modal-close-btn" onclick="closeConciergeModal()">&times;</button>
        </div>
        <form onsubmit="handleConciergeSubmit(event)">
          <div style="margin-bottom: 10px;">
            <input type="text" id="c-name" placeholder="Your Name (e.g. Rahul S.)" class="c-input" />
          </div>
          <div style="margin-bottom: 12px;">
            <input type="tel" id="c-phone" required placeholder="Mobile Number (e.g. 98200 12345) *" class="c-input" />
          </div>
          <div style="margin-bottom: 12px;">
            <div style="font-size: 0.74rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">Selected Service:</div>
            <div id="c-service-options" style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <label class="c-service-pill"><input type="radio" name="c-service" value="Wash & Fold Wearable (₹99/Kg)" checked /> <span>Wash &amp; Fold (₹99/Kg)</span></label>
              <label class="c-service-pill"><input type="radio" name="c-service" value="Wash & Iron (₹159/Kg)" /> <span>Wash &amp; Iron (₹159/Kg)</span></label>
              <label class="c-service-pill"><input type="radio" name="c-service" value="Stream Iron (₹99/Kg)" /> <span>Stream Iron (₹99/Kg)</span></label>
              <label class="c-service-pill"><input type="radio" name="c-service" value="Dry Cleaning (From ₹79)" /> <span>Dry Clean (From ₹79)</span></label>
            </div>
            <div id="c-custom-service-wrap" style="display: none; margin-top: 8px;">
              <input type="text" id="c-custom-service" class="c-input" readonly style="border-color: #38bdf8; background: rgba(56, 189, 248, 0.1); font-weight: 700; color: #38bdf8;" />
            </div>
          </div>
          <button type="submit" class="c-submit-btn">
            ⚡ Confirm Pickup on WhatsApp
          </button>
        </form>
      </div>
    </div>

    <!-- Concierge Interactive Handler & Rate Filters -->
    <script>
      // Rotating Status Carousel (1: Slots, 2: Concierge, 3: Speed)
      (function() {
        var isMobile = window.innerWidth < 640;
        var carouselItems = [
          { text: isMobile ? "Slots Open Today" : "Pickup Slots Open Today", color: "#34d399", glow: "0 0 10px #34d399" },
          { text: isMobile ? "${loc.name} Concierge" : "${loc.name} Concierge Online", color: "#38bdf8", glow: "0 0 10px #38bdf8" },
          { text: isMobile ? "Next Slot: 60m" : "Next Pickup: Within 60 Mins", color: "#fbbf24", glow: "0 0 10px #fbbf24" }
        ];
        var cIdx = 0;
        var sText = document.getElementById('island-status-carousel');
        var sDot = document.getElementById('island-status-dot');
        if (sText) {
          setInterval(function() {
            cIdx = (cIdx + 1) % carouselItems.length;
            sText.style.opacity = '0';
            sText.style.transform = 'translateY(-7px)';
            sText.style.filter = 'blur(2px)';
            setTimeout(function() {
              sText.textContent = carouselItems[cIdx].text;
              if (sDot) {
                sDot.style.background = carouselItems[cIdx].color;
                sDot.style.boxShadow = carouselItems[cIdx].glow;
              }
              sText.style.transform = 'translateY(7px)';
              void sText.offsetWidth;
              sText.style.opacity = '1';
              sText.style.transform = 'translateY(0)';
              sText.style.filter = 'blur(0)';
            }, 250);
          }, 3000);
        }
      })();

      // Interactive Rates Filtering
      var currentRateCategory = 'all';
      var currentSearchQuery = '';

      function setRateTab(cat) {
        currentRateCategory = cat;
        var tabs = document.querySelectorAll('.rate-tab-btn');
        tabs.forEach(function(btn) {
          if (btn.getAttribute('data-cat') === cat) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
        applyRateFilters();
      }

      function filterRateItems(query) {
        currentSearchQuery = (query || '').toLowerCase().trim();
        var clearBtn = document.getElementById('rate-search-clear');
        if (clearBtn) {
          clearBtn.style.display = currentSearchQuery ? 'block' : 'none';
        }
        applyRateFilters();
      }

      function clearRateSearch() {
        var input = document.getElementById('rate-search-input');
        if (input) input.value = '';
        currentSearchQuery = '';
        var clearBtn = document.getElementById('rate-search-clear');
        if (clearBtn) clearBtn.style.display = 'none';
        applyRateFilters();
      }

      function applyRateFilters() {
        var cards = document.querySelectorAll('.rate-item-card');
        var visibleCount = 0;
        cards.forEach(function(card) {
          var cat = card.getAttribute('data-cat');
          var name = card.getAttribute('data-name');
          var matchesCat = (currentRateCategory === 'all' || cat === currentRateCategory);
          var matchesSearch = (!currentSearchQuery || name.indexOf(currentSearchQuery) !== -1 || cat.indexOf(currentSearchQuery) !== -1);

          if (matchesCat && matchesSearch) {
            card.style.display = 'flex';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        var countEl = document.getElementById('rate-results-count');
        if (countEl) {
          countEl.textContent = 'Showing ' + visibleCount + ' items' + (currentRateCategory !== 'all' ? ' in selected category' : '') + (currentSearchQuery ? ' matching "' + currentSearchQuery + '"' : '');
        }

        var noRes = document.getElementById('rate-no-results');
        if (noRes) {
          noRes.style.display = visibleCount === 0 ? 'block' : 'none';
        }
      }

      function openConciergeModal() {
        var customWrap = document.getElementById('c-custom-service-wrap');
        if (customWrap) customWrap.style.display = 'none';
        document.getElementById('concierge-modal').style.display = 'flex';
        if (window.dataLayer) window.dataLayer.push({ event: 'booking_modal_opened', source: 'location_concierge_island', locality: '${loc.name}' });
      }

      function openConciergeModalWithService(serviceName) {
        var customWrap = document.getElementById('c-custom-service-wrap');
        var customInput = document.getElementById('c-custom-service');
        if (customWrap && customInput) {
          customInput.value = serviceName;
          customWrap.style.display = 'block';
        }
        document.getElementById('concierge-modal').style.display = 'flex';
        if (window.dataLayer) {
          window.dataLayer.push({ event: 'booking_modal_opened', service: serviceName, source: 'rate_card_click', locality: '${loc.name}' });
        }
      }

      function closeConciergeModal(e) {
        document.getElementById('concierge-modal').style.display = 'none';
      }

      function handleConciergeSubmit(e) {
        e.preventDefault();
        var name = document.getElementById('c-name').value || 'Customer';
        var phone = document.getElementById('c-phone').value;
        if (!phone || phone.length < 10) { alert('Please enter a valid 10-digit mobile number.'); return; }
        
        var customInput = document.getElementById('c-custom-service');
        var customWrap = document.getElementById('c-custom-service-wrap');
        var service = (customWrap && customWrap.style.display !== 'none' && customInput && customInput.value) 
          ? customInput.value 
          : (document.querySelector('input[name="c-service"]:checked') ? document.querySelector('input[name="c-service"]:checked').value : 'Wash & Fold (₹99/Kg)');

        var orderId = 'MML-' + Math.floor(1000 + Math.random() * 9000);

        try {
          var existing = JSON.parse(localStorage.getItem('mml_leads_cache') || '[]');
          existing.unshift({
            id: orderId,
            customerName: name,
            phone: phone,
            locality: '${loc.name}',
            pincode: '${loc.pincode}',
            service: service,
            status: 'New Inquiry',
            createdAt: new Date().toISOString(),
            source: '${loc.name} Location Page'
          });
          localStorage.setItem('mml_leads_cache', JSON.stringify(existing));
        } catch(err) {}

        if (window.dataLayer) {
          window.dataLayer.push({ event: 'booking_confirmed', order_id: orderId, locality: '${loc.name}', service: service, source: 'location_concierge_island' });
          window.dataLayer.push({ event: 'booking_whatsapp_sent', order_id: orderId, locality: '${loc.name}', source: 'location_concierge_island' });
        }

        var text = '*New Mr & Mrs Laundry Express Pickup Request*\\n' +
          '🆔 Order: ' + orderId + '\\n' +
          '👤 Name: ' + name + '\\n' +
          '📞 Phone: ' + phone + '\\n' +
          '📍 Locality: ${loc.name} (${loc.pincode})\\n' +
          '🧺 Service: ' + service + '\\n\\n' +
          'Please confirm earliest doorstep pickup window. Thank you!';

        window.open('https://wa.me/${PHONE_CLEAN}?text=' + encodeURIComponent(text), '_blank');
        closeConciergeModal();
      }
    </script>

    <!-- Footer -->
    <footer>
      <div class="container">
        <p><strong>Mr &amp; Mrs Laundry</strong> — Mumbai’s Trusted Laundry &amp; Dry Cleaning Service Since 2012.</p>
        <p style="margin-top: 6px;">Tardeo Store: Shop no. 3/4, No. 508, Ganjawala Tower, Tardeo, Mumbai - 400034 | Facility: Malad East Eco Hub, Mumbai.</p>
        <p style="margin-top: 6px;">Customer Helpline: <a href="tel:${PHONE_CLEAN}" style="color: var(--accent-cyan);">${PHONE_NUMBER}</a> | Email: <a href="mailto:${EMAIL}" style="color: var(--accent-cyan);">${EMAIL}</a></p>
        <p style="margin-top: 14px; font-size: 0.78rem;">&copy; ${new Date().getFullYear()} Mr &amp; Mrs Laundry. All Rights Reserved.</p>
      </div>
    </footer>
  </body>
</html>`;

  fs.writeFileSync(path.resolve(locDir, 'index.html'), htmlContent, 'utf-8');
  resolveLastmod(loc.slug, htmlContent);
});

console.log(`✅ Generated ${LOCATIONS.length} individual static micro-market location pages with complete 84-item interactive rate cards!`);

// 2. Generate Master Directory Page (/locations/index.html)
const directoryTitle = 'Doorstep Laundry & Dry Cleaning Across Mumbai | 30 Locations | Mr & Mrs Laundry';
const directoryDesc = 'Explore our doorstep laundry & dry cleaning coverage across 30 Mumbai neighborhoods. From Bandra to South Mumbai and Western Suburbs. Free doorstep pickup on ₹399+!';
const directoryCanonical = `${DOMAIN}/locations/`;
const dirJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ItemList',
      '@id': `${directoryCanonical}#list`,
      name: 'Mr & Mrs Laundry Mumbai Service Areas',
      description: directoryDesc,
      numberOfItems: LOCATIONS.length,
      itemListElement: LOCATIONS.map((loc, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: `Laundry & Dry Cleaning in ${loc.name}`,
        url: `${DOMAIN}/locations/${loc.slug}/`
      }))
    }
  ]
};

const directoryHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${gtmHeadSnippet('/locations/')}
    <title>${directoryTitle}</title>
    <meta name="description" content="${directoryDesc}" />
    <link rel="canonical" href="${directoryCanonical}" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />
    <script type="application/ld+json">
${JSON.stringify(dirJsonLd, null, 2).replace(/</g, '\\u003c')}
    </script>
    <style>
      :root {
        --bg-main: #050811;
        --bg-card: rgba(14, 20, 32, 0.85);
        --border-color: rgba(255, 255, 255, 0.08);
        --accent-blue: #0071e3;
        --accent-cyan: #38bdf8;
        --accent-green: #10b981;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background: var(--bg-main) radial-gradient(ellipse 100% 60% at 50% -10%, rgba(37, 99, 235, 0.2), transparent 75%);
        color: #f8fafc;
        font-family: 'Plus Jakarta Sans', sans-serif;
        line-height: 1.6;
        padding-bottom: 60px;
      }
      a { color: var(--accent-cyan); text-decoration: none; }
      .container { max-width: 1120px; margin: 0 auto; padding: 0 20px; }
      header {
        background: rgba(5, 8, 17, 0.85);
        backdrop-filter: blur(16px);
        border-bottom: 1px solid var(--border-color);
        padding: 16px 0;
      }
      .nav-row { display: flex; justify-content: space-between; align-items: center; }
      .brand-title { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 1.25rem; color: #fff; }
      .brand-title span { color: var(--accent-cyan); }
      .hero { padding: 48px 0 24px 0; text-align: center; }
      h1 { font-family: 'Sora', sans-serif; font-size: 2.35rem; font-weight: 800; margin-bottom: 12px; }
      .hero p { color: #94a3b8; max-width: 640px; margin: 0 auto 32px auto; font-size: 1.05rem; }
      .locations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 16px;
        margin-top: 24px;
      }
      .loc-card {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 14px;
        padding: 20px;
        transition: all 0.2s;
        display: block;
      }
      .loc-card:hover {
        transform: translateY(-3px);
        border-color: rgba(56, 189, 248, 0.4);
        box-shadow: 0 10px 24px -4px rgba(0, 0, 0, 0.5);
        text-decoration: none;
      }
      .loc-name { font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
      .loc-pin { font-size: 0.82rem; color: var(--accent-cyan); font-weight: 600; }
      .loc-turn { font-size: 0.78rem; color: #94a3b8; margin-top: 8px; }
      footer { margin-top: 60px; border-top: 1px solid var(--border-color); padding: 32px 0; text-align: center; font-size: 0.85rem; color: #94a3b8; }
    </style>
  </head>
  <body>
    ${GTM_BODY_SNIPPET}
    <header>
      <div class="container nav-row">
        <a href="${DOMAIN}/" class="brand-title"><span>Mr &amp; Mrs</span> Laundry</a>
        <a href="${DOMAIN}/" style="color: #cbd5e1; font-weight: 600; font-size: 0.9rem;">← Back to Home</a>
      </div>
    </header>
    <main class="container">
      <section class="hero">
        <h1>Doorstep Laundry &amp; Dry Cleaning Across Mumbai</h1>
        <p>Select your neighborhood to view dedicated pickup slots, landmark coverage, and the complete 84-item rate card.</p>
      </section>
      <div class="locations-grid">
        ${LOCATIONS.map((loc) => `
          <a href="${DOMAIN}/locations/${loc.slug}/" class="loc-card">
            <div class="loc-name">${loc.name}</div>
            <div class="loc-pin">Pincode: ${loc.pincode} &bull; ${loc.region}</div>
            <div class="loc-turn">⏱ Fast Doorstep Pickup &bull; Free on ₹399+</div>
          </a>
        `).join('')}
      </div>
    </main>
    <footer>
      <div class="container">
        <p>&copy; ${new Date().getFullYear()} Mr &amp; Mrs Laundry. Serving 30 Prime Mumbai Neighborhoods.</p>
      </div>
    </footer>
  </body>
</html>`;

fs.writeFileSync(path.resolve(LOCATIONS_DIR, 'index.html'), directoryHtml, 'utf-8');
resolveLastmod('locations-directory', directoryHtml);
console.log('✅ Generated Master Locations Directory at public/locations/index.html!');

// 3. Save Sitemap
fs.writeFileSync(LASTMOD_CACHE_PATH, JSON.stringify(lastmodCache, null, 2) + '\n', 'utf-8');

const sitemapLocationsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/locations/</loc>
    <lastmod>${lastmodBySlug['locations-directory'] || CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${LOCATIONS.map((loc) => `  <url>
    <loc>${DOMAIN}/locations/${loc.slug}/</loc>
    <lastmod>${lastmodBySlug[loc.slug] || CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.resolve(PUBLIC_DIR, 'sitemap-locations.xml'), sitemapLocationsXml.trim(), 'utf-8');

const sitemapMainXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${DOMAIN}/services</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
`;
fs.writeFileSync(path.resolve(PUBLIC_DIR, 'sitemap-main.xml'), sitemapMainXml.trim(), 'utf-8');

const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemap-main.xml</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-locations.xml</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
  </sitemap>
</sitemapindex>
`;
fs.writeFileSync(path.resolve(PUBLIC_DIR, 'sitemap.xml'), sitemapIndexXml.trim(), 'utf-8');

console.log('✅ Generated Sitemaps successfully!');
console.log('🎉 Programmatic Local SEO generation finished successfully!');
