import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import {
  Document, Packer, Paragraph, TextRun,
  Table, TableRow, TableCell, BorderStyle, WidthType
} from 'docx';

/*
  MindLaunch — Documents.jsx v2
  ──────────────────────────────
  • Matches Dashboard + StartupBrief theme exactly
  • Self-contained Sidebar imported
  • Three.js particle bg (CDN, no extra import)
  • All SVG icons inline — zero emoji
  • Stat cards with animated counters
  • Module rows with hover glow, status chips, download actions
  • Full jsPDF + docx export preserved
  • Fully responsive
*/

/* ── Font injection ── */
const injectFonts = () => {
  if (document.getElementById('ml-fonts')) return;
  const l = document.createElement('link');
  l.id = 'ml-fonts'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(l);
};

/* ── Three.js CDN ── */
function loadThree() {
  if (typeof window.THREE !== 'undefined') return Promise.resolve();
  return new Promise(res => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload = res;
    document.head.appendChild(s);
  });
}

function createBgParticles(canvas) {
  const T = window.THREE;
  const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setSize(innerWidth, innerHeight);
  const scene = new T.Scene();
  const cam = new T.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 200);
  cam.position.z = 7;

  const COUNT = 200;
  const geo = new T.BufferGeometry();
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  const vel = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    pos[i*3]   = (Math.random()-.5)*30; pos[i*3+1]=(Math.random()-.5)*18; pos[i*3+2]=(Math.random()-.5)*12;
    vel[i] = .0005+Math.random()*.001;
    const t = Math.random();
    if      (t>.7)  { col[i*3]=.48;col[i*3+1]=.36;col[i*3+2]=.96; }
    else if (t>.45) { col[i*3]=.96;col[i*3+1]=.65;col[i*3+2]=.14; }
    else if (t>.25) { col[i*3]=.02;col[i*3+1]=.84;col[i*3+2]=.63; }
    else            { col[i*3]=1;  col[i*3+1]=.42;col[i*3+2]=.62; }
  }
  geo.setAttribute('position', new T.BufferAttribute(pos,3));
  geo.setAttribute('color',    new T.BufferAttribute(col,3));
  const pts = new T.Points(geo, new T.PointsMaterial({size:.026,vertexColors:true,transparent:true,opacity:.4,sizeAttenuation:true}));
  scene.add(pts);

  const sG=new T.BufferGeometry(), sP=new Float32Array(140*3);
  for(let i=0;i<140;i++){sP[i*3]=(Math.random()-.5)*40;sP[i*3+1]=(Math.random()-.5)*28;sP[i*3+2]=-10-Math.random()*8;}
  sG.setAttribute('position',new T.BufferAttribute(sP,3));
  scene.add(new T.Points(sG,new T.PointsMaterial({size:.012,color:0x6655cc,transparent:true,opacity:.22})));

  let mx=0,my=0;
  const onMM=e=>{mx=(e.clientX/innerWidth-.5)*2;my=-(e.clientY/innerHeight-.5)*2;};
  const onR=()=>{renderer.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();};
  window.addEventListener('mousemove',onMM,{passive:true});
  window.addEventListener('resize',onR);
  const clock=new T.Clock();
  let raf;
  const tick=()=>{
    raf=requestAnimationFrame(tick);
    cam.position.x+=(mx*.2-cam.position.x)*.025;
    cam.position.y+=(my*.15-cam.position.y)*.025;
    pts.rotation.y=clock.getElapsedTime()*.01;
    const pa=geo.attributes.position.array;
    for(let i=0;i<COUNT;i++){pa[i*3+1]+=vel[i];if(pa[i*3+1]>9)pa[i*3+1]=-9;}
    geo.attributes.position.needsUpdate=true;
    renderer.render(scene,cam);
  };
  tick();
  return ()=>{cancelAnimationFrame(raf);window.removeEventListener('mousemove',onMM);window.removeEventListener('resize',onR);renderer.dispose();};
}

