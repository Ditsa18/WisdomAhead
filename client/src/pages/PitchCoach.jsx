import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import * as THREE from 'three';
import jsPDF from 'jspdf';

/*
  MindLaunch — PitchCoach v3
  No own sidebar — works inside existing layout.
  Matches Dashboard v3 / MyModules v2 / Subscription v2 theme.
  Place at: src/pages/PitchCoach.jsx
  Requires: npm install three jspdf
*/

/* ── Font injection ── */
const injectFonts = () => {
  if (document.getElementById('ml-fonts')) return;
  const l = document.createElement('link');
  l.id = 'ml-fonts'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(l);
};

/* ── Three.js subtle bg ── */
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
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({
    size: .025, vertexColors: true, transparent: true, opacity: .38, sizeAttenuation: true
  }));
  scene.add(pts);

  let mx = 0, my = 0;
  const onMM = e => { mx = (e.clientX/innerWidth-.5)*2; my = -(e.clientY/innerHeight-.5)*2; };
  const onResize = () => { renderer.setSize(innerWidth, innerHeight); cam.aspect = innerWidth/innerHeight; cam.updateProjectionMatrix(); };
  window.addEventListener('mousemove', onMM, { passive: true });
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();
  let raf;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    cam.position.x += (mx * .2 - cam.position.x) * .022;
    cam.position.y += (my * .15 - cam.position.y) * .022;
    pts.rotation.y = clock.getElapsedTime() * .007;
    const pa = geo.attributes.position.array;
    for (let i = 0; i < COUNT; i++) { pa[i*3+1] += vel[i]; if (pa[i*3+1] > 9) pa[i*3+1] = -9; }
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
   SVG ICONS — zero lucide dependency
