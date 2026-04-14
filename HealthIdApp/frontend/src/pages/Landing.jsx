import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import MorphingShape from '../components/MorphingShape';
import TextReveal from '../components/TextReveal';
import AnimatedCounter from '../components/AnimatedCounter';
import GlowCard from '../components/GlowCard';
import api from '../api/axios';
import { useTranslation } from 'react-i18next';
import './Landing.css';

/* ─── Animation Helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }
  })
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }
  })
};

/* ─── FAQ Data ─── */
const faqData = [
  {
    q: 'What is a Health ID and why do I need one?',
    a: 'A Health ID is your unique digital identity that links all your medical records across hospitals. Instead of carrying physical files, your prescriptions, reports, and history are securely stored and accessible whenever you need them.'
  },
  {
    q: 'How is my data kept private and secure?',
    a: 'Your records are encrypted and only accessible through an OTP-based consent system. Hospitals cannot view your data without your explicit permission. You control who sees what and for how long.'
  },
  {
    q: 'Can any hospital access my records?',
    a: 'No. Only government-registered and verified hospitals on our platform can request access. Even then, you must grant them temporary permission via a one-time password sent to your phone.'
  },
  {
    q: 'Is there a cost to use HealthID?',
    a: 'HealthID is completely free for patients. Our mission is to make healthcare data accessible and secure for every citizen of India.'
  },
  {
    q: 'What if I lose my phone or change my number?',
    a: 'Your Health ID is linked to your Aadhaar and can be recovered through identity verification. Your records remain safe in the cloud regardless of device changes.'
  },
];

/* ─── Testimonial Data ─── */
const testimonials = [
  { text: "Finally, I don't need to carry a folder full of old reports. My new doctor pulled up everything in seconds.", name: 'Priya S.', role: 'Patient, Mumbai', color: '#FF3366' },
  { text: "The consent system is brilliant. I feel genuinely in control of who sees my family's medical data.", name: 'Rahul M.', role: 'Patient, Delhi', color: '#00D4AA' },
  { text: "As a hospital, onboarding was seamless. The verification process builds trust with our patients.", name: 'Dr. Anjali K.', role: 'Apollo Hospitals', color: '#FFB347' },
  { text: "We reduced patient intake time by 40%. Records transfer instantly when consent is granted.", name: 'Dr. Vikram P.', role: 'Max Healthcare', color: '#8B5CF6' },
  { text: "My grandmother's entire medical history across 3 cities — now in one place. This should have existed years ago.", name: 'Sneha T.', role: 'Patient, Pune', color: '#FF3366' },
  { text: "The OTP system is simple enough that even my parents use it without any confusion.", name: 'Arjun D.', role: 'Patient, Bangalore', color: '#00D4AA' },
];

