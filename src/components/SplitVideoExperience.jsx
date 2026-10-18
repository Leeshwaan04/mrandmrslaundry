import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import businessInfo from '../../content/business-info.json';
import {
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Zap,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Layers,
  Wind,
  Truck,
  Users,
  Clock,
  Star,
  Tag,
  Phone,
  MessageSquare
} from 'lucide-react';
import { ElementsCollection } from '@designcodeio/threeui';

const DRUM_SEGMENTS = [
  {
    id: 1,
    badge: 'STAGE 01 // 24/7 DOORSTEP PICKUP & HYGIENE SORTING',
    title: '1. Schedule & Doorstep Collection',
    description:
      `Book your laundry pickup online, on WhatsApp, or call ${businessInfo.phone} anytime 24/7. Our logistics desk collects your garments right from your doorstep across Mumbai with 100% individual processing — your clothes are never mixed with other households.`,
    startTime: 0.0,
    endTime: 2.5,
    progressStart: 0.0,
    progressEnd: 0.25,
    color: '#64d2ff',
    glowColor: 'rgba(100, 210, 255, 0.35)',
    specs: [
      { label: 'Pickup SLA', val: '24/7 Punctual Slots' },
      { label: 'Hygiene Rule', val: '100% Dedicated Load' },
      { label: 'Free Delivery', val: 'Orders ₹399+' },
    ],
  },
  {
    id: 2,
    badge: 'STAGE 02 // TEMPERATURE-CONTROLLED ECO WASH',
    title: '2. Expert Hydro-Wash & Stain Treatment',
    description:
      'At our Malad East facility, garments undergo fabric sorting and pre-spotting with premium biodegradable, color-protecting detergents. From ₹99/Kg Wash & Fold to non-toxic Hydrocarbon dry cleaning, fabrics stay fresh, soft, and vibrant.',
    startTime: 2.5,
    endTime: 5.0,
    progressStart: 0.25,
    progressEnd: 0.5,
    color: '#2997ff',
    glowColor: 'rgba(41, 151, 255, 0.38)',
    specs: [
      { label: 'Detergents', val: 'Eco Bio-Degradable' },
      { label: 'Dry Cleaning', val: 'Hydrocarbon Non-Toxic' },
      { label: 'Stain Care', val: 'Individual Pre-Spot' },
    ],
  },
  {
    id: 3,
    badge: 'STAGE 03 // LOW-TENSILE EXTRACTION & DRYING',
    title: '3. Gentle Hydro-Spin & Chamber Drying',
    description:
      'Balanced high-efficiency centrifugal extraction evacuates over 85% of retained moisture without mechanical thread strain. Silks, woolens, and delicate ethnic wears dry in humidity-controlled chambers, preventing shrinkage and color bleeding.',
    startTime: 5.0,
    endTime: 7.5,
    progressStart: 0.5,
    progressEnd: 0.75,
    color: '#bf5af2',
    glowColor: 'rgba(191, 90, 242, 0.35)',
    specs: [
      { label: 'Moisture Evac', val: '85%+ High Efficiency' },
      { label: 'Fabric Safety', val: 'Zero Shrinkage' },
      { label: 'Drying Profile', val: 'Humidity Controlled' },
    ],
  },
  {
    id: 4,
    badge: 'STAGE 04 // INDUSTRIAL STEAM PRESS & PACKING',
    title: '4. Delivered Fresh To Your Doorstep',
    description:
      'Garments receive professional steam press finishing for razor-sharp, wrinkle-free drape, then sealed in protective moisture-barrier packaging. Delivered on time within 24 to 48 hours (or 24h Express) with free delivery on orders ₹399+.',
    startTime: 7.5,
    endTime: 10.0,
    progressStart: 0.75,
    progressEnd: 1.0,
    color: '#30d158',
    glowColor: 'rgba(48, 209, 88, 0.35)',
    specs: [
      { label: 'Steam Finishing', val: 'Industrial Ironing' },
      { label: 'Packaging', val: 'Sealed Barrier Packing' },
      { label: 'Turnaround', val: '24h Express / 48h Std' },
    ],
  },
];

