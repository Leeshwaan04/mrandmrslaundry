import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Sliders,
  Code,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Gauge,
  Eye,
  Info
} from 'lucide-react';

const CARDS_DATA = [
  {
    id: 1,
    tag: 'STAGE 01 // ATELIER CARE',
    title: 'Bespoke Cashmere & Silk Inspection',
    desc: 'Individual fiber diagnosis under 4K polarized optics with automated fabric tension calibration.',
    icon: '✨',
    badge: 'Polarized 4K',
    accent: '#0ae448',
  },
  {
    id: 2,
    tag: 'STAGE 02 // MOLECULAR PHYSICS',
    title: 'Ultrasonic Micro-Cavitation Soak',
    desc: 'Sub-micron acoustic shockwaves disperse sebum & micro-particulates without mechanical friction.',
    icon: '🌊',
    badge: '24 kHz Ionic',
    accent: '#00d2ff',
  },
  {
    id: 3,
    tag: 'STAGE 03 // THERMIC RESTORATION',
    title: 'Cryo-Vapor Fiber Reshaping',
    desc: 'Controlled thermal cycling re-aligns structural keratin & botanical cellulose weaves to factory drape.',
    icon: '⚡',
    badge: 'Cryo-Thermal',
    accent: '#9d4edd',
  },
  {
    id: 4,
    tag: 'STAGE 04 // COUTURE DISPATCH',
    title: 'Midnight White-Glove Wardrobe Return',
    desc: 'Customized breathable cedar-infused garment vault delivered directly to your dressing suite.',
    icon: '🌙',
    badge: 'RFID Monitored',
    accent: '#ff007f',
  },
];

