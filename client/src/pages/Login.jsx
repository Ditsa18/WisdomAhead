import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #04040C;
          color: #F0EFF8;
          min-height: 100vh;
          overflow-x: hidden;
        }
        
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: linear-gradient(135deg, #04040C 0%, #080814 50%, #04040C 100%);
          padding: 2rem;
        }
        
        .auth-bg-orb {
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

        .auth-card {
          position: relative;
          z-index: 1;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 28px;
          padding: 3.5rem;
          max-width: 440px;
          width: 100%;
          box-shadow: 
            0 0 60px rgba(123, 92, 245, 0.15),
            0 0 100px rgba(245, 166, 35, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          opacity: 0;
          transform: translateY(30px) scale(0.95);
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          overflow: hidden;
        }
        
        .auth-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #7B5CF5, #F5A623, #7B5CF5);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .auth-logo {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #7B5CF5, #5B3CC5);
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 1.5rem;
          box-shadow: 
            0 0 40px rgba(123, 92, 245, 0.5),
            0 0 80px rgba(123, 92, 245, 0.3);
          animation: pulse 2s ease-in-out infinite;
          position: relative;
        }
        
        .auth-logo::after {
          content: '';
          position: absolute;
          inset: -4px;
          background: linear-gradient(135deg, #7B5CF5, #F5A623);
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          opacity: 0.5;
          filter: blur(8px);
          z-index: -1;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        
        .auth-title {
          font-family: 'Outfit', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #F0EFF8, #9D7DFF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .auth-subtitle {
          font-size: 0.95rem;
          color: #8B8AA8;
          line-height: 1.6;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #F0EFF8;
          margin-bottom: 0.5rem;
        }
        
        .form-input {
          width: 100%;
          padding: 1rem 1.25rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          color: #F0EFF8;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
        }
        
        .form-input::placeholder {
          color: #5A5872;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #7B5CF5;
          background: linear-gradient(135deg, rgba(123, 92, 245, 0.12), rgba(123, 92, 245, 0.05));
          box-shadow: 
            0 0 0 4px rgba(123, 92, 245, 0.15),
            0 0 20px rgba(123, 92, 245, 0.2);
          transform: translateY(-1px);
        }
        
        .auth-btn {
          width: 100%;
          padding: 1.1rem;
          background: linear-gradient(135deg, #7B5CF5, #5B3CC5);
          border: none;
          border-radius: 14px;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 
            0 0 0 1px rgba(123, 92, 245, 0.4), 
            0 4px 20px rgba(123, 92, 245, 0.3),
            0 0 40px rgba(123, 92, 245, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        .auth-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .auth-btn:hover {
          transform: translateY(-3px);
          box-shadow: 
            0 0 0 1px rgba(123, 92, 245, 0.6), 
            0 8px 30px rgba(123, 92, 245, 0.4),
            0 0 60px rgba(123, 92, 245, 0.3);
        }
        
        .auth-btn:hover::before {
          opacity: 1;
        }
        
        .auth-btn:active {
          transform: translateY(-1px);
        }
        
        .auth-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .auth-error {
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.3);
          border-radius: 12px;
          padding: 1rem;
          color: #FF6B6B;
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          animation: shake 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .auth-footer {
          text-align: center;
          margin-top: 2rem;
          font-size: 0.875rem;
          color: #8B8AA8;
        }
        
        .auth-link {
          color: #7B5CF5;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        
        .auth-link:hover {
          color: #9D7DFF;
        }
        
        @media (max-width: 480px) {
          .auth-card {
            padding: 2rem;
            border-radius: 20px;
          }
          
          .auth-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
      
      <div className="auth-container">
        <div className="floating-particles">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>
        <div className="auth-bg-orb orb-1" />
        <div className="auth-bg-orb orb-2" />
        
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">M</div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to continue your entrepreneurship journey</p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@startup.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
