import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * CottonJourneyScroll
 * ---------------------------------------------------------------------------
 * An Apple-product-page style scroll-scrubbed video story: raw cotton fiber
 * becoming finished shirt fabric, told through a tall pinned section whose
 * video position tracks scroll position. The footage is the hero; chrome is
 * reduced to a persistent eyebrow, a single frosted-glass caption chip that
 * crossfades through five staged lines, and a hairline progress rail.
 *
 * Desktop: true scroll-scrubbing of video.currentTime, eased every frame
 * toward a scroll-derived target (RAF lerp + fastSeek), adapted from this
 * repo's KeynoteScrubber.jsx.
 * Mobile / coarse pointer / small viewport: autoplay+loop+muted video with
 * scroll-triggered caption fades and subtle parallax instead of seeking.
 * prefers-reduced-motion: a plain, non-pinned autoplaying loop with a single
 * static caption — no scrubbing, no scroll listener, no parallax.
 */

const VIDEO_SRC = './videos/Cotton_fiber_weaving_into_shirt.mp4';

const STAGES = [
  {
    id: 0,
    kicker: 'RAW MATERIAL',
    line: 'It begins as nothing more than raw cotton fiber — soft, fragile, unformed.',
    start: 0,
    end: 0.2,
    color: '#64d2ff',
  },
  {
    id: 1,
    kicker: 'THE SPIN',
    line: 'Spun thread by thread, under tension precise enough to never break a single strand.',
    start: 0.2,
    end: 0.4,
    color: '#2997ff',
  },
  {
    id: 2,
    kicker: 'THE WEAVE',
    line: 'Woven tight, row by row, into a fabric built to hold its shape for years.',
    start: 0.4,
    end: 0.6,
    color: '#bf5af2',
  },
  {
    id: 3,
    kicker: 'THE FINISH',
    line: 'Finished by hand and checked by eye, long before it ever becomes a shirt.',
    start: 0.6,
    end: 0.8,
    color: '#ff9f0a',
  },
  {
    id: 4,
    kicker: 'OUR PROMISE',
    line: 'That same devotion is how we treat every garment you send us.',
    start: 0.8,
    end: 1.001,
    color: '#30d158',
  },
];

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    let mql;
    try {
      mql = window.matchMedia(query);
    } catch (e) {
      return undefined;
    }
    const update = () => setMatches(mql.matches);
    update();
    try {
      mql.addEventListener('change', update);
      return () => mql.removeEventListener('change', update);
    } catch (e) {
      // Safari < 14 fallback
      mql.addListener(update);
      return () => mql.removeListener(update);
    }
  }, [query]);

  return matches;
}

function getStageIndex(progress) {
  for (let i = 0; i < STAGES.length; i++) {
    if (progress >= STAGES[i].start && progress < STAGES[i].end) return i;
  }
  return STAGES.length - 1;
}

