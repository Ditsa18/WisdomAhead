import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { Lock, CheckCircle2, ChevronRight, Sparkles, BookOpen } from 'lucide-react';

const MyModules = () => {
  const { user, token } = useAuth();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <p>Loading curriculum modules...</p>
      </div>
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
    <div className="page-shell">
      
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="section-title">Startup Curriculum</h1>
          <p className="section-copy">Complete all 30 modules to construct a venture-grade investor startup brief.</p>
        </div>
      </div>

      {/* Tracks Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {tracks.map((track) => {
          const trackModules = modules.filter(m => m.track === track.trackNum);
          
          // Check if the entire track is locked (e.g. Track 2-5 for free plan)
          const isTrackLocked = user?.plan !== 'premium' && track.trackNum > 1;

          return (
            <div key={track.trackNum} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              
              {/* Track Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '0.75rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Track {track.trackNum}: {track.name}
                  </h2>
                  <p style={{ fontSize: '0.9rem' }}>{track.desc}</p>
                </div>
                
                {isTrackLocked && (
                  <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Sparkles size={12} /> Upgrade to Unlock Track
                  </span>
                )}
              </div>

              {/* Module Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem'
              }}>
                {trackModules.map((mod) => {
                  const isCompleted = mod.status === 'completed';
                  const isUnlocked = mod.status === 'unlocked' || isCompleted;

                  return (
                    <div
                      key={mod.moduleId}
                      className="card"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        border: isCompleted 
                          ? '1px solid rgba(76, 175, 80, 0.4)' 
                          : isUnlocked 
                            ? '1px solid rgba(108, 99, 255, 0.3)' 
                            : '1px solid var(--border-subtle)',
                        opacity: isUnlocked ? 1 : 0.65,
                        position: 'relative'
                      }}
                    >
                      {/* Module card header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          MODULE {mod.moduleId}
                        </span>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          {mod.price > 0 && (
                            <span className="badge" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', color: '#FFC107', border: '1px solid rgba(255, 193, 7, 0.3)' }}>
                              ₹{mod.price}
                            </span>
                          )}
                          {isCompleted ? (
                            <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                              <CheckCircle2 size={12} /> Complete
                            </span>
                          ) : isUnlocked ? (
                            <span className="badge badge-purple">
                              Unlocked
                            </span>
                          ) : (
                            <span className="badge" style={{ backgroundColor: 'var(--locked)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.2rem', border: '1px solid rgba(245,166,35,0.1)' }}>
                              <Lock size={12} /> Locked
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: isUnlocked ? '#FFFFFF' : 'var(--text-secondary)', margin: 0 }}>
                        {mod.title}
                      </h3>

                      {/* Description */}
                      {mod.description && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                          {mod.description}
                        </p>
                      )}

                      {/* Action trigger */}
                      <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                        {isUnlocked ? (
                          <Link 
                            to={`/modules/${mod.moduleId}`} 
                            className="btn btn-outline" 
                            style={{ 
                              width: '100%', 
                              padding: '0.5rem',
                              borderColor: isCompleted ? 'rgba(76, 175, 80, 0.3)' : 'rgba(108, 99, 255, 0.3)',
                              backgroundColor: isCompleted ? 'rgba(76, 175, 80, 0.02)' : 'rgba(108, 99, 255, 0.02)'
                            }}
                          >
                            {isCompleted ? 'Review Module' : 'Resume'} <ChevronRight size={16} style={{ marginLeft: '0.25rem' }} />
                          </Link>
                        ) : (
                          <Link 
                            to="/subscription" 
                            className="btn btn-locked" 
                            style={{ 
                              width: '100%', 
                              padding: '0.5rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            <Lock size={12} style={{ color: 'var(--accent-secondary)' }} />
                            Upgrade to Unlock
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
  );
};

export default MyModules;
