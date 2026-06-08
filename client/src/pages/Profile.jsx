import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';

/*
  MindLaunch — Profile.jsx v2
  ───────────────────────────
  • Matches Documents + Dashboard theme exactly
  • Three.js particle bg (CDN, no extra import)
  • All SVG icons inline — zero emoji
  • Stat cards with animated counters
  • Profile card with hover glow effects
  • Completed modules list with status chips
  • Fully responsive
*/

/* ── Font injection ── */
const injectFonts = () => {
  if (document.getElementById('ml-fonts')) return;
  const l = document.createElement('link');
  l.id = 'ml-fonts';
  l.rel = 'stylesheet';
  l.href = '[fonts.googleapis.com](https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap)';
  document.head.appendChild(l);
};

/* ── Three.js CDN ── */
function loadThree() {
  if (typeof window.THREE !== 'undefined') return Promise.resolve();
  return new Promise((res) => {
    const s = document.createElement('script');
    s.src = '[cdnjs.cloudflare.com](https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js)';
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
    pos[i * 3] = (Math.random() - 0.5) * 30;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    vel[i] = 0.0005 + Math.random() * 0.001;
    const t = Math.random();
    if (t > 0.7) {
      col[i * 3] = 0.48;
      col[i * 3 + 1] = 0.36;
      col[i * 3 + 2] = 0.96;
    } else if (t > 0.45) {
      col[i * 3] = 0.96;
      col[i * 3 + 1] = 0.65;
      col[i * 3 + 2] = 0.14;
    } else if (t > 0.25) {
      col[i * 3] = 0.02;
      col[i * 3 + 1] = 0.84;
      col[i * 3 + 2] = 0.63;
    } else {
      col[i * 3] = 1;
      col[i * 3 + 1] = 0.42;
      col[i * 3 + 2] = 0.62;
    }
  }
  geo.setAttribute('position', new T.BufferAttribute(pos, 3));
  geo.setAttribute('color', new T.BufferAttribute(col, 3));
  const pts = new T.Points(
    geo,
    new T.PointsMaterial({
      size: 0.026,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
    })
  );
  scene.add(pts);

  const sG = new T.BufferGeometry();
  const sP = new Float32Array(140 * 3);
  for (let i = 0; i < 140; i++) {
    sP[i * 3] = (Math.random() - 0.5) * 40;
    sP[i * 3 + 1] = (Math.random() - 0.5) * 28;
    sP[i * 3 + 2] = -10 - Math.random() * 8;
  }
  sG.setAttribute('position', new T.BufferAttribute(sP, 3));
  scene.add(
    new T.Points(
      sG,
      new T.PointsMaterial({
        size: 0.012,
        color: 0x6655cc,
        transparent: true,
        opacity: 0.22,
      })
    )
  );

  let mx = 0,
    my = 0;
  const onMM = (e) => {
    mx = (e.clientX / innerWidth - 0.5) * 2;
    my = -(e.clientY / innerHeight - 0.5) * 2;
  };
  const onR = () => {
    renderer.setSize(innerWidth, innerHeight);
    cam.aspect = innerWidth / innerHeight;
    cam.updateProjectionMatrix();
  };
  window.addEventListener('mousemove', onMM, { passive: true });
  window.addEventListener('resize', onR);
  const clock = new T.Clock();
  let raf;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    cam.position.x += (mx * 0.2 - cam.position.x) * 0.025;
    cam.position.y += (my * 0.15 - cam.position.y) * 0.025;
    pts.rotation.y = clock.getElapsedTime() * 0.01;
    const pa = geo.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      pa[i * 3 + 1] += vel[i];
      if (pa[i * 3 + 1] > 9) pa[i * 3 + 1] = -9;
    }
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

/* ══════════════ INLINE SVG ICONS ══════════════ */
const Ic = ({ paths, size = 16, fill = 'none', stroke = 'currentColor', sw = 2 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {(Array.isArray(paths) ? paths : [paths]).map((d, i) => (
      <path key={i} d={d} />
    ))}
  </svg>
);

const Icons = {
  User: ({ s = 16 }) => (
    <Ic
      size={s}
      paths={[
        'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2',
        'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
      ]}
    />
  ),
  Sparkles: ({ s = 16 }) => (
    <Ic
      size={s}
      fill="currentColor"
      stroke="none"
      paths={[
        'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      ]}
    />
  ),
  Target: ({ s = 16 }) => (
    <Ic
      size={s}
      paths={[
        'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
        'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z',
        'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
      ]}
    />
  ),
  Compass: ({ s = 16 }) => (
    <Ic
      size={s}
      paths={[
        'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
        'M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z',
      ]}
    />
  ),
  Award: ({ s = 16 }) => (
    <Ic
      size={s}
      paths={[
        'M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z',
        'M8.21 13.89L7 23l5-3 5 3-1.21-9.12',
      ]}
    />
  ),
  Calendar: ({ s = 16 }) => (
    <Ic
      size={s}
      paths={[
        'M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z',
        'M16 2v4',
        'M8 2v4',
        'M3 10h18',
      ]}
    />
  ),
  Save: ({ s = 16 }) => (
    <Ic
      size={s}
      paths={[
        'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z',
        'M17 21v-8H7v8',
        'M7 3v5h8',
      ]}
    />
  ),
  Check: ({ s = 16 }) => <Ic size={s} paths={['M20 6L9 17l-5-5']} />,
  CheckCircle: ({ s = 16 }) => (
    <Ic
      size={s}
      paths={['M22 11.08V12a10 10 0 1 1-5.93-9.14', 'M22 4L12 14.01l-3-3']}
    />
  ),
  Camera: ({ s = 16 }) => (
    <Ic
      size={s}
      paths={[
        'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z',
        'M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
      ]}
    />
  ),
  Mail: ({ s = 16 }) => (
    <Ic
      size={s}
      paths={[
        'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z',
        'M22 6l-10 7L2 6',
      ]}
    />
  ),
  MapPin: ({ s = 16 }) => (
    <Ic
      size={s}
      paths={[
        'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z',
        'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
      ]}
    />
  ),
  Briefcase: ({ s = 16 }) => (
    <Ic
      size={s}
      paths={[
        'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z',
        'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
      ]}
    />
  ),
  Clock: ({ s = 16 }) => (
    <Ic
      size={s}
      paths={['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z', 'M12 6v6l4 2']}
    />
  ),
  TrendingUp: ({ s = 16 }) => (
    <Ic size={s} paths={['M22 7l-8.5 8.5-5-5L2 17', 'M16 7h6v6']} />
  ),
  Zap: ({ s = 16 }) => (
    <Ic
      size={s}
      fill="currentColor"
      stroke="none"
      paths={['M13 2L3 14h9l-1 8 10-12h-9l1-8z']}
    />
  ),
  ChevRight: ({ s = 16 }) => <Ic size={s} paths={['M9 18l6-6-6-6']} />,
  Edit: ({ s = 16 }) => (
    <Ic
      size={s}
      paths={[
        'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
        'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
      ]}
    />
  ),
  Layers: ({ s = 16 }) => (
    <Ic
      size={s}
      paths={[
        'M12 2L2 7l10 5 10-5-10-5z',
        'M2 17l10 5 10-5',
        'M2 12l10 5 10-5',
      ]}
    />
  ),
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
#pf-cursor{position:fixed;width:10px;height:10px;background:var(--violet2);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:screen;transition:width .2s var(--spring),height .2s var(--spring),background .2s}
#pf-cursor-ring{position:fixed;width:34px;height:34px;border:1px solid rgba(123,92,245,.35);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%)}

/* CANVAS + NOISE */
#pf-canvas{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none}
.pf-noise{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.024;background-image:url("data:image/svg+xml,%3Csvg xmlns='[w3.org](http://www.w3.org/2000/svg)'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* ═══ LAYOUT ═══ */
.pf-main{
  width:100%;
  min-width:0;
  flex:1;
  display:flex;
  flex-direction:column;
  position:relative;
  z-index:2;
}

/* ═══ BODY ═══ */
.pf-body{padding:2rem;display:flex;flex-direction:column;gap:2rem;flex:1;max-width:1400px;margin:0 auto;width:100%}

/* ═══ PAGE HEADER ═══ */
.pf-page-hdr{display:flex;align-items:flex-start;justify-content:space-between;gap:1.5rem;flex-wrap:wrap;animation:pfFade .6s var(--ease) both}
.pf-eyebrow{display:inline-flex;align-items:center;gap:.4rem;font-family:var(--font-m);font-size:.65rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--violet2);margin-bottom:.6rem}
.pf-eyebrow-dot{width:5px;height:5px;border-radius:50%;background:var(--violet2);box-shadow:0 0 8px var(--violet2);animation:pfPulse 2s ease-in-out infinite}
@keyframes pfPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}
.pf-page-title{font-family:var(--font-d);font-size:clamp(1.75rem,3.5vw,2.4rem);font-weight:800;letter-spacing:-1.5px;line-height:1.1;background:linear-gradient(135deg,var(--text),var(--violet2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:.4rem}
.pf-page-sub{font-size:.9rem;color:var(--text2);line-height:1.6;max-width:520px}
@keyframes pfFade{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}

/* ═══ ALERTS ═══ */
.pf-alert{padding:1rem 1.25rem;border-radius:14px;font-size:.875rem;margin-bottom:.5rem;animation:pfSlide .5s var(--ease);display:flex;align-items:center;gap:.75rem}
@keyframes pfSlide{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}
.pf-alert-success{background:rgba(6,214,160,.08);border:1px solid rgba(6,214,160,.25);color:var(--emerald)}
.pf-alert-error{background:rgba(255,107,107,.08);border:1px solid rgba(255,107,107,.25);color:#FF6B6B}

/* ═══ PROFILE HERO CARD ═══ */
.pf-hero-card{
  padding:1px;
  background:linear-gradient(135deg,rgba(123,92,245,.55),rgba(157,125,255,.32),rgba(123,92,245,.25));
  border-radius:var(--rl);
  box-shadow:0 0 55px rgba(123,92,245,.08);
  animation:pfFade .6s .08s var(--ease) both;
}
.pf-hero-in{
  background:linear-gradient(135deg,rgba(20,14,32,.97),rgba(15,11,26,.97));
  border-radius:calc(var(--rl) - 1px);
  padding:2rem 2.2rem;
  display:flex;align-items:center;
  gap:2rem;flex-wrap:wrap;
  position:relative;overflow:hidden;
}
.pf-hero-in::after{content:'';position:absolute;top:0;left:-100%;bottom:0;width:45%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.03),transparent);animation:pfShimmer 8s ease-in-out infinite;pointer-events:none}
@keyframes pfShimmer{0%{left:-100%}100%{left:220%}}

.pf-avatar-wrap{position:relative;flex-shrink:0}
.pf-avatar{
  width:100px;height:100px;border-radius:50%;
  background:linear-gradient(135deg,var(--violet),#5B3CC5);
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;
  box-shadow:0 0 40px rgba(123,92,245,.4);
  border:3px solid rgba(123,92,245,.3);
  animation:pfAvatarPulse 4s ease-in-out infinite;
}
@keyframes pfAvatarPulse{0%,100%{box-shadow:0 0 30px rgba(123,92,245,.3)}50%{box-shadow:0 0 50px rgba(123,92,245,.5)}}
.pf-avatar img{width:100%;height:100%;object-fit:cover}
.pf-avatar-letter{font-family:var(--font-d);font-size:2.5rem;font-weight:800;color:#fff}
.pf-avatar-edit{
  position:absolute;bottom:0;right:0;
  width:32px;height:32px;border-radius:50%;
  background:linear-gradient(135deg,var(--gold),#E08C0A);
  border:2px solid var(--ink);
  display:flex;align-items:center;justify-content:center;
  color:#0A0A14;cursor:pointer;
  transition:all .25s var(--spring);
}
.pf-avatar-edit:hover{transform:scale(1.1);box-shadow:0 0 20px rgba(245,166,35,.5)}

.pf-hero-info{flex:1;min-width:0}
.pf-hero-badge{display:inline-flex;align-items:center;gap:.3rem;padding:.25rem .7rem;border-radius:100px;font-size:.65rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-family:var(--font-m);margin-bottom:.6rem}
.pf-badge-premium{background:linear-gradient(135deg,#F5A623,#FFD166);color:#0A0A14}
.pf-badge-free{background:rgba(123,92,245,.15);border:1px solid rgba(123,92,245,.3);color:var(--violet2)}
.pf-hero-name{font-family:var(--font-d);font-size:1.65rem;font-weight:800;letter-spacing:-.5px;color:var(--text);margin-bottom:.5rem}
.pf-hero-meta{display:flex;flex-wrap:wrap;gap:.75rem;align-items:center;font-size:.85rem;color:var(--text2)}
.pf-meta-item{display:flex;align-items:center;gap:.35rem}
.pf-meta-dot{width:4px;height:4px;background:rgba(255,255,255,.2);border-radius:50%}

/* ═══ STAT CARDS ═══ */
.pf-stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;animation:pfFade .6s .12s var(--ease) both}
.pf-stat{background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:var(--rl);padding:1.2rem 1.35rem;display:flex;flex-direction:column;gap:.55rem;position:relative;overflow:hidden;transition:all .3s var(--ease)}
.pf-stat::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--sc,rgba(123,92,245,.6)) 50%,transparent);opacity:0;transition:opacity .3s}
.pf-stat:hover{border-color:var(--sb,rgba(123,92,245,.28));transform:translateY(-3px);box-shadow:0 16px 38px rgba(0,0,0,.3)}
.pf-stat:hover::before{opacity:1}
.pf-stat-top{display:flex;align-items:center;justify-content:space-between}
.pf-stat-label{font-family:var(--font-m);font-size:.68rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--text2)}
.pf-stat-ico{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.pf-stat-val{font-family:var(--font-d);font-size:1.85rem;font-weight:800;letter-spacing:-1.5px;line-height:1}
.pf-stat-sub{font-size:.7rem;color:var(--text3);font-family:var(--font-m)}
.ico-v{background:var(--violet-dim);border:1px solid rgba(123,92,245,.18);color:#C4B1FF}
.ico-g{background:var(--gold-dim);border:1px solid rgba(245,166,35,.18);color:var(--gold2)}
.ico-e{background:var(--emerald-dim);border:1px solid rgba(6,214,160,.18);color:#6EE7B7}

/* ═══ GRID LAYOUT ═══ */
.pf-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;animation:pfFade .6s .16s var(--ease) both}

/* ═══ CARD ═══ */
.pf-card{background:rgba(255,255,255,.03);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--rl);padding:1.75rem;transition:all .3s var(--ease);position:relative;overflow:hidden}
.pf-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(123,92,245,.4) 50%,transparent);opacity:0;transition:opacity .3s}
.pf-card:hover{border-color:rgba(123,92,245,.25);box-shadow:0 20px 40px rgba(0,0,0,.25)}
.pf-card:hover::before{opacity:1}

.pf-card-hdr{display:flex;align-items:center;gap:.6rem;margin-bottom:1.25rem;padding-bottom:1rem;border-bottom:1px solid var(--border)}
.pf-card-ico{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center}
.pf-card-ico.violet{background:var(--violet-dim);border:1px solid rgba(123,92,245,.2);color:var(--violet2)}
.pf-card-ico.emerald{background:var(--emerald-dim);border:1px solid rgba(6,214,160,.2);color:var(--emerald)}
.pf-card-title{font-family:var(--font-d);font-size:1.1rem;font-weight:700;letter-spacing:-.3px}

/* ═══ FORM ═══ */
.pf-form-group{margin-bottom:1.25rem}
.pf-label{display:block;font-size:.8rem;font-weight:600;color:var(--text);margin-bottom:.45rem;font-family:var(--font-m);letter-spacing:.02em}
.pf-input,.pf-select,.pf-textarea{
  width:100%;padding:.85rem 1rem;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.1);
  border-radius:12px;color:var(--text);
  font-family:var(--font-b);font-size:.9rem;
  transition:all .3s var(--ease);
}
.pf-input::placeholder,.pf-textarea::placeholder{color:var(--text3)}
.pf-input:focus,.pf-select:focus,.pf-textarea:focus{outline:none;border-color:var(--violet);background:rgba(123,92,245,.06);box-shadow:0 0 0 4px rgba(123,92,245,.1)}
.pf-select option{background:var(--ink);color:var(--text)}
.pf-textarea{min-height:120px;resize:vertical;line-height:1.6}

/* ═══ BUTTONS ═══ */
.btn-violet{padding:.7rem 1.4rem;border-radius:11px;background:linear-gradient(135deg,#7B5CF5,#5B3CC5);border:none;cursor:pointer;color:#fff;font-family:var(--font-d);font-size:.875rem;font-weight:700;display:inline-flex;align-items:center;gap:.45rem;box-shadow:0 0 0 1px rgba(123,92,245,.4),0 6px 20px rgba(123,92,245,.28);transition:all .25s var(--spring);white-space:nowrap}
.btn-violet:hover{transform:translateY(-2px);box-shadow:0 0 0 1px rgba(123,92,245,.6),0 10px 30px rgba(123,92,245,.42);filter:brightness(1.08)}
.btn-violet:disabled{opacity:.5;cursor:not-allowed;transform:none;filter:none}

/* ═══ DELIVERABLES LIST ═══ */
.pf-del-list{display:flex;flex-direction:column;gap:.65rem}
.pf-del-item{
  display:flex;justify-content:space-between;align-items:center;
  padding:1rem 1.15rem;
  background:rgba(0,0,0,.25);
  border:1px solid var(--border);
  border-radius:12px;
  color:var(--text);text-decoration:none;
  font-size:.875rem;font-weight:500;
  transition:all .3s var(--ease);
  position:relative;overflow:hidden;
}
.pf-del-item::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,var(--emerald),#6EE7B7);border-radius:2px;transform:scaleY(0);transition:transform .3s var(--ease)}
.pf-del-item:hover{border-color:rgba(6,214,160,.3);background:rgba(6,214,160,.04);transform:translateX(4px)}
.pf-del-item:hover::before{transform:scaleY(1)}
.pf-del-left{display:flex;align-items:center;gap:.6rem}
.pf-del-num{font-family:var(--font-m);font-size:.7rem;color:var(--text3);text-transform:uppercase;letter-spacing:.04em}
.pf-del-title{color:var(--text)}
.pf-del-arrow{color:var(--emerald);display:flex;align-items:center;gap:.25rem;font-size:.8rem;font-family:var(--font-m)}

.pf-empty{text-align:center;padding:2.5rem 1.5rem;display:flex;flex-direction:column;align-items:center;gap:.75rem}
.pf-empty-ico{width:52px;height:52px;border-radius:14px;background:var(--violet-dim);border:1px solid rgba(123,92,245,.2);display:flex;align-items:center;justify-content:center;color:var(--violet2)}
.pf-empty-title{font-family:var(--font-d);font-size:1rem;font-weight:700}
.pf-empty-sub{font-size:.82rem;color:var(--text2);line-height:1.55;max-width:280px}

/* ═══ LOADING ═══ */
.pf-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;height:80vh;gap:1.2rem;position:relative;z-index:2}
.pf-spin{width:44px;height:44px;border-radius:50%;border:3px solid rgba(123,92,245,.2);border-top-color:#7B5CF5;animation:spin .75s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.pf-spin-txt{color:var(--text2);font-size:.88rem;font-family:var(--font-m)}

/* ═══ SCROLL REVEAL ═══ */
.pf-rev{opacity:0;transform:translateY(22px);transition:opacity .65s var(--ease),transform .65s var(--ease)}
.pf-rev.vis{opacity:1;transform:none}

/* ═══ RESPONSIVE ═══ */
@media(max-width:1024px){
  .pf-stats-row{grid-template-columns:repeat(3,1fr)}
  .pf-grid{grid-template-columns:1fr}
}
@media(max-width:768px){
  .pf-body{padding:1.25rem}
  .pf-hero-in{flex-direction:column;align-items:center;text-align:center;padding:1.5rem}
  .pf-hero-meta{justify-content:center}
  .pf-stats-row{grid-template-columns:1fr 1fr}
  .pf-page-title{font-size:1.6rem}
}
@media(max-width:480px){
  .pf-stats-row{grid-template-columns:1fr}
  .pf-avatar{width:80px;height:80px}
  .pf-avatar-letter{font-size:2rem}
  .pf-hero-name{font-size:1.35rem}
}
`;

/* ══════════════ ANIMATED COUNTER ══════════════ */
function useCounter(target, duration = 1000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = null;
    const step = (ts) => {
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
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('vis');
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.pf-rev').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ══════════════ STAT CARD ══════════════ */
function StatCard({ label, raw, suffix = '', sub, Ico, icoClass, sc, sb, delay }) {
  const counted = useCounter(raw || 0, 900);
  return (
    <div
      className="pf-stat pf-rev"
      style={{ '--sc': sc, '--sb': sb, transitionDelay: delay }}
    >
      <div className="pf-stat-top">
        <span className="pf-stat-label">{label}</span>
        <div className={`pf-stat-ico ${icoClass}`}>
          <Ico />
        </div>
      </div>
      <div className="pf-stat-val">
        {counted}
        {suffix}
      </div>
      <div className="pf-stat-sub">{sub}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const Profile = () => {
  const { user, token, updateStartupProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [startupIdea, setStartupIdea] = useState(user?.startupIdea || '');
  const [category, setCategory] = useState(user?.category || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [profileImagePreview, setProfileImagePreview] = useState(
    user?.profileImage || ''
  );
  const [modules, setModules] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useReveal();

  const categories = [
    'Tech Startup',
    'E-Commerce',
    'Fintech',
    'Healthtech',
    'Edtech',
    'Food & Bev',
    'Social Impact',
    'Manufacturing',
    'Services',
    'Other',
  ];

  /* CSS + fonts */
  useEffect(() => {
    injectFonts();
    let el = document.getElementById('pf-css');
    if (!el) {
      el = document.createElement('style');
      el.id = 'pf-css';
      document.head.appendChild(el);
    }
    el.textContent = CSS;
  }, []);

  /* Cursor */
  useEffect(() => {
    let rx = 0,
      ry = 0,
      tx = 0,
      ty = 0,
      raf;
    const move = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    window.addEventListener('mousemove', move, { passive: true });
    const loop = () => {
      raf = requestAnimationFrame(loop);
      rx += (tx - rx) * 0.13;
      ry += (ty - ry) * 0.13;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${tx}px`;
        cursorRef.current.style.top = `${ty}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`;
        ringRef.current.style.top = `${ry}px`;
      }
    };
    loop();
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* BG particles */
  useEffect(() => {
    let destroy;
    loadThree().then(() => {
      if (canvasRef.current) destroy = createBgParticles(canvasRef.current);
    });
    return () => destroy?.();
  }, []);

  /* Sync user data */
  useEffect(() => {
    if (user) {
      setStartupIdea(user.startupIdea || '');
      setCategory(user.category || '');
      setProfileImage(user.profileImage || '');
      setProfileImagePreview(user.profileImage || '');
    }
  }, [user]);

  /* Fetch profile data */
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const modulesRes = await fetch(`${API_URL}/modules`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (modulesRes.ok) {
          const mData = await modulesRes.json();
          setModules(mData);
        }

        const statsRes = await fetch(`${API_URL}/profile/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (statsRes.ok) {
          const sData = await statsRes.json();
          setStats(sData);
        }
      } catch (err) {
        console.error('Error loading profile page data:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchProfileData();
    }
  }, [token]);

  const handleSelectedImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      setProfileImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await updateStartupProfile(startupIdea, category, profileImage);
      setSuccessMsg('Profile updated successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const completedModules = modules.filter((m) => m.status === 'completed');
  const completedCount = completedModules.length;
  const currentModule = stats?.currentModule || 1;
  const timeOnPlatform = stats?.timeOnPlatform || '0m';

  /* ── Loading ── */
  if (loading)
    return (
      <>
        <div id="pf-cursor" ref={cursorRef} />
        <div id="pf-cursor-ring" ref={ringRef} />
        <div className="pf-noise" />
        <canvas id="pf-canvas" ref={canvasRef} />
        <div className="pf-loading">
          <div className="pf-spin" />
          <p className="pf-spin-txt">Loading profile...</p>
        </div>
      </>
    );

  return (
    <>
      <div id="pf-cursor" ref={cursorRef} />
      <div id="pf-cursor-ring" ref={ringRef} />
      <div className="pf-noise" />
      <canvas id="pf-canvas" ref={canvasRef} />

      <div className="pf-main">
        <div className="pf-body">
          {/* ── Page header ── */}
          <div className="pf-page-hdr">
            <div>
              <div className="pf-eyebrow">
                <div className="pf-eyebrow-dot" /> Account Settings
              </div>
              <h1 className="pf-page-title">My Profile</h1>
              <p className="pf-page-sub">
                Manage your account settings, startup details, and review your
                progress metrics.
              </p>
            </div>
          </div>

          {/* ── Alerts ── */}
          {successMsg && (
            <div className="pf-alert pf-alert-success">
              <Icons.CheckCircle s={18} />
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="pf-alert pf-alert-error">
              <Icons.Zap s={18} />
              {errorMsg}
            </div>
          )}

          {/* ── Profile Hero Card ── */}
          <div className="pf-hero-card">
            <div className="pf-hero-in">
              <div className="pf-avatar-wrap">
                <div className="pf-avatar">
                  {profileImagePreview ? (
                    <img src={profileImagePreview} alt="Profile" />
                  ) : (
                    <span className="pf-avatar-letter">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="pf-avatar-edit"
                  onClick={openFilePicker}
                  title="Change photo"
                >
                  <Icons.Camera s={14} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleSelectedImage}
                />
              </div>

              <div className="pf-hero-info">
                <div
                  className={`pf-hero-badge ${
                    user?.plan === 'premium' ? 'pf-badge-premium' : 'pf-badge-free'
                  }`}
                >
                  <Icons.Sparkles s={10} />
                  {user?.plan === 'premium' ? 'Premium Member' : 'Free Account'}
                </div>
                <h2 className="pf-hero-name">{user?.name}</h2>
                <div className="pf-hero-meta">
                  <span className="pf-meta-item">
                    <Icons.Mail s={14} />
                    {user?.email}
                  </span>
                  <span className="pf-meta-dot" />
                  <span className="pf-meta-item">
                    <Icons.MapPin s={14} />
                    {user?.region || 'Not set'}
                  </span>
                  {user?.category && (
                    <>
                      <span className="pf-meta-dot" />
                      <span className="pf-meta-item">
                        <Icons.Briefcase s={14} />
                        {user.category}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Stat cards ── */}
          <div className="pf-stats-row">
            <StatCard
              label="Modules Completed"
              raw={completedCount}
              suffix="/30"
              sub="worksheets unlocked"
              Ico={() => <Icons.Award s={15} />}
              icoClass="ico-v"
              sc="rgba(123,92,245,.6)"
              sb="rgba(123,92,245,.28)"
              delay="0s"
            />
            <StatCard
              label="Active Module"
              raw={currentModule}
              suffix=""
              sub="currently in progress"
              Ico={() => <Icons.Compass s={15} />}
              icoClass="ico-g"
              sc="rgba(245,166,35,.6)"
              sb="rgba(245,166,35,.28)"
              delay=".05s"
            />
            <div className="pf-stat pf-rev">
  <div className="pf-stat-top">
    <span className="pf-stat-label">Time on Platform</span>
    <div className="pf-stat-ico ico-e">
      <Icons.Clock s={15} />
    </div>
  </div>

  <div className="pf-stat-val">
    {timeOnPlatform}
  </div>

  <div className="pf-stat-sub">
    total learning time
  </div>
</div>
          </div>

          {/* ── Grid: Edit Profile + Deliverables ── */}
          <div className="pf-grid">
            {/* Edit Startup Profile */}
            <div className="pf-card pf-rev">
              <div className="pf-card-hdr">
                <div className="pf-card-ico violet">
                  <Icons.Target s={18} />
                </div>
                <h3 className="pf-card-title">Startup Profile</h3>
              </div>

              <form onSubmit={handleSave}>
                <div className="pf-form-group">
                  <label htmlFor="profile-category" className="pf-label">
                    Business Category
                  </label>
                  <select
                    id="profile-category"
                    className="pf-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select business category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pf-form-group">
                  <label htmlFor="profile-idea" className="pf-label">
                    Startup Concept / Pitch Brief
                  </label>
                  <textarea
                    id="profile-idea"
                    className="pf-textarea"
                    value={startupIdea}
                    onChange={(e) => setStartupIdea(e.target.value)}
                    placeholder="Describe your startup idea in a few sentences..."
                    required
                  />
                </div>

                <button type="submit" className="btn-violet" disabled={updating}>
                  <Icons.Save s={15} />
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Completed Deliverables */}
            <div className="pf-card pf-rev" style={{ transitionDelay: '.06s' }}>
              <div className="pf-card-hdr">
                <div className="pf-card-ico emerald">
                  <Icons.CheckCircle s={18} />
                </div>
                <h3 className="pf-card-title">Completed Deliverables</h3>
              </div>

              {completedModules.length === 0 ? (
                <div className="pf-empty">
                  <div className="pf-empty-ico">
                    <Icons.Layers s={22} />
                  </div>
                  <h4 className="pf-empty-title">No deliverables yet</h4>
                  <p className="pf-empty-sub">
                    Complete your first module to see your deliverables here.
                  </p>
                </div>
              ) : (
                <div className="pf-del-list">
                  {completedModules.map((mod) => (
                    <Link
                      key={mod.moduleId}
                      to={`/modules/${mod.moduleId}`}
                      className="pf-del-item"
                    >
                      <div className="pf-del-left">
                        <span className="pf-del-num">
                          M{String(mod.moduleId).padStart(2, '0')}
                        </span>
                        <span className="pf-del-title">{mod.title}</span>
                      </div>
                      <span className="pf-del-arrow">
                        Review <Icons.ChevRight s={14} />
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
