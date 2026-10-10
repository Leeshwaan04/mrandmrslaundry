import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Scan, Waves, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function LifecycleScroll() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: 'Smart Hamper Pickup',
      subtitle: 'Zero-Contact RFID Doorstep Collection',
      icon: <Package size={32} color="#2997ff" />,
      color: '#2997ff',
      details:
        'Leave your sealed Mr & Mrs laundry hamper at your door. Our zero-emission electric sprinter scans the embedded RFID token, securing ownership chain of custody before entering transit.',
      metrics: [
        { label: 'Time Window', val: '60 Min' },
        { label: 'Fleet Type', val: '100% Electric' },
        { label: 'Custody Chain', val: 'Encrypted RFID' },
      ],
    },
    {
      number: '02',
      title: 'Optical Fiber Diagnosis',
      subtitle: 'Multi-Spectrum Fabric Health Analysis',
      icon: <Scan size={32} color="#30d158" />,
      color: '#30d158',
      details:
        'Every individual garment passes through a 4K spectral imaging tunnel. Our automated optical system maps weave tension, tensile wear, and stain chemistry to calibrate a custom enzyme profile.',
      metrics: [
        { label: 'Scan Speed', val: '180 ms' },
        { label: 'Spectral Bands', val: '12 Bands' },
        { label: 'Stain Detection', val: '99.4% AI Match' },
      ],
    },
    {
      number: '03',
      title: 'HydroSonic™ Ultrasonic Bath',
      subtitle: 'Cold Micro-Cavitation Cleansing',
      icon: <Waves size={32} color="#64d2ff" />,
      color: '#64d2ff',
      details:
        'Suspended in a reverse-osmosis purified ionic bath, ultrasonic transducers generate billions of microscopic shockwaves that loosen particulate without rubbing thread against thread.',
      metrics: [
        { label: 'Fiber Wear', val: '0.00% Zero Friction' },
        { label: 'Water Reuse', val: '94.6% Closed-Loop' },
        { label: 'Sanitization', val: '99.99% Ozone' },
      ],
    },
    {
      number: '04',
      title: 'Laser Fold & Rehang',
      subtitle: 'Anti-Crease Garment Case Delivery',
      icon: <Sparkles size={32} color="#bf5af2" />,
      color: '#bf5af2',
      details:
        'Delicate suits and eveningwear are transferred to custom cedar hangers inside breathable antimicrobial garment vaults. Everyday apparel is laser-aligned and crisply folded with millimetric precision.',
      metrics: [
        { label: 'Fold Alignment', val: '±0.5 mm' },
        { label: 'Hanger Finish', val: 'Red Cedar' },
        { label: 'Case Material', val: '100% Recycled PET' },
      ],
    },
  ];

  const current = steps[activeStep];

  return (
    <section
      id="process"
      style={{
        padding: '120px 0',
        backgroundColor: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container-max">
        {/* Section Title */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="apple-pill-badge" style={{ marginBottom: '16px' }}>
            <Sparkles size={14} />
            <span>The Four-Phase Custody Chain</span>
          </div>
          <h2 className="headline-section" style={{ marginBottom: '18px' }}>
            From your doorstep back to your wardrobe.
          </h2>
          <p className="subheadline" style={{ maxWidth: '640px', margin: '0 auto' }}>
            A synchronized sequence engineered to treat everyday clothing like museum-grade textiles.
          </p>
        </div>

        {/* Step Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '40px',
          }}
        >
          {steps.map((s, idx) => {
            const isSelected = activeStep === idx;
            return (
              <motion.button
                key={s.number}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveStep(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 24px',
                  borderRadius: '999px',
                  background: isSelected ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${isSelected ? s.color : 'rgba(255, 255, 255, 0.08)'}`,
                  color: isSelected ? '#ffffff' : '#86868b',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isSelected ? `0 0 24px ${s.color}33` : 'none',
                }}
              >
                <span style={{ fontSize: '0.78rem', color: s.color, fontWeight: 700 }}>{s.number}</span>
                <span>{s.title}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Active Step Feature Box */}
        <div className="apple-glass" style={{ borderRadius: '32px', padding: '48px', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '36px',
                alignItems: 'center',
              }}
            >
              {/* Left Column Description */}
              <div style={{ gridColumn: 'span 12' }} id="step-left-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: `1px solid ${current.color}44`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 20px ${current.color}22`,
                    }}
                  >
                    {current.icon}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: current.color, fontWeight: 700, letterSpacing: '0.08em' }}>
                      PHASE {current.number}
                    </span>
                    <h3 style={{ fontSize: '1.9rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
                      {current.title}
                    </h3>
                  </div>
                </div>

                <div style={{ fontSize: '1.1rem', color: '#64d2ff', fontWeight: 600, marginBottom: '16px' }}>
                  {current.subtitle}
                </div>

                <p style={{ color: '#a1a1a6', fontSize: '1.02rem', lineHeight: 1.6, marginBottom: '32px' }}>
                  {current.details}
                </p>

                {/* Metrics Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                  {current.metrics.map((m) => (
                    <div
                      key={m.label}
                      style={{
                        padding: '16px',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{m.val}</div>
                      <div style={{ fontSize: '0.74rem', color: '#86868b', marginTop: '4px' }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          #step-left-content {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}
