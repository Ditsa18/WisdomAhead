import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ═══════════════════════════════════════════════════════════════
   Login.jsx — Matches MindLaunch Gen-Z Light Theme
   ─ Same palette: warm cream #FEFCF9, lavender/coral/mint/sky
   ─ Same fonts: Space Grotesk + Inter + JetBrains Mono
   ─ Glassmorphism cards, gradient mesh blobs, spring animations
   ─ Two-column layout: left brand panel + right form panel
═══════════════════════════════════════════════════════════════ */

const injectFonts = () => {
  if (document.getElementById('ml-fonts')) return;
  const l = document.createElement('link');
  l.id = 'ml-fonts'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(l);
};

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{height:100%}

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
  --bounce:cubic-bezier(.68,-.55,.265,1.55);
  --font-d:'Space Grotesk',sans-serif;
  --font-b:'Inter',sans-serif;
  --font-m:'JetBrains Mono',monospace;
}

body{
  background:var(--bg);
  color:var(--ink);
  font-family:var(--font-b);
  overflow-x:hidden;
  min-height:100vh;
}

/* ── KEYFRAMES ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes blob-morph{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}50%{border-radius:50% 60% 30% 60%/30% 40% 70% 60%}75%{border-radius:60% 40% 60% 40%/40% 30% 60% 50%}}
@keyframes float-slow{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-16px) rotate(4deg)}}
@keyframes pop-in{0%{opacity:0;transform:scale(.82) rotate(-4deg)}70%{transform:scale(1.08) rotate(2deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes gradient-shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes pulse-glow{0%,100%{box-shadow:0 0 20px rgba(167,139,250,.3)}50%{box-shadow:0 0 40px rgba(167,139,250,.5)}}
@keyframes wiggle{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes slide-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}

/* ── MESH BACKGROUND ── */
.lmesh{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.lblob{position:absolute;filter:blur(80px);opacity:.45;animation:blob-morph 22s ease-in-out infinite}
.lb1{width:550px;height:550px;background:linear-gradient(135deg,rgba(167,139,250,.4),rgba(255,107,157,.28));top:-18%;left:-12%;animation-delay:0s}
.lb2{width:420px;height:420px;background:linear-gradient(135deg,rgba(110,231,183,.28),rgba(125,211,252,.28));top:45%;right:-14%;animation-delay:-7s}
.lb3{width:380px;height:380px;background:linear-gradient(135deg,rgba(251,191,36,.25),rgba(251,113,133,.22));bottom:-12%;left:35%;animation-delay:-14s}

/* ── PAGE LAYOUT ── */
.lpage{
  position:relative;z-index:1;
  min-height:100vh;
  display:grid;
  grid-template-columns:1.1fr 1fr;
}

/* ══════════════════════════
   LEFT BRAND PANEL
══════════════════════════ */
.lLeft{
  padding:clamp(2rem,4vw,3.5rem);
  display:flex;flex-direction:column;justify-content:space-between;
  background:linear-gradient(160deg,rgba(248,246,255,.85) 0%,rgba(255,245,248,.65) 100%);
  backdrop-filter:blur(32px);
  border-right:1px solid var(--glass-border);
  position:relative;overflow:hidden;
}

/* inner left decoration orbs */
.lLeft-orb1{position:absolute;top:-60px;left:-60px;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(167,139,250,.18) 0%,transparent 70%);pointer-events:none;animation:float-slow 18s ease-in-out infinite}
.lLeft-orb2{position:absolute;bottom:-40px;right:-40px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,107,157,.14) 0%,transparent 70%);pointer-events:none;animation:float-slow 22s ease-in-out infinite reverse}

