import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Plus, Minus, Check, Sparkles, Clock, Shield, ArrowRight, Shirt, Briefcase, Feather, Footprints, BedDouble } from 'lucide-react';

export default function InteractiveCalculator({ onOpenBookingWithCustomPlan }) {
  const [items, setItems] = useState({
    washAndFoldKg: 6,
    suits: 2,
    silkCashmere: 1,
    sneakers: 1,
    bedding: 0,
  });

  const [scent, setScent] = useState('rain');
  const [speed, setSpeed] = useState('standard');

  const updateQuantity = (key, delta) => {
    setItems((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta),
    }));
  };

  const itemMeta = {
    washAndFoldKg: { label: 'Wash & Fold Daily Wear', unit: 'kg', rate: 99, icon: <Shirt size={22} color="#64d2ff" />, desc: 'Deep hygienic wash, color care & neat fold' },
    suits: { label: 'Coat / Blazer Dry Clean', unit: 'pcs', rate: 249, icon: <Briefcase size={22} color="#2997ff" />, desc: 'Professional steam press on suit hanger' },
    silkCashmere: { label: 'Saree / Designer Wear', unit: 'pcs', rate: 199, icon: <Feather size={22} color="#bf5af2" />, desc: 'Delicate pH-neutral solvent wash & zari care' },
    sneakers: { label: 'Shoe Laundry & Spa', unit: 'pairs', rate: 299, icon: <Footprints size={22} color="#30d158" />, desc: 'Deep mid-sole foam scrub & deodorization' },
    bedding: { label: 'Blanket / Heavy Quilt', unit: 'pcs', rate: 249, icon: <BedDouble size={22} color="#ff9f0a" />, desc: 'Thermal sanitization & dust-mite removal' },
  };

  const scentOptions = [
    { id: 'rain', name: 'Fresh Ocean & Citrus', tag: 'Everyday Fresh' },
    { id: 'lavender', name: 'French Alpine Lavender', tag: 'Gentle / Relaxing' },
    { id: 'cedar', name: 'Natural Sandal & Cedar', tag: 'Warm / Subtle' },
    { id: 'hypo', name: '100% Unscented Pure Hypoallergenic', tag: 'Baby & Sensitive Skin' },
  ];

  const speedOptions = [
    { id: 'standard', name: '24–48h Standard Delivery', surcharge: 0, badge: 'Standard SLA' },
    { id: 'express', name: '24-Hour Express Laundry', surcharge: 99, badge: 'Fast Track' },
  ];

  // Calculate pricing
  const basePrice =
    items.washAndFoldKg * itemMeta.washAndFoldKg.rate +
    items.suits * itemMeta.suits.rate +
    items.silkCashmere * itemMeta.silkCashmere.rate +
    items.sneakers * itemMeta.sneakers.rate +
    items.bedding * itemMeta.bedding.rate;

  const currentSpeed = speedOptions.find((s) => s.id === speed) || speedOptions[0];
  const totalPrice = Math.max(99, basePrice + currentSpeed.surcharge);
  const carbonOffsetKg = (basePrice * 0.12).toFixed(1);

  const handleCheckout = () => {
    if (onOpenBookingWithCustomPlan) {
      onOpenBookingWithCustomPlan({
        items,
        scent: scentOptions.find((s) => s.id === scent)?.name,
        speed: currentSpeed.name,
        totalPrice: Math.round(totalPrice),
      });
    }
  };

  return (
    <section
      id="calculator"
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
          width: '600px',
          height: '600px',
          top: '20%',
          right: '5%',
          opacity: 0.2,
        }}
      />

      <div className="container-max" style={{ position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="apple-pill-badge" style={{ marginBottom: '16px' }}>
            <Calculator size={14} />
            <span>Interactive Wardrobe Configurator</span>
          </div>
          <h2 className="headline-section" style={{ marginBottom: '16px' }}>
            Configure your exact care cycle.
          </h2>
          <p className="subheadline" style={{ maxWidth: '640px', margin: '0 auto' }}>
            Transparent real-time valuation with live delivery estimates and organic fragrance selection.
          </p>
        </div>

        {/* Main 2-column layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '32px',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Garment selection list */}
          <div
            style={{
              gridColumn: 'span 12',
            }}
            id="calc-left-col"
          >
            <div className="apple-glass" style={{ borderRadius: '28px', padding: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '20px' }}>
                Select Your Items
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.keys(items).map((key) => {
                  const meta = itemMeta[key];
                  const count = items[key];

                  return (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.01 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '18px',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        flexWrap: 'wrap',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '220px' }}>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {meta.icon}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.96rem', color: '#fff' }}>
                            {meta.label}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#86868b' }}>
                            ₹{meta.rate}/{meta.unit} • {meta.desc}
                          </div>
                        </div>
                      </div>

                      {/* Stepper buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => updateQuantity(key, -1)}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            opacity: count === 0 ? 0.3 : 1,
                          }}
                          disabled={count === 0}
                        >
                          <Minus size={16} />
                        </motion.button>

                        <span
                          style={{
                            fontSize: '1.15rem',
                            fontWeight: 700,
                            minWidth: '48px',
                            textAlign: 'center',
                            color: count > 0 ? '#64d2ff' : '#86868b',
                          }}
                        >
                          {count} {meta.unit}
                        </span>

                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => updateQuantity(key, 1)}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'rgba(0, 113, 227, 0.4)',
                            border: '1px solid rgba(41, 151, 255, 0.4)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Plus size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Fragrance profiles */}
              <div style={{ marginTop: '36px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
                  Aromatic Micro-Infusion
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '10px',
                  }}
                >
                  {scentOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setScent(opt.id)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '14px',
                        border: `1px solid ${scent === opt.id ? '#2997ff' : 'rgba(255, 255, 255, 0.08)'}`,
                        background: scent === opt.id ? 'rgba(41, 151, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ fontSize: '0.86rem', fontWeight: 600, color: scent === opt.id ? '#fff' : '#a1a1a6' }}>
                        {opt.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: scent === opt.id ? '#64d2ff' : '#86868b', marginTop: '2px' }}>
                        {opt.tag}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Price Summary Box */}
          <div
            style={{
              gridColumn: 'span 12',
            }}
            id="calc-right-col"
          >
            <div
              className="apple-glass"
              style={{
                borderRadius: '28px',
                padding: '32px',
                position: 'sticky',
                top: '90px',
                border: '1px solid rgba(41, 151, 255, 0.2)',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 113, 227, 0.15)',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#64d2ff',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                LIVE ESTIMATE SUMMARY
              </span>

              <div style={{ marginTop: '16px', marginBottom: '24px' }}>
                <div style={{ fontSize: '0.86rem', color: '#86868b' }}>Estimated Total:</div>
                <div
                  style={{
                    fontSize: '3.4rem',
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                    color: '#ffffff',
                    lineHeight: 1.1,
                  }}
                >
                  ₹{Math.round(totalPrice)}
                  <span style={{ fontSize: '1rem', color: '#86868b', fontWeight: 500, marginLeft: '6px' }}>
                    INR
                  </span>
                </div>
              </div>

              {/* Turnaround speed selector */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '0.78rem', color: '#86868b', fontWeight: 600, display: 'block', marginBottom: '10px' }}>
                  TURNAROUND SPEED
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {speedOptions.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setSpeed(s.id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: speed === s.id ? 'rgba(41, 151, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${speed === s.id ? '#2997ff' : 'rgba(255, 255, 255, 0.08)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        fontSize: '0.84rem',
                      }}
                    >
                      <div style={{ color: speed === s.id ? '#fff' : '#a1a1a6', fontWeight: 600 }}>
                        {s.name}
                      </div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          background: speed === s.id ? '#0071e3' : 'rgba(255, 255, 255, 0.08)',
                          color: '#fff',
                        }}
                      >
                        {s.surcharge === 0 ? 'Included' : `+₹${s.surcharge}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key benefits list */}
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '16px',
                  marginBottom: '28px',
                  fontSize: '0.8rem',
                  color: '#a1a1a6',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={14} color="#30d158" />
                  <span>Free doorstep pickup &amp; delivery over ₹399</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={14} color="#30d158" />
                  <span>100% Dedicated load — never mixed with others</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={14} color="#64d2ff" />
                  <span>10% OFF on your very first order</span>
                </div>
              </div>

              {/* Instant Book CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="apple-btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '1.02rem', gap: '8px' }}
              >
                <span>Lock In This Bag &amp; Schedule</span>
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          #calc-left-col {
            grid-column: span 7 !important;
          }
          #calc-right-col {
            grid-column: span 5 !important;
          }
        }
      `}</style>
    </section>
  );
}
