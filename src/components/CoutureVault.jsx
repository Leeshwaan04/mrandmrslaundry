import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Crown, Shield, Eye, CheckCircle2, ChevronRight, Layers, Feather, Scissors, Gem, Wind, HeartHandshake } from 'lucide-react';
import { Lottie } from 'lottie-react';

// Procedural lightweight Lottie animation: Floating Couture Sparkle & Fabric Aura
const sparkleLottieData = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 90,
  w: 200,
  h: 200,
  nm: "Couture Glow",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Diamond Star",
      sr: 1,
      ks: {
        o: {
          k: [
            { t: 0, s: [30] },
            { t: 45, s: [100] },
            { t: 90, s: [30] }
          ]
        },
        r: {
          k: [
            { t: 0, s: [0] },
            { t: 90, s: [180] }
          ]
        },
        p: { k: [100, 100, 0] },
        a: { k: [0, 0, 0] },
        s: {
          k: [
            { t: 0, s: [70, 70] },
            { t: 45, s: [110, 110] },
            { t: 90, s: [70, 70] }
          ]
        }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sr",
              sy: 2,
              p: { k: [0, 0] },
              r: { k: 0 },
              ir: { k: 12 },
              is: { k: 0 },
              or: { k: 38 },
              os: { k: 0 },
              pt: { k: 4 }
            },
            {
              ty: "fl",
              c: { k: [0.16, 0.59, 1, 1] },
              o: { k: 100 }
            },
            {
              ty: "tr",
              p: { k: [0, 0] },
              a: { k: [0, 0] },
              s: { k: [100, 100] },
              r: { k: 0 },
              o: { k: 100 },
              sk: { k: 0 },
              sa: { k: 0 }
            }
          ]
        }
      ]
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Ring Halo",
      sr: 1,
      ks: {
        o: {
          k: [
            { t: 0, s: [20] },
            { t: 45, s: [80] },
            { t: 90, s: [20] }
          ]
        },
        r: { k: 0 },
        p: { k: [100, 100, 0] },
        a: { k: [0, 0, 0] },
        s: {
          k: [
            { t: 0, s: [50, 50] },
            { t: 90, s: [130, 130] }
          ]
        }
      },
      shapes: [
        {
          ty: "el",
          p: { k: [0, 0] },
          s: { k: [70, 70] }
        },
        {
          ty: "st",
          c: { k: [0.39, 0.82, 1, 1] },
          o: { k: 100 },
          w: { k: 2 }
        },
        {
          ty: "tr",
          p: { k: [0, 0] },
          a: { k: [0, 0] },
          s: { k: [100, 100] },
          r: { k: 0 },
          o: { k: 100 },
          sk: { k: 0 },
          sa: { k: 0 }
        }
      ]
    }
  ]
};

