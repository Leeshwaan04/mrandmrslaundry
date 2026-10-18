import React, { useState } from 'react';
import { motion } from 'framer-motion';
import businessInfo from '../../content/business-info.json';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  ChevronDown,
  Building2,
  ArrowRight
} from 'lucide-react';

export default function ContactPage({ onOpenBooking }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    locality: '',
    service: 'Wash & Fold Laundry (₹99/Kg)',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Mr & Mrs Laundry! I would like to schedule a pickup from ${formData.locality || 'Mumbai'}. My name is ${formData.name || 'Customer'}.`
    );
    window.open(`https://wa.me/${businessInfo.whatsappDigits}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const faqs = [
    {
      q: '1. How do I schedule a laundry pickup?',
      a: `You can easily book a pickup directly on our website, via WhatsApp, or simply give us a quick call at ${businessInfo.phone} anytime 24/7. Our executive will arrive at your door during your selected time window.`,
    },
    {
      q: '2. What areas across Mumbai do you serve?',
      a: 'We proudly serve all localities across South Mumbai (Tardeo, Colaba, Marine Lines, Worli, Lower Parel), Western Suburbs (Bandra, Juhu, Andheri, Malad, Borivali), Central Mumbai (Powai, Chembur, Ghatkopar), as well as Navi Mumbai and Thane regions.',
    },
    {
      q: '3. How long does it take to get my clothes back?',
      a: 'Our standard turnaround is 24 to 48 hours for wash, steam pressing, and dry cleaning. For urgent requirements, choose our Express Service for a guaranteed 24-hour return right to your doorstep.',
    },
    {
      q: '4. What is the minimum order for free doorstep delivery?',
      a: 'Orders of ₹399 or more enjoy 100% FREE doorstep pickup and return delivery!',
    },
    {
      q: '5. How are delicate fabrics, silk sarees, and designer suits handled?',
      a: 'Delicate items undergo our Premium Care cycle. Silk sarees and woolens are processed in cold, pH-neutral non-solvent solutions without mechanical friction, then steam-finished on specialized formers.',
    },
    {
      q: '6. What payment options are accepted?',
      a: 'We accept all digital payment methods including Google Pay, PhonePe, Paytm, UPI, Credit & Debit Cards, Net Banking, and Cash on Delivery upon receiving your fresh garments.',
    },
  ];

  return (
    <div style={{ backgroundColor: '#000000', color: '#f5f5f7', minHeight: '100vh', paddingTop: '100px' }}>
      {/* Header */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '60px 24px 60px 24px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            background: 'rgba(0, 113, 227, 0.15)',
            border: '1px solid rgba(0, 113, 227, 0.4)',
            marginBottom: '20px',
          }}
        >
          <Sparkles size={14} color="#64d2ff" />
          <span style={{ fontSize: '0.8rem', color: '#64d2ff', fontWeight: 600 }}>
            WE'RE JUST A CALL OR MESSAGE AWAY
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '20px',
            color: '#ffffff',
          }}
        >
          Let’s Get Your Laundry Sorted!
        </h1>

        <p style={{ fontSize: '1.15rem', color: '#a1a1a6', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
          Reach our South Mumbai retail store or Malad processing facility. Call, message on WhatsApp, or send a request online for instant response.
        </p>
      </section>

      {/* Contact Cards & Form Grid */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '20px 24px 90px 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
          }}
        >
          {/* Left Column: Direct Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Phone & WhatsApp Card */}
            <div
              style={{
                background: 'rgba(15, 16, 22, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '30px',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(48, 209, 88, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Phone size={20} color="#30d158" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                    Phone &amp; WhatsApp Support
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#30d158', fontWeight: 600 }}>Active 24/7 Helpline</div>
                </div>
              </div>

              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
                {businessInfo.phone}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={`tel:+${businessInfo.phoneDigits}`}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                  }}
                >
                  Call Now
                </a>
                <button
                  onClick={openWhatsApp}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: '#25D366',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  WhatsApp Us
                </button>
              </div>
            </div>

            {/* Email Card */}
            <div
              style={{
                background: 'rgba(15, 16, 22, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '30px',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(100, 210, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Mail size={20} color="#64d2ff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                    Official Email
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#86868b' }}>For inquiries &amp; corporate laundry</div>
                </div>
              </div>

              <a
                href={`mailto:${businessInfo.email}`}
                style={{ fontSize: '1.1rem', fontWeight: 600, color: '#64d2ff', textDecoration: 'none' }}
              >
                {businessInfo.email}
              </a>
            </div>

            {/* Store & Hub Locations Card */}
            <div
              style={{
                background: 'rgba(15, 16, 22, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '30px',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(191, 90, 242, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MapPin size={20} color="#bf5af2" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                    Locations in Mumbai
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#86868b' }}>Storefront &amp; Processing Hub</div>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.92rem', color: '#fff', fontWeight: 600 }}>Tardeo Store:</div>
                <div style={{ fontSize: '0.85rem', color: '#86868b', lineHeight: 1.5, marginTop: '2px' }}>
                  {businessInfo.addresses[0].line1}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.92rem', color: '#fff', fontWeight: 600 }}>Malad Central Facility:</div>
                <div style={{ fontSize: '0.85rem', color: '#86868b', lineHeight: 1.5, marginTop: '2px' }}>
                  {businessInfo.addresses[1].line1}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a1a1a6', fontSize: '0.82rem' }}>
                <Clock size={14} color="#ffd60a" />
                <span>{businessInfo.hours.openDays} | {businessInfo.hours.closedDays}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Inquiry / Pickup Form */}
          <div
            style={{
              background: 'linear-gradient(180deg, rgba(20, 22, 32, 0.9) 0%, rgba(10, 11, 16, 0.98) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '28px',
              padding: '38px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
            }}
          >
            <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              Send a Message or Request
            </h3>
            <p style={{ color: '#86868b', fontSize: '0.9rem', marginBottom: '24px' }}>
              Fill in your details and we will get back to you immediately to confirm your doorstep pickup.
            </p>

            {submitted ? (
              <div
                style={{
                  padding: '30px',
                  borderRadius: '20px',
                  background: 'rgba(48, 209, 88, 0.1)',
                  border: '1px solid rgba(48, 209, 88, 0.3)',
                  textAlign: 'center',
                }}
              >
                <CheckCircle2 size={42} color="#30d158" style={{ margin: '0 auto 14px auto' }} />
                <h4 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>
                  Thank you, {formData.name || 'valued customer'}!
                </h4>
                <p style={{ color: '#a1a1a6', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  We have received your details. Our Mumbai logistics desk will call you at {formData.phone} shortly.
                </p>
                <button
                  onClick={openWhatsApp}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    background: '#25D366',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Confirm on WhatsApp Now
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#86868b', marginBottom: '6px' }}>
                    YOUR FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#86868b', marginBottom: '6px' }}>
                    PHONE NUMBER (CALL OR WHATSAPP) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#86868b', marginBottom: '6px' }}>
                    YOUR MUMBAI LOCALITY / PIN CODE *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    placeholder="e.g. Tardeo, Bandra West, Malad East, Powai..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#86868b', marginBottom: '6px' }}>
                    SERVICE OF INTEREST
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: '#12131a',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  >
                    <option value="Wash & Fold Laundry (₹99/Kg)">Wash &amp; Fold Laundry (₹99/Kg)</option>
                    <option value="Wash & Iron Laundry (₹159/Kg)">Wash &amp; Iron Laundry (₹159/Kg)</option>
                    <option value="Dry Cleaning (Starts @ ₹99)">Dry Cleaning (Starts @ ₹99)</option>
                    <option value="Shoe Laundry & Spa (Starts @ ₹299)">Shoe Laundry &amp; Spa (Starts @ ₹299)</option>
                    <option value="Express 24h Laundry (₹299/Kg)">Express 24h Laundry (₹299/Kg)</option>
                    <option value="Premium Garment Care (₹199/Kg)">Premium Garment Care (₹199/Kg)</option>
                    <option value="Heavy Laundry / Blankets (₹159/Kg)">Heavy Laundry / Blankets (₹159/Kg)</option>
                    <option value="Curtain & Drapery Care">Curtain &amp; Drapery Care</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#86868b', marginBottom: '6px' }}>
                    MESSAGE OR SPECIAL INSTRUCTIONS (OPTIONAL)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="e.g. Please pick up on Saturday morning after 10 AM..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: '8px',
                    padding: '14px 20px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #0071e3 0%, #0056b3 100%)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 25px rgba(0, 113, 227, 0.45)',
                  }}
                >
                  <span>Submit Pickup Request</span>
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#050508',
          padding: '90px 24px',
        }}
      >
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: '#86868b', fontSize: '1rem' }}>
              Got questions? We’ve got answers! Everything you need to know about our services, pickup, delivery, and pricing.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={faq.q}
                  style={{
                    background: 'rgba(15, 16, 22, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '18px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? -1 : idx)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      background: 'none',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '1.02rem',
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
                        fontSize: '0.94rem',
                        lineHeight: 1.6,
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        paddingTop: '14px',
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
    </div>
  );
}
