import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import businessInfo from '../../content/business-info.json';
import {
  Volume2,
  VolumeX,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Phone,
  MessageSquare,
  ChevronDown,
  Tag,
  Truck,
  ShieldCheck,
  Clock,
  Shirt,
  Footprints,
  Layers,
  MapPin,
  Mail,
  CheckCircle2,
} from 'lucide-react';

export default function Navbar({
  currentPage,
  onNavigate,
  onOpenBooking,
  onOpenTrackOrder,
  isAudioPlaying,
  onToggleAudio,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [megaMenuTab, setMegaMenuTab] = useState('mens');
  const megaMenuTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services & Pricing', hasMegaMenu: true },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId) => {
    setIsMegaMenuOpen(false);
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMouseEnterServices = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeaveServices = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 220);
  };

  // 8 Audited Core Services from https://mrandmrslaundry.com/
  const megaMenuServices = [
    { id: 'wash-fold', name: 'Wash & Fold Laundry', price: '₹99/Kg', desc: 'Everyday casual wear, sanitized & fold-packed', color: '#64d2ff' },
    { id: 'wash-iron', name: 'Wash & Iron Laundry', price: '₹159/Kg', desc: 'Crisp industrial steam pressing ready to wear', color: '#2997ff' },
    { id: 'dry-cleaning', name: 'Dry Cleaning', price: 'Starts @ ₹99', desc: 'Suits, silk sarees, blazers & delicate fabrics', color: '#bf5af2' },
    { id: 'shoe-laundry', name: 'Shoe Laundry & Spa', price: 'Starts @ ₹299', desc: 'Sneakers, leather & suede revival & deodorization', color: '#ffd60a' },
    { id: 'express-laundry', name: 'Express Laundry (24h)', price: 'Starts @ ₹299/Kg', desc: 'Guaranteed 24-hour return right to your door', color: '#ff375f' },
    { id: 'premium-laundry', name: 'Premium Garment Care', price: 'Starts @ ₹199/Kg', desc: 'pH-neutral care for silk, cashmere & designer wear', color: '#30d158' },
    { id: 'heavy-laundry', name: 'Heavy Laundry', price: 'Starts @ ₹159/Kg', desc: 'Blankets, quilts, comforters sanitized & fluffed', color: '#ff9f0a' },
    { id: 'curtain-cleaning', name: 'Curtain & Drapery Care', price: 'Starts @ ₹14/Sq.ft', desc: 'Deep dust-mite extraction without pleat damage', color: '#5e5ce6' },
  ];

  // Pricing Snapshot from live site audit
  const pricingSnapshot = {
    mens: [
      { item: 'Shirt / T-Shirt', rate: '₹99' },
      { item: 'Pant / Jeans', rate: '₹99' },
      { item: 'Kurta Plain', rate: '₹99' },
      { item: 'Coat / Blazer', rate: '₹249' },
      { item: 'Sherwani', rate: '₹299' },
    ],
    womens: [
      { item: 'Top / Blouse', rate: '₹99' },
      { item: 'Kurti Plain', rate: '₹99' },
      { item: 'Saree Plain', rate: '₹199' },
      { item: 'Gown Normal', rate: '₹249' },
      { item: 'Lehenga Normal', rate: '₹299' },
    ],
    household: [
      { item: 'Towel / Mat Small', rate: '₹99' },
      { item: 'Bedsheet Single', rate: '₹129' },
      { item: 'Pillow Small', rate: '₹149' },
      { item: 'Table Mat', rate: '₹199' },
      { item: 'Curtain Care', rate: '₹14/sq.ft' },
    ],
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: scrolled ? 'rgba(8, 9, 13, 0.88)' : 'rgba(4, 5, 8, 0.72)',
          backdropFilter: 'blur(24px) saturate(190%)',
          WebkitBackdropFilter: 'blur(24px) saturate(190%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Official Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            <img
              src="./logo.png"
              alt="Mr and Mrs Laundry"
              style={{
                height: '42px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 2px 10px rgba(0, 113, 227, 0.35))',
              }}
            />
          </div>

          {/* Desktop Navigation Links with Mega Menu Hook */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '4px 6px',
              borderRadius: '999px',
            }}
            className="desktop-nav"
          >
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              if (item.hasMegaMenu) {
                return (
                  <div
                    key={item.id}
                    onMouseEnter={handleMouseEnterServices}
                    onMouseLeave={handleMouseLeaveServices}
                    style={{ position: 'relative' }}
                  >
                    <button
                      onClick={() => {
                        handleNavClick('services');
                      }}
                      style={{
                        position: 'relative',
                        padding: '8px 16px',
                        borderRadius: '999px',
                        background: isActive || isMegaMenuOpen ? 'rgba(0, 113, 227, 0.18)' : 'transparent',
                        border: isMegaMenuOpen ? '1px solid rgba(0, 113, 227, 0.4)' : '1px solid transparent',
                        color: isActive || isMegaMenuOpen ? '#ffffff' : '#86868b',
                        fontSize: '0.86rem',
                        fontWeight: isActive || isMegaMenuOpen ? 600 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      <span>{item.label}</span>
                      <motion.div
                        animate={{ rotate: isMegaMenuOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <ChevronDown size={14} color={isMegaMenuOpen ? '#64d2ff' : '#86868b'} />
                      </motion.div>
                      {isActive && !isMegaMenuOpen && (
                        <motion.div
                          layoutId="activeNavIndicator"
                          style={{
                            position: 'absolute',
                            bottom: '2px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '16px',
                            height: '2px',
                            borderRadius: '2px',
                            background: '#0071e3',
                          }}
                        />
                      )}
                    </button>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    position: 'relative',
                    padding: '8px 18px',
                    borderRadius: '999px',
                    background: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                    border: 'none',
                    color: isActive ? '#ffffff' : '#86868b',
                    fontSize: '0.86rem',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#86868b';
                  }}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '16px',
                        height: '2px',
                        borderRadius: '2px',
                        background: '#0071e3',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs (Track Order, Audio Soundtrack, Book Pickup) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Track Order Button */}
            <button
              onClick={onOpenTrackOrder}
              style={{
                padding: '8px 14px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#f5f5f7',
                fontSize: '0.82rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
              className="desktop-nav"
              title="Track live order status"
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#30d158',
                  boxShadow: '0 0 8px #30d158',
                }}
              />
              <span>Track Order</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={onToggleAudio}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isAudioPlaying ? 'rgba(0, 113, 227, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                border: isAudioPlaying ? '1px solid #0071e3' : '1px solid rgba(255, 255, 255, 0.1)',
                color: isAudioPlaying ? '#64d2ff' : '#86868b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              title={isAudioPlaying ? 'Mute Soundtrack' : 'Play Soundtrack (Chill Winston — On My Own)'}
            >
              {isAudioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Primary Book Pickup CTA */}
            <button
              onClick={onOpenBooking}
              style={{
                padding: '9px 20px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #0071e3 0%, #0056b3 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 18px rgba(0, 113, 227, 0.45)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 113, 227, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(0, 113, 227, 0.45)';
              }}
            >
              <span>Book Pickup</span>
              <ArrowRight size={14} />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              className="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP MEGA MENU DROPDOWN                                                */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={handleMouseEnterServices}
              onMouseLeave={handleMouseLeaveServices}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'rgba(6, 8, 14, 0.97)',
                backdropFilter: 'blur(30px) saturate(200%)',
                WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(0, 113, 227, 0.12)',
                zIndex: 99,
                padding: '30px 24px 34px 24px',
              }}
              className="desktop-mega-menu"
            >
              <div
                style={{
                  maxWidth: '1280px',
                  margin: '0 auto',
                  display: 'grid',
                  gridTemplateColumns: '1.4fr 1.1fr 1fr 1.1fr',
                  gap: '28px',
                }}
              >
                {/* COLUMN 1: All 8 Audited Core Services with Rates */}
                <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.07)', paddingRight: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Sparkles size={14} color="#64d2ff" />
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', color: '#64d2ff', textTransform: 'uppercase' }}>
                      CORE SERVICES &amp; RATES
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                    {megaMenuServices.map((srv) => (
                      <div
                        key={srv.id}
                        onClick={() => handleNavClick('services')}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.18s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 113, 227, 0.12)';
                          e.currentTarget.style.borderColor = 'rgba(0, 113, 227, 0.35)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#ffffff' }}>
                            {srv.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#86868b', lineHeight: 1.3 }}>
                            {srv.desc}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            color: srv.color,
                            whiteSpace: 'nowrap',
                            marginLeft: '10px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {srv.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMN 2: Pricing Snapshot by Category */}
                <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.07)', paddingRight: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Tag size={14} color="#ffd60a" />
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', color: '#ffd60a', textTransform: 'uppercase' }}>
                        PRICING SNAPSHOT
                      </span>
                    </div>

                    {/* Category Tabs */}
                    <div style={{ display: 'flex', gap: '4px', background: 'rgba(255, 255, 255, 0.05)', padding: '2px', borderRadius: '8px' }}>
                      {['mens', 'womens', 'household'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setMegaMenuTab(tab)}
                          style={{
                            padding: '3px 8px',
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            borderRadius: '6px',
                            border: 'none',
                            background: megaMenuTab === tab ? '#0071e3' : 'transparent',
                            color: megaMenuTab === tab ? '#fff' : '#86868b',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                          }}
                        >
                          {tab === 'mens' ? "Men's" : tab === 'womens' ? "Women's" : 'Home'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {pricingSnapshot[megaMenuTab].map((row) => (
                      <div
                        key={row.item}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '7px 12px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <span style={{ fontSize: '0.82rem', color: '#d1d1d6' }}>{row.item}</span>
                        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#30d158' }}>{row.rate}</span>
                      </div>
                    ))}
                  </div>

                  <div
                    onClick={() => handleNavClick('services')}
                    style={{
                      marginTop: '12px',
                      fontSize: '0.74rem',
                      color: '#64d2ff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: 600,
                    }}
                  >
                    <span>View all 50+ item rates on Rate Card</span>
                    <ArrowRight size={12} />
                  </div>
                </div>

                {/* COLUMN 3: Special Ongoing Offers & Service Guarantees */}
                <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.07)', paddingRight: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <ShieldCheck size={14} color="#30d158" />
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', color: '#30d158', textTransform: 'uppercase' }}>
                      DEALS &amp; GUARANTEES
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Offer 1 */}
                    <div
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'rgba(0, 113, 227, 0.1)',
                        border: '1px solid rgba(0, 113, 227, 0.3)',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64d2ff', marginBottom: '2px' }}>
                        🎉 10% First-Time Discount
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#a1a1a6', lineHeight: 1.35 }}>
                        New to Mr and Mrs Laundry? Enjoy 10% OFF on your very first doorstep pickup!
                      </div>
                    </div>

                    {/* Offer 2 */}
                    <div
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'rgba(255, 214, 10, 0.08)',
                        border: '1px solid rgba(255, 214, 10, 0.25)',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffd60a', marginBottom: '2px' }}>
                        👟 Give 3 Shoes, Get 10% OFF
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#a1a1a6', lineHeight: 1.35 }}>
                        Send any 3 pairs of sneakers or leather shoes for deep spa &amp; save 10% instantly.
                      </div>
                    </div>

                    {/* Offer 3 */}
                    <div
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'rgba(48, 209, 88, 0.08)',
                        border: '1px solid rgba(48, 209, 88, 0.25)',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#30d158', marginBottom: '2px' }}>
                        🚚 Free Doorstep Delivery
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#a1a1a6', lineHeight: 1.35 }}>
                        100% FREE pickup &amp; delivery on orders ₹399+ across Mumbai, Thane &amp; Navi Mumbai.
                      </div>
                    </div>

                    {/* Guarantee */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#86868b' }}>
                      <CheckCircle2 size={12} color="#30d158" />
                      <span>100% Dedicated load — never mixed</span>
                    </div>
                  </div>
                </div>

                {/* COLUMN 4: Quick Action CTAs & Direct Contacts */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <Clock size={14} color="#bf5af2" />
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', color: '#bf5af2', textTransform: 'uppercase' }}>
                      QUICK ACTIONS &amp; HELP
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    {/* Schedule Pickup CTA */}
                    <button
                      onClick={() => {
                        setIsMegaMenuOpen(false);
                        onOpenBooking();
                      }}
                      style={{
                        padding: '12px 18px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #0071e3 0%, #0056b3 100%)',
                        border: 'none',
                        color: '#fff',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 18px rgba(0, 113, 227, 0.45)',
                      }}
                    >
                      <span>Book Pickup Now</span>
                      <ArrowRight size={14} />
                    </button>

                    {/* Track Order CTA */}
                    <button
                      onClick={() => {
                        setIsMegaMenuOpen(false);
                        onOpenTrackOrder();
                      }}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#fff',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#30d158' }} />
                      <span>Track Live Order</span>
                    </button>
                  </div>

                  {/* Direct Contact Links */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <a
                      href={`tel:+${businessInfo.phoneDigits}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#ffffff',
                        fontSize: '0.78rem',
                        textDecoration: 'none',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.03)',
                      }}
                    >
                      <Phone size={13} color="#64d2ff" />
                      <span>{businessInfo.phone} (Call 24/7)</span>
                    </a>

                    <a
                      href={`https://wa.me/${businessInfo.whatsappDigits}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#ffffff',
                        fontSize: '0.78rem',
                        textDecoration: 'none',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: 'rgba(37, 211, 102, 0.12)',
                        border: '1px solid rgba(37, 211, 102, 0.25)',
                      }}
                    >
                      <MessageSquare size={13} color="#25D366" />
                      <span>WhatsApp Support (Instant)</span>
                    </a>

                    <a
                      href={`mailto:${businessInfo.email}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#a1a1a6',
                        fontSize: '0.74rem',
                        textDecoration: 'none',
                        padding: '4px 10px',
                      }}
                    >
                      <Mail size={12} color="#a1a1a6" />
                      <span>{businessInfo.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: 'rgba(10, 11, 16, 0.98)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxHeight: '82vh',
                overflowY: 'auto',
              }}
            >
              {/* Special Offer Mobile Banner */}
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(0, 113, 227, 0.15)',
                  border: '1px solid rgba(0, 113, 227, 0.35)',
                  fontSize: '0.78rem',
                  color: '#64d2ff',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Sparkles size={14} />
                <span>10% OFF First Order • Free Delivery ₹399+</span>
              </div>

              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    background: currentPage === item.id ? 'rgba(0, 113, 227, 0.2)' : 'transparent',
                    border: 'none',
                    color: currentPage === item.id ? '#64d2ff' : '#ffffff',
                    fontSize: '1rem',
                    fontWeight: 600,
                    padding: '12px 16px',
                    borderRadius: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  {item.label}
                </button>
              ))}

              {/* Mobile Quick Services Snapshot */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#86868b', letterSpacing: '0.06em' }}>
                  QUICK SERVICES &amp; RATES
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ fontSize: '0.76rem', color: '#d1d1d6' }}>Wash &amp; Fold: <strong style={{ color: '#64d2ff' }}>₹99/Kg</strong></div>
                  <div style={{ fontSize: '0.76rem', color: '#d1d1d6' }}>Wash &amp; Iron: <strong style={{ color: '#2997ff' }}>₹159/Kg</strong></div>
                  <div style={{ fontSize: '0.76rem', color: '#d1d1d6' }}>Dry Cleaning: <strong style={{ color: '#bf5af2' }}>₹99+</strong></div>
                  <div style={{ fontSize: '0.76rem', color: '#d1d1d6' }}>Shoe Spa: <strong style={{ color: '#ffd60a' }}>₹299+</strong></div>
                </div>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTrackOrder();
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#30d158' }} />
                <span>Track Order Status</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                style={{
                  background: 'linear-gradient(135deg, #0071e3 0%, #0056b3 100%)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 18px rgba(0, 113, 227, 0.45)',
                }}
              >
                <span>Book Pickup Now</span>
                <ArrowRight size={16} />
              </button>

              <div style={{ paddingTop: '4px', display: 'flex', gap: '10px' }}>
                <a
                  href={`tel:+${businessInfo.phoneDigits}`}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Phone size={14} />
                  <span>Call Us</span>
                </a>
                <a
                  href={`https://wa.me/${businessInfo.whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#25D366',
                    color: '#fff',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <style>{`
        @media (max-width: 960px) {
          .desktop-nav {
            display: none !important;
          }
          .desktop-mega-menu {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
