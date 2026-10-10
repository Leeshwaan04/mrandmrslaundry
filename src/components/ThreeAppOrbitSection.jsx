import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import {
  Sparkles,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Waves,
  Flame,
  Wind,
  ShieldCheck,
  Package,
  Layers,
  RotateCw,
  Gauge,
  Thermometer,
  Zap,
  CheckCircle2,
} from 'lucide-react';

const ORBIT_STAGES = [
  {
    id: 1,
    stageNum: '01',
    code: 'STAGE 01 // ULTRASONIC CAVITATION',
    title: 'Ultrasonic Ionic Saturation',
    subtitle: 'Molecular Pre-Soak & Enzyme Suspension',
    description:
      'The titanium drum initiates a calibrated 420 RPM counter-rotation. Reverse-osmosis fluid enriched with 24 kHz ultrasonic micro-cavitation penetrates deep weave fibers without mechanical fabric friction.',
    icon: Waves,
    color: '#64d2ff',
    glow: 'rgba(100, 210, 255, 0.45)',
    specs: [
      { label: 'Drum Velocity', value: '420 RPM' },
      { label: 'Cavitation Freq', value: '24.2 kHz' },
      { label: 'Bath Temp', value: '28°C Cold' },
      { label: 'Fiber Stress', value: '0.00% Zero' },
    ],
    fabrics: ['Mulberry Silk', 'Pashmina', 'Fine Cotton', 'Cashmere'],
  },
  {
    id: 2,
    stageNum: '02',
    code: 'STAGE 02 // DUAL-HELIX VORTEX',
    title: 'Laminar Fluid Hydrodynamics',
    subtitle: 'Counter-Rotational Liquid Suspension',
    description:
      'Water forms twin helical vortices along aircraft-grade perforated baffles. Garments float in perpetual zero-gravity fluid suspension, effortlessly dislodging particulate grime from delicate weaves.',
    icon: RotateCw,
    color: '#2997ff',
    glow: 'rgba(41, 151, 255, 0.45)',
    specs: [
      { label: 'Vortex Current', value: '980 RPM' },
      { label: 'Fluid Pressure', value: '1.8 Bar' },
      { label: 'Stain Lift Rate', value: '99.4%' },
      { label: 'Tangle Ratio', value: '0.0% None' },
    ],
    fabrics: ['Chiffon Sarees', 'Linen Shirts', 'Designer Kurtas', 'Merino Wool'],
  },
  {
    id: 3,
    stageNum: '03',
    code: 'STAGE 03 // THERMAL EXTRACTION',
    title: 'Thermostatic Precision Cleanse',
    subtitle: 'Active Enzyme Activation & Lipid Dissolution',
    description:
      'Algorithmic heating matrices maintain water temperature to within 0.2°C precision. Bio-surfactants dissolve oily residue and collar soil while locking pigment molecules to protect color brilliance.',
    icon: Flame,
    color: '#bf5af2',
    glow: 'rgba(191, 90, 242, 0.45)',
    specs: [
      { label: 'Target Temp', value: '38.4°C' },
      { label: 'Thermal Delta', value: '±0.18°C' },
      { label: 'pH Balance', value: '7.1 Neutral' },
      { label: 'Color Lock', value: '100% Intact' },
    ],
    fabrics: ['Bespoke Suits', 'Tuxedos', 'Embroidered Lehengas', 'Silk Brocade'],
  },
  {
    id: 4,
    stageNum: '04',
    code: 'STAGE 04 // 1400-RPM AERODYNAMICS',
    title: 'Centrifugal Anti-Crease Extraction',
    subtitle: 'High-G Controlled Moisture Dispersal',
    description:
      'Harmonic motor ramps up to 1400 RPM while high-velocity ambient air currents cushion garments against drum walls. Extracts 94% of moisture without mechanical creasing or friction damage.',
    icon: Wind,
    color: '#30d158',
    glow: 'rgba(48, 209, 88, 0.45)',
    specs: [
      { label: 'Extraction G-Force', value: '520 G' },
      { label: 'Max Drum Speed', value: '1400 RPM' },
      { label: 'Moisture Evac', value: '94.2%' },
      { label: 'Crease Index', value: 'Grade 4.8 / 5' },
    ],
    fabrics: ['Formal Trousers', 'Cotton Blends', 'Denim', 'Duvet Covers'],
  },
  {
    id: 5,
    stageNum: '05',
    code: 'STAGE 05 // NANO-VAPOR MATRIX',
    title: 'Hydro-Steam Fiber Rejuvenation',
    subtitle: 'Thermal Form Dressing & Sterilization',
    description:
      'Micro-atomized 110°C steam relaxes fabric yarns, restoring drape and volume while destroying 99.9% of bacteria, allergens, and dust mites. Clothes emerge revitalized without harsh chemicals.',
    icon: Zap,
    color: '#ff9f0a',
    glow: 'rgba(255, 159, 10, 0.45)',
    specs: [
      { label: 'Vapor Steam Temp', value: '110°C' },
      { label: 'Sanitization', value: '99.99%' },
      { label: 'Micro-Droplets', value: '15 Micron' },
      { label: 'Aroma Infusion', value: 'Alpine Cedar' },
    ],
    fabrics: ['Cashmere Overcoats', 'Wedding Gowns', 'Velvet', 'Silk Ties'],
  },
  {
    id: 6,
    stageNum: '06',
    code: 'STAGE 06 // HERMETIC CLEANROOM',
    title: 'Antimicrobial Cleanroom Packaging',
    subtitle: 'Zero-Touch Sealed Wardrobe Preservation',
    description:
      'Cleaned items are transported to our positive-pressure cleanroom where they are individually steam-hung or crisp-folded into biodegradable, antimicrobial garment shields with tamper-evident seals.',
    icon: Package,
    color: '#ff375f',
    glow: 'rgba(255, 55, 95, 0.45)',
    specs: [
      { label: 'Air Purity', value: 'HEPA ISO 7' },
      { label: 'Packaging', value: 'Anti-Static Eco' },
      { label: 'Tracking', value: 'RFID Tagged' },
      { label: 'Doorstep Shield', value: '100% Sealed' },
    ],
    fabrics: ['Full Wardrobes', 'Sneakers', 'Luxury Handbags', 'All Deliveries'],
  },
];

