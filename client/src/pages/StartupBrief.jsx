import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { jsPDF } from 'jspdf';

/*
  MindLaunch — StartupBrief.jsx v2
  ──────────────────────────────────
  • Matches Dashboard v2 + LandingPage v4 theme exactly
  • Self-contained Sidebar (imported)
  • Three.js particle background (loaded from CDN, no extra import)
  • All SVG icons inline — no emoji
  • Animated stat cards, glowing module deliverable cards
  • Scroll-reveal on cards
  • Full jsPDF export preserved + enhanced (logo, colors, layout)
  • Fully responsive (mobile ↔ desktop)
*/

/* ── Font injection ── */
const injectFonts = () => {
  if (document.getElementById('ml-fonts')) return;
  const l = document.createElement('link');
  l.id = 'ml-fonts'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(l);
};

/* ── Three.js particle bg (CDN) ── */
function loadThree() {
  if (typeof window.THREE !== 'undefined') return Promise.resolve(window.THREE);
  return new Promise(res => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload = () => res(window.THREE);
    document.head.appendChild(s);
  });
}

function createBgParticles(canvas) {
  const THREE = window.THREE;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setSize(innerWidth, innerHeight);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 200);
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
  const pts = new THREE.Points(geo,
    new THREE.PointsMaterial({ size:.026, vertexColors:true, transparent:true, opacity:.42, sizeAttenuation:true })
  );
  scene.add(pts);

  // Deep star field
  const sGeo = new THREE.BufferGeometry();
  const sPos = new Float32Array(140 * 3);
  for (let i = 0; i < 140; i++) {
    sPos[i*3]=(Math.random()-.5)*40; sPos[i*3+1]=(Math.random()-.5)*28; sPos[i*3+2]=-10-Math.random()*8;
  }
  sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  scene.add(new THREE.Points(sGeo,
    new THREE.PointsMaterial({ size:.012, color:0x6655cc, transparent:true, opacity:.25 })
  ));

  let mx = 0, my = 0;
  const onMM = e => { mx=(e.clientX/innerWidth-.5)*2; my=-(e.clientY/innerHeight-.5)*2; };
  const onR  = () => { renderer.setSize(innerWidth,innerHeight); cam.aspect=innerWidth/innerHeight; cam.updateProjectionMatrix(); };
  window.addEventListener('mousemove', onMM, { passive:true });
  window.addEventListener('resize', onR);

  const clock = new THREE.Clock();
  let raf;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    cam.position.x += (mx*.22 - cam.position.x)*.025;
    cam.position.y += (my*.16 - cam.position.y)*.025;
    pts.rotation.y = clock.getElapsedTime() * .01;
    const pa = geo.attributes.position.array;
    for (let i=0;i<COUNT;i++) { pa[i*3+1]+=vel[i]; if(pa[i*3+1]>9) pa[i*3+1]=-9; }
    geo.attributes.position.needsUpdate = true;
    renderer.render(scene, cam);
  };
  tick();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('mousemove', onMM);
    window.removeEventListener('resize', onR);
    renderer.dispose();
  };
}

/* ══════════════ INLINE SVG ICONS (no emoji, no extra deps) ══════════════ */
const Ic = ({ paths, size=16, fill='none', stroke='currentColor', sw=2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(paths) ? paths : [paths]).map((d, i) =>
      d.startsWith('C') || d.startsWith('c')
        ? <circle key={i} {...JSON.parse(d)} />
        : <path key={i} d={d}/>
    )}
  </svg>
);

