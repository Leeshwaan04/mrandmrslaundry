import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { LOCATIONS } from './locations-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public');
const COMPARE_DIR = path.resolve(PUBLIC_DIR, 'compare');

const DOMAIN = 'https://mrandmrslaundry.com';
const PHONE_NUMBER = '+91 9152233822';
const PHONE_CLEAN = '919152233822';
const CURRENT_DATE = new Date().toISOString().split('T')[0];
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

export const COMPETITORS = [
  {
    slug: 'tumbledry-alternative-mumbai',
    name: 'Tumbledry',
    fullName: 'Tumbledry India',
    targetKeywords: 'Tumbledry, Tumbledry Mumbai, Tumbledry alternative, Tumbledry pricing, Tumbledry dry cleaning, Tumbledry vs Mr & Mrs Laundry, Tumbledry review Mumbai',
    metaTitle: 'Tumbledry Alternative in Mumbai | Why Choose Mr & Mrs Laundry (2026)',
    metaDescription: 'Looking for a reliable Tumbledry alternative in Mumbai? Compare hygiene standards, 100% individual wash drums, published honest rates (₹99/Kg), and 1-tap WhatsApp booking.',
    badge: 'India-Wide Franchise Model',
    shortSummary: 'Tumbledry operates on an expansive franchise model with 1,000+ stores. While widely known, cleaning quality and turnaround times vary heavily across independent franchisees. Mr & Mrs Laundry offers centralized quality control, 100% individual drums, and direct WhatsApp concierge booking without mandatory app installs.',
    criteria: [
      { feature: 'Wash Drum Hygiene', us: '100% Individual Wash Drums (Zero clothes mixing guaranteed)', them: 'Varies by franchisee; mixed batches common for general loads', winner: 'us' },
      { feature: 'Price Transparency', us: 'Complete 84-item rate card publicly published (Wash & Fold ₹99/Kg)', them: 'Opaque pricing; rates locked behind mobile app registration', winner: 'us' },
      { feature: 'Booking Convenience', us: 'Instant 1-tap WhatsApp or 30-sec web booking (No app download required)', them: 'Mandatory mobile app download required for booking and tracking', winner: 'us' },
      { feature: 'Turnaround Time', us: 'Standard 48 hours | Guaranteed 24-hour Express delivery', them: 'Standard 48–72 hours (subject to store queue)', winner: 'us' },
      { feature: 'Free Doorstep Delivery', us: 'FREE Pickup & Delivery on orders ₹399+', them: 'Free delivery subject to store minimums or subscription packs', winner: 'tie' },
      { feature: 'Dry Cleaning Solvents', us: 'Eco-friendly European hydrocarbons (Safe for silk, zari, merino)', them: 'Lagoon wet cleaning + standard commercial dry clean', winner: 'tie' },
      { feature: 'Value-Added Perks', us: 'Free loose button re-stitching, collar inserts & breathable garment covers', them: 'Minor repairs available upon specific app request', winner: 'us' },
      { feature: 'Quality Consistency', us: 'Owner-operated Mumbai facility since 2012 with 5,000+ verified customers', them: 'Decentralized franchise quality that fluctuates by store location', winner: 'us' },
    ],
    faqs: [
      {
        q: 'Is Mr & Mrs Laundry cheaper than Tumbledry in Mumbai?',
        a: 'Yes. Mr & Mrs Laundry offers honest, upfront pricing starting at ₹99/Kg for Wash & Fold and ₹159/Kg for Wash & Steam Iron, with dry cleaning from ₹79. Tumbledry generally charges higher per-piece rates and requires buying prepaid savings packages to get discounted rates.'
      },
      {
        q: 'Do I need to download an app to book like Tumbledry?',
        a: 'No app download is needed. You can book doorstep pickup in 30 seconds directly via WhatsApp or our instant web scheduler. We coordinate your pickup window and send invoices directly via WhatsApp.'
      },
      {
        q: 'Does Mr & Mrs Laundry wash clothes separately?',
        a: 'Absolutely. We strictly enforce a 100% Individual Hygiene Drum Guarantee. Your clothes are never mixed, washed, or dried with any other customer’s garments, ever.'
      }
    ]
  },
  {
    slug: 'meralaundry-alternative-mumbai',
    name: 'Mera Laundry',
    fullName: 'Mera Laundry Mumbai',
    targetKeywords: 'Mera Laundry, Mera Laundry Mumbai, Mera Laundry price, Mera Laundry alternative, Mera Laundry review, Mera Laundry wash and fold, Mera Laundry Thane',
    metaTitle: 'Mera Laundry Alternative in Mumbai | Premium Garment Care at Honest Rates',
    metaDescription: 'Searching for a Mera Laundry alternative in Mumbai? Compare fabric safety, individual drum hygiene, Italian steam pressing, and zero-shrinkage dry cleaning.',
    badge: 'Budget Mass-Market Model',
    shortSummary: 'Mera Laundry attracts price-conscious customers with budget entry rates (₹69/kg), but high volume often leads to batch washing, fabric wear, and limited expertise in delicate bridal and designer wear. Mr & Mrs Laundry elevates your laundry experience with medical-grade hygiene, Italian steam pressing, and couture fabric care.',
    criteria: [
      { feature: 'Garment Hygiene & Safety', us: 'Strict individual drum wash; zero clothes mixing; color-separated cycles', usDesc: 'Safe for your skin and luxury fabrics', them: 'High-volume batching; risk of cross-contamination and lint transfer', winner: 'us' },
      { feature: 'Steam Press Quality', us: 'Industrial high-pressure Italian vacuum steam tables & master pressers', them: 'Standard commercial steam iron; inconsistent collar and cuff creasing', winner: 'us' },
      { feature: 'Ethnic & Bridal Care', us: 'Specialized low-RPM cycles for heavy Zari sarees, bridal lehengas, sherwanis', them: 'Primarily everyday wash-focused; limited couture dry cleaning expertise', winner: 'us' },
      { feature: 'Packaging Standards', us: 'Moisture-barrier crisp fold-packing & custom hanger shrouds included', them: 'Standard thin poly-wrap bags', winner: 'us' },
      { feature: 'Price & Transparency', us: 'Wash & Fold ₹99/Kg; Full 84-item price list visible upfront', them: 'Wash & Fold starts at ₹69/Kg (frequent surcharges on delicate fabrics)', winner: 'tie' },
      { feature: 'Shoe Spa & Restoration', us: 'Deep sneaker scrub, mid-sole un-yellowing, suede restoration (₹299–₹499)', them: 'Basic surface wash or third-party outsourcing', winner: 'us' },
      { feature: 'Service Coverage', us: '30 prime Mumbai micro-markets (South Mumbai to Borivali & Powai)', them: 'Mumbai & Thane suburban coverage', winner: 'tie' },
    ],
    faqs: [
      {
        q: 'Why pay ₹99/Kg with Mr & Mrs Laundry instead of ₹69/Kg with Mera Laundry?',
        a: 'The ₹30 difference ensures your garments are washed exclusively in their own sanitized machine drum, dried with fabric-conditioner loft restoration, and hand-finished with Italian steam pressing. We never batch your clothes with other households.'
      },
      {
        q: 'Does Mr & Mrs Laundry handle expensive silk sarees and suits?',
        a: 'Yes. Since 2012, we have specialized in designer lehengas, silk sarees, blazers, and luxury woolens using non-toxic European hydrocarbons that preserve embroidery sheen and prevent shrinkage.'
      }
    ]
  },
  {
    slug: 'pressto-alternative-mumbai',
    name: 'Pressto',
    fullName: 'Pressto India',
    targetKeywords: 'Pressto, Pressto India, Pressto Mumbai, Pressto Bandra, Pressto dry cleaners, Pressto alternative, Pressto shoe cleaning, Pressto price list Mumbai',
    metaTitle: 'Pressto Alternative in Mumbai | Luxury European Care at 50% Lower Rates',
    metaDescription: 'Looking for a Pressto alternative in South Mumbai or Bandra? Get the same European hydrocarbon fabric care, couture preservation & shoe spa at 50% lower prices.',
    badge: 'High-Ticket International Luxury',
    shortSummary: 'Pressto is an established international brand catering to high-net-worth clients in Mumbai with premium stores in Bandra, Lower Parel, and Breach Candy. However, their prices are often 2x to 3x higher with opaque quotation models. Mr & Mrs Laundry delivers the exact same European fabric care standards at transparent, honest prices.',
    criteria: [
      { feature: 'Dry Cleaning Chemistry', us: 'European non-toxic hydrocarbons, gentle pH-balanced eco detergents', them: 'Proprietary European solvent dry cleaning', winner: 'tie' },
      { feature: 'Pricing & Value', us: 'Shirts ₹99 | Blazers ₹249 | Sarees ₹199–₹399 (Published rate card)', them: 'Opaque quote model; shirts often ₹250+, suits ₹800–₹1,500+', winner: 'us' },
      { feature: 'Turnaround Time', us: 'Standard 48 hours | 24-hour Express door-to-door available', them: 'Standard 4 to 6 business days for delicate dry cleaning', winner: 'us' },
      { feature: 'Doorstep Pickup Minimum', us: 'FREE Doorstep Pickup & Delivery on ₹399+', them: 'High minimum pickup order thresholds or delivery charges', winner: 'us' },
      { feature: 'Shoe & Sneaker Spa', us: 'Premium Sneaker & Leather Shoe Spa (₹299–₹499/pair)', them: 'High-end shoe cleaning (₹600–₹900/pair)', winner: 'us' },
      { feature: 'Curtain & Home Linens', us: 'Single drapes from ₹14/sq.ft | Bedsheets from ₹129', them: 'Heavy home linens charged at boutique luxury premiums', winner: 'us' },
      { feature: 'Couture & Embroidery Care', us: 'Individual stain pre-spotting & hand-steaming by master pressers', them: 'High-end boutique garment finishing', winner: 'tie' },
    ],
    faqs: [
      {
        q: 'Can Mr & Mrs Laundry match Pressto’s quality for designer clothes?',
        a: 'Yes. We use the same certified eco-friendly hydrocarbon cleaning agents and gentle tumbling cycles that international cloth spas utilize, protecting delicate beadwork, sequins, and natural sheen.'
      },
      {
        q: 'How much can I save switching from Pressto to Mr & Mrs Laundry?',
        a: 'Most Mumbai households save 40% to 60% on their monthly dry cleaning bills without compromising on fabric longevity or doorstep convenience.'
      }
    ]
  },
  {
    slug: 'uclean-alternative-mumbai',
    name: 'UClean',
    fullName: 'UClean Laundromat',
    targetKeywords: 'UClean, UClean Mumbai, UClean alternative, UClean dry cleaning, UClean franchise, UClean vs Mr & Mrs Laundry, UClean Andheri, UClean Powai',
    metaTitle: 'UClean Alternative in Mumbai | White-Glove Doorstep Valet vs Laundromat',
    metaDescription: 'Looking for a UClean alternative in Mumbai? Upgrade from DIY laundromat drop-offs to full white-glove doorstep pickup, Italian steam pressing, and couture care.',
    badge: 'Laundromat & Studio Chain',
    shortSummary: 'UClean operates neighborhood laundromat studios where customers can do self-service laundry or drop off clothes. Mr & Mrs Laundry provides an elevated white-glove doorstep valet service across 30 Mumbai localities, saving you the hassle of carrying laundry bags to storefronts.',
    criteria: [
      { feature: 'Service Experience', us: 'White-glove doorstep valet: We collect, inspect, sanitize, steam press & return', them: 'Primarily storefront drop-off / self-service DIY laundromat focus', winner: 'us' },
      { feature: 'Finishing & Pressing', us: 'High-pressure Italian steam tables with crisp collar and crease detailing', them: 'Basic commercial tumble drying & quick steam press', winner: 'us' },
      { feature: 'Doorstep Convenience', us: 'Dedicated electric vans serving South Mumbai, Western & Central suburbs', them: 'Requires living within immediate walking distance of an outlet', winner: 'us' },
      { feature: 'Luxury & Designer Wear', us: 'Expert dry cleaning for silk, zari, sherwanis, blazers, and woolens', them: 'Best suited for basic casual t-shirts and daily wear', winner: 'us' },
      { feature: 'Pricing', us: 'Wash & Fold ₹99/Kg | Wash & Iron ₹159/Kg', them: 'Variable store-by-store per-kg or per-load pricing', winner: 'tie' },
    ],
    faqs: [
      {
        q: 'Why choose Mr & Mrs Laundry over UClean?',
        a: 'With Mr & Mrs Laundry, you never have to haul heavy laundry bags to a neighborhood studio. Our dedicated pickup team arrives at your door, weighs transparently, and returns your clothes immaculately pressed.'
      }
    ]
  },
  {
    slug: 'dhobilite-alternative-mumbai',
    name: 'DhobiLite',
    fullName: 'DhobiLite Mumbai',
    targetKeywords: 'DhobiLite, DhobiLite Mumbai, DhobiLite alternative, DhobiLite dry clean, DhobiLite app, DhobiLite pricing, DhobiLite vs Mr & Mrs Laundry',
    metaTitle: 'DhobiLite Alternative in Mumbai | Hyper-Local Care & Faster Delivery',
    metaDescription: 'Searching for a DhobiLite alternative in Mumbai? Experience dedicated local Mumbai customer service, transparent rates, and fast 24-hour turnaround.',
    badge: 'App-Driven Regional Operator',
    shortSummary: 'DhobiLite is an app-based laundry chain expanding across metro pockets. While tech-enabled, customer support is often routed through ticket queues and automated bots. Mr & Mrs Laundry gives you a direct, hyper-responsive local Mumbai WhatsApp concierge who knows your neighborhood.',
    criteria: [
      { feature: 'Customer Support', us: 'Direct human concierge on WhatsApp & phone with instant local resolution', them: 'In-app support ticket queue and automated chatbot responses', winner: 'us' },
      { feature: 'Booking Process', us: 'Instant 1-tap WhatsApp or 30-sec web modal (Zero app required)', them: 'Requires downloading mobile app and registering OTP', winner: 'us' },
      { feature: 'Individual Drum Hygiene', us: '100% individual wash drums guaranteed on every load', them: 'Centralized plant processing', winner: 'tie' },
      { feature: 'Pricing Transparency', us: 'Complete 84-item rate card accessible to everyone online', them: 'Rates viewable only after entering pin code and registering', winner: 'us' },
      { feature: 'Turnaround Time', us: 'Standard 48 hours | Guaranteed 24-hour express options', them: 'Standard 48–72 hours', winner: 'us' },
    ],
    faqs: [
      {
        q: 'How does Mr & Mrs Laundry compare to DhobiLite on customer service?',
        a: 'Unlike app aggregators where you speak to automated chatbots, Mr & Mrs Laundry connects you directly with our local Mumbai dispatch team on WhatsApp for instant pickup scheduling and special fabric instructions.'
      }
    ]
  },
  {
    slug: 'spin-n-press-alternative-mumbai',
    name: 'Spin N Press',
    fullName: 'Spin N Press Mumbai',
    targetKeywords: 'Spin N Press, Spin N Press Mumbai, Spin N Press Bandra, Spin N Press alternative, Spin N Press dry cleaners, Spin N Press prices',
    metaTitle: 'Spin N Press Alternative in Mumbai | Boutique Garment Care & Transparent Rates',
    metaDescription: 'Looking for a Spin N Press alternative in Bandra or South Mumbai? Compare our transparent ₹99/Kg rates, European dry cleaning, and citywide doorstep reach.',
    badge: 'Boutique South Mumbai Brand',
    shortSummary: 'Spin N Press is a respected boutique garment care provider popular in South Mumbai and Bandra. Mr & Mrs Laundry matches their boutique standards with certified European solvents while offering broader suburban coverage and transparent per-kg daily laundry pricing.',
    criteria: [
      { feature: 'Everyday Wash & Fold', us: 'Charged transparently by the kilo (₹99/Kg wearable clothes)', them: 'Heavier emphasis on per-piece pricing', winner: 'us' },
      { feature: 'Dry Cleaning Quality', us: 'Eco-friendly hydrocarbon solvents, delicate stain pre-spotting', them: 'High-quality boutique dry cleaning and finishing', winner: 'tie' },
      { feature: 'Citywide Reach', us: 'Serving 30 prime micro-markets from Colaba to Borivali & Powai', them: 'Concentrated primarily in South Mumbai and Bandra', winner: 'us' },
      { feature: 'Free Pickup Threshold', us: 'FREE Doorstep Pickup & Delivery on orders ₹399+', them: 'Higher minimum order thresholds for doorstep delivery', winner: 'us' },
    ],
    faqs: [
      {
        q: 'Can I get boutique dry cleaning for everyday wear as well?',
        a: 'Yes. Mr & Mrs Laundry provides the best of both worlds: boutique couture dry cleaning for your formalwear, combined with affordable ₹99/Kg Wash & Fold for daily t-shirts and linens.'
      }
    ]
  },
  {
    slug: 'fabricspa-alternative-mumbai',
    name: 'Fabricspa',
    fullName: 'Fabricspa Mumbai',
    targetKeywords: 'Fabricspa, Fabricspa Mumbai, Fabricspa dry cleaners, Fabricspa alternative, Fabricspa price list, Fabricspa review',
    metaTitle: 'Fabricspa Alternative in Mumbai | Modern Personalized Garment Care',
    metaDescription: 'Looking for a Fabricspa alternative in Mumbai? Enjoy personalized fabric care, individual drum hygiene, Italian steam finishing, and faster doorstep turnaround.',
    badge: 'Industrial Processing Veteran',
    shortSummary: 'Fabricspa is one of India’s oldest industrial laundry corporations. While their industrial scale is massive, clothes are often routed through mega-plants where individual customer attention and urgent turnaround requests can get lost. Mr & Mrs Laundry provides boutique care with modern digital convenience.',
    criteria: [
      { feature: 'Personalized Garment Care', us: 'Dedicated master pressers inspect every hem, collar, and button', them: 'High-speed industrial conveyor automation', winner: 'us' },
      { feature: 'Hygiene Handling', us: 'Individual drums for each customer; zero clothes mixing', them: 'Industrial batch cycles with chemical sanitizers', winner: 'tie' },
      { feature: 'Speed & Flexibility', us: 'Same-day or next-day 24h express turnaround available', them: 'Rigid industrial plant schedules (typically 4–5 days)', winner: 'us' },
      { feature: 'Digital Booking', us: '1-tap WhatsApp booking + real-time delivery slot coordination', them: 'Traditional phone call or website inquiry form', winner: 'us' },
    ],
    faqs: [
      {
        q: 'What is the main advantage of Mr & Mrs Laundry over Fabricspa?',
        a: 'Personal attention and speed. Because we operate dedicated micro-vans across 30 Mumbai neighborhoods, your clothes are processed with individual care and delivered back in 24–48 hours rather than waiting on industrial plant queues.'
      }
    ]
  }
];

