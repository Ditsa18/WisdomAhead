import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import * as THREE from 'three';

/*
  MindLaunch — Subscription v2
  No own sidebar — works inside existing layout.
  Matches Dashboard v3 + MyModules v2 theme.
  Place at: src/pages/Subscription.jsx
*/

const injectFonts = () => {
  if (document.getElementById('ml-fonts')) return;
  const l = document.createElement('link');
  l.id = 'ml-fonts'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(l);
};

/* ── Three.js bg ── */
function createBg(canvas) {
  const W = window.innerWidth, H = window.innerHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setSize(W, H);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(65, W / H, 0.1, 200);
  cam.position.z = 7;

  const COUNT = 200;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  const vel = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    pos[i*3]   = (Math.random() - .5) * 30;
    pos[i*3+1] = (Math.random() - .5) * 18;
    pos[i*3+2] = (Math.random() - .5) * 12;
    vel[i] = .0005 + Math.random() * .001;
    const t = Math.random();
    if      (t > .7)  { col[i*3]=.48; col[i*3+1]=.36; col[i*3+2]=.96; }
    else if (t > .45) { col[i*3]=.96; col[i*3+1]=.65; col[i*3+2]=.14; }
    else if (t > .25) { col[i*3]=.02; col[i*3+1]=.84; col[i*3+2]=.63; }
    else              { col[i*3]=1;   col[i*3+1]=.42; col[i*3+2]=.62; }
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size:.025, vertexColors:true, transparent:true, opacity:.38, sizeAttenuation:true }));
  scene.add(pts);

  let mx=0, my=0;
  const onMM = e => { mx=(e.clientX/innerWidth-.5)*2; my=-(e.clientY/innerHeight-.5)*2; };
  const onResize = () => { renderer.setSize(innerWidth,innerHeight); cam.aspect=innerWidth/innerHeight; cam.updateProjectionMatrix(); };
  window.addEventListener('mousemove', onMM, { passive:true });
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();
  let raf;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    cam.position.x += (mx*.2-cam.position.x)*.022;
    cam.position.y += (my*.15-cam.position.y)*.022;
    pts.rotation.y = clock.getElapsedTime()*.007;
    const pa = geo.attributes.position.array;
    for (let i=0;i<COUNT;i++) { pa[i*3+1]+=vel[i]; if(pa[i*3+1]>9) pa[i*3+1]=-9; }
    geo.attributes.position.needsUpdate = true;
    renderer.render(scene, cam);
  };
  tick();
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('mousemove', onMM);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
  };
}