/* logo */
.lLogo{display:flex;align-items:center;gap:.5rem;text-decoration:none;color:var(--ink);font-family:var(--font-d);font-size:1.25rem;font-weight:700;letter-spacing:-.5px;position:relative;z-index:1}
.lLogoIcon{width:36px;height:36px;background:linear-gradient(135deg,var(--lavender),var(--coral));border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1rem;color:#fff;font-family:var(--font-d);font-weight:700;box-shadow:0 4px 16px rgba(167,139,250,.35);transition:all .3s var(--spring);position:relative;overflow:hidden;flex-shrink:0}
.lLogoIcon::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--coral),var(--peach));opacity:0;transition:opacity .3s}
.lLogo:hover .lLogoIcon{transform:rotate(-10deg) scale(1.1);box-shadow:0 8px 28px rgba(255,107,157,.4)}
.lLogo:hover .lLogoIcon::before{opacity:1}
.lLogoIcon span{position:relative;z-index:1}
.lLogoText{background:linear-gradient(135deg,var(--lavender),var(--coral));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

/* left body */
.lLeftBody{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;justify-content:center;padding:2rem 0}

.lTag{display:inline-flex;align-items:center;gap:.5rem;padding:.35rem .9rem;border-radius:var(--rp);background:linear-gradient(135deg,rgba(167,139,250,.1),rgba(255,107,157,.07));border:1px solid rgba(167,139,250,.2);color:var(--lavender);font-family:var(--font-m);font-size:.72rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1.5rem;width:fit-content;animation:pop-in .5s var(--spring) both}
.lTagDot{width:6px;height:6px;border-radius:50%;background:var(--lavender);box-shadow:0 0 8px var(--lavender);animation:pulse-glow 2s ease-in-out infinite;flex-shrink:0}

.lLeftH{font-family:var(--font-d);font-size:clamp(2rem,3vw,2.8rem);font-weight:700;letter-spacing:-2px;line-height:1.08;margin-bottom:1rem;color:var(--ink)}
.lGV{background:linear-gradient(135deg,#7C3AED,#DB2777);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.lGM{background:linear-gradient(135deg,#059669,#0284C7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.lLeftSub{color:var(--ink3);font-size:.96rem;line-height:1.75;font-weight:400;margin-bottom:2rem;max-width:340px}

/* stats row */
.lStats{display:flex;gap:0;background:var(--glass);backdrop-filter:blur(16px);border:1px solid var(--glass-border);border-radius:var(--rl);overflow:hidden;margin-bottom:1.75rem;box-shadow:var(--shadow-md)}
.lStat{padding:.9rem 1.25rem;border-right:1px solid var(--border);display:flex;flex-direction:column;align-items:center;gap:.15rem;flex:1}
.lStat:last-child{border-right:none}
.lStatN{font-family:var(--font-d);font-size:1.5rem;font-weight:700;letter-spacing:-1px;background:linear-gradient(135deg,var(--lavender),var(--coral));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1}
.lStatL{font-size:.65rem;color:var(--ink3);text-transform:uppercase;letter-spacing:1px;font-weight:600}

/* feature pills */
.lPills{display:flex;flex-direction:column;gap:.5rem}
.lPill{display:flex;align-items:center;gap:.7rem;padding:.62rem .9rem;border-radius:12px;background:var(--glass);backdrop-filter:blur(8px);border:1px solid var(--glass-border);font-size:.83rem;color:var(--ink2);transition:all .25s var(--ease);box-shadow:var(--shadow-sm)}
.lPill:hover{border-color:rgba(167,139,250,.3);background:#fff;transform:translateX(5px);box-shadow:var(--shadow-md)}
.lPillIco{width:30px;height:30px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center}

/* testimonial */
.lTestCard{position:relative;z-index:1;background:var(--glass);backdrop-filter:blur(16px);border:1px solid var(--glass-border);border-radius:var(--rl);padding:1.5rem 1.6rem;transition:border-color .3s;box-shadow:var(--shadow-md)}
.lTestCard::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--lavender),var(--coral));border-radius:var(--rl) var(--rl) 0 0;opacity:0;transition:opacity .3s}
.lTestCard:hover{border-color:rgba(167,139,250,.3)}
.lTestCard:hover::before{opacity:1}
.lQuoteGlyph{font-family:Georgia,serif;font-size:2.5rem;line-height:.5;color:rgba(167,139,250,.35);display:block;margin-bottom:.6rem}
.lQuote{font-size:.87rem;color:var(--ink3);line-height:1.68;font-weight:400;font-style:italic;margin-bottom:.9rem}
.lTestAuthor{display:flex;align-items:center;gap:.7rem}
.lTestAvatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,rgba(167,139,250,.25),rgba(255,107,157,.2));border:1px solid rgba(167,139,250,.25);display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:700;color:var(--lavender);font-family:var(--font-d);flex-shrink:0}
.lTestName{font-size:.83rem;font-weight:600;color:var(--ink)}
.lTestRole{font-size:.72rem;color:var(--ink3)}

