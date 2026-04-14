import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { FaCheckCircle, FaClock, FaTimesCircle, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../components/EmptyState';

const MyConsents = () => {
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsents = async () => {
      try {
        const res = await api.get('/patient/consents');
        setConsents(res.data || []);
      } catch (err) {
        console.error("Failed to fetch consents", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConsents();
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <FaCheckCircle style={{ color: 'var(--success)' }} />;
      case 'rejected': return <FaTimesCircle style={{ color: 'var(--danger)' }} />;
      default: return <FaClock style={{ color: '#f1c40f' }} />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '12px', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex' }}>
          <FaArrowLeft />
        </button>
        <h2 className="heading-gradient" style={{ margin: 0 }}>Consent Requests</h2>
      </div>
      
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '80px', borderRadius: '15px' }}></div>)}
        </div>
      ) : consents.length === 0 ? (
        <EmptyState 
          icon={FaShieldAlt}
          title="No pending requests"
          description="Hospitals will request your permission here before accessing your medical records. You are in full control of your data."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {consents.map((consent, index) => (
            <motion.div 
              key={consent._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>{consent.hospitalId?.hospitalName || 'Unknown Hospital'}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Requested on: {new Date(consent.createdAt).toLocaleString()}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                {getStatusIcon(consent.status)}
                <span style={{ textTransform: 'capitalize', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{consent.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyConsents;
