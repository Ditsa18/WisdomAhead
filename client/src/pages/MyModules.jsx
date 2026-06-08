import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import * as THREE from 'three';

/*
  MindLaunch — MyModules v2
  - No own sidebar (works inside existing layout)
  - Matches Dashboard v3 + LandingPage v4 theme
  - Place at: src/pages/MyModules.jsx
*/

/* ── Font injection ── */
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
   SVG ICONS
══════════════════════════════════════════════════════════════ */
const Svg = ({ d, size=16, fill="none", sw=2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p,i)=><path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);
const Ic = {
  Lock:    s=><Svg size={s} d={["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z","M7 11V7a5 5 0 0 1 10 0v4"]}/>,
  CheckC:  s=><Svg size={s} d={["M22 11.08V12a10 10 0 1 1-5.93-9.14","M22 4L12 14.01l-3-3"]}/>,
  ChevR:   s=><Svg size={s} d="M9 18l6-6-6-6"/>,
  Sparkle: s=><Svg size={s} fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>,
  Zap:     s=><Svg size={s} fill="currentColor" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>,
  Clock:   s=><Svg size={s} d={["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M12 6v6l4 2"]}/>,
  FileT:   s=><Svg size={s} d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"]}/>,
  Book:    s=><Svg size={s} d={["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z","M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]}/>,
  Layers:  s=><Svg size={s} d={["M12 2L2 7l10 5 10-5-10-5z","M2 17l10 5 10-5","M2 12l10 5 10-5"]}/>,
  Dollar:  s=><Svg size={s} d={["M12 1v22","M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"]}/>,
  Target:  s=><Svg size={s} d={["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z","M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"]}/>,
  Rocket:  s=><Svg size={s} d={["M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z","M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"]}/>,
  Meg:     s=><Svg size={s} d={["M3 11l19-9-9 19-2-8-8-2z"]}/>,
  Check:   s=><Svg size={s} d="M20 6L9 17l-5-5"/>,
  Arrow:   s=><Svg size={s} d={["M5 12h14","M12 5l7 7-7 7"]}/>,
  Filter:  s=><Svg size={s} d="M22 3H2l8 9.46V19l4 2v-8.54z"/>,
  Search:  s=><Svg size={s} d={["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z","M21 21l-4.35-4.35"]}/>,
  BarC:    s=><Svg size={s} d={["M18 20V10","M12 20V4","M6 20v-6"]}/>,
};

/* ── Track config ── */
const TRACKS = [
  { num:1, name:'Foundations',  desc:'Validate customer discovery and problem-solution fit.',              Icon:s=>Ic.Layers(s),  cls:'ti-v', color:'#9D7DFF', bdr:'rgba(123,92,245,.3)',  bg:'rgba(123,92,245,.08)' },
  { num:2, name:'Finance',      desc:'Build unit economics and multi-year projection models.',             Icon:s=>Ic.Dollar(s),  cls:'ti-g', color:'#FFD166', bdr:'rgba(245,166,35,.3)',  bg:'rgba(245,166,35,.08)' },
  { num:3, name:'Operations',   desc:'Structure legal setup, MVP roadmap, and KPI frameworks.',           Icon:s=>Ic.Target(s),  cls:'ti-e', color:'#6EE7B7', bdr:'rgba(6,214,160,.3)',   bg:'rgba(6,214,160,.07)'  },
  { num:4, name:'Marketing',    desc:'Acquisition channels, brand identity, and social growth.',          Icon:s=>Ic.Meg(s),     cls:'ti-r', color:'#FFB3CE', bdr:'rgba(255,107,157,.3)', bg:'rgba(255,107,157,.07)'},
  { num:5, name:'Fundraising',  desc:'Pitch decks, SAFE term sheets, and closing investor rounds.',       Icon:s=>Ic.Rocket(s),  cls:'ti-v', color:'#C4B1FF', bdr:'rgba(123,92,245,.3)',  bg:'rgba(123,92,245,.08)' },
];

/* ══════════════════════════════════════════════════════════════
   CSS
══════════════════════════════════════════════════════════════ */
const CSS = `
.mm-page *,.mm-page *::before,.mm-page *::after{box-sizing:border-box}
.mm-page{
  font-family:'Plus Jakarta Sans',sans-serif;
  color:#F0EFF8;
  min-height:100vh;
  position:relative;
}
#mm-canvas{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none}
.mm-noise{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.022;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

.mm-wrap{position:relative;z-index:2;padding:1.75rem 2rem 4rem;max-width:1400px;display:flex;flex-direction:column;gap:2rem}

/* ── PAGE HEADER ── */
.mm-hdr{animation:mmUp .5s both}
.mm-hdr-inner{display:flex;align-items:flex-end;justify-content:space-between;gap:1.5rem;flex-wrap:wrap}
.mm-title{
  font-family:'Outfit',sans-serif;
  font-size:2rem;font-weight:800;letter-spacing:-1.5px;line-height:1.1;margin-bottom:.4rem;
  background:linear-gradient(135deg,#F0EFF8,#C4B1FF);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.mm-sub{font-size:.9rem;color:#8B8AA8;line-height:1.6}
.mm-hdr-right{display:flex;align-items:center;gap:.65rem;flex-shrink:0;flex-wrap:wrap}

/* search */
.mm-search{
  position:relative;display:flex;align-items:center;
}
.mm-search-icon{position:absolute;left:.8rem;color:#3D3C56;pointer-events:none}
.mm-search input{
  padding:.55rem .9rem .55rem 2.3rem;
  border-radius:10px;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.09);
  color:#F0EFF8;font-family:'Plus Jakarta Sans',sans-serif;font-size:.82rem;
  outline:none;width:200px;transition:all .25s;
}
.mm-search input::placeholder{color:#3D3C56}
.mm-search input:focus{
  border-color:rgba(123,92,245,.45);background:rgba(123,92,245,.06);
  box-shadow:0 0 0 3px rgba(123,92,245,.12);width:240px;
}

/* overall progress pill */
.mm-overall{
  display:flex;align-items:center;gap:.65rem;
  padding:.5rem 1rem;border-radius:10px;
  background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);
}
.mm-overall-num{font-family:'Outfit',sans-serif;font-size:.9rem;font-weight:800;color:#9D7DFF}
.mm-overall-bar{width:90px;height:5px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden}
.mm-overall-fill{height:100%;background:linear-gradient(90deg,#7B5CF5,#9D7DFF,#06D6A0);border-radius:3px;transition:width 1.2s cubic-bezier(.25,.46,.45,.94)}
.mm-overall-lbl{font-size:.72rem;color:#8B8AA8;font-family:'JetBrains Mono',monospace;white-space:nowrap}

/* ── TRACK SECTION ── */
.mm-track{
  display:flex;flex-direction:column;gap:1.2rem;
  animation:mmUp .5s both;
}
.mm-track-hdr{
  display:flex;align-items:center;justify-content:space-between;
  gap:1rem;flex-wrap:wrap;
  padding:1.2rem 1.5rem;
  border-radius:16px;
  border:1px solid var(--tc-bdr);
  background:var(--tc-bg);
  position:relative;overflow:hidden;
  transition:all .3s cubic-bezier(.25,.46,.45,.94);
}
.mm-track-hdr::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--tc-color) 50%,transparent);
  opacity:.4;
}
.mm-track-left{display:flex;align-items:center;gap:1rem}
.mm-track-ico{
  width:46px;height:46px;border-radius:13px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  background:rgba(255,255,255,.05);border:1px solid var(--tc-bdr);
  color:var(--tc-color);
  transition:transform .3s cubic-bezier(.34,1.56,.64,1);
}
.mm-track-hdr:hover .mm-track-ico{transform:scale(1.1) rotate(-5deg)}
.mm-track-name{font-family:'Outfit',sans-serif;font-size:1.1rem;font-weight:800;letter-spacing:-.4px;color:#F0EFF8}
.mm-track-desc{font-size:.8rem;color:#8B8AA8;margin-top:.2rem;line-height:1.5}
.mm-track-right{display:flex;align-items:center;gap:.75rem;flex-wrap:wrap}
.mm-track-prog{
  display:flex;align-items:center;gap:.5rem;
  font-family:'JetBrains Mono',monospace;font-size:.7rem;color:#8B8AA8;
}
.mm-track-pbar{width:60px;height:4px;background:rgba(255,255,255,.07);border-radius:2px;overflow:hidden}
.mm-track-pfill{height:100%;border-radius:2px;transition:width 1.2s cubic-bezier(.25,.46,.45,.94);background:var(--tc-color)}
.mm-track-badge{
  display:inline-flex;align-items:center;gap:.3rem;
  padding:.24rem .65rem;border-radius:100px;
  font-size:.65rem;font-weight:700;font-family:'JetBrains Mono',monospace;
  letter-spacing:.04em;text-transform:uppercase;
}
.tb-lock{background:rgba(245,166,35,.08);border:1px solid rgba(245,166,35,.18);color:#F5A623}
.tb-open{background:rgba(123,92,245,.1);border:1px solid rgba(123,92,245,.2);color:#C4B1FF}
.tb-done{background:rgba(6,214,160,.08);border:1px solid rgba(6,214,160,.2);color:#06D6A0}

/* ── MODULE GRID ── */
.mm-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
  gap:1rem;
}

/* ── MODULE CARD ── */
.mm-mod{
  background:rgba(255,255,255,.03);
  border:1px solid rgba(255,255,255,.06);
  border-radius:16px;
  padding:1.25rem;
  display:flex;flex-direction:column;gap:.9rem;
  position:relative;overflow:hidden;
  transition:all .32s cubic-bezier(.25,.46,.45,.94);
}
.mm-mod::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  transform:scaleX(0);transform-origin:left;transition:transform .4s cubic-bezier(.25,.46,.45,.94);
  border-radius:2px;
}
.mm-mod.done::before{background:linear-gradient(90deg,#06D6A0,#6EE7B7);transform:scaleX(1)}
.mm-mod.open:hover::before{background:linear-gradient(90deg,#7B5CF5,#9D7DFF);transform:scaleX(1)}
.mm-mod.done{border-color:rgba(6,214,160,.22)}
.mm-mod.open{border-color:rgba(123,92,245,.18)}
.mm-mod.locked{opacity:.62}
.mm-mod:hover{transform:translateY(-4px);box-shadow:0 18px 40px rgba(0,0,0,.3)}
.mm-mod.done:hover{border-color:rgba(6,214,160,.35);box-shadow:0 18px 40px rgba(6,214,160,.08),0 0 0 1px rgba(6,214,160,.16)}
.mm-mod.open:hover{border-color:rgba(123,92,245,.32);box-shadow:0 18px 40px rgba(123,92,245,.1),0 0 0 1px rgba(123,92,245,.16)}

/* card top row */
.mm-mod-top{display:flex;align-items:center;justify-content:space-between}
.mm-mod-num{font-family:'JetBrains Mono',monospace;font-size:.6rem;color:#3D3C56;text-transform:uppercase;letter-spacing:.09em}
.mm-mod-status{
  display:inline-flex;align-items:center;gap:.25rem;
  padding:.18rem .55rem;border-radius:100px;
  font-size:.63rem;font-weight:600;font-family:'JetBrains Mono',monospace;
}
.ms-done{background:rgba(6,214,160,.1);border:1px solid rgba(6,214,160,.2);color:#06D6A0}
.ms-open{background:rgba(123,92,245,.1);border:1px solid rgba(123,92,245,.2);color:#C4B1FF}
.ms-lock{background:rgba(245,166,35,.07);border:1px solid rgba(245,166,35,.15);color:#F5A623}

/* card body */
.mm-mod-body{display:flex;align-items:flex-start;gap:.75rem}
.mm-mod-ico{
  width:40px;height:40px;border-radius:10px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  transition:transform .28s cubic-bezier(.34,1.56,.64,1);
}
.mm-mod:hover .mm-mod-ico{transform:scale(1.1) rotate(-6deg)}
.mi-v{background:rgba(123,92,245,.1);border:1px solid rgba(123,92,245,.2);color:#C4B1FF}
.mi-g{background:rgba(245,166,35,.08);border:1px solid rgba(245,166,35,.18);color:#FFD166}
.mi-e{background:rgba(6,214,160,.07);border:1px solid rgba(6,214,160,.18);color:#6EE7B7}
.mi-r{background:rgba(255,107,157,.07);border:1px solid rgba(255,107,157,.18);color:#FF6B9D}
.mm-mod-info{}
.mm-mod-title{font-family:'Outfit',sans-serif;font-size:.95rem;font-weight:700;letter-spacing:-.2px;margin-bottom:.25rem;color:#F0EFF8}
.mm-mod.locked .mm-mod-title{color:#8B8AA8}
.mm-mod-desc{font-size:.77rem;color:#8B8AA8;line-height:1.52}

/* price badge inside card */
.mm-price{
  position:absolute;top:.9rem;right:.9rem;
  padding:.14rem .45rem;border-radius:6px;
  background:rgba(245,166,35,.1);border:1px solid rgba(245,166,35,.2);
  color:#F5A623;font-size:.62rem;font-weight:700;font-family:'JetBrains Mono',monospace;
}

/* card footer */
.mm-mod-foot{
  padding-top:.85rem;border-top:1px solid rgba(255,255,255,.06);
  display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;
}
.mm-meta{display:flex;align-items:center;gap:.28rem;font-size:.67rem;color:#3D3C56;font-family:'JetBrains Mono',monospace}
.mm-cta{
  margin-left:auto;padding:.42rem .85rem;border-radius:9px;
  font-family:'Outfit',sans-serif;font-size:.75rem;font-weight:700;
  cursor:pointer;text-decoration:none;
  display:inline-flex;align-items:center;gap:.3rem;
  border:none;transition:all .22s cubic-bezier(.34,1.56,.64,1);white-space:nowrap;flex-shrink:0;
}
.cta-pri{background:linear-gradient(135deg,#7B5CF5,#5B3CC5);color:#fff;box-shadow:0 4px 12px rgba(123,92,245,.22)}
.cta-pri:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(123,92,245,.38)}
.cta-done{background:rgba(6,214,160,.1);color:#06D6A0;border:1px solid rgba(6,214,160,.22)}
.cta-done:hover{background:rgba(6,214,160,.18)}
.cta-up{background:linear-gradient(135deg,#F5A623,#E08C0A);color:#0A0A14;box-shadow:0 4px 12px rgba(245,166,35,.18)}
.cta-up:hover{transform:translateY(-2px);box-shadow:0 8px 18px rgba(245,166,35,.32)}
.cta-dis{background:rgba(255,255,255,.03);color:#3D3C56;border:1px solid rgba(255,255,255,.06);cursor:not-allowed}

/* ── UPGRADE STRIP ── */
.mm-upgrade-strip{
  padding:1px;
  background:linear-gradient(135deg,rgba(245,166,35,.5),rgba(255,107,157,.3),rgba(245,166,35,.22));
  border-radius:16px;box-shadow:0 0 40px rgba(245,166,35,.07);
  animation:mmUp .5s .08s both;
}
.mm-upgrade-in{
  background:linear-gradient(135deg,rgba(14,10,26,.97),rgba(10,8,20,.97));
  border-radius:15px;padding:.9rem 1.4rem;
  display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;
}
.mm-upgrade-left{display:flex;align-items:center;gap:.75rem}
.mm-chip{
  padding:.2rem .6rem;border-radius:100px;
  background:linear-gradient(135deg,#F5A623,#FFD166);
  color:#0A0A14;font-size:.62rem;font-weight:800;
  letter-spacing:.07em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;white-space:nowrap;
}
.mm-upgrade-txt{font-size:.86rem;color:#F0EFF8;font-weight:500}
.mm-upgrade-txt span{color:#8B8AA8;font-weight:400}
.mm-upgrade-btn{
  padding:.52rem 1.1rem;border-radius:10px;
  background:linear-gradient(135deg,#F5A623,#E08C0A);border:none;cursor:pointer;color:#0A0A14;
  font-family:'Outfit',sans-serif;font-size:.8rem;font-weight:700;
  text-decoration:none;display:inline-flex;align-items:center;gap:.4rem;
  box-shadow:0 4px 14px rgba(245,166,35,.25);
  transition:all .22s cubic-bezier(.34,1.56,.64,1);white-space:nowrap;
}
.mm-upgrade-btn:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(245,166,35,.4)}

/* ── COACH CTA ── */
.mm-coach{
  padding:1px;
  background:linear-gradient(135deg,rgba(123,92,245,.5),rgba(245,166,35,.28),rgba(123,92,245,.18));
  border-radius:18px;box-shadow:0 0 50px rgba(123,92,245,.07);
  animation:mmUp .5s .12s both;
}
.mm-coach-in{
  background:linear-gradient(135deg,#13102a,#18163a,#16142e);
  border-radius:17px;padding:1.8rem 2.2rem;
  display:flex;align-items:center;justify-content:space-between;gap:2rem;flex-wrap:wrap;
}
.mm-coach-ico{
  width:52px;height:52px;border-radius:14px;flex-shrink:0;
  background:linear-gradient(135deg,rgba(123,92,245,.22),rgba(123,92,245,.1));
  border:1px solid rgba(123,92,245,.28);
  display:flex;align-items:center;justify-content:center;color:#C4B1FF;
  animation:iconPulse 3s ease-in-out infinite;
}
@keyframes iconPulse{0%,100%{box-shadow:0 0 16px rgba(123,92,245,.18)}50%{box-shadow:0 0 28px rgba(123,92,245,.38)}}
.mm-coach-txt h3{font-family:'Outfit',sans-serif;font-size:1.1rem;font-weight:800;letter-spacing:-.4px;margin-bottom:.3rem}
.mm-coach-txt p{font-size:.84rem;color:#8B8AA8;line-height:1.6;max-width:420px}
.mm-coach-acts{display:flex;gap:.7rem;flex-shrink:0;flex-wrap:wrap}
.btn-v{
  padding:.62rem 1.35rem;border-radius:11px;
  background:linear-gradient(135deg,#7B5CF5,#5B3CC5);border:none;cursor:pointer;color:#fff;
  font-family:'Outfit',sans-serif;font-size:.85rem;font-weight:700;
  text-decoration:none;display:inline-flex;align-items:center;gap:.4rem;
  box-shadow:0 0 0 1px rgba(123,92,245,.35),0 5px 16px rgba(123,92,245,.26);
  transition:all .22s cubic-bezier(.34,1.56,.64,1);
}
.btn-v:hover{transform:translateY(-2px);box-shadow:0 0 0 1px rgba(123,92,245,.58),0 10px 26px rgba(123,92,245,.4)}
.btn-ghost{
  padding:.62rem 1.35rem;border-radius:11px;
  border:1px solid rgba(123,92,245,.26);background:rgba(123,92,245,.06);
  cursor:pointer;color:#F0EFF8;
  font-family:'Outfit',sans-serif;font-size:.85rem;font-weight:600;
  text-decoration:none;display:inline-flex;align-items:center;gap:.4rem;
  transition:all .2s;
}
.btn-ghost:hover{border-color:rgba(123,92,245,.55);background:rgba(123,92,245,.12);transform:translateY(-1px)}

/* ── LOADING ── */
.mm-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;gap:1rem}
.mm-spin{width:42px;height:42px;border-radius:50%;border:3px solid rgba(123,92,245,.18);border-top-color:#7B5CF5;animation:spin .75s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.mm-spin-lbl{color:#8B8AA8;font-size:.84rem;font-family:'JetBrains Mono',monospace}

/* ── EMPTY STATE ── */
.mm-empty{
  grid-column:1/-1;text-align:center;
  padding:2.5rem;color:#3D3C56;
  font-family:'JetBrains Mono',monospace;font-size:.8rem;
}

#mm-cursor{
  position:fixed;
  width:8px;
  height:8px;
  border-radius:50%;
  background:#9D7DFF;
  pointer-events:none;
  z-index:99999;
  transform:translate(-50%,-50%);
}

#mm-cursor-ring{
  position:fixed;
  width:34px;
  height:34px;
  border-radius:50%;
  border:1px solid rgba(157,125,255,.45);
  pointer-events:none;
  z-index:99998;
  transform:translate(-50%,-50%);
  transition:width .15s,height .15s;
}
  

/* ── ANIMATIONS ── */
@keyframes mmUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}

/* ── RESPONSIVE ── */
@media(max-width:900px){
  .mm-wrap{padding:1.25rem 1.25rem 3rem}
  .mm-hdr-inner{flex-direction:column;align-items:flex-start}
  .mm-coach-in{flex-direction:column}
  .mm-coach-acts{width:100%}
  .mm-coach-acts .btn-v,.mm-coach-acts .btn-ghost{flex:1;justify-content:center}
  .mm-upgrade-in{flex-direction:column;align-items:flex-start}
  .mm-upgrade-btn{width:100%;justify-content:center}
}
@media(max-width:580px){
  .mm-title{font-size:1.6rem}
  .mm-grid{grid-template-columns:1fr}
  .mm-search input{width:160px}
  .mm-search input:focus{width:190px}
}
`;

/* ── Track progress bar with animation ── */
function TrackBar({ pct, color }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 500); return () => clearTimeout(t); }, [pct]);
  return (
    <div className="mm-track-pbar">
      <div className="mm-track-pfill" style={{ width:`${w}%`, background:color }}/>
    </div>
  );
}

