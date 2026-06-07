import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as THREE from 'three';

/*
  MindLaunch Landing Page v4
  ─ Fixed: blank screen crash on Slide3 re-render (chat msgs now use stable ref)
  ─ Fixed: Three.js loaded via npm import (no CDN, no race condition)
  ─ Fixed: all emojis replaced with inline SVG icons
  ─ Place at: src/pages/LandingPage.jsx
  ─ Requires: npm install three react-router-dom
*/

/* ─── Font injection ─── */
const injectFonts = () => {
  if (document.getElementById('ml-fonts')) return;
  const l = document.createElement('link');
  l.id = 'ml-fonts'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(l);
};

/* ══════════════════════════════════════════════════════════════
   CSS
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

/* CURSOR */
#ml-cursor{position:fixed;width:10px;height:10px;background:var(--violet2);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:screen;transition:width .2s var(--spring),height .2s var(--spring),background .2s}
#ml-cursor-ring{position:fixed;width:34px;height:34px;border:1px solid rgba(123,92,245,.4);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:all .1s var(--ease)}

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
.ml-sec{padding:8rem 2.5rem;position:relative;max-width:1280px;margin:0 auto}
.bg-alt{background:linear-gradient(180deg,transparent,rgba(20,15,40,.45) 15%,rgba(20,15,40,.45) 85%,transparent);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.sec-tag{display:inline-flex;align-items:center;gap:.5rem;padding:.28rem .9rem;border-radius:100px;border:1px solid rgba(123,92,245,.22);background:rgba(123,92,245,.08);color:rgba(157,125,255,.9);font-family:var(--font-m);font-size:.72rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;margin-bottom:1.5rem}
.sec-tag-dot{width:5px;height:5px;border-radius:50%;background:var(--violet2);box-shadow:0 0 8px var(--violet2);animation:pulse 2s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
.sec-h2{font-family:var(--font-d);font-size:clamp(2.2rem,4.5vw,3.2rem);font-weight:800;letter-spacing:-2px;line-height:1.06;margin-bottom:1rem}
.sec-sub{color:var(--text2);font-size:1.05rem;max-width:520px;line-height:1.72;font-weight:400}
.grad-violet{background:linear-gradient(135deg,#C4B1FF,#7B5CF5,#9D7DFF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.grad-gold{background:linear-gradient(135deg,#FFE066,#F5A623,#FFB347);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.rev{opacity:0;transform:translateY(28px);transition:opacity .7s var(--ease),transform .7s var(--ease)}
.rev.vis{opacity:1;transform:translateY(0)}

/* HERO */
.ml-hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:9rem 2rem 5rem;position:relative}
.hero-badge{display:inline-flex;align-items:center;gap:.6rem;padding:.35rem 1rem;border-radius:100px;border:1px solid rgba(245,166,35,.3);background:rgba(245,166,35,.07);color:rgba(255,209,102,.9);font-size:.78rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;margin-bottom:2.2rem;animation:fadeUp .8s .1s both}
.badge-icon-wrap{display:flex;align-items:center;animation:swim 2s ease-in-out infinite}
@keyframes swim{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}
.hero-h1{font-family:var(--font-d);font-size:clamp(3rem,7.5vw,5.5rem);font-weight:800;letter-spacing:-3.5px;line-height:1.02;margin-bottom:1.8rem;animation:fadeUp .8s .2s both}
.h1-line2{display:block;margin-top:.15em}
.hero-p{font-size:1.15rem;color:var(--text2);max-width:600px;line-height:1.75;margin:0 auto 2.8rem;font-weight:400;animation:fadeUp .8s .3s both}

/* Shark / VC card */
.vc-banner{width:100%;max-width:760px;padding:1px;background:linear-gradient(135deg,rgba(245,166,35,.55),rgba(255,107,157,.4),rgba(245,166,35,.3));border-radius:var(--rl);box-shadow:0 0 60px rgba(245,166,35,.15);margin-bottom:2.5rem;animation:fadeUp .8s .35s both}
.vc-banner-in{background:linear-gradient(135deg,rgba(16,10,30,.97),rgba(12,8,24,.97));border-radius:calc(var(--rl) - 1px);padding:1.6rem 2rem;display:flex;align-items:center;gap:1.4rem;text-align:left}
.vc-banner-icon{flex-shrink:0;animation:swim 2.5s ease-in-out infinite;color:var(--gold)}
.vc-banner-title{font-family:var(--font-d);font-size:1.2rem;font-weight:700;background:linear-gradient(135deg,var(--gold2),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:.4rem;letter-spacing:-.3px}
.vc-banner-body{font-size:.88rem;color:var(--text2);line-height:1.6;font-weight:400}

.hero-acts{display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;margin-bottom:3.5rem;animation:fadeUp .8s .4s both}
.hero-stats{display:flex;gap:0;flex-wrap:wrap;justify-content:center;border:1px solid var(--border);border-radius:16px;background:rgba(255,255,255,.02);overflow:hidden;animation:fadeUp .8s .5s both;backdrop-filter:blur(10px)}
.hs-item{padding:1.2rem 2rem;border-right:1px solid var(--border);display:flex;flex-direction:column;align-items:center;gap:.2rem}
.hs-item:last-child{border-right:none}
.hs-n{font-family:var(--font-d);font-size:1.7rem;font-weight:800;letter-spacing:-1px;line-height:1}
.hs-l{font-size:.68rem;color:var(--text3);text-transform:uppercase;letter-spacing:.9px;font-weight:600}
.hero-tracks{width:100%;max-width:800px;border:1px solid var(--border);border-radius:16px;background:rgba(255,255,255,.02);backdrop-filter:blur(10px);padding:1rem 1.6rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin-top:1.5rem;animation:fadeUp .8s .6s both}
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
@keyframes bob{0%,100%{transform:translateY(0)}60%{transform:translateY(6px)}}
.scroll-txt{font-size:.66rem;color:var(--text3);letter-spacing:.08em;text-transform:uppercase;font-family:var(--font-m)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

/* DEMO SECTION */
.demo-section{padding:6rem 2rem;position:relative;overflow:hidden}
.demo-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 50%,rgba(123,92,245,.04) 0%,transparent 70%)}
.demo-container{max-width:1100px;margin:0 auto}
.demo-hdr{text-align:center;margin-bottom:3.5rem}
.demo-stage{display:grid;grid-template-columns:1fr 1.35fr 1fr;gap:2rem;align-items:center;min-height:520px}
.demo-left,.demo-right{display:flex;flex-direction:column;gap:1rem}
.demo-trigger{display:flex;align-items:center;gap:1rem;padding:1rem 1.2rem;border-radius:14px;border:1px solid var(--border);background:rgba(255,255,255,.02);cursor:pointer;transition:all .35s var(--ease);position:relative;overflow:hidden;text-align:left}
.demo-trigger::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--violet2);transform:scaleY(0);transform-origin:bottom;transition:transform .35s var(--ease);border-radius:2px}
.demo-trigger.active{background:rgba(123,92,245,.1);border-color:rgba(123,92,245,.4)}
.demo-trigger.active::before{transform:scaleY(1)}
.demo-trigger.active .dt-num{background:rgba(123,92,245,.3);border-color:var(--violet2);box-shadow:0 0 18px rgba(123,92,245,.4);color:#fff}
.demo-trigger.done{border-color:rgba(6,214,160,.25);background:rgba(6,214,160,.04)}
.demo-trigger.done .dt-num{background:rgba(6,214,160,.2);border-color:var(--emerald);color:var(--emerald)}
.dt-num{width:36px;height:36px;border-radius:10px;border:1px solid var(--border2);background:rgba(255,255,255,.04);display:flex;align-items:center;justify-content:center;font-family:var(--font-m);font-size:.78rem;font-weight:500;color:var(--text2);flex-shrink:0;transition:all .3s var(--ease)}
.dt-label{font-family:var(--font-d);font-size:.92rem;font-weight:600;color:var(--text);margin-bottom:.1rem}
.dt-sub{font-size:.76rem;color:var(--text2);line-height:1.4}
.demo-phone-wrap{position:relative;display:flex;align-items:center;justify-content:center}
.demo-phone{width:260px;background:#0A091A;border:1px solid rgba(123,92,245,.3);border-radius:28px;overflow:hidden;box-shadow:0 0 0 6px rgba(123,92,245,.08),0 40px 80px rgba(0,0,0,.6),0 0 60px rgba(123,92,245,.15);position:relative}
.demo-phone::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:80px;height:24px;background:#0A091A;border-radius:0 0 14px 14px;z-index:10;border:1px solid rgba(123,92,245,.2);border-top:none}
.demo-screen-area{min-height:480px;position:relative;padding-top:32px}
.demo-slide{position:absolute;inset:0;padding:1rem .9rem;opacity:0;transform:translateY(16px);transition:opacity .5s var(--ease),transform .5s var(--ease);pointer-events:none;overflow:hidden}
.demo-slide.active{opacity:1;transform:translateY(0);pointer-events:auto}

/* Slide 1 */
.s1-title{font-family:var(--font-d);font-size:.82rem;font-weight:700;color:var(--text);margin-bottom:.5rem;padding-top:.3rem;text-align:center}
.s1-sub{font-size:.64rem;color:var(--text2);text-align:center;margin-bottom:.8rem}
.track-grid{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:.7rem}
.track-tile{padding:.7rem .55rem;border-radius:10px;border:1px solid var(--border);background:rgba(255,255,255,.03);text-align:center;cursor:pointer;transition:all .3s var(--ease);position:relative;overflow:hidden}
.track-tile.selected{border-color:rgba(123,92,245,.5);background:rgba(123,92,245,.12)}
.track-tile.selected::after{content:'✓';position:absolute;top:4px;right:6px;font-size:.55rem;color:var(--violet2);font-weight:800}
.track-tile:hover{border-color:rgba(123,92,245,.3);transform:translateY(-2px)}
.tile-ico{display:flex;align-items:center;justify-content:center;margin-bottom:.3rem;color:var(--violet2)}
.tile-name{font-family:var(--font-d);font-size:.64rem;font-weight:600;color:var(--text);display:block}
.tile-tag{font-size:.55rem;color:var(--text2);display:block;margin-top:.1rem}
.s1-btn{width:100%;padding:.55rem;border-radius:9px;background:linear-gradient(135deg,#7B5CF5,#5B3CC5);border:none;color:#fff;font-family:var(--font-d);font-size:.7rem;font-weight:700;cursor:pointer;letter-spacing:.02em;box-shadow:0 4px 16px rgba(123,92,245,.35);transition:transform .2s var(--spring),box-shadow .2s;display:flex;align-items:center;justify-content:center;gap:.4rem}
.s1-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(123,92,245,.5)}

/* Slide 2 */
.s2-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:.7rem;padding-top:.2rem}
.s2-title{font-family:var(--font-d);font-size:.82rem;font-weight:700;color:var(--text)}
.s2-badge{font-size:.58rem;padding:.15rem .45rem;border-radius:100px;background:rgba(6,214,160,.15);color:var(--emerald);border:1px solid rgba(6,214,160,.3);font-family:var(--font-m)}
.s2-pbar{height:5px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden;margin-bottom:.9rem}
.s2-pfill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--violet),var(--emerald));transition:width 1.2s var(--ease)}
.s2-modules{display:flex;flex-direction:column;gap:.45rem}
.s2-mod{display:flex;align-items:center;gap:.6rem;padding:.5rem .65rem;border-radius:9px;border:1px solid var(--border);background:rgba(255,255,255,.02);transition:all .3s}
.s2-mod.done{border-color:rgba(6,214,160,.25);background:rgba(6,214,160,.05)}
.s2-mod.current{border-color:rgba(123,92,245,.4);background:rgba(123,92,245,.1);animation:pulseCard 2s ease-in-out infinite}
@keyframes pulseCard{0%,100%{box-shadow:0 0 0 0 rgba(123,92,245,.0)}50%{box-shadow:0 0 0 4px rgba(123,92,245,.1)}}
.s2-mod-ico{flex-shrink:0;width:20px;display:flex;align-items:center;justify-content:center}
.s2-mod-name{font-size:.68rem;color:var(--text);font-weight:500;flex:1}
.s2-mod-state{font-size:.55rem;color:var(--text2)}
.s2-mod.done .s2-mod-name{color:var(--emerald)}