══════════════════════════════════════════════════════════════ */
const S = ({ d, size = 16, fill = 'none', sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);
const Ic = {
  Send:    s => <S size={s} d={['M22 2L11 13','M22 2l-7 20-4-9-9-4 20-7z']}/>,
  Sparkle: s => <S size={s} fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>,
  Award:   s => <S size={s} d={['M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z','M8.21 13.89L7 23l5-3 5 3-1.21-9.12']}/>,
  Compass: s => <S size={s} d={['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z','M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z']}/>,
  Mic:     s => <S size={s} d={['M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z','M19 10v2a7 7 0 0 1-14 0v-2','M12 19v4','M8 23h8']}/>,
  MicOff:  s => <S size={s} d={['M1 1l22 22','M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6','M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23','M12 19v4','M8 23h8']}/>,
  Volume:  s => <S size={s} d={['M11 5L6 9H2v6h4l5 4V5z','M19.07 4.93a10 10 0 0 1 0 14.14','M15.54 8.46a5 5 0 0 1 0 7.07']}/>,
  Download:s => <S size={s} d={['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4','M7 10l5 5 5-5','M12 15V3']}/>,
  Check:   s => <S size={s} d="M20 6L9 17l-5-5"/>,
  CheckC:  s => <S size={s} d={['M22 11.08V12a10 10 0 1 1-5.93-9.14','M22 4L12 14.01l-3-3']}/>,
  Alert:   s => <S size={s} d={['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z','M12 8v4','M12 16h.01']}/>,
  User:    s => <S size={s} d={['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z']}/>,
  Brain:   s => <S size={s} d={['M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z','M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z']}/>,
  Zap:     s => <S size={s} fill="currentColor" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>,
  Target:  s => <S size={s} d={['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z','M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z','M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z']}/>,
  TrendUp: s => <S size={s} d={['M22 7l-8.5 8.5-5-5L2 17','M16 7h6v6']}/>,
  Globe:   s => <S size={s} d={['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M2 12h20','M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z']}/>,
  Arrow:   s => <S size={s} d={['M5 12h14','M12 5l7 7-7 7']}/>,
  Refresh: s => <S size={s} d={['M23 4v6h-6','M1 20v-6h6','M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15']}/>,
  Copy:    s => <S size={s} d={['M20 9H11a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z','M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1']}/>,
  ChevUp:  s => <S size={s} d="M18 15l-6-6-6 6"/>,
  ChevDn:  s => <S size={s} d="M6 9l6 6 6-6"/>,
};

/* ══════════════════════════════════════════════════════════════
   CSS
══════════════════════════════════════════════════════════════ */
const CSS = `
.pc-page *,.pc-page *::before,.pc-page *::after{box-sizing:border-box}
.pc-page{
  font-family:'Plus Jakarta Sans',sans-serif;
  color:#F0EFF8;min-height:100vh;position:relative;
}
#pc-canvas{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none}
.pc-noise{
  position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.022;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.pc-wrap{
  position:relative;z-index:2;
  padding:1.75rem 2rem 3rem;
  max-width:1280px;
  display:flex;flex-direction:column;gap:1.5rem;
}

/* ── HEADER ── */
.pc-hdr{
  display:flex;align-items:flex-start;justify-content:space-between;
  gap:1.5rem;flex-wrap:wrap;
  animation:pcUp .5s both;
}
.pc-title{
  font-family:'Outfit',sans-serif;font-size:2rem;font-weight:800;
  letter-spacing:-1.5px;line-height:1.1;margin-bottom:.4rem;
  display:flex;align-items:center;gap:.55rem;
}
.pc-title-text{
  background:linear-gradient(135deg,#F0EFF8,#C4B1FF);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.pc-title-star{color:#F5A623;-webkit-text-fill-color:#F5A623;flex-shrink:0}
.pc-sub{font-size:.88rem;color:#8B8AA8;line-height:1.65;max-width:540px}
.pc-hdr-acts{display:flex;align-items:center;gap:.65rem;flex-wrap:wrap;flex-shrink:0}

/* ── CONTEXT STRIP ── */
.pc-ctx{
  display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;
  padding:1rem 1.3rem;border-radius:14px;
  background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);
  transition:border-color .25s;
  animation:pcUp .5s .04s both;
}
.pc-ctx:hover{border-color:rgba(123,92,245,.2)}
.pc-ctx-left{display:flex;align-items:flex-start;gap:.75rem}
.pc-ctx-ico{
  width:36px;height:36px;border-radius:10px;flex-shrink:0;
  background:rgba(123,92,245,.1);border:1px solid rgba(123,92,245,.2);
  display:flex;align-items:center;justify-content:center;color:#C4B1FF;
}
.pc-ctx-lbl{font-size:.65rem;font-family:'JetBrains Mono',monospace;color:#3D3C56;text-transform:uppercase;letter-spacing:.08em;margin-bottom:.2rem}
.pc-ctx-idea{font-size:.84rem;color:#F0EFF8;line-height:1.5}
.pc-ctx-idea em{color:#8B8AA8;font-style:normal}
.pc-ctx-right{display:flex;gap:.6rem;flex-shrink:0;flex-wrap:wrap}

/* ── TOAST ── */
.pc-toast{
  display:flex;align-items:flex-start;gap:.65rem;
  padding:.85rem 1.1rem;border-radius:12px;
  font-size:.84rem;line-height:1.55;
  animation:pcUp .4s both;
}
.pc-toast.error{background:rgba(255,80,80,.08);border:1px solid rgba(255,80,80,.2);color:#FF8080}
.pc-toast-ico{flex-shrink:0;margin-top:1px}

/* ── MAIN GRID ── */
.pc-main{
  display:grid;
  grid-template-columns:1fr 380px;
  gap:1.4rem;
  align-items:start;
  animation:pcUp .5s .08s both;
}

/* ── CHAT CARD ── */
.pc-chat{
  background:rgba(255,255,255,.03);
  border:1px solid rgba(255,255,255,.07);
  border-radius:20px;overflow:hidden;
  display:flex;flex-direction:column;
  height:calc(100vh - 260px);
  min-height:500px;
  transition:border-color .3s;
}
.pc-chat:focus-within{border-color:rgba(123,92,245,.25)}

/* chat topbar */
.pc-chat-bar{
  display:flex;align-items:center;justify-content:space-between;
  padding:.85rem 1.2rem;
  border-bottom:1px solid rgba(255,255,255,.06);
  background:rgba(0,0,0,.18);flex-shrink:0;
}
.pc-coach-row{display:flex;align-items:center;gap:.65rem}
.pc-coach-av{
  width:34px;height:34px;border-radius:10px;flex-shrink:0;
  background:linear-gradient(135deg,#7B5CF5,#4F35C5);
  display:flex;align-items:center;justify-content:center;color:#fff;
  box-shadow:0 0 14px rgba(123,92,245,.35);
  animation:avPulse 3s ease-in-out infinite;
}
@keyframes avPulse{0%,100%{box-shadow:0 0 12px rgba(123,92,245,.3)}50%{box-shadow:0 0 24px rgba(123,92,245,.55)}}
.pc-coach-name{font-family:'Outfit',sans-serif;font-size:.88rem;font-weight:700}
.pc-coach-status{font-size:.65rem;color:#06D6A0;font-family:'JetBrains Mono',monospace;display:flex;align-items:center;gap:.3rem}
.pc-coach-dot{width:5px;height:5px;border-radius:50%;background:#06D6A0;box-shadow:0 0 6px #06D6A0;animation:dotBlink 2s ease-in-out infinite}
@keyframes dotBlink{0%,100%{opacity:1}50%{opacity:.3}}
.pc-bar-acts{display:flex;align-items:center;gap:.5rem}

/* messages */
.pc-msgs{
  flex:1;overflow-y:auto;
  padding:1.2rem;
  display:flex;flex-direction:column;gap:1rem;
  scroll-behavior:smooth;
}
.pc-msgs::-webkit-scrollbar{width:4px}
.pc-msgs::-webkit-scrollbar-thumb{background:rgba(123,92,245,.22);border-radius:2px}
.pc-msgs::-webkit-scrollbar-track{background:transparent}

/* empty state */
.pc-empty{
  margin:auto;text-align:center;
  display:flex;flex-direction:column;align-items:center;gap:.85rem;
  padding:2rem;
}
.pc-empty-ico{
  width:58px;height:58px;border-radius:18px;
  background:rgba(123,92,245,.1);border:1px solid rgba(123,92,245,.2);
  display:flex;align-items:center;justify-content:center;color:#C4B1FF;
  animation:avPulse 3s ease-in-out infinite;
}
.pc-empty-title{font-family:'Outfit',sans-serif;font-size:1.05rem;font-weight:700;color:#F0EFF8}
.pc-empty-desc{font-size:.82rem;color:#8B8AA8;line-height:1.65;max-width:300px}
.pc-prompts{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-top:.4rem;width:100%}
.pc-prompt{
  padding:.55rem .7rem;border-radius:9px;
  background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);
  font-size:.73rem;color:#8B8AA8;cursor:pointer;text-align:left;
  transition:all .2s;line-height:1.4;
}
.pc-prompt:hover{border-color:rgba(123,92,245,.3);color:#C4B1FF;background:rgba(123,92,245,.07)}

/* bubbles */
.pc-msg{display:flex;flex-direction:column;gap:.28rem;max-width:82%}
.pc-msg.user{align-self:flex-end}
.pc-msg.assistant{align-self:flex-start}
.pc-bubble{
  padding:.78rem 1rem;border-radius:14px;
  font-size:.875rem;line-height:1.62;white-space:pre-wrap;
  animation:msgIn .3s cubic-bezier(.25,.46,.45,.94) both;
}
@keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.pc-msg.user    .pc-bubble{background:linear-gradient(135deg,#F5A623,#FFD166);color:#0A0A14;font-weight:500;border-bottom-right-radius:3px}
.pc-msg.assistant .pc-bubble{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:#F0EFF8;border-bottom-left-radius:3px}
.pc-msg-foot{display:flex;align-items:center;gap:.38rem}
.pc-msg.user .pc-msg-foot{justify-content:flex-end}
.pc-msg-who{font-size:.63rem;color:#3D3C56;font-family:'JetBrains Mono',monospace}
.pc-action-btn{
  padding:.14rem .42rem;border-radius:6px;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);
  color:#3D3C56;font-size:.6rem;font-family:'JetBrains Mono',monospace;
  cursor:pointer;display:inline-flex;align-items:center;gap:.22rem;
  transition:all .18s;
}
.pc-action-btn:hover.listen{color:#9D7DFF;border-color:rgba(123,92,245,.3);background:rgba(123,92,245,.07)}
.pc-action-btn:hover.copy{color:#6EE7B7;border-color:rgba(6,214,160,.3);background:rgba(6,214,160,.07)}

/* typing */
.pc-typing{
  display:flex;align-items:center;gap:.5rem;align-self:flex-start;
  padding:.65rem 1rem;border-radius:12px;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);
}
.pc-typing-dots{display:flex;gap:.3rem}
.pc-td{width:6px;height:6px;border-radius:50%;background:#7B5CF5;animation:tdBounce .6s ease-in-out infinite alternate}
.pc-td:nth-child(2){animation-delay:.15s}
.pc-td:nth-child(3){animation-delay:.3s}
@keyframes tdBounce{from{transform:translateY(0);opacity:.4}to{transform:translateY(-5px);opacity:1}}
.pc-typing-lbl{font-size:.74rem;color:#8B8AA8;font-family:'JetBrains Mono',monospace}

/* input area */
.pc-input-area{
  padding:.9rem 1.1rem;
  border-top:1px solid rgba(255,255,255,.06);
  background:rgba(0,0,0,.18);flex-shrink:0;
  display:flex;flex-direction:column;gap:.65rem;
}
.pc-input-row{display:flex;align-items:flex-end;gap:.55rem}
.pc-textarea{
  flex:1;padding:.72rem 1rem;
  border-radius:11px;
  background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);
  color:#F0EFF8;font-family:'Plus Jakarta Sans',sans-serif;font-size:.875rem;
  outline:none;transition:all .25s;
  resize:none;min-height:42px;max-height:130px;line-height:1.5;
}
.pc-textarea::placeholder{color:#3D3C56}
.pc-textarea:focus{border-color:rgba(123,92,245,.5);background:rgba(123,92,245,.06);box-shadow:0 0 0 3px rgba(123,92,245,.1)}
.pc-textarea:disabled{opacity:.5}
.pc-send{
  width:42px;height:42px;border-radius:11px;flex-shrink:0;
  background:linear-gradient(135deg,#7B5CF5,#5B3CC5);border:none;
  cursor:pointer;color:#fff;display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 14px rgba(123,92,245,.3);
  transition:all .22s cubic-bezier(.34,1.56,.64,1);
}
.pc-send:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 22px rgba(123,92,245,.48)}
.pc-send:disabled{opacity:.42;cursor:not-allowed;transform:none}
.pc-mic{
  width:42px;height:42px;border-radius:11px;flex-shrink:0;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);
  cursor:pointer;color:#8B8AA8;display:flex;align-items:center;justify-content:center;
  transition:all .22s;
}
.pc-mic:hover:not(:disabled){border-color:rgba(123,92,245,.35);color:#C4B1FF;background:rgba(123,92,245,.08)}
.pc-mic.rec{background:rgba(255,80,80,.12);border-color:rgba(255,80,80,.35);color:#FF8080;animation:recPulse 1s ease-in-out infinite}
@keyframes recPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,80,80,0)}50%{box-shadow:0 0 0 6px rgba(255,80,80,.14)}}
.pc-tools{display:flex;align-items:center;gap:.45rem;flex-wrap:wrap}
.pc-tool{
  padding:.28rem .68rem;border-radius:8px;
  background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);
  color:#8B8AA8;font-size:.68rem;font-family:'JetBrains Mono',monospace;
  cursor:pointer;display:inline-flex;align-items:center;gap:.28rem;
  transition:all .18s;
}
.pc-tool:hover:not(:disabled){border-color:rgba(123,92,245,.3);color:#C4B1FF;background:rgba(123,92,245,.07)}
.pc-tool:disabled{opacity:.38;cursor:not-allowed}
.pc-rec-err{font-size:.7rem;color:#FF8080;font-family:'JetBrains Mono',monospace}

/* ── RIGHT PANEL ── */
.pc-right{display:flex;flex-direction:column;gap:1.2rem}

/* ── REPORT CARD ── */
.pc-report{
  background:rgba(255,255,255,.03);
  border:1px solid rgba(245,166,35,.28);
  border-radius:20px;overflow:hidden;
  position:relative;
  animation:pcUp .5s .12s both;
}
.pc-report::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,#F5A623,#FFD166,#F5A623);
  background-size:200% 100%;animation:shimmer 3s linear infinite;
}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
.pc-report-hdr{
  display:flex;align-items:center;justify-content:space-between;
  padding:1rem 1.2rem;border-bottom:1px solid rgba(255,255,255,.06);
  background:rgba(245,166,35,.04);flex-wrap:wrap;gap:.6rem;
}
.pc-report-title{
  display:flex;align-items:center;gap:.5rem;
  font-family:'Outfit',sans-serif;font-size:.95rem;font-weight:700;color:#FFD166;
}
.pc-overall{
  padding:.22rem .62rem;border-radius:100px;
  background:linear-gradient(135deg,#F5A623,#FFD166);
  color:#0A0A14;font-size:.68rem;font-weight:800;font-family:'JetBrains Mono',monospace;
}
.pc-report-body{padding:1.1rem 1.2rem;display:flex;flex-direction:column;gap:1.05rem}

/* score grid */
.pc-scores{display:grid;grid-template-columns:1fr 1fr;gap:.6rem}
.pc-score{
  background:rgba(0,0,0,.22);border:1px solid rgba(255,255,255,.06);
  border-radius:11px;padding:.7rem;text-align:center;
  transition:all .25s;
}
.pc-score:hover{border-color:rgba(245,166,35,.22);background:rgba(245,166,35,.04)}
.pc-score-num{font-family:'Outfit',sans-serif;font-size:1.45rem;font-weight:800;letter-spacing:-1px;line-height:1;color:#F5A623}
.pc-score-lbl{font-size:.6rem;color:#3D3C56;text-transform:uppercase;letter-spacing:.08em;font-family:'JetBrains Mono',monospace;margin-top:.22rem}
.pc-score-bar{height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;margin-top:.35rem}
.pc-score-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,#F5A623,#FFD166);transition:width 1.2s cubic-bezier(.25,.46,.45,.94)}

/* report sections */
.pc-rs-label{
  font-size:.65rem;font-family:'JetBrains Mono',monospace;
  text-transform:uppercase;letter-spacing:.08em;font-weight:600;
  margin-bottom:.38rem;display:flex;align-items:center;gap:.32rem;
}
.rs-ok{color:#06D6A0}
.rs-bad{color:#FF8080}
.rs-info{color:#C4B1FF}
.pc-rs-text{font-size:.81rem;color:#8B8AA8;line-height:1.58}
.pc-action-list{list-style:none;padding:0;display:flex;flex-direction:column;gap:.42rem}
.pc-action-item{display:flex;align-items:flex-start;gap:.48rem;font-size:.79rem;color:#8B8AA8;line-height:1.5}
.pc-ai-n{
  width:18px;height:18px;border-radius:50%;flex-shrink:0;
  background:rgba(123,92,245,.1);border:1px solid rgba(123,92,245,.2);
  color:#C4B1FF;font-family:'JetBrains Mono',monospace;
  font-size:.57rem;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:1px;
}

/* no report placeholder */
.pc-no-report{
  background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);
  border-radius:20px;padding:1.5rem 1.2rem;
  display:flex;flex-direction:column;align-items:center;gap:.85rem;text-align:center;
  animation:pcUp .5s .12s both;
}
.pc-no-report-ico{
  width:50px;height:50px;border-radius:14px;
  background:rgba(245,166,35,.08);border:1px solid rgba(245,166,35,.18);
  display:flex;align-items:center;justify-content:center;color:#FFD166;
}
.pc-no-report-title{font-family:'Outfit',sans-serif;font-size:.95rem;font-weight:700;color:#F0EFF8}
.pc-no-report-sub{font-size:.78rem;color:#8B8AA8;line-height:1.6;max-width:250px}

/* ── TIPS CARD ── */
.pc-tips{
  background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);
  border-radius:16px;padding:1.15rem;
  animation:pcUp .5s .16s both;
}
.pc-tips-title{font-family:'Outfit',sans-serif;font-size:.88rem;font-weight:700;margin-bottom:.8rem;display:flex;align-items:center;gap:.4rem;color:#F0EFF8}
.pc-tip-list{display:flex;flex-direction:column;gap:.52rem}
.pc-tip{display:flex;align-items:flex-start;gap:.52rem;font-size:.77rem;color:#8B8AA8;line-height:1.5}
.pc-tip-ico{flex-shrink:0;margin-top:2px;color:#9D7DFF}

/* ── BUTTONS ── */
.btn-v{
  padding:.44rem .95rem;border-radius:9px;
  background:linear-gradient(135deg,#7B5CF5,#5B3CC5);border:none;cursor:pointer;color:#fff;
  font-family:'Outfit',sans-serif;font-size:.78rem;font-weight:700;
  text-decoration:none;display:inline-flex;align-items:center;gap:.35rem;
  box-shadow:0 4px 12px rgba(123,92,245,.24);
  transition:all .22s cubic-bezier(.34,1.56,.64,1);
}
.btn-v:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(123,92,245,.42)}
.btn-v:disabled{opacity:.42;cursor:not-allowed;transform:none}
.btn-g{
  padding:.44rem .95rem;border-radius:9px;
  background:linear-gradient(135deg,#F5A623,#E08C0A);border:none;cursor:pointer;color:#0A0A14;
  font-family:'Outfit',sans-serif;font-size:.78rem;font-weight:700;
  display:inline-flex;align-items:center;gap:.35rem;
  box-shadow:0 4px 12px rgba(245,166,35,.2);
  transition:all .22s cubic-bezier(.34,1.56,.64,1);
}
.btn-g:hover{transform:translateY(-2px);box-shadow:0 8px 18px rgba(245,166,35,.38)}
.btn-ghost{
  padding:.44rem .95rem;border-radius:9px;
  border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);
  cursor:pointer;color:#8B8AA8;
  font-family:'Outfit',sans-serif;font-size:.78rem;font-weight:600;
  display:inline-flex;align-items:center;gap:.35rem;
  transition:all .2s;
}
.btn-ghost:hover{border-color:rgba(123,92,245,.3);color:#C4B1FF;background:rgba(123,92,245,.07)}
.btn-ghost:disabled{opacity:.38;cursor:not-allowed}

/* ── ANIMATIONS ── */
@keyframes pcUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}

/* ── RESPONSIVE ── */
@media(max-width:960px){
  .pc-main{grid-template-columns:1fr}
  .pc-right{order:-1}
  .pc-chat{height:480px;min-height:420px}
}
@media(max-width:640px){
  .pc-wrap{padding:1.25rem 1.25rem 3rem}
  .pc-title{font-size:1.6rem}
  .pc-hdr{flex-direction:column}
  .pc-prompts{grid-template-columns:1fr}
  .pc-scores{grid-template-columns:1fr 1fr}
}
`;

/* ── Animated score bar ── */
function ScoreBar({ val }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW((val / 10) * 100), 400); return () => clearTimeout(t); }, [val]);
  return <div className="pc-score-bar"><div className="pc-score-fill" style={{ width: `${w}%` }}/></div>;
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const PitchCoach = () => {
  const { user, token } = useAuth();

  const [messages,     setMessages]     = useState([]);
  const [report,       setReport]       = useState(null);
  const [input,        setInput]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const [errorMsg,     setErrorMsg]     = useState('');
  const [recording,    setRecording]    = useState(false);
  const [recSupported, setRecSupported] = useState(false);
  const [recError,     setRecError]     = useState('');
  const [lastAIText,   setLastAIText]   = useState('');
  const [copied,       setCopied]       = useState(null);
  const [collapsed,    setCollapsed]    = useState(false);

  const endRef    = useRef(null);
  const recRef    = useRef(null);
  const canvasRef = useRef(null);
  const bgRef     = useRef(null);
  const inputRef  = useRef(null);

  /* CSS + fonts */
  useEffect(() => {
    injectFonts();
    let el = document.getElementById('pc-css');
    if (!el) { el = document.createElement('style'); el.id = 'pc-css'; document.head.appendChild(el); }
    el.textContent = CSS;
  }, []);

  /* Three.js bg */
  useEffect(() => {
    if (!canvasRef.current) return;
    bgRef.current = createBg(canvasRef.current);
    return () => bgRef.current?.();
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
      } catch(e) { console.error(e); }
    })();
  }, [token]);

  /* Auto-scroll */
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

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
    if (e) e.preventDefault();
    const text = custom || input;
    if (!text.trim() || loading) return;
    setInput('');
    setErrorMsg('');
    setMessages(prev => [...prev, { role: 'user', content: text, timestamp: new Date() }]);
    setLoading(true);
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
    } catch(err) {
      setErrorMsg(err.message || 'Connection lost. Please try again.');
    } finally { setLoading(false); }
  }, [input, loading, token, speak]);

  /* Voice toggle */
  const toggleRec = () => {
    setRecError('');
    if (!recRef.current) { setRecError('Voice not supported in this browser.'); return; }
    if (recording) { recRef.current.stop(); setRecording(false); }
    else { try { setRecording(true); recRef.current.start(); } catch(e) { setRecError('Refresh and try again.'); setRecording(false); } }
  };

  /* Copy */
  const copyMsg = (text, idx) => {
    navigator.clipboard?.writeText(text).then(() => { setCopied(idx); setTimeout(() => setCopied(null), 1800); });
  };

  /* Request report */
  const requestReport = () => handleSend(null, 'Please generate a Pitch Feedback Report based on our full conversation and the responses I have given so far.');

  /* PDF */
  const downloadPDF = () => {
    if (!report) return;
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const M = 40, LH = 18; let y = M;
    doc.setFontSize(18); doc.text('Pitch Coach Feedback Report', M, y); y += 28;
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
    addSec('Overall Score',         `${report.scores?.overall}/10`);
    addSec('Clarity',               `${report.scores?.clarity}/10`);
    addSec('Market Understanding',  `${report.scores?.marketUnderstanding}/10`);
    addSec('Value Proposition',     `${report.scores?.valueProposition}/10`);
    addSec('Storytelling',          `${report.scores?.storytelling}/10`);
    addSec('Key Strength',          report.keyStrength || 'N/A');
    addSec('Critical Gap',          report.criticalGap || 'N/A');
    if (Array.isArray(report.actionItems)) {
      doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.text('Action Items', M, y); y += 20;
      doc.setFontSize(11); doc.setFont('helvetica', 'normal');
      report.actionItems.forEach((item, i) => {
        const s = doc.splitTextToSize(`${i + 1}. ${item}`, 520); doc.text(s, M, y); y += s.length * LH + 6;
        if (y > 720) { doc.addPage(); y = M; }
      });
    }
    doc.save('Pitch-Coach-Feedback-Report.pdf');
  };

  const PROMPTS = [
    "My startup solves ___ for ___.",
    "My target customer is...",
    "What makes my solution 10× better?",
    "Walk me through my business model.",
  ];

  const TIPS = [
    [Ic.Target, "Lead with the problem, not your solution."],
    [Ic.Globe,  "Define market size with real data points."],
    [Ic.TrendUp,"Show traction: users, revenue, or waitlist."],
    [Ic.Award,  "State your unfair advantage clearly."],
    [Ic.Sparkle,"Use 'Get Pitch Report' to see your full score."],
  ];

  return (
    <div className="pc-page">
      <canvas id="pc-canvas" ref={canvasRef}/>
      <div className="pc-noise"/>

      <div className="pc-wrap">

        {/* ── HEADER ── */}
        <div className="pc-hdr">
          <div>
            <h1 className="pc-title">
              <span className="pc-title-text">Pitch Coach</span>
              <span className="pc-title-star">{Ic.Sparkle(22)}</span>
            </h1>
            <p className="pc-sub">Stress-test your assumptions, sharpen your story, and get investor-grade feedback powered by Claude AI.</p>
          </div>
          <div className="pc-hdr-acts">
            {report && (
              <button className="btn-g" onClick={downloadPDF}>
                {Ic.Download(13)} Download PDF
              </button>
            )}
            <button className="btn-v" onClick={requestReport} disabled={loading || messages.length === 0}>
              {Ic.Award(13)} Get Pitch Report
            </button>
          </div>
        </div>

        {/* ── CONTEXT STRIP ── */}
        <div className="pc-ctx">
          <div className="pc-ctx-left">
            <div className="pc-ctx-ico">{Ic.User(16)}</div>
            <div>
              <div className="pc-ctx-lbl">Your Startup Profile</div>
              <div className="pc-ctx-idea">
                {user?.category && <strong>[{user.category}] </strong>}
                {user?.startupIdea
                  ? `"${user.startupIdea.substring(0, 110)}${user.startupIdea.length > 110 ? '…' : ''}"`
                  : <em>No startup idea on file — add one in your profile.</em>}
              </div>
            </div>
          </div>
          <div className="pc-ctx-right">
            {lastAIText && (
              <button className="btn-ghost" onClick={() => speak(lastAIText)}>
                {Ic.Volume(13)} Replay last
              </button>
            )}
          </div>
        </div>

        {/* ── ERROR ── */}
        {errorMsg && (
          <div className="pc-toast error">
            <span className="pc-toast-ico">{Ic.Alert(15)}</span>
            {errorMsg}
          </div>
        )}

        {/* ── MAIN GRID ── */}
        <div className="pc-main">

          {/* ── CHAT ── */}
          <div className="pc-chat">
            {/* Chat bar */}
            <div className="pc-chat-bar">
              <div className="pc-coach-row">
                <div className="pc-coach-av">{Ic.Brain(16)}</div>
                <div>
                  <div className="pc-coach-name">Pitch Coach</div>
                  <div className="pc-coach-status">
                    <div className="pc-coach-dot"/> Claude AI · Live session
                  </div>
                </div>
              </div>
              <div className="pc-bar-acts">
                {messages.length > 0 && (
                  <button className="btn-ghost" onClick={requestReport} disabled={loading} style={{ fontSize:'.72rem', padding:'.28rem .65rem' }}>
                    {Ic.Award(11)} Report
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="pc-msgs">
              {messages.length === 0 ? (
                <div className="pc-empty">
                  <div className="pc-empty-ico">{Ic.Compass(24)}</div>
                  <div className="pc-empty-title">Start pitching your idea</div>
                  <p className="pc-empty-desc">Introduce your startup, describe your customers, or ask the coach to pressure-test your logic.</p>
                  <div className="pc-prompts">
                    {PROMPTS.map((p, i) => (
                      <button key={i} className="pc-prompt" onClick={() => { setInput(p); inputRef.current?.focus(); }}>{p}</button>
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
                          {Ic.Volume(10)} listen
                        </button>
                        <button className="pc-action-btn copy" onClick={() => copyMsg(clean, idx)}>
                          {copied === idx ? <>{Ic.Check(10)} copied</> : <>{Ic.Copy(10)} copy</>}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              {loading && (
                <div className="pc-typing">
                  <div className="pc-typing-dots">
                    <div className="pc-td"/><div className="pc-td"/><div className="pc-td"/>
                  </div>
                  <span className="pc-typing-lbl">Coach is analyzing...</span>
                </div>
              )}
              <div ref={endRef}/>
            </div>

            {/* Input */}
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
                  {recording ? Ic.MicOff(16) : Ic.Mic(16)}
                </button>
                <textarea
                  ref={inputRef}
                  className="pc-textarea"
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                  placeholder="Type your pitch or question… (Enter sends, Shift+Enter for newline)"
                  disabled={loading}
                />
                <button type="submit" className="pc-send" disabled={loading || !input.trim()}>
                  {Ic.Send(15)}
                </button>
              </div>
              <div className="pc-tools">
                <button type="button" className="pc-tool" onClick={requestReport} disabled={loading || messages.length === 0}>
                  {Ic.Sparkle(11)} Full report
                </button>
                {lastAIText && (
                  <button type="button" className="pc-tool" onClick={() => speak(lastAIText)}>
                    {Ic.Volume(11)} Replay
                  </button>
                )}
                {messages.length > 0 && (
                  <button type="button" className="pc-tool" onClick={() => handleSend(null, 'What are my biggest weaknesses in this pitch so far?')}>
                    {Ic.Target(11)} Find weaknesses
                  </button>
                )}
                {messages.length > 0 && (
                  <button type="button" className="pc-tool" onClick={() => handleSend(null, 'How would a Series A investor react to my pitch right now?')}>
                    {Ic.Award(11)} VC reaction
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="pc-right">

            {/* Report or placeholder */}
            {report ? (
              <div className="pc-report">
                <div className="pc-report-hdr">
                  <div className="pc-report-title">{Ic.Award(15)} Pitch Report</div>
                  <div style={{ display:'flex', gap:'.48rem', alignItems:'center', flexWrap:'wrap' }}>
                    <span className="pc-overall">{report.scores?.overall}/10</span>
                    <button className="btn-ghost" onClick={() => setCollapsed(v => !v)} style={{ padding:'.2rem .48rem' }}>
                      {collapsed ? Ic.ChevDn(12) : Ic.ChevUp(12)}
                    </button>
                    <button className="btn-g" onClick={downloadPDF} style={{ padding:'.26rem .6rem', fontSize:'.68rem' }}>
                      {Ic.Download(11)}
                    </button>
                  </div>
                </div>

                {!collapsed && (
                  <div className="pc-report-body">
                    <div className="pc-scores">
                      {[
                        { lbl:'Clarity',    val: report.scores?.clarity },
                        { lbl:'Market',     val: report.scores?.marketUnderstanding },
                        { lbl:'Value Prop', val: report.scores?.valueProposition },
                        { lbl:'Story',      val: report.scores?.storytelling },
                      ].map(({ lbl, val }) => (
                        <div className="pc-score" key={lbl}>
                          <div className="pc-score-num">{val}/10</div>
                          <div className="pc-score-lbl">{lbl}</div>
                          <ScoreBar val={val || 0}/>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="pc-rs-label rs-ok">{Ic.CheckC(10)} Key Strength</div>
                      <p className="pc-rs-text">{report.keyStrength || '—'}</p>
                    </div>
                    <div>
                      <div className="pc-rs-label rs-bad">{Ic.Alert(10)} Critical Gap</div>
                      <p className="pc-rs-text">{report.criticalGap || '—'}</p>
                    </div>

                    {Array.isArray(report.actionItems) && report.actionItems.length > 0 && (
                      <div>
                        <div className="pc-rs-label rs-info">{Ic.Zap(10)} Action Items</div>
                        <ul className="pc-action-list">
                          {report.actionItems.map((item, i) => (
                            <li key={i} className="pc-action-item">
                              <span className="pc-ai-n">{i + 1}</span>{item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button className="btn-v" style={{ width:'100%', justifyContent:'center' }} onClick={requestReport} disabled={loading}>
                      {Ic.Refresh(12)} Regenerate
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="pc-no-report">
                <div className="pc-no-report-ico">{Ic.Award(20)}</div>
                <div className="pc-no-report-title">No report yet</div>
                <p className="pc-no-report-sub">Chat with the coach, then click "Get Pitch Report" for a full scored breakdown.</p>
                <button
                  className="btn-g"
                  onClick={requestReport}
                  disabled={loading || messages.length === 0}
                  style={{ width:'100%', justifyContent:'center', padding:'.6rem 1rem', fontSize:'.82rem', borderRadius:'10px' }}
                >
                  {Ic.Sparkle(13)} Generate Report
                </button>
              </div>
            )}

            {/* Tips */}
            <div className="pc-tips">
              <div className="pc-tips-title">{Ic.Zap(14)} Pitch tips</div>
              <div className="pc-tip-list">
                {TIPS.map(([IcoFn, tip], i) => (
                  <div key={i} className="pc-tip">
                    <span className="pc-tip-ico">{IcoFn(12)}</span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PitchCoach;