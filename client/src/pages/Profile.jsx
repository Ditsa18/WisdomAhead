import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { User, Sparkles, Target, Compass, Award, Calendar, Save } from 'lucide-react';

const Profile = () => {
  const { user, token, updateStartupProfile } = useAuth();
  
  const [startupIdea, setStartupIdea] = useState(user?.startupIdea || '');
  const [category, setCategory] = useState(user?.category || '');
  const [modules, setModules] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await updateStartupProfile(startupIdea, category);
      setSuccessMsg('Startup profile updated successfully!');
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <p>Loading Profile...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>My Profile</h1>
        <p>Manage your account settings, startup details, and review your progress metrics.</p>
      </div>

      {/* Success/Error Alerts */}
      {successMsg && (
        <div style={{ backgroundColor: 'rgba(76, 175, 80, 0.15)', border: '1px solid rgba(76, 175, 80, 0.4)', borderRadius: '8px', padding: '1rem', color: 'var(--success)', fontSize: '0.9rem' }}>
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div style={{ backgroundColor: 'rgba(255, 107, 107, 0.15)', border: '1px solid rgba(255, 107, 107, 0.4)', borderRadius: '8px', padding: '1rem', color: '#FF6B6B', fontSize: '0.9rem' }}>
          {errorMsg}
        </div>
      )}

      {/* User Header Details */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{
          backgroundColor: 'var(--accent-primary)',
          color: '#FFFFFF',
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '2rem'
        }}>
          {user?.name.charAt(0).toUpperCase()}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{user?.name}</h2>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{user?.email}</span>
            <span style={{ width: '4px', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '50%' }} />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Region: <strong>{user?.region}</strong></span>
          </div>
          <div>
            {user?.plan === 'premium' ? (
              <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Sparkles size={12} /> Premium Membership
              </span>
            ) : (
              <span className="badge badge-purple">
                Free Account
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Dashboard */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem'
      }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ color: 'var(--accent-primary)' }}><Award size={28} /></div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Modules Completed</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{stats?.completedCount || 0}/30</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ color: 'var(--accent-secondary)' }}><Compass size={28} /></div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Module</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>Module {stats?.currentModule || 1}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ color: 'var(--success)' }}><Calendar size={28} /></div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Time on Platform</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{stats?.timeOnPlatform || '0m'}</div>
          </div>
        </div>
      </div>

      {/* Edit Startup Profile */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
          <Target size={20} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Startup Profile</h3>
        </div>
        
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label htmlFor="profile-category">Business Category</label>
            <select
              id="profile-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%' }}
              required
            >
              <option value="" disabled>Select business category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="profile-idea">Startup Concept / Pitch Brief</label>
            <textarea
              id="profile-idea"
              value={startupIdea}
              onChange={(e) => setStartupIdea(e.target.value)}
              style={{ height: '140px', resize: 'vertical', lineHeight: 1.5 }}
              placeholder="Describe your startup idea..."
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              disabled={updating}
            >
              <Save size={16} /> {updating ? 'Saving changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Completed Deliverables List */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
          Completed Deliverables
        </h3>
        
        {completedModules.length === 0 ? (
          <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            No deliverables completed yet. Go to Modules to start validation.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {completedModules.map((mod) => (
              <Link
                key={mod.moduleId}
                to={`/modules/${mod.moduleId}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-deep)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'border-color 0.15s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <span>Module {mod.moduleId}: {mod.title}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>Review →</span>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;
