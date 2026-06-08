import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ═══════════════════════════════════════════════════════════════
   Login.jsx — Redesigned to match MindLaunch theme
   Same fonts: Syne + Inter + JetBrains Mono
   No new npm packages — icons are inline SVGs
   Fully responsive: 320px → 4K
═══════════════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{height:100%}

:root{
  --bg:#04040C;
  --bg2:#08081A;
  --card:rgba(255,255,255,.034);
  --v:#7B5CF5;--v2:#A78BFF;--vd:rgba(123,92,245,.13);
  --gold:#F5A623;--gold2:#FFD166;--goldd:rgba(245,166,35,.13);
  --em:#06D6A0;--rose:#FF6B9D;
  --text:#F0EEFF;--t2:#8E8CAD;--t3:#3D3C56;
  --bd:rgba(255,255,255,.07);--bd2:rgba(255,255,255,.13);
  --r:14px;--rl:22px;
  --ease:cubic-bezier(.25,.46,.45,.94);
  --spring:cubic-bezier(.34,1.56,.64,1);
  --fd:'Outfit',sans-serif;
--fb:'Plus Jakarta Sans',sans-serif;--fm:'JetBrains Mono',monospace;
}

body{
  background:var(--bg);color:var(--text);
  font-family:var(--fb);overflow-x:hidden;
  cursor:none;min-height:100vh;
}

/* ── custom cursor ── */
#lc1{position:fixed;width:11px;height:11px;background:var(--v2);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width .18s var(--spring),height .18s var(--spring),background .18s;mix-blend-mode:screen;}
#lc2{position:fixed;width:32px;height:32px;border:1px solid rgba(123,92,245,.35);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:left .1s var(--ease),top .1s var(--ease);}
body:has(button:hover,a:hover,input:focus,[data-h]:hover) #lc1{width:20px;height:20px;background:var(--gold);}

/* ── canvas + noise ── */
#lbg{position:fixed;inset:0;z-index:0;pointer-events:none;}
.lnoise{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.025;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}

/* ── page layout ── */
.lpage{
  min-height:100vh;position:relative;z-index:2;
  display:grid;grid-template-columns:1fr 1fr;
}

/* ══ LEFT PANEL ══ */
.lLeft{
  padding:clamp(2rem,4vw,3.5rem);
  display:flex;flex-direction:column;justify-content:space-between;
  background:linear-gradient(155deg,rgba(123,92,245,.07) 0%,rgba(6,214,160,.04) 55%,rgba(245,166,35,.04) 100%);
  border-right:1px solid var(--bd);
  position:relative;overflow:hidden;
}
/* left ambient orbs */
.lLeft::before{content:'';position:absolute;top:-130px;left:-130px;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,rgba(123,92,245,.16) 0%,transparent 65%);animation:oF 20s ease-in-out infinite alternate;pointer-events:none;}
.lLeft::after{content:'';position:absolute;bottom:-80px;right:-80px;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(245,166,35,.1) 0%,transparent 65%);animation:oF 24s ease-in-out infinite alternate-reverse;pointer-events:none;}
@keyframes oF{0%{transform:translate(0,0) scale(1)}50%{transform:translate(18px,-12px) scale(1.04)}100%{transform:translate(-12px,18px) scale(.97)}}