/* ══════════════════════════
   RIGHT FORM PANEL
══════════════════════════ */
.lRight{
  padding:clamp(2rem,4vw,3.5rem);
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  background:var(--bg2);
  overflow-y:auto;
  position:relative;
}
.lRight::before{content:'';position:absolute;top:0;right:0;width:300px;height:300px;background:radial-gradient(circle,rgba(167,139,250,.08) 0%,transparent 70%);pointer-events:none;border-radius:50%}
.lRight::after{content:'';position:absolute;bottom:0;left:0;width:240px;height:240px;background:radial-gradient(circle,rgba(255,107,157,.06) 0%,transparent 70%);pointer-events:none;border-radius:50%}

.lForm{width:100%;max-width:400px;position:relative;z-index:1;animation:fadeUp .6s .05s var(--ease) both}

/* form header */
.lFormHdr{text-align:center;margin-bottom:2rem}

.lFormBadge{
  width:64px;height:64px;margin:0 auto 1.25rem;
  background:linear-gradient(135deg,var(--lavender),var(--coral));
  border-radius:20px;
  display:flex;align-items:center;justify-content:center;
  font-size:1.5rem;font-weight:700;color:#fff;
  font-family:var(--font-d);
  box-shadow:0 8px 32px rgba(167,139,250,.38),0 0 0 6px rgba(167,139,250,.1);
  animation:pop-in .6s var(--spring) both,pulse-glow 3s ease-in-out infinite;
  position:relative;
}
.lFormBadge::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--coral),var(--peach));opacity:0;transition:opacity .4s;border-radius:20px}
.lFormBadge:hover::before{opacity:1}
.lFormBadge span{position:relative;z-index:1}

.lFormTitle{font-family:var(--font-d);font-size:1.9rem;font-weight:700;letter-spacing:-1.2px;margin-bottom:.35rem;color:var(--ink)}
.lFormSub{color:var(--ink3);font-size:.88rem;font-weight:400;line-height:1.6}

/* error banner */
.lErr{
  background:rgba(251,113,133,.07);border:1px solid rgba(251,113,133,.28);
  border-radius:12px;padding:.85rem 1rem;color:var(--rose);
  font-size:.84rem;line-height:1.55;margin-bottom:1.2rem;
  display:flex;align-items:flex-start;gap:.55rem;
  animation:shake .4s var(--ease);
}

/* form fields */
.fG{margin-bottom:1.1rem;animation:slide-up .4s var(--ease) both}
.fRow{display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem}
.fLabel{font-size:.8rem;font-weight:500;color:var(--ink);letter-spacing:.01em}
.fForgot{font-size:.76rem;color:var(--lavender);text-decoration:none;font-weight:500;transition:color .2s}
.fForgot:hover{color:var(--coral)}

.fWrap{position:relative}
.fIcoLeft{position:absolute;left:1rem;top:50%;transform:translateY(-50%);color:var(--ink3);pointer-events:none}
.fIcoRight{position:absolute;right:.85rem;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--ink3);padding:4px;display:flex;align-items:center;justify-content:center;border-radius:7px;transition:color .2s,background .2s}
.fIcoRight:hover{color:var(--lavender);background:rgba(167,139,250,.08)}

