import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import jsPDF from 'jspdf';


/* ── Font injection ── */
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
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const Icons = {
  Send:       ({ s = 15 }) => <Ic size={s} d={['M22 2L11 13', 'M22 2l-7 20-4-9-9-4 20-7z']} />,
  Sparkles:   ({ s = 15 }) => <Ic size={s} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />,
  Award:      ({ s = 15 }) => <Ic size={s} d={['M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12']} />,
  Mic:        ({ s = 15 }) => <Ic size={s} d={['M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z', 'M19 10v2a7 7 0 0 1-14 0v-2', 'M12 19v4', 'M8 23h8']} />,
  MicOff:     ({ s = 15 }) => <Ic size={s} d={['M1 1l22 22', 'M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6', 'M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23', 'M12 19v4', 'M8 23h8']} />,
  Volume:     ({ s = 15 }) => <Ic size={s} d={['M11 5L6 9H2v6h4l5 4V5z', 'M19.07 4.93a10 10 0 0 1 0 14.14', 'M15.54 8.46a5 5 0 0 1 0 7.07']} />,
  Download:   ({ s = 15 }) => <Ic size={s} d={['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3']} />,
  Check:      ({ s = 15 }) => <Ic size={s} d="M20 6L9 17l-5-5" />,
  CheckCircle:({ s = 15 }) => <Ic size={s} d={['M22 11.08V12a10 10 0 1 1-5.93-9.14', 'M22 4L12 14.01l-3-3']} />,
  Alert:      ({ s = 15 }) => <Ic size={s} d={['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 8v4', 'M12 16h.01']} />,
  User:       ({ s = 15 }) => <Ic size={s} d={['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z']} />,
  Brain:      ({ s = 15 }) => <Ic size={s} d={['M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.65A2.5 2.5 0 0 1 5 12a2.5 2.5 0 0 1 2-2.45V7A2.5 2.5 0 0 1 9.5 2z', 'M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-4.65A2.5 2.5 0 0 0 19 12a2.5 2.5 0 0 0-2-2.45V7A2.5 2.5 0 0 0 14.5 2z']} />,
  Zap:        ({ s = 15 }) => <Ic size={s} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />,
  Target:     ({ s = 15 }) => <Ic size={s} d={['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z']} />,
  TrendUp:    ({ s = 15 }) => <Ic size={s} d={['M22 7l-8.5 8.5-5-5L2 17', 'M16 7h6v6']} />,
  Globe:      ({ s = 15 }) => <Ic size={s} d={['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M2 12h20', 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z']} />,
  Arrow:      ({ s = 14 }) => <Ic size={s} d={['M5 12h14', 'M12 5l7 7-7 7']} />,
  ArrowLeft:  ({ s = 14 }) => <Ic size={s} d={['M19 12H5', 'M12 19l-7-7 7-7']} />,
  Refresh:    ({ s = 15 }) => <Ic size={s} d={['M23 4v6h-6', 'M1 20v-6h6', 'M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15']} />,
  Copy:       ({ s = 15 }) => <Ic size={s} d={['M20 9H11a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z', 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1']} />,
  ChevUp:     ({ s = 15 }) => <Ic size={s} d="M18 15l-6-6-6 6" />,
  ChevDown:   ({ s = 15 }) => <Ic size={s} d="M6 9l6 6 6-6" />,
  ChevRight:  ({ s = 15 }) => <Ic size={s} d="M9 18l6-6-6-6" />,
  Bell:       ({ s = 15 }) => <Ic size={s} d={['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 0 1-3.46 0']} />,
  Compass:    ({ s = 15 }) => <Ic size={s} d={['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z']} />,
  FileText:   ({ s = 15 }) => <Ic size={s} d={['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8']} />,
  BarChart:   ({ s = 15 }) => <Ic size={s} d={['M18 20V10', 'M12 20V4', 'M6 20v-6']} />,
};

/* ══════════════════════════════════════════════════════════════
   CSS — mirrors Dashboard token system exactly
══════════════════════════════════════════════════════════════ */
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
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
  --shadow-glow:0 0 40px rgba(167,139,250,.25);
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
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes pulse-glow{0%,100%{box-shadow:0 0 14px rgba(167,139,250,.3)}50%{box-shadow:0 0 26px rgba(167,139,250,.5)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes dot-blink{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes msg-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes rec-pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,107,157,0)}50%{box-shadow:0 0 0 7px rgba(255,107,157,.14)}}

/* ── MESH BG (identical to Dashboard) ── */
.pc-mesh-bg{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;background:var(--bg)}
.pc-mesh-bg .mesh-blob{position:absolute;filter:blur(80px);opacity:.45;animation:blob-morph 22s ease-in-out infinite}
.pc-blob-1{width:560px;height:560px;background:linear-gradient(135deg,rgba(167,139,250,.35),rgba(255,107,157,.25));top:-12%;left:-8%;animation-delay:0s}
.pc-blob-2{width:480px;height:480px;background:linear-gradient(135deg,rgba(110,231,183,.28),rgba(125,211,252,.25));top:35%;right:-12%;animation-delay:-6s}
.pc-blob-3{width:420px;height:420px;background:linear-gradient(135deg,rgba(251,191,36,.25),rgba(251,113,133,.2));bottom:-8%;left:25%;animation-delay:-11s}
.pc-noise{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.02;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* ── SHELL ── */
.pc-shell{position:relative;z-index:2;display:flex;flex-direction:column;min-height:100vh}


.pc-back-btn:hover{color:var(--lavender);border-color:rgba(167,139,250,.35);transform:translateY(-1px)}

.pc-icon-btn{
  width:38px;height:38px;border-radius:11px;
  background:var(--glass);border:1px solid var(--glass-border);
  display:flex;align-items:center;justify-content:center;
  color:var(--ink2);cursor:pointer;
  transition:all .25s var(--ease);
  box-shadow:var(--shadow-sm);
}
.pc-icon-btn:hover{color:var(--lavender);border-color:rgba(167,139,250,.35);transform:translateY(-2px);box-shadow:var(--shadow-md)}
.pc-notif-dot{
  position:absolute;top:6px;right:6px;
  width:7px;height:7px;border-radius:50%;
  background:var(--coral);border:1.5px solid var(--bg2);
  box-shadow:0 0 6px rgba(255,107,157,.6);
}

/* ── PAGE BODY ── */
.pc-body{padding:1.25rem 2rem 2rem;display:flex;flex-direction:column;gap:2rem;flex:1;max-width:1280px;margin:0 auto;width:100%}

/* ── PAGE HEADER ── */
.pc-page-hdr{
  display:flex;align-items:flex-start;justify-content:space-between;
  gap:1rem;flex-wrap:wrap;
  animation:fadeUp .6s var(--ease) both;
}
.pc-page-title-wrap{}
.pc-page-title{
  font-family:var(--font-d);font-size:1.85rem;font-weight:700;
  letter-spacing:-1px;line-height:1.2;color:var(--ink);
  display:flex;align-items:center;gap:.5rem;margin-bottom:.3rem;
}
.pc-grad{background:linear-gradient(135deg,var(--lavender),var(--coral));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.pc-page-sub{font-size:.9rem;color:var(--ink3);line-height:1.65;max-width:520px}
.pc-hdr-acts{display:flex;align-items:center;gap:.65rem;flex-wrap:wrap;flex-shrink:0}

/* ── CONTEXT STRIP (gradient-border like upgrade banner) ── */
.pc-ctx-wrap{
  border-radius:var(--rl);position:relative;overflow:hidden;
  animation:fadeUp .6s .04s var(--ease) both;
}
.pc-ctx-wrap::before{
  content:'';position:absolute;inset:0;border-radius:var(--rl);padding:2px;
  background:linear-gradient(135deg,var(--lavender),var(--coral));
  -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;
}
.pc-ctx-in{
  background:var(--glass);backdrop-filter:blur(16px);
  border-radius:calc(var(--rl) - 2px);
  padding:1rem 1.4rem;
  display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;
}
.pc-ctx-left{display:flex;align-items:flex-start;gap:.75rem}
.pc-ctx-ico{
  width:36px;height:36px;border-radius:10px;flex-shrink:0;
  background:linear-gradient(135deg,rgba(167,139,250,.18),rgba(255,107,157,.1));
  border:1px solid rgba(167,139,250,.25);
  display:flex;align-items:center;justify-content:center;color:var(--lavender);
}
.pc-ctx-lbl{font-size:.65rem;font-family:var(--font-m);color:var(--ink3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:.2rem}
.pc-ctx-idea{font-size:.84rem;color:var(--ink2);line-height:1.5}
.pc-ctx-idea strong{color:var(--ink)}
.pc-ctx-idea em{color:var(--ink3);font-style:normal}
.pc-ctx-right{display:flex;gap:.6rem;flex-shrink:0}

/* ── ERROR TOAST ── */
.pc-toast{
  display:flex;align-items:flex-start;gap:.65rem;
  padding:.85rem 1.1rem;border-radius:var(--r);
  font-size:.84rem;line-height:1.55;
  animation:fadeUp .4s var(--ease) both;
}
.pc-toast.error{background:rgba(255,107,157,.07);border:1px solid rgba(255,107,157,.2);color:var(--coral)}

/* ── MAIN GRID ── */
.pc-main{
  display:grid;
  grid-template-columns:1fr 380px;
  gap:1.4rem;
  align-items:start;
  animation:fadeUp .6s .08s var(--ease) both;
}

/* ── CHAT CARD ── */
.pc-chat{
  background:var(--glass);backdrop-filter:blur(16px);
  border:1px solid var(--glass-border);
  border-radius:var(--rl);overflow:hidden;
  display:flex;flex-direction:column;
  height:calc(100vh - 280px);
  min-height:520px;
  box-shadow:var(--shadow-md);
  transition:border-color .3s,box-shadow .3s;
}
.pc-chat:focus-within{border-color:rgba(167,139,250,.35);box-shadow:var(--shadow-lg)}

/* chat topbar */
.pc-chat-bar{
  display:flex;align-items:center;justify-content:space-between;
  padding:.85rem 1.3rem;
  border-bottom:1px solid var(--border);
  background:rgba(255,255,255,.5);flex-shrink:0;
}
.pc-coach-row{display:flex;align-items:center;gap:.7rem}
.pc-coach-av{
  width:36px;height:36px;border-radius:11px;flex-shrink:0;
  background:linear-gradient(135deg,var(--lavender),var(--coral));
  display:flex;align-items:center;justify-content:center;color:#fff;
  box-shadow:0 0 14px rgba(167,139,250,.35);
  animation:pulse-glow 3s ease-in-out infinite;
}
.pc-coach-name{font-family:var(--font-d);font-size:.9rem;font-weight:700;color:var(--ink)}
.pc-coach-status{font-size:.65rem;color:#059669;font-family:var(--font-m);display:flex;align-items:center;gap:.3rem}
.pc-coach-dot{width:5px;height:5px;border-radius:50%;background:#059669;box-shadow:0 0 5px #059669;animation:dot-blink 2s ease-in-out infinite}
.pc-bar-acts{display:flex;align-items:center;gap:.5rem}

/* messages */
.pc-msgs{
  flex:1;overflow-y:auto;
  padding:1.3rem;
  display:flex;flex-direction:column;gap:1rem;
  scroll-behavior:smooth;
}
.pc-msgs::-webkit-scrollbar{width:4px}
.pc-msgs::-webkit-scrollbar-thumb{background:rgba(167,139,250,.25);border-radius:2px}

/* empty state */
.pc-empty{
  margin:auto;text-align:center;
  display:flex;flex-direction:column;align-items:center;gap:.85rem;
  padding:2.5rem 1.5rem;
}
.pc-empty-ico{
  width:58px;height:58px;border-radius:18px;
  background:linear-gradient(135deg,rgba(167,139,250,.15),rgba(255,107,157,.1));
  border:1px solid rgba(167,139,250,.2);
  display:flex;align-items:center;justify-content:center;color:var(--lavender);
  animation:pulse-glow 3s ease-in-out infinite;
}
.pc-empty-title{font-family:var(--font-d);font-size:1.1rem;font-weight:700;color:var(--ink)}
.pc-empty-desc{font-size:.83rem;color:var(--ink3);line-height:1.65;max-width:300px}
.pc-prompts{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-top:.25rem;width:100%}
.pc-prompt{
  padding:.6rem .75rem;border-radius:11px;
  background:var(--glass);border:1px solid var(--border);
  font-size:.76rem;color:var(--ink3);cursor:pointer;text-align:left;
  font-family:var(--font-b);line-height:1.45;
  transition:all .22s var(--ease);
}
.pc-prompt:hover{border-color:rgba(167,139,250,.4);color:var(--lavender);background:rgba(167,139,250,.06);transform:translateY(-2px);box-shadow:var(--shadow-sm)}

/* bubbles */
.pc-msg{display:flex;flex-direction:column;gap:.28rem;max-width:82%}
.pc-msg.user{align-self:flex-end}
.pc-msg.assistant{align-self:flex-start}
.pc-bubble{
  padding:.8rem 1.05rem;border-radius:14px;
  font-size:.875rem;line-height:1.65;white-space:pre-wrap;
  animation:msg-in .3s var(--ease) both;
}
.pc-msg.user     .pc-bubble{background:linear-gradient(135deg,var(--lavender),var(--coral));color:#fff;font-weight:500;border-bottom-right-radius:4px;box-shadow:0 4px 14px rgba(167,139,250,.25)}
.pc-msg.assistant .pc-bubble{background:rgba(255,255,255,.6);border:1px solid var(--border);color:var(--ink);border-bottom-left-radius:4px;box-shadow:var(--shadow-sm)}
.pc-msg-foot{display:flex;align-items:center;gap:.38rem}
.pc-msg.user .pc-msg-foot{justify-content:flex-end}
.pc-msg-who{font-size:.63rem;color:var(--ink3);font-family:var(--font-m)}
.pc-action-btn{
  padding:.14rem .42rem;border-radius:6px;
  background:var(--glass);border:1px solid var(--border);
  color:var(--ink3);font-size:.62rem;font-family:var(--font-m);
  cursor:pointer;display:inline-flex;align-items:center;gap:.22rem;
  transition:all .18s;
}
.pc-action-btn.listen:hover{color:var(--lavender);border-color:rgba(167,139,250,.3);background:rgba(167,139,250,.07)}
.pc-action-btn.copy-btn:hover{color:#059669;border-color:rgba(110,231,183,.3);background:rgba(110,231,183,.07)}

/* typing indicator */
.pc-typing{
  display:flex;align-items:center;gap:.5rem;align-self:flex-start;
  padding:.65rem 1rem;border-radius:12px;
  background:rgba(255,255,255,.6);border:1px solid var(--border);
  box-shadow:var(--shadow-sm);
}
.pc-typing-dots{display:flex;gap:.32rem}
.pc-td{width:6px;height:6px;border-radius:50%;background:var(--lavender);animation:td-bounce .6s ease-in-out infinite alternate}
.pc-td:nth-child(2){animation-delay:.15s}
.pc-td:nth-child(3){animation-delay:.3s}
@keyframes td-bounce{from{transform:translateY(0);opacity:.35}to{transform:translateY(-5px);opacity:1}}
.pc-typing-lbl{font-size:.74rem;color:var(--ink3);font-family:var(--font-m)}

/* input area */
.pc-input-area{
  padding:.95rem 1.2rem;
  border-top:1px solid var(--border);
  background:rgba(255,255,255,.5);flex-shrink:0;
  display:flex;flex-direction:column;gap:.65rem;
}
.pc-input-row{display:flex;align-items:flex-end;gap:.5rem}
.pc-textarea{
  flex:1;padding:.75rem 1rem;
  border-radius:12px;
  background:rgba(255,255,255,.8);border:1.5px solid var(--border2);
  color:var(--ink);font-family:var(--font-b);font-size:.875rem;
  outline:none;transition:all .25s var(--ease);
  resize:none;min-height:42px;max-height:130px;line-height:1.5;
  box-shadow:var(--shadow-sm);
}
.pc-textarea::placeholder{color:var(--ink3)}
.pc-textarea:focus{border-color:var(--lavender);background:#fff;box-shadow:0 0 0 3px rgba(167,139,250,.12)}
.pc-textarea:disabled{opacity:.5}
.pc-send{
  width:42px;height:42px;border-radius:12px;flex-shrink:0;
  background:linear-gradient(135deg,var(--lavender),var(--coral));border:none;
  cursor:pointer;color:#fff;display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 14px rgba(167,139,250,.3);
  transition:all .22s var(--spring);
}
.pc-send:hover:not(:disabled){transform:translateY(-2px) scale(1.04);box-shadow:0 8px 22px rgba(255,107,157,.4)}
.pc-send:disabled{opacity:.4;cursor:not-allowed;transform:none}
.pc-mic{
  width:42px;height:42px;border-radius:12px;flex-shrink:0;
  background:var(--glass);border:1.5px solid var(--border2);
  cursor:pointer;color:var(--ink3);display:flex;align-items:center;justify-content:center;
  transition:all .22s var(--ease);box-shadow:var(--shadow-sm);
}
.pc-mic:hover:not(:disabled){border-color:rgba(167,139,250,.4);color:var(--lavender);background:rgba(167,139,250,.08)}
.pc-mic.rec{background:rgba(255,107,157,.1);border-color:rgba(255,107,157,.4);color:var(--coral);animation:rec-pulse 1s ease-in-out infinite}
.pc-tools{display:flex;align-items:center;gap:.45rem;flex-wrap:wrap}
.pc-tool{
  padding:.3rem .72rem;border-radius:var(--rp);
  background:var(--glass);border:1px solid var(--border2);
  color:var(--ink3);font-size:.7rem;font-family:var(--font-m);
  cursor:pointer;display:inline-flex;align-items:center;gap:.28rem;
  transition:all .18s var(--ease);
}
.pc-tool:hover:not(:disabled){border-color:rgba(167,139,250,.4);color:var(--lavender);background:rgba(167,139,250,.07)}
.pc-tool:disabled{opacity:.35;cursor:not-allowed}
.pc-rec-err{font-size:.7rem;color:var(--coral);font-family:var(--font-m)}

/* ── RIGHT PANEL ── */
.pc-right{display:flex;flex-direction:column;gap:1.2rem}

/* ── REPORT CARD (gradient-border like pitch coach CTA on Dashboard) ── */
.pc-report-wrap{
  border-radius:var(--rl);position:relative;overflow:hidden;
  animation:fadeUp .6s .12s var(--ease) both;
}
.pc-report-wrap::before{
  content:'';position:absolute;inset:0;border-radius:var(--rl);padding:2px;
  background:linear-gradient(135deg,var(--peach),var(--coral),var(--lavender));
  -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;
}
.pc-report{
  background:var(--glass);backdrop-filter:blur(16px);
  border-radius:calc(var(--rl) - 2px);
  overflow:hidden;
}
.pc-report-hdr{
  display:flex;align-items:center;justify-content:space-between;
  padding:1rem 1.25rem;border-bottom:1px solid var(--border);
  background:rgba(251,191,36,.05);flex-wrap:wrap;gap:.6rem;
}
.pc-report-title{
  display:flex;align-items:center;gap:.5rem;
  font-family:var(--font-d);font-size:.95rem;font-weight:700;color:var(--ink);
}
.pc-overall-badge{
  padding:.24rem .7rem;border-radius:var(--rp);
  background:linear-gradient(135deg,var(--peach),#F59E0B);
  color:#3A2400;font-size:.68rem;font-weight:800;font-family:var(--font-m);
}
.pc-report-body{padding:1.15rem 1.25rem;display:flex;flex-direction:column;gap:1.05rem}

/* scores */
.pc-scores{display:grid;grid-template-columns:1fr 1fr;gap:.6rem}
.pc-score{
  background:rgba(255,255,255,.6);border:1px solid var(--border);
  border-radius:12px;padding:.75rem;text-align:center;
  transition:all .25s var(--ease);
  box-shadow:var(--shadow-sm);
}
.pc-score:hover{border-color:rgba(251,191,36,.3);transform:translateY(-2px);box-shadow:var(--shadow-md)}
.pc-score-num{font-family:var(--font-d);font-size:1.45rem;font-weight:700;letter-spacing:-1px;line-height:1;color:var(--peach)}
.pc-score-lbl{font-size:.6rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.08em;font-family:var(--font-m);margin-top:.22rem}
.pc-score-bar{height:3px;background:var(--bg3);border-radius:2px;overflow:hidden;margin-top:.35rem}
.pc-score-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--peach),var(--coral));transition:width 1.2s var(--ease)}

/* report sections */
.pc-rs-label{
  font-size:.65rem;font-family:var(--font-m);
  text-transform:uppercase;letter-spacing:.08em;font-weight:600;
  margin-bottom:.38rem;display:flex;align-items:center;gap:.32rem;
}
.rs-ok{color:#059669}
.rs-bad{color:var(--coral)}
.rs-info{color:var(--lavender)}
.pc-rs-text{font-size:.82rem;color:var(--ink3);line-height:1.58}
.pc-action-list{list-style:none;padding:0;display:flex;flex-direction:column;gap:.42rem}
.pc-action-item{display:flex;align-items:flex-start;gap:.48rem;font-size:.8rem;color:var(--ink3);line-height:1.5}
.pc-ai-n{
  width:18px;height:18px;border-radius:50%;flex-shrink:0;
  background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.22);
  color:var(--lavender);font-family:var(--font-m);
  font-size:.57rem;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:1px;
}

/* no report placeholder */
.pc-no-report{
  background:var(--glass);backdrop-filter:blur(16px);
  border:1px solid var(--glass-border);
  border-radius:var(--rl);padding:1.6rem 1.3rem;
  display:flex;flex-direction:column;align-items:center;gap:.85rem;text-align:center;
  box-shadow:var(--shadow-md);
  animation:fadeUp .6s .12s var(--ease) both;
}
.pc-no-report-ico{
  width:52px;height:52px;border-radius:15px;
  background:linear-gradient(135deg,rgba(251,191,36,.15),rgba(255,107,157,.1));
  border:1px solid rgba(251,191,36,.25);
  display:flex;align-items:center;justify-content:center;color:var(--peach);
  animation:pulse-glow 3s ease-in-out infinite;
}
.pc-no-report-title{font-family:var(--font-d);font-size:.95rem;font-weight:700;color:var(--ink)}
.pc-no-report-sub{font-size:.79rem;color:var(--ink3);line-height:1.6;max-width:250px}

/* ── TIPS CARD ── */
.pc-tips{
  background:var(--glass);backdrop-filter:blur(16px);
  border:1px solid var(--glass-border);
  border-radius:var(--rl);padding:1.2rem 1.3rem;
  box-shadow:var(--shadow-md);
  animation:fadeUp .6s .16s var(--ease) both;
}
.pc-tips-title{font-family:var(--font-d);font-size:.92rem;font-weight:700;margin-bottom:.8rem;display:flex;align-items:center;gap:.4rem;color:var(--ink)}
.pc-tip-list{display:flex;flex-direction:column;gap:.5rem}
.pc-tip{display:flex;align-items:flex-start;gap:.52rem;font-size:.78rem;color:var(--ink3);line-height:1.5}
.pc-tip-ico{flex-shrink:0;margin-top:2px;color:var(--lavender)}

/* ── BUTTONS (match Dashboard exactly) ── */
.btn-primary{padding:.65rem 1.4rem;border-radius:var(--rp);background:linear-gradient(135deg,var(--lavender),var(--coral));border:none;cursor:pointer;color:#fff;font-family:var(--font-d);font-size:.875rem;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:.4rem;box-shadow:0 4px 16px rgba(167,139,250,.3);transition:all .25s var(--spring)}
.btn-primary:hover:not(:disabled){transform:translateY(-2px) scale(1.02);box-shadow:0 8px 28px rgba(255,107,157,.4)}
.btn-primary:disabled{opacity:.4;cursor:not-allowed;transform:none}
.btn-peach{padding:.65rem 1.4rem;border-radius:var(--rp);background:linear-gradient(135deg,var(--peach),#F59E0B);border:none;cursor:pointer;color:#3A2400;font-family:var(--font-d);font-size:.875rem;font-weight:700;display:inline-flex;align-items:center;gap:.4rem;box-shadow:0 4px 16px rgba(251,191,36,.25);transition:all .25s var(--spring)}
.btn-peach:hover:not(:disabled){transform:translateY(-2px) scale(1.02);box-shadow:0 8px 24px rgba(251,191,36,.4)}
.btn-peach:disabled{opacity:.4;cursor:not-allowed;transform:none}
.btn-ghost-sm{padding:.6rem 1.3rem;border-radius:var(--rp);background:var(--glass);backdrop-filter:blur(10px);border:2px solid var(--border2);cursor:pointer;color:var(--ink2);font-family:var(--font-d);font-size:.85rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:.4rem;transition:all .25s var(--ease)}
.btn-ghost-sm:hover:not(:disabled){border-color:var(--lavender);color:var(--lavender);background:rgba(167,139,250,.06)}
.btn-ghost-sm:disabled{opacity:.38;cursor:not-allowed}

/* ── LOADING ── */
.pc-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;height:80vh;gap:1rem}
.pc-spin{width:44px;height:44px;border-radius:50%;border:3px solid rgba(167,139,250,.2);border-top-color:var(--lavender);animation:spin .75s linear infinite}
.pc-spin-txt{color:var(--ink3);font-size:.9rem;font-family:var(--font-m)}

/* ── RESPONSIVE ── */
@media(max-width:1060px){.pc-main{grid-template-columns:1fr}.pc-right{order:-1}.pc-chat{height:480px;min-height:420px}}
@media(max-width:768px){
  .pc-body{padding:1.25rem}
  .pc-page-title{font-size:1.4rem}
  .pc-prompts{grid-template-columns:1fr}
  .pc-hdr-acts{width:100%}
  .pc-hdr-acts .btn-primary,.pc-hdr-acts .btn-peach,.pc-hdr-acts .btn-ghost-sm{flex:1;justify-content:center}
}
@media(max-width:480px){
  .pc-scores{grid-template-columns:1fr 1fr}
  .pc-page-hdr{flex-direction:column}
}
`;

/* ── Animated score bar ── */
function ScoreBar({ val }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW((val / 10) * 100), 400); return () => clearTimeout(t); }, [val]);
  return <div className="pc-score-bar"><div className="pc-score-fill" style={{ width: `${w}%` }} /></div>;
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const PitchCoach = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [messages,     setMessages]     = useState([]);
  const [report,       setReport]       = useState(null);
  const [input,        setInput]        = useState('');
  const [loading,      setLoading]      = useState(true);
  const [sending,      setSending]      = useState(false);
  const [errorMsg,     setErrorMsg]     = useState('');
  const [recording,    setRecording]    = useState(false);
  const [recSupported, setRecSupported] = useState(false);
  const [recError,     setRecError]     = useState('');
  const [lastAIText,   setLastAIText]   = useState('');
  const [copied,       setCopied]       = useState(null);
  const [collapsed,    setCollapsed]    = useState(false);

  const endRef   = useRef(null);
  const recRef   = useRef(null);
  const inputRef = useRef(null);

  /* CSS + fonts */
  useEffect(() => {
    injectFonts();
    let el = document.getElementById('pc-css');
    if (!el) { el = document.createElement('style'); el.id = 'pc-css'; document.head.appendChild(el); }
    el.textContent = CSS;
  }, []);

  /* Speech recognition */
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    setRecSupported(true);
    const rec = new SR();
    rec.continuous = false; rec.interimResults = false; rec.lang = 'en-US';
    rec.onresult = e => { setInput(Array.from(e.results).map(r => r[0]?.transcript).join(' ')); setRecording(false); };
    rec.onerror  = () => { setRecError('Speech recognition failed. Try again.'); setRecording(false); };
    rec.onend    = () => setRecording(false);
    recRef.current = rec;
  }, []);

  /* Fetch history */
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/pitch-coach/history`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) { const d = await res.json(); setMessages(d.messages || []); setReport(d.feedbackReport || null); }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [token]);

  /* Auto-scroll */
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, sending]);

  /* TTS */
  const speak = useCallback((text) => {
    if (!window.speechSynthesis || !text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = 1; u.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }, []);

  /* Send */
  const handleSend = useCallback(async (e, custom = null) => {
    console.log("HANDLE SEND CALLED");
    if (e) e.preventDefault();
    const text = (custom || input).trim();
    if (!text || sending) return;
    setInput('');
    setErrorMsg('');
    setMessages(prev => [...prev, { role: 'user', content: text, timestamp: new Date() }]);
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/pitch-coach/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reach Pitch Coach');
      setMessages(data.session.messages);
      const last = data.session.messages.slice().reverse().find(m => m.role === 'assistant');
      if (last) {
        const clean = last.content.replace(/<feedback_report>[\s\S]*?<\/feedback_report>/g, '').trim();
        setLastAIText(clean);
        speak(clean);
      }
      if (data.feedbackReport) { setReport(data.feedbackReport); setCollapsed(false); }
    } catch (err) {
      setErrorMsg(err.message || 'Connection lost. Please try again.');
    } finally { setSending(false); }
  }, [input, sending, token, speak]);

  /* Voice toggle */
  const toggleRec = () => {
    setRecError('');
    if (!recRef.current) { setRecError('Voice not supported in this browser.'); return; }
    if (recording) { recRef.current.stop(); setRecording(false); }
    else { try { setRecording(true); recRef.current.start(); } catch (e) { setRecError('Refresh and try again.'); setRecording(false); } }
  };

  /* Copy */
  const copyMsg = (text, idx) => {
    navigator.clipboard?.writeText(text).then(() => { setCopied(idx); setTimeout(() => setCopied(null), 1800); });
  };

  /* Request report */
  const requestReport = () => handleSend(null, 'Please generate a Pitch Feedback Report based on our full conversation and the responses I have given so far.');

  /* PDF export */
  const downloadPDF = () => {
    if (!report) return;
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const M = 44, LH = 18; let y = M;
    doc.setFontSize(20); doc.text('Pitch Coach Feedback Report', M, y); y += 30;
    doc.setFontSize(11);
    doc.text(`Founder: ${user?.email || 'Startup Founder'}`, M, y); y += 18;
    doc.text(`Category: ${user?.category || 'Not specified'}`, M, y); y += 18;
    doc.text(`Idea: ${(user?.startupIdea || '').substring(0, 150)}`, M, y, { maxWidth: 520 }); y += 36;
    const addSec = (title, text) => {
      doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.text(title, M, y); y += 20;
      doc.setFontSize(11); doc.setFont('helvetica', 'normal');
      const s = doc.splitTextToSize(text, 520); doc.text(s, M, y); y += s.length * LH + 12;
      if (y > 720) { doc.addPage(); y = M; }
    };
    addSec('Overall Score', `${report.scores?.overall}/10`);
    addSec('Clarity', `${report.scores?.clarity}/10`);
    addSec('Market Understanding', `${report.scores?.marketUnderstanding}/10`);
    addSec('Value Proposition', `${report.scores?.valueProposition}/10`);
    addSec('Storytelling', `${report.scores?.storytelling}/10`);
    addSec('Key Strength', report.keyStrength || 'N/A');
    addSec('Critical Gap', report.criticalGap || 'N/A');
    if (Array.isArray(report.actionItems)) {
      doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.text('Action Items', M, y); y += 20;
      doc.setFontSize(11); doc.setFont('helvetica', 'normal');
      report.actionItems.forEach((item, i) => {
        const s = doc.splitTextToSize(`${i + 1}. ${item}`, 520); doc.text(s, M, y); y += s.length * LH + 6;
        if (y > 720) { doc.addPage(); y = M; }
      });
    }
    doc.save('Pitch-Coach-Report.pdf');
  };

  const PROMPTS = [
    'My startup solves ___ for ___.',
    'My target customer is...',
    "What makes my solution 10× better?",
    'Walk me through my business model.',
  ];

  const TIPS = [
    [Icons.Target,  'Lead with the problem, not your solution.'],
    [Icons.Globe,   'Define market size with real data points.'],
    [Icons.TrendUp, 'Show traction: users, revenue, or waitlist.'],
    [Icons.Award,   'State your unfair advantage clearly.'],
    [Icons.Sparkles,'Use "Get Pitch Report" to see your full score.'],
  ];

  /* ── Loading screen (matches Dashboard) ── */
  if (loading) return (
    <>
      <div className="pc-mesh-bg" aria-hidden="true">
        <div className="mesh-blob pc-blob-1" />
        <div className="mesh-blob pc-blob-2" />
        <div className="mesh-blob pc-blob-3" />
      </div>
      <div className="pc-noise" />
      <div className="pc-loading">
        <div className="pc-spin" />
        <p className="pc-spin-txt">Loading Pitch Coach...</p>
      </div>
    </>
  );

  return (
    <>
      {/* Ambient mesh background — identical technique to Dashboard */}
      <div className="pc-mesh-bg" aria-hidden="true">
        <div className="mesh-blob pc-blob-1" />
        <div className="mesh-blob pc-blob-2" />
        <div className="mesh-blob pc-blob-3" />
      </div>
      <div className="pc-noise" />

      <div className="pc-shell">
        <main style={{ flex: 1, position: 'relative', zIndex: 2 }}>

          

          {/* ── BODY ── */}
          <div className="pc-body">

            {/* Page header */}
            <div className="pc-page-hdr">
              <div className="pc-page-title-wrap">
                <h1 className="pc-page-title">
                  <span className="pc-grad">Pitch Coach</span>
                  <Icons.Sparkles s={22} />
                </h1>
                <p className="pc-page-sub">
                  Stress-test your assumptions, sharpen your story, and get investor-grade feedback powered by Claude AI.
                </p>
              </div>
              <div className="pc-hdr-acts">
                {report && (
                  <button className="btn-peach" onClick={downloadPDF}>
                    <Icons.Download s={13} /> Download PDF
                  </button>
                )}
                <button
                  className="btn-primary"
                  onClick={requestReport}
                  disabled={sending || messages.length === 0}
                >
                  <Icons.Award s={13} /> Get Pitch Report
                </button>
                {lastAIText && (
                  <button className="btn-ghost-sm" onClick={() => speak(lastAIText)}>
                    <Icons.Volume s={13} /> Replay
                  </button>
                )}
              </div>
            </div>

            {/* Context strip */}
            <div className="pc-ctx-wrap">
              <div className="pc-ctx-in">
                <div className="pc-ctx-left">
                  <div className="pc-ctx-ico"><Icons.User s={16} /></div>
                  <div>
                    <div className="pc-ctx-lbl">Your Startup Profile</div>
                    <div className="pc-ctx-idea">
                      {user?.category && <strong>[{user.category}] </strong>}
                      {user?.startupIdea
                        ? `"${user.startupIdea.substring(0, 120)}${user.startupIdea.length > 120 ? '…' : ''}"`
                        : <em>No startup idea on file — add one in your profile.</em>}
                    </div>
                  </div>
                </div>
                <div className="pc-ctx-right">
                  <Link to="/profile" className="btn-ghost-sm" style={{ fontSize: '.78rem', padding: '.4rem 1rem' }}>
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Error toast */}
            {errorMsg && (
              <div className="pc-toast error">
                <span style={{ flexShrink: 0, marginTop: 1 }}><Icons.Alert s={15} /></span>
                {errorMsg}
              </div>
            )}

            {/* Main grid */}
            <div className="pc-main">

              {/* ── CHAT ── */}
              <div className="pc-chat">

                {/* Chat topbar */}
                <div className="pc-chat-bar">
                  <div className="pc-coach-row">
                    <div className="pc-coach-av"><Icons.Brain s={16} /></div>
                    <div>
                      <div className="pc-coach-name">Pitch Coach</div>
                      <div className="pc-coach-status">
                        <div className="pc-coach-dot" /> Claude AI · Live session
                      </div>
                    </div>
                  </div>
                  <div className="pc-bar-acts">
                    {messages.length > 0 && (
                      <button
                        className="btn-ghost-sm"
                        onClick={requestReport}
                        disabled={sending}
                        style={{ fontSize: '.72rem', padding: '.3rem .7rem' }}
                      >
                        <Icons.Award s={11} /> Report
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="pc-msgs">
                  {messages.length === 0 ? (
                    <div className="pc-empty">
                      <div className="pc-empty-ico"><Icons.Compass s={24} /></div>
                      <div className="pc-empty-title">Start pitching your idea</div>
                      <p className="pc-empty-desc">
                        Introduce your startup, describe your target customer, or ask the coach to pressure-test your assumptions.
                      </p>
                      <div className="pc-prompts">
                        {PROMPTS.map((p, i) => (
                          <button key={i} className="pc-prompt" onClick={() => { setInput(p); inputRef.current?.focus(); }}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isUser = msg.role === 'user';
                      const clean = msg.content.replace(/<feedback_report>[\s\S]*?<\/feedback_report>/g, '').trim();
                      if (!clean) return null;
                      return (
                        <div key={idx} className={`pc-msg ${isUser ? 'user' : 'assistant'}`}>
                          <div className="pc-bubble">{clean}</div>
                          <div className="pc-msg-foot">
                            <span className="pc-msg-who">{isUser ? 'You' : 'Pitch Coach'}</span>
                            <button className="pc-action-btn listen" onClick={() => speak(clean)}>
                              <Icons.Volume s={10} /> listen
                            </button>
                            <button className="pc-action-btn copy-btn" onClick={() => copyMsg(clean, idx)}>
                              {copied === idx
                                ? <><Icons.Check s={10} /> copied</>
                                : <><Icons.Copy s={10} /> copy</>}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {sending && (
                    <div className="pc-typing">
                      <div className="pc-typing-dots">
                        <div className="pc-td" /><div className="pc-td" /><div className="pc-td" />
                      </div>
                      <span className="pc-typing-lbl">Coach is analyzing…</span>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>

                {/* Input area */}
                <form className="pc-input-area" onSubmit={handleSend}>
                  {recError && <div className="pc-rec-err">{recError}</div>}
                  <div className="pc-input-row">
                    <button
                      type="button"
                      className={`pc-mic${recording ? ' rec' : ''}`}
                      onClick={toggleRec}
                      disabled={!recSupported}
                      title={recSupported ? 'Voice input' : 'Not supported in this browser'}
                    >
                      {recording ? <Icons.MicOff s={16} /> : <Icons.Mic s={16} />}
                    </button>
                    <textarea
                      ref={inputRef}
                      className="pc-textarea"
                      rows={1}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                      placeholder="Type your pitch or question… (Enter to send, Shift+Enter for newline)"
                      disabled={sending}
                    />
                    <button type="submit" className="pc-send" disabled={sending || !input.trim()}>
                      <Icons.Send s={15} />
                    </button>
                  </div>
                  <div className="pc-tools">
                    <button type="button" className="pc-tool" onClick={requestReport} disabled={sending || messages.length === 0}>
                      <Icons.Sparkles s={11} /> Full report
                    </button>
                    {lastAIText && (
                      <button type="button" className="pc-tool" onClick={() => speak(lastAIText)}>
                        <Icons.Volume s={11} /> Replay
                      </button>
                    )}
                    {messages.length > 0 && (
                      <button type="button" className="pc-tool" onClick={() => handleSend(null, 'What are my biggest weaknesses in this pitch so far?')}>
                        <Icons.Target s={11} /> Find weaknesses
                      </button>
                    )}
                    {messages.length > 0 && (
                      <button type="button" className="pc-tool" onClick={() => handleSend(null, 'How would a Series A investor react to my pitch right now?')}>
                        <Icons.Award s={11} /> VC reaction
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* ── RIGHT PANEL ── */}
              <div className="pc-right">

                {/* Report card or placeholder */}
                {report ? (
                  <div className="pc-report-wrap">
                    <div className="pc-report">
                      <div className="pc-report-hdr">
                        <div className="pc-report-title">
                          <Icons.Award s={15} /> Pitch Report
                        </div>
                        <div style={{ display: 'flex', gap: '.48rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span className="pc-overall-badge">{report.scores?.overall}/10</span>
                          <button
                            className="btn-ghost-sm"
                            onClick={() => setCollapsed(v => !v)}
                            style={{ padding: '.22rem .5rem', fontSize: '.7rem' }}
                          >
                            {collapsed ? <Icons.ChevDown s={12} /> : <Icons.ChevUp s={12} />}
                          </button>
                          <button
                            className="btn-peach"
                            onClick={downloadPDF}
                            style={{ padding: '.28rem .65rem', fontSize: '.7rem' }}
                          >
                            <Icons.Download s={11} />
                          </button>
                        </div>
                      </div>

                      {!collapsed && (
                        <div className="pc-report-body">
                          <div className="pc-scores">
                            {[
                              { lbl: 'Clarity',    val: report.scores?.clarity },
                              { lbl: 'Market',     val: report.scores?.marketUnderstanding },
                              { lbl: 'Value Prop', val: report.scores?.valueProposition },
                              { lbl: 'Story',      val: report.scores?.storytelling },
                            ].map(({ lbl, val }) => (
                              <div className="pc-score" key={lbl}>
                                <div className="pc-score-num">{val}/10</div>
                                <div className="pc-score-lbl">{lbl}</div>
                                <ScoreBar val={val || 0} />
                              </div>
                            ))}
                          </div>

                          <div>
                            <div className="pc-rs-label rs-ok"><Icons.CheckCircle s={10} /> Key Strength</div>
                            <p className="pc-rs-text">{report.keyStrength || '—'}</p>
                          </div>
                          <div>
                            <div className="pc-rs-label rs-bad"><Icons.Alert s={10} /> Critical Gap</div>
                            <p className="pc-rs-text">{report.criticalGap || '—'}</p>
                          </div>

                          {Array.isArray(report.actionItems) && report.actionItems.length > 0 && (
                            <div>
                              <div className="pc-rs-label rs-info"><Icons.Zap s={10} /> Action Items</div>
                              <ul className="pc-action-list">
                                {report.actionItems.map((item, i) => (
                                  <li key={i} className="pc-action-item">
                                    <span className="pc-ai-n">{i + 1}</span>{item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <button
                            className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center' }}
                            onClick={requestReport}
                            disabled={sending}
                          >
                            <Icons.Refresh s={13} /> Regenerate Report
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="pc-no-report">
                    <div className="pc-no-report-ico"><Icons.Award s={22} /></div>
                    <div className="pc-no-report-title">No report yet</div>
                    <p className="pc-no-report-sub">Chat with the coach first, then click "Get Pitch Report" for your full scored breakdown.</p>
                    <button
                      className="btn-peach"
                      onClick={requestReport}
                      disabled={sending || messages.length === 0}
                      style={{ width: '100%', justifyContent: 'center', padding: '.65rem 1rem', borderRadius: '12px' }}
                    >
                      <Icons.Sparkles s={13} /> Generate Report
                    </button>
                  </div>
                )}

                {/* Pitch tips card */}
                <div className="pc-tips">
                  <div className="pc-tips-title"><Icons.Zap s={14} /> Pitch tips</div>
                  <div className="pc-tip-list">
                    {TIPS.map(([IcoComp, tip], i) => (
                      <div key={i} className="pc-tip">
                        <span className="pc-tip-ico"><IcoComp s={12} /></span>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>{/* pc-body */}
        </main>
      </div>{/* pc-shell */}
    </>
  );
};

export default PitchCoach;