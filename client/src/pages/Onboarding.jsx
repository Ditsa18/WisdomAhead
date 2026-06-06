import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ArrowLeft, Check, Compass, Target, Map } from 'lucide-react';

const Onboarding = () => {
  const { user, updateStartupProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [startupIdea, setStartupIdea] = useState('');
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState(user?.region || 'US');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const regionsList = [
    { name: 'United States', code: 'US' },
    { name: 'India', code: 'IN' },
    { name: 'United Arab Emirates', code: 'UAE' },
    { name: 'Saudi Arabia', code: 'SA' },
    { name: 'Egypt', code: 'EG' },
    { name: 'Nigeria', code: 'NG' },
    { name: 'Kenya', code: 'KE' },
    { name: 'Jordan', code: 'JO' },
    { name: 'Qatar', code: 'QA' }
  ];

  const handleNext = () => {
    if (step === 1 && !startupIdea.trim()) {
      setError('Please describe your startup idea first.');
      return;
    }
    if (step === 2 && !category) {
      setError('Please select a business category.');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      // Save onboarding updates to MongoDB
      await updateStartupProfile(startupIdea, category);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell page-wrap" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="auth-card" style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2.5rem' }}>
        
        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            STEP {step} OF 3
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ width: '40px', height: '4px', backgroundColor: step >= 1 ? 'var(--accent-primary)' : 'var(--border-subtle)', borderRadius: '2px' }} />
            <div style={{ width: '40px', height: '4px', backgroundColor: step >= 2 ? 'var(--accent-primary)' : 'var(--border-subtle)', borderRadius: '2px' }} />
            <div style={{ width: '40px', height: '4px', backgroundColor: step >= 3 ? 'var(--accent-primary)' : 'var(--border-subtle)', borderRadius: '2px' }} />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(255, 107, 107, 0.15)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem',
            color: '#FF6B6B',
            fontSize: '0.85rem'
          }}>
            {error}
          </div>
        )}

        {/* Step 1: Describe Startup Idea */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ color: 'var(--accent-primary)' }}><Target size={24} /></div>
              <h2>Describe your startup idea</h2>
            </div>
            <p>Tell us what problem you're solving, who you are solving it for, and what your solution is. Be as detailed as you want—this context will tune your curriculum and feed directly into the Claude AI Pitch Coach.</p>
            <div className="form-group">
              <textarea
                value={startupIdea}
                onChange={(e) => setStartupIdea(e.target.value)}
                placeholder="Example: I am building a mobile SaaS app that helps local organic farmers in the UAE manage their crop distributions and schedule direct deliveries to consumers, solving the middleman pricing cuts..."
                style={{ height: '180px', resize: 'vertical', lineHeight: 1.5 }}
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: Select Category Tiles */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ color: 'var(--accent-primary)' }}><Compass size={24} /></div>
              <h2>Select your business category</h2>
            </div>
            <p>Pick the category that best describes your startup venture. This aligns templates with industry practices.</p>
            
            <div className="content-grid columns-2" style={{ marginTop: '0.5rem', gap: '0.75rem' }}>
              {categories.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setError('');
                    }}
                    type="button"
                    style={{
                      padding: '0.9rem 0.5rem',
                      borderRadius: '10px',
                      backgroundColor: isSelected ? 'rgba(108, 99, 255, 0.15)' : 'var(--bg-deep)',
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {isSelected && <Check size={14} style={{ color: 'var(--accent-primary)' }} />}
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Select/Confirm Region */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ color: 'var(--accent-primary)' }}><Map size={24} /></div>
              <h2>Confirm your target region</h2>
            </div>
            <p>Your target market impacts legal setup compliance, investor targeting suggestions, and local commercial norms.</p>
            
            <div className="form-group" style={{ marginTop: '0.5rem' }}>
              <label htmlFor="onboard-region">Select Country / Region</label>
              <select
                id="onboard-region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {regionsList.map((reg) => (
                  <option key={reg.code} value={reg.code}>
                    {reg.name} ({reg.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="form-actions" style={{
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.5rem',
          marginTop: '0.5rem'
        }}>
          {step > 1 ? (
            <button onClick={handleBack} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button onClick={handleNext} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Setting up profile...' : 'Launch Dashboard'} <Check size={16} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Onboarding;
