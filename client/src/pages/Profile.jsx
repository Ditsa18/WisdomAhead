import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { User, Sparkles, Target, Compass, Award, Calendar, Save } from 'lucide-react';

const Profile = () => {
  const { user, token, updateStartupProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [startupIdea, setStartupIdea] = useState(user?.startupIdea || '');
  const [category, setCategory] = useState(user?.category || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [profileImagePreview, setProfileImagePreview] = useState(user?.profileImage || '');
  const [modules, setModules] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  const categories = [
    'Tech Startup',
    'E-Commerce',
    'Fintech',
    'Healthtech',
    'Edtech',
    'Food & Bev',
    'Social Impact',
    'Manufacturing',
    'Services',
    'Other'
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setStartupIdea(user.startupIdea || '');
      setCategory(user.category || '');
      setProfileImage(user.profileImage || '');
      setProfileImagePreview(user.profileImage || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const modulesRes = await fetch(`${API_URL}/modules`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (modulesRes.ok) {
          const mData = await modulesRes.json();
          setModules(mData);
        }

        const statsRes = await fetch(`${API_URL}/profile/progress`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (statsRes.ok) {
          const sData = await statsRes.json();
          setStats(sData);
        }
      } catch (err) {
        console.error('Error loading profile page data:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchProfileData();
    }
  }, [token]);

  const handleSelectedImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      setProfileImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await updateStartupProfile(startupIdea, category, profileImage);
      setSuccessMsg('Profile updated successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const completedModules = modules.filter(m => m.status === 'completed');

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
          body { font-family: 'Plus Jakarta Sans', sans-serif; background: #04040C; color: #F0EFF8; }
          .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80vh; gap: 1rem; }
          .loading-spinner { width: 48px; height: 48px; border: 3px solid rgba(123, 92, 245, 0.2); border-top-color: #7B5CF5; border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
          .loading-text { color: #8B8AA8; font-size: 0.95rem; }
        `}</style>
        <div className="loading-container">
          <div className="loading-spinner" />
          <p className="loading-text">Loading Profile...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #04040C; color: #F0EFF8; min-height: 100vh; }
        
        .floating-particles {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(123, 92, 245, 0.3);
          border-radius: 50%;
          animation: floatParticle 15s infinite linear;
        }

        .particle:nth-child(1) { left: 10%; top: 20%; animation-delay: 0s; animation-duration: 18s; }
        .particle:nth-child(2) { left: 20%; top: 60%; animation-delay: 2s; animation-duration: 20s; }
        .particle:nth-child(3) { left: 30%; top: 40%; animation-delay: 4s; animation-duration: 22s; }
        .particle:nth-child(4) { left: 40%; top: 80%; animation-delay: 6s; animation-duration: 16s; }
        .particle:nth-child(5) { left: 50%; top: 10%; animation-delay: 8s; animation-duration: 24s; }
        .particle:nth-child(6) { left: 60%; top: 70%; animation-delay: 10s; animation-duration: 19s; }
        .particle:nth-child(7) { left: 70%; top: 30%; animation-delay: 12s; animation-duration: 21s; }
        .particle:nth-child(8) { left: 80%; top: 50%; animation-delay: 14s; animation-duration: 17s; }
        .particle:nth-child(9) { left: 90%; top: 90%; animation-delay: 16s; animation-duration: 23s; }
        .particle:nth-child(10) { left: 15%; top: 85%; animation-delay: 18s; animation-duration: 25s; }
        .particle:nth-child(11) { left: 25%; top: 15%; animation-delay: 20s; animation-duration: 20s; background: rgba(245, 166, 35, 0.2); }
        .particle:nth-child(12) { left: 35%; top: 55%; animation-delay: 22s; animation-duration: 18s; background: rgba(245, 166, 35, 0.2); }
        .particle:nth-child(13) { left: 45%; top: 25%; animation-delay: 24s; animation-duration: 22s; background: rgba(245, 166, 35, 0.2); }
        .particle:nth-child(14) { left: 55%; top: 75%; animation-delay: 26s; animation-duration: 19s; background: rgba(245, 166, 35, 0.2); }
        .particle:nth-child(15) { left: 65%; top: 45%; animation-delay: 28s; animation-duration: 21s; background: rgba(245, 166, 35, 0.2); }

        @keyframes floatParticle {
          0% {
            transform: translateY(100vh) translateX(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(80vh) translateX(20px) scale(1);
          }
          90% {
            opacity: 1;
            transform: translateY(10vh) translateX(-20px) scale(1);
          }
          100% {
            transform: translateY(-10vh) translateX(0) scale(0);
            opacity: 0;
          }
        }

        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          animation: fadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .page-header { margin-bottom: 2.5rem; }
        
        .page-title {
          font-family: 'Outfit', sans-serif;
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #F0EFF8, #9D7DFF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .page-subtitle {
          font-size: 1rem;
          color: #8B8AA8;
          line-height: 1.6;
        }
        
        .alert {
          padding: 1rem 1.25rem;
          border-radius: 12px;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          animation: slideDown 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .alert-success {
          background: rgba(6, 214, 160, 0.1);
          border: 1px solid rgba(6, 214, 160, 0.3);
          color: #06D6A0;
        }
        
        .alert-error {
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.3);
          color: #FF6B6B;
        }
        
        .card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 1.75rem;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .card:hover {
          border-color: rgba(123, 92, 245, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(123, 92, 245, 0.1);
        }
        
        .user-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }
        
        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          background: linear-gradient(135deg, #7B5CF5, #5B3CC5);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 30px rgba(123, 92, 245, 0.4);
        }
        
        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .profile-avatar span {
          font-family: 'Outfit', sans-serif;
          font-size: 1.75rem;
          font-weight: 800;
          color: #fff;
        }
        
        .user-info { flex: 1; min-width: 0; }
        
        .user-name {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .user-meta {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-wrap: wrap;
          font-size: 0.9rem;
          color: #8B8AA8;
          margin-bottom: 0.75rem;
        }
        
        .user-meta strong { color: #F0EFF8; }
        
        .user-meta-dot {
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }
        
        .user-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          align-items: center;
        }
        
        .badge {
          padding: 0.35rem 0.85rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .badge-premium {
          background: linear-gradient(135deg, #F5A623, #FFD166);
          color: #04040C;
        }
        
        .badge-free {
          background: rgba(123, 92, 245, 0.15);
          border: 1px solid rgba(123, 92, 245, 0.3);
          color: #9D7DFF;
        }
        
        .btn-outline {
          background: transparent;
          border: 1px solid rgba(123, 92, 245, 0.4);
          border-radius: 10px;
          padding: 0.5rem 1rem;
          color: #9D7DFF;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .btn-outline:hover {
          background: rgba(123, 92, 245, 0.1);
          border-color: #7B5CF5;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .stat-icon.violet { background: rgba(123, 92, 245, 0.15); color: #7B5CF5; }
        .stat-icon.gold { background: rgba(245, 166, 35, 0.15); color: #F5A623; }
        .stat-icon.emerald { background: rgba(6, 214, 160, 0.15); color: #06D6A0; }
        
        .stat-info { flex: 1; }
        
        .stat-label {
          font-size: 0.75rem;
          color: #8B8AA8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }
        
        .stat-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .section-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
        }
        
        .form-group { margin-bottom: 1.5rem; }
        
        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #F0EFF8;
          margin-bottom: 0.5rem;
        }
        
        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 0.875rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #F0EFF8;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.95rem;
          transition: all 0.3s;
        }
        
        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #5A5872;
        }
        
        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #7B5CF5;
          background: rgba(123, 92, 245, 0.08);
          box-shadow: 0 0 0 4px rgba(123, 92, 245, 0.1);
        }
        
        .form-select option {
          background: #04040C;
          color: #F0EFF8;
        }
        
        .form-textarea {
          min-height: 140px;
          resize: vertical;
          line-height: 1.6;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #7B5CF5, #5B3CC5);
          border: none;
          border-radius: 10px;
          padding: 0.75rem 1.5rem;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(123, 92, 245, 0.3);
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(123, 92, 245, 0.4);
        }
        
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .deliverables-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .deliverable-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          color: #F0EFF8;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s;
        }
        
        .deliverable-item:hover {
          border-color: rgba(123, 92, 245, 0.4);
          background: rgba(123, 92, 245, 0.05);
          transform: translateX(4px);
        }
        
        .deliverable-item span:last-child {
          color: #7B5CF5;
          font-size: 0.85rem;
        }
        
        .empty-state {
          font-style: italic;
          font-size: 0.9rem;
          color: #8B8AA8;
          padding: 1.5rem;
          text-align: center;
        }
        
        @media (max-width: 768px) {
          .profile-container { padding: 1.5rem; }
          .user-header { flex-direction: column; text-align: center; }
          .user-meta { justify-content: center; }
          .user-actions { justify-content: center; }
          .stats-grid { grid-template-columns: 1fr; }
          .page-title { font-size: 1.75rem; }
        }
      `}</style>
      
      <div className="floating-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>
      
      <div className="profile-container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your account settings, startup details, and review your progress metrics.</p>
        </div>

        {/* Success/Error Alerts */}
        {successMsg && (
          <div className="alert alert-success">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="alert alert-error">
            {errorMsg}
          </div>
        )}

        {/* User Header Details */}
        <div className="card user-header">
          <div className="profile-avatar">
            {profileImagePreview ? (
              <img src={profileImagePreview} alt="Profile" />
            ) : (
              <span>{user?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div className="user-info">
            <h2 className="user-name">{user?.name}</h2>
            <div className="user-meta">
              <span>{user?.email}</span>
              <span className="user-meta-dot" />
              <span>Region: <strong>{user?.region}</strong></span>
            </div>
            <div className="user-actions">
              {user?.plan === 'premium' ? (
                <span className="badge badge-premium">
                  <Sparkles size={12} /> Premium Membership
                </span>
              ) : (
                <span className="badge badge-free">
                  Free Account
                </span>
              )}
              <button type="button" className="btn-outline" onClick={openFilePicker}>
                Change photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleSelectedImage}
              />
            </div>
          </div>
        </div>

        {/* Progress Dashboard */}
        <div className="stats-grid">
          <div className="card stat-card">
            <div className="stat-icon violet">
              <Award size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-label">Modules Completed</div>
              <div className="stat-value">{stats?.completedCount || 0}/30</div>
            </div>
          </div>

          <div className="card stat-card">
            <div className="stat-icon gold">
              <Compass size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-label">Active Module</div>
              <div className="stat-value">Module {stats?.currentModule || 1}</div>
            </div>
          </div>

          <div className="card stat-card">
            <div className="stat-icon emerald">
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-label">Time on Platform</div>
              <div className="stat-value">{stats?.timeOnPlatform || '0m'}</div>
            </div>
          </div>
        </div>

        {/* Edit Startup Profile */}
        <div className="card" style={{ marginBottom: '2.5rem' }}>
          <div className="section-header">
            <Target size={20} style={{ color: '#7B5CF5' }} />
            <h3 className="section-title">Startup Profile</h3>
          </div>
          
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label htmlFor="profile-category" className="form-label">Business Category</label>
              <select
                id="profile-category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>Select business category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="profile-idea" className="form-label">Startup Concept / Pitch Brief</label>
              <textarea
                id="profile-idea"
                className="form-textarea"
                value={startupIdea}
                onChange={(e) => setStartupIdea(e.target.value)}
                placeholder="Describe your startup idea..."
                required
              />
            </div>

            <div>
              <button type="submit" className="btn-primary" disabled={updating}>
                <Save size={16} /> {updating ? 'Saving changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Completed Deliverables List */}
        <div className="card">
          <div className="section-header">
            <Award size={20} style={{ color: '#06D6A0' }} />
            <h3 className="section-title">Completed Deliverables</h3>
          </div>
          
          {completedModules.length === 0 ? (
            <p className="empty-state">
              No deliverables completed yet. Go to Modules to start validation.
            </p>
          ) : (
            <div className="deliverables-list">
              {completedModules.map((mod) => (
                <Link
                  key={mod.moduleId}
                  to={`/modules/${mod.moduleId}`}
                  className="deliverable-item"
                >
                  <span>Module {mod.moduleId}: {mod.title}</span>
                  <span>Review →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
