import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Play, Sparkles, Wind, Waves, ShieldCheck, Flame, RotateCw, Zap } from 'lucide-react';

export default function HeroSection({ onOpenBooking, onCycleChange }) {
  const [activeMode, setActiveMode] = useState('hydrosonic');
  const [isWashing, setIsWashing] = useState(false);
  const [rpm, setRpm] = useState(1200);
  const [drumView, setDrumView] = useState('canvas'); // 'canvas' | 'video'
  const canvasRef = useRef(null);
  const drumVideoRef = useRef(null);

  // Sync video playbackRate with mode & acceleration
  useEffect(() => {
    if (drumVideoRef.current) {
      const speed = isWashing ? 1.8 : activeMode === 'delicate' ? 0.75 : activeMode === 'ozone' ? 1.4 : 1.0;
      drumVideoRef.current.playbackRate = speed;
    }
  }, [activeMode, isWashing, drumView]);

  const washModes = {
    delicate: {
      name: 'Delicate Silk & Wool',
      rpm: 420,
      temp: '28°C Cold Ionic',
      soundHz: '24 kHz',
      color: '#64d2ff',
      glow: 'rgba(100, 210, 255, 0.4)',
      description: 'Zero fiber friction. Ultra-gentle fluid suspension for Mulberry silk and Loro Piana cashmere.',
    },
    hydrosonic: {
      name: 'HydroSonic™ Ultra',
      rpm: 1200,
      temp: '38°C Enzyme Active',
      soundHz: '48 kHz',
      color: '#2997ff',
      glow: 'rgba(41, 151, 255, 0.5)',
      description: 'Micro-cavitation bubbles dislodge microscopic particulates without degrading fabric tensile strength.',
    },
    ozone: {
      name: 'Ozone Sanitize Max',
      rpm: 1600,
      temp: '65°C Hyper-Steam',
      soundHz: '64 kHz',
      color: '#bf5af2',
      glow: 'rgba(191, 90, 242, 0.5)',
      description: 'Hospital-grade molecular ozone eradication. 99.99% allergen, viral, and deep odor neutralization.',
    },
  };

  const currentMode = washModes[activeMode];

  // Canvas-based liquid bubble & vortex particle physics simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const displayWidth = canvas.offsetWidth;
    const displayHeight = canvas.offsetHeight;
    const centerX = displayWidth / 2;
    const centerY = displayHeight / 2;
    const drumRadius = Math.min(displayWidth, displayHeight) * 0.42;

    // Particle pool
    const particles = Array.from({ length: 65 }, () => ({
      angle: Math.random() * Math.PI * 2,
      distance: Math.random() * (drumRadius * 0.85),
      radius: Math.random() * 4 + 1.5,
      speed: (Math.random() * 0.02 + 0.01) * (activeMode === 'ozone' ? 1.8 : activeMode === 'delicate' ? 0.7 : 1.2),
      opacity: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * Math.PI,
    }));

    let rotationAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Determine rotation speed multiplier based on isWashing state
      const speedFactor = isWashing ? 2.8 : 1;
      const targetSpeed = (currentMode.rpm / 6000) * speedFactor;
      rotationAngle += targetSpeed;

      // Outer Drum Rim Glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        drumRadius * 0.4,
        centerX,
        centerY,
        drumRadius * 1.15
      );
      glowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      glowGrad.addColorStop(0.85, currentMode.glow);
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, drumRadius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // Outer Titanium Bezel
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, drumRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner Stainless Steel Drum Perforations
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotationAngle);

      // Baffles / Paddles
      for (let i = 0; i < 3; i++) {
        const baffleAngle = (i * Math.PI * 2) / 3;
        ctx.save();
        ctx.rotate(baffleAngle);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.beginPath();
        ctx.roundRect(drumRadius * 0.35, -7, drumRadius * 0.58, 14, [6, 12, 12, 6]);
        ctx.fill();

        ctx.strokeStyle = currentMode.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // Perforation dots ring
      for (let ring = 1; ring <= 4; ring++) {
        const ringRadius = drumRadius * (0.2 + ring * 0.18);
        const dotCount = 12 + ring * 8;
        for (let d = 0; d < dotCount; d++) {
          const dotAngle = (d * Math.PI * 2) / dotCount;
          const dx = Math.cos(dotAngle) * ringRadius;
          const dy = Math.sin(dotAngle) * ringRadius;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.beginPath();
          ctx.arc(dx, dy, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // Micro-Cavitation Particles & Bubbles
      particles.forEach((p) => {
        p.angle += p.speed * speedFactor;
        p.pulse += 0.03;
        const currentDistance = p.distance + Math.sin(p.pulse) * 12;
        const px = centerX + Math.cos(p.angle) * currentDistance;
        const py = centerY + Math.sin(p.angle) * currentDistance;

        ctx.fillStyle = currentMode.color;
        ctx.globalAlpha = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(px, py, p.radius * (isWashing ? 1.4 : 1), 0, Math.PI * 2);
        ctx.fill();

        // Shimmer highlight on bubbles
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = p.opacity * 0.8;
        ctx.beginPath();
        ctx.arc(px - p.radius * 0.3, py - p.radius * 0.3, p.radius * 0.35, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;

      // Center Crystal Axis Core
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, drumRadius * 0.32);
      coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
      coreGrad.addColorStop(0.6, 'rgba(15, 20, 30, 0.8)');
      coreGrad.addColorStop(1, 'rgba(8, 9, 13, 0.95)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, drumRadius * 0.32, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeMode, isWashing, currentMode]);

  const handleWashToggle = () => {
    setIsWashing(true);
    setTimeout(() => {
      setIsWashing(false);
    }, 4500);
  };

  const setMode = (modeKey) => {
    setActiveMode(modeKey);
    if (onCycleChange) {
      onCycleChange(washModes[modeKey]);
    }
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        paddingTop: '130px',
        paddingBottom: '80px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
      }}
    >
      {/* Ambient Looping Video Cinema Backdrop */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.18,
        }}
      >
        <video
          src="./videos/Create_detailed_e2e_video_20261008222901.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(3px) brightness(0.8)',
          }}
        />
        {/* Full-bleed Vignette Mask */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.92) 80%, #000000 100%)',
          }}
        />
      </div>

      {/* Apple Ambient Backlight Glows */}
      <div
        className="ambient-glow glow-blue"
        style={{
          width: '700px',
          height: '500px',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.35,
          zIndex: 2,
        }}
      />
      <div
        className="ambient-glow glow-purple"
        style={{
          width: '500px',
          height: '400px',
          top: '35%',
          right: '5%',
          opacity: 0.2,
          zIndex: 2,
        }}
      />

      <div className="container-max" style={{ width: '100%', position: 'relative', zIndex: 10 }}>
        {/* First Order Promotional Hook */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '14px' }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, rgba(255, 107, 107, 0.15) 0%, rgba(255, 159, 10, 0.15) 100%)',
              border: '1px solid rgba(255, 159, 10, 0.4)',
              boxShadow: '0 4px 20px rgba(255, 159, 10, 0.2)',
            }}
          >
            <span style={{ fontSize: '0.85rem' }}>🎁</span>
            <span style={{ fontSize: '0.82rem', color: '#ffb340', fontWeight: 700, letterSpacing: '0.04em' }}>
              FIRST TIME IN MUMBAI? GET ₹75 OFF YOUR 1ST PICKUP &bull; CODE: MUMBAI75
            </span>
          </div>
        </motion.div>

        {/* Apple Intro Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{ textAlign: 'center', marginBottom: '22px' }}
        >
          <div className="apple-pill-badge">
            <Sparkles size={14} color="#64d2ff" />
            <span>The New Era of Wardrobe Longevity</span>
          </div>
        </motion.div>

        {/* Hero Headlines */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', maxWidth: '960px', margin: '0 auto 24px' }}
        >
          <h1 className="headline-hero" style={{ whiteSpace: 'pre-line' }}>
            Pure Clean.{'\n'}
            <span className="gradient-blue-text">Engineered to Perfection.</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="subheadline"
          style={{
            textAlign: 'center',
            maxWidth: '680px',
            margin: '0 auto 36px',
            lineHeight: 1.6,
          }}
        >
          Mr &amp; Mrs Laundry replaces harsh mechanical abrasion with HydroSonic™ micro-cavitation and cryogenic ozone steam. 
          Your finest garments return crisper, softer, and renewed down to the molecular fiber.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: '48px',
          }}
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenBooking}
            className="apple-btn-primary"
            style={{ padding: '14px 34px', fontSize: '1.05rem' }}
          >
            <Sparkles size={18} />
            Schedule 2-Hour Pickup
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleWashToggle}
            className="apple-btn-secondary"
            style={{ padding: '14px 28px', fontSize: '1.02rem', gap: '10px' }}
          >
            {isWashing ? (
              <RotateCw size={18} className="animate-spin-slow" color="#2997ff" />
            ) : (
              <Play size={18} color="#2997ff" />
            )}
            <span>{isWashing ? 'Cycle In Progress...' : 'Simulate 1200 RPM Cycle'}</span>
          </motion.button>
        </motion.div>

        {/* Instant Value & Trust Strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px 18px',
            flexWrap: 'wrap',
            marginBottom: '44px',
            fontSize: '0.86rem',
            color: '#cbd5e1',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ color: '#64d2ff', fontWeight: 700 }}>🧺 Wash &amp; Fold ₹99/Kg</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ color: '#30d158', fontWeight: 700 }}>🛡️ 100% Individual Drums</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>(Zero Mixing)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ color: '#ffd60a', fontWeight: 700 }}>⚡ Free Doorstep Delivery</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>(Orders ₹399+)</span>
          </div>
        </motion.div>

        {/* Interactive 3D Drum Simulation Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="apple-glass"
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
            borderRadius: '32px',
            padding: '36px 28px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top Bar inside showcase */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '20px',
              marginBottom: '24px',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#86868b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Chamber Telemetry 01 • Active Simulation
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                {currentMode.name}
              </h3>
            </div>

            {/* Chamber Mode and Drum View Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* View Mode Toggle (3D Simulation vs 4K Drum Cam) */}
              <div
                style={{
                  display: 'flex',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '999px',
                  padding: '3px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                <button
                  onClick={() => setDrumView('canvas')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: 'none',
                    background: drumView === 'canvas' ? 'rgba(0, 113, 227, 0.7)' : 'transparent',
                    color: drumView === 'canvas' ? '#ffffff' : '#86868b',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  3D Particle Sim
                </button>
                <button
                  onClick={() => setDrumView('video')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: 'none',
                    background: drumView === 'video' ? 'rgba(0, 113, 227, 0.7)' : 'transparent',
                    color: drumView === 'video' ? '#ffffff' : '#86868b',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#30d158', display: 'inline-block' }} />
                  Live 4K Drum Cam
                </button>
              </div>

              {/* Mode Switcher Tabs */}
              <div
                style={{
                  display: 'flex',
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '999px',
                  padding: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  gap: '4px',
                }}
              >
                {Object.keys(washModes).map((key) => {
                  const mode = washModes[key];
                  const isSelected = activeMode === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setMode(key)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '999px',
                        border: 'none',
                        background: isSelected ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                        color: isSelected ? '#ffffff' : '#86868b',
                        fontWeight: isSelected ? 600 : 500,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        boxShadow: isSelected ? '0 2px 10px rgba(0, 0, 0, 0.3)' : 'none',
                      }}
                    >
                      {mode.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Drum Stage + Floating Metric Overlays */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '440px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Interactive Canvas Drum or Live 4K Drum Cam */}
            {drumView === 'canvas' ? (
              <canvas
                ref={canvasRef}
                style={{
                  width: '100%',
                  maxWidth: '480px',
                  height: '420px',
                  display: 'block',
                  cursor: 'pointer',
                }}
                onClick={handleWashToggle}
                title="Click to spin drum"
              />
            ) : (
              <div
                style={{
                  position: 'relative',
                  width: '420px',
                  height: '420px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `4px solid ${currentMode.color}`,
                  boxShadow: `0 0 45px ${currentMode.glow}, inset 0 0 35px rgba(0,0,0,0.8)`,
                  background: '#000',
                  cursor: 'pointer',
                }}
                onClick={handleWashToggle}
                title="Click to toggle drum acceleration"
              >
                <video
                  ref={drumVideoRef}
                  src="./videos/Appliance_washing_clothes_in_drum_20261008222901.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: `contrast(1.1) brightness(0.95)`,
                  }}
                />
                {/* Circular Glass Vignette */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.9), inset 0 0 20px rgba(255, 255, 255, 0.2)',
                    pointerEvents: 'none',
                  }}
                />
                {/* 4K Live Watermark */}
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '0.08em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#30d158' }} />
                  TITANIUM DRUM OPTICS 4K
                </div>
              </div>
            )}

            {/* Center Drum Icon / Overlay Callout */}
            <div
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <motion.div
                animate={{
                  scale: isWashing ? [1, 1.15, 1] : 1,
                  rotate: isWashing ? [0, 180, 360] : 0,
                }}
                transition={{ duration: isWashing ? 1.5 : 0.5, repeat: isWashing ? Infinity : 0 }}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(0, 113, 227, 0.35)',
                  backdropFilter: 'blur(10px)',
                  border: `2px solid ${currentMode.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  boxShadow: `0 0 25px ${currentMode.glow}`,
                }}
              >
                {activeMode === 'delicate' && <Waves size={28} color="#64d2ff" />}
                {activeMode === 'hydrosonic' && <Zap size={28} color="#2997ff" />}
                {activeMode === 'ozone' && <Flame size={28} color="#bf5af2" />}
              </motion.div>
              <span
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {isWashing ? 'ACCELERATING' : 'READY TO STERILIZE'}
              </span>
              <span style={{ fontSize: '0.78rem', color: currentMode.color, fontWeight: 600 }}>
                {isWashing ? `${currentMode.rpm * 1.5} RPM PEAK` : `${currentMode.rpm} RPM`}
              </span>
            </div>

            {/* Apple Floating Stat Cards Left & Right */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="apple-glass"
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '18px 22px',
                borderRadius: '20px',
                width: '210px',
                display: 'none',
              }}
              id="stat-card-left"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Waves size={16} color="#64d2ff" />
                <span style={{ fontSize: '0.75rem', color: '#86868b', fontWeight: 600 }}>ACOUSTIC FREQ</span>
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 700, color: '#fff' }}>
                {currentMode.soundHz}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#a1a1a6', marginTop: '4px' }}>
                Dislodges 0.2µm particulate without fiber strain.
              </p>
            </motion.div>

            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="apple-glass"
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '18px 22px',
                borderRadius: '20px',
                width: '210px',
                display: 'none',
              }}
              id="stat-card-right"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <ShieldCheck size={16} color="#30d158" />
                <span style={{ fontSize: '0.75rem', color: '#86868b', fontWeight: 600 }}>THERMAL STATE</span>
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 700, color: '#fff' }}>
                {currentMode.temp.split(' ')[0]}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#a1a1a6', marginTop: '4px' }}>
                Precision electronic temperature stabilization.
              </p>
            </motion.div>
          </div>

          {/* Bottom Feature Description */}
          <div
            style={{
              marginTop: '16px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <p style={{ fontSize: '0.92rem', color: '#a1a1a6', maxWidth: '650px', lineHeight: 1.5 }}>
              {currentMode.description}
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#86868b', display: 'block' }}>WATER RECOVERY</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#30d158' }}>94.6% Closed-Loop</span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#86868b', display: 'block' }}>MICROPLASTICS</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#64d2ff' }}>0.00% Zero-Loss</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          #stat-card-left, #stat-card-right {
            display: block !important;
          }
        }
      `}</style>
    </section>
  );
}
