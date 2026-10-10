import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Heart
} from 'lucide-react';

export default function Footer({ onNavigate, onOpenBooking, onOpenTrackOrder }) {
  return (
    <footer
      style={{
        backgroundColor: '#050508',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '90px 24px 40px 24px',
        position: 'relative',
        zIndex: 20,
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Top 4-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '48px',
            marginBottom: '64px',
          }}
        >
          {/* Column 1: Brand & Credibility */}
          <div>
            <div style={{ marginBottom: '18px' }}>
              <img
                src="./logo.png"
                alt="Mr and Mrs Laundry"
                style={{
                  height: '48px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  filter: 'drop-shadow(0 2px 12px rgba(0, 113, 227, 0.4))',
                }}
              />
            </div>

            <p style={{ color: '#86868b', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Mumbai’s most trusted laundry &amp; dry clean service since 2012. Over a decade of excellence, 5,000+ happy clients, and fresh, flawless clothes delivered right to your doorstep.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#30d158', fontSize: '0.82rem', fontWeight: 600 }}>
                <ShieldCheck size={16} />
                <span>100% Individual Hygiene Handling</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64d2ff', fontSize: '0.82rem', fontWeight: 600 }}>
                <Sparkles size={16} />
                <span>Zero-Emission Electric Delivery Fleet</span>
              </div>
            </div>
          </div>

          {/* Column 2: Service Catalog */}
          <div>
            <h4
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '20px',
              }}
            >
              Our Laundry Services
            </h4>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'Wash & Fold Laundry (₹99/Kg)' },
                { name: 'Wash & Iron Laundry (₹159/Kg)' },
                { name: 'Dry Cleaning (Starts @ ₹99)' },
                { name: 'Shoe Laundry & Spa (Starts @ ₹299)' },
                { name: 'Express 24h Laundry (₹299/Kg)' },
                { name: 'Premium Garment Care (₹199/Kg)' },
                { name: 'Heavy Laundry & Quilts (₹159/Kg)' },
                { name: 'Curtain & Drapery Care (₹14/Sq.ft)' },
              ].map((s) => (
                <li key={s.name}>
                  <button
                    onClick={() => {
                      onNavigate('services');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#a1a1a6',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#a1a1a6')}
                  >
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links & Actions */}
          <div>
            <h4
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '20px',
              }}
            >
              Useful Pages
            </h4>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { id: 'home', label: 'Home Page' },
                { id: 'about', label: 'About Mr & Mrs Laundry' },
                { id: 'services', label: 'Services & Rate Card' },
                { id: 'gallery', label: 'Care Gallery & Works' },
                { id: 'contact', label: 'Contact Us & Stores' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      onNavigate(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#a1a1a6',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#a1a1a6')}
                  >
                    {link.label}
                  </button>
                </li>
              ))}

              <li style={{ paddingTop: '8px' }}>
                <button
                  onClick={onOpenTrackOrder}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#30d158',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>Track Live Order Status</span>
                  <ArrowRight size={14} />
                </button>
              </li>

              <li>
                <button
                  onClick={onOpenBooking}
                  style={{
                    marginTop: '8px',
                    padding: '10px 20px',
                    borderRadius: '999px',
                    background: 'rgba(0, 113, 227, 0.2)',
                    border: '1px solid rgba(0, 113, 227, 0.5)',
                    color: '#64d2ff',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Schedule Free Pickup
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Mumbai Contact & Footprint */}
          <div>
            <h4
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '20px',
              }}
            >
              Contact &amp; Locations
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64d2ff', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  <MapPin size={15} />
                  <span>South Mumbai Storefront</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#86868b', lineHeight: 1.5 }}>
                  Shop no. 3/4, No. 508, Ganjawala Tower, G-3, Sane Guruji Marg, Behind Suman Jewellers, Bane Compound, Tardeo, Mumbai - 400034.
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#bf5af2', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  <MapPin size={15} />
                  <span>Central Processing Plant</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#86868b', lineHeight: 1.5 }}>
                  Industrial Eco Laundry Hub, Malad East, Mumbai.
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#30d158', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  <Phone size={15} />
                  <span>Call &amp; WhatsApp Support</span>
                </div>
                <a
                  href="tel:+919152233822"
                  style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: 700, textDecoration: 'none' }}
                >
                  +91 9152233822
                </a>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffd60a', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  <Clock size={15} />
                  <span>Store Hours</span>
                </div>
                <div style={{ fontSize: '0.84rem', color: '#86868b' }}>
                  Tue to Sun: 9:00 AM – 9:00 PM <br />
                  <span style={{ color: '#ff453a' }}>Monday: Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div
          style={{
            paddingTop: '28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.82rem',
            color: '#6e6e73',
          }}
        >
          <div>
            © 2026 Mr &amp; Mrs Laundry. Mumbai’s Most Trusted Laundry &amp; Dry Clean Service.
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ color: '#86868b' }}>Privacy Policy</span>
            <span style={{ color: '#86868b' }}>Terms of Custody</span>
            <span style={{ color: '#86868b' }}>Sitemap</span>
            <span style={{ color: '#30d158' }}>100% Net-Zero Fleet</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