if (fs.existsSync(COMPARE_DIR)) {
  fs.rmSync(COMPARE_DIR, { recursive: true, force: true });
}
fs.mkdirSync(COMPARE_DIR, { recursive: true });

console.log(`🚀 Generating Comparison SEO Pages for ${COMPETITORS.length} competitors...`);

COMPETITORS.forEach((comp) => {
  const compDir = path.resolve(COMPARE_DIR, comp.slug);
  fs.mkdirSync(compDir, { recursive: true });

  const canonicalUrl = `${DOMAIN}/compare/${comp.slug}/`;

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': canonicalUrl,
        url: canonicalUrl,
        name: comp.metaTitle,
        description: comp.metaDescription,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${DOMAIN}/#website`,
          url: DOMAIN,
          name: 'Mr & Mrs Laundry'
        }
      },
      {
        '@type': 'LocalBusiness',
        name: 'Mr & Mrs Laundry Mumbai',
        image: `${DOMAIN}/favicon-192x192.png`,
        telephone: PHONE_NUMBER,
        priceRange: '₹79 - ₹699',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Shop 4, Ground Floor, Tardeo Road',
          addressLocality: 'Mumbai',
          addressRegion: 'Maharashtra',
          postalCode: '400034',
          addressCountry: 'IN'
        }
      },
      {
        '@type': 'FAQPage',
        mainEntity: comp.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a
          }
        }))
      }
    ]
  };

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${gtmHeadSnippet(`/compare/${comp.slug}/`)}

    <title>${comp.metaTitle}</title>
    <meta name="description" content="${comp.metaDescription}" />
    <meta name="keywords" content="${comp.targetKeywords}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonicalUrl}" />

    <!-- Open Graph -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="Mr & Mrs Laundry" />
    <meta property="og:title" content="${comp.metaTitle}" />
    <meta property="og:description" content="${comp.metaDescription}" />
    <meta property="og:image" content="${DOMAIN}/favicon-192x192.png" />
    <meta property="og:locale" content="en_IN" />

    <!-- Fonts & Icons -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />

    <script type="application/ld+json">
