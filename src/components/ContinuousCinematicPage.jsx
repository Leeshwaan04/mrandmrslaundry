import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ChevronDown,
  Waves,
  Scan,
  Car,
  ShieldCheck,
  ArrowRight,
  Volume2,
  VolumeX,
  CheckCircle2,
  RotateCw
} from 'lucide-react';

export default function ContinuousCinematicPage({ onOpenBooking }) {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [isReady, setIsReady] = useState(false);

  // Smooth lerp interpolation refs
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const rafIdRef = useRef(null);

  // Audio toggle
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsAudioPlaying(true);
    }
  };

  // Listen to window scroll and calculate exact total page progression
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (maxScroll <= 0) return;

      const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
      setScrollProgress(progress);

      // Target video time directly proportional to scroll (0.0s to 10.0s)
      targetTimeRef.current = progress * 10.0;

      // Active section determination
      if (progress < 0.20) {
        setActiveSection('hero');
      } else if (progress < 0.45) {
        setActiveSection('vortex');
      } else if (progress < 0.70) {
        setActiveSection('atelier');
      } else if (progress < 0.90) {
        setActiveSection('dispatch');
      } else {
        setActiveSection('footer');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth 60fps seek loop using requestAnimationFrame and decode guard
  useEffect(() => {
    const updateLoop = () => {
      const video = videoRef.current;
      if (video && isReady) {
        // Damped linear interpolation for silky frame progression
        const diff = targetTimeRef.current - currentTimeRef.current;
        currentTimeRef.current += diff * 0.14;

        if (!isSeekingRef.current && Math.abs(video.currentTime - currentTimeRef.current) > 0.02) {
          isSeekingRef.current = true;
          try {
            if (video.fastSeek) {
              video.fastSeek(currentTimeRef.current);
            } else {
              video.currentTime = currentTimeRef.current;
            }
          } catch (e) {
            video.currentTime = currentTimeRef.current;
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(updateLoop);
    };

    rafIdRef.current = requestAnimationFrame(updateLoop);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isReady]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.addEventListener('seeked', () => {
        isSeekingRef.current = false;
      });
      setIsReady(true);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ backgroundColor: '#000000', color: '#f5f5f7', position: 'relative' }}>
      {/* Background Audio */}
      <audio ref={audioRef} src="./on-my-own-chill-winston-main-version-49662-02-59.mp3" loop preload="none" />

      {/* FIXED 1080P CINEMATIC VIDEO BACKGROUND (Persists across the entire page) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
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
            filter: 'contrast(1.08) brightness(0.92)',
          }}
        />

        {/* Cinematic Scrim & Vignette for Perfect Contrast */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 65%, rgba(0,0,0,0.92) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '160px',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, transparent 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '160px',
            background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* TOP NAVBAR: Minimalist Frosted Glass */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(8, 9, 13, 0.75)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '14px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Brand */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #0071e3 0%, #64d2ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0, 113, 227, 0.5)',
            }}
          >
            <Sparkles size={16} color="#fff" />
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>
            Mr &amp; Mrs Laundry
          </span>
        </div>

        {/* Section Navigation */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
          className="desktop-nav"
        >
          <button
            onClick={() => scrollToSection('sec-hero')}
            style={{
              background: 'none',
              border: 'none',
              color: activeSection === 'hero' ? '#fff' : '#86868b',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
          >
            01 Molecular
          </button>
          <button
            onClick={() => scrollToSection('sec-vortex')}
            style={{
              background: 'none',
              border: 'none',
              color: activeSection === 'vortex' ? '#fff' : '#86868b',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
          >
            02 Drum Vortex
          </button>
          <button
            onClick={() => scrollToSection('sec-atelier')}
            style={{
              background: 'none',
              border: 'none',
              color: activeSection === 'atelier' ? '#fff' : '#86868b',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
          >
            03 Atelier
          </button>
          <button
            onClick={() => scrollToSection('sec-dispatch')}
            style={{
              background: 'none',
              border: 'none',
              color: activeSection === 'dispatch' ? '#fff' : '#86868b',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
          >
            04 Dispatch
          </button>
          <button
            onClick={() => scrollToSection('sec-reserve')}
            style={{
              background: 'none',
              border: 'none',
              color: activeSection === 'footer' ? '#fff' : '#86868b',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
          >
            05 Reserve
          </button>
        </nav>

        {/* Right Actions: Audio Toggle & Booking Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Subtle Audio Toggle */}
          <button
            onClick={toggleAudio}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: isAudioPlaying ? 'rgba(0, 113, 227, 0.25)' : 'rgba(255, 255, 255, 0.08)',
              border: isAudioPlaying ? '1px solid #0071e3' : '1px solid rgba(255, 255, 255, 0.12)',
              color: isAudioPlaying ? '#64d2ff' : '#86868b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title={isAudioPlaying ? 'Mute Soundtrack' : 'Play Soundtrack (On My Own — Chill Winston)'}
          >
            {isAudioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Reserve Pickup Button */}
          <button
            onClick={onOpenBooking}
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              background: '#0071e3',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background 0.2s',
            }}
          >
            <span>Book Pickup</span>
            <ChevronDown size={14} style={{ transform: 'rotate(-90deg)' }} />
          </button>
        </div>
      </header>

      {/* MAIN SCROLL-DRIVEN CONTENT FLOW (Natural scroll down the page) */}
      <main style={{ position: 'relative', zIndex: 10 }}>
        {/* ========================================================= */}
        {/* SECTION 1: HERO (0.0s – 2.5s / Molecular Cavitation)      */}
        {/* ========================================================= */}
        <section
          id="sec-hero"
          style={{
            minHeight: '140vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '120px 24px',
            position: 'relative',
          }}
        >
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                marginBottom: '24px',
              }}
            >
              <Sparkles size={14} color="#64d2ff" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f5f5f7', letterSpacing: '0.04em' }}>
                ACT I // MOLECULAR PHYSICS
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.8rem, 6vw, 5.2rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                color: '#ffffff',
                marginBottom: '24px',
                textShadow: '0 4px 30px rgba(0, 0, 0, 0.85)',
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
            </h1>

            <p
              style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                color: '#d2d2d7',
                lineHeight: 1.6,
                maxWidth: '680px',
                margin: '0 auto 36px',
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.85)',
              }}
            >
              High-frequency micro-cavitation collapses millions of ionized bubbles across delicate woven fibers, removing contaminants without mechanical friction.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={onOpenBooking}
                style={{
                  padding: '14px 32px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #0071e3 0%, #0056b3 100%)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.94rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(0, 113, 227, 0.5)',
                }}
              >
                Schedule Doorstep Care
              </button>
            </div>
          </div>

          {/* Gentle scroll indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              color: '#86868b',
              fontSize: '0.8rem',
            }}
          >
            <span>Scroll down to continue the sequence</span>
            <ChevronDown size={18} style={{ animation: 'bounce 2s infinite' }} />
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: DRUM VORTEX (2.5s – 5.0s / Hydrodynamic Rinse) */}
        {/* ========================================================= */}
        <section
          id="sec-vortex"
          style={{
            minHeight: '140vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '120px 48px',
            position: 'relative',
          }}
        >
          <div
            style={{
              maxWidth: '640px',
              background: 'rgba(10, 11, 16, 0.84)',
              backdropFilter: 'blur(30px) saturate(190%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '32px',
              padding: '44px',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(41, 151, 255, 0.2)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 14px',
                borderRadius: '999px',
                backgroundColor: 'rgba(41, 151, 255, 0.12)',
                border: '1px solid rgba(41, 151, 255, 0.4)',
                marginBottom: '16px',
              }}
            >
              <Waves size={16} color="#2997ff" />
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#2997ff', letterSpacing: '0.08em' }}>
                ACT II // DRUM HYDRODYNAMICS
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                marginBottom: '14px',
              }}
            >
              Dual-Helix Centrifugal Vortex.
            </h2>

            <p style={{ fontSize: '1rem', color: '#a1a1a6', lineHeight: 1.6, marginBottom: '28px' }}>
              Inside the surgical-grade titanium drum, water forms calibrated dual-helix vortex currents. Garments remain suspended in laminar fluid currents, ensuring complete chemical neutralization with zero fiber stress.
            </p>

            {/* Spec Metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '14px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: '#86868b', textTransform: 'uppercase' }}>VORTEX SPEED</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>1,450 RPM</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#86868b', textTransform: 'uppercase' }}>TEMPERATURE</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2997ff', marginTop: '2px' }}>28°C Cold</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#86868b', textTransform: 'uppercase' }}>WATER REUSE</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#30d158', marginTop: '2px' }}>94.6% Closed</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: ATELIER ROBOTICS (5.0s – 7.5s / Laser Press)   */}
        {/* ========================================================= */}
        <section
          id="sec-atelier"
          style={{
            minHeight: '140vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            padding: '120px 48px',
            position: 'relative',
          }}
        >
          <div
            style={{
              maxWidth: '640px',
              background: 'rgba(10, 11, 16, 0.84)',
              backdropFilter: 'blur(30px) saturate(190%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '32px',
              padding: '44px',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(255, 55, 95, 0.2)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 14px',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 55, 95, 0.12)',
                border: '1px solid rgba(255, 55, 95, 0.4)',
                marginBottom: '16px',
              }}
            >
              <Scan size={16} color="#ff375f" />
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ff375f', letterSpacing: '0.08em' }}>
                ACT III // ATELIER ROBOTICS
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                marginBottom: '14px',
              }}
            >
              Laser-Guided Crease &amp; Silhouette Alignment.
            </h2>

            <p style={{ fontSize: '1rem', color: '#a1a1a6', lineHeight: 1.6, marginBottom: '28px' }}>
              Dual articulated robotic arms elevate tailored blazers and couture onto custom cedar forms. Red laser optical scanners inspect drape symmetry and lapel tension with ±0.2 mm precision before dry-steam setting.
            </p>

            {/* Spec Metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '14px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: '#86868b', textTransform: 'uppercase' }}>LASER SENSOR</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ff375f', marginTop: '2px' }}>±0.2 mm</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#86868b', textTransform: 'uppercase' }}>DRY-STEAM FOG</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>3.5 µm</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#86868b', textTransform: 'uppercase' }}>CARE GRADE</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffd666', marginTop: '2px' }}>Bespoke AAA</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 4: WHITE-GLOVE DISPATCH (7.5s – 9.2s / Electric)  */}
        {/* ========================================================= */}
        <section
          id="sec-dispatch"
          style={{
            minHeight: '140vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '120px 48px',
            position: 'relative',
          }}
        >
          <div
            style={{
              maxWidth: '640px',
              background: 'rgba(10, 11, 16, 0.84)',
              backdropFilter: 'blur(30px) saturate(190%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '32px',
              padding: '44px',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(191, 90, 242, 0.2)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 14px',
                borderRadius: '999px',
                backgroundColor: 'rgba(191, 90, 242, 0.12)',
                border: '1px solid rgba(191, 90, 242, 0.4)',
                marginBottom: '16px',
              }}
            >
              <Car size={16} color="#bf5af2" />
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#bf5af2', letterSpacing: '0.08em' }}>
                ACT IV // ZERO-EMISSION DISPATCH
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                marginBottom: '14px',
              }}
            >
              Autonomous Midnight Doorstep Return.
            </h2>

            <p style={{ fontSize: '1rem', color: '#a1a1a6', lineHeight: 1.6, marginBottom: '28px' }}>
              Sealed in custom antimicrobial cedar boxes, garments travel in climate-stabilized electric vehicles. Delivered back to your doorstep within your selected 60-minute evening or morning window.
            </p>

            {/* Spec Metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '14px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: '#86868b', textTransform: 'uppercase' }}>FLEET EMISSION</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#30d158', marginTop: '2px' }}>0.00 g/km</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#86868b', textTransform: 'uppercase' }}>SECURITY CHAIN</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#bf5af2', marginTop: '2px' }}>SHA-256 RFID</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#86868b', textTransform: 'uppercase' }}>SLA WINDOW</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>Exact 60 Min</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 5: FOOTER & RESERVATION (9.2s – 10.0s / Complete) */}
        {/* ========================================================= */}
        <section
          id="sec-reserve"
          style={{
            minHeight: '120vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '120px 24px 80px 24px',
            position: 'relative',
          }}
        >
          <div
            style={{
              maxWidth: '860px',
              width: '100%',
              background: 'linear-gradient(180deg, rgba(16, 17, 24, 0.88) 0%, rgba(8, 9, 13, 0.98) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '36px',
              padding: '64px 48px',
              textAlign: 'center',
              boxShadow: '0 40px 100px rgba(0, 0, 0, 0.9), 0 0 80px rgba(0, 113, 227, 0.25)',
              marginBottom: '64px',
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
                border: '1px solid rgba(255, 255, 255, 0.15)',
                marginBottom: '20px',
              }}
            >
              <CheckCircle2 size={14} color="#30d158" />
              <span style={{ fontSize: '0.8rem', color: '#f5f5f7', fontWeight: 600 }}>
                Film Complete • Doorstep Concierge Active
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                marginBottom: '18px',
              }}
            >
              Your wardrobe.{'\n'}
              <span
                style={{
                  background: 'linear-gradient(135deg, #64d2ff 0%, #2997ff 60%, #bf5af2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Conserved forever.
              </span>
            </h2>

            <p
              style={{
                fontSize: '1.1rem',
                color: '#a1a1a6',
                maxWidth: '600px',
                margin: '0 auto 36px auto',
                lineHeight: 1.6,
              }}
            >
              Reserve your white-glove collection. Returned pristine, laser-pressed, and sealed in cedar vaults.
            </p>

            <button
              onClick={onOpenBooking}
              style={{
                padding: '18px 42px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #0071e3 0%, #0056b3 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '1.05rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 12px 35px rgba(0, 113, 227, 0.55)',
              }}
            >
              <span>Reserve Concierge Pickup</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Minimalist Legal & Copyright Links */}
          <div
            style={{
              maxWidth: '860px',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.78rem',
              color: '#6e6e73',
            }}
          >
            <div>
              © 2026 Mr &amp; Mrs Laundry Inc. Engineered for textile permanence.
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <span style={{ color: '#86868b' }}>Privacy Policy</span>
              <span style={{ color: '#86868b' }}>Custody Terms</span>
              <span style={{ color: '#30d158' }}>100% Net-Zero Fleet</span>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(6px);
          }
          60% {
            transform: translateY(3px);
          }
        }
        @media (max-width: 800px) {
          .desktop-nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
