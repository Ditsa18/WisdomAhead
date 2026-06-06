import React, { useEffect, useRef, useState, useCallback } from 'react';


/* ── Inject Google Fonts ── */
const injectFonts = () => {
  if (document.getElementById('ml-fonts')) return;
  const l = document.createElement('link');
  l.id = 'ml-fonts';
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(l);
};

/* ── Global CSS ── */
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;height:100%;scroll-padding-top:80px}

:root{
  --ink:#04040C;
  --ink2:#080814;
  --surface:rgba(255,255,255,.03);
  --surface2:rgba(255,255,255,.06);
  --violet:#7B5CF5;
  --violet2:#9D7DFF;
  --gold:#F5A623;
  --gold2:#FFD166;
  --emerald:#06D6A0;
  --rose:#FF6B9D;
  --text:#F0EFF8;
  --text2:#8B8AA8;
  --text3:#3D3C56;
  --border:rgba(255,255,255,.06);
  --border2:rgba(255,255,255,.12);
  --r:14px;
  --rl:22px;
  --ease:cubic-bezier(.25,.46,.45,.94);
  --spring:cubic-bezier(.34,1.56,.64,1);
  --font-d:'Outfit',sans-serif;
  --font-b:'Plus Jakarta Sans',sans-serif;
  --font-m:'JetBrains Mono',monospace;
}

body{
  background:var(--ink);
  color:var(--text);
  font-family:var(--font-b);
  overflow-x:hidden;
  cursor:none;
}

/* ── CUSTOM CURSOR ── */
#ml-cursor{
  position:fixed;
  width:12px;height:12px;
  background:var(--violet2);
  border-radius:50%;
  pointer-events:none;
  z-index:9999;
  transform:translate(-50%,-50%);
  transition:width .2s var(--spring),height .2s var(--spring),background .2s;
  mix-blend-mode:screen;
}
#ml-cursor-trail{
  position:fixed;
  width:36px;height:36px;
  border:1px solid rgba(123,92,245,.35);
  border-radius:50%;
  pointer-events:none;
  z-index:9998;
  transform:translate(-50%,-50%);
  transition:all .12s var(--ease);
}
body:has(a:hover,button:hover,[data-hover]:hover) #ml-cursor{
  width:24px;height:24px;
  background:var(--gold);
}

/* ── WEBGL CANVAS ── */
#ml-bg-canvas{
  position:fixed;
  top:0;left:0;
  width:100%;height:100%;
  z-index:0;
  pointer-events:none;
  background:var(--ink);
}

/* ── PAGE WRAPPER ── */
.ml-page{
  position:relative;
  z-index:1;
  min-height:100vh;
}

