import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Activity, ShieldCheck, Truck, Wind, Droplets, Zap, Scan, Layers, Check } from 'lucide-react';

// Reusable Apple Spotlight Glass Card with cursor-tracking glare
function SpotlightCard({ children, className = '', style = {}, id }) {
  const [coords, setCoords] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setCoords((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      id={id}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`apple-glass-card ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Glare spotlight following cursor */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: coords.opacity,
          transition: 'opacity 0.25s ease',
          background: `radial-gradient(420px circle at ${coords.x}px ${coords.y}px, rgba(41, 151, 255, 0.14), transparent 75%)`,
          zIndex: 1,
        }}
      />
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {children}
      </div>
    </motion.div>
  );
}

export default function BentoGrid() {
  // Card 1: Interactive frequency scrubber
  const [freq, setFreq] = useState(48);
  // Card 2: Interactive Sterilization toggle
  const [ozoneActive, setOzoneActive] = useState(true);
  // Card 3: Fabric Scanner toggle
  const [scannedFabric, setScannedFabric] = useState('cashmere');

  const fabrics = {
    cashmere: { name: 'Scottish Cashmere', weave: 'Twill 2-ply', moisture: '14.2%', tension: 'Zero Stress' },
    silk: { name: 'Mulberry Silk Charmeuse', weave: 'Satin 19 momme', moisture: '11.0%', tension: 'Floating' },
    denim: { name: 'Japanese Raw Selvedge', weave: '3x1 Right Hand', moisture: '8.4%', tension: 'Indigo Shield' },
  };

  // Soundwave canvas for Card 1
  const waveCanvasRef = useRef(null);
  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;
    let t = 0;

    const renderWave = () => {
      const w = (canvas.width = canvas.offsetWidth * 2);
      const h = (canvas.height = canvas.offsetHeight * 2);
      ctx.clearRect(0, 0, w, h);

      ctx.lineWidth = 3;
      ctx.strokeStyle = '#2997ff';
      ctx.beginPath();

      const waveCount = freq / 12;
      for (let x = 0; x < w; x++) {
        const y = h / 2 + Math.sin(x * 0.02 * waveCount + t) * (h * 0.28) * Math.sin(x / w * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Second harmonic line
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(100, 210, 255, 0.4)';
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const y = h / 2 + Math.cos(x * 0.03 * waveCount - t * 1.5) * (h * 0.18) * Math.sin(x / w * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      t += 0.05;
      frameId = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => cancelAnimationFrame(frameId);
  }, [freq]);

  return (
    <section
      id="specs"
      style={{
        padding: '120px 0',
        backgroundColor: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient lighting */}
      <div
        className="ambient-glow glow-blue"
        style={{
          width: '600px',
          height: '600px',
          left: '-10%',
          top: '30%',
          opacity: 0.25,
        }}
      />
      <div
        className="ambient-glow glow-cyan"
        style={{
          width: '500px',
          height: '500px',
          right: '-5%',
          bottom: '10%',
          opacity: 0.2,
        }}
      />

      <div className="container-max" style={{ position: 'relative', zIndex: 10 }}>
        {/* Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="apple-pill-badge" style={{ marginBottom: '16px' }}>
            <Activity size={14} />
            <span>Proprietary Hardware &amp; Chemistry</span>
          </div>
          <h2 className="headline-section" style={{ marginBottom: '18px' }}>
            Engineered from the molecule up.
          </h2>
          <p className="subheadline" style={{ maxWidth: '640px', margin: '0 auto' }}>
            Five distinct technological breakthroughs that make traditional dry cleaning obsolete.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '24px',
          }}
        >
          {/* Card 1: HydroSonic (Span 8 cols on desktop) */}
          <SpotlightCard
            id="bento-card-1"
            style={{
              gridColumn: 'span 12',
              padding: '36px',
              minHeight: '420px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '32px',
                alignItems: 'center',
              }}
            >
              {/* Left Column: Specs & Freq Controller */}
              <div style={{ gridColumn: 'span 12' }} id="bento-card-1-left">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Zap size={20} color="#2997ff" />
                  <span style={{ fontSize: '0.8rem', color: '#2997ff', fontWeight: 700, letterSpacing: '0.06em' }}>
                    CORE BREAKTHROUGH • LIVE DRUM OPTICS
                  </span>
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                  HydroSonic™ Micro-Cavitation
                </h3>
                <p style={{ color: '#86868b', fontSize: '0.96rem', lineHeight: 1.5, marginBottom: '20px' }}>
                  Ultrasonic soundwaves collapse 4.2 million micro-cavitation bubbles every second. High-speed fluid dynamics dislodge stubborn particulates without mechanical friction.
                </p>

                {/* Interactive Wave Visualizer */}
                <div
                  style={{
                    height: '80px',
                    borderRadius: '14px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden',
                    position: 'relative',
                    marginBottom: '14px',
                  }}
                >
                  <canvas ref={waveCanvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '12px',
                      fontSize: '0.74rem',
                      color: '#64d2ff',
                      fontWeight: 600,
                    }}
                  >
                    {freq} kHz • ACTIVE RESONANCE
                  </div>
                </div>

                {/* Slider Controller */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#86868b' }}>Frequency:</span>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={freq}
                    onChange={(e) => setFreq(Number(e.target.value))}
                    style={{ flex: 1, accentColor: '#2997ff', cursor: 'pointer' }}
                    aria-label="Frequency tuning slider"
                  />
                  <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700, minWidth: '60px' }}>
                    {freq} kHz
                  </span>
                </div>
              </div>

              {/* Right Column: Live Looping Cinema Piece */}
              <div style={{ gridColumn: 'span 12' }} id="bento-card-1-right">
                <div
                  style={{
                    position: 'relative',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(41, 151, 255, 0.25)',
                    aspectRatio: '16 / 10',
                    background: '#050508',
                  }}
                >
                  <video
                    src="./videos/Appliance_washing_clothes_in_drum_20261008222901.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'contrast(1.08) brightness(0.95)',
                    }}
                  />
                  {/* Subtle Vignette Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
                      pointerEvents: 'none',
                    }}
                  />
                  {/* Glass Pill Callout */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      right: '12px',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      background: 'rgba(15, 16, 22, 0.75)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#30d158' }} />
                      <span style={{ fontSize: '0.74rem', color: '#f5f5f7', fontWeight: 600 }}>
                        Continuous Hydrodynamic Vortex
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64d2ff', fontWeight: 700 }}>
                      1,450 RPM • ZERO WEAR
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 2: Ozone Molecular Sterilization (Span 4 cols) */}
          <SpotlightCard
            id="bento-card-2"
            style={{
              gridColumn: 'span 12',
              padding: '36px',
              minHeight: '380px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <ShieldCheck size={20} color="#bf5af2" />
                <span style={{ fontSize: '0.8rem', color: '#bf5af2', fontWeight: 700, letterSpacing: '0.06em' }}>
                  99.99% ELIMINATION
                </span>
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                Ozone Sterilization
              </h3>
              <p style={{ color: '#86868b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Medical-grade O₃ penetrates porous fabric structures to dismantle viruses, mold spores, and persistent odor molecules.
              </p>
            </div>

            {/* Interactive Before / After Toggle */}
            <div
              style={{
                borderRadius: '18px',
                padding: '18px',
                background: ozoneActive ? 'rgba(191, 90, 242, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${ozoneActive ? 'rgba(191, 90, 242, 0.35)' : 'rgba(255, 255, 255, 0.08)'}`,
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: ozoneActive ? '#bf5af2' : '#86868b' }}>
                  {ozoneActive ? 'STERILIZATION ACTIVE' : 'STANDARD RINSE'}
                </span>
                <button
                  onClick={() => setOzoneActive(!ozoneActive)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: ozoneActive ? '#bf5af2' : 'rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  aria-label="Toggle Ozone Sterilization"
                >
                  {ozoneActive ? 'Turn Off' : 'Engage O₃'}
                </button>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
                {ozoneActive ? '0.001%' : '14.8%'}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#86868b', marginTop: '2px' }}>
                Residual allergen and microbial colony count
              </div>
            </div>
          </SpotlightCard>

          {/* Card 3: Fabric Scanner (Span 4 cols) */}
          <SpotlightCard
            id="bento-card-3"
            style={{
              gridColumn: 'span 12',
              padding: '36px',
              minHeight: '360px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Scan size={20} color="#30d158" />
                <span style={{ fontSize: '0.8rem', color: '#30d158', fontWeight: 700, letterSpacing: '0.06em' }}>
                  SPECTRAL DIAGNOSIS
                </span>
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                Fiber Recognition
              </h3>
              <p style={{ color: '#86868b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Near-infrared optical sensors detect yarn composition and dye stability within 180 milliseconds.
              </p>
            </div>

            {/* Fabric Tabs */}
            <div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                {Object.keys(fabrics).map((key) => (
                  <button
                    key={key}
                    onClick={() => setScannedFabric(key)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: scannedFabric === key ? 'rgba(48, 209, 88, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      color: scannedFabric === key ? '#30d158' : '#86868b',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    aria-label={`Select fabric ${key}`}
                  >
                    {key.toUpperCase()}
                  </button>
                ))}
              </div>

              <div
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                  {fabrics[scannedFabric].name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#86868b' }}>
                  <span>Weave: {fabrics[scannedFabric].weave}</span>
                  <span style={{ color: '#30d158' }}>{fabrics[scannedFabric].tension}</span>
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 4: Electric Fleet (Span 4 cols) */}
          <SpotlightCard
            id="bento-card-4"
            style={{
              gridColumn: 'span 12',
              padding: '36px',
              minHeight: '360px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Truck size={20} color="#64d2ff" />
                <span style={{ fontSize: '0.8rem', color: '#64d2ff', fontWeight: 700, letterSpacing: '0.06em' }}>
                  ZERO EMISSION FLEET
                </span>
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                2-Hour Concierge
              </h3>
              <p style={{ color: '#86868b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Customized climate-controlled electric transport vans equipped with anti-crease vertical hanging rails.
              </p>
            </div>

            {/* Animated Route simulation */}
            <div
              style={{
                borderRadius: '16px',
                padding: '16px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '8px' }}>
                <span style={{ color: '#86868b' }}>Van #42 En Route</span>
                <span style={{ color: '#30d158', fontWeight: 700 }}>ETA 24 Mins</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <motion.div
                  animate={{ width: ['35%', '85%', '35%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #0071e3, #64d2ff)',
                    borderRadius: '999px',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#86868b', marginTop: '8px' }}>
                <span>Facility Hub</span>
                <span>Your Doorstep</span>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 5: Closed-Loop Drying & Vault (Span 4 cols) */}
          <SpotlightCard
            id="bento-card-5"
            style={{
              gridColumn: 'span 12',
              padding: '36px',
              minHeight: '360px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Wind size={20} color="#ff9f0a" />
                <span style={{ fontSize: '0.8rem', color: '#ff9f0a', fontWeight: 700, letterSpacing: '0.06em' }}>
                  THERMODYNAMIC PURITY
                </span>
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                Dehumidified Air Loop
              </h3>
              <p style={{ color: '#86868b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Zero destructive centrifugal heat. Dehydrated air stream at an exact 36°C preserves wool elasticity and crispness.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '16px',
              }}
            >
              <div
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>36°C</div>
                <div style={{ fontSize: '0.7rem', color: '#86868b' }}>Max Temp</div>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#30d158' }}>-58%</div>
                <div style={{ fontSize: '0.7rem', color: '#86868b' }}>Fiber Shrink</div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          #bento-card-1 {
            grid-column: span 12 !important;
          }
          #bento-card-1-left {
            grid-column: span 6 !important;
          }
          #bento-card-1-right {
            grid-column: span 6 !important;
          }
          #bento-card-2 {
            grid-column: span 4 !important;
          }
          #bento-card-3 {
            grid-column: span 4 !important;
          }
          #bento-card-4 {
            grid-column: span 4 !important;
          }
          #bento-card-5 {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}