/* ─── FAQ Item Component ─── */
const FAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen]);

  return (
    <motion.div
      className="faq-item"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        className="faq-question"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <svg
          className={`faq-chevron ${isOpen ? 'open' : ''}`}
          width="20" height="20" viewBox="0 0 20 20" fill="none"
        >
          <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div
        className="faq-answer"
        style={{
          maxHeight: isOpen ? height + 'px' : '0px',
          transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div ref={contentRef} className="faq-answer-inner">
          {answer}
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════ */
const Landing = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    patients: 12000,
    hospitals: 50,
    statesCovered: 28,
    uptime: 99.9
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/public/stats');
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch public stats:", err);
      }
    };
    fetchStats();
  }, []);
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 0.8], [1, 0.96]);

  const brandRef = useRef(null);
  const brandInView = useInView(brandRef, { once: true, margin: '-150px' });

  return (
    <div style={{ overflowX: 'hidden' }}>

      {/* ════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        className="hero-section"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <MorphingShape />

        <div className="hero-inner">
          {/* Left — Content */}
          <motion.div
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0}>
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                {t('hero.badge')}
              </div>
            </motion.div>

            <motion.h1 className="hero-headline" variants={fadeUp} custom={0.1}>
              {t('hero.headline').split('future')[0]}
              <span className="accent">{t('hero.headline').includes('future') ? 'future' : t('hero.headline')}</span>
              {t('hero.headline').split('future')[1]}
            </motion.h1>

            <motion.p className="hero-description" variants={fadeUp} custom={0.2}>
              {t('hero.description')}
            </motion.p>

            <motion.div className="hero-actions" variants={fadeUp} custom={0.3}>
              <Link to="/patient/register" className="primary-btn" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
                {t('hero.cta')}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/hospital/login" className="secondary-btn" style={{ padding: '16px 32px' }}>
                {t('hero.forHospitals')}
              </Link>
            </motion.div>
          </motion.div>

          {/* Right — Floating Card Composition */}
          <div className="hero-visual">
            <div className="hero-floating-cards">
              {/* Card 1 — Health Card Preview */}
              <motion.div
                className="floating-card floating-card-1"
                initial={{ opacity: 0, y: 40, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="card-header">
                  <div className="card-icon" style={{ background: 'var(--accent-primary-soft)' }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 1.5v15M1.5 9h15" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="card-title">Health Card</div>
                    <div className="card-subtitle">Active • Verified</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>ID VERIFICATION</div>
                  <div style={{ height: '32px', width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 'bold', fontFamily: 'monospace' }}>
                    MH-9922-4821-39
                  </div>
                </div>
                <div className="card-bar">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                    <span>Profile Strength</span>
                    <span>100%</span>
                  </div>
                  <motion.div
                    className="card-bar-fill"
                    style={{ background: 'var(--accent-primary)' }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </motion.div>

              {/* Card 2 — Consent Notification */}
              <motion.div
                className="floating-card floating-card-2"
                initial={{ opacity: 0, y: 30, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="card-header">
                  <div className="card-icon" style={{ background: 'var(--accent-secondary-soft)' }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 1.5L2 6v6c0 3.5 3 5.5 7 6.5 4-1 7-3 7-6.5V6L9 1.5z" stroke="var(--accent-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6.5 9.5l2 2 3.5-4" stroke="var(--accent-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="card-title">Consent Granted</div>
                    <div className="card-subtitle">Apollo Hospital • 2min ago</div>
                  </div>
                </div>
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(0,212,170,0.06)',
                  border: '1px solid rgba(0,212,170,0.2)',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '12px'
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-secondary)' }} />
                  <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>OTP Verified</span>
                  <span style={{ color: 'var(--text-tertiary)', marginLeft: 'auto' }}>Expires in 24h</span>
                </div>
              </motion.div>

              {/* Card 3 — Record Tile */}
              <motion.div
                className="floating-card floating-card-3"
                initial={{ opacity: 0, y: 20, x: -10 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="card-header">
                  <div className="card-icon" style={{ background: 'rgba(255,179,71,0.1)' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="1" width="12" height="14" rx="2" stroke="#FFB347" strokeWidth="1.5"/>
                      <path d="M5 5h6M5 8h4" stroke="#FFB347" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="card-title">Blood Report</div>
                    <div className="card-subtitle">12 Apr 2026</div>
                  </div>
                </div>
                <div className="card-bar">
                  <motion.div
                    className="card-bar-fill"
                    style={{ background: 'var(--accent-tertiary)' }}
                    initial={{ width: '0%' }}
                    animate={{ width: '65%' }}
                    transition={{ delay: 1.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            zIndex: 5,
          }}
        >
          <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '1px', height: '24px', background: 'linear-gradient(to bottom, var(--text-tertiary), transparent)' }}
          />
        </motion.div>
      </motion.section>

      {/* ════════════════════════════════════
          BRAND STATEMENT
      ════════════════════════════════════ */}
      <section className="brand-statement-section" ref={brandRef}>
        <motion.div
          className="brand-statement-text"
          initial={{ opacity: 0 }}
          animate={brandInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <TextReveal delay={0.1}>
            Your health data should serve you — not be scattered across dusty files in hospitals you'll never visit again.
          </TextReveal>
        </motion.div>
      </section>

      {/* ════════════════════════════════════
          FEATURES — Asymmetric Bento Grid
      ════════════════════════════════════ */}
      <section className="features-section">
        <motion.div
          className="features-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label">{t('features.label')}</div>
          <h2 className="section-title">
            {t('features.title')}
          </h2>
        </motion.div>

        <div className="features-grid">
          {/* Feature 1 — Large */}
          <GlowCard className="feature-card large" glowColor="rgba(255,51,102,0.1)">
            <div className="feature-icon" style={{ background: 'var(--accent-primary-soft)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="2" width="18" height="20" rx="3" stroke="var(--accent-primary)" strokeWidth="1.5"/>
                <path d="M8 7h8M8 11h5M8 15h7" stroke="var(--accent-primary)" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="feature-title">{t('features.unified.title')}</h3>
            <p className="feature-description">
              {t('features.unified.desc')}
            </p>
          </GlowCard>

          {/* Feature 2 */}
          <GlowCard className="feature-card" glowColor="rgba(0,212,170,0.1)">
            <div className="feature-icon" style={{ background: 'var(--accent-secondary-soft)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 7v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V7l-8-5z" stroke="var(--accent-secondary)" strokeWidth="1.5"/>
                <path d="M9 12l2 2 4-4" stroke="var(--accent-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="feature-title">{t('features.consent.title')}</h3>
            <p className="feature-description">
              {t('features.consent.desc')}
            </p>
          </GlowCard>

          {/* Feature 3 */}
          <GlowCard className="feature-card" glowColor="rgba(255,179,71,0.1)">
            <div className="feature-icon" style={{ background: 'rgba(255,179,71,0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#FFB347" strokeWidth="1.5"/>
                <path d="M9 12l2 2 4-4" stroke="#FFB347" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="feature-title">Verified Hospitals</h3>
            <p className="feature-description">
              Every hospital on the platform is government-registered and verified. Your data only goes to real, trusted professionals.
            </p>
          </GlowCard>

          {/* Feature 4 */}
          <GlowCard className="feature-card" glowColor="rgba(139,92,246,0.1)">
            <div className="feature-icon" style={{ background: 'rgba(139,92,246,0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="5" width="20" height="14" rx="3" stroke="#8B5CF6" strokeWidth="1.5"/>
                <path d="M12 9v4M10 11h4" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="feature-title">Instant Health Card</h3>
            <p className="feature-description">
              Generate a scannable digital health card with your QR code. Show it at any hospital for instant identity verification.
            </p>
          </GlowCard>

          {/* Feature 5 — Large */}
          <GlowCard className="feature-card large" glowColor="rgba(0,212,170,0.08)">
            <div className="feature-icon" style={{ background: 'var(--accent-secondary-soft)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16v16H4z" stroke="var(--accent-secondary)" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M4 9h16M9 9v11" stroke="var(--accent-secondary)" strokeWidth="1.3"/>
              </svg>
            </div>
            <h3 className="feature-title">Admin Oversight & Analytics</h3>
            <p className="feature-description">
              Government administrators get a real-time dashboard showing hospital registrations, patient enrollment rates, 
              consent patterns, and system health — enabling data-driven healthcare policy decisions across India.
            </p>
          </GlowCard>
        </div>
      </section>

      {/* ════════════════════════════════════
          STATS / TRUST SECTION
      ════════════════════════════════════ */}
      <section className="stats-section">
        <div className="stats-inner">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="section-label" style={{ textAlign: 'center' }}>Impact</div>
            <h2 className="section-title" style={{ textAlign: 'center', margin: '0 auto' }}>
              Numbers that matter
            </h2>
          </motion.div>

          <div className="stats-grid">
            <motion.div className="stat-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <div className="stat-number">
                <AnimatedCounter end={stats.patients} suffix="+" useIndianFormat />
              </div>
              <div className="stat-label">Health IDs Created</div>
            </motion.div>

            <motion.div className="stat-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <div className="stat-number">
                <AnimatedCounter end={stats.hospitals} suffix="+" />
              </div>
              <div className="stat-label">Verified Hospitals</div>
            </motion.div>

            <motion.div className="stat-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <div className="stat-number">
                <AnimatedCounter end={stats.statesCovered} suffix="" />
              </div>
              <div className="stat-label">States Covered</div>
            </motion.div>

            <motion.div className="stat-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <div className="stat-number">
                <AnimatedCounter end={stats.uptime} suffix="%" decimals={1} />
              </div>
              <div className="stat-label">Uptime Reliability</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          HOW IT WORKS — Process Timeline
      ════════════════════════════════════ */}
      <section className="process-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label">How It Works</div>
          <h2 className="section-title">
            Four steps to digital health
          </h2>
        </motion.div>

        <div className="process-steps">
          {[
            { num: '01', title: 'Register', desc: 'Create your Health ID with your Aadhaar and phone number. Takes under 2 minutes.' },
            { num: '02', title: 'Link Records', desc: "Hospitals upload your records securely. You'll get notified for every new entry." },
            { num: '03', title: 'Grant Access', desc: 'When a new doctor needs your history, share it via a simple OTP — you choose the duration.' },
            { num: '04', title: 'Stay Protected', desc: 'Revoke access anytime. View audit logs. Your data, your rules — always.' },
          ].map((step, i) => (
            <motion.div
              key={i}
              className="process-step"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="process-step-number">{step.num}</div>
              <h4 className="process-step-title">{step.title}</h4>
              <p className="process-step-desc">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          TESTIMONIALS — Auto-scroll Marquee
      ════════════════════════════════════ */}
      <section className="testimonials-section">
        <motion.div
          className="testimonials-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label">Voices</div>
          <h2 className="section-title">
            Trusted by patients & hospitals
          </h2>
        </motion.div>

        <div className="testimonials-track" aria-label="Testimonials">
          {/* Duplicate for infinite scroll */}
          {[...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="testimonial-card">
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{ background: `${t.color}20`, color: t.color }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          FAQ SECTION
      ════════════════════════════════════ */}
      <section className="faq-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center' }}
        >
          <div className="section-label">FAQ</div>
          <h2 className="section-title" style={{ margin: '0 auto' }}>
            Common questions
          </h2>
        </motion.div>

        <div className="faq-list">
          {faqData.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════ */}
      <section className="cta-section">
        <div className="cta-bg" />
        <motion.div
          className="cta-inner"
          initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="cta-headline">
            Your health records deserve<br />
            <span className="accent-gradient">better than a dusty folder</span>
          </h2>
          <p className="cta-description">
            Join India's growing digital health network. Free for patients. Instant setup. Complete privacy.
          </p>
          <div className="cta-actions">
            <Link to="/patient/register" className="primary-btn" style={{ padding: '18px 40px', fontSize: '1.05rem' }}>
              Create Your Health ID
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/hospital/register" className="secondary-btn" style={{ padding: '18px 36px' }}>
              Register Your Hospital
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════
          PREMIUM FOOTER
      ════════════════════════════════════ */}
      <footer className="premium-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand-logo">
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <path d="M2 14h5l3-8 4 16 3-10 2 4h7" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Health<span style={{ color: 'var(--accent-primary)' }}>ID</span>
            </div>
            <p className="footer-brand-desc">
              India's digital health infrastructure. Secure, consent-based medical records for every citizen.
            </p>
          </div>

          <div>
            <h4 className="footer-column-title">For Patients</h4>
            <ul className="footer-links">
              <li><Link to="/patient/register">Create Health ID</Link></li>
              <li><Link to="/patient/login">Patient Login</Link></li>
              <li><Link to="/patient/records">My Records</Link></li>
              <li><Link to="/patient/healthcard">Health Card</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-column-title">For Hospitals</h4>
            <ul className="footer-links">
              <li><Link to="/hospital/register">Register Hospital</Link></li>
              <li><Link to="/hospital/login">Hospital Login</Link></li>
              <li><Link to="/hospital/search">Search Patients</Link></li>
              <li><Link to="/hospital/upload">Upload Records</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-column-title">Platform</h4>
            <ul className="footer-links">
              <li><Link to="/admin/login">Admin Portal</Link></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#security">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copyright">
            © {new Date().getFullYear()} HealthID India. All rights reserved.
          </span>
          <div className="footer-india-badge">
            🇮🇳 Made in India
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
