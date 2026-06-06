import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import {
  Lock,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Award
} from 'lucide-react';

const Dashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch modules
        const modulesRes = await fetch(`${API_URL}/modules`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (modulesRes.ok) {
          const modulesData = await modulesRes.json();
          setModules(modulesData);
        }

        // Fetch progress stats
        const statsRes = await fetch(`${API_URL}/profile/progress`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

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
          <p className="loading-text">Loading Dashboard...</p>
        </div>
      </>
    );
  }

  // Filter Track 1 (Foundations) modules
  const track1Modules = modules.filter(m => m.track === 1);

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

        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          animation: fadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .upgrade-banner {
          background: linear-gradient(135deg, rgba(245, 166, 35, 0.15), rgba(245, 166, 35, 0.05));
          border: 1px solid rgba(245, 166, 35, 0.4);
          border-radius: 16px;
          padding: 1.25rem 1.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
          animation: slideDown 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .demo-badge {
          background: linear-gradient(135deg, #F5A623, #FFD166);
          color: #04040C;
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }
        
        .upgrade-btn {
          background: linear-gradient(135deg, #F5A623, #FFD166);
          border: none;
          border-radius: 10px;
          padding: 0.6rem 1.25rem;
          color: #04040C;
          font-family: 'Outfit', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 4px 15px rgba(245, 166, 35, 0.3);
        }
        
        .upgrade-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 166, 35, 0.4);
        }
        
        .welcome-header {
          margin-bottom: 2.5rem;
        }
        
        .welcome-title {
          font-family: 'Outfit', sans-serif;
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #F0EFF8, #9D7DFF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .welcome-subtitle {
          font-size: 1rem;
          color: #8B8AA8;
          line-height: 1.6;
        }
        
        .grid-2 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
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
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        
        .card-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
        }
        
        .category-badge {
          background: rgba(123, 92, 245, 0.15);
          border: 1px solid rgba(123, 92, 245, 0.3);
          color: #9D7DFF;
          padding: 0.35rem 0.85rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .idea-box {
          background: rgba(0, 0, 0, 0.3);
          padding: 1.25rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          flex: 1;
        }
        
        .idea-text {
          font-style: italic;
          font-size: 0.95rem;
          color: #F0EFF8;
          line-height: 1.6;
        }
        
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .region-text {
          font-size: 0.85rem;
          color: #8B8AA8;
        }
        
        .region-text strong {
          color: #F0EFF8;
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
          text-decoration: none;
          transition: all 0.3s;
        }
        
        .btn-outline:hover {
          background: rgba(123, 92, 245, 0.1);
          border-color: #7B5CF5;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        
        .stat-box {
          background: rgba(123, 92, 245, 0.08);
          padding: 1.25rem;
          border-radius: 12px;
          text-align: center;
          border: 1px solid rgba(123, 92, 245, 0.15);
        }
        
        .stat-value {
          font-family: 'Outfit', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #7B5CF5;
          margin-bottom: 0.25rem;
        }
        
        .stat-label {
          font-size: 0.8rem;
          color: #8B8AA8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .progress-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        
        .progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #F0EFF8;
        }
        
        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #7B5CF5, #9D7DFF);
          border-radius: 4px;
          transition: width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #7B5CF5, #5B3CC5);
          border: none;
          border-radius: 10px;
          padding: 0.6rem 1.25rem;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 4px 15px rgba(123, 92, 245, 0.3);
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(123, 92, 245, 0.4);
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .section-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        
        .section-subtitle {
          font-size: 0.9rem;
          color: #8B8AA8;
        }
        
        .see-all-link {
          color: #7B5CF5;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          transition: color 0.2s;
        }
        
        .see-all-link:hover {
          color: #9D7DFF;
        }
        
        .modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .module-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
        }
        
        .module-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(123, 92, 245, 0.1);
        }
        
        .module-card.completed {
          border-color: rgba(6, 214, 160, 0.4);
        }
        
        .module-card.unlocked {
          border-color: rgba(123, 92, 245, 0.3);
        }
        
        .module-card.locked {
          opacity: 0.75;
        }
        
        .module-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .module-number {
          font-size: 0.75rem;
          color: #8B8AA8;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.3rem 0.75rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .status-badge.completed {
          background: rgba(6, 214, 160, 0.15);
          border: 1px solid rgba(6, 214, 160, 0.3);
          color: #06D6A0;
        }
        
        .status-badge.unlocked {
          background: rgba(123, 92, 245, 0.15);
          border: 1px solid rgba(123, 92, 245, 0.3);
          color: #9D7DFF;
        }
        
        .status-badge.locked {
          background: rgba(245, 166, 35, 0.1);
          border: 1px solid rgba(245, 166, 35, 0.2);
          color: #F5A623;
        }
        
        .module-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #F0EFF8;
        }
        
        .module-card.locked .module-title {
          color: #8B8AA8;
        }
        
        .module-desc {
          font-size: 0.85rem;
          color: #8B8AA8;
          line-height: 1.5;
        }
        
        .module-actions {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .module-btn {
          width: 100%;
          padding: 0.6rem;
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s;
        }
        
        .module-btn.primary {
          background: linear-gradient(135deg, #7B5CF5, #5B3CC5);
          border: none;
          color: #fff;
          box-shadow: 0 4px 15px rgba(123, 92, 245, 0.3);
        }
        
        .module-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(123, 92, 245, 0.4);
        }
        
        .module-btn.secondary {
          background: linear-gradient(135deg, #F5A623, #FFD166);
          border: none;
          color: #04040C;
          box-shadow: 0 4px 15px rgba(245, 166, 35, 0.3);
        }
        
        .module-btn.secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 166, 35, 0.4);
        }
        
        @media (max-width: 768px) {
          .dashboard-container { padding: 1.5rem; }
          .grid-2 { grid-template-columns: 1fr; }
          .welcome-title { font-size: 1.75rem; }
          .modules-grid { grid-template-columns: 1fr; }
          .upgrade-banner { flex-direction: column; align-items: flex-start; }
          .upgrade-btn { width: 100%; justify-content: center; }
        }
      `}</style>
      
      <div className="floating-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>
      
      <div className="dashboard-container">
        {/* Premium Upgrade Banner */}
        {user?.plan !== 'premium' && (
          <div className="upgrade-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="demo-badge">DEMO MODE</span>
              <p style={{ color: '#F0EFF8', fontWeight: 500, margin: 0 }}>
                Module 1 is unlocked. Upgrade to access all 30 modules across 5 tracks.
              </p>
            </div>
            <Link to="/subscription" className="upgrade-btn">
              Upgrade: ₹399/month or ₹2,499/year <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Welcome Header */}
        <div className="welcome-header">
          <h1 className="welcome-title">Welcome back, {user?.name}!</h1>
          <p className="welcome-subtitle">Build, test, and prepare your startup pitch for launch.</p>
        </div>

        {/* Grid: Startup Idea & Stats */}
        <div className="grid-2">
          {/* Startup Idea Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">My Startup Brief</h3>
              <span className="category-badge">{user?.category}</span>
            </div>
            <div className="idea-box">
              <p className="idea-text">
                "{user?.startupIdea || 'No startup idea described yet.'}"
              </p>
            </div>
            <div className="card-footer">
              <span className="region-text">Region: <strong>{user?.region}</strong></span>
              <Link to="/profile" className="btn-outline">
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Learning Progress Summary */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '1.25rem' }}>Learning Progress</h3>
            
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-value">{stats?.completedCount || 0}/30</div>
                <span className="stat-label">Modules Completed</span>
              </div>
              
              <div className="stat-box">
                <div className="stat-value">{stats?.timeOnPlatform || '0m'}</div>
                <span className="stat-label">Time on Platform</span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span>Curriculum Completion</span>
                <span style={{ fontWeight: 600 }}>{Math.round(((stats?.completedCount || 0) / 30) * 100)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${((stats?.completedCount || 0) / 30) * 100}%` }} />
              </div>
            </div>
            
            <div className="card-footer">
              <span style={{ fontSize: '0.85rem', color: '#8B8AA8' }}>Active Module: <strong style={{ color: '#F0EFF8' }}>Module {stats?.currentModule || 1}</strong></span>
              <Link to="/modules" className="btn-primary">
                Resume Learning
              </Link>
            </div>
          </div>
        </div>

        {/* Curriculum Track 1: Foundations Grid */}
        <div>
          <div className="section-header">
            <div>
              <h2 className="section-title">Track 1: Foundations</h2>
              <p className="section-subtitle">Master customer validation and value propositions.</p>
            </div>
            <Link to="/modules" className="see-all-link">
              See All Tracks <ArrowRight size={16} />
            </Link>
          </div>

          <div className="modules-grid">
            {track1Modules.map((mod) => {
              const isCompleted = mod.status === 'completed';
              const isUnlocked = mod.status === 'unlocked' || isCompleted;

              return (
                <div
                  key={mod.moduleId}
                  className={`module-card ${isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked'}`}
                >
                  {/* Module status header */}
                  <div className="module-header">
                    <span className="module-number">MODULE {mod.moduleId}</span>
                    <div>
                      {isCompleted ? (
                        <span className="status-badge completed">
                          <CheckCircle2 size={12} /> Complete
                        </span>
                      ) : isUnlocked ? (
                        <span className="status-badge unlocked">
                          Unlocked
                        </span>
                      ) : (
                        <span className="status-badge locked">
                          <Lock size={12} /> Locked
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="module-title">{mod.title}</h3>
                    <p className="module-desc">
                      {isUnlocked
                        ? `Focus on defining and mapping key concepts for ${mod.title}.`
                        : 'Unlock by completing previous modules or upgrading to premium.'}
                    </p>
                  </div>

                  {/* Bottom action button */}
                  <div className="module-actions">
                    {isUnlocked ? (
                      <Link to={`/modules/${mod.moduleId}`} className="module-btn primary">
                        {isCompleted ? 'Review Content' : 'Start Module'}
                      </Link>
                    ) : (
                      <Link to="/subscription" className="module-btn secondary">
                        Upgrade to Unlock <Sparkles size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
