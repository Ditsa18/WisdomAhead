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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <p>Loading module curriculum...</p>
      </div>
    );
  }

  if (errorMsg && !moduleData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <p style={{ color: '#FF6B6B' }}>{errorMsg}</p>
        <Link to="/modules" className="btn btn-primary">Back to Curriculum</Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Back link */}
      <div>
        <Link to="/modules" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Modules
        </Link>
      </div>

      {/* Module Title & Meta */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Track {moduleData.track}: {moduleData.trackName}
            </span>
            {moduleData.price > 0 && (
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFC107', backgroundColor: 'rgba(255, 193, 7, 0.15)', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>
                ₹{moduleData.price}
              </span>
            )}
            {moduleData.region && (
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>
                📍 {moduleData.region}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', marginBottom: '0.5rem' }}>
            {moduleData.title}
          </h1>
          {moduleData.description && (
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.5 }}>
              {moduleData.description}
            </p>
          )}
        </div>
        
        <div>
          {moduleData.status === 'completed' ? (
            <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem' }}>
              <CheckCircle size={14} /> Completed
            </span>
          ) : (
            <span className="badge badge-purple" style={{ padding: '0.5rem 1rem' }}>
              In Progress
            </span>
          )}
        </div>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div style={{
          backgroundColor: 'rgba(76, 175, 80, 0.15)',
          border: '1px solid rgba(76, 175, 80, 0.4)',
          borderRadius: '8px',
          padding: '1rem',
          color: 'var(--success)',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle size={18} />
          {successMsg}
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div style={{
          backgroundColor: 'rgba(255, 107, 107, 0.15)',
          border: '1px solid rgba(255, 107, 107, 0.4)',
          borderRadius: '8px',
          padding: '1rem',
          color: '#FF6B6B',
          fontSize: '0.9rem'
        }}>
          {errorMsg}
        </div>
      )}

      {/* Video Placeholder */}
      <div className="card" style={{
        backgroundColor: 'rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        borderRadius: 'var(--border-radius)',
        border: '1px dashed var(--border-subtle)',
        gap: '1rem',
        position: 'relative'
      }}>
        <div style={{
          backgroundColor: 'rgba(108, 99, 255, 0.15)',
          color: 'var(--accent-primary)',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Video size={28} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ marginBottom: '0.25rem' }}>Lesson Lecture Placeholder</h4>
          <p style={{ fontSize: '0.85rem' }}>Video lectures and guest talks are available on the Premium version of MindLaunch.</p>
        </div>
      </div>

      {/* Lesson Content Sections */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
          Lessons & Study Notes
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {moduleData.content?.sections?.map((sect, idx) => {
            if (sect.type === 'header') {
              return (
                <h4 key={idx} style={{ fontSize: '1.1rem', color: '#FFFFFF', marginTop: '0.5rem' }}>
                  {sect.body}
                </h4>
              );
            }
            if (sect.type === 'bullet') {
              return (
                <div key={idx} style={{ paddingLeft: '1rem' }}>
                  <p style={{ fontSize: '0.95rem', position: 'relative' }}>
                    {sect.body}
                  </p>
                </div>
              );
            }
            return (
              <p key={idx} style={{ fontSize: '0.95rem' }}>
                {sect.body}
              </p>
            );
          })}
        </div>
      </div>

      {/* Deliverables Form */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>
            Action Deliverables
          </h3>
          <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Sparkles size={12} /> Regional Workspace
          </span>
        </div>
        <p style={{ fontSize: '0.9rem' }}>
          Complete the following structured fields to build your startup brief. These answers will be reviewed by the AI Pitch Coach and exported to your finalized Word & PDF documents.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {moduleData.deliverableSchema?.map((schema) => (
            <div key={schema.fieldKey} className="form-group">
              <label htmlFor={schema.fieldKey} style={{ fontWeight: 600 }}>
                {schema.label}
              </label>
              <textarea
                id={schema.fieldKey}
                value={answers[schema.fieldKey] || ''}
                onChange={(e) => handleInputChange(schema.fieldKey, e.target.value)}
                placeholder={schema.placeholder}
                style={{ height: '90px', resize: 'vertical', fontSize: '0.9rem', lineHeight: 1.4 }}
                required
              />
            </div>
          ))}

          <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
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
  );
};

export default ModuleDetail;
