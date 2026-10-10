import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Sparkles } from 'lucide-react';

export default function TestimonialsTicker() {
  const reviews = [
    {
      quote:
        '“Mr & Mrs Laundry treats our runway archival pieces with the reverence of museum conservationists. The HydroSonic process is witchcraft.”',
      author: 'Elena Rostova',
      role: 'Creative Director, Atelier Noir Milan',
      badge: 'Runway Archival Client',
    },
    {
      quote:
        '“The 2-hour electric concierge feels like an Apple service experience. Our cashmere knits returned softer than the day they were bought.”',
      author: 'David Vance',
      role: 'Managing Partner, Vance & Co. Capital',
      badge: 'Verified Member',
    },
    {
      quote:
        '“Zero dry-clean chemical odor. The Kyoto Hinoki fragrance profile and laser-precise packaging are completely unmatched anywhere in the world.”',
      author: 'Sophia Chen',
      role: 'Senior Editor, Highsnobiety Design',
      badge: 'Press Review',
    },
    {
      quote:
        '“Traditional dry cleaners destroyed two of my bespoke Savile Row jackets. Mr & Mrs Laundry restored the fabric drape completely.”',
      author: 'Marcus Sterling',
      role: 'Architectural Director, Studio 9',
      badge: 'Bespoke Wardrobe Client',
    },
  ];

  return (
    <section
      style={{
        padding: '100px 0',
        backgroundColor: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container-max">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="apple-pill-badge" style={{ marginBottom: '16px' }}>
            <Star size={14} color="#ffd666" />
            <span>Editorial &amp; Client Accolades</span>
          </div>
          <h2 className="headline-section" style={{ marginBottom: '16px' }}>
            Trusted by textile purists.
          </h2>
          <p className="subheadline" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Over 42,000 couture garments preserved without a single fiber compromised.
          </p>
        </div>

        {/* Reviews Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {reviews.map((r, i) => (
            <motion.div
              key={r.author}
              whileHover={{ y: -5 }}
              className="apple-glass-card"
              style={{
                padding: '32px',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={14} fill="#ffd666" color="#ffd666" />
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: '#64d2ff',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: 'rgba(100, 210, 255, 0.1)',
                      fontWeight: 600,
                    }}
                  >
                    {r.badge}
                  </span>
                </div>
                <p style={{ color: '#f5f5f7', fontSize: '0.96rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '24px' }}>
                  {r.quote}
                </p>
              </div>

              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>{r.author}</div>
                <div style={{ fontSize: '0.78rem', color: '#86868b' }}>{r.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
