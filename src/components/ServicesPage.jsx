import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Shirt,
  Wind,
  Footprints,
  Zap,
  Crown,
  Home as HomeIcon,
  Layers,
  ArrowRight,
  CheckCircle2,
  Calculator,
  Plus,
  Minus,
  RotateCcw,
  Search,
  MessageCircle
} from 'lucide-react';
import { trackEvent } from '../analytics';
import PRICE_DATA from '../../content/price-list.json';

export const ALL_SERVICES = [
  {
    id: 'wash-fold',
    name: 'Wash & Fold Laundry',
    price: '₹99 / Kg',
    rateNum: 99,
    unit: 'Kg',
    tag: 'EVERYDAY ESSENTIAL',
    desc: 'Enjoy hassle-free laundry with our Wash & Fold service - ideal for everyday shirts, t-shirts, trousers, and bed linens. Sanitized, dried, and neatly fold-packed.',
    features: ['Antibacterial rinse', 'Color-safe detergents', 'Neat moisture-barrier folding', '48-hour standard turnaround'],
    color: '#64d2ff',
  },
  {
    id: 'wash-iron',
    name: 'Wash & Iron Laundry',
    price: '₹159 / Kg',
    rateNum: 159,
    unit: 'Kg',
    tag: 'OFFICE & CASUAL WEAR',
    desc: 'We clean and professionally steam press your garments, so they arrive wrinkle-free, perfectly packed, and wardrobe ready to wear.',
    features: ['Deep wash & fabric conditioner', 'Industrial steam pressing', 'Collar & cuff detailing', 'Hanger or crisp pack option'],
    color: '#2997ff',
  },
  {
    id: 'dry-cleaning',
    name: 'Dry Cleaning',
    price: 'Starts @ ₹99',
    rateNum: 99,
    unit: 'Item',
    tag: 'FORMAL & ETHNIC CARE',
    desc: 'Professional dry cleaning for men’s and women’s clothing, as well as delicate household items like curtains and blankets. Zero shrinkage, non-toxic hydrocarbons.',
    features: ['Gentle solvent cleaning', 'Individual stain pre-spotting', 'Preserves sheen & embroidery', 'Protective garment shrouds'],
    color: '#bf5af2',
  },
  {
    id: 'shoe-laundry',
    name: 'Shoe Laundry & Spa',
    price: 'Starts @ ₹299',
    rateNum: 299,
    unit: 'Pair',
    tag: 'DEEP RESTORATION',
    desc: 'Our shoe cleaning service deep cleans, deodorises, and restores everything from daily sneakers to formal leather shoes and delicate suede.',
    features: ['Deep mid-sole scrub', 'Upper fabric & suede brushing', 'Antimicrobial deodorization', 'Sole unyellowing treatment'],
    color: '#ffd60a',
  },
  {
    id: 'express-laundry',
    name: 'Express Laundry (24 Hr)',
    price: 'Starts @ ₹299 / Kg',
    rateNum: 299,
    unit: 'Kg',
    tag: 'URGENT DELIVERIES',
    desc: 'Need clothes urgently for a flight, meeting, or event? We get your clothes washed, steam ironed, and back at your doorstep within just 24 hours.',
    features: ['Priority dispatch queue', '24-hour guaranteed return', 'Dedicated wash wheel', 'Available across Mumbai & suburbs'],
    color: '#ff375f',
  },
  {
    id: 'premium-laundry',
    name: 'Premium Garment Care',
    price: 'Starts @ ₹199 / Kg',
    rateNum: 199,
    unit: 'Kg',
    tag: 'DESIGNER & LUXURY',
    desc: 'Tailored specifically for silk sarees, fine merino knits, linen garments, and designer apparel requiring delicate low-RPM cycles and pH-neutral washes.',
    features: ['Cold temperature wash', 'pH-balanced eco soaps', 'Air-cushion tumble dry', 'Hand-steamed by master pressers'],
    color: '#30d158',
  },
  {
    id: 'heavy-laundry',
    name: 'Heavy Laundry',
    price: 'Starts @ ₹159 / Kg',
    rateNum: 159,
    unit: 'Kg',
    tag: 'COMFORTERS & BEDDING',
    desc: 'Specialized commercial care ensuring non-wearable & bulky household items like blankets, quilts, and thick bedspreads are deeply sanitized and fluffed.',
    features: ['High-capacity industrial drums', 'High-temp thermal sanitization', 'Fiber loft restoration', 'Dust mite extraction'],
    color: '#ff9f0a',
  },
  {
    id: 'curtain-cleaning',
    name: 'Curtain & Drapery Care',
    price: 'Starts @ ₹14 / Sq.ft',
    rateNum: 14,
    unit: 'Sq.ft',
    tag: 'HOME UPHOLSTERY',
    desc: 'Deep clean heavy drapes, sheer curtains, and blackout screens without taking down hooks or damaging pleat geometry. Eliminates trapped indoor allergens.',
    features: ['On-site or pickup options', 'Steam allergen extraction', 'Crease-free vertical steaming', 'Color restoration'],
    color: '#5e5ce6',
  },
];

