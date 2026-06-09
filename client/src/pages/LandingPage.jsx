import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as THREE from 'three';

/*
  MindLaunch Landing Page v5 — FIXED
  ─ Demo slides blank issue resolved:
    1. phone-screen now uses position:relative + overflow:hidden correctly
    2. demo-slide uses position:absolute + proper z-index layering
    3. Slide2 duplicate interval bug fixed
    4. @keyframes fadeUp moved to global scope (was only in hero)
    5. All animation references verified
*/

const injectFonts = () => {
  if (document.getElementById('ml-fonts')) return;
  const l = document.createElement('link');
  l.id = 'ml-fonts'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(l);
};

/* ══════════════════════════════════════════════════════════════
   CSS  — FIX: fadeUp, think-bubble, idea-pop, bounce-in, bob, draw-line
          now all live at the top level, not scoped to .ml-hero
══════════════════════════════════════════════════════════════ */
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;scroll-padding-top:80px}
:root{
  --ink:#04040C;
  --violet:#7B5CF5;--violet2:#9D7DFF;
  --gold:#F5A623;--gold2:#FFD166;
  --emerald:#06D6A0;--rose:#FF6B9D;
  --text:#F0EFF8;--text2:#8B8AA8;--text3:#3D3C56;
  --border:rgba(255,255,255,.06);--border2:rgba(255,255,255,.12);
  --r:14px;--rl:22px;
  --ease:cubic-bezier(.25,.46,.45,.94);
  --spring:cubic-bezier(.34,1.56,.64,1);
  --font-d:'Outfit',sans-serif;
  --font-b:'Plus Jakarta Sans',sans-serif;
  --font-m:'JetBrains Mono',monospace;
}
body{background:var(--ink);color:var(--text);font-family:var(--font-b);overflow-x:hidden;cursor:none}