const Icons = {
  Download:   ({s=16}) => <Ic size={s} paths={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"]}/>,
  User:       ({s=16}) => <Ic size={s} paths={["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2","M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"]}/>,
  Globe:      ({s=16}) => <Ic size={s} paths={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M2 12h20","M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"]}/>,
  FileText:   ({s=16}) => <Ic size={s} paths={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"]}/>,
  BookOpen:   ({s=16}) => <Ic size={s} paths={["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z","M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]}/>,
  Sparkles:   ({s=16}) => <Ic size={s} fill="currentColor" stroke="none" paths={["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"]}/>,
  ChevRight:  ({s=16}) => <Ic size={s} paths={["M9 18l6-6-6-6"]}/>,
  ChevDown:   ({s=16}) => <Ic size={s} paths={["M6 9l6 6 6-6"]}/>,
  ChevUp:     ({s=16}) => <Ic size={s} paths={["M18 15l-6-6-6 6"]}/>,
  Check:      ({s=16}) => <Ic size={s} paths={["M20 6L9 17l-5-5"]}/>,
  Target:     ({s=16}) => <Ic size={s} paths={["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z","M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"]}/>,
  Layers:     ({s=16}) => <Ic size={s} paths={["M12 2L2 7l10 5 10-5-10-5z","M2 17l10 5 10-5","M2 12l10 5 10-5"]}/>,
  Zap:        ({s=16}) => <Ic size={s} fill="currentColor" stroke="none" paths={["M13 2L3 14h9l-1 8 10-12h-9l1-8z"]}/>,
  Award:      ({s=16}) => <Ic size={s} paths={["M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z","M8.21 13.89L7 23l5-3 5 3-1.21-9.12"]}/>,
  Bell:       ({s=16}) => <Ic size={s} paths={["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 0 1-3.46 0"]}/>,
  ArrowLeft:  ({s=16}) => <Ic size={s} paths={["M19 12H5","M12 19l-7-7 7-7"]}/>,
  TrendUp:    ({s=16}) => <Ic size={s} paths={["M22 7l-8.5 8.5-5-5L2 17","M16 7h6v6"]}/>,
  Calendar:   ({s=16}) => <Ic size={s} paths={["M3 4h18v18H3z","M16 2v4","M8 2v4","M3 10h18"]}/>,
  Quote:      ({s=24}) => <Ic size={s} fill="currentColor" stroke="none" paths={["M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.57-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"]}/>,
  ExternalLink:({s=16}) => <Ic size={s} paths={["M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6","M15 3h6v6","M10 14L21 3"]}/>,
  Modules:    ({s=16}) => <Ic size={s} paths={["M4 6h16M4 10h16M4 14h16M4 18h16"]}/>,
};

/* ══════════════ CSS ══════════════ */
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
:root{
  --ink:#04040C;
  --violet:#7B5CF5;--violet2:#9D7DFF;--violet-dim:rgba(123,92,245,.1);
  --gold:#F5A623;--gold2:#FFD166;--gold-dim:rgba(245,166,35,.1);
  --emerald:#06D6A0;--emerald-dim:rgba(6,214,160,.08);
  --rose:#FF6B9D;
  --text:#F0EFF8;--text2:#8B8AA8;--text3:#3D3C56;
  --border:rgba(255,255,255,.06);--border2:rgba(255,255,255,.11);
  --r:12px;--rl:20px;
  --ease:cubic-bezier(.25,.46,.45,.94);
  --spring:cubic-bezier(.34,1.56,.64,1);
  --font-d:'Outfit',sans-serif;
  --font-b:'Plus Jakarta Sans',sans-serif;
  --font-m:'JetBrains Mono',monospace;
}
body{background:var(--ink);color:var(--text);font-family:var(--font-b);overflow-x:hidden;cursor:none;min-height:100vh}

/* CURSOR */
#sb-cursor{position:fixed;width:10px;height:10px;background:var(--violet2);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:screen;transition:width .2s var(--spring),height .2s var(--spring),background .2s}
#sb-cursor-ring{position:fixed;width:34px;height:34px;border:1px solid rgba(123,92,245,.35);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%)}

/* CANVAS + NOISE */
#sb-canvas{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none}
.sb-noise{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.024;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* ═══ LAYOUT ═══ */
.sb-main{
  width:100%;
  flex:1;
  min-width:0;
  margin-left:0;
}

/* ═══ TOPBAR — matches Dashboard style exactly ═══ */
.sb-topbar{
  position:sticky;top:0;z-index:100;
  background:rgba(4,4,12,.78);backdrop-filter:blur(22px) saturate(150%);
  border-bottom:1px solid var(--border);
  padding:.88rem 2rem;
  display:flex;align-items:center;justify-content:space-between;gap:1rem;
}
.sb-topbar-left{display:flex;flex-direction:column;gap:.1rem}
.sb-topbar-title{font-family:var(--font-d);font-size:1.15rem;font-weight:700;letter-spacing:-.3px;color:var(--text)}
.sb-topbar-sub{font-size:.78rem;color:var(--text2)}
.sb-topbar-right{display:flex;align-items:center;gap:.7rem}
.sb-icon-btn{
  width:36px;height:36px;border-radius:9px;
  background:rgba(255,255,255,.04);border:1px solid var(--border2);
  display:flex;align-items:center;justify-content:center;
  color:var(--text2);cursor:pointer;
  transition:all .2s var(--ease);
}
.sb-icon-btn:hover{color:var(--text);background:rgba(255,255,255,.08);border-color:rgba(123,92,245,.3)}

/* ═══ PAGE BODY ═══ */
.sb-body{padding:2rem;display:flex;flex-direction:column;gap:2rem;flex:1}

/* ═══ PAGE HEADER ═══ */
.sb-page-hdr{
  display:flex;align-items:flex-start;justify-content:space-between;
  gap:1.5rem;flex-wrap:wrap;
  animation:sbFadeUp .6s var(--ease) both;
}
.sb-page-hdr-left{}
.sb-page-eyebrow{
  display:inline-flex;align-items:center;gap:.4rem;
  font-family:var(--font-m);font-size:.65rem;font-weight:500;
  letter-spacing:.1em;text-transform:uppercase;
  color:var(--violet2);margin-bottom:.6rem;
}
.sb-page-eyebrow-dot{width:5px;height:5px;border-radius:50%;background:var(--violet2);box-shadow:0 0 8px var(--violet2);animation:sbPulse 2s ease-in-out infinite}
@keyframes sbPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}
.sb-page-title{
  font-family:var(--font-d);font-size:clamp(1.75rem,3.5vw,2.4rem);
  font-weight:800;letter-spacing:-1.5px;line-height:1.1;
  background:linear-gradient(135deg,var(--text),var(--violet2));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  margin-bottom:.4rem;
}
.sb-page-sub{font-size:.9rem;color:var(--text2);line-height:1.6;max-width:500px}
.sb-page-hdr-actions{display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;flex-shrink:0}

/* Buttons */
.btn-gold{
  padding:.65rem 1.35rem;border-radius:11px;
  background:linear-gradient(135deg,#F5A623,#E08C0A);
  border:none;cursor:pointer;color:#0A0A14;
  font-family:var(--font-d);font-size:.875rem;font-weight:700;
  display:inline-flex;align-items:center;gap:.4rem;
  box-shadow:0 0 0 1px rgba(245,166,35,.4),0 6px 20px rgba(245,166,35,.3);
  transition:all .25s var(--spring);text-decoration:none;white-space:nowrap;
}
.btn-gold:hover{transform:translateY(-2px);box-shadow:0 0 0 1px rgba(245,166,35,.6),0 10px 32px rgba(245,166,35,.45);filter:brightness(1.06)}
.btn-gold:disabled,.btn-gold.disabled{opacity:.5;cursor:not-allowed;transform:none;filter:none}
.btn-outline-sm{
  padding:.58rem 1.1rem;border-radius:10px;
  border:1px solid rgba(123,92,245,.3);background:rgba(123,92,245,.06);
  cursor:pointer;color:var(--text);
  font-family:var(--font-d);font-size:.85rem;font-weight:600;
  display:inline-flex;align-items:center;gap:.38rem;
  transition:all .22s var(--ease);text-decoration:none;white-space:nowrap;
}
.btn-outline-sm:hover{border-color:rgba(123,92,245,.65);background:rgba(123,92,245,.14);transform:translateY(-1px)}

/* ═══ STAT CARDS ROW ═══ */
.sb-stats-row{
  display:grid;grid-template-columns:repeat(4,1fr);
  gap:1rem;
  animation:sbFadeUp .6s .06s var(--ease) both;
}
.sb-stat{
  background:rgba(255,255,255,.03);
  border:1px solid var(--border);
  border-radius:var(--rl);
  padding:1.2rem 1.35rem;
  display:flex;flex-direction:column;gap:.55rem;
  position:relative;overflow:hidden;
  transition:all .3s var(--ease);
}
.sb-stat::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--sc,rgba(123,92,245,.6)) 50%,transparent);
  opacity:0;transition:opacity .3s;
}
.sb-stat:hover{border-color:var(--sb,rgba(123,92,245,.3));transform:translateY(-3px);box-shadow:0 16px 38px rgba(0,0,0,.3)}
.sb-stat:hover::before{opacity:1}
.sb-stat-top{display:flex;align-items:center;justify-content:space-between}
.sb-stat-label{font-family:var(--font-m);font-size:.68rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--text2)}
.sb-stat-ico{
  width:30px;height:30px;border-radius:8px;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
}
.sb-stat-val{font-family:var(--font-d);font-size:1.85rem;font-weight:800;letter-spacing:-1.5px;line-height:1}
.sb-stat-sub{font-size:.7rem;color:var(--text3);font-family:var(--font-m)}

/* icon variants */
.ico-v{background:var(--violet-dim);border:1px solid rgba(123,92,245,.18);color:#C4B1FF}
.ico-g{background:var(--gold-dim);border:1px solid rgba(245,166,35,.18);color:var(--gold2)}
.ico-e{background:var(--emerald-dim);border:1px solid rgba(6,214,160,.18);color:#6EE7B7}
.ico-r{background:rgba(255,107,157,.08);border:1px solid rgba(255,107,157,.18);color:var(--rose)}

/* ═══ META CARD ═══ */
.sb-meta-card{
  background:linear-gradient(135deg,rgba(123,92,245,.06),rgba(255,255,255,.025));
  border:1px solid rgba(123,92,245,.2);
  border-radius:var(--rl);
  padding:1.6rem;
  position:relative;overflow:hidden;
  animation:sbFadeUp .6s .1s var(--ease) both;
}
.sb-meta-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(123,92,245,.7) 50%,transparent);
}
/* shimmer */
.sb-meta-card::after{
  content:'';position:absolute;
  top:0;left:-100%;bottom:0;width:50%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.03),transparent);
  animation:sbShimmer 7s ease-in-out infinite;pointer-events:none;
}
@keyframes sbShimmer{0%{left:-100%}100%{left:220%}}
.sb-meta-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-bottom:1.4rem}
.sb-meta-item{display:flex;align-items:center;gap:.75rem}
.sb-meta-ico{
  width:40px;height:40px;border-radius:11px;
  background:rgba(123,92,245,.12);border:1px solid rgba(123,92,245,.22);
  display:flex;align-items:center;justify-content:center;
  color:#C4B1FF;flex-shrink:0;
  box-shadow:0 0 14px rgba(123,92,245,.15);
}
.sb-meta-lbl{font-size:.72rem;color:var(--text2);margin-bottom:.2rem;font-family:var(--font-m);letter-spacing:.04em}
.sb-meta-val{font-family:var(--font-d);font-size:.95rem;font-weight:700;color:var(--text)}
.sb-divider{height:1px;background:var(--border);margin-bottom:1.35rem}

