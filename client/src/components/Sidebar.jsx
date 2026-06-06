import React from 'react';
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
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
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
          onClick={handleLogout}
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
  );
};

export default Sidebar;