export const ALL_RATE_ITEMS = [
  ...PRICE_DATA.laundryServices.map((i) => ({ ...i, cat: 'laundry', catLabel: '🧺 Laundry by Kg', item: i.name })),
  ...PRICE_DATA.mensDryCleaning.map((i) => ({ ...i, cat: 'mens', catLabel: "👔 Men's Wear" })),
  ...PRICE_DATA.womensDryCleaning.map((i) => ({ ...i, cat: 'womens', catLabel: "👗 Women's Wear" })),
  ...PRICE_DATA.householdDryCleaning.map((i) => ({ ...i, cat: 'household', catLabel: '🏠 Household & Linens' })),
  ...PRICE_DATA.woolenDryCleaning.map((i) => ({ ...i, cat: 'woolen', catLabel: '🧥 Woolen Wear' })),
  ...PRICE_DATA.shoeLaundry.map((i) => ({ ...i, cat: 'shoes', catLabel: '👟 Shoe Laundry' }))
];

export const RATE_CARD = {
  all: ALL_RATE_ITEMS,
  laundry: PRICE_DATA.laundryServices.map((i) => ({ ...i, item: i.name })),
  mens: PRICE_DATA.mensDryCleaning,
  womens: PRICE_DATA.womensDryCleaning,
  household: PRICE_DATA.householdDryCleaning,
  woolen: PRICE_DATA.woolenDryCleaning,
  shoes: PRICE_DATA.shoeLaundry,
};