/* Slide 3 */
.s3-header{display:flex;align-items:center;gap:.5rem;margin-bottom:.6rem;padding-top:.2rem}
.s3-avatar{width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,#7B5CF5,#4F35C5);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff}
.s3-name{font-family:var(--font-d);font-size:.75rem;font-weight:700;color:var(--text)}
.s3-status{font-size:.58rem;color:var(--emerald);font-family:var(--font-m)}
.chat-wrap{display:flex;flex-direction:column;gap:.55rem;margin-bottom:.65rem;min-height:180px}
.chat-bubble{padding:.55rem .7rem;border-radius:10px;max-width:88%;font-size:.65rem;line-height:1.5}
.cb-enter{animation:slideMsg .4s var(--ease) both}
@keyframes slideMsg{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.chat-bubble.ai{background:rgba(123,92,245,.12);border:1px solid rgba(123,92,245,.2);align-self:flex-start;border-radius:10px 10px 10px 2px}
.chat-bubble.user{background:rgba(245,166,35,.1);border:1px solid rgba(245,166,35,.2);align-self:flex-end;text-align:right;border-radius:10px 10px 2px 10px}
.chat-who{display:block;font-size:.55rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.2rem}
.chat-bubble.ai .chat-who{color:#C4B1FF}
.chat-bubble.user .chat-who{color:#FFD166}
.chat-bubble p{color:var(--text);margin:0}
.score-pill{display:flex;align-items:center;justify-content:space-between;padding:.5rem .7rem;border-radius:9px;background:rgba(123,92,245,.1);border:1px solid rgba(123,92,245,.2)}
.score-lbl{font-size:.63rem;color:var(--text2)}
.score-val{font-family:var(--font-d);font-size:.9rem;font-weight:700;color:#C4B1FF}
.score-bar{flex:1;height:4px;background:rgba(255,255,255,.08);border-radius:2px;margin:0 .7rem;overflow:hidden}
.score-fill{height:100%;background:linear-gradient(90deg,var(--violet),var(--violet2));border-radius:2px;transition:width 1s var(--ease)}

/* Slide 4 */
.s4-title{font-family:var(--font-d);font-size:.82rem;font-weight:700;color:var(--text);margin-bottom:.3rem;padding-top:.2rem;text-align:center}
.s4-sub{font-size:.63rem;color:var(--text2);text-align:center;margin-bottom:.8rem}
.vc-list{display:flex;flex-direction:column;gap:.45rem;margin-bottom:.7rem}
.vc-card{display:flex;align-items:center;gap:.65rem;padding:.55rem .65rem;border-radius:10px;border:1px solid var(--border);background:rgba(255,255,255,.03);transition:all .4s var(--ease)}
.vc-card.incoming{border-color:rgba(6,214,160,.3);background:rgba(6,214,160,.06);animation:vcPop .5s var(--spring) both}
@keyframes vcPop{from{opacity:0;transform:scale(.9) translateY(8px)}to{opacity:1;transform:none}}
.vc-avatar{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.vc-info{flex:1;min-width:0}
.vc-name{font-family:var(--font-d);font-size:.68rem;font-weight:700;color:var(--text)}
.vc-firm{font-size:.58rem;color:var(--text2)}
.vc-status{font-size:.58rem;padding:.15rem .45rem;border-radius:100px;border:1px solid;font-family:var(--font-m);white-space:nowrap}
.vc-status.reviewing{color:#FFD166;border-color:rgba(245,166,35,.3);background:rgba(245,166,35,.1)}
.vc-status.match{color:var(--emerald);border-color:rgba(6,214,160,.3);background:rgba(6,214,160,.1)}
.s4-notify{display:flex;align-items:center;gap:.6rem;padding:.6rem .7rem;border-radius:10px;border:1px solid rgba(245,166,35,.35);background:rgba(245,166,35,.08);animation:vcPop .5s .5s var(--spring) both}
.notify-ico{flex-shrink:0;color:var(--gold)}
.notify-txt{font-size:.65rem;color:var(--text2);line-height:1.4}
.notify-txt strong{color:var(--gold2)}

/* FEATURES */
.feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.2rem;margin-top:3.5rem}
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
.steps-hdr{text-align:center;margin-bottom:2.5rem}
.steps-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;width:100%}
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
.price-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.2rem;margin-top:3.5rem}
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
.reg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.85rem;margin-top:3.5rem}
.reg-card{background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:var(--r);padding:.9rem 1.1rem;display:flex;align-items:center;gap:.8rem;transition:all .25s var(--ease);cursor:default}
.reg-card:hover{border-color:rgba(123,92,245,.3);background:rgba(123,92,245,.05);transform:translateX(5px)}
.reg-code{width:38px;height:38px;border-radius:9px;background:rgba(123,92,245,.08);border:1px solid rgba(123,92,245,.18);display:flex;align-items:center;justify-content:center;font-family:var(--font-m);font-size:.68rem;font-weight:500;color:#C4B1FF;flex-shrink:0;transition:all .25s}
.reg-card:hover .reg-code{background:rgba(123,92,245,.18);box-shadow:0 0 14px rgba(123,92,245,.2)}
.reg-nm{font-size:.88rem;font-weight:500;letter-spacing:-.1px}

/* CTA */
.cta-outer{padding:2rem 2.5rem 8rem;max-width:1280px;margin:0 auto}
.cta-wrap{padding:1px;background:linear-gradient(135deg,rgba(123,92,245,.6),rgba(245,166,35,.38),rgba(123,92,245,.25));border-radius:var(--rl);box-shadow:0 0 100px rgba(123,92,245,.12)}
.cta-in{background:linear-gradient(135deg,#13102a,#18163a,#16142e);border-radius:calc(var(--rl) - 1px);padding:4rem;display:flex;align-items:center;justify-content:space-between;gap:2rem;flex-wrap:wrap}
.cta-h2{font-family:var(--font-d);font-size:clamp(1.6rem,3vw,2.3rem);font-weight:800;letter-spacing:-1px;line-height:1.15}
.cta-p{color:var(--text2);font-size:.92rem;margin-top:.5rem;font-weight:400}
.cta-acts{display:flex;gap:.85rem;flex-shrink:0;flex-wrap:wrap}

/* FOOTER */
.ml-ftr{border-top:1px solid var(--border);padding:3rem 2.5rem;background:rgba(4,4,12,.7)}
.ml-ftr-in{max-width:1280px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1.5rem}
.ftr-links{display:flex;gap:1.5rem;flex-wrap:wrap}
.ftr-a{color:var(--text3);font-size:.84rem;text-decoration:none;transition:color .2s}
.ftr-a:hover{color:var(--text2)}
.ftr-copy{color:var(--text3);font-size:.78rem;margin-top:.3rem}

/* RESPONSIVE */
@media(max-width:900px){
  .demo-stage{grid-template-columns:1fr;gap:1.5rem}
  .demo-left,.demo-right{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
  .demo-phone-wrap{order:-1}
  .steps-grid{grid-template-columns:1fr 1fr}
  .cta-in{padding:2.5rem 2rem}
  .cta-acts{width:100%;flex-direction:column}
  .cta-acts .btn-gold,.cta-acts .btn-outline{justify-content:center}
}
@media(max-width:580px){
  .steps-grid{grid-template-columns:1fr}
  .demo-left,.demo-right{grid-template-columns:1fr}
  .hero-h1{letter-spacing:-2px}
  .hs-item{padding:.9rem 1.2rem}
  .vc-banner-in{flex-direction:column;text-align:center}
}
`;

/* ══════════════════════════════════════════════════════════════
   SVG ICON COMPONENTS  (no emojis anywhere)
══════════════════════════════════════════════════════════════ */
const IconArrow = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const IconShark = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
    <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
    <path d="M6 18a4 4 0 0 1-1.967-.516"/>
    <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
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
const IconLock = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconClock = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
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
const IconTrendUp = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 7l-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>
  </svg>
);
const IconFlag = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   THREE.JS — background particles (uses npm THREE import)
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
    pos[i*3]   = (Math.random() - .5) * 28;
    pos[i*3+1] = (Math.random() - .5) * 18;
    pos[i*3+2] = (Math.random() - .5) * 14;
    vel[i] = .0006 + Math.random() * .0012;
    const t = Math.random();
    if      (t > .7)  { col[i*3]=.48; col[i*3+1]=.36; col[i*3+2]=.96; }
    else if (t > .45) { col[i*3]=.96; col[i*3+1]=.65; col[i*3+2]=.14; }
    else if (t > .25) { col[i*3]=.02; col[i*3+1]=.84; col[i*3+2]=.63; }
    else              { col[i*3]=1;   col[i*3+1]=.42; col[i*3+2]=.62; }
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({ size:.032, vertexColors:true, transparent:true, opacity:.55, sizeAttenuation:true });
  scene.add(new THREE.Points(geo, mat));

  const starCount = 180, starGeo = new THREE.BufferGeometry(), starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPos[i*3]   = (Math.random() - .5) * 40;
    starPos[i*3+1] = (Math.random() - .5) * 30;
    starPos[i*3+2] = -8 - Math.random() * 10;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ size:.018, color:0x6655cc, transparent:true, opacity:.35 })));

  let mx = 0, my = 0;
  const onMM = e => { mx = (e.clientX / innerWidth - .5) * 2; my = -(e.clientY / innerHeight - .5) * 2; };
  const onResize = () => { renderer.setSize(innerWidth, innerHeight); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); };
  window.addEventListener('mousemove', onMM, { passive:true });
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();
  let raf;
  const pts = scene.children[0];
  const tick = () => {
    raf = requestAnimationFrame(tick);
    cam.position.x += (mx * .35 - cam.position.x) * .03;
    cam.position.y += (my * .25 - cam.position.y) * .03;
    pts.rotation.y = clock.getElapsedTime() * .015;
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
   THREE.JS — Steps scene
══════════════════════════════════════════════════════════════ */
function createStepsScene(canvas) {
  if (!canvas) return { destroy: () => {}, setProgress: () => {} };

  const W = canvas.offsetWidth || innerWidth;
  const H = canvas.offsetHeight || innerHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W, H);

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
  cam.position.set(0, 0, 10);

  const COLORS = [0x7B5CF5, 0xF5A623, 0x06D6A0, 0xFF6B9D];
  const X = [-5, -1.7, 1.7, 5];

  const nodes = X.map((x, i) => {
    const grp = new THREE.Group();
    grp.position.set(x, 0, 0);
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(.55, 24, 24),
      new THREE.MeshBasicMaterial({ color:COLORS[i], transparent:true, opacity:.12 })
    );
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.1, .012, 8, 56),
      new THREE.MeshBasicMaterial({ color:COLORS[i], transparent:true, opacity:.18 })
    );
    ring.rotation.x = Math.PI / 3 + i * .3;
    const pCount = 55, pGeo = new THREE.BufferGeometry(), pPos = new Float32Array(pCount * 3);
    for (let j = 0; j < pCount; j++) {
      const a = Math.random() * Math.PI * 2, r = .8 + Math.random() * .7;
      pPos[j*3] = Math.cos(a)*r; pPos[j*3+1] = (Math.random()-.5)*.5; pPos[j*3+2] = Math.sin(a)*r;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color:COLORS[i], size:.048, transparent:true, opacity:.4 });
    grp.add(sphere, ring, new THREE.Points(pGeo, pMat));
    grp.userData = { i, spd:.3+i*.08, off:i*1.6, lit:false, sphere, ring, pMat };
    scene.add(grp);
    return grp;
  });

  const beams = [];
  for (let i = 0; i < 3; i++) {
    const pts = [new THREE.Vector3(X[i]+.7,0,0), new THREE.Vector3(X[i+1]-.7,0,0)];
    const bMat = new THREE.LineBasicMaterial({ color:0x2a2445, transparent:true, opacity:.28 });
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), bMat));
    beams.push(bMat);
  }

  const hCount = 220, hGeo = new THREE.BufferGeometry(), hPos = new Float32Array(hCount*3);
  for (let i = 0; i < hCount; i++) {
    hPos[i*3]=(Math.random()-.5)*24; hPos[i*3+1]=(Math.random()-.5)*14; hPos[i*3+2]=-3-Math.random()*6;
  }
  hGeo.setAttribute('position', new THREE.BufferAttribute(hPos,3));
  scene.add(new THREE.Points(hGeo, new THREE.PointsMaterial({ size:.02, color:0x5544bb, transparent:true, opacity:.2 })));

  function setProgress(p) {
    const litCount = Math.min(4, Math.floor(p * 4.8));
    nodes.forEach((g, i) => {
      const isLit = i < litCount, isActive = i === Math.min(3, litCount-1);
      g.userData.lit = isLit;
      g.userData.sphere.material.opacity = isLit ? .22 : .06;
      g.userData.ring.material.opacity   = isLit ? (isActive ? .55 : .2) : .08;
      g.userData.pMat.opacity            = isLit ? .65 : .22;
    });
    beams.forEach((bm, i) => { bm.opacity = Math.min(.55, Math.max(.08, (litCount-i)*.22)); });
  }

  let mx = 0, my = 0;
  const onMM = e => { const r=canvas.getBoundingClientRect(); mx=((e.clientX-r.left)/r.width-.5)*2; my=-((e.clientY-r.top)/r.height-.5)*2; };
  const onResize = () => { const w=canvas.offsetWidth,h=canvas.offsetHeight; renderer.setSize(w,h); cam.aspect=w/h; cam.updateProjectionMatrix(); };
  canvas.addEventListener('mousemove', onMM, { passive:true });
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();
  let raf;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    nodes.forEach(g => {
      g.rotation.y = t*g.userData.spd*.25;
      g.rotation.x = t*g.userData.spd*.14;
      g.position.y = Math.sin(t*1.1+g.userData.off)*(g.userData.lit?.16:.06);
      g.scale.setScalar((g.userData.lit?1.12:1) + Math.sin(t*1.8+g.userData.i)*(g.userData.lit?.025:.005));
      g.userData.ring.rotation.z = t*.35;
    });
    cam.position.x += (mx*.5-cam.position.x)*.04;
    cam.position.y += (my*.3-cam.position.y)*.04;
    cam.lookAt(0,0,0);
    renderer.render(scene, cam);
  };
  tick();

  return {
    setProgress,
    destroy() {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousemove', onMM);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    }
  };
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
   DEMO SLIDES  — all emoji replaced with SVG icons
   BUG FIX: Slide3 no longer stores msgs in state that triggers
   re-mount crashes. Uses a ref-driven append approach instead.
══════════════════════════════════════════════════════════════ */

const Slide1 = ({ active }) => {
  const [selected, setSelected] = useState(null);
  const tracks = [
    { Icon: IconBrain,   name:'Foundations', tag:'6 modules' },
    { Icon: IconTrendUp, name:'Finance',     tag:'8 modules' },
    { Icon: IconFlag,    name:'Marketing',   tag:'7 modules' },
    { Icon: IconTarget,  name:'Fundraising', tag:'9 modules' },
  ];
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setSelected(0), 600);
    return () => clearTimeout(t);
  }, [active]);
  return (
    <div className={`demo-slide${active ? ' active' : ''}`}>
      <p className="s1-title">What's your startup journey?</p>
      <p className="s1-sub">Select a primary learning track</p>
      <div className="track-grid">
        {tracks.map(({ Icon, name, tag }, i) => (
          <div key={i} className={`track-tile${selected===i?' selected':''}`} onClick={() => setSelected(i)}>
            <div className="tile-ico"><Icon size={18}/></div>
            <span className="tile-name">{name}</span>
            <span className="tile-tag">{tag}</span>
          </div>
        ))}
      </div>
      <button className="s1-btn">Start My Journey <IconArrow size={12}/></button>
    </div>
  );
};

const Slide2 = ({ active }) => {
  const [fill, setFill] = useState(0);
  useEffect(() => {
    if (!active) { setFill(0); return; }
    const t = setTimeout(() => setFill(65), 400);
    return () => clearTimeout(t);
  }, [active]);
  const mods = [
    { name:'Business Model Canvas',  state:'done' },
    { name:'Market Research',        state:'done' },
    { name:'Financial Projections',  state:'current' },
    { name:'Go-To-Market Strategy',  state:'locked' },
    { name:'Pitch Deck Design',      state:'locked' },
  ];
  return (
    <div className={`demo-slide${active ? ' active' : ''}`}>
      <div className="s2-header">
        <span className="s2-title">Finance Track</span>
        <span className="s2-badge">{fill}% done</span>
      </div>
      <div className="s2-pbar"><div className="s2-pfill" style={{ width:`${fill}%` }}/></div>
      <div className="s2-modules">
        {mods.map((m, i) => (
          <div key={i} className={`s2-mod ${m.state}`}>
            <span className="s2-mod-ico" style={{ color: m.state==='done'?'var(--emerald)':m.state==='current'?'var(--gold)':'var(--text3)' }}>
              {m.state==='done' ? <IconCheck size={12}/> : m.state==='current' ? <IconClock size={12}/> : <IconLock size={12}/>}
            </span>
            <span className="s2-mod-name">{m.name}</span>
            <span className="s2-mod-state">{m.state==='done'?'Exported':m.state==='current'?'In progress':'Locked'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── FIXED Slide3: uses useRef + manual DOM append to avoid re-render crash ── */
const Slide3 = ({ active }) => {
  const [scoreW, setScoreW] = useState(0);
  const [msgs, setMsgs] = useState([]);
  const timersRef = useRef([]);

  const ALL_MSGS = [
    { who:'ai',   text:"What problem are you solving and why now?" },
    { who:'user', text:"India's SMEs lose ₹2T/yr to poor cash flow. We fix that with AI." },
    { who:'ai',   text:"Strong problem statement. What's your moat against incumbents?" },
  ];

  useEffect(() => {
    // Clear all pending timers on every effect run
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (!active) {
      setMsgs([]);
      setScoreW(0);
      return;
    }

    ALL_MSGS.forEach((msg, i) => {
      const t = setTimeout(() => {
        setMsgs(prev => {
          // Guard: don't add duplicates if component re-renders
          if (prev.length > i) return prev;
          return [...prev, msg];
        });
      }, 500 + i * 1100);
      timersRef.current.push(t);
    });

    const scoreTimer = setTimeout(() => setScoreW(78), 500 + ALL_MSGS.length * 1100 + 200);
    timersRef.current.push(scoreTimer);

    return () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };
  }, [active]);

  return (
    <div className={`demo-slide${active ? ' active' : ''}`}>
      <div className="s3-header">
        <div className="s3-avatar"><IconAI size={14}/></div>
        <div>
          <div className="s3-name">Pitch Coach</div>
          <div className="s3-status">● Live session</div>
        </div>
      </div>
      <div className="chat-wrap">
        {msgs.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.who} cb-enter`}>
            <span className="chat-who">{m.who==='ai'?'AI Investor':'You'}</span>
            <p>{m.text}</p>
          </div>
        ))}
      </div>
      {scoreW > 0 && (
        <div className="score-pill">
          <span className="score-lbl">Pitch Score</span>
          <div className="score-bar"><div className="score-fill" style={{ width:`${scoreW}%` }}/></div>
          <span className="score-val">{scoreW}/100</span>
        </div>
      )}
    </div>
  );
};

const Slide4 = ({ active }) => {
  const [shown, setShown] = useState(0);
  const timersRef = useRef([]);
  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (!active) { setShown(0); return; }
    [400, 900, 1400].forEach((delay, i) => {
      const t = setTimeout(() => setShown(i + 1), delay);
      timersRef.current.push(t);
    });
    return () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };
  }, [active]);

  const vcs = [
    { bg:'#1a1230', Icon:IconBank,   name:'Sequoia Capital',  firm:'Series A · $500K–$5M', status:'reviewing' },
    { bg:'#12201a', Icon:IconTarget, name:'Accel Partners',   firm:'Seed · $100K–$1M',     status:'match'     },
    { bg:'#1e1210', Icon:IconZap,    name:'Elevation Capital',firm:'Early Stage · $250K+',  status:'reviewing' },
  ];
  return (
    <div className={`demo-slide${active ? ' active' : ''}`}>
      <p className="s4-title">You're Listed!</p>
      <p className="s4-sub">3 investors matched your profile</p>
      <div className="vc-list">
        {vcs.slice(0, shown).map((v, i) => (
          <div key={i} className="vc-card incoming" style={{ animationDelay:`${i*.1}s` }}>
            <div className="vc-avatar" style={{ background:v.bg, color:'var(--violet2)' }}><v.Icon size={16}/></div>
            <div className="vc-info">
              <div className="vc-name">{v.name}</div>
              <div className="vc-firm">{v.firm}</div>
            </div>
            <span className={`vc-status ${v.status}`}>{v.status==='match'?'Match':'Reviewing'}</span>
          </div>
        ))}
      </div>
      {shown >= 3 && (
        <div className="s4-notify">
          <span className="notify-ico"><IconMail size={14}/></span>
          <span className="notify-txt"><strong>Accel Partners</strong> sent you a meeting request for next week.</span>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const user = null; // swap with useAuth() if needed

  const bgCanRef      = useRef(null);
  const stepsCanRef   = useRef(null);
  const stepSecRef    = useRef(null);
  const hdrRef        = useRef(null);
  const cursorRef     = useRef(null);
  const cursorRingRef = useRef(null);
  const stepsApiRef   = useRef(null);
  const bgDestroyRef  = useRef(null);

  const [activeStep, setActiveStep] = useState(-1);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoActive, setDemoActive] = useState(0);
  const [autoPlay,   setAutoPlay]   = useState(true);

  useReveal();

  /* Inject fonts + CSS once */
  useEffect(() => {
    injectFonts();
    let el = document.getElementById('ml-css-v4');
    if (!el) { el = document.createElement('style'); el.id = 'ml-css-v4'; document.head.appendChild(el); }
    el.textContent = CSS;
    return () => {};
  }, []);

  /* Custom cursor */
  useEffect(() => {
    let rx=0, ry=0, tx=0, ty=0, raf;
    const move = e => { tx=e.clientX; ty=e.clientY; };
    window.addEventListener('mousemove', move, { passive:true });
    const loop = () => {
      raf = requestAnimationFrame(loop);
      rx+=(tx-rx)*.13; ry+=(ty-ry)*.13;
      if (cursorRef.current) { cursorRef.current.style.left=`${tx}px`; cursorRef.current.style.top=`${ty}px`; }
      if (cursorRingRef.current) { cursorRingRef.current.style.left=`${rx}px`; cursorRingRef.current.style.top=`${ry}px`; }
    };
    loop();
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);

  /* Header scroll */
  useEffect(() => {
    const fn = () => hdrRef.current?.classList.toggle('solid', scrollY > 30);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* BG particles — init once, stable destroy ref */
  useEffect(() => {
    if (!bgCanRef.current) return;
    bgDestroyRef.current = createBgParticles(bgCanRef.current);
    return () => bgDestroyRef.current?.();
  }, []);

  /* Steps scene — init once canvas mounted */
  useEffect(() => {
    if (!stepsCanRef.current) return;
    const api = createStepsScene(stepsCanRef.current);
    stepsApiRef.current = api;
    return () => api.destroy();
  }, []);

  /* Scroll-driven step progress */
  useEffect(() => {
    const fn = () => {
      if (!stepSecRef.current) return;
      const rect = stepSecRef.current.getBoundingClientRect();
      const total = stepSecRef.current.offsetHeight - innerHeight;
      const p = Math.max(0, Math.min(1, -rect.top / total));
      stepsApiRef.current?.setProgress(p);
      setActiveStep(Math.min(3, Math.floor(p * 4.8)) - 1);
    };
    window.addEventListener('scroll', fn, { passive:true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* Auto-cycle demo — stops when user manually clicks a step */
  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => setDemoActive(p => (p + 1) % 4), 4500);
    return () => clearInterval(id);
  }, [autoPlay]);

  /* Tilt on feat-cards */
  useEffect(() => {
    const cards = document.querySelectorAll('[data-tilt]');
    const cleanup = [];
    cards.forEach(card => {
      const mm = e => {
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`translateY(-6px) rotateX(${-y*10}deg) rotateY(${x*10}deg)`;
        card.style.setProperty('--mx',`${(x+.5)*100}%`);
        card.style.setProperty('--my',`${(y+.5)*100}%`);
      };
      const ml = () => { card.style.transform=''; };
      card.addEventListener('mousemove', mm);
      card.addEventListener('mouseleave', ml);
      cleanup.push(() => { card.removeEventListener('mousemove',mm); card.removeEventListener('mouseleave',ml); });
    });
    return () => cleanup.forEach(f=>f());
  }, []);

  const scrollTo = id => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 80, behavior:'smooth' });
    setMobileOpen(false);
  };

  const handleDemoClick = (id) => {
    setDemoActive(id);
    setAutoPlay(false); // stop auto-cycle once user interacts
  };

  const Chk = () => <IconCheck size={9}/>;

  const features = [
    { Ico:IconBrain, cls:'fi-v', t:'AI Venture Mentor',     p:'Pitch Coach powered by Claude. Mock Q&A with readiness scores across Clarity, Market Fit, and Value Prop.' },
    { Ico:IconBook,  cls:'fi-g', t:'30 Structured Modules', p:'Five focused tracks — Foundations, Finance, Operations, Marketing, Fundraising. Each module produces an exportable deliverable.' },
    { Ico:IconGlobe, cls:'fi-e', t:'Built For Your Region',  p:'Templates and coaching tuned for US, GCC, and key African ecosystems. Not generic advice painted over your local reality.' },
  ];

  const steps = [
    { n:'01', t:'Describe your idea',    p:'Brief your concept, pick category tiles and your target region.' },
    { n:'02', t:'Complete each module',  p:'Structured lessons with deliverables you fill out — not just watch.' },
    { n:'03', t:'Spar with Pitch Coach', p:'AI investor fires real questions. Weak spots scored and rebuilt.' },
    { n:'04', t:'Export your brief',     p:'One-click PDF or Word export, ready to send to investors.' },
  ];

  const DEMO_STEPS = [
    { id:0, label:'Choose Your Track',   sub:'Pick the startup learning path that fits your vision',      side:'left'  },
    { id:1, label:'Complete Modules',    sub:'Work through 30 lessons with real deliverables',            side:'left'  },
    { id:2, label:'Pitch to AI Coach',   sub:'Spar with a Claude-powered VC — get scored in real time',  side:'right' },
    { id:3, label:'Connect With VCs',    sub:'Your profile goes live to our investor network',            side:'right' },
  ];

  const regions = [
    { name:'United States', code:'US' }, { name:'UAE',  code:'UAE' }, { name:'Saudi Arabia', code:'SA' },
    { name:'Egypt',         code:'EG' }, { name:'Nigeria',code:'NG'}, { name:'Kenya',        code:'KE' },
    { name:'Jordan',        code:'JO' }, { name:'Qatar',code:'QA' }, { name:'India',        code:'IN' },
  ];

  return (
    <>
      <div id="ml-cursor"      ref={cursorRef} />
      <div id="ml-cursor-ring" ref={cursorRingRef} />
      <div className="ml-noise" />
      <canvas id="ml-bg-canvas" ref={bgCanRef} />

      <div className="ml-page">

        {/* ── HEADER ── */}
        <div className="ml-hdr-wrap" ref={hdrRef}>
          <header className="ml-hdr">
            <Link to="/" className="ml-logo">
              <div className="ml-logo-gem">M</div>
              Mind<span className="ml-logo-v">Launch</span>
            </Link>
            <nav className="ml-nav-links">
              {[['features','Features'],['demo','See It Live'],['steps','How It Works'],['pricing','Pricing'],['regions','Regions']].map(([id,label]) => (
                <span key={id} className="ml-nav-link" onClick={() => scrollTo(id)}>{label}</span>
              ))}
            </nav>
            <div className="ml-hdr-btns dk">
              {user
                ? <Link to="/dashboard" className="btn-primary">Dashboard <IconArrow/></Link>
                : <><Link to="/login" className="btn-ghost">Log in</Link><Link to="/register" className="btn-primary">Get started <IconArrow/></Link></>
              }
            </div>
            <button className={`ml-hamburger${mobileOpen?' open':''}`} onClick={() => setMobileOpen(v=>!v)} aria-label="Menu">
              <span/><span/><span/>
            </button>
          </header>
          <div className={`ml-mobile-overlay${mobileOpen?' open':''}`} onClick={() => setMobileOpen(false)} />
          <nav className={`ml-mobile-menu${mobileOpen?' open':''}`} style={{ display:'flex' }}>
            {[['features','Features'],['demo','See It Live'],['steps','How It Works'],['pricing','Pricing'],['regions','Regions']].map(([id,label]) => (
              <span key={id} className="ml-nav-link" onClick={() => scrollTo(id)}>{label}</span>
            ))}
            <div style={{ display:'flex', flexDirection:'column', gap:'.6rem', marginTop:'1rem' }}>
              <Link to="/login" className="btn-ghost">Log in</Link>
              <Link to="/register" className="btn-primary">Get started <IconArrow/></Link>
            </div>
          </nav>
        </div>

        {/* ── HERO ── */}
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
            <button className="btn-outline" onClick={() => scrollTo('demo')}>See it in action</button>
          </div>

          <div className="hero-stats">
            {[['30','Modules'],['5','Tracks'],['9','Regions'],['AI','Coach']].map(([n,l]) => (
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

        {/* ── CINEMATIC DEMO ── */}
        <section className="demo-section" id="demo">
          <div className="demo-container">
            <div className="demo-hdr rev">
              <div className="sec-tag" style={{ justifyContent:'center' }}><div className="sec-tag-dot"/>See It In Action</div>
              <h2 className="sec-h2" style={{ textAlign:'center' }}>From idea to <span className="grad-gold">investor meeting</span><br/>in four steps</h2>
              <p className="sec-sub" style={{ margin:'0 auto', textAlign:'center', maxWidth:'550px' }}>Watch how MindLaunch takes you from choosing a track all the way to a VC sliding into your inbox.</p>
            </div>

            <div className="demo-stage rev" style={{ transitionDelay:'80ms' }}>
              {/* LEFT */}
              <div className="demo-left">
                {DEMO_STEPS.filter(s=>s.side==='left').map(s => (
                  <div key={s.id} className={`demo-trigger${demoActive===s.id?' active':''}${demoActive>s.id?' done':''}`} onClick={() => handleDemoClick(s.id)}>
                    <div className="dt-num">{demoActive>s.id?<IconCheck size={12}/>:`0${s.id+1}`}</div>
                    <div><div className="dt-label">{s.label}</div><div className="dt-sub">{s.sub}</div></div>
                  </div>
                ))}
              </div>

              {/* PHONE */}
              <div className="demo-phone-wrap">
                <div className="demo-phone">
                  <div className="demo-screen-area">
                    <Slide1 active={demoActive===0}/>
                    <Slide2 active={demoActive===1}/>
                    <Slide3 active={demoActive===2}/>
                    <Slide4 active={demoActive===3}/>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="demo-right">
                {DEMO_STEPS.filter(s=>s.side==='right').map(s => (
                  <div key={s.id} className={`demo-trigger${demoActive===s.id?' active':''}${demoActive>s.id?' done':''}`} onClick={() => handleDemoClick(s.id)}>
                    <div className="dt-num">{demoActive>s.id?<IconCheck size={12}/>:`0${s.id+1}`}</div>
                    <div><div className="dt-label">{s.label}</div><div className="dt-sub">{s.sub}</div></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress dots */}
            <div style={{ display:'flex', justifyContent:'center', gap:'.6rem', marginTop:'2.5rem' }}>
              {DEMO_STEPS.map(s => (
                <div key={s.id} onClick={() => handleDemoClick(s.id)} style={{
                  width: demoActive===s.id?28:8, height:8, borderRadius:4,
                  background: demoActive===s.id?'var(--violet2)':'rgba(255,255,255,.12)',
                  cursor:'pointer', transition:'all .35s var(--ease)',
                  boxShadow: demoActive===s.id?'0 0 12px var(--violet2)':'none',
                }}/>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <div className="bg-alt" id="features">
          <section className="ml-sec">
            <div className="rev">
              <div className="sec-tag"><div className="sec-tag-dot"/>Why MindLaunch</div>
              <h2 className="sec-h2">Everything a founder needs.<br/>Nothing they don't.</h2>
              <p className="sec-sub">We replaced the bloated accelerator model with a focused, AI-native curriculum.</p>
            </div>
            <div className="feat-grid">
              {features.map(({ Ico, cls, t, p }, i) => (
                <div key={i} className="feat-card rev" data-tilt style={{ transitionDelay:`${i*80}ms` }}>
                  <div className="feat-glow"/>
                  <div className={`feat-ico ${cls}`}><Ico size={22}/></div>
                  <h3 className="feat-h3">{t}</h3>
                  <p className="feat-p">{p}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── STEPS (scroll-driven 3D) ── */}
        <div id="steps" ref={stepSecRef} className="steps-section">
          <div className="steps-sticky">
            <canvas ref={stepsCanRef} id="ml-steps-canvas"/>
            <div className="steps-ui">
              <div className="steps-hdr">
                <div className="sec-tag" style={{ justifyContent:'center' }}><div className="sec-tag-dot"/>Process</div>
                <h2 className="sec-h2" style={{ textAlign:'center' }}>Four steps to <span className="grad-violet">investor-ready</span></h2>
                <p className="sec-sub" style={{ margin:'0 auto', textAlign:'center' }}>Scroll down — the orbs light up as you move through each phase.</p>
              </div>
              <div className="steps-grid">
                {steps.map((s,i) => (
                  <div key={i} className={`step-card${activeStep>=i?' lit':''}`}>
                    <div className="step-card-line"/>
                    <div className="step-n">{s.n}</div>
                    <h3 className="step-h">{s.t}</h3>
                    <p className="step-p">{s.p}</p>
                  </div>
                ))}
              </div>
              <div className="steps-progress">
                {steps.map((_,i) => <div key={i} className={`prog-dot${activeStep>=i?' active':''}`}/>)}
              </div>
            </div>
          </div>
        </div>

        {/* ── PRICING ── */}
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
              <div className="price-card rev" style={{ transitionDelay:'80ms' }}>
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
              <div className="price-card hot rev" style={{ transitionDelay:'160ms' }}>
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

        {/* ── REGIONS ── */}
        <section className="ml-sec" id="regions">
          <div className="rev">
            <div className="sec-tag"><div className="sec-tag-dot"/>Coverage</div>
            <h2 className="sec-h2">Nine global markets.</h2>
            <p className="sec-sub">Curriculum and templates adapted to your local market dynamics and regulations.</p>
          </div>
          <div className="reg-grid">
            {regions.map((r,i) => (
              <div className="reg-card rev" key={i} style={{ transitionDelay:`${i*35}ms` }}>
                <div className="reg-code">{r.code}</div>
                <span className="reg-nm">{r.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="cta-outer rev">
          <div className="cta-wrap">
            <div className="cta-in">
              <div>
                <h2 className="cta-h2">Ready to build your startup?</h2>
                <p className="cta-p">Join founders across 9 markets going from idea to investor-ready with MindLaunch.</p>
              </div>
              <div className="cta-acts">
                <Link to="/register" className="btn-gold">Start for free <IconArrow/></Link>
                <button className="btn-outline" onClick={() => scrollTo('demo')}>See demo</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="ml-ftr">
          <div className="ml-ftr-in">
            <div>
              <Link to="/" className="ml-logo" style={{ marginBottom:'.3rem', display:'inline-flex' }}>
                <div className="ml-logo-gem" style={{ width:28, height:28, fontSize:'.78rem' }}>M</div>
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