export default function CoutureVault({ onOpenBooking }) {
  const [activeGarment, setActiveGarment] = useState('cashmere');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  const coutureGarments = {
    cashmere: {
      title: 'Loro Piana Baby Cashmere',
      designer: 'Italian Outerwear & Knitwear',
      tagline: '13.5-micron fine down preserved without fiber fracture.',
      heroImage: '🧥',
      color: '#64d2ff',
      details:
        'Conventional dry cleaning chemicals strip the essential lanolin wax from baby cashmere, resulting in brittleness and pilling. Our sub-ambient 24°C HydroSonic vapor bath rehydrates each individual hair follicle, elevating natural loft and drape by 42%.',
      specs: [
        { label: 'Fiber Diameter', val: '13.5 µm' },
        { label: 'Bath Temperature', val: '24°C Cold Ionic' },
        { label: 'Tensile Wear', val: '0.00% Friction' },
        { label: 'Hanger Type', val: 'Contoured 5.5cm Red Cedar' },
      ],
      protocols: [
        'Lanolin moisture vapor replenishment',
        'Anti-pilling ultrasonic agitation bath',
        'Delivered inside breathable organza garment casing',
      ],
    },
    tuxedo: {
      title: 'Savile Row Bespoke Tuxedo',
      designer: 'British Tailoring & Barathea Wool',
      tagline: 'Preserving anatomical canvas roll, lapel belly, and silk satin.',
      heroImage: '🤵',
      color: '#2997ff',
      details:
        'A bespoke jacket is built on floating horsehair canvas that flat-ironing permanently crushes. We employ a pneumatic heated mannequin that gently inflates inside the jacket, pressing lapels in three dimensions while preserving the tailor’s sculptural silhouette.',
      specs: [
        { label: 'Fabric Grade', val: 'Super 180s Wool' },
        { label: 'Lapel Facing', val: 'Mulberry Silk Satin' },
        { label: 'Press Method', val: '3D Anatomical Torso' },
        { label: 'Button Shield', val: 'Silicone Magnetic Armor' },
      ],
      protocols: [
        'Magnetic protection caps for horn buttons',
        'Horsehair canvas anatomical chest forming',
        'Zero-crease vertical transit hanging chamber',
      ],
    },
    silk: {
      title: 'Hermès Silk Carré & Gowns',
      designer: 'French Haute Couture Silk',
      tagline: 'Hand-rolled hems protected against tension strain.',
      heroImage: '🧣',
      color: '#bf5af2',
      details:
        'Hand-rolled silk edges are legendary for their delicate tubular volume. Mechanical tumbling uncurls these seams forever. Mr & Mrs Laundry gently suspends eveningwear in cold purified ionic fluid without centrifugal twisting, keeping colors deep and vibrant.',
      specs: [
        { label: 'Silk Weight', val: '19 Momme Twill' },
        { label: 'Solvent Used', val: 'Zero Chemistry (Pure Water)' },
        { label: 'Dye Fastness', val: '100% Retained' },
        { label: 'Packaging', val: 'Acid-Free Archival Envelopes' },
      ],
      protocols: [
        'Hand-rolled hem tension isolation clamps',
        'Cryogenic ozone odor and organic stain breakdown',
        'Archival acid-free tissue paper packaging',
      ],
    },
    sneaker: {
      title: 'Balenciaga & Louboutin Atelier',
      designer: 'Designer Footwear Restoration',
      tagline: 'Ultrasonic sole restoration and hand-conditioned calfskin.',
      heroImage: '👟',
      color: '#30d158',
      details:
        'High-fashion sneakers combine calfskin suede, vulcanized rubber, and reflective mesh. We use surgical-grade ultrasonic micro-brushes followed by an ozone gas sanitization cabinet that eliminates bacteria without submerging luxury leather in destructive liquids.',
      specs: [
        { label: 'Leather Care', val: 'Organic Beeswax Balm' },
        { label: 'Sole Cleaning', val: '40 kHz Cavitation Brush' },
        { label: 'Interior Deodorize', val: 'Ozone Gas Infiltration' },
        { label: 'Shoe Trees', val: 'Aromatic Red Cedar' },
      ],
      protocols: [
        'Fine suede nap brush and revitalization',
        'Non-marking red bottom protective sole film',
        'Delivered in dust bags with custom cedar shoe trees',
      ],
    },
  };

  const selected = coutureGarments[activeGarment];

  return (
    <section
      id="couture-vault"
      style={{
        padding: '130px 0',
        backgroundColor: '#020306',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow effects */}
      <div
        className="ambient-glow glow-blue"
        style={{
          width: '750px',
          height: '750px',
          left: '50%',
          top: '20%',
          transform: 'translateX(-50%)',
          opacity: 0.22,
        }}
      />
      <div
        className="ambient-glow glow-purple"
        style={{
          width: '600px',
          height: '600px',
          right: '-10%',
          top: '40%',
          opacity: 0.2,
        }}
      />

      <div className="container-max" style={{ position: 'relative', zIndex: 10 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="apple-pill-badge" style={{ marginBottom: '18px' }}>
            <Crown size={14} color="#ffd666" />
            <span>The Haute Couture Atelier</span>
          </div>

          <h2 className="headline-section" style={{ marginBottom: '18px' }}>
            Your wardrobe.{'\n'}
            <span className="gradient-blue-text">Elevated to high art.</span>
          </h2>

          <p className="subheadline" style={{ maxWidth: '680px', margin: '0 auto' }}>
            Engineered specifically for Savile Row tailoring, Chanel tweed, Loro Piana cashmere, and runway couture. 
            We do not treat garments as laundry — we conserve them like museum masterpieces.
          </p>
        </div>

        {/* Lottie Animation Accent Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div style={{ width: '48px', height: '48px' }}>
            <Lottie animationData={sparkleLottieData} loop={true} />
          </div>
          <span style={{ fontSize: '0.85rem', color: '#64d2ff', fontWeight: 600, letterSpacing: '0.04em' }}>
            100% Certified Garment Longevity Guarantee • Zero Harsh Solvents
          </span>
          <div style={{ width: '48px', height: '48px' }}>
            <Lottie animationData={sparkleLottieData} loop={true} />
          </div>
        </div>

        {/* Garment Selector Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '48px',
          }}
        >
          {Object.keys(coutureGarments).map((key) => {
            const g = coutureGarments[key];
            const isSelected = activeGarment === key;
            return (
              <motion.button
                key={key}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveGarment(key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 22px',
                  borderRadius: '999px',
                  background: isSelected ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${isSelected ? g.color : 'rgba(255, 255, 255, 0.08)'}`,
                  color: isSelected ? '#ffffff' : '#86868b',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isSelected ? `0 0 25px ${g.color}33` : 'none',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{g.heroImage}</span>
                <span>{g.title.split(' ')[0]} {g.title.split(' ')[1]}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Active Garment Spotlight Showcase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGarment}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="apple-glass"
            style={{
              borderRadius: '32px',
              padding: '44px',
              marginBottom: '64px',
              border: `1px solid ${selected.color}44`,
              boxShadow: `0 30px 80px rgba(0, 0, 0, 0.8), 0 0 50px ${selected.color}15`,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '36px',
                alignItems: 'center',
              }}
            >
              {/* Left Column: Garment Specs & Story */}
              <div style={{ gridColumn: 'span 12' }} id="couture-left-col">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: selected.color, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {selected.designer}
                  </span>
                </div>

                <h3 style={{ fontSize: '2.4rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', marginBottom: '8px' }}>
                  {selected.title}
                </h3>

                <p style={{ fontSize: '1.1rem', color: '#64d2ff', fontWeight: 500, marginBottom: '20px' }}>
                  {selected.tagline}
                </p>

                <p style={{ color: '#a1a1a6', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px' }}>
                  {selected.details}
                </p>

                {/* Technical Protocol Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
                  {selected.protocols.map((proto) => (
                    <div key={proto} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: `${selected.color}22`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <CheckCircle2 size={14} color={selected.color} />
                      </div>
                      <span style={{ fontSize: '0.92rem', color: '#d2d2d7', fontWeight: 500 }}>
                        {proto}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Garment Spec Badges */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '12px',
                    marginBottom: '32px',
                  }}
                >
                  {selected.specs.map((s) => (
                    <div
                      key={s.label}
                      style={{
                        padding: '14px',
                        borderRadius: '14px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                      }}
                    >
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{s.val}</div>
                      <div style={{ fontSize: '0.72rem', color: '#86868b', marginTop: '2px' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onOpenBooking}
                  className="apple-btn-primary"
                  style={{ padding: '14px 30px', fontSize: '0.96rem' }}
                >
                  <Sparkles size={16} />
                  <span>Reserve Atelier Care for this Garment</span>
                </motion.button>
              </div>

              {/* Right Column: Live Robotic Laser Inspection Video */}
              <div style={{ gridColumn: 'span 12' }} id="couture-right-col">
                <div
                  style={{
                    position: 'relative',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    boxShadow: `0 20px 50px rgba(0, 0, 0, 0.7), 0 0 35px ${selected.color}25`,
                    aspectRatio: '4 / 3',
                    background: '#040508',
                  }}
                >
                  <video
                    src="./videos/Create_detailed_e2e_video_20261008222901.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    onTimeUpdate={(e) => {
                      if (e.target.currentTime >= 7.5 || e.target.currentTime < 4.8) {
                        e.target.currentTime = 5.0;
                      }
                    }}
                    onLoadedMetadata={(e) => {
                      e.target.currentTime = 5.0;
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'contrast(1.1) brightness(0.9)',
                    }}
                  />
                  {/* Subtle Top & Bottom Vignette */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
                      pointerEvents: 'none',
                    }}
                  />
                  {/* Live Laser Optics Callout */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '16px',
                      right: '16px',
                      padding: '10px 16px',
                      borderRadius: '14px',
                      background: 'rgba(12, 13, 18, 0.85)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff375f' }} />
                      <span style={{ fontSize: '0.74rem', color: '#fff', fontWeight: 600 }}>
                        Robotic Laser Alignment Active
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#ff375f', fontWeight: 700 }}>
                      ±0.2 MM TOLERANCE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Interactive Interactive Fiber Comparison Slider: Before vs After */}
        <div
          className="apple-glass-card"
          style={{
            padding: '40px',
            borderRadius: '28px',
            marginBottom: '64px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64d2ff', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              MICROSCOPIC FIBER DIAGNOSTIC
            </span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
              Conventional Dry Cleaning vs. Mr &amp; Mrs Laundry
            </h3>
            <p style={{ color: '#86868b', fontSize: '0.9rem', marginTop: '6px' }}>
              Drag the interactive slider below to inspect wool yarn under 400x optical magnification.
            </p>
          </div>

          {/* Interactive Split View Box */}
          <div
            style={{
              position: 'relative',
              height: '240px',
              borderRadius: '20px',
              overflow: 'hidden',
              background: '#090a0f',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              userSelect: 'none',
            }}
            onMouseMove={(e) => {
              if (isDraggingSlider) {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = ((e.clientX - rect.left) / rect.width) * 100;
                setSliderPosition(Math.max(10, Math.min(90, pos)));
              }
            }}
            onMouseDown={() => setIsDraggingSlider(true)}
            onMouseUp={() => setIsDraggingSlider(false)}
            onMouseLeave={() => setIsDraggingSlider(false)}
          >
            {/* Left Side: Traditional Dry Cleaning (Damaged) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                width: `${sliderPosition}%`,
                background: 'linear-gradient(135deg, #1f1214 0%, #2b171a 100%)',
                overflow: 'hidden',
                borderRight: '2px solid #ffffff',
                zIndex: 2,
              }}
            >
              <div style={{ padding: '24px', width: '600px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: 'rgba(255, 69, 58, 0.2)',
                    color: '#ff453a',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginBottom: '10px',
                  }}
                >
                  BEFORE: CONVENTIONAL DRY CLEANING
                </span>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.25rem' }}>
                  Micro-Fractured Fiber Matrix
                </div>
                <p style={{ color: '#ff9f9c', fontSize: '0.85rem', marginTop: '8px', maxWidth: '380px', lineHeight: 1.4 }}>
                  • Perchloroethylene chemical residue strips natural lanolin{'\n'}
                  • Flattened fibers cause premature shiny patches on lapels{'\n'}
                  • Thread tension fatigue degrades suit drape
                </p>
              </div>
            </div>

            {/* Right Side: Mr & Mrs HydroSonic Clean (Restored) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, #0b1a29 0%, #0d2847 100%)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                textAlign: 'right',
                zIndex: 1,
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: 'rgba(48, 209, 88, 0.2)',
                  color: '#30d158',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  marginBottom: '10px',
                }}
              >
                AFTER: MR &amp; MRS HYDROSONIC™
              </span>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.25rem' }}>
                Bionic Fiber Restoration
              </div>
              <p style={{ color: '#64d2ff', fontSize: '0.85rem', marginTop: '8px', maxWidth: '380px', lineHeight: 1.4 }}>
                • 0% harsh chemistry; purified ionic vapor bath{'\n'}
                • Natural fiber fluff and bounce preserved for decades{'\n'}
                • Deep color richness locked with cryogenic ozone
              </p>
            </div>

            {/* Draggable Divider Handle */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `calc(${sliderPosition}% - 18px)`,
                width: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                cursor: 'ew-resize',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  boxShadow: '0 0 20px rgba(0, 0, 0, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                }}
              >
                ↔
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Wardrobe Architecture */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          <div className="apple-glass-card" style={{ padding: '28px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(41, 151, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Scissors size={20} color="#2997ff" />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              Anatomical Torso Forming
            </h4>
            <p style={{ color: '#86868b', fontSize: '0.84rem', lineHeight: 1.5 }}>
              Suits and bespoke blazers are steamed over three-dimensional pneumatic forms rather than crushed under heavy flatbed irons.
            </p>
          </div>

          <div className="apple-glass-card" style={{ padding: '28px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(191, 90, 242, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Gem size={20} color="#bf5af2" />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              Button &amp; Hardware Armour
            </h4>
            <p style={{ color: '#86868b', fontSize: '0.84rem', lineHeight: 1.5 }}>
              Mother-of-pearl, hand-carved horn, and 24K gold designer buttons are individually enveloped in magnetic silicone shields.
            </p>
          </div>

          <div className="apple-glass-card" style={{ padding: '28px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(255, 159, 10, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Wind size={20} color="#ff9f0a" />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              Kiln-Dried Cedar Vaults
            </h4>
            <p style={{ color: '#86868b', fontSize: '0.84rem', lineHeight: 1.5 }}>
              Every jacket is delivered on broad 5.5cm shoulder contours sculpted from red cedar that naturally deters moths.
            </p>
          </div>

          <div className="apple-glass-card" style={{ padding: '28px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(48, 209, 88, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <HeartHandshake size={20} color="#30d158" />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              $25,000 Wardrobe Indemnity
            </h4>
            <p style={{ color: '#86868b', fontSize: '0.84rem', lineHeight: 1.5 }}>
              Full replacement value protection for archival runway pieces, vintage couture, and bespoke tailoring from pickup to delivery.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          #couture-left-col {
            grid-column: span 7 !important;
          }
          #couture-right-col {
            grid-column: span 5 !important;
          }
        }
      `}</style>
    </section>
  );
}
