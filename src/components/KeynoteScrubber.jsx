import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Layers, 
  Zap, 
  Scan, 
  Waves, 
  Car, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Maximize2
} from 'lucide-react';

const CHAPTERS = [
  {
    id: 1,
    title: 'Molecular Fiber Cavitation',
    subtitle: 'Ultrasonic Ionized Cleaning at 42 kHz',
    startTime: 0.0,
    endTime: 2.5,
    scrollStart: 0.0,
    scrollEnd: 0.25,
    tag: 'ACT I // MOLECULAR PHYSICS',
    color: '#64d2ff',
    glowColor: 'rgba(100, 210, 255, 0.35)',
    icon: <Sparkles size={20} color="#64d2ff" />,
    description:
      'Ionized micro-cavitation bubbles penetrate woven cashmere, organic cotton, and silk fibers without frictional abrasion. Particulates dissolve at the molecular level, preserving tensile weave integrity.',
    telemetry: [
      { label: 'Acoustic Frequency', val: '42.4 kHz' },
      { label: 'Fiber Wear Rate', val: '0.00% Zero Friction' },
      { label: 'Purity Index', val: '99.98% Clean' },
    ],
  },
  {
    id: 2,
    title: 'Hydrodynamic Vortex Rinse',
    subtitle: 'Dual-Helix Centrifugal Flow in Stainless Drum',
    startTime: 2.5,
    endTime: 5.0,
    scrollStart: 0.25,
    scrollEnd: 0.50,
    tag: 'ACT II // DRUM DYNAMICS',
    color: '#2997ff',
    glowColor: 'rgba(41, 151, 255, 0.4)',
    icon: <Waves size={20} color="#2997ff" />,
    description:
      'Inside the surgical-grade titanium-steel drum, water forms a calibrated dual-helix vortex. Balanced hydrodynamic flow extracts all detergent residues while keeping garments suspended in frictionless fluid.',
    telemetry: [
      { label: 'Vortex RPM', val: '1,450 RPM' },
      { label: 'Thermal Profile', val: '28°C Cold Ionic' },
      { label: 'Water Recycling', val: '94.6% Closed-Loop' },
    ],
  },
  {
    id: 3,
    title: 'Robotic Laser Creasing & Atelier',
    subtitle: 'Dual-Arm Articulated Silhouette Finishing',
    startTime: 5.0,
    endTime: 7.5,
    scrollStart: 0.50,
    scrollEnd: 0.75,
    tag: 'ACT III // ATELIER ROBOTICS',
    color: '#ff375f',
    glowColor: 'rgba(255, 55, 95, 0.35)',
    icon: <Scan size={20} color="#ff375f" />,
    description:
      'Articulated robotic arms lift bespoke tailoring onto cedar contours. Micro-aperture red laser scanners verify lapel symmetry and drape alignment with ±0.2 mm precision before dry-steam setting.',
    telemetry: [
      { label: 'Laser Tolerance', val: '±0.2 mm' },
      { label: 'Micro-Steam', val: '3.5 µm Dry Fog' },
      { label: 'Inspection Grade', val: 'Savile Row AAA' },
    ],
  },
  {
    id: 4,
    title: 'Autonomous Midnight Delivery',
    subtitle: 'Encrypted RFID Seal Doorstep Dispatch',
    startTime: 7.5,
    endTime: 10.0,
    scrollStart: 0.75,
    scrollEnd: 1.0,
    tag: 'ACT IV // CONCIERGE RETURN',
    color: '#bf5af2',
    glowColor: 'rgba(191, 90, 242, 0.35)',
    icon: <Car size={20} color="#bf5af2" />,
    description:
      'Encrypted cedar wardrobe boxes are transferred into climate-stabilized electric couriers. Continuous GPS and tamper-proof RFID telemetry ensure guaranteed on-time doorstep return within 60 minutes.',
    telemetry: [
      { label: 'Fleet Emission', val: '0.00 g/km Zero' },
      { label: 'Custody Chain', val: 'SHA-256 RFID' },
      { label: 'Delivery Window', val: 'Exact 60 Min' },
    ],
  },
];

