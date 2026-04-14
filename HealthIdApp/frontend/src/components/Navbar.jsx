import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', label: 'বাংলা', flag: '🇮🇳' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' }
];

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark');
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const isAdmin = localStorage.getItem('adminAuth') === 'true';
  const isOnAdminPage = location.pathname.startsWith('/admin');
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = useCallback(() => {
    logout();
    localStorage.removeItem('adminAuth');
    navigate('/');
    setMenuOpen(false);
  }, [logout, navigate]);

  const handleAdminLogout = useCallback(() => {
    localStorage.removeItem('adminAuth');
    navigate('/');
    setMenuOpen(false);
  }, [navigate]);

  const closeMenu = () => setMenuOpen(false);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const navLinkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1, x: 0,
      transition: { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    }),
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${isLanding && !scrolled ? 'navbar-transparent' : ''}`}>
        <div className="nav-inner">
          {/* Brand */}
          <Link to="/" className="brand-logo" onClick={closeMenu}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="brand-heartbeat">
              <path 
                d="M2 14h5l3-8 4 16 3-10 2 4h7" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span className="brand-text">
              Health<span className="brand-accent">ID</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="nav-desktop">
            {isAdmin && isOnAdminPage ? (
              <>
                <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                <div className="nav-user-controls">
                  <span className="user-greeting">Admin</span>
                  <button onClick={handleAdminLogout} className="ghost-btn btn-sm">Logout</button>
                </div>
              </>
            ) : !user ? (
              <>
                <Link to="/patient/login" className="nav-link">{t('nav.login')}</Link>
                <Link to="/hospital/login" className="nav-link">{t('nav.hospitalPortal')}</Link>
                <Link to="/admin/login" className="nav-link">{t('nav.adminPortal')}</Link>
                <Link to="/patient/register" className="nav-cta">
                  {t('nav.getStarted')}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: '4px' }}>
                    <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </>
            ) : (
              <>
                {role === 'patient' && (
                  <>
                    <Link to="/patient/dashboard" className="nav-link">{t('nav.dashboard')}</Link>
                    <Link to="/patient/records" className="nav-link">{t('nav.records')}</Link>
                    <Link to="/patient/consents" className="nav-link">{t('nav.consents')}</Link>
                    <Link to="/patient/healthcard" className="nav-link">{t('nav.healthCard')}</Link>
                  </>
                )}
                {role === 'hospital' && (
                  <>
                    <Link to="/hospital/dashboard" className="nav-link">{t('nav.dashboard')}</Link>
                    <Link to="/hospital/search" className="nav-link">{t('nav.search')}</Link>
                    <Link to="/hospital/consent" className="nav-link">{t('nav.consents')}</Link>
                    <Link to="/hospital/upload" className="nav-link">{t('nav.upload')}</Link>
                    <Link to="/hospital/patients" className="nav-link">{t('nav.directory')}</Link>
                  </>
                )}
                <div className="nav-user-controls">
                  <span className="user-greeting">{user.name || user.hospitalName || 'User'}</span>
                  <button onClick={handleLogout} className="ghost-btn btn-sm">{t('nav.logout')}</button>
                </div>
              </>
            )}

            {/* Language Switcher */}
            <div className="lang-switcher">
              <button 
                className="lang-btn" 
                onClick={() => setLangOpen(!langOpen)}
                aria-label="Select Language"
              >
                <span className="lang-icon">🌐</span>
                <span className="lang-current">{languages.find(l => l.code === i18n.language.split('-')[0])?.label || 'EN'}</span>
              </button>
              
              <AnimatePresence>
                {langOpen && (
                  <motion.div 
                    className="lang-dropdown"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`lang-option ${i18n.language.startsWith(lang.code) ? 'active' : ''}`}
                        onClick={() => {
                          i18n.changeLanguage(lang.code);
                          setLangOpen(false);
                        }}
                      >
                        <span className="lang-flag">{lang.flag}</span>
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {theme === 'dark' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="menu-toggle" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <div className={`hamburger ${menuOpen ? 'hamburger-open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="mobile-menu-content"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mobile-menu-links">
                {isAdmin && isOnAdminPage ? (
                  <>
                    <motion.div custom={0} initial="hidden" animate="visible" variants={navLinkVariants}>
                      <Link to="/admin/dashboard" className="mobile-link" onClick={closeMenu}>Dashboard</Link>
                    </motion.div>
                    <motion.div custom={1} initial="hidden" animate="visible" variants={navLinkVariants}>
                      <button onClick={handleAdminLogout} className="mobile-link">Logout</button>
                    </motion.div>
                  </>
                ) : !user ? (
                  <>
                    <motion.div custom={0} initial="hidden" animate="visible" variants={navLinkVariants}>
                      <Link to="/patient/login" className="mobile-link" onClick={closeMenu}>Patient Login</Link>
                    </motion.div>
                    <motion.div custom={1} initial="hidden" animate="visible" variants={navLinkVariants}>
                      <Link to="/patient/register" className="mobile-link accent" onClick={closeMenu}>Register</Link>
                    </motion.div>
                    <motion.div custom={2} initial="hidden" animate="visible" variants={navLinkVariants}>
                      <Link to="/hospital/login" className="mobile-link" onClick={closeMenu}>Hospital Portal</Link>
                    </motion.div>
                    <motion.div custom={3} initial="hidden" animate="visible" variants={navLinkVariants}>
                      <Link to="/admin/login" className="mobile-link subtle" onClick={closeMenu}>Admin</Link>
                    </motion.div>
                  </>
                ) : (
                  <>
                    {role === 'patient' && (
                      <>
                        <motion.div custom={0} initial="hidden" animate="visible" variants={navLinkVariants}>
                          <Link to="/patient/dashboard" className="mobile-link" onClick={closeMenu}>Dashboard</Link>
                        </motion.div>
                        <motion.div custom={1} initial="hidden" animate="visible" variants={navLinkVariants}>
                          <Link to="/patient/records" className="mobile-link" onClick={closeMenu}>Records</Link>
                        </motion.div>
                        <motion.div custom={2} initial="hidden" animate="visible" variants={navLinkVariants}>
                          <Link to="/patient/consents" className="mobile-link" onClick={closeMenu}>Consents</Link>
                        </motion.div>
                        <motion.div custom={3} initial="hidden" animate="visible" variants={navLinkVariants}>
                          <Link to="/patient/healthcard" className="mobile-link" onClick={closeMenu}>Health Card</Link>
                        </motion.div>
                      </>
                    )}
                    {role === 'hospital' && (
                      <>
                        <motion.div custom={0} initial="hidden" animate="visible" variants={navLinkVariants}>
                          <Link to="/hospital/dashboard" className="mobile-link" onClick={closeMenu}>Dashboard</Link>
                        </motion.div>
                        <motion.div custom={1} initial="hidden" animate="visible" variants={navLinkVariants}>
                          <Link to="/hospital/search" className="mobile-link" onClick={closeMenu}>Search</Link>
                        </motion.div>
                        <motion.div custom={2} initial="hidden" animate="visible" variants={navLinkVariants}>
                          <Link to="/hospital/consent" className="mobile-link" onClick={closeMenu}>Consent</Link>
                        </motion.div>
                        <motion.div custom={3} initial="hidden" animate="visible" variants={navLinkVariants}>
                          <Link to="/hospital/upload" className="mobile-link" onClick={closeMenu}>Upload</Link>
                        </motion.div>
                        <motion.div custom={4} initial="hidden" animate="visible" variants={navLinkVariants}>
                          <Link to="/hospital/patients" className="mobile-link" onClick={closeMenu}>Directory</Link>
                        </motion.div>
                      </>
                    )}
                    <motion.div custom={5} initial="hidden" animate="visible" variants={navLinkVariants} className="mobile-user-section">
                      <span className="mobile-user-name">{user.name || user.hospitalName || 'User'}</span>
                      <button onClick={handleLogout} className="ghost-btn">Logout</button>
                    </motion.div>
                  </>
                )}
                
                <motion.div custom={6} initial="hidden" animate="visible" variants={navLinkVariants} className="mobile-lang-selector">
                  <p className="mobile-section-label">Select Language</p>
                  <div className="mobile-lang-grid">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`mobile-lang-item ${i18n.language.startsWith(lang.code) ? 'active' : ''}`}
                        onClick={() => {
                          i18n.changeLanguage(lang.code);
                          closeMenu();
                        }}
                      >
                        <span className="lang-flag">{lang.flag}</span>
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </motion.div>

                <motion.div custom={7} initial="hidden" animate="visible" variants={navLinkVariants} className="mobile-theme-toggle">
                  <button onClick={toggleTheme} className="ghost-btn">
                    {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
