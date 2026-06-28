import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { ArrowLeft, CheckCircle, Video, Save, Sparkles, BookOpen } from 'lucide-react';

/*
  MindLaunch — ModuleDetail v2
  Restyled to match LandingPage / Dashboard / Sidebar / MyModules'
  "Sticker Pop" Gen-Z theme: cream base, lavender/coral/mint/peach
  accents, glassmorphism cards, Space Grotesk + Inter + JetBrains Mono.

  - Dark floating-particle background replaced with the same CSS
    gradient-mesh blobs used elsewhere.
  - No custom/magnetic cursor on this page (kept default cursor).
  - All data logic, fetch calls, form handling, and routes unchanged.
*/

const ModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [moduleData, setModuleData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchModuleDetail = async () => {
      try {
        setErrorMsg('');
        const res = await fetch(`${API_URL}/modules/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Failed to fetch module details.');
        }

        const data = await res.json();
        setModuleData(data);

        // Initialize form answers
        const initialAnswers = {};
        data.deliverableSchema.forEach(schema => {
          initialAnswers[schema.fieldKey] = data.deliverableAnswers?.[schema.fieldKey] || '';
        });
        setAnswers(initialAnswers);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchModuleDetail();
    }
  }, [token, id]);

  const handleInputChange = (fieldKey, val) => {
    setAnswers(prev => ({
      ...prev,
      [fieldKey]: val
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch(`${API_URL}/modules/${id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ deliverableAnswers: answers })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save deliverables');
      }

      setSuccessMsg('Deliverables saved and module marked as completed successfully!');

      // Update local status locally
      setModuleData(prev => ({
        ...prev,
        status: 'completed'
      }));

      // Scroll to top to show success alert
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg(err.message || 'Error saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap');
          body { font-family: 'Inter', sans-serif; background: #FEFCF9; color: #1A1625; }
          .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80vh; gap: 1rem; }
          .loading-spinner { width: 48px; height: 48px; border: 3px solid rgba(167, 139, 250, 0.2); border-top-color: #A78BFA; border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
          .loading-text { color: #8B849B; font-size: 0.95rem; font-family: 'JetBrains Mono', monospace; }
          /* Solid opaque layer — guarantees the cream background shows even if a
             parent layout wrapper (e.g. around the sidebar) has its own dark
             background sitting between <body> and this component. */
          .ld-bg { position: fixed; inset: 0; z-index: 0; background: #FEFCF9; pointer-events: none; }
          .loading-container { position: relative; z-index: 1; }
        `}</style>
        <div className="ld-bg" aria-hidden="true" />
        <div className="loading-container">
          <div className="loading-spinner" />
          <p className="loading-text">Loading module curriculum...</p>
        </div>
      </>
    );
  }

  if (errorMsg && !moduleData) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap');
          body { font-family: 'Inter', sans-serif; background: #FEFCF9; color: #1A1625; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
          .error-container { display: flex; flex-direction: column; gap: 1rem; align-items: center; text-align: center; }
          .error-text { color: #FB7185; font-size: 1rem; }
          .btn-primary { background: linear-gradient(135deg, #A78BFA, #FF6B9D); border: none; border-radius: 100px; padding: 0.75rem 1.5rem; color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.3s; box-shadow: 0 4px 16px rgba(167, 139, 250, 0.3); }
          .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(255, 107, 157, 0.4); }
          .er-bg { position: fixed; inset: 0; z-index: 0; background: #FEFCF9; pointer-events: none; }
          .error-container { position: relative; z-index: 1; }
        `}</style>
        <div className="er-bg" aria-hidden="true" />
        <div className="error-container">
          <p className="error-text">{errorMsg}</p>
          <Link to="/modules" className="btn-primary">Back to Curriculum</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { font-family: 'Inter', sans-serif; background: #FEFCF9; color: #1A1625; min-height: 100vh; }

        /* ── Ambient gradient-mesh background (same technique as LandingPage/Dashboard) ── */
        .mesh-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          background: #FEFCF9;
        }

        .mesh-blob {
          position: absolute;
          filter: blur(80px);
          opacity: 0.45;
          animation: blobMorph 22s ease-in-out infinite;
        }

        .blob-1 { width: 560px; height: 560px; background: linear-gradient(135deg, rgba(167,139,250,.35), rgba(255,107,157,.25)); top: -12%; left: -8%; animation-delay: 0s; }
        .blob-2 { width: 480px; height: 480px; background: linear-gradient(135deg, rgba(110,231,183,.28), rgba(125,211,252,.25)); top: 35%; right: -12%; animation-delay: -6s; }
        .blob-3 { width: 420px; height: 420px; background: linear-gradient(135deg, rgba(251,191,36,.25), rgba(251,113,133,.2)); bottom: -8%; left: 25%; animation-delay: -11s; }

        @keyframes blobMorph {
          0%,100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
          25% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
          50% { border-radius: 50% 60% 30% 60%/30% 40% 70% 60%; }
          75% { border-radius: 60% 40% 60% 40%/40% 30% 60% 50%; }
        }

        .module-container {
          position: relative;
          z-index: 2;
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
          animation: fadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #8B849B;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          transition: color 0.2s;
          margin-bottom: 1.5rem;
        }

        .back-link:hover { color: #A78BFA; }

        .module-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(167, 139, 250, 0.15);
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .module-info { flex: 1; }

        .module-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
        }

        .track-badge {
          font-size: 0.85rem;
          color: #7C3AED;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .price-badge {
          font-size: 0.85rem;
          font-weight: 700;
          color: #D97706;
          background: rgba(251, 191, 36, 0.15);
          border: 1px solid rgba(251, 191, 36, 0.28);
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
        }

        .region-badge {
          font-size: 0.85rem;
          font-weight: 600;
          color: #8B849B;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(167, 139, 250, 0.15);
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
        }

        .module-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -1px;
          margin-bottom: 0.5rem;
          color: #1A1625;
        }

        .module-desc {
          font-size: 0.95rem;
          color: #8B849B;
          line-height: 1.6;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .status-badge.completed {
          background: rgba(110, 231, 183, 0.15);
          border: 1px solid rgba(110, 231, 183, 0.32);
          color: #059669;
        }

        .status-badge.in-progress {
          background: rgba(167, 139, 250, 0.12);
          border: 1px solid rgba(167, 139, 250, 0.3);
          color: #7C3AED;
        }

        .alert {
          position: relative;
          z-index: 2;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          animation: slideDown 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .alert-success {
          background: rgba(110, 231, 183, 0.12);
          border: 1px solid rgba(110, 231, 183, 0.3);
          color: #059669;
        }

        .alert-error {
          background: rgba(251, 113, 133, 0.1);
          border: 1px solid rgba(251, 113, 133, 0.3);
          color: #E11D48;
        }

        .card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 24px rgba(167, 139, 250, 0.1);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          z-index: 2;
        }

        .card:hover {
          border-color: rgba(167, 139, 250, 0.32);
          transform: translateY(-4px);
          box-shadow: 0 20px 44px rgba(167, 139, 250, 0.16);
        }

        .video-placeholder {
          background: rgba(255, 255, 255, 0.55);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          border-radius: 20px;
          border: 1px dashed rgba(167, 139, 250, 0.3);
          gap: 1rem;
          position: relative;
        }

        .video-icon {
          background: linear-gradient(135deg, rgba(167,139,250,.18), rgba(255,107,157,.1));
          border: 1px solid rgba(167, 139, 250, 0.25);
          color: #7C3AED;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-content { text-align: center; }

        .video-content h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #1A1625;
        }

        .video-content p {
          font-size: 0.85rem;
          color: #8B849B;
        }

        .section-header {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(167, 139, 250, 0.15);
          margin-bottom: 1.5rem;
          color: #1A1625;
        }

        .content-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .content-section h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1A1625;
          margin-top: 0.5rem;
        }

        .content-section p {
          font-size: 0.95rem;
          color: #4A4458;
          line-height: 1.6;
        }

        .content-section .bullet {
          padding-left: 1rem;
          position: relative;
        }

        .deliverable-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(167, 139, 250, 0.15);
        }

        .workspace-badge {
          background: linear-gradient(135deg, #FBBF24, #FFD166);
          color: #3A2400;
          padding: 0.35rem 0.85rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .form-group { margin-bottom: 1.5rem; }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #1A1625;
          margin-bottom: 0.5rem;
        }

        .form-textarea {
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(167, 139, 250, 0.2);
          border-radius: 12px;
          color: #1A1625;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          min-height: 90px;
          resize: vertical;
          line-height: 1.6;
          transition: all 0.3s;
        }

        .form-textarea::placeholder {
          color: #B6B1C9;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #A78BFA;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(167, 139, 250, 0.12);
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(167, 139, 250, 0.15);
          margin-top: 0.5rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 100px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
          text-decoration: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #A78BFA, #FF6B9D);
          border: none;
          color: #fff;
          box-shadow: 0 4px 16px rgba(167, 139, 250, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(255, 107, 157, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-secondary {
          background: linear-gradient(135deg, #FBBF24, #FF9F43);
          border: none;
          color: #3A2400;
          box-shadow: 0 4px 14px rgba(251, 191, 36, 0.3);
        }

        .btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(251, 191, 36, 0.4);
        }

        .btn-outline {
          background: rgba(255, 255, 255, 0.6);
          border: 2px solid rgba(167, 139, 250, 0.3);
          color: #4A4458;
        }

        .btn-outline:hover {
          background: rgba(167, 139, 250, 0.08);
          border-color: #A78BFA;
          color: #7C3AED;
        }

        @media (max-width: 768px) {
          .module-container { padding: 1.5rem; }
          .module-header { flex-direction: column; }
          .module-title { font-size: 1.5rem; }
          .form-actions { flex-direction: column; gap: 1rem; }
          .btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="mesh-bg" aria-hidden="true">
        <div className="mesh-blob blob-1" />
        <div className="mesh-blob blob-2" />
        <div className="mesh-blob blob-3" />
      </div>

      <div className="module-container">
        {/* Back link */}
        <Link to="/modules" className="back-link">
          <ArrowLeft size={16} /> Back to Modules
        </Link>

        {/* Module Title & Meta */}
        <div className="module-header">
          <div className="module-info">
            <div className="module-meta">
              <span className="track-badge">Track {moduleData.track}: {moduleData.trackName}</span>
              {moduleData.price > 0 && (
                <span className="price-badge">₹{moduleData.price}</span>
              )}
              {moduleData.region && (
                <span className="region-badge">📍 {moduleData.region}</span>
              )}
            </div>
            <h1 className="module-title">{moduleData.title}</h1>
            {moduleData.description && (
              <p className="module-desc">{moduleData.description}</p>
            )}
          </div>

          <div>
            {moduleData.status === 'completed' ? (
              <span className="status-badge completed">
                <CheckCircle size={14} /> Completed
              </span>
            ) : (
              <span className="status-badge in-progress">
                In Progress
              </span>
            )}
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            {successMsg}
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="alert alert-error">
            {errorMsg}
          </div>
        )}

        {/* Video Placeholder */}
        <div className="card video-placeholder">
          <div className="video-icon">
            <Video size={28} />
          </div>
          <div className="video-content">
            <h4>Lesson Lecture Placeholder</h4>
            <p>Video lectures and guest talks are available on the Premium version of MindLaunch.</p>
          </div>
        </div>

        {/* Lesson Content Sections */}
        <div className="card">
          <h3 className="section-header">Lessons & Study Notes</h3>

          <div className="content-section">
            {moduleData.content?.sections?.map((sect, idx) => {
              if (sect.type === 'header') {
                return (
                  <h4 key={idx}>{sect.body}</h4>
                );
              }
              if (sect.type === 'bullet') {
                return (
                  <div key={idx} className="bullet">
                    <p>{sect.body}</p>
                  </div>
                );
              }
              return (
                <p key={idx}>{sect.body}</p>
              );
            })}
          </div>
        </div>

        {/* Deliverables Form */}
        <div className="card">
          <div className="deliverable-header">
            <h3 className="section-header" style={{ marginBottom: 0, paddingBottom: 0, border: 'none' }}>Action Deliverables</h3>
            <span className="workspace-badge">
              <Sparkles size={12} /> Regional Workspace
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#8B849B', marginBottom: '1.5rem' }}>
            Complete the following structured fields to build your startup brief. These answers will be reviewed by the AI Pitch Coach and exported to your finalized Word & PDF documents.
          </p>

          <form onSubmit={handleSubmit}>
            {moduleData.deliverableSchema?.map((schema) => (
              <div key={schema.fieldKey} className="form-group">
                <label htmlFor={schema.fieldKey} className="form-label">
                  {schema.label}
                </label>
                <textarea
                  id={schema.fieldKey}
                  className="form-textarea"
                  value={answers[schema.fieldKey] || ''}
                  onChange={(e) => handleInputChange(schema.fieldKey, e.target.value)}
                  placeholder={schema.placeholder}
                  required
                />
              </div>
            ))}

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-secondary"
                disabled={saving}
              >
                <Save size={16} />
                {saving ? 'Saving deliverables...' : 'Mark as Complete & Save'}
              </button>
              <Link to="/modules" className="btn btn-outline">
                Back
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ModuleDetail;