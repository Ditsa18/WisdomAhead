import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { jsPDF } from 'jspdf';


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
  Download:    ({ s = 15 }) => <Ic size={s} d={['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3']} />,
  User:        ({ s = 15 }) => <Ic size={s} d={['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z']} />,
  Globe:       ({ s = 15 }) => <Ic size={s} d={['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M2 12h20', 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z']} />,
  FileText:    ({ s = 15 }) => <Ic size={s} d={['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8']} />,
  BookOpen:    ({ s = 15 }) => <Ic size={s} d={['M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z', 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z']} />,
  Sparkles:    ({ s = 15 }) => <Ic size={s} fill="currentColor" stroke="none" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  Check:       ({ s = 15 }) => <Ic size={s} d="M20 6L9 17l-5-5" />,
  ChevDown:    ({ s = 15 }) => <Ic size={s} d="M6 9l6 6 6-6" />,
  ChevUp:      ({ s = 15 }) => <Ic size={s} d="M18 15l-6-6-6 6" />,
  Target:      ({ s = 15 }) => <Ic size={s} d={['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z']} />,
  Layers:      ({ s = 15 }) => <Ic size={s} d={['M12 2L2 7l10 5 10-5-10-5z', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5']} />,
  Zap:         ({ s = 15 }) => <Ic size={s} fill="currentColor" stroke="none" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  Award:       ({ s = 15 }) => <Ic size={s} d={['M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12']} />,
  TrendUp:     ({ s = 15 }) => <Ic size={s} d={['M22 7l-8.5 8.5-5-5L2 17', 'M16 7h6v6']} />,
  Modules:     ({ s = 15 }) => <Ic size={s} d={['M4 6h16', 'M4 10h16', 'M4 14h16', 'M4 18h16']} />,
  Arrow:       ({ s = 14 }) => <Ic size={s} d={['M5 12h14', 'M12 5l7 7-7 7']} />,
  CheckCircle: ({ s = 15 }) => <Ic size={s} d={['M22 11.08V12a10 10 0 1 1-5.93-9.14', 'M22 4L12 14.01l-3-3']} />,
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
  --sky-light:#E0F2FE;
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
@keyframes shimmer{0%{left:-100%}100%{left:220%}}

/* ── MESH BG (identical to Dashboard) ── */
.sb-mesh-bg{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;background:var(--bg)}
.sb-mesh-bg .mesh-blob{position:absolute;filter:blur(80px);opacity:.45;animation:blob-morph 22s ease-in-out infinite}
.sb-blob-1{width:560px;height:560px;background:linear-gradient(135deg,rgba(167,139,250,.35),rgba(255,107,157,.25));top:-12%;left:-8%;animation-delay:0s}
.sb-blob-2{width:480px;height:480px;background:linear-gradient(135deg,rgba(110,231,183,.28),rgba(125,211,252,.25));top:35%;right:-12%;animation-delay:-6s}
.sb-blob-3{width:420px;height:420px;background:linear-gradient(135deg,rgba(251,191,36,.25),rgba(251,113,133,.2));bottom:-8%;left:25%;animation-delay:-11s}
.sb-noise{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.02;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* ── SHELL ── */
.sb-shell{position:relative;z-index:2;min-height:100vh}

/* ── PAGE BODY (matches Dashboard db-body) ── */
.sb-body{padding:2rem;display:flex;flex-direction:column;gap:2rem;max-width:1280px;margin:0 auto;width:100%}

/* ── PAGE HEADER ── */
.sb-page-hdr{
  display:flex;align-items:flex-start;justify-content:space-between;
  gap:1rem;flex-wrap:wrap;
  animation:fadeUp .6s var(--ease) both;
}
.sb-page-title{font-family:var(--font-d);font-size:1.85rem;font-weight:700;letter-spacing:-1px;line-height:1.2;color:var(--ink);margin-bottom:.3rem}
.sb-page-grad{background:linear-gradient(135deg,var(--lavender),var(--coral));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sb-page-sub{font-size:.9rem;color:var(--ink3);line-height:1.65;max-width:500px}
.sb-page-hdr-acts{display:flex;align-items:center;gap:.65rem;flex-wrap:wrap;flex-shrink:0}

/* ── BUTTONS (match Dashboard) ── */
.btn-primary{padding:.65rem 1.5rem;border-radius:var(--rp);background:linear-gradient(135deg,var(--lavender),var(--coral));border:none;cursor:pointer;color:#fff;font-family:var(--font-d);font-size:.9rem;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:.45rem;box-shadow:0 4px 16px rgba(167,139,250,.3);transition:all .25s var(--spring);white-space:nowrap}
.btn-primary:hover:not(:disabled){transform:translateY(-2px) scale(1.02);box-shadow:0 8px 28px rgba(255,107,157,.4)}
.btn-primary:disabled{opacity:.4;cursor:not-allowed;transform:none}
.btn-peach{padding:.65rem 1.5rem;border-radius:var(--rp);background:linear-gradient(135deg,var(--peach),#F59E0B);border:none;cursor:pointer;color:#3A2400;font-family:var(--font-d);font-size:.9rem;font-weight:700;display:inline-flex;align-items:center;gap:.45rem;box-shadow:0 4px 16px rgba(251,191,36,.25);transition:all .25s var(--spring);white-space:nowrap}
.btn-peach:hover:not(:disabled){transform:translateY(-2px) scale(1.02);box-shadow:0 8px 24px rgba(251,191,36,.4)}
.btn-peach:disabled{opacity:.4;cursor:not-allowed;transform:none}
.btn-ghost-sm{padding:.6rem 1.3rem;border-radius:var(--rp);background:var(--glass);backdrop-filter:blur(10px);border:2px solid var(--border2);cursor:pointer;color:var(--ink2);font-family:var(--font-d);font-size:.85rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:.4rem;transition:all .25s var(--ease);white-space:nowrap}
.btn-ghost-sm:hover{border-color:var(--lavender);color:var(--lavender);background:rgba(167,139,250,.06)}

/* ── STAT CARDS (matches Dashboard db-stats-row) ── */
.sb-stats-row{
  display:grid;grid-template-columns:repeat(4,1fr);
  gap:1rem;
  animation:fadeUp .6s .06s var(--ease) both;
}
.sb-stat{
  background:var(--glass);backdrop-filter:blur(16px);
  border:1px solid var(--glass-border);
  border-radius:var(--rl);
  padding:1.25rem 1.4rem;
  display:flex;flex-direction:column;gap:.6rem;
  position:relative;overflow:hidden;
  box-shadow:var(--shadow-md);
  transition:all .3s var(--spring);
}
.sb-stat::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:var(--stat-grad,linear-gradient(90deg,var(--lavender),var(--coral)));
  opacity:0;transition:opacity .3s;
}
.sb-stat:hover{border-color:var(--stat-border,rgba(167,139,250,.3));transform:translateY(-5px);box-shadow:var(--shadow-xl)}
.sb-stat:hover::before{opacity:1}
.sb-stat:hover .sb-stat-ico{transform:scale(1.12) rotate(-6deg)}
.sb-stat-top{display:flex;align-items:center;justify-content:space-between}
.sb-stat-label{font-size:.72rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.08em;font-family:var(--font-m);font-weight:500}
.sb-stat-ico{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .3s var(--spring)}
.sb-stat-val{font-family:var(--font-d);font-size:2rem;font-weight:700;letter-spacing:-1.5px;line-height:1;color:var(--ink)}
.sb-stat-sub{font-size:.72rem;color:var(--ink3)}

.ico-v{background:linear-gradient(135deg,rgba(167,139,250,.18),rgba(255,107,157,.1));border:1px solid rgba(167,139,250,.25);color:var(--lavender)}
.ico-g{background:linear-gradient(135deg,rgba(251,191,36,.18),rgba(255,107,157,.1));border:1px solid rgba(251,191,36,.25);color:#D97706}
.ico-e{background:linear-gradient(135deg,rgba(110,231,183,.18),rgba(125,211,252,.1));border:1px solid rgba(110,231,183,.25);color:#059669}
.ico-r{background:linear-gradient(135deg,rgba(255,107,157,.16),rgba(251,113,133,.1));border:1px solid rgba(255,107,157,.25);color:var(--coral)}

/* ── META CARD (gradient-border like Dashboard's upgrade banner) ── */
.sb-meta-wrap{
  border-radius:var(--rl);position:relative;overflow:hidden;
  animation:fadeUp .6s .1s var(--ease) both;
}
.sb-meta-wrap::before{
  content:'';position:absolute;inset:0;border-radius:var(--rl);padding:2px;
  background:linear-gradient(135deg,var(--lavender),var(--coral),var(--mint));
  -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;
}
.sb-meta-card{
  background:var(--glass);backdrop-filter:blur(16px);
  border-radius:calc(var(--rl) - 2px);
  padding:1.6rem 1.8rem;
  position:relative;overflow:hidden;
}
/* shimmer sweep */
.sb-meta-card::after{
  content:'';position:absolute;
  top:0;left:-100%;bottom:0;width:50%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent);
  animation:shimmer 8s ease-in-out infinite;pointer-events:none;
}
.sb-meta-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.4rem;margin-bottom:1.4rem}
.sb-meta-item{display:flex;align-items:center;gap:.75rem}
.sb-meta-ico{
  width:40px;height:40px;border-radius:12px;
  background:linear-gradient(135deg,rgba(167,139,250,.14),rgba(255,107,157,.08));
  border:1px solid rgba(167,139,250,.22);
  display:flex;align-items:center;justify-content:center;
  color:var(--lavender);flex-shrink:0;
  box-shadow:0 0 12px rgba(167,139,250,.12);
}
.sb-meta-lbl{font-size:.68rem;color:var(--ink3);margin-bottom:.2rem;font-family:var(--font-m);letter-spacing:.04em;text-transform:uppercase}
.sb-meta-val{font-family:var(--font-d);font-size:.95rem;font-weight:700;color:var(--ink)}
.sb-divider{height:1px;background:var(--border);margin-bottom:1.35rem}

/* Idea box (matches Dashboard db-idea-box) */
.sb-idea-box{
  background:var(--bg2);border:1px solid var(--border);
  border-radius:14px;padding:1.2rem 1.4rem 1.2rem 4rem;
  position:relative;overflow:hidden;
  box-shadow:var(--shadow-sm);
}
.sb-idea-box::before{
  content:'"';position:absolute;top:-14px;left:10px;
  font-size:5rem;font-family:var(--font-d);color:rgba(167,139,250,.1);
  line-height:1;pointer-events:none;
}
.sb-idea-label{font-size:.68rem;color:var(--ink3);font-family:var(--font-m);letter-spacing:.06em;text-transform:uppercase;margin-bottom:.35rem}
.sb-idea-text{font-style:italic;font-size:.9rem;color:var(--ink2);line-height:1.68;position:relative;z-index:1}

/* ── SECTION HEADER ── */
.sb-sec-hdr{
  display:flex;align-items:center;justify-content:space-between;
  gap:1rem;flex-wrap:wrap;
  animation:fadeUp .6s .14s var(--ease) both;
}
.sb-sec-title{font-family:var(--font-d);font-size:1.3rem;font-weight:700;letter-spacing:-.5px;color:var(--ink)}
.sb-sec-sub{font-size:.82rem;color:var(--ink3);margin-top:.2rem}

/* ── EMPTY STATE ── */
.sb-empty{
  text-align:center;padding:4rem 2rem;
  display:flex;flex-direction:column;align-items:center;gap:1rem;
  animation:fadeUp .6s .14s var(--ease) both;
}
.sb-empty-ico{
  width:68px;height:68px;border-radius:20px;
  background:linear-gradient(135deg,rgba(251,191,36,.15),rgba(255,107,157,.1));
  border:1px solid rgba(251,191,36,.25);
  display:flex;align-items:center;justify-content:center;color:var(--peach);
  animation:pulse-glow 3s ease-in-out infinite;
}
.sb-empty-title{font-family:var(--font-d);font-size:1.3rem;font-weight:700;letter-spacing:-.4px;color:var(--ink)}
.sb-empty-sub{font-size:.875rem;color:var(--ink3);line-height:1.65;max-width:400px}
.sb-empty-sub strong{color:var(--ink)}

/* ── MODULE CARDS ── */
.sb-modules-list{display:flex;flex-direction:column;gap:1.1rem;animation:fadeUp .6s .16s var(--ease) both}

.sb-mod-card{
  background:var(--glass);backdrop-filter:blur(16px);
  border:1px solid var(--glass-border);
  border-radius:var(--rl);overflow:hidden;
  transition:all .35s var(--spring);
  position:relative;
  box-shadow:var(--shadow-sm);
  opacity:0;transform:translateY(16px);
  /* revealed by JS */
}
.sb-mod-card.vis{opacity:1;transform:none}
.sb-mod-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,var(--lavender),var(--coral),var(--mint));
  transform:scaleX(0);transform-origin:left;
  transition:transform .4s var(--ease);border-radius:2px;
}
.sb-mod-card:hover{border-color:rgba(167,139,250,.3);transform:translateY(-4px);box-shadow:var(--shadow-xl)}
.sb-mod-card:hover::before,.sb-mod-card.expanded::before{transform:scaleX(1)}
.sb-mod-card.expanded{border-color:rgba(167,139,250,.25);box-shadow:var(--shadow-lg)}

/* Card header */
.sb-mod-hdr{
  display:flex;align-items:center;gap:1rem;
  padding:1.25rem 1.5rem;cursor:pointer;
  transition:background .2s;user-select:none;
}
.sb-mod-hdr:hover{background:rgba(167,139,250,.03)}
.sb-mod-hdr-left{display:flex;align-items:center;gap:.85rem;flex:1;min-width:0}
.sb-mod-num-badge{
  width:40px;height:40px;border-radius:11px;
  background:linear-gradient(135deg,rgba(167,139,250,.15),rgba(255,107,157,.08));
  border:1px solid rgba(167,139,250,.22);
  display:flex;align-items:center;justify-content:center;
  font-family:var(--font-m);font-size:.68rem;font-weight:600;color:var(--lavender);
  flex-shrink:0;transition:all .3s var(--spring);
}
.sb-mod-card:hover .sb-mod-num-badge,
.sb-mod-card.expanded .sb-mod-num-badge{
  background:rgba(167,139,250,.2);border-color:rgba(167,139,250,.4);
  box-shadow:0 0 12px rgba(167,139,250,.2);
}
.sb-mod-hdr-info{flex:1;min-width:0}
.sb-mod-title{
  font-family:var(--font-d);font-size:1rem;font-weight:700;letter-spacing:-.2px;
  color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  margin-bottom:.28rem;
}
.sb-mod-meta{display:flex;align-items:center;gap:.55rem;flex-wrap:wrap}
.sb-track-badge{
  display:inline-flex;align-items:center;gap:.3rem;
  padding:.2rem .6rem;border-radius:var(--rp);
  background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.2);
  color:var(--lavender);font-size:.65rem;font-weight:600;font-family:var(--font-m);
}
.sb-mod-count{font-size:.7rem;color:var(--ink3);font-family:var(--font-m)}

.sb-mod-hdr-right{display:flex;align-items:center;gap:.75rem;flex-shrink:0}
.sb-status-chip{
  display:inline-flex;align-items:center;gap:.3rem;
  padding:.22rem .65rem;border-radius:var(--rp);
  font-size:.68rem;font-weight:600;font-family:var(--font-m);
}
.sb-status-chip.done{background:rgba(110,231,183,.12);border:1px solid rgba(110,231,183,.28);color:#059669}
.sb-status-chip.partial{background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.22);color:var(--lavender)}
.sb-chev{color:var(--ink3);transition:transform .3s var(--ease);flex-shrink:0}
.sb-mod-card.expanded .sb-chev{transform:rotate(180deg)}

/* Answers (accordion) */
.sb-answers-wrap{max-height:0;overflow:hidden;transition:max-height .45s var(--ease)}
.sb-mod-card.expanded .sb-answers-wrap{max-height:9999px}
.sb-answers-inner{border-top:1px solid var(--border);padding:0 1.5rem 1.5rem}

.sb-answers-table{width:100%;border-collapse:collapse;margin-top:1rem;font-size:.875rem}
.sb-answers-table th{
  text-align:left;padding:.6rem .8rem;
  color:var(--ink3);font-family:var(--font-m);font-size:.67rem;
  font-weight:500;letter-spacing:.07em;text-transform:uppercase;
  border-bottom:1px solid var(--border);
}
.sb-answers-table td{padding:.75rem .8rem;border-bottom:1px solid rgba(167,139,250,.06);vertical-align:top}
.sb-answers-table tr:last-child td{border-bottom:none}
.sb-answers-table tbody tr{transition:background .15s}
.sb-answers-table tbody tr:hover td{background:rgba(167,139,250,.04)}
.sb-field-label{font-weight:600;color:var(--ink);width:32%;font-size:.84rem;line-height:1.5}
.sb-field-answer{color:var(--ink2);line-height:1.65;font-size:.84rem;white-space:pre-wrap}
.sb-field-empty{font-style:italic;color:var(--ink3);font-size:.82rem}

/* ── BOTTOM CTA (matches Dashboard's db-coach-cta gradient-border) ── */
.sb-cta-wrap{
  border-radius:var(--rl);position:relative;overflow:hidden;
  animation:fadeUp .6s .22s var(--ease) both;
}
.sb-cta-wrap::before{
  content:'';position:absolute;inset:0;border-radius:var(--rl);padding:2px;
  background:linear-gradient(135deg,var(--peach),var(--coral),var(--lavender),var(--mint));
  -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;
}
.sb-cta-in{
  background:var(--glass);backdrop-filter:blur(20px);
  border-radius:calc(var(--rl) - 2px);
  padding:2rem 2.4rem;
  display:flex;align-items:center;justify-content:space-between;
  gap:2rem;flex-wrap:wrap;
}
.sb-cta-ico{
  width:56px;height:56px;border-radius:16px;
  background:linear-gradient(135deg,rgba(251,191,36,.18),rgba(255,107,157,.1));
  border:1px solid rgba(251,191,36,.28);
  display:flex;align-items:center;justify-content:center;
  color:var(--peach);flex-shrink:0;
  box-shadow:0 0 22px rgba(251,191,36,.18);
  animation:pulse-glow 3s ease-in-out infinite;
}
.sb-cta-text h3{font-family:var(--font-d);font-size:1.15rem;font-weight:700;letter-spacing:-.3px;margin-bottom:.28rem;color:var(--ink)}
.sb-cta-text p{font-size:.875rem;color:var(--ink3);line-height:1.6;max-width:460px}
.sb-cta-acts{display:flex;gap:.75rem;flex-shrink:0;flex-wrap:wrap}

/* ── LOADING ── */
.sb-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;height:80vh;gap:1rem}
.sb-spin{width:44px;height:44px;border-radius:50%;border:3px solid rgba(167,139,250,.2);border-top-color:var(--lavender);animation:spin .75s linear infinite}
.sb-spin-txt{color:var(--ink3);font-size:.9rem;font-family:var(--font-m)}

/* ── RESPONSIVE ── */
@media(max-width:1100px){.sb-stats-row{grid-template-columns:repeat(2,1fr)}}
@media(max-width:900px){
  .sb-meta-grid{grid-template-columns:repeat(2,1fr)}
  .sb-cta-in{flex-direction:column;text-align:center}
  .sb-cta-acts{width:100%}
  .sb-cta-acts .btn-peach,.sb-cta-acts .btn-ghost-sm{flex:1;justify-content:center}
}
@media(max-width:768px){
  .sb-body{padding:1.25rem}
  .sb-stats-row{grid-template-columns:1fr 1fr}
  .sb-page-hdr{flex-direction:column;align-items:flex-start}
  .sb-page-hdr-acts{width:100%}
  .sb-page-hdr-acts .btn-peach,.sb-page-hdr-acts .btn-ghost-sm{flex:1;justify-content:center}
}
@media(max-width:480px){
  .sb-stats-row{grid-template-columns:1fr}
  .sb-meta-grid{grid-template-columns:1fr}
  .sb-idea-box{padding:1.1rem 1rem 1.1rem 3rem}
}
`;

/* ══════════════════════════════════════════════════════════════
   ANIMATED COUNTER HOOK
══════════════════════════════════════════════════════════════ */
function useCounter(target, duration = 1000) {
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
    document.querySelectorAll('.sb-mod-card').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ══════════════════════════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════════════════════════ */
function StatCard({ label, rawVal, suffix = '', sub, IconComp, icoClass, statGrad, statBorder, delay }) {
  const counted = useCounter(rawVal || 0, 1000);
  return (
    <div className="sb-stat" style={{ '--stat-grad': statGrad, '--stat-border': statBorder, animationDelay: delay }}>
      <div className="sb-stat-top">
        <span className="sb-stat-label">{label}</span>
        <div className={`sb-stat-ico ${icoClass}`}><IconComp /></div>
      </div>
      <div className="sb-stat-val">{counted}{suffix}</div>
      <div className="sb-stat-sub">{sub}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MODULE DELIVERABLE CARD
══════════════════════════════════════════════════════════════ */
function ModuleCard({ mod, index }) {
  const [expanded, setExpanded] = useState(index === 0);
  const answeredCount = mod.answers.filter(a => a.answer?.trim()).length;
  const isComplete = answeredCount === mod.answers.length;

  return (
    <div
      className={`sb-mod-card${expanded ? ' expanded' : ''}`}
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      <div
        className="sb-mod-hdr"
        onClick={() => setExpanded(v => !v)}
        role="button"
        aria-expanded={expanded}
      >
        <div className="sb-mod-hdr-left">
          <div className="sb-mod-num-badge">M{String(mod.moduleId).padStart(2, '0')}</div>
          <div className="sb-mod-hdr-info">
            <div className="sb-mod-title">{mod.title}</div>
            <div className="sb-mod-meta">
              <span className="sb-track-badge">
                <Icons.Layers s={10} /> {mod.trackName}
              </span>
              <span className="sb-mod-count">{answeredCount}/{mod.answers.length} answered</span>
            </div>
          </div>
        </div>
        <div className="sb-mod-hdr-right">
          <span className={`sb-status-chip ${isComplete ? 'done' : 'partial'}`}>
            {isComplete
              ? <><Icons.CheckCircle s={10} /> Complete</>
              : <><Icons.Zap s={10} /> Partial</>}
          </span>
          <span className="sb-chev">
            {expanded ? <Icons.ChevUp s={15} /> : <Icons.ChevDown s={15} />}
          </span>
        </div>
      </div>

      <div className="sb-answers-wrap">
        <div className="sb-answers-inner">
          <table className="sb-answers-table">
            <thead>
              <tr>
                <th>Deliverable Field</th>
                <th>Your Answer</th>
              </tr>
            </thead>
            <tbody>
              {mod.answers.map(ans => (
                <tr key={ans.fieldKey}>
                  <td className="sb-field-label">{ans.label}</td>
                  <td className="sb-field-answer">
                    {ans.answer?.trim()
                      ? ans.answer
                      : <span className="sb-field-empty">Not answered yet</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PDF GENERATION (styled to match cream theme)
══════════════════════════════════════════════════════════════ */
function generatePDF(briefData, user) {
  if (!briefData?.length) return;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PW = 210, PH = 297, ML = 18, MR = 18, MT = 18;
  const CW = PW - ML - MR;
  let y = MT;

  const addPage = () => { doc.addPage(); y = MT; };
  const checkY = (needed = 20) => { if (y + needed > PH - 16) addPage(); };

  /* Cover block */
  doc.setFillColor(254, 252, 249);
  doc.rect(0, 0, PW, 62, 'F');
  doc.setFillColor(167, 139, 250);
  doc.rect(0, 62, PW, 1.5, 'F');

  /* Logomark */
  doc.setFillColor(148, 109, 252);
  doc.roundedRect(ML, 18, 12, 12, 2, 2, 'F');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('M', ML + 4.5, 26.5);

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(26, 22, 37);
  doc.text('Mind', ML + 16, 26.5);
  doc.setTextColor(167, 139, 250);
  doc.text('Launch', ML + 34, 26.5);

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(26, 22, 37);
  doc.text('STARTUP BRIEF', ML, 47);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(139, 132, 155);
  doc.text(`Generated ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}  ·  Region: ${user.region || '—'}`, ML, 56);

  y = 74;

  /* Founder meta block */
  doc.setFillColor(248, 246, 255);
  doc.roundedRect(ML, y, CW, 36, 3, 3, 'F');
  doc.setDrawColor(167, 139, 250);
  doc.setLineWidth(.4);
  doc.roundedRect(ML, y, CW, 36, 3, 3, 'S');

  doc.setFont('Helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(167, 139, 250);
  doc.text('FOUNDER', ML + 8, y + 10);
  doc.text('CATEGORY', ML + 68, y + 10);
  doc.text('MODULES', ML + 128, y + 10);

  doc.setFont('Helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(26, 22, 37);
  doc.text(user.name || '—', ML + 8, y + 21);
  doc.text(user.category || '—', ML + 68, y + 21);
  doc.text(`${briefData.length} of 30`, ML + 128, y + 21);

  y += 44;

  /* Startup idea */
  if (user.startupIdea) {
    checkY(28);
    doc.setFont('Helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(167, 139, 250);
    doc.text('CORE STARTUP IDEA', ML, y); y += 6;

    const lines = doc.splitTextToSize(`"${user.startupIdea}"`, CW - 6);
    const ideaH = lines.length * 5.2 + 10;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(221, 214, 254);
    doc.setLineWidth(.35);
    doc.roundedRect(ML, y, CW, ideaH, 2, 2, 'FD');
    doc.setFont('Helvetica', 'bolditalic'); doc.setFontSize(9.5); doc.setTextColor(74, 68, 88);
    doc.text(lines, ML + 4, y + 7);
    y += ideaH + 10;
  }

  /* Module deliverables */
  briefData.forEach(mod => {
    checkY(22);

    doc.setFillColor(248, 246, 255);
    doc.setDrawColor(167, 139, 250);
    doc.setLineWidth(.35);
    doc.roundedRect(ML, y, CW, 14, 2, 2, 'FD');

    doc.setFillColor(167, 139, 250);
    doc.roundedRect(ML, y, 4, 14, 1, 1, 'F');

    doc.setFont('Helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(26, 22, 37);
    doc.text(`M${String(mod.moduleId).padStart(2, '0')}  ${mod.title}`, ML + 8, y + 9.5);

    doc.setFont('Helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(167, 139, 250);
    const tw = doc.getTextWidth(mod.trackName);
    doc.text(mod.trackName, PW - MR - tw, y + 9.5);
    y += 18;

    mod.answers.forEach((ans, ai) => {
      const labelLines = doc.splitTextToSize(ans.label + ':', 52);
      const ansLines   = doc.splitTextToSize(ans.answer || 'No response provided.', CW - 58);
      const rowH = Math.max(labelLines.length, ansLines.length) * 4.8 + 6;
      checkY(rowH + 2);

      if (ai % 2 === 0) {
        doc.setFillColor(248, 246, 255);
        doc.rect(ML, y - 1, CW, rowH + 1, 'F');
      }
      doc.setFont('Helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(74, 68, 88);
      doc.text(labelLines, ML + 2, y + 4);

      doc.setFont('Helvetica', 'normal'); doc.setFontSize(8.5);
      doc.setTextColor(ans.answer ? 74 : 139, ans.answer ? 68 : 132, ans.answer ? 88 : 155);
      doc.text(ansLines, ML + 56, y + 4);

      doc.setDrawColor(221, 214, 254); doc.setLineWidth(.2);
      doc.line(ML, y + rowH, PW - MR, y + rowH);
      y += rowH + 2;
    });

    y += 8;
  });

  /* Footer on every page */
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(248, 246, 255);
    doc.rect(0, PH - 12, PW, 12, 'F');
    doc.setFont('Helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(139, 132, 155);
    doc.text('MindLaunch Startup Brief  ·  Confidential', ML, PH - 5);
    doc.text(`Page ${p} / ${totalPages}`, PW - MR - 20, PH - 5);
  }

  doc.save(`${(user.name || 'founder').toLowerCase().replace(/\s+/g, '_')}_startup_brief.pdf`);
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const StartupBrief = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [briefData, setBriefData] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useReveal();

  /* Inject CSS + fonts */
  useEffect(() => {
    injectFonts();
    let el = document.getElementById('sb-css');
    if (!el) { el = document.createElement('style'); el.id = 'sb-css'; document.head.appendChild(el); }
    el.textContent = CSS;
  }, []);

  /* Fetch brief data */
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/documents/brief`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setBriefData(await res.json());
      } catch (err) { console.error('Error fetching brief:', err); }
      finally { setLoading(false); }
    })();
  }, [token]);

  /* Derived stats */
  const totalAnswered = briefData.reduce((s, m) => s + m.answers.filter(a => a.answer?.trim()).length, 0);
  const totalFields   = briefData.reduce((s, m) => s + m.answers.length, 0);
  const completePct   = totalFields ? Math.round((totalAnswered / totalFields) * 100) : 0;

  /* ── Loading ── */
  if (loading) return (
    <>
      <div className="sb-mesh-bg" aria-hidden="true">
        <div className="mesh-blob sb-blob-1" />
        <div className="mesh-blob sb-blob-2" />
        <div className="mesh-blob sb-blob-3" />
      </div>
      <div className="sb-noise" />
      <div className="sb-loading">
        <div className="sb-spin" />
        <p className="sb-spin-txt">Loading startup brief...</p>
      </div>
    </>
  );

  return (
    <>
      {/* Ambient mesh — identical to Dashboard */}
      <div className="sb-mesh-bg" aria-hidden="true">
        <div className="mesh-blob sb-blob-1" />
        <div className="mesh-blob sb-blob-2" />
        <div className="mesh-blob sb-blob-3" />
      </div>
      <div className="sb-noise" />

      <div className="sb-shell">
        <div className="sb-body">

          {/* ── Page header ── */}
          <div className="sb-page-hdr">
            <div>
              <h1 className="sb-page-title">
                My <span className="sb-page-grad">Startup Brief</span>
              </h1>
              <p className="sb-page-sub">
                All completed module deliverables in one place — your investor-ready business profile.
              </p>
            </div>
            <div className="sb-page-hdr-acts">
              <button
                className="btn-peach"
                onClick={() => generatePDF(briefData, user)}
                disabled={briefData.length === 0}
              >
                <Icons.Download s={14} /> Download PDF
              </button>
              <Link to="/modules" className="btn-ghost-sm">
                <Icons.BookOpen s={14} /> Go to Modules
              </Link>
            </div>
          </div>

          {/* ── Stat cards ── */}
          <div className="sb-stats-row">
            <StatCard
              label="Modules Done" rawVal={briefData.length} suffix="/30"
              sub="deliverables added"
              IconComp={() => <Icons.Modules s={15} />}
              icoClass="ico-v"
              statGrad="linear-gradient(90deg,var(--lavender),var(--coral))"
              statBorder="rgba(167,139,250,.3)"
              delay=".0s"
            />
            <StatCard
              label="Fields Answered" rawVal={totalAnswered}
              sub={`of ${totalFields} total`}
              IconComp={() => <Icons.Check s={15} />}
              icoClass="ico-e"
              statGrad="linear-gradient(90deg,var(--mint),var(--sky))"
              statBorder="rgba(110,231,183,.3)"
              delay=".05s"
            />
            <StatCard
              label="Completion" rawVal={completePct} suffix="%"
              sub="brief completeness"
              IconComp={() => <Icons.TrendUp s={15} />}
              icoClass="ico-g"
              statGrad="linear-gradient(90deg,var(--peach),#F59E0B)"
              statBorder="rgba(251,191,36,.3)"
              delay=".1s"
            />
            <StatCard
              label="Export Ready" rawVal={briefData.length > 0 ? 1 : 0}
              suffix={briefData.length > 0 ? ' Yes' : ' No'}
              sub="PDF available"
              IconComp={() => <Icons.Award s={15} />}
              icoClass="ico-r"
              statGrad="linear-gradient(90deg,var(--coral),var(--rose))"
              statBorder="rgba(255,107,157,.3)"
              delay=".15s"
            />
          </div>

          {/* ── Founder meta card ── */}
          <div className="sb-meta-wrap">
            <div className="sb-meta-card">
              <div className="sb-meta-grid">
                <div className="sb-meta-item">
                  <div className="sb-meta-ico"><Icons.User s={18} /></div>
                  <div>
                    <div className="sb-meta-lbl">Founder</div>
                    <div className="sb-meta-val">{user?.name || '—'}</div>
                  </div>
                </div>
                <div className="sb-meta-item">
                  <div className="sb-meta-ico"><Icons.Globe s={18} /></div>
                  <div>
                    <div className="sb-meta-lbl">Region</div>
                    <div className="sb-meta-val">{user?.region || '—'}</div>
                  </div>
                </div>
                <div className="sb-meta-item">
                  <div className="sb-meta-ico"><Icons.Target s={18} /></div>
                  <div>
                    <div className="sb-meta-lbl">Category</div>
                    <div className="sb-meta-val">{user?.category || '—'}</div>
                  </div>
                </div>
              </div>

              {user?.startupIdea && (
                <>
                  <div className="sb-divider" />
                  <div className="sb-idea-box">
                    <div className="sb-idea-label">Core Startup Idea</div>
                    <p className="sb-idea-text">{user.startupIdea}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Empty state ── */}
          {briefData.length === 0 ? (
            <div className="sb-empty">
              <div className="sb-empty-ico"><Icons.Sparkles s={30} /></div>
              <h3 className="sb-empty-title">Your brief is waiting</h3>
              <p className="sb-empty-sub">
                Complete module deliverables under <strong>My Modules</strong> to populate this sheet and build your investor-ready briefing document.
              </p>
              <Link to="/modules" className="btn-primary" style={{ marginTop: '.5rem' }}>
                <Icons.BookOpen s={14} /> Start First Module
              </Link>
            </div>
          ) : (
            <>
              {/* Section header */}
              <div className="sb-sec-hdr">
                <div>
                  <h2 className="sb-sec-title">Completed Deliverables</h2>
                  <p className="sb-sec-sub">Click any module card to expand and review your answers.</p>
                </div>
                <span style={{
                  fontSize: '.72rem', color: 'var(--ink3)', fontFamily: 'var(--font-m)',
                  background: 'var(--glass)', border: '1px solid var(--border2)',
                  padding: '.28rem .85rem', borderRadius: 'var(--rp)',
                  backdropFilter: 'blur(10px)',
                }}>
                  {briefData.length} module{briefData.length !== 1 ? 's' : ''} · {totalAnswered} fields answered
                </span>
              </div>

              {/* Module deliverable cards */}
              <div className="sb-modules-list">
                {briefData.map((mod, i) => (
                  <ModuleCard key={mod.moduleId} mod={mod} index={i} />
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="sb-cta-wrap">
                <div className="sb-cta-in">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flex: 1 }}>
                    <div className="sb-cta-ico"><Icons.FileText s={22} /></div>
                    <div className="sb-cta-text">
                      <h3>Export to PDF</h3>
                      <p>
                        Download your full brief as a formatted PDF — share with mentors, advisors, or investors.
                      </p>
                    </div>
                  </div>
                  <div className="sb-cta-acts">
                    <button className="btn-peach" onClick={() => generatePDF(briefData, user)}>
                      <Icons.Download s={14} /> Download Brief PDF
                    </button>
                    <Link to="/modules" className="btn-ghost-sm">
                      <Icons.Arrow s={13} /> Continue Modules
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>{/* sb-body */}
      </div>{/* sb-shell */}
    </>
  );
};

export default StartupBrief;