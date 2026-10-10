import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Layers,
  Waves,
  Scan,
  Car,
  ChevronRight,
  ArrowDown,
  Gauge,
  Sliders
} from 'lucide-react';

const PIECES = [
  {
    id: 1,
    act: 'PIECE 01 // MOLECULAR PHYSICS',
    shortName: '01 Molecular',
    title: 'Micro-Cavitation Bubble Infiltration',
    subtitle: 'Ultrasonic cold-water cleansing without mechanical friction',
    startTime: 0.0,
    endTime: 2.5,
    scrollStart: 0.0,
    scrollEnd: 0.25,
    accentColor: '#64d2ff',
    glowColor: 'rgba(100, 210, 255, 0.45)',
    icon: <Sparkles size={20} color="#64d2ff" />,
    description:
      'High-frequency ultrasonic transducers collapse millions of ionized micro-bubbles against woven cashmere and silk threads, dislodging particulate matter at the molecular level without fiber abrasion.',
    metrics: [
      { label: 'Acoustic Frequency', val: '42.4 kHz' },
      { label: 'Fiber Wear Rate', val: '0.00% Zero Friction' },
      { label: 'Cleanliness Index', val: '99.98% Purity' },
    ],
  },
  {
    id: 2,
    act: 'PIECE 02 // DRUM HYDRODYNAMICS',
    shortName: '02 Vortex',
    title: 'Dual-Helix Centrifugal Vortex',
    subtitle: 'Aircraft-grade stainless drum with laminar fluid currents',
    startTime: 2.5,
    endTime: 5.0,
    scrollStart: 0.25,
    scrollEnd: 0.50,
    accentColor: '#2997ff',
    glowColor: 'rgba(41, 151, 255, 0.45)',
    icon: <Waves size={20} color="#2997ff" />,
    description:
      'Inside the surgical-grade titanium-steel drum, water moves in calibrated dual-helix vortex currents. Garments float freely in fluid suspension, eliminating fiber-on-fiber friction and stress.',
    metrics: [
      { label: 'Vortex Velocity', val: '1,450 RPM' },
      { label: 'Thermal Profile', val: '28°C Cold Ionic' },
      { label: 'Water Recirculation', val: '94.6% Closed-Loop' },
    ],
  },
  {
    id: 3,
    act: 'PIECE 03 // ATELIER ROBOTICS',
    shortName: '03 Atelier',
    title: 'Laser Alignment & Contour Setting',
    subtitle: 'Dual-arm robotic precision for bespoke tailoring & couture',
    startTime: 5.0,
    endTime: 7.5,
    scrollStart: 0.50,
    scrollEnd: 0.75,
    accentColor: '#ff375f',
    glowColor: 'rgba(255, 55, 95, 0.45)',
    icon: <Scan size={20} color="#ff375f" />,
    description:
      'Articulated robotic arms lift tailored jackets onto custom cedar forms. Red laser optical scanners verify lapel roll, shoulder drape, and crease symmetry to ±0.2 mm before micro-steam setting.',
    metrics: [
      { label: 'Laser Tolerance', val: '±0.2 mm' },
      { label: 'Micro-Steam Fog', val: '3.5 µm Dry Fog' },
      { label: 'Inspection Grade', val: 'Savile Row AAA' },
    ],
  },
  {
    id: 4,
    act: 'PIECE 04 // CONCIERGE DISPATCH',
    shortName: '04 Dispatch',
    title: 'Autonomous Midnight Doorstep Return',
    subtitle: 'Zero-emission electric courier fleet with encrypted RFID seals',
    startTime: 7.5,
    endTime: 10.0,
    scrollStart: 0.75,
    scrollEnd: 1.0,
    accentColor: '#bf5af2',
    glowColor: 'rgba(191, 90, 242, 0.45)',
    icon: <Car size={20} color="#bf5af2" />,
    description:
      'Sealed in custom antimicrobial cedar wardrobe boxes, your garments glide through the city inside our climate-stabilized electric fleet, arriving back at your doorstep within 60 minutes.',
    metrics: [
      { label: 'Fleet Emissions', val: '0.00 g/km Zero' },
      { label: 'Custody Chain', val: 'SHA-256 RFID' },
      { label: 'Guaranteed SLA', val: 'Exact 60 Min' },
    ],
  },
];