/* ── GLOBAL KEYFRAMES (FIX: were scoped inside .ml-hero before) ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes float-thought{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes think-bubble{0%{opacity:0;transform:scale(0)}60%{opacity:1;transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}
@keyframes idea-pop{0%{opacity:0;transform:scale(0) rotate(-10deg)}70%{transform:scale(1.15) rotate(5deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes draw-line{from{stroke-dashoffset:200}to{stroke-dashoffset:0}}
@keyframes bounce-in{0%{opacity:0;transform:scale(.5) translateY(20px)}70%{transform:scale(1.1) translateY(-4px)}100%{opacity:1;transform:scale(1) translateY(0)}}
@keyframes bob{0%,100%{transform:translateY(0)}60%{transform:translateY(6px)}}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes swim{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}
@keyframes spin-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes node-glow{0%,100%{filter:drop-shadow(0 0 3px rgba(123,92,245,.4))}50%{filter:drop-shadow(0 0 10px rgba(123,92,245,.9))}}

/* CURSOR */
#ml-cursor{position:fixed;width:10px;height:10px;background:var(--violet2);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:screen;transition:width .2s var(--spring),height .2s var(--spring),background .2s}
#ml-cursor-ring{position:fixed;width:34px;height:34px;border:1px solid rgba(123,92,245,.4);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:all .1s var(--ease)}
@media(max-width:768px){#ml-cursor,#ml-cursor-ring{display:none}body{cursor:auto}}

/* CANVAS */
#ml-bg-canvas{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none}

/* NOISE */
.ml-noise{position:fixed;inset:0;z-index:2;pointer-events:none;opacity:.025;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

.ml-page{position:relative;z-index:1;min-height:100vh}

/* HEADER */
.ml-hdr-wrap{position:fixed;top:0;left:0;right:0;z-index:500;padding:1.2rem 2.5rem;transition:all .4s var(--ease)}
.ml-hdr-wrap.solid{background:rgba(4,4,12,.88);backdrop-filter:blur(24px) saturate(160%);padding:.9rem 2.5rem;border-bottom:1px solid var(--border)}
.ml-hdr{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
.ml-logo{display:flex;align-items:center;gap:.6rem;text-decoration:none;color:var(--text);font-family:var(--font-d);font-size:1.22rem;font-weight:800;letter-spacing:-.5px}
.ml-logo-gem{width:36px;height:36px;background:linear-gradient(135deg,#7B5CF5,#4F35C5);clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:900;color:#fff;box-shadow:0 0 28px rgba(123,92,245,.45);transition:transform .3s var(--spring),box-shadow .3s;flex-shrink:0}
.ml-logo:hover .ml-logo-gem{transform:rotate(30deg) scale(1.12);box-shadow:0 0 42px rgba(123,92,245,.7)}
.ml-logo-v{background:linear-gradient(90deg,var(--violet2),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.ml-nav-links{display:flex;align-items:center;gap:2rem}
.ml-nav-link{color:var(--text2);font-size:.875rem;font-weight:500;cursor:pointer;text-decoration:none;transition:color .2s;letter-spacing:.02em;position:relative}
.ml-nav-link::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:1px;background:var(--violet2);transform:scaleX(0);transition:transform .25s var(--ease)}
.ml-nav-link:hover{color:var(--text)}
.ml-nav-link:hover::after{transform:scaleX(1)}
.ml-hdr-btns{display:flex;align-items:center;gap:.7rem}
.ml-hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:8px}
.ml-hamburger span{width:24px;height:2px;background:var(--text);border-radius:2px;transition:all .3s var(--ease)}
.ml-hamburger.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}
.ml-hamburger.open span:nth-child(2){opacity:0}
.ml-hamburger.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}
.ml-mobile-overlay{display:none;position:fixed;inset:0;background:rgba(4,4,12,.7);backdrop-filter:blur(8px);z-index:498;opacity:0;transition:opacity .3s}
.ml-mobile-overlay.open{opacity:1}
.ml-mobile-menu{display:none;position:fixed;top:0;right:0;width:280px;height:100vh;background:rgba(4,4,12,.97);backdrop-filter:blur(24px);border-left:1px solid var(--border);z-index:499;padding:5rem 2rem 2rem;flex-direction:column;gap:1rem;transform:translateX(100%);transition:transform .3s var(--ease)}
.ml-mobile-menu.open{transform:translateX(0)}
.ml-mobile-menu .ml-nav-link{display:block;padding:1rem 0;font-size:1rem;border-bottom:1px solid var(--border)}
@media(max-width:768px){.ml-nav-links{display:none}.ml-hdr-btns.dk{display:none}.ml-hamburger{display:flex}.ml-mobile-overlay,.ml-mobile-menu{display:flex}}

/* BUTTONS */
.btn-ghost{padding:.42rem 1rem;border-radius:9px;background:none;border:none;cursor:pointer;color:var(--text2);font-family:var(--font-b);font-size:.875rem;text-decoration:none;display:inline-flex;align-items:center;transition:color .2s,background .2s}
.btn-ghost:hover{color:var(--text);background:rgba(255,255,255,.06)}
.btn-primary{padding:.48rem 1.25rem;border-radius:10px;background:linear-gradient(135deg,#7B5CF5,#5B3CC5);border:none;cursor:pointer;color:#fff;font-family:var(--font-b);font-size:.875rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:.4rem;box-shadow:0 0 0 1px rgba(123,92,245,.4),0 4px 16px rgba(123,92,245,.3);transition:all .25s var(--ease)}
.btn-primary:hover{box-shadow:0 0 0 1px rgba(123,92,245,.6),0 8px 28px rgba(123,92,245,.5);transform:translateY(-1px)}
.btn-gold{padding:.72rem 2rem;border-radius:12px;background:linear-gradient(135deg,#F5A623,#E08C0A);border:none;cursor:pointer;color:#0A0A14;font-family:var(--font-d);font-size:1rem;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:.5rem;box-shadow:0 0 0 1px rgba(245,166,35,.4),0 6px 24px rgba(245,166,35,.35);transition:all .25s var(--spring);letter-spacing:-.2px}
.btn-gold:hover{box-shadow:0 0 0 1px rgba(245,166,35,.6),0 10px 36px rgba(245,166,35,.5);transform:translateY(-3px) scale(1.02)}
.btn-outline{padding:.72rem 2rem;border-radius:12px;border:1px solid rgba(123,92,245,.35);background:rgba(123,92,245,.06);cursor:pointer;color:var(--text);font-family:var(--font-d);font-size:1rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:.5rem;transition:all .25s var(--ease)}
.btn-outline:hover{border-color:rgba(123,92,245,.7);background:rgba(123,92,245,.14);transform:translateY(-2px)}

/* SECTION UTILS */
.ml-sec{padding:6rem 2.5rem;position:relative;max-width:1280px;margin:0 auto}
@media(max-width:768px){.ml-sec{padding:4rem 1.25rem}}
.bg-alt{background:linear-gradient(180deg,transparent,rgba(20,15,40,.45) 15%,rgba(20,15,40,.45) 85%,transparent);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.sec-tag{display:inline-flex;align-items:center;gap:.5rem;padding:.28rem .9rem;border-radius:100px;border:1px solid rgba(123,92,245,.22);background:rgba(123,92,245,.08);color:rgba(157,125,255,.9);font-family:var(--font-m);font-size:.72rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;margin-bottom:1.5rem}
.sec-tag-dot{width:5px;height:5px;border-radius:50%;background:var(--violet2);box-shadow:0 0 8px var(--violet2);animation:pulse 2s ease-in-out infinite}
.sec-h2{font-family:var(--font-d);font-size:clamp(1.9rem,4.5vw,3.2rem);font-weight:800;letter-spacing:-2px;line-height:1.06;margin-bottom:1rem}
.sec-sub{color:var(--text2);font-size:1.05rem;max-width:520px;line-height:1.72;font-weight:400}
.grad-violet{background:linear-gradient(135deg,#C4B1FF,#7B5CF5,#9D7DFF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.grad-gold{background:linear-gradient(135deg,#FFE066,#F5A623,#FFB347);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.rev{opacity:0;transform:translateY(28px);transition:opacity .7s var(--ease),transform .7s var(--ease)}
.rev.vis{opacity:1;transform:translateY(0)}

/* HERO */
.ml-hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:9rem 2rem 5rem;position:relative}
@media(max-width:580px){.ml-hero{padding:7rem 1.25rem 4rem}}
.hero-badge{display:inline-flex;align-items:center;gap:.6rem;padding:.35rem 1rem;border-radius:100px;border:1px solid rgba(245,166,35,.3);background:rgba(245,166,35,.07);color:rgba(255,209,102,.9);font-size:.78rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;margin-bottom:2.2rem;animation:fadeUp .8s .1s both}
.badge-icon-wrap{display:flex;align-items:center;animation:swim 2s ease-in-out infinite}
.hero-h1{font-family:var(--font-d);font-size:clamp(2.4rem,7.5vw,5.5rem);font-weight:800;letter-spacing:-3.5px;line-height:1.02;margin-bottom:1.8rem;animation:fadeUp .8s .2s both}
@media(max-width:580px){.hero-h1{letter-spacing:-2px}}
.h1-line2{display:block;margin-top:.15em}
.hero-p{font-size:1.05rem;color:var(--text2);max-width:600px;line-height:1.75;margin:0 auto 2.8rem;font-weight:400;animation:fadeUp .8s .3s both}
.vc-banner{width:100%;max-width:760px;padding:1px;background:linear-gradient(135deg,rgba(245,166,35,.55),rgba(255,107,157,.4),rgba(245,166,35,.3));border-radius:var(--rl);box-shadow:0 0 60px rgba(245,166,35,.15);margin-bottom:2.5rem;animation:fadeUp .8s .35s both}
.vc-banner-in{background:linear-gradient(135deg,rgba(16,10,30,.97),rgba(12,8,24,.97));border-radius:calc(var(--rl) - 1px);padding:1.6rem 2rem;display:flex;align-items:center;gap:1.4rem;text-align:left}
@media(max-width:580px){.vc-banner-in{flex-direction:column;text-align:center;padding:1.2rem 1.2rem}}
.vc-banner-icon{flex-shrink:0;animation:swim 2.5s ease-in-out infinite;color:var(--gold)}
.vc-banner-title{font-family:var(--font-d);font-size:1.2rem;font-weight:700;background:linear-gradient(135deg,var(--gold2),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:.4rem;letter-spacing:-.3px}
.vc-banner-body{font-size:.88rem;color:var(--text2);line-height:1.6;font-weight:400}
.hero-acts{display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;margin-bottom:3.5rem;animation:fadeUp .8s .4s both}
.hero-stats{display:flex;gap:0;flex-wrap:wrap;justify-content:center;border:1px solid var(--border);border-radius:16px;background:rgba(255,255,255,.02);overflow:hidden;animation:fadeUp .8s .5s both;backdrop-filter:blur(10px)}
.hs-item{padding:1.2rem 2rem;border-right:1px solid var(--border);display:flex;flex-direction:column;align-items:center;gap:.2rem}
@media(max-width:480px){.hs-item{padding:.9rem 1.2rem}}
.hs-item:last-child{border-right:none}
.hs-n{font-family:var(--font-d);font-size:1.7rem;font-weight:800;letter-spacing:-1px;line-height:1}
.hs-l{font-size:.68rem;color:var(--text3);text-transform:uppercase;letter-spacing:.9px;font-weight:600}
.hero-tracks{width:100%;max-width:800px;border:1px solid var(--border);border-radius:16px;background:rgba(255,255,255,.02);backdrop-filter:blur(10px);padding:1rem 1.6rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin-top:1.5rem;animation:fadeUp .8s .6s both}
@media(max-width:580px){.hero-tracks{padding:.8rem 1rem;gap:.5rem}}
.trk-lbl{color:var(--text3);font-size:.72rem;font-family:var(--font-m);white-space:nowrap}
.trk-pills{display:flex;gap:.4rem;flex-wrap:wrap}
.trk-pill{padding:.26rem .65rem;border-radius:100px;font-size:.72rem;font-weight:600;letter-spacing:.03em}
.tp1{background:rgba(123,92,245,.12);color:#C4B1FF;border:1px solid rgba(123,92,245,.2)}
.tp2{background:rgba(245,166,35,.1);color:#FFD166;border:1px solid rgba(245,166,35,.18)}
.tp3{background:rgba(6,214,160,.08);color:#6EE7B7;border:1px solid rgba(6,214,160,.18)}
.tp4{background:rgba(255,107,157,.08);color:#FFB3CE;border:1px solid rgba(255,107,157,.18)}
.trk-live{margin-left:auto;display:flex;align-items:center;gap:.4rem;flex-shrink:0}
.trk-live-dot{width:6px;height:6px;border-radius:50%;background:var(--emerald);box-shadow:0 0 8px var(--emerald);animation:pulse 2s ease-in-out infinite}
.trk-live-lbl{font-size:.7rem;color:var(--text3);font-family:var(--font-m)}
.scroll-hint{position:absolute;bottom:2.5rem;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:.5rem;opacity:.45;animation:fadeUp 1s 1.2s both}
.scroll-ring{width:36px;height:36px;border:1.5px solid rgba(255,255,255,.25);border-radius:50%;display:flex;align-items:center;justify-content:center;animation:bob 2.2s ease-in-out infinite}
.scroll-txt{font-size:.66rem;color:var(--text3);letter-spacing:.08em;text-transform:uppercase;font-family:var(--font-m)}

/* ══════════════════════════════════════
   DEMO SECTION
══════════════════════════════════════ */
.demo-section{padding:6rem 1.5rem;position:relative;overflow:hidden}
@media(max-width:768px){.demo-section{padding:4rem 1rem}}
.demo-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 50%,rgba(123,92,245,.04) 0%,transparent 70%)}
.demo-container{max-width:1100px;margin:0 auto}
.demo-hdr{text-align:center;margin-bottom:3.5rem}
@media(max-width:768px){.demo-hdr{margin-bottom:2rem}}

.demo-stage{display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:2rem;align-items:center;min-height:520px}
@media(max-width:900px){
  .demo-stage{grid-template-columns:1fr;gap:1.5rem;min-height:auto}
  .demo-stage .demo-left,.demo-stage .demo-right{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
  .demo-stage .demo-phone-wrap{order:-1}
}
@media(max-width:540px){
  .demo-stage .demo-left,.demo-stage .demo-right{grid-template-columns:1fr}
}

.demo-left,.demo-right{display:flex;flex-direction:column;gap:1rem}
.demo-trigger{display:flex;align-items:center;gap:1rem;padding:1rem 1.2rem;border-radius:14px;border:1px solid var(--border);background:rgba(255,255,255,.02);cursor:pointer;transition:all .35s var(--ease);position:relative;overflow:hidden;text-align:left}
.demo-trigger::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--violet2);transform:scaleY(0);transform-origin:bottom;transition:transform .35s var(--ease);border-radius:2px}
.demo-trigger.active{background:rgba(123,92,245,.1);border-color:rgba(123,92,245,.4)}
.demo-trigger.active::before{transform:scaleY(1)}
.demo-trigger.done{border-color:rgba(6,214,160,.25);background:rgba(6,214,160,.04)}
.dt-num{width:36px;height:36px;border-radius:10px;border:1px solid var(--border2);background:rgba(255,255,255,.04);display:flex;align-items:center;justify-content:center;font-family:var(--font-m);font-size:.78rem;font-weight:500;color:var(--text2);flex-shrink:0;transition:all .3s var(--ease)}
.demo-trigger.active .dt-num{background:rgba(123,92,245,.3);border-color:var(--violet2);box-shadow:0 0 18px rgba(123,92,245,.4);color:#fff}
.demo-trigger.done .dt-num{background:rgba(6,214,160,.2);border-color:var(--emerald);color:var(--emerald)}
.dt-label{font-family:var(--font-d);font-size:.92rem;font-weight:600;color:var(--text);margin-bottom:.1rem}
.dt-sub{font-size:.76rem;color:var(--text2);line-height:1.4}

/* ── PHONE SHELL — FIX: explicit dimensions, isolation ── */
.demo-phone-wrap{position:relative;display:flex;align-items:center;justify-content:center}
.demo-phone{
  width:260px;
  background:#0A091A;
  border:1.5px solid rgba(123,92,245,.35);
  border-radius:34px;
  overflow:hidden;
  box-shadow:0 0 0 6px rgba(123,92,245,.08),0 40px 80px rgba(0,0,0,.6),0 0 60px rgba(123,92,245,.15);
  position:relative;
  isolation:isolate;
}
@media(max-width:540px){.demo-phone{width:220px}}
.demo-phone::before{
  content:'';
  position:absolute;
  top:0;left:50%;
  transform:translateX(-50%);
  width:80px;height:22px;
  background:#0A091A;
  border-radius:0 0 14px 14px;
  z-index:10;
  border:1px solid rgba(123,92,245,.2);
  border-top:none;
}

/* FIX: phone-screen must be position:relative so absolute children stack correctly */
.phone-screen{
  height:500px;
  position:relative;        /* ← was missing proper stacking context */
  overflow:hidden;
  padding-top:28px;
  background:#070614;
}
@media(max-width:540px){.phone-screen{height:440px}}

/* FIX: demo-slide stacking — all slides layered on top of each other */
.demo-slide{
  position:absolute;
  top:0; left:0; right:0; bottom:0;
  padding-top:28px;
  opacity:0;
  transform:translateY(16px) scale(.97);
  transition:opacity .45s var(--ease),transform .45s var(--ease);
  pointer-events:none;
  will-change:opacity,transform;
  z-index:1;
}
.demo-slide.active{
  opacity:1;
  transform:translateY(0) scale(1);
  pointer-events:auto;
  z-index:2;
}
.demo-slide.exit{
  opacity:0;
  transform:translateY(-12px) scale(.96);
  z-index:1;
}

/* ── SLIDE 1 ── */
.s1-scene{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;padding:1rem}
.s1-caption{font-family:var(--font-d);font-size:.78rem;font-weight:600;color:var(--text2);text-align:center;letter-spacing:.02em}
.s1-caption span{color:var(--violet2)}

/* ── SLIDE 2 ── */
.s2-scene{width:100%;height:100%;display:flex;flex-direction:column;padding:.9rem;gap:.6rem}
.s2-app-bar{display:flex;align-items:center;gap:.5rem;padding:.45rem .7rem;background:rgba(123,92,245,.12);border:1px solid rgba(123,92,245,.25);border-radius:10px}
.s2-app-logo{width:20px;height:20px;background:linear-gradient(135deg,#7B5CF5,#4F35C5);clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);display:flex;align-items:center;justify-content:center;font-size:.45rem;font-weight:900;color:#fff;flex-shrink:0}
.s2-app-name{font-family:var(--font-d);font-size:.68rem;font-weight:700;color:var(--text)}
.s2-prompt-box{background:rgba(255,255,255,.04);border:1px solid var(--border2);border-radius:10px;padding:.65rem .75rem}
.s2-prompt-label{font-size:.6rem;color:var(--text3);font-family:var(--font-m);margin-bottom:.3rem;text-transform:uppercase;letter-spacing:.06em}
.s2-typed{font-family:var(--font-d);font-size:.88rem;font-weight:700;color:var(--gold2);min-height:1.2em}
.s2-cursor{display:inline-block;width:2px;height:.9em;background:var(--gold2);margin-left:1px;animation:blink .7s step-end infinite;vertical-align:middle}
.s2-tracks-label{font-size:.62rem;color:var(--text3);font-family:var(--font-m);text-transform:uppercase;letter-spacing:.06em}
.s2-track-chips{display:flex;flex-wrap:wrap;gap:.3rem}
.s2-chip{padding:.22rem .55rem;border-radius:100px;font-size:.62rem;font-weight:600}
.s2-chip-v{background:rgba(123,92,245,.15);color:#C4B1FF;border:1px solid rgba(123,92,245,.3)}
.s2-chip-g{background:rgba(245,166,35,.12);color:#FFD166;border:1px solid rgba(245,166,35,.25)}
.s2-chip-e{background:rgba(6,214,160,.1);color:#6EE7B7;border:1px solid rgba(6,214,160,.2)}
.s2-cta{width:100%;padding:.5rem;border-radius:9px;background:linear-gradient(135deg,#7B5CF5,#5B3CC5);border:none;color:#fff;font-family:var(--font-d);font-size:.7rem;font-weight:700;display:flex;align-items:center;justify-content:center;gap:.35rem;box-shadow:0 4px 16px rgba(123,92,245,.4);margin-top:auto}

/* ── SLIDE 3 ── */
.s3-scene{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:.8rem;gap:.5rem;overflow:hidden}
.s3-bag-stage{position:relative;width:130px;height:110px;flex-shrink:0}
.s3-coach-panel{width:100%;flex:1;background:rgba(123,92,245,.08);border:1px solid rgba(123,92,245,.25);border-radius:12px;padding:.6rem .7rem;display:flex;flex-direction:column;gap:.45rem;overflow:hidden}
.s3-coach-hdr{display:flex;align-items:center;gap:.45rem}
.s3-coach-avatar{width:22px;height:22px;border-radius:7px;background:linear-gradient(135deg,#7B5CF5,#4F35C5);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.s3-coach-name{font-family:var(--font-d);font-size:.68rem;font-weight:700;color:var(--text)}
.s3-coach-status{font-size:.55rem;color:var(--emerald);font-family:var(--font-m)}
.s3-chat{display:flex;flex-direction:column;gap:.38rem;flex:1;overflow:hidden}
.s3-bubble{padding:.38rem .5rem;border-radius:8px;font-size:.62rem;line-height:1.45;max-width:90%;color:var(--text)}
.s3-bubble.ai{background:rgba(123,92,245,.15);border:1px solid rgba(123,92,245,.25);align-self:flex-start;border-radius:8px 8px 8px 2px}
.s3-bubble.user{background:rgba(245,166,35,.12);border:1px solid rgba(245,166,35,.2);align-self:flex-end;text-align:right;border-radius:8px 8px 2px 8px}
.s3-bubble-who{display:block;font-size:.5rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.15rem}
.s3-bubble.ai .s3-bubble-who{color:#C4B1FF}
.s3-bubble.user .s3-bubble-who{color:#FFD166}
.s3-score{display:flex;align-items:center;gap:.4rem;padding:.35rem .5rem;background:rgba(6,214,160,.08);border:1px solid rgba(6,214,160,.2);border-radius:7px}
.s3-score-lbl{font-size:.58rem;color:var(--text2)}
.s3-score-bar{flex:1;height:3px;background:rgba(255,255,255,.08);border-radius:2px;overflow:hidden}
.s3-score-fill{height:100%;background:linear-gradient(90deg,var(--violet),var(--emerald));border-radius:2px;transition:width 1.2s var(--ease)}
.s3-score-val{font-family:var(--font-d);font-size:.72rem;font-weight:700;color:#6EE7B7}

/* ── SLIDE 4 ── */
.s4-scene{width:100%;height:100%;display:flex;flex-direction:column;padding:.85rem;gap:.5rem;overflow:hidden}
.s4-title{font-family:var(--font-d);font-size:.8rem;font-weight:700;color:var(--text);text-align:center}
.s4-sub{font-size:.62rem;color:var(--emerald);text-align:center;font-family:var(--font-m)}
.s4-net-stage{position:relative;width:100%;height:130px;flex-shrink:0;overflow:hidden}
.s4-vc-list{display:flex;flex-direction:column;gap:.38rem;flex:1;overflow:hidden}
.s4-vc-row{display:flex;align-items:center;gap:.5rem;padding:.42rem .55rem;border-radius:9px;border:1px solid rgba(123,92,245,.2);background:rgba(123,92,245,.06);transform:translateX(40px);opacity:0;transition:all .5s var(--spring)}
.s4-vc-row.in{transform:translateX(0);opacity:1}
.s4-vc-dot{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.65rem;font-weight:700;color:#fff}
.s4-vc-info{flex:1;min-width:0}
.s4-vc-name{font-family:var(--font-d);font-size:.66rem;font-weight:700;color:var(--text)}
.s4-vc-firm{font-size:.56rem;color:var(--text2)}
.s4-badge{font-size:.54rem;padding:.12rem .38rem;border-radius:100px;font-family:var(--font-m);white-space:nowrap}
.s4-badge.match{color:var(--emerald);border:1px solid rgba(6,214,160,.3);background:rgba(6,214,160,.1)}
.s4-badge.rev{color:#FFD166;border:1px solid rgba(245,166,35,.3);background:rgba(245,166,35,.1)}
.s4-notify{display:flex;align-items:center;gap:.4rem;padding:.45rem .55rem;border-radius:9px;border:1px solid rgba(245,166,35,.35);background:rgba(245,166,35,.07);font-size:.62rem;color:var(--text2);transform:translateY(10px);opacity:0;transition:all .5s .8s var(--spring)}
.s4-notify.in{transform:translateY(0);opacity:1}
.s4-notify strong{color:var(--gold2)}

/* FEATURES */
.feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:1.2rem;margin-top:3.5rem}
@media(max-width:600px){.feat-grid{grid-template-columns:1fr}}
.feat-card{background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:var(--rl);padding:2.2rem;display:flex;flex-direction:column;gap:1.2rem;position:relative;overflow:hidden;transition:all .35s var(--ease);cursor:default;transform-style:preserve-3d}
.feat-card::before{content:'';position:absolute;inset:0;background:radial-gradient(600px circle at var(--mx,50%) var(--my,50%),rgba(123,92,245,.06),transparent 40%);opacity:0;transition:opacity .4s}
.feat-glow{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(123,92,245,.8) 50%,transparent);opacity:0;transition:opacity .3s}
.feat-card:hover{border-color:rgba(123,92,245,.3);box-shadow:0 24px 64px rgba(0,0,0,.35),0 0 0 1px rgba(123,92,245,.1);transform:translateY(-6px)}
.feat-card:hover::before{opacity:1}
.feat-card:hover .feat-glow{opacity:1}
.feat-ico{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;transition:transform .3s var(--spring)}
.feat-card:hover .feat-ico{transform:scale(1.12) rotate(-8deg)}
.fi-v{background:rgba(123,92,245,.1);border:1px solid rgba(123,92,245,.2);color:#C4B1FF}
.fi-g{background:rgba(245,166,35,.1);border:1px solid rgba(245,166,35,.2);color:#FFD166}
.fi-e{background:rgba(6,214,160,.08);border:1px solid rgba(6,214,160,.2);color:#6EE7B7}
.feat-h3{font-family:var(--font-d);font-size:1.15rem;font-weight:700;letter-spacing:-.3px}
.feat-p{color:var(--text2);font-size:.9rem;line-height:1.68;font-weight:400}

/* STEPS */
.steps-section{position:relative;min-height:350vh}
.steps-sticky{position:sticky;top:0;height:100vh;overflow:hidden;display:flex;align-items:center;justify-content:center}
#ml-steps-canvas{position:absolute;inset:0;width:100%;height:100%}
.steps-ui{position:relative;z-index:10;width:100%;max-width:1100px;padding:0 2rem;display:flex;flex-direction:column;align-items:center}
@media(max-width:600px){.steps-ui{padding:0 1rem}}
.steps-hdr{text-align:center;margin-bottom:2.5rem}
.steps-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;width:100%}
@media(max-width:900px){.steps-grid{grid-template-columns:1fr 1fr}}
@media(max-width:540px){.steps-grid{grid-template-columns:1fr}}
.step-card{background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:var(--r);padding:1.5rem;display:flex;flex-direction:column;gap:.7rem;transition:all .5s var(--spring);cursor:pointer;position:relative;overflow:hidden;opacity:.45;transform:translateY(10px) scale(.96)}
.step-card.lit{opacity:1;border-color:rgba(123,92,245,.45);background:rgba(123,92,245,.07);box-shadow:0 20px 50px rgba(123,92,245,.18),0 0 0 1px rgba(123,92,245,.2);transform:translateY(-6px) scale(1.02)}
.step-card-line{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--violet),var(--violet2));transform:scaleX(0);transform-origin:left;transition:transform .6s var(--ease)}
.step-card.lit .step-card-line{transform:scaleX(1)}
.step-n{width:44px;height:44px;border-radius:12px;background:rgba(123,92,245,.12);border:1px solid rgba(123,92,245,.25);display:flex;align-items:center;justify-content:center;font-family:var(--font-m);font-size:.78rem;font-weight:500;color:#C4B1FF;transition:all .4s var(--spring)}
.step-card.lit .step-n{background:rgba(123,92,245,.25);border-color:#7B5CF5;box-shadow:0 0 20px rgba(123,92,245,.35);transform:scale(1.12)}
.step-h{font-family:var(--font-d);font-size:.98rem;font-weight:700;letter-spacing:-.2px}
.step-p{color:var(--text2);font-size:.83rem;line-height:1.58;font-weight:400}
.steps-progress{display:flex;gap:.5rem;margin-top:1.5rem}
.prog-dot{width:8px;height:8px;border-radius:50%;background:var(--border2);transition:all .35s var(--ease);cursor:pointer}
.prog-dot.active{background:var(--violet2);box-shadow:0 0 10px var(--violet2);transform:scale(1.3)}

/* PRICING */
.price-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.2rem;margin-top:3.5rem}
@media(max-width:600px){.price-grid{grid-template-columns:1fr}}
.price-card{background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:var(--rl);padding:2.25rem;display:flex;flex-direction:column;gap:1.4rem;transition:all .3s var(--ease);position:relative;overflow:hidden}
.price-card:hover{transform:translateY(-5px);box-shadow:0 28px 70px rgba(0,0,0,.4)}
.price-card.hot{border-color:rgba(245,166,35,.4);background:linear-gradient(145deg,rgba(245,166,35,.055),rgba(255,255,255,.03))}
.price-card.hot::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(245,166,35,.9) 50%,transparent)}
.price-card.hot:hover{border-color:rgba(245,166,35,.65);box-shadow:0 28px 70px rgba(0,0,0,.4),0 0 50px rgba(245,166,35,.1)}
.hot-chip{position:absolute;top:1.2rem;right:1.2rem;padding:.22rem .65rem;border-radius:100px;background:rgba(245,166,35,.12);border:1px solid rgba(245,166,35,.28);color:#FFD166;font-size:.68rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase}
.p-name{font-family:var(--font-d);font-size:1.05rem;font-weight:700;letter-spacing:-.3px}
.p-desc{color:var(--text2);font-size:.84rem;margin-top:.2rem;font-weight:400}
.p-price{font-family:var(--font-d);font-size:2.8rem;font-weight:800;letter-spacing:-2px;line-height:1}
.p-price small{font-size:.95rem;color:var(--text2);font-weight:400;letter-spacing:0}
.p-div{height:1px;background:var(--border)}
.p-feats{display:flex;flex-direction:column;gap:.6rem}
.p-feat{display:flex;align-items:flex-start;gap:.5rem;font-size:.87rem;color:var(--text2);font-weight:400}
.p-feat.bright{color:var(--text)}
.p-ck{width:18px;height:18px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.58rem;font-weight:800;margin-top:1px}
.ck-v{background:rgba(123,92,245,.12);color:#C4B1FF;border:1px solid rgba(123,92,245,.22)}
.ck-g{background:rgba(245,166,35,.12);color:#FFD166;border:1px solid rgba(245,166,35,.22)}
.btn-p-outline{width:100%;padding:.55rem 1rem;border-radius:10px;border:1px solid rgba(123,92,245,.35);background:rgba(123,92,245,.06);cursor:pointer;color:var(--text);font-family:var(--font-b);font-size:.86rem;font-weight:500;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;margin-top:auto;transition:all .2s}
.btn-p-outline:hover{background:rgba(123,92,245,.16);border-color:rgba(123,92,245,.65)}
.btn-p-primary{width:100%;padding:.55rem 1rem;border-radius:10px;background:linear-gradient(135deg,#7B5CF5,#5B3CC5);border:none;cursor:pointer;color:#fff;font-family:var(--font-b);font-size:.86rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:.35rem;box-shadow:0 0 16px rgba(123,92,245,.28);margin-top:auto;transition:all .2s}
.btn-p-primary:hover{box-shadow:0 6px 22px rgba(123,92,245,.48);transform:translateY(-1px)}
.btn-p-gold{width:100%;padding:.55rem 1rem;border-radius:10px;background:linear-gradient(135deg,#F5A623,#E08C0A);border:none;cursor:pointer;color:#0A0A14;font-family:var(--font-b);font-size:.86rem;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:.35rem;box-shadow:0 0 18px rgba(245,166,35,.28);margin-top:auto;transition:all .2s}
.btn-p-gold:hover{box-shadow:0 6px 24px rgba(245,166,35,.5);transform:translateY(-1px)}

/* REGIONS */
.reg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.85rem;margin-top:3.5rem}
@media(max-width:480px){.reg-grid{grid-template-columns:1fr 1fr}}
.reg-card{background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:var(--r);padding:.9rem 1.1rem;display:flex;align-items:center;gap:.8rem;transition:all .25s var(--ease);cursor:default}
.reg-card:hover{border-color:rgba(123,92,245,.3);background:rgba(123,92,245,.05);transform:translateX(5px)}
.reg-code{width:38px;height:38px;border-radius:9px;background:rgba(123,92,245,.08);border:1px solid rgba(123,92,245,.18);display:flex;align-items:center;justify-content:center;font-family:var(--font-m);font-size:.68rem;font-weight:500;color:#C4B1FF;flex-shrink:0;transition:all .25s}
.reg-card:hover .reg-code{background:rgba(123,92,245,.18);box-shadow:0 0 14px rgba(123,92,245,.2)}
.reg-nm{font-size:.88rem;font-weight:500;letter-spacing:-.1px}

/* CTA */
.cta-outer{padding:2rem 2.5rem 8rem;max-width:1280px;margin:0 auto}
@media(max-width:768px){.cta-outer{padding:2rem 1.25rem 5rem}}
.cta-wrap{padding:1px;background:linear-gradient(135deg,rgba(123,92,245,.6),rgba(245,166,35,.38),rgba(123,92,245,.25));border-radius:var(--rl);box-shadow:0 0 100px rgba(123,92,245,.12)}
.cta-in{background:linear-gradient(135deg,#13102a,#18163a,#16142e);border-radius:calc(var(--rl) - 1px);padding:4rem;display:flex;align-items:center;justify-content:space-between;gap:2rem;flex-wrap:wrap}
@media(max-width:768px){.cta-in{padding:2.5rem 1.5rem;flex-direction:column;text-align:center}}
.cta-h2{font-family:var(--font-d);font-size:clamp(1.6rem,3vw,2.3rem);font-weight:800;letter-spacing:-1px;line-height:1.15}
.cta-p{color:var(--text2);font-size:.92rem;margin-top:.5rem;font-weight:400}
.cta-acts{display:flex;gap:.85rem;flex-shrink:0;flex-wrap:wrap}
@media(max-width:768px){.cta-acts{width:100%;flex-direction:column}.cta-acts .btn-gold,.cta-acts .btn-outline{justify-content:center}}

/* FOOTER */
.ml-ftr{border-top:1px solid var(--border);padding:3rem 2.5rem;background:rgba(4,4,12,.7)}
@media(max-width:580px){.ml-ftr{padding:2rem 1.25rem}}
.ml-ftr-in{max-width:1280px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1.5rem}
.ftr-links{display:flex;gap:1.5rem;flex-wrap:wrap}
.ftr-a{color:var(--text3);font-size:.84rem;text-decoration:none;transition:color .2s}
.ftr-a:hover{color:var(--text2)}
.ftr-copy{color:var(--text3);font-size:.78rem;margin-top:.3rem}
`;

/* ══════════════════════════════════════════════════════════════
   SVG ICONS
══════════════════════════════════════════════════════════════ */
const IconArrow = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const IconShark = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <path d="M4 36c6-8 14-14 24-16l4-14 4 14c8 2 16 8 20 18H4z" fill="currentColor" opacity=".9"/>
    <path d="M8 38c2 6 8 10 14 10s12-4 14-10" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="18" cy="30" r="2" fill="#0A091A"/>
    <path d="M32 22l2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconBrain = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
  </svg>
);
const IconBook = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    <path d="M8 7h8M8 11h6"/>
  </svg>
);
const IconGlobe = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const IconCheck = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);
const IconAI = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const IconMail = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
);
const IconBank = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 22h18M3 10h18M5 6l7-3 7 3M4 10v12M8 10v12M12 10v12M16 10v12M20 10v12"/>
  </svg>
);
const IconZap = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);
const IconTarget = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   THREE.JS BACKGROUND
══════════════════════════════════════════════════════════════ */
function createBgParticles(canvas) {
  const W = window.innerWidth, H = window.innerHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setSize(W, H);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(65, W / H, 0.1, 200);
  cam.position.z = 7;
  const COUNT = 320;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  const vel = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    pos[i*3]=(Math.random()-.5)*28; pos[i*3+1]=(Math.random()-.5)*18; pos[i*3+2]=(Math.random()-.5)*14;
    vel[i]=.0006+Math.random()*.0012;
    const t=Math.random();
    if(t>.7){col[i*3]=.48;col[i*3+1]=.36;col[i*3+2]=.96;}
    else if(t>.45){col[i*3]=.96;col[i*3+1]=.65;col[i*3+2]=.14;}
    else if(t>.25){col[i*3]=.02;col[i*3+1]=.84;col[i*3+2]=.63;}
    else{col[i*3]=1;col[i*3+1]=.42;col[i*3+2]=.62;}
  }
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  const mat=new THREE.PointsMaterial({size:.032,vertexColors:true,transparent:true,opacity:.55,sizeAttenuation:true});
  scene.add(new THREE.Points(geo,mat));
  const starCount=180,starGeo=new THREE.BufferGeometry(),starPos=new Float32Array(starCount*3);
  for(let i=0;i<starCount;i++){starPos[i*3]=(Math.random()-.5)*40;starPos[i*3+1]=(Math.random()-.5)*30;starPos[i*3+2]=-8-Math.random()*10;}
  starGeo.setAttribute('position',new THREE.BufferAttribute(starPos,3));
  scene.add(new THREE.Points(starGeo,new THREE.PointsMaterial({size:.018,color:0x6655cc,transparent:true,opacity:.35})));
  let mx=0,my=0;
  const onMM=e=>{mx=(e.clientX/innerWidth-.5)*2;my=-(e.clientY/innerHeight-.5)*2;};
  const onResize=()=>{renderer.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();};
  window.addEventListener('mousemove',onMM,{passive:true});
  window.addEventListener('resize',onResize);
  const clock=new THREE.Clock();
  let raf;
  const pts=scene.children[0];
  const tick=()=>{
    raf=requestAnimationFrame(tick);
    cam.position.x+=(mx*.35-cam.position.x)*.03;
    cam.position.y+=(my*.25-cam.position.y)*.03;
    pts.rotation.y=clock.getElapsedTime()*.015;
    const pa=geo.attributes.position.array;
    for(let i=0;i<COUNT;i++){pa[i*3+1]+=vel[i];if(pa[i*3+1]>9)pa[i*3+1]=-9;}
    geo.attributes.position.needsUpdate=true;
    renderer.render(scene,cam);
  };
  tick();
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('mousemove',onMM);window.removeEventListener('resize',onResize);renderer.dispose();};
}

/* ══════════════════════════════════════════════════════════════
   THREE.JS STEPS SCENE
══════════════════════════════════════════════════════════════ */
function createStepsScene(canvas) {
  if (!canvas) return { destroy:()=>{}, setProgress:()=>{} };
  const W=canvas.offsetWidth||innerWidth, H=canvas.offsetHeight||innerHeight;
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(W,H);
  const scene=new THREE.Scene();
  const cam=new THREE.PerspectiveCamera(55,W/H,0.1,200);
  cam.position.set(0,0,10);
  const COLORS=[0x7B5CF5,0xF5A623,0x06D6A0,0xFF6B9D];
  const X=[-5,-1.7,1.7,5];
  const nodes=X.map((x,i)=>{
    const grp=new THREE.Group();
    grp.position.set(x,0,0);
    const sphere=new THREE.Mesh(new THREE.SphereGeometry(.55,24,24),new THREE.MeshBasicMaterial({color:COLORS[i],transparent:true,opacity:.12}));
    const ring=new THREE.Mesh(new THREE.TorusGeometry(1.1,.012,8,56),new THREE.MeshBasicMaterial({color:COLORS[i],transparent:true,opacity:.18}));
    ring.rotation.x=Math.PI/3+i*.3;
    const pCount=55,pGeo=new THREE.BufferGeometry(),pPos=new Float32Array(pCount*3);
    for(let j=0;j<pCount;j++){const a=Math.random()*Math.PI*2,r=.8+Math.random()*.7;pPos[j*3]=Math.cos(a)*r;pPos[j*3+1]=(Math.random()-.5)*.5;pPos[j*3+2]=Math.sin(a)*r;}
    pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));
    const pMat=new THREE.PointsMaterial({color:COLORS[i],size:.048,transparent:true,opacity:.4});
    grp.add(sphere,ring,new THREE.Points(pGeo,pMat));
    grp.userData={i,spd:.3+i*.08,off:i*1.6,lit:false,sphere,ring,pMat};
    scene.add(grp);
    return grp;
  });
  const beams=[];
  for(let i=0;i<3;i++){
    const pts=[new THREE.Vector3(X[i]+.7,0,0),new THREE.Vector3(X[i+1]-.7,0,0)];
    const bMat=new THREE.LineBasicMaterial({color:0x2a2445,transparent:true,opacity:.28});
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),bMat));
    beams.push(bMat);
  }
  const hCount=220,hGeo=new THREE.BufferGeometry(),hPos=new Float32Array(hCount*3);
  for(let i=0;i<hCount;i++){hPos[i*3]=(Math.random()-.5)*24;hPos[i*3+1]=(Math.random()-.5)*14;hPos[i*3+2]=-3-Math.random()*6;}
  hGeo.setAttribute('position',new THREE.BufferAttribute(hPos,3));
  scene.add(new THREE.Points(hGeo,new THREE.PointsMaterial({size:.02,color:0x5544bb,transparent:true,opacity:.2})));
  function setProgress(p){
    const litCount=Math.min(4,Math.floor(p*4.8));
    nodes.forEach((g,i)=>{
      const isLit=i<litCount,isActive=i===Math.min(3,litCount-1);
      g.userData.lit=isLit;
      g.userData.sphere.material.opacity=isLit?.22:.06;
      g.userData.ring.material.opacity=isLit?(isActive?.55:.2):.08;
      g.userData.pMat.opacity=isLit?.65:.22;
    });
    beams.forEach((bm,i)=>{bm.opacity=Math.min(.55,Math.max(.08,(litCount-i)*.22));});
  }
  let mx=0,my=0;
  const onMM=e=>{const r=canvas.getBoundingClientRect();mx=((e.clientX-r.left)/r.width-.5)*2;my=-((e.clientY-r.top)/r.height-.5)*2;};
  const onResize=()=>{const w=canvas.offsetWidth,h=canvas.offsetHeight;renderer.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix();};
  canvas.addEventListener('mousemove',onMM,{passive:true});
  window.addEventListener('resize',onResize);
  const clock=new THREE.Clock();
  let raf;
  const tick=()=>{
    raf=requestAnimationFrame(tick);
    const t=clock.getElapsedTime();
    nodes.forEach(g=>{
      g.rotation.y=t*g.userData.spd*.25;
      g.rotation.x=t*g.userData.spd*.14;
      g.position.y=Math.sin(t*1.1+g.userData.off)*(g.userData.lit?.16:.06);
      g.scale.setScalar((g.userData.lit?1.12:1)+Math.sin(t*1.8+g.userData.i)*(g.userData.lit?.025:.005));
      g.userData.ring.rotation.z=t*.35;
    });
    cam.position.x+=(mx*.5-cam.position.x)*.04;
    cam.position.y+=(my*.3-cam.position.y)*.04;
    cam.lookAt(0,0,0);
    renderer.render(scene,cam);
  };
  tick();
  return{setProgress,destroy(){cancelAnimationFrame(raf);canvas.removeEventListener('mousemove',onMM);window.removeEventListener('resize',onResize);renderer.dispose();}};
}

/* ══════════════════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } }),
      { threshold:.1, rootMargin:'0px 0px -50px 0px' }
    );
    document.querySelectorAll('.rev').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ══════════════════════════════════════════════════════════════
   SLIDE 1 — Person thinking
══════════════════════════════════════════════════════════════ */
const Slide1 = ({ active }) => {
  const [phase, setPhase] = useState(0);
  const timersRef = useRef([]);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (!active) { setPhase(0); return; }
    [400, 1000, 1700, 2400].forEach((d, i) => {
      const t = setTimeout(() => setPhase(i + 1), d);
      timersRef.current.push(t);
    });
    return () => timersRef.current.forEach(clearTimeout);
  }, [active]);

  return (
    <div className={`demo-slide${active ? ' active' : ''}`}>
      <div className="s1-scene">
        <svg width="210" height="180" viewBox="0 0 210 180" fill="none"
          style={{ animation: active ? 'float-thought 3s ease-in-out infinite' : 'none' }}>
          {/* Desk */}
          <rect x="20" y="130" width="170" height="8" rx="4" fill="rgba(123,92,245,.25)" stroke="rgba(123,92,245,.4)" strokeWidth="1"/>
          <rect x="30" y="138" width="10" height="35" rx="3" fill="rgba(123,92,245,.2)"/>
          <rect x="170" y="138" width="10" height="35" rx="3" fill="rgba(123,92,245,.2)"/>
          {/* Laptop */}
          <rect x="70" y="105" width="70" height="45" rx="5" fill="rgba(10,9,26,.9)" stroke="rgba(123,92,245,.5)" strokeWidth="1.5"/>
          <rect x="55" y="128" width="100" height="5" rx="2.5" fill="rgba(123,92,245,.35)"/>
          <rect x="76" y="111" width="58" height="33" rx="3" fill="rgba(123,92,245,.08)"/>
          {phase >= 2 && <rect x="80" y="116" width="30" height="3" rx="1.5" fill="rgba(157,125,255,.6)" style={{animation:'fadeUp .4s both'}}/>}
          {phase >= 3 && <><rect x="80" y="122" width="44" height="2" rx="1" fill="rgba(157,125,255,.3)" style={{animation:'fadeUp .4s .1s both'}}/><rect x="80" y="127" width="38" height="2" rx="1" fill="rgba(157,125,255,.3)" style={{animation:'fadeUp .4s .2s both'}}/></>}
          {/* Person */}
          <ellipse cx="105" cy="95" rx="14" ry="10" fill="rgba(123,92,245,.15)" stroke="rgba(123,92,245,.4)" strokeWidth="1.5"/>
          <circle cx="105" cy="72" r="16" fill="rgba(20,15,40,.95)" stroke="rgba(123,92,245,.5)" strokeWidth="1.5"/>
          <circle cx="100" cy="70" r="2" fill="rgba(157,125,255,.8)"/>
          <circle cx="110" cy="70" r="2" fill="rgba(157,125,255,.8)"/>
          <path d="M101 76 Q105 79 109 76" stroke="rgba(157,125,255,.8)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <path d="M105 85 Q95 90 90 95" stroke="rgba(123,92,245,.5)" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <circle cx="88" cy="96" r="4" fill="rgba(123,92,245,.3)" stroke="rgba(123,92,245,.5)" strokeWidth="1"/>
          {/* Thought bubbles */}
          {phase >= 1 && (
            <g style={{animation:'think-bubble .5s both'}}>
              <circle cx="125" cy="58" r="3" fill="rgba(245,166,35,.4)" stroke="rgba(245,166,35,.6)" strokeWidth="1"/>
              <circle cx="132" cy="48" r="5" fill="rgba(245,166,35,.3)" stroke="rgba(245,166,35,.5)" strokeWidth="1"/>
              <circle cx="142" cy="35" r="8" fill="rgba(245,166,35,.15)" stroke="rgba(245,166,35,.4)" strokeWidth="1.5"/>
            </g>
          )}
          {phase >= 2 && (
            <g style={{animation:'idea-pop .6s .2s both'}}>
              <circle cx="142" cy="35" r="6" fill="rgba(245,166,35,.8)" style={{filter:'drop-shadow(0 0 6px rgba(245,166,35,.9))'}}>
                <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
              </circle>
              <line x1="142" y1="41" x2="142" y2="44" stroke="rgba(245,166,35,.9)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="139" y1="42" x2="138" y2="45" stroke="rgba(245,166,35,.7)" strokeWidth="1" strokeLinecap="round"/>
              <line x1="145" y1="42" x2="146" y2="45" stroke="rgba(245,166,35,.7)" strokeWidth="1" strokeLinecap="round"/>
            </g>
          )}
          {phase >= 1 && (
            <>
              <text x="60" y="50" fontSize="10" fill="rgba(157,125,255,.5)" style={{animation:'think-bubble .4s .1s both'}}>?</text>
              <text x="155" y="65" fontSize="8" fill="rgba(157,125,255,.4)" style={{animation:'think-bubble .4s .3s both'}}>?</text>
            </>
          )}
          {phase >= 3 && (
            <>
              <text x="38" y="40" fontSize="7" fill="rgba(6,214,160,.7)" fontFamily="monospace" style={{animation:'fadeUp .4s both'}}>Startup?</text>
              <text x="148" y="85" fontSize="7" fill="rgba(255,107,157,.6)" fontFamily="monospace" style={{animation:'fadeUp .4s .15s both'}}>Invest?</text>
            </>
          )}
        </svg>

        <div className="s1-caption">
          {phase === 0 && <span>A founder with a spark...</span>}
          {phase === 1 && <span>Hmm, I have an idea...</span>}
          {phase === 2 && <><span style={{color:'var(--gold2)'}}>The idea hits.</span> Now what?</>}
          {phase >= 3 && <>Where do I even <span>start?</span></>}
        </div>
        {phase >= 4 && (
          <div style={{
            padding:'.35rem .8rem',borderRadius:100,background:'rgba(123,92,245,.12)',
            border:'1px solid rgba(123,92,245,.3)',color:'#C4B1FF',
            fontSize:'.65rem',fontFamily:'var(--font-m)',animation:'fadeUp .4s both'
          }}>
            MindLaunch can help →
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   SLIDE 2 — Opens MindLaunch, types E-Commerce
   FIX: removed duplicate interval, single clean typing loop
══════════════════════════════════════════════════════════════ */
const Slide2 = ({ active }) => {
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState('');
  const timersRef = useRef([]);
  const intervalRef = useRef(null);
  const TARGET = 'E-Commerce Store';

  useEffect(() => {
    // Clear everything on deactivate or re-activate
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }

    if (!active) { setPhase(0); setTyped(''); return; }

    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 900);
    timersRef.current.push(t1, t2);

    // Start typing after 1400ms — single interval, no duplicates
    const t3 = setTimeout(() => {
      let i = 0;
      intervalRef.current = setInterval(() => {
        i++;
        setTyped(TARGET.slice(0, i));
        if (i >= TARGET.length) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          const ta = setTimeout(() => setPhase(3), 300);
          const tb = setTimeout(() => setPhase(4), 900);
          timersRef.current.push(ta, tb);
        }
      }, 85);
    }, 1400);
    timersRef.current.push(t3);

    return () => {
      timersRef.current.forEach(clearTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active]);

  return (
    <div className={`demo-slide${active ? ' active' : ''}`}>
      <div className="s2-scene">
        {phase >= 1 && (
          <div className="s2-app-bar" style={{animation:'fadeUp .4s both'}}>
            <div className="s2-app-logo">M</div>
            <span className="s2-app-name">MindLaunch</span>
            <div style={{marginLeft:'auto',width:6,height:6,borderRadius:'50%',background:'var(--emerald)',boxShadow:'0 0 6px var(--emerald)'}}/>
          </div>
        )}

        {phase >= 1 && (
          <div style={{display:'flex',justifyContent:'center',animation:'fadeUp .4s .1s both'}}>
            <svg width="120" height="65" viewBox="0 0 120 65" fill="none">
              <rect x="10" y="35" width="100" height="25" rx="6" fill="rgba(123,92,245,.1)" stroke="rgba(123,92,245,.3)" strokeWidth="1"/>
              {[0,1,2,3,4,5,6,7,8].map(i => (
                <rect key={i} x={16+i*11} y="40" width="8" height="5" rx="1.5" fill="rgba(123,92,245,.2)" stroke="rgba(123,92,245,.25)" strokeWidth=".5"/>
              ))}
              {[0,1,2,3,4,5,6,7].map(i => (
                <rect key={i} x={21+i*11} y="48" width="8" height="5" rx="1.5" fill="rgba(123,92,245,.2)" stroke="rgba(123,92,245,.25)" strokeWidth=".5"/>
              ))}
              <ellipse cx="60" cy="33" rx="6" ry="9" fill="rgba(20,15,40,.9)" stroke="rgba(123,92,245,.4)" strokeWidth="1.5"
                style={{animation:'bob 1.2s ease-in-out infinite'}}/>
              <rect x="30" y="2" width="60" height="28" rx="5" fill="rgba(10,9,26,.95)" stroke="rgba(123,92,245,.4)" strokeWidth="1"/>
              <rect x="35" y="7" width="20" height="2" rx="1" fill="rgba(157,125,255,.4)"/>
              <rect x="35" y="12" width="45" height="8" rx="2" fill="rgba(123,92,245,.1)" stroke="rgba(123,92,245,.2)" strokeWidth=".8"/>
              <text x="37" y="19" fontSize="5.5" fill="rgba(255,209,102,.9)" fontFamily="monospace">
                {typed.length > 0 ? typed.slice(0,12) + (typed.length < TARGET.length ? '|' : '') : ''}
              </text>
            </svg>
          </div>
        )}

        {phase >= 1 && (
          <div className="s2-prompt-box" style={{animation:'fadeUp .4s .15s both'}}>
            <div className="s2-prompt-label">My Startup Idea</div>
            <div className="s2-typed">
              {typed || <span style={{opacity:.3}}>Start typing…</span>}
              {typed.length > 0 && typed.length < TARGET.length && <span className="s2-cursor"/>}
              {typed.length === 0 && phase >= 2 && <span className="s2-cursor"/>}
            </div>
          </div>
        )}

        {phase >= 3 && (
          <div style={{animation:'fadeUp .4s both'}}>
            <div className="s2-tracks-label" style={{marginBottom:'.4rem'}}>Recommended tracks</div>
            <div className="s2-track-chips">
              <span className="s2-chip s2-chip-v">Foundations</span>
              <span className="s2-chip s2-chip-g">Finance</span>
              <span className="s2-chip s2-chip-e">Marketing</span>
              <span className="s2-chip s2-chip-v">Fundraising</span>
            </div>
          </div>
        )}

        {phase >= 4 && (
          <button className="s2-cta" style={{animation:'bounce-in .5s both'}}>
            Build My Roadmap <IconArrow size={10}/>
          </button>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   SLIDE 3 — Pitch Coach
══════════════════════════════════════════════════════════════ */
const Slide3 = ({ active }) => {
  const [phase, setPhase] = useState(0);
  const [msgs, setMsgs] = useState([]);
  const [scoreW, setScoreW] = useState(0);
  const timersRef = useRef([]);

  const MSGS = [
    { who:'ai',   text:"What's your edge over Flipkart?" },
    { who:'user', text:"AI-curated local inventory." },
    { who:'ai',   text:"Strong. Revenue model?" },
  ];

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (!active) { setPhase(0); setMsgs([]); setScoreW(0); return; }

    [300,800,1400,2000,2600,3200,4000,4800].forEach((d,i) => {
      const t = setTimeout(() => setPhase(i+1), d);
      timersRef.current.push(t);
    });
    MSGS.forEach((msg,i) => {
      const t = setTimeout(() => setMsgs(prev => prev.length <= i ? [...prev, msg] : prev), 2600+i*800);
      timersRef.current.push(t);
    });
    const st = setTimeout(() => setScoreW(82), 5200);
    timersRef.current.push(st);
    return () => timersRef.current.forEach(clearTimeout);
  }, [active]);

  return (
    <div className={`demo-slide${active ? ' active' : ''}`}>
      <div className="s3-scene">
        <div className="s3-bag-stage">
          <svg width="130" height="110" viewBox="0 0 130 110" fill="none">
            <rect x="25" y="35" width="80" height="65" rx="8"
              fill="rgba(245,166,35,.12)" stroke="rgba(245,166,35,.6)" strokeWidth="2"
              style={{animation: phase>=1 ? 'bounce-in .5s both' : 'none'}}/>
            <path d="M45 35 Q45 18 65 18 Q85 18 85 35"
              stroke="rgba(245,166,35,.7)" strokeWidth="2.5" strokeLinecap="round" fill="none"
              style={{animation: phase>=1 ? 'fadeUp .4s .1s both' : 'none'}}/>
            <circle cx="65" cy="35" r="4" fill="rgba(245,166,35,.5)" stroke="rgba(245,166,35,.8)" strokeWidth="1"
              style={{animation: phase>=1 ? 'think-bubble .3s .2s both' : 'none'}}/>
            {phase >= 2 && (
              <g style={{animation:'bounce-in .5s .3s both'}}>
                <text x="53" y="72" fontSize="22" fill="rgba(245,166,35,.8)">🛍</text>
              </g>
            )}
            {phase >= 3 && (
              <g style={{animation:'bounce-in .6s .2s both', transformOrigin:'65px 60px'}}>
                <rect x="50" y="28" width="30" height="50" rx="5"
                  fill="rgba(10,9,26,.95)" stroke="rgba(123,92,245,.7)" strokeWidth="1.5"/>
                <rect x="52" y="33" width="26" height="38" rx="3" fill="rgba(7,6,20,.9)"/>
                <circle cx="65" cy="43" r="6" fill="rgba(123,92,245,.2)" stroke="rgba(123,92,245,.5)" strokeWidth="1">
                  <animate attributeName="r" values="5;7;5" dur="1.5s" repeatCount="indefinite"/>
                </circle>
                <text x="61" y="47" fontSize="7" fill="rgba(157,125,255,.9)" fontWeight="bold">AI</text>
                <rect x="54" y="54" width="18" height="2" rx="1" fill="rgba(157,125,255,.4)"/>
                <rect x="54" y="58" width="14" height="2" rx="1" fill="rgba(245,166,35,.3)"/>
                <rect x="54" y="62" width="16" height="2" rx="1" fill="rgba(157,125,255,.3)"/>
              </g>
            )}
            {phase >= 3 && (
              <g>
                <line x1="25" y1="35" x2="15" y2="25" stroke="rgba(245,166,35,.6)" strokeWidth="1.5" strokeLinecap="round"
                  strokeDasharray="20" style={{animation:'draw-line .3s both'}}/>
                <line x1="105" y1="35" x2="115" y2="25" stroke="rgba(245,166,35,.6)" strokeWidth="1.5" strokeLinecap="round"
                  strokeDasharray="20" style={{animation:'draw-line .3s .1s both'}}/>
                <line x1="65" y1="35" x2="65" y2="20" stroke="rgba(123,92,245,.6)" strokeWidth="1.5" strokeLinecap="round"
                  strokeDasharray="20" style={{animation:'draw-line .3s .05s both'}}/>
              </g>
            )}
          </svg>
          {phase >= 2 && (
            <div style={{
              position:'absolute',bottom:0,left:'50%',transform:'translateX(-50%)',
              fontSize:'.58rem',color:'var(--gold2)',fontFamily:'var(--font-m)',
              whiteSpace:'nowrap',animation:'fadeUp .3s both'
            }}>
              {phase < 3 ? 'E-Commerce module loaded' : 'Pitch Coach unlocked!'}
            </div>
          )}
        </div>

        {phase >= 4 && (
          <div className="s3-coach-panel" style={{animation:'fadeUp .5s both'}}>
            <div className="s3-coach-hdr">
              <div className="s3-coach-avatar"><IconAI size={12}/></div>
              <div>
                <div className="s3-coach-name">AI Pitch Coach</div>
                <div className="s3-coach-status">● Live session</div>
              </div>
            </div>
            <div className="s3-chat">
              {msgs.map((m,i) => (
                <div key={i} className={`s3-bubble ${m.who}`} style={{animation:'fadeUp .4s both'}}>
                  <span className="s3-bubble-who">{m.who==='ai'?'AI Investor':'You'}</span>
                  {m.text}
                </div>
              ))}
            </div>
            {scoreW > 0 && (
              <div className="s3-score" style={{animation:'fadeUp .4s both'}}>
                <span className="s3-score-lbl">Pitch Score</span>
                <div className="s3-score-bar"><div className="s3-score-fill" style={{width:`${scoreW}%`}}/></div>
                <span className="s3-score-val">{scoreW}/100</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   SLIDE 4 — VC Network
══════════════════════════════════════════════════════════════ */
const Slide4 = ({ active }) => {
  const [phase, setPhase] = useState(0);
  const [vcIn, setVcIn] = useState([]);
  const [notifyIn, setNotifyIn] = useState(false);
  const timersRef = useRef([]);

  const VCS = [
    { name:'Sequoia Capital',  firm:'Series A · $500K–$5M', bg:'#1a1230', status:'match' },
    { name:'Accel Partners',   firm:'Seed · $100K–$1M',     bg:'#12201a', status:'rev'   },
    { name:'Elevation Capital',firm:'Early · $250K+',        bg:'#1e1210', status:'match' },
  ];

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (!active) { setPhase(0); setVcIn([]); setNotifyIn(false); return; }

    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 900);
    timersRef.current.push(t1, t2);
    VCS.forEach((_,i) => {
      const t = setTimeout(() => setVcIn(prev => prev.includes(i) ? prev : [...prev,i]), 1200+i*600);
      timersRef.current.push(t);
    });
    const tN = setTimeout(() => setNotifyIn(true), 3200);
    timersRef.current.push(tN);
    return () => timersRef.current.forEach(clearTimeout);
  }, [active]);

  return (
    <div className={`demo-slide${active ? ' active' : ''}`}>
      <div className="s4-scene">
        <div className="s4-title" style={{animation:active?'fadeUp .4s both':'none'}}>
          Profile Listed — VCs Inbound
        </div>
        <div className="s4-sub" style={{animation:active?'fadeUp .4s .1s both':'none'}}>
          {phase >= 2 ? `${vcIn.length} match${vcIn.length!==1?'es':''} found` : 'Scanning investor network...'}
        </div>

        <div className="s4-net-stage">
          <svg width="100%" height="130" viewBox="0 0 220 130" fill="none" preserveAspectRatio="xMidYMid meet">
            {/* Center node */}
            <circle cx="110" cy="65" r="18" fill="rgba(123,92,245,.15)" stroke="rgba(123,92,245,.5)" strokeWidth="2">
              {phase>=1 && <animate attributeName="r" values="16;20;16" dur="2s" repeatCount="indefinite"/>}
            </circle>
            <circle cx="110" cy="65" r="10" fill="rgba(123,92,245,.3)" stroke="rgba(123,92,245,.8)" strokeWidth="1.5"/>
            <text x="104" y="69" fontSize="8" fill="rgba(157,125,255,.9)" fontWeight="bold">YOU</text>
            {/* VC nodes */}
            {[
              {cx:38,cy:32,color:'rgba(245,166,35,.7)',label:'SEQ'},
              {cx:182,cy:32,color:'rgba(6,214,160,.7)',label:'ACC'},
              {cx:38,cy:98,color:'rgba(255,107,157,.7)',label:'ELE'},
              {cx:182,cy:98,color:'rgba(157,125,255,.7)',label:'VC4'},
            ].map((n,i) => (
              <g key={i} style={{opacity:vcIn.includes(i)?1:.2,transition:'opacity .5s ease'}}>
                <line
                  x1={n.cx>110?n.cx-12:n.cx+12} y1={n.cy>65?n.cy-8:n.cy+8}
                  x2={n.cx>110?122:98} y2={n.cy>65?73:57}
                  stroke={n.color} strokeWidth="1.5" opacity=".5" strokeDasharray="4 3">
                  {vcIn.includes(i) && <animate attributeName="stroke-dashoffset" values="14;0" dur="1s" repeatCount="indefinite"/>}
                </line>
                <circle cx={n.cx} cy={n.cy} r="14" fill="rgba(10,9,26,.9)" stroke={n.color} strokeWidth="1.5"/>
                <circle cx={n.cx} cy={n.cy} r="4" fill={n.color} opacity=".8">
                  {vcIn.includes(i) && <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite"/>}
                </circle>
                <text x={n.cx-8} y={n.cy+3} fontSize="5.5" fill="rgba(240,239,248,.6)" fontFamily="monospace">{n.label}</text>
              </g>
            ))}
            {phase>=1 && (
              <circle cx="110" cy="65" r="35" stroke="rgba(123,92,245,.12)" strokeWidth="1" fill="none" strokeDasharray="4 3"
                style={{animation:'spin-slow 8s linear infinite',transformOrigin:'110px 65px'}}/>
            )}
          </svg>
        </div>

        <div className="s4-vc-list">
          {VCS.map((v,i) => (
            <div key={i} className={`s4-vc-row${vcIn.includes(i)?' in':''}`} style={{transitionDelay:`${i*.05}s`}}>
              <div className="s4-vc-dot" style={{background:v.bg,color:'var(--violet2)'}}>
                {i===0?<IconBank size={13}/>:i===1?<IconTarget size={13}/>:<IconZap size={13}/>}
              </div>
              <div className="s4-vc-info">
                <div className="s4-vc-name">{v.name}</div>
                <div className="s4-vc-firm">{v.firm}</div>
              </div>
              <span className={`s4-badge ${v.status}`}>{v.status==='match'?'Match':'Reviewing'}</span>
            </div>
          ))}
        </div>

        <div className={`s4-notify${notifyIn?' in':''}`}>
          <span style={{color:'var(--gold)',flexShrink:0}}><IconMail size={12}/></span>
          <span><strong>Accel Partners</strong> sent a meeting request!</span>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const user = null;

  const bgCanRef      = useRef(null);
  const stepsCanRef   = useRef(null);
  const stepSecRef    = useRef(null);
  const hdrRef        = useRef(null);
  const cursorRef     = useRef(null);
  const cursorRingRef = useRef(null);
  const stepsApiRef   = useRef(null);

  const [activeStep, setActiveStep]   = useState(-1);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [demoActive, setDemoActive]   = useState(0);
  const [autoPlay,   setAutoPlay]     = useState(true);

  useReveal();

  /* Inject fonts + CSS */
  useEffect(() => {
    injectFonts();
    let el = document.getElementById('ml-css-v5-fixed');
    if (!el) { el = document.createElement('style'); el.id = 'ml-css-v5-fixed'; document.head.appendChild(el); }
    el.textContent = CSS;
  }, []);

  /* Custom cursor */
  useEffect(() => {
    let rx=0,ry=0,tx=0,ty=0,raf;
    const move=e=>{tx=e.clientX;ty=e.clientY;};
    window.addEventListener('mousemove',move,{passive:true});
    const loop=()=>{
      raf=requestAnimationFrame(loop);
      rx+=(tx-rx)*.13;ry+=(ty-ry)*.13;
      if(cursorRef.current){cursorRef.current.style.left=`${tx}px`;cursorRef.current.style.top=`${ty}px`;}
      if(cursorRingRef.current){cursorRingRef.current.style.left=`${rx}px`;cursorRingRef.current.style.top=`${ry}px`;}
    };
    loop();
    return()=>{window.removeEventListener('mousemove',move);cancelAnimationFrame(raf);};
  },[]);

  /* Header scroll */
  useEffect(() => {
    const fn=()=>hdrRef.current?.classList.toggle('solid',scrollY>30);
    window.addEventListener('scroll',fn,{passive:true});
    return()=>window.removeEventListener('scroll',fn);
  },[]);

  /* BG particles */
  useEffect(() => {
    if(!bgCanRef.current)return;
    const destroy=createBgParticles(bgCanRef.current);
    return()=>destroy?.();
  },[]);

  /* Steps 3D scene */
  useEffect(() => {
    if(!stepsCanRef.current)return;
    const api=createStepsScene(stepsCanRef.current);
    stepsApiRef.current=api;
    return()=>api.destroy();
  },[]);

  /* Scroll-driven steps */
  useEffect(() => {
    const fn=()=>{
      if(!stepSecRef.current)return;
      const rect=stepSecRef.current.getBoundingClientRect();
      const total=stepSecRef.current.offsetHeight-innerHeight;
      const p=Math.max(0,Math.min(1,-rect.top/total));
      stepsApiRef.current?.setProgress(p);
      setActiveStep(Math.min(3,Math.floor(p*4.8))-1);
    };
    window.addEventListener('scroll',fn,{passive:true});
    fn();
    return()=>window.removeEventListener('scroll',fn);
  },[]);

  /* Auto-cycle demo slides */
  useEffect(() => {
    if(!autoPlay)return;
    const id=setInterval(()=>setDemoActive(p=>(p+1)%4),5500);
    return()=>clearInterval(id);
  },[autoPlay]);

  /* Feature card tilt */
  useEffect(() => {
    const cards=document.querySelectorAll('[data-tilt]');
    const cleanup=[];
    cards.forEach(card=>{
      const mm=e=>{
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`translateY(-6px) rotateX(${-y*10}deg) rotateY(${x*10}deg)`;
        card.style.setProperty('--mx',`${(x+.5)*100}%`);
        card.style.setProperty('--my',`${(y+.5)*100}%`);
      };
      const ml=()=>{card.style.transform='';};
      card.addEventListener('mousemove',mm);card.addEventListener('mouseleave',ml);
      cleanup.push(()=>{card.removeEventListener('mousemove',mm);card.removeEventListener('mouseleave',ml);});
    });
    return()=>cleanup.forEach(f=>f());
  },[]);

  const scrollTo=id=>{
    const el=document.getElementById(id);
    if(!el)return;
    window.scrollTo({top:el.getBoundingClientRect().top+scrollY-80,behavior:'smooth'});
    setMobileOpen(false);
  };

  const handleDemoClick=id=>{setDemoActive(id);setAutoPlay(false);};

  const Chk=()=><IconCheck size={9}/>;

  const features=[
    {Ico:IconBrain,cls:'fi-v',t:'AI Venture Mentor',    p:'Pitch Coach powered by Claude. Mock Q&A with readiness scores across Clarity, Market Fit, and Value Prop.'},
    {Ico:IconBook, cls:'fi-g',t:'30 Structured Modules', p:'Five focused tracks — Foundations, Finance, Operations, Marketing, Fundraising. Each module produces an exportable deliverable.'},
    {Ico:IconGlobe,cls:'fi-e',t:'Built For Your Region',  p:'Templates and coaching tuned for US, GCC, and key African ecosystems. Not generic advice painted over your local reality.'},
  ];

  const steps=[
    {n:'01',t:'Describe your idea',    p:'Brief your concept, pick category tiles and your target region.'},
    {n:'02',t:'Complete each module',  p:'Structured lessons with deliverables you fill out — not just watch.'},
    {n:'03',t:'Spar with Pitch Coach', p:'AI investor fires real questions. Weak spots scored and rebuilt.'},
    {n:'04',t:'Export your brief',     p:'One-click PDF or Word export, ready to send to investors.'},
  ];

  const DEMO_STEPS=[
    {id:0,label:'The Spark',          sub:"A founder has an idea — but doesn't know where to begin",side:'left'},
    {id:1,label:'Open MindLaunch',    sub:'Type your idea. Get a tailored roadmap in seconds',       side:'left'},
    {id:2,label:'Pitch Coach Session',sub:'Your product emerges. AI investor fires real questions',   side:'right'},
    {id:3,label:'VC Connections Live',sub:'Profile goes live. Investors match and request meetings',  side:'right'},
  ];

  const regions=[
    {name:'United States',code:'US'},{name:'UAE',code:'UAE'},{name:'Saudi Arabia',code:'SA'},
    {name:'Egypt',code:'EG'},{name:'Nigeria',code:'NG'},{name:'Kenya',code:'KE'},
    {name:'Jordan',code:'JO'},{name:'Qatar',code:'QA'},{name:'India',code:'IN'},
  ];

  return (
    <>
      <div id="ml-cursor" ref={cursorRef}/>
      <div id="ml-cursor-ring" ref={cursorRingRef}/>
      <div className="ml-noise"/>
      <canvas id="ml-bg-canvas" ref={bgCanRef}/>

      <div className="ml-page">

        {/* HEADER */}
        <div className="ml-hdr-wrap" ref={hdrRef}>
          <header className="ml-hdr">
            <Link to="/" className="ml-logo">
              <div className="ml-logo-gem">M</div>
              Mind<span className="ml-logo-v">Launch</span>
            </Link>
            <nav className="ml-nav-links">
              {[['features','Features'],['demo','See It Live'],['steps','How It Works'],['pricing','Pricing'],['regions','Regions']].map(([id,label])=>(
                <span key={id} className="ml-nav-link" onClick={()=>scrollTo(id)}>{label}</span>
              ))}
            </nav>
            <div className="ml-hdr-btns dk">
              {user
                ?<Link to="/dashboard" className="btn-primary">Dashboard <IconArrow/></Link>
                :<><Link to="/login" className="btn-ghost">Log in</Link><Link to="/register" className="btn-primary">Get started <IconArrow/></Link></>
              }
            </div>
            <button className={`ml-hamburger${mobileOpen?' open':''}`} onClick={()=>setMobileOpen(v=>!v)} aria-label="Menu">
              <span/><span/><span/>
            </button>
          </header>
          <div
  className={`ml-mobile-overlay${mobileOpen?' open':''}`}
  onClick={()=>setMobileOpen(false)}
  style={{ display: mobileOpen ? 'block' : 'none' }}
/>
          <nav
  className={`ml-mobile-menu${mobileOpen?' open':''}`}
  style={{ display: mobileOpen ? 'flex' : 'none' }}
>
            {[['features','Features'],['demo','See It Live'],['steps','How It Works'],['pricing','Pricing'],['regions','Regions']].map(([id,label])=>(
              <span key={id} className="ml-nav-link" onClick={()=>scrollTo(id)}>{label}</span>
            ))}
            <div style={{display:'flex',flexDirection:'column',gap:'.6rem',marginTop:'1rem'}}>
              <Link to="/login" className="btn-ghost">Log in</Link>
              <Link to="/register" className="btn-primary">Get started <IconArrow/></Link>
            </div>
          </nav>
        </div>

        {/* HERO */}
        <section className="ml-hero">
          <div className="hero-badge">
            <span className="badge-icon-wrap"><IconShark size={22}/></span>
            Shark Tank–style VC matchmaking
          </div>
          <h1 className="hero-h1">
            Launch your startup
            <span className="h1-line2">with <span className="grad-violet">AI-guided</span> <span className="grad-gold">learning</span></span>
          </h1>
          <p className="hero-p">30 structured modules across 5 tracks. A Claude-powered pitch coach that thinks like a VC. Built for founders in 9 global markets — from Mumbai to Manhattan.</p>
          <div className="vc-banner">
            <div className="vc-banner-in">
              <div className="vc-banner-icon"><IconShark size={40}/></div>
              <div>
                <h3 className="vc-banner-title">Complete Your Journey — Get Funded</h3>
                <p className="vc-banner-body">Finish all courses with your pitch deck and presentation. Your profile gets automatically listed with our connected VC network for evaluation and funding — just like Shark Tank, but global.</p>
              </div>
            </div>
          </div>
          <div className="hero-acts">
            <Link to="/register" className="btn-gold">Get started free <IconArrow/></Link>
            <button className="btn-outline" onClick={()=>scrollTo('demo')}>See it in action</button>
          </div>
          <div className="hero-stats">
            {[['30','Modules'],['5','Tracks'],['9','Regions'],['AI','Coach']].map(([n,l])=>(
              <div className="hs-item" key={l}>
                <span className="hs-n" style={n==='AI'?{color:'var(--violet2)'}:{}}>{n}</span>
                <span className="hs-l">{l}</span>
              </div>
            ))}
          </div>
          <div className="hero-tracks">
            <span className="trk-lbl">YOUR TRACKS</span>
            <div className="trk-pills">
              <span className="trk-pill tp1">Foundations</span>
              <span className="trk-pill tp2">Finance</span>
              <span className="trk-pill tp3">Operations</span>
              <span className="trk-pill tp4">Marketing</span>
              <span className="trk-pill tp1">Fundraising</span>
            </div>
            <div className="trk-live">
              <div className="trk-live-dot"/>
              <span className="trk-live-lbl">Claude API live</span>
            </div>
          </div>
          <div className="scroll-hint">
            <div className="scroll-ring">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </div>
            <span className="scroll-txt">Scroll to explore</span>
          </div>
        </section>

        {/* DEMO */}
        <section className="demo-section" id="demo">
          <div className="demo-container">
            <div className="demo-hdr rev">
              <div className="sec-tag" style={{justifyContent:'center'}}><div className="sec-tag-dot"/>See It In Action</div>
              <h2 className="sec-h2" style={{textAlign:'center'}}>From spark to <span className="grad-gold">funded founder</span><br/>in four scenes</h2>
              <p className="sec-sub" style={{margin:'0 auto',textAlign:'center',maxWidth:'520px'}}>Watch a real founder journey — idea, roadmap, pitch session, investor match. Click any scene or let it play.</p>
            </div>

            <div className="demo-stage rev" style={{transitionDelay:'80ms'}}>
              {/* LEFT */}
              <div className="demo-left">
                {DEMO_STEPS.filter(s=>s.side==='left').map(s=>(
                  <div key={s.id} className={`demo-trigger${demoActive===s.id?' active':''}${demoActive>s.id?' done':''}`} onClick={()=>handleDemoClick(s.id)}>
                    <div className="dt-num">{demoActive>s.id?<Chk/>:`0${s.id+1}`}</div>
                    <div><div className="dt-label">{s.label}</div><div className="dt-sub">{s.sub}</div></div>
                  </div>
                ))}
              </div>

              {/* PHONE */}
              <div className="demo-phone-wrap">
                <div className="demo-phone">
                  <div className="phone-screen">
                    <Slide1 active={demoActive===0}/>
                    <Slide2 active={demoActive===1}/>
                    <Slide3 active={demoActive===2}/>
                    <Slide4 active={demoActive===3}/>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="demo-right">
                {DEMO_STEPS.filter(s=>s.side==='right').map(s=>(
                  <div key={s.id} className={`demo-trigger${demoActive===s.id?' active':''}${demoActive>s.id?' done':''}`} onClick={()=>handleDemoClick(s.id)}>
                    <div className="dt-num">{demoActive>s.id?<Chk/>:`0${s.id+1}`}</div>
                    <div><div className="dt-label">{s.label}</div><div className="dt-sub">{s.sub}</div></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress dots */}
            <div style={{display:'flex',justifyContent:'center',gap:'.6rem',marginTop:'2.5rem'}}>
              {DEMO_STEPS.map(s=>(
                <div key={s.id} onClick={()=>handleDemoClick(s.id)} style={{
                  width:demoActive===s.id?28:8,height:8,borderRadius:4,
                  background:demoActive===s.id?'var(--violet2)':'rgba(255,255,255,.12)',
                  cursor:'pointer',transition:'all .35s var(--ease)',
                  boxShadow:demoActive===s.id?'0 0 12px var(--violet2)':'none',
                }}/>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <div className="bg-alt" id="features">
          <section className="ml-sec">
            <div className="rev">
              <div className="sec-tag"><div className="sec-tag-dot"/>Why MindLaunch</div>
              <h2 className="sec-h2">Everything a founder needs.<br/>Nothing they don't.</h2>
              <p className="sec-sub">We replaced the bloated accelerator model with a focused, AI-native curriculum.</p>
            </div>
            <div className="feat-grid">
              {features.map(({Ico,cls,t,p},i)=>(
                <div key={i} className="feat-card rev" data-tilt style={{transitionDelay:`${i*80}ms`}}>
                  <div className="feat-glow"/>
                  <div className={`feat-ico ${cls}`}><Ico size={22}/></div>
                  <h3 className="feat-h3">{t}</h3>
                  <p className="feat-p">{p}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* STEPS */}
        <div id="steps" ref={stepSecRef} className="steps-section">
          <div className="steps-sticky">
            <canvas ref={stepsCanRef} id="ml-steps-canvas"/>
            <div className="steps-ui">
              <div className="steps-hdr">
                <div className="sec-tag" style={{justifyContent:'center'}}><div className="sec-tag-dot"/>Process</div>
                <h2 className="sec-h2" style={{textAlign:'center'}}>Four steps to <span className="grad-violet">investor-ready</span></h2>
                <p className="sec-sub" style={{margin:'0 auto',textAlign:'center'}}>Scroll down — the orbs light up as you move through each phase.</p>
              </div>
              <div className="steps-grid">
                {steps.map((s,i)=>(
                  <div key={i} className={`step-card${activeStep>=i?' lit':''}`}>
                    <div className="step-card-line"/>
                    <div className="step-n">{s.n}</div>
                    <h3 className="step-h">{s.t}</h3>
                    <p className="step-p">{s.p}</p>
                  </div>
                ))}
              </div>
              <div className="steps-progress">
                {steps.map((_,i)=><div key={i} className={`prog-dot${activeStep>=i?' active':''}`}/>)}
              </div>
            </div>
          </div>
        </div>

        {/* PRICING */}
        <div className="bg-alt" id="pricing">
          <section className="ml-sec">
            <div className="rev">
              <div className="sec-tag"><div className="sec-tag-dot"/>Pricing</div>
              <h2 className="sec-h2">Simple, honest pricing.</h2>
              <p className="sec-sub">No micro-transactions. One price unlocks everything. Cancel anytime.</p>
            </div>
            <div className="price-grid">
              <div className="price-card rev">
                <div><div className="p-name">Starter</div><div className="p-desc">Explore before you commit.</div></div>
                <div className="p-price">Free <small>/ forever</small></div>
                <div className="p-div"/>
                <div className="p-feats">
                  {['Module 1 unlocked','AI Pitch Coach chat','Basic PDF export','Startup profile'].map(f=>(
                    <div className="p-feat" key={f}><div className="p-ck ck-v"><Chk/></div>{f}</div>
                  ))}
                </div>
                <Link to="/register" className="btn-p-outline">Start free</Link>
              </div>
              <div className="price-card rev" style={{transitionDelay:'80ms'}}>
                <div><div className="p-name">Premium Monthly</div><div className="p-desc">Perfect for focused learning.</div></div>
                <div className="p-price">₹399 <small>/ month</small></div>
                <div className="p-div"/>
                <div className="p-feats">
                  {['All 30 modules unlocked','AI Pitch Coach + full reports','PDF & Word exports','Regional frameworks','Email support'].map(f=>(
                    <div className="p-feat" key={f}><div className="p-ck ck-v"><Chk/></div>{f}</div>
                  ))}
                </div>
                <Link to="/register" className="btn-p-primary">Subscribe <IconArrow size={12}/></Link>
              </div>
              <div className="price-card hot rev" style={{transitionDelay:'160ms'}}>
                <div className="hot-chip">Best value</div>
                <div><div className="p-name">Premium Yearly</div><div className="p-desc">Save 48% vs monthly.</div></div>
                <div className="p-price">₹2,499 <small>/ year</small></div>
                <div className="p-div"/>
                <div className="p-feats">
                  {['All 30 modules unlocked','AI Pitch Coach + full reports','PDF & Word exports','Regional frameworks','Priority support'].map(f=>(
                    <div className="p-feat bright" key={f}><div className="p-ck ck-g"><Chk/></div>{f}</div>
                  ))}
                </div>
                <Link to="/register" className="btn-p-gold">Get full access <IconArrow size={12}/></Link>
              </div>
            </div>
          </section>
        </div>

        {/* REGIONS */}
        <section className="ml-sec" id="regions">
          <div className="rev">
            <div className="sec-tag"><div className="sec-tag-dot"/>Coverage</div>
            <h2 className="sec-h2">Nine global markets.</h2>
            <p className="sec-sub">Curriculum and templates adapted to your local market dynamics and regulations.</p>
          </div>
          <div className="reg-grid">
            {regions.map((r,i)=>(
              <div className="reg-card rev" key={i} style={{transitionDelay:`${i*35}ms`}}>
                <div className="reg-code">{r.code}</div>
                <span className="reg-nm">{r.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="cta-outer rev">
          <div className="cta-wrap">
            <div className="cta-in">
              <div>
                <h2 className="cta-h2">Ready to build your startup?</h2>
                <p className="cta-p">Join founders across 9 markets going from idea to investor-ready with MindLaunch.</p>
              </div>
              <div className="cta-acts">
                <Link to="/register" className="btn-gold">Start for free <IconArrow/></Link>
                <button className="btn-outline" onClick={()=>scrollTo('demo')}>See demo</button>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="ml-ftr">
          <div className="ml-ftr-in">
            <div>
              <Link to="/" className="ml-logo" style={{marginBottom:'.3rem',display:'inline-flex'}}>
                <div className="ml-logo-gem" style={{width:28,height:28,fontSize:'.78rem'}}>M</div>
                Mind<span className="ml-logo-v">Launch</span>
              </Link>
              <div className="ftr-copy">© 2026 MindLaunch. All rights reserved.</div>
            </div>
            <nav className="ftr-links">
              <a href="#" className="ftr-a">Privacy policy</a>
              <a href="#" className="ftr-a">Terms of service</a>
              <a href="#" className="ftr-a">Support</a>
            </nav>
          </div>
        </footer>

      </div>
    </>
  );
}