export default function OrchestratedEaseReverseDemo({ onNavigate, onOpenBooking }) {
  // Demo Mode: 'standard' (awkward reverse) vs 'orchestrated' (crisp easeReverse) vs 'compare' (side-by-side)
  const [mode, setMode] = useState('orchestrated');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeScale, setTimeScale] = useState(1.3);
  const [overshoot, setOvershoot] = useState(1.7);
  const [staggerVal, setStaggerVal] = useState(0.12);
  const [reverseEase, setReverseEase] = useState('power3.in');
  const [activeTab, setActiveTab] = useState('demo'); // 'demo' | 'visualizer' | 'code'

  // Refs for animation targets
  const containerRef = useRef(null);
  const primaryTimelineRef = useRef(null);
  const standardTimelineRef = useRef(null);
  const orchestratedTimelineRef = useRef(null);

  // Playhead scrubber tracking
  const [isScrubbing, setIsScrubbing] = useState(false);

  // Build the GSAP Timeline based on current settings
  const rebuildTimelines = () => {
    // Kill existing timelines
    if (primaryTimelineRef.current) primaryTimelineRef.current.kill();
    if (standardTimelineRef.current) standardTimelineRef.current.kill();
    if (orchestratedTimelineRef.current) orchestratedTimelineRef.current.kill();

    if (!containerRef.current) return;

    // 1. Primary Timeline for Single View
    const targetCards = containerRef.current.querySelectorAll('.single-demo-card');
    if (targetCards.length > 0) {
      gsap.set(targetCards, { clearProps: 'all' });

      const tl = gsap.timeline({
        paused: true,
        onUpdate: () => {
          setProgress(tl.progress());
        },
        onComplete: () => {
          setIsPlaying(false);
          setIsReversed(false);
        },
        onReverseComplete: () => {
          setIsPlaying(false);
          setIsReversed(true);
        },
      });

      if (mode === 'standard') {
        // Standard reverse: entering with back.out(overshoot), default reverse curve (inverted)
        tl.from(targetCards, {
          y: 70,
          opacity: 0,
          scale: 0.92,
          rotationX: 12,
          transformOrigin: '50% 100%',
          stagger: staggerVal,
          duration: 0.85,
          ease: `back.out(${overshoot})`,
        });
      } else {
        // Orchestrated easeReverse: entering with back.out(overshoot),
        // but reverse uses crisp power3.in (no bounce/dip)
        tl.from(targetCards, {
          y: 70,
          opacity: 0,
          scale: 0.92,
          rotationX: 12,
          transformOrigin: '50% 100%',
          stagger: staggerVal,
          duration: 0.85,
          ease: `back.out(${overshoot})`,
          easeReverse: reverseEase,
        });
      }

      primaryTimelineRef.current = tl;
    }

    // 2. Timelines for Side-by-Side Comparison View
    const stdCards = containerRef.current.querySelectorAll('.compare-std-card');
    const orchCards = containerRef.current.querySelectorAll('.compare-orch-card');

    if (stdCards.length > 0 && orchCards.length > 0) {
      gsap.set([...stdCards, ...orchCards], { clearProps: 'all' });

      const tlStd = gsap.timeline({ paused: true });
      tlStd.from(stdCards, {
        y: 60,
        opacity: 0,
        scale: 0.92,
        rotationX: 10,
        stagger: staggerVal,
        duration: 0.85,
        ease: `back.out(${overshoot})`,
      });
      standardTimelineRef.current = tlStd;

      const tlOrch = gsap.timeline({ paused: true });
      tlOrch.from(orchCards, {
        y: 60,
        opacity: 0,
        scale: 0.92,
        rotationX: 10,
        stagger: staggerVal,
        duration: 0.85,
        ease: `back.out(${overshoot})`,
        easeReverse: reverseEase,
      });
      orchestratedTimelineRef.current = tlOrch;
    }
  };

  useEffect(() => {
    rebuildTimelines();
    // Start at initial forward state so cards are visible or user can play
    if (primaryTimelineRef.current) {
      primaryTimelineRef.current.progress(1);
      setProgress(1);
      setIsReversed(false);
    }
    if (standardTimelineRef.current) standardTimelineRef.current.progress(1);
    if (orchestratedTimelineRef.current) orchestratedTimelineRef.current.progress(1);
  }, [mode, overshoot, staggerVal, reverseEase]);

  // Handle Play / Reverse
  const handleTogglePlay = () => {
    if (mode === 'compare') {
      const tlStd = standardTimelineRef.current;
      const tlOrch = orchestratedTimelineRef.current;
      if (!tlStd || !tlOrch) return;

      if (!isReversed && (tlStd.progress() > 0.9 || tlOrch.progress() > 0.9)) {
        // Trigger Reverse
        setIsPlaying(true);
        setIsReversed(true);
        tlStd.timeScale(1).reverse();
        tlOrch.timeScale(timeScale).reverse();
      } else {
        // Trigger Forward
        setIsPlaying(true);
        setIsReversed(false);
        tlStd.timeScale(1).play();
        tlOrch.timeScale(1).play();
      }
      return;
    }

    const tl = primaryTimelineRef.current;
    if (!tl) return;

    if (!isReversed && tl.progress() > 0.05) {
      // Play in reverse
      setIsPlaying(true);
      setIsReversed(true);
      if (mode === 'orchestrated') {
        tl.timeScale(timeScale).reverse();
      } else {
        tl.timeScale(1).reverse();
      }
    } else {
      // Play forward
      setIsPlaying(true);
      setIsReversed(false);
      tl.timeScale(1).play();
    }
  };

  const handleReset = () => {
    if (primaryTimelineRef.current) {
      primaryTimelineRef.current.pause(0);
      setProgress(0);
    }
    if (standardTimelineRef.current) standardTimelineRef.current.pause(0);
    if (orchestratedTimelineRef.current) orchestratedTimelineRef.current.pause(0);
    setIsPlaying(false);
    setIsReversed(true);
  };

  // Progress Scrubber
  const handleScrub = (e) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    if (primaryTimelineRef.current) {
      primaryTimelineRef.current.pause().progress(val);
    }
    if (standardTimelineRef.current) standardTimelineRef.current.pause().progress(val);
    if (orchestratedTimelineRef.current) orchestratedTimelineRef.current.pause().progress(val);
  };

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100vh',
        backgroundColor: '#07090e',
        color: '#f5f5f7',
        paddingTop: '96px',
        paddingBottom: '120px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '15%',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(10, 228, 72, 0.08) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '25%',
          right: '5%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0, 210, 255, 0.07) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              backgroundColor: 'rgba(10, 228, 72, 0.12)',
              border: '1px solid rgba(10, 228, 72, 0.3)',
              color: '#0ae448',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            <Zap size={14} />
            GSAP 3.15+ Engine Innovation
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.08,
              margin: '0 0 16px 0',
              background: 'linear-gradient(135deg, #ffffff 40%, #0ae448 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Orchestrated easeReverse
          </h1>

          <p
            style={{
              maxWidth: '720px',
              margin: '0 auto',
              fontSize: '17px',
              color: '#a0a3ad',
              lineHeight: 1.6,
            }}
          >
            Experience how GSAP's <code style={{ color: '#0ae448', background: 'rgba(10,228,72,0.1)', padding: '2px 8px', borderRadius: '4px' }}>easeReverse</code> decouples entry and exit easing curves, eliminating clumsy backward overshoot recoils and delivering crisp, accelerated UI dismissals.
          </p>
        </div>

        {/* Master Control Deck */}
        <div
          style={{
            backgroundColor: 'rgba(14, 18, 24, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '24px',
            backdropFilter: 'blur(20px)',
            marginBottom: '36px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Top Row: Playback Controls & Mode Switches */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '20px',
              marginBottom: '20px',
            }}
          >
            {/* Play / Reverse Action Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handleTogglePlay}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 28px',
                  borderRadius: '12px',
                  backgroundColor: isReversed ? '#0ae448' : '#00d2ff',
                  color: '#07090e',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: isReversed
                    ? '0 0 24px rgba(10, 228, 72, 0.4)'
                    : '0 0 24px rgba(0, 210, 255, 0.4)',
                  transition: 'all 0.25s ease',
                  transform: 'translateY(0)',
                }}
              >
                {isReversed ? (
                  <>
                    <Play size={18} fill="#07090e" /> Play Forward (Entrance)
                  </>
                ) : (
                  <>
                    <RotateCcw size={18} /> Reverse Out (Dismissal)
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                title="Reset to frame 0"
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  color: '#f5f5f7',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <RefreshCw size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: isPlaying ? '#0ae448' : '#52545c',
                    boxShadow: isPlaying ? '0 0 10px #0ae448' : 'none',
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontSize: '13px', color: '#8e929f', fontFamily: 'monospace' }}>
                  {isPlaying ? (isReversed ? 'REVERSING...' : 'PLAYING FORWARD...') : (progress === 1 ? 'READY (OPEN)' : 'AT FRAME 0')}
                </span>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '14px',
                padding: '4px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <button
                onClick={() => setMode('orchestrated')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: mode === 'orchestrated' ? '#0ae448' : 'transparent',
                  color: mode === 'orchestrated' ? '#07090e' : '#a0a3ad',
                  transition: 'all 0.2s ease',
                }}
              >
                <Sparkles size={14} /> Orchestrated easeReverse
              </button>

              <button
                onClick={() => setMode('standard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: mode === 'standard' ? '#ff3b30' : 'transparent',
                  color: mode === 'standard' ? '#ffffff' : '#a0a3ad',
                  transition: 'all 0.2s ease',
                }}
              >
                <AlertTriangle size={14} /> Standard Reverse (Awkward)
              </button>

              <button
                onClick={() => setMode('compare')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: mode === 'compare' ? '#00d2ff' : 'transparent',
                  color: mode === 'compare' ? '#07090e' : '#a0a3ad',
                  transition: 'all 0.2s ease',
                }}
              >
                <Layers size={14} /> Side-by-Side Comparison
              </button>
            </div>
          </div>

          {/* Bottom Row: Parameter Tuning Sliders & Scrubber */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px',
              alignItems: 'center',
            }}
          >
            {/* Timeline Scrubber */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#8e929f', fontWeight: 600 }}>TIMELINE SCRUBBER</span>
                <span style={{ fontSize: '12px', color: '#0ae448', fontFamily: 'monospace' }}>
                  {(progress * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.005"
                value={progress}
                onChange={handleScrub}
                style={{
                  width: '100%',
                  accentColor: '#0ae448',
                  cursor: 'pointer',
                }}
              />
            </div>

            {/* Overshoot Spring Intensity */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#8e929f', fontWeight: 600 }}>ENTRANCE OVERSHOOT</span>
                <span style={{ fontSize: '12px', color: '#00d2ff', fontFamily: 'monospace' }}>
                  back.out({overshoot})
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.1"
                value={overshoot}
                onChange={(e) => setOvershoot(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#00d2ff',
                  cursor: 'pointer',
                }}
              />
            </div>

            {/* Reverse Acceleration timeScale */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#8e929f', fontWeight: 600 }}>REVERSE SPEED SCALE</span>
                <span style={{ fontSize: '12px', color: '#ffaa00', fontFamily: 'monospace' }}>
                  {timeScale}x Speed
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.2"
                step="0.1"
                value={timeScale}
                onChange={(e) => setTimeScale(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#ffaa00',
                  cursor: 'pointer',
                }}
              />
            </div>

            {/* Reverse Ease Choice */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#8e929f', fontWeight: 600 }}>REVERSE EASE CURVE</span>
                <span style={{ fontSize: '12px', color: '#9d4edd', fontFamily: 'monospace' }}>
                  {reverseEase}
                </span>
              </div>
              <select
                value={reverseEase}
                onChange={(e) => setReverseEase(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                <option value="power2.in">power2.in (Smooth Acceleration)</option>
                <option value="power3.in">power3.in (Snappy Dismissal)</option>
                <option value="expo.in">expo.in (Sudden Rapid Snap)</option>
                <option value="circ.in">circ.in (Steep Plunge)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mode Notification Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '14px 20px',
            borderRadius: '16px',
            backgroundColor:
              mode === 'orchestrated'
                ? 'rgba(10, 228, 72, 0.08)'
                : mode === 'standard'
                ? 'rgba(255, 59, 48, 0.08)'
                : 'rgba(0, 210, 255, 0.08)',
            border: `1px solid ${
              mode === 'orchestrated'
                ? 'rgba(10, 228, 72, 0.25)'
                : mode === 'standard'
                ? 'rgba(255, 59, 48, 0.25)'
                : 'rgba(0, 210, 255, 0.25)'
            }`,
            marginBottom: '32px',
          }}
        >
          {mode === 'orchestrated' && (
            <>
              <CheckCircle2 size={22} color="#0ae448" />
              <div>
                <strong style={{ color: '#0ae448', fontSize: '14px' }}>Active Mode: easeReverse Enabled</strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#a0a3ad' }}>
                  Cards animate in with vibrant overshoot <code style={{ color: '#0ae448' }}>back.out({overshoot})</code>. When reversed, GSAP applies <code style={{ color: '#0ae448' }}>{reverseEase}</code> at {timeScale}x speed for an instantaneous, recoil-free exit.
                </p>
              </div>
            </>
          )}

          {mode === 'standard' && (
            <>
              <AlertTriangle size={22} color="#ff3b30" />
              <div>
                <strong style={{ color: '#ff3b30', fontSize: '14px' }}>Active Mode: Standard Reverse (Default GSAP)</strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#a0a3ad' }}>
                  Notice how on reverse, the overshoot causes the cards to dip awkwardly backwards before sliding off, creating an unwanted and sluggish rubber-band recoil.
                </p>
              </div>
            </>
          )}

          {mode === 'compare' && (
            <>
              <Info size={22} color="#00d2ff" />
              <div>
                <strong style={{ color: '#00d2ff', fontSize: '14px' }}>Active Mode: Side-by-Side Dual View</strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#a0a3ad' }}>
                  Observe both behaviors simultaneously. Click "Reverse Out" to watch the standard side stutter with an awkward recoil while the orchestrated side exits cleanly!
                </p>
              </div>
            </>
          )}
        </div>

        {/* Demo Stage Section */}
        {mode !== 'compare' ? (
          /* Single Stage View */
          <div
            style={{
              perspective: '1200px',
              minHeight: '380px',
              padding: '20px 0',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
              }}
            >
              {CARDS_DATA.map((card) => (
                <div
                  key={card.id}
                  className="single-demo-card"
                  style={{
                    backgroundColor: 'rgba(16, 21, 30, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    padding: '24px',
                    position: 'relative',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Card Glowing Line */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)`,
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '28px' }}>{card.icon}</span>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        border: `1px solid ${card.accent}44`,
                        color: card.accent,
                      }}
                    >
                      {card.badge}
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#8e929f', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '6px' }}>
                    {card.tag}
                  </div>

                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#ffffff',
                      lineHeight: 1.3,
                      margin: '0 0 10px 0',
                    }}
                  >
                    {card.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '13px',
                      color: '#9ba0ae',
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Side-by-Side Comparison Columns */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '32px',
              perspective: '1200px',
            }}
          >
            {/* Column 1: Standard Reverse */}
            <div
              style={{
                backgroundColor: 'rgba(255, 59, 48, 0.04)',
                border: '1px solid rgba(255, 59, 48, 0.2)',
                borderRadius: '24px',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: '#ff3b30',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  DEFAULT GSAP
                </span>
                <h4 style={{ margin: 0, fontSize: '16px', color: '#ffffff' }}>Standard Timeline.reverse()</h4>
              </div>
              <p style={{ fontSize: '13px', color: '#a0a3ad', marginBottom: '20px' }}>
                Reverse mirrors <code style={{ color: '#ff6b6b' }}>back.out({overshoot})</code> backwards, causing an awkward dip at exit.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {CARDS_DATA.slice(0, 3).map((card) => (
                  <div
                    key={`std-${card.id}`}
                    className="compare-std-card"
                    style={{
                      backgroundColor: 'rgba(16, 21, 30, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{card.icon}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>{card.title}</div>
                      <div style={{ fontSize: '12px', color: '#8e929f' }}>{card.tag}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Orchestrated easeReverse */}
            <div
              style={{
                backgroundColor: 'rgba(10, 228, 72, 0.04)',
                border: '1px solid rgba(10, 228, 72, 0.25)',
                borderRadius: '24px',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: '#0ae448',
                    color: '#07090e',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  RECOMMENDED
                </span>
                <h4 style={{ margin: 0, fontSize: '16px', color: '#ffffff' }}>Orchestrated easeReverse</h4>
              </div>
              <p style={{ fontSize: '13px', color: '#a0a3ad', marginBottom: '20px' }}>
                Decoupled reverse with <code style={{ color: '#0ae448' }}>{reverseEase}</code> + {timeScale}x speed for crisp dismissal.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {CARDS_DATA.slice(0, 3).map((card) => (
                  <div
                    key={`orch-${card.id}`}
                    className="compare-orch-card"
                    style={{
                      backgroundColor: 'rgba(16, 21, 30, 0.85)',
                      border: '1px solid rgba(10, 228, 72, 0.2)',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{card.icon}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>{card.title}</div>
                      <div style={{ fontSize: '12px', color: '#0ae448' }}>{card.tag}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Easing Curves Visualizer & Code Tabs */}
        <div
          style={{
            marginTop: '48px',
            backgroundColor: 'rgba(14, 18, 24, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '28px',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Sub Navigation */}
          <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px', marginBottom: '24px' }}>
            <button
              onClick={() => setActiveTab('visualizer')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'visualizer' ? 'rgba(10, 228, 72, 0.15)' : 'transparent',
                color: activeTab === 'visualizer' ? '#0ae448' : '#8e929f',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <Activity size={16} /> Easing Curve Graph Visualizer
            </button>

            <button
              onClick={() => setActiveTab('code')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'code' ? 'rgba(10, 228, 72, 0.15)' : 'transparent',
                color: activeTab === 'code' ? '#0ae448' : '#8e929f',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <Code size={16} /> GSAP Implementation Code
            </button>
          </div>

          {activeTab === 'visualizer' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
                {/* SVG Graph */}
                <div
                  style={{
                    backgroundColor: '#05070a',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '20px',
                    position: 'relative',
                  }}
                >
                  <div style={{ fontSize: '12px', color: '#8e929f', marginBottom: '12px', fontWeight: 600 }}>
                    CURVE TRAJECTORY // TIME (X) vs PROGRESS (Y)
                  </div>

                  <svg viewBox="0 0 400 240" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                    {/* Grid lines */}
                    <line x1="40" y1="200" x2="360" y2="200" stroke="#1f232d" strokeWidth="1" />
                    <line x1="40" y1="120" x2="360" y2="120" stroke="#1f232d" strokeWidth="1" strokeDasharray="4" />
                    <line x1="40" y1="40" x2="360" y2="40" stroke="#1f232d" strokeWidth="1" strokeDasharray="4" />
                    <line x1="40" y1="20" x2="40" y2="200" stroke="#1f232d" strokeWidth="1" />
                    <line x1="360" y1="20" x2="360" y2="200" stroke="#1f232d" strokeWidth="1" />

                    {/* Target 100% resting line */}
                    <text x="10" y="44" fill="#606470" fontSize="10" fontFamily="monospace">100%</text>
                    <text x="10" y="124" fill="#606470" fontSize="10" fontFamily="monospace">50%</text>
                    <text x="15" y="204" fill="#606470" fontSize="10" fontFamily="monospace">0%</text>

                    {/* Forward Curve: Back.out with Overshoot (Green) */}
                    <path
                      d="M 40 200 C 140 180, 200 10, 260 20 C 300 28, 330 40, 360 40"
                      fill="none"
                      stroke="#0ae448"
                      strokeWidth="3"
                    />

                    {/* Standard Reverse Curve: Awkward Recoil Dip (Red dashed) */}
                    {mode !== 'orchestrated' && (
                      <path
                        d="M 40 40 C 90 40, 120 60, 160 10 C 220 180, 300 190, 360 200"
                        fill="none"
                        stroke="#ff3b30"
                        strokeWidth="2.5"
                        strokeDasharray="6"
                      />
                    )}

                    {/* Orchestrated easeReverse Curve: Smooth Acceleration Exit (Cyan) */}
                    {mode !== 'standard' && (
                      <path
                        d="M 40 40 C 140 40, 240 100, 360 200"
                        fill="none"
                        stroke="#00d2ff"
                        strokeWidth="3"
                      />
                    )}

                    {/* Current Scrubber playhead marker */}
                    <line
                      x1={40 + progress * 320}
                      y1="20"
                      x2={40 + progress * 320}
                      y2="200"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <circle
                      cx={40 + progress * 320}
                      cy={200 - progress * 160}
                      r="6"
                      fill="#0ae448"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </svg>

                  {/* Legend */}
                  <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '11px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '12px', height: '3px', backgroundColor: '#0ae448' }} />
                      <span style={{ color: '#0ae448' }}>Forward: back.out({overshoot})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '12px', height: '3px', backgroundColor: '#00d2ff' }} />
                      <span style={{ color: '#00d2ff' }}>easeReverse: {reverseEase}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '12px', height: '3px', backgroundColor: '#ff3b30' }} />
                      <span style={{ color: '#ff3b30' }}>Standard: Inverted Dip</span>
                    </div>
                  </div>
                </div>

                {/* Key Insights & Theory */}
                <div style={{ color: '#a0a3ad', fontSize: '14px', lineHeight: 1.6 }}>
                  <h4 style={{ color: '#ffffff', fontSize: '18px', margin: '0 0 12px 0' }}>
                    Why Default Reverse Feels "Broken" in Modern UI
                  </h4>
                  <p style={{ margin: '0 0 12px 0' }}>
                    When you specify an expressive ease like <strong style={{ color: '#ffffff' }}>back.out</strong>, GSAP intentionally overshoots past 100% before snapping back into resting equilibrium.
                  </p>
                  <p style={{ margin: '0 0 12px 0' }}>
                    In classical animation engines, calling <code style={{ color: '#ffaa00' }}>.reverse()</code> simply runs that mathematical function backward. The resting settle becomes an awkward forward lurch, and the sudden snap turns into an agonizingly slow hesitation before departure.
                  </p>
                  <p style={{ margin: 0 }}>
                    With <strong style={{ color: '#0ae448' }}>easeReverse</strong>, GSAP decouples the return vector: items arrive like tactile springs, but vanish like disciplined photons with <strong style={{ color: '#00d2ff' }}>{reverseEase}</strong> and accelerated <strong style={{ color: '#ffaa00' }}>{timeScale}x</strong> speed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div
              style={{
                backgroundColor: '#05070a',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontFamily: 'monospace',
                fontSize: '13px',
                lineHeight: 1.7,
                overflowX: 'auto',
              }}
            >
              <div style={{ color: '#52545c', marginBottom: '8px' }}>
                // GSAP 3.15+ Orchestrated easeReverse Production Implementation
              </div>
              <div style={{ color: '#00d2ff' }}>
                import <span style={{ color: '#ffffff' }}>gsap</span> from <span style={{ color: '#0ae448' }}>'gsap'</span>;
              </div>
              <br />
              <div style={{ color: '#9ba0ae' }}>
                <span style={{ color: '#ffaa00' }}>const</span> tl = gsap.<span style={{ color: '#0ae448' }}>timeline</span>({'{'} paused: <span style={{ color: '#0ae448' }}>true</span> {'}'});
              </div>
              <br />
              <div style={{ color: '#9ba0ae' }}>
                tl.<span style={{ color: '#0ae448' }}>from</span>(<span style={{ color: '#0ae448' }}>'.luxury-card'</span>, {'{'}
                <br />
                &nbsp;&nbsp;y: <span style={{ color: '#ffaa00' }}>70</span>,
                <br />
                &nbsp;&nbsp;opacity: <span style={{ color: '#ffaa00' }}>0</span>,
                <br />
                &nbsp;&nbsp;scale: <span style={{ color: '#ffaa00' }}>0.92</span>,
                <br />
                &nbsp;&nbsp;duration: <span style={{ color: '#ffaa00' }}>0.85</span>,
                <br />
                &nbsp;&nbsp;stagger: <span style={{ color: '#ffaa00' }}>{staggerVal}</span>,
                <br />
                &nbsp;&nbsp;<span style={{ color: '#8e929f' }}>// Forward entrance: expressive overshoot</span>
                <br />
                &nbsp;&nbsp;ease: <span style={{ color: '#0ae448' }}>'back.out({overshoot})'</span>,
                <br />
                &nbsp;&nbsp;<span style={{ color: '#0ae448' }}>// Tween-level decoupled reverse: zero recoil!</span>
                <br />
                &nbsp;&nbsp;<span style={{ color: '#0ae448', fontWeight: 'bold' }}>easeReverse:</span> <span style={{ color: '#0ae448' }}>'{reverseEase}'</span>,
                <br />
                {'}'});
              </div>
              <br />
              <div style={{ color: '#52545c' }}>// Trigger dismissal with accelerated timeScale:</div>
              <div style={{ color: '#9ba0ae' }}>
                <span style={{ color: '#ffaa00' }}>function</span> <span style={{ color: '#0ae448' }}>dismissMenu</span>() {'{'}
                <br />
                &nbsp;&nbsp;tl.<span style={{ color: '#00d2ff' }}>timeScale</span>(<span style={{ color: '#ffaa00' }}>{timeScale}</span>).<span style={{ color: '#0ae448' }}>reverse</span>();
                <br />
                {'}'}
              </div>
            </div>
          )}
        </div>

        {/* Action Call to Action */}
        <div
          style={{
            marginTop: '40px',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          <button
            onClick={() => onNavigate && onNavigate('home')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ← Return to Home
          </button>

          <button
            onClick={() => onOpenBooking && onOpenBooking()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0ae448 0%, #00d2ff 100%)',
              color: '#07090e',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(10, 228, 72, 0.3)',
            }}
          >
            Experience Couture Concierge <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
