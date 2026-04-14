import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { FaFilePdf, FaImage, FaStethoscope, FaPlus, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { toast } from 'sonner';
import EmptyState from '../../components/EmptyState';

const MyRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('Other');
  const [recordType, setRecordType] = useState('');

  const fetchRecords = async () => {
    try {
      setLoading(true);
      // Fetch specifically from the patient's own locker endpoint
      const res = await api.get('/records/my/all');
      setRecords(res.data.records || []);
    } catch (err) {
      console.error("Failed to fetch records", err);
      toast.error("Could not load your records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file first.");
    
    setUploadLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('recordType', recordType);

    try {
      await api.post('/records/my/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("File saved to your Locker!");
      setShowUpload(false);
      setFile(null);
      setRecordType('');
      fetchRecords();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploadLoading(false);
    }
  };

  const getIcon = (cat) => {
    switch (cat) {
      case 'Prescription': return <FaStethoscope />;
      case 'Lab Report': return <FaFilePdf />;
      case 'Scan': return <FaImage />;
      default: return <FaFilePdf />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="records-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 className="heading-gradient" style={{ fontSize: '2.5rem' }}>Medical Locker</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Securely store and share your health history.</p>
        </div>
        <button className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setShowUpload(true)}>
          <FaPlus /> Upload Record
        </button>
      </div>
      
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '240px', borderRadius: '24px' }}></div>)}
        </div>
      ) : records.length === 0 ? (
        <EmptyState 
          icon={FaCloudUploadAlt}
          title="Your locker is empty"
          description="Upload your prescriptions, lab reports, or scans to keep them safe and accessible whenever you need them."
          actionText="Upload Your First Record"
          onAction={() => setShowUpload(true)}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {records.map((record, index) => (
            <motion.div 
              key={record._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel record-card"
              style={{ padding: '1.5rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: '15px' }}>
                  <div style={{ fontSize: '1.5rem', color: '#007aff' }}>{getIcon(record.category)}</div>
                </div>
                <span className="badge" style={{ backgroundColor: 'rgba(0,122,255,0.1)', color: '#007aff', height: 'fit-content', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem' }}>
                  {record.category}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{record.recordType || 'General Record'}</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Source: {record.ownerType === 'hospital' ? record.hospital?.hospitalName : 'Personal Upload'}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {new Date(record.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>

              <a href={record.fileUrl} target="_blank" rel="noreferrer" className="secondary-btn" style={{ textAlign: 'center', width: '100%', borderRadius: '12px' }}>
                View Record
              </a>
            </motion.div>
          ))}
        </div>
      )}

      {/* UPLOAD MODAL */}
      <AnimatePresence>
        {showUpload && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="modal-overlay" 
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="glass-panel" 
              style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h3 className="heading-gradient">Upload to Locker</h3>
                <FaTimes style={{ cursor: 'pointer' }} onClick={() => setShowUpload(false)} />
              </div>

              <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="input-group">
                  <label>Record Name (e.g., Blood Test Feb 24)</label>
                  <input type="text" className="glass-input" required value={recordType} onChange={e => setRecordType(e.target.value)} />
                </div>

                <div className="input-group">
                  <label>Category</label>
                  <select className="glass-input" value={category} onChange={e => setCategory(e.target.value)}>
                    <option>Prescription</option>
                    <option>Lab Report</option>
                    <option>Scan</option>
                    <option>Vaccination</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="file-drop-area" style={{ border: '2px dashed var(--glass-border)', padding: '2rem', textAlign: 'center', borderRadius: '15px' }}>
                  <input type="file" id="record-file" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} required />
                  <label htmlFor="record-file" style={{ cursor: 'pointer' }}>
                    <FaCloudUploadAlt style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }} />
                    <p>{file ? file.name : 'Select PDF or Image'}</p>
                  </label>
                </div>

                <button type="submit" className="primary-btn" disabled={uploadLoading}>
                  {uploadLoading ? 'Uploading...' : 'Confirm Upload'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyRecords;
