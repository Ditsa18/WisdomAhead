import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  AlertTriangle,
  ChevronRight,
  Menu,
} from 'lucide-react';


/* ══════════════ SCOPED CSS (injected once into <head>) ══════════════ */
const SIDEBAR_CSS = `
/* ── Root variables (matches LandingPage / Dashboard token system) ── */
.ml-sb-root {
  --sb-bg:         #FEFCF9;
  --sb-glass:      rgba(255,255,255,.72);
  --sb-glass-bdr:  rgba(255,255,255,.5);
  --sb-surf:       rgba(167,139,250,.05);
  --sb-surf2:      rgba(167,139,250,.09);
  --sb-bdr:        rgba(167,139,250,.15);
  --sb-bdr2:       rgba(167,139,250,.25);
  --sb-lavender:   #A78BFA;
  --sb-lavender-d: #7C3AED;
  --sb-coral:      #FF6B9D;
  --sb-mint:       #6EE7B7;
  --sb-peach:      #FBBF24;
  --sb-rose:       #FB7185;
  --sb-ink:        #1A1625;
  --sb-ink2:       #4A4458;
  --sb-ink3:       #8B849B;
  --sb-w:          242px;
  --sb-ease:       cubic-bezier(.25,.46,.45,.94);
  --sb-spring:     cubic-bezier(.34,1.56,.64,1);
  --sb-font-d:     'Space Grotesk', sans-serif;
  --sb-font-b:     'Inter', sans-serif;
  --sb-font-m:     'JetBrains Mono', monospace;
}

/* ════ HAMBURGER BUTTON (mobile only, fixed top-left) ════ */
.ml-sb-hamburger {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 400;
  width: 40px; height: 40px;
  border-radius: 11px;
  background: rgba(254,252,249,.88);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(167,139,250,.3);
  color: var(--sb-lavender-d);
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 18px rgba(167,139,250,.18), 0 0 0 1px rgba(167,139,250,.1);
  transition: background .2s var(--sb-ease), border-color .2s, box-shadow .2s,
              transform .18s var(--sb-spring);
}
.ml-sb-hamburger:hover {
  background: rgba(167,139,250,.12);
  border-color: rgba(167,139,250,.55);
  box-shadow: 0 4px 22px rgba(167,139,250,.28), 0 0 16px rgba(167,139,250,.22);
  transform: scale(1.06);
}
.ml-sb-hamburger:active { transform: scale(.96); }

@media (max-width: 900px) {
  .ml-sb-hamburger { display: flex; }
}

/* ════ OVERLAY ════ */
.ml-sb-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26,22,37,.28);
  backdrop-filter: blur(7px) saturate(140%);
  z-index: 350;
  opacity: 0;
  pointer-events: none;          /* ← CRITICAL: never blocks clicks when closed */
  transition: opacity .3s var(--sb-ease), backdrop-filter .3s;
}
.ml-sb-overlay.open {
  opacity: 1;
  pointer-events: all;           /* ← only intercepts when actually open */
}
/* Only show overlay on mobile */
@media (min-width: 901px) {
  .ml-sb-overlay { display: none; }
}

/* ════ SIDEBAR PANEL ════ */
.ml-sb-panel {
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: var(--sb-w);
  background: var(--sb-glass);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border-right: 1px solid var(--sb-bdr);
  display: flex;
  flex-direction: column;
  z-index: 360;
  overflow: hidden;
  /* Desktop: always visible */
  transform: translateX(0);
  transition: transform .32s var(--sb-ease), box-shadow .32s var(--sb-ease);
  /* Soft lavender wash, no grain — matches the glass cards elsewhere */
  background-image:
    linear-gradient(180deg, rgba(167,139,250,.06) 0%, transparent 45%, rgba(255,107,157,.03) 100%);
}
/* Right-edge gradient glow (lavender → coral, like the logo gradient) */
.ml-sb-panel::after {
  content: '';
  position: absolute;
  top: 0; right: -1px; bottom: 0; width: 1px;
  background: linear-gradient(180deg,
    transparent 0%,
    rgba(167,139,250,.45) 30%,
    rgba(255,107,157,.3) 65%,
    transparent 100%
  );
  pointer-events: none;
}

/* ── Mobile: slide off-screen when closed ── */
@media (max-width: 900px) {
  .ml-sb-panel {
    transform: translateX(-110%);
    box-shadow: none;
  }
  .ml-sb-panel.open {
    transform: translateX(0);
    box-shadow: 28px 0 70px rgba(167,139,250,.22), 3px 0 0 rgba(167,139,250,.15);
  }
}

/* ════ CLOSE BUTTON (inside panel, mobile only) ════ */
.ml-sb-close {
  position: absolute;
  top: .9rem; right: .9rem;
  width: 28px; height: 28px;
  border-radius: 8px;
  background: var(--sb-glass);
  border: 1px solid var(--sb-bdr2);
  color: var(--sb-ink2);
  display: none;
  align-items: center; justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background .2s, color .2s, transform .22s var(--sb-spring);
}
.ml-sb-close:hover {
  background: rgba(255,107,157,.12);
  color: var(--sb-coral);
  transform: rotate(90deg) scale(1.1);
}
@media (max-width: 900px) {
  .ml-sb-close { display: flex; }
}

/* ════ BRAND ════ */
.ml-sb-brand {
  padding: 1.35rem 1.2rem .95rem;
  display: flex; align-items: center; gap: .65rem;
  border-bottom: 1px solid var(--sb-bdr);
  flex-shrink: 0;
}
.ml-sb-gem {
  width: 34px; height: 34px;
  background: linear-gradient(135deg, var(--sb-lavender), var(--sb-coral));
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: flex; align-items: center; justify-content: center;
  font-size: .84rem; font-weight: 900; color: #fff;
  box-shadow: 0 0 18px rgba(167,139,250,.4);
  flex-shrink: 0;
  animation: sbGemPulse 4s ease-in-out infinite;
}
@keyframes sbGemPulse {
  0%,100% { box-shadow: 0 0 18px rgba(167,139,250,.4); }
  50%      { box-shadow: 0 0 32px rgba(255,107,157,.5);  }
}
.ml-sb-wordmark {
  font-family: var(--sb-font-d);
  font-size: 1.17rem; font-weight: 700; letter-spacing: -.3px;
  color: var(--sb-ink);
}
.ml-sb-wordmark span {
  background: linear-gradient(135deg, var(--sb-lavender), var(--sb-coral));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ════ PROFILE CARD ════ */
.ml-sb-profile {
  margin: .95rem .8rem .4rem;
  padding: .85rem .95rem;
  border-radius: 14px;
  background: rgba(255,255,255,.6);
  border: 1px solid var(--sb-bdr);
  display: flex; align-items: center; gap: .72rem;
  position: relative; overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(167,139,250,.08);
}
/* shimmer sweep */
.ml-sb-profile::before {
  content: '';
  position: absolute;
  top: 0; left: -100%; bottom: 0; width: 55%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent);
  animation: sbShimmer 5.5s ease-in-out infinite;
  pointer-events: none;
}
@keyframes sbShimmer { 0%{left:-100%} 100%{left:220%} }

.ml-sb-avatar {
  width: 35px; height: 35px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(167,139,250,.22), rgba(255,107,157,.14));
  border: 1px solid rgba(167,139,250,.32);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--sb-font-d);
  font-size: .88rem; font-weight: 700; color: var(--sb-lavender-d);
  flex-shrink: 0;
  box-shadow: 0 0 10px rgba(167,139,250,.18);
  transition: box-shadow .3s;
}
.ml-sb-profile:hover .ml-sb-avatar {
  box-shadow: 0 0 18px rgba(167,139,250,.35);
}
.ml-sb-name {
  font-family: var(--sb-font-d);
  font-size: .83rem; font-weight: 700; letter-spacing: -.15px;
  color: var(--sb-ink);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.ml-sb-badge {
  display: inline-flex; align-items: center; gap: .24rem;
  font-size: .59rem; font-family: var(--sb-font-m); font-weight: 500;
  letter-spacing: .05em; text-transform: uppercase;
  padding: .16rem .48rem; border-radius: 100px;
  margin-top: .17rem;
}
.ml-sb-badge-premium {
  background: linear-gradient(135deg, rgba(251,191,36,.18), rgba(251,191,36,.07));
  border: 1px solid rgba(251,191,36,.4);
  color: #D97706;
  animation: sbBadgeGold 3.5s ease-in-out infinite;
}
@keyframes sbBadgeGold { 0%,100%{box-shadow:none}50%{box-shadow:0 0 10px rgba(251,191,36,.3)} }
.ml-sb-badge-free {
  background: rgba(167,139,250,.1);
  border: 1px solid rgba(167,139,250,.26);
  color: var(--sb-lavender-d);
}

/* ════ SECTION LABEL ════ */
.ml-sb-section-label {
  padding: .85rem 1.15rem .3rem;
  font-family: var(--sb-font-m);
  font-size: .57rem; font-weight: 500; letter-spacing: .13em;
  text-transform: uppercase; color: var(--sb-ink3);
  flex-shrink: 0;
}

/* ════ NAV SCROLL AREA ════ */
.ml-sb-nav {
  flex: 1;
  overflow-y: auto; overflow-x: hidden;
  padding: 0 .65rem;
  scrollbar-width: none;
}
.ml-sb-nav::-webkit-scrollbar { display: none; }

/* ════ NAV ITEM ════ */
.ml-sb-item {
  display: flex; align-items: center; gap: .68rem;
  padding: .6rem .88rem;
  border-radius: 11px;
  color: var(--sb-ink3);
  text-decoration: none;
  font-family: var(--sb-font-b);
  font-size: .83rem; font-weight: 500; letter-spacing: -.1px;
  margin-bottom: .16rem;
  cursor: pointer;
  border: 1px solid transparent;
  position: relative; overflow: hidden;
  transition:
    color .22s var(--sb-ease),
    background .22s var(--sb-ease),
    border-color .22s var(--sb-ease),
    transform .18s var(--sb-spring);
  user-select: none;
  -webkit-tap-highlight-color: transparent;  /* clean mobile tap */
}
/* hover radial glow */
.ml-sb-item::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(circle at 28% 50%, rgba(167,139,250,.13), transparent 68%);
  opacity: 0; transition: opacity .28s;
  pointer-events: none;
}
.ml-sb-item:hover {
  color: var(--sb-ink);
  background: var(--sb-surf2);
  border-color: var(--sb-bdr2);
  transform: translateX(4px);
}
.ml-sb-item:hover::before { opacity: 1; }
.ml-sb-item:active { transform: translateX(2px) scale(.98); }

/* icon box */
.ml-sb-ico {
  width: 29px; height: 29px;
  border-radius: 8px;
  background: rgba(167,139,250,.06);
  border: 1px solid var(--sb-bdr);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background .22s, border-color .22s, box-shadow .22s, color .22s;
}
.ml-sb-item:hover .ml-sb-ico {
  background: rgba(167,139,250,.16);
  border-color: rgba(167,139,250,.3);
}

/* chevron */
.ml-sb-chev {
  margin-left: auto;
  opacity: 0;
  transform: translateX(-5px);
  transition: opacity .2s, transform .2s var(--sb-spring);
  flex-shrink: 0;
  color: var(--sb-lavender-d);
}
.ml-sb-item:hover .ml-sb-chev,
.ml-sb-item.sb-active .ml-sb-chev { opacity: 1; transform: translateX(0); }

/* ── ACTIVE STATE ── */
.ml-sb-item.sb-active {
  color: var(--sb-lavender-d);
  background: linear-gradient(135deg, rgba(167,139,250,.16), rgba(255,107,157,.09));
  border-color: rgba(167,139,250,.32);
  box-shadow: 0 4px 18px rgba(167,139,250,.14), inset 0 1px 0 rgba(255,255,255,.4);
  transform: translateX(4px);
}
/* left accent bar */
.ml-sb-item.sb-active::after {
  content: '';
  position: absolute;
  left: 0; top: 18%; bottom: 18%; width: 3px;
  background: linear-gradient(180deg, var(--sb-lavender), var(--sb-coral));
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 10px rgba(167,139,250,.5);
}
.ml-sb-item.sb-active .ml-sb-ico {
  background: rgba(167,139,250,.22);
  border-color: rgba(167,139,250,.45);
  box-shadow: 0 0 12px rgba(167,139,250,.28);
  color: var(--sb-lavender-d);
}

/* ════ DIVIDER ════ */
.ml-sb-divider {
  height: 1px;
  background: var(--sb-bdr);
  margin: .45rem .65rem;
  flex-shrink: 0;
}

/* ════ LOGOUT BUTTON ════ */
.ml-sb-logout {
  display: flex; align-items: center; gap: .68rem;
  width: 100%;
  padding: .6rem .88rem;
  border-radius: 11px;
  background: none; border: 1px solid transparent;
  color: var(--sb-ink3);
  font-family: var(--sb-font-b);
  font-size: .83rem; font-weight: 500; letter-spacing: -.1px;
  cursor: pointer;
  transition: all .22s var(--sb-ease);
  -webkit-tap-highlight-color: transparent;
}
.ml-sb-logout:hover {
  color: var(--sb-rose);
  background: rgba(251,113,133,.08);
  border-color: rgba(251,113,133,.24);
  transform: translateX(4px);
}
.ml-sb-logout:hover .ml-sb-ico {
  background: rgba(251,113,133,.14);
  border-color: rgba(251,113,133,.3);
  color: var(--sb-rose);
}
.ml-sb-logout:active { transform: translateX(2px) scale(.98); }

/* ════ FOOTER ════ */
.ml-sb-footer {
  padding: .55rem .65rem 1.05rem;
  flex-shrink: 0;
}
.ml-sb-ver {
  display: flex; align-items: center; justify-content: center; gap: .38rem;
  padding: .32rem .7rem; margin-top: .45rem;
  border-radius: 8px;
  background: rgba(255,255,255,.45);
  border: 1px solid var(--sb-bdr);
  color: var(--sb-ink3);
  font-family: var(--sb-font-m);
  font-size: .56rem; letter-spacing: .06em;
}
.ml-sb-ver-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--sb-mint);
  box-shadow: 0 0 6px var(--sb-mint);
  animation: sbVdot 2.5s ease-in-out infinite;
}
@keyframes sbVdot { 0%,100%{opacity:1}50%{opacity:.35} }

/* ════ LOGOUT MODAL ════ */
.ml-sb-modal-overlay {
  position: fixed; inset: 0;
  background: rgba(26,22,37,.45);
  backdrop-filter: blur(12px) saturate(140%);
  z-index: 500;
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
  animation: sbFadeOverlay .22s var(--sb-ease);
}
@keyframes sbFadeOverlay { from{opacity:0} to{opacity:1} }
.ml-sb-modal {
  background: var(--sb-bg);
  border: 1px solid var(--sb-bdr);
  border-radius: 22px;
  padding: 2rem;
  max-width: 400px; width: 100%;
  box-shadow: 0 32px 80px rgba(167,139,250,.22), 0 0 0 1px rgba(167,139,250,.06);
  animation: sbModalPop .28s var(--sb-spring);
  position: relative; overflow: hidden;
}
.ml-sb-modal::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(251,113,133,.65) 50%, transparent);
}
@keyframes sbModalPop { from{opacity:0;transform:scale(.92) translateY(12px)} to{opacity:1;transform:none} }
.ml-sb-modal-ico {
  width: 50px; height: 50px; border-radius: 14px;
  background: rgba(251,113,133,.12);
  border: 1px solid rgba(251,113,133,.28);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 1rem;
  box-shadow: 0 0 18px rgba(251,113,133,.14);
}
.ml-sb-modal-title {
  font-family: var(--sb-font-d);
  font-size: 1.18rem; font-weight: 700; letter-spacing: -.4px;
  color: var(--sb-ink); margin-bottom: .45rem;
}
.ml-sb-modal-body {
  color: var(--sb-ink3); font-family: var(--sb-font-b);
  font-size: .875rem; line-height: 1.65; margin-bottom: 1.55rem;
}
.ml-sb-modal-actions { display: flex; gap: .72rem; }
.ml-sb-modal-cancel {
  flex: 1; padding: .7rem 1rem; border-radius: 11px;
  background: rgba(167,139,250,.06);
  border: 1px solid var(--sb-bdr2);
  color: var(--sb-ink2);
  font-family: var(--sb-font-d); font-size: .875rem; font-weight: 600;
  cursor: pointer;
  transition: background .2s, color .2s, transform .18s var(--sb-spring);
}
.ml-sb-modal-cancel:hover {
  background: rgba(167,139,250,.12); color: var(--sb-ink);
  transform: translateY(-1px);
}
.ml-sb-modal-confirm {
  flex: 1; padding: .7rem 1rem; border-radius: 11px;
  background: linear-gradient(135deg, var(--sb-coral), var(--sb-rose));
  border: none; color: #fff;
  font-family: var(--sb-font-d); font-size: .875rem; font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(255,107,157,.35);
  transition: transform .18s var(--sb-spring), box-shadow .18s, filter .18s;
}
.ml-sb-modal-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 26px rgba(255,107,157,.48);
  filter: brightness(1.04);
}
.ml-sb-modal-confirm:active { transform: none; }
`;

