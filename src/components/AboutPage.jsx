import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  Users,
  Building2,
  Leaf,
  ArrowRight,
  HeartHandshake
} from 'lucide-react';

export default function AboutPage({ onOpenBooking }) {
  const stats = [
    { label: 'Serving Mumbai Since', val: '2012' },
    { label: 'Satisfied Customers', val: '5,000+' },
    { label: 'Garments Restored', val: '250,000+' },
    { label: 'Google Rating', val: '4.9 ★' },
  ];

  const pillars = [
    {
      icon: <ShieldCheck size={28} color="#64d2ff" />,
      title: '100% Secure & Hygienic Handling',
      desc: 'Every garment is sorted individually and treated with medical-grade hygiene protocols. We never wash your clothes with others, preventing cross-contamination and fabric damage.',
    },
    {
      icon: <Clock size={28} color="#30d158" />,
      title: 'Fast & Spotless Turnaround',
      desc: 'Time is precious in Mumbai. Enjoy standard 24–48 hour delivery or our 24-hour Express service, with punctual doorstep pickup from South Mumbai to Thane.',
    },
    {
      icon: <Users size={28} color="#bf5af2" />,
      title: 'Well-Trained & Disciplined Staff',
      desc: 'Our fabric specialists possess over a decade of expertise in identifying delicate weaves, natural dyes, silk textures, and designer embroideries.',
    },
    {
      icon: <Leaf size={28} color="#ffd60a" />,
      title: 'Eco-Friendly & Non-Toxic',
      desc: 'We utilize bio-degradable, phosphate-free cleaning agents and non-toxic hydrocarbon dry cleaning that are gentle on fabrics, skin-safe, and environmentally responsible.',
    },
  ];

  const timeline = [
    {
      year: '2012',
      title: 'The Journey Begins',
      desc: 'Founded with a singular mission: to eliminate the stress of laundry day for Mumbai households through exceptional care and punctuality.',
    },
    {
      year: '2016',
      title: 'Expanding Across Suburbs',
      desc: 'Expanded pickup and delivery routes from South Mumbai into Western Suburbs, Navi Mumbai, and Thane, serving thousands of working professionals and families.',
    },
    {
      year: '2020',
      title: 'State-of-the-Art Facility in Malad East',
      desc: 'Inaugurated our centralized, high-capacity processing hub in Malad East with advanced steam boilers, ozone sanitization, and specialized shoe cleaning labs.',
    },
    {
      year: '2024',
      title: 'Sneaker & Luxury Garment Restoration',
      desc: 'Introduced specialized artisan care for luxury brands, silk sarees, delicate sherwanis, and sneaker deep restoration.',
    },
    {
      year: '2026',
      title: 'Next-Generation Experience',
      desc: 'Over 5,000 loyal clients, seamless digital ordering, real-time tracking, and 100% electric delivery initiatives across Mumbai.',
    },
  ];

  return (
    <div style={{ backgroundColor: '#000000', color: '#f5f5f7', minHeight: '100vh', paddingTop: '100px' }}>
      {/* Hero Banner */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '60px 24px 80px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto' }}>
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
              YOUR TRUSTED LAUNDRY PARTNER SINCE 2012
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.12,
              marginBottom: '24px',
              color: '#ffffff',
            }}
          >
            A Decade of Clean, Care &amp; Convenience.
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#a1a1a6', lineHeight: 1.65, margin: '0 auto 36px auto' }}>
            At Mr. and Mrs. Laundry, laundry isn’t just a chore — it’s a commitment to cleanliness, fabric longevity, and effortless living. Proudly serving over 5,000+ loyal customers across Mumbai, Navi Mumbai, and Thane.
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
            <span>Book Your Pickup Today</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginTop: '70px',
          }}
        >
          {stats.map((st) => (
            <div
              key={st.label}
              style={{
                background: 'rgba(16, 17, 24, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '28px 24px',
                textAlign: 'center',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #64d2ff 0%, #0071e3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '6px',
                }}
              >
                {st.val}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#86868b', fontWeight: 500 }}>
                {st.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story & Infrastructure */}
      <section
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#050508',
          padding: '90px 24px',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#30d158',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                <Building2 size={16} />
                <span>Our Infrastructure &amp; Footprint</span>
              </div>
              <h2
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  marginBottom: '20px',
                  color: '#ffffff',
                }}
              >
                Engineered for Mumbai’s demanding lifestyle.
              </h2>
              <p style={{ color: '#a1a1a6', fontSize: '1.02rem', lineHeight: 1.65, marginBottom: '20px' }}>
                With over a decade of experience, we’ve refined the art of laundry and dry cleaning. Whether it’s your daily workwear, weekend casuals, or delicate designer heirlooms, our expert team handles every item with surgical precision.
              </p>
              <p style={{ color: '#a1a1a6', fontSize: '1.02rem', lineHeight: 1.65, marginBottom: '28px' }}>
                Our state-of-the-art centralized processing facility in <strong>Malad East</strong> is equipped with high-capacity wash wheels, specialized Italian steam formers, and ozone deodorization. Combined with our retail service hub in <strong>Tardeo, South Mumbai</strong>, we guarantee seamless coverage from doorstep pickup to doorstep return.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={18} color="#30d158" />
                  <span style={{ fontSize: '0.95rem', color: '#f5f5f7' }}>
                    Free doorstep pickup &amp; delivery on orders above ₹399
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={18} color="#30d158" />
                  <span style={{ fontSize: '0.95rem', color: '#f5f5f7' }}>
                    Individual wash cycles — zero mixing of clothes
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={18} color="#30d158" />
                  <span style={{ fontSize: '0.95rem', color: '#f5f5f7' }}>
                    Online payment via UPI, cards, and net banking with instant invoice
                  </span>
                </div>
              </div>
            </div>

            {/* Hub Details Box */}
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(20, 22, 32, 0.8) 0%, rgba(10, 11, 16, 0.95) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '32px',
                padding: '40px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
              }}
            >
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '20px' }}>
                Facility &amp; Store Locations
              </h3>

              <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64d2ff', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>
                  <MapPin size={16} />
                  <span>South Mumbai Retail Hub</span>
                </div>
                <div style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 600, marginBottom: '4px' }}>
                  Tardeo Service Store
                </div>
                <div style={{ fontSize: '0.88rem', color: '#86868b', lineHeight: 1.5 }}>
                  Shop no. 3/4, No. 508, Ganjawala Tower, G-3, Sane Guruji Marg, Behind Suman Jewellers, Bane Compound, Tardeo, Mumbai - 400034.
                </div>
              </div>

              <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#bf5af2', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>
                  <Building2 size={16} />
                  <span>Central Operations Hub</span>
                </div>
                <div style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 600, marginBottom: '4px' }}>
                  Malad Processing Center
                </div>
                <div style={{ fontSize: '0.88rem', color: '#86868b', lineHeight: 1.5 }}>
                  State-of-the-Art Eco Industrial Plant, Malad East, Mumbai. Equipped with German high-speed washers, ozone chambers &amp; shoe spa.
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#30d158', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>
                  <Clock size={16} />
                  <span>Operating Timings</span>
                </div>
                <div style={{ fontSize: '0.88rem', color: '#86868b' }}>
                  Tuesday to Sunday: <strong style={{ color: '#fff' }}>9:00 AM – 9:00 PM</strong>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#ff453a', marginTop: '2px' }}>
                  Monday: Closed (Weekly Maintenance)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Excellence */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '90px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            Our Four Guiding Pillars
          </h2>
          <p style={{ color: '#86868b', fontSize: '1.05rem', maxWidth: '620px', margin: '0 auto' }}>
            Built on over a decade of trust, modern fabric chemistry, and unconditional customer respect.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '24px',
          }}
        >
          {pillars.map((pl) => (
            <div
              key={pl.title}
              style={{
                background: 'rgba(16, 17, 24, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '32px 28px',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div style={{ marginBottom: '20px' }}>{pl.icon}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                {pl.title}
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#86868b', lineHeight: 1.6 }}>{pl.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#050508',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          <div
            style={{
              background: 'rgba(12, 13, 18, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '28px',
              padding: '40px',
            }}
          >
            <div style={{ color: '#64d2ff', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '12px' }}>
              OUR MISSION
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
              Redefining Convenience and Quality.
            </h3>
            <p style={{ color: '#a1a1a6', fontSize: '0.95rem', lineHeight: 1.65 }}>
              To deliver premium, reliable, and hassle-free laundry services that save valuable time, preserve garments across generations, and bring peace of mind to every household across Mumbai.
            </p>
          </div>

          <div
            style={{
              background: 'rgba(12, 13, 18, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '28px',
              padding: '40px',
            }}
          >
            <div style={{ color: '#bf5af2', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '12px' }}>
              OUR VISION
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
              India’s Most Trusted Laundry Brand.
            </h3>
            <p style={{ color: '#a1a1a6', fontSize: '0.95rem', lineHeight: 1.65 }}>
              To become the benchmark for garment care and sustainable fabric longevity in India — setting new standards for hygiene, customer care, and technological excellence in textile servicing.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '90px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
            Our Evolution (2012 – 2026)
          </h2>
          <p style={{ color: '#86868b' }}>From our very first neighborhood delivery to Mumbai’s most trusted laundry brand.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {timeline.map((item, idx) => (
            <div
              key={item.year}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: '24px',
                alignItems: 'baseline',
                background: 'rgba(15, 16, 22, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '24px 28px',
              }}
            >
              <div
                style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: '#64d2ff',
                }}
              >
                {item.year}
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                  {item.title}
                </h4>
                <p style={{ color: '#86868b', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
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
            Experience the Mr &amp; Mrs Laundry Difference.
          </h2>
          <p style={{ color: '#a1a1a6', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '32px' }}>
            Schedule your pickup online in 60 seconds. Our executive will arrive at your chosen time slot with fresh garment bags.
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
            <span>Book My Pickup Now</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