export default function KeynoteScrubber({ onOpenBooking }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const [videoDuration, setVideoDuration] = useState(10.0);
  const [videoTime, setVideoTime] = useState(0.0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Smooth scrubbing interpolation via requestAnimationFrame
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const rafIdRef = useRef(null);

  // Compute active chapter
  const activeChapter = CHAPTERS[currentChapterIndex] || CHAPTERS[0];

  useEffect(() => {
    const handleScroll = () => {
      if (isPlayingAuto) return;
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;

      if (totalScrollableDistance <= 0) return;

      // Calculate progress relative to container
      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollableDistance));

      setScrollProgress(progress);

      const duration = videoDuration || 10.0;
      targetTimeRef.current = progress * duration;

      // Identify active chapter based on progress
      const chapterIdx = CHAPTERS.findIndex(
        (ch) => progress >= ch.scrollStart && progress <= ch.scrollEnd
      );
      if (chapterIdx !== -1) {
        setCurrentChapterIndex(chapterIdx);
      } else if (progress > 0.98) {
        setCurrentChapterIndex(CHAPTERS.length - 1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPlayingAuto, videoDuration]);

  // Smooth RAF update loop for seamless 60fps video seek
  useEffect(() => {
    const updateVideoFrame = () => {
      const video = videoRef.current;
      if (video && isLoaded && !isPlayingAuto) {
        const diff = targetTimeRef.current - currentTimeRef.current;
        // Smooth lerp easing
        currentTimeRef.current += diff * 0.18;

        if (Math.abs(video.currentTime - currentTimeRef.current) > 0.03) {
          try {
            if (video.fastSeek) {
              video.fastSeek(currentTimeRef.current);
            } else {
              video.currentTime = currentTimeRef.current;
            }
          } catch (e) {
            // Safe fallback
            video.currentTime = currentTimeRef.current;
          }
        }
        setVideoTime(video.currentTime);
      } else if (video && isPlayingAuto) {
        setVideoTime(video.currentTime);
        const progress = video.currentTime / (videoDuration || 10.0);
        setScrollProgress(progress);

        const chapterIdx = CHAPTERS.findIndex(
          (ch) => video.currentTime >= ch.startTime && video.currentTime <= ch.endTime
        );
        if (chapterIdx !== -1) {
          setCurrentChapterIndex(chapterIdx);
        }
      }

      rafIdRef.current = requestAnimationFrame(updateVideoFrame);
    };

    rafIdRef.current = requestAnimationFrame(updateVideoFrame);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isLoaded, isPlayingAuto, videoDuration]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 10.0;
      setVideoDuration(dur);
      setIsLoaded(true);
    }
  };

  // Jump smoothly to a specific chapter
  const jumpToChapter = (index) => {
    if (!containerRef.current) return;
    const ch = CHAPTERS[index];
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const containerTop = rect.top + scrollTop;
    const totalScrollableDistance = rect.height - window.innerHeight;

    const targetScrollY = containerTop + ch.scrollStart * totalScrollableDistance + 10;
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
    setCurrentChapterIndex(index);
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

  const formatTime = (seconds) => {
    const s = Math.max(0, seconds || 0);
    const secs = Math.floor(s);
    const ms = Math.floor((s - secs) * 10);
    return `00:0${secs}.${ms}`;
  };

  return (
    <section
      id="lifecycle"
      ref={containerRef}
      style={{
        position: 'relative',
        height: '420vh', // Extended scroll track for comfortable, silky scrubbing
        backgroundColor: '#000000',
        color: '#f5f5f7',
      }}
    >
      {/* Sticky Fullscreen Keynote Theatre */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        {/* Dynamic Ambient Backlight Glow */}
        <div
          style={{
            position: 'absolute',
            width: '85vw',
            height: '65vh',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${activeChapter.glowColor} 0%, rgba(0,0,0,0) 70%)`,
            filter: 'blur(90px)',
            pointerEvents: 'none',
            transition: 'background 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 1,
          }}
        />

        {/* Video Theatre Frame */}
        <div
          style={{
            position: 'relative',
            width: '92%',
            maxWidth: '1240px',
            height: '82vh',
            borderRadius: '32px',
            overflow: 'hidden',
            backgroundColor: '#0a0a0f',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: `0 25px 70px rgba(0, 0, 0, 0.8), 0 0 50px ${activeChapter.glowColor}`,
            zIndex: 2,
            transition: 'box-shadow 0.6s ease',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Cinema Video Player */}
          <video
            ref={videoRef}
            src="./videos/Create_detailed_e2e_video_20261008222901.mp4"
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={handleLoadedMetadata}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 1,
              filter: 'contrast(1.06) brightness(0.96)',
            }}
          />

          {/* Vignette & Ambient Top/Bottom Gradients */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0.85) 100%)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* Top Bar HUD: Title & Chapter Navigation */}
          <div
            style={{
              position: 'relative',
              zIndex: 5,
              padding: '24px 32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            {/* Brand & Section Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <Layers size={16} color={activeChapter.color} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: '#86868b', fontWeight: 600 }}>
                  KEYNOTE SCROLLYTELLING
                </span>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>
                  The 4-Act Custody Sequence
                </h4>
              </div>
            </div>

            {/* Clickable Chapter Chips */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(20, 20, 25, 0.75)',
                backdropFilter: 'blur(20px)',
                padding: '6px',
                borderRadius: '999px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {CHAPTERS.map((ch, idx) => {
                const isActive = currentChapterIndex === idx;
                return (
                  <button
                    key={ch.id}
                    onClick={() => jumpToChapter(idx)}
                    style={{
                      background: isActive ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                      border: isActive ? `1px solid ${ch.color}` : '1px solid transparent',
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
                      boxShadow: isActive ? `0 0 16px ${ch.color}40` : 'none',
                    }}
                  >
                    <span style={{ color: ch.color, fontWeight: 700, fontSize: '0.72rem' }}>0{ch.id}</span>
                    <span className="chapter-label">{ch.title.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center Stage: Floating Dynamic Glassmorphism Story Card */}
          <div
            style={{
              position: 'relative',
              zIndex: 5,
              flex: 1,
              display: 'flex',
              alignItems: 'flex-end',
              padding: '0 32px 32px 32px',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '24px',
                alignItems: 'flex-end',
              }}
            >
              {/* Left Column: Chapter Details */}
              <div
                style={{
                  gridColumn: 'span 8',
                  pointerEvents: 'auto',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeChapter.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      background: 'rgba(12, 13, 18, 0.82)',
                      backdropFilter: 'blur(30px) saturate(180%)',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      borderRadius: '24px',
                      padding: '28px 32px',
                      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    {/* Chapter Tag Badge */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        border: `1px solid ${activeChapter.color}66`,
                        marginBottom: '14px',
                      }}
                    >
                      {activeChapter.icon}
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          color: activeChapter.color,
                        }}
                      >
                        {activeChapter.tag}
                      </span>
                    </div>

                    <h2
                      style={{
                        fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)',
                        fontWeight: 700,
                        color: '#ffffff',
                        margin: '0 0 8px 0',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.15,
                      }}
                    >
                      {activeChapter.title}
                    </h2>

                    <p
                      style={{
                        fontSize: '0.94rem',
                        color: '#a1a1a6',
                        lineHeight: 1.55,
                        margin: '0 0 20px 0',
                        maxWidth: '680px',
                      }}
                    >
                      {activeChapter.description}
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
                      {activeChapter.telemetry.map((t) => (
                        <div key={t.label}>
                          <div style={{ fontSize: '0.7rem', color: '#86868b', textTransform: 'uppercase' }}>
                            {t.label}
                          </div>
                          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                            {t.val}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Column: Keynote Quick Scrubber / CTA */}
              <div
                style={{
                  gridColumn: 'span 4',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  pointerEvents: 'auto',
                }}
              >
                {/* Scrub HUD Box */}
                <div
                  style={{
                    background: 'rgba(12, 13, 18, 0.82)',
                    backdropFilter: 'blur(30px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
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
                      marginBottom: '12px',
                    }}
                  >
                    <span style={{ fontSize: '0.74rem', color: '#86868b', fontWeight: 600 }}>TIMECODE SCRUB</span>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: activeChapter.color,
                      }}
                    >
                      {formatTime(videoTime)} / 00:10.0
                    </span>
                  </div>

                  {/* Scrub Progress Bar */}
                  <div
                    style={{
                      height: '6px',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      position: 'relative',
                      overflow: 'hidden',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%`,
                        background: `linear-gradient(90deg, #64d2ff, ${activeChapter.color})`,
                        boxShadow: `0 0 10px ${activeChapter.color}`,
                        transition: isPlayingAuto ? 'none' : 'width 0.1s linear',
                      }}
                    />
                  </div>

                  {/* Interactive Controls */}
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
                      <span>{isPlayingAuto ? 'Pause Playback' : 'Autoplay Film'}</span>
                    </button>

                    <button
                      onClick={() => jumpToChapter(0)}
                      title="Reset to Act I"
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
                {onOpenBooking && (
                  <button
                    onClick={onOpenBooking}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #0071e3 0%, #0056b3 100%)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 8px 24px rgba(0, 113, 227, 0.4)',
                    }}
                  >
                    <span>Reserve White-Glove Care</span>
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Prompt Hint */}
        <div
          style={{
            position: 'absolute',
            bottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#86868b',
            fontSize: '0.78rem',
            letterSpacing: '0.04em',
            zIndex: 6,
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: activeChapter.color,
              boxShadow: `0 0 8px ${activeChapter.color}`,
            }}
          />
          <span>Scroll down to advance Apple Keynote motion • Drag or use playback controls</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .chapter-label {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
