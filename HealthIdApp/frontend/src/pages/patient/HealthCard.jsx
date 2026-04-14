import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { QRCodeSVG } from 'qrcode.react';
import { FaArrowLeft, FaIdCard } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HealthCard = () => {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHealthCard = async () => {
      try {
        const res = await api.get('/patient/healthcard');
        setCardData(res.data);
      } catch (err) {
        console.error("Failed to fetch health card", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHealthCard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container" style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '12px' }} />
          <div className="skeleton" style={{ width: '200px', height: '30px' }} />
        </div>
        <div className="skeleton" style={{ height: '300px', borderRadius: '24px' }} />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '12px', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex' }}>
          <FaArrowLeft />
        </button>
        <div>
          <h2 className="heading-gradient" style={{ margin: 0 }}>Digital Identity</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Official Medical Passport</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', perspective: '1000px' }}>
        <motion.div 
          className="glass-panel"
          whileHover={{ rotateY: 5, rotateX: 5, scale: 1.02 }}
          style={{ 
            width: '100%', 
            maxWidth: '500px', 
            background: 'linear-gradient(135deg, rgba(15, 76, 129, 0.4) 0%, rgba(0, 242, 254, 0.1) 100%)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--secondary-color)', opacity: '0.1', filter: 'blur(40px)', borderRadius: '50%' }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ letterSpacing: '2px', fontSize: '1.5rem', color: '#fff' }}>Health<span style={{ color: 'var(--secondary-color)' }}>ID</span></h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Republic of India</p>
            </div>
            <div style={{ padding: '0.5rem', background: '#fff', borderRadius: '8px' }}>
              {cardData && <QRCodeSVG value={cardData.healthId} size={70} />}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Cardholder Name</p>
              <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>{cardData?.name || 'N/A'}</h3>
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Health ID Number</p>
              <h3 style={{ fontSize: '1.5rem', letterSpacing: '3px', color: 'var(--secondary-color)', fontFamily: 'monospace' }}>
                {cardData?.healthId || 'N/A'}
              </h3>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HealthCard;