export default function CottonJourneyScroll() {
  const isCoarsePointer = useMediaQuery('(pointer: coarse)');
  const isSmallViewport = useMediaQuery('(max-width: 820px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // Mobile / touch routes through a lightweight fallback: autoplay+loop
  // video with scroll-driven caption fades instead of currentTime scrubbing.
  const useSimpleMode = (isCoarsePointer || isSmallViewport) && !prefersReducedMotion;
  const useScrubMode = !isCoarsePointer && !isSmallViewport && !prefersReducedMotion;

  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const rafRef = useRef(null);
  const inViewRef = useRef(true);

  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);

  const handleLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.duration && !isNaN(v.duration) && isFinite(v.duration)) {
      setDuration(v.duration);
    }
    setIsReady(true);
    if (!useScrubMode) {
      v.play().catch(() => {});
    } else {
      // Nudge off frame 0 so the first paint already shows motion-ready footage.
      try {
        v.currentTime = 0.01;
      } catch (e) {
        /* noop */
      }
      v.pause();
    }
  }, [useScrubMode]);

  const handleVideoError = useCallback(() => {
    setHasError(true);
  }, []);

  // Scroll -> progress, for scrub mode and simple (mobile) mode only. Gated
  // by IntersectionObserver so this (and its layout read) is skipped while
  // scrolled anywhere else on the page, not just when this section is active.
  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const recalc = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      let p;
      if (useScrubMode) {
        const total = rect.height - vh;
        p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      } else {
        // Shorter, non-pinned container: derive progress from how far it has
        // travelled through the viewport (0 entering, 1 fully passed).
        p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      }

      setProgress(p);
      setStageIdx(getStageIndex(p));

      if (useScrubMode) {
        const dur = duration || 10;
        targetTimeRef.current = p * dur;
      }
    };

    let scheduled = false;
    const handleScroll = () => {
      if (!inViewRef.current || scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        recalc();
      });
    };

    recalc();
    window.addEventListener('scroll', handleScroll, { passive: true });

    let io;
    const el = containerRef.current;
    if (el && typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        ([entry]) => {
          inViewRef.current = entry.isIntersecting;
        },
        { rootMargin: '50% 0px' }
      );
      io.observe(el);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (io) io.disconnect();
    };
  }, [useScrubMode, duration, prefersReducedMotion]);

  // Buttery scroll-scrubbing: ease currentTime toward the scroll-derived
  // target every frame instead of assigning it directly (desktop only).
  useEffect(() => {
    if (!useScrubMode) return undefined;

    const tick = () => {
      const v = videoRef.current;
      if (v && isReady && !hasError && inViewRef.current) {
        const diff = targetTimeRef.current - currentTimeRef.current;
        currentTimeRef.current += diff * 0.16;

        if (Math.abs(v.currentTime - currentTimeRef.current) > 0.02) {
          try {
            if (v.fastSeek) {
              v.fastSeek(currentTimeRef.current);
            } else {
              v.currentTime = currentTimeRef.current;
            }
          } catch (e) {
            try {
              v.currentTime = currentTimeRef.current;
            } catch (e2) {
              /* noop */
            }
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [useScrubMode, isReady, hasError]);

  const activeStage = STAGES[stageIdx] || STAGES[0];
  const finalStage = stageIdx === STAGES.length - 1;

  const containerHeight = prefersReducedMotion ? '100vh' : useScrubMode ? '440vh' : '260vh';
  const stickyPosition = prefersReducedMotion ? 'relative' : 'sticky';
  const showScrollHint = useScrubMode && progress < 0.04;
  const videoScale = useSimpleMode ? 1 + progress * 0.05 : 1;

  const captionMotion = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.01 },
      }
    : useSimpleMode
    ? {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
      }
    : {
        initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, y: -12, filter: 'blur(6px)' },
        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
      };

  // ---------------------------------------------------------------------
  // Reduced-motion: a plain, non-pinned, non-scroll-linked section. One
  // static narrative caption, a simple autoplaying muted loop, no parallax,
  // no scrubbing, no scroll listener at all.
  // ---------------------------------------------------------------------
  if (prefersReducedMotion) {
    return (
      <section
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '560px',
          backgroundColor: '#000000',
          color: '#f5f5f7',
          fontFamily: 'var(--font-sans)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        {!hasError && (
          <video
            src={VIDEO_SRC}
            muted
            loop
            autoPlay
            playsInline
            preload="auto"
            onError={handleVideoError}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'contrast(1.05) saturate(1.05) brightness(0.9)',
            }}
          />
        )}
        {hasError && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(160deg, #0a0a0c 0%, #000000 100%)',
            }}
          />
        )}

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(0deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.35) 100%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 'clamp(20px, 4vh, 40px)',
            left: 'clamp(20px, 4vw, 48px)',
            fontSize: '0.68rem',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(245, 245, 247, 0.5)',
          }}
        >
          From Fiber to Fabric
        </div>

        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            paddingBottom: 'clamp(48px, 10vh, 100px)',
            paddingLeft: '20px',
            paddingRight: '20px',
          }}
        >
          <div
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.16em',
              color: '#30d158',
              textTransform: 'uppercase',
            }}
          >
            OUR PROMISE
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              lineHeight: 1.4,
              color: '#f5f5f7',
              textAlign: 'center',
              maxWidth: '620px',
            }}
          >
            From raw fiber to finished fabric, every stage is treated with care.
            That same devotion is how we treat every garment you send us.
          </p>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------
  // Scrub (desktop) and simple (mobile) modes share the same visual shell.
  // ---------------------------------------------------------------------
  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        height: containerHeight,
        backgroundColor: '#000000',
        color: '#f5f5f7',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div
        style={{
          position: stickyPosition,
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          backgroundColor: '#000000',
        }}
      >
        {/* Full-bleed footage — the only real content of this section */}
        {!hasError ? (
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            muted
            playsInline
            preload="auto"
            loop={useSimpleMode}
            autoPlay={useSimpleMode}
            onLoadedMetadata={handleLoadedMetadata}
            onError={handleVideoError}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${videoScale})`,
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              filter: 'contrast(1.05) saturate(1.05) brightness(0.96)',
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(160deg, #0a0a0c 0%, #000000 100%)',
            }}
          />
        )}

        {/* Tiny persistent section mark — the only "always on" chrome */}
        <div
          style={{
            position: 'absolute',
            top: 'clamp(20px, 4vh, 40px)',
            left: 'clamp(20px, 4vw, 48px)',
            zIndex: 4,
            fontSize: '0.68rem',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(245, 245, 247, 0.5)',
          }}
        >
          From Fiber to Fabric
        </div>

        {/* Soft legibility gradient — kept to the lower third only */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '38vh',
            background: 'linear-gradient(0deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Floating frosted-glass caption chip */}
        <div
          style={{
            position: 'relative',
            zIndex: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '18px',
            paddingBottom: 'clamp(44px, 9vh, 104px)',
            paddingLeft: '20px',
            paddingRight: '20px',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage.id}
              initial={captionMotion.initial}
              animate={captionMotion.animate}
              exit={captionMotion.exit}
              transition={captionMotion.transition}
              style={{
                background: 'rgba(22, 22, 26, 0.4)',
                backdropFilter: 'blur(24px) saturate(160%)',
                WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '20px',
                padding: '18px 28px',
                maxWidth: '580px',
                textAlign: 'center',
                boxShadow: '0 16px 44px rgba(0, 0, 0, 0.35)',
              }}
            >
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  color: activeStage.color,
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                }}
              >
                {activeStage.kicker}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 'clamp(1.05rem, 2vw, 1.4rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.4,
                  color: '#f5f5f7',
                }}
              >
                {activeStage.line}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Brand reveal at the climax of the story — no CTA, just the name */}
          <AnimatePresence>
            {finalStage && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                style={{
                  fontSize: 'clamp(0.78rem, 1.4vw, 0.95rem)',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(245, 245, 247, 0.65)',
                }}
              >
                Mr &amp; Mrs Laundry
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hairline progress rail — Apple-style section dots, desktop only */}
        {useScrubMode && (
          <div
            className="cotton-progress-rail"
            style={{
              position: 'absolute',
              right: 'clamp(14px, 3vw, 32px)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {STAGES.map((s, i) => {
              const isPast = progress >= s.end - 0.001;
              const isActive = i === stageIdx;
              return (
                <div
                  key={s.id}
                  style={{
                    width: isActive ? '6px' : '4px',
                    height: isActive ? '22px' : '14px',
                    borderRadius: '3px',
                    backgroundColor: isActive || isPast ? s.color : 'rgba(255, 255, 255, 0.22)',
                    boxShadow: isActive ? `0 0 10px ${s.color}` : 'none',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Opening scroll cue — fades away the instant the story begins */}
        <AnimatePresence>
          {showScrollHint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'absolute',
                bottom: 'clamp(16px, 3vh, 28px)',
                right: 'clamp(16px, 4vw, 40px)',
                zIndex: 4,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'rgba(245, 245, 247, 0.55)',
                fontSize: '0.72rem',
                letterSpacing: '0.06em',
              }}
            >
              <span>Scroll</span>
              <ChevronDown size={13} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .cotton-progress-rail {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
