import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import {
  Laptop, Wallet, HeartPulse, ShoppingCart, GraduationCap,
  Utensils, Leaf, Cog, Handshake, Bot, Briefcase, Globe,
  FileText, Rocket
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════════
   Register.jsx — MindLaunch Gen-Z Light Theme
   Matches Login.jsx: warm cream #FEFCF9, lavender/coral/mint/sky,
   Space Grotesk + Inter + JetBrains Mono, glassmorphism, spring anims,
   gradient mesh blobs, two-column layout.
══════════════════════════════════════════════════════════════ */

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
  --r:16px;--rl:24px;--rp:100px;
  --ease:cubic-bezier(.25,.46,.45,.94);
  --spring:cubic-bezier(.34,1.56,.64,1);
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
@keyframes blob-morph{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}50%{border-radius:50% 60% 30% 60%/30% 40% 70% 60%}75%{border-radius:60% 40% 60% 40%/40% 30% 60% 50%}}
@keyframes float-slow{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes pop-in{0%{opacity:0;transform:scale(.82) rotate(-4deg)}70%{transform:scale(1.08) rotate(2deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes gradient-shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes pulse-glow{0%,100%{box-shadow:0 0 20px rgba(167,139,250,.3)}50%{box-shadow:0 0 40px rgba(167,139,250,.5)}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes slide-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes step-in{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:translateX(0)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}

/* ── MESH BACKGROUND ── */
.rmesh{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.rblob{position:absolute;filter:blur(80px);opacity:.45;animation:blob-morph 22s ease-in-out infinite}
.rb1{width:550px;height:550px;background:linear-gradient(135deg,rgba(167,139,250,.4),rgba(255,107,157,.28));top:-18%;left:-12%;animation-delay:0s}
.rb2{width:420px;height:420px;background:linear-gradient(135deg,rgba(110,231,183,.28),rgba(125,211,252,.28));top:45%;right:-14%;animation-delay:-7s}
.rb3{width:380px;height:380px;background:linear-gradient(135deg,rgba(251,191,36,.25),rgba(251,113,133,.22));bottom:-12%;left:35%;animation-delay:-14s}

/* ── PAGE LAYOUT ── */
.rpage{
  position:relative;z-index:1;
  min-height:100vh;
  display:grid;
  grid-template-columns:1.1fr 1fr;
}

/* ══ LEFT BRAND PANEL ══ */
.rLeft{
  padding:clamp(2rem,4vw,3.5rem);
  display:flex;flex-direction:column;justify-content:space-between;
  background:linear-gradient(160deg,rgba(248,246,255,.85) 0%,rgba(255,245,248,.65) 100%);
  backdrop-filter:blur(32px);
  border-right:1px solid var(--glass-border);
  position:relative;overflow:hidden;
}
.rLeft-orb1{position:absolute;top:-60px;left:-60px;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(167,139,250,.18) 0%,transparent 70%);pointer-events:none;animation:float-slow 18s ease-in-out infinite}
.rLeft-orb2{position:absolute;bottom:-40px;right:-40px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,107,157,.14) 0%,transparent 70%);pointer-events:none;animation:float-slow 22s ease-in-out infinite reverse}

/* logo */
.rLogo{display:flex;align-items:center;gap:.5rem;text-decoration:none;color:var(--ink);font-family:var(--font-d);font-size:1.25rem;font-weight:700;letter-spacing:-.5px;position:relative;z-index:1}
.rLogoIcon{width:36px;height:36px;background:linear-gradient(135deg,var(--lavender),var(--coral));border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1rem;color:#fff;font-family:var(--font-d);font-weight:700;box-shadow:0 4px 16px rgba(167,139,250,.35);transition:all .3s var(--spring);position:relative;overflow:hidden;flex-shrink:0}
.rLogoIcon::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--coral),var(--peach));opacity:0;transition:opacity .3s}
.rLogo:hover .rLogoIcon{transform:rotate(-10deg) scale(1.1);box-shadow:0 8px 28px rgba(255,107,157,.4)}
.rLogo:hover .rLogoIcon::before{opacity:1}
.rLogoIcon span{position:relative;z-index:1}
.rLogoText{background:linear-gradient(135deg,var(--lavender),var(--coral));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

/* left body */
.rLeftBody{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;justify-content:center;padding:2rem 0}

.rTag{display:inline-flex;align-items:center;gap:.5rem;padding:.35rem .9rem;border-radius:var(--rp);background:linear-gradient(135deg,rgba(167,139,250,.1),rgba(255,107,157,.07));border:1px solid rgba(167,139,250,.2);color:var(--lavender);font-family:var(--font-m);font-size:.72rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1.5rem;width:fit-content;animation:pop-in .5s var(--spring) both}
.rTagDot{width:6px;height:6px;border-radius:50%;background:var(--lavender);box-shadow:0 0 8px var(--lavender);animation:blink 2s ease-in-out infinite;flex-shrink:0}

.rLeftH{font-family:var(--font-d);font-size:clamp(2rem,3vw,2.8rem);font-weight:700;letter-spacing:-2px;line-height:1.08;margin-bottom:1rem;color:var(--ink)}
.rGV{background:linear-gradient(135deg,#7C3AED,#DB2777);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.rGM{background:linear-gradient(135deg,#059669,#0284C7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.rLeftSub{color:var(--ink3);font-size:.96rem;line-height:1.75;font-weight:400;margin-bottom:2rem;max-width:340px}

/* trust / feature pills */
.rPills{display:flex;flex-direction:column;gap:.5rem;margin-bottom:2rem}
.rPill{display:flex;align-items:center;gap:.7rem;padding:.62rem .9rem;border-radius:12px;background:var(--glass);backdrop-filter:blur(8px);border:1px solid var(--glass-border);font-size:.83rem;color:var(--ink2);transition:all .25s var(--ease);box-shadow:var(--shadow-sm)}
.rPill:hover{border-color:rgba(167,139,250,.3);background:#fff;transform:translateX(5px);box-shadow:var(--shadow-md)}
.rPillIco{width:30px;height:30px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center}

/* step tracker at bottom */
.rStepTrack{position:relative;z-index:1}
.rStepRow{display:flex;align-items:center;gap:.45rem;font-size:.72rem;color:var(--ink3);font-family:var(--font-m)}
.rStepPip{width:6px;height:6px;border-radius:50%;background:rgba(167,139,250,.25);transition:all .3s var(--ease)}
.rStepPip.on{background:var(--lavender);box-shadow:0 0 8px var(--lavender)}
.rStepPip.done{background:var(--mint);box-shadow:0 0 6px var(--mint)}
.rStepConnector{flex:1;height:1px;background:rgba(167,139,250,.2);max-width:28px}

/* ══ RIGHT FORM PANEL ══ */
.rRight{
  padding:clamp(2rem,4vw,3.5rem);
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  background:var(--bg2);
  overflow-y:auto;
  position:relative;
}
.rRight::before{content:'';position:absolute;top:0;right:0;width:300px;height:300px;background:radial-gradient(circle,rgba(167,139,250,.08) 0%,transparent 70%);pointer-events:none;border-radius:50%}
.rRight::after{content:'';position:absolute;bottom:0;left:0;width:240px;height:240px;background:radial-gradient(circle,rgba(255,107,157,.06) 0%,transparent 70%);pointer-events:none;border-radius:50%}

.rForm{width:100%;max-width:420px;position:relative;z-index:1;animation:fadeUp .6s .05s var(--ease) both}

/* form header */
.rFormHdr{text-align:center;margin-bottom:1.75rem}
.rFormBadge{width:64px;height:64px;margin:0 auto 1rem;background:linear-gradient(135deg,var(--lavender),var(--coral));border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;color:#fff;font-family:var(--font-d);box-shadow:0 8px 32px rgba(167,139,250,.38),0 0 0 6px rgba(167,139,250,.1);animation:pop-in .6s var(--spring) both,pulse-glow 3s ease-in-out infinite;position:relative}
.rFormBadge::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--coral),var(--peach));opacity:0;transition:opacity .4s;border-radius:20px}
.rFormBadge span{position:relative;z-index:1}
.rFormTitle{font-family:var(--font-d);font-size:1.8rem;font-weight:700;letter-spacing:-1.2px;margin-bottom:.3rem;color:var(--ink)}
.rFormSub{color:var(--ink3);font-size:.88rem;font-weight:400;line-height:1.6}

/* progress chips */
.rProgress{display:flex;align-items:center;justify-content:center;gap:.4rem;margin-bottom:1.75rem}
.rProgStep{display:flex;align-items:center;gap:.4rem;font-size:.72rem;font-family:var(--font-m);color:var(--ink3);transition:color .3s}
.rProgStep.on{color:var(--lavender)}
.rProgStep.done{color:#059669}
.rProgNum{width:22px;height:22px;border-radius:50%;background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.25);display:flex;align-items:center;justify-content:center;font-size:.62rem;font-weight:600;transition:all .3s var(--spring)}
.rProgStep.on .rProgNum{background:rgba(167,139,250,.18);border-color:rgba(167,139,250,.55);color:#7C3AED;box-shadow:0 0 12px rgba(167,139,250,.25)}
.rProgStep.done .rProgNum{background:rgba(110,231,183,.15);border-color:rgba(110,231,183,.5);color:#059669}
.rProgLine{flex:1;height:1px;background:rgba(167,139,250,.15);max-width:36px;transition:background .4s}
.rProgLine.done{background:rgba(110,231,183,.4)}

/* error banner */
.rErr{background:rgba(251,113,133,.07);border:1px solid rgba(251,113,133,.28);border-radius:12px;padding:.85rem 1rem;color:var(--rose);font-size:.84rem;line-height:1.55;margin-bottom:1.2rem;display:flex;align-items:flex-start;gap:.55rem;animation:shake .4s var(--ease)}

/* form groups */
.fG{margin-bottom:1.1rem;animation:slide-up .4s var(--ease) both}
.fLabel{display:block;font-size:.8rem;font-weight:500;color:var(--ink);margin-bottom:.4rem;letter-spacing:.01em}
.fLSub{font-size:.72rem;color:var(--ink3);font-weight:400;margin-left:.3rem}
.fWrap{position:relative}
.fIcoLeft{position:absolute;left:1rem;top:50%;transform:translateY(-50%);color:var(--ink3);pointer-events:none}
.fIcoRight{position:absolute;right:.85rem;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--ink3);padding:4px;display:flex;align-items:center;justify-content:center;border-radius:7px;transition:color .2s,background .2s}
.fIcoRight:hover{color:var(--lavender);background:rgba(167,139,250,.08)}

.fIn{width:100%;padding:.9rem 1rem .9rem 2.8rem;background:var(--bg3);border:1px solid var(--border);border-radius:12px;color:var(--ink);font-family:var(--font-b);font-size:.9rem;transition:all .25s var(--ease);-webkit-appearance:none}
.fIn::placeholder{color:var(--ink3)}
.fIn:focus{outline:none;border-color:rgba(167,139,250,.55);background:#fff;box-shadow:0 0 0 3px rgba(167,139,250,.14),0 0 16px rgba(167,139,250,.08);transform:translateY(-1px)}
.fIn.hasRight{padding-right:2.8rem}
.fIn.err{border-color:rgba(251,113,133,.45);background:rgba(251,113,133,.04)}

/* password strength */
.pwRow{display:flex;align-items:center;gap:.5rem;margin-top:.45rem}
.pwBars{display:flex;gap:3px;flex:1}
.pwBar{flex:1;height:3px;border-radius:2px;background:rgba(167,139,250,.15);transition:background .3s}
.pwBar.s1{background:#FB7185}
.pwBar.s2{background:var(--peach)}
.pwBar.s3{background:var(--mint)}
.pwLabel{font-size:.68rem;font-family:var(--font-m);color:var(--ink3);white-space:nowrap;transition:color .3s}

/* category grid */
.catGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-top:.5rem}
.catTile{padding:.65rem .6rem;border-radius:10px;font-size:.78rem;font-weight:500;text-align:center;border:1px solid var(--border);background:var(--bg3);cursor:pointer;transition:all .22s var(--ease);display:flex;flex-direction:column;align-items:center;gap:.3rem;color:var(--ink2)}
.catTile:hover{border-color:rgba(167,139,250,.35);background:rgba(167,139,250,.06);color:var(--ink);transform:translateY(-2px);box-shadow:var(--shadow-sm)}
.catTile.sel{border-color:rgba(167,139,250,.6);background:rgba(167,139,250,.1);color:#7C3AED;box-shadow:0 0 16px rgba(167,139,250,.15)}
.catIco{display:flex;align-items:center;justify-content:center}

/* region chips */
.regGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-top:.5rem}
.regChip{padding:.55rem .55rem;border-radius:9px;font-size:.75rem;font-weight:500;text-align:center;border:1px solid var(--border);background:var(--bg3);cursor:pointer;transition:all .22s var(--ease);color:var(--ink2)}
.regChip:hover{border-color:rgba(255,107,157,.3);background:rgba(255,107,157,.05);color:var(--ink)}
.regChip.sel{border-color:rgba(255,107,157,.55);background:rgba(255,107,157,.08);color:#DB2777;box-shadow:0 0 12px rgba(255,107,157,.12)}

/* selected hint banner */
.selHint{padding:.65rem .9rem;border-radius:10px;font-size:.8rem;display:flex;align-items:center;gap:.5rem;margin-bottom:1rem;animation:slide-up .35s var(--ease) both}
.selHint.cat{background:rgba(167,139,250,.08);border:1px solid rgba(167,139,250,.22);color:#7C3AED}
.selHint.reg{background:rgba(255,107,157,.07);border:1px solid rgba(255,107,157,.22);color:#DB2777}

/* nav row */
.rNavRow{display:flex;gap:.6rem;margin-top:1.1rem}
.rBack{flex:0;padding:.82rem 1rem;border-radius:12px;border:1.5px solid var(--border);background:none;color:var(--ink2);font-family:var(--font-d);font-size:.88rem;font-weight:600;cursor:pointer;transition:all .22s;display:flex;align-items:center;gap:.4rem}
.rBack:hover{border-color:rgba(167,139,250,.3);color:var(--ink);background:rgba(167,139,250,.05)}
.rNext{flex:1;padding:.82rem;border-radius:12px;background:rgba(167,139,250,.09);border:1.5px solid rgba(167,139,250,.35);color:#7C3AED;font-family:var(--font-d);font-size:.9rem;font-weight:700;cursor:pointer;transition:all .22s var(--ease);display:flex;align-items:center;justify-content:center;gap:.4rem;letter-spacing:-.1px}
.rNext:hover{border-color:rgba(167,139,250,.6);background:rgba(167,139,250,.15);transform:translateY(-1px)}
.rNext:disabled{opacity:.45;cursor:not-allowed;transform:none}

/* submit button */
.rBtn{width:100%;padding:1rem;background:linear-gradient(135deg,var(--lavender),var(--coral));background-size:200% 200%;animation:gradient-shift 4s ease infinite;border:none;border-radius:12px;color:#fff;font-family:var(--font-d);font-size:.98rem;font-weight:700;cursor:pointer;letter-spacing:-.2px;box-shadow:0 4px 20px rgba(167,139,250,.32);transition:all .25s var(--spring);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;gap:.5rem}
.rBtn::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.22) 50%,transparent 70%);transform:translateX(-100%);transition:transform .45s var(--ease)}
.rBtn:hover::after{transform:translateX(100%)}
.rBtn:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(255,107,157,.42)}
.rBtn:active{transform:none}
.rBtn:disabled{opacity:.55;cursor:not-allowed;transform:none;animation:none;background:linear-gradient(135deg,var(--lavender),var(--coral))}

/* spinner */
.rSpinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}

/* divider */
.rDiv{display:flex;align-items:center;gap:.75rem;margin:1.2rem 0;color:var(--ink3);font-size:.75rem;font-family:var(--font-m)}
.rDivLine{flex:1;height:1px;background:var(--border)}

/* footer */
.rFtr{text-align:center;margin-top:1.25rem;font-size:.84rem;color:var(--ink3)}
.rFtrA{color:var(--lavender);text-decoration:none;font-weight:600;transition:color .2s}
.rFtrA:hover{color:var(--coral)}

/* terms */
.rTerms{font-size:.72rem;color:var(--ink3);text-align:center;margin-top:.9rem;line-height:1.6}
.rTermsA{color:var(--ink2);text-decoration:none;border-bottom:1px solid rgba(167,139,250,.25);transition:color .18s,border-color .18s}
.rTermsA:hover{color:var(--lavender);border-color:rgba(167,139,250,.5)}

/* step animation */
.rStep{animation:step-in .4s var(--ease) both}

/* ══ RESPONSIVE ══ */
@media(max-width:960px){
  .rpage{grid-template-columns:1fr}
  .rLeft{display:none}
  .rRight{min-height:100vh;padding:2rem 1.5rem}
}
@media(max-width:480px){
  .rRight{padding:1.75rem 1.25rem}
  .catGrid{grid-template-columns:repeat(2,1fr)}
  .regGrid{grid-template-columns:repeat(2,1fr)}
}
`;

/* ─── Inline SVG icons ─── */
const IcoUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/>
  </svg>
);
const IcoEmail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IcoLock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
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
const IcoArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
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

/* ─── Data ─── */
const CATS = [
  { id: 'tech',   Icon: Laptop,       label: 'Tech Startup' },
  { id: 'fin',    Icon: Wallet,       label: 'Fintech' },
  { id: 'health', Icon: HeartPulse,   label: 'Healthtech' },
  { id: 'ecom',   Icon: ShoppingCart, label: 'E-Commerce' },
  { id: 'edu',    Icon: GraduationCap,label: 'Edtech' },
  { id: 'food',   Icon: Utensils,     label: 'Food & Bev' },
  { id: 'impact', Icon: Leaf,         label: 'Social Impact' },
  { id: 'mfg',    Icon: Cog,          label: 'Manufacturing' },
  { id: 'svc',    Icon: Handshake,    label: 'Services' },
];

const REGIONS = [
  { code: 'IN',  flag: '🇮🇳', name: 'India' },
  { code: 'US',  flag: '🇺🇸', name: 'USA' },
  { code: 'UAE', flag: '🇦🇪', name: 'UAE' },
  { code: 'SA',  flag: '🇸🇦', name: 'Saudi' },
  { code: 'EG',  flag: '🇪🇬', name: 'Egypt' },
  { code: 'NG',  flag: '🇳🇬', name: 'Nigeria' },
  { code: 'KE',  flag: '🇰🇪', name: 'Kenya' },
  { code: 'JO',  flag: '🇯🇴', name: 'Jordan' },
  { code: 'QA',  flag: '🇶🇦', name: 'Qatar' },
];

const TRUST = [
  { Icon: Bot,      bg: 'rgba(167,139,250,.1)',  col: '#7C3AED', text: 'AI Pitch Coach · Claude-powered' },
  { Icon: Briefcase,bg: 'rgba(251,191,36,.1)',   col: '#D97706', text: 'Shark Tank–style VC matchmaking' },
  { Icon: Globe,    bg: 'rgba(110,231,183,.1)',  col: '#059669', text: 'Curriculum for 9 global markets' },
  { Icon: FileText, bg: 'rgba(255,107,157,.1)',  col: '#DB2777', text: 'Export PDF & Word documents' },
];

const STEPS_LABEL = ['Account', 'Category', 'Region'];

function getPwStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const PW_LABELS = ['', 'Weak', 'Fair', 'Strong'];
const PW_COLORS = ['', '#FB7185', '#FBBF24', '#6EE7B7'];

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════ */
const Register = () => {
  const [formStep, setFormStep] = useState(0);
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [category, setCategory] = useState('');
  const [region,   setRegion]   = useState('IN');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { register: authRegister } = useAuth();
  const navigate = useNavigate();

  /* inject CSS + fonts */
  useEffect(() => {
    injectFonts();
    let el = document.getElementById('ml-register-css');
    if (!el) { el = document.createElement('style'); el.id = 'ml-register-css'; document.head.appendChild(el); }
    el.textContent = CSS;
    return () => document.getElementById('ml-register-css')?.remove();
  }, []);

  const pwStrength  = getPwStrength(password);
  const step0Valid  = name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length >= 8;
  const step1Valid  = !!category;
  const step2Valid  = !!region;

  const handleNext = () => {
    setError('');
    if (formStep === 0 && !step0Valid) { setError('Please fill in all fields correctly.'); return; }
    if (formStep === 1 && !step1Valid) { setError('Please select a business category.'); return; }
    setFormStep(s => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!step2Valid) { setError('Please select your region.'); return; }
    setError(''); setLoading(true);
    try {
      await authRegister(name, email, password, region, category);
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const FORM_TITLES = ['Create your account', 'Pick your category', 'Choose your region'];
  const FORM_SUBS   = [
    'Join MindLaunch and start building your fundable startup',
    "We'll tailor your modules and coaching to your business type",
    'Get curriculum and templates tuned to your local market',
  ];

  return (
    <>
      {/* Gradient mesh blobs */}
      <div className="rmesh" aria-hidden="true">
        <div className="rblob rb1" />
        <div className="rblob rb2" />
        <div className="rblob rb3" />
      </div>

      <div className="rpage">

        {/* ══════════ LEFT BRAND PANEL ══════════ */}
        <div className="rLeft">
          <div className="rLeft-orb1" />
          <div className="rLeft-orb2" />

          {/* Logo */}
          <Link to="/" className="rLogo">
            <div className="rLogoIcon"><span>M</span></div>
            <span className="rLogoText">MindLaunch</span>
          </Link>

          {/* Body */}
          <div className="rLeftBody">
            <div className="rTag"><div className="rTagDot" /> Start your journey</div>
            <h2 className="rLeftH">
              From idea<br />
              to <span className="rGV">funded</span>{' '}
              <span className="rGM">startup</span>
            </h2>
            <p className="rLeftSub">
              30 structured modules, an AI pitch coach, and a VC network waiting to fund your vision. Everything a founder needs.
            </p>

            {/* Feature pills */}
            <div className="rPills">
              {TRUST.map(({ Icon, bg, col, text }, i) => (
                <div key={i} className="rPill">
                  <div className="rPillIco" style={{ background: bg, color: col }}>
                    <Icon size={14} strokeWidth={2} />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Step tracker */}
          <div className="rStepTrack">
            <div className="rStepRow">
              {STEPS_LABEL.map((l, i) => (
                <React.Fragment key={i}>
                  <div className={`rStepPip${formStep > i ? ' done' : formStep === i ? ' on' : ''}`} />
                  <span style={{ color: formStep >= i ? 'var(--ink2)' : 'var(--ink3)' }}>{l}</span>
                  {i < STEPS_LABEL.length - 1 && <div className="rStepConnector" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════ RIGHT FORM PANEL ══════════ */}
        <div className="rRight">
          <div className="rForm">

            {/* Form header */}
            <div className="rFormHdr">
              <div className="rFormBadge"><span>M</span></div>
              <h1 className="rFormTitle">{FORM_TITLES[formStep]}</h1>
              <p className="rFormSub">{FORM_SUBS[formStep]}</p>
            </div>

            {/* Progress indicator */}
            <div className="rProgress">
              {STEPS_LABEL.map((l, i) => (
                <React.Fragment key={i}>
                  <div className={`rProgStep${formStep === i ? ' on' : formStep > i ? ' done' : ''}`}>
                    <div className="rProgNum">
                      {formStep > i ? <IcoCheck /> : i + 1}
                    </div>
                    <span style={{ display: 'none' }}>{l}</span>
                  </div>
                  {i < STEPS_LABEL.length - 1 && (
                    <div className={`rProgLine${formStep > i ? ' done' : ''}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Error banner */}
            {error && (
              <div className="rErr">
                <IcoAlert />
                <span>{error}</span>
              </div>
            )}

            {/* ── STEP 0: Account ── */}
            {formStep === 0 && (
              <div className="rStep">
                {/* Full name */}
                <div className="fG" style={{ animationDelay: '0ms' }}>
                  <label className="fLabel">Full name</label>
                  <div className="fWrap">
                    <span className="fIcoLeft"><IcoUser /></span>
                    <input
                      className={`fIn${error && !name ? ' err' : ''}`}
                      type="text"
                      placeholder="Sundar Pichai"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="fG" style={{ animationDelay: '60ms' }}>
                  <label className="fLabel">Email address</label>
                  <div className="fWrap">
                    <span className="fIcoLeft"><IcoEmail /></span>
                    <input
                      className={`fIn${error && !email ? ' err' : ''}`}
                      type="email"
                      placeholder="you@startup.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="fG" style={{ animationDelay: '120ms' }}>
                  <label className="fLabel">
                    Password <span className="fLSub">min. 8 characters</span>
                  </label>
                  <div className="fWrap">
                    <span className="fIcoLeft"><IcoLock /></span>
                    <input
                      className="fIn hasRight"
                      type={showPw ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="fIcoRight"
                      onClick={() => setShowPw(s => !s)}
                    >
                      {showPw ? <IcoEyeClosed /> : <IcoEyeOpen />}
                    </button>
                  </div>
                  {password && (
                    <div className="pwRow">
                      <div className="pwBars">
                        {[1, 2, 3].map(i => (
                          <div
                            key={i}
                            className={`pwBar${pwStrength >= i ? ` s${pwStrength}` : ''}`}
                          />
                        ))}
                      </div>
                      <span className="pwLabel" style={{ color: PW_COLORS[pwStrength] }}>
                        {PW_LABELS[pwStrength]}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  className="rNext"
                  style={{ marginTop: '.5rem', width: '100%' }}
                  onClick={handleNext}
                  disabled={!step0Valid}
                >
                  Continue <IcoArrow />
                </button>

                <div className="rDiv">
                  <div className="rDivLine" />
                  <span>or</span>
                  <div className="rDivLine" />
                </div>

                <div className="rFtr">
                  Already have an account?{' '}
                  <Link to="/login" className="rFtrA">Log in here</Link>
                </div>
              </div>
            )}

            {/* ── STEP 1: Category ── */}
            {formStep === 1 && (
              <div className="rStep">
                <div className="fG">
                  <label className="fLabel">
                    Business category <span className="fLSub">choose one</span>
                  </label>
                  <div className="catGrid">
                    {CATS.map(({ id, Icon, label }) => (
                      <div
                        key={id}
                        className={`catTile${category === id ? ' sel' : ''}`}
                        onClick={() => setCategory(id)}
                      >
                        <span className="catIco">
                          <Icon size={20} strokeWidth={2} />
                        </span>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {category && (
                  <div className="selHint cat">
                    <IcoCheck />
                    <span>Selected: <strong>{CATS.find(c => c.id === category)?.label}</strong></span>
                  </div>
                )}

                <div className="rNavRow">
                  <button
                    className="rBack"
                    onClick={() => { setFormStep(0); setError(''); }}
                  >
                    <IcoArrowLeft /> Back
                  </button>
                  <button
                    className="rNext"
                    onClick={handleNext}
                    disabled={!step1Valid}
                  >
                    Continue <IcoArrow />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Region ── */}
            {formStep === 2 && (
              <form className="rStep" onSubmit={handleSubmit}>
                <div className="fG">
                  <label className="fLabel">
                    Target market region <span className="fLSub">where you're building</span>
                  </label>
                  <div className="regGrid">
                    {REGIONS.map(r => (
                      <div
                        key={r.code}
                        className={`regChip${region === r.code ? ' sel' : ''}`}
                        onClick={() => setRegion(r.code)}
                      >
                        {r.flag} {r.name}
                      </div>
                    ))}
                  </div>
                </div>

                {region && (
                  <div className="selHint reg">
                    <IcoCheck />
                    <span>
                      Building for:{' '}
                      <strong>
                        {REGIONS.find(r => r.code === region)?.flag}{' '}
                        {REGIONS.find(r => r.code === region)?.name}
                      </strong>
                    </span>
                  </div>
                )}

                <div className="rNavRow">
                  <button
                    type="button"
                    className="rBack"
                    onClick={() => { setFormStep(1); setError(''); }}
                  >
                    <IcoArrowLeft /> Back
                  </button>
                  <button
                    type="submit"
                    className="rBtn"
                    style={{ flex: 1 }}
                    disabled={loading || !step2Valid}
                  >
                    {loading ? (
                      <><span className="rSpinner" /> Creating account…</>
                    ) : (
                      <><Rocket size={16} strokeWidth={2} /> Create Account</>
                    )}
                  </button>
                </div>

                <p className="rTerms">
                  By creating an account you agree to our{' '}
                  <a href="#" className="rTermsA">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="rTermsA">Privacy Policy</a>.
                </p>
              </form>
            )}

          </div>
        </div>

      </div>
    </>
  );
};

export default Register;