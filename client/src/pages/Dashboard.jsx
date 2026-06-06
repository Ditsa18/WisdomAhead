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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  // Filter Track 1 (Foundations) modules
  const track1Modules = modules.filter(m => m.track === 1);

  return (
    <div className="page-shell">
      
      {/* Premium Upgrade Banner */}
      {user?.plan !== 'premium' && (
        <div style={{
          backgroundColor: 'rgba(245, 166, 35, 0.15)',
          border: '1px solid rgba(245, 166, 35, 0.4)',
          borderRadius: 'var(--border-radius)',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              backgroundColor: 'var(--accent-secondary)',
              color: 'var(--bg-deep)',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontWeight: 800,
              fontSize: '0.75rem'
            }}>DEMO MODE</span>
            <p style={{ color: '#FFFFFF', fontWeight: 500 }}>
              Module 1 is unlocked. Upgrade to access all 30 modules across 5 tracks.
            </p>
          </div>
          <Link to="/subscription" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            Upgrade: ₹399/month or ₹2,499/year <ArrowRight size={14} style={{ marginLeft: '0.25rem' }} />
          </Link>
        </div>
      )}

      {/* Welcome Header */}
      <div className="page-header">
        <div>
          <h1 className="section-title">Welcome back, {user?.name}!</h1>
          <p className="section-copy">Build, test, and prepare your startup pitch for launch.</p>
        </div>
      </div>

      {/* Grid: Startup Idea & Stats */}
<div className="content-grid columns-2">
        
        {/* Startup Idea Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>My Startup Brief</h3>
            <span className="badge badge-purple">{user?.category}</span>
          </div>
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.2)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            flex: 1
          }}>
            <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              "{user?.startupIdea || 'No startup idea described yet.'}"
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Region: <strong>{user?.region}</strong></span>
            <Link to="/profile" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Learning Progress Summary */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Learning Progress</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(22, 33, 62, 0.4)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {stats?.completedCount || 0}/30
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Modules Completed</span>
            </div>
            
            <div style={{ backgroundColor: 'rgba(22, 33, 62, 0.4)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                {stats?.timeOnPlatform || '0m'}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Time on Platform</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>Curriculum Completion</span>
              <span style={{ fontWeight: 600 }}>{Math.round(((stats?.completedCount || 0) / 30) * 100)}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-deep)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${((stats?.completedCount || 0) / 30) * 100}%`,
                height: '100%',
                backgroundColor: 'var(--accent-primary)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
            <span style={{ fontSize: '0.85rem' }}>Active Module: <strong>Module {stats?.currentModule || 1}</strong></span>
            <Link to="/modules" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              Resume Learning
            </Link>
          </div>
        </div>

      </div>

      {/* Curriculum Track 1: Foundations Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Track 1: Foundations</h2>
            <p>Master customer validation and value propositions.</p>
          </div>
          <Link to="/modules" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            See All Tracks <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {track1Modules.map((mod) => {
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
                  border: isCompleted ? '1px solid rgba(76, 175, 80, 0.4)' : isUnlocked ? '1px solid rgba(108, 99, 255, 0.3)' : '1px solid var(--border-subtle)',
                  opacity: isUnlocked ? 1 : 0.75,
                  position: 'relative'
                }}
              >
                {/* Module status header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    MODULE {mod.moduleId}
                  </span>
                  <div>
                    {isCompleted ? (
                      <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle2 size={12} /> Complete
                      </span>
                    ) : isUnlocked ? (
                      <span className="badge badge-purple">
                        Unlocked
                      </span>
                    ) : (
                      <span className="badge" style={{ backgroundColor: 'var(--locked)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid rgba(245,166,35,0.2)' }}>
                        <Lock size={12} /> Locked
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: isUnlocked ? '#FFFFFF' : 'var(--text-secondary)' }}>
                    {mod.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem' }}>
                    {isUnlocked
                      ? `Focus on defining and mapping key concepts for ${mod.title}.`
                      : 'Unlock by completing previous modules or upgrading to premium.'}
                  </p>
                </div>

                {/* Bottom action button */}
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                  {isUnlocked ? (
                    <Link to={`/modules/${mod.moduleId}`} className="btn btn-primary" style={{ width: '100%', padding: '0.5rem' }}>
                      {isCompleted ? 'Review Content' : 'Start Module'}
                    </Link>
                  ) : (
                    <Link to="/subscription" className="btn btn-secondary" style={{ width: '100%', padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
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
  );
};

export default Dashboard;
