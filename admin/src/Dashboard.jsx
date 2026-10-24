import React from 'react';
import { clearToken } from './GitHubApi';
import { page, card, button } from './styles';

const SECTIONS = [
  { id: 'leads', title: '📍 Leads & Pickups CRM', desc: 'Customer bookings, phone inquiries, neighborhood analytics, and CSV export.', ready: true, highlight: true },
  { id: 'business-info', title: 'Business Info', desc: 'Phone, email, addresses, hours, delivery coverage areas.', ready: true },
  { id: 'pricing', title: 'Pricing & Rate Cards', desc: 'Core service prices and the full garment rate card.', ready: false },
  { id: 'services', title: 'Services & Copy', desc: 'Service names, descriptions and feature lists.', ready: false },
  { id: 'faqs', title: 'FAQs', desc: 'Questions and answers shown on the Home and Contact pages.', ready: false },
  { id: 'offers', title: 'Special Offers', desc: 'Promo cards shown on the homepage.', ready: false },
  { id: 'testimonials', title: 'Testimonials & Reviews', desc: 'Press quotes and Google review cards.', ready: false },
  { id: 'delivery-process', title: 'Delivery Process', desc: 'The 4-stage pickup → wash → dry → deliver story.', ready: false },
  { id: 'gallery', title: 'Gallery & Media', desc: 'Photos shown on the Gallery page.', ready: false },
];

export default function Dashboard({ onOpenSection }) {
  return (
    <div style={page}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 4px' }}>Mr &amp; Mrs Laundry Admin</h1>
            <p style={{ fontSize: '0.85rem', color: '#86868b', margin: 0 }}>
              Live customer leads ledger and website content manager.
            </p>
          </div>
          <button style={button('secondary')} onClick={() => { clearToken(); window.location.reload(); }}>
            Log out
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => s.ready && onOpenSection(s.id)}
              style={{
                ...card,
                textAlign: 'left',
                cursor: s.ready ? 'pointer' : 'not-allowed',
                opacity: s.ready ? 1 : 0.45,
                border: s.highlight ? '1.5px solid #2997ff' : 'none',
                background: s.highlight ? 'linear-gradient(180deg, rgba(41, 151, 255, 0.12) 0%, rgba(15, 16, 22, 0.9) 100%)' : card.background,
                borderRadius: '20px',
              }}
              disabled={!s.ready}
            >
              <div style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', color: s.highlight ? '#38bdf8' : '#fff' }}>
                {s.title}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#86868b', lineHeight: 1.4 }}>{s.desc}</div>
              {s.highlight && <div style={{ fontSize: '0.72rem', color: '#30d158', marginTop: '10px', fontWeight: 700 }}>● ACTIVE LEADS LEDGER</div>}
              {!s.ready && <div style={{ fontSize: '0.72rem', color: '#ffd60a', marginTop: '10px' }}>Coming soon</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
