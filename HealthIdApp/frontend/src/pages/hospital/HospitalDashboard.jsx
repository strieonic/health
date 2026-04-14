import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaSearch, FaUsers, FaCloudUploadAlt, FaFileContract } from 'react-icons/fa';

const HospitalDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 className="heading-gradient" style={{ marginBottom: '2rem' }}>Syncing Systems...</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton bento-tile" style={{ height: '180px' }} />)}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-container"
      style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}
    >
      <div className="glass-panel" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="heading-gradient">Hospital Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{user?.hospitalName}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <Link to="/hospital/search">
          <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" style={{ height: '100%', cursor: 'pointer', textAlign: 'center' }}>
            <FaSearch style={{ fontSize: '2.5rem', color: 'var(--secondary-color)', marginBottom: '1rem' }} />
            <h3>Search Patient</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>Find by Health ID</p>
          </motion.div>
        </Link>
        
        <Link to="/hospital/consent">
          <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" style={{ height: '100%', cursor: 'pointer', textAlign: 'center' }}>
            <FaFileContract style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }} />
            <h3>Request Consent</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>Access patient records via OTP</p>
          </motion.div>
        </Link>
        
        <Link to="/hospital/upload">
          <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" style={{ height: '100%', cursor: 'pointer', textAlign: 'center' }}>
            <FaCloudUploadAlt style={{ fontSize: '2.5rem', color: 'var(--danger)', marginBottom: '1rem' }} />
            <h3>Upload Record</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>Add files to patient profile</p>
          </motion.div>
        </Link>
        
        <Link to="/hospital/patients">
          <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" style={{ height: '100%', cursor: 'pointer', textAlign: 'center' }}>
            <FaUsers style={{ fontSize: '2.5rem', color: 'var(--success)', marginBottom: '1rem' }} />
            <h3>Directory</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>Your previously visited patients</p>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

export default HospitalDashboard;
