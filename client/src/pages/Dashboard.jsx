import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import * as THREE from 'three';

/*
  MindLaunch — Dashboard v2
  Matches LandingPage v4 + Register v2 theme exactly.
  Place at: src/pages/Dashboard.jsx
  Requires: npm install three react-router-dom lucide-react
*/

/* ── Font injection ── */
const injectFonts = () => {
  if (document.getElementById('ml-fonts')) return;
  const l = document.createElement('link');
  l.id = 'ml-fonts'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(l);
};

/* ── Three.js subtle particle background ── */
function createBgParticles(canvas) {
  const W = window.innerWidth, H = window.innerHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setSize(W, H);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(65, W / H, 0.1, 200);
  cam.position.z = 7;

  const COUNT = 220;
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
  const mat = new THREE.PointsMaterial({ size:.028, vertexColors:true, transparent:true, opacity:.45, sizeAttenuation:true });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);

  const starCount = 160, sGeo = new THREE.BufferGeometry(), sPos = new Float32Array(starCount*3);
  for (let i=0;i<starCount;i++) { sPos[i*3]=(Math.random()-.5)*40; sPos[i*3+1]=(Math.random()-.5)*28; sPos[i*3+2]=-10-Math.random()*10; }
  sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({ size:.014, color:0x6655cc, transparent:true, opacity:.28 })));

  let mx=0, my=0;
  const onMM = e => { mx=(e.clientX/innerWidth-.5)*2; my=-(e.clientY/innerHeight-.5)*2; };
  const onResize = () => { renderer.setSize(innerWidth, innerHeight); cam.aspect=innerWidth/innerHeight; cam.updateProjectionMatrix(); };
  window.addEventListener('mousemove', onMM, { passive:true });
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();
  let raf;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    cam.position.x += (mx*.25-cam.position.x)*.025;
    cam.position.y += (my*.18-cam.position.y)*.025;
    pts.rotation.y = clock.getElapsedTime()*.01;
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
   SVG ICONS — no emojis, no lucide import needed