/* Idea box */
.sb-idea-box{
  background:rgba(0,0,0,.22);
  border:1px solid var(--border);
  border-radius:12px;padding:1.25rem 1.4rem 1.25rem 4rem;
  position:relative;overflow:hidden;
}
.sb-idea-quote{
  position:absolute;top:.4rem;left:1rem;
  color:rgba(123,92,245,.18);font-family:var(--font-d);
  font-size:3.5rem;line-height:1;pointer-events:none;font-weight:900;
}
.sb-idea-label{font-size:.7rem;color:var(--text3);font-family:var(--font-m);letter-spacing:.06em;text-transform:uppercase;margin-bottom:.35rem}
.sb-idea-text{font-style:italic;font-size:.92rem;color:var(--text);line-height:1.68;position:relative;z-index:1}

/* ═══ EMPTY STATE ═══ */
.sb-empty{
  text-align:center;padding:4.5rem 2rem;
  display:flex;flex-direction:column;align-items:center;gap:1rem;
  animation:sbFadeUp .6s .15s var(--ease) both;
}
.sb-empty-ico{
  width:72px;height:72px;border-radius:20px;
  background:var(--gold-dim);border:1px solid rgba(245,166,35,.25);
  display:flex;align-items:center;justify-content:center;
  color:var(--gold);
  box-shadow:0 0 28px rgba(245,166,35,.15);
  animation:emptyPulse 3s ease-in-out infinite;
}
@keyframes emptyPulse{0%,100%{box-shadow:0 0 22px rgba(245,166,35,.12)}50%{box-shadow:0 0 38px rgba(245,166,35,.28)}}
.sb-empty-title{font-family:var(--font-d);font-size:1.35rem;font-weight:800;letter-spacing:-.4px;color:var(--text)}
.sb-empty-sub{font-size:.88rem;color:var(--text2);line-height:1.65;max-width:420px}
.sb-empty-sub strong{color:var(--text)}

