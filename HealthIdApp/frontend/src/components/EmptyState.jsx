import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, description, actionText, onAction }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px dashed var(--border-subtle)',
        borderRadius: 'var(--radius-xl)'
      }}
    >
      <div style={{ 
        width: '80px', 
        height: '80px', 
        borderRadius: '50%', 
        background: 'var(--bg-elevated)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '1.5rem',
        boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05)'
      }}>
        {Icon && <Icon style={{ fontSize: '2.5rem', color: 'var(--text-tertiary)' }} />}
      </div>
      
      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontWeight: 700 }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '2rem', lineHeight: 1.6 }}>
        {description}
      </p>

      {actionText && (
        <button className="primary-btn" onClick={onAction}>
          {actionText}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