export default function KeynoteExperience({ onOpenBooking }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentPieceIndex, setCurrentPieceIndex] = useState(0);
  const [pieceLocalProgress, setPieceLocalProgress] = useState(0); // 0.0 to 1.0 inside current piece
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const [videoTime, setVideoTime] = useState(0.0);
  const [isReady, setIsReady] = useState(false);
  const [sensitivity, setSensitivity] = useState('ultra'); // 'ultra' (slow & sensitive) | 'standard'

  // Precision interpolation targets
  const targetProgressRef = useRef(0);
  const smoothedProgressRef = useRef(0);
  const isSeekingRef = useRef(false);
  const rafIdRef = useRef(null);

  const activePiece = PIECES[currentPieceIndex] || PIECES[0];

  // High-precision scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      if (isPlayingAuto) return;
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;

      if (totalScrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      const rawProgress = Math.max(0, Math.min(1, currentScroll / totalScrollableDistance));

      targetProgressRef.current = rawProgress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPlayingAuto]);

  // Silky 60fps damped interpolation & seeking guard
  useEffect(() => {
    const updateLoop = () => {
      const video = videoRef.current;

      if (video && isReady && !isPlayingAuto) {
        // Butter-smooth lerp damping
        const lerpFactor = sensitivity === 'ultra' ? 0.09 : 0.15;
        const diff = targetProgressRef.current - smoothedProgressRef.current;
        smoothedProgressRef.current += diff * lerpFactor;

        const currentProg = smoothedProgressRef.current;
        setScrollProgress(currentProg);

        // Map smooth progress to 10.0s video duration
        const targetTime = currentProg * 10.0;

        // Piece index & piece local progress
        const pIdx = Math.min(
          PIECES.length - 1,
          Math.floor(currentProg * PIECES.length)
        );
        setCurrentPieceIndex(pIdx);

        const currentP = PIECES[pIdx];
        const localProg = (currentProg - currentP.scrollStart) / (currentP.scrollEnd - currentP.scrollStart);
        setPieceLocalProgress(Math.max(0, Math.min(1, localProg)));

        // Perform hardware-guarded video seek
        if (!isSeekingRef.current && Math.abs(video.currentTime - targetTime) > 0.02) {
          isSeekingRef.current = true;
          try {
            if (video.fastSeek) {
              video.fastSeek(targetTime);
            } else {
              video.currentTime = targetTime;
            }
          } catch (e) {
            video.currentTime = targetTime;
          }
        }
        setVideoTime(video.currentTime);
      } else if (video && isPlayingAuto) {
        setVideoTime(video.currentTime);
        const prog = video.currentTime / 10.0;
        setScrollProgress(prog);
        smoothedProgressRef.current = prog;

        const pIdx = Math.min(
          PIECES.length - 1,
          Math.floor(prog * PIECES.length)
        );
        setCurrentPieceIndex(pIdx);

        const currentP = PIECES[pIdx];
        const localProg = (prog - currentP.scrollStart) / (currentP.scrollEnd - currentP.scrollStart);
        setPieceLocalProgress(Math.max(0, Math.min(1, localProg)));
      }

      rafIdRef.current = requestAnimationFrame(updateLoop);
    };

    rafIdRef.current = requestAnimationFrame(updateLoop);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isReady, isPlayingAuto, sensitivity]);

  // Handle video ready and seeked events
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.addEventListener('seeked', () => {
        isSeekingRef.current = false;
      });
      setIsReady(true);
    }
  };

  // Jump directly to any piece with buttery smooth scrolling
  const jumpToPiece = (index) => {
    if (!containerRef.current) return;
    const piece = PIECES[index];
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const containerTop = rect.top + scrollTop;
    const totalScrollableDistance = rect.height - window.innerHeight;

    const targetScrollY = containerTop + piece.scrollStart * totalScrollableDistance + 10;
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
    setCurrentPieceIndex(index);
  };

  const toggleAutoplay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlayingAuto) {
      video.pause();
      setIsPlayingAuto(false);
    } else {
      video.play().catch(() => {});
      setIsPlayingAuto(true);
    }
  };

  const formatPreciseTime = (seconds) => {
    const s = Math.max(0, seconds || 0);
    const secs = Math.floor(s);
    const ms = Math.floor((s - secs) * 100);
    const msStr = ms < 10 ? `0${ms}` : `${ms}`;
    return `00:0${secs}.${msStr}`;
  };

  // Calculate dynamic opacity & translation for the active piece based on its local progress
  // Fades in gently (0 -> 0.2), stays crisp (0.2 -> 0.8), fades out gently (0.8 -> 1.0)
  const computeRevealStyle = () => {
    let opacity = 1;
    let translateY = 0;

    if (pieceLocalProgress < 0.2) {
      opacity = pieceLocalProgress / 0.2;
      translateY = (1 - opacity) * 18;
    } else if (pieceLocalProgress > 0.8) {
      opacity = (1 - pieceLocalProgress) / 0.2;
      translateY = -(1 - opacity) * 14;
    }

    return {
      opacity: Math.max(0.08, opacity),
      transform: `translateY(${translateY}px)`,
      transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
    };
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        height: '750vh', // Extended height so scrolling advances video slow by slow
        backgroundColor: '#000000',
        color: '#f5f5f7',
      }}
    >
      {/* Sticky Fullscreen Master Keynote Cinema Viewport */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        {/* Ambient Backlight Halo that shifts hues per piece */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95vw',
            height: '80vh',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${activePiece.glowColor} 0%, rgba(0,0,0,0) 72%)`,
            filter: 'blur(110px)',
            pointerEvents: 'none',
            transition: 'background 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 1,
          }}
        />

        {/* Master 1080p Video Layer */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            backgroundColor: '#000000',
            zIndex: 2,
          }}
        >
          <video
            ref={videoRef}
            src="./videos/Create_detailed_e2e_video_1080p_20261008222550.mp4"
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={handleLoadedMetadata}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'contrast(1.08) brightness(0.96)',
            }}
          />

          {/* Cinema Vignette Gradients */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse at center, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.95) 100%)',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '140px',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '240px',
              background: 'linear-gradient(0deg, rgba(0,0,0,0.96) 0%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />
        </div>

        {/* TOP BAR: Clean Minimalist Nav & Piece Markers */}
        <div
          style={{
            position: 'relative',
            zIndex: 15,
            padding: '24px 36px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Logo & Film Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 20px ${activePiece.accentColor}33`,
              }}
            >
              <Layers size={18} color={activePiece.accentColor} />
            </div>
            <div>
              <span
                style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  color: '#86868b',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                1080P MASTER CINEMA SCROLLER
              </span>
              <h1
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#fff',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                Mr &amp; Mrs Laundry — Pure Clean
              </h1>
            </div>
          </div>

          {/* Clickable Piece Navigation Chips */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(12, 13, 18, 0.78)',
              backdropFilter: 'blur(24px) saturate(190%)',
              padding: '6px',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
            }}
          >
            {PIECES.map((piece, idx) => {
              const isActive = currentPieceIndex === idx;
              return (
                <button
                  key={piece.id}
                  onClick={() => jumpToPiece(idx)}
                  style={{
                    background: isActive ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                    border: isActive ? `1px solid ${piece.accentColor}` : '1px solid transparent',
                    borderRadius: '999px',
                    padding: '6px 14px',
                    color: isActive ? '#ffffff' : '#86868b',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.25s ease',
                    boxShadow: isActive ? `0 0 16px ${piece.accentColor}40` : 'none',
                  }}
                >
                  <span style={{ color: piece.accentColor, fontWeight: 700, fontSize: '0.72rem' }}>
                    0{piece.id}
                  </span>
                  <span className="chapter-label">{piece.shortName.split(' ')[1]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* HERO TITLE: Appears on load (0% - 7% progress), dissolves as user scrolls */}
        {scrollProgress < 0.08 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'absolute',
              top: '42%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              zIndex: 12,
              pointerEvents: 'none',
              maxWidth: '840px',
              width: '90%',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                marginBottom: '18px',
              }}
            >
              <Sparkles size={14} color="#64d2ff" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f5f5f7', letterSpacing: '0.04em' }}>
                Ultra-Slow 1080p Film Journey
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 4.4rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.08,
                marginBottom: '18px',
                color: '#ffffff',
                textShadow: '0 4px 25px rgba(0, 0, 0, 0.85)',
              }}
            >
              Pure Clean.{'\n'}
              <span
                style={{
                  background: 'linear-gradient(135deg, #64d2ff 0%, #2997ff 50%, #bf5af2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Engineered to Perfection.
              </span>
            </h2>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
                color: '#d2d2d7',
                maxWidth: '640px',
                margin: '0 auto 28px',
                lineHeight: 1.6,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
              }}
            >
              Slowly scroll to scrub through each piece down to your doorstep.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#86868b',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <ArrowDown size={16} />
              <span>Scroll down slow-by-slow</span>
            </div>
          </motion.div>
        )}

        {/* RIGHT EDGE: Vertical Precision Scrubber Rail */}
        <div
          style={{
            position: 'absolute',
            right: '28px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
          className="vertical-scrubber-rail"
        >
          {PIECES.map((p, i) => {
            const isCurrent = currentPieceIndex === i;
            return (
              <div
                key={p.id}
                onClick={() => jumpToPiece(i)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '4px',
                }}
                title={p.title}
              >
                <div
                  style={{
                    width: isCurrent ? '4px' : '3px',
                    height: isCurrent ? '36px' : '18px',
                    borderRadius: '999px',
                    background: isCurrent ? p.accentColor : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: isCurrent ? `0 0 12px ${p.accentColor}` : 'none',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* BOTTOM HUD: Ultra-Smooth & Sensitive Reveal Stage */}
        <div
          style={{
            position: 'relative',
            zIndex: 15,
            padding: '0 36px 36px 36px',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              maxWidth: '1240px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: '24px',
              alignItems: 'flex-end',
            }}
          >
            {/* Left Column: Piece Details with continuous reveal */}
            <div
              style={{
                gridColumn: 'span 8',
                pointerEvents: 'auto',
                ...computeRevealStyle(),
              }}
              id="piece-left-col"
            >
              <div
                style={{
                  background: 'rgba(10, 11, 16, 0.84)',
                  backdropFilter: 'blur(32px) saturate(190%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '28px',
                  padding: '28px 32px',
                  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                }}
              >
                {/* Piece Tag Badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '5px 14px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: `1px solid ${activePiece.accentColor}55`,
                    marginBottom: '14px',
                  }}
                >
                  {activePiece.icon}
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: activePiece.accentColor,
                    }}
                  >
                    {activePiece.act}
                  </span>
                </div>

                <h2
                  style={{
                    fontSize: 'clamp(1.5rem, 2.6vw, 2.2rem)',
                    fontWeight: 700,
                    color: '#ffffff',
                    margin: '0 0 8px 0',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                  }}
                >
                  {activePiece.title}
                </h2>

                <p
                  style={{
                    fontSize: '0.94rem',
                    color: '#a1a1a6',
                    lineHeight: 1.55,
                    margin: '0 0 20px 0',
                    maxWidth: '720px',
                  }}
                >
                  {activePiece.description}
                </p>

                {/* Live Telemetry Chips */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {activePiece.metrics.map((m) => (
                    <div key={m.label}>
                      <div style={{ fontSize: '0.7rem', color: '#86868b', textTransform: 'uppercase' }}>
                        {m.label}
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                        {m.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Timecode Scrubber & Reservation Action */}
            <div
              style={{
                gridColumn: 'span 4',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                pointerEvents: 'auto',
              }}
              id="piece-right-col"
            >
              {/* HUD Scrubber Card */}
              <div
                style={{
                  background: 'rgba(10, 11, 16, 0.84)',
                  backdropFilter: 'blur(32px) saturate(190%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '24px',
                  padding: '20px 24px',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Gauge size={13} color="#86868b" />
                    <span style={{ fontSize: '0.74rem', color: '#86868b', fontWeight: 600 }}>TIMECODE SCRUB</span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: activePiece.accentColor,
                    }}
                  >
                    {formatPreciseTime(videoTime)} / 00:10.00
                  </span>
                </div>

                {/* Progress Bar with local segment markers */}
                <div
                  style={{
                    height: '6px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    position: 'relative',
                    overflow: 'hidden',
                    marginBottom: '14px',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%`,
                      background: `linear-gradient(90deg, #64d2ff, ${activePiece.accentColor})`,
                      boxShadow: `0 0 10px ${activePiece.accentColor}`,
                      transition: isPlayingAuto ? 'none' : 'width 0.08s linear',
                    }}
                  />
                </div>

                {/* Control Actions & Sensitivity Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={toggleAutoplay}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: isPlayingAuto ? 'rgba(255, 55, 95, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      border: isPlayingAuto ? '1px solid #ff375f' : '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isPlayingAuto ? <Pause size={14} /> : <Play size={14} fill="#fff" />}
                    <span>{isPlayingAuto ? 'Pause Film' : 'Autoplay Film'}</span>
                  </button>

                  <button
                    onClick={() => jumpToPiece(0)}
                    title="Rewind to Piece 01"
                    style={{
                      width: '38px',
                      height: '38px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#86868b',
                      cursor: 'pointer',
                    }}
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>

              {/* Instant Book CTA Pill */}
              <button
                onClick={onOpenBooking}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, #0071e3 0%, #0056b3 100%)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 25px rgba(0, 113, 227, 0.45)',
                }}
              >
                <span>Book Concierge Pickup</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #piece-left-col {
            grid-column: span 12 !important;
          }
          #piece-right-col {
            grid-column: span 12 !important;
          }
          .chapter-label {
            display: none !important;
          }
          .vertical-scrubber-rail {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
