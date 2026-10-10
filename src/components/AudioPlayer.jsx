import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music, Disc3, Sparkles } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.loop = true;

    // Optional autoplay attempt (browser may block without user interaction)
    const tryAutoplay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        // Autoplay policy prevented playback until user interaction
        setIsPlaying(false);
      }
    };

    // Listen for first user click anywhere to enable audio if not started
    const handleFirstClick = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    };
    window.addEventListener('click', handleFirstClick, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstClick);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setHasInteracted(true);
      }).catch((e) => console.log('Audio playback prevented:', e));
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.muted = false;
      setIsMuted(false);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      if (newVol === 0) setIsMuted(true);
      else setIsMuted(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="./on-my-own-chill-winston-main-version-49662-02-59.mp3" preload="auto" />

      {/* Floating Apple Audio HUD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 90,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 14px',
          borderRadius: '9999px',
          background: 'rgba(18, 19, 26, 0.88)',
          backdropFilter: 'blur(24px) saturate(190%)',
          WebkitBackdropFilter: 'blur(24px) saturate(190%)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 113, 227, 0.2)',
        }}
        onMouseEnter={() => setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
      >
        {/* Spinning Vinyl / Disc Icon */}
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0071e3 0%, #2997ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: isPlaying ? '0 0 15px rgba(41, 151, 255, 0.5)' : 'none',
          }}
          onClick={togglePlay}
          title={isPlaying ? 'Pause Soundtrack' : 'Play Soundtrack'}
        >
          <Disc3 size={18} color="#ffffff" />
        </motion.div>

        {/* Track Title & Equalizer Animation */}
        <div
          onClick={togglePlay}
          style={{
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.01em' }}>
              The Way We Shine
            </span>
            <span
              style={{
                fontSize: '0.64rem',
                color: '#64d2ff',
                padding: '1px 5px',
                borderRadius: '999px',
                background: 'rgba(41, 151, 255, 0.18)',
                fontWeight: 600,
              }}
            >
              OST
            </span>
          </div>
          <span style={{ fontSize: '0.68rem', color: '#86868b' }}>Steven Beddall • 112 BPM</span>
        </div>

        {/* Equalizer Visualizer Bars */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '2.5px',
            height: '16px',
            padding: '0 4px',
            cursor: 'pointer',
          }}
          onClick={togglePlay}
        >
          {[0.6, 1.0, 0.4, 0.8, 0.5].map((scale, i) => (
            <motion.span
              key={i}
              animate={{
                height: isPlaying ? [`${4 * scale}px`, `${16 * scale}px`, `${6 * scale}px`] : '3px',
              }}
              transition={{
                duration: 0.5 + i * 0.1,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
              style={{
                width: '2.5px',
                borderRadius: '999px',
                background: isPlaying ? '#2997ff' : '#515154',
              }}
            />
          ))}
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label={isPlaying ? 'Pause soundtrack' : 'Play soundtrack'}
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} />}
        </button>

        {/* Volume & Mute */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
          <button
            onClick={toggleMute}
            style={{
              background: 'none',
              border: 'none',
              color: isMuted ? '#86868b' : '#64d2ff',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <AnimatePresence>
            {showVolumeSlider && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '60px' }}
                exit={{ opacity: 0, width: 0 }}
                style={{ overflow: 'hidden', display: 'flex', alignItems: 'center' }}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  style={{
                    width: '60px',
                    height: '4px',
                    accentColor: '#2997ff',
                    cursor: 'pointer',
                  }}
                  aria-label="Volume slider"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