${JSON.stringify(jsonLdGraph, null, 2).replace(/</g, '\\u003c')}
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
        background-image: radial-gradient(ellipse 100% 60% at 50% -10%, rgba(37, 99, 235, 0.18), transparent 75%);
        color: var(--text-white);
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        line-height: 1.6;
        padding-bottom: 90px;
        -webkit-font-smoothing: antialiased;
      }
      a { color: var(--accent-cyan); text-decoration: none; }
      a:hover { text-decoration: underline; }
      .container { max-width: 1080px; margin: 0 auto; padding: 0 20px; }

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

      .hero {
        padding: 56px 0 36px 0;
        text-align: center;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 16px;
        background: rgba(56, 189, 248, 0.12);
        border: 1px solid rgba(56, 189, 248, 0.3);
        border-radius: 999px;
        font-size: 0.82rem;
        color: var(--accent-cyan);
        font-weight: 600;
        margin-bottom: 20px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      h1 {
        font-family: 'Sora', sans-serif;
        font-size: clamp(2rem, 4.5vw, 3.2rem);
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1.2;
        margin-bottom: 18px;
        background: linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .hero-sub {
        font-size: 1.1rem;
        color: var(--text-muted);
        max-width: 780px;
        margin: 0 auto 32px auto;
        line-height: 1.65;
      }

      .cta-bar {
        display: flex;
        gap: 14px;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 48px;
      }
      .btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #0071e3 0%, #0284c7 100%);
        color: #fff;
        padding: 14px 28px;
        border-radius: 999px;
        font-weight: 700;
        font-size: 0.95rem;
        box-shadow: 0 8px 25px rgba(0, 113, 227, 0.35);
        border: none;
        cursor: pointer;
        text-decoration: none;
      }
      .btn-wa {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(37, 211, 102, 0.15);
        color: #25d366;
        border: 1px solid rgba(37, 211, 102, 0.4);
        padding: 14px 28px;
        border-radius: 999px;
        font-weight: 700;
        font-size: 0.95rem;
        cursor: pointer;
        text-decoration: none;
      }

      /* Comparison Table */
      .table-card {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 24px;
        overflow: hidden;
        backdrop-filter: blur(16px);
        margin-bottom: 50px;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.4);
      }
      .table-header {
        display: grid;
        grid-template-columns: 1.2fr 1.5fr 1.5fr;
        padding: 20px 24px;
        background: rgba(255, 255, 255, 0.04);
        border-bottom: 1px solid var(--border-color);
        font-weight: 800;
        font-size: 0.95rem;
      }
      .table-row {
        display: grid;
        grid-template-columns: 1.2fr 1.5fr 1.5fr;
        padding: 18px 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        align-items: center;
        font-size: 0.9rem;
      }
      .table-row:last-child { border-bottom: none; }
      .param-col { font-weight: 600; color: #fff; }
      .us-col { color: #38bdf8; font-weight: 500; background: rgba(56, 189, 248, 0.04); padding: 8px 12px; border-radius: 10px; border: 1px solid rgba(56, 189, 248, 0.15); }
      .them-col { color: var(--text-muted); padding: 8px 12px; }

      @media (max-width: 768px) {
        .table-header { display: none; }
        .table-row { display: flex; flex-direction: column; gap: 8px; padding: 18px 16px; }
        .param-col { font-size: 1rem; color: #fff; }
        .us-col::before { content: 'Mr & Mrs Laundry: '; font-weight: 700; color: #38bdf8; display: block; margin-bottom: 2px; }
        .them-col::before { content: '${comp.name}: '; font-weight: 700; color: #94a3b8; display: block; margin-bottom: 2px; }
      }

      /* Why Us Grid */
      .section-heading { font-family: 'Sora', sans-serif; font-size: 1.8rem; font-weight: 700; text-align: center; margin-bottom: 30px; }
      .why-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-bottom: 50px;
      }
      .why-card {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 18px;
        padding: 24px;
      }
      .why-card h3 { font-size: 1.15rem; color: #fff; margin-bottom: 8px; }
      .why-card p { font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; }

      /* FAQs */
      .faq-card {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 14px;
      }
      .faq-q { font-size: 1.05rem; font-weight: 700; color: #fff; margin-bottom: 8px; }
      .faq-a { font-size: 0.9rem; color: var(--text-muted); line-height: 1.55; }

      /* Other Comparisons */
      .other-comps {
        margin-top: 50px;
        padding-top: 36px;
        border-top: 1px solid var(--border-color);
      }
      .comp-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 14px;
      }
      .comp-chip {
        padding: 8px 16px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
        color: #cbd5e1;
        font-size: 0.82rem;
        font-weight: 600;
      }
      .comp-chip:hover {
        background: rgba(56, 189, 248, 0.15);
        border-color: var(--accent-cyan);
        color: #fff;
        text-decoration: none;
      }

      footer {
        margin-top: 60px;
        border-top: 1px solid var(--border-color);
        padding: 36px 0;
        text-align: center;
        font-size: 0.85rem;
        color: var(--text-muted);
      }
    </style>
  </head>
  <body>
    ${GTM_BODY_SNIPPET}
    <header>
      <div class="container nav-row">
        <a href="${DOMAIN}/" class="brand-title"><span>Mr &amp; Mrs</span> Laundry</a>
        <a href="${DOMAIN}/services" style="color: #cbd5e1; font-weight: 600; font-size: 0.88rem;">Rate Card &bull; ₹99/Kg</a>
      </div>
    </header>

    <main class="container">
      <section class="hero">
        <div class="badge">⚔️ Unbiased Mumbai Comparison &bull; 2026 Edition</div>
        <h1>Looking for a Better ${comp.name} Alternative in Mumbai?</h1>
        <p class="hero-sub">${comp.shortSummary}</p>

        <div class="cta-bar">
          <a href="https://wa.me/${PHONE_CLEAN}?text=${encodeURIComponent(`Hi Mr & Mrs Laundry, I am looking for an alternative to ${comp.name} in Mumbai. Please share your pickup details!`)}" target="_blank" rel="noopener noreferrer" class="btn-wa">
            💬 Book on WhatsApp (Fastest)
          </a>
          <a href="${DOMAIN}/services" class="btn-primary">
            📋 View 84-Item Transparent Rate Card
          </a>
        </div>
      </section>

      <!-- Comparison Matrix -->
      <section>
        <h2 class="section-heading">Direct Feature &amp; Hygiene Comparison</h2>
        <div class="table-card">
          <div class="table-header">
            <div>Parameter</div>
            <div style="color: #38bdf8;">Mr &amp; Mrs Laundry (Mumbai)</div>
            <div style="color: #94a3b8;">${comp.fullName}</div>
          </div>
          ${comp.criteria.map((c) => `
            <div class="table-row">
              <div class="param-col">${c.feature}</div>
              <div class="us-col">✓ ${c.us}</div>
              <div class="them-col">${c.them}</div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Why Choose Us -->
      <section>
        <h2 class="section-heading">Why 5,000+ Mumbai Residents Switched to Mr &amp; Mrs Laundry</h2>
        <div class="why-grid">
          <div class="why-card">
            <h3>🛡️ 100% Individual Machine Drums</h3>
            <p>Your laundry is never batched or washed with other households. Every single load gets its own dedicated drum, sanitized between cycles with organic citrus-based washes.</p>
          </div>
          <div class="why-card">
            <h3>💨 Italian High-Pressure Steam Press</h3>
            <p>We use industrial vacuum steam tables and master hand-pressers to restore crisp collars, cuffs, and natural fabric loft without shine marks.</p>
          </div>
          <div class="why-card">
            <h3>⚡ Guaranteed 24-Hour Express Return</h3>
            <p>Flight to catch or urgent wedding? Our dedicated electric van fleet ensures your garments are washed, pressed, and returned in as little as 24 hours.</p>
          </div>
        </div>
      </section>

      <!-- FAQs -->
      <section>
        <h2 class="section-heading">Frequently Asked Questions</h2>
        ${comp.faqs.map((faq) => `
          <div class="faq-card">
            <div class="faq-q">${faq.q}</div>
            <div class="faq-a">${faq.a}</div>
          </div>
        `).join('')}
      </section>

      <!-- Other Competitor Comparisons -->
      <section class="other-comps">
        <h3 style="font-size: 1rem; color: #fff; text-transform: uppercase; letter-spacing: 0.06em;">Compare With Other Mumbai Services:</h3>
        <div class="comp-chips">
          ${COMPETITORS.filter((c) => c.slug !== comp.slug).map((c) => `
            <a href="${DOMAIN}/compare/${c.slug}/" class="comp-chip">vs ${c.name}</a>
          `).join('')}
          <a href="${DOMAIN}/locations/" class="comp-chip" style="background: rgba(56, 189, 248, 0.1); color: #38bdf8;">📍 View 30 Mumbai Neighborhoods</a>
        </div>
      </section>
    </main>

    <footer>
      <div class="container">
        <p>&copy; ${new Date().getFullYear()} Mr &amp; Mrs Laundry Mumbai. Honest, Independent Comparison Guide.</p>
      </div>
    </footer>
  </body>
</html>`;

  fs.writeFileSync(path.resolve(compDir, 'index.html'), html, 'utf-8');
  console.log(`✅ Generated comparison page: public/compare/${comp.slug}/index.html`);
});

// Master Comparison Directory
const masterHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${gtmHeadSnippet('/compare/')}

    <title>Mumbai Laundry & Dry Cleaner Comparison 2026 | Mr & Mrs Laundry vs The Market</title>
    <meta name="description" content="Compare Mumbai's top laundry and dry cleaners including Tumbledry, Pressto, Mera Laundry, UClean, and DhobiLite. See real pricing, hygiene differences, and turnaround times." />
    <link rel="canonical" href="${DOMAIN}/compare/" />

    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Sora:wght@600;800&display=swap" rel="stylesheet" />

    <style>
      :root { --bg-main: #050811; --bg-card: rgba(14, 20, 32, 0.85); --border-color: rgba(255, 255, 255, 0.08); --accent-cyan: #38bdf8; --text-muted: #94a3b8; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background-color: var(--bg-main); color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; line-height: 1.6; padding-bottom: 90px; }
      .container { max-width: 1080px; margin: 0 auto; padding: 0 20px; }
      header { background: rgba(5, 8, 17, 0.85); border-bottom: 1px solid var(--border-color); padding: 14px 0; }
      .nav-row { display: flex; align-items: center; justify-content: space-between; }
      .brand-title { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 1.25rem; color: #fff; text-decoration: none; }
      .brand-title span { color: var(--accent-cyan); }
      .hero { text-align: center; padding: 60px 0 40px 0; }
      h1 { font-family: 'Sora', sans-serif; font-size: clamp(2rem, 4.5vw, 3rem); font-weight: 800; margin-bottom: 16px; }
      .hero p { color: var(--text-muted); font-size: 1.1rem; max-width: 700px; margin: 0 auto; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-top: 40px; }
      .card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 28px; text-decoration: none; color: inherit; transition: transform 0.2s, border-color 0.2s; }
      .card:hover { transform: translateY(-3px); border-color: rgba(56, 189, 248, 0.5); }
      .card-tag { font-size: 0.75rem; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
      .card h2 { font-size: 1.3rem; margin-bottom: 8px; color: #fff; }
      .card p { font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px; }
      .card-link { color: var(--accent-cyan); font-weight: 700; font-size: 0.85rem; }
      footer { margin-top: 60px; border-top: 1px solid var(--border-color); padding: 36px 0; text-align: center; font-size: 0.85rem; color: var(--text-muted); }
    </style>
  </head>
  <body>
    ${GTM_BODY_SNIPPET}
    <header>
      <div class="container nav-row">
        <a href="${DOMAIN}/" class="brand-title"><span>Mr &amp; Mrs</span> Laundry</a>
        <a href="${DOMAIN}/" style="color: #cbd5e1; font-weight: 600; font-size: 0.9rem; text-decoration: none;">← Back to Home</a>
      </div>
    </header>
    <main class="container">
      <section class="hero">
        <h1>Mumbai Laundry &amp; Dry Cleaning Comparisons</h1>
        <p>Transparent side-by-side breakdowns of rates, hygiene guarantees, and turnaround times across Mumbai’s top garment care services.</p>
      </section>
      <div class="grid">
        ${COMPETITORS.map((c) => `
          <a href="${DOMAIN}/compare/${c.slug}/" class="card">
            <div class="card-tag">${c.badge}</div>
            <h2>Mr &amp; Mrs Laundry vs ${c.name}</h2>
            <p>${c.shortSummary}</p>
            <div class="card-link">View Full Comparison &rarr;</div>
          </a>
        `).join('')}
      </div>
    </main>
    <footer>
      <div class="container">
        <p>&copy; ${new Date().getFullYear()} Mr &amp; Mrs Laundry. Objective Competitive Comparisons.</p>
      </div>
    </footer>
  </body>
</html>`;

fs.writeFileSync(path.resolve(COMPARE_DIR, 'index.html'), masterHtml, 'utf-8');
console.log('✅ Generated Master Comparison Directory: public/compare/index.html');

// Generate Sitemap for Comparisons
const sitemapComparisonsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/compare/</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
${COMPETITORS.map((c) => `  <url>
    <loc>${DOMAIN}/compare/${c.slug}/</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.resolve(PUBLIC_DIR, 'sitemap-comparisons.xml'), sitemapComparisonsXml.trim(), 'utf-8');
console.log('✅ Generated sitemap-comparisons.xml');

// Update Root Sitemap Index
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
  <sitemap>
    <loc>${DOMAIN}/sitemap-comparisons.xml</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
  </sitemap>
</sitemapindex>
`;
fs.writeFileSync(path.resolve(PUBLIC_DIR, 'sitemap.xml'), sitemapIndexXml.trim(), 'utf-8');
console.log('✅ Updated Root sitemap.xml with sitemap-comparisons.xml!');
console.log('🎉 Competitor Comparison SEO generation finished successfully!');
