import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';

/*
  MindLaunch — Profile.jsx v3
  ───────────────────────────
  • Matches Dashboard v3 theme exactly
    (cream bg, lavender/coral/mint/peach tokens, glassmorphism, blob mesh)
  • No topbar — sits inside existing layout shell
  • No Three.js, no custom cursor
  • Space Grotesk + Inter + JetBrains Mono fonts
  • Animated stat cards, glassmorphism cards, scroll-reveal
*/

/* ── Font injection (same as Dashboard) ── */
const injectFonts = () => {
  if (document.getElementById('ml-fonts')) return;
  const l = document.createElement('link');
  l.id = 'ml-fonts'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(l);
};

/* ══════════════════════════════════════════════════════════════
   SVG ICONS — same Ic helper as Dashboard
══════════════════════════════════════════════════════════════ */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 2, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const Icons = {
  User:        ({ s = 15 }) => <Ic size={s} d={['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z']} />,
  Sparkles:    ({ s = 15 }) => <Ic size={s} fill="currentColor" stroke="none" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  Target:      ({ s = 15 }) => <Ic size={s} d={['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z']} />,
  Compass:     ({ s = 15 }) => <Ic size={s} d={['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z']} />,
  Award:       ({ s = 15 }) => <Ic size={s} d={['M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12']} />,
  Save:        ({ s = 15 }) => <Ic size={s} d={['M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z', 'M17 21v-8H7v8', 'M7 3v5h8']} />,
  Check:       ({ s = 15 }) => <Ic size={s} d="M20 6L9 17l-5-5" />,
  CheckCircle: ({ s = 15 }) => <Ic size={s} d={['M22 11.08V12a10 10 0 1 1-5.93-9.14', 'M22 4L12 14.01l-3-3']} />,
  Camera:      ({ s = 15 }) => <Ic size={s} d={['M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z', 'M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z']} />,
  Mail:        ({ s = 15 }) => <Ic size={s} d={['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', 'M22 6l-10 7L2 6']} />,
  MapPin:      ({ s = 15 }) => <Ic size={s} d={['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z', 'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z']} />,
  Briefcase:   ({ s = 15 }) => <Ic size={s} d={['M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z', 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16']} />,
  Clock:       ({ s = 15 }) => <Ic size={s} d={['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2']} />,
  TrendUp:     ({ s = 15 }) => <Ic size={s} d={['M22 7l-8.5 8.5-5-5L2 17', 'M16 7h6v6']} />,
  Zap:         ({ s = 15 }) => <Ic size={s} fill="currentColor" stroke="none" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  ChevRight:   ({ s = 15 }) => <Ic size={s} d="M9 18l6-6-6-6" />,
  Edit:        ({ s = 15 }) => <Ic size={s} d={['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7', 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z']} />,
  Layers:      ({ s = 15 }) => <Ic size={s} d={['M12 2L2 7l10 5 10-5-10-5z', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5']} />,
  Alert:       ({ s = 15 }) => <Ic size={s} d={['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 8v4', 'M12 16h.01']} />,
};

/* ══════════════════════════════════════════════════════════════
   CSS — mirrors Dashboard token system exactly
══════════════════════════════════════════════════════════════ */
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
:root{
  --bg:#FEFCF9;
  --bg2:#FFFFFF;
  --bg3:#F8F6FF;
  --bg4:#FFF5F8;
  --ink:#1A1625;
  --ink2:#4A4458;
  --ink3:#8B849B;
  --lavender:#A78BFA;
  --lavender-light:#DDD6FE;
  --coral:#FF6B9D;
  --coral-light:#FECDD3;
  --mint:#6EE7B7;
  --mint-light:#D1FAE5;
  --sky:#7DD3FC;
  --peach:#FBBF24;
  --peach-light:#FEF3C7;
  --rose:#FB7185;
  --border:rgba(167,139,250,.15);
  --border2:rgba(167,139,250,.25);
  --glass:rgba(255,255,255,.7);
  --glass-border:rgba(255,255,255,.5);
  --shadow-sm:0 2px 8px rgba(167,139,250,.08);
  --shadow-md:0 8px 24px rgba(167,139,250,.12);
  --shadow-lg:0 16px 48px rgba(167,139,250,.15);
  --shadow-xl:0 24px 64px rgba(167,139,250,.18);
  --r:16px;--rl:24px;--rp:100px;
  --ease:cubic-bezier(.25,.46,.45,.94);
  --spring:cubic-bezier(.34,1.56,.64,1);
  --font-d:'Space Grotesk',sans-serif;
  --font-b:'Inter',sans-serif;
  --font-m:'JetBrains Mono',monospace;
}
body{background:var(--bg);color:var(--ink);font-family:var(--font-b);overflow-x:hidden;min-height:100vh}

@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes blob-morph{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}50%{border-radius:50% 60% 30% 60%/30% 40% 70% 60%}75%{border-radius:60% 40% 60% 40%/40% 30% 60% 50%}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse-glow{0%,100%{box-shadow:0 0 14px rgba(167,139,250,.3)}50%{box-shadow:0 0 26px rgba(167,139,250,.5)}}
@keyframes avatar-pulse{0%,100%{box-shadow:0 0 0 0 rgba(167,139,250,.25),0 0 20px rgba(167,139,250,.2)}50%{box-shadow:0 0 0 6px rgba(167,139,250,.08),0 0 32px rgba(167,139,250,.3)}}
@keyframes shimmer{0%{left:-100%}100%{left:220%}}
@keyframes alert-in{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}

/* ── MESH BG ── */
.pf-mesh-bg{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;background:var(--bg)}
.pf-mesh-bg .mesh-blob{position:absolute;filter:blur(80px);opacity:.45;animation:blob-morph 22s ease-in-out infinite}
.pf-blob-1{width:560px;height:560px;background:linear-gradient(135deg,rgba(167,139,250,.35),rgba(255,107,157,.25));top:-12%;left:-8%;animation-delay:0s}
.pf-blob-2{width:480px;height:480px;background:linear-gradient(135deg,rgba(110,231,183,.28),rgba(125,211,252,.25));top:35%;right:-12%;animation-delay:-6s}
.pf-blob-3{width:420px;height:420px;background:linear-gradient(135deg,rgba(251,191,36,.25),rgba(251,113,133,.2));bottom:-8%;left:25%;animation-delay:-11s}
.pf-noise{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.02;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* ── SHELL ── */
.pf-shell{position:relative;z-index:2;min-height:100vh}

/* ── PAGE BODY ── */
.pf-body{padding:2rem;display:flex;flex-direction:column;gap:2rem;max-width:1280px;margin:0 auto;width:100%}

/* ── PAGE HEADER ── */
.pf-page-hdr{
  display:flex;align-items:flex-start;justify-content:space-between;
  gap:1rem;flex-wrap:wrap;
  animation:fadeUp .6s var(--ease) both;
}
.pf-page-title{font-family:var(--font-d);font-size:1.85rem;font-weight:700;letter-spacing:-1px;line-height:1.2;color:var(--ink);margin-bottom:.3rem}
.pf-grad{background:linear-gradient(135deg,var(--lavender),var(--coral));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.pf-page-sub{font-size:.9rem;color:var(--ink3);line-height:1.65;max-width:500px}

/* ── ALERTS ── */
.pf-alert{
  padding:.9rem 1.15rem;border-radius:var(--r);
  font-size:.875rem;display:flex;align-items:center;gap:.65rem;
  animation:alert-in .4s var(--ease) both;
}
.pf-alert-success{background:rgba(110,231,183,.1);border:1px solid rgba(110,231,183,.28);color:#059669}
.pf-alert-error{background:rgba(255,107,157,.08);border:1px solid rgba(255,107,157,.22);color:var(--coral)}

/* ── PROFILE HERO CARD (gradient-border like Dashboard upgrade banner) ── */
.pf-hero-wrap{
  border-radius:var(--rl);position:relative;overflow:hidden;
  animation:fadeUp .6s .06s var(--ease) both;
}
.pf-hero-wrap::before{
  content:'';position:absolute;inset:0;border-radius:var(--rl);padding:2px;
  background:linear-gradient(135deg,var(--lavender),var(--coral),var(--mint));
  -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;
}
.pf-hero-in{
  background:var(--glass);backdrop-filter:blur(20px);
  border-radius:calc(var(--rl) - 2px);
  padding:2rem 2.2rem;
  display:flex;align-items:center;gap:2rem;flex-wrap:wrap;
  position:relative;overflow:hidden;
}
.pf-hero-in::after{
  content:'';position:absolute;top:0;left:-100%;bottom:0;width:45%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent);
  animation:shimmer 8s ease-in-out infinite;pointer-events:none;
}

/* Avatar */
.pf-avatar-wrap{position:relative;flex-shrink:0}
.pf-avatar{
  width:96px;height:96px;border-radius:50%;
  background:linear-gradient(135deg,var(--lavender),var(--coral));
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;
  border:3px solid rgba(167,139,250,.35);
  animation:avatar-pulse 4s ease-in-out infinite;
}
.pf-avatar img{width:100%;height:100%;object-fit:cover}
.pf-avatar-letter{font-family:var(--font-d);font-size:2.4rem;font-weight:700;color:#fff}
.pf-avatar-edit{
  position:absolute;bottom:2px;right:2px;
  width:30px;height:30px;border-radius:50%;
  background:linear-gradient(135deg,var(--peach),#F59E0B);
  border:2px solid var(--bg2);
  display:flex;align-items:center;justify-content:center;
  color:#3A2400;cursor:pointer;
  transition:all .25s var(--spring);
}
.pf-avatar-edit:hover{transform:scale(1.12);box-shadow:0 0 14px rgba(251,191,36,.5)}

/* Hero info */
.pf-hero-info{flex:1;min-width:0}
.pf-hero-badge{
  display:inline-flex;align-items:center;gap:.32rem;
  padding:.24rem .72rem;border-radius:var(--rp);
  font-size:.65rem;font-weight:800;letter-spacing:.06em;
  text-transform:uppercase;font-family:var(--font-m);margin-bottom:.55rem;
}
.pf-badge-premium{background:linear-gradient(135deg,var(--peach),#F59E0B);color:#3A2400}
.pf-badge-free{background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.28);color:var(--lavender)}
.pf-hero-name{font-family:var(--font-d);font-size:1.6rem;font-weight:700;letter-spacing:-.5px;color:var(--ink);margin-bottom:.5rem}
.pf-hero-meta{display:flex;flex-wrap:wrap;gap:.65rem;align-items:center;font-size:.84rem;color:var(--ink3)}
.pf-meta-item{display:flex;align-items:center;gap:.35rem}
.pf-meta-dot{width:4px;height:4px;background:var(--border2);border-radius:50%}

/* ── STAT CARDS (matches Dashboard) ── */
.pf-stats-row{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:1rem;
  animation:fadeUp .6s .1s var(--ease) both;
}
.pf-stat{
  background:var(--glass);backdrop-filter:blur(16px);
  border:1px solid var(--glass-border);
  border-radius:var(--rl);
  padding:1.25rem 1.4rem;
  display:flex;flex-direction:column;gap:.6rem;
  position:relative;overflow:hidden;
  box-shadow:var(--shadow-md);
  transition:all .3s var(--spring);
  opacity:0;transform:translateY(14px);
}
.pf-stat.vis{opacity:1;transform:none}
.pf-stat::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--stat-grad,linear-gradient(90deg,var(--lavender),var(--coral)));opacity:0;transition:opacity .3s}
.pf-stat:hover{border-color:var(--stat-border,rgba(167,139,250,.3));transform:translateY(-5px);box-shadow:var(--shadow-xl)}
.pf-stat:hover::before{opacity:1}
.pf-stat:hover .pf-stat-ico{transform:scale(1.12) rotate(-6deg)}
.pf-stat-top{display:flex;align-items:center;justify-content:space-between}
.pf-stat-label{font-size:.72rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.08em;font-family:var(--font-m);font-weight:500}
.pf-stat-ico{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .3s var(--spring)}
.pf-stat-val{font-family:var(--font-d);font-size:2rem;font-weight:700;letter-spacing:-1.5px;line-height:1;color:var(--ink)}
.pf-stat-sub{font-size:.72rem;color:var(--ink3)}

.ico-v{background:linear-gradient(135deg,rgba(167,139,250,.18),rgba(255,107,157,.1));border:1px solid rgba(167,139,250,.25);color:var(--lavender)}
.ico-g{background:linear-gradient(135deg,rgba(251,191,36,.18),rgba(255,107,157,.1));border:1px solid rgba(251,191,36,.25);color:#D97706}
.ico-e{background:linear-gradient(135deg,rgba(110,231,183,.18),rgba(125,211,252,.1));border:1px solid rgba(110,231,183,.25);color:#059669}

/* ── GRID ── */
.pf-grid{
  display:grid;grid-template-columns:1fr 1fr;
  gap:1.5rem;
  animation:fadeUp .6s .14s var(--ease) both;
}

/* ── CARDS (same as Dashboard db-card) ── */
.pf-card{
  background:var(--glass);backdrop-filter:blur(16px);
  border:1px solid var(--glass-border);
  border-radius:var(--rl);padding:1.75rem;
  transition:all .3s var(--ease);
  position:relative;overflow:hidden;
  box-shadow:var(--shadow-md);
}
.pf-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,var(--lavender),var(--coral));
  opacity:0;transition:opacity .3s;
}
.pf-card:hover{border-color:rgba(167,139,250,.3);box-shadow:var(--shadow-lg)}
.pf-card:hover::before{opacity:1}
.pf-card-hdr{display:flex;align-items:center;gap:.65rem;margin-bottom:1.35rem;padding-bottom:1rem;border-bottom:1px solid var(--border)}
.pf-card-ico{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center}
.pf-card-ico.lavender{background:linear-gradient(135deg,rgba(167,139,250,.16),rgba(255,107,157,.08));border:1px solid rgba(167,139,250,.22);color:var(--lavender)}
.pf-card-ico.mint{background:linear-gradient(135deg,rgba(110,231,183,.15),rgba(125,211,252,.08));border:1px solid rgba(110,231,183,.22);color:#059669}
.pf-card-title{font-family:var(--font-d);font-size:1.05rem;font-weight:700;letter-spacing:-.3px;color:var(--ink)}

/* ── FORM ── */
.pf-form-group{margin-bottom:1.2rem}
.pf-label{display:block;font-size:.78rem;font-weight:600;color:var(--ink2);margin-bottom:.42rem;font-family:var(--font-m);letter-spacing:.03em;text-transform:uppercase}
.pf-input,.pf-select,.pf-textarea{
  width:100%;padding:.8rem 1rem;
  background:rgba(255,255,255,.8);
  border:1.5px solid var(--border2);
  border-radius:12px;color:var(--ink);
  font-family:var(--font-b);font-size:.875rem;
  transition:all .25s var(--ease);
  box-shadow:var(--shadow-sm);
}
.pf-input::placeholder,.pf-textarea::placeholder{color:var(--ink3)}
.pf-input:focus,.pf-select:focus,.pf-textarea:focus{
  outline:none;border-color:var(--lavender);
  background:#fff;
  box-shadow:0 0 0 3px rgba(167,139,250,.12);
}
.pf-select option{background:var(--bg2);color:var(--ink)}
.pf-textarea{min-height:120px;resize:vertical;line-height:1.65}

/* ── BUTTON ── */
.btn-primary{padding:.7rem 1.5rem;border-radius:var(--rp);background:linear-gradient(135deg,var(--lavender),var(--coral));border:none;cursor:pointer;color:#fff;font-family:var(--font-d);font-size:.9rem;font-weight:700;display:inline-flex;align-items:center;gap:.45rem;box-shadow:0 4px 16px rgba(167,139,250,.3);transition:all .25s var(--spring);white-space:nowrap}
.btn-primary:hover:not(:disabled){transform:translateY(-2px) scale(1.02);box-shadow:0 8px 28px rgba(255,107,157,.4)}
.btn-primary:disabled{opacity:.45;cursor:not-allowed;transform:none}

/* ── DELIVERABLES LIST ── */
.pf-del-list{display:flex;flex-direction:column;gap:.6rem}
.pf-del-item{
  display:flex;justify-content:space-between;align-items:center;
  padding:.95rem 1.15rem;
  background:rgba(255,255,255,.6);
  border:1px solid var(--border);
  border-radius:12px;
  color:var(--ink);text-decoration:none;
  font-size:.875rem;font-weight:500;
  transition:all .3s var(--ease);
  position:relative;overflow:hidden;
  box-shadow:var(--shadow-sm);
}
.pf-del-item::before{
  content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
  background:linear-gradient(180deg,var(--mint),var(--sky));
  border-radius:2px;transform:scaleY(0);transition:transform .3s var(--ease);
}
.pf-del-item:hover{border-color:rgba(110,231,183,.3);background:rgba(110,231,183,.05);transform:translateX(4px);box-shadow:var(--shadow-md)}
.pf-del-item:hover::before{transform:scaleY(1)}
.pf-del-left{display:flex;align-items:center;gap:.65rem}
.pf-del-num{
  font-family:var(--font-m);font-size:.65rem;color:var(--ink3);
  text-transform:uppercase;letter-spacing:.05em;
  background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.18);
  padding:.18rem .5rem;border-radius:var(--rp);
}
.pf-del-title{color:var(--ink);font-weight:600}
.pf-del-arrow{color:#059669;display:flex;align-items:center;gap:.25rem;font-size:.78rem;font-family:var(--font-m);font-weight:600}

/* ── EMPTY STATE ── */
.pf-empty{text-align:center;padding:2.5rem 1.5rem;display:flex;flex-direction:column;align-items:center;gap:.75rem}
.pf-empty-ico{width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,rgba(167,139,250,.12),rgba(255,107,157,.07));border:1px solid rgba(167,139,250,.2);display:flex;align-items:center;justify-content:center;color:var(--lavender);animation:pulse-glow 3s ease-in-out infinite}
.pf-empty-title{font-family:var(--font-d);font-size:1rem;font-weight:700;color:var(--ink)}
.pf-empty-sub{font-size:.82rem;color:var(--ink3);line-height:1.55;max-width:260px}

/* ── LOADING ── */
.pf-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;height:80vh;gap:1rem}
.pf-spin{width:44px;height:44px;border-radius:50%;border:3px solid rgba(167,139,250,.2);border-top-color:var(--lavender);animation:spin .75s linear infinite}
.pf-spin-txt{color:var(--ink3);font-size:.9rem;font-family:var(--font-m)}

/* ── RESPONSIVE ── */
@media(max-width:1024px){.pf-grid{grid-template-columns:1fr}}
@media(max-width:900px){.pf-hero-in{flex-direction:column;align-items:center;text-align:center}.pf-hero-meta{justify-content:center}}
@media(max-width:768px){
  .pf-body{padding:1.25rem}
  .pf-stats-row{grid-template-columns:1fr 1fr}
  .pf-page-title{font-size:1.4rem}
}
@media(max-width:480px){
  .pf-stats-row{grid-template-columns:1fr}
  .pf-avatar{width:80px;height:80px}
  .pf-avatar-letter{font-size:2rem}
  .pf-hero-name{font-size:1.3rem}
}
`;

/* ══════════════════════════════════════════════════════════════
   ANIMATED COUNTER HOOK
══════════════════════════════════════════════════════════════ */
function useCounter(target, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

/* ══════════════════════════════════════════════════════════════
   SCROLL REVEAL HOOK
══════════════════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } }),
      { threshold: .08, rootMargin: '0px 0px -30px 0px' }
    );
    document.querySelectorAll('.pf-stat').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ══════════════════════════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════════════════════════ */
function StatCard({ label, raw, suffix = '', sub, Ico, icoClass, statGrad, statBorder, delay, isText }) {
  const counted = useCounter(!isText ? (raw || 0) : 0, 900);
  return (
    <div className="pf-stat" style={{ '--stat-grad': statGrad, '--stat-border': statBorder, transitionDelay: delay }}>
      <div className="pf-stat-top">
        <span className="pf-stat-label">{label}</span>
        <div className={`pf-stat-ico ${icoClass}`}><Ico /></div>
      </div>
      <div className="pf-stat-val">{isText ? raw : counted}{suffix}</div>
      <div className="pf-stat-sub">{sub}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const Profile = () => {
  const { user, token, updateStartupProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [startupIdea,          setStartupIdea]          = useState(user?.startupIdea || '');
  const [category,              setCategory]              = useState(user?.category || '');
  const [profileImage,          setProfileImage]          = useState(user?.profileImage || '');
  const [profileImagePreview,   setProfileImagePreview]   = useState(user?.profileImage || '');
  const [modules,               setModules]               = useState([]);
  const [stats,                 setStats]                 = useState(null);
  const [loading,               setLoading]               = useState(true);
  const [updating,              setUpdating]              = useState(false);
  const [successMsg,            setSuccessMsg]            = useState('');
  const [errorMsg,              setErrorMsg]              = useState('');

  useReveal();

  const categories = [
    'Tech Startup', 'E-Commerce', 'Fintech', 'Healthtech',
    'Edtech', 'Food & Bev', 'Social Impact', 'Manufacturing', 'Services', 'Other',
  ];

  /* CSS + fonts */
  useEffect(() => {
    injectFonts();
    let el = document.getElementById('pf-css');
    if (!el) { el = document.createElement('style'); el.id = 'pf-css'; document.head.appendChild(el); }
    el.textContent = CSS;
  }, []);

  /* Sync user data */
  useEffect(() => {
    if (user) {
      setStartupIdea(user.startupIdea || '');
      setCategory(user.category || '');
      setProfileImage(user.profileImage || '');
      setProfileImagePreview(user.profileImage || '');
    }
  }, [user]);

  /* Fetch profile data */
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const [modRes, statRes] = await Promise.all([
          fetch(`${API_URL}/modules`,          { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/profile/progress`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (modRes.ok)  setModules(await modRes.json());
        if (statRes.ok) setStats(await statRes.json());
      } catch (err) { console.error('Error loading profile:', err); }
      finally { setLoading(false); }
    })();
  }, [token]);

  const handleSelectedImage = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setProfileImage(reader.result); setProfileImagePreview(reader.result); };
    reader.readAsDataURL(file);
  };

  const handleSave = async e => {
    e.preventDefault();
    setUpdating(true); setSuccessMsg(''); setErrorMsg('');
    try {
      await updateStartupProfile(startupIdea, category, profileImage);
      setSuccessMsg('Profile updated successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save changes. Please try again.');
    } finally { setUpdating(false); }
  };

  const completedModules = modules.filter(m => m.status === 'completed');
  const completedCount   = completedModules.length;
  const currentModule    = stats?.currentModule || 1;
  const timeOnPlatform   = stats?.timeOnPlatform || '0m';

  /* ── Loading ── */
  if (loading) return (
    <>
      <div className="pf-mesh-bg" aria-hidden="true">
        <div className="mesh-blob pf-blob-1" />
        <div className="mesh-blob pf-blob-2" />
        <div className="mesh-blob pf-blob-3" />
      </div>
      <div className="pf-noise" />
      <div className="pf-loading">
        <div className="pf-spin" />
        <p className="pf-spin-txt">Loading profile...</p>
      </div>
    </>
  );

  return (
    <>
      {/* Ambient mesh — identical to Dashboard */}
      <div className="pf-mesh-bg" aria-hidden="true">
        <div className="mesh-blob pf-blob-1" />
        <div className="mesh-blob pf-blob-2" />
        <div className="mesh-blob pf-blob-3" />
      </div>
      <div className="pf-noise" />

      <div className="pf-shell">
        <div className="pf-body">

          {/* ── Page header ── */}
          <div className="pf-page-hdr">
            <div>
              <h1 className="pf-page-title">
                My <span className="pf-grad">Profile</span>
              </h1>
              <p className="pf-page-sub">
                Manage your account settings, startup details, and review your progress metrics.
              </p>
            </div>
          </div>

          {/* ── Alerts ── */}
          {successMsg && (
            <div className="pf-alert pf-alert-success">
              <Icons.CheckCircle s={17} /> {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="pf-alert pf-alert-error">
              <Icons.Alert s={17} /> {errorMsg}
            </div>
          )}

          {/* ── Profile hero card ── */}
          <div className="pf-hero-wrap">
            <div className="pf-hero-in">
              {/* Avatar */}
              <div className="pf-avatar-wrap">
                <div className="pf-avatar">
                  {profileImagePreview
                    ? <img src={profileImagePreview} alt="Profile" />
                    : <span className="pf-avatar-letter">{user?.name?.charAt(0).toUpperCase()}</span>}
                </div>
                <button
                  type="button"
                  className="pf-avatar-edit"
                  onClick={() => fileInputRef.current?.click()}
                  title="Change photo"
                >
                  <Icons.Camera s={13} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleSelectedImage}
                />
              </div>

              {/* Info */}
              <div className="pf-hero-info">
                <div className={`pf-hero-badge ${user?.plan === 'premium' ? 'pf-badge-premium' : 'pf-badge-free'}`}>
                  <Icons.Sparkles s={10} />
                  {user?.plan === 'premium' ? 'Premium Member' : 'Free Account'}
                </div>
                <h2 className="pf-hero-name">{user?.name}</h2>
                <div className="pf-hero-meta">
                  <span className="pf-meta-item"><Icons.Mail s={13} /> {user?.email}</span>
                  {user?.region && (
                    <><span className="pf-meta-dot" /><span className="pf-meta-item"><Icons.MapPin s={13} /> {user.region}</span></>
                  )}
                  {user?.category && (
                    <><span className="pf-meta-dot" /><span className="pf-meta-item"><Icons.Briefcase s={13} /> {user.category}</span></>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Stat cards ── */}
          <div className="pf-stats-row">
            <StatCard
              label="Modules Completed" raw={completedCount} suffix="/30"
              sub="worksheets unlocked"
              Ico={() => <Icons.Award s={15} />} icoClass="ico-v"
              statGrad="linear-gradient(90deg,var(--lavender),var(--coral))"
              statBorder="rgba(167,139,250,.3)"
              delay="0s"
            />
            <StatCard
              label="Active Module" raw={currentModule}
              sub="currently in progress"
              Ico={() => <Icons.Compass s={15} />} icoClass="ico-g"
              statGrad="linear-gradient(90deg,var(--peach),#F59E0B)"
              statBorder="rgba(251,191,36,.3)"
              delay=".05s"
            />
            <StatCard
              label="Time on Platform" raw={timeOnPlatform}
              sub="total learning time"
              Ico={() => <Icons.Clock s={15} />} icoClass="ico-e"
              statGrad="linear-gradient(90deg,var(--mint),var(--sky))"
              statBorder="rgba(110,231,183,.3)"
              delay=".1s"
              isText
            />
          </div>

          {/* ── Grid: Edit Profile + Deliverables ── */}
          <div className="pf-grid">

            {/* Edit Startup Profile */}
            <div className="pf-card">
              <div className="pf-card-hdr">
                <div className="pf-card-ico lavender"><Icons.Target s={17} /></div>
                <h3 className="pf-card-title">Startup Profile</h3>
              </div>

              <form onSubmit={handleSave}>
                <div className="pf-form-group">
                  <label htmlFor="profile-category" className="pf-label">Business Category</label>
                  <select
                    id="profile-category"
                    className="pf-select"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select business category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="pf-form-group">
                  <label htmlFor="profile-idea" className="pf-label">Startup Concept / Pitch Brief</label>
                  <textarea
                    id="profile-idea"
                    className="pf-textarea"
                    value={startupIdea}
                    onChange={e => setStartupIdea(e.target.value)}
                    placeholder="Describe your startup idea in a few sentences..."
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={updating}>
                  <Icons.Save s={14} />
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Completed Deliverables */}
            <div className="pf-card" style={{ transitionDelay: '.06s' }}>
              <div className="pf-card-hdr">
                <div className="pf-card-ico mint"><Icons.CheckCircle s={17} /></div>
                <h3 className="pf-card-title">Completed Deliverables</h3>
              </div>

              {completedModules.length === 0 ? (
                <div className="pf-empty">
                  <div className="pf-empty-ico"><Icons.Layers s={22} /></div>
                  <h4 className="pf-empty-title">No deliverables yet</h4>
                  <p className="pf-empty-sub">Complete your first module to see deliverables here.</p>
                </div>
              ) : (
                <div className="pf-del-list">
                  {completedModules.map(mod => (
                    <Link key={mod.moduleId} to={`/modules/${mod.moduleId}`} className="pf-del-item">
                      <div className="pf-del-left">
                        <span className="pf-del-num">M{String(mod.moduleId).padStart(2, '0')}</span>
                        <span className="pf-del-title">{mod.title}</span>
                      </div>
                      <span className="pf-del-arrow">Review <Icons.ChevRight s={13} /></span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>{/* pf-body */}
      </div>{/* pf-shell */}
    </>
  );
};

export default Profile;