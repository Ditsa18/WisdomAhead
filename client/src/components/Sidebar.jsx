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

/* ═══════════════════════════════════════════════════════════════════════════
   MindLaunch Sidebar — v3
   ─────────────────────────────────────────────────────────────────────────
   SELF-CONTAINED: manages its own open/close state internally.
   Parent only needs to render <Sidebar /> — no props required.

   Fixes vs v2:
   • Self-contained hamburger button (fixed top-left on mobile) — no parent
     wiring needed at all. Works out of the box.
   • Overlay is properly pointer-events:none when closed so it never
     blocks page clicks.
   • Route-change auto-close uses a firstRender ref to skip the initial mount.
   • Body scroll is locked while sidebar is open on mobile.
   • All NavLinks use onClick to close AND navigate correctly (react-router).
   • No emojis. All icons from lucide-react.
═══════════════════════════════════════════════════════════════════════════ */

/* ══════════════ SCOPED CSS (injected once into <head>) ══════════════ */
const SIDEBAR_CSS = `
/* ── Root variables ── */
.ml-sb-root {
  --sb-bg:        #07070F;
  --sb-surf:      rgba(255,255,255,.03);
  --sb-surf2:     rgba(255,255,255,.065);
  --sb-bdr:       rgba(255,255,255,.065);
  --sb-bdr2:      rgba(255,255,255,.12);
  --sb-violet:    #7B5CF5;
  --sb-violet2:   #9D7DFF;
  --sb-gold:      #F5A623;
  --sb-gold2:     #FFD166;
  --sb-emerald:   #06D6A0;
  --sb-rose:      #FF6B6B;
  --sb-text:      #F0EFF8;
  --sb-text2:     #8B8AA8;
  --sb-text3:     #3D3C56;
  --sb-w:         242px;
  --sb-ease:      cubic-bezier(.25,.46,.45,.94);
  --sb-spring:    cubic-bezier(.34,1.56,.64,1);
  --sb-font-d:    'Outfit', sans-serif;
  --sb-font-b:    'Plus Jakarta Sans', sans-serif;
  --sb-font-m:    'JetBrains Mono', monospace;
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
  background: rgba(7,7,15,.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(123,92,245,.3);
  color: #9D7DFF;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0,0,0,.4), 0 0 0 1px rgba(123,92,245,.15);
  transition: background .2s var(--sb-ease), border-color .2s, box-shadow .2s,
              transform .18s var(--sb-spring);
}
.ml-sb-hamburger:hover {
  background: rgba(123,92,245,.15);
  border-color: rgba(123,92,245,.6);
  box-shadow: 0 4px 24px rgba(0,0,0,.5), 0 0 16px rgba(123,92,245,.3);
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
  background: rgba(4,4,12,.75);
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
  background: var(--sb-bg);
  border-right: 1px solid var(--sb-bdr);
  display: flex;
  flex-direction: column;
  z-index: 360;
  overflow: hidden;
  /* Desktop: always visible */
  transform: translateX(0);
  transition: transform .32s var(--sb-ease), box-shadow .32s var(--sb-ease);
  /* Grain texture */
  background-image:
    linear-gradient(180deg, rgba(123,92,245,.045) 0%, transparent 45%, rgba(123,92,245,.02) 100%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.018'/%3E%3C/svg%3E");
}
/* Right-edge violet glow */
.ml-sb-panel::after {
  content: '';
  position: absolute;
  top: 0; right: -1px; bottom: 0; width: 1px;
  background: linear-gradient(180deg,
    transparent 0%,
    rgba(123,92,245,.4) 30%,
    rgba(157,125,255,.22) 65%,
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
    box-shadow: 28px 0 90px rgba(0,0,0,.65), 3px 0 0 rgba(123,92,245,.18);
  }
}

/* ════ CLOSE BUTTON (inside panel, mobile only) ════ */
.ml-sb-close {
  position: absolute;
  top: .9rem; right: .9rem;
  width: 28px; height: 28px;
  border-radius: 8px;
  background: var(--sb-surf2);
  border: 1px solid var(--sb-bdr2);
  color: var(--sb-text2);
  display: none;
  align-items: center; justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background .2s, color .2s, transform .22s var(--sb-spring);
}
.ml-sb-close:hover {
  background: rgba(255,107,107,.14);
  color: var(--sb-rose);
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
  background: linear-gradient(135deg, #7B5CF5, #4F35C5);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: flex; align-items: center; justify-content: center;
  font-size: .84rem; font-weight: 900; color: #fff;
  box-shadow: 0 0 22px rgba(123,92,245,.45);
  flex-shrink: 0;
  animation: sbGemPulse 4s ease-in-out infinite;
}
@keyframes sbGemPulse {
  0%,100% { box-shadow: 0 0 22px rgba(123,92,245,.45); }
  50%      { box-shadow: 0 0 38px rgba(123,92,245,.8);  }
}
.ml-sb-wordmark {
  font-family: var(--sb-font-d);
  font-size: 1.17rem; font-weight: 800; letter-spacing: -.3px;
  color: var(--sb-text);
}
.ml-sb-wordmark span { color: var(--sb-violet2); }

/* ════ PROFILE CARD ════ */
.ml-sb-profile {
  margin: .95rem .8rem .4rem;
  padding: .85rem .95rem;
  border-radius: 14px;
  background: var(--sb-surf);
  border: 1px solid var(--sb-bdr);
  display: flex; align-items: center; gap: .72rem;
  position: relative; overflow: hidden;
  flex-shrink: 0;
}
/* shimmer sweep */
.ml-sb-profile::before {
  content: '';
  position: absolute;
  top: 0; left: -100%; bottom: 0; width: 55%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.04), transparent);
  animation: sbShimmer 5.5s ease-in-out infinite;
  pointer-events: none;
}
@keyframes sbShimmer { 0%{left:-100%} 100%{left:220%} }

.ml-sb-avatar {
  width: 35px; height: 35px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(123,92,245,.28), rgba(79,53,197,.18));
  border: 1px solid rgba(123,92,245,.38);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--sb-font-d);
  font-size: .88rem; font-weight: 800; color: #C4B1FF;
  flex-shrink: 0;
  box-shadow: 0 0 12px rgba(123,92,245,.22);
  transition: box-shadow .3s;
}
.ml-sb-profile:hover .ml-sb-avatar {
  box-shadow: 0 0 22px rgba(123,92,245,.48);
}
.ml-sb-name {
  font-family: var(--sb-font-d);
  font-size: .83rem; font-weight: 700; letter-spacing: -.15px;
  color: var(--sb-text);
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
  background: linear-gradient(135deg, rgba(245,166,35,.18), rgba(245,166,35,.07));
  border: 1px solid rgba(245,166,35,.35);
  color: var(--sb-gold2);
  animation: sbBadgeGold 3.5s ease-in-out infinite;
}
@keyframes sbBadgeGold { 0%,100%{box-shadow:none}50%{box-shadow:0 0 10px rgba(245,166,35,.25)} }
.ml-sb-badge-free {
  background: rgba(123,92,245,.12);
  border: 1px solid rgba(123,92,245,.26);
  color: #C4B1FF;
}

/* ════ SECTION LABEL ════ */
.ml-sb-section-label {
  padding: .85rem 1.15rem .3rem;
  font-family: var(--sb-font-m);
  font-size: .57rem; font-weight: 500; letter-spacing: .13em;
  text-transform: uppercase; color: var(--sb-text3);
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
  color: var(--sb-text2);
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
  background: radial-gradient(circle at 28% 50%, rgba(123,92,245,.11), transparent 68%);
  opacity: 0; transition: opacity .28s;
  pointer-events: none;
}
.ml-sb-item:hover {
  color: var(--sb-text);
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
  background: rgba(255,255,255,.04);
  border: 1px solid var(--sb-bdr);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background .22s, border-color .22s, box-shadow .22s, color .22s;
}
.ml-sb-item:hover .ml-sb-ico {
  background: rgba(123,92,245,.13);
  border-color: rgba(123,92,245,.28);
}

/* chevron */
.ml-sb-chev {
  margin-left: auto;
  opacity: 0;
  transform: translateX(-5px);
  transition: opacity .2s, transform .2s var(--sb-spring);
  flex-shrink: 0;
  color: var(--sb-violet2);
}
.ml-sb-item:hover .ml-sb-chev,
.ml-sb-item.sb-active .ml-sb-chev { opacity: 1; transform: translateX(0); }

/* ── ACTIVE STATE ── */
.ml-sb-item.sb-active {
  color: #C4B1FF;
  background: linear-gradient(135deg, rgba(123,92,245,.17), rgba(123,92,245,.08));
  border-color: rgba(123,92,245,.33);
  box-shadow: 0 4px 22px rgba(123,92,245,.13), inset 0 1px 0 rgba(255,255,255,.05);
  transform: translateX(4px);
}
/* left accent bar */
.ml-sb-item.sb-active::after {
  content: '';
  position: absolute;
  left: 0; top: 18%; bottom: 18%; width: 3px;
  background: linear-gradient(180deg, var(--sb-violet), var(--sb-violet2));
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 10px var(--sb-violet);
}
.ml-sb-item.sb-active .ml-sb-ico {
  background: rgba(123,92,245,.24);
  border-color: rgba(123,92,245,.5);
  box-shadow: 0 0 14px rgba(123,92,245,.3);
  color: #C4B1FF;
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
  color: var(--sb-text2);
  font-family: var(--sb-font-b);
  font-size: .83rem; font-weight: 500; letter-spacing: -.1px;
  cursor: pointer;
  transition: all .22s var(--sb-ease);
  -webkit-tap-highlight-color: transparent;
}
.ml-sb-logout:hover {
  color: var(--sb-rose);
  background: rgba(255,107,107,.08);
  border-color: rgba(255,107,107,.22);
  transform: translateX(4px);
}
.ml-sb-logout:hover .ml-sb-ico {
  background: rgba(255,107,107,.13);
  border-color: rgba(255,107,107,.28);
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
  background: rgba(255,255,255,.02);
  border: 1px solid var(--sb-bdr);
  color: var(--sb-text3);
  font-family: var(--sb-font-m);
  font-size: .56rem; letter-spacing: .06em;
}
.ml-sb-ver-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--sb-emerald);
  box-shadow: 0 0 6px var(--sb-emerald);
  animation: sbVdot 2.5s ease-in-out infinite;
}
@keyframes sbVdot { 0%,100%{opacity:1}50%{opacity:.35} }

/* ════ LOGOUT MODAL ════ */
.ml-sb-modal-overlay {
  position: fixed; inset: 0;
  background: rgba(4,4,12,.78);
  backdrop-filter: blur(12px) saturate(140%);
  z-index: 500;
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
  animation: sbFadeOverlay .22s var(--sb-ease);
}
@keyframes sbFadeOverlay { from{opacity:0} to{opacity:1} }
.ml-sb-modal {
  background: linear-gradient(145deg, #111128, #0E0E22);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 22px;
  padding: 2rem;
  max-width: 400px; width: 100%;
  box-shadow: 0 32px 90px rgba(0,0,0,.65), 0 0 0 1px rgba(123,92,245,.07);
  animation: sbModalPop .28s var(--sb-spring);
  position: relative; overflow: hidden;
}
.ml-sb-modal::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,107,107,.65) 50%, transparent);
}
@keyframes sbModalPop { from{opacity:0;transform:scale(.92) translateY(12px)} to{opacity:1;transform:none} }
.ml-sb-modal-ico {
  width: 50px; height: 50px; border-radius: 14px;
  background: rgba(255,107,107,.12);
  border: 1px solid rgba(255,107,107,.25);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 1rem;
  box-shadow: 0 0 22px rgba(255,107,107,.15);
}
.ml-sb-modal-title {
  font-family: var(--sb-font-d);
  font-size: 1.18rem; font-weight: 800; letter-spacing: -.4px;
  color: var(--sb-text); margin-bottom: .45rem;
}
.ml-sb-modal-body {
  color: var(--sb-text2); font-family: var(--sb-font-b);
  font-size: .875rem; line-height: 1.65; margin-bottom: 1.55rem;
}
.ml-sb-modal-actions { display: flex; gap: .72rem; }
.ml-sb-modal-cancel {
  flex: 1; padding: .7rem 1rem; border-radius: 11px;
  background: rgba(255,255,255,.04);
  border: 1px solid var(--sb-bdr2);
  color: var(--sb-text2);
  font-family: var(--sb-font-d); font-size: .875rem; font-weight: 600;
  cursor: pointer;
  transition: background .2s, color .2s, transform .18s var(--sb-spring);
}
.ml-sb-modal-cancel:hover {
  background: rgba(255,255,255,.08); color: var(--sb-text);
  transform: translateY(-1px);
}
.ml-sb-modal-confirm {
  flex: 1; padding: .7rem 1rem; border-radius: 11px;
  background: linear-gradient(135deg, #FF6B6B, #FF3D3D);
  border: none; color: #fff;
  font-family: var(--sb-font-d); font-size: .875rem; font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 18px rgba(255,107,107,.38);
  transition: transform .18s var(--sb-spring), box-shadow .18s, filter .18s;
}
.ml-sb-modal-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(255,107,107,.55);
  filter: brightness(1.08);
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
    const id = 'ml-sb-css-v3';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = SIDEBAR_CSS;
    document.head.appendChild(style);

    const fontId = 'ml-sb-fonts';
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId; link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';
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
              <AlertTriangle size={22} color="#FF6B6B" strokeWidth={2} />
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