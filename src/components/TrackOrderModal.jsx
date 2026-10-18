import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Sparkles,
  Phone,
  MessageSquare,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import businessInfo from '../../content/business-info.json';

export default function TrackOrderModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const mockOrder = {
    orderId: query.startsWith('MML') ? query.toUpperCase() : 'MML-8842',
    customerPhone: query.length >= 10 ? query : businessInfo.phone,
    pickupDate: 'Today, 10:30 AM',
    estimatedDelivery: 'Tomorrow by 6:00 PM',
    status: 'In Eco-Hydro Wash',
    currentStep: 3,
    locality: 'South Mumbai (Tardeo / Worli)',
    itemsSummary: '4.2 Kg Wash & Fold + 2 Pairs Sneakers',
    steps: [
      { step: 1, title: 'Pickup Scheduled', desc: 'Confirmed by South Mumbai Logistics Desk', time: '10:00 AM' },
      { step: 2, title: 'Collected by Doorstep Partner', desc: 'Transferred in sealed cedar container', time: '10:45 AM' },
      { step: 3, title: 'In Eco-Hydro & Steam Cycle', desc: 'At Malad East Central Facility (Current Stage)', time: '12:30 PM' },
      { step: 4, title: 'Quality Check & Antibacterial Sealing', desc: 'Inspection under 5000K daylight inspection', time: 'Pending' },
      { step: 5, title: 'Out for Doorstep Delivery', desc: 'Zero-emission electric delivery vehicle', time: 'Pending' },
    ],
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setHasSearched(true);
    }
  };

  const handleClose = () => {
    setHasSearched(false);
    setQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
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
          onClick={handleClose}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(16px)',
          }}
        />

        {/* Modal Window */}
        <motion.div
          className="track-order-modal-window"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '620px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'linear-gradient(180deg, #12131c 0%, #0a0b10 100%)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '28px',
            padding: '36px',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 113, 227, 0.2)',
            zIndex: 10,
          }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>

          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#30d158',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#30d158' }} />
              <span>Real-Time Order Tracking</span>
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
              Track Your Laundry Order
            </h3>
            <p style={{ color: '#86868b', fontSize: '0.92rem', marginTop: '6px' }}>
              Enter your 10-digit mobile number or Order ID (e.g., MML-8842) to view live progress.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 9152233822 or MML-8842"
              required
              style={{
                flex: 1,
                padding: '14px 18px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: '0.98rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '14px 24px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #0071e3 0%, #0056b3 100%)',
                border: 'none',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Search size={18} />
              <span>Track</span>
            </button>
          </form>

          {/* Results Display */}
          {hasSearched ? (
            <div>
              {/* Order Details Header */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '20px',
                  marginBottom: '28px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#86868b' }}>
                    Order ID: <strong style={{ color: '#64d2ff' }}>{mockOrder.orderId}</strong>
                  </div>
                  <div
                    style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: 'rgba(48, 209, 88, 0.15)',
                      color: '#30d158',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}
                  >
                    Active In Facility
                  </div>
                </div>

                <div style={{ fontSize: '0.92rem', color: '#f5f5f7', fontWeight: 600 }}>
                  {mockOrder.itemsSummary}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#86868b', marginTop: '4px' }}>
                  Estimated Delivery: <strong style={{ color: '#fff' }}>{mockOrder.estimatedDelivery}</strong>
                </div>
              </div>

              {/* Progress Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                {mockOrder.steps.map((st) => {
                  const isDone = st.step < mockOrder.currentStep;
                  const isCurrent = st.step === mockOrder.currentStep;
                  const isPending = st.step > mockOrder.currentStep;

                  return (
                    <div key={st.step} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: isDone
                            ? '#30d158'
                            : isCurrent
                            ? 'rgba(0, 113, 227, 0.3)'
                            : 'rgba(255, 255, 255, 0.06)',
                          border: isCurrent
                            ? '2px solid #0071e3'
                            : isPending
                            ? '1px solid rgba(255, 255, 255, 0.1)'
                            : 'none',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontSize: '0.85rem',
                          fontWeight: 700,
                        }}
                      >
                        {isDone ? <CheckCircle2 size={18} color="#000" /> : st.step}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <h4
                            style={{
                              fontSize: '0.98rem',
                              fontWeight: 700,
                              color: isPending ? '#86868b' : '#ffffff',
                              margin: 0,
                            }}
                          >
                            {st.title}
                          </h4>
                          <span style={{ fontSize: '0.78rem', color: isCurrent ? '#64d2ff' : '#86868b' }}>
                            {st.time}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.84rem', color: '#86868b', marginTop: '3px', margin: 0 }}>
                          {st.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Help Actions */}
              <div
                style={{
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ fontSize: '0.85rem', color: '#86868b' }}>Need expedited delivery or have instructions?</div>
                <a
                  href={`https://wa.me/${businessInfo.whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    background: '#25D366',
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp Logistics</span>
                </a>
              </div>
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '30px 20px',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px dashed rgba(255, 255, 255, 0.1)',
              }}
            >
              <PackageCheck size={36} color="#64d2ff" style={{ margin: '0 auto 12px auto' }} />
              <div style={{ fontSize: '0.95rem', color: '#f5f5f7', fontWeight: 600 }}>
                Live GPS &amp; Facility Barcode Tracking
              </div>
              <p style={{ fontSize: '0.85rem', color: '#86868b', maxWidth: '380px', margin: '6px auto 0 auto' }}>
                Every garment bag is scanned at pickup in Tardeo / Mumbai and logged at the Malad facility.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .track-order-modal-window {
            padding: 24px 18px !important;
            border-radius: 20px !important;
          }
        }
      `}</style>
    </AnimatePresence>
  );
}
