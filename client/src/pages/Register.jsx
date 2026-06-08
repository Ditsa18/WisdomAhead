import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import {
  Laptop,
  Wallet,
  HeartPulse,
  ShoppingCart,
  GraduationCap,
  Utensils,
  Leaf,
  Cog,
  Handshake,
  Bot,
  Briefcase,
  Globe,
  FileText,
  Rocket
} from 'lucide-react';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg:#04040C;--bg2:#08081A;
  --card:rgba(255,255,255,.034);--card2:rgba(255,255,255,.055);
  --v:#7B5CF5;--v2:#A78BFF;--vd:rgba(123,92,245,.13);--vg:rgba(123,92,245,.38);
  --gold:#F5A623;--gold2:#FFD166;--goldd:rgba(245,166,35,.13);
  --em:#06D6A0;--rose:#FF6B9D;
  --text:#F0EEFF;--t2:#8E8CAD;--t3:#3D3C56;
  --bd:rgba(255,255,255,.07);--bd2:rgba(255,255,255,.13);
  --r:14px;--rl:22px;
  --ease:cubic-bezier(.25,.46,.45,.94);--spring:cubic-bezier(.34,1.56,.64,1);
  --fd:'Outfit',sans-serif;
--fb:'Plus Jakarta Sans',sans-serif;--fm:'JetBrains Mono',monospace;
}

body{
  background:var(--bg);color:var(--text);
  font-family:var(--fb);overflow-x:hidden;
  cursor:none;
}

/* cursor */
#rc1{position:fixed;width:11px;height:11px;background:var(--v2);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width .18s var(--spring),height .18s var(--spring),background .18s;mix-blend-mode:screen;}
#rc2{position:fixed;width:32px;height:32px;border:1px solid rgba(123,92,245,.35);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:left .1s var(--ease),top .1s var(--ease);}
body:has(button:hover,a:hover,input:focus,select:focus,[data-h]:hover) #rc1{width:20px;height:20px;background:var(--gold);}

/* canvas */
#rbg{position:fixed;inset:0;z-index:0;pointer-events:none;}
.rnoise{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.025;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}

.rpage{
  min-height:100vh;position:relative;z-index:2;
  display:grid;grid-template-columns:1fr 1fr;
  align-items:stretch;
}

/* LEFT PANEL */
.rLeft{
  padding:3rem;
  display:flex;flex-direction:column;
  justify-content:space-between;
  background:linear-gradient(155deg,rgba(123,92,245,.08) 0%,rgba(6,214,160,.04) 50%,rgba(245,166,35,.05) 100%);
  border-right:1px solid var(--bd);
  position:relative;overflow:hidden;
}
.rLeft::before{
  content:'';position:absolute;top:-120px;left:-120px;
  width:400px;height:400px;border-radius:50%;
  background:radial-gradient(circle,rgba(123,92,245,.18) 0%,transparent 65%);
  animation:oF 18s ease-in-out infinite alternate;
  pointer-events:none;
}
.rLeft::after{
  content:'';position:absolute;bottom:-80px;right:-80px;
  width:300px;height:300px;border-radius:50%;
  background:radial-gradient(circle,rgba(245,166,35,.1) 0%,transparent 65%);
  animation:oF 22s ease-in-out infinite alternate-reverse;
  pointer-events:none;
}
@keyframes oF{0%{transform:translate(0,0) scale(1)}50%{transform:translate(20px,-14px) scale(1.04)}100%{transform:translate(-14px,20px) scale(.97)}}