.fIn{
  width:100%;padding:.9rem 1rem .9rem 2.8rem;
  background:var(--bg3);
  border:1px solid var(--border);border-radius:12px;
  color:var(--ink);font-family:var(--font-b);font-size:.9rem;
  transition:all .25s var(--ease);
  -webkit-appearance:none;
}
.fIn::placeholder{color:var(--ink3)}
.fIn:focus{
  outline:none;
  border-color:rgba(167,139,250,.55);
  background:#fff;
  box-shadow:0 0 0 3px rgba(167,139,250,.14),0 0 16px rgba(167,139,250,.08);
  transform:translateY(-1px);
}
.fIn.hasRight{padding-right:2.8rem}
.fIn.err{border-color:rgba(251,113,133,.45);background:rgba(251,113,133,.04)}

/* remember row */
.fCheckRow{display:flex;align-items:center;gap:.65rem;margin-bottom:1.3rem}
.fCheckBox{
  width:18px;height:18px;flex-shrink:0;
  background:var(--bg3);border:1.5px solid var(--border2);
  border-radius:6px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:all .2s var(--ease);
}
.fCheckBox.on{background:linear-gradient(135deg,var(--lavender),var(--coral));border-color:transparent;box-shadow:0 0 12px rgba(167,139,250,.3)}
.fCheckLabel{font-size:.82rem;color:var(--ink2);cursor:pointer;user-select:none}

/* submit button */
.lBtn{
  width:100%;padding:1rem;
  background:linear-gradient(135deg,var(--lavender),var(--coral));
  background-size:200% 200%;
  animation:gradient-shift 4s ease infinite;
  border:none;border-radius:12px;
  color:#fff;font-family:var(--font-d);font-size:.98rem;font-weight:700;
  cursor:pointer;letter-spacing:-.2px;
  box-shadow:0 4px 20px rgba(167,139,250,.32);
  transition:all .25s var(--spring);
  position:relative;overflow:hidden;
  display:flex;align-items:center;justify-content:center;gap:.5rem;
}
.lBtn::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.22) 50%,transparent 70%);transform:translateX(-100%);transition:transform .45s var(--ease)}
.lBtn:hover::after{transform:translateX(100%)}
.lBtn:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(255,107,157,.42)}
.lBtn:active{transform:none}
.lBtn:disabled{opacity:.55;cursor:not-allowed;transform:none;animation:none;background:linear-gradient(135deg,var(--lavender),var(--coral))}

/* spinner */
.lSpinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}

/* divider */
.lDiv{display:flex;align-items:center;gap:.75rem;margin:1.3rem 0;color:var(--ink3);font-size:.75rem;font-family:var(--font-m)}
.lDivLine{flex:1;height:1px;background:var(--border)}

