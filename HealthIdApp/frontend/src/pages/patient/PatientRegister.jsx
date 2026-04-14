import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { toast } from 'sonner';
import { FaUser, FaPhoneAlt, FaIdCard, FaEnvelope, FaFingerprint } from 'react-icons/fa';
import MagneticButton from '../../components/MagneticButton';

const PatientRegister = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', aadhaar: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/patient/register', formData);
      toast.success('Medical identity created!', {
        description: 'Generating your unique Health ID and encryption keys...'
      });
      setTimeout(() => navigate('/patient/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="auth-container"
      style={{ maxWidth: '480px', margin: '6rem auto', padding: '1rem' }}
    >
      <div className="glass-panel" style={{ padding: '3rem 2.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--accent-primary-soft)', filter: 'blur(60px)', opacity: 0.3, borderRadius: '50%' }} />
        
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <div style={{ width: '60px', height: '60px', background: 'var(--bg-elevated)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--border-subtle)' }}>
            <FaFingerprint style={{ fontSize: '1.8rem', color: 'var(--accent-primary)' }} />
          </div>
          <h2 className="heading-gradient" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Start Your Journey</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Create your encrypted medical passport.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="input-group">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginLeft: '4px' }}>FULL LEGAL NAME</label>
            <div style={{ position: 'relative', marginTop: '0.6rem' }}>
              <FaUser style={{ position: 'absolute', top: '15px', left: '16px', color: 'var(--text-tertiary)', fontSize: '0.9rem' }} />
              <input type="text" name="name" className="glass-input" style={{ paddingLeft: '45px' }} placeholder="e.g. Rahul Sharma" required onChange={handleChange} />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginLeft: '4px' }}>PHONE</label>
              <div style={{ position: 'relative', marginTop: '0.6rem' }}>
                <FaPhoneAlt style={{ position: 'absolute', top: '15px', left: '16px', color: 'var(--text-tertiary)', fontSize: '0.9rem' }} />
                <input type="tel" name="phone" className="glass-input" style={{ paddingLeft: '45px' }} placeholder="10 digits" required onChange={handleChange} />
              </div>
            </div>
            <div className="input-group">
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginLeft: '4px' }}>BLOOD GROUP</label>
              <select name="bloodGroup" className="glass-input" style={{ marginTop: '0.6rem' }} onChange={handleChange}>
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginLeft: '4px' }}>EMAIL ADDRESS</label>
            <div style={{ position: 'relative', marginTop: '0.6rem' }}>
              <FaEnvelope style={{ position: 'absolute', top: '15px', left: '16px', color: 'var(--text-tertiary)', fontSize: '0.9rem' }} />
              <input type="email" name="email" className="glass-input" style={{ paddingLeft: '45px' }} placeholder="user@example.com" required onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginLeft: '4px' }}>AADHAAR (OPTIONAL)</label>
            <div style={{ position: 'relative', marginTop: '0.6rem' }}>
              <FaIdCard style={{ position: 'absolute', top: '15px', left: '16px', color: 'var(--text-tertiary)', fontSize: '0.9rem' }} />
              <input type="text" name="aadhaar" className="glass-input" style={{ paddingLeft: '45px' }} placeholder="12-digit number" onChange={handleChange} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.5rem', marginLeft: '4px' }}>Used for identity verification with hospitals.</p>
          </div>

          <MagneticButton type="submit" className="primary-btn" disabled={loading} style={{ width: '100%', marginTop: '1.5rem', height: '52px' }}>
            {loading ? 'Creating Identity...' : 'Register Securely'}
          </MagneticButton>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Part of the Arogyam network? <Link to="/patient/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientRegister;