/* ══════════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════════ */
const Svg = ({ d, size=16, fill="none", sw=2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p,i)=><path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);
const Ic = {
  Check:   s=><Svg size={s} d="M20 6L9 17l-5-5"/>,
  CheckC:  s=><Svg size={s} d={["M22 11.08V12a10 10 0 1 1-5.93-9.14","M22 4L12 14.01l-3-3"]}/>,
  Alert:   s=><Svg size={s} d={["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M12 8v4","M12 16h.01"]}/>,
  Card:    s=><Svg size={s} d={["M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z","M1 10h22"]}/>,
  Sparkle: s=><Svg size={s} fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>,
  Arrow:   s=><Svg size={s} d={["M5 12h14","M12 5l7 7-7 7"]}/>,
  Refresh: s=><Svg size={s} d={["M23 4v6h-6","M1 20v-6h6","M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"]}/>,
  Star:    s=><Svg size={s} fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>,
  Zap:     s=><Svg size={s} fill="currentColor" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>,
  Lock:    s=><Svg size={s} d={["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z","M7 11V7a5 5 0 0 1 10 0v4"]}/>,
  Unlock:  s=><Svg size={s} d={["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z","M7 11V7a5 5 0 0 1 9.9-1"]}/>,
  Book:    s=><Svg size={s} d={["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z","M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]}/>,
  FileT:   s=><Svg size={s} d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8","M16 17H8"]}/>,
  Globe:   s=><Svg size={s} d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M2 12h20","M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"]}/>,
  Award:   s=><Svg size={s} d={["M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z","M8.21 13.89L7 23l5-3 5 3-1.21-9.12"]}/>,
  Info:    s=><Svg size={s} d={["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M12 16v-4","M12 8h.01"]}/>,
  Rocket:  s=><Svg size={s} d={["M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z","M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"]}/>,
};

/* ══════════════════════════════════════════════════════════════
   CSS
══════════════════════════════════════════════════════════════ */
const CSS = `
.sub-page *,.sub-page *::before,.sub-page *::after{box-sizing:border-box}
.sub-page{
  font-family:'Plus Jakarta Sans',sans-serif;
  color:#F0EFF8;min-height:100vh;position:relative;
}
#sub-canvas{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none}
.sub-noise{
  position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.022;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.sub-wrap{position:relative;z-index:2;padding:1.75rem 2rem 4rem;max-width:1200px;display:flex;flex-direction:column;gap:2rem}

/* ── PAGE HEADER ── */
.sub-hdr{display:flex;align-items:flex-start;justify-content:space-between;gap:1.5rem;flex-wrap:wrap;animation:subUp .5s both}
.sub-title{
  font-family:'Outfit',sans-serif;font-size:2rem;font-weight:800;letter-spacing:-1.5px;line-height:1.1;margin-bottom:.4rem;
  background:linear-gradient(135deg,#F0EFF8,#C4B1FF);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.sub-sub{font-size:.9rem;color:#8B8AA8;line-height:1.65;max-width:580px}
.sub-plan-pills{display:flex;flex-direction:column;align-items:flex-end;gap:.5rem;flex-shrink:0}
.sub-pill{
  padding:.28rem .8rem;border-radius:100px;
  font-size:.7rem;font-weight:700;font-family:'JetBrains Mono',monospace;
  letter-spacing:.05em;text-transform:uppercase;
  display:inline-flex;align-items:center;gap:.35rem;
}
.pill-v{background:rgba(123,92,245,.12);border:1px solid rgba(123,92,245,.28);color:#C4B1FF}
.pill-g{background:rgba(245,166,35,.1);border:1px solid rgba(245,166,35,.25);color:#FFD166}
.pill-e{background:rgba(6,214,160,.08);border:1px solid rgba(6,214,160,.22);color:#06D6A0}

/* ── TOAST MESSAGES ── */
.sub-toast{
  display:flex;align-items:flex-start;gap:.75rem;
  padding:1rem 1.2rem;border-radius:14px;
  font-size:.875rem;line-height:1.55;
  animation:subUp .4s both;
}
.sub-toast.success{background:rgba(6,214,160,.08);border:1px solid rgba(6,214,160,.25);color:#6EE7B7}
.sub-toast.error{background:rgba(255,80,80,.08);border:1px solid rgba(255,80,80,.22);color:#FF8080}
.sub-toast-icon{flex-shrink:0;margin-top:1px}

/* ── PRICING GRID ── */
.sub-pricing{
  display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem;
  animation:subUp .5s .06s both;
}

/* ── PLAN CARD ── */
.sub-plan{
  background:rgba(255,255,255,.03);
  border:1px solid rgba(255,255,255,.07);
  border-radius:20px;padding:2rem 1.75rem;
  display:flex;flex-direction:column;gap:1.4rem;
  position:relative;overflow:hidden;
  transition:all .3s cubic-bezier(.25,.46,.45,.94);
}
.sub-plan::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:var(--pc,rgba(123,92,245,.5));
  opacity:0;transition:opacity .3s;
}
.sub-plan:hover::before{opacity:1}
.sub-plan:hover{border-color:var(--ph,rgba(123,92,245,.3));transform:translateY(-4px);box-shadow:0 20px 50px rgba(0,0,0,.3)}

/* HOT card */
.sub-plan.hot{
  border-color:rgba(245,166,35,.35);
  background:linear-gradient(155deg,rgba(245,166,35,.05),rgba(255,255,255,.03));
  --pc:rgba(245,166,35,.8);--ph:rgba(245,166,35,.5);
}
.sub-plan.hot:hover{box-shadow:0 20px 50px rgba(245,166,35,.1),0 0 0 1px rgba(245,166,35,.25)}
.sub-plan.hot::before{opacity:1}

/* FREE card */
.sub-plan.free{--pc:rgba(157,125,255,.5);--ph:rgba(157,125,255,.28)}

/* YEARLY card — default */
.sub-plan.yearly{--pc:rgba(245,166,35,.7);--ph:rgba(245,166,35,.35)}

/* hot badge */
.sub-hot-badge{
  position:absolute;top:1.1rem;right:1.1rem;
  padding:.2rem .6rem;border-radius:100px;
  background:linear-gradient(135deg,#F5A623,#FFD166);
  color:#0A0A14;font-size:.62rem;font-weight:800;
  letter-spacing:.06em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;
}

.sub-plan-top{display:flex;align-items:center;gap:.75rem}
.sub-plan-ico{
  width:44px;height:44px;border-radius:12px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  transition:transform .3s cubic-bezier(.34,1.56,.64,1);
}
.sub-plan:hover .sub-plan-ico{transform:scale(1.1) rotate(-6deg)}
.ico-v{background:rgba(123,92,245,.12);border:1px solid rgba(123,92,245,.22);color:#C4B1FF}
.ico-g{background:rgba(245,166,35,.1);border:1px solid rgba(245,166,35,.2);color:#FFD166}
.ico-e{background:rgba(6,214,160,.08);border:1px solid rgba(6,214,160,.2);color:#6EE7B7}

.sub-plan-name{font-family:'Outfit',sans-serif;font-size:1rem;font-weight:700;letter-spacing:-.3px;color:#F0EFF8}
.sub-plan-desc{font-size:.76rem;color:#8B8AA8;margin-top:.15rem}

/* price */
.sub-price-row{display:flex;flex-direction:column;gap:.2rem}
.sub-price{font-family:'Outfit',sans-serif;font-size:2.6rem;font-weight:800;letter-spacing:-2px;line-height:1;color:#F0EFF8}
.sub-price-per{font-size:.82rem;color:#8B8AA8;font-weight:400;letter-spacing:0;margin-left:.2rem}
.sub-price-save{
  display:inline-flex;align-items:center;gap:.3rem;
  font-size:.68rem;font-family:'JetBrains Mono',monospace;
  padding:.15rem .5rem;border-radius:100px;margin-top:.3rem;width:fit-content;
  background:rgba(6,214,160,.1);border:1px solid rgba(6,214,160,.2);color:#06D6A0;
}

/* divider */
.sub-div{height:1px;background:rgba(255,255,255,.06)}

/* feature list */
.sub-feats{display:flex;flex-direction:column;gap:.6rem}
.sub-feat{display:flex;align-items:flex-start;gap:.6rem;font-size:.84rem;color:#8B8AA8}
.sub-feat.bright{color:#F0EFF8}
.sub-feat-check{
  width:18px;height:18px;border-radius:50%;flex-shrink:0;margin-top:1px;
  display:flex;align-items:center;justify-content:center;
}
.ck-v{background:rgba(123,92,245,.12);border:1px solid rgba(123,92,245,.22);color:#C4B1FF}
.ck-g{background:rgba(245,166,35,.12);border:1px solid rgba(245,166,35,.2);color:#FFD166}

/* CTA buttons */
.sub-cta-free{
  padding:.75rem 1rem;border-radius:12px;
  border:1px solid rgba(123,92,245,.3);background:rgba(123,92,245,.06);
  cursor:pointer;color:#F0EFF8;
  font-family:'Outfit',sans-serif;font-size:.9rem;font-weight:700;
  text-decoration:none;display:flex;align-items:center;justify-content:center;gap:.45rem;
  transition:all .22s cubic-bezier(.34,1.56,.64,1);margin-top:auto;
}
.sub-cta-free:hover{border-color:rgba(123,92,245,.6);background:rgba(123,92,245,.14);transform:translateY(-1px)}
.sub-cta-free:disabled{opacity:.5;cursor:not-allowed;transform:none}

.sub-cta-monthly{
  padding:.75rem 1rem;border-radius:12px;
  background:linear-gradient(135deg,#7B5CF5,#5B3CC5);
  border:none;cursor:pointer;color:#fff;
  font-family:'Outfit',sans-serif;font-size:.9rem;font-weight:700;
  text-decoration:none;display:flex;align-items:center;justify-content:center;gap:.45rem;
  box-shadow:0 0 0 1px rgba(123,92,245,.4),0 5px 18px rgba(123,92,245,.28);
  transition:all .22s cubic-bezier(.34,1.56,.64,1);margin-top:auto;
}
.sub-cta-monthly:hover{transform:translateY(-2px);box-shadow:0 0 0 1px rgba(123,92,245,.6),0 10px 30px rgba(123,92,245,.42)}
.sub-cta-monthly:disabled{opacity:.55;cursor:not-allowed;transform:none}

.sub-cta-gold{
  padding:.75rem 1rem;border-radius:12px;
  background:linear-gradient(135deg,#F5A623,#E08C0A);
  border:none;cursor:pointer;color:#0A0A14;
  font-family:'Outfit',sans-serif;font-size:.9rem;font-weight:700;
  text-decoration:none;display:flex;align-items:center;justify-content:center;gap:.45rem;
  box-shadow:0 0 0 1px rgba(245,166,35,.4),0 5px 18px rgba(245,166,35,.28);
  transition:all .22s cubic-bezier(.34,1.56,.64,1);margin-top:auto;
}
.sub-cta-gold:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 0 0 1px rgba(245,166,35,.6),0 10px 28px rgba(245,166,35,.4)}
.sub-cta-gold:disabled{opacity:.55;cursor:not-allowed;transform:none}

.sub-cta-active{
  padding:.75rem 1rem;border-radius:12px;
  border:1px solid rgba(6,214,160,.3);background:rgba(6,214,160,.07);
  color:#06D6A0;font-family:'Outfit',sans-serif;font-size:.9rem;font-weight:700;
  display:flex;align-items:center;justify-content:center;gap:.45rem;
  cursor:default;margin-top:auto;
}

/* mock demo button */
.sub-mock{
  padding:.6rem 1rem;border-radius:10px;
  border:1px solid rgba(123,92,245,.22);background:rgba(123,92,245,.05);
  cursor:pointer;color:#9D7DFF;
  font-family:'Outfit',sans-serif;font-size:.8rem;font-weight:600;
  display:flex;align-items:center;justify-content:center;gap:.4rem;
  transition:all .2s;
}
.sub-mock:hover{border-color:rgba(123,92,245,.45);background:rgba(123,92,245,.1)}
.sub-mock:disabled{opacity:.5;cursor:not-allowed}

/* spinner */
.sub-spin{width:14px;height:14px;border-radius:50%;border:2px solid rgba(255,255,255,.25);border-top-color:currentColor;animation:spin .7s linear infinite;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── 2-COL INFO GRID ── */
.sub-info-grid{
  display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;
  animation:subUp .5s .1s both;
}
.sub-info-card{
  background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);
  border-radius:18px;padding:1.6rem;
  display:flex;flex-direction:column;gap:1.1rem;
  transition:all .3s cubic-bezier(.25,.46,.45,.94);
}
.sub-info-card:hover{border-color:rgba(123,92,245,.2);box-shadow:0 16px 40px rgba(0,0,0,.2)}
.sub-info-hdr{display:flex;align-items:center;gap:.75rem}
.sub-info-ico{
  width:40px;height:40px;border-radius:11px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
}
.sub-info-title{font-family:'Outfit',sans-serif;font-size:1rem;font-weight:700;letter-spacing:-.3px}
.sub-info-desc{font-size:.82rem;color:#8B8AA8;margin-top:.15rem}
.sub-info-list{display:flex;flex-direction:column;gap:.65rem;list-style:none;padding:0}
.sub-info-list li{display:flex;align-items:flex-start;gap:.6rem;font-size:.84rem;color:#8B8AA8}
.sub-info-list li .li-ico{flex-shrink:0;margin-top:2px;color:#9D7DFF}
.sub-info-list.steps{counter-reset:steps}
.sub-info-list.steps li{counter-increment:steps;position:relative}
.sub-step-num{
  width:22px;height:22px;border-radius:50%;flex-shrink:0;
  background:rgba(123,92,245,.12);border:1px solid rgba(123,92,245,.22);
  color:#C4B1FF;font-family:'JetBrains Mono',monospace;font-size:.65rem;font-weight:700;
  display:flex;align-items:center;justify-content:center;margin-top:1px;
}

/* ── COMPARISON TABLE ── */
.sub-compare{
  background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);
  border-radius:18px;overflow:hidden;
  animation:subUp .5s .14s both;
}
.sub-compare-hdr{
  padding:1.2rem 1.6rem;
  border-bottom:1px solid rgba(255,255,255,.06);
  display:flex;align-items:center;gap:.65rem;
  background:rgba(255,255,255,.02);
}
.sub-compare-title{font-family:'Outfit',sans-serif;font-size:1rem;font-weight:700}
.sub-tbl{width:100%;border-collapse:collapse}
.sub-tbl th{
  padding:.8rem 1.4rem;text-align:left;
  font-family:'JetBrains Mono',monospace;font-size:.68rem;font-weight:600;
  color:#3D3C56;text-transform:uppercase;letter-spacing:.08em;
  border-bottom:1px solid rgba(255,255,255,.06);
}
.sub-tbl th:not(:first-child){text-align:center}
.sub-tbl td{
  padding:.85rem 1.4rem;font-size:.84rem;color:#8B8AA8;
  border-bottom:1px solid rgba(255,255,255,.04);
  transition:background .2s;
}
.sub-tbl tr:last-child td{border-bottom:none}
.sub-tbl tr:hover td{background:rgba(255,255,255,.02)}
.sub-tbl td:first-child{color:#F0EFF8;font-weight:500}
.sub-tbl td:not(:first-child){text-align:center}
.tbl-yes{color:#06D6A0}
.tbl-no{color:#3D3C56}
.tbl-par{color:#F5A623}

/* ── ANIMATIONS ── */
@keyframes subUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}

/* ── RESPONSIVE ── */
@media(max-width:960px){
  .sub-pricing{grid-template-columns:1fr}
  .sub-info-grid{grid-template-columns:1fr}
  .sub-plan.hot{order:-1}
}
@media(max-width:640px){
  .sub-wrap{padding:1.25rem 1.25rem 3rem}
  .sub-hdr{flex-direction:column}
  .sub-plan-pills{align-items:flex-start}
  .sub-title{font-size:1.6rem}
  .sub-tbl th,.sub-tbl td{padding:.7rem .85rem;font-size:.75rem}
}
`;

const FREE_FEATS  = ['Module 1 unlocked','AI Pitch Coach chat (basic)','Startup profile page','Basic PDF export'];
const MON_FEATS   = ['All 30 modules unlocked','AI Pitch Coach + full reports','PDF & Word exports','Regional frameworks','Email support'];
const YEAR_FEATS  = ['All 30 modules unlocked','AI Pitch Coach + full reports','PDF & Word exports','Regional frameworks','Priority support','VC network listing'];

const COMPARE_ROWS = [
  ['Modules unlocked',     'Module 1 only', 'All 30', 'All 30'],
  ['Pitch Coach access',   'Basic chat',    'Full + reports', 'Full + reports'],
  ['PDF exports',          '✓',             '✓',       '✓'],
  ['Word exports',         '—',             '✓',       '✓'],
  ['Regional frameworks',  '—',             '✓',       '✓'],
  ['VC network listing',   '—',             '—',       '✓'],
  ['Support',              'Community',     'Email',   'Priority'],
];

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const Subscription = () => {
  const { user, token, upgradePlanMock } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();

  const [loading,      setLoading]      = useState(false);
  const [loadingPlan,  setLoadingPlan]  = useState(''); // 'monthly' | 'yearly'
  const [statusMsg,    setStatusMsg]    = useState('');
  const [errorMsg,     setErrorMsg]     = useState('');
  const [showMock,     setShowMock]     = useState(false);

  const canvasRef = useRef(null);
  const bgRef     = useRef(null);

  /* handle redirect params */
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    if (p.get('success') === 'true') {
      setStatusMsg('Your payment was successful — account upgraded to Premium!');
      navigate('/subscription', { replace: true });
    } else if (p.get('canceled') === 'true') {
      setErrorMsg('Checkout cancelled. Take your time and try again when ready.');
      navigate('/subscription', { replace: true });
    }
    if (p.get('mock_checkout') === 'true') setShowMock(true);
  }, [location.search, navigate]);

  /* fonts + CSS */
  useEffect(() => {
    injectFonts();
    let el = document.getElementById('sub-css');
    if (!el) { el=document.createElement('style'); el.id='sub-css'; document.head.appendChild(el); }
    el.textContent = CSS;
  }, []);

  /* particles */
  useEffect(() => {
    if (!canvasRef.current) return;
    bgRef.current = createBg(canvasRef.current);
    return () => bgRef.current?.();
  }, []);

  const handleUpgrade = async (plan) => {
    setLoading(true);
    setLoadingPlan(plan);
    setStatusMsg(''); setErrorMsg('');
    try {
      const res = await fetch(`${API_URL}/payments/create-checkout`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({ plan })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to start checkout');
      if (data.mock) {
        setShowMock(true);
        setStatusMsg('Stripe not configured for demo. Use the mock upgrade below.');
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch(err) {
      setErrorMsg(err.message || 'Unable to start checkout. Try the mock upgrade.');
    } finally {
      setLoading(false); setLoadingPlan('');
    }
  };

  const handleMock = async () => {
    setLoading(true);
    setStatusMsg(''); setErrorMsg('');
    try {
      await upgradePlanMock();
      setStatusMsg('Demo upgrade complete! All modules are now unlocked.');
      setShowMock(false);
    } catch(err) {
      setErrorMsg(err.message || 'Mock upgrade failed.');
    } finally { setLoading(false); }
  };

  const isPremium = user?.plan === 'premium';

  const FeatCheck = ({ ck='ck-v' }) => (
    <div className={`sub-feat-check ${ck}`}>{Ic.Check(9)}</div>
  );

  return (
    <div className="sub-page">
      <canvas id="sub-canvas" ref={canvasRef}/>
      <div className="sub-noise"/>

      <div className="sub-wrap">

        {/* ── HEADER ── */}
        <div className="sub-hdr">
          <div>
            <h1 className="sub-title">Premium Startup Access</h1>
            <p className="sub-sub">
              Unlock all 30 curriculum modules, AI-powered Pitch Coach full reports, and investor-ready document exports — at India-first pricing.
            </p>
          </div>
          <div className="sub-plan-pills">
            <span className="sub-pill pill-v">{Ic.Star(10)} Current plan: {isPremium ? 'Premium' : 'Free'}</span>
            {isPremium
              ? <span className="sub-pill pill-e">{Ic.Unlock(10)} All tracks unlocked</span>
              : <span className="sub-pill pill-g">{Ic.Zap(10)} Upgrade for full access</span>
            }
          </div>
        </div>

        {/* ── TOASTS ── */}
        {statusMsg && (
          <div className="sub-toast success">
            <span className="sub-toast-icon">{Ic.CheckC(16)}</span>
            {statusMsg}
          </div>
        )}
        {errorMsg && (
          <div className="sub-toast error">
            <span className="sub-toast-icon">{Ic.Alert(16)}</span>
            {errorMsg}
          </div>
        )}

        {/* ── PRICING CARDS ── */}
        <div className="sub-pricing">

          {/* FREE */}
          <div className="sub-plan free">
            <div className="sub-plan-top">
              <div className="sub-plan-ico ico-v">{Ic.Book(18)}</div>
              <div>
                <div className="sub-plan-name">Starter</div>
                <div className="sub-plan-desc">Explore before you commit.</div>
              </div>
            </div>
            <div className="sub-price-row">
              <span>
                <span className="sub-price">Free</span>
                <span className="sub-price-per">/ forever</span>
              </span>
            </div>
            <div className="sub-div"/>
            <div className="sub-feats">
              {FREE_FEATS.map(f=>(
                <div className="sub-feat" key={f}><FeatCheck/>{f}</div>
              ))}
            </div>
            {isPremium
              ? <div className="sub-cta-active">{Ic.CheckC(14)} Your starting plan</div>
              : <Link to="/dashboard" className="sub-cta-free">Go to Dashboard {Ic.Arrow(13)}</Link>
            }
          </div>

          {/* MONTHLY */}
          <div className="sub-plan">
            <div className="sub-plan-top">
              <div className="sub-plan-ico ico-v">{Ic.Sparkle(18)}</div>
              <div>
                <div className="sub-plan-name">Premium Monthly</div>
                <div className="sub-plan-desc">Focused learning, cancel anytime.</div>
              </div>
            </div>
            <div className="sub-price-row">
              <span>
                <span className="sub-price">₹399</span>
                <span className="sub-price-per">/ month</span>
              </span>
            </div>
            <div className="sub-div"/>
            <div className="sub-feats">
              {MON_FEATS.map(f=>(
                <div className="sub-feat bright" key={f}><FeatCheck/>{f}</div>
              ))}
            </div>
            {isPremium
              ? <div className="sub-cta-active">{Ic.CheckC(14)} Premium Active</div>
              : (
                <button
                  className="sub-cta-monthly"
                  onClick={()=>handleUpgrade('monthly')}
                  disabled={loading}
                >
                  {loadingPlan==='monthly'
                    ? <><div className="sub-spin"/>Starting checkout...</>
                    : <>Subscribe {Ic.Arrow(13)}</>
                  }
                </button>
              )
            }
          </div>

          {/* YEARLY — HOT */}
          <div className="sub-plan hot yearly">
            <div className="sub-hot-badge">{Ic.Star(9)} Best value</div>
            <div className="sub-plan-top">
              <div className="sub-plan-ico ico-g">{Ic.Award(18)}</div>
              <div>
                <div className="sub-plan-name">Premium Yearly</div>
                <div className="sub-plan-desc">Maximum value — save 48%.</div>
              </div>
            </div>
            <div className="sub-price-row">
              <span>
                <span className="sub-price">₹2,499</span>
                <span className="sub-price-per">/ year</span>
              </span>
              <span className="sub-price-save">{Ic.Zap(9)} Save ₹2,289 vs monthly</span>
            </div>
            <div className="sub-div"/>
            <div className="sub-feats">
              {YEAR_FEATS.map(f=>(
                <div className="sub-feat bright" key={f}><FeatCheck ck="ck-g"/>{f}</div>
              ))}
            </div>
            {isPremium
              ? <div className="sub-cta-active">{Ic.CheckC(14)} Premium Active</div>
              : (
                <button
                  className="sub-cta-gold"
                  onClick={()=>handleUpgrade('yearly')}
                  disabled={loading}
                >
                  {loadingPlan==='yearly'
                    ? <><div className="sub-spin" style={{borderTopColor:'#0A0A14'}}/>Starting checkout...</>
                    : <>Get full access {Ic.Arrow(13)}</>
                  }
                </button>
              )
            }

            {/* Mock demo button */}
            {showMock && !isPremium && (
              <button className="sub-mock" onClick={handleMock} disabled={loading}>
                {loading ? <><div className="sub-spin"/>Upgrading...</> : <>{Ic.Refresh(13)} Use demo mock upgrade</>}
              </button>
            )}
          </div>
        </div>

        {/* ── INFO CARDS ── */}
        <div className="sub-info-grid">

          {/* Why Premium */}
          <div className="sub-info-card">
            <div className="sub-info-hdr">
              <div className="sub-info-ico ico-v">{Ic.Sparkle(18)}</div>
              <div>
                <div className="sub-info-title">Why upgrade?</div>
                <div className="sub-info-desc">Everything you need to go from idea to funded.</div>
              </div>
            </div>
            <ul className="sub-info-list">
              {[
                ['Unlock premium tracks for Finance, Operations, Marketing, and Fundraising.', Ic.Unlock],
                ['Generate investor-ready pitch reports with full AI scoring breakdowns.', Ic.FileT],
                ['Download Word and PDF briefs ready to share with VCs and mentors.', Ic.FileT],
                ['India-tailored curriculum, pricing, and regional market guidance.', Ic.Globe],
                ['Get listed with our VC network automatically when you complete all tracks.', Ic.Rocket],
              ].map(([txt, IcoFn], i) => (
                <li key={i}>
                  <span className="li-ico">{IcoFn(13)}</span>
                  {txt}
                </li>
              ))}
            </ul>
          </div>

          {/* How it works */}
          <div className="sub-info-card">
            <div className="sub-info-hdr">
              <div className="sub-info-ico ico-g">{Ic.Info(18)}</div>
              <div>
                <div className="sub-info-title">How it works</div>
                <div className="sub-info-desc">Three steps from free to fully funded.</div>
              </div>
            </div>
            <ul className="sub-info-list steps">
              {[
                ['Choose monthly or yearly and checkout securely via Stripe.', 'or use the demo mock upgrade for local testing.'],
                ['Return here — all 30 modules, exports, and Pitch Coach reports unlock instantly.', ''],
                ['Complete all tracks, download your brief, and get listed with our VC network.', ''],
              ].map(([main, note], i) => (
                <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:'.6rem' }}>
                  <span className="sub-step-num">{i+1}</span>
                  <span>{main}{note && <em style={{ display:'block', fontSize:'.76rem', color:'#3D3C56', marginTop:'.15rem' }}>{note}</em>}</span>
                </li>
              ))}
            </ul>

            {/* Plan comparison inline */}
            <div style={{ display:'flex', gap:'.85rem', flexWrap:'wrap', marginTop:'.5rem' }}>
              {[
                ['30 Modules', 'ico-v'],
                ['5 Tracks',   'ico-v'],
                ['Word + PDF', 'ico-g'],
                ['AI Coach',   'ico-v'],
              ].map(([lbl, cls]) => (
                <div key={lbl} style={{
                  display:'flex', alignItems:'center', gap:'.4rem',
                  padding:'.35rem .75rem', borderRadius:'100px',
                  background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.08)',
                  fontSize:'.72rem', fontFamily:"'JetBrains Mono',monospace", color:'#8B8AA8'
                }}>
                  <span style={{ color: cls==='ico-g'?'#FFD166':'#9D7DFF' }}>{Ic.Check(10)}</span>
                  {lbl}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── COMPARISON TABLE ── */}
        <div className="sub-compare">
          <div className="sub-compare-hdr">
            {Ic.BarC && null /* placeholder */}
            <span style={{ color:'#9D7DFF' }}>{Ic.Zap(15)}</span>
            <span className="sub-compare-title">Plan Comparison</span>
            {!isPremium && (
              <span className="sub-pill pill-g" style={{ marginLeft:'auto' }}>
                {Ic.Star(9)} Best value = Yearly
              </span>
            )}
          </div>
          <table className="sub-tbl">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Free</th>
                <th>Monthly</th>
                <th>Yearly</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map(([feat, free, mon, yr]) => (
                <tr key={feat}>
                  <td>{feat}</td>
                  {[free, mon, yr].map((v, i) => (
                    <td key={i}>
                      {v==='✓'  ? <span className="tbl-yes">{Ic.CheckC(14)}</span>
                      : v==='—' ? <span className="tbl-no">—</span>
                      : <span className={i===0?'tbl-par':'tbl-yes'}>{v}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Subscription;