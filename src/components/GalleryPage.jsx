import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, CheckCircle2, ArrowRight, Eye, Star } from 'lucide-react';

export default function GalleryPage({ onOpenBooking }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const galleryItems = [
    {
      id: 1,
      category: 'shoes',
      title: 'Sneaker Deep Restoration & Deodorization',
      subtitle: 'Luxury Yeezy & Jordan Sole Unyellowing',
      desc: 'Complete mid-sole deep brush, ultrasonic foam scrub, fabric whitening, and UV sterilization.',
      badge: 'SHOE SPA',
      color: '#ffd60a',
    },
    {
      id: 2,
      category: 'couture',
      title: 'Designer Zari Silk Saree Conservation',
      subtitle: 'Heritage Kanjeevaram & Banarasi Care',
      desc: 'Zero-water non-solvent purification that safeguards 24k gold zari threads and natural botanical dyes.',
      badge: 'HERITAGE SILK',
      color: '#bf5af2',
    },
    {
      id: 3,
      category: 'formal',
      title: 'Bespoke Tuxedo & Italian Wool Blazers',
      subtitle: 'Precision Hand Finishing & Steam Form',
      desc: 'Loro Piana and Zegna wool suits steam formed on anatomical mannequins with razor-sharp lapel rolls.',
      badge: 'GENTLEMAN SUITING',
      color: '#64d2ff',
    },
    {
      id: 4,
      category: 'shoes',
      title: 'Handcrafted Leather Oxford Polish & Buff',
      subtitle: 'Nappa & Calfskin Nourishment',
      desc: 'Conditioned with natural beeswax cream, deep scuff removal, and mirror gloss toe buffing.',
      badge: 'LEATHER LAB',
      color: '#ff9f0a',
    },
    {
      id: 5,
      category: 'facility',
      title: 'High-Capacity German Wash Turbines',
      subtitle: 'Malad East Central Processing Facility',
      desc: 'Computerized dosing pumps, reverse osmosis purification, and microprocessor-controlled temperature curves.',
      badge: 'FACILITY HUB',
      color: '#30d158',
    },
    {
      id: 6,
      category: 'couture',
      title: 'Bridal Lehenga & Sherwani Restoration',
      subtitle: 'Intricate Beadwork & Sequin Protection',
      desc: 'Individually netted delicate garments with custom protective shields for pearl and crystal embroideries.',
      badge: 'BRIDAL ATELIER',
      color: '#ff375f',
    },
    {
      id: 7,
      category: 'home',
      title: 'Plush Feather Down Comforter Sanitization',
      subtitle: 'Hypoallergenic Thermal Treatment',
      desc: 'Restores natural fluff volume and eliminates 99.9% of dust mites without chemical odors.',
      badge: 'HEAVY BEDDING',
      color: '#5e5ce6',
    },
    {
      id: 8,
      category: 'facility',
      title: 'Antimicrobial Doorstep Sealed Packaging',
      subtitle: 'Tamper-Evident Wardrobe Vaults',
      desc: 'Clothes arrive fresh, sealed in recyclable breathable cedar boxes and dust-free garment shrouds.',
      badge: 'DOORSTEP PACKAGING',
      color: '#64d2ff',
    },
  ];

  const filteredItems =
    activeFilter === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <div style={{ backgroundColor: '#000000', color: '#f5f5f7', minHeight: '100vh', paddingTop: '100px' }}>
      {/* Header */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '60px 24px 70px 24px', textAlign: 'center' }}>
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
            OUR SPARKLING CLEAN PORTFOLIO
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
          Where Every Fabric Gets VIP Treatment.
        </h1>

        <p style={{ fontSize: '1.15rem', color: '#a1a1a6', maxWidth: '720px', margin: '0 auto 36px auto', lineHeight: 1.6 }}>
          Take a look inside our work: from sneaker restorations and bespoke suiting to our high-tech Malad processing center and museum-grade garment preservation.
        </p>

        {/* Filters */}
        <div
          style={{
            display: 'inline-flex',
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '6px',
            borderRadius: '999px',
            gap: '6px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { id: 'all', label: 'All Works' },
            { id: 'shoes', label: 'Sneakers & Shoes' },
            { id: 'couture', label: 'Ethnic & Bridal' },
            { id: 'formal', label: 'Suits & Formals' },
            { id: 'facility', label: 'Machinery & Hub' },
            { id: 'home', label: 'Home Bedding' },
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setActiveFilter(flt.id)}
              style={{
                padding: '8px 20px',
                borderRadius: '999px',
                border: 'none',
                background: activeFilter === flt.id ? '#0071e3' : 'transparent',
                color: activeFilter === flt.id ? '#fff' : '#a1a1a6',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {flt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Showcase Grid */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '20px 24px 80px 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
          }}
        >
          {filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'rgba(15, 16, 22, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '32px',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}44`,
                    color: item.color,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    marginBottom: '16px',
                  }}
                >
                  {item.badge}
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                  {item.title}
                </h3>
                <div style={{ fontSize: '0.86rem', color: '#64d2ff', fontWeight: 600, marginBottom: '14px' }}>
                  {item.subtitle}
                </div>
                <p style={{ color: '#86868b', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  {item.desc}
                </p>
              </div>

              <div
                style={{
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#30d158', fontSize: '0.8rem', fontWeight: 600 }}>
                  <ShieldCheck size={16} />
                  <span>Verified 100% Care</span>
                </div>
                <button
                  onClick={onOpenBooking}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64d2ff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Book Care</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking CTA Banner */}
      <section
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#050508',
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            Give Your Wardrobe VIP Care Today.
          </h2>
          <p style={{ color: '#a1a1a6', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '32px' }}>
            Orders above ₹399 receive complimentary doorstep pickup &amp; return across all Mumbai pin codes.
          </p>
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
              boxShadow: '0 8px 30px rgba(0, 113, 227, 0.45)',
            }}
          >
            <span>Book Concierge Pickup</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
