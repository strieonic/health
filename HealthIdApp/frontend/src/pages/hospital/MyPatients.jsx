import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { FaUsers, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../components/EmptyState';

const MyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/hospital/patients');
        setPatients(res.data || []);
      } catch (err) {
        console.error("Failed to fetch patients", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '12px', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex' }}>
          <FaArrowLeft />
        </button>
        <h2 className="heading-gradient" style={{ margin: 0 }}>Hospital Patient Directory</h2>
      </div>
      
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '20px' }}></div>)}
        </div>
      ) : patients.length === 0 ? (
        <EmptyState 
          icon={FaUsers}
          title="Directory is empty"
          description="You haven't visited any patients yet. Find patients by their Health ID or scan their QR code to add them to your directory."
          actionText="Search Patient"
          onAction={() => navigate('/hospital/search')}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {patients.map((patient, index) => (
            <motion.div 
              key={patient._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel"
            >
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{patient.patientId?.name || patient.patientName || 'Unknown'}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Health ID: {patient.patientId?.healthId || 'N/A'}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Last Visit: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyPatients;