/* ── NOISE OVERLAY ── */
.ml-noise{
  position:fixed;inset:0;
  z-index:2;
  pointer-events:none;
  opacity:.028;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ── HEADER ── */
.ml-hdr-wrap{
  position:fixed;
  top:0;left:0;right:0;
  z-index:500;
  padding:1.2rem 2.5rem;
  transition:all .4s var(--ease);
}
.ml-hdr-wrap.solid{
  background:rgba(4,4,12,.8);
  backdrop-filter:blur(24px) saturate(160%);
  padding:.9rem 2.5rem;
  border-bottom:1px solid var(--border);
}
.ml-hdr{
  max-width:1280px;
  margin:0 auto;
  display:flex;
  align-items:center;
  justify-content:space-between;
}
.ml-logo{
  display:flex;align-items:center;gap:.6rem;
  text-decoration:none;color:var(--text);
  font-family:var(--font-d);font-size:1.25rem;font-weight:800;
  letter-spacing:-.5px;
}
.ml-logo-gem{
  width:36px;height:36px;
  background:linear-gradient(135deg,#7B5CF5,#4F35C5);
  clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
  display:flex;align-items:center;justify-content:center;
  font-size:.85rem;font-weight:900;color:#fff;
  box-shadow:0 0 28px rgba(123,92,245,.45);
  transition:transform .3s var(--spring),box-shadow .3s;
}
.ml-logo:hover .ml-logo-gem{
  transform:rotate(30deg) scale(1.1);
  box-shadow:0 0 40px rgba(123,92,245,.7);
}
.ml-logo-v{
  background:linear-gradient(90deg,var(--violet2),var(--gold));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}

.ml-nav-links{
  display:flex;align-items:center;gap:2rem;
}
.ml-nav-link{
  color:var(--text2);font-size:.875rem;font-weight:500;
  cursor:pointer;text-decoration:none;
  transition:color .2s;letter-spacing:.02em;
  position:relative;
}
.ml-nav-link::after{
  content:'';position:absolute;bottom:-4px;left:0;right:0;
  height:1px;background:var(--violet2);
  transform:scaleX(0);transition:transform .25s var(--ease);
}
.ml-nav-link:hover{color:var(--text)}
.ml-nav-link:hover::after{transform:scaleX(1)}

.ml-hdr-btns{display:flex;align-items:center;gap:.7rem}

/* ── MOBILE NAV ── */
.ml-hamburger{
  display:none;
  flex-direction:column;
  gap:5px;
  background:none;
  border:none;
  cursor:pointer;
  padding:8px;
  z-index:501;
}
.ml-hamburger span{
  width:24px;height:2px;
  background:var(--text);
  border-radius:2px;
  transition:all .3s var(--ease);
}
.ml-hamburger.active span:nth-child(1){
  transform:rotate(45deg) translate(5px,5px);
}
.ml-hamburger.active span:nth-child(2){
  opacity:0;
}
.ml-hamburger.active span:nth-child(3){
  transform:rotate(-45deg) translate(5px,-5px);
}

.ml-mobile-overlay{
  display:none;
  position:fixed;
  inset:0;
  background:rgba(4,4,12,.7);
  backdrop-filter:blur(8px);
  z-index:498;
  opacity:0;
  transition:opacity .3s var(--ease);
}
.ml-mobile-overlay.open{
  opacity:1;
}

.ml-mobile-menu{
  display:none;
  position:fixed;
  top:0;right:0;
  width:280px;
  height:100vh;
  background:rgba(4,4,12,.95);
  backdrop-filter:blur(24px);
  border-left:1px solid var(--border);
  z-index:499;
  padding:2rem;
  transform:translateX(100%);
  transition:transform .3s var(--ease);
}
.ml-mobile-menu.open{
  transform:translateX(0);
}
.ml-mobile-menu .ml-nav-link{
  display:block;
  padding:1rem 0;
  font-size:1rem;
  border-bottom:1px solid var(--border);
}
.ml-mobile-menu .ml-hdr-btns{
  flex-direction:column;
  margin-top:2rem;
}
.ml-mobile-menu .btn-ghost,
.ml-mobile-menu .btn-primary{
  width:100%;
  justify-content:center;
}

@media(max-width:768px){
  .ml-nav-links{display:none}
  .ml-hdr-btns.desktop-only{display:none}
  .ml-hamburger{display:flex}
  .ml-mobile-overlay,
  .ml-mobile-menu{display:block}
}

/* ── BUTTONS ── */
.btn-ghost{
  padding:.42rem 1rem;border-radius:9px;
  background:none;border:none;cursor:pointer;
  color:var(--text2);font-family:var(--font-b);font-size:.875rem;
  text-decoration:none;display:inline-flex;align-items:center;
  transition:color .2s,background .2s;
}
.btn-ghost:hover{color:var(--text);background:rgba(255,255,255,.06)}

.btn-primary{
  padding:.48rem 1.25rem;border-radius:10px;
  background:linear-gradient(135deg,#7B5CF5,#5B3CC5);
  border:none;cursor:pointer;color:#fff;
  font-family:var(--font-b);font-size:.875rem;font-weight:600;
  text-decoration:none;display:inline-flex;align-items:center;gap:.4rem;
  box-shadow:0 0 0 1px rgba(123,92,245,.4),0 4px 16px rgba(123,92,245,.3);
  transition:all .25s var(--ease);position:relative;overflow:hidden;
}
.btn-primary::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(255,255,255,.15),transparent);
  opacity:0;transition:opacity .2s;
}
.btn-primary:hover{
  box-shadow:0 0 0 1px rgba(123,92,245,.6),0 8px 28px rgba(123,92,245,.5);
  transform:translateY(-1px);
}
.btn-primary:hover::after{opacity:1}

.btn-gold{
  padding:.72rem 2rem;border-radius:12px;
  background:linear-gradient(135deg,#F5A623,#E08C0A);
  border:none;cursor:pointer;color:#0A0A14;
  font-family:var(--font-d);font-size:1rem;font-weight:700;
  text-decoration:none;display:inline-flex;align-items:center;gap:.5rem;
  box-shadow:0 0 0 1px rgba(245,166,35,.4),0 6px 24px rgba(245,166,35,.35);
  transition:all .25s var(--spring);letter-spacing:-.2px;
}
.btn-gold:hover{
  box-shadow:0 0 0 1px rgba(245,166,35,.6),0 10px 36px rgba(245,166,35,.5);
  transform:translateY(-3px) scale(1.02);
  filter:brightness(1.08);
}

.btn-outline{
  padding:.72rem 2rem;border-radius:12px;
  border:1px solid rgba(123,92,245,.35);
  background:rgba(123,92,245,.06);
  cursor:pointer;color:var(--text);
  font-family:var(--font-d);font-size:1rem;font-weight:600;
  text-decoration:none;display:inline-flex;align-items:center;gap:.5rem;
  transition:all .25s var(--ease);
}
.btn-outline:hover{
  border-color:rgba(123,92,245,.7);
  background:rgba(123,92,245,.14);
  transform:translateY(-2px);
}

/* ── SECTIONS ── */
.ml-sec{
  padding:8rem 2.5rem;
  position:relative;
  max-width:1280px;
  margin:0 auto;
}

.sec-tag{
  display:inline-flex;align-items:center;gap:.5rem;
  padding:.28rem .9rem;border-radius:100px;
  border:1px solid rgba(123,92,245,.22);
  background:rgba(123,92,245,.08);
  color:rgba(157,125,255,.9);
  font-family:var(--font-m);font-size:.72rem;
  font-weight:500;letter-spacing:.08em;
  text-transform:uppercase;margin-bottom:1.5rem;
}
.sec-tag-dot{
  width:5px;height:5px;border-radius:50%;
  background:var(--violet2);
  box-shadow:0 0 8px var(--violet2);
  animation:pulse 2s ease-in-out infinite;
}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}

.sec-h2{
  font-family:var(--font-d);
  font-size:clamp(2.2rem,4.5vw,3.2rem);
  font-weight:800;letter-spacing:-2px;line-height:1.06;
  margin-bottom:1rem;
}
.sec-sub{
  color:var(--text2);font-size:1.05rem;
  max-width:520px;line-height:1.72;font-weight:400;
}

/* ── HERO ── */
.ml-hero{
  min-height:100vh;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  text-align:center;
  padding:9rem 2rem 5rem;
  position:relative;
}

.hero-badge{
  display:inline-flex;align-items:center;gap:.5rem;
  padding:.35rem 1rem;border-radius:100px;
  border:1px solid rgba(245,166,35,.3);
  background:rgba(245,166,35,.07);
  color:rgba(255,209,102,.9);
  font-size:.78rem;font-weight:600;letter-spacing:.08em;
  text-transform:uppercase;margin-bottom:2.2rem;
  animation:fadeUp .8s .1s both;
}
.hero-badge-icon{animation:swim 2s ease-in-out infinite}
@keyframes swim{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}

.hero-h1{
  font-family:var(--font-d);
  font-size:clamp(3rem,7.5vw,5.5rem);
  font-weight:800;letter-spacing:-3.5px;line-height:1.02;
  margin-bottom:1.8rem;
  animation:fadeUp .8s .2s both;
}
.h1-line2{display:block;margin-top:.15em}
.grad-violet{
  background:linear-gradient(135deg,#C4B1FF,#7B5CF5,#9D7DFF);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.grad-gold{
  background:linear-gradient(135deg,#FFE066,#F5A623,#FFB347);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}

.hero-p{
  font-size:1.15rem;color:var(--text2);
  max-width:600px;line-height:1.75;
  margin:0 auto 2.8rem;font-weight:400;
  animation:fadeUp .8s .3s both;
}

/* Shark banner */
.shark-card{
  width:100%;max-width:760px;
  padding:1px;
  background:linear-gradient(135deg,rgba(245,166,35,.55),rgba(255,107,157,.4),rgba(245,166,35,.3));
  border-radius:var(--rl);
  box-shadow:0 0 60px rgba(245,166,35,.15);
  margin-bottom:2.5rem;
  animation:fadeUp .8s .35s both;
}
.shark-card-in{
  background:linear-gradient(135deg,rgba(16,10,30,.97),rgba(12,8,24,.97));
  border-radius:calc(var(--rl) - 1px);
  padding:1.6rem 2rem;
  display:flex;align-items:center;gap:1.4rem;
  text-align:left;
}
.shark-ico{font-size:2.8rem;animation:swim 2.5s ease-in-out infinite;flex-shrink:0}
.shark-title{
  font-family:var(--font-d);font-size:1.2rem;font-weight:700;
  background:linear-gradient(135deg,var(--gold2),var(--gold));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  margin-bottom:.4rem;letter-spacing:-.3px;
}
.shark-body{font-size:.88rem;color:var(--text2);line-height:1.6;font-weight:400}

.hero-acts{
  display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;
  margin-bottom:3.5rem;animation:fadeUp .8s .4s both;
}

.hero-stats{
  display:flex;gap:0;flex-wrap:wrap;justify-content:center;
  border:1px solid var(--border);border-radius:16px;
  background:rgba(255,255,255,.02);
  overflow:hidden;
  animation:fadeUp .8s .5s both;
  backdrop-filter:blur(10px);
}
.hs-item{
  padding:1.2rem 2rem;border-right:1px solid var(--border);
  display:flex;flex-direction:column;align-items:center;gap:.2rem;
}
.hs-item:last-child{border-right:none}
.hs-n{
  font-family:var(--font-d);font-size:1.7rem;font-weight:800;
  letter-spacing:-1px;line-height:1;
}
.hs-l{font-size:.68rem;color:var(--text3);text-transform:uppercase;letter-spacing:.9px;font-weight:600}

/* Tracks bar */
.hero-tracks{
  width:100%;max-width:800px;
  border:1px solid var(--border);border-radius:16px;
  background:rgba(255,255,255,.02);
  backdrop-filter:blur(10px);
  padding:1rem 1.6rem;
  display:flex;align-items:center;gap:1rem;flex-wrap:wrap;
  margin-top:1.5rem;
  animation:fadeUp .8s .6s both;
}
.trk-lbl{color:var(--text3);font-size:.72rem;font-family:var(--font-m);white-space:nowrap}
.trk-pills{display:flex;gap:.4rem;flex-wrap:wrap}
.trk-pill{
  padding:.26rem .65rem;border-radius:100px;
  font-size:.72rem;font-weight:600;letter-spacing:.03em;
}
.tp1{background:rgba(123,92,245,.12);color:#C4B1FF;border:1px solid rgba(123,92,245,.2)}
.tp2{background:rgba(245,166,35,.1);color:#FFD166;border:1px solid rgba(245,166,35,.18)}
.tp3{background:rgba(6,214,160,.08);color:#6EE7B7;border:1px solid rgba(6,214,160,.18)}
.tp4{background:rgba(255,107,157,.08);color:#FFB3CE;border:1px solid rgba(255,107,157,.18)}
.trk-live{
  margin-left:auto;display:flex;align-items:center;gap:.4rem;flex-shrink:0;
}
.trk-live-dot{
  width:6px;height:6px;border-radius:50%;
  background:var(--emerald);box-shadow:0 0 8px var(--emerald);
  animation:pulse 2s ease-in-out infinite;
}
.trk-live-lbl{font-size:.7rem;color:var(--text3);font-family:var(--font-m)}

/* Scroll hint */
.scroll-hint{
  position:absolute;bottom:2.5rem;left:50%;transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;gap:.5rem;
  opacity:.45;animation:fadeUp 1s 1.2s both;
}
.scroll-ring{
  width:36px;height:36px;border:1.5px solid rgba(255,255,255,.25);
  border-radius:50%;display:flex;align-items:center;justify-content:center;
  animation:scrollBounce 2.2s ease-in-out infinite;
}
@keyframes scrollBounce{0%,100%{transform:translateY(0)}60%{transform:translateY(6px)}}
.scroll-txt{font-size:.66rem;color:var(--text3);letter-spacing:.08em;text-transform:uppercase;font-family:var(--font-m)}

@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

/* ── DEMO SECTION ── */
.demo-section{
  padding:6rem 2rem;
  position:relative;
  background:linear-gradient(180deg, var(--ink) 0%, rgba(123,92,245,.03) 50%, var(--ink) 100%);
}

.demo-container{
  max-width:1200px;
  margin:0 auto;
}

.demo-header{
  text-align:center;
  margin-bottom:4rem;
}

.demo-showcase{
  display:grid;
  grid-template-columns:1.2fr 0.8fr;
  gap:3rem;
  margin-bottom:4rem;
  align-items:start;
}

.demo-screen{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:20px;
  padding:1.5rem;
  box-shadow:0 20px 60px rgba(123,92,245,.15);
}

.demo-browser{
  background:rgba(4,4,12,.8);
  border-radius:12px;
  overflow:hidden;
  border:1px solid var(--border);
}

.browser-dots{
  display:flex;
  gap:8px;
  padding:12px 16px;
  background:rgba(255,255,255,.05);
  border-bottom:1px solid var(--border);
}

.browser-dots .dot{
  width:12px;
  height:12px;
  border-radius:50%;
}

.browser-dots .dot.red{background:#FF5F57}
.browser-dots .dot.yellow{background:#FEBC2E}
.browser-dots .dot.green{background:#28C840}

.browser-content{
  padding:2rem;
  min-height:400px;
  position:relative;
}

.demo-step{
  position:absolute;
  inset:0;
  opacity:0;
  transform:translateX(20px);
  transition:all .5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  pointer-events:none;
}

.demo-step.active{
  opacity:1;
  transform:translateX(0);
  pointer-events:auto;
}

.demo-sidebar{
  width:200px;
  padding-right:2rem;
  border-right:1px solid var(--border);
  display:flex;
  flex-direction:column;
  gap:1rem;
}

.demo-logo{
  width:40px;
  height:40px;
  background:linear-gradient(135deg,#7B5CF5,#4F35C5);
  clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:1rem;
  font-weight:900;
  color:#fff;
  margin-bottom:1rem;
}

.demo-nav-item{
  padding:.75rem 1rem;
  border-radius:8px;
  font-size:.85rem;
  color:var(--text2);
  cursor:pointer;
  transition:all .3s;
}

.demo-nav-item.active{
  background:rgba(123,92,245,.15);
  color:#C4B1FF;
  border:1px solid rgba(123,92,245,.3);
}

.demo-main{
  flex:1;
  padding-left:2rem;
}

.demo-welcome h3{
  font-family:var(--font-d);
  font-size:1.5rem;
  font-weight:700;
  color:var(--text);
  margin-bottom:.5rem;
}

.demo-welcome p{
  color:var(--text2);
  font-size:.9rem;
  margin-bottom:2rem;
}

.demo-progress-bar{
  width:100%;
  height:8px;
  background:rgba(255,255,255,.1);
  border-radius:4px;
  overflow:hidden;
  margin-bottom:2rem;
}

.demo-progress-fill{
  height:100%;
  background:linear-gradient(90deg,#7B5CF5,#F5A623);
  border-radius:4px;
  transition:width 1s ease;
}

.demo-stats{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:1rem;
}

.demo-stat{
  text-align:center;
  padding:1.5rem 1rem;
  background:rgba(255,255,255,.03);
  border:1px solid var(--border);
  border-radius:12px;
}

.stat-number{
  display:block;
  font-family:var(--font-d);
  font-size:2rem;
  font-weight:700;
  color:var(--violet2);
  margin-bottom:.25rem;
}

.stat-label{
  font-size:.75rem;
  color:var(--text2);
  text-transform:uppercase;
  letter-spacing:.05em;
}

.demo-modules h3,
.demo-pitch h3,
.demo-docs h3{
  font-family:var(--font-d);
  font-size:1.5rem;
  font-weight:700;
  color:var(--text);
  margin-bottom:1.5rem;
}

.module-list{
  display:flex;
  flex-direction:column;
  gap:.75rem;
}

.module-item{
  display:flex;
  align-items:center;
  gap:.75rem;
  padding:1rem;
  background:rgba(255,255,255,.03);
  border:1px solid var(--border);
  border-radius:10px;
  transition:all .3s;
}

.module-item.completed{
  border-color:rgba(6,214,160,.3);
  background:rgba(6,214,160,.05);
}

.module-item.active{
  border-color:rgba(123,92,245,.4);
  background:rgba(123,92,245,.1);
  animation:pulse 2s ease-in-out infinite;
}

.module-check{
  color:#6EE7B7;
  font-size:1.1rem;
  flex-shrink:0;
}

.module-progress{
  color:#C4B1FF;
  font-size:1.1rem;
  animation:spin 2s linear infinite;
  flex-shrink:0;
}

.module-lock{
  color:var(--text3);
  font-size:1rem;
  flex-shrink:0;
}

.module-name{
  font-size:.9rem;
  color:var(--text);
}

@keyframes spin{
  from{transform:rotate(0deg)}
  to{transform:rotate(360deg)}
}

.chat-container{
  display:flex;
  flex-direction:column;
  gap:1rem;
  margin-bottom:1.5rem;
}

.chat-message{
  padding:1rem;
  border-radius:12px;
  max-width:85%;
  animation:slideIn .3s ease;
}

.chat-message.ai{
  background:rgba(123,92,245,.1);
  border:1px solid rgba(123,92,245,.2);
  align-self:flex-start;
}

.chat-message.user{
  background:rgba(245,166,35,.1);
  border:1px solid rgba(245,166,35,.2);
  align-self:flex-end;
  margin-left:auto;
}

@keyframes slideIn{
  from{
    opacity:0;
    transform:translateY(10px);
  }
  to{
    opacity:1;
    transform:translateY(0);
  }
}

.chat-label{
  display:block;
  font-size:.75rem;
  font-weight:600;
  margin-bottom:.25rem;
  text-transform:uppercase;
  letter-spacing:.05em;
}

.chat-message.ai .chat-label{
  color:#C4B1FF;
}

.chat-message.user .chat-label{
  color:#FFD166;
}

.chat-message p{
  font-size:.85rem;
  color:var(--text);
  line-height:1.5;
  margin:0;
}

.pitch-score{
  display:flex;
  align-items:center;
  gap:.5rem;
  padding:1rem;
  background:rgba(123,92,245,.1);
  border:1px solid rgba(123,92,245,.2);
  border-radius:10px;
}

.score-label{
  font-size:.85rem;
  color:var(--text2);
}

.score-value{
  font-family:var(--font-d);
  font-size:1.25rem;
  font-weight:700;
  color:#C4B1FF;
}

.doc-preview{
  background:rgba(255,255,255,.03);
  border:1px solid var(--border);
  border-radius:12px;
  padding:1.5rem;
  margin-bottom:1.5rem;
}

.doc-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:1rem;
  padding-bottom:1rem;
  border-bottom:1px solid var(--border);
}

.doc-title{
  font-family:var(--font-d);
  font-size:1rem;
  font-weight:600;
  color:var(--text);
}

.doc-status{
  font-size:.75rem;
  color:#6EE7B7;
  padding:.25rem .75rem;
  background:rgba(6,214,160,.1);
  border-radius:100px;
  border:1px solid rgba(6,214,160,.2);
}

.doc-content p{
  font-size:.85rem;
  color:var(--text2);
  line-height:1.6;
  margin-bottom:.5rem;
  opacity:.7;
}

.doc-actions{
  display:flex;
  gap:.75rem;
}

.doc-btn{
  flex:1;
  padding:.75rem 1rem;
  border-radius:8px;
  font-family:var(--font-d);
  font-size:.85rem;
  font-weight:600;
  cursor:pointer;
  transition:all .3s;
  border:none;
}

.doc-btn.download{
  background:linear-gradient(135deg,#7B5CF5,#5B3CC5);
  color:#fff;
}

.doc-btn.download:hover{
  transform:translateY(-2px);
  box-shadow:0 4px 20px rgba(123,92,245,.3);
}

.doc-btn.share{
  background:rgba(255,255,255,.05);
  color:var(--text);
  border:1px solid var(--border);
}

.doc-btn.share:hover{
  background:rgba(255,255,255,.1);
  border-color:rgba(123,92,245,.3);
}

.demo-steps{
  display:flex;
  flex-direction:column;
  gap:1rem;
}

.demo-step-item{
  display:flex;
  gap:1rem;
  padding:1.25rem;
  background:rgba(255,255,255,.03);
  border:1px solid var(--border);
  border-radius:12px;
  transition:all .3s;
  cursor:pointer;
}

.demo-step-item:hover{
  background:rgba(123,92,245,.08);
  border-color:rgba(123,92,245,.3);
  transform:translateX(5px);
}

.demo-step-item.active{
  background:rgba(123,92,245,.12);
  border-color:rgba(123,92,245,.4);
}

.step-number{
  width:32px;
  height:32px;
  background:linear-gradient(135deg,#7B5CF5,#4F35C5);
  border-radius:8px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-family:var(--font-d);
  font-size:.9rem;
  font-weight:700;
  color:#fff;
  flex-shrink:0;
}

.step-content h4{
  font-family:var(--font-d);
  font-size:1rem;
  font-weight:600;
  color:var(--text);
  margin-bottom:.25rem;
}

.step-content p{
  font-size:.85rem;
  color:var(--text2);
  line-height:1.5;
}

.demo-features{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:1.5rem;
}

.demo-feature{
  text-align:center;
  padding:2rem 1.5rem;
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:16px;
  transition:all .3s;
}

.demo-feature:hover{
  border-color:rgba(123,92,245,.3);
  transform:translateY(-5px);
  box-shadow:0 10px 40px rgba(123,92,245,.1);
}

.feature-icon{
  font-size:2.5rem;
  margin-bottom:1rem;
}

.demo-feature h4{
  font-family:var(--font-d);
  font-size:1.1rem;
  font-weight:600;
  color:var(--text);
  margin-bottom:.5rem;
}

.demo-feature p{
  font-size:.85rem;
  color:var(--text2);
  line-height:1.5;
}

@media(max-width:968px){
  .demo-showcase{
    grid-template-columns:1fr;
  }
  .demo-sidebar{
    width:100%;
    padding-right:0;
    border-right:none;
    border-bottom:1px solid var(--border);
    padding-bottom:1rem;
    flex-direction:row;
    overflow-x:auto;
  }
  .demo-main{
    padding-left:0;
    padding-top:1rem;
  }
  .demo-features{
    grid-template-columns:1fr;
  }
}

@media(max-width:480px){
  .demo-stats{
    grid-template-columns:1fr;
  }
  .demo-sidebar{
    flex-direction:column;
  }
}

/* ── FEATURES SECTION ── */
.feat-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
  gap:1.2rem;margin-top:3.5rem;
}
.feat-card{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:var(--rl);
  padding:2.2rem;
  display:flex;flex-direction:column;gap:1.2rem;
  position:relative;overflow:hidden;
  transition:all .35s var(--ease);
  cursor:default;
  transform-style:preserve-3d;
}
.feat-card::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(800px circle at var(--mx,50%) var(--my,50%), rgba(123,92,245,.07), transparent 40%);
  opacity:0;transition:opacity .4s;
}
.feat-card:hover{
  border-color:rgba(123,92,245,.3);
  box-shadow:0 24px 64px rgba(0,0,0,.35),0 0 0 1px rgba(123,92,245,.12);
  transform:translateY(-6px);
}
.feat-card:hover::before{opacity:1}
.feat-glow{
  position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(123,92,245,.8) 50%,transparent);
  opacity:0;transition:opacity .3s;
}
.feat-card:hover .feat-glow{opacity:1}
.feat-ico{
  width:52px;height:52px;border-radius:14px;
  display:flex;align-items:center;justify-content:center;
  font-size:1.4rem;
  transition:transform .3s var(--spring);
}
.feat-card:hover .feat-ico{transform:scale(1.12) rotate(-8deg)}
.fi-v{background:rgba(123,92,245,.1);border:1px solid rgba(123,92,245,.2);color:#C4B1FF}
.fi-g{background:rgba(245,166,35,.1);border:1px solid rgba(245,166,35,.2);color:#FFD166}
.fi-e{background:rgba(6,214,160,.08);border:1px solid rgba(6,214,160,.2);color:#6EE7B7}
.feat-h3{font-family:var(--font-d);font-size:1.15rem;font-weight:700;letter-spacing:-.3px}
.feat-p{color:var(--text2);font-size:.9rem;line-height:1.68;font-weight:400}

/* ── SCROLL STEPS SECTION ── */
.steps-section{
  position:relative;
  min-height:400vh;
}
.steps-sticky{
  position:sticky;
  top:0;height:100vh;
  overflow:hidden;
  display:flex;align-items:center;justify-content:center;
}
#ml-steps-canvas{
  position:absolute;inset:0;
  width:100%;height:100%;
}
.steps-ui{
  position:relative;z-index:10;
  pointer-events:none;
  width:100%;max-width:1100px;
  padding:0 2rem;
  display:flex;flex-direction:column;align-items:center;
}
.steps-header{
  text-align:center;margin-bottom:3rem;
}
.steps-grid{
  display:grid;grid-template-columns:repeat(4,1fr);
  gap:1rem;width:100%;
  pointer-events:all;
}
.step-card{
  background:rgba(255,255,255,.03);
  border:1px solid var(--border);
  border-radius:var(--r);
  padding:1.5rem;
  display:flex;flex-direction:column;gap:.7rem;
  transition:all .5s var(--spring);
  cursor:pointer;
  position:relative;overflow:hidden;
  opacity:.5;transform:translateY(10px) scale(.96);
}
.step-card.lit{
  opacity:1;
  border-color:rgba(123,92,245,.45);
  background:rgba(123,92,245,.07);
  box-shadow:0 20px 50px rgba(123,92,245,.18),0 0 0 1px rgba(123,92,245,.2);
  transform:translateY(-6px) scale(1.02);
}
.step-card-line{
  position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,var(--violet),var(--violet2));
  transform:scaleX(0);transform-origin:left;
  transition:transform .6s var(--ease);
}
.step-card.lit .step-card-line{transform:scaleX(1)}
.step-n{
  width:44px;height:44px;border-radius:12px;
  background:rgba(123,92,245,.12);
  border:1px solid rgba(123,92,245,.25);
  display:flex;align-items:center;justify-content:center;
  font-family:var(--font-m);font-size:.78rem;font-weight:500;
  color:#C4B1FF;
  transition:all .4s var(--spring);
}
.step-card.lit .step-n{
  background:rgba(123,92,245,.25);
  border-color:#7B5CF5;
  box-shadow:0 0 20px rgba(123,92,245,.35);
  transform:scale(1.12);
}
.step-h{font-family:var(--font-d);font-size:.98rem;font-weight:700;letter-spacing:-.2px}
.step-p{color:var(--text2);font-size:.83rem;line-height:1.58;font-weight:400}

/* Progress bar */
.steps-progress{
  display:flex;gap:.5rem;margin-top:1.5rem;
  pointer-events:all;
}
.prog-dot{
  width:8px;height:8px;border-radius:50%;
  background:var(--border2);
  transition:all .35s var(--ease);cursor:pointer;
}
.prog-dot.active{
  background:var(--violet2);
  box-shadow:0 0 10px var(--violet2);
  transform:scale(1.3);
}

/* 3D label overlay */
.step-3d-label{
  position:absolute;
  font-family:var(--font-d);font-size:1rem;font-weight:700;
  color:rgba(255,255,255,.85);
  text-shadow:0 0 20px var(--violet);
  pointer-events:none;
  transition:all .4s var(--ease);
  white-space:nowrap;
}

/* ── PRICING ── */
.price-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:1.2rem;margin-top:3.5rem;
}
.price-card{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:var(--rl);
  padding:2.25rem;
  display:flex;flex-direction:column;gap:1.4rem;
  transition:all .3s var(--ease);
  position:relative;overflow:hidden;
}
.price-card:hover{transform:translateY(-5px);box-shadow:0 28px 70px rgba(0,0,0,.4)}
.price-card.hot{
  border-color:rgba(245,166,35,.4);
  background:linear-gradient(145deg,rgba(245,166,35,.055),var(--surface));
}
.price-card.hot::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(245,166,35,.9) 50%,transparent);
}
.price-card.hot:hover{
  border-color:rgba(245,166,35,.65);
  box-shadow:0 28px 70px rgba(0,0,0,.4),0 0 50px rgba(245,166,35,.1);
}
.hot-chip{
  position:absolute;top:1.2rem;right:1.2rem;
  padding:.22rem .65rem;border-radius:100px;
  background:rgba(245,166,35,.12);
  border:1px solid rgba(245,166,35,.28);
  color:#FFD166;font-size:.68rem;font-weight:700;
  letter-spacing:.05em;text-transform:uppercase;
}
.p-name{font-family:var(--font-d);font-size:1.05rem;font-weight:700;letter-spacing:-.3px}
.p-desc{color:var(--text2);font-size:.84rem;margin-top:.2rem;font-weight:400}
.p-price{
  font-family:var(--font-d);font-size:2.8rem;font-weight:800;
  letter-spacing:-2px;line-height:1;
}
.p-price small{font-size:.95rem;color:var(--text2);font-weight:400;letter-spacing:0}
.p-divider{height:1px;background:var(--border)}
.p-feats{display:flex;flex-direction:column;gap:.6rem}
.p-feat{display:flex;align-items:flex-start;gap:.5rem;font-size:.87rem;color:var(--text2);font-weight:400}
.p-feat.bright{color:var(--text)}
.p-check{
  width:18px;height:18px;border-radius:50%;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-size:.58rem;font-weight:800;margin-top:1px;
}
.ck-v{background:rgba(123,92,245,.12);color:#C4B1FF;border:1px solid rgba(123,92,245,.22)}
.ck-g{background:rgba(245,166,35,.12);color:#FFD166;border:1px solid rgba(245,166,35,.22)}

/* ── REGIONS ── */
.reg-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(200px,1fr));
  gap:.85rem;margin-top:3.5rem;
}
.reg-card{
  background:var(--surface);border:1px solid var(--border);
  border-radius:var(--r);padding:.9rem 1.1rem;
  display:flex;align-items:center;gap:.8rem;
  transition:all .25s var(--ease);cursor:default;
}
.reg-card:hover{
  border-color:rgba(123,92,245,.3);
  background:rgba(123,92,245,.05);
  transform:translateX(5px);
}
.reg-code{
  width:38px;height:38px;border-radius:9px;
  background:rgba(123,92,245,.08);border:1px solid rgba(123,92,245,.18);
  display:flex;align-items:center;justify-content:center;
  font-family:var(--font-m);font-size:.68rem;font-weight:500;color:#C4B1FF;
  flex-shrink:0;transition:all .25s;
}
.reg-card:hover .reg-code{background:rgba(123,92,245,.18);box-shadow:0 0 14px rgba(123,92,245,.2)}
.reg-nm{font-size:.88rem;font-weight:500;letter-spacing:-.1px}

/* ── CTA ── */
.cta-outer{padding:2rem 2.5rem 8rem;position:relative;z-index:1;max-width:1280px;margin:0 auto}
.cta-wrap{
  padding:1px;
  background:linear-gradient(135deg,rgba(123,92,245,.6),rgba(245,166,35,.38),rgba(123,92,245,.25));
  border-radius:var(--rl);
  box-shadow:0 0 100px rgba(123,92,245,.12);
}
.cta-in{
  background:linear-gradient(135deg,#13102a,#18163a,#16142e);
  border-radius:calc(var(--rl) - 1px);
  padding:4rem;
  display:flex;align-items:center;justify-content:space-between;
  gap:2rem;flex-wrap:wrap;
}
.cta-h2{font-family:var(--font-d);font-size:clamp(1.6rem,3vw,2.3rem);font-weight:800;letter-spacing:-1px;line-height:1.15}
.cta-p{color:var(--text2);font-size:.92rem;margin-top:.5rem;font-weight:400}
.cta-acts{display:flex;gap:.85rem;flex-shrink:0;flex-wrap:wrap}

/* ── FOOTER ── */
.ml-ftr{
  border-top:1px solid var(--border);
  padding:3rem 2.5rem;
  background:rgba(4,4,12,.7);
  position:relative;z-index:1;
}
.ml-ftr-in{
  max-width:1280px;margin:0 auto;
  display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1.5rem;
}
.ftr-links{display:flex;gap:1.5rem;flex-wrap:wrap}
.ftr-a{color:var(--text3);font-size:.84rem;text-decoration:none;transition:color .2s}
.ftr-a:hover{color:var(--text2)}
.ftr-copy{color:var(--text3);font-size:.78rem;margin-top:.3rem}

/* ── BG STRIPE ── */
.bg-alt{
  background:linear-gradient(180deg,transparent,rgba(20,15,40,.45) 15%,rgba(20,15,40,.45) 85%,transparent);
  border-top:1px solid var(--border);border-bottom:1px solid var(--border);
}

/* ── SCROLL REVEAL ── */
.rev{opacity:0;transform:translateY(28px);transition:opacity .7s var(--ease),transform .7s var(--ease)}
.rev.vis{opacity:1;transform:translateY(0)}

/* ── MOBILE ── */
@media(max-width:860px){
  .ml-nav-links{display:none}
  .steps-grid{grid-template-columns:1fr 1fr}
  .cta-in{padding:2.5rem 2rem}
  .cta-acts{width:100%;flex-direction:column}
  .cta-acts .btn-gold,.cta-acts .btn-outline{width:100%;justify-content:center}
  .shark-card-in{flex-direction:column;text-align:center}
  .shark-ico{font-size:2.2rem}
  .hs-item{padding:.9rem 1.2rem}
  .hero-stats{border-radius:12px}
}
@media(max-width:480px){
  .steps-grid{grid-template-columns:1fr}
  .hero-h1{letter-spacing:-2px}
}
`;

/* ─── THREE.js setup ─── */
async function loadThree() {
  if (typeof window.THREE !== 'undefined') return window.THREE;
  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload = () => resolve(window.THREE);
    document.head.appendChild(s);
  });
}

/* ─── Global particle background ─── */
function createParticleBackground(canvas) {
  const THREE = window.THREE;
  const W = window.innerWidth, H = window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(W, H);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, W / H, 0.1, 200);
  camera.position.set(0, 0, 7);

  // — Particles
  const COUNT = 400;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  const vel = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    pos[i*3]   = (Math.random() - .5) * 26;
    pos[i*3+1] = (Math.random() - .5) * 18;
    pos[i*3+2] = (Math.random() - .5) * 18;
    vel[i] = .0008 + Math.random() * .0015;
    const t = Math.random();
    if (t > .65)      { col[i*3]=.48; col[i*3+1]=.36; col[i*3+2]=.96; }  // violet
    else if (t > .38) { col[i*3]=.96; col[i*3+1]=.65; col[i*3+2]=.14; }  // gold
    else if (t > .2)  { col[i*3]=.02; col[i*3+1]=.84; col[i*3+2]=.63; }  // emerald
    else              { col[i*3]=1;   col[i*3+1]=.42; col[i*3+2]=.62; }  // rose
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({ size:.038, vertexColors:true, transparent:true, opacity:.7, sizeAttenuation:true });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);

  // — Floating wireframe objects
  const meshes = [];
  const shapes = [
    [new THREE.IcosahedronGeometry(1.2, 1), 0x7B5CF5, -5, 1, -3],
    [new THREE.OctahedronGeometry(1, 0),    0xF5A623,  5, -1, -2],
    [new THREE.TetrahedronGeometry(.9, 0),  0x06D6A0, -3, -2, -4],
    [new THREE.IcosahedronGeometry(.7, 0),  0xFF6B9D,  4,  2, -1],
    [new THREE.OctahedronGeometry(.6, 0),   0x7B5CF5,  0, -3, -5],
  ];
  shapes.forEach(([g, c, x, y, z], i) => {
    const wire = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color:c, wireframe:true, transparent:true, opacity:.12 }));
    const solid = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color:c, transparent:true, opacity:.03 }));
    const grp = new THREE.Group();
    grp.add(wire); grp.add(solid);
    grp.position.set(x, y, z);
    grp.userData = { spd: .25 + i * .08, off: i * 1.3 };
    scene.add(grp);
    meshes.push(grp);
  });

  let mx = 0, my = 0, scrollY = 0;
  const onMM = e => { mx = (e.clientX/window.innerWidth - .5) * 2; my = -(e.clientY/window.innerHeight - .5) * 2; };
  const onScroll = () => { scrollY = window.scrollY; };
  window.addEventListener('mousemove', onMM, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  const onResize = () => {
    const W2 = window.innerWidth, H2 = window.innerHeight;
    renderer.setSize(W2, H2);
    camera.aspect = W2 / H2;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();
  let raf;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    const t = clock.getElapsedTime();

    camera.position.x += (mx * .5 - camera.position.x) * .035;
    camera.position.y += (my * .35 - camera.position.y) * .035;
    camera.position.z = 7 - scrollY * .0006;

    pts.rotation.y = t * .02;
    pts.rotation.x = t * .01;

    meshes.forEach((m, i) => {
      m.rotation.x = t * m.userData.spd * .22;
      m.rotation.y = t * m.userData.spd * .31;
      m.position.y += Math.sin(t * .7 + m.userData.off) * .002;
    });

    // Rise particles
    const pa = geo.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      pa[i*3+1] += vel[i];
      if (pa[i*3+1] > 9) pa[i*3+1] = -9;
    }
    geo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  };
  tick();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('mousemove', onMM);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
  };
}

/* ─── Steps 3D scene ─── */
function createStepsScene(canvas) {
  const THREE = window.THREE;
  if (!canvas || !THREE) return { destroy: () => {}, setProgress: () => {} };

  const W = canvas.offsetWidth || window.innerWidth;
  const H = canvas.offsetHeight || window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
  camera.position.set(0, 0, 12);

  // — Step nodes
  const COLORS = [0x7B5CF5, 0xF5A623, 0x06D6A0, 0xFF6B9D];
  const GEOS   = [
    new THREE.IcosahedronGeometry(1.1, 2),
    new THREE.OctahedronGeometry(1.05, 0),
    new THREE.TetrahedronGeometry(1.0, 0),
    new THREE.IcosahedronGeometry(1.0, 1),
  ];
  const xPositions = [-5.5, -1.8, 1.8, 5.5];

  const nodes = [];
  GEOS.forEach((g, i) => {
    const grp = new THREE.Group();

    // Core solid
    const solid = new THREE.Mesh(g, new THREE.MeshBasicMaterial({
      color: COLORS[i], transparent: true, opacity: .05
    }));
    // Wireframe
    const wire = new THREE.Mesh(g, new THREE.MeshBasicMaterial({
      color: COLORS[i], wireframe: true, transparent: true, opacity: .25
    }));
    // Outer halo ring
    const ringGeo = new THREE.TorusGeometry(1.8, .015, 8, 64);
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
      color: COLORS[i], transparent: true, opacity: .15
    }));
    ring.rotation.x = Math.PI / 2;

    // Orbit particles
    const pCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let j = 0; j < pCount; j++) {
      const a = Math.random() * Math.PI * 2;
      const r = 1.5 + Math.random() * 1.2;
      pPos[j*3]   = Math.cos(a) * r;
      pPos[j*3+1] = (Math.random() - .5) * .8;
      pPos[j*3+2] = Math.sin(a) * r;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: COLORS[i], size: .055, transparent: true, opacity: .5 });
    const orbPts = new THREE.Points(pGeo, pMat);

    grp.add(solid, wire, ring, orbPts);
    grp.position.set(xPositions[i], 0, 0);
    grp.userData = { idx: i, spd: .35 + i * .1, off: i * 1.5, lit: false };
    scene.add(grp);
    nodes.push({ grp, solid, wire, ring, orbPts, pMat });
  });

  // — Connection beams
  const beamMats = [];
  for (let i = 0; i < 3; i++) {
    const pts = [
      new THREE.Vector3(xPositions[i] + 1.4, 0, 0),
      new THREE.Vector3(xPositions[i+1] - 1.4, 0, 0),
    ];
    const bGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const bMat = new THREE.LineBasicMaterial({ color: 0x333355, transparent: true, opacity: .3 });
    scene.add(new THREE.Line(bGeo, bMat));
    beamMats.push(bMat);
  }

  // — Central energy core (visible when all lit)
  const coreGeo = new THREE.SphereGeometry(.3, 16, 16);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.position.set(0, 3, 0);
  scene.add(core);

  // — Big background particle cloud
  const bgCount = 400;
  const bgGeo = new THREE.BufferGeometry();
  const bgPos = new Float32Array(bgCount * 3);
  const bgCol = new Float32Array(bgCount * 3);
  for (let i = 0; i < bgCount; i++) {
    bgPos[i*3]   = (Math.random() - .5) * 30;
    bgPos[i*3+1] = (Math.random() - .5) * 20;
    bgPos[i*3+2] = (Math.random() - .5) * 10 - 5;
    bgCol[i*3]   = .48 + Math.random() * .2;
    bgCol[i*3+1] = .36;
    bgCol[i*3+2] = .96;
  }
  bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
  bgGeo.setAttribute('color', new THREE.BufferAttribute(bgCol, 3));
  scene.add(new THREE.Points(bgGeo, new THREE.PointsMaterial({ size:.03, vertexColors:true, transparent:true, opacity:.25, sizeAttenuation:true })));

  let currentProgress = -1;
  function setProgress(p) {
    // p = 0..1 representing scroll through the steps section
    const litCount = Math.floor(p * 4.5); // 0-4 → lights up 0-4 nodes
    nodes.forEach(({ grp, solid, wire, ring, pMat }, i) => {
      const isLit = i < litCount;
      const isActive = i === Math.min(3, litCount - 1);
      grp.userData.lit = isLit;

      solid.material.opacity = isLit ? .15 : .04;
      wire.material.opacity  = isLit ? .9 : .2;
      ring.material.opacity  = isLit ? (isActive ? .5 : .25) : .08;
      pMat.opacity           = isLit ? .7 : .3;
      ring.material.color.setHex(isActive ? 0xF5A623 : COLORS[i]);
    });

    beamMats.forEach((bm, i) => {
      bm.opacity = Math.min(.6, Math.max(.1, (litCount - i) * .25));
      const t = Math.max(0, Math.min(1, p * 4 - i));
      bm.color.setRGB(.48 * t + .13 * (1-t), .36 * t + .13 * (1-t), .96 * t + .21 * (1-t));
    });

    const allLit = litCount >= 4;
    coreMat.opacity = allLit ? (.4 + Math.sin(Date.now() * .003) * .2) : 0;
    currentProgress = p;
  }

  let mx = 0, my = 0;
  const onMM = e => {
    const r = canvas.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width  - .5) * 2;
    my = -((e.clientY - r.top)  / r.height - .5) * 2;
  };
  canvas.addEventListener('mousemove', onMM, { passive: true });

  const onResize = () => {
    const W2 = canvas.offsetWidth, H2 = canvas.offsetHeight;
    renderer.setSize(W2, H2);
    camera.aspect = W2 / H2;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();
  let raf;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    const t = clock.getElapsedTime();

    nodes.forEach(({ grp, ring }, i) => {
      grp.rotation.y = t * grp.userData.spd * .28;
      grp.rotation.x = t * grp.userData.spd * .18;
      grp.position.y = Math.sin(t * 1.1 + grp.userData.off) * (grp.userData.lit ? .18 : .08);
      const s = grp.userData.lit ? 1.08 : 1;
      grp.scale.setScalar(s + Math.sin(t * 2 + i) * (grp.userData.lit ? .03 : .005));
      ring.rotation.z = t * .4;
      ring.rotation.y = t * .2;
    });

    camera.position.x += (mx * .6 - camera.position.x) * .04;
    camera.position.y += (my * .35 - camera.position.y) * .04;
    camera.lookAt(0, 0, 0);

    if (coreMat.opacity > 0) {
      core.rotation.y = t * 2;
      const s = 1 + Math.sin(t * 3) * .2;
      core.scale.setScalar(s);
    }

    renderer.render(scene, camera);
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

/* ─── Scroll Reveal Hook ─── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } }),
      { threshold: .1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.rev').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── SVG Icons ─── */
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const IconChev = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);
const IconBrain = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2a2.5 2.5 0 0 1 5 0"/>
    <path d="M9.5 22a2.5 2.5 0 0 0 5 0"/>
    <path d="M9 3.5A6.5 6.5 0 0 0 9 20.5"/>
    <path d="M15 3.5a6.5 6.5 0 0 1 0 17"/>
    <path d="M3 9.5a2.5 2.5 0 0 1 0 5"/>
    <path d="M21 9.5a2.5 2.5 0 0 0 0 5"/>
  </svg>
);
const IconBook = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const IconMap = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
    <line x1="9" y1="3" x2="9" y2="18"/>
    <line x1="15" y1="6" x2="15" y2="21"/>
  </svg>
);
const IconShark = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
const LandingPage = () => {
  // Routing & auth stubs — swap with your real imports
  const navigate = (to) => { window.location.href = to; };
  const user = null;

  const bgCanvasRef    = useRef(null);
  const stepsCanvasRef = useRef(null);
  const stepsSectionRef= useRef(null);
  const hdrRef         = useRef(null);
  const cursorRef      = useRef(null);
  const cursorTrailRef = useRef(null);
  const stepsApiRef    = useRef(null);

  const [activeStep,  setActiveStep]  = useState(-1);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [threeReady,  setThreeReady]  = useState(false);
  const [demoStep,    setDemoStep]    = useState(0);

  /* Auto-cycle demo steps */
  useEffect(() => {
    const interval = setInterval(() => {
      setDemoStep(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useReveal();

  /* Inject fonts & CSS */
  useEffect(() => {
    injectFonts();
    const style = document.createElement('style');
    style.id = 'ml-css';
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.getElementById('ml-css')?.remove();
  }, []);

  /* Custom cursor */
  useEffect(() => {
    let rx = 0, ry = 0, tx = 0, ty = 0;
    const move = e => { tx = e.clientX; ty = e.clientY; };
    window.addEventListener('mousemove', move, { passive: true });
    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      rx += (tx - rx) * .14;
      ry += (ty - ry) * .14;
      if (cursorRef.current) cursorRef.current.style.cssText = `left:${tx}px;top:${ty}px;`;
      if (cursorTrailRef.current) cursorTrailRef.current.style.cssText = `left:${rx}px;top:${ry}px;`;
    };
    loop();
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);

  /* Init Three.js background */
  useEffect(() => {
    let destroy;
    console.log('Loading THREE.js...');
    loadThree().then(() => {
      console.log('THREE.js loaded, creating particle background');
      setThreeReady(true);
      if (bgCanvasRef.current) {
        console.log('Canvas found, creating background');
        destroy = createParticleBackground(bgCanvasRef.current);
      } else {
        console.error('Canvas ref is null');
      }
    }).catch(err => {
      console.error('Failed to load THREE.js:', err);
    });
    return () => destroy?.();
  }, []);

  /* Init Steps scene once Three is ready */
  useEffect(() => {
    if (!threeReady || !stepsCanvasRef.current) return;
    const api = createStepsScene(stepsCanvasRef.current);
    stepsApiRef.current = api;
    return () => api.destroy();
  }, [threeReady]);

  /* Header scroll */
  useEffect(() => {
    const h = () => hdrRef.current?.classList.toggle('solid', window.scrollY > 30);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  /* Scroll-driven step progress */
  useEffect(() => {
    const handler = () => {
      if (!stepsSectionRef.current) return;
      const rect = stepsSectionRef.current.getBoundingClientRect();
      const total = stepsSectionRef.current.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / total));

      // Update 3D scene
      stepsApiRef.current?.setProgress(progress);

      // Update card highlights
      const step = Math.floor(progress * 4.5);
      setActiveStep(step < 1 ? -1 : step - 1);
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, [threeReady]);

  /* Tilt effect on cards */
  useEffect(() => {
    const cards = document.querySelectorAll('[data-tilt]');
    const cleanup = [];
    cards.forEach(card => {
      const mm = e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - .5;
        const y = (e.clientY - r.top)  / r.height - .5;
        card.style.transform = `translateY(-6px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
        // track mouse for gradient
        card.style.setProperty('--mx', `${(x + .5) * 100}%`);
        card.style.setProperty('--my', `${(y + .5) * 100}%`);
      };
      const ml = () => { card.style.transform = ''; };
      card.addEventListener('mousemove', mm);
      card.addEventListener('mouseleave', ml);
      cleanup.push(() => { card.removeEventListener('mousemove', mm); card.removeEventListener('mouseleave', ml); });
    });
    return () => cleanup.forEach(f => f());
  }, []);

  const scrollTo = id => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileOpen(false);
  };

  /* Data */
  const features = [
    { ico: <IconBrain />, cls: 'fi-v', t: 'AI Venture Mentor',     p: 'Pitch Coach powered by Claude. Mock Q&A with readiness scores across Clarity, Market Fit, and Value Prop. Like having a ₹4 lakh coach in your pocket.' },
    { ico: <IconBook />, cls: 'fi-g', t: '30 Structured Modules', p: 'Five focused tracks — Foundations, Finance, Operations, Marketing, Fundraising. Each module ends with a real exportable deliverable, not just a quiz.' },
    { ico: <IconMap />, cls: 'fi-e', t: 'Built For Your Region', p: 'Templates and coaching tuned for US, GCC, and key African ecosystems. Not generic advice painted over your local reality.' },
  ];

  const steps = [
    { n: '01', t: 'Describe your idea',    p: 'Brief your concept, pick category tiles and your target market region.' },
    { n: '02', t: 'Complete each module',  p: 'Structured lessons with deliverables you actually fill out — not just watch.' },
    { n: '03', t: 'Spar with Pitch Coach', p: 'AI investor fires real questions. Weak spots scored and rebuilt in real-time.' },
    { n: '04', t: 'Export your brief',     p: 'One-click PDF or Word export of your full brief, ready for investors.' },
  ];

  const regions = [
    { name:'United States', code:'US' }, { name:'UAE', code:'UAE' }, { name:'Saudi Arabia', code:'SA' },
    { name:'Egypt', code:'EG' }, { name:'Nigeria', code:'NG' }, { name:'Kenya', code:'KE' },
    { name:'Jordan', code:'JO' }, { name:'Qatar', code:'QA' }, { name:'India', code:'IN' },
  ];

  const Check = () => <span style={{ fontWeight:800, fontSize:'.6rem' }}>✓</span>;

  return (
    <>
      {/* ── Custom Cursor ── */}
      <div id="ml-cursor" ref={cursorRef} />
      <div id="ml-cursor-trail" ref={cursorTrailRef} />

      {/* ── Noise overlay ── */}
      <div className="ml-noise" />

      {/* ── WebGL Background ── */}
      <canvas id="ml-bg-canvas" ref={bgCanvasRef} />

      <div className="ml-page">

        {/* ── HEADER ── */}
        <div className="ml-hdr-wrap" ref={hdrRef}>
          <header className="ml-hdr">
            <a href="/" className="ml-logo" data-hover>
              <div className="ml-logo-gem">M</div>
              Mind<span className="ml-logo-v">Launch</span>
            </a>

            <nav className="ml-nav-links">
              {['features','steps','pricing','regions'].map(id => (
                <span key={id} className="ml-nav-link" onClick={() => scrollTo(id)} data-hover>
                  {id.charAt(0).toUpperCase() + id.slice(1).replace('steps','How It Works')}
                </span>
              ))}
            </nav>

            <div className="ml-hdr-btns desktop-only">
              {user ? (
                <a href="/dashboard" className="btn-primary" data-hover>Dashboard <IconArrow /></a>
              ) : (
                <>
                  <a href="/login" className="btn-ghost" data-hover>Log in</a>
                  <a href="/register" className="btn-primary" data-hover>Get started <IconArrow /></a>
                </>
              )}
            </div>

            <button 
              className={`ml-hamburger ${mobileOpen ? 'active' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </header>

          {/* Mobile menu overlay */}
          <div className={`ml-mobile-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />

          {/* Mobile menu */}
          <nav className={`ml-mobile-menu ${mobileOpen ? 'open' : ''}`}>
            {['features','steps','pricing','regions'].map(id => (
              <span key={id} className="ml-nav-link" onClick={() => scrollTo(id)}>
                {id.charAt(0).toUpperCase() + id.slice(1).replace('steps','How It Works')}
              </span>
            ))}
            <div className="ml-hdr-btns">
              {user ? (
                <a href="/dashboard" className="btn-primary" data-hover>Dashboard <IconArrow /></a>
              ) : (
                <>
                  <a href="/login" className="btn-ghost" data-hover>Log in</a>
                  <a href="/register" className="btn-primary" data-hover>Get started <IconArrow /></a>
                </>
              )}
            </div>
          </nav>
        </div>

        {/* ── HERO ── */}
        <section className="ml-hero">
          <div className="hero-badge">
            <span className="hero-badge-icon"><IconShark /></span>
            Shark Tank–style VC matchmaking
          </div>

          <h1 className="hero-h1">
            Launch your startup
            <span className="h1-line2">
              with <span className="grad-violet">AI-guided</span>{' '}
              <span className="grad-gold">learning</span>
            </span>
          </h1>

          <p className="hero-p">
            30 structured modules across 5 tracks. A Claude-powered pitch coach that thinks like a VC. Built for founders in 9 global markets — from Mumbai to Manhattan.
          </p>

          {/* Shark Tank card */}
          <div className="shark-card">
            <div className="shark-card-in">
              <div className="shark-ico"><IconShark /></div>
              <div>
                <h3 className="shark-title">Complete Your Journey → Get Funded</h3>
                <p className="shark-body">
                  Finish all courses with your pitch deck and presentation. Your profile gets automatically listed with our connected VC network for evaluation and funding — just like Shark Tank, but global.
                </p>
              </div>
            </div>
          </div>

          <div className="hero-acts">
            <a href="/register" className="btn-gold" data-hover>Get started free <IconArrow /></a>
            <a href="/register" className="btn-outline" data-hover>Try demo</a>
          </div>

          <div className="hero-stats">
            {[['30','Modules'],['5','Tracks'],['9','Regions'],['AI','Coach']].map(([n, l]) => (
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
              <div className="trk-live-dot" />
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

        {/* ── DEMO SECTION ── */}
        <section className="demo-section" id="demo">
          <div className="demo-container">
            <div className="demo-header">
              <div className="sec-tag" style={{ justifyContent:'center' }}>
                <div className="sec-tag-dot" /> See It In Action
              </div>
              <h2 className="sec-h2" style={{ textAlign:'center' }}>
                How MindLaunch<br /><span className="grad-violet">works for you</span>
              </h2>
              <p className="sec-sub" style={{ margin:'0 auto', textAlign:'center', maxWidth:'600px' }}>
                Watch how founders transform their ideas into investor-ready businesses through our structured AI-guided platform.
              </p>
            </div>

            <div className="demo-showcase">
              <div className="demo-screen">
                <div className="demo-browser">
                  <div className="browser-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <div className="browser-content">
                    <div className={`demo-step ${demoStep === 0 ? 'active' : ''}`} data-step="1">
                      <div className="demo-sidebar">
                        <div className="demo-logo">M</div>
                        <div className="demo-nav-item active">Dashboard</div>
                        <div className="demo-nav-item">My Modules</div>
                        <div className="demo-nav-item">Pitch Coach</div>
                        <div className="demo-nav-item">Documents</div>
                      </div>
                      <div className="demo-main">
                        <div className="demo-welcome">
                          <h3>Welcome back, Founder!</h3>
                          <p>Your startup journey progress</p>
                          <div className="demo-progress-bar">
                            <div className="demo-progress-fill" style={{ width: '65%' }}></div>
                          </div>
                          <div className="demo-stats">
                            <div className="demo-stat">
                              <span className="stat-number">12</span>
                              <span className="stat-label">Modules</span>
                            </div>
                            <div className="demo-stat">
                              <span className="stat-number">8</span>
                              <span className="stat-label">Completed</span>
                            </div>
                            <div className="demo-stat">
                              <span className="stat-number">4</span>
                              <span className="stat-label">Remaining</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`demo-step ${demoStep === 1 ? 'active' : ''}`} data-step="2">
                      <div className="demo-sidebar">
                        <div className="demo-logo">M</div>
                        <div className="demo-nav-item">Dashboard</div>
                        <div className="demo-nav-item active">My Modules</div>
                        <div className="demo-nav-item">Pitch Coach</div>
                        <div className="demo-nav-item">Documents</div>
                      </div>
                      <div className="demo-main">
                        <div className="demo-modules">
                          <h3>Your Learning Path</h3>
                          <div className="module-list">
                            <div className="module-item completed">
                              <svg className="module-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                              <span className="module-name">Business Model Canvas</span>
                            </div>
                            <div className="module-item completed">
                              <svg className="module-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                              <span className="module-name">Market Research</span>
                            </div>
                            <div className="module-item active">
                              <svg className="module-progress" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                              </svg>
                              <span className="module-name">Financial Projections</span>
                            </div>
                            <div className="module-item">
                              <svg className="module-lock" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                              </svg>
                              <span className="module-name">Pitch Deck Design</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`demo-step ${demoStep === 2 ? 'active' : ''}`} data-step="3">
                      <div className="demo-sidebar">
                        <div className="demo-logo">M</div>
                        <div className="demo-nav-item">Dashboard</div>
                        <div className="demo-nav-item">My Modules</div>
                        <div className="demo-nav-item active">Pitch Coach</div>
                        <div className="demo-nav-item">Documents</div>
                      </div>
                      <div className="demo-main">
                        <div className="demo-pitch">
                          <h3>AI Pitch Coach</h3>
                          <div className="chat-container">
                            <div className="chat-message ai">
                              <span className="chat-label">AI Investor:</span>
                              <p>What's your customer acquisition strategy?</p>
                            </div>
                            <div className="chat-message user">
                              <span className="chat-label">You:</span>
                              <p>We're focusing on social media marketing and influencer partnerships...</p>
                            </div>
                            <div className="chat-message ai">
                              <span className="chat-label">AI Investor:</span>
                              <p>Good start. How do you measure ROI on these channels?</p>
                            </div>
                          </div>
                          <div className="pitch-score">
                            <span className="score-label">Current Score:</span>
                            <span className="score-value">7.5/10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`demo-step ${demoStep === 3 ? 'active' : ''}`} data-step="4">
                      <div className="demo-sidebar">
                        <div className="demo-logo">M</div>
                        <div className="demo-nav-item">Dashboard</div>
                        <div className="demo-nav-item">My Modules</div>
                        <div className="demo-nav-item">Pitch Coach</div>
                        <div className="demo-nav-item active">Documents</div>
                      </div>
                      <div className="demo-main">
                        <div className="demo-docs">
                          <h3>Your Startup Brief</h3>
                          <div className="doc-preview">
                            <div className="doc-header">
                              <span className="doc-title">Startup Brief.pdf</span>
                              <span className="doc-status">Ready</span>
                            </div>
                            <div className="doc-content">
                              <p>Executive Summary...</p>
                              <p>Business Model...</p>
                              <p>Financial Projections...</p>
                              <p>Growth Strategy...</p>
                            </div>
                          </div>
                          <div className="doc-actions">
                            <button className="doc-btn download">Download PDF</button>
                            <button className="doc-btn share">Share with VCs</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="demo-steps">
                <div className={`demo-step-item ${demoStep === 0 ? 'active' : ''}`} data-step="1">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Describe Your Idea</h4>
                    <p>Start by entering your startup concept, category, and target market</p>
                  </div>
                </div>
                <div className={`demo-step-item ${demoStep === 1 ? 'active' : ''}`} data-step="2">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Complete Modules</h4>
                    <p>Work through 30 structured lessons with real deliverables</p>
                  </div>
                </div>
                <div className={`demo-step-item ${demoStep === 2 ? 'active' : ''}`} data-step="3">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>AI Pitch Coach</h4>
                    <p>Practice with our Claude-powered investor simulator</p>
                  </div>
                </div>
                <div className={`demo-step-item ${demoStep === 3 ? 'active' : ''}`} data-step="4">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Get Funded</h4>
                    <p>Your profile gets listed with our VC network for evaluation</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="demo-features">
              <div className="demo-feature">
                <svg className="feature-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                <h4>Track Progress</h4>
                <p>Visual dashboard showing your journey through each module</p>
              </div>
              <div className="demo-feature">
                <svg className="feature-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="M15 13a2 2 0 0 1 2 2"/>
                </svg>
                <h4>AI Guidance</h4>
                <p>Claude-powered coaching that thinks like a real investor</p>
              </div>
              <div className="demo-feature">
                <svg className="feature-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                <h4>Generate Documents</h4>
                <p>Auto-generate pitch decks and business briefs</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <div className="bg-alt" id="features">
          <section className="ml-sec">
            <div className="rev">
              <div className="sec-tag"><div className="sec-tag-dot" />Why MindLaunch</div>
              <h2 className="sec-h2">Everything a founder needs.<br />Nothing they don't.</h2>
              <p className="sec-sub">We replaced the bloated accelerator model with a focused, AI-native curriculum.</p>
            </div>
            <div className="feat-grid">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="feat-card rev"
                  data-tilt
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="feat-glow" />
                  <div className={`feat-ico ${f.cls}`}>{f.ico}</div>
                  <h3 className="feat-h3">{f.t}</h3>
                  <p className="feat-p">{f.p}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── HOW IT WORKS — Scroll-driven 3D ── */}
        <div id="steps" ref={stepsSectionRef} className="steps-section">
          <div className="steps-sticky">
            {/* 3D canvas fills the sticky viewport */}
            <canvas ref={stepsCanvasRef} id="ml-steps-canvas" />

            {/* UI overlay */}
            <div className="steps-ui">
              <div className="steps-header">
                <div className="sec-tag" style={{ justifyContent:'center' }}>
                  <div className="sec-tag-dot" /> Process
                </div>
                <h2 className="sec-h2" style={{ textAlign:'center' }}>
                  Four steps to<br /><span className="grad-violet">investor-ready</span>
                </h2>
                <p className="sec-sub" style={{ margin:'0 auto', textAlign:'center' }}>
                  Scroll down to walk through each phase — the 3D scene lights up as you go.
                </p>
              </div>

              <div className="steps-grid">
                {steps.map((s, i) => (
                  <div
                    key={i}
                    className={`step-card${activeStep >= i ? ' lit' : ''}`}
                    onClick={() => {}}
                  >
                    <div className="step-card-line" />
                    <div className="step-n">{s.n}</div>
                    <h3 className="step-h">{s.t}</h3>
                    <p className="step-p">{s.p}</p>
                  </div>
                ))}
              </div>

              <div className="steps-progress">
                {steps.map((_, i) => (
                  <div key={i} className={`prog-dot${activeStep >= i ? ' active' : ''}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── PRICING ── */}
        <div className="bg-alt" id="pricing">
          <section className="ml-sec">
            <div className="rev">
              <div className="sec-tag"><div className="sec-tag-dot" />Pricing</div>
              <h2 className="sec-h2">Simple, honest pricing.</h2>
              <p className="sec-sub">No micro-transactions. One price unlocks everything. Cancel anytime.</p>
            </div>

            <div className="price-grid">
              {/* Free */}
              <div className="price-card rev" style={{ transitionDelay:'0ms' }}>
                <div><div className="p-name">Starter</div><div className="p-desc">Explore before you commit.</div></div>
                <div className="p-price">Free <small>/ forever</small></div>
                <div className="p-divider" />
                <div className="p-feats">
                  {['Module 1 unlocked','AI Pitch Coach chat','Basic PDF export','Startup profile'].map(f => (
                    <div className="p-feat" key={f}><div className="p-check ck-v"><Check /></div>{f}</div>
                  ))}
                </div>
                <a href="/register" className="btn-outline" style={{ justifyContent:'center', marginTop:'auto' }} data-hover>Start free</a>
              </div>

              {/* Monthly */}
              <div className="price-card rev" style={{ transitionDelay:'80ms' }}>
                <div><div className="p-name">Premium Monthly</div><div className="p-desc">Perfect for focused learning.</div></div>
                <div className="p-price">₹399 <small>/ month</small></div>
                <div className="p-divider" />
                <div className="p-feats">
                  {['All 30 modules unlocked','AI Pitch Coach + full reports','PDF & Word exports','Regional frameworks','Email support'].map(f => (
                    <div className="p-feat" key={f}><div className="p-check ck-v"><Check /></div>{f}</div>
                  ))}
                </div>
                <a href="/register" className="btn-primary" style={{ justifyContent:'center', marginTop:'auto' }} data-hover>Subscribe <IconArrow /></a>
              </div>

              {/* Yearly */}
              <div className="price-card hot rev" style={{ transitionDelay:'160ms' }}>
                <div className="hot-chip">⭐ Best value</div>
                <div><div className="p-name">Premium Yearly</div><div className="p-desc">Save 48% vs monthly.</div></div>
                <div className="p-price">₹2,499 <small>/ year</small></div>
                <div className="p-divider" />
                <div className="p-feats">
                  {['All 30 modules unlocked','AI Pitch Coach + full reports','PDF & Word exports','Regional frameworks','Priority support'].map(f => (
                    <div className="p-feat bright" key={f}><div className="p-check ck-g"><Check /></div>{f}</div>
                  ))}
                </div>
                <a href="/register" className="btn-gold" style={{ justifyContent:'center', marginTop:'auto' }} data-hover>Get full access <IconArrow /></a>
              </div>
            </div>
          </section>
        </div>

        {/* ── REGIONS ── */}
        <section className="ml-sec" id="regions">
          <div className="rev">
            <div className="sec-tag"><div className="sec-tag-dot" />Coverage</div>
            <h2 className="sec-h2">Nine global markets.</h2>
            <p className="sec-sub">Curriculum and templates adapted to your local market dynamics and regulations.</p>
          </div>
          <div className="reg-grid">
            {regions.map((r, i) => (
              <div className="reg-card rev" key={i} style={{ transitionDelay:`${i * 35}ms` }}>
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
                <a href="/register" className="btn-gold" data-hover>Start for free <IconArrow /></a>
                <a href="/register" className="btn-outline" data-hover>See demo</a>
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="ml-ftr">
          <div className="ml-ftr-in">
            <div>
              <a href="/" className="ml-logo" style={{ marginBottom:'.3rem', display:'inline-flex' }}>
                <div className="ml-logo-gem" style={{ width:28, height:28, fontSize:'.78rem' }}>M</div>
                Mind<span className="ml-logo-v">Launch</span>
              </a>
              <div className="ftr-copy">© 2026 MindLaunch. All rights reserved.</div>
            </div>
            <nav className="ftr-links">
              <a href="#" className="ftr-a">Privacy policy</a>
              <a href="#" className="ftr-a">Terms of service</a>
              <a href="#" className="ftr-a">Support</a>
            </nav>
          </div>
        </footer>

      </div>{/* ml-page */}
    </>
  );
};

export default LandingPage;