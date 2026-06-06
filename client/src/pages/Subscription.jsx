import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { CreditCard, Sparkles, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const Subscription = () => {
  const { user, token, upgradePlanMock } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showMockOption, setShowMockOption] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('success') === 'true') {
      setStatusMsg('Thank you! Your payment was successful and your account is upgraded to Premium.');
      navigate('/subscription', { replace: true });
    } else if (searchParams.get('canceled') === 'true') {
      setErrorMsg('Payment checkout canceled. Please try again when you are ready.');
      navigate('/subscription', { replace: true });
    }

    if (searchParams.get('mock_checkout') === 'true') {
      setShowMockOption(true);
    }
  }, [location.search, navigate]);

  const handleUpgrade = async () => {
    setLoading(true);
    setStatusMsg('');
    setErrorMsg('');

    try {
      const res = await fetch(`${API_URL}/payments/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create checkout session');
      }

      if (data.mock) {
        setShowMockOption(true);
        setStatusMsg('Stripe is not configured for this demo. Use the mock upgrade below to become Premium instantly.');
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to start checkout. Please try the mock upgrade if available.');
    } finally {
      setLoading(false);
    }
  };

  const handleMockUpgrade = async () => {
    setLoading(true);
    setStatusMsg('');
    setErrorMsg('');

    try {
      await upgradePlanMock();
      setStatusMsg('Success! Your account is now Premium in demo mode. All modules are unlocked.');
      setShowMockOption(false);
    } catch (err) {
      setErrorMsg(err.message || 'Mock upgrade failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell page-wrap">
      <div className="split-row responsive-header" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Premium Startup Access</h1>
          <p style={{ maxWidth: '680px', color: 'var(--text-secondary)' }}>
            Unlock all 30 curriculum modules, AI-powered Pitch Coach reports, and premium document exports with India-focused pricing.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span className="badge badge-purple" style={{ alignSelf: 'flex-start' }}>
            Current plan: {user?.plan === 'premium' ? 'Premium' : 'Free'}
          </span>
          {user?.plan === 'premium' ? (
            <span className="badge badge-success">All tracks unlocked</span>
          ) : (
            <span className="badge badge-amber">Upgrade to unlock premium</span>
          )}
        </div>
      </div>

      {statusMsg && (
        <div className="card" style={{ backgroundColor: 'rgba(76,175,80,0.1)', borderColor: 'rgba(76,175,80,0.3)', color: 'var(--success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle2 size={18} />
            <span>{statusMsg}</span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="card" style={{ backgroundColor: 'rgba(255,107,107,0.1)', borderColor: 'rgba(255,107,107,0.3)', color: '#FF6B6B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      <div className="content-grid columns-2" style={{ gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sparkles size={20} style={{ color: 'var(--accent-secondary)' }} />
            <div>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Why Premium?</h2>
              <p style={{ margin: '0.4rem 0 0', color: 'var(--text-secondary)' }}>
                A single purchase unlocks the full startup growth path and export tools.
              </p>
            </div>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.85rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}><CheckCircle2 size={16} style={{ color: 'var(--accent-primary)' }} /> Unlock all 30 modules across 5 tracks.</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}><CheckCircle2 size={16} style={{ color: 'var(--accent-primary)' }} /> Download investor-ready Word and PDF briefs.</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}><CheckCircle2 size={16} style={{ color: 'var(--accent-primary)' }} /> Access AI Pitch Coach feedback and scoring.</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}><CheckCircle2 size={16} style={{ color: 'var(--accent-primary)' }} /> India-priced curriculum and regional guidance.</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}><CheckCircle2 size={16} style={{ color: 'var(--accent-primary)' }} /> Priority access to future premium features.</li>
          </ul>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(245,166,35,0.2)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CreditCard size={20} style={{ color: 'var(--accent-secondary)' }} />
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Premium Plan</h2>
            </div>
            <p style={{ margin: '0.4rem 0 0', color: 'var(--text-secondary)' }}>
              Annual premium access with the equivalent monthly rate shown below.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>₹2,499</span>
              <span style={{ color: 'var(--text-secondary)' }}>/ year</span>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              ₹399 <span style={{ fontWeight: 500 }}>/ month (Save 48%)</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Curriculum access</span>
              <strong>30 Modules</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Downloadables</span>
              <strong>Word + PDF</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tracks unlocked</span>
              <strong>5 Tracks</strong>
            </div>
          </div>

          {user?.plan === 'premium' ? (
            <button className="btn btn-outline" disabled style={{ width: '100%' }}>
              Premium Active
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              className="btn btn-secondary"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Starting checkout...' : 'Upgrade to Premium'}
            </button>
          )}

          {showMockOption && (
            <button
              onClick={handleMockUpgrade}
              className="btn btn-outline"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Upgrading...' : 'Use Demo Mock Upgrade'}
            </button>
          )}
        </div>
      </div>

      <div className="content-grid columns-2" style={{ gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Why upgrade?</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.9rem', marginTop: '1rem' }}>
            <li style={{ color: 'var(--text-secondary)' }}>• Unlock premium training for finance, operations, marketing, and fundraising.</li>
            <li style={{ color: 'var(--text-secondary)' }}>• Access investor-ready report generation and pitch deck support.</li>
            <li style={{ color: 'var(--text-secondary)' }}>• Leverage India-tailored curriculum and pricing.</li>
          </ul>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem' }}>How it works</h3>
          <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
            <li>Checkout with Stripe or use the demo mock upgrade locally.</li>
            <li>Return here and access all premium modules immediately.</li>
            <li>Download briefs, complete deliverables, and use Pitch Coach insights.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