══════════════════════════════════════════════════════════════ */
const Ic = ({ d, size=16, stroke="currentColor", sw=2, fill="none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p,i)=><path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);

const Icons = {
  Lock:       ({s=15}) => <Ic size={s} d={["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z","M7 11V7a5 5 0 0 1 10 0v4"]}/>,
  Check:      ({s=15}) => <Ic size={s} d="M20 6L9 17l-5-5"/>,
  CheckCircle:({s=15}) => <Ic size={s} d={["M22 11.08V12a10 10 0 1 1-5.93-9.14","M22 4L12 14.01l-3-3"]}/>,
  BookOpen:   ({s=15}) => <Ic size={s} d={["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z","M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]}/>,
  Arrow:      ({s=14}) => <Ic size={s} d={["M5 12h14","M12 5l7 7-7 7"]}/>,
  ArrowLeft:  ({s=14}) => <Ic size={s} d={["M19 12H5","M12 19l-7-7 7-7"]}/>,
  TrendUp:    ({s=15}) => <Ic size={s} d={["M22 7l-8.5 8.5-5-5L2 17","M16 7h6v6"]}/>,
  Sparkles:   ({s=15}) => <Ic size={s} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>,
  Award:      ({s=15}) => <Ic size={s} d={["M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z","M8.21 13.89L7 23l5-3 5 3-1.21-9.12"]}/>,
  User:       ({s=15}) => <Ic size={s} d={["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2","M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"]}/>,
  Globe:      ({s=15}) => <><Ic size={s} d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M2 12h20","M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"]}/></>,
  Bell:       ({s=15}) => <Ic size={s} d={["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 0 1-3.46 0"]}/>,
  Target:     ({s=15}) => <Ic size={s} d={["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z","M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"]}/>,
  Zap:        ({s=15}) => <Ic size={s} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>,
  Clock:      ({s=15}) => <Ic size={s} d={["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M12 6v6l4 2"]}/>,
  Star:       ({s=15}) => <Ic size={s} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" fill="currentColor"/>,
  Layout:     ({s=15}) => <Ic size={s} d={["M3 3h18v18H3z","M3 9h18","M9 21V9"]}/>,
  Edit:       ({s=15}) => <Ic size={s} d={["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7","M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"]}/>,
  ChevRight:  ({s=15}) => <Ic size={s} d="M9 18l6-6-6-6"/>,
  LogOut:     ({s=15}) => <Ic size={s} d={["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4","M16 17l5-5-5-5","M21 12H9"]}/>,
  Rocket:     ({s=15}) => <Ic size={s} d={["M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z","M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z","M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0","M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"]}/>,
  Filter:     ({s=15}) => <Ic size={s} d="M22 3H2l8 9.46V19l4 2v-8.54z"/>,
  Layers:     ({s=15}) => <Ic size={s} d={["M12 2L2 7l10 5 10-5-10-5z","M2 17l10 5 10-5","M2 12l10 5 10-5"]}/>,
  DollarSign: ({s=15}) => <Ic size={s} d={["M12 1v22","M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"]}/>,
  BarChart:   ({s=15}) => <Ic size={s} d={["M18 20V10","M12 20V4","M6 20v-6"]}/>,
  FileText:   ({s=15}) => <Ic size={s} d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"]}/>,
  Megaphone:  ({s=15}) => <Ic size={s} d={["M3 11l19-9-9 19-2-8-8-2z"]}/>,
};

/* ══════════════════════════════════════════════════════════════
   CSS
══════════════════════════════════════════════════════════════ */
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
:root{
  --ink:#04040C;--ink2:#080814;--ink3:#0E0D1C;
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
  --sidebar:260px;
}
body{background:var(--ink);color:var(--text);font-family:var(--font-b);overflow-x:hidden;cursor:none;min-height:100vh}

/* CURSOR */
#db-cursor{position:fixed;width:10px;height:10px;background:var(--violet2);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:screen;transition:width .2s var(--spring),height .2s var(--spring),background .2s}
#db-cursor-ring{position:fixed;width:34px;height:34px;border:1px solid rgba(123,92,245,.35);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%)}

/* CANVAS + NOISE */
#db-canvas{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none}
.db-noise{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.024;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* ── LAYOUT ── */
.db-shell{position:relative;z-index:2;display:flex;min-height:100vh}




/* ── TOPBAR ── */
.db-topbar{
  position:sticky;top:0;z-index:100;
  background:rgba(4,4,12,.75);backdrop-filter:blur(20px) saturate(150%);
  border-bottom:1px solid var(--border);
  padding:.85rem 2rem;
  display:flex;align-items:center;justify-content:space-between;gap:1rem;
}
.db-topbar-left{display:flex;flex-direction:column;gap:.1rem}
.db-topbar-title{font-family:var(--font-d);font-size:1.15rem;font-weight:700;letter-spacing:-.3px}
.db-topbar-sub{font-size:.78rem;color:var(--text2)}
.db-topbar-right{display:flex;align-items:center;gap:.8rem}
.db-icon-btn{
  width:36px;height:36px;border-radius:9px;
  background:rgba(255,255,255,.04);border:1px solid var(--border2);
  display:flex;align-items:center;justify-content:center;
  color:var(--text2);cursor:pointer;
  transition:all .2s var(--ease);position:relative;
}
.db-icon-btn:hover{color:var(--text);background:rgba(255,255,255,.08);border-color:rgba(123,92,245,.3)}
.db-notif-dot{
  position:absolute;top:6px;right:6px;
  width:6px;height:6px;border-radius:50%;
  background:var(--rose);border:1.5px solid var(--ink);
}
.db-hamburger{display:none;background:none;border:none;cursor:pointer;color:var(--text);padding:.3rem}

/* ── PAGE BODY ── */
.db-body{padding:2rem;display:flex;flex-direction:column;gap:2rem;flex:1}

/* ── UPGRADE BANNER ── */
.db-upgrade-banner{
  padding:1px;
  background:linear-gradient(135deg,rgba(245,166,35,.55),rgba(255,107,157,.35),rgba(245,166,35,.3));
  border-radius:16px;
  box-shadow:0 0 40px rgba(245,166,35,.1);
  animation:fadeUp .6s var(--ease) both;
}
.db-upgrade-in{
  background:linear-gradient(135deg,rgba(16,12,26,.97),rgba(12,9,22,.97));
  border-radius:15px;
  padding:1rem 1.4rem;
  display:flex;align-items:center;justify-content:space-between;
  gap:1rem;flex-wrap:wrap;
}
.db-upgrade-left{display:flex;align-items:center;gap:.8rem}
.db-demo-chip{
  padding:.24rem .65rem;border-radius:100px;
  background:linear-gradient(135deg,#F5A623,#FFD166);
  color:#0A0A14;font-size:.65rem;font-weight:800;
  letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;
  font-family:var(--font-m);
}
.db-upgrade-text{font-size:.875rem;color:var(--text);font-weight:500}
.db-upgrade-text span{color:var(--text2);font-weight:400}
.db-upgrade-btn{
  padding:.55rem 1.2rem;border-radius:10px;
  background:linear-gradient(135deg,#F5A623,#E08C0A);
  border:none;cursor:pointer;color:#0A0A14;
  font-family:var(--font-d);font-size:.82rem;font-weight:700;
  text-decoration:none;display:inline-flex;align-items:center;gap:.4rem;
  box-shadow:0 4px 16px rgba(245,166,35,.3);
  transition:all .25s var(--spring);white-space:nowrap;
}
.db-upgrade-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(245,166,35,.45)}

/* ── WELCOME ROW ── */
.db-welcome{
  display:flex;align-items:center;justify-content:space-between;
  gap:1rem;flex-wrap:wrap;
  animation:fadeUp .6s .05s var(--ease) both;
}
.db-welcome-h{font-family:var(--font-d);font-size:1.75rem;font-weight:800;letter-spacing:-1px;line-height:1.2}
.db-welcome-sub{font-size:.9rem;color:var(--text2);margin-top:.3rem}
.db-welcome-grad{background:linear-gradient(135deg,#C4B1FF,#7B5CF5,#9D7DFF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.db-welcome-gold{background:linear-gradient(135deg,#FFE066,#F5A623);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

/* ── STAT CARDS ── */
.db-stats-row{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:1rem;
  animation:fadeUp .6s .1s var(--ease) both;
}
.db-stat{
  background:rgba(255,255,255,.03);
  border:1px solid var(--border);
  border-radius:var(--rl);
  padding:1.25rem 1.4rem;
  display:flex;flex-direction:column;gap:.6rem;
  position:relative;overflow:hidden;
  transition:all .3s var(--ease);
}
.db-stat::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--stat-color,rgba(123,92,245,.6)) 50%,transparent);
  opacity:0;transition:opacity .3s;
}
.db-stat:hover{border-color:var(--stat-border,rgba(123,92,245,.3));transform:translateY(-3px);box-shadow:0 16px 40px rgba(0,0,0,.3)}
.db-stat:hover::before{opacity:1}
.db-stat-top{display:flex;align-items:center;justify-content:space-between}
.db-stat-label{font-size:.72rem;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;font-family:var(--font-m);font-weight:500}
.db-stat-icon{
  width:32px;height:32px;border-radius:8px;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
}
.db-stat-val{font-family:var(--font-d);font-size:2rem;font-weight:800;letter-spacing:-1.5px;line-height:1}
.db-stat-sub{font-size:.72rem;color:var(--text3);display:flex;align-items:center;gap:.3rem}
.db-stat-trend{font-size:.68rem;font-family:var(--font-m);padding:.1rem .4rem;border-radius:100px}
.db-stat-trend.up{background:rgba(6,214,160,.12);color:var(--emerald);border:1px solid rgba(6,214,160,.22)}

/* ── 2-COL GRID ── */
.db-grid2{
  display:grid;grid-template-columns:1fr 1fr;
  gap:1.5rem;
  animation:fadeUp .6s .15s var(--ease) both;
}

/* ── CARDS ── */
.db-card{
  background:rgba(255,255,255,.03);
  border:1px solid var(--border);
  border-radius:var(--rl);
  padding:1.6rem;
  display:flex;flex-direction:column;gap:1.2rem;
  transition:all .3s var(--ease);
  position:relative;overflow:hidden;
}
.db-card:hover{border-color:rgba(123,92,245,.22);box-shadow:0 20px 50px rgba(0,0,0,.25)}
.db-card-hdr{display:flex;align-items:center;justify-content:space-between;gap:.8rem}
.db-card-title{font-family:var(--font-d);font-size:1.05rem;font-weight:700;letter-spacing:-.3px}
.db-card-badge{
  padding:.22rem .65rem;border-radius:100px;
  font-size:.68rem;font-weight:600;font-family:var(--font-m);
  letter-spacing:.04em;text-transform:uppercase;
}
.badge-v{background:var(--violet-dim);color:#C4B1FF;border:1px solid rgba(123,92,245,.2)}
.badge-g{background:var(--gold-dim);color:var(--gold2);border:1px solid rgba(245,166,35,.2)}
.badge-e{background:var(--emerald-dim);color:#6EE7B7;border:1px solid rgba(6,214,160,.2)}

/* Startup idea box */
.db-idea-box{
  background:rgba(0,0,0,.25);
  border:1px solid var(--border);
  border-radius:12px;padding:1.1rem;
  flex:1;position:relative;overflow:hidden;
}
.db-idea-box::before{
  content:'"';
  position:absolute;top:-10px;left:10px;
  font-size:5rem;font-family:var(--font-d);
  color:rgba(123,92,245,.08);line-height:1;
  pointer-events:none;
}
.db-idea-text{
  font-style:italic;font-size:.9rem;color:var(--text);
  line-height:1.65;position:relative;z-index:1;
}
.db-card-footer{
  display:flex;align-items:center;justify-content:space-between;
  padding-top:1rem;border-top:1px solid var(--border);
  gap:.8rem;flex-wrap:wrap;
}
.db-region-tag{
  display:flex;align-items:center;gap:.4rem;
  font-size:.78rem;color:var(--text2);
}
.db-region-tag strong{color:var(--text)}

/* Progress card */
.db-prog-stats{display:grid;grid-template-columns:1fr 1fr;gap:.85rem}
.db-prog-stat{
  background:rgba(123,92,245,.07);
  border:1px solid rgba(123,92,245,.13);
  border-radius:12px;padding:1rem;text-align:center;
}
.db-prog-stat.gold{background:var(--gold-dim);border-color:rgba(245,166,35,.13)}
.db-prog-val{font-family:var(--font-d);font-size:1.6rem;font-weight:800;letter-spacing:-1px;line-height:1;color:var(--violet2)}
.db-prog-stat.gold .db-prog-val{color:var(--gold2)}
.db-prog-lbl{font-size:.68rem;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;font-family:var(--font-m);margin-top:.3rem}
.db-pbar-wrap{display:flex;flex-direction:column;gap:.45rem}
.db-pbar-hdr{display:flex;justify-content:space-between;font-size:.8rem;color:var(--text)}
.db-pbar-hdr strong{font-family:var(--font-m);color:var(--violet2)}
.db-pbar{height:7px;background:rgba(255,255,255,.07);border-radius:4px;overflow:hidden}
.db-pbar-fill{height:100%;background:linear-gradient(90deg,#7B5CF5,#9D7DFF,#06D6A0);border-radius:4px;transition:width 1.2s var(--ease)}

/* ── SECTION HEADER ── */
.db-sec-hdr{
  display:flex;align-items:center;justify-content:space-between;
  gap:1rem;flex-wrap:wrap;
  animation:fadeUp .6s .2s var(--ease) both;
}
.db-sec-title{font-family:var(--font-d);font-size:1.3rem;font-weight:800;letter-spacing:-.5px}
.db-sec-sub{font-size:.82rem;color:var(--text2);margin-top:.2rem}
.db-sec-link{
  color:var(--violet2);text-decoration:none;font-weight:600;font-size:.82rem;
  display:flex;align-items:center;gap:.3rem;
  transition:color .2s;white-space:nowrap;
}
.db-sec-link:hover{color:#C4B1FF}

/* ── FILTER PILLS ── */
.db-filters{
  display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;
  animation:fadeUp .6s .22s var(--ease) both;
}
.db-filter{
  padding:.32rem .85rem;border-radius:100px;
  font-size:.76rem;font-weight:500;font-family:var(--font-m);
  border:1px solid var(--border2);background:rgba(255,255,255,.03);
  color:var(--text2);cursor:pointer;
  transition:all .2s var(--ease);
}
.db-filter:hover{color:var(--text);border-color:rgba(123,92,245,.3)}
.db-filter.active{
  background:rgba(123,92,245,.12);
  border-color:rgba(123,92,245,.35);
  color:#C4B1FF;
}

/* ── MODULES GRID ── */
.db-modules-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
  gap:1.2rem;
  animation:fadeUp .6s .25s var(--ease) both;
}

/* ── MODULE CARD ── */
.db-mod{
  background:rgba(255,255,255,.03);
  border:1px solid var(--border);
  border-radius:var(--rl);
  padding:1.4rem;
  display:flex;flex-direction:column;gap:1rem;
  transition:all .35s var(--ease);
  position:relative;overflow:hidden;
}
.db-mod::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  transform:scaleX(0);transform-origin:left;
  transition:transform .4s var(--ease);
  border-radius:2px;
}
.db-mod.completed::before{background:linear-gradient(90deg,var(--emerald),#6EE7B7);transform:scaleX(1)}
.db-mod.unlocked:hover::before{background:linear-gradient(90deg,var(--violet),var(--violet2));transform:scaleX(1)}
.db-mod.locked{opacity:.7}
.db-mod.completed{border-color:rgba(6,214,160,.28)}
.db-mod.unlocked{border-color:rgba(123,92,245,.2)}
.db-mod:hover{transform:translateY(-4px);box-shadow:0 20px 48px rgba(0,0,0,.32)}
.db-mod.completed:hover{box-shadow:0 20px 48px rgba(6,214,160,.1),0 0 0 1px rgba(6,214,160,.2)}
.db-mod.unlocked:hover{box-shadow:0 20px 48px rgba(123,92,245,.12),0 0 0 1px rgba(123,92,245,.2)}

.db-mod-top{display:flex;align-items:center;justify-content:space-between}
.db-mod-num{
  font-family:var(--font-m);font-size:.65rem;font-weight:500;
  color:var(--text3);text-transform:uppercase;letter-spacing:.08em;
}
.db-status{
  display:inline-flex;align-items:center;gap:.3rem;
  padding:.22rem .65rem;border-radius:100px;
  font-size:.68rem;font-weight:600;font-family:var(--font-m);
}
.db-status.completed{background:rgba(6,214,160,.12);border:1px solid rgba(6,214,160,.25);color:var(--emerald)}
.db-status.unlocked{background:rgba(123,92,245,.1);border:1px solid rgba(123,92,245,.22);color:#C4B1FF}
.db-status.locked{background:rgba(245,166,35,.08);border:1px solid rgba(245,166,35,.18);color:var(--gold)}

.db-mod-ico{
  width:44px;height:44px;border-radius:12px;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
  transition:transform .3s var(--spring);
}
.db-mod:hover .db-mod-ico{transform:scale(1.1) rotate(-5deg)}
.ico-v{background:rgba(123,92,245,.12);border:1px solid rgba(123,92,245,.2);color:#C4B1FF}
.ico-g{background:var(--gold-dim);border:1px solid rgba(245,166,35,.2);color:var(--gold2)}
.ico-e{background:var(--emerald-dim);border:1px solid rgba(6,214,160,.2);color:#6EE7B7}
.ico-r{background:rgba(255,107,157,.08);border:1px solid rgba(255,107,157,.2);color:var(--rose)}

.db-mod-body{display:flex;align-items:flex-start;gap:.85rem}
.db-mod-info{flex:1}
.db-mod-title{font-family:var(--font-d);font-size:1rem;font-weight:700;letter-spacing:-.2px;margin-bottom:.3rem;transition:color .2s}
.db-mod.locked .db-mod-title{color:var(--text2)}
.db-mod-desc{font-size:.8rem;color:var(--text2);line-height:1.55}

.db-mod-footer{
  padding-top:1rem;border-top:1px solid var(--border);
  display:flex;align-items:center;gap:.7rem;
}
.db-mod-meta{display:flex;align-items:center;gap:.4rem;font-size:.72rem;color:var(--text3);font-family:var(--font-m)}

.mod-btn{
  margin-left:auto;padding:.48rem 1rem;border-radius:9px;
  font-family:var(--font-d);font-size:.8rem;font-weight:700;
  cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:.35rem;
  border:none;transition:all .22s var(--spring);
  white-space:nowrap;flex-shrink:0;
}
.mod-btn.primary{
  background:linear-gradient(135deg,#7B5CF5,#5B3CC5);color:#fff;
  box-shadow:0 4px 14px rgba(123,92,245,.28);
}
.mod-btn.primary:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(123,92,245,.42)}
.mod-btn.done{
  background:rgba(6,214,160,.12);color:var(--emerald);
  border:1px solid rgba(6,214,160,.25);
}
.mod-btn.done:hover{background:rgba(6,214,160,.2)}
.mod-btn.upgrade{
  background:linear-gradient(135deg,#F5A623,#E08C0A);color:#0A0A14;
  box-shadow:0 4px 14px rgba(245,166,35,.22);
}
.mod-btn.upgrade:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(245,166,35,.38)}
.mod-btn.locked-btn{
  background:rgba(255,255,255,.04);color:var(--text3);
  border:1px solid var(--border);cursor:not-allowed;
}

/* ── PITCH COACH CTA ── */
.db-coach-cta{
  padding:1px;
  background:linear-gradient(135deg,rgba(123,92,245,.55),rgba(245,166,35,.35),rgba(123,92,245,.2));
  border-radius:var(--rl);
  box-shadow:0 0 60px rgba(123,92,245,.1);
  animation:fadeUp .6s .3s var(--ease) both;
}
.db-coach-in{
  background:linear-gradient(135deg,#13102a,#18163a,#16142e);
  border-radius:calc(var(--rl) - 1px);
  padding:2rem 2.5rem;
  display:flex;align-items:center;justify-content:space-between;
  gap:2rem;flex-wrap:wrap;
}
.db-coach-icon{
  width:56px;height:56px;border-radius:16px;
  background:linear-gradient(135deg,rgba(123,92,245,.25),rgba(123,92,245,.1));
  border:1px solid rgba(123,92,245,.3);
  display:flex;align-items:center;justify-content:center;
  color:#C4B1FF;flex-shrink:0;
  box-shadow:0 0 24px rgba(123,92,245,.2);
  animation:iconPulse 3s ease-in-out infinite;
}
@keyframes iconPulse{0%,100%{box-shadow:0 0 18px rgba(123,92,245,.2)}50%{box-shadow:0 0 32px rgba(123,92,245,.4)}}
.db-coach-text h3{font-family:var(--font-d);font-size:1.2rem;font-weight:800;letter-spacing:-.4px;margin-bottom:.3rem}
.db-coach-text p{font-size:.875rem;color:var(--text2);line-height:1.6;max-width:480px}
.db-coach-acts{display:flex;gap:.75rem;flex-shrink:0;flex-wrap:wrap}
.btn-violet{
  padding:.65rem 1.5rem;border-radius:11px;
  background:linear-gradient(135deg,#7B5CF5,#5B3CC5);
  border:none;cursor:pointer;color:#fff;
  font-family:var(--font-d);font-size:.9rem;font-weight:700;
  text-decoration:none;display:inline-flex;align-items:center;gap:.45rem;
  box-shadow:0 0 0 1px rgba(123,92,245,.4),0 6px 20px rgba(123,92,245,.3);
  transition:all .25s var(--spring);
}
.btn-violet:hover{box-shadow:0 0 0 1px rgba(123,92,245,.6),0 10px 32px rgba(123,92,245,.45);transform:translateY(-2px)}
.btn-ghost-sm{
  padding:.65rem 1.5rem;border-radius:11px;
  border:1px solid rgba(123,92,245,.3);background:rgba(123,92,245,.06);
  cursor:pointer;color:var(--text);
  font-family:var(--font-d);font-size:.9rem;font-weight:600;
  text-decoration:none;display:inline-flex;align-items:center;gap:.45rem;
  transition:all .22s var(--ease);
}
.btn-ghost-sm:hover{border-color:rgba(123,92,245,.6);background:rgba(123,92,245,.12);transform:translateY(-1px)}

/* ── LOADING ── */
.db-loading{
  display:flex;flex-direction:column;align-items:center;
  justify-content:center;height:80vh;gap:1rem;
}
.db-spin{
  width:44px;height:44px;border-radius:50%;
  border:3px solid rgba(123,92,245,.2);
  border-top-color:#7B5CF5;
  animation:spin .75s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg)}}
.db-spin-txt{color:var(--text2);font-size:.9rem;font-family:var(--font-m)}

/* ── SCROLL REVEAL ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}

/* ── RESPONSIVE ── */
@media(max-width:1100px){.db-stats-row{grid-template-columns:repeat(2,1fr)}}
@media(max-width:900px){
  .db-grid2{grid-template-columns:1fr}
  .db-coach-in{flex-direction:column}
  .db-coach-acts{width:100%}
  .db-coach-acts .btn-violet,.db-coach-acts .btn-ghost-sm{flex:1;justify-content:center}
}
@media(max-width:768px){
  :root{--sidebar:0px}
  .db-sidebar{transform:translateX(-260px);width:260px}
  .db-sidebar.open{transform:translateX(0)}
  .db-main{margin-left:0}
  .db-hamburger{display:flex}
  .db-body{padding:1.25rem}
  .db-stats-row{grid-template-columns:1fr 1fr}
  .db-upgrade-in{flex-direction:column;align-items:flex-start}
  .db-upgrade-btn{width:100%;justify-content:center}
  .db-welcome-h{font-size:1.4rem}
}
@media(max-width:480px){
  .db-stats-row{grid-template-columns:1fr}
  .db-topbar{padding:.75rem 1rem}
}
`;

/* ── Track metadata ── */
const TRACK_META = {
  1: { name:'Foundations',  Icon:({s})=><Icons.Layers s={s}/>,  cls:'ico-v', color:'var(--violet2)' },
  2: { name:'Finance',      Icon:({s})=><Icons.DollarSign s={s}/>,cls:'ico-g', color:'var(--gold2)'   },
  3: { name:'Operations',   Icon:({s})=><Icons.Target s={s}/>,   cls:'ico-e', color:'var(--emerald)'  },
  4: { name:'Marketing',    Icon:({s})=><Icons.Megaphone s={s}/>, cls:'ico-r', color:'var(--rose)'    },
  5: { name:'Fundraising',  Icon:({s})=><Icons.Rocket s={s}/>,   cls:'ico-v', color:'var(--violet2)' },
};

/* ── Animated counter ── */
function useCounter(target, duration=1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return val;
}

/* ── Animated progress bar ── */
function ProgressBar({ pct }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 300); return () => clearTimeout(t); }, [pct]);
  return (
    <div className="db-pbar">
      <div className="db-pbar-fill" style={{ width: `${w}%` }} />
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ label, value, sub, trend, IconComp, icoClass, statColor, statBorder, delay }) {
  const num = parseInt(value) || 0;
  const counted = useCounter(num);
  const display = typeof value === 'string' && isNaN(parseInt(value)) ? value : `${counted}${String(value).replace(/^\d+/, '')}`;

  return (
    <div className="db-stat" style={{ '--stat-color': statColor, '--stat-border': statBorder, animationDelay: delay }}>
      <div className="db-stat-top">
        <span className="db-stat-label">{label}</span>
        <div className={`db-stat-icon ${icoClass}`}><IconComp s={16}/></div>
      </div>
      <div className="db-stat-val">{display}</div>
      <div className="db-stat-sub">
        {trend && <span className="db-stat-trend up">+{trend}</span>}
        <span>{sub}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const canvasRef     = useRef(null);
  const cursorRef     = useRef(null);
  const ringRef       = useRef(null);
  const bgDestroyRef  = useRef(null);

  /* Fetch data */
  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const [modRes, statRes] = await Promise.all([
          fetch(`${API_URL}/modules`,          { headers:{ 'Authorization':`Bearer ${token}` } }),
          fetch(`${API_URL}/profile/progress`, { headers:{ 'Authorization':`Bearer ${token}` } }),
        ]);
        if (modRes.ok)  setModules(await modRes.json());
        if (statRes.ok) setStats(await statRes.json());
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [token]);

  /* Inject CSS + fonts */
  useEffect(() => {
    injectFonts();
    let el = document.getElementById('db-css');
    if (!el) { el = document.createElement('style'); el.id = 'db-css'; document.head.appendChild(el); }
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

  /* BG particles */
  useEffect(() => {
    if (!canvasRef.current) return;
    bgDestroyRef.current = createBgParticles(canvasRef.current);
    return () => bgDestroyRef.current?.();
  }, []);

  /* Filter modules */
  const track1Modules = modules.filter(m => m.track === 1);
  const filteredModules = activeFilter === 'all' ? track1Modules
    : activeFilter === 'done' ? track1Modules.filter(m => m.status === 'completed')
    : activeFilter === 'active' ? track1Modules.filter(m => m.status === 'unlocked')
    : track1Modules.filter(m => m.status !== 'completed' && m.status !== 'unlocked');

  const completed = stats?.completedCount || 0;
  const pct = Math.round((completed / 30) * 100);

  /* Nav items */
  const navItems = [
    { label:'Dashboard',    Icon:Icons.Layout,   href:'/dashboard', active:true  },
    { label:'All Modules',  Icon:Icons.BookOpen, href:'/modules',   badge:'30'   },
    { label:'Pitch Coach',  Icon:Icons.Sparkles, href:'/pitch-coach',badge:'AI'  },
    { label:'My Brief',     Icon:Icons.FileText, href:'/brief'      },
    { label:'Progress',     Icon:Icons.BarChart, href:'/progress'   },
  ];

  /* ── Loading screen ── */
  if (loading) return (
    <>
      <div id="db-cursor" ref={cursorRef}/>
      <div id="db-cursor-ring" ref={ringRef}/>
      <div className="db-noise"/>
      <canvas id="db-canvas" ref={canvasRef}/>
      <div className="db-loading">
        <div className="db-spin"/>
        <p className="db-spin-txt">Loading Dashboard...</p>
      </div>
    </>
  );

  return (
    <>
      <div id="db-cursor" ref={cursorRef}/>
      <div id="db-cursor-ring" ref={ringRef}/>
      <div className="db-noise"/>
      <canvas id="db-canvas" ref={canvasRef}/>

      

      <div className="dashboard-content">

        

        {/* ── MAIN ── */}
        <main>

          {/* Topbar */}
          <div className="db-topbar">
            <div className="db-topbar-left">
              <div className="db-topbar-title">Dashboard</div>
              <div className="db-topbar-sub">Track 1: Foundations · {completed} of 30 modules complete</div>
            </div>
            <div className="db-topbar-right">
              <div className="db-icon-btn" title="Notifications">
                <Icons.Bell s={15}/>
                <div className="db-notif-dot"/>
              </div>
              <div className="db-icon-btn" onClick={() => navigate('/profile')} title="Profile">
                <Icons.User s={15}/>
              </div>
              

            </div>
          </div>

          {/* Body */}
          <div className="db-body">

            {/* Upgrade banner */}
            {user?.plan !== 'premium' && (
              <div className="db-upgrade-banner">
                <div className="db-upgrade-in">
                  <div className="db-upgrade-left">
                    <span className="db-demo-chip">Free Plan</span>
                    <p className="db-upgrade-text">
                      Module 1 is unlocked.{' '}
                      <span>Upgrade to access all 30 modules across 5 tracks.</span>
                    </p>
                  </div>
                  <Link to="/subscription" className="db-upgrade-btn">
                    Upgrade — ₹399/mo or ₹2,499/yr <Icons.Arrow s={13}/>
                  </Link>
                </div>
              </div>
            )}

            {/* Welcome */}
            <div className="db-welcome">
              <div>
                <h1 className="db-welcome-h">
                  Welcome back, <span className="db-welcome-grad">{user?.name?.split(' ')[0] || 'Founder'}</span>
                  <span className="db-welcome-gold"> ✦</span>
                </h1>
                <p className="db-welcome-sub">Build, validate, and pitch your startup to the world.</p>
              </div>
              <Link to="/pitch-coach" className="btn-violet" style={{ flexShrink:0 }}>
                <Icons.Sparkles s={14}/> Open Pitch Coach
              </Link>
            </div>

            {/* Stats */}
            <div className="db-stats-row">
              <StatCard
                label="Modules Done" value={`${completed}/30`}
                sub="of full curriculum" trend={completed > 0 ? completed : null}
                IconComp={Icons.CheckCircle} icoClass="ico-e"
                statColor="rgba(6,214,160,.6)" statBorder="rgba(6,214,160,.25)"
                delay=".0s"
              />
              <StatCard
                label="Completion" value={`${pct}%`}
                sub="keep going" trend={pct > 0 ? `${pct}%` : null}
                IconComp={Icons.TrendUp} icoClass="ico-v"
                statColor="rgba(123,92,245,.6)" statBorder="rgba(123,92,245,.25)"
                delay=".05s"
              />
              <StatCard
                label="Time on Platform" value={stats?.timeOnPlatform || '0m'}
                sub="total learning time"
                IconComp={Icons.Clock} icoClass="ico-g"
                statColor="rgba(245,166,35,.6)" statBorder="rgba(245,166,35,.25)"
                delay=".1s"
              />
              <StatCard
                label="Active Module" value={`#${stats?.currentModule || 1}`}
                sub="currently in progress"
                IconComp={Icons.Zap} icoClass="ico-r"
                statColor="rgba(255,107,157,.6)" statBorder="rgba(255,107,157,.25)"
                delay=".15s"
              />
            </div>

            {/* Startup brief + progress */}
            <div className="db-grid2">

              {/* Brief card */}
              <div className="db-card">
                <div className="db-card-hdr">
                  <h3 className="db-card-title">My Startup Brief</h3>
                  {user?.category && <span className="db-card-badge badge-v">{user.category}</span>}
                </div>
                <div className="db-idea-box">
                  <p className="db-idea-text">
                    {user?.startupIdea
                      ? `"${user.startupIdea}"`
                      : 'No startup idea described yet. Edit your profile to add one.'}
                  </p>
                </div>
                <div className="db-card-footer">
                  <div className="db-region-tag">
                    <Icons.Globe s={13}/>
                    Region: <strong>{user?.region || '—'}</strong>
                  </div>
                  <Link to="/profile" className="mod-btn done" style={{ marginLeft:0 }}>
                    <Icons.Edit s={12}/> Edit Brief
                  </Link>
                </div>
              </div>

              {/* Progress card */}
              <div className="db-card">
                <div className="db-card-hdr">
                  <h3 className="db-card-title">Learning Progress</h3>
                  <span className="db-card-badge badge-e">{pct}% done</span>
                </div>
                <div className="db-prog-stats">
                  <div className="db-prog-stat">
                    <div className="db-prog-val">{completed}</div>
                    <div className="db-prog-lbl">Completed</div>
                  </div>
                  <div className="db-prog-stat gold">
                    <div className="db-prog-val">{30 - completed}</div>
                    <div className="db-prog-lbl">Remaining</div>
                  </div>
                </div>
                <div className="db-pbar-wrap">
                  <div className="db-pbar-hdr">
                    <span>Curriculum Completion</span>
                    <strong>{pct}%</strong>
                  </div>
                  <ProgressBar pct={pct} />
                </div>
                <div className="db-card-footer">
                  <span style={{ fontSize:'.8rem', color:'var(--text2)' }}>
                    Active: <strong style={{ color:'var(--text)' }}>Module {stats?.currentModule || 1}</strong>
                  </span>
                  <Link to="/modules" className="mod-btn primary">
                    Resume <Icons.Arrow s={12}/>
                  </Link>
                </div>
              </div>
            </div>

            {/* Section header + filters */}
            <div style={{ display:'flex', flexDirection:'column', gap:'.85rem' }}>
              <div className="db-sec-hdr">
                <div>
                  <h2 className="db-sec-title">Track 1 — Foundations</h2>
                  <p className="db-sec-sub">Master customer validation and value propositions.</p>
                </div>
                <Link to="/modules" className="db-sec-link">
                  See all tracks <Icons.ChevRight s={14}/>
                </Link>
              </div>

              <div className="db-filters">
                {[['all','All'],['active','In Progress'],['done','Completed'],['locked','Locked']].map(([id, label]) => (
                  <button key={id} className={`db-filter${activeFilter===id?' active':''}`} onClick={() => setActiveFilter(id)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modules grid */}
            <div className="db-modules-grid">
              {filteredModules.length === 0 ? (
                <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'3rem', color:'var(--text3)', fontFamily:'var(--font-m)', fontSize:'.85rem' }}>
                  No modules in this filter.
                </div>
              ) : filteredModules.map((mod) => {
                const isCompleted = mod.status === 'completed';
                const isUnlocked  = mod.status === 'unlocked' || isCompleted;
                const track = TRACK_META[mod.track] || TRACK_META[1];
                const statusClass = isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked';

                return (
                  <div key={mod.moduleId} className={`db-mod ${statusClass}`}>

                    <div className="db-mod-top">
                      <span className="db-mod-num">Module {String(mod.moduleId).padStart(2,'0')}</span>
                      <span className={`db-status ${statusClass}`}>
                        {isCompleted
                          ? <><Icons.CheckCircle s={11}/> Complete</>
                          : isUnlocked
                          ? <><Icons.Zap s={11}/> Unlocked</>
                          : <><Icons.Lock s={11}/> Locked</>
                        }
                      </span>
                    </div>

                    <div className="db-mod-body">
                      <div className={`db-mod-ico ${track.cls}`}>
                        <track.Icon s={20}/>
                      </div>
                      <div className="db-mod-info">
                        <h3 className="db-mod-title">{mod.title}</h3>
                        <p className="db-mod-desc">
                          {isUnlocked
                            ? `Define and map key concepts for ${mod.title}. Produce an exportable deliverable.`
                            : 'Complete previous modules or upgrade to premium to unlock.'}
                        </p>
                      </div>
                    </div>

                    <div className="db-mod-footer">
                      <div className="db-mod-meta">
                        <Icons.Clock s={11}/> ~25 min
                      </div>
                      <div className="db-mod-meta">
                        <Icons.FileText s={11}/> Deliverable
                      </div>

                      {isUnlocked ? (
                        <Link to={`/modules/${mod.moduleId}`} className={`mod-btn ${isCompleted ? 'done' : 'primary'}`}>
                          {isCompleted ? <><Icons.BookOpen s={12}/> Review</> : <>Start <Icons.Arrow s={12}/></>}
                        </Link>
                      ) : user?.plan !== 'premium' ? (
                        <Link to="/subscription" className="mod-btn upgrade">
                          <Icons.Sparkles s={11}/> Upgrade
                        </Link>
                      ) : (
                        <span className="mod-btn locked-btn">
                          <Icons.Lock s={11}/> Locked
                        </span>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Pitch Coach CTA */}
            <div className="db-coach-cta">
              <div className="db-coach-in">
                <div className="db-coach-icon"><Icons.Sparkles s={24}/></div>
                <div className="db-coach-text">
                  <h3>Ready to pitch your idea?</h3>
                  <p>
                    Our Claude-powered Pitch Coach simulates a real VC session — fire your idea at it and get scored on Clarity, Market Fit, and Value Prop. Rebuild weak spots instantly.
                  </p>
                </div>
                <div className="db-coach-acts">
                  <Link to="/pitch-coach" className="btn-violet">
                    <Icons.Sparkles s={14}/> Start Session
                  </Link>
                  <Link to="/modules" className="btn-ghost-sm">
                    View All Modules
                  </Link>
                </div>
              </div>
            </div>

          </div>{/* db-body */}
        </main>
      </div>{/* db-shell */}
    </>
  );
};

export default Dashboard;