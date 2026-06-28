import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import {
  Document, Packer, Paragraph, TextRun,
  Table, TableRow, TableCell, BorderStyle, WidthType
} from 'docx';


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
  FileText:    ({ s = 15 }) => <Ic size={s} d={['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8']} />,
  FileWord:    ({ s = 15 }) => <Ic size={s} d={['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M8 13h2l2 4 2-4h2']} />,
  Check:       ({ s = 15 }) => <Ic size={s} d="M20 6L9 17l-5-5" />,
  CheckCircle: ({ s = 15 }) => <Ic size={s} d={['M22 11.08V12a10 10 0 1 1-5.93-9.14', 'M22 4L12 14.01l-3-3']} />,
  Lock:        ({ s = 15 }) => <Ic size={s} d={['M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z', 'M7 11V7a5 5 0 0 1 10 0v4']} />,
  Sparkles:    ({ s = 15 }) => <Ic size={s} fill="currentColor" stroke="none" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  Layers:      ({ s = 15 }) => <Ic size={s} d={['M12 2L2 7l10 5 10-5-10-5z', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5']} />,
  TrendUp:     ({ s = 15 }) => <Ic size={s} d={['M22 7l-8.5 8.5-5-5L2 17', 'M16 7h6v6']} />,
  Folder:      ({ s = 15 }) => <Ic size={s} d={['M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z']} />,
  Award:       ({ s = 15 }) => <Ic size={s} d={['M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12']} />,
  BookOpen:    ({ s = 15 }) => <Ic size={s} d={['M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z', 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z']} />,
  Zap:         ({ s = 15 }) => <Ic size={s} fill="currentColor" stroke="none" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  Arrow:       ({ s = 14 }) => <Ic size={s} d={['M5 12h14', 'M12 5l7 7-7 7']} />,
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
@keyframes shimmer{0%{left:-100%}100%{left:220%}}

/* ── MESH BG ── */
.dc-mesh-bg{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;background:var(--bg)}
.dc-mesh-bg .mesh-blob{position:absolute;filter:blur(80px);opacity:.45;animation:blob-morph 22s ease-in-out infinite}
.dc-blob-1{width:560px;height:560px;background:linear-gradient(135deg,rgba(167,139,250,.35),rgba(255,107,157,.25));top:-12%;left:-8%;animation-delay:0s}
.dc-blob-2{width:480px;height:480px;background:linear-gradient(135deg,rgba(110,231,183,.28),rgba(125,211,252,.25));top:35%;right:-12%;animation-delay:-6s}
.dc-blob-3{width:420px;height:420px;background:linear-gradient(135deg,rgba(251,191,36,.25),rgba(251,113,133,.2));bottom:-8%;left:25%;animation-delay:-11s}
.dc-noise{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.02;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* ── SHELL ── */
.dc-shell{position:relative;z-index:2;min-height:100vh}

/* ── PAGE BODY ── */
.dc-body{padding:2rem;display:flex;flex-direction:column;gap:2rem;max-width:1280px;margin:0 auto;width:100%}

/* ── PAGE HEADER ── */
.dc-page-hdr{
  display:flex;align-items:flex-start;justify-content:space-between;
  gap:1rem;flex-wrap:wrap;
  animation:fadeUp .6s var(--ease) both;
}
.dc-page-title{font-family:var(--font-d);font-size:1.85rem;font-weight:700;letter-spacing:-1px;line-height:1.2;color:var(--ink);margin-bottom:.3rem}
.dc-grad{background:linear-gradient(135deg,var(--lavender),var(--coral));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.dc-page-sub{font-size:.9rem;color:var(--ink3);line-height:1.65;max-width:520px}
.dc-page-acts{display:flex;align-items:center;gap:.65rem;flex-wrap:wrap;flex-shrink:0}

/* ── BUTTONS ── */
.btn-primary{padding:.65rem 1.5rem;border-radius:var(--rp);background:linear-gradient(135deg,var(--lavender),var(--coral));border:none;cursor:pointer;color:#fff;font-family:var(--font-d);font-size:.9rem;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:.45rem;box-shadow:0 4px 16px rgba(167,139,250,.3);transition:all .25s var(--spring);white-space:nowrap}
.btn-primary:hover:not(:disabled){transform:translateY(-2px) scale(1.02);box-shadow:0 8px 28px rgba(255,107,157,.4)}
.btn-primary:disabled{opacity:.4;cursor:not-allowed;transform:none}
.btn-peach{padding:.65rem 1.5rem;border-radius:var(--rp);background:linear-gradient(135deg,var(--peach),#F59E0B);border:none;cursor:pointer;color:#3A2400;font-family:var(--font-d);font-size:.9rem;font-weight:700;display:inline-flex;align-items:center;gap:.45rem;box-shadow:0 4px 16px rgba(251,191,36,.25);transition:all .25s var(--spring);white-space:nowrap}
.btn-peach:hover:not(:disabled){transform:translateY(-2px) scale(1.02);box-shadow:0 8px 24px rgba(251,191,36,.4)}
.btn-peach:disabled{opacity:.4;cursor:not-allowed;transform:none}
.btn-ghost-sm{padding:.6rem 1.3rem;border-radius:var(--rp);background:var(--glass);backdrop-filter:blur(10px);border:2px solid var(--border2);cursor:pointer;color:var(--ink2);font-family:var(--font-d);font-size:.85rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:.4rem;transition:all .25s var(--ease);white-space:nowrap}
.btn-ghost-sm:hover:not(:disabled){border-color:var(--lavender);color:var(--lavender);background:rgba(167,139,250,.06)}
.btn-ghost-sm:disabled{opacity:.38;cursor:not-allowed}

/* small download buttons inside rows */
.btn-sm{padding:.38rem .82rem;border-radius:var(--rp);font-size:.73rem;font-weight:700;font-family:var(--font-d);cursor:pointer;display:inline-flex;align-items:center;gap:.32rem;transition:all .2s var(--ease);border:none;white-space:nowrap}
.btn-sm-pdf{background:rgba(167,139,250,.1);color:var(--lavender);border:1px solid rgba(167,139,250,.22)}
.btn-sm-pdf:hover{background:rgba(167,139,250,.2);border-color:rgba(167,139,250,.42);transform:translateY(-1px)}
.btn-sm-word{background:rgba(251,191,36,.1);color:#D97706;border:1px solid rgba(251,191,36,.22)}
.btn-sm-word:hover{background:rgba(251,191,36,.2);border-color:rgba(251,191,36,.42);transform:translateY(-1px)}

/* ── STAT CARDS (matches Dashboard) ── */
.dc-stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;animation:fadeUp .6s .06s var(--ease) both}
.dc-stat{
  background:var(--glass);backdrop-filter:blur(16px);
  border:1px solid var(--glass-border);
  border-radius:var(--rl);
  padding:1.25rem 1.4rem;
  display:flex;flex-direction:column;gap:.6rem;
  position:relative;overflow:hidden;
  box-shadow:var(--shadow-md);
  transition:all .3s var(--spring);
}
.dc-stat::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--stat-grad,linear-gradient(90deg,var(--lavender),var(--coral)));opacity:0;transition:opacity .3s}
.dc-stat:hover{border-color:var(--stat-border,rgba(167,139,250,.3));transform:translateY(-5px);box-shadow:var(--shadow-xl)}
.dc-stat:hover::before{opacity:1}
.dc-stat:hover .dc-stat-ico{transform:scale(1.12) rotate(-6deg)}
.dc-stat-top{display:flex;align-items:center;justify-content:space-between}
.dc-stat-label{font-size:.72rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.08em;font-family:var(--font-m);font-weight:500}
.dc-stat-ico{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .3s var(--spring)}
.dc-stat-val{font-family:var(--font-d);font-size:2rem;font-weight:700;letter-spacing:-1.5px;line-height:1;color:var(--ink)}
.dc-stat-sub{font-size:.72rem;color:var(--ink3)}

.ico-v{background:linear-gradient(135deg,rgba(167,139,250,.18),rgba(255,107,157,.1));border:1px solid rgba(167,139,250,.25);color:var(--lavender)}
.ico-g{background:linear-gradient(135deg,rgba(251,191,36,.18),rgba(255,107,157,.1));border:1px solid rgba(251,191,36,.25);color:#D97706}
.ico-e{background:linear-gradient(135deg,rgba(110,231,183,.18),rgba(125,211,252,.1));border:1px solid rgba(110,231,183,.25);color:#059669}
.ico-r{background:linear-gradient(135deg,rgba(255,107,157,.16),rgba(251,113,133,.1));border:1px solid rgba(255,107,157,.25);color:var(--coral)}

/* ── AGGREGATE BRIEF CARD (gradient-border like Dashboard coach CTA) ── */
.dc-brief-wrap{
  border-radius:var(--rl);position:relative;overflow:hidden;
  animation:fadeUp .6s .1s var(--ease) both;
}
.dc-brief-wrap::before{
  content:'';position:absolute;inset:0;border-radius:var(--rl);padding:2px;
  background:linear-gradient(135deg,var(--peach),var(--coral),var(--lavender),var(--mint));
  -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;
}
.dc-brief-in{
  background:var(--glass);backdrop-filter:blur(20px);
  border-radius:calc(var(--rl) - 2px);
  padding:2rem 2.4rem;
  display:flex;align-items:center;justify-content:space-between;
  gap:2rem;flex-wrap:wrap;position:relative;overflow:hidden;
}
.dc-brief-in::after{
  content:'';position:absolute;top:0;left:-100%;bottom:0;width:45%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent);
  animation:shimmer 8s ease-in-out infinite;pointer-events:none;
}
.dc-brief-left{display:flex;align-items:center;gap:1.2rem;flex:1;min-width:0}
.dc-brief-ico{
  width:56px;height:56px;border-radius:16px;
  background:linear-gradient(135deg,rgba(251,191,36,.18),rgba(255,107,157,.1));
  border:1px solid rgba(251,191,36,.28);
  display:flex;align-items:center;justify-content:center;color:var(--peach);
  flex-shrink:0;box-shadow:0 0 22px rgba(251,191,36,.18);
  animation:pulse-glow 3s ease-in-out infinite;
}
.dc-brief-chip{
  display:inline-flex;align-items:center;gap:.3rem;
  padding:.22rem .65rem;border-radius:var(--rp);
  background:linear-gradient(135deg,var(--peach),#F59E0B);
  color:#3A2400;font-size:.62rem;font-weight:800;
  letter-spacing:.06em;text-transform:uppercase;font-family:var(--font-m);
  margin-bottom:.4rem;
}
.dc-brief-title{font-family:var(--font-d);font-size:1.1rem;font-weight:700;letter-spacing:-.3px;color:var(--ink);margin-bottom:.25rem}
.dc-brief-desc{font-size:.84rem;color:var(--ink3);line-height:1.58}
.dc-brief-status{font-size:.75rem;color:var(--ink3);font-family:var(--font-m);margin-top:.4rem}
.dc-brief-status strong{color:var(--ink)}
.dc-brief-acts{display:flex;gap:.75rem;flex-shrink:0;flex-wrap:wrap}

/* ── SECTION HEADER + FILTERS ── */
.dc-sec-hdr{display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;animation:fadeUp .6s .16s var(--ease) both}
.dc-sec-title{font-family:var(--font-d);font-size:1.3rem;font-weight:700;letter-spacing:-.5px;color:var(--ink)}
.dc-sec-sub{font-size:.82rem;color:var(--ink3);margin-top:.2rem}
.dc-filters{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;animation:fadeUp .6s .18s var(--ease) both}
.dc-filter{padding:.34rem .9rem;border-radius:var(--rp);font-size:.76rem;font-weight:600;font-family:var(--font-m);border:1px solid var(--border2);background:var(--glass);color:var(--ink3);cursor:pointer;transition:all .25s var(--ease)}
.dc-filter:hover{color:var(--ink);border-color:rgba(167,139,250,.35)}
.dc-filter.active{background:linear-gradient(135deg,rgba(167,139,250,.15),rgba(255,107,157,.1));border-color:rgba(167,139,250,.4);color:var(--lavender)}

/* ── MODULE ROWS ── */
.dc-mod-list{display:flex;flex-direction:column;gap:.75rem;animation:fadeUp .6s .2s var(--ease) both}

.dc-mod-row{
  background:var(--glass);backdrop-filter:blur(16px);
  border:1px solid var(--glass-border);
  border-radius:var(--rl);
  padding:1.1rem 1.4rem;
  display:grid;
  grid-template-columns:2.2fr 1fr 1fr auto;
  align-items:center;gap:1.2rem;
  transition:all .3s var(--ease);
  position:relative;overflow:hidden;
  box-shadow:var(--shadow-sm);
  opacity:0;transform:translateY(12px);
}
.dc-mod-row.vis{opacity:1;transform:none}
.dc-mod-row::before{
  content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
  background:linear-gradient(180deg,var(--lavender),var(--coral));
  border-radius:2px;transform:scaleY(0);transition:transform .35s var(--ease);
}
.dc-mod-row:hover{border-color:rgba(167,139,250,.3);box-shadow:var(--shadow-lg);transform:translateX(4px)}
.dc-mod-row:hover::before{transform:scaleY(1)}
.dc-mod-row.dc-done{border-color:rgba(110,231,183,.25)}
.dc-mod-row.dc-done::before{background:linear-gradient(180deg,var(--mint),var(--sky))}
.dc-mod-row.dc-locked{opacity:0;transform:translateY(12px)} /* reset for reveal */
.dc-mod-row.dc-locked.vis{opacity:.65;transform:none}
.dc-mod-row.dc-locked:hover{transform:translateX(2px);opacity:.8}

/* info col */
.dc-mod-num{font-family:var(--font-m);font-size:.62rem;color:var(--ink3);letter-spacing:.06em;text-transform:uppercase;margin-bottom:.22rem}
.dc-mod-name{font-family:var(--font-d);font-size:.95rem;font-weight:700;letter-spacing:-.2px;color:var(--ink)}
.dc-mod-row.dc-locked .dc-mod-name{color:var(--ink2)}

/* track chip */
.dc-track-chip{display:inline-flex;align-items:center;gap:.3rem;padding:.22rem .65rem;border-radius:var(--rp);font-size:.65rem;font-weight:600;font-family:var(--font-m);background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.2);color:var(--lavender)}

/* status chip */
.dc-status{display:inline-flex;align-items:center;gap:.3rem;padding:.22rem .65rem;border-radius:var(--rp);font-size:.68rem;font-weight:600;font-family:var(--font-m)}
.dc-status-done{background:rgba(110,231,183,.12);border:1px solid rgba(110,231,183,.28);color:#059669}
.dc-status-locked{background:var(--glass);border:1px solid var(--border2);color:var(--ink3)}

/* dl actions */
.dc-dl-actions{display:flex;gap:.5rem;justify-content:flex-end;flex-shrink:0;flex-wrap:wrap}
.dc-no-dl{font-size:.72rem;color:var(--ink3);font-family:var(--font-m)}

/* ── EMPTY STATE ── */
.dc-empty{text-align:center;padding:4rem 2rem;display:flex;flex-direction:column;align-items:center;gap:1rem;animation:fadeUp .6s .2s var(--ease) both}
.dc-empty-ico{width:68px;height:68px;border-radius:20px;background:linear-gradient(135deg,rgba(167,139,250,.15),rgba(255,107,157,.1));border:1px solid rgba(167,139,250,.22);display:flex;align-items:center;justify-content:center;color:var(--lavender);animation:pulse-glow 3s ease-in-out infinite}
.dc-empty-title{font-family:var(--font-d);font-size:1.25rem;font-weight:700;letter-spacing:-.4px;color:var(--ink)}
.dc-empty-sub{font-size:.875rem;color:var(--ink3);line-height:1.65;max-width:380px}

/* ── LOADING ── */
.dc-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;height:80vh;gap:1rem}
.dc-spin{width:44px;height:44px;border-radius:50%;border:3px solid rgba(167,139,250,.2);border-top-color:var(--lavender);animation:spin .75s linear infinite}
.dc-spin-txt{color:var(--ink3);font-size:.9rem;font-family:var(--font-m)}

/* ── RESPONSIVE ── */
@media(max-width:1100px){.dc-stats-row{grid-template-columns:repeat(2,1fr)}}
@media(max-width:900px){
  .dc-brief-in{flex-direction:column;text-align:center}
  .dc-brief-left{flex-direction:column;align-items:center;text-align:center}
  .dc-brief-acts{width:100%}
  .dc-brief-acts .btn-peach,.dc-brief-acts .btn-ghost-sm,.dc-brief-acts .btn-primary{flex:1;justify-content:center}
  .dc-mod-row{grid-template-columns:1fr 1fr;grid-template-rows:auto auto;gap:.75rem}
  .dc-dl-actions{grid-column:1/-1;justify-content:flex-start}
}
@media(max-width:768px){
  .dc-body{padding:1.25rem}
  .dc-stats-row{grid-template-columns:1fr 1fr}
  .dc-page-hdr{flex-direction:column;align-items:flex-start}
  .dc-page-acts{width:100%}
  .dc-page-acts .btn-ghost-sm{flex:1;justify-content:center}
}
@media(max-width:640px){
  .dc-mod-row{grid-template-columns:1fr;gap:.6rem}
  .dc-dl-actions{flex-direction:row}
}
@media(max-width:480px){.dc-stats-row{grid-template-columns:1fr}}
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
      { threshold: .06, rootMargin: '0px 0px -30px 0px' }
    );
    document.querySelectorAll('.dc-mod-row').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ══════════════════════════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════════════════════════ */
function StatCard({ label, raw, suffix = '', sub, Ico, icoClass, statGrad, statBorder, delay }) {
  const counted = useCounter(raw || 0, 900);
  return (
    <div className="dc-stat" style={{ '--stat-grad': statGrad, '--stat-border': statBorder, animationDelay: delay }}>
      <div className="dc-stat-top">
        <span className="dc-stat-label">{label}</span>
        <div className={`dc-stat-ico ${icoClass}`}><Ico /></div>
      </div>
      <div className="dc-stat-val">{counted}{suffix}</div>
      <div className="dc-stat-sub">{sub}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PDF GENERATION (cream/lavender palette)
══════════════════════════════════════════════════════════════ */
function genModulePDF(mod, user) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PW = 210, ML = 18, MR = 18, PH = doc.internal.pageSize.height;
  const CW = PW - ML - MR;
  let y = 18;

  doc.setFillColor(254, 252, 249); doc.rect(0, 0, PW, 48, 'F');
  doc.setFillColor(167, 139, 250); doc.rect(0, 48, PW, 1.5, 'F');

  doc.setFillColor(148, 109, 252); doc.roundedRect(ML, 16, 11, 11, 2, 2, 'F');
  doc.setFont('Helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(255, 255, 255);
  doc.text('M', ML + 4, 23);
  doc.setFontSize(12); doc.setTextColor(26, 22, 37);
  doc.text('Mind', ML + 15, 23);
  doc.setTextColor(167, 139, 250); doc.text('Launch', ML + 33, 23);

  doc.setFont('Helvetica', 'bold'); doc.setFontSize(16); doc.setTextColor(26, 22, 37);
  doc.text(mod.title, ML, 39);
  doc.setFont('Helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(139, 132, 155);
  doc.text(`Module ${mod.moduleId}  ·  ${mod.trackName}  ·  ${user.name}  ·  ${user.region || ''}`, ML, 45);

  y = 60;

  mod.deliverableSchema.forEach((schema, ai) => {
    const ans = mod.deliverableAnswers?.[schema.fieldKey] || 'No answer provided.';
    const lLines = doc.splitTextToSize(schema.label + ':', 50);
    const aLines = doc.splitTextToSize(ans, CW - 56);
    const rowH = Math.max(lLines.length, aLines.length) * 4.8 + 8;
    if (y + rowH > PH - 16) { doc.addPage(); y = 18; }

    if (ai % 2 === 0) { doc.setFillColor(248, 246, 255); doc.rect(ML, y - 2, CW, rowH, 'F'); }
    doc.setDrawColor(221, 214, 254); doc.setLineWidth(.2); doc.line(ML, y + rowH - 2, PW - MR, y + rowH - 2);

    doc.setFont('Helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(74, 68, 88);
    doc.text(lLines, ML + 2, y + 4);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(ans.length > 3 ? 74 : 139, ans.length > 3 ? 68 : 132, ans.length > 3 ? 88 : 155);
    doc.text(aLines, ML + 54, y + 4);
    y += rowH;
  });

  const total = doc.internal.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFillColor(248, 246, 255); doc.rect(0, PH - 11, PW, 11, 'F');
    doc.setFont('Helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(139, 132, 155);
    doc.text('MindLaunch Deliverable  ·  Confidential', ML, PH - 4.5);
    doc.text(`Page ${p}/${total}`, PW - MR - 16, PH - 4.5);
  }

  doc.save(`module_${mod.moduleId}_${mod.title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
}

function genBriefPDF(modules, user) {
  const completed = modules.filter(m => m.status === 'completed');
  if (!completed.length) return;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PW = 210, ML = 18, MR = 18, PH = doc.internal.pageSize.height;
  const CW = PW - ML - MR;
  let y = 18;

  doc.setFillColor(254, 252, 249); doc.rect(0, 0, PW, 62, 'F');
  doc.setFillColor(167, 139, 250); doc.rect(0, 62, PW, 1.5, 'F');
  doc.setFillColor(148, 109, 252); doc.roundedRect(ML, 16, 12, 12, 2, 2, 'F');
  doc.setFont('Helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(255, 255, 255);
  doc.text('M', ML + 4.5, 24.5);
  doc.setFontSize(14); doc.setTextColor(26, 22, 37); doc.text('Mind', ML + 17, 24.5);
  doc.setTextColor(167, 139, 250); doc.text('Launch', ML + 37, 24.5);
  doc.setFontSize(22); doc.setTextColor(26, 22, 37);
  doc.text('STARTUP BRIEF', ML, 44);
  doc.setFont('Helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(139, 132, 155);
  doc.text(`${user.name}  ·  ${user.category}  ·  ${user.region}  ·  ${new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}`, ML, 54);

  y = 76;

  if (user.startupIdea) {
    const lines = doc.splitTextToSize(`"${user.startupIdea}"`, CW - 8);
    const h = lines.length * 5.2 + 10;
    if (y + h > PH - 16) { doc.addPage(); y = 18; }
    doc.setFillColor(255, 255, 255); doc.setDrawColor(221, 214, 254); doc.setLineWidth(.35);
    doc.roundedRect(ML, y, CW, h, 2, 2, 'FD');
    doc.setFont('Helvetica', 'bolditalic'); doc.setFontSize(9.5); doc.setTextColor(74, 68, 88);
    doc.text(lines, ML + 4, y + 7);
    y += h + 12;
  }

  completed.forEach(mod => {
    if (y > PH - 38) { doc.addPage(); y = 18; }
    doc.setFillColor(248, 246, 255); doc.setDrawColor(167, 139, 250); doc.setLineWidth(.35);
    doc.roundedRect(ML, y, CW, 14, 2, 2, 'FD');
    doc.setFillColor(167, 139, 250); doc.roundedRect(ML, y, 4, 14, 1, 1, 'F');
    doc.setFont('Helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(26, 22, 37);
    doc.text(`M${String(mod.moduleId).padStart(2, '0')}  ${mod.title}`, ML + 8, y + 9.5);
    doc.setFont('Helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(167, 139, 250);
    const tw = doc.getTextWidth(mod.trackName);
    doc.text(mod.trackName, PW - MR - tw, y + 9.5);
    y += 18;

    mod.deliverableSchema.forEach((s, ai) => {
      const ans = mod.deliverableAnswers?.[s.fieldKey] || 'No response.';
      const lL = doc.splitTextToSize(s.label + ':', 52);
      const aL = doc.splitTextToSize(ans, CW - 58);
      const rH = Math.max(lL.length, aL.length) * 4.8 + 6;
      if (y + rH > PH - 16) { doc.addPage(); y = 18; }
      if (ai % 2 === 0) { doc.setFillColor(248, 246, 255); doc.rect(ML, y - 1, CW, rH + 1, 'F'); }
      doc.setDrawColor(221, 214, 254); doc.setLineWidth(.2); doc.line(ML, y + rH, PW - MR, y + rH);
      doc.setFont('Helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(74, 68, 88);
      doc.text(lL, ML + 2, y + 4);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(ans.length > 3 ? 74 : 139, ans.length > 3 ? 68 : 132, ans.length > 3 ? 88 : 155);
      doc.text(aL, ML + 56, y + 4);
      y += rH + 2;
    });
    y += 8;
  });

  const total = doc.internal.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFillColor(248, 246, 255); doc.rect(0, PH - 11, PW, 11, 'F');
    doc.setFont('Helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(139, 132, 155);
    doc.text('MindLaunch Startup Brief  ·  Confidential', ML, PH - 4.5);
    doc.text(`Page ${p}/${total}`, PW - MR - 16, PH - 4.5);
  }

  doc.save(`${(user.name || 'founder').toLowerCase().replace(/\s+/g, '_')}_startup_brief.pdf`);
}

/* ══════════════════════════════════════════════════════════════
   WORD GENERATION (unchanged logic, clean palette)
══════════════════════════════════════════════════════════════ */
async function genModuleWord(mod, user) {
  const headerRow = new TableRow({ children: [
    new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, shading: { fill: '7C3AED' }, children: [new Paragraph({ children: [new TextRun({ text: 'Field', bold: true, color: 'FFFFFF' })] })] }),
    new TableCell({ width: { size: 65, type: WidthType.PERCENTAGE }, shading: { fill: '7C3AED' }, children: [new Paragraph({ children: [new TextRun({ text: 'Response', bold: true, color: 'FFFFFF' })] })] }),
  ]});
  const rows = [headerRow, ...mod.deliverableSchema.map(s => new TableRow({ children: [
    new TableCell({ shading: { fill: 'F5F3FF' }, children: [new Paragraph({ children: [new TextRun({ text: s.label, bold: true })] })] }),
    new TableCell({ children: [new Paragraph({ text: mod.deliverableAnswers?.[s.fieldKey] || 'No response provided.' })] }),
  ]}) )];

  const docx = new Document({ sections: [{ children: [
    new Paragraph({ children: [new TextRun({ text: `MindLaunch: ${mod.title}`, bold: true, size: 32 })] }),
    new Paragraph({ children: [new TextRun({ text: `Module ${mod.moduleId} · ${mod.trackName} · ${user.name}`, italics: true, color: 'A78BFA' })] }),
    new Paragraph({ text: '' }),
    new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: 'DDD6FE' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDD6FE' }, left: { style: BorderStyle.SINGLE, size: 1, color: 'DDD6FE' }, right: { style: BorderStyle.SINGLE, size: 1, color: 'DDD6FE' } }, rows }),
  ]}]});

  const blob = await Packer.toBlob(docx);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `module_${mod.moduleId}_${mod.title.toLowerCase().replace(/\s+/g, '_')}.docx`;
  a.click(); URL.revokeObjectURL(url);
}

async function genBriefWord(modules, user) {
  const completed = modules.filter(m => m.status === 'completed');
  if (!completed.length) return;

  const children = [
    new Paragraph({ children: [new TextRun({ text: 'MINDLAUNCH STARTUP BRIEF', bold: true, size: 44, color: '1A1625' })] }),
    new Paragraph({ children: [new TextRun({ text: `${user.name}  ·  ${user.category}  ·  ${user.region}`, bold: true, color: 'A78BFA' })] }),
    user.startupIdea ? new Paragraph({ children: [new TextRun({ text: `"${user.startupIdea}"`, italics: true })] }) : null,
    new Paragraph({ text: '' }),
  ].filter(Boolean);

  completed.forEach(mod => {
    children.push(new Paragraph({ children: [new TextRun({ text: `Module ${mod.moduleId}: ${mod.title} (${mod.trackName})`, bold: true, size: 26, color: 'A78BFA' })] }));
    children.push(new Paragraph({ text: '' }));
    const rows = [
      new TableRow({ children: [
        new TableCell({ shading: { fill: '7C3AED' }, children: [new Paragraph({ children: [new TextRun({ text: 'Field', bold: true, color: 'FFFFFF' })] })] }),
        new TableCell({ shading: { fill: '7C3AED' }, children: [new Paragraph({ children: [new TextRun({ text: 'Response', bold: true, color: 'FFFFFF' })] })] }),
      ]}),
      ...mod.deliverableSchema.map(s => new TableRow({ children: [
        new TableCell({ shading: { fill: 'F5F3FF' }, children: [new Paragraph({ children: [new TextRun({ text: s.label, bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ text: mod.deliverableAnswers?.[s.fieldKey] || 'No response provided.' })] }),
      ]})),
    ];
    children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: 'DDD6FE' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDD6FE' }, left: { style: BorderStyle.SINGLE, size: 1, color: 'DDD6FE' }, right: { style: BorderStyle.SINGLE, size: 1, color: 'DDD6FE' } }, rows }));
    children.push(new Paragraph({ text: '' }));
    children.push(new Paragraph({ text: '' }));
  });

  const docx = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(docx);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${(user.name || 'founder').toLowerCase().replace(/\s+/g, '_')}_startup_brief.docx`;
  a.click(); URL.revokeObjectURL(url);
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const Documents = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [modules,      setModules]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useReveal();

  /* CSS + fonts */
  useEffect(() => {
    injectFonts();
    let el = document.getElementById('dc-css');
    if (!el) { el = document.createElement('style'); el.id = 'dc-css'; document.head.appendChild(el); }
    el.textContent = CSS;
  }, []);

  /* Fetch modules */
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/modules`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setModules(await res.json());
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [token]);

  const completed  = modules.filter(m => m.status === 'completed');
  const doneCount  = completed.length;
  const totalCount = modules.length;

  const FILTERS = [
    { id: 'all',       label: 'All Modules' },
    { id: 'completed', label: 'Completed'   },
    { id: 'locked',    label: 'Locked'      },
  ];

  const filtered =
    activeFilter === 'completed' ? modules.filter(m => m.status === 'completed')
    : activeFilter === 'locked'  ? modules.filter(m => m.status !== 'completed')
    : modules;

  /* ── Loading ── */
  if (loading) return (
    <>
      <div className="dc-mesh-bg" aria-hidden="true">
        <div className="mesh-blob dc-blob-1" />
        <div className="mesh-blob dc-blob-2" />
        <div className="mesh-blob dc-blob-3" />
      </div>
      <div className="dc-noise" />
      <div className="dc-loading">
        <div className="dc-spin" />
        <p className="dc-spin-txt">Loading document hub...</p>
      </div>
    </>
  );

  return (
    <>
      {/* Ambient mesh — identical to Dashboard */}
      <div className="dc-mesh-bg" aria-hidden="true">
        <div className="mesh-blob dc-blob-1" />
        <div className="mesh-blob dc-blob-2" />
        <div className="mesh-blob dc-blob-3" />
      </div>
      <div className="dc-noise" />

      <div className="dc-shell">
        <div className="dc-body">

          {/* ── Page header ── */}
          <div className="dc-page-hdr">
            <div>
              <h1 className="dc-page-title">
                <span className="dc-grad">Document</span> Hub
              </h1>
              <p className="dc-page-sub">
                Download individual module worksheets or your full aggregated startup brief — in PDF or Word format.
              </p>
            </div>
            <div className="dc-page-acts">
              <Link to="/startup-brief" className="btn-ghost-sm">
                <Icons.FileText s={14} /> View Brief
              </Link>
            </div>
          </div>

          {/* ── Stat cards ── */}
          <div className="dc-stats-row">
            <StatCard
              label="Modules Done" raw={doneCount} suffix={`/${totalCount}`}
              sub="worksheets unlocked"
              Ico={() => <Icons.CheckCircle s={15} />} icoClass="ico-e"
              statGrad="linear-gradient(90deg,var(--mint),var(--sky))"
              statBorder="rgba(110,231,183,.3)"
              delay="0s"
            />
            <StatCard
              label="PDFs Available" raw={doneCount}
              sub="ready to download"
              Ico={() => <Icons.FileText s={15} />} icoClass="ico-v"
              statGrad="linear-gradient(90deg,var(--lavender),var(--coral))"
              statBorder="rgba(167,139,250,.3)"
              delay=".05s"
            />
            <StatCard
              label="Word Files" raw={doneCount}
              sub="ready to download"
              Ico={() => <Icons.FileWord s={15} />} icoClass="ico-g"
              statGrad="linear-gradient(90deg,var(--peach),#F59E0B)"
              statBorder="rgba(251,191,36,.3)"
              delay=".1s"
            />
            <StatCard
              label="Briefs" raw={doneCount > 0 ? 1 : 0}
              suffix={doneCount > 0 ? ' Ready' : ' Pending'}
              sub="aggregate brief status"
              Ico={() => <Icons.Award s={15} />} icoClass="ico-r"
              statGrad="linear-gradient(90deg,var(--coral),var(--rose))"
              statBorder="rgba(255,107,157,.3)"
              delay=".15s"
            />
          </div>

          {/* ── Aggregate brief card ── */}
          <div className="dc-brief-wrap">
            <div className="dc-brief-in">
              <div className="dc-brief-left">
                <div className="dc-brief-ico"><Icons.Sparkles s={22} /></div>
                <div>
                  <div className="dc-brief-chip"><Icons.Sparkles s={10} /> Aggregate Dossier</div>
                  <div className="dc-brief-title">Complete Startup Brief</div>
                  <div className="dc-brief-desc">
                    Consolidates all answers from every completed module into one unified plan — ready for investor review.
                  </div>
                  <div className="dc-brief-status">
                    Status: <strong>{doneCount}/30 modules completed</strong>
                  </div>
                </div>
              </div>
              <div className="dc-brief-acts">
                {doneCount > 0 ? (
                  <>
                    <button className="btn-ghost-sm" onClick={() => genBriefPDF(modules, user)}>
                      <Icons.Download s={14} /> PDF Brief
                    </button>
                    <button className="btn-peach" onClick={() => genBriefWord(modules, user)}>
                      <Icons.Download s={14} /> Word Brief
                    </button>
                  </>
                ) : (
                  <button className="btn-primary" disabled>
                    <Icons.Lock s={14} /> Complete modules first
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Section header + filters ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
            <div className="dc-sec-hdr">
              <div>
                <h2 className="dc-sec-title">Module Worksheets</h2>
                <p className="dc-sec-sub">Download individual deliverable worksheets per module.</p>
              </div>
            </div>
            <div className="dc-filters">
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  className={`dc-filter${activeFilter === f.id ? ' active' : ''}`}
                  onClick={() => setActiveFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Module rows ── */}
          {filtered.length === 0 ? (
            <div className="dc-empty">
              <div className="dc-empty-ico"><Icons.Folder s={28} /></div>
              <h3 className="dc-empty-title">No modules here</h3>
              <p className="dc-empty-sub">Complete your first module to unlock downloadable worksheets.</p>
            </div>
          ) : (
            <div className="dc-mod-list">
              {filtered.map((mod, i) => {
                const isDone = mod.status === 'completed';
                return (
                  <div
                    key={mod.moduleId}
                    className={`dc-mod-row${isDone ? ' dc-done' : ' dc-locked'}`}
                    style={{ transitionDelay: `${i * 35}ms` }}
                  >
                    {/* Info */}
                    <div>
                      <div className="dc-mod-num">Module {String(mod.moduleId).padStart(2, '0')}</div>
                      <div className="dc-mod-name">{mod.title}</div>
                    </div>

                    {/* Track */}
                    <div>
                      <span className="dc-track-chip">
                        <Icons.Layers s={10} /> {mod.trackName}
                      </span>
                    </div>

                    {/* Status */}
                    <div>
                      {isDone ? (
                        <span className="dc-status dc-status-done">
                          <Icons.CheckCircle s={11} /> Completed
                        </span>
                      ) : (
                        <span className="dc-status dc-status-locked">
                          <Icons.Lock s={11} /> Locked
                        </span>
                      )}
                    </div>

                    {/* Downloads */}
                    <div className="dc-dl-actions">
                      {isDone ? (
                        <>
                          <button className="btn-sm btn-sm-pdf" onClick={() => genModulePDF(mod, user)}>
                            <Icons.FileText s={11} /> PDF
                          </button>
                          <button className="btn-sm btn-sm-word" onClick={() => genModuleWord(mod, user)}>
                            <Icons.FileWord s={11} /> Word
                          </button>
                        </>
                      ) : (
                        <span className="dc-no-dl">No downloads yet</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>{/* dc-body */}
      </div>{/* dc-shell */}
    </>
  );
};

export default Documents;