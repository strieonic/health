import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { toast } from 'sonner';
import { FaHospital, FaClinicMedical, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUsers, FaFileUpload, FaLock, FaIdCard } from 'react-icons/fa';
import MagneticButton from '../../components/MagneticButton';

const HospitalRegister = () => {
  const [formData, setFormData] = useState({
    hospitalName: '', regNumber: '', address: '', email: '', phone: '', password: '', doctors: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    if (file) data.append('file', file);

    try {
      const res = await api.post('/auth/hospital/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Registration Submitted', {
        description: 'Our administration team will verify your credentials within 24-48 hours.'
      });
      setTimeout(() => navigate('/hospital/login'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="auth-container"
      style={{ maxWidth: '700px', margin: '4rem auto', padding: '1rem' }}
    >
      <div className="glass-panel" style={{ padding: '3.5rem 3rem' }}>
        <div className="text-center" style={{ marginBottom: '3.5rem' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--bg-elevated)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--border-subtle)' }}>
            <FaClinicMedical style={{ fontSize: '2rem', color: 'var(--accent-secondary)' }} />
          </div>
          <h2 className="heading-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Provider Registration</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Connect your institution to the Secure Medical Network.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.8rem' }}>
          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginLeft: '4px', letterSpacing: '0.5px' }}>INSTITUTION NAME</label>
            <div style={{ position: 'relative', marginTop: '0.6rem' }}>
              <FaHospital style={{ position: 'absolute', top: '15px', left: '16px', color: 'var(--text-tertiary)' }} />
              <input type="text" name="hospitalName" className="glass-input" style={{ paddingLeft: '45px' }} placeholder="City General Hospital" required onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginLeft: '4px' }}>REGISTRATION NUMBER</label>
            <div style={{ position: 'relative', marginTop: '0.6rem' }}>
              <FaIdCard style={{ position: 'absolute', top: '15px', left: '16px', color: 'var(--text-tertiary)' }} />
              <input type="text" name="regNumber" className="glass-input" style={{ paddingLeft: '45px' }} placeholder="MCI-482-991" required onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginLeft: '4px' }}>CONTACT PHONE</label>
            <div style={{ position: 'relative', marginTop: '0.6rem' }}>
              <FaPhoneAlt style={{ position: 'absolute', top: '15px', left: '16px', color: 'var(--text-tertiary)' }} />
              <input type="tel" name="phone" className="glass-input" style={{ paddingLeft: '45px' }} placeholder="+91 00000 00000" required onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginLeft: '4px' }}>OFFICIAL EMAIL</label>
            <div style={{ position: 'relative', marginTop: '0.6rem' }}>
              <FaEnvelope style={{ position: 'absolute', top: '15px', left: '16px', color: 'var(--text-tertiary)' }} />
              <input type="email" name="email" className="glass-input" style={{ paddingLeft: '45px' }} placeholder="admin@hospital.com" required onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginLeft: '4px' }}>ACCESS PASSWORD</label>
            <div style={{ position: 'relative', marginTop: '0.6rem' }}>
              <FaLock style={{ position: 'absolute', top: '15px', left: '16px', color: 'var(--text-tertiary)' }} />
              <input type="password" name="password" className="glass-input" style={{ paddingLeft: '45px' }} placeholder="••••••••" required onChange={handleChange} />
            </div>
          </div>

          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginLeft: '4px' }}>PHYSICAL ADDRESS</label>
            <div style={{ position: 'relative', marginTop: '0.6rem' }}>
              <FaMapMarkerAlt style={{ position: 'absolute', top: '15px', left: '16px', color: 'var(--text-tertiary)' }} />
              <textarea name="address" className="glass-input" style={{ paddingLeft: '45px', paddingTop: '12px' }} rows="2" placeholder="Full address of the medical facility" onChange={handleChange}></textarea>
            </div>
          </div>

          <div className="input-group">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginLeft: '4px' }}>CLINICAL STAFF COUNT</label>
            <div style={{ position: 'relative', marginTop: '0.6rem' }}>
              <FaUsers style={{ position: 'absolute', top: '15px', left: '16px', color: 'var(--text-tertiary)' }} />
              <input type="number" name="doctors" className="glass-input" style={{ paddingLeft: '45px' }} placeholder="Total Doctors" onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginLeft: '4px' }}>OPERATING LICENSE (PDF)</label>
            <div style={{ position: 'relative', marginTop: '0.6rem' }}>
              <FaFileUpload style={{ position: 'absolute', top: '15px', left: '16px', color: 'var(--text-tertiary)' }} />
              <input type="file" accept=".pdf" className="glass-input" style={{ paddingLeft: '45px', paddingTop: '12px' }} onChange={handleFileChange} />
            </div>
          </div>

          <MagneticButton type="submit" className="primary-btn" disabled={loading} style={{ gridColumn: '1 / -1', marginTop: '1.5rem', height: '54px' }}>
            {loading ? 'Processing Application...' : 'Apply for Provider Access'}
          </MagneticButton>
        </form>

        <div style={{ marginTop: '3rem', textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Institutional setup already complete? <Link to="/hospital/login" style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>Provider Login</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default HospitalRegister;