/* ══════════════ INLINE SVG ICONS ══════════════ */
const Ic = ({paths, size=16, fill='none', stroke='currentColor', sw=2}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(paths)?paths:[paths]).map((d,i)=><path key={i} d={d}/>)}
  </svg>
);
const Icons = {
  Download:    ({s=16})=><Ic size={s} paths={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"]}/>,
  FileText:    ({s=16})=><Ic size={s} paths={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"]}/>,
  FileWord:    ({s=16})=><Ic size={s} paths={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M8 13h2l2 4 2-4h2"]}/>,
  Check:       ({s=16})=><Ic size={s} paths={["M20 6L9 17l-5-5"]}/>,
  CheckCircle: ({s=16})=><Ic size={s} paths={["M22 11.08V12a10 10 0 1 1-5.93-9.14","M22 4L12 14.01l-3-3"]}/>,
  Lock:        ({s=16})=><Ic size={s} paths={["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z","M7 11V7a5 5 0 0 1 10 0v4"]}/>,
  Sparkles:    ({s=16})=><Ic size={s} fill="currentColor" stroke="none" paths={["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"]}/>,
  Layers:      ({s=16})=><Ic size={s} paths={["M12 2L2 7l10 5 10-5-10-5z","M2 17l10 5 10-5","M2 12l10 5 10-5"]}/>,
  TrendUp:     ({s=16})=><Ic size={s} paths={["M22 7l-8.5 8.5-5-5L2 17","M16 7h6v6"]}/>,
  Folder:      ({s=16})=><Ic size={s} paths={["M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"]}/>,
  Award:       ({s=16})=><Ic size={s} paths={["M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z","M8.21 13.89L7 23l5-3 5 3-1.21-9.12"]}/>,
  Bell:        ({s=16})=><Ic size={s} paths={["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 0 1-3.46 0"]}/>,
  User:        ({s=16})=><Ic size={s} paths={["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2","M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"]}/>,
  Zap:         ({s=16})=><Ic size={s} fill="currentColor" stroke="none" paths={["M13 2L3 14h9l-1 8 10-12h-9l1-8z"]}/>,
  ChevRight:   ({s=16})=><Ic size={s} paths={["M9 18l6-6-6-6"]}/>,
  Filter:      ({s=16})=><Ic size={s} paths={["M22 3H2l8 9.46V19l4 2v-8.54z"]}/>,
  BookOpen:    ({s=16})=><Ic size={s} paths={["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z","M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]}/>,
  RefreshCw:   ({s=16})=><Ic size={s} paths={["M23 4v6h-6","M1 20v-6h6","M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"]}/>,
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
#dc-cursor{position:fixed;width:10px;height:10px;background:var(--violet2);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:screen;transition:width .2s var(--spring),height .2s var(--spring),background .2s}
#dc-cursor-ring{position:fixed;width:34px;height:34px;border:1px solid rgba(123,92,245,.35);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%)}

/* CANVAS + NOISE */
#dc-canvas{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none}
.dc-noise{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.024;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* ═══ LAYOUT ═══ */
.dc-main{
  width:100%;
  min-width:0;
  flex:1;
  display:flex;
  flex-direction:column;
  margin-left:0;
}
  
/* ═══ TOPBAR ═══ */
.dc-topbar{
  position:sticky;top:0;z-index:100;
  background:rgba(4,4,12,.78);backdrop-filter:blur(22px) saturate(150%);
  border-bottom:1px solid var(--border);
  padding:.88rem 2rem;
  display:flex;align-items:center;justify-content:space-between;gap:1rem;
}
.dc-topbar-left{display:flex;flex-direction:column;gap:.1rem}
.dc-topbar-title{font-family:var(--font-d);font-size:1.15rem;font-weight:700;letter-spacing:-.3px;color:var(--text)}
.dc-topbar-sub{font-size:.78rem;color:var(--text2)}
.dc-topbar-right{display:flex;align-items:center;gap:.7rem}
.dc-icon-btn{width:36px;height:36px;border-radius:9px;background:rgba(255,255,255,.04);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;color:var(--text2);cursor:pointer;transition:all .2s var(--ease)}
.dc-icon-btn:hover{color:var(--text);background:rgba(255,255,255,.08);border-color:rgba(123,92,245,.3)}

/* ═══ BODY ═══ */
.dc-body{padding:2rem;display:flex;flex-direction:column;gap:2rem;flex:1}

/* ═══ PAGE HEADER ═══ */
.dc-page-hdr{display:flex;align-items:flex-start;justify-content:space-between;gap:1.5rem;flex-wrap:wrap;animation:dcFade .6s var(--ease) both}
.dc-eyebrow{display:inline-flex;align-items:center;gap:.4rem;font-family:var(--font-m);font-size:.65rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--violet2);margin-bottom:.6rem}
.dc-eyebrow-dot{width:5px;height:5px;border-radius:50%;background:var(--violet2);box-shadow:0 0 8px var(--violet2);animation:dcPulse 2s ease-in-out infinite}
@keyframes dcPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}
.dc-page-title{font-family:var(--font-d);font-size:clamp(1.75rem,3.5vw,2.4rem);font-weight:800;letter-spacing:-1.5px;line-height:1.1;background:linear-gradient(135deg,var(--text),var(--violet2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:.4rem}
.dc-page-sub{font-size:.9rem;color:var(--text2);line-height:1.6;max-width:520px}
.dc-page-actions{display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;flex-shrink:0}

/* ═══ BUTTONS ═══ */
.btn-violet{padding:.65rem 1.35rem;border-radius:11px;background:linear-gradient(135deg,#7B5CF5,#5B3CC5);border:none;cursor:pointer;color:#fff;font-family:var(--font-d);font-size:.875rem;font-weight:700;display:inline-flex;align-items:center;gap:.4rem;box-shadow:0 0 0 1px rgba(123,92,245,.4),0 6px 20px rgba(123,92,245,.28);transition:all .25s var(--spring);white-space:nowrap}
.btn-violet:hover{transform:translateY(-2px);box-shadow:0 0 0 1px rgba(123,92,245,.6),0 10px 30px rgba(123,92,245,.42);filter:brightness(1.08)}
.btn-violet:disabled{opacity:.45;cursor:not-allowed;transform:none;filter:none}
.btn-gold{padding:.65rem 1.35rem;border-radius:11px;background:linear-gradient(135deg,#F5A623,#E08C0A);border:none;cursor:pointer;color:#0A0A14;font-family:var(--font-d);font-size:.875rem;font-weight:700;display:inline-flex;align-items:center;gap:.4rem;box-shadow:0 0 0 1px rgba(245,166,35,.4),0 6px 20px rgba(245,166,35,.28);transition:all .25s var(--spring);white-space:nowrap}
.btn-gold:hover{transform:translateY(-2px);box-shadow:0 0 0 1px rgba(245,166,35,.6),0 10px 30px rgba(245,166,35,.42)}
.btn-gold:disabled{opacity:.45;cursor:not-allowed;transform:none}
.btn-outline{padding:.58rem 1.1rem;border-radius:10px;border:1px solid rgba(123,92,245,.3);background:rgba(123,92,245,.06);cursor:pointer;color:var(--text);font-family:var(--font-d);font-size:.85rem;font-weight:600;display:inline-flex;align-items:center;gap:.38rem;transition:all .22s var(--ease);white-space:nowrap}
.btn-outline:hover{border-color:rgba(123,92,245,.65);background:rgba(123,92,245,.14);transform:translateY(-1px)}

/* small download buttons inside table */
.btn-sm{padding:.36rem .75rem;border-radius:8px;font-size:.73rem;font-weight:600;font-family:var(--font-d);cursor:pointer;display:inline-flex;align-items:center;gap:.3rem;transition:all .2s var(--ease);border:none;white-space:nowrap}
.btn-sm-pdf{background:rgba(123,92,245,.12);color:#C4B1FF;border:1px solid rgba(123,92,245,.22)}
.btn-sm-pdf:hover{background:rgba(123,92,245,.22);border-color:rgba(123,92,245,.45);transform:translateY(-1px)}
.btn-sm-word{background:var(--gold-dim);color:var(--gold2);border:1px solid rgba(245,166,35,.22)}
.btn-sm-word:hover{background:rgba(245,166,35,.2);border-color:rgba(245,166,35,.45);transform:translateY(-1px)}

/* ═══ STAT CARDS ═══ */
.dc-stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;animation:dcFade .6s .06s var(--ease) both}
.dc-stat{background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:var(--rl);padding:1.2rem 1.35rem;display:flex;flex-direction:column;gap:.55rem;position:relative;overflow:hidden;transition:all .3s var(--ease)}
.dc-stat::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--sc,rgba(123,92,245,.6)) 50%,transparent);opacity:0;transition:opacity .3s}
.dc-stat:hover{border-color:var(--sb,rgba(123,92,245,.28));transform:translateY(-3px);box-shadow:0 16px 38px rgba(0,0,0,.3)}
.dc-stat:hover::before{opacity:1}
.dc-stat-top{display:flex;align-items:center;justify-content:space-between}
.dc-stat-label{font-family:var(--font-m);font-size:.68rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--text2)}
.dc-stat-ico{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.dc-stat-val{font-family:var(--font-d);font-size:1.85rem;font-weight:800;letter-spacing:-1.5px;line-height:1}
.dc-stat-sub{font-size:.7rem;color:var(--text3);font-family:var(--font-m)}
.ico-v{background:var(--violet-dim);border:1px solid rgba(123,92,245,.18);color:#C4B1FF}
.ico-g{background:var(--gold-dim);border:1px solid rgba(245,166,35,.18);color:var(--gold2)}
.ico-e{background:var(--emerald-dim);border:1px solid rgba(6,214,160,.18);color:#6EE7B7}
.ico-r{background:rgba(255,107,157,.08);border:1px solid rgba(255,107,157,.18);color:var(--rose)}

/* ═══ AGGREGATE BRIEF CARD ═══ */
.dc-brief-card{
  padding:1px;
  background:linear-gradient(135deg,rgba(245,166,35,.55),rgba(255,107,157,.32),rgba(245,166,35,.25));
  border-radius:var(--rl);
  box-shadow:0 0 55px rgba(245,166,35,.08);
  animation:dcFade .6s .1s var(--ease) both;
}
.dc-brief-in{
  background:linear-gradient(135deg,rgba(20,14,32,.97),rgba(15,11,26,.97));
  border-radius:calc(var(--rl) - 1px);
  padding:2rem 2.2rem;
  display:flex;align-items:center;justify-content:space-between;
  gap:2rem;flex-wrap:wrap;
  position:relative;overflow:hidden;
}
/* shimmer */
.dc-brief-in::after{content:'';position:absolute;top:0;left:-100%;bottom:0;width:45%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.03),transparent);animation:dcShimmer 8s ease-in-out infinite;pointer-events:none}
@keyframes dcShimmer{0%{left:-100%}100%{left:220%}}
.dc-brief-left{display:flex;align-items:center;gap:1.35rem;flex:1;min-width:0}
.dc-brief-ico{
  width:54px;height:54px;border-radius:16px;
  background:linear-gradient(135deg,rgba(245,166,35,.22),rgba(245,166,35,.08));
  border:1px solid rgba(245,166,35,.32);
  display:flex;align-items:center;justify-content:center;color:var(--gold);
  flex-shrink:0;box-shadow:0 0 24px rgba(245,166,35,.18);
  animation:dcIcoPulse 3s ease-in-out infinite;
}
@keyframes dcIcoPulse{0%,100%{box-shadow:0 0 18px rgba(245,166,35,.15)}50%{box-shadow:0 0 32px rgba(245,166,35,.35)}}
.dc-brief-chip{display:inline-flex;align-items:center;gap:.3rem;padding:.2rem .6rem;border-radius:100px;background:linear-gradient(135deg,#F5A623,#FFD166);color:#0A0A14;font-size:.62rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;font-family:var(--font-m);margin-bottom:.4rem}
.dc-brief-title{font-family:var(--font-d);font-size:1.15rem;font-weight:800;letter-spacing:-.4px;color:var(--text);margin-bottom:.25rem}
.dc-brief-desc{font-size:.84rem;color:var(--text2);line-height:1.58}
.dc-brief-status{font-size:.75rem;color:var(--text3);font-family:var(--font-m);margin-top:.45rem}
.dc-brief-status strong{color:var(--text)}
.dc-brief-actions{display:flex;gap:.75rem;flex-shrink:0;flex-wrap:wrap}

/* ═══ FILTERS ═══ */
.dc-filters{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;animation:dcFade .6s .18s var(--ease) both}
.dc-filter{padding:.3rem .85rem;border-radius:100px;font-size:.75rem;font-weight:500;font-family:var(--font-m);border:1px solid var(--border2);background:rgba(255,255,255,.03);color:var(--text2);cursor:pointer;transition:all .2s var(--ease)}
.dc-filter:hover{color:var(--text);border-color:rgba(123,92,245,.3)}
.dc-filter.active{background:rgba(123,92,245,.12);border-color:rgba(123,92,245,.35);color:#C4B1FF}

/* ═══ SECTION HEADER ═══ */
.dc-sec-hdr{display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;animation:dcFade .6s .2s var(--ease) both}
.dc-sec-title{font-family:var(--font-d);font-size:1.2rem;font-weight:800;letter-spacing:-.4px}
.dc-sec-sub{font-size:.8rem;color:var(--text2);margin-top:.18rem}

/* ═══ MODULE LIST ═══ */
.dc-mod-list{display:flex;flex-direction:column;gap:.75rem;animation:dcFade .6s .22s var(--ease) both}

.dc-mod-row{
  background:rgba(255,255,255,.03);
  border:1px solid var(--border);
  border-radius:14px;
  padding:1.1rem 1.35rem;
  display:grid;
  grid-template-columns:2.2fr 1fr 1fr auto;
  align-items:center;gap:1.2rem;
  transition:all .3s var(--ease);
  position:relative;overflow:hidden;
}
.dc-mod-row::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,var(--violet),var(--violet2));border-radius:2px;transform:scaleY(0);transition:transform .35s var(--ease)}
.dc-mod-row:hover{border-color:rgba(123,92,245,.25);box-shadow:0 12px 35px rgba(0,0,0,.25);transform:translateX(3px)}
.dc-mod-row:hover::before{transform:scaleY(1)}
.dc-mod-row.dc-locked{opacity:.6}
.dc-mod-row.dc-completed{border-color:rgba(6,214,160,.18)}
.dc-mod-row.dc-completed::before{background:linear-gradient(180deg,var(--emerald),#6EE7B7)}

/* Left info */
.dc-mod-info{}
.dc-mod-num{font-family:var(--font-m);font-size:.62rem;color:var(--text3);letter-spacing:.06em;text-transform:uppercase;margin-bottom:.2rem}
.dc-mod-name{font-family:var(--font-d);font-size:.95rem;font-weight:700;letter-spacing:-.2px;color:var(--text)}
.dc-mod-row.dc-locked .dc-mod-name{color:var(--text2)}

/* Track chip */
.dc-track-chip{display:inline-flex;align-items:center;gap:.3rem;padding:.22rem .65rem;border-radius:100px;font-size:.65rem;font-weight:600;font-family:var(--font-m);background:var(--violet-dim);border:1px solid rgba(123,92,245,.2);color:#C4B1FF}

/* Status chip */
.dc-status{display:inline-flex;align-items:center;gap:.3rem;padding:.22rem .65rem;border-radius:100px;font-size:.68rem;font-weight:600;font-family:var(--font-m)}
.dc-status-done{background:rgba(6,214,160,.1);border:1px solid rgba(6,214,160,.24);color:var(--emerald)}
.dc-status-locked{background:rgba(255,255,255,.04);border:1px solid var(--border2);color:var(--text3)}

/* Download actions cell */
.dc-dl-actions{display:flex;gap:.5rem;justify-content:flex-end;flex-shrink:0;flex-wrap:wrap}
.dc-no-dl{font-size:.72rem;color:var(--text3);font-family:var(--font-m)}

/* ═══ LOADING ═══ */
.dc-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;height:80vh;gap:1.2rem;position:relative;z-index:2}
.dc-spin{width:44px;height:44px;border-radius:50%;border:3px solid rgba(123,92,245,.2);border-top-color:#7B5CF5;animation:spin .75s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.dc-spin-txt{color:var(--text2);font-size:.88rem;font-family:var(--font-m)}

/* ═══ EMPTY STATE ═══ */
.dc-empty{text-align:center;padding:4rem 2rem;display:flex;flex-direction:column;align-items:center;gap:1rem}
.dc-empty-ico{width:68px;height:68px;border-radius:18px;background:var(--violet-dim);border:1px solid rgba(123,92,245,.22);display:flex;align-items:center;justify-content:center;color:var(--violet2);box-shadow:0 0 24px rgba(123,92,245,.12);animation:dcIcoPulse2 3s ease-in-out infinite}
@keyframes dcIcoPulse2{0%,100%{box-shadow:0 0 18px rgba(123,92,245,.1)}50%{box-shadow:0 0 32px rgba(123,92,245,.25)}}
.dc-empty-title{font-family:var(--font-d);font-size:1.25rem;font-weight:800;letter-spacing:-.4px}
.dc-empty-sub{font-size:.87rem;color:var(--text2);line-height:1.65;max-width:400px}

/* ═══ SCROLL REVEAL ═══ */
.dc-rev{opacity:0;transform:translateY(22px);transition:opacity .65s var(--ease),transform .65s var(--ease)}
.dc-rev.vis{opacity:1;transform:none}
@keyframes dcFade{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}

/* ═══ RESPONSIVE ═══ */
@media(max-width:1100px){.dc-stats-row{grid-template-columns:repeat(2,1fr)}}
@media(max-width:900px){
  .dc-body{padding:1.25rem}
  .dc-page-hdr{flex-direction:column;align-items:flex-start}
  .dc-page-actions{width:100%}
  .dc-page-actions .btn-outline{flex:1;justify-content:center}
  .dc-brief-in{flex-direction:column;align-items:flex-start}
  .dc-brief-actions{width:100%}
  .dc-brief-actions .btn-gold,.dc-brief-actions .btn-violet{flex:1;justify-content:center}
  .dc-mod-row{grid-template-columns:1fr 1fr;grid-template-rows:auto auto;gap:.75rem}
  .dc-dl-actions{grid-column:1/-1;justify-content:flex-start}
}
@media(max-width:640px){
  .dc-stats-row{grid-template-columns:1fr 1fr}
  .dc-topbar{padding:.75rem 1rem}
  .dc-mod-row{grid-template-columns:1fr;gap:.6rem}
  .dc-dl-actions{flex-direction:row}
}
@media(max-width:420px){.dc-stats-row{grid-template-columns:1fr}}
`;

/* ══════════════ ANIMATED COUNTER ══════════════ */
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

/* ══════════════ SCROLL REVEAL ══════════════ */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } }),
      { threshold: .08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.dc-rev').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ══════════════ STAT CARD ══════════════ */
function StatCard({ label, raw, suffix='', sub, Ico, icoClass, sc, sb, delay }) {
  const counted = useCounter(raw||0, 900);
  return (
    <div className="dc-stat dc-rev" style={{'--sc':sc,'--sb':sb,transitionDelay:delay}}>
      <div className="dc-stat-top">
        <span className="dc-stat-label">{label}</span>
        <div className={`dc-stat-ico ${icoClass}`}><Ico /></div>
      </div>
      <div className="dc-stat-val">{counted}{suffix}</div>
      <div className="dc-stat-sub">{sub}</div>
    </div>
  );
}

/* ══════════════ PDF GENERATION (enhanced) ══════════════ */
function genModulePDF(mod, user) {
  const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
  const PW=210, ML=18, MR=18;
  let y = 18;

  doc.setFillColor(7,7,15); doc.rect(0,0,PW,46,'F');
  doc.setFillColor(123,92,245); doc.rect(0,46,PW,1.5,'F');

  doc.setFillColor(90,55,197); doc.roundedRect(ML,16,11,11,2,2,'F');
  doc.setFont('Helvetica','bold'); doc.setFontSize(8); doc.setTextColor(255,255,255);
  doc.text('M',ML+4,23);
  doc.setFontSize(12); doc.setTextColor(240,239,248);
  doc.text('Mind',ML+15,23);
  doc.setTextColor(157,125,255); doc.text('Launch',ML+33,23);

  doc.setFont('Helvetica','bold'); doc.setFontSize(16); doc.setTextColor(240,239,248);
  doc.text(mod.title, ML, 38);
  doc.setFont('Helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(139,138,168);
  doc.text(`Module ${mod.moduleId}  ·  ${mod.trackName}  ·  ${user.name}  ·  ${user.region||''}`, ML, 44);

  y = 58;
  const PH = doc.internal.pageSize.height;
  const CW = PW - ML - MR;

  mod.deliverableSchema.forEach((schema, ai) => {
    const ans = mod.deliverableAnswers?.[schema.fieldKey] || 'No answer provided.';
    const lLines = doc.splitTextToSize(schema.label+':', 50);
    const aLines = doc.splitTextToSize(ans, CW-56);
    const rowH = Math.max(lLines.length, aLines.length)*4.8+8;
    if (y+rowH > PH-16) { doc.addPage(); y=18; }

    if (ai%2===0) { doc.setFillColor(12,11,22); doc.rect(ML,y-2,CW,rowH,'F'); }
    doc.setDrawColor(30,28,50); doc.setLineWidth(.2); doc.line(ML,y+rowH-2,PW-MR,y+rowH-2);

    doc.setFont('Helvetica','bold'); doc.setFontSize(8.5); doc.setTextColor(200,195,240);
    doc.text(lLines, ML+2, y+4);
    doc.setFont('Helvetica','normal'); doc.setTextColor(ans.length>3?60:110, ans.length>3?55:100, ans.length>3?80:135);
    doc.text(aLines, ML+54, y+4);
    y += rowH;
  });

  // Footer
  const total = doc.internal.getNumberOfPages();
  for (let p=1;p<=total;p++) {
    doc.setPage(p);
    doc.setFillColor(7,7,15); doc.rect(0,PH-11,PW,11,'F');
    doc.setFont('Helvetica','normal'); doc.setFontSize(7); doc.setTextColor(61,60,86);
    doc.text('MindLaunch Deliverable  ·  Confidential', ML, PH-4.5);
    doc.text(`Page ${p}/${total}`, PW-MR-16, PH-4.5);
  }

  doc.save(`module_${mod.moduleId}_${mod.title.toLowerCase().replace(/\s+/g,'_')}.pdf`);
}

async function genModuleWord(mod, user) {
  const headerRow = new TableRow({ children: [
    new TableCell({ width:{size:35,type:WidthType.PERCENTAGE}, shading:{fill:'5B3CC5'}, children:[new Paragraph({children:[new TextRun({text:'Field',bold:true,color:'FFFFFF'})]})] }),
    new TableCell({ width:{size:65,type:WidthType.PERCENTAGE}, shading:{fill:'5B3CC5'}, children:[new Paragraph({children:[new TextRun({text:'Response',bold:true,color:'FFFFFF'})]})] }),
  ]});
  const rows = [headerRow, ...mod.deliverableSchema.map(s => new TableRow({ children:[
    new TableCell({shading:{fill:'F4F3FF'},children:[new Paragraph({children:[new TextRun({text:s.label,bold:true})]})] }),
    new TableCell({children:[new Paragraph({text:mod.deliverableAnswers?.[s.fieldKey]||'No response provided.'})]})
  ]}) )];

  const docx = new Document({ sections:[{ children:[
    new Paragraph({children:[new TextRun({text:`MindLaunch: ${mod.title}`,bold:true,size:32})]}),
    new Paragraph({children:[new TextRun({text:`Module ${mod.moduleId} · ${mod.trackName} · ${user.name}`,italics:true,color:'7B5CF5'})]}),
    new Paragraph({text:''}),
    new Table({width:{size:100,type:WidthType.PERCENTAGE},borders:{top:{style:BorderStyle.SINGLE,size:1,color:'CCCCCC'},bottom:{style:BorderStyle.SINGLE,size:1,color:'CCCCCC'},left:{style:BorderStyle.SINGLE,size:1,color:'CCCCCC'},right:{style:BorderStyle.SINGLE,size:1,color:'CCCCCC'}},rows}),
  ]}]});

  const blob = await Packer.toBlob(docx);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url; a.download=`module_${mod.moduleId}_${mod.title.toLowerCase().replace(/\s+/g,'_')}.docx`;
  a.click(); URL.revokeObjectURL(url);
}

async function genBriefWord(modules, user) {
  const completed = modules.filter(m=>m.status==='completed');
  if (!completed.length) return;

  const children = [
    new Paragraph({children:[new TextRun({text:'MINDLAUNCH STARTUP BRIEF',bold:true,size:44,color:'0F0F1A'})]}),
    new Paragraph({children:[new TextRun({text:`${user.name}  ·  ${user.category}  ·  ${user.region}`,bold:true,color:'7B5CF5'})]}),
    user.startupIdea ? new Paragraph({children:[new TextRun({text:`"${user.startupIdea}"`,italics:true})]}) : null,
    new Paragraph({text:''}),
  ].filter(Boolean);

  completed.forEach(mod => {
    children.push(new Paragraph({children:[new TextRun({text:`Module ${mod.moduleId}: ${mod.title} (${mod.trackName})`,bold:true,size:26,color:'7B5CF5'})]}));
    children.push(new Paragraph({text:''}));
    const rows = [
      new TableRow({children:[
        new TableCell({shading:{fill:'5B3CC5'},children:[new Paragraph({children:[new TextRun({text:'Field',bold:true,color:'FFFFFF'})]})] }),
        new TableCell({shading:{fill:'5B3CC5'},children:[new Paragraph({children:[new TextRun({text:'Response',bold:true,color:'FFFFFF'})]})] }),
      ]}),
      ...mod.deliverableSchema.map(s=>new TableRow({children:[
        new TableCell({shading:{fill:'F4F3FF'},children:[new Paragraph({children:[new TextRun({text:s.label,bold:true})]})]}),
        new TableCell({children:[new Paragraph({text:mod.deliverableAnswers?.[s.fieldKey]||'No response provided.'})]}),
      ]})),
    ];
    children.push(new Table({width:{size:100,type:WidthType.PERCENTAGE},borders:{top:{style:BorderStyle.SINGLE,size:1,color:'CCCCCC'},bottom:{style:BorderStyle.SINGLE,size:1,color:'CCCCCC'},left:{style:BorderStyle.SINGLE,size:1,color:'CCCCCC'},right:{style:BorderStyle.SINGLE,size:1,color:'CCCCCC'}},rows}));
    children.push(new Paragraph({text:''}));
    children.push(new Paragraph({text:''}));
  });

  const docx = new Document({sections:[{children}]});
  const blob = await Packer.toBlob(docx);
  const url = URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download=`${(user.name||'founder').toLowerCase().replace(/\s+/g,'_')}_startup_brief.docx`;
  a.click(); URL.revokeObjectURL(url);
}

function genBriefPDF(modules, user) {
  const completed = modules.filter(m=>m.status==='completed');
  if (!completed.length) return;

  const doc = new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
  const PW=210, ML=18, MR=18, PH=doc.internal.pageSize.height;
  const CW=PW-ML-MR;
  let y=18;

  // Cover
  doc.setFillColor(7,7,15); doc.rect(0,0,PW,62,'F');
  doc.setFillColor(123,92,245); doc.rect(0,62,PW,1.5,'F');
  doc.setFillColor(90,55,197); doc.roundedRect(ML,16,12,12,2,2,'F');
  doc.setFont('Helvetica','bold'); doc.setFontSize(9); doc.setTextColor(255,255,255);
  doc.text('M',ML+4.5,24.5);
  doc.setFontSize(14); doc.setTextColor(240,239,248); doc.text('Mind',ML+17,24.5);
  doc.setTextColor(157,125,255); doc.text('Launch',ML+37,24.5);
  doc.setFontSize(22); doc.setTextColor(240,239,248);
  doc.text('STARTUP BRIEF', ML, 44);
  doc.setFont('Helvetica','normal'); doc.setFontSize(9); doc.setTextColor(139,138,168);
  doc.text(`${user.name}  ·  ${user.category}  ·  ${user.region}  ·  ${new Date().toLocaleDateString('en-IN',{dateStyle:'medium'})}`, ML, 54);

  y = 76;

  if (user.startupIdea) {
    const lines = doc.splitTextToSize(`"${user.startupIdea}"`, CW-8);
    const h = lines.length*5+10;
    if (y+h>PH-16){doc.addPage();y=18;}
    doc.setFillColor(12,11,22); doc.roundedRect(ML,y,CW,h,2,2,'F');
    doc.setFont('Helvetica','bolditalic'); doc.setFontSize(9); doc.setTextColor(200,195,240);
    doc.text(lines,ML+4,y+7);
    y+=h+12;
  }

  completed.forEach(mod => {
    if(y>PH-38){doc.addPage();y=18;}
    doc.setFillColor(20,16,40); doc.roundedRect(ML,y,CW,14,2,2,'F');
    doc.setFillColor(123,92,245); doc.roundedRect(ML,y,4,14,1,1,'F');
    doc.setFont('Helvetica','bold'); doc.setFontSize(10); doc.setTextColor(240,239,248);
    doc.text(`M${String(mod.moduleId).padStart(2,'0')}  ${mod.title}`,ML+8,y+9.5);
    doc.setFont('Helvetica','normal'); doc.setFontSize(8); doc.setTextColor(157,125,255);
    const tw=doc.getTextWidth(mod.trackName);
    doc.text(mod.trackName,PW-MR-tw,y+9.5);
    y+=18;

    mod.deliverableSchema.forEach((s,ai)=>{
      const ans=mod.deliverableAnswers?.[s.fieldKey]||'No response.';
      const lL=doc.splitTextToSize(s.label+':',52);
      const aL=doc.splitTextToSize(ans,CW-58);
      const rH=Math.max(lL.length,aL.length)*4.8+6;
      if(y+rH>PH-16){doc.addPage();y=18;}
      if(ai%2===0){doc.setFillColor(12,11,22);doc.rect(ML,y-1,CW,rH+1,'F');}
      doc.setDrawColor(30,28,50);doc.setLineWidth(.2);doc.line(ML,y+rH,PW-MR,y+rH);
      doc.setFont('Helvetica','bold');doc.setFontSize(8.5);doc.setTextColor(200,195,240);
      doc.text(lL,ML+2,y+4);
      doc.setFont('Helvetica','normal');doc.setTextColor(ans.length>3?60:110,ans.length>3?55:100,ans.length>3?80:135);
      doc.text(aL,ML+56,y+4);
      y+=rH+2;
    });
    y+=8;
  });

  const total=doc.internal.getNumberOfPages();
  for(let p=1;p<=total;p++){
    doc.setPage(p);
    doc.setFillColor(7,7,15);doc.rect(0,PH-11,PW,11,'F');
    doc.setFont('Helvetica','normal');doc.setFontSize(7);doc.setTextColor(61,60,86);
    doc.text('MindLaunch Startup Brief  ·  Confidential',ML,PH-4.5);
    doc.text(`Page ${p}/${total}`,PW-MR-16,PH-4.5);
  }

  doc.save(`${(user.name||'founder').toLowerCase().replace(/\s+/g,'_')}_startup_brief.pdf`);
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const Documents = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [modules,        setModules]        = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [activeFilter,   setActiveFilter]   = useState('all');

  const canvasRef  = useRef(null);
  const cursorRef  = useRef(null);
  const ringRef    = useRef(null);

  useReveal();

  /* CSS + fonts */
  useEffect(() => {
    injectFonts();
    let el = document.getElementById('dc-css');
    if (!el) { el=document.createElement('style'); el.id='dc-css'; document.head.appendChild(el); }
    el.textContent = CSS;
  }, []);

  /* Cursor */
  useEffect(() => {
    let rx=0,ry=0,tx=0,ty=0,raf;
    const move=e=>{tx=e.clientX;ty=e.clientY;};
    window.addEventListener('mousemove',move,{passive:true});
    const loop=()=>{
      raf=requestAnimationFrame(loop);
      rx+=(tx-rx)*.13;ry+=(ty-ry)*.13;
      if(cursorRef.current){cursorRef.current.style.left=`${tx}px`;cursorRef.current.style.top=`${ty}px`;}
      if(ringRef.current){ringRef.current.style.left=`${rx}px`;ringRef.current.style.top=`${ry}px`;}
    };
    loop();
    return ()=>{window.removeEventListener('mousemove',move);cancelAnimationFrame(raf);};
  },[]);

  /* BG particles */
  useEffect(()=>{
    let destroy;
    loadThree().then(()=>{if(canvasRef.current)destroy=createBgParticles(canvasRef.current);});
    return ()=>destroy?.();
  },[]);

  /* Fetch */
  useEffect(()=>{
    if(!token)return;
    (async()=>{
      try{
        const res=await fetch(`${API_URL}/modules`,{headers:{'Authorization':`Bearer ${token}`}});
        if(res.ok)setModules(await res.json());
      }catch(e){console.error(e);}
      finally{setLoading(false);}
    })();
  },[token]);

  const completed  = modules.filter(m=>m.status==='completed');
  const totalCount = modules.length;
  const doneCount  = completed.length;
  const pdfCount   = doneCount;   // one PDF per completed module
  const wordCount  = doneCount;

  const FILTERS = [
    { id:'all',       label:'All Modules' },
    { id:'completed', label:'Completed'   },
    { id:'locked',    label:'Locked'      },
  ];

  const filtered =
    activeFilter==='completed' ? modules.filter(m=>m.status==='completed')
    : activeFilter==='locked'  ? modules.filter(m=>m.status!=='completed')
    : modules;

  /* ── Loading ── */
  if (loading) return (
    <>
      <div id="dc-cursor" ref={cursorRef}/>
      <div id="dc-cursor-ring" ref={ringRef}/>
      <div className="dc-noise"/>
      <canvas id="dc-canvas" ref={canvasRef}/>
      <div className="dc-loading">
        <div className="dc-spin"/>
        <p className="dc-spin-txt">Loading document hub...</p>
      </div>
    </>
  );

  return (
    <>
      <div id="dc-cursor" ref={cursorRef}/>
      <div id="dc-cursor-ring" ref={ringRef}/>
      <div className="dc-noise"/>
      <canvas id="dc-canvas" ref={canvasRef}/>

      <div className="dc-main">

          

          <div className="dc-body">

            {/* ── Page header ── */}
            <div className="dc-page-hdr">
              <div>
                <div className="dc-eyebrow"><div className="dc-eyebrow-dot"/> My Documents</div>
                <h1 className="dc-page-title">Document Hub</h1>
                <p className="dc-page-sub">Download individual module worksheets or your full aggregated startup brief — in PDF or Word format.</p>
              </div>
              <div className="dc-page-actions">
                <button className="btn-outline" onClick={()=>navigate('/startup-brief')}>
                  <Icons.FileText s={14}/> View Brief
                </button>
              </div>
            </div>

            {/* ── Stat cards ── */}
            <div className="dc-stats-row">
              <StatCard label="Modules Done"  raw={doneCount}  suffix={`/${totalCount}`} sub="worksheets unlocked" Ico={()=><Icons.CheckCircle s={15}/>} icoClass="ico-e" sc="rgba(6,214,160,.6)"   sb="rgba(6,214,160,.28)"   delay="0s"/>
              <StatCard label="PDFs Available" raw={pdfCount}  sub="ready to download"   Ico={()=><Icons.FileText s={15}/>}  icoClass="ico-v" sc="rgba(123,92,245,.6)"  sb="rgba(123,92,245,.28)"  delay=".05s"/>
              <StatCard label="Word Files"     raw={wordCount} sub="ready to download"   Ico={()=><Icons.FileWord s={15}/>} icoClass="ico-g" sc="rgba(245,166,35,.6)"  sb="rgba(245,166,35,.28)"  delay=".1s"/>
              <StatCard label="Briefs"         raw={doneCount>0?1:0} suffix={doneCount>0?' Ready':' Pending'} sub="aggregate brief status" Ico={()=><Icons.Award s={15}/>} icoClass="ico-r" sc="rgba(255,107,157,.6)" sb="rgba(255,107,157,.28)" delay=".15s"/>
            </div>

            {/* ── Aggregate brief card ── */}
            <div className="dc-brief-card">
              <div className="dc-brief-in">
                <div className="dc-brief-left">
                  <div className="dc-brief-ico"><Icons.Sparkles s={22}/></div>
                  <div>
                    <div className="dc-brief-chip"><Icons.Sparkles s={10}/> Aggregate Dossier</div>
                    <div className="dc-brief-title">Complete Startup Brief</div>
                    <div className="dc-brief-desc">Consolidates all answers from every completed module into one unified plan — ready for investor review.</div>
                    <div className="dc-brief-status">Status: <strong>{doneCount}/30 modules completed</strong></div>
                  </div>
                </div>
                <div className="dc-brief-actions">
                  {doneCount > 0 ? (
                    <>
                      <button className="btn-outline" onClick={()=>genBriefPDF(modules,user)}>
                        <Icons.Download s={14}/> PDF Brief
                      </button>
                      <button className="btn-gold" onClick={()=>genBriefWord(modules,user)}>
                        <Icons.Download s={14}/> Word Brief
                      </button>
                    </>
                  ) : (
                    <button className="btn-violet" disabled>
                      <Icons.Lock s={14}/> Complete modules first
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── Section header + filters ── */}
            <div style={{display:'flex',flexDirection:'column',gap:'.85rem'}}>
              <div className="dc-sec-hdr">
                <div>
                  <h2 className="dc-sec-title">Module Worksheets</h2>
                  <p className="dc-sec-sub">Download individual deliverable worksheets per module.</p>
                </div>
                <div className="dc-filters">
                  {FILTERS.map(f=>(
                    <button key={f.id} className={`dc-filter${activeFilter===f.id?' active':''}`} onClick={()=>setActiveFilter(f.id)}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Module rows ── */}
            {filtered.length === 0 ? (
              <div className="dc-empty dc-rev">
                <div className="dc-empty-ico"><Icons.Folder s={28}/></div>
                <h3 className="dc-empty-title">No modules here</h3>
                <p className="dc-empty-sub">Complete your first module to unlock downloadable worksheets.</p>
              </div>
            ) : (
              <div className="dc-mod-list">
                {filtered.map((mod, i) => {
                  const isDone = mod.status === 'completed';
                  return (
                    <div
                      key={mod.moduleId}
                      className={`dc-mod-row dc-rev${isDone?' dc-completed':' dc-locked'}`}
                      style={{transitionDelay:`${i*40}ms`}}
                    >
                      {/* Info */}
                      <div className="dc-mod-info">
                        <div className="dc-mod-num">Module {String(mod.moduleId).padStart(2,'0')}</div>
                        <div className="dc-mod-name">{mod.title}</div>
                      </div>

                      {/* Track */}
                      <div>
                        <span className="dc-track-chip">
                          <Icons.Layers s={10}/> {mod.trackName}
                        </span>
                      </div>

                      {/* Status */}
                      <div>
                        {isDone ? (
                          <span className="dc-status dc-status-done">
                            <Icons.CheckCircle s={11}/> Completed
                          </span>
                        ) : (
                          <span className="dc-status dc-status-locked">
                            <Icons.Lock s={11}/> Locked
                          </span>
                        )}
                      </div>

                      {/* Downloads */}
                      <div className="dc-dl-actions">
                        {isDone ? (
                          <>
                            <button className="btn-sm btn-sm-pdf" onClick={()=>genModulePDF(mod,user)}>
                              <Icons.FileText s={11}/> PDF
                            </button>
                            <button className="btn-sm btn-sm-word" onClick={()=>genModuleWord(mod,user)}>
                              <Icons.FileWord s={11}/> Word
                            </button>
                          </>
                        ) : (
                          <span className="dc-no-dl">No downloads yet</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>{/* dc-body */}
</div>{/* dc-main */}
    </>
  );
};

export default Documents;