/* ═══ MODULE DELIVERABLE CARDS ═══ */
.sb-modules-list{display:flex;flex-direction:column;gap:1.2rem}

.sb-mod-card{
  background:rgba(255,255,255,.03);
  border:1px solid var(--border);
  border-radius:var(--rl);
  overflow:hidden;
  transition:all .35s var(--ease);
  position:relative;
}
.sb-mod-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,var(--violet),var(--violet2),var(--emerald));
  transform:scaleX(0);transform-origin:left;
  transition:transform .45s var(--ease);
}
.sb-mod-card:hover{
  border-color:rgba(123,92,245,.28);
  box-shadow:0 20px 50px rgba(0,0,0,.3),0 0 0 1px rgba(123,92,245,.1);
  transform:translateY(-3px);
}
.sb-mod-card:hover::before{transform:scaleX(1)}
.sb-mod-card.expanded{border-color:rgba(123,92,245,.25)}
.sb-mod-card.expanded::before{transform:scaleX(1)}

/* Card header (clickable) */
.sb-mod-hdr{
  display:flex;align-items:center;gap:1rem;
  padding:1.3rem 1.5rem;cursor:pointer;
  transition:background .2s;user-select:none;
  -webkit-tap-highlight-color:transparent;
}
.sb-mod-hdr:hover{background:rgba(255,255,255,.02)}
.sb-mod-hdr-left{display:flex;align-items:center;gap:.85rem;flex:1;min-width:0}
.sb-mod-num-badge{
  width:38px;height:38px;border-radius:10px;
  background:var(--violet-dim);border:1px solid rgba(123,92,245,.22);
  display:flex;align-items:center;justify-content:center;
  font-family:var(--font-m);font-size:.68rem;font-weight:600;color:#C4B1FF;
  flex-shrink:0;transition:all .3s var(--ease);
}
.sb-mod-card:hover .sb-mod-num-badge,
.sb-mod-card.expanded .sb-mod-num-badge{
  background:rgba(123,92,245,.22);border-color:rgba(123,92,245,.45);
  box-shadow:0 0 14px rgba(123,92,245,.25);
}
.sb-mod-hdr-info{flex:1;min-width:0}
.sb-mod-title{
  font-family:var(--font-d);font-size:1rem;font-weight:700;letter-spacing:-.2px;
  color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.sb-mod-meta{display:flex;align-items:center;gap:.6rem;margin-top:.25rem;flex-wrap:wrap}
.sb-track-badge{
  display:inline-flex;align-items:center;gap:.3rem;
  padding:.2rem .6rem;border-radius:100px;
  background:var(--violet-dim);border:1px solid rgba(123,92,245,.2);
  color:#C4B1FF;font-size:.65rem;font-weight:600;font-family:var(--font-m);letter-spacing:.04em;
}
.sb-mod-count{font-size:.7rem;color:var(--text3);font-family:var(--font-m)}

.sb-mod-hdr-right{display:flex;align-items:center;gap:.75rem;flex-shrink:0}
.sb-chev{color:var(--text3);transition:transform .3s var(--ease)}
.sb-mod-card.expanded .sb-chev{transform:rotate(180deg)}

/* Answers table (inside collapsed card) */
.sb-answers-wrap{
  max-height:0;overflow:hidden;
  transition:max-height .45s var(--ease);
}
.sb-mod-card.expanded .sb-answers-wrap{max-height:9999px}

.sb-answers-inner{border-top:1px solid var(--border);padding:0 1.5rem 1.4rem}
.sb-answers-table{width:100%;border-collapse:collapse;margin-top:1rem;font-size:.875rem}
.sb-answers-table th{
  text-align:left;padding:.65rem .85rem;
  color:var(--text2);font-family:var(--font-m);font-size:.67rem;
  font-weight:500;letter-spacing:.06em;text-transform:uppercase;
  border-bottom:1px solid var(--border);
}
.sb-answers-table td{
  padding:.7rem .85rem;
  border-bottom:1px solid rgba(255,255,255,.03);
  vertical-align:top;
}
.sb-answers-table tr:last-child td{border-bottom:none}
.sb-answers-table tr:hover td{background:rgba(255,255,255,.015)}
.sb-field-label{
  font-weight:600;color:var(--text);width:32%;
  font-size:.84rem;line-height:1.5;
}
.sb-field-answer{
  color:var(--text2);line-height:1.65;font-size:.84rem;
  white-space:pre-wrap;
}
.sb-field-empty{font-style:italic;color:var(--text3);font-size:.82rem}

/* Answer row hover line */
.sb-answers-table tbody tr{transition:background .18s}

/* ═══ LOADING ═══ */
.sb-loading{
  display:flex;flex-direction:column;align-items:center;
  justify-content:center;height:80vh;gap:1.2rem;position:relative;z-index:2;
}
.sb-spin{
  width:44px;height:44px;border-radius:50%;
  border:3px solid rgba(123,92,245,.2);
  border-top-color:#7B5CF5;
  animation:spin .75s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg)}}
