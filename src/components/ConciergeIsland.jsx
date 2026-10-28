import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Calendar,
  X,
  Sparkles,
  Phone,
  ArrowRight,
  CheckCircle2,
  Clock,
  Truck,
  Zap,
  MapPin,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { trackEvent } from '../analytics';
import businessInfo from '../../content/business-info.json';

const POPULAR_LOCALITIES = [
  'Tardeo',
  'Bandra West',
  'Worli',
  'Malad East',
  'Lower Parel',
  'Powai',
  'Juhu',
  'Andheri West'
];

const QUICK_SERVICES = [
  { id: 'wf', label: 'Wash & Fold', price: '₹99/Kg' },
  { id: 'wi', label: 'Wash & Iron', price: '₹129/Kg' },
  { id: 'dc', label: 'Dry Cleaning', price: 'From ₹199' },
  { id: 'ss', label: 'Shoe Spa', price: 'From ₹299' }
];

export default function ConciergeIsland({ onOpenFullBooking }) {
  // State: 'pill' | 'whatsapp-menu' | 'express-form' | 'success'
  const [viewState, setViewState] = useState('pill');
  const [isScrolledCompact, setIsScrolledCompact] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [locality, setLocality] = useState('Tardeo');
  const [selectedService, setSelectedService] = useState('Wash & Fold (₹99/Kg)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState('');

  const islandRef = useRef(null);

  // Detect time of day for status badge
  const currentHour = new Date().getHours();
  const isBusinessHours = currentHour >= 8 && currentHour < 21;
  const statusBadgeText = isBusinessHours ? 'Live Vans Active in Mumbai' : 'Book for Tomorrow 8 AM';

  // Smart Scroll: Auto-compact on rapid downward scroll, expand when idle or scrolling up
  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 150 && currentScrollY > lastScrollY && viewState === 'pill') {
        setIsScrolledCompact(true);
      } else if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsScrolledCompact(false);
      }
      setLastScrollY(currentScrollY);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolledCompact(false);
      }, 1400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [lastScrollY, viewState]);

  // Click outside to collapse
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (islandRef.current && !islandRef.current.contains(e.target)) {
        if (viewState !== 'pill') {
          setViewState('pill');
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [viewState]);

  // 1-Tap WhatsApp Prompts
  const handleWhatsAppPrompt = (promptType) => {
    let messageText = '';
    if (promptType === 'pickup') {
      messageText = `Hi Mr & Mrs Laundry! I would like to book a doorstep laundry pickup for today in ${locality || 'Mumbai'}.`;
    } else if (promptType === 'rates') {
      messageText = `Hi Mr & Mrs Laundry! Could you please share the complete price list for Wash & Fold and Dry Cleaning?`;
    } else if (promptType === 'express') {
      messageText = `Hi Mr & Mrs Laundry! I need urgent 24-hour express laundry service. Please let me know the earliest pickup slot.`;
    }

    trackEvent('whatsapp_click', {
      source: 'concierge_island',
      prompt_type: promptType,
      page_path: window.location.pathname
    });

    const url = `https://wa.me/${businessInfo.whatsappDigits}?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setViewState('pill');
  };

  // Express Form Submit
  const handleExpressSubmit = (e) => {
    e.preventDefault();
    if (!phone.trim() || phone.trim().length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    const orderId = `MML-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedOrderId(orderId);

    // 1. Record lead in browser storage cache
    try {
      const existing = JSON.parse(localStorage.getItem('mml_leads_cache') || '[]');
      const newEntry = {
        id: orderId,
        customerName: name || 'Express Web Lead',
        phone: phone,
        locality: locality,
        service: selectedService,
        status: 'New Inquiry',
        createdAt: new Date().toISOString(),
        source: 'Floating Concierge Island'
      };
      localStorage.setItem('mml_leads_cache', JSON.stringify([newEntry, ...existing]));
    } catch (err) {
      /* no-op */
    }

    // 2. Track in Google Analytics 4 via GTM
    trackEvent('booking_confirmed', {
      order_id: orderId,
      service: selectedService,
      locality: locality,
      source: 'concierge_island'
    });

    // 3. Confetti Celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8, x: 0.85 },
      colors: ['#0071e3', '#2997ff', '#38bdf8', '#30d158', '#ffffff']
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setViewState('success');

      // 4. Auto-launch WhatsApp with pre-filled confirmation
      const waMessage =
        `*New Mr & Mrs Laundry Express Pickup Request*\n` +
        `🆔 Order: ${orderId}\n` +
        `👤 Name: ${name || 'Customer'}\n` +
        `📞 Phone: ${phone}\n` +
        `📍 Locality: ${locality}\n` +
        `🧺 Service: ${selectedService}\n\n` +
        `Please confirm the earliest doorstep pickup window. Thank you!`;

      trackEvent('booking_whatsapp_sent', { order_id: orderId, locality: locality, source: 'concierge_island' });

      setTimeout(() => {
        window.open(`https://wa.me/${businessInfo.whatsappDigits}?text=${encodeURIComponent(waMessage)}`, '_blank', 'noopener,noreferrer');
      }, 700);
    }, 600);
  };

  return (
    <div
      ref={islandRef}
      style={{
        position: 'fixed',
        bottom: '22px',
        right: '22px',
        zIndex: 900,
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      <AnimatePresence mode="wait">
        {/* ========================================================= */}
        {/* VIEW 1: RESTING PILL / DYNAMIC ISLAND                    */}
        {/* ========================================================= */}
        {viewState === 'pill' && (
          <motion.div
            key="pill"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              background: 'rgba(10, 14, 23, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(56, 189, 248, 0.28)',
              borderRadius: '9999px',
              padding: isScrolledCompact ? '8px' : '6px 8px 6px 14px',
              boxShadow:
                '0 16px 36px -6px rgba(0, 0, 0, 0.75), 0 0 24px -2px rgba(37, 99, 235, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: isScrolledCompact ? '0' : '10px',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            {isScrolledCompact ? (
              // Compact Droplet on fast downward scroll
              <button
                onClick={() => setIsScrolledCompact(false)}
                title="Open Concierge"
                style={{
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px',
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #16a34a 0%, #2563eb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 0 12px rgba(37, 99, 235, 0.5)'
                  }}
                >
                  <MessageCircle size={18} />
                </div>
              </button>
            ) : (
              // Full Floating Dynamic Island Pill
              <>
                {/* Live Status Indicator */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    paddingRight: '6px',
                    borderRight: '1px solid rgba(255, 255, 255, 0.12)'
                  }}
                  onClick={() => setViewState('express-form')}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#34d399',
                      boxShadow: '0 0 8px #34d399',
                      display: 'inline-block'
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#e2e8f0',
                      letterSpacing: '0.01em',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {statusBadgeText}
                  </span>
                </div>

                {/* WhatsApp Quick Hop Button */}
                <button
                  onClick={() => setViewState('whatsapp-menu')}
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(22, 163, 74, 0.35)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp</span>
                </button>

                {/* Express 30s Booking Button */}
                <button
                  onClick={() => setViewState('express-form')}
                  style={{
                    background: 'linear-gradient(135deg, #0071e3 0%, #2563eb 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '8px 15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 12px rgba(37, 99, 235, 0.45)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <Zap size={14} style={{ fill: '#ffd60a', color: '#ffd60a' }} />
                  <span>Book (30s)</span>
                </button>
              </>
            )}
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: WHATSAPP SMART PROMPT MENU                        */}
        {/* ========================================================= */}
        {viewState === 'whatsapp-menu' && (
          <motion.div
            key="whatsapp-menu"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              width: '320px',
              background: 'rgba(10, 14, 23, 0.94)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(34, 197, 94, 0.35)',
              borderRadius: '20px',
              padding: '18px',
              boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.8), 0 0 24px rgba(34, 197, 94, 0.25)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}
                >
                  <MessageCircle size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>WhatsApp Concierge</div>
                  <div style={{ fontSize: '0.74rem', color: '#34d399' }}>● Typically replies in 2 minutes</div>
                </div>
              </div>
              <button
                onClick={() => setViewState('pill')}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '12px', lineHeight: 1.4 }}>
              Choose a quick request to start your chat with our Mumbai dispatch team:
            </p>

            {/* Smart 1-Tap Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => handleWhatsAppPrompt('pickup')}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(34, 197, 94, 0.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
              >
                <span>🧺 Schedule Doorstep Pickup</span>
                <ArrowRight size={14} color="#34d399" />
              </button>

              <button
                onClick={() => handleWhatsAppPrompt('rates')}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(34, 197, 94, 0.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
              >
                <span>💰 Check Rates &amp; Per-Kg Pricing</span>
                <ArrowRight size={14} color="#34d399" />
              </button>

              <button
                onClick={() => handleWhatsAppPrompt('express')}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(34, 197, 94, 0.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
              >
                <span>⚡ Urgent 24h Express Laundry</span>
                <ArrowRight size={14} color="#ffd60a" />
              </button>
            </div>

            {/* Switch to Express Form */}
            <div style={{ marginTop: '12px', textAlign: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                onClick={() => setViewState('express-form')}
                style={{ background: 'transparent', border: 'none', color: '#38bdf8', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Prefer to fill a quick 30s form instead? →
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: 30-SECOND EXPRESS BOOKING MICRO-FORM              */}
        {/* ========================================================= */}
        {viewState === 'express-form' && (
          <motion.div
            key="express-form"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              width: '340px',
              maxWidth: '92vw',
              background: 'rgba(10, 14, 23, 0.95)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '22px',
              padding: '20px',
              boxShadow: '0 24px 48px -8px rgba(0, 0, 0, 0.85), 0 0 28px rgba(37, 99, 235, 0.3)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={16} color="#ffd60a" fill="#ffd60a" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                    Fast Doorstep Pickup
                  </h3>
                </div>
                <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Free pickup on orders ₹399+ &bull; 100% individual drums
                </p>
              </div>
              <button
                onClick={() => setViewState('pill')}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleExpressSubmit}>
              {/* Field 1: Customer Name */}
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Your Name (e.g. Rahul S.)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.07)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Field 2: Phone Number */}
              <div style={{ marginBottom: '12px' }}>
                <input
                  type="tel"
                  required
                  placeholder="Mobile Number (e.g. 98200 12345) *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.07)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Field 3: Select Neighborhood / Locality */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Select Locality:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '72px', overflowY: 'auto' }}>
                  {POPULAR_LOCALITIES.map((loc) => (
                    <button
                      type="button"
                      key={loc}
                      onClick={() => setLocality(loc)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        background: locality === loc ? '#2563eb' : 'rgba(255, 255, 255, 0.07)',
                        color: locality === loc ? '#fff' : '#cbd5e1'
                      }}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 4: Select Service */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Select Service:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {QUICK_SERVICES.map((srv) => (
                    <button
                      type="button"
                      key={srv.id}
                      onClick={() => setSelectedService(`${srv.label} (${srv.price})`)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '8px',
                        fontSize: '0.76rem',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        background: selectedService.includes(srv.label) ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: selectedService.includes(srv.label) ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)',
                        color: '#fff'
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>{srv.label}</div>
                      <div style={{ color: '#38bdf8', fontSize: '0.72rem' }}>{srv.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #16a34a 0%, #2563eb 100%)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(37, 99, 235, 0.45)'
                }}
              >
                <Sparkles size={16} />
                <span>{isSubmitting ? 'Confirming...' : 'Confirm Pickup on WhatsApp'}</span>
              </button>
            </form>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: SUCCESS CONFIRMATION MODAL                        */}
        {/* ========================================================= */}
        {viewState === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              width: '320px',
              background: 'rgba(10, 14, 23, 0.96)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(48, 209, 88, 0.4)',
              borderRadius: '20px',
              padding: '24px 20px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 24px rgba(48, 209, 88, 0.25)'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(48, 209, 88, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}
            >
              <CheckCircle2 size={28} />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>
              Pickup Scheduled!
            </h4>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
              Order ID: <strong style={{ color: '#38bdf8' }}>{submittedOrderId}</strong>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '18px' }}>
              Your details have been logged. WhatsApp is opening to finalize your pickup window with our Mumbai logistics van.
            </p>
            <button
              onClick={() => setViewState('pill')}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
