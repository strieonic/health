import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MagneticButton from '../components/MagneticButton';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div 
      style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, var(--accent-primary-soft) 0%, transparent 70%)',
          filter: 'blur(100px)',
          zIndex: -1
        }}
      />

      <motion.h1 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          fontSize: '15rem', 
          fontWeight: 900, 
          lineHeight: 1, 
          margin: 0,
          background: 'linear-gradient(to bottom, var(--text-primary) 30%, transparent 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          opacity: 0.1
        }}
      >
        404
      </motion.h1>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ position: 'relative', marginTop: '-5rem' }}
      >
        <h2 className="heading-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Lost in the Cloud?</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
          We couldn't find the medical record or page you were looking for. It might have been moved, deleted, or never existed in this dimension.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <MagneticButton onClick={() => navigate(-1)} className="secondary-btn">
            Go Back
          </MagneticButton>
          <MagneticButton onClick={() => navigate('/')} className="primary-btn">
            Return Home
          </MagneticButton>
        </div>
      </motion.div>

      {/* Subtle Grid Overlay */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundImage: 'radial-gradient(var(--border-subtle) 1px, transparent 1px)', 
          backgroundSize: '40px 40px', 
          opacity: 0.2, 
          zIndex: -2 
        }} 
      />
    </div>
  );
};

export default NotFound;
