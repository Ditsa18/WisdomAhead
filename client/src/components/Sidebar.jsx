import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  FileText,
  FolderDown,
  User,
  CreditCard,
  LogOut,
  Sparkles,
  X,
  AlertTriangle
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate('/');
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  if (!user) return null;

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {onClose && (
        <button type="button" className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
          <X size={18} />
        </button>
      )}
      {/* Brand Logo */}
      <div className="sidebar-brand">
        <div className="brand-mark" style={{
          color: '#FFFFFF',
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
          M
        </div>
        <span style={{
          fontWeight: 800,
          fontSize: '1.25rem',
          letterSpacing: '0.5px'
        }}>
          Mind<span style={{ color: 'var(--accent-primary)' }}>Launch</span>
        </span>
      </div>

      {/* User Mini Profile */}
      <div className="sidebar-profile">
        <div style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {user.name}
        </div>
        <div>
          {user.plan === 'premium' ? (
            <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Sparkles size={12} /> Premium
            </span>
          ) : (
            <span className="badge badge-purple">
              Free Tier
            </span>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav>
        <NavLink
          to="/dashboard"
          onClick={onClose}
          className={({ isActive }) => `btn btn-outline ${isActive ? 'nav-link-active' : ''}`}
          style={{ justifyContent: 'flex-start', border: 'none', padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}
        >
          <LayoutDashboard size={18} style={{ marginRight: '0.75rem' }} />
          Dashboard
        </NavLink>

        <NavLink
          to="/modules"
          onClick={onClose}
          className={({ isActive }) => `btn btn-outline ${isActive ? 'nav-link-active' : ''}`}
          style={{ justifyContent: 'flex-start', border: 'none', padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}
        >
          <BookOpen size={18} style={{ marginRight: '0.75rem' }} />
          My Modules
        </NavLink>

        <NavLink
          to="/pitch-coach"
          onClick={onClose}
          className={({ isActive }) => `btn btn-outline ${isActive ? 'nav-link-active' : ''}`}
          style={{ justifyContent: 'flex-start', border: 'none', padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}
        >
          <MessageSquare size={18} style={{ marginRight: '0.75rem' }} />
          Pitch Coach
        </NavLink>

        <NavLink
          to="/startup-brief"
          onClick={onClose}
          className={({ isActive }) => `btn btn-outline ${isActive ? 'nav-link-active' : ''}`}
          style={{ justifyContent: 'flex-start', border: 'none', padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}
        >
          <FileText size={18} style={{ marginRight: '0.75rem' }} />
          My Startup Brief
        </NavLink>

        <NavLink
          to="/documents"
          onClick={onClose}
          className={({ isActive }) => `btn btn-outline ${isActive ? 'nav-link-active' : ''}`}
          style={{ justifyContent: 'flex-start', border: 'none', padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}
        >
          <FolderDown size={18} style={{ marginRight: '0.75rem' }} />
          My Documents
        </NavLink>

        <NavLink
          to="/profile"
          onClick={onClose}
          className={({ isActive }) => `btn btn-outline ${isActive ? 'nav-link-active' : ''}`}
          style={{ justifyContent: 'flex-start', border: 'none', padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}
        >
          <User size={18} style={{ marginRight: '0.75rem' }} />
          My Profile
        </NavLink>

        <NavLink
          to="/subscription"
          onClick={onClose}
          className={({ isActive }) => `btn btn-outline ${isActive ? 'nav-link-active' : ''}`}
          style={{ justifyContent: 'flex-start', border: 'none', padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}
        >
          <CreditCard size={18} style={{ marginRight: '0.75rem' }} />
          Subscription
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div style={{
        padding: '1rem 0.75rem',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <button
          onClick={handleLogoutClick}
          className="btn btn-outline"
          style={{
            width: '100%',
            justifyContent: 'flex-start',
            border: 'none',
            color: '#FF6B6B',
            cursor: 'pointer'
          }}
        >
          <LogOut size={18} style={{ marginRight: '0.75rem' }} />
          Log out
        </button>
      </div>
    </aside>

    {/* Logout Confirmation Modal */}
    {showLogoutModal && (
      <>
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(4, 4, 12, 0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={handleLogoutCancel}
        />
        <div 
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(26, 26, 46, 0.95)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '2rem',
            zIndex: 1000,
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255, 107, 107, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={24} style={{ color: '#FF6B6B' }} />
            </div>
            <h3 style={{ 
              fontFamily: 'Outfit, sans-serif',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#F0EFF8',
              margin: 0
            }}>
              Confirm Logout
            </h3>
          </div>
          <p style={{
            color: '#8B8AA8',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            marginBottom: '1.5rem'
          }}>
            Are you sure you want to log out? You'll need to sign in again to access your dashboard and modules.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleLogoutCancel}
              style={{
                flex: 1,
                padding: '0.75rem 1.25rem',
                borderRadius: '10px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#8B8AA8',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              Cancel
            </button>
            <button
              onClick={handleLogoutConfirm}
              style={{
                flex: 1,
                padding: '0.75rem 1.25rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #FF6B6B, #FF5252)',
                border: 'none',
                color: '#fff',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Log Out
            </button>
          </div>
        </div>
      </>
    )}
  </>
  );
};

export default Sidebar;