.sb-spin-txt{color:var(--text2);font-size:.88rem;font-family:var(--font-m)}

/* ═══ SCROLL REVEAL ═══ */
.sb-rev{opacity:0;transform:translateY(22px);transition:opacity .65s var(--ease),transform .65s var(--ease)}
.sb-rev.vis{opacity:1;transform:none}
@keyframes sbFadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}

/* ═══ RESPONSIVE ═══ */
@media(max-width:1100px){
  .sb-stats-row{grid-template-columns:repeat(2,1fr)}
  .sb-meta-grid{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:900px){
  .sb-main{margin-left:0}
  .sb-body{padding:1.25rem}
  .sb-page-hdr{flex-direction:column;align-items:flex-start}
  .sb-page-hdr-actions{width:100%}
  .sb-page-hdr-actions .btn-gold,
  .sb-page-hdr-actions .btn-outline-sm{flex:1;justify-content:center}
}
@media(max-width:640px){
  .sb-stats-row{grid-template-columns:1fr 1fr}
  .sb-meta-grid{grid-template-columns:1fr}
  .sb-topbar{padding:.75rem 1rem}
  .sb-answers-table{font-size:.8rem}
  .sb-field-label{width:38%}
  .sb-idea-box{padding:1.1rem 1rem 1.1rem 3.2rem}
}
@media(max-width:420px){
  .sb-stats-row{grid-template-columns:1fr}
}
`;

/* ═══════════════ ANIMATED COUNTER HOOK ═══════════════ */
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

/* ═══════════════ SCROLL REVEAL HOOK ═══════════════ */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } }),
      { threshold: .08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.sb-rev').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ═══════════════ STAT CARD ═══════════════ */
function StatCard({ label, rawVal, displaySuffix = '', sub, IconComp, icoClass, statColor, statBorder, delay }) {
  const counted = useCounter(rawVal || 0, 1000);
  return (
    <div className="sb-stat" style={{ '--sc': statColor, '--sb': statBorder, animationDelay: delay }}>
      <div className="sb-stat-top">
        <span className="sb-stat-label">{label}</span>
        <div className={`sb-stat-ico ${icoClass}`}><IconComp /></div>
      </div>
      <div className="sb-stat-val">{counted}{displaySuffix}</div>
      <div className="sb-stat-sub">{sub}</div>
    </div>
  );
}

/* ═══════════════ MODULE DELIVERABLE CARD ═══════════════ */
function ModuleCard({ mod, index }) {
  const [expanded, setExpanded] = useState(index === 0); // first card open by default
  const answeredCount = mod.answers.filter(a => a.answer && a.answer.trim()).length;

  return (
    <div className={`sb-mod-card sb-rev${expanded ? ' expanded' : ''}`} style={{ transitionDelay: `${index * 50}ms` }}>
      {/* Header — click to toggle */}
      <div className="sb-mod-hdr" onClick={() => setExpanded(v => !v)} role="button" aria-expanded={expanded}>
        <div className="sb-mod-hdr-left">
          <div className="sb-mod-num-badge">M{String(mod.moduleId).padStart(2, '0')}</div>
          <div className="sb-mod-hdr-info">
            <div className="sb-mod-title">{mod.title}</div>
            <div className="sb-mod-meta">
              <span className="sb-track-badge">
                <Icons.Layers s={10} />
                {mod.trackName}
              </span>
              <span className="sb-mod-count">
                {answeredCount}/{mod.answers.length} answered
              </span>
            </div>
          </div>
        </div>
        <div className="sb-mod-hdr-right">
          {answeredCount === mod.answers.length
            ? <span style={{ display:'inline-flex', alignItems:'center', gap:'.3rem', fontSize:'.68rem', color:'var(--emerald)', fontFamily:'var(--font-m)', padding:'.18rem .55rem', borderRadius:'100px', background:'rgba(6,214,160,.1)', border:'1px solid rgba(6,214,160,.22)' }}>
                <Icons.Check s={10} /> Complete
              </span>
            : <span style={{ display:'inline-flex', alignItems:'center', gap:'.3rem', fontSize:'.68rem', color:'#C4B1FF', fontFamily:'var(--font-m)', padding:'.18rem .55rem', borderRadius:'100px', background:'var(--violet-dim)', border:'1px solid rgba(123,92,245,.2)' }}>
                <Icons.Zap s={10} /> Partial
              </span>
          }
          <span className="sb-chev">
            {expanded ? <Icons.ChevUp s={15} /> : <Icons.ChevDown s={15} />}
          </span>
        </div>
      </div>

      {/* Answers (collapsed/expanded) */}
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
              {mod.answers.map((ans) => (
                <tr key={ans.fieldKey}>
                  <td className="sb-field-label">{ans.label}</td>
                  <td className="sb-field-answer">
                    {ans.answer && ans.answer.trim()
                      ? ans.answer
                      : <span className="sb-field-empty">Not answered yet</span>
                    }
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

/* ═══════════════════════════════════════════════════════════════════════════
   ENHANCED PDF GENERATION
═══════════════════════════════════════════════════════════════════════════ */
function generatePDF(briefData, user) {
  if (!briefData || briefData.length === 0) return;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PW = 210, PH = 297;
  const ML = 18, MR = 18, MT = 18;
  const CW = PW - ML - MR;
  let y = MT;

  const addPage = () => { doc.addPage(); y = MT; };
  const checkY = (needed = 20) => { if (y + needed > PH - 16) addPage(); };

  /* ── Cover block ── */
  // Deep background rect
  doc.setFillColor(7, 7, 15);
  doc.rect(0, 0, PW, 60, 'F');

  // Violet accent line
  doc.setFillColor(123, 92, 245);
  doc.rect(0, 60, PW, 1.5, 'F');

  // Logo gem (hexagon approximated as rect with rounded)
  doc.setFillColor(90, 55, 197);
  doc.roundedRect(ML, 18, 12, 12, 2, 2, 'F');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('M', ML + 4.5, 26.5);

  // Brand name
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(240, 239, 248);
  doc.text('Mind', ML + 16, 26.5);
  doc.setTextColor(157, 125, 255);
  doc.text('Launch', ML + 34, 26.5);

  // Title
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(240, 239, 248);
  doc.text('STARTUP BRIEF', ML, 46);

  // Date + region
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(139, 138, 168);
  doc.text(`Generated ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}  ·  Region: ${user.region || '—'}`, ML, 55);

  y = 72;

  /* ── Founder meta block ── */
  doc.setFillColor(14, 13, 28);
  doc.roundedRect(ML, y, CW, 36, 3, 3, 'F');
  doc.setDrawColor(123, 92, 245);
  doc.setLineWidth(.4);
  doc.roundedRect(ML, y, CW, 36, 3, 3, 'S');

  const col1 = ML + 8, col2 = ML + 70;

  doc.setFont('Helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(157, 125, 255);
  doc.text('FOUNDER', col1, y + 10);
  doc.text('CATEGORY', col1 + 60, y + 10);
  doc.text('MODULES', col1 + 120, y + 10);

  doc.setFont('Helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(240, 239, 248);
  doc.text(user.name || '—', col1, y + 20);
  doc.text(user.category || '—', col1 + 60, y + 20);
  doc.text(`${briefData.length} of 30`, col1 + 120, y + 20);

  y += 44;

  /* ── Startup idea ── */
  if (user.startupIdea) {
    checkY(28);
    doc.setFont('Helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(157, 125, 255);
    doc.text('CORE STARTUP IDEA', ML, y);
    y += 6;

    const lines = doc.splitTextToSize(`"${user.startupIdea}"`, CW - 6);
    const ideaH = lines.length * 5 + 10;
    doc.setFillColor(12, 11, 22);
    doc.roundedRect(ML, y, CW, ideaH, 2, 2, 'F');
    doc.setFont('Helvetica', 'bolditalic'); doc.setFontSize(9.5); doc.setTextColor(200, 195, 240);
    doc.text(lines, ML + 4, y + 7);
    y += ideaH + 10;
  }

  /* ── Module deliverables ── */
  briefData.forEach((mod, mi) => {
    checkY(22);

    // Module header bar
    doc.setFillColor(20, 16, 40);
    doc.roundedRect(ML, y, CW, 14, 2, 2, 'F');
    doc.setFillColor(123, 92, 245);
    doc.roundedRect(ML, y, 4, 14, 1, 1, 'F');

    doc.setFont('Helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(240, 239, 248);
    doc.text(`M${String(mod.moduleId).padStart(2,'0')}  ${mod.title}`, ML + 8, y + 9.5);

    doc.setFont('Helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(157, 125, 255);
    const trackW = doc.getTextWidth(mod.trackName);
    doc.text(mod.trackName, PW - MR - trackW, y + 9.5);
    y += 18;

    // Answer rows
    mod.answers.forEach((ans, ai) => {
      const labelLines = doc.splitTextToSize(ans.label + ':', 52);
      const ansLines   = doc.splitTextToSize(ans.answer || 'No response provided.', CW - 58);
      const rowH = Math.max(labelLines.length, ansLines.length) * 4.8 + 6;

      checkY(rowH + 2);

      if (ai % 2 === 0) {
        doc.setFillColor(255, 255, 255, 0.015);
        doc.rect(ML, y - 1, CW, rowH + 1, 'F');
      }

      doc.setFont('Helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(200, 195, 240);
      doc.text(labelLines, ML + 2, y + 4);

      doc.setFont('Helvetica', 'normal'); doc.setFontSize(8.5);
      doc.setTextColor(ans.answer ? 60 : 120, ans.answer ? 55 : 110, ans.answer ? 80 : 140);
      doc.text(ansLines, ML + 56, y + 4);

      // Light row separator
      doc.setDrawColor(30, 28, 50);
      doc.setLineWidth(.2);
      doc.line(ML, y + rowH, PW - MR, y + rowH);

      y += rowH + 2;
    });

    y += 8;
  });

  /* ── Footer on every page ── */
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(7, 7, 15);
    doc.rect(0, PH - 12, PW, 12, 'F');
    doc.setFont('Helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(61, 60, 86);
    doc.text('MindLaunch Startup Brief  ·  Confidential', ML, PH - 5);
    doc.text(`Page ${p} / ${totalPages}`, PW - MR - 20, PH - 5);
  }

  doc.save(`${(user.name || 'founder').toLowerCase().replace(/\s+/g, '_')}_startup_brief.pdf`);
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
const StartupBrief = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [briefData, setBriefData] = useState([]);
  const [loading,   setLoading]   = useState(true);

  const canvasRef  = useRef(null);
  const cursorRef  = useRef(null);
  const ringRef    = useRef(null);

  useReveal();

  /* Inject CSS + fonts once */
  useEffect(() => {
    injectFonts();
    let el = document.getElementById('sb-page-css');
    if (!el) { el = document.createElement('style'); el.id = 'sb-page-css'; document.head.appendChild(el); }
    el.textContent = CSS;
  }, []);

  /* Custom cursor */
  useEffect(() => {
    let rx=0,ry=0,tx=0,ty=0,raf;
    const move = e => { tx=e.clientX; ty=e.clientY; };
    window.addEventListener('mousemove', move, { passive:true });
    const loop = () => {
      raf = requestAnimationFrame(loop);
      rx+=(tx-rx)*.13; ry+=(ty-ry)*.13;
      if (cursorRef.current) { cursorRef.current.style.left=`${tx}px`; cursorRef.current.style.top=`${ty}px`; }
      if (ringRef.current)   { ringRef.current.style.left=`${rx}px`;   ringRef.current.style.top=`${ry}px`; }
    };
    loop();
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);

  /* Three.js background */
  useEffect(() => {
    let destroy;
    loadThree().then(() => {
      if (canvasRef.current) destroy = createBgParticles(canvasRef.current);
    });
    return () => destroy?.();
  }, []);

  /* Fetch brief data */
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/documents/brief`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) setBriefData(await res.json());
      } catch (err) {
        console.error('Error fetching brief:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  /* Derived stats */
  const totalAnswered = briefData.reduce((s, m) => s + m.answers.filter(a => a.answer?.trim()).length, 0);
  const totalFields   = briefData.reduce((s, m) => s + m.answers.length, 0);
  const completePct   = totalFields ? Math.round((totalAnswered / totalFields) * 100) : 0;

  /* ── Loading ── */
  if (loading) return (
    <>
      <div id="sb-cursor" ref={cursorRef} />
      <div id="sb-cursor-ring" ref={ringRef} />
      <div className="sb-noise" />
      <canvas id="sb-canvas" ref={canvasRef} />
      <div className="sb-loading">
        <div className="sb-spin" />
        <p className="sb-spin-txt">Loading startup brief...</p>
      </div>
    </>
  );

  return (
    <>
      {/* Cursor */}
      <div id="sb-cursor" ref={cursorRef} />
      <div id="sb-cursor-ring" ref={ringRef} />

      {/* BG */}
      <div className="sb-noise" />
      <canvas id="sb-canvas" ref={canvasRef} />

      <div className="sb-main">

          

          {/* Body */}
          <div className="sb-body">

            {/* ── Page header ── */}
            <div className="sb-page-hdr">
              <div className="sb-page-hdr-left">
                <div className="sb-page-eyebrow">
                  <div className="sb-page-eyebrow-dot" />
                  Startup Documents
                </div>
                <h1 className="sb-page-title">My Startup Brief</h1>
                <p className="sb-page-sub">
                  All completed module deliverables in one place — your investor-ready business profile.
                </p>
              </div>
              <div className="sb-page-hdr-actions">
                {briefData.length > 0 ? (
                  <button className="btn-gold" onClick={() => generatePDF(briefData, user)}>
                    <Icons.Download s={15} /> Download PDF
                  </button>
                ) : (
                  <button className="btn-gold disabled" disabled>
                    <Icons.Download s={15} /> No Deliverables Yet
                  </button>
                )}
                <Link to="/modules" className="btn-outline-sm">
                  <Icons.BookOpen s={14} /> Go to Modules
                </Link>
              </div>
            </div>

            {/* ── Stat cards ── */}
            <div className="sb-stats-row">
              <StatCard
                label="Modules Done" rawVal={briefData.length} displaySuffix="/30"
                sub="deliverables added"
                IconComp={() => <Icons.Modules s={15} />}
                icoClass="ico-v"
                statColor="rgba(123,92,245,.6)" statBorder="rgba(123,92,245,.28)"
                delay=".0s"
              />
              <StatCard
                label="Fields Answered" rawVal={totalAnswered}
                sub={`of ${totalFields} total`}
                IconComp={() => <Icons.Check s={15} />}
                icoClass="ico-e"
                statColor="rgba(6,214,160,.6)" statBorder="rgba(6,214,160,.28)"
                delay=".05s"
              />
              <StatCard
                label="Completion" rawVal={completePct} displaySuffix="%"
                sub="brief completeness"
                IconComp={() => <Icons.TrendUp s={15} />}
                icoClass="ico-g"
                statColor="rgba(245,166,35,.6)" statBorder="rgba(245,166,35,.28)"
                delay=".1s"
              />
              <StatCard
                label="Export Ready" rawVal={briefData.length > 0 ? 1 : 0} displaySuffix={briefData.length > 0 ? ' Yes' : ' No'}
                sub="PDF available"
                IconComp={() => <Icons.Award s={15} />}
                icoClass="ico-r"
                statColor="rgba(255,107,157,.6)" statBorder="rgba(255,107,157,.28)"
                delay=".15s"
              />
            </div>

            {/* ── Founder meta card ── */}
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
                    <div className="sb-idea-quote">"</div>
                    <div className="sb-idea-label">Core Startup Idea</div>
                    <p className="sb-idea-text">{user.startupIdea}</p>
                  </div>
                </>
              )}
            </div>

            {/* ── Empty state ── */}
            {briefData.length === 0 ? (
              <div className="sb-empty sb-rev">
                <div className="sb-empty-ico">
                  <Icons.Sparkles s={32} />
                </div>
                <h3 className="sb-empty-title">Your brief is waiting</h3>
                <p className="sb-empty-sub">
                  Complete module deliverables under <strong>My Modules</strong> to populate this sheet and build your investor-ready briefing document.
                </p>
                <Link to="/modules" className="btn-outline-sm" style={{ marginTop:'.5rem' }}>
                  <Icons.BookOpen s={14} /> Start First Module
                </Link>
              </div>
            ) : (
              <>
                {/* Section header */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap' }}>
                  <div>
                    <h2 style={{ fontFamily:'var(--font-d)', fontSize:'1.2rem', fontWeight:800, letterSpacing:'-.4px', color:'var(--text)', marginBottom:'.2rem' }}>
                      Completed Deliverables
                    </h2>
                    <p style={{ fontSize:'.82rem', color:'var(--text2)' }}>
                      Click any module card to expand and review your answers.
                    </p>
                  </div>
                  <span style={{ fontSize:'.72rem', color:'var(--text3)', fontFamily:'var(--font-m)', background:'rgba(255,255,255,.03)', border:'1px solid var(--border)', padding:'.28rem .75rem', borderRadius:'100px' }}>
                    {briefData.length} module{briefData.length !== 1 ? 's' : ''} · {totalAnswered} fields answered
                  </span>
                </div>

                {/* Module deliverable cards */}
                <div className="sb-modules-list">
                  {briefData.map((mod, i) => (
                    <ModuleCard key={mod.moduleId} mod={mod} index={i} />
                  ))}
                </div>

                {/* Bottom download CTA */}
                <div style={{
                  padding:'1px',
                  background:'linear-gradient(135deg,rgba(245,166,35,.5),rgba(255,107,157,.3),rgba(245,166,35,.25))',
                  borderRadius:'var(--rl)',
                  boxShadow:'0 0 50px rgba(245,166,35,.08)',
                  marginTop:'.5rem',
                }}>
                  <div style={{
                    background:'linear-gradient(135deg,rgba(20,14,30,.97),rgba(15,11,24,.97))',
                    borderRadius:'calc(var(--rl) - 1px)',
                    padding:'1.8rem 2.2rem',
                    display:'flex',alignItems:'center',justifyContent:'space-between',
                    gap:'1.5rem',flexWrap:'wrap',
                  }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                      <div style={{
                        width:52,height:52,borderRadius:14,
                        background:'linear-gradient(135deg,rgba(245,166,35,.2),rgba(245,166,35,.08))',
                        border:'1px solid rgba(245,166,35,.3)',
                        display:'flex',alignItems:'center',justifyContent:'center',
                        color:'var(--gold)',flexShrink:0,
                        boxShadow:'0 0 22px rgba(245,166,35,.18)',
                      }}>
                        <Icons.FileText s={22} />
                      </div>
                      <div>
                        <h3 style={{ fontFamily:'var(--font-d)', fontSize:'1.05rem', fontWeight:800, letterSpacing:'-.3px', marginBottom:'.25rem' }}>
                          Export to PDF
                        </h3>
                        <p style={{ fontSize:'.83rem', color:'var(--text2)', lineHeight:1.5 }}>
                          Download your full brief as a formatted PDF — share with mentors, advisors, or investors.
                        </p>
                      </div>
                    </div>
                    <button className="btn-gold" onClick={() => generatePDF(briefData, user)} style={{ flexShrink:0 }}>
                      <Icons.Download s={15} /> Download Brief PDF
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>{/* sb-body */}
        </div>{/* sb-main */}
    </>
  );
};

export default StartupBrief;