/* SSO buttons */
.lSSO{display:grid;grid-template-columns:1fr 1fr;gap:.6rem}
.lSSOBtn{
  padding:.72rem .6rem;border-radius:11px;
  border:1.5px solid var(--border);background:var(--glass);
  color:var(--ink2);font-family:var(--font-b);font-size:.82rem;font-weight:500;
  cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.5rem;
  transition:all .22s var(--ease);backdrop-filter:blur(8px);
}
.lSSOBtn:hover{border-color:rgba(167,139,250,.3);background:#fff;color:var(--ink);transform:translateY(-2px);box-shadow:var(--shadow-md)}

/* footer link */
.lFtr{text-align:center;margin-top:1.5rem;font-size:.84rem;color:var(--ink3)}
.lFtrA{color:var(--lavender);text-decoration:none;font-weight:600;transition:color .2s}
.lFtrA:hover{color:var(--coral)}

/* ── SEC-TAG style welcome back chip ── */
.lWelcomeChip{
  display:inline-flex;align-items:center;gap:.5rem;
  padding:.3rem .85rem;border-radius:var(--rp);
  background:linear-gradient(135deg,rgba(110,231,183,.12),rgba(125,211,252,.1));
  border:1px solid rgba(110,231,183,.25);
  color:#059669;font-family:var(--font-m);font-size:.72rem;font-weight:600;
  letter-spacing:.08em;text-transform:uppercase;margin-bottom:.75rem;
  animation:pop-in .5s .1s var(--spring) both
}
.lChipDot{width:6px;height:6px;border-radius:50%;background:var(--mint);box-shadow:0 0 8px var(--mint);animation:pulse-glow 2s ease-in-out infinite}

/* ══ RESPONSIVE ══ */
@media(max-width:960px){
  .lpage{grid-template-columns:1fr}
  .lLeft{display:none}
  .lRight{min-height:100vh;padding:2rem 1.5rem}
}
@media(max-width:480px){
  .lRight{padding:1.75rem 1.25rem;justify-content:flex-start;padding-top:3rem}
  .lForm{max-width:100%}
  .lFormTitle{font-size:1.65rem}
  .lSSO{grid-template-columns:1fr}
}
@media(max-width:380px){
  .lRight{padding:1.5rem 1rem;padding-top:2.5rem}
  .lFormBadge{width:52px;height:52px;font-size:1.2rem;border-radius:16px}
  .lFormTitle{font-size:1.45rem}
  .lBtn{font-size:.9rem;padding:.88rem}
}
@media(max-width:960px) and (min-height:700px){
  .lRight{justify-content:center}
}
`;

/* ─── Inline SVG icons (no import needed) ─── */
const IcoEmail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IcoLock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IcoEyeOpen = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IcoEyeClosed = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IcoArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcoAlert = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IcoBrain = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2a2.5 2.5 0 0 1 5 0"/><path d="M9.5 22a2.5 2.5 0 0 0 5 0"/>
    <path d="M9 3.5A6.5 6.5 0 0 0 9 20.5"/><path d="M15 3.5a6.5 6.5 0 0 1 0 17"/>
    <path d="M3 9.5a2.5 2.5 0 0 1 0 5"/><path d="M21 9.5a2.5 2.5 0 0 0 0 5"/>
  </svg>
);
const IcoBook = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);
const IcoTrend = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);
const IcoGlobe = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const IcoGoogleG = () => (
  <svg width="15" height="15" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);
const IcoGitHub = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

/* ═══════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════ */
export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [remember, setRemember] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname || '/dashboard';

  /* inject CSS + fonts */
  useEffect(() => {
    injectFonts();
    let el = document.getElementById('ml-login-css');
    if (!el) { el = document.createElement('style'); el.id = 'ml-login-css'; document.head.appendChild(el); }
    el.textContent = CSS;
    return () => document.getElementById('ml-login-css')?.remove();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const PILLS = [
    { bg:'rgba(167,139,250,.1)', col:'var(--lavender)', ico:<IcoBrain/>,  text:'AI Pitch Coach · Claude-powered' },
    { bg:'rgba(251,191,36,.1)',  col:'#D97706',         ico:<IcoBook/>,   text:'30 modules across 5 tracks' },
    { bg:'rgba(110,231,183,.1)', col:'#059669',         ico:<IcoGlobe/>,  text:'9 global market templates' },
    { bg:'rgba(255,107,157,.1)', col:'var(--coral)',    ico:<IcoTrend/>,  text:'VC matchmaking · Shark Tank style' },
  ];

  return (
    <>
      {/* Gradient mesh blobs */}
      <div className="lmesh" aria-hidden="true">
        <div className="lblob lb1"/>
        <div className="lblob lb2"/>
        <div className="lblob lb3"/>
      </div>

      <div className="lpage">

        {/* ══════════ LEFT BRAND PANEL ══════════ */}
        <div className="lLeft">
          <div className="lLeft-orb1"/>
          <div className="lLeft-orb2"/>

          {/* Logo */}
          <Link to="/" className="lLogo">
            <div className="lLogoIcon"><span>M</span></div>
            <span className="lLogoText">MindLaunch</span>
          </Link>

          {/* Body */}
          <div className="lLeftBody">
            <div className="lTag"><div className="lTagDot"/> Welcome back</div>
            <h2 className="lLeftH">
              Continue your<br/>
              <span className="lGV">startup</span>{' '}
              <span className="lGM">journey</span>
            </h2>
            <p className="lLeftSub">
              Your modules, pitch sessions, and investor matches are waiting. Pick up exactly where you left off.
            </p>

            {/* Stats */}
            <div className="lStats">
              {[['30','Modules'],['5','Tracks'],['9','Regions'],['AI','Coach']].map(([n,l])=>(
                <div className="lStat" key={l}>
                  <span className="lStatN">{n}</span>
                  <span className="lStatL">{l}</span>
                </div>
              ))}
            </div>

            {/* Feature pills */}
            <div className="lPills">
              {PILLS.map((p,i)=>(
                <div key={i} className="lPill">
                  <div className="lPillIco" style={{background:p.bg,color:p.col}}>{p.ico}</div>
                  {p.text}
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="lTestCard">
            <span className="lQuoteGlyph">"</span>
            <p className="lQuote">MindLaunch helped me go from a vague idea to a fully structured pitch in three weeks. The AI coach spotted gaps I'd never have caught on my own.</p>
            <div className="lTestAuthor">
              <div className="lTestAvatar">RK</div>
              <div>
                <div className="lTestName">Rohan Kumar</div>
                <div className="lTestRole">Founder, HealthAI · Bengaluru</div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════ RIGHT FORM PANEL ══════════ */}
        <div className="lRight">
          <div className="lForm">

            {/* Form header */}
            <div className="lFormHdr">
              <div className="lFormBadge"><span>M</span></div>
              <div className="lWelcomeChip">
                <div className="lChipDot"/>
                session active
              </div>
              <h1 className="lFormTitle">Welcome back</h1>
              <p className="lFormSub">Sign in to continue your entrepreneurship journey</p>
            </div>

            {/* Error */}
            {error && (
              <div className="lErr">
                <IcoAlert/>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div className="fG" style={{animationDelay:'0ms'}}>
                <label className="fLabel">Email address</label>
                <div className="fWrap">
                  <span className="fIcoLeft"><IcoEmail/></span>
                  <input
                    className={`fIn${error && !email ? ' err' : ''}`}
                    type="email"
                    placeholder="you@startup.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div className="fG" style={{animationDelay:'60ms'}}>
                <div className="fRow">
                  <label className="fLabel">Password</label>
                  <a href="#" className="fForgot">Forgot password?</a>
                </div>
                <div className="fWrap">
                  <span className="fIcoLeft"><IcoLock/></span>
                  <input
                    className={`fIn hasRight${error && !password ? ' err' : ''}`}
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button type="button" className="fIcoRight" onClick={()=>setShowPw(s=>!s)}>
                    {showPw ? <IcoEyeClosed/> : <IcoEyeOpen/>}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="fCheckRow">
                <div
                  className={`fCheckBox${remember?' on':''}`}
                  onClick={()=>setRemember(s=>!s)}
                  role="checkbox"
                  aria-checked={remember}
                >
                  {remember && <IcoCheck/>}
                </div>
                <span className="fCheckLabel" onClick={()=>setRemember(s=>!s)}>
                  Remember me for 30 days
                </span>
              </div>

              {/* Submit */}
              <button type="submit" className="lBtn" disabled={loading}>
                {loading
                  ? <><span className="lSpinner"/> Signing in…</>
                  : <>Sign in <IcoArrow/></>
                }
              </button>

            </form>

            {/* SSO */}
            <div className="lDiv">
              <div className="lDivLine"/>
              <span>or continue with</span>
              <div className="lDivLine"/>
            </div>

            <div className="lSSO">
              <button className="lSSOBtn" type="button">
                <IcoGoogleG/> Google
              </button>
              <button className="lSSOBtn" type="button">
                <IcoGitHub/> GitHub
              </button>
            </div>

            {/* Footer */}
            <div className="lFtr">
              Don't have an account?{' '}
              <Link to="/register" className="lFtrA">Create one free →</Link>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}