export default function ServicesPage({ onOpenBooking }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return ALL_RATE_ITEMS.filter((item) => {
      const matchesTab = activeTab === 'all' || item.cat === activeTab;
      const matchesSearch =
        !searchQuery.trim() ||
        item.item.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.catLabel.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  // Interactive Calculator State
  const [calcItems, setCalcItems] = useState({
    washFoldKg: 3,
    washIronKg: 0,
    shirtsCount: 2,
    pantsCount: 2,
    sareesCount: 0,
    blazerCount: 0,
    shoesCount: 1,
    blanketCount: 0,
  });

  const updateCount = (key, delta) => {
    setCalcItems((prev) => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta),
    }));
  };

  const calculatedTotal =
    calcItems.washFoldKg * 99 +
    calcItems.washIronKg * 159 +
    calcItems.shirtsCount * 99 +
    calcItems.pantsCount * 99 +
    calcItems.sareesCount * 199 +
    calcItems.blazerCount * 249 +
    calcItems.shoesCount * 299 +
    calcItems.blanketCount * 299;

  const qualifiesFreeDelivery = calculatedTotal >= 399;

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
            OUR SERVICES — QUICK, CLEAN, AND CONVENIENT!
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
          From Daily Wear to Designer Care.
        </h1>

        <p style={{ fontSize: '1.15rem', color: '#a1a1a6', maxWidth: '720px', margin: '0 auto 36px auto', lineHeight: 1.6 }}>
          Explore complete laundry solutions tailored for Mumbai lifestyles. Charged transparently by the kilo or per item, backed by free doorstep pickup and return.
        </p>

        <button
          onClick={onOpenBooking}
          style={{
            padding: '16px 36px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #0071e3 0%, #0056b3 100%)',
            border: 'none',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 30px rgba(0, 113, 227, 0.45)',
          }}
        >
          <span>Schedule Doorstep Pickup</span>
          <ArrowRight size={18} />
        </button>
      </section>

      {/* Services Grid (8 Services) */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '20px 24px 80px 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {ALL_SERVICES.map((srv) => (
            <div
              key={srv.id}
              style={{
                background: 'rgba(15, 16, 22, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '26px',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    background: `${srv.color}18`,
                    border: `1px solid ${srv.color}44`,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: srv.color,
                    letterSpacing: '0.06em',
                    marginBottom: '16px',
                  }}
                >
                  {srv.tag}
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                  {srv.name}
                </h3>

                <div
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    marginBottom: '14px',
                  }}
                >
                  {srv.price}
                </div>

                <p style={{ color: '#86868b', fontSize: '0.9rem', lineHeight: 1.55, marginBottom: '20px' }}>
                  {srv.desc}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  {srv.features.map((feat) => (
                    <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#d1d1d6' }}>
                      <CheckCircle2 size={14} color={srv.color} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onOpenBooking}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#fff',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#0071e3';
                  e.currentTarget.style.borderColor = '#0071e3';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                }}
              >
                <span>Book This Service</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Bill Calculator */}
      <section
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#050508',
          padding: '90px 24px',
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#64d2ff',
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              <Calculator size={16} />
              <span>Instant Laundry Calculator</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#fff' }}>
              Estimate Your Laundry Bill
            </h2>
            <p style={{ color: '#86868b', fontSize: '1rem', marginTop: '8px' }}>
              Add items or kilograms to see your instant estimated total.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '36px',
              alignItems: 'start',
            }}
          >
            {/* Items Controls */}
            <div
              style={{
                background: 'rgba(15, 16, 22, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '26px',
                padding: '32px',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '20px' }}>
                Select Your Items / Volume
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { key: 'washFoldKg', label: 'Wash & Fold Daily Wear (₹99/Kg)', unit: 'Kg' },
                  { key: 'washIronKg', label: 'Wash & Steam Iron (₹159/Kg)', unit: 'Kg' },
                  { key: 'shirtsCount', label: 'Dry Clean: Shirts / T-Shirts (₹99 ea)', unit: 'Pcs' },
                  { key: 'pantsCount', label: 'Dry Clean: Pants / Jeans (₹99 ea)', unit: 'Pcs' },
                  { key: 'sareesCount', label: 'Dry Clean: Saree / Gown (₹199 ea)', unit: 'Pcs' },
                  { key: 'blazerCount', label: 'Dry Clean: Coat / Blazer (₹249 ea)', unit: 'Pcs' },
                  { key: 'shoesCount', label: 'Shoe Spa & Cleaning (₹299 ea)', unit: 'Pairs' },
                  { key: 'blanketCount', label: 'Heavy Blanket / Quilt (₹299 ea)', unit: 'Pcs' },
                ].map((item) => (
                  <div
                    key={item.key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.9rem', color: '#f5f5f7', fontWeight: 500 }}>{item.label}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => updateCount(item.key, -1)}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: 'none',
                          color: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, minWidth: '40px', textAlign: 'center' }}>
                        {calcItems[item.key]} {item.unit}
                      </span>
                      <button
                        onClick={() => updateCount(item.key, 1)}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          background: 'rgba(0, 113, 227, 0.3)',
                          border: '1px solid rgba(0, 113, 227, 0.5)',
                          color: '#64d2ff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Total Card */}
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(20, 22, 32, 0.95) 0%, rgba(10, 11, 16, 0.98) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '28px',
                padding: '36px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
                position: 'sticky',
                top: '120px',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Estimated Order Value
              </div>

              <div
                style={{
                  fontSize: '3rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '6px',
                }}
              >
                <span>₹{calculatedTotal}</span>
                <span style={{ fontSize: '0.9rem', color: '#86868b', fontWeight: 500 }}>approx.</span>
              </div>

              {/* Delivery Qualification Pill */}
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '16px',
                  background: qualifiesFreeDelivery ? 'rgba(48, 209, 88, 0.15)' : 'rgba(255, 159, 10, 0.15)',
                  border: qualifiesFreeDelivery ? '1px solid rgba(48, 209, 88, 0.3)' : '1px solid rgba(255, 159, 10, 0.3)',
                  color: qualifiesFreeDelivery ? '#30d158' : '#ff9f0a',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '24px',
                }}
              >
                <CheckCircle2 size={18} />
                <span>
                  {qualifiesFreeDelivery
                    ? 'Qualifies for FREE Doorstep Pickup & Delivery!'
                    : `Add ₹${399 - calculatedTotal} more to get FREE Doorstep Delivery (Threshold: ₹399)`}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#86868b', marginBottom: '28px' }}>
                <div>• Final weight verified transparently upon pickup collection.</div>
                <div>• Includes individual sanitized packaging and stain inspection.</div>
                <div>• Online invoice sent via WhatsApp / SMS.</div>
              </div>

              <button
                onClick={onOpenBooking}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #0071e3 0%, #0056b3 100%)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.98rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 25px rgba(0, 113, 227, 0.45)',
                }}
              >
                <span>Book This Pickup</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Privilege Savings Packages (Prepaid Wallets) */}
      <section
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#07090f',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '999px',
                background: 'rgba(255, 214, 10, 0.12)',
                border: '1px solid rgba(255, 214, 10, 0.35)',
                marginBottom: '14px',
              }}
            >
              <Crown size={15} color="#ffd60a" />
              <span style={{ fontSize: '0.8rem', color: '#ffd60a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Mr &amp; Mrs Privilege Membership Packs
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
              Prepay &amp; Unlock Up to 25% Bonus Value
            </h2>
            <p style={{ color: '#86868b', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
              Designed for busy Mumbai households. Never worry about daily change or OTPs—recharge once and enjoy priority doorstep dispatch on every load.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              alignItems: 'stretch',
            }}
          >
            {/* Pack 1 */}
            <div
              style={{
                background: 'rgba(15, 16, 22, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64d2ff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Starter Privilege</span>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '12px 0 6px 0' }}>₹1,999</div>
                <div style={{ fontSize: '0.9rem', color: '#30d158', fontWeight: 600, marginBottom: '20px' }}>
                  Get ₹2,300 Laundry Credit (+15% Bonus)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#a1a1a6', marginBottom: '24px' }}>
                  <div>✓ Valid across all Wash &amp; Fold, Ironing, and Dry Cleaning</div>
                  <div>✓ 100% Individual Hygienic Wash Drums</div>
                  <div>✓ FREE Doorstep Delivery on every pickup</div>
                  <div>✓ 6-Month Validity with zero expiration stress</div>
                </div>
              </div>
              <a
                href={`https://wa.me/919152233822?text=${encodeURIComponent('Hi Mr & Mrs Laundry, I would like to activate the Starter Privilege Pack (Pay ₹1,999 to get ₹2,300 credit).')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('privilege_pack_click', { pack: 'starter', deposit: 1999, credit: 2300 })}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span>Activate on WhatsApp</span>
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Pack 2 (Featured) */}
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(20, 35, 60, 0.9) 0%, rgba(10, 18, 32, 0.95) 100%)',
                border: '2px solid #0071e3',
                borderRadius: '24px',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: '0 20px 50px rgba(0, 113, 227, 0.25)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#0071e3',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '4px 16px',
                  borderRadius: '999px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Most Popular for Families
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Family Privilege</span>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '12px 0 6px 0' }}>₹3,999</div>
                <div style={{ fontSize: '0.9rem', color: '#30d158', fontWeight: 600, marginBottom: '20px' }}>
                  Get ₹4,800 Laundry Credit (+20% Bonus)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '24px' }}>
                  <div>✓ Everything in Starter + Priority 24h Express Queue</div>
                  <div>✓ 1 Free Shoe Spa &amp; Sneaker Restoration included (₹499 value)</div>
                  <div>✓ Complimentary minor button &amp; hem re-stitching</div>
                  <div>✓ 12-Month Extended Validity</div>
                </div>
              </div>
              <a
                href={`https://wa.me/919152233822?text=${encodeURIComponent('Hi Mr & Mrs Laundry, I would like to activate the Family Privilege Pack (Pay ₹3,999 to get ₹4,800 credit + Free Shoe Spa).')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('privilege_pack_click', { pack: 'family', deposit: 3999, credit: 4800 })}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #0071e3 0%, #0056b3 100%)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 8px 25px rgba(0, 113, 227, 0.4)',
                }}
              >
                <span>Activate Family Pack</span>
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Pack 3 */}
            <div
              style={{
                background: 'rgba(15, 16, 22, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffd60a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Royal Wardrobe VIP</span>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '12px 0 6px 0' }}>₹7,999</div>
                <div style={{ fontSize: '0.9rem', color: '#30d158', fontWeight: 600, marginBottom: '20px' }}>
                  Get ₹10,000 Laundry Credit (+25% Bonus)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#a1a1a6', marginBottom: '24px' }}>
                  <div>✓ Everything in Family + Dedicated Mumbai Valet Concierge</div>
                  <div>✓ 2 Free Shoe Spas + Free Italian Hanger Packaging</div>
                  <div>✓ Guaranteed 24-Hour Express Return at Standard Rates</div>
                  <div>✓ Lifetime Validity &bull; Shareable across family members</div>
                </div>
              </div>
              <a
                href={`https://wa.me/919152233822?text=${encodeURIComponent('Hi Mr & Mrs Laundry, I would like to activate the Royal Wardrobe VIP Pack (Pay ₹7,999 to get ₹10,000 credit).')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('privilege_pack_click', { pack: 'royal', deposit: 7999, credit: 10000 })}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span>Activate VIP Pack</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Rate Card */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '90px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(0, 113, 227, 0.12)',
              border: '1px solid rgba(0, 113, 227, 0.3)',
              marginBottom: '16px',
            }}
          >
            <Sparkles size={14} color="#64d2ff" />
            <span style={{ fontSize: '0.8rem', color: '#64d2ff', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Official 84-Item Transparent Rate Card
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
            Complete Price List
          </h2>
          <p style={{ color: '#86868b', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
            Zero hidden charges. Sanitized individual drums, Italian steam pressing, and free doorstep pickup on orders above ₹399.
          </p>

          {/* Search Box */}
          <div style={{ maxWidth: '520px', margin: '28px auto 0 auto', position: 'relative' }}>
            <Search size={18} color="#86868b" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search 84 items (e.g. Saree, Blazer, Blanket, Shoes, Curtains)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.length > 2) {
                  trackEvent('rate_card_search', { query: e.target.value });
                }
              }}
              style={{
                width: '100%',
                padding: '14px 16px 14px 46px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#a1a1a6',
                  borderRadius: '999px',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div
            style={{
              display: 'inline-flex',
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '6px',
              borderRadius: '999px',
              gap: '6px',
              marginTop: '24px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {[
              { id: 'all', label: `✨ All (${ALL_RATE_ITEMS.length})` },
              { id: 'laundry', label: `🧺 Laundry (${PRICE_DATA.laundryServices.length})` },
              { id: 'mens', label: `👔 Men's (${PRICE_DATA.mensDryCleaning.length})` },
              { id: 'womens', label: `👗 Women's (${PRICE_DATA.womensDryCleaning.length})` },
              { id: 'household', label: `🏠 Household (${PRICE_DATA.householdDryCleaning.length})` },
              { id: 'woolen', label: `🧥 Woolen (${PRICE_DATA.woolenDryCleaning.length})` },
              { id: 'shoes', label: `👟 Shoe Spa (${PRICE_DATA.shoeLaundry.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  trackEvent('rate_tab_select', { tab: tab.id });
                }}
                style={{
                  padding: '8px 18px',
                  borderRadius: '999px',
                  border: 'none',
                  background: activeTab === tab.id ? '#0071e3' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : '#a1a1a6',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '16px', fontSize: '0.85rem', color: '#64d2ff' }}>
            Showing {filteredItems.length} of {ALL_RATE_ITEMS.length} items
          </div>
        </div>

        {/* Rate Cards Grid */}
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#86868b' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No items match "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
              }}
              style={{
                marginTop: '12px',
                padding: '8px 18px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '16px',
            }}
          >
            {filteredItems.map((item) => {
              const waText = encodeURIComponent(`Hi Mr & Mrs Laundry, I would like to book doorstep pickup for ${item.item} (${item.rate}) in Mumbai.`);
              const waUrl = `https://wa.me/919152233822?text=${waText}`;

              return (
                <div
                  key={`${item.cat}-${item.item}`}
                  style={{
                    background: 'rgba(15, 16, 22, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '18px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 113, 227, 0.5)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          color: '#a1a1a6',
                        }}
                      >
                        {item.catLabel}
                      </span>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#64d2ff' }}>
                        {item.rate}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                      {item.item}
                    </h4>

                    {item.note && (
                      <p style={{ fontSize: '0.8rem', color: '#86868b', lineHeight: 1.4, marginBottom: '16px' }}>
                        {item.note}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: item.note ? '0' : '16px' }}>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('rate_item_whatsapp_click', { item: item.item, rate: item.rate })}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        borderRadius: '10px',
                        background: 'rgba(37, 211, 102, 0.12)',
                        border: '1px solid rgba(37, 211, 102, 0.3)',
                        color: '#25D366',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <MessageCircle size={14} />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      onClick={() => {
                        trackEvent('rate_item_book_click', { item: item.item, rate: item.rate });
                        onOpenBooking({ service: item.item });
                      }}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        borderRadius: '10px',
                        background: 'rgba(0, 113, 227, 0.2)',
                        border: '1px solid rgba(0, 113, 227, 0.4)',
                        color: '#64d2ff',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>Book</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
