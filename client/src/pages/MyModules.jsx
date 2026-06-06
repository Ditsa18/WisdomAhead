import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { Lock, CheckCircle2, ChevronRight, Sparkles, BookOpen } from 'lucide-react';

const MyModules = () => {
  const { user, token } = useAuth();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch(`${API_URL}/modules`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setModules(data);
        }
      } catch (err) {
        console.error('Error fetching modules list:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchModules();
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
          <p className="loading-text">Loading curriculum modules...</p>
        </div>
      </>
    );
  }

  // Define tracks
  const tracks = [
    { trackNum: 1, name: "Foundations", desc: "Validate customer discovery and problem-solution fit." },
    { trackNum: 2, name: "Finance", desc: "Build unit economics and multi-year projection sheets." },
    { trackNum: 3, name: "Operations", desc: "Structure legal setup, MVP roadmap, and KPIs." },
    { trackNum: 4, name: "Marketing", desc: "Acquisition channels, brand, and social media growth." },
    { trackNum: 5, name: "Fundraising", desc: "Pitch decks, safe term sheets, and closing rounds." }
  ];

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

        .modules-container {
          max-width: 1400px;
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
        
        .track-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        
        .track-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .track-info h2 {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        
        .track-info p {
          font-size: 0.9rem;
          color: #8B8AA8;
        }
        
        .upgrade-badge {
          background: linear-gradient(135deg, #F5A623, #FFD166);
          color: #04040C;
          padding: 0.35rem 0.85rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
          opacity: 0.65;
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
        
        .module-badges {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        
        .price-badge {
          background: rgba(245, 166, 35, 0.1);
          border: 1px solid rgba(245, 166, 35, 0.3);
          color: #F5A623;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
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
          color: #F0EFF8;
          margin: 0;
        }
        
        .module-card.locked .module-title {
          color: #8B8AA8;
        }
        
        .module-desc {
          font-size: 0.85rem;
          color: #8B8AA8;
          line-height: 1.5;
          margin: 0;
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
          background: transparent;
          border: 1px solid rgba(123, 92, 245, 0.4);
          color: #9D7DFF;
        }
        
        .module-btn.primary:hover {
          background: rgba(123, 92, 245, 0.1);
          border-color: #7B5CF5;
        }
        
        .module-btn.primary.completed {
          border-color: rgba(6, 214, 160, 0.4);
          color: #06D6A0;
          background: rgba(6, 214, 160, 0.02);
        }
        
        .module-btn.primary.completed:hover {
          background: rgba(6, 214, 160, 0.1);
        }
        
        .module-btn.locked {
          background: rgba(245, 166, 35, 0.1);
          border: 1px solid rgba(245, 166, 35, 0.2);
          color: #F5A623;
        }
        
        .module-btn.locked:hover {
          background: rgba(245, 166, 35, 0.15);
          border-color: rgba(245, 166, 35, 0.3);
        }
        
        @media (max-width: 768px) {
          .modules-container { padding: 1.5rem; }
          .modules-grid { grid-template-columns: 1fr; }
          .page-title { font-size: 1.75rem; }
          .track-header { flex-direction: column; }
        }
      `}</style>
      
      <div className="floating-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>
      
      <div className="modules-container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Startup Curriculum</h1>
          <p className="page-subtitle">Complete all 30 modules to construct a venture-grade investor startup brief.</p>
        </div>

        {/* Tracks Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {tracks.map((track) => {
            const trackModules = modules.filter(m => m.track === track.trackNum);
            
            // Check if the entire track is locked (e.g. Track 2-5 for free plan)
            const isTrackLocked = user?.plan !== 'premium' && track.trackNum > 1;

            return (
              <div key={track.trackNum} className="track-section">
                
                {/* Track Header */}
                <div className="track-header">
                  <div className="track-info">
                    <h2>Track {track.trackNum}: {track.name}</h2>
                    <p>{track.desc}</p>
                  </div>
                  
                  {isTrackLocked && (
                    <span className="upgrade-badge">
                      <Sparkles size={12} /> Upgrade to Unlock Track
                    </span>
                  )}
                </div>

                {/* Module Cards Grid */}
                <div className="modules-grid">
                  {trackModules.map((mod) => {
                    const isCompleted = mod.status === 'completed';
                    const isUnlocked = mod.status === 'unlocked' || isCompleted;

                    return (
                      <div
                        key={mod.moduleId}
                        className={`module-card ${isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked'}`}
                      >
                        {/* Module card header */}
                        <div className="module-header">
                          <span className="module-number">MODULE {mod.moduleId}</span>
                          <div className="module-badges">
                            {mod.price > 0 && (
                              <span className="price-badge">
                                ₹{mod.price}
                              </span>
                            )}
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
                        <h3 className="module-title">{mod.title}</h3>

                        {/* Description */}
                        {mod.description && (
                          <p className="module-desc">
                            {mod.description}
                          </p>
                        )}

                        {/* Action trigger */}
                        <div className="module-actions">
                          {isUnlocked ? (
                            <Link 
                              to={`/modules/${mod.moduleId}`} 
                              className={`module-btn primary ${isCompleted ? 'completed' : ''}`}
                            >
                              {isCompleted ? 'Review Module' : 'Resume'} <ChevronRight size={16} />
                            </Link>
                          ) : (
                            <Link 
                              to="/subscription" 
                              className="module-btn locked"
                            >
                              <Lock size={12} /> Upgrade to Unlock
                            </Link>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MyModules;