.rLogo{
  display:flex;align-items:center;gap:.55rem;
  text-decoration:none;color:var(--text);
  font-family:var(--fd);font-size:1.2rem;font-weight:800;letter-spacing:-.5px;
  position:relative;z-index:1;
}
.rLogoGem{
  width:34px;height:34px;
  background:linear-gradient(135deg,#7B5CF5,#4A28E0);
  clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
  display:flex;align-items:center;justify-content:center;
  font-size:.88rem;font-weight:900;color:#fff;flex-shrink:0;
  box-shadow:0 0 24px rgba(123,92,245,.45);
  transition:transform .3s var(--spring),box-shadow .3s;
}
.rLogo:hover .rLogoGem{transform:rotate(30deg) scale(1.1);box-shadow:0 0 40px rgba(123,92,245,.7);}
.rLogoV{background:linear-gradient(90deg,var(--v2),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

.rLeftBody{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;justify-content:center;padding:2.5rem 0;}
.rLeftTag{
  display:inline-flex;align-items:center;gap:.4rem;
  padding:.26rem .8rem;border-radius:100px;
  border:1px solid rgba(123,92,245,.22);background:rgba(123,92,245,.09);
  color:#C4B1FF;font-size:.7rem;font-weight:500;font-family:var(--fm);letter-spacing:.08em;text-transform:uppercase;
  margin-bottom:1.5rem;width:fit-content;
}
.rTagDot{width:5px;height:5px;border-radius:50%;background:var(--v2);box-shadow:0 0 8px var(--v2);animation:bl 2s ease-in-out infinite;}
@keyframes bl{0%,100%{opacity:1}50%{opacity:.3}}
.rLeftH{font-family:var(--fd);font-size:clamp(2rem,3.5vw,2.8rem);font-weight:800;letter-spacing:-2px;line-height:1.08;margin-bottom:1rem;}
.rGV{background:linear-gradient(135deg,#C4B1FF,#7B5CF5,#A78BFF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.rGG{background:linear-gradient(135deg,#FFE066,#F5A623,#FFB347);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.rLeftSub{color:var(--t2);font-size:1rem;line-height:1.7;font-weight:300;margin-bottom:2.5rem;max-width:380px;}

/* trust badges */
.rBadges{display:flex;flex-direction:column;gap:.7rem;}
.rBadge{
  display:flex;align-items:center;gap:.75rem;
  padding:.75rem 1rem;border-radius:12px;
  background:rgba(255,255,255,.03);border:1px solid var(--bd);
  font-size:.84rem;font-weight:400;color:var(--t2);
  transition:all .25s var(--ease);
}
.rBadge:hover{border-color:rgba(123,92,245,.28);background:rgba(123,92,245,.05);color:var(--text);transform:translateX(4px);}
.rBadgeIco{
  width:32px;height:32px;border-radius:8px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;font-size:.95rem;
}

/* step tracker */
.rSteps{position:relative;z-index:1;padding:.5rem 0;}
.rStepRow{display:flex;align-items:center;gap:.5rem;font-size:.72rem;color:var(--t3);font-family:var(--fm);}
.rStepPip{
  width:6px;height:6px;border-radius:50%;background:var(--bd2);
  transition:all .3s var(--ease);
}
.rStepPip.on{background:var(--v2);box-shadow:0 0 8px var(--v2);}
.rStepPip.done{background:var(--em);box-shadow:0 0 6px var(--em);}

/* RIGHT PANEL */
.rRight{
  padding:3rem;
  display:flex;flex-direction:column;
  justify-content:center;
  overflow-y:auto;max-height:100vh;
}
.rForm{width:100%;max-width:440px;margin:0 auto;}

.rFormHdr{text-align:center;margin-bottom:2.2rem;}
.rFormTitle{font-family:var(--fd);font-size:1.75rem;font-weight:800;letter-spacing:-1.2px;margin-bottom:.35rem;}
.rFormSub{color:var(--t2);font-size:.88rem;font-weight:300;line-height:1.6;}

/* progress bar inside form */
.rProgress{
  display:flex;align-items:center;justify-content:center;gap:.4rem;
  margin-bottom:2rem;
}
.rProgStep{
  display:flex;align-items:center;gap:.4rem;
  font-size:.72rem;font-family:var(--fm);color:var(--t3);
  transition:color .3s;
}
.rProgStep.on{color:var(--v2);}
.rProgStep.done{color:var(--em);}
.rProgNum{
  width:22px;height:22px;border-radius:50%;
  background:rgba(255,255,255,.06);border:1px solid var(--bd2);
  display:flex;align-items:center;justify-content:center;
  font-size:.62rem;font-weight:600;
  transition:all .3s var(--spring);
}
.rProgStep.on .rProgNum{background:rgba(123,92,245,.2);border-color:rgba(123,92,245,.6);color:#C4B1FF;box-shadow:0 0 12px rgba(123,92,245,.3);}
.rProgStep.done .rProgNum{background:rgba(6,214,160,.15);border-color:rgba(6,214,160,.5);color:#6EE7B7;}
.rProgLine{flex:1;height:1px;background:var(--bd);max-width:40px;transition:background .4s;}
.rProgLine.done{background:rgba(6,214,160,.4);}

/* form fields */
.fG{margin-bottom:1.25rem;animation:fUp .5s var(--ease) both;}
@keyframes fUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.fL{display:block;font-size:.8rem;font-weight:500;color:var(--text);margin-bottom:.45rem;letter-spacing:.01em;}
.fLSub{font-size:.72rem;color:var(--t3);font-weight:300;margin-left:.3rem;}

.fIn{
  width:100%;padding:.9rem 1.1rem;
  background:rgba(255,255,255,.04);
  border:1px solid var(--bd);border-radius:12px;
  color:var(--text);font-family:var(--fb);font-size:.9rem;
  transition:all .25s var(--ease);
  appearance:none;
}
.fIn::placeholder{color:var(--t3);}
.fIn:focus{
  outline:none;
  border-color:rgba(123,92,245,.6);
  background:rgba(123,92,245,.07);
  box-shadow:0 0 0 3px rgba(123,92,245,.14),0 0 20px rgba(123,92,245,.12);
  transform:translateY(-1px);
}
.fIn:valid:not(:placeholder-shown){border-color:rgba(6,214,160,.35);}
.fIn.err{border-color:rgba(255,107,107,.5);background:rgba(255,107,107,.05);}

/* input with icon */
.fInWrap{position:relative;}
.fInIco{position:absolute;left:1rem;top:50%;transform:translateY(-50%);color:var(--t3);pointer-events:none;width:15px;height:15px;}
.fInWrap .fIn{padding-left:2.7rem;}
.fInRight{position:absolute;right:.9rem;top:50%;transform:translateY(-50%);cursor:pointer;color:var(--t3);transition:color .18s;background:none;border:none;padding:0;}
.fInRight:hover{color:var(--v2);}

/* password strength */
.pwStrength{margin-top:.45rem;display:flex;align-items:center;gap:.5rem;}
.pwBars{display:flex;gap:3px;flex:1;}
.pwBar{flex:1;height:3px;border-radius:2px;background:var(--bd);transition:background .3s;}
.pwBar.s1{background:#FF6B6B;}
.pwBar.s2{background:var(--gold);}
.pwBar.s3{background:var(--em);}
.pwLabel{font-size:.68rem;font-family:var(--fm);color:var(--t3);white-space:nowrap;transition:color .3s;}

/* category tiles */
.catGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:.55rem;margin-top:.5rem;}
.catTile{
  padding:.65rem .6rem;border-radius:10px;
  font-size:.78rem;font-weight:500;text-align:center;
  border:1px solid var(--bd);background:var(--card);
  cursor:pointer;transition:all .22s var(--ease);
  display:flex;flex-direction:column;align-items:center;gap:.3rem;
  color:var(--t2);
}
.catTile:hover{border-color:rgba(123,92,245,.32);background:rgba(123,92,245,.07);color:var(--text);transform:translateY(-2px);}
.catTile.sel{border-color:rgba(123,92,245,.6);background:rgba(123,92,245,.14);color:#C4B1FF;box-shadow:0 0 16px rgba(123,92,245,.15);}
.catIco{font-size:1.1rem;}

/* region select custom */
.regGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-top:.5rem;}
.regChip{
  padding:.5rem .55rem;border-radius:9px;
  font-size:.74rem;font-weight:500;text-align:center;
  border:1px solid var(--bd);background:var(--card);
  cursor:pointer;transition:all .22s var(--ease);
  color:var(--t2);
}
.regChip:hover{border-color:rgba(245,166,35,.35);background:rgba(245,166,35,.07);color:var(--text);}
.regChip.sel{border-color:rgba(245,166,35,.6);background:rgba(245,166,35,.12);color:#FFD166;box-shadow:0 0 14px rgba(245,166,35,.12);}

/* error box */
.fErr{
  background:rgba(255,107,107,.08);border:1px solid rgba(255,107,107,.28);
  border-radius:12px;padding:.85rem 1rem;
  color:#FF8A8A;font-size:.84rem;line-height:1.5;
  margin-bottom:1.2rem;display:flex;align-items:flex-start;gap:.55rem;
  animation:shake .4s var(--ease);
}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}

/* submit btn */
.rBtn{
  width:100%;padding:1rem;
  background:linear-gradient(135deg,#7B5CF5,#5230C5);
  border:none;border-radius:12px;
  color:#fff;font-family:var(--fd);font-size:1rem;font-weight:700;
  cursor:pointer;
  box-shadow:0 0 0 1px rgba(123,92,245,.38),0 6px 24px rgba(123,92,245,.32);
  transition:all .25s var(--spring);
  position:relative;overflow:hidden;
  letter-spacing:-.2px;
}
.rBtn::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 28%,rgba(255,255,255,.2) 50%,transparent 72%);transform:translateX(-100%);transition:transform .4s var(--ease);}
.rBtn:hover::after{transform:translateX(100%);}
.rBtn:hover{box-shadow:0 0 0 1px rgba(123,92,245,.6),0 10px 34px rgba(123,92,245,.5);transform:translateY(-2px);}
.rBtn:active{transform:none;}
.rBtn:disabled{opacity:.55;cursor:not-allowed;transform:none;}

/* loading spinner */
.rSpinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;margin-right:.55rem;vertical-align:middle;}
@keyframes spin{to{transform:rotate(360deg)}}

/* divider */
.rDiv{display:flex;align-items:center;gap:.75rem;margin:1.25rem 0;color:var(--t3);font-size:.75rem;}
.rDivLine{flex:1;height:1px;background:var(--bd);}

/* footer link */
.rFtr{text-align:center;margin-top:1.5rem;font-size:.84rem;color:var(--t2);}
.rFtrA{color:var(--v2);text-decoration:none;font-weight:600;transition:color .18s;}
.rFtrA:hover{color:#C4B1FF;}

/* terms */
.rTerms{font-size:.72rem;color:var(--t3);text-align:center;margin-top:1rem;line-height:1.55;}
.rTermsA{color:var(--t2);text-decoration:none;border-bottom:1px solid var(--bd);transition:color .18s,border-color .18s;}
.rTermsA:hover{color:var(--v2);border-color:rgba(123,92,245,.4);}

/* step transitions */
.rStep{animation:stepIn .4s var(--ease) both;}
@keyframes stepIn{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:translateX(0)}}

/* nav buttons between steps */
.rNavRow{display:flex;gap:.65rem;margin-top:1.25rem;}
.rBack{flex:0;padding:.85rem 1.1rem;border-radius:12px;border:1px solid var(--bd);background:none;color:var(--t2);font-family:var(--fd);font-size:.9rem;font-weight:600;cursor:pointer;transition:all .22s;display:flex;align-items:center;gap:.4rem;}
.rBack:hover{border-color:var(--bd2);color:var(--text);}
.rNext{flex:1;padding:.85rem;border-radius:12px;background:linear-gradient(135deg,rgba(123,92,245,.15),rgba(123,92,245,.08));border:1px solid rgba(123,92,245,.35);color:#C4B1FF;font-family:var(--fd);font-size:.9rem;font-weight:700;cursor:pointer;transition:all .22s var(--ease);display:flex;align-items:center;justify-content:center;gap:.4rem;letter-spacing:-.15px;}
.rNext:hover{border-color:rgba(123,92,245,.65);background:rgba(123,92,245,.2);transform:translateY(-1px);}
.rNext:disabled{opacity:.45;cursor:not-allowed;transform:none;}

@media(max-width:860px){
  .rpage{grid-template-columns:1fr;}
  .rLeft{display:none;}
  .rRight{padding:2rem 1.5rem;max-height:none;}
  body{cursor:auto;}
  #rc1,#rc2{display:none;}
}
@media(max-width:480px){
  .rRight{padding:1.5rem 1.25rem;}
  .catGrid{grid-template-columns:repeat(2,1fr);}
  .regGrid{grid-template-columns:repeat(2,1fr);}
}
`;

/* ─── tiny canvas bg ─── */
function MiniParticleBg({ canvasRef }) {
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    let raf, pts;
    const resize = () => { cv.width = innerWidth; cv.height = innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const N = Math.min(60, Math.floor(innerWidth / 16));
    pts = Array.from({ length: N }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      vx: (Math.random()-.5)*.25, vy: (Math.random()-.5)*.25,
      r: Math.random()*1.4+.3,
      a: Math.random()*.4+.1,
      c: ['rgba(123,92,245,','rgba(245,166,35,','rgba(6,214,160,'][Math.floor(Math.random()*3)],
      p: Math.random()*Math.PI*2, ps: .006+Math.random()*.009,
    }));
    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0,0,cv.width,cv.height);
      pts.forEach(p => {
        p.vx*=.985;p.vy*=.985;p.x+=p.vx;p.y+=p.vy;p.p+=p.ps;
        if(p.x<0)p.x=cv.width;if(p.x>cv.width)p.x=0;
        if(p.y<0)p.y=cv.height;if(p.y>cv.height)p.y=0;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.c+(p.a+Math.sin(p.p)*.09)+')';ctx.fill();
      });
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize',resize); };
  }, [canvasRef]);
  return null;
}

const CATS = [
  { id:'tech', icon: Laptop, label:'Tech Startup' },
  { id:'fin', icon: Wallet, label:'Fintech' },
  { id:'health', icon: HeartPulse, label:'Healthtech' },
  { id:'ecom', icon: ShoppingCart, label:'E-Commerce' },
  { id:'edu', icon: GraduationCap, label:'Edtech' },
  { id:'food', icon: Utensils, label:'Food & Bev' },
  { id:'impact', icon: Leaf, label:'Social Impact' },
  { id:'mfg', icon: Cog, label:'Manufacturing' },
  { id:'svc', icon: Handshake, label:'Services' },
];

const REGIONS = [
  { code:'IN', flag:'🇮🇳', name:'India' },
  { code:'US', flag:'🇺🇸', name:'USA' },
  { code:'UAE',flag:'🇦🇪', name:'UAE' },
  { code:'SA', flag:'🇸🇦', name:'Saudi' },
  { code:'EG', flag:'🇪🇬', name:'Egypt' },
  { code:'NG', flag:'🇳🇬', name:'Nigeria' },
  { code:'KE', flag:'🇰🇪', name:'Kenya' },
  { code:'JO', flag:'🇯🇴', name:'Jordan' },
  { code:'QA', flag:'🇶🇦', name:'Qatar' },
];

function getPwStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const PW_LABELS = ['','Weak','Fair','Strong'];
const PW_COLORS = ['','#FF6B6B','var(--gold)','var(--em)'];

/* ─── Eye icon ─── */
const EyeIcon = ({ open }) => open
  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

const ArrowRight = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const ArrowLeft  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const CheckIcon  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════ */
const Register = () => {
  const [formStep, setFormStep] = useState(0); // 0=account 1=profile 2=region
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

  const canvasRef = useRef(null);
  const cur1Ref   = useRef(null);
  const cur2Ref   = useRef(null);

  /* inject CSS */
  useEffect(() => {
    const s = document.createElement('style');
    s.id = 'reg-css'; s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.getElementById('reg-css')?.remove();
  }, []);

  /* cursor */
  useEffect(() => {
    let rx=0,ry=0,tx=0,ty=0;
    const mm = e => { tx=e.clientX; ty=e.clientY; };
    window.addEventListener('mousemove', mm, { passive:true });
    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      rx += (tx-rx)*.13; ry += (ty-ry)*.13;
      if(cur1Ref.current) cur1Ref.current.style.cssText = `left:${tx}px;top:${ty}px;`;
      if(cur2Ref.current) cur2Ref.current.style.cssText = `left:${rx}px;top:${ry}px;`;
    };
    loop();
    return () => { window.removeEventListener('mousemove',mm); cancelAnimationFrame(raf); };
  }, []);

  const pwStrength = getPwStrength(password);

  const step0Valid = name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length >= 8;
  const step1Valid = !!category;
  const step2Valid = !!region;

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

  const TRUST = [
  {
    icon: Bot,
    bg: 'rgba(123,92,245,.12)',
    text: 'AI Pitch Coach powered by Claude'
  },
  {
    icon: Briefcase,
    bg: 'rgba(245,166,35,.1)',
    text: 'Shark Tank–style VC matchmaking'
  },
  {
    icon: Globe,
    bg: 'rgba(6,214,160,.08)',
    text: 'Curriculum for 9 global markets'
  },
  {
    icon: FileText,
    bg: 'rgba(255,107,157,.08)',
    text: 'Export PDF & Word documents'
  },
];

  const STEPS_LABEL = ['Account','Category','Region'];

  return (
    <>
      <div id="rc1" ref={cur1Ref} />
      <div id="rc2" ref={cur2Ref} />
      <canvas id="rbg" ref={canvasRef} />
      <MiniParticleBg canvasRef={canvasRef} />
      <div className="rnoise" />

      <div className="rpage">

        {/* ── LEFT PANEL ── */}
        <div className="rLeft">
          <Link to="/" className="rLogo" data-h>
            <div className="rLogoGem">M</div>
            Mind<span className="rLogoV">Launch</span>
          </Link>

          <div className="rLeftBody">
            <div className="rLeftTag">
              <div className="rTagDot" />
              Start your journey
            </div>
            <h2 className="rLeftH">
              From idea<br />to <span className="rGV">funded</span>{' '}
              <span className="rGG">startup</span>
            </h2>
            <p className="rLeftSub">
              30 structured modules, an AI pitch coach, and a VC network waiting to fund your vision. Everything a founder needs.
            </p>
            <div className="rBadges">
              {TRUST.map((t, i) => {
  const Icon = t.icon;

  return (
    <div key={i} className="rBadge">
      <div className="rBadgeIco" style={{ background: t.bg }}>
        <Icon size={18} strokeWidth={2} />
      </div>
      <span>{t.text}</span>
    </div>
  );
})}
            </div>
          </div>

          <div className="rSteps">
            <div className="rStepRow">
              {STEPS_LABEL.map((l, i) => (
                <React.Fragment key={i}>
                  <div className={`rStepPip${formStep > i ? ' done' : formStep === i ? ' on' : ''}`} />
                  <span style={{ color: formStep >= i ? 'var(--t2)' : 'var(--t3)', fontSize:'.7rem' }}>{l}</span>
                  {i < STEPS_LABEL.length - 1 && <div style={{ flex:1, height:1, background:'var(--bd)', maxWidth:30 }} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="rRight">
          <div className="rForm">

            <div className="rFormHdr">
              <h1 className="rFormTitle">
                {formStep === 0 && 'Create your account'}
                {formStep === 1 && 'Pick your category'}
                {formStep === 2 && 'Choose your region'}
              </h1>
              <p className="rFormSub">
                {formStep === 0 && 'Join MindLaunch and start building your fundable startup'}
                {formStep === 1 && 'We\'ll tailor your modules and coaching to your business type'}
                {formStep === 2 && 'Get curriculum and templates tuned to your local market'}
              </p>
            </div>

            {/* progress indicator */}
            <div className="rProgress">
              {STEPS_LABEL.map((l, i) => (
                <React.Fragment key={i}>
                  <div className={`rProgStep${formStep === i ? ' on' : formStep > i ? ' done' : ''}`}>
                    <div className="rProgNum">
                      {formStep > i ? <CheckIcon /> : i + 1}
                    </div>
                    <span style={{ display: window.innerWidth > 480 ? 'block' : 'none' }}>{l}</span>
                  </div>
                  {i < STEPS_LABEL.length - 1 && <div className={`rProgLine${formStep > i ? ' done' : ''}`} />}
                </React.Fragment>
              ))}
            </div>

            {error && (
              <div className="fErr">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* STEP 0 — Account */}
            {formStep === 0 && (
              <div className="rStep">
                <div className="fG" style={{ animationDelay:'0ms' }}>
                  <label className="fL">Full name</label>
                  <div className="fInWrap">
                    <svg className="fInIco" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                    <input className={`fIn${error && !name ? ' err' : ''}`} type="text" placeholder="Sundar Pichai" value={name} onChange={e => setName(e.target.value)} autoFocus />
                  </div>
                </div>

                <div className="fG" style={{ animationDelay:'60ms' }}>
                  <label className="fL">Email address</label>
                  <div className="fInWrap">
                    <svg className="fInIco" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <input className={`fIn${error && !email ? ' err' : ''}`} type="email" placeholder="you@startup.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>

                <div className="fG" style={{ animationDelay:'120ms' }}>
                  <label className="fL">Password <span className="fLSub">min. 8 characters</span></label>
                  <div className="fInWrap">
                    <svg className="fInIco" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input className="fIn" type={showPw ? 'text' : 'password'} placeholder="Create a strong password" value={password} onChange={e => setPassword(e.target.value)} />
                    <button className="fInRight" type="button" onClick={() => setShowPw(s => !s)} data-h>
                      <EyeIcon open={showPw} />
                    </button>
                  </div>
                  {password && (
                    <div className="pwStrength">
                      <div className="pwBars">
                        {[1,2,3].map(i => (
                          <div key={i} className={`pwBar${pwStrength >= i ? ` s${pwStrength}` : ''}`} />
                        ))}
                      </div>
                      <span className="pwLabel" style={{ color: PW_COLORS[pwStrength] }}>{PW_LABELS[pwStrength]}</span>
                    </div>
                  )}
                </div>

                <button className="rNext" style={{ marginTop:'.5rem' }} onClick={handleNext} disabled={!step0Valid} data-h>
                  Continue <ArrowRight />
                </button>

                <div className="rDiv"><div className="rDivLine" /> or <div className="rDivLine" /></div>

                <div className="rFtr">
                  Already have an account?{' '}
                  <Link to="/login" className="rFtrA" data-h>Log in here</Link>
                </div>
              </div>
            )}

            {/* STEP 1 — Category */}
            {formStep === 1 && (
              <div className="rStep">
                <div className="fG">
                  <label className="fL">Business category <span className="fLSub">choose one</span></label>
                  <div className="catGrid">
                    {CATS.map(c => {
  const Icon = c.icon;

  return (
    <div
      key={c.id}
      className={`catTile${category === c.id ? ' sel' : ''}`}
      onClick={() => setCategory(c.id)}
      data-h
    >
      <span className="catIco">
        <Icon size={22} strokeWidth={2} />
      </span>
      <span>{c.label}</span>
    </div>
  );
})}
                  </div>
                </div>

                {category && (
                  <div style={{ padding:'.7rem 1rem',borderRadius:10,background:'rgba(123,92,245,.07)',border:'1px solid rgba(123,92,245,.22)',fontSize:'.8rem',color:'#C4B1FF',marginBottom:'1rem',display:'flex',alignItems:'center',gap:'.5rem',animation:'fUp .35s var(--ease) both' }}>
                    <span>✓</span>
                    <span>Selected: <strong>{CATS.find(c=>c.id===category)?.label}</strong></span>
                  </div>
                )}

                <div className="rNavRow">
                  <button className="rBack" onClick={() => { setFormStep(0); setError(''); }} data-h>
                    <ArrowLeft /> Back
                  </button>
                  <button className="rNext" onClick={handleNext} disabled={!step1Valid} data-h>
                    Continue <ArrowRight />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 — Region */}
            {formStep === 2 && (
              <form className="rStep" onSubmit={handleSubmit}>
                <div className="fG">
                  <label className="fL">Target market region <span className="fLSub">where you're building</span></label>
                  <div className="regGrid">
                    {REGIONS.map(r => (
                      <div key={r.code} className={`regChip${region === r.code ? ' sel' : ''}`} onClick={() => setRegion(r.code)} data-h>
                        {r.flag} {r.name}
                      </div>
                    ))}
                  </div>
                </div>

                {region && (
                  <div style={{ padding:'.7rem 1rem',borderRadius:10,background:'rgba(245,166,35,.07)',border:'1px solid rgba(245,166,35,.22)',fontSize:'.8rem',color:'#FFD166',marginBottom:'1rem',display:'flex',alignItems:'center',gap:'.5rem',animation:'fUp .35s var(--ease) both' }}>
                    <span>✓</span>
                    <span>Building for: <strong>{REGIONS.find(r2=>r2.code===region)?.flag} {REGIONS.find(r2=>r2.code===region)?.name}</strong></span>
                  </div>
                )}

                <div className="rNavRow">
                  <button type="button" className="rBack" onClick={() => { setFormStep(1); setError(''); }} data-h>
                    <ArrowLeft /> Back
                  </button>
                  <button
  type="submit"
  className="rBtn"
  style={{
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  }}
  disabled={loading || !step2Valid}
  data-h
>
                    {loading ? (
  <>
    <span className="rSpinner" />
    Creating account...
  </>
) : (
  <>
    <Rocket size={18} strokeWidth={2} />
    Create Account
  </>
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