export default function SplitVideoExperience({ onOpenBooking, onNavigate }) {
  const [drumScrollProgress, setDrumScrollProgress] = useState(0);
  const [currentSegmentIdx, setCurrentSegmentIdx] = useState(0);
  const [videoDuration, setVideoDuration] = useState(10.0);
  const [faqOpenIdx, setFaqOpenIdx] = useState(0);

  const drumContainerRef = useRef(null);
  const drumVideoRef = useRef(null);
  const isSeekingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!drumContainerRef.current) return;

      const rect = drumContainerRef.current.getBoundingClientRect();
      const scrollHeight = drumContainerRef.current.offsetHeight - window.innerHeight;

      if (scrollHeight > 0) {
        const scrolled = -rect.top;
        const progress = Math.min(Math.max(scrolled / scrollHeight, 0), 1);
        setDrumScrollProgress(progress);

        let activeIdx = 0;
        for (let i = 0; i < DRUM_SEGMENTS.length; i++) {
          if (progress >= DRUM_SEGMENTS[i].progressStart && progress <= DRUM_SEGMENTS[i].progressEnd) {
            activeIdx = i;
            break;
          }
        }
        if (progress >= 1.0) activeIdx = DRUM_SEGMENTS.length - 1;
        setCurrentSegmentIdx(activeIdx);

        if (drumVideoRef.current && drumVideoRef.current.readyState >= 2) {
          const targetDuration = videoDuration || 10.0;
          const targetTime = Math.min(Math.max(progress * targetDuration, 0), targetDuration - 0.05);

          if (!isSeekingRef.current && Math.abs(drumVideoRef.current.currentTime - targetTime) > 0.03) {
            isSeekingRef.current = true;
            drumVideoRef.current.currentTime = targetTime;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [videoDuration]);

  const [copiedCoupon, setCopiedCoupon] = useState(null);
  const handleCopyCode = (code) => {
    try {
      navigator.clipboard?.writeText(code);
      setCopiedCoupon(code);
      setTimeout(() => setCopiedCoupon(null), 2500);
    } catch (e) {
      setCopiedCoupon(code);
      setTimeout(() => setCopiedCoupon(null), 2500);
    }
  };

  const handleVideoLoaded = () => {
    if (drumVideoRef.current) {
      if (drumVideoRef.current.duration && !isNaN(drumVideoRef.current.duration)) {
        setVideoDuration(drumVideoRef.current.duration);
      }
      drumVideoRef.current.currentTime = 0.01;
      drumVideoRef.current.pause();

      drumVideoRef.current.addEventListener('seeked', () => {
        isSeekingRef.current = false;
      });
    }
  };

  const currentSegment = DRUM_SEGMENTS[currentSegmentIdx] || DRUM_SEGMENTS[0];

  const scrollToDrum = () => {
    if (drumContainerRef.current) {
      drumContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const servicesSnapshot = [
    { title: 'Wash & Fold Laundry', price: '₹99/Kg', desc: 'Everyday casual wear, sanitised and neatly fold-packed.', color: '#64d2ff' },
    { title: 'Wash & Iron Laundry', price: '₹159/Kg', desc: 'Crisp industrial steam pressing ready to wear or hang.', color: '#2997ff' },
    { title: 'Dry Cleaning', price: 'Starts @ ₹99', desc: 'Designer suits, silk sarees, delicate embroidery care.', color: '#bf5af2' },
    { title: 'Shoe Laundry & Spa', price: 'Starts @ ₹299', desc: 'Sneakers, leather, suede deep cleaned and deodorised.', color: '#ffd60a' },
    { title: 'Express Laundry (24h)', price: 'Starts @ ₹299/Kg', desc: 'Guaranteed 24-hour rapid turnaround to your door.', color: '#ff375f' },
    { title: 'Premium Garment Care', price: 'Starts @ ₹199/Kg', desc: 'Silk, cashmere, wedding couture pH-neutral washes.', color: '#30d158' },
    { title: 'Heavy Household Laundry', price: 'Starts @ ₹159/Kg', desc: 'Blankets, quilts, comforters sanitized & fluffed.', color: '#ff9f0a' },
    { title: 'Curtain & Drapery Care', price: 'Starts @ ₹14/Sq.ft', desc: 'Deep dust-mite extraction without pleat damage.', color: '#5e5ce6' },
  ];

  const happyReviews = [
    { name: 'Tarif Khan', date: '21 Dec 2024', comment: 'Excellent service. Very prompt pickup and delivery. Clothes smelled super fresh and were packed neatly.' },
    { name: 'Karan Shelar', date: '23 Jun 2024', comment: 'Best dry cleaners in South Mumbai. My blazers and ethnic kurta sets were returned looking completely brand new.' },
    { name: 'Swapnil More', date: '14 Nov 2024', comment: 'Very affordable per-kg rates for daily wear wash and fold. Delivery was exactly within the promised 24 hours.' },
    { name: 'Avinash Khambe', date: '02 Aug 2024', comment: 'The shoe spa exceeded expectations. Removed deep yellowing from my white sneakers. Fantastic job!' },
    { name: 'Tushar Ghanekar', date: '19 Oct 2024', comment: 'Reliable and punctual. Free doorstep delivery above 399 makes it the easiest laundry service in Mumbai.' },
    { name: 'Rohit Pawar', date: '11 Jan 2025', comment: 'Professional steam ironing and packaging. You can trust them with expensive office wear.' },
  ];

  const homeFaqs = [
    { q: '1. How do I schedule a laundry pickup?', a: `You can easily book a pickup directly on our website, WhatsApp us at ${businessInfo.phone}, or simply call 24/7. Our executive will arrive at your chosen Mumbai time slot.` },
    { q: '2. What areas across Mumbai do you serve?', a: 'We proudly serve all localities across South Mumbai (Tardeo, Colaba, Worli, Lower Parel), Western Suburbs (Bandra, Juhu, Andheri, Malad, Borivali), Central Mumbai (Powai, Chembur), Navi Mumbai, and Thane.' },
    { q: '3. How long does it take to get my clothes back?', a: 'Standard wash and steam press takes 24–48 hours. We also provide a guaranteed 24-hour Express Laundry service for urgent requirements.' },
    { q: '4. What is the minimum order for free doorstep pickup?', a: 'Orders of ₹399 or more enjoy 100% FREE doorstep pickup and return delivery across Mumbai!' },
  ];

  return (
    <div style={{ backgroundColor: '#000000', color: '#f5f5f7', position: 'relative' }}>
      {/* ========================================================================= */}
      {/* 1. HERO SECTION — CONTINUOUS VIDEO PLAYBACK                               */}
      {/* Video: Laundry_commercial_combined.mp4 (web-optimized from 4K source)     */}
      {/* ========================================================================= */}
      <section
        id="hero-section"
        style={{
          minHeight: '100vh',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          padding: '120px 24px 80px 24px',
          backgroundColor: '#000000',
        }}
      >
        {/* Continuous Hero Video Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          {/* Continuous Centerpiece Video */}
          <video
            src="./videos/Laundry_commercial_combined.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'contrast(1.08) brightness(0.85)',
            }}
          />

          {/* ThreeUI Elemental Water Canvas (brand mark patched out — see patches/) */}
          <div
            className="shader-frame"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              mixBlendMode: 'screen',
              opacity: 0.95,
              pointerEvents: 'auto',
            }}
          >
            <ElementsCollection
              variant="water"
              speed={1.0}
              size={1.0}
              particleAmount={1.0}
              hue={0}
              saturation={1.0}
              brightness={1.0}
              opacity={1.0}
            />
          </div>

          {/* Vignette & Gradients to ensure text pops cleanly */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0.92) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '240px',
              background: 'linear-gradient(0deg, #000000 0%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Hero Editorial Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            maxWidth: '920px',
            margin: '0 auto',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(0, 113, 227, 0.2)',
              border: '1px solid rgba(0, 113, 227, 0.5)',
              marginBottom: '20px',
              backdropFilter: 'blur(16px)',
            }}
          >
            <Sparkles size={14} color="#64d2ff" />
            <span style={{ fontSize: '0.8rem', color: '#64d2ff', fontWeight: 600 }}>
              MUMBAI’S MOST TRUSTED LAUNDRY &amp; DRY CLEAN SERVICE SINCE 2012
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
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
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1.05rem, 1.8vw, 1.3rem)',
              color: '#d1d1d6',
              maxWidth: '720px',
              margin: '0 auto 36px auto',
              lineHeight: 1.6,
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.9)',
            }}
          >
            Over a decade of excellence, 5,000+ happy clients, and fresh, flawless clothes delivered right to your doorstep across Mumbai, Navi Mumbai, and Thane. Fast, hygienic, and budget-friendly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <button
              onClick={onOpenBooking}
              style={{
                padding: '16px 38px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #0071e3 0%, #0056b3 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '1.02rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 30px rgba(0, 113, 227, 0.55)',
              }}
            >
              <span>Book My Pickup Now</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={scrollToDrum}
              style={{
                padding: '16px 32px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontSize: '1.02rem',
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(16px)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Explore Wash Process</span>
              <ChevronDown size={16} />
            </button>
          </motion.div>
        </div>

        {/* Transition cue */}
        <div
          onClick={scrollToDrum}
          style={{
            position: 'absolute',
            bottom: '32px',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: '#86868b',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          <span>Scroll down to explore our 4-stage cleaning process</span>
          <ChevronDown size={18} style={{ animation: 'bounce 2s infinite' }} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SECTIONS BELOW HERO — SCROLL-DRIVEN VIDEO REVEAL                       */}
      {/* Video: Appliance_washing_clothes_in_drum_20261008222901.mp4               */}
      {/* ========================================================================= */}
      <section
        ref={drumContainerRef}
        id="drum-reveal-container"
        style={{
          position: 'relative',
          height: '420vh',
          backgroundColor: '#000000',
        }}
      >
        {/* Sticky Viewport Housing the Scroll-Driven Video Theatre */}
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
          {/* Dynamic Ambient Halo */}
          <div
            style={{
              position: 'absolute',
              width: '85vw',
              height: '70vh',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${currentSegment.glowColor} 0%, rgba(0,0,0,0) 70%)`,
              filter: 'blur(95px)',
              pointerEvents: 'none',
              transition: 'background 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              zIndex: 1,
            }}
          />

          {/* Theatre Box */}
          <div
            id="drum-theatre-box"
            style={{
              position: 'relative',
              width: '94%',
              maxWidth: '1320px',
              height: '84vh',
              borderRadius: '36px',
              overflow: 'hidden',
              backgroundColor: '#07080c',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 40px 100px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* The Scrubbed Drum Video Background */}
            <video
              ref={drumVideoRef}
              src="./videos/Appliance_washing_clothes_in_drum_20261008222901.mp4"
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={handleVideoLoaded}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 1,
                filter: 'contrast(1.08) brightness(0.92)',
              }}
            />

            {/* Subtle Cinema Overlays */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.92) 100%)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />

            {/* Top Stage Bar: Segment Navigation */}
            <div
              id="drum-stage-top"
              style={{
                position: 'relative',
                zIndex: 5,
                padding: '28px 36px',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
              }}
            >
              {/* Segment Indicator Chips */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(15, 16, 22, 0.8)',
                  backdropFilter: 'blur(20px)',
                  padding: '6px',
                  borderRadius: '999px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {DRUM_SEGMENTS.map((seg, idx) => {
                  const isActive = currentSegmentIdx === idx;
                  return (
                    <div
                      key={seg.id}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '999px',
                        background: isActive ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                        border: isActive ? `1px solid ${seg.color}` : '1px solid transparent',
                        color: isActive ? '#fff' : '#86868b',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.3s ease',
                        boxShadow: isActive ? `0 0 16px ${seg.color}33` : 'none',
                      }}
                    >
                      <span style={{ color: seg.color, fontWeight: 700 }}>0{seg.id}</span>
                      <span className="segment-short">{seg.title.split(' ')[0]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Stage: Progressively Revealed Narrative Card */}
            <div
              id="drum-stage-bottom"
              style={{
                position: 'relative',
                zIndex: 5,
                padding: '0 36px 36px 36px',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(12, 1fr)',
                  gap: '24px',
                  alignItems: 'flex-end',
                }}
              >
                {/* Content Card */}
                <div
                  style={{
                    gridColumn: 'span 8',
                    pointerEvents: 'auto',
                  }}
                  id="drum-left-card"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSegment.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -14 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        background: 'rgba(6, 8, 14, 0.22)',
                        backdropFilter: 'blur(18px) saturate(200%)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.22)',
                        borderRadius: '26px',
                        padding: '28px 32px',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.14)',
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '4px 12px',
                          borderRadius: '999px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: `1px solid ${currentSegment.color}55`,
                          marginBottom: '12px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            color: currentSegment.color,
                          }}
                        >
                          {currentSegment.badge}
                        </span>
                      </div>

                      <h3
                        style={{
                          fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)',
                          fontWeight: 700,
                          color: '#ffffff',
                          margin: '0 0 8px 0',
                          letterSpacing: '-0.02em',
                          lineHeight: 1.15,
                        }}
                      >
                        {currentSegment.title}
                      </h3>

                      <p
                        style={{
                          fontSize: '0.94rem',
                          color: '#a1a1a6',
                          lineHeight: 1.55,
                          margin: '0 0 20px 0',
                          maxWidth: '680px',
                        }}
                      >
                        {currentSegment.description}
                      </p>

                      {/* Live Specs */}
                      <div
                        className="drum-specs-grid"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '12px',
                          paddingTop: '16px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        {currentSegment.specs.map((sp) => (
                          <div key={sp.label}>
                            <div style={{ fontSize: '0.7rem', color: '#86868b', textTransform: 'uppercase' }}>
                              {sp.label}
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                              {sp.val}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Right Column: Booking Button */}
                <div
                  style={{
                    gridColumn: 'span 4',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    pointerEvents: 'auto',
                  }}
                  id="drum-right-card"
                >
                  <button
                    onClick={onOpenBooking}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      borderRadius: '18px',
                      background: 'linear-gradient(135deg, #0071e3 0%, #0056b3 100%)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.94rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 8px 25px rgba(0, 113, 227, 0.45)',
                    }}
                  >
                    <span>Schedule Free Doorstep Pickup</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. WHY CHOOSE MR AND MRS LAUNDRY?                                         */}
      {/* ========================================================================= */}
      <section
        id="why-choose-section"
        style={{
          padding: '100px 24px',
          maxWidth: '1240px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 15,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(0, 113, 227, 0.15)',
              border: '1px solid rgba(0, 113, 227, 0.4)',
              marginBottom: '16px',
            }}
          >
            <ShieldCheck size={14} color="#64d2ff" />
            <span style={{ fontSize: '0.8rem', color: '#64d2ff', fontWeight: 600 }}>
              CARE, TRUST, AND CONVENIENCE
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              marginBottom: '16px',
            }}
          >
            Why Choose Mr and Mrs Laundry?
          </h2>
          <p style={{ color: '#86868b', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
            At Mr. and Mrs. Laundry, we don’t just clean clothes — we deliver trust, hygiene, and convenience with every single pickup.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {[
            {
              tag: '[ ZERO CONTAMINATION ]',
              icon: <ShieldCheck size={24} color="#64d2ff" />,
              title: '100% Individual Hygienic Processing',
              desc: 'Your clothes are cleaned in dedicated individual drums with hospital-grade sanitization. Never mixed with other households at any stage.',
            },
            {
              tag: '[ 24H EXPRESS SLA ]',
              icon: <Clock size={24} color="#30d158" />,
              title: 'Fast & Spotless Turnaround',
              desc: 'Experience swift 24h & 48h turnarounds without compromising on care — fresh, immaculate clothes delivered right on schedule.',
            },
            {
              tag: '[ MASTER TEXTILE CRAFT ]',
              icon: <Users size={24} color="#bf5af2" />,
              title: 'Trained Fabric Masters',
              desc: 'Over 14 years of textile expertise. Every silk saree, designer blazer, and cashmere knit is inspected and custom-treated.',
            },
            {
              tag: '[ GREEN ELECTRIC FLEET ]',
              icon: <Truck size={24} color="#ffd60a" />,
              title: 'Free Doorstep Collection',
              desc: 'Order for just ₹399 or more and receive 100% FREE doorstep pickup and return delivery via our electric fleet across Mumbai.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="threeui-card"
              style={{
                padding: '34px 26px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </div>
                <span className="tasteskill-tag">{item.tag}</span>
              </div>
              <h3 style={{ fontSize: '1.24rem', fontWeight: 700, color: '#fff', marginBottom: '10px', letterSpacing: '-0.01em' }}>
                {item.title}
              </h3>
              <p style={{ color: '#9898a0', fontSize: '0.92rem', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. OUR SERVICES SNAPSHOT                                                   */}
      {/* ========================================================================= */}
      <section
        id="services-snapshot"
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#050508',
          padding: '100px 24px',
          position: 'relative',
          zIndex: 15,
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '50px' }}>
            <div>
              <div style={{ color: '#64d2ff', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                QUICK, CLEAN, AND CONVENIENT
              </div>
              <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 800, color: '#fff', margin: 0 }}>
                Our Services &amp; Rates
              </h2>
            </div>
            <button
              onClick={() => {
                onNavigate('services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="apple-btn-secondary"
              style={{
                padding: '10px 22px',
                fontSize: '0.88rem',
              }}
            >
              <span>View Full Rate Card</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
              gap: '24px',
            }}
          >
            {servicesSnapshot.map((srv) => (
              <div
                key={srv.title}
                className="threeui-card"
                style={{
                  padding: '30px 26px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span className="tasteskill-tag" style={{ color: srv.color, borderColor: `${srv.color}40`, background: `${srv.color}15` }}>
                      CERTIFIED CARE
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#86868b' }}>Mumbai Hub</span>
                  </div>
                  <div style={{ fontSize: '1.24rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                    {srv.title}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: srv.color, marginBottom: '14px', letterSpacing: '-0.02em' }}>
                    {srv.price}
                  </div>
                  <p style={{ color: '#9898a0', fontSize: '0.9rem', lineHeight: 1.55, marginBottom: '24px' }}>
                    {srv.desc}
                  </p>
                </div>
                <button
                  onClick={onOpenBooking}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#64d2ff',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '12px 16px',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(41, 151, 255, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(41, 151, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  }}
                >
                  <span>Book This Service</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOW IT WORKS — AS EASY AS 1-2-3-4!                                      */}
      {/* ========================================================================= */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '100px 24px', position: 'relative', zIndex: 15 }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
            How It Works — As Easy As 1-2-3-4!
          </h2>
          <p style={{ color: '#86868b', fontSize: '1.05rem' }}>
            Getting fresh, clean clothes in Mumbai has never been simpler.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}
        >
          {[
            { step: '01', title: '1. Schedule a Pickup', desc: `Book your laundry pickup online in 60 seconds or give us a quick call 24/7 at ${businessInfo.phone}.` },
            { step: '02', title: '2. We Collect Clothes', desc: 'Our friendly doorstep partner arrives at your chosen slot with sealed antimicrobial garment bags.' },
            { step: '03', title: '3. Expert Cleaning', desc: 'Garments are processed at our Malad East facility using eco-friendly solutions, individual wash cycles & steam form.' },
            { step: '04', title: '4. Doorstep Delivery', desc: 'Delivered back fresh, crisp, perfectly folded or hanger-packed right on time.' },
          ].map((st) => (
            <div
              key={st.step}
              style={{
                background: 'rgba(14, 15, 22, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '32px 24px',
              }}
            >
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#64d2ff', marginBottom: '12px' }}>
                {st.step}
              </div>
              <h3 style={{ fontSize: '1.18rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                {st.title}
              </h3>
              <p style={{ color: '#86868b', fontSize: '0.88rem', lineHeight: 1.6 }}>{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SPECIAL ONGOING OFFERS                                                  */}
      {/* ========================================================================= */}
      <section
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#050508',
          padding: '80px 24px',
          position: 'relative',
          zIndex: 15,
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ color: '#ffd60a', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              SPECIAL OFFERS JUST FOR YOU!
            </div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff' }}>
              Ongoing Deals &amp; Discounts
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(255, 214, 10, 0.1) 0%, rgba(16, 17, 24, 0.8) 100%)',
                border: '1px solid rgba(255, 214, 10, 0.3)',
                borderRadius: '24px',
                padding: '32px',
              }}
            >
              <div style={{ color: '#ffd60a', fontWeight: 700, fontSize: '0.82rem', marginBottom: '8px' }}>
                WELCOME OFFER
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                First-Time User: 10% OFF!
              </h3>
              <p style={{ color: '#a1a1a6', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px' }}>
                New to Mr and Mrs Laundry? Book your first doorstep pickup and enjoy a flat 10% welcome discount.
              </p>
              <button
                onClick={onOpenBooking}
                style={{
                  padding: '10px 20px',
                  borderRadius: '999px',
                  background: '#ffd60a',
                  border: 'none',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                }}
              >
                Claim 10% Off
              </button>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, rgba(48, 209, 88, 0.1) 0%, rgba(16, 17, 24, 0.8) 100%)',
                border: '1px solid rgba(48, 209, 88, 0.3)',
                borderRadius: '24px',
                padding: '32px',
              }}
            >
              <div style={{ color: '#30d158', fontWeight: 700, fontSize: '0.82rem', marginBottom: '8px' }}>
                SHOE SPA DEAL
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                Give 3 Shoes, Get 10% OFF!
              </h3>
              <p style={{ color: '#a1a1a6', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px' }}>
                Restore your favourite sneakers and formal footwear. Give 3 pairs for cleaning and receive 10% discount.
              </p>
              <button
                onClick={onOpenBooking}
                style={{
                  padding: '10px 20px',
                  borderRadius: '999px',
                  background: '#30d158',
                  border: 'none',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                }}
              >
                Book Shoe Spa
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. VERIFIED GOOGLE REVIEWS                                                */}
      {/* ========================================================================= */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '100px 24px', position: 'relative', zIndex: 15 }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#30d158',
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            <Star size={16} fill="#30d158" color="#30d158" />
            <span>4.9 / 5.0 GOOGLE REVIEWS RATING</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 800, color: '#fff' }}>
            Hear It from Our Happy Customers
          </h2>
          <p style={{ color: '#86868b', fontSize: '1rem', marginTop: '6px' }}>
            Real stories, real smiles — discover why thousands across Mumbai trust us with their wardrobe.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '20px',
          }}
        >
          {happyReviews.map((rev) => (
            <div
              key={rev.name}
              style={{
                background: 'rgba(15, 16, 24, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '22px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={15} fill="#ffd60a" color="#ffd60a" />
                  ))}
                </div>
                <p style={{ color: '#d1d1d6', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  "{rev.comment}"
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '14px' }}>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>{rev.name}</div>
                  <div style={{ fontSize: '0.76rem', color: '#86868b' }}>Verified Google Review</div>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#6e6e73' }}>{rev.date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FREQUENTLY ASKED QUESTIONS                                             */}
      {/* ========================================================================= */}
      <section
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#050508',
          padding: '90px 24px',
          position: 'relative',
          zIndex: 15,
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: '#86868b' }}>Find quick answers about scheduling, coverage, and turnaround.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {homeFaqs.map((faq, idx) => {
              const isOpen = faqOpenIdx === idx;
              return (
                <div
                  key={faq.q}
                  style={{
                    background: 'rgba(15, 16, 22, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '18px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setFaqOpenIdx(isOpen ? -1 : idx)}
                    style={{
                      width: '100%',
                      padding: '18px 24px',
                      background: 'none',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      color="#64d2ff"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease',
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: '0 24px 20px 24px',
                        color: '#a1a1a6',
                        fontSize: '0.92rem',
                        lineHeight: 1.6,
                        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                        paddingTop: '12px',
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. SCHEDULE PICKUP BANNER                                                 */}
      {/* ========================================================================= */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '80px 24px 100px 24px', position: 'relative', zIndex: 15 }}>
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(16, 17, 24, 0.95) 0%, rgba(8, 9, 13, 0.98) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '32px',
            padding: '56px 44px',
            textAlign: 'center',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(0, 113, 227, 0.25)',
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
            <Sparkles size={14} color="#64d2ff" />
            <span style={{ fontSize: '0.8rem', color: '#f5f5f7', fontWeight: 600 }}>
              FREE PICKUP &amp; DELIVERY ON ORDERS ₹399+
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '16px',
            }}
          >
            Schedule Your Laundry Pickup Today.
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#a1a1a6',
              maxWidth: '600px',
              margin: '0 auto 36px auto',
              lineHeight: 1.6,
            }}
          >
            Fresh, clean, and hassle-free laundry awaits you. Handled with surgical care in Malad East and returned to your door.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenBooking}
              style={{
                padding: '16px 40px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #0071e3 0%, #0056b3 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 10px 30px rgba(0, 113, 227, 0.5)',
              }}
            >
              <span>Book My Pickup Now</span>
              <ArrowRight size={18} />
            </button>

            <a
              href={`https://wa.me/${businessInfo.whatsappDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '16px 32px',
                borderRadius: '999px',
                background: '#25D366',
                border: 'none',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <MessageSquare size={18} />
              <span>WhatsApp: {businessInfo.phone}</span>
            </a>
          </div>
        </div>
      </section>

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
        @media (max-width: 900px) {
          .segment-short {
            display: none !important;
          }
          #drum-left-card {
            grid-column: span 12 !important;
          }
          #drum-right-card {
            grid-column: span 12 !important;
          }
        }
        @media (max-width: 640px) {
          #drum-theatre-box {
            width: 96% !important;
            height: 90vh !important;
            border-radius: 22px !important;
          }
          #drum-stage-top {
            padding: 16px 14px !important;
          }
          #drum-stage-bottom {
            padding: 0 14px 18px 14px !important;
          }
          #drum-left-card > div {
            padding: 16px 16px !important;
            border-radius: 20px !important;
          }
          .drum-specs-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 6px !important;
          }
          .drum-specs-grid div div:first-child {
            font-size: 0.62rem !important;
          }
          .drum-specs-grid div div:last-child {
            font-size: 0.92rem !important;
          }
        }
      `}</style>
    </div>
  );
}
