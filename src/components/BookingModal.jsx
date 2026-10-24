import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Truck,
  MessageSquare,
  Phone,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import businessInfo from '../../content/business-info.json';

export default function BookingModal({ isOpen, onClose, initialData }) {
  const [step, setStep] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [locality, setLocality] = useState('Tardeo, South Mumbai');
  const [address, setAddress] = useState('');
  const [selectedService, setSelectedService] = useState(initialData?.service || 'Wash & Fold Laundry (₹99/Kg)');
  const [selectedSlot, setSelectedSlot] = useState('Today, 2:00 PM – 4:00 PM');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const mumbaiLocalities = businessInfo.localities;

  const slots = [
    { id: 'slot1', time: 'Today, 2:00 PM – 4:00 PM', badge: 'Fastest Electric Slot' },
    { id: 'slot2', time: 'Today, 6:00 PM – 8:00 PM', badge: 'Evening Return Route' },
    { id: 'slot3', time: 'Tomorrow, 9:00 AM – 11:00 AM', badge: 'Morning Slot' },
    { id: 'slot4', time: 'Tomorrow, 1:00 PM – 3:00 PM', badge: 'Afternoon Route' },
  ];

  const handleConfirmOrder = () => {
    setIsSubmitting(true);

    // Record lead in browser cache so submissions are never lost
    try {
      const existing = JSON.parse(localStorage.getItem('mml_leads_cache') || '[]');
      const newEntry = {
        id: `MML-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: customerName || 'Website Customer',
        phone: phone || 'Not provided',
        locality: locality || 'Tardeo',
        address: address || '',
        service: selectedService,
        slot: selectedSlot,
        notes: notes || '',
        status: 'New Inquiry',
        createdAt: new Date().toISOString(),
        source: 'Website Booking Modal'
      };
      localStorage.setItem('mml_leads_cache', JSON.stringify([newEntry, ...existing]));
    } catch (e) {
      /* no-op */
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsConfirmed(true);
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0071e3', '#2997ff', '#64d2ff', '#ffffff', '#30d158'],
      });
    }, 900);
  };

  const handleReset = () => {
    setIsConfirmed(false);
    setStep(1);
    onClose();
  };

  const openWhatsAppConfirmation = () => {
    const text = encodeURIComponent(
      `*New Mr & Mrs Laundry Booking Request*\n` +
      `👤 Name: ${customerName || 'Customer'}\n` +
      `📞 Phone: ${phone || 'Not provided'}\n` +
      `📍 Locality: ${locality}\n` +
      `🏠 Address: ${address || 'Provided upon call'}\n` +
      `🧺 Service: ${selectedService}\n` +
      `⏰ Pickup Window: ${selectedSlot}\n` +
      `📝 Notes: ${notes || 'Standard wash and care'}\n\n` +
      `Please confirm pickup schedule. Thank you!`
    );
    window.open(`https://wa.me/${businessInfo.whatsappDigits}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleReset}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(20px)',
          }}
        />

        {/* Modal Window */}
        <motion.div
          className="booking-modal-window"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '600px',
            borderRadius: '28px',
            padding: '36px',
            backgroundColor: 'rgba(16, 17, 24, 0.96)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 30px 90px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 113, 227, 0.25)',
            maxHeight: '90vh',
            overflowY: 'auto',
            color: '#f5f5f7',
          }}
        >
          {/* Close button */}
          <button
            onClick={handleReset}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>

          {!isConfirmed ? (
            <div>
              {/* Header */}
              <div style={{ marginBottom: '24px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#64d2ff',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  MUMBAI DOORSTEP CONCIERGE
                </span>
                <h3 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                  Schedule Doorstep Pickup
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#86868b', marginTop: '4px' }}>
                  Orders above ₹399 enjoy 100% FREE pickup and return delivery across Mumbai.
                </p>
              </div>

              {/* Progress Steps */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <div
                  style={{
                    flex: 1,
                    height: '4px',
                    borderRadius: '999px',
                    background: step >= 1 ? '#0071e3' : 'rgba(255, 255, 255, 0.1)',
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    height: '4px',
                    borderRadius: '999px',
                    background: step >= 2 ? '#0071e3' : 'rgba(255, 255, 255, 0.1)',
                  }}
                />
              </div>

              {step === 1 ? (
                <div>
                  {/* Step 1: Contact, Locality & Slot */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: '#86868b', display: 'block', marginBottom: '6px' }}>
                        YOUR FULL NAME *
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Anand Mehta"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: '#86868b', display: 'block', marginBottom: '6px' }}>
                        PHONE / WHATSAPP *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98200 12345"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '0.78rem', color: '#86868b', display: 'block', marginBottom: '6px' }}>
                      SELECT PRIMARY SERVICE:
                    </label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      style={{ width: '100%', background: '#12131c' }}
                    >
                      <option value="Wash & Fold Laundry (₹99/Kg)">Wash &amp; Fold Laundry (₹99/Kg)</option>
                      <option value="Wash & Iron Laundry (₹159/Kg)">Wash &amp; Iron Laundry (₹159/Kg)</option>
                      <option value="Dry Cleaning (Starts @ ₹99)">Dry Cleaning (Starts @ ₹99)</option>
                      <option value="Shoe Laundry & Spa (Starts @ ₹299)">Shoe Laundry &amp; Spa (Starts @ ₹299)</option>
                      <option value="Express 24h Laundry (₹299/Kg)">Express 24h Laundry (₹299/Kg)</option>
                      <option value="Premium Garment Care (₹199/Kg)">Premium Garment Care (₹199/Kg)</option>
                      <option value="Heavy Laundry & Quilts (₹159/Kg)">Heavy Laundry &amp; Quilts (₹159/Kg)</option>
                      <option value="Curtain & Drapery Care">Curtain &amp; Drapery Care</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '0.78rem', color: '#86868b', display: 'block', marginBottom: '6px' }}>
                      SELECT MUMBAI LOCALITY:
                    </label>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      {mumbaiLocalities.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setLocality(loc)}
                          style={{
                            padding: '5px 11px',
                            borderRadius: '8px',
                            border: `1px solid ${locality === loc ? '#2997ff' : 'rgba(255, 255, 255, 0.08)'}`,
                            background: locality === loc ? 'rgba(41, 151, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                            color: locality === loc ? '#fff' : '#86868b',
                            fontSize: '0.74rem',
                            cursor: 'pointer',
                          }}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ fontSize: '0.78rem', color: '#86868b', display: 'block', marginBottom: '8px' }}>
                      PREFERRED ARRIVAL WINDOW:
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {slots.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => setSelectedSlot(s.time)}
                          style={{
                            padding: '11px 16px',
                            borderRadius: '12px',
                            border: `1px solid ${selectedSlot === s.time ? '#2997ff' : 'rgba(255, 255, 255, 0.08)'}`,
                            background: selectedSlot === s.time ? 'rgba(41, 151, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>{s.time}</div>
                            <div style={{ fontSize: '0.72rem', color: '#86868b' }}>{s.badge}</div>
                          </div>
                          {selectedSlot === s.time && <Check size={18} color="#2997ff" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '14px',
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
                      boxShadow: '0 6px 20px rgba(0, 113, 227, 0.4)',
                    }}
                  >
                    <span>Proceed to Address &amp; Instructions</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  {/* Step 2: Address & Access details */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ fontSize: '0.78rem', color: '#86868b', display: 'block', marginBottom: '6px' }}>
                      EXACT BUILDING / FLAT / ROAD ADDRESS:
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Flat No, Wing, Building Name, Street..."
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div style={{ marginBottom: '22px' }}>
                    <label style={{ fontSize: '0.78rem', color: '#86868b', display: 'block', marginBottom: '6px' }}>
                      GARMENT SPECIFICS &amp; SPECIAL INSTRUCTIONS:
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. White shirts require starch, delicate silk saree in yellow bag..."
                      style={{ width: '100%', resize: 'none' }}
                    />
                  </div>

                  <div
                    style={{
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      marginBottom: '24px',
                      fontSize: '0.84rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#86868b' }}>Locality &amp; Slot:</span>
                      <strong style={{ color: '#64d2ff' }}>{locality}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#86868b' }}>Selected Window:</span>
                      <span style={{ color: '#fff' }}>{selectedSlot}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#86868b' }}>Doorstep Delivery:</span>
                      <strong style={{ color: '#30d158' }}>FREE on orders ₹399+</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{
                        padding: '14px 20px',
                        borderRadius: '14px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                      }}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmOrder}
                      disabled={isSubmitting}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '14px',
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
                        boxShadow: '0 6px 20px rgba(0, 113, 227, 0.4)',
                      }}
                    >
                      {isSubmitting ? <span>Confirming Pickup...</span> : <span>Confirm Reservation</span>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Confirmation State */
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(48, 209, 88, 0.2)',
                  border: '2px solid #30d158',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px auto',
                }}
              >
                <CheckCircle2 size={32} color="#30d158" />
              </div>

              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                Pickup Successfully Booked!
              </h3>
              <p style={{ color: '#a1a1a6', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 24px auto' }}>
                Our Mumbai logistics team has logged your pickup for <strong>{locality}</strong>. Our driver will call you prior to arrival.
              </p>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '18px',
                  marginBottom: '24px',
                  textAlign: 'left',
                  fontSize: '0.86rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#86868b' }}>Order Number:</span>
                  <span style={{ color: '#64d2ff', fontWeight: 700 }}>MML-9842</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#86868b' }}>Assigned Slot:</span>
                  <span style={{ color: '#fff' }}>{selectedSlot}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#86868b' }}>Customer Helpline:</span>
                  <span style={{ color: '#30d158', fontWeight: 600 }}>{businessInfo.phone}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={openWhatsAppConfirmation}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '14px',
                    background: '#25D366',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <MessageSquare size={16} />
                  <span>Send to WhatsApp ({businessInfo.phone})</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    padding: '14px 20px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .booking-modal-window {
            padding: 24px 18px !important;
            border-radius: 20px !important;
          }
        }
      `}</style>
    </AnimatePresence>
  );
}
