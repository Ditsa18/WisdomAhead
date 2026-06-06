import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { ArrowLeft, CheckCircle, Video, Save, Sparkles, BookOpen } from 'lucide-react';

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
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
          body { font-family: 'Plus Jakarta Sans', sans-serif; background: #04040C; color: #F0EFF8; }
          .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80vh; gap: 1rem; }
          .loading-spinner { width: 48px; height: 48px; border: 3px solid rgba(123, 92, 245, 0.2); border-top-color: #7B5CF5; border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
          .loading-text { color: #8B8AA8; font-size: 0.95rem; }
        `}</style>
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
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
          body { font-family: 'Plus Jakarta Sans', sans-serif; background: #04040C; color: #F0EFF8; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
          .error-container { display: flex; flex-direction: column; gap: 1rem; align-items: center; text-align: center; }
          .error-text { color: #FF6B6B; font-size: 1rem; }
          .btn-primary { background: linear-gradient(135deg, #7B5CF5, #5B3CC5); border: none; border-radius: 10px; padding: 0.75rem 1.5rem; color: #fff; font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.3s; box-shadow: 0 4px 15px rgba(123, 92, 245, 0.3); }
          .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(123, 92, 245, 0.4); }
        `}</style>
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

        .module-container {
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
          color: #8B8AA8;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          transition: color 0.2s;
          margin-bottom: 1.5rem;
        }
        
        .back-link:hover { color: #7B5CF5; }
        
        .module-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
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
          color: #7B5CF5;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .price-badge {
          font-size: 0.85rem;
          font-weight: 700;
          color: #F5A623;
          background: rgba(245, 166, 35, 0.15);
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
        }
        
        .region-badge {
          font-size: 0.85rem;
          font-weight: 600;
          color: #8B8AA8;
          background: rgba(0, 0, 0, 0.3);
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
        }
        
        .module-title {
          font-family: 'Outfit', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .module-desc {
          font-size: 0.95rem;
          color: #8B8AA8;
          line-height: 1.6;
        }
        
        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .status-badge.completed {
          background: rgba(6, 214, 160, 0.15);
          border: 1px solid rgba(6, 214, 160, 0.3);
          color: #06D6A0;
        }
        
        .status-badge.in-progress {
          background: rgba(123, 92, 245, 0.15);
          border: 1px solid rgba(123, 92, 245, 0.3);
          color: #9D7DFF;
        }
        
        .alert {
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
          padding: 2rem;
          margin-bottom: 2rem;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .card:hover {
          border-color: rgba(123, 92, 245, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(123, 92, 245, 0.1);
        }
        
        .video-placeholder {
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          border-radius: 20px;
          border: 1px dashed rgba(255, 255, 255, 0.15);
          gap: 1rem;
          position: relative;
        }
        
        .video-icon {
          background: rgba(123, 92, 245, 0.15);
          color: #7B5CF5;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .video-content { text-align: center; }
        
        .video-content h4 {
          font-family: 'Outfit', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        
        .video-content p {
          font-size: 0.85rem;
          color: #8B8AA8;
        }
        
        .section-header {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 1.5rem;
        }
        
        .content-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        
        .content-section h4 {
          font-family: 'Outfit', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #F0EFF8;
          margin-top: 0.5rem;
        }
        
        .content-section p {
          font-size: 0.95rem;
          color: #8B8AA8;
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
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .workspace-badge {
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
        
        .form-group { margin-bottom: 1.5rem; }
        
        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #F0EFF8;
          margin-bottom: 0.5rem;
        }
        
        .form-textarea {
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #F0EFF8;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.95rem;
          min-height: 90px;
          resize: vertical;
          line-height: 1.6;
          transition: all 0.3s;
        }
        
        .form-textarea::placeholder {
          color: #5A5872;
        }
        
        .form-textarea:focus {
          outline: none;
          border-color: #7B5CF5;
          background: rgba(123, 92, 245, 0.08);
          box-shadow: 0 0 0 4px rgba(123, 92, 245, 0.1);
        }
        
        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          margin-top: 0.5rem;
        }
        
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
          text-decoration: none;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #7B5CF5, #5B3CC5);
          border: none;
          color: #fff;
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
        
        .btn-secondary {
          background: linear-gradient(135deg, #F5A623, #FFD166);
          border: none;
          color: #04040C;
          box-shadow: 0 4px 15px rgba(245, 166, 35, 0.3);
        }
        
        .btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 166, 35, 0.4);
        }
        
        .btn-outline {
          background: transparent;
          border: 1px solid rgba(123, 92, 245, 0.4);
          color: #9D7DFF;
        }
        
        .btn-outline:hover {
          background: rgba(123, 92, 245, 0.1);
          border-color: #7B5CF5;
        }
        
        @media (max-width: 768px) {
          .module-container { padding: 1.5rem; }
          .module-header { flex-direction: column; }
          .module-title { font-size: 1.5rem; }
          .form-actions { flex-direction: column; gap: 1rem; }
          .btn { width: 100%; justify-content: center; }
        }
      `}</style>
      
      <div className="floating-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
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
          <p style={{ fontSize: '0.9rem', color: '#8B8AA8', marginBottom: '1.5rem' }}>
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