/* logo */
.lLogo{display:flex;align-items:center;gap:.55rem;text-decoration:none;color:var(--text);font-family:var(--fd);font-size:1.18rem;font-weight:800;letter-spacing:-.5px;position:relative;z-index:1;}
.lLogoGem{width:33px;height:33px;background:linear-gradient(135deg,#7B5CF5,#4A28E0);clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:900;color:#fff;box-shadow:0 0 22px rgba(123,92,245,.44);transition:transform .3s var(--spring),box-shadow .3s;flex-shrink:0;}
.lLogo:hover .lLogoGem{transform:rotate(30deg) scale(1.1);box-shadow:0 0 38px rgba(123,92,245,.7);}
.lLogoV{background:linear-gradient(90deg,var(--v2),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

/* left body */
.lLeftBody{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;justify-content:center;padding:2.5rem 0;}
.lTag{display:inline-flex;align-items:center;gap:.4rem;padding:.26rem .8rem;border-radius:100px;border:1px solid rgba(123,92,245,.22);background:rgba(123,92,245,.09);color:#C4B1FF;font-size:.7rem;font-weight:500;font-family:var(--fm);letter-spacing:.08em;text-transform:uppercase;margin-bottom:1.5rem;width:fit-content;}
.lTagDot{width:5px;height:5px;border-radius:50%;background:var(--v2);box-shadow:0 0 8px var(--v2);animation:bl 2s ease-in-out infinite;}
@keyframes bl{0%,100%{opacity:1}50%{opacity:.3}}
.lLeftH{font-family:var(--fd);font-size:clamp(1.9rem,3.2vw,2.7rem);font-weight:800;letter-spacing:-2px;line-height:1.08;margin-bottom:1rem;}
.lGV{background:linear-gradient(135deg,#C4B1FF,#7B5CF5,#A78BFF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.lGG{background:linear-gradient(135deg,#FFE066,#F5A623,#FFB347);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.lLeftSub{color:var(--t2);font-size:.96rem;line-height:1.7;font-weight:300;margin-bottom:2.5rem;max-width:360px;}

/* stat row */
.lStats{display:flex;gap:1.5rem;flex-wrap:wrap;margin-bottom:2.5rem;}
.lStat{display:flex;flex-direction:column;gap:.1rem;}
.lStatN{font-family:var(--fd);font-size:1.5rem;font-weight:800;letter-spacing:-1px;line-height:1;}
.lStatL{font-size:.68rem;color:var(--t3);text-transform:uppercase;letter-spacing:.9px;font-weight:600;}
.lStatDiv{width:1px;background:var(--bd2);align-self:stretch;margin:.2rem 0;}

/* testimonial card */
.lTestCard{
  background:rgba(255,255,255,.03);border:1px solid var(--bd);
  border-radius:16px;padding:1.25rem 1.4rem;
  position:relative;overflow:hidden;
  transition:border-color .3s;
}
.lTestCard:hover{border-color:rgba(123,92,245,.25);}
.lTestCard::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(123,92,245,.5) 50%,transparent);opacity:0;transition:opacity .3s;}
.lTestCard:hover::before{opacity:1;}
.lQuote{font-size:.88rem;color:var(--t2);line-height:1.62;font-weight:300;font-style:italic;margin-bottom:.9rem;}
.lQuoteIco{color:rgba(123,92,245,.4);font-family:Georgia,serif;font-size:2rem;line-height:.6;display:block;margin-bottom:.5rem;}
.lTestAuthor{display:flex;align-items:center;gap:.65rem;}
.lTestAvatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,rgba(123,92,245,.3),rgba(245,166,35,.2));border:1px solid rgba(123,92,245,.25);display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:700;color:#C4B1FF;font-family:var(--fd);flex-shrink:0;}
.lTestName{font-size:.82rem;font-weight:600;color:var(--text);}
.lTestRole{font-size:.72rem;color:var(--t3);}

/* feature pills */
.lPills{display:flex;flex-direction:column;gap:.6rem;}
.lPill{display:flex;align-items:center;gap:.7rem;padding:.62rem .9rem;border-radius:11px;background:rgba(255,255,255,.03);border:1px solid var(--bd);font-size:.82rem;color:var(--t2);transition:all .22s var(--ease);}
.lPill:hover{border-color:rgba(123,92,245,.26);background:rgba(123,92,245,.05);color:var(--text);transform:translateX(4px);}
.lPillIco{width:28px;height:28px;border-radius:7px;flex-shrink:0;display:flex;align-items:center;justify-content:center;}

/* ══ RIGHT PANEL ══ */
.lRight{
  padding:clamp(2rem,4vw,3.5rem);
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  overflow-y:auto;
  position:relative;
}
/* subtle right panel bg gradient */
.lRight::before{content:'';position:absolute;top:0;right:0;width:340px;height:340px;background:radial-gradient(circle,rgba(245,166,35,.06) 0%,transparent 65%);pointer-events:none;border-radius:50%;}
.lRight::after{content:'';position:absolute;bottom:0;left:0;width:280px;height:280px;background:radial-gradient(circle,rgba(123,92,245,.05) 0%,transparent 65%);pointer-events:none;border-radius:50%;}

.lForm{width:100%;max-width:420px;position:relative;z-index:1;}

/* form header */
.lFormHdr{text-align:center;margin-bottom:2.2rem;}
.lFormGem{
  width:60px;height:60px;margin:0 auto 1.4rem;
  background:linear-gradient(135deg,#7B5CF5,#4A28E0);
  clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
  display:flex;align-items:center;justify-content:center;
  font-size:1.4rem;font-weight:900;color:#fff;
  box-shadow:0 0 36px rgba(123,92,245,.48),0 0 72px rgba(123,92,245,.22);
  animation:gemPulse 3s ease-in-out infinite;
  position:relative;
}
.lFormGem::after{content:'';position:absolute;inset:-5px;background:linear-gradient(135deg,rgba(123,92,245,.35),rgba(245,166,35,.2));clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);filter:blur(10px);z-index:-1;animation:gemPulse 3s ease-in-out infinite;}
@keyframes gemPulse{0%,100%{transform:scale(1);box-shadow:0 0 36px rgba(123,92,245,.48),0 0 72px rgba(123,92,245,.22)}50%{transform:scale(1.06);box-shadow:0 0 48px rgba(123,92,245,.62),0 0 90px rgba(123,92,245,.3)}}

.lFormTitle{font-family:var(--fd);font-size:1.85rem;font-weight:800;letter-spacing:-1.2px;margin-bottom:.38rem;}
.lFormSub{color:var(--t2);font-size:.88rem;font-weight:300;line-height:1.6;}

/* error */
.lErr{background:rgba(255,107,107,.08);border:1px solid rgba(255,107,107,.28);border-radius:12px;padding:.85rem 1rem;color:#FF8A8A;font-size:.84rem;line-height:1.5;margin-bottom:1.2rem;display:flex;align-items:flex-start;gap:.55rem;animation:shake .4s var(--ease);}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}

/* fields */
.fG{margin-bottom:1.2rem;animation:fUp .4s var(--ease) both;}
@keyframes fUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.fRow{display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem;}
.fL{font-size:.8rem;font-weight:500;color:var(--text);letter-spacing:.01em;}
.fForgot{font-size:.76rem;color:var(--v2);text-decoration:none;font-weight:500;transition:color .18s;}
.fForgot:hover{color:#C4B1FF;}

.fWrap{position:relative;}
.fIcoLeft{position:absolute;left:1rem;top:50%;transform:translateY(-50%);color:var(--t3);pointer-events:none;}
.fIcoRight{position:absolute;right:.9rem;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--t3);padding:4px;display:flex;align-items:center;justify-content:center;border-radius:6px;transition:color .18s,background .18s;}
.fIcoRight:hover{color:var(--v2);background:rgba(123,92,245,.1);}

.fIn{
  width:100%;padding:.88rem 1rem .88rem 2.85rem;
  background:rgba(255,255,255,.04);
  border:1px solid var(--bd);border-radius:12px;
  color:var(--text);font-family:var(--fb);font-size:.9rem;
  transition:all .25s var(--ease);
  -webkit-appearance:none;
}
.fIn::placeholder{color:var(--t3);}
.fIn:focus{
  outline:none;
  border-color:rgba(123,92,245,.6);
  background:rgba(123,92,245,.07);
  box-shadow:0 0 0 3px rgba(123,92,245,.14),0 0 18px rgba(123,92,245,.1);
  transform:translateY(-1px);
}
.fIn.hasRight{padding-right:2.8rem;}
.fIn.err{border-color:rgba(255,107,107,.45);background:rgba(255,107,107,.04);}

/* remember me row */
.fCheckRow{display:flex;align-items:center;gap:.6rem;margin-bottom:1.4rem;}
.fCheck{
  width:17px;height:17px;flex-shrink:0;
  background:rgba(255,255,255,.05);border:1px solid var(--bd2);
  border-radius:5px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:all .2s var(--ease);
}
.fCheck.on{background:rgba(123,92,245,.25);border-color:rgba(123,92,245,.65);box-shadow:0 0 10px rgba(123,92,245,.25);}
.fCheckLabel{font-size:.82rem;color:var(--t2);cursor:pointer;user-select:none;}

/* submit */
.lBtn{
  width:100%;padding:1rem;
  background:linear-gradient(135deg,#7B5CF5,#5230C5);
  border:none;border-radius:12px;
  color:#fff;font-family:var(--fd);font-size:.98rem;font-weight:700;
  cursor:pointer;letter-spacing:-.2px;
  box-shadow:0 0 0 1px rgba(123,92,245,.38),0 6px 24px rgba(123,92,245,.32);
  transition:all .25s var(--spring);
  position:relative;overflow:hidden;
  display:flex;align-items:center;justify-content:center;gap:.5rem;
}
.lBtn::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 28%,rgba(255,255,255,.2) 50%,transparent 72%);transform:translateX(-100%);transition:transform .4s var(--ease);}
.lBtn:hover::after{transform:translateX(100%);}
.lBtn:hover{box-shadow:0 0 0 1px rgba(123,92,245,.6),0 10px 32px rgba(123,92,245,.5);transform:translateY(-2px);}
.lBtn:active{transform:none;}
.lBtn:disabled{opacity:.55;cursor:not-allowed;transform:none;}

/* spinner */
.lSpinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}

/* divider */
.lDiv{display:flex;align-items:center;gap:.75rem;margin:1.4rem 0;color:var(--t3);font-size:.74rem;}
.lDivLine{flex:1;height:1px;background:var(--bd);}

/* SSO buttons */
.lSSO{display:grid;grid-template-columns:1fr 1fr;gap:.65rem;margin-bottom:0;}
.lSSOBtn{
  padding:.72rem .6rem;border-radius:11px;
  border:1px solid var(--bd);background:rgba(255,255,255,.03);
  color:var(--t2);font-family:var(--fb);font-size:.82rem;font-weight:500;
  cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.5rem;
  transition:all .22s var(--ease);
}
.lSSOBtn:hover{border-color:var(--bd2);background:rgba(255,255,255,.06);color:var(--text);transform:translateY(-1px);}

/* footer */
.lFtr{text-align:center;margin-top:1.6rem;font-size:.84rem;color:var(--t2);}
.lFtrA{color:var(--v2);text-decoration:none;font-weight:600;transition:color .18s;}
.lFtrA:hover{color:#C4B1FF;}

/* form entrance animation */
.lFormInner{animation:formIn .6s .05s var(--ease) both;}
@keyframes formIn{from{opacity:0;transform:translateY(22px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}

/* ══ RESPONSIVE ══ */

/* Tablet landscape (≤1100px) */
@media(max-width:1100px){
  .lStats{gap:1rem;}
  .lLeftH{font-size:clamp(1.7rem,2.8vw,2.4rem);}
}

/* Tablet portrait (≤860px) — hide left panel */
@media(max-width:860px){
  .lpage{grid-template-columns:1fr;}
  .lLeft{display:none;}
  .lRight{min-height:100vh;padding:2rem 1.5rem;}
  body{cursor:auto;}
  #lc1,#lc2{display:none;}
}

/* Mobile L (≤520px) */
@media(max-width:520px){
  .lRight{padding:1.75rem 1.25rem;justify-content:flex-start;padding-top:3rem;}
  .lForm{max-width:100%;}
  .lFormTitle{font-size:1.65rem;}
  .lSSO{grid-template-columns:1fr;}
}

/* Mobile S (≤380px) */
@media(max-width:380px){
  .lRight{padding:1.5rem 1rem;padding-top:2.5rem;}
  .lFormGem{width:50px;height:50px;font-size:1.1rem;}
  .lFormTitle{font-size:1.45rem;}
  .lBtn{font-size:.9rem;padding:.88rem;}
}

/* Tall narrow screens */
@media(max-width:860px) and (min-height:800px){
  .lRight{justify-content:center;}
}
`;

/* ─── minimal particle canvas ─── */
function ParticleBg({ canvasRef }) {
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    let raf;
    const resize = () => { cv.width = innerWidth; cv.height = innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const N = Math.min(55, Math.floor(innerWidth / 18));
    const cols = ['rgba(123,92,245,','rgba(245,166,35,','rgba(6,214,160,'];
    const pts = Array.from({ length: N }, () => ({
      x: Math.random()*innerWidth, y: Math.random()*innerHeight,
      vx: (Math.random()-.5)*.22, vy: (Math.random()-.5)*.22,
      r: Math.random()*1.3+.3,
      a: Math.random()*.38+.1,
      c: cols[Math.floor(Math.random()*cols.length)],
      p: Math.random()*Math.PI*2, ps: .006+Math.random()*.008,
    }));
    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0,0,cv.width,cv.height);
      pts.forEach(p => {
        p.vx*=.984;p.vy*=.984;p.x+=p.vx;p.y+=p.vy;p.p+=p.ps;
        if(p.x<0)p.x=cv.width; if(p.x>cv.width)p.x=0;
        if(p.y<0)p.y=cv.height; if(p.y>cv.height)p.y=0;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.c+(p.a+Math.sin(p.p)*.08)+')';ctx.fill();
      });
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize',resize); };
  }, [canvasRef]);
  return null;
}

/* ─── Inline SVG icon set ─── */
const Icons = {
  Email: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Lock: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  EyeOpen: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeClosed: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  CheckSmall: () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Alert: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Brain: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2a2.5 2.5 0 0 1 5 0"/>
      <path d="M9.5 22a2.5 2.5 0 0 0 5 0"/>
      <path d="M9 3.5A6.5 6.5 0 0 0 9 20.5"/>
      <path d="M15 3.5a6.5 6.5 0 0 1 0 17"/>
      <path d="M3 9.5a2.5 2.5 0 0 1 0 5"/>
      <path d="M21 9.5a2.5 2.5 0 0 0 0 5"/>
    </svg>
  ),
  BookOpen: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  TrendUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Globe: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  GoogleG: () => (
    <svg width="15" height="15" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  ),
  GitHub: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  ),
};

/* ════════════════════════════ MAIN ════════════════════════════ */
const Login = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [remember, setRemember] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/dashboard';

  const canvasRef = useRef(null);
  const cur1Ref   = useRef(null);
  const cur2Ref   = useRef(null);

  /* inject CSS */
  useEffect(() => {
    const s = document.createElement('style');
    s.id = 'login-css'; s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.getElementById('login-css')?.remove();
  }, []);

  /* custom cursor */
  useEffect(() => {
    let rx=0,ry=0,tx=0,ty=0;
    const mm = e => { tx=e.clientX; ty=e.clientY; };
    window.addEventListener('mousemove', mm, { passive:true });
    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      rx+=(tx-rx)*.13; ry+=(ty-ry)*.13;
      if(cur1Ref.current) cur1Ref.current.style.cssText=`left:${tx}px;top:${ty}px;`;
      if(cur2Ref.current) cur2Ref.current.style.cssText=`left:${rx}px;top:${ry}px;`;
    };
    loop();
    return () => { window.removeEventListener('mousemove',mm); cancelAnimationFrame(raf); };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const PILLS = [
    { bg:'rgba(123,92,245,.12)', col:'#C4B1FF', ico: <Icons.Brain />,    text: '30 modules, 5 tracks' },
    { bg:'rgba(245,166,35,.1)',  col:'#FFD166', ico: <Icons.TrendUp />,   text: 'AI pitch coach · Claude-powered' },
    { bg:'rgba(6,214,160,.08)', col:'#6EE7B7', ico: <Icons.Globe />,     text: '9 global market templates' },
    { bg:'rgba(255,107,157,.08)',col:'#FFB3CE', ico: <Icons.BookOpen />,  text: 'Export PDF & Word briefs' },
  ];

  return (
    <>
      <div id="lc1" ref={cur1Ref} />
      <div id="lc2" ref={cur2Ref} />
      <canvas id="lbg" ref={canvasRef} />
      <ParticleBg canvasRef={canvasRef} />
      <div className="lnoise" />

      <div className="lpage">

        {/* ══ LEFT PANEL ══ */}
        <div className="lLeft">
          <Link to="/" className="lLogo" data-h>
            <div className="lLogoGem">M</div>
            Mind<span className="lLogoV">Launch</span>
          </Link>

          <div className="lLeftBody">
            <div className="lTag"><div className="lTagDot" />Welcome back</div>
            <h2 className="lLeftH">
              Continue your<br /><span className="lGV">startup</span>{' '}
              <span className="lGG">journey</span>
            </h2>
            <p className="lLeftSub">
              Your modules, pitch sessions, and investor matches are waiting. Pick up exactly where you left off.
            </p>

            {/* stats */}
            <div className="lStats">
              {[
                ['30','v','Modules'],['5','g','Tracks'],['9','e','Regions'],
              ].map(([n,c,l]) => (
                <React.Fragment key={l}>
                  <div className="lStat">
                    <span className="lStatN" style={{ background: c==='v'?'linear-gradient(135deg,#C4B1FF,#7B5CF5)':c==='g'?'linear-gradient(135deg,#FFD580,#F5A623)':'linear-gradient(135deg,#80FFDE,#06D6A0)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{n}</span>
                    <span className="lStatL">{l}</span>
                  </div>
                  {l !== 'Regions' && <div className="lStatDiv" />}
                </React.Fragment>
              ))}
            </div>

            {/* feature pills */}
            <div className="lPills">
              {PILLS.map((p, i) => (
                <div key={i} className="lPill" style={{ animationDelay:`${i*55}ms` }}>
                  <div className="lPillIco" style={{ background: p.bg, color: p.col }}>{p.ico}</div>
                  {p.text}
                </div>
              ))}
            </div>
          </div>

          {/* testimonial */}
          <div className="lTestCard">
            <span className="lQuoteIco">"</span>
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

        {/* ══ RIGHT PANEL ══ */}
        <div className="lRight">
          <div className="lForm">
            <div className="lFormInner">

              {/* header */}
              <div className="lFormHdr">
                <div className="lFormGem">M</div>
                <h1 className="lFormTitle">Welcome back</h1>
                <p className="lFormSub">Sign in to continue your entrepreneurship journey</p>
              </div>

              {/* error */}
              {error && (
                <div className="lErr">
                  <Icons.Alert />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>

                {/* email */}
                <div className="fG" style={{ animationDelay:'0ms' }}>
                  <label className="fL">Email address</label>
                  <div className="fWrap">
                    <span className="fIcoLeft"><Icons.Email /></span>
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

                {/* password */}
                <div className="fG" style={{ animationDelay:'60ms' }}>
                  <div className="fRow">
                    <label className="fL">Password</label>
                    <a href="#" className="fForgot" data-h>Forgot password?</a>
                  </div>
                  <div className="fWrap">
                    <span className="fIcoLeft"><Icons.Lock /></span>
                    <input
                      className={`fIn hasRight${error && !password ? ' err' : ''}`}
                      type={showPw ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button type="button" className="fIcoRight" onClick={() => setShowPw(s => !s)} data-h>
                      {showPw ? <Icons.EyeClosed /> : <Icons.EyeOpen />}
                    </button>
                  </div>
                </div>

                {/* remember me */}
                <div className="fCheckRow">
                  <div
                    className={`fCheck${remember ? ' on' : ''}`}
                    onClick={() => setRemember(s => !s)}
                    role="checkbox"
                    aria-checked={remember}
                    data-h
                  >
                    {remember && <Icons.CheckSmall />}
                  </div>
                  <span className="fCheckLabel" onClick={() => setRemember(s => !s)}>
                    Remember me for 30 days
                  </span>
                </div>

                {/* submit */}
                <button type="submit" className="lBtn" disabled={loading} data-h>
                  {loading
                    ? <><span className="lSpinner" />Signing in…</>
                    : <>Sign in <Icons.ArrowRight /></>
                  }
                </button>

              </form>

              {/* SSO divider */}
              <div className="lDiv">
                <div className="lDivLine" />
                <span>or continue with</span>
                <div className="lDivLine" />
              </div>

              <div className="lSSO">
                <button className="lSSOBtn" type="button" data-h>
                  <Icons.GoogleG /> Google
                </button>
                <button className="lSSOBtn" type="button" data-h>
                  <Icons.GitHub /> GitHub
                </button>
              </div>

              {/* footer */}
              <div className="lFtr">
                Don't have an account?{' '}
                <Link to="/register" className="lFtrA" data-h>Create one free</Link>
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Login;