/* ══════════════ NAV ITEM DEFINITIONS ══════════════ */
const NAV_ITEMS = [
  { to: '/dashboard',     Icon: LayoutDashboard, label: 'Dashboard'     },
  { to: '/modules',       Icon: BookOpen,        label: 'My Modules'    },
  { to: '/pitch-coach',   Icon: MessageSquare,   label: 'Pitch Coach'   },
  { to: '/startup-brief', Icon: FileText,        label: 'Startup Brief' },
  { to: '/documents',     Icon: FolderDown,      label: 'My Documents'  },
  { to: '/profile',       Icon: User,            label: 'My Profile'    },
  { to: '/subscription',  Icon: CreditCard,      label: 'Subscription'  },
];

/* ══════════════ CSS INJECTION (once) ══════════════ */
function useSidebarCSS() {
  useEffect(() => {
    const id = 'ml-sb-css-v4';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = SIDEBAR_CSS;
    document.head.appendChild(style);

  
    const fontId = 'ml-fonts';
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId; link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap';
      document.head.appendChild(link);
    }
  }, []);
}

/* ══════════════════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════════════════ */
const Sidebar = ({ isOpen: isOpenProp, onClose: onCloseProp }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * SELF-CONTAINED STATE
   * If a parent passes isOpen / onClose we respect them (controlled mode).
   * Otherwise we manage open state ourselves (uncontrolled mode).
   * Either way the hamburger button always works.
   */
  const [internalOpen, setInternalOpen] = useState(false);
  const [showLogout,   setShowLogout]   = useState(false);
  const isFirstRender = useRef(true);

  useSidebarCSS();

  /* Determine whether we are in controlled or uncontrolled mode */
  const isControlled = isOpenProp !== undefined;
  const isOpen       = isControlled ? isOpenProp : internalOpen;

  const openSidebar = () => {
    if (isControlled) { /* parent handles */ }
    else setInternalOpen(true);
  };

  const closeSidebar = () => {
    if (isControlled && onCloseProp) { onCloseProp(); }
    else setInternalOpen(false);
  };

  /* Lock body scroll on mobile while open */
  useEffect(() => {
    if (window.innerWidth <= 900) {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* Close on route change (skip first render to avoid closing on mount) */
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    closeSidebar();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Avatar initial */
  const avatarLetter = user ? (user.name || 'U')[0].toUpperCase() : 'U';

  const handleLogoutConfirm = () => {
    logout();
    setShowLogout(false);
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="ml-sb-root">

      {/* ════ HAMBURGER (mobile, always rendered) ════ */}
      <button
        className="ml-sb-hamburger"
        onClick={openSidebar}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
      >
        <Menu size={18} strokeWidth={2} />
      </button>

      {/* ════ BACKDROP (mobile only via CSS) ════ */}
      <div
        className={`ml-sb-overlay${isOpen ? ' open' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* ════ SIDEBAR PANEL ════ */}
      <aside
        className={`ml-sb-panel${isOpen ? ' open' : ''}`}
        aria-label="Main navigation"
      >
        {/* ── Close X (mobile) ── */}
        <button
          className="ml-sb-close"
          onClick={closeSidebar}
          aria-label="Close navigation"
        >
          <X size={14} strokeWidth={2.5} />
        </button>

        {/* ── Brand ── */}
        <div className="ml-sb-brand">
          <div className="ml-sb-gem" aria-hidden="true">M</div>
          <span className="ml-sb-wordmark">
            Mind<span>Launch</span>
          </span>
        </div>

        {/* ── Profile card ── */}
        <div className="ml-sb-profile">
          <div className="ml-sb-avatar" aria-hidden="true">{avatarLetter}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="ml-sb-name" title={user.name}>{user.name}</div>
            {user.plan === 'premium' ? (
              <div className="ml-sb-badge ml-sb-badge-premium">
                <Sparkles size={8} strokeWidth={2.5} />
                Premium
              </div>
            ) : (
              <div className="ml-sb-badge ml-sb-badge-free">
                Free Tier
              </div>
            )}
          </div>
        </div>

        {/* ── Section label ── */}
        <div className="ml-sb-section-label">Navigation</div>

        {/* ── Nav links ── */}
        <nav className="ml-sb-nav" role="navigation" aria-label="Main">
          {NAV_ITEMS.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `ml-sb-item${isActive ? ' sb-active' : ''}`
              }
              /* onClick handled by route-change effect above */
              end={to === '/dashboard'} /* exact match for dashboard only */
            >
              <span className="ml-sb-ico" aria-hidden="true">
                <Icon size={14} strokeWidth={2} />
              </span>
              {label}
              <ChevronRight
                size={12}
                strokeWidth={2.5}
                className="ml-sb-chev"
                aria-hidden="true"
              />
            </NavLink>
          ))}
        </nav>

        {/* ── Divider ── */}
        <div className="ml-sb-divider" />

        {/* ── Footer ── */}
        <div className="ml-sb-footer">
          <button
            className="ml-sb-logout"
            onClick={() => setShowLogout(true)}
            aria-label="Log out"
          >
            <span className="ml-sb-ico" aria-hidden="true">
              <LogOut size={14} strokeWidth={2} />
            </span>
            Log out
            <ChevronRight
              size={12}
              strokeWidth={2.5}
              className="ml-sb-chev"
              aria-hidden="true"
            />
          </button>

          <div className="ml-sb-ver" aria-label="Claude API status: live">
            <div className="ml-sb-ver-dot" aria-hidden="true" />
            Claude API live · v2.0
          </div>
        </div>
      </aside>

      {/* ════ LOGOUT MODAL ════ */}
      {showLogout && (
        <div
          className="ml-sb-modal-overlay"
          onClick={() => setShowLogout(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sb-logout-title"
        >
          <div
            className="ml-sb-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="ml-sb-modal-ico" aria-hidden="true">
              <AlertTriangle size={22} color="#FB7185" strokeWidth={2} />
            </div>
            <h3 className="ml-sb-modal-title" id="sb-logout-title">
              Confirm logout
            </h3>
            <p className="ml-sb-modal-body">
              Are you sure you want to log out? You'll need to sign in again
              to access your dashboard and learning modules.
            </p>
            <div className="ml-sb-modal-actions">
              <button
                className="ml-sb-modal-cancel"
                onClick={() => setShowLogout(false)}
              >
                Cancel
              </button>
              <button
                className="ml-sb-modal-confirm"
                onClick={handleLogoutConfirm}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Sidebar;