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
      await updateStartupProfile(startupIdea, category);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

        .onboarding-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: linear-gradient(135deg, #04040C 0%, #080814 50%, #04040C 100%);
          padding: 2rem;
        }
        
        .onboarding-bg-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }
        
        .orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(123, 92, 245, 0.15) 0%, transparent 70%);
          top: -200px;
          left: -150px;
          animation: float 8s ease-in-out infinite alternate;
        }
        
        .orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(245, 166, 35, 0.1) 0%, transparent 70%);
          bottom: -150px;
          right: -100px;
          animation: float 10s ease-in-out infinite alternate-reverse;
        }
        
        @keyframes float {
          0% { transform: translate(0, 0); }
          100% { transform: translate(30px, -20px); }
        }
        
        .onboarding-card {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 3rem;
          max-width: 600px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          box-shadow: 0 0 60px rgba(123, 92, 245, 0.1);
          opacity: 0;
          transform: translateY(30px);
          animation: slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }
        
        .step-indicator {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .step-label {
          font-size: 0.85rem;
          color: #8B8AA8;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        
        .progress-dots {
          display: flex;
          gap: 0.5rem;
        }
        
        .progress-dot {
          width: 40px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          transition: all 0.3s;
        }
        
        .progress-dot.active {
          background: linear-gradient(90deg, #7B5CF5, #9D7DFF);
        }
        
        .alert {
          padding: 1rem 1.25rem;
          border-radius: 12px;
          font-size: 0.875rem;
          animation: shake 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .alert-error {
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.3);
          color: #FF6B6B;
        }
        
        .step-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .step-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .step-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(123, 92, 245, 0.15);
          color: #7B5CF5;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .step-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .step-description {
          font-size: 0.95rem;
          color: #8B8AA8;
          line-height: 1.6;
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
          min-height: 180px;
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
        
        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        
        .category-btn {
          padding: 0.9rem 0.5rem;
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #8B8AA8;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .category-btn:hover {
          border-color: rgba(123, 92, 245, 0.3);
          background: rgba(123, 92, 245, 0.05);
        }
        
        .category-btn.selected {
          background: rgba(123, 92, 245, 0.15);
          border-color: #7B5CF5;
          color: #F0EFF8;
        }
        
        .form-group { margin-top: 0.5rem; }
        
        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #F0EFF8;
          margin-bottom: 0.5rem;
        }
        
        .form-select {
          width: 100%;
          padding: 0.875rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #F0EFF8;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.95rem;
          transition: all 0.3s;
          cursor: pointer;
        }
        
        .form-select:focus {
          outline: none;
          border-color: #7B5CF5;
          background: rgba(123, 92, 245, 0.08);
          box-shadow: 0 0 0 4px rgba(123, 92, 245, 0.1);
        }
        
        .form-select option {
          background: #04040C;
          color: #F0EFF8;
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
          border-radius: 12px;
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
        
        .btn-outline {
          background: transparent;
          border: 1px solid rgba(123, 92, 245, 0.4);
          color: #9D7DFF;
        }
        
        .btn-outline:hover {
          background: rgba(123, 92, 245, 0.1);
          border-color: #7B5CF5;
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
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        @media (max-width: 768px) {
          .onboarding-container { padding: 1.5rem; }
          .onboarding-card { padding: 2rem; border-radius: 20px; }
          .step-title { font-size: 1.25rem; }
          .category-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      
      <div className="onboarding-container">
        <div className="floating-particles">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>
        <div className="onboarding-bg-orb orb-1" />
        <div className="onboarding-bg-orb orb-2" />
        
        <div className="onboarding-card">
          {/* Step Indicator */}
          <div className="step-indicator">
            <span className="step-label">STEP {step} OF 3</span>
            <div className="progress-dots">
              <div className={`progress-dot ${step >= 1 ? 'active' : ''}`} />
              <div className={`progress-dot ${step >= 2 ? 'active' : ''}`} />
              <div className={`progress-dot ${step >= 3 ? 'active' : ''}`} />
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {/* Step 1: Describe Startup Idea */}
          {step === 1 && (
            <div className="step-content">
              <div className="step-header">
                <div className="step-icon">
                  <Target size={24} />
                </div>
                <h2 className="step-title">Describe your startup idea</h2>
              </div>
              <p className="step-description">Tell us what problem you're solving, who you are solving it for, and what your solution is. Be as detailed as you want—this context will tune your curriculum and feed directly into the Claude AI Pitch Coach.</p>
              <textarea
                className="form-textarea"
                value={startupIdea}
                onChange={(e) => setStartupIdea(e.target.value)}
                placeholder="Example: I am building a mobile SaaS app that helps local organic farmers in the UAE manage their crop distributions and schedule direct deliveries to consumers, solving the middleman pricing cuts..."
                required
              />
            </div>
          )}

          {/* Step 2: Select Category Tiles */}
          {step === 2 && (
            <div className="step-content">
              <div className="step-header">
                <div className="step-icon">
                  <Compass size={24} />
                </div>
                <h2 className="step-title">Select your business category</h2>
              </div>
              <p className="step-description">Pick the category that best describes your startup venture. This aligns templates with industry practices.</p>
              
              <div className="category-grid">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setError('');
                    }}
                    type="button"
                    className={`category-btn ${category === cat ? 'selected' : ''}`}
                  >
                    {category === cat && <Check size={14} />}
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Select/Confirm Region */}
          {step === 3 && (
            <div className="step-content">
              <div className="step-header">
                <div className="step-icon">
                  <Map size={24} />
                </div>
                <h2 className="step-title">Confirm your target region</h2>
              </div>
              <p className="step-description">Your target market impacts legal setup compliance, investor targeting suggestions, and local commercial norms.</p>
              
              <div className="form-group">
                <label htmlFor="onboard-region" className="form-label">Select Country / Region</label>
                <select
                  id="onboard-region"
                  className="form-select"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
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
          <div className="form-actions">
            {step > 1 ? (
              <button onClick={handleBack} className="btn btn-outline">
                <ArrowLeft size={16} /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button onClick={handleNext} className="btn btn-primary">
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="btn btn-secondary"
                disabled={loading}
              >
                {loading ? 'Setting up profile...' : 'Launch Dashboard'} <Check size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboarding;