export default function ThreeAppOrbitSection({ onOpenBooking }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAutoOrbit, setIsAutoOrbit] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const threeCanvasRef = useRef(null);
  const autoOrbitTimerRef = useRef(null);

  // Three.js Background Ambient Orbit Engine
  useEffect(() => {
    const canvas = threeCanvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4, 16);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Orbital Rings
    const ringRadius = 7.5;
    const ringSegments = 120;
    const ringGeometry = new THREE.BufferGeometry();
    const positions = [];
    for (let i = 0; i <= ringSegments; i++) {
      const theta = (i / ringSegments) * Math.PI * 2;
      positions.push(Math.sin(theta) * ringRadius, 0, Math.cos(theta) * ringRadius * 0.45);
    }
    ringGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const ringMaterial = new THREE.LineBasicMaterial({
      color: 0x2997ff,
      transparent: true,
      opacity: 0.28,
    });
    const orbitRing = new THREE.Line(ringGeometry, ringMaterial);
    scene.add(orbitRing);

    // Outer faint orbit ring
    const outerGeometry = new THREE.BufferGeometry();
    const outerPositions = [];
    for (let i = 0; i <= ringSegments; i++) {
      const theta = (i / ringSegments) * Math.PI * 2;
      outerPositions.push(Math.sin(theta) * (ringRadius + 2.2), 0, Math.cos(theta) * (ringRadius + 2.2) * 0.45);
    }
    outerGeometry.setAttribute('position', new THREE.Float32BufferAttribute(outerPositions, 3));
    const outerMaterial = new THREE.LineDashedMaterial({
      color: 0x64d2ff,
      dashSize: 0.4,
      gapSize: 0.2,
      transparent: true,
      opacity: 0.14,
    });
    const outerOrbitRing = new THREE.Line(outerGeometry, outerMaterial);
    scene.add(outerOrbitRing);

    // Floating Starlight Particles
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x64d2ff);
    const color2 = new THREE.Color(0xbf5af2);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = ringRadius * (0.6 + Math.random() * 0.8);
      pPositions[i * 3] = Math.sin(theta) * r;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      pPositions[i * 3 + 2] = Math.cos(theta) * (r * 0.48);

      const mixed = color1.clone().lerp(color2, Math.random());
      pColors[i * 3] = mixed.r;
      pColors[i * 3 + 1] = mixed.g;
      pColors[i * 3 + 2] = mixed.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Central Glowing Beacon
    const coreGeo = new THREE.SphereGeometry(0.65, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x0071e3,
      transparent: true,
      opacity: 0.45,
      wireframe: true,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      orbitRing.rotation.y = elapsed * 0.08;
      outerOrbitRing.rotation.y = -elapsed * 0.05;
      particles.rotation.y = elapsed * 0.04;
      core.rotation.y = elapsed * 0.15;
      core.rotation.x = Math.sin(elapsed * 0.5) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      outerGeometry.dispose();
      outerMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
    };
  }, []);

  // Auto-Orbit Interval Engine
  useEffect(() => {
    if (!isAutoOrbit) return;
    autoOrbitTimerRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % ORBIT_STAGES.length);
    }, 4200);

    return () => clearInterval(autoOrbitTimerRef.current);
  }, [isAutoOrbit]);

  const handleSelectStage = (idx) => {
    setActiveIdx(idx);
    setIsAutoOrbit(false);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % ORBIT_STAGES.length);
    setIsAutoOrbit(false);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + ORBIT_STAGES.length) % ORBIT_STAGES.length);
    setIsAutoOrbit(false);
  };

  const currentStage = ORBIT_STAGES[activeIdx];

  return (
    <section
      id="threeui-app-orbit"
      style={{
        position: 'relative',
        backgroundColor: '#020306',
        padding: '120px 24px 100px 24px',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 20,
      }}
    >
      {/* Background Three.js Orbital Canvas */}
      <canvas
        ref={threeCanvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.85,
        }}
      />

      {/* Ambient Lighting Gradients */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '450px',
          background: `radial-gradient(circle, ${currentStage.color}22 0%, rgba(0,0,0,0) 70%)`,
          filter: 'blur(90px)',
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'background 0.8s ease',
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Section Header with TasteSkill Monospace Badges */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(41, 151, 255, 0.1)',
              border: '1px solid rgba(41, 151, 255, 0.3)',
              marginBottom: '16px',
              backdropFilter: 'blur(16px)',
            }}
          >
            <span className="live-beacon" />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: '#64d2ff',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              [ THREEUI APP ORBIT DYNAMICS // 6-STAGE ENGINE ]
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: '16px',
            }}
          >
            Tactile 3D Stage Orbit
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#86868b',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Explore our industrial wash cycles arranged in a continuous 3D perspective orbit. Direct focus,
            tactile docking, and micro-physics inspection for every textile grade.
          </p>
        </div>

        {/* 3D Spatial Orbit Carousel Viewport */}
        <div
          style={{
            position: 'relative',
            height: '460px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1300px',
            perspectiveOrigin: 'center 40%',
            marginBottom: '40px',
          }}
        >
          {/* Orbital Stages Decks */}
          {ORBIT_STAGES.map((stage, idx) => {
            const count = ORBIT_STAGES.length;
            // Calculate relative offset from activeIdx (-2, -1, 0, 1, 2, 3)
            let diff = (idx - activeIdx) % count;
            if (diff > count / 2) diff -= count;
            if (diff < -count / 2) diff += count;

            const isCenter = diff === 0;
            const absDiff = Math.abs(diff);

            // Elliptical 3D positioning
            const angleRad = (diff / count) * Math.PI * 2;
            const xOffset = Math.sin(angleRad) * 440; // horizontal spread
            const zOffset = (Math.cos(angleRad) - 1) * 320; // 3D depth backward
            const rotY = -diff * 22; // rotate toward center
            const scale = Math.max(1 - absDiff * 0.16, 0.65);
            const opacity = Math.max(1 - absDiff * 0.28, 0.2);
            const zIndex = 20 - Math.round(absDiff * 4);

            return (
              <motion.div
                key={stage.id}
                onClick={() => handleSelectStage(idx)}
                animate={{
                  x: xOffset,
                  z: zOffset,
                  rotateY: rotY,
                  scale: isCenter ? 1.05 : scale,
                  opacity: isCenter ? 1 : opacity,
                }}
                transition={{
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  position: 'absolute',
                  width: 'min(420px, 86vw)',
                  transformStyle: 'preserve-3d',
                  zIndex,
                  cursor: isCenter ? 'default' : 'pointer',
                  pointerEvents: absDiff > 2 ? 'none' : 'auto',
                }}
              >
                {/* Sculpted ThreeUI Glass Deck */}
                <div
                  style={{
                    background: isCenter
                      ? 'linear-gradient(180deg, rgba(16, 18, 28, 0.45) 0%, rgba(8, 10, 16, 0.65) 100%)'
                      : 'rgba(10, 12, 18, 0.25)',
                    backdropFilter: 'blur(28px) saturate(190%)',
                    WebkitBackdropFilter: 'blur(28px) saturate(190%)',
                    border: isCenter
                      ? `1px solid ${stage.color}66`
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    borderTop: isCenter
                      ? `1px solid ${stage.color}`
                      : '1px solid rgba(255, 255, 255, 0.16)',
                    borderRadius: '24px',
                    padding: '28px 28px',
                    boxShadow: isCenter
                      ? `0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px ${stage.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
                      : '0 16px 36px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
                    transition: 'border 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  {/* Card Header with Icon & Monospace Code */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${stage.color}25 0%, rgba(255,255,255,0.03) 100%)`,
                        border: `1px solid ${stage.color}55`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <stage.icon size={22} color={stage.color} />
                    </div>

                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: stage.color,
                        letterSpacing: '0.06em',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      {stage.code}
                    </span>
                  </div>

                  {/* Stage Title & Subtitle */}
                  <h3
                    style={{
                      fontSize: '1.38rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      letterSpacing: '-0.02em',
                      marginBottom: '4px',
                    }}
                  >
                    {stage.title}
                  </h3>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      color: stage.color,
                      fontWeight: 600,
                      marginBottom: '12px',
                    }}
                  >
                    {stage.subtitle}
                  </div>

                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: '#a1a1a6',
                      lineHeight: 1.55,
                      marginBottom: '18px',
                      display: '-webkit-box',
                      WebkitLineClamp: isCenter ? 4 : 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {stage.description}
                  </p>

                  {/* Micro Specs Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '8px',
                      paddingTop: '14px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    {stage.specs.slice(0, 2).map((sp) => (
                      <div key={sp.label}>
                        <div style={{ fontSize: '0.68rem', color: '#86868b', textTransform: 'uppercase' }}>
                          {sp.label}
                        </div>
                        <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#fff', marginTop: '1px' }}>
                          {sp.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Focus CTA on Center Card */}
                  {isCenter && (
                    <div style={{ marginTop: '18px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenBooking();
                        }}
                        style={{
                          width: '100%',
                          padding: '11px 18px',
                          borderRadius: '12px',
                          background: `linear-gradient(135deg, ${stage.color} 0%, #0071e3 100%)`,
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '0.86rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: `0 6px 20px ${stage.color}40`,
                        }}
                      >
                        <span>Book Pickup with {stage.title.split(' ')[0]} Care</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Orbit Control Deck & macOS-Style Dock */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '18px',
          }}
        >
          {/* macOS Dock Container */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 16px',
              borderRadius: '26px',
              background: 'rgba(15, 17, 25, 0.55)',
              backdropFilter: 'blur(28px) saturate(200%)',
              WebkitBackdropFilter: 'blur(28px) saturate(200%)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderTop: '1px solid rgba(255, 255, 255, 0.28)',
              boxShadow: '0 18px 45px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            }}
          >
            {/* Prev Arrow */}
            <button
              onClick={handlePrev}
              aria-label="Previous Stage"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Sculpted Stage Dock Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {ORBIT_STAGES.map((stage, idx) => {
                const isActive = activeIdx === idx;
                const isHovered = hoveredIdx === idx;

                return (
                  <div
                    key={stage.id}
                    onClick={() => handleSelectStage(idx)}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Floating Tooltip */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.9 }}
                          animate={{ opacity: 1, y: -34, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.9 }}
                          style={{
                            position: 'absolute',
                            top: 0,
                            whiteSpace: 'nowrap',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            background: 'rgba(10, 11, 16, 0.95)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#fff',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            pointerEvents: 'none',
                            zIndex: 40,
                            boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                          }}
                        >
                          {stage.title}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Dock Icon Button */}
                    <motion.div
                      animate={{
                        scale: isHovered ? 1.22 : isActive ? 1.12 : 1.0,
                        y: isHovered ? -6 : 0,
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: isActive
                          ? `linear-gradient(135deg, ${stage.color}35 0%, rgba(20, 22, 32, 0.9) 100%)`
                          : 'rgba(255, 255, 255, 0.05)',
                        border: isActive
                          ? `1px solid ${stage.color}`
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isActive ? `0 0 16px ${stage.glow}` : 'none',
                      }}
                    >
                      <stage.icon
                        size={20}
                        color={isActive ? stage.color : isHovered ? '#fff' : '#86868b'}
                      />
                    </motion.div>

                    {/* Active Underdot indicator */}
                    <div
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        backgroundColor: isActive ? stage.color : 'transparent',
                        marginTop: '4px',
                        boxShadow: isActive ? `0 0 8px ${stage.color}` : 'none',
                        transition: 'all 0.25s ease',
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Next Arrow */}
            <button
              onClick={handleNext}
              aria-label="Next Stage"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
            >
              <ChevronRight size={18} />
            </button>

            {/* Auto Orbit Play/Pause Toggle */}
            <button
              onClick={() => setIsAutoOrbit((prev) => !prev)}
              title={isAutoOrbit ? 'Pause Orbit' : 'Auto-Orbit Carousel'}
              style={{
                marginLeft: '4px',
                padding: '8px 12px',
                borderRadius: '10px',
                background: isAutoOrbit ? 'rgba(41, 151, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                border: isAutoOrbit ? '1px solid rgba(41, 151, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                color: isAutoOrbit ? '#64d2ff' : '#86868b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.74rem',
                fontWeight: 600,
              }}
            >
              {isAutoOrbit ? <Pause size={13} /> : <Play size={13} />}
              <span>{isAutoOrbit ? 'AUTO' : 'MANUAL'}</span>
            </button>
          </div>

          {/* Active Fabric Compatibility Tags */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px',
              maxWidth: '650px',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Optimized Fibers:
            </span>
            {currentStage.fabrics.map((fab) => (
              <span
                key={fab}
                style={{
                  fontSize: '0.78rem',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#e5e5ea',
                }}
              >
                {fab}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
