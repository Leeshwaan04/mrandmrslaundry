import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Shield, Zap, Crown } from 'lucide-react';

export default function ComparisonMatrix({ onSelectPlan }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'perBag'

  const plans = [
    {
      id: 'essential',
      name: 'Essential Clean',
      tagline: 'Precision care for everyday wardrobes.',
      priceMonthly: 79,
      pricePerBag: 32,
      badge: 'Everyday',
      features: [
        'Up to 15 kg monthly wash & fold',
        'HydroSonic™ 1200 RPM micro-cavitation',
        '24-Hour standard electric delivery',
        'Standard hypoallergenic rinse',
        'Laser-precision robotic folding',
        'Basic RFID bag tracking',
      ],
      highlight: false,
    },
    {
      id: 'pro',
      name: 'Couture Pro',
      tagline: 'Engineered for luxury fibers and busy lifestyles.',
      priceMonthly: 169,
      pricePerBag: 54,
      badge: 'Most Popular',
      features: [
        'Up to 35 kg wash & fold + 6 bespoke garments',
        'Ozone 99.99% sterilization cycle',
        '6-Hour priority express turnaround',
        'Custom fragrance infusion (Cedar/Lavender)',
        'Delivered on aromatic cedar hangers',
        'Complimentary luxury titanium hampers',
        '$5,000 garment protection warranty',
      ],
      highlight: true,
    },
    {
      id: 'max',
      name: 'Titanium Atelier Max',
      tagline: 'Unlimited wardrobe perfection with private concierge.',
      priceMonthly: 349,
      pricePerBag: 98,
      badge: 'Private Concierge',
      features: [
        'Unlimited monthly capacity & dry cleaning',
        '2-Hour dedicated electric courier dispatch',
        'Designer sneaker restoration included (2 pairs/mo)',
        'Minor repairs & horn button replacements',
        'Cold-storage garment preservation vault',
        '24/7 Dedicated master textile specialist',
        '$25,000 premier insurance coverage',
      ],
      highlight: false,
    },
  ];

  return (
    <section
      id="pricing"
      style={{
        padding: '120px 0',
        backgroundColor: '#050608',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="ambient-glow glow-blue"
        style={{
          width: '700px',
          height: '700px',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.18,
        }}
      />

      <div className="container-max" style={{ position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="apple-pill-badge" style={{ marginBottom: '16px' }}>
            <Crown size={14} color="#ffd666" />
            <span>Transparent Wardrobe Plans</span>
          </div>
          <h2 className="headline-section" style={{ marginBottom: '18px' }}>
            Compare Care Plans.
          </h2>
          <p className="subheadline" style={{ maxWidth: '600px', margin: '0 auto 32px' }}>
            Choose how you want your garments engineered. Pause or cancel anytime in a single tap.
          </p>

          {/* Billing Switcher */}
          <div
            style={{
              display: 'inline-flex',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '4px',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                padding: '8px 20px',
                borderRadius: '999px',
                border: 'none',
                background: billingCycle === 'monthly' ? '#0071e3' : 'transparent',
                color: '#fff',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            >
              Concierge Membership (Save 20%)
            </button>
            <button
              onClick={() => setBillingCycle('perBag')}
              style={{
                padding: '8px 20px',
                borderRadius: '999px',
                border: 'none',
                background: billingCycle === 'perBag' ? '#0071e3' : 'transparent',
                color: '#fff',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            >
              Pay As You Go (Per Bag)
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
            alignItems: 'stretch',
          }}
        >
          {plans.map((p) => {
            const price = billingCycle === 'monthly' ? p.priceMonthly : p.pricePerBag;
            const period = billingCycle === 'monthly' ? '/month' : '/bag';

            return (
              <motion.div
                key={p.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className={p.highlight ? 'apple-glass' : 'apple-glass-card'}
                style={{
                  padding: '40px 32px',
                  borderRadius: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: p.highlight ? '2px solid rgba(41, 151, 255, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: p.highlight
                    ? '0 30px 80px rgba(0, 113, 227, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    : 'none',
                  position: 'relative',
                }}
              >
                {p.highlight && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '24px',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      background: 'linear-gradient(90deg, #0071e3, #2997ff)',
                      color: '#fff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {p.badge}
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                    {p.name}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#86868b', minHeight: '42px', lineHeight: 1.4 }}>
                    {p.tagline}
                  </p>

                  <div style={{ margin: '24px 0 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ fontSize: '3.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
                        ${price}
                      </span>
                      <span style={{ fontSize: '1rem', color: '#86868b' }}>{period}</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px' }}>
                    {p.features.map((feat) => (
                      <div key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: p.highlight ? 'rgba(41, 151, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px',
                          }}
                        >
                          <Check size={12} color={p.highlight ? '#64d2ff' : '#fff'} />
                        </div>
                        <span style={{ fontSize: '0.88rem', color: '#d2d2d7', lineHeight: 1.4 }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onSelectPlan(p)}
                  className={p.highlight ? 'apple-btn-primary' : 'apple-btn-secondary'}
                  style={{ width: '100%', padding: '14px', fontSize: '0.96rem' }}
                >
                  Choose {p.name}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
