import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function MinimalFooter({ onOpenBooking }) {
  return (
    <footer
      style={{
        backgroundColor: '#000000',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '90px 24px 60px 24px',
        color: '#86868b',
        position: 'relative',
        zIndex: 20,
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* VIP Concierge Closing Card */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(16, 17, 24, 0.8) 0%, rgba(8, 9, 13, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '32px',
            padding: '56px 44px',
            textAlign: 'center',
            marginBottom: '72px',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 60px rgba(0, 113, 227, 0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Backlight Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '500px',
              height: '300px',
              background: 'radial-gradient(ellipse, rgba(0, 113, 227, 0.35) 0%, transparent 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              marginBottom: '20px',
            }}
          >
            <Sparkles size={14} color="#64d2ff" />
            <span style={{ fontSize: '0.8rem', color: '#f5f5f7', fontWeight: 600 }}>
              Zero Friction • 100% Electric Dispatch
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              marginBottom: '16px',
              lineHeight: 1.12,
            }}
          >
            Your wardrobe.{'\n'}
            <span
              style={{
                background: 'linear-gradient(135deg, #64d2ff 0%, #2997ff 60%, #bf5af2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Conserved forever.
            </span>
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#a1a1a6',
              maxWidth: '600px',
              margin: '0 auto 36px auto',
              lineHeight: 1.6,
            }}
          >
            Schedule your white-glove doorstep collection. Returned sealed in custom cedar vaults within 60 minutes.
          </p>

          <button
            onClick={onOpenBooking}
            style={{
              padding: '16px 36px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #0071e3 0%, #0056b3 100%)',
              border: 'none',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 10px 30px rgba(0, 113, 227, 0.5)',
              transition: 'transform 0.2s ease',
            }}
          >
            <span>Book Concierge Pickup</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Minimal Disclaimers & Footer Links */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            paddingTop: '28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.78rem',
            color: '#6e6e73',
          }}
        >
          <div>
            © 2026 Mr &amp; Mrs Laundry Inc. All rights reserved. Precision garment care engineered in Manhattan.
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ color: '#86868b' }}>Privacy Policy</span>
            <span style={{ color: '#86868b' }}>Terms of Custody</span>
            <span style={{ color: '#86868b' }}>Indemnity Guarantee</span>
            <span style={{ color: '#30d158' }}>100% Net-Zero Fleet</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