/* ── Overall progress bar ── */
function OverallBar({ pct }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 600); return () => clearTimeout(t); }, [pct]);
  return <div className="mm-overall-bar"><div className="mm-overall-fill" style={{ width:`${w}%` }}/></div>;
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const MyModules = () => {
  const { user, token } = useAuth();
  const [modules,  setModules]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const canvasRef  = useRef(null);
  const bgRef      = useRef(null);
  const cursorRef = useRef(null);
const ringRef = useRef(null);

  /* fetch */
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/modules`, { headers:{ Authorization:`Bearer ${token}` } });
        if (res.ok) setModules(await res.json());
      } catch(e){ console.error(e); }
      finally { setLoading(false); }
    })();
  }, [token]);

  /* CSS + fonts */
  useEffect(() => {
    injectFonts();
    let el = document.getElementById('mm-css');
    if (!el) { el=document.createElement('style'); el.id='mm-css'; document.head.appendChild(el); }
    el.textContent = CSS;
  }, []);

  /* particles */
  useEffect(() => {
    if (!canvasRef.current) return;
    bgRef.current = createBg(canvasRef.current);
    return () => bgRef.current?.();
  }, []);

  useEffect(() => {
  document.body.style.cursor = 'none';

  const move = (e) => {
    if (cursorRef.current) {
      cursorRef.current.style.left = `${e.clientX}px`;
      cursorRef.current.style.top = `${e.clientY}px`;
    }

    if (ringRef.current) {
      ringRef.current.style.left = `${e.clientX}px`;
      ringRef.current.style.top = `${e.clientY}px`;
    }
  };

  window.addEventListener('mousemove', move);

  return () => {
    window.removeEventListener('mousemove', move);
    document.body.style.cursor = 'auto';
  };
}, []);

  /* derived */
  const totalDone   = modules.filter(m=>m.status==='completed').length;
  const totalPct    = Math.round((totalDone/30)*100);
  const isPremium   = user?.plan === 'premium';

  /* filter by search */
  const q = search.toLowerCase().trim();
  const filtered = q ? modules.filter(m=>m.title?.toLowerCase().includes(q)) : null;

  /* loading */
  if (loading) return (
    <div className="mm-page">
      <style>{CSS}</style>
      <div className="mm-loading">
        <div className="mm-spin"/>
        <p className="mm-spin-lbl">Loading curriculum...</p>
      </div>
    </div>
  );

  /* track stats helper */
  const trackDone = num => modules.filter(m=>m.track===num&&m.status==='completed').length;
  const trackTotal= num => modules.filter(m=>m.track===num).length;

  return (
    <div className="mm-page">
      <div id="mm-cursor" ref={cursorRef}></div>
<div id="mm-cursor-ring" ref={ringRef}></div>
      <canvas id="mm-canvas" ref={canvasRef}/>
      <div className="mm-noise"/>

      <div className="mm-wrap">

        {/* ── PAGE HEADER ── */}
        <div className="mm-hdr">
          <div className="mm-hdr-inner">
            <div>
              <h1 className="mm-title">Startup Curriculum</h1>
              <p className="mm-sub">Complete all 30 modules across 5 tracks to build a venture-grade investor brief.</p>
            </div>
            <div className="mm-hdr-right">
              {/* Overall progress */}
              <div className="mm-overall">
                <span className="mm-overall-num">{totalDone}/30</span>
                <OverallBar pct={totalPct}/>
                <span className="mm-overall-lbl">{totalPct}% done</span>
              </div>
              {/* Search */}
              <div className="mm-search">
                <span className="mm-search-icon">{Ic.Search(13)}</span>
                <input
                  type="text"
                  placeholder="Search modules…"
                  value={search}
                  onChange={e=>setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── UPGRADE BANNER ── */}
        {!isPremium && (
          <div className="mm-upgrade-strip">
            <div className="mm-upgrade-in">
              <div className="mm-upgrade-left">
                <span className="mm-chip">Free Plan</span>
                <p className="mm-upgrade-txt">
                  Track 1 is unlocked.{' '}
                  <span>Upgrade to access all 5 tracks and 30 modules.</span>
                </p>
              </div>
              <Link to="/subscription" className="mm-upgrade-btn">
                Upgrade — ₹399/mo or ₹2,499/yr {Ic.Arrow(13)}
              </Link>
            </div>
          </div>
        )}

        {/* ── SEARCH RESULTS MODE ── */}
        {filtered && (
          <div style={{ animation:'mmUp .4s both' }}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.85rem',flexWrap:'wrap',gap:'.5rem' }}>
              <p style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:'.78rem',color:'#8B8AA8' }}>
                {filtered.length} result{filtered.length!==1?'s':''} for "{search}"
              </p>
              <button onClick={()=>setSearch('')} style={{ background:'none',border:'none',color:'#9D7DFF',cursor:'pointer',fontSize:'.78rem',fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                Clear search
              </button>
            </div>
            <div className="mm-grid">
              {filtered.length===0
                ? <div className="mm-empty">No modules match your search.</div>
                : filtered.map(mod => <ModCard key={mod.moduleId} mod={mod} user={user} tracks={TRACKS}/>)
              }
            </div>
          </div>
        )}

        {/* ── TRACKS ── */}
        {!filtered && TRACKS.map((track, ti) => {
          const trackMods  = modules.filter(m=>m.track===track.num);
          const done       = trackDone(track.num);
          const total      = trackTotal(track.num);
          const tPct       = total>0 ? Math.round((done/total)*100) : 0;
          const isLocked   = !isPremium && track.num > 1;
          const allDone    = done===total && total>0;

          return (
            <div
              key={track.num}
              className="mm-track"
              style={{ '--tc-color':track.color,'--tc-bdr':track.bdr,'--tc-bg':track.bg, animationDelay:`${ti*.07}s` }}
            >
              {/* Track header */}
              <div className="mm-track-hdr">
                <div className="mm-track-left">
                  <div className="mm-track-ico">{track.Icon(20)}</div>
                  <div>
                    <div className="mm-track-name">Track {track.num} — {track.name}</div>
                    <div className="mm-track-desc">{track.desc}</div>
                  </div>
                </div>
                <div className="mm-track-right">
                  <div className="mm-track-prog">
                    <TrackBar pct={tPct} color={track.color}/>
                    <span>{done}/{total}</span>
                  </div>
                  {isLocked
                    ? <span className="mm-track-badge tb-lock">{Ic.Lock(10)} Upgrade to unlock</span>
                    : allDone
                    ? <span className="mm-track-badge tb-done">{Ic.CheckC(10)} Complete</span>
                    : <span className="mm-track-badge tb-open">{Ic.Zap(10)} In progress</span>
                  }
                </div>
              </div>

              {/* Module grid */}
              <div className="mm-grid">
                {trackMods.length===0
                  ? <div className="mm-empty">No modules in this track yet.</div>
                  : trackMods.map(mod=>(
                    <ModCard key={mod.moduleId} mod={mod} user={user} tracks={TRACKS}/>
                  ))
                }
              </div>
            </div>
          );
        })}

        {/* ── PITCH COACH CTA ── */}
        <div className="mm-coach">
          <div className="mm-coach-in">
            <div className="mm-coach-ico">{Ic.Sparkle(22)}</div>
            <div className="mm-coach-txt">
              <h3>Test your knowledge with Pitch Coach</h3>
              <p>After completing a track, fire your pitch at our Claude-powered AI investor. Get scored on Clarity, Market Fit, and Value Prop — and rebuild weak spots instantly.</p>
            </div>
            <div className="mm-coach-acts">
              <Link to="/pitch-coach" className="btn-v">{Ic.Sparkle(13)} Launch Pitch Coach</Link>
              <Link to="/dashboard"   className="btn-ghost">Back to Dashboard</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MODULE CARD — extracted for reuse in search results
══════════════════════════════════════════════════════════════ */
function ModCard({ mod, user, tracks }) {
  const done    = mod.status==='completed';
  const open    = mod.status==='unlocked' || done;
  const cls     = done?'done':open?'open':'locked';
  const track   = tracks.find(t=>t.num===mod.track)||tracks[0];
  const icoMap  = { 1:'mi-v', 2:'mi-g', 3:'mi-e', 4:'mi-r', 5:'mi-v' };

  return (
    <div className={`mm-mod ${cls}`}>
      {mod.price > 0 && <span className="mm-price">₹{mod.price}</span>}

      <div className="mm-mod-top">
        <span className="mm-mod-num">Module {String(mod.moduleId).padStart(2,'0')}</span>
        <span className={`mm-mod-status ${done?'ms-done':open?'ms-open':'ms-lock'}`}>
          {done ? <>{Ic.CheckC(10)} Complete</>
               : open ? <>{Ic.Zap(10)} Unlocked</>
               : <>{Ic.Lock(10)} Locked</>}
        </span>
      </div>

      <div className="mm-mod-body">
        <div className={`mm-mod-ico ${icoMap[mod.track]||'mi-v'}`}>{track.Icon(17)}</div>
        <div>
          <div className="mm-mod-title">{mod.title}</div>
          {mod.description
            ? <div className="mm-mod-desc">{mod.description}</div>
            : <div className="mm-mod-desc">
                {open
                  ? `Define and map key concepts for ${mod.title}. Produces an exportable deliverable.`
                  : 'Complete prior modules or upgrade to premium to unlock.'}
              </div>
          }
        </div>
      </div>

      <div className="mm-mod-foot">
        <div className="mm-meta">{Ic.Clock(10)} ~25 min</div>
        <div className="mm-meta">{Ic.FileT(10)} Deliverable</div>
        {open
          ? <Link to={`/modules/${mod.moduleId}`} className={`mm-cta ${done?'cta-done':'cta-pri'}`}>
              {done ? <>{Ic.Book(11)} Review</> : <>Start {Ic.Arrow(11)}</>}
            </Link>
          : user?.plan!=='premium'
          ? <Link to="/subscription" className="mm-cta cta-up">{Ic.Sparkle(11)} Upgrade</Link>
          : <span className="mm-cta cta-dis">{Ic.Lock(11)} Locked</span>
        }
      </div>
    </div>
  );
}

export default MyModules;