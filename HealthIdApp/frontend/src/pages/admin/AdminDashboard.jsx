import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import EmptyState from '../../components/EmptyState';
import './AdminDashboard.css';

/* ── Icon Components ── */
const Icons = {
  Overview: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Hospital: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/>
    </svg>
  ),
  Patient: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Record: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  Consent: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Search: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Logout: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Menu: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Close: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  ArrowUp: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  ),
  Shield: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Eye: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Trash: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  Check: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  X: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Activity: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Server: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
    </svg>
  ),
  Refresh: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  ),
};

/* ── Helper: Format date ── */
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

/* ==============================================================
   SIDEBAR NAV CONFIG
============================================================== */
const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: Icons.Overview, section: 'Dashboard' },
  { key: 'hospitals', label: 'Hospitals', icon: Icons.Hospital, section: 'Management' },
  { key: 'patients', label: 'Patients', icon: Icons.Patient, section: 'Management' },
  { key: 'records', label: 'Records', icon: Icons.Record, section: 'Data' },
  { key: 'consents', label: 'Consents', icon: Icons.Consent, section: 'Data' },
];

/* ==============================================================
   ADMIN DASHBOARD — MAIN COMPONENT
============================================================== */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data state
  const [stats, setStats] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [patients, setPatients] = useState([]);
  const [records, setRecords] = useState([]);
  const [consents, setConsents] = useState([]);

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [showStatusWidget, setShowStatusWidget] = useState(false);

  /* ── Fetch dashboard stats ── */
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Stats fetch failed:', err);
    }
  }, []);

  /* ── Fetch hospitals ── */
  const fetchHospitals = useCallback(async () => {
    try {
      const res = await api.get('/admin/hospitals');
      setHospitals(res.data.hospitals || []);
    } catch (err) {
      console.error('Hospitals fetch failed:', err);
    }
  }, []);

  /* ── Fetch patients ── */
  const fetchPatients = useCallback(async () => {
    try {
      const res = await api.get('/admin/patients');
      setPatients(res.data.patients || []);
    } catch (err) {
      console.error('Patients fetch failed:', err);
    }
  }, []);

  /* ── Fetch records ── */
  const fetchRecords = useCallback(async () => {
    try {
      const res = await api.get('/admin/records');
      setRecords(res.data.records || []);
    } catch (err) {
      console.error('Records fetch failed:', err);
    }
  }, []);

  /* ── Fetch system status ── */
  const fetchSystemStatus = useCallback(async () => {
    try {
      const res = await api.get('/admin/system-status');
      setSystemStatus(res.data);
    } catch (err) {
      console.error('System status fetch failed:', err);
    }
  }, []);

  /* ── Fetch consents ── */
  const fetchConsents = useCallback(async () => {
    try {
      const res = await api.get('/admin/consents');
      setConsents(res.data.consents || []);
    } catch (err) {
      console.error('Consents fetch failed:', err);
    }
  }, []);

  /* ── Initial load ── */
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchStats(), 
        fetchHospitals(), 
        fetchPatients(), 
        fetchRecords(), 
        fetchConsents(),
        fetchSystemStatus()
      ]);
      setLoading(false);
    };
    loadAll();
    
    // Auto-refresh system status every 2 minutes
    const interval = setInterval(fetchSystemStatus, 120000);
    return () => clearInterval(interval);
  }, [fetchStats, fetchHospitals, fetchPatients, fetchRecords, fetchConsents, fetchSystemStatus]);

  /* ── Hospital actions ── */
  const handleHospitalAction = async (id, action) => {
    try {
      if (action === 'approve') await api.put(`/admin/approve/${id}`);
      else if (action === 'reject') await api.put(`/admin/reject/${id}`);
      else if (action === 'delete') await api.delete(`/admin/hospital/${id}`);
      setConfirmAction(null);
      setSelectedHospital(null);
      await Promise.all([fetchHospitals(), fetchStats()]);
    } catch (err) {
      alert('Action failed. Please try again.');
    }
  };

  /* ── View hospital detail ── */
  const handleViewHospital = async (id) => {
    try {
      const res = await api.get(`/admin/hospital/${id}`);
      setSelectedHospital(res.data);
    } catch (err) {
      console.error('Hospital detail fetch failed:', err);
    }
  };

  /* ── Admin logout ── */
  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  /* ── Sidebar nav click ── */
  const handleNavClick = (key) => {
    setActiveView(key);
    setSearchQuery('');
    setFilterStatus('all');
    setSidebarOpen(false);
  };

  /* ── Counts for sidebar badges ── */
  const getCounts = () => ({
    overview: null,
    hospitals: hospitals.length,
    patients: patients.length,
    records: records.length,
    consents: consents.length,
  });
  const counts = getCounts();

  /* ── Filter helpers ── */
  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = !searchQuery || 
      h.hospitalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.regNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || h.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredPatients = patients.filter(p =>
    !searchQuery ||
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.healthId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone?.includes(searchQuery)
  );

  const filteredRecords = records.filter(r =>
    !searchQuery ||
    r.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.patient?.healthId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.hospital?.hospitalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.recordType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredConsents = consents.filter(c => {
    const matchesSearch = !searchQuery ||
      c.patientId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.hospitalId?.hospitalName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  /* ── Page animation ── */
  const pageVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
  };

  const staggerContainer = {
    visible: { transition: { staggerChildren: 0.06 } },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  /* ==============================================================
     RENDER — OVERVIEW VIEW
  ============================================================== */
  const renderOverview = () => (
    <motion.div key="overview" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
      <div className="admin-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2>Dashboard Overview</h2>
            <p>Real-time system metrics and activity</p>
          </div>
          <button 
            className={`system-status-trigger ${systemStatus?.watchdogRunning ? 'status-ok' : 'status-warn'}`}
            onClick={() => setShowStatusWidget(!showStatusWidget)}
          >
            <Icons.Activity />
            <span>System Status</span>
            <div className={`status-indicator ${systemStatus?.watchdogRunning ? 'pulse' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <motion.div className="stats-grid" variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div className="stat-card accent-pink" variants={staggerItem}>
          <div className="stat-card-top">
            <div className="stat-icon-wrapper">👥</div>
            {stats?.recentPatients > 0 && (
              <span className="stat-change positive"><Icons.ArrowUp /> +{stats.recentPatients} this week</span>
            )}
          </div>
          <div className="stat-value">{stats?.totalPatients ?? '—'}</div>
          <div className="stat-label">Total Patients</div>
        </motion.div>

        <motion.div className="stat-card accent-teal" variants={staggerItem}>
          <div className="stat-card-top">
            <div className="stat-icon-wrapper">🏥</div>
            {stats?.recentHospitals > 0 && (
              <span className="stat-change positive"><Icons.ArrowUp /> +{stats.recentHospitals} this week</span>
            )}
          </div>
          <div className="stat-value">{stats?.totalHospitals ?? '—'}</div>
          <div className="stat-label">Registered Hospitals</div>
        </motion.div>

        <motion.div className="stat-card accent-amber" variants={staggerItem}>
          <div className="stat-card-top">
            <div className="stat-icon-wrapper">📋</div>
            {stats?.recentRecords > 0 && (
              <span className="stat-change positive"><Icons.ArrowUp /> +{stats.recentRecords} this week</span>
            )}
          </div>
          <div className="stat-value">{stats?.totalRecords ?? '—'}</div>
          <div className="stat-label">Medical Records</div>
        </motion.div>

        <motion.div className="stat-card accent-purple" variants={staggerItem}>
          <div className="stat-card-top">
            <div className="stat-icon-wrapper">🛡️</div>
            <span className="stat-change neutral">{stats?.approvedConsents ?? 0} approved</span>
          </div>
          <div className="stat-value">{stats?.totalConsents ?? '—'}</div>
          <div className="stat-label">Consent Requests</div>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div className="quick-actions" variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div className="quick-action-card" variants={staggerItem} onClick={() => handleNavClick('hospitals')}>
          <div className="quick-action-icon">⏳</div>
          <div>
            <h4>{stats?.pendingHospitals ?? 0} Pending Approvals</h4>
            <p>Review hospital registration requests</p>
          </div>
        </motion.div>
        <motion.div className="quick-action-card" variants={staggerItem} onClick={() => handleNavClick('patients')}>
          <div className="quick-action-icon">👤</div>
          <div>
            <h4>Manage Patients</h4>
            <p>View all registered patient profiles</p>
          </div>
        </motion.div>
        <motion.div className="quick-action-card" variants={staggerItem} onClick={() => handleNavClick('records')}>
          <div className="quick-action-icon">📁</div>
          <div>
            <h4>Medical Records</h4>
            <p>Monitor uploaded health records</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Activity + System Health */}
      <div className="activity-section">
        <motion.div className="activity-feed" variants={staggerItem} initial="hidden" animate="visible">
          <h3>Recent Activity</h3>
          {hospitals.slice(0, 5).map((h, i) => (
            <div className="activity-item" key={h._id || i}>
              <div className={`activity-dot ${h.status === 'approved' ? 'dot-teal' : h.status === 'rejected' ? 'dot-pink' : 'dot-amber'}`} />
              <div className="activity-text">
                <p>
                  <strong>{h.hospitalName}</strong>
                  {h.status === 'pending' && ' submitted registration'}
                  {h.status === 'approved' && ' was approved'}
                  {h.status === 'rejected' && ' was rejected'}
                </p>
                <span>{timeAgo(h.updatedAt || h.createdAt)}</span>
              </div>
            </div>
          ))}
          {hospitals.length === 0 && (
            <p style={{ color: 'var(--text-tertiary)', padding: '1rem 0', fontSize: 'var(--text-sm)' }}>No recent activity</p>
          )}
        </motion.div>

        <motion.div className="system-health" variants={staggerItem} initial="hidden" animate="visible">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <h3>System Status</h3>
            <button className="refresh-btn-mini" onClick={fetchSystemStatus} title="Refresh Status">
              <Icons.Refresh />
            </button>
          </div>
          
          <div className="health-item">
            <span className="health-label">Backend Server</span>
            <span className={`health-value ${systemStatus?.servers?.backend?.status === 'online' ? 'success' : 'danger'}`}>
              {systemStatus?.servers?.backend?.status?.toUpperCase() || 'UNKNOWN'}
            </span>
          </div>
          <div className="health-item">
            <span className="health-label">Frontend (Vite)</span>
            <span className={`health-value ${systemStatus?.servers?.frontend?.status === 'online' ? 'success' : 'danger'}`}>
                {systemStatus?.servers?.frontend?.status?.toUpperCase() || 'OFFLINE'}
            </span>
          </div>
          <div className="health-item">
            <span className="health-label">Watchdog Monitor</span>
            <span className={`health-value ${systemStatus?.watchdogRunning ? 'success' : 'warning'}`}>
              {systemStatus?.watchdogRunning ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
          <div className="health-item">
            <span className="health-label">Auto-Heal Fixes</span>
            <span className="health-value">{systemStatus?.watchdog?.fixes?.length || 0} Applied</span>
          </div>
          <div className="health-item" style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '8px', paddingTop: '8px' }}>
            <span className="health-label">Next Auto-Check</span>
            <span className="health-value" style={{ fontSize: '10px' }}>
              {systemStatus?.watchdog?.nextCheck ? new Date(systemStatus.watchdog.nextCheck).toLocaleTimeString() : '--:--'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── Compact System Status Window ── */}
      <AnimatePresence>
        {showStatusWidget && (
          <>
            <div className="status-widget-overlay" onClick={() => setShowStatusWidget(false)} />
            <motion.div 
              className="compact-status-window"
              initial={{ opacity: 0, scale: 0.9, y: 10, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
            >
              <div className="status-window-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icons.Shield />
                  <span>System Health Monitor</span>
                </div>
                <button className="close-mini" onClick={() => setShowStatusWidget(false)}>✕</button>
              </div>

              <div className="status-window-content">
                <div className="status-row">
                  <div className="status-row-info">
                    <Icons.Server />
                    <div>
                      <p>Backend API</p>
                      <span>Port 8000</span>
                    </div>
                  </div>
                  <span className={`status-pill ${systemStatus?.servers?.backend?.status || 'offline'}`}>
                    {systemStatus?.servers?.backend?.status || 'offline'}
                  </span>
                </div>

                <div className="status-row">
                  <div className="status-row-info">
                    <Icons.Server />
                    <div>
                      <p>Frontend (Vite)</p>
                      <span>Port 5173</span>
                    </div>
                  </div>
                  <span className={`status-pill ${systemStatus?.servers?.frontend?.status || 'offline'}`}>
                    {systemStatus?.servers?.frontend?.status || 'offline'}
                  </span>
                </div>

                <div className="status-row">
                  <div className="status-row-info">
                    <Icons.Activity />
                    <div>
                      <p>Watchdog Engine</p>
                      <span>30m interval</span>
                    </div>
                  </div>
                  <span className={`status-pill ${systemStatus?.watchdogRunning ? 'online' : 'offline'}`}>
                    {systemStatus?.watchdogRunning ? 'running' : 'stopped'}
                  </span>
                </div>

                {systemStatus?.watchdog?.fixes?.length > 0 && (
                  <div className="status-logs">
                    <p>Recent Auto-Fixes</p>
                    <div className="log-entries">
                      {systemStatus.watchdog.fixes.slice(-3).reverse().map((fix, idx) => (
                        <div key={idx} className="log-entry">
                          <span>{new Date(fix.at).toLocaleTimeString()}:</span> {fix.msg}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="status-window-footer">
                <button className="refresh-status-btn" onClick={fetchSystemStatus}>
                  <Icons.Refresh /> Refresh Monitoring
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );

  /* ==============================================================
     RENDER — HOSPITALS VIEW
  ============================================================== */
  const renderHospitals = () => (
    <motion.div key="hospitals" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
      <div className="admin-page-header">
        <h2>Hospital Management</h2>
        <p>Review, approve, and manage hospital registrations</p>
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h3>All Hospitals ({filteredHospitals.length})</h3>
          <div className="table-controls">
            <div className="search-input-wrap">
              <Icons.Search />
              <input
                type="text"
                className="table-search"
                placeholder="Search hospitals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button
                key={f}
                className={`table-filter-btn ${filterStatus === f ? 'active' : ''}`}
                onClick={() => setFilterStatus(f)}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredHospitals.length === 0 ? (
          <EmptyState 
            title="No hospitals found"
            description={searchQuery ? "Try adjusting your search or filter criteria to find the hospital you're looking for." : "No hospitals have registered on the platform yet."}
          />
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Hospital Name</th>
                  <th>Reg. Number</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHospitals.map((h, i) => (
                  <motion.tr 
                    key={h._id || i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{h.hospitalName}</td>
                    <td><code style={{ fontSize: '12px', background: 'var(--bg-elevated)', padding: '2px 8px', borderRadius: '4px' }}>{h.regNumber}</code></td>
                    <td>{h.email}</td>
                    <td><span className={`status-badge ${h.status}`}>{h.status}</span></td>
                    <td>{formatDate(h.createdAt)}</td>
                    <td>
                      <div className="action-btn-group">
                        <button className="action-btn view admin-tooltip" data-tooltip="View Details" onClick={() => handleViewHospital(h._id)}>
                          <Icons.Eye />
                        </button>
                        {h.status === 'pending' && (
                          <>
                            <button className="action-btn approve admin-tooltip" data-tooltip="Approve" onClick={() => setConfirmAction({ id: h._id, action: 'approve', name: h.hospitalName })}><Icons.Check /> Approve</button>
                            <button className="action-btn reject admin-tooltip" data-tooltip="Reject" onClick={() => setConfirmAction({ id: h._id, action: 'reject', name: h.hospitalName })}><Icons.X /> Reject</button>
                          </>
                        )}
                        <button className="action-btn delete admin-tooltip" data-tooltip="Delete" onClick={() => setConfirmAction({ id: h._id, action: 'delete', name: h.hospitalName })}><Icons.Trash /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            <div className="table-pagination">
              <span className="pagination-info">Showing {filteredHospitals.length} of {hospitals.length} hospitals</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );

  /* ==============================================================
     RENDER — PATIENTS VIEW
  ============================================================== */
  const renderPatients = () => (
    <motion.div key="patients" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
      <div className="admin-page-header">
        <h2>Patient Registry</h2>
        <p>All registered patients and their Health IDs</p>
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h3>All Patients ({filteredPatients.length})</h3>
          <div className="table-controls">
            <div className="search-input-wrap">
              <Icons.Search />
              <input
                type="text"
                className="table-search"
                placeholder="Search by name, Health ID, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filteredPatients.length === 0 ? (
          <EmptyState 
            title="No patients found"
            description={searchQuery ? "We couldn't find any patients matching your search query." : "The patient registry is currently empty."}
          />
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Health ID</th>
                  <th>Phone</th>
                  <th>Blood Group</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((p, i) => (
                  <motion.tr
                    key={p._id || i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</td>
                    <td><code style={{ fontSize: '12px', background: 'var(--accent-primary-soft)', color: 'var(--accent-primary)', padding: '3px 10px', borderRadius: '4px', fontWeight: 600 }}>{p.healthId || '—'}</code></td>
                    <td>{p.phone}</td>
                    <td>{p.bloodGroup || '—'}</td>
                    <td>{formatDate(p.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            <div className="table-pagination">
              <span className="pagination-info">Showing {filteredPatients.length} of {patients.length} patients</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );

  /* ==============================================================
     RENDER — RECORDS VIEW
  ============================================================== */
  const renderRecords = () => (
    <motion.div key="records" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
      <div className="admin-page-header">
        <h2>Medical Records</h2>
        <p>Overview of all uploaded medical records across hospitals</p>
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h3>All Records ({filteredRecords.length})</h3>
          <div className="table-controls">
            <div className="search-input-wrap">
              <Icons.Search />
              <input
                type="text"
                className="table-search"
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <EmptyState 
            title="No records found"
            description={searchQuery ? "No medical records match your current search criteria." : "No medical records have been uploaded to the system yet."}
          />
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Health ID</th>
                  <th>Hospital</th>
                  <th>Record Type</th>
                  <th>Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r, i) => (
                  <motion.tr
                    key={r._id || i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.patient?.name ?? '—'}</td>
                    <td><code style={{ fontSize: '12px', background: 'var(--accent-primary-soft)', color: 'var(--accent-primary)', padding: '3px 10px', borderRadius: '4px', fontWeight: 600 }}>{r.patient?.healthId ?? '—'}</code></td>
                    <td>{r.hospital?.hospitalName ?? '—'}</td>
                    <td><span className="status-badge approved">{r.recordType || 'General'}</span></td>
                    <td>{formatDate(r.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            <div className="table-pagination">
              <span className="pagination-info">Showing {filteredRecords.length} of {records.length} records</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );

  /* ==============================================================
     RENDER — CONSENTS VIEW
  ============================================================== */
  const renderConsents = () => (
    <motion.div key="consents" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
      <div className="admin-page-header">
        <h2>Consent Management</h2>
        <p>Track all patient consent requests and their statuses</p>
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h3>All Consents ({filteredConsents.length})</h3>
          <div className="table-controls">
            <div className="search-input-wrap">
              <Icons.Search />
              <input
                type="text"
                className="table-search"
                placeholder="Search consents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button
                key={f}
                className={`table-filter-btn ${filterStatus === f ? 'active' : ''}`}
                onClick={() => setFilterStatus(f)}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredConsents.length === 0 ? (
          <EmptyState 
            title="No consents found"
            description={searchQuery ? "We couldn't find any consent requests matching your search." : "There are no active or pending consent requests at this time."}
          />
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Hospital</th>
                  <th>Status</th>
                  <th>Requested</th>
                  <th>Expires</th>
                </tr>
              </thead>
              <tbody>
                {filteredConsents.map((c, i) => (
                  <motion.tr
                    key={c._id || i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.patientId?.name ?? '—'}</td>
                    <td>{c.hospitalId?.hospitalName ?? '—'}</td>
                    <td><span className={`status-badge ${c.status}`}>{c.status}</span></td>
                    <td>{formatDate(c.createdAt)}<br /><span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{formatTime(c.createdAt)}</span></td>
                    <td>{c.expiresAt ? formatDate(c.expiresAt) : '—'}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            <div className="table-pagination">
              <span className="pagination-info">Showing {filteredConsents.length} of {consents.length} consents</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );

  /* ==============================================================
     VIEW ROUTER
  ============================================================== */
  const renderView = () => {
    switch (activeView) {
      case 'overview': return renderOverview();
      case 'hospitals': return renderHospitals();
      case 'patients': return renderPatients();
      case 'records': return renderRecords();
      case 'consents': return renderConsents();
      default: return renderOverview();
    }
  };

  /* ==============================================================
     LOADING STATE
  ============================================================== */
  if (loading) {
    return (
      <div className="admin-portal">
        <aside className="admin-sidebar skeleton" />
        <main className="admin-main" style={{ padding: '2rem' }}>
          <div className="skeleton" style={{ height: '40px', width: '300px', marginBottom: '2rem' }} />
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '160px', borderRadius: '24px' }} />)}
          </div>
          <div className="skeleton" style={{ height: '400px', borderRadius: '24px' }} />
        </main>
      </div>
    );
  }

  /* ==============================================================
     MAIN RENDER
  ============================================================== */
  return (
    <>
      <div className="admin-portal">
        {/* ── Sidebar ── */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="sidebar-header">
            <div className="admin-badge"><Icons.Shield /> Super Admin</div>
            <h3>HealthID</h3>
            <p>Administration Portal</p>
          </div>

          <nav className="sidebar-nav">
            {(() => {
              let lastSection = '';
              return NAV_ITEMS.map((item) => {
                const showLabel = item.section !== lastSection;
                lastSection = item.section;
                return (
                  <React.Fragment key={item.key}>
                    {showLabel && <div className="sidebar-section-label">{item.section}</div>}
                    <button
                      className={`sidebar-nav-item ${activeView === item.key ? 'active' : ''}`}
                      onClick={() => handleNavClick(item.key)}
                    >
                      <span className="nav-icon"><item.icon /></span>
                      {item.label}
                      {counts[item.key] != null && (
                        <span className="nav-count">{counts[item.key]}</span>
                      )}
                    </button>
                  </React.Fragment>
                );
              });
            })()}
          </nav>

          <div className="sidebar-footer">
            <button className="sidebar-logout-btn" onClick={handleLogout}>
              <Icons.Logout /> Logout
            </button>
          </div>
        </aside>

        {/* ── Mobile sidebar backdrop ── */}
        <div
          className={`sidebar-mobile-backdrop ${sidebarOpen ? 'visible' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* ── Main Content ── */}
        <main className="admin-content">
          <AnimatePresence mode="wait">
            {renderView()}
          </AnimatePresence>
        </main>
      </div>

      {/* ── Mobile Sidebar Toggle ── */}
      <button className="mobile-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <Icons.Close /> : <Icons.Menu />}
      </button>

      {/* ── Hospital Detail Modal ── */}
      <AnimatePresence>
        {selectedHospital && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedHospital(null)}
          >
            <motion.div
              className="modal-panel"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xl)' }}>
                <div>
                  <h3 style={{ marginBottom: 4 }}>{selectedHospital.hospitalName}</h3>
                  <span className={`status-badge ${selectedHospital.status}`}>{selectedHospital.status}</span>
                </div>
                <button className="modal-close" onClick={() => setSelectedHospital(null)} style={{ position: 'relative', top: 0, right: 0 }}>✕</button>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <label>Registration Number</label>
                  <p>{selectedHospital.regNumber}</p>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <p>{selectedHospital.email}</p>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <p>{selectedHospital.phone || '—'}</p>
                </div>
                <div className="detail-item">
                  <label>Registered On</label>
                  <p>{formatDate(selectedHospital.createdAt)}</p>
                </div>
                <div className="detail-item full-width">
                  <label>Address</label>
                  <p>{selectedHospital.address || '—'}</p>
                </div>
                {selectedHospital.licencePdf && (
                  <div className="detail-item full-width">
                    <label>Licence Document</label>
                    <p>
                      <a href={`${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '')}${selectedHospital.licencePdf}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>
                        View Document ↗
                      </a>
                    </p>
                  </div>
                )}
              </div>

              {selectedHospital.status === 'pending' && (
                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
                  <button className="action-btn approve" style={{ padding: '10px 24px', fontSize: '13px' }} onClick={() => { handleHospitalAction(selectedHospital._id, 'approve'); }}>
                    <Icons.Check /> Approve Hospital
                  </button>
                  <button className="action-btn reject" style={{ padding: '10px 24px', fontSize: '13px' }} onClick={() => { handleHospitalAction(selectedHospital._id, 'reject'); }}>
                    <Icons.X /> Reject Hospital
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confirm Action Dialog ── */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmAction(null)}
          >
            <motion.div
              className="confirm-dialog"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h4>
                {confirmAction.action === 'approve' && '✅ Approve Hospital'}
                {confirmAction.action === 'reject' && '❌ Reject Hospital'}
                {confirmAction.action === 'delete' && '🗑️ Delete Hospital'}
              </h4>
              <p>
                Are you sure you want to {confirmAction.action} <strong>{confirmAction.name}</strong>?
                {confirmAction.action === 'delete' && ' This action cannot be undone.'}
              </p>
              <div className="confirm-dialog-actions">
                <button className="secondary-btn" style={{ padding: '10px 24px', fontSize: '14px' }} onClick={() => setConfirmAction(null)}>Cancel</button>
                <button
                  className={`action-btn ${confirmAction.action === 'delete' ? 'reject' : confirmAction.action}`}
                  style={{ padding: '10px 24px', fontSize: '14px' }}
                  onClick={() => handleHospitalAction(confirmAction.id, confirmAction.action)}
                >
                  {confirmAction.action === 'approve' && 'Approve'}
                  {confirmAction.action === 'reject' && 'Reject'}
                  {confirmAction.action === 'delete' && 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminDashboard;
