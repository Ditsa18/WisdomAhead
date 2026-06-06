import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // ← uncomment in your project

/* ─────────────────────────────────────────────────────────────────────────────
   INSTALLATION
   ─────────────────────────────────────────────────────────────────────────────
   No new npm packages needed — uses only React + react-router-dom (already
   installed).

   Add these two lines inside your index.html <head> (or index.css @import):

   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,700;12..96,800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;1,9..40,300&display=swap" rel="stylesheet">

   That's it. Drop this file in as a direct replacement for LandingPage.jsx.
───────────────────────────────────────────────────────────────────────────── */

/* ──────────────── ALL STYLES (scoped inside .ml-page) ──────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,700;12..96,800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;1,9..40,300&display=swap');

  :root {
    --ink:          #08080F;
    --ink-2:        #10101B;
    --ink-3:        #18182A;
    --surface:      #1A1A2E;
    --surface-2:    #222236;
    --violet:       #7C5CF5;
    --violet-dim:   rgba(124,92,245,.12);
    --violet-glow:  rgba(124,92,245,.4);
    --gold:         #F0A500;
    --gold-dim:     rgba(240,165,0,.12);
    --gold-glow:    rgba(240,165,0,.35);
    --emerald:      #10B981;
    --text:         #EEEDF5;
    --text-2:       #9896B2;
    --text-3:       #5A5872;
    --border:       rgba(255,255,255,.07);
    --border-2:     rgba(255,255,255,.13);
    --radius:       13px;
    --radius-lg:    20px;
    --ease:         cubic-bezier(.4,0,.2,1);
    --t:            .22s;
    --font-d:       'Bricolage Grotesque', sans-serif;
    --font-b:       'DM Sans', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ml-page {
    min-height: 100vh;
    background: var(--ink);
    color: var(--text);
    font-family: var(--font-b);
    overflow-x: hidden;
    position: relative;
  }

  /* noise grain */
  .ml-page::after {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.03'/%3E%3C/svg%3E");
    background-size: 200px 200px;
    pointer-events: none;
    z-index: 0;
  }

  /* ambient background orbs */
  .ml-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(100px);
    pointer-events: none;
    z-index: 0;
  }
  .ml-orb-1 {
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(124,92,245,.16) 0%, transparent 68%);
    top: -280px; left: -220px;
    animation: orbFloat 24s ease-in-out infinite alternate;
  }
  .ml-orb-2 {
    width: 550px; height: 550px;
    background: radial-gradient(circle, rgba(240,165,0,.1) 0%, transparent 68%);
    top: 25%; right: -180px;
    animation: orbFloat 18s ease-in-out infinite alternate-reverse;
  }
  .ml-orb-3 {
    width: 450px; height: 450px;
    background: radial-gradient(circle, rgba(124,92,245,.09) 0%, transparent 70%);
    bottom: 8%; left: 15%;
    animation: orbFloat 20s ease-in-out infinite alternate;
    animation-delay: -10s;
  }
  @keyframes orbFloat {
    0%   { transform: translate(0,0) scale(1); }
    50%  { transform: translate(25px,-18px) scale(1.04); }
    100% { transform: translate(-18px,25px) scale(.97); }
  }

  .ml-z { position: relative; z-index: 1; }

  /* ═══ HEADER ═══ */
  .ml-hdr-wrap {
    position: sticky; top: 0; z-index: 100;
    background: rgba(8,8,15,.68);
    backdrop-filter: blur(20px) saturate(160%);
    border-bottom: 1px solid var(--border);
    transition: background var(--t) var(--ease), box-shadow var(--t) var(--ease);
  }
  .ml-hdr-wrap.is-scrolled {
    background: rgba(8,8,15,.86);
    box-shadow: 0 1px 0 var(--border-2);
  }
  .ml-hdr {
    max-width: 1240px; margin: 0 auto;
    padding: 0 2rem; height: 66px;
    display: flex; align-items: center; justify-content: space-between;
  }

  .ml-logo {
    display: flex; align-items: center; gap: .55rem;
    text-decoration: none; color: var(--text);
    font-family: var(--font-d); font-weight: 800; font-size: 1.2rem; letter-spacing: -.5px;
  }
  .ml-logo-mark {
    width: 33px; height: 33px; border-radius: 9px;
    background: linear-gradient(135deg, #7C5CF5 0%, #5B3DD0 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: .9rem; font-weight: 900; color: #fff;
    box-shadow: 0 0 0 1px rgba(124,92,245,.4), 0 4px 14px rgba(124,92,245,.28);
    transition: box-shadow var(--t) var(--ease), transform var(--t) var(--ease);
    flex-shrink: 0;
  }
  .ml-logo:hover .ml-logo-mark {
    box-shadow: 0 0 0 1px rgba(124,92,245,.6), 0 6px 22px rgba(124,92,245,.45);
    transform: rotate(-5deg) scale(1.07);
  }
  .ml-logo-v { color: var(--violet); }

  .ml-nav { display: flex; align-items: center; gap: .6rem; }

  /* ─ buttons ─ */
  .b-ghost {
    padding: .42rem .95rem; border-radius: 8px;
    background: none; border: none; cursor: pointer;
    color: var(--text-2); font-family: var(--font-b); font-size: .88rem;
    text-decoration: none; display: inline-flex; align-items: center;
    transition: color var(--t), background var(--t);
  }
  .b-ghost:hover { color: var(--text); background: rgba(255,255,255,.06); }

  .b-vio {
    padding: .46rem 1.1rem; border-radius: 9px;
    background: linear-gradient(135deg, #7C5CF5 0%, #6144D8 100%);
    border: none; cursor: pointer; color: #fff;
    font-family: var(--font-b); font-size: .88rem; font-weight: 500;
    text-decoration: none; display: inline-flex; align-items: center; gap: .35rem;
    box-shadow: 0 0 0 1px rgba(124,92,245,.3), 0 4px 14px rgba(124,92,245,.24);
    transition: box-shadow var(--t), transform var(--t), filter var(--t);
  }
  .b-vio:hover {
    box-shadow: 0 0 0 1px rgba(124,92,245,.5), 0 6px 20px rgba(124,92,245,.4);
    transform: translateY(-1px); filter: brightness(1.08);
  }
  .b-vio:active { transform: none; filter: brightness(.97); }

  .b-gold {
    padding: .68rem 1.8rem; border-radius: 11px;
    background: linear-gradient(135deg, #F5B120 0%, #E09400 100%);
    border: none; cursor: pointer; color: #0B0B14;
    font-family: var(--font-d); font-size: 1rem; font-weight: 700; letter-spacing: -.2px;
    text-decoration: none; display: inline-flex; align-items: center; gap: .45rem;
    box-shadow: 0 0 0 1px rgba(240,165,0,.35), 0 6px 22px rgba(240,165,0,.32);
    transition: box-shadow var(--t), transform var(--t), filter var(--t);
  }
  .b-gold:hover {
    box-shadow: 0 0 0 1px rgba(240,165,0,.55), 0 8px 30px rgba(240,165,0,.45);
    transform: translateY(-2px); filter: brightness(1.06);
  }
  .b-gold:active { transform: none; }

  .b-out {
    padding: .68rem 1.8rem; border-radius: 11px;
    border: 1px solid rgba(124,92,245,.35);
    background: rgba(124,92,245,.07);
    cursor: pointer; color: var(--text);
    font-family: var(--font-d); font-size: 1rem; font-weight: 600; letter-spacing: -.2px;
    text-decoration: none; display: inline-flex; align-items: center; gap: .45rem;
    transition: border-color var(--t), background var(--t), transform var(--t);
  }
  .b-out:hover { border-color: rgba(124,92,245,.7); background: rgba(124,92,245,.14); transform: translateY(-1px); }

  /* ═══ HERO ═══ */
  .ml-hero {
    text-align: center; padding: 7rem 2rem 5rem;
    max-width: 920px; margin: 0 auto;
    display: flex; flex-direction: column; align-items: center; gap: 1.8rem;
  }

  .hero-pill {
    display: inline-flex; align-items: center; gap: .4rem;
    padding: .32rem .85rem; border-radius: 100px;
    border: 1px solid rgba(124,92,245,.28);
    background: rgba(124,92,245,.08);
    color: #C4B5FD; font-size: .8rem; font-weight: 500; letter-spacing: .2px;
    animation: fd .6s ease both;
  }
  .hero-pill-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--violet); box-shadow: 0 0 6px var(--violet);
    animation: blink 2s ease-in-out infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.35} }

  .hero-h1 {
    font-family: var(--font-d);
    font-size: clamp(2.7rem, 6.5vw, 4.6rem);
    font-weight: 800; letter-spacing: -2.5px; line-height: 1.06;
    animation: fd .6s .1s ease both;
  }
  .h1-vio {
    background: linear-gradient(135deg, #B8A2FA 0%, #7C5CF5 55%, #C4B5FD 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .h1-gold {
    background: linear-gradient(135deg, #FCD34D 0%, #F0A500 60%, #FDE68A 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .hero-sub {
    font-size: 1.1rem; color: var(--text-2); max-width: 580px;
    line-height: 1.72; font-weight: 300;
    animation: fd .6s .2s ease both;
  }
  .hero-acts { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; animation: fd .6s .3s ease both; }

  .hero-stats {
    display: flex; gap: 2.5rem; flex-wrap: wrap; justify-content: center;
    animation: fd .6s .4s ease both;
  }
  .hs-item { display: flex; flex-direction: column; align-items: center; gap: .12rem; }
  .hs-num  { font-family: var(--font-d); font-size: 1.55rem; font-weight: 800; letter-spacing: -1px; }
  .hs-lbl  { font-size: .74rem; color: var(--text-3); text-transform: uppercase; letter-spacing: .9px; }
  .hs-sep  { width: 1px; background: var(--border-2); align-self: stretch; margin: .25rem 0; }

  /* track preview strip */
  .hero-strip {
    width: 100%; max-width: 800px;
    border-radius: var(--radius-lg); padding: 1px;
    background: linear-gradient(135deg, rgba(124,92,245,.5) 0%, rgba(240,165,0,.28) 55%, rgba(124,92,245,.2) 100%);
    box-shadow: 0 28px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.03);
    animation: fd .8s .5s ease both;
  }
  .hero-strip-in {
    background: linear-gradient(160deg, #191330 0%, #13131f 100%);
    border-radius: calc(var(--radius-lg) - 1px);
    padding: 1.4rem 2rem;
    display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
  }
  .strip-lbl { color: var(--text-3); font-size: .78rem; white-space: nowrap; }
  .t-pill {
    padding: .28rem .7rem; border-radius: 100px;
    font-size: .76rem; font-weight: 500; display: inline-flex; align-items: center;
  }
  .tp-v { background: var(--violet-dim); color: #C4B5FD; border: 1px solid rgba(124,92,245,.2); }
  .tp-g { background: var(--gold-dim);   color: #FDE68A; border: 1px solid rgba(240,165,0,.2); }
  .tp-e { background: rgba(16,185,129,.08); color: #6EE7B7; border: 1px solid rgba(16,185,129,.2); }
  .live-dot {
    margin-left: auto; display: flex; align-items: center; gap: .4rem; flex-shrink: 0;
  }
  .live-dot-circle { width: 7px; height: 7px; border-radius: 50%; background: var(--emerald); box-shadow: 0 0 8px var(--emerald); animation: blink 2.5s ease-in-out infinite; }
  .live-dot-text { font-size: .76rem; color: var(--text-3); }

  @keyframes fd { from{opacity:0;transform:translateY(-14px)} to{opacity:1;transform:translateY(0)} }

  /* ═══ SECTIONS ═══ */
  .ml-sec { padding: 6.5rem 2rem; position: relative; }
  .ml-sec-in { max-width: 1200px; margin: 0 auto; }

  .sec-eyebrow {
    display: inline-flex; align-items: center; gap: .4rem;
    font-size: .73rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1.3px;
    color: var(--violet); margin-bottom: 1rem;
  }
  .sec-eyebrow::before { content: ''; display: inline-block; width: 16px; height: 1.5px; background: var(--violet); border-radius: 2px; }

  .sec-h2 {
    font-family: var(--font-d); font-size: clamp(1.9rem, 4vw, 2.75rem);
    font-weight: 800; letter-spacing: -1.5px; line-height: 1.1; margin-bottom: .85rem;
  }
  .sec-sub { color: var(--text-2); font-size: 1rem; max-width: 520px; line-height: 1.68; font-weight: 300; }

  .bg-stripe {
    background: linear-gradient(180deg, transparent 0%, rgba(22,22,40,.55) 18%, rgba(22,22,40,.55) 82%, transparent 100%);
    border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  }

  /* ═══ FEATURE CARDS ═══ */
  .feat-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(300px,1fr)); gap: 1.25rem; margin-top: 3.5rem; }

  .feat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 2rem;
    display: flex; flex-direction: column; gap: 1.2rem;
    transition: border-color var(--t) var(--ease), transform var(--t) var(--ease), box-shadow var(--t) var(--ease);
    position: relative; overflow: hidden; cursor: default;
  }
  .feat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(124,92,245,.7) 50%, transparent 100%);
    opacity: 0; transition: opacity var(--t) var(--ease);
  }
  .feat-card:hover { border-color: rgba(124,92,245,.3); transform: translateY(-5px); box-shadow: 0 22px 60px rgba(0,0,0,.32), 0 0 0 1px rgba(124,92,245,.1); }
  .feat-card:hover::before { opacity: 1; }

  .feat-ico {
    width: 48px; height: 48px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
    transition: transform var(--t) var(--ease);
  }
  .feat-card:hover .feat-ico { transform: scale(1.1) rotate(-5deg); }
  .fi-v { background: var(--violet-dim); border: 1px solid rgba(124,92,245,.2); color: #C4B5FD; }
  .fi-g { background: var(--gold-dim);   border: 1px solid rgba(240,165,0,.2);   color: #FDE68A; }
  .fi-e { background: rgba(16,185,129,.08); border: 1px solid rgba(16,185,129,.2); color: #6EE7B7; }

  .feat-h3 { font-family: var(--font-d); font-size: 1.12rem; font-weight: 700; letter-spacing: -.3px; }
  .feat-p  { color: var(--text-2); font-size: .9rem; line-height: 1.65; font-weight: 300; }

  /* ═══ STEPS ═══ */
  .steps-grid {
    display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
    gap: 1.5rem; margin-top: 3.5rem;
    position: relative;
  }
  
  .steps-grid::after {
    content: ''; position: absolute; top: 26px; left: 8%; right: 8%; height: 2px;
    background: linear-gradient(90deg, transparent, var(--border-2) 20%, var(--border-2) 80%, transparent);
    pointer-events: none;
    animation: lineGrow 1.2s var(--ease) forwards;
    animation-delay: 0.3s;
    opacity: 0;
  }

  @keyframes lineGrow {
    0% {
      opacity: 0;
      transform: scaleX(0);
      transform-origin: left center;
    }
    100% {
      opacity: 1;
      transform: scaleX(1);
      transform-origin: left center;
    }
  }

  .step-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1.75rem;
    display: flex; flex-direction: column; gap: .8rem;
    transition: border-color var(--t) var(--ease), transform var(--t) var(--ease), 
                box-shadow var(--t) var(--ease), background var(--t) var(--ease);
    position: relative;
    overflow: hidden;
    cursor: pointer;
    animation: stepSlideUp 0.6s var(--ease) backwards;
  }

  .step-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(124,92,245,.08) 0%, transparent 100%);
    opacity: 0; transition: opacity var(--t) var(--ease);
    pointer-events: none;
  }

  .step-card:nth-child(1) { animation-delay: 0.4s; }
  .step-card:nth-child(2) { animation-delay: 0.5s; }
  .step-card:nth-child(3) { animation-delay: 0.6s; }
  .step-card:nth-child(4) { animation-delay: 0.7s; }

  @keyframes stepSlideUp {
    from {
      opacity: 0;
      transform: translateY(28px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .step-card:hover {
    border-color: rgba(124,92,245,.5);
    transform: translateY(-8px);
    box-shadow: 0 24px 48px rgba(124,92,245,.15), 0 0 0 1px rgba(124,92,245,.2);
    background: linear-gradient(155deg, rgba(124,92,245,.05) 0%, var(--surface) 100%);
  }

  .step-card:hover::before {
    opacity: 1;
  }

  .step-n {
    width: 50px; height: 50px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(124,92,245,.15) 0%, rgba(124,92,245,.08) 100%);
    border: 2px solid rgba(124,92,245,.35);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-d); font-size: .95rem; font-weight: 800;
    color: #C4B5FD; flex-shrink: 0;
    box-shadow: 0 0 0 8px rgba(124,92,245,.06), inset 0 0 14px rgba(124,92,245,.1);
    transition: all var(--t) var(--ease);
    position: relative;
    z-index: 2;
  }

  .step-card:hover .step-n {
    background: linear-gradient(135deg, rgba(124,92,245,.3) 0%, rgba(124,92,245,.15) 100%);
    border-color: rgba(124,92,245,.7);
    box-shadow: 0 0 0 12px rgba(124,92,245,.12), 
                inset 0 0 14px rgba(124,92,245,.18),
                0 0 20px rgba(124,92,245,.25);
    transform: scale(1.15);
  }

  .step-h {
    font-family: var(--font-d); font-size: 1.05rem; font-weight: 700;
    letter-spacing: -.3px; transition: color var(--t) var(--ease);
    position: relative; z-index: 2;
  }

  .step-card:hover .step-h {
    color: #E0D5FF;
  }

  .step-p {
    color: var(--text-2); font-size: .87rem; line-height: 1.6; font-weight: 300;
    transition: color var(--t) var(--ease);
    position: relative; z-index: 2;
  }

  .step-card:hover .step-p {
    color: var(--text);
  }

  /* ═══ PRICING ═══ */
  .price-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 1.25rem; margin-top: 3.5rem; max-width: 1100px; }

  .price-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 2.25rem;
    display: flex; flex-direction: column; gap: 1.5rem;
    transition: border-color var(--t), transform var(--t), box-shadow var(--t);
    position: relative; overflow: hidden;
  }
  .price-card:hover { transform: translateY(-4px); box-shadow: 0 24px 60px rgba(0,0,0,.3); }
  .price-card.hot {
    border-color: rgba(240,165,0,.38);
    background: linear-gradient(155deg, rgba(240,165,0,.055) 0%, var(--surface) 55%);
  }
  .price-card.hot::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(240,165,0,.85) 50%, transparent 100%);
  }
  .price-card.hot:hover { border-color: rgba(240,165,0,.62); box-shadow: 0 24px 60px rgba(0,0,0,.3), 0 0 40px rgba(240,165,0,.1); }

  .hot-badge {
    position: absolute; top: 1.2rem; right: 1.2rem;
    padding: .22rem .6rem; border-radius: 100px;
    background: var(--gold-dim); border: 1px solid rgba(240,165,0,.28);
    color: #FDE68A; font-size: .7rem; font-weight: 700; letter-spacing: .5px; text-transform: uppercase;
  }

  .p-name { font-family: var(--font-d); font-size: 1.08rem; font-weight: 700; letter-spacing: -.3px; }
  .p-desc { color: var(--text-2); font-size: .86rem; font-weight: 300; margin-top: .22rem; }
  .p-price { font-family: var(--font-d); font-size: 3rem; font-weight: 800; letter-spacing: -2px; line-height: 1; }
  .p-price small { font-size: 1rem; color: var(--text-2); font-weight: 300; letter-spacing: 0; }
  .p-sep { height: 1px; background: var(--border); }
  .p-feats { display: flex; flex-direction: column; gap: .65rem; }
  .p-feat { display: flex; align-items: flex-start; gap: .55rem; font-size: .88rem; color: var(--text-2); font-weight: 300; }
  .p-feat.bright { color: var(--text); }
  .p-ck {
    width: 17px; height: 17px; border-radius: 50%; flex-shrink: 0; margin-top: 1px;
    display: flex; align-items: center; justify-content: center; font-size: .6rem; font-weight: 700;
  }
  .ck-v { background: var(--violet-dim); color: #C4B5FD; border: 1px solid rgba(124,92,245,.22); }
  .ck-g { background: var(--gold-dim);   color: #FDE68A; border: 1px solid rgba(240,165,0,.22); }

  /* ═══ REGIONS ═══ */
  .reg-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(195px,1fr)); gap: .9rem; margin-top: 3.5rem; }
  .reg-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1rem 1.2rem;
    display: flex; align-items: center; gap: .8rem;
    transition: border-color var(--t), background var(--t), transform var(--t);
    cursor: default;
  }
  .reg-card:hover { border-color: rgba(124,92,245,.28); background: var(--surface-2); transform: translateX(4px); }
  .reg-code {
    width: 36px; height: 36px; border-radius: 8px;
    background: var(--violet-dim); border: 1px solid rgba(124,92,245,.18);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-d); font-size: .7rem; font-weight: 800; color: #C4B5FD; letter-spacing: .4px;
    flex-shrink: 0;
    transition: background var(--t), box-shadow var(--t);
  }
  .reg-card:hover .reg-code { background: rgba(124,92,245,.2); box-shadow: 0 0 12px rgba(124,92,245,.2); }
  .reg-nm { font-size: .88rem; font-weight: 500; letter-spacing: -.15px; }

  /* ═══ CTA STRIP ═══ */
  .cta-wrap { max-width: 1200px; margin: 0 auto 6rem; padding: 0 2rem; }
  .cta-grad {
    border-radius: var(--radius-lg); padding: 1px;
    background: linear-gradient(135deg, rgba(124,92,245,.6) 0%, rgba(240,165,0,.38) 55%, rgba(124,92,245,.2) 100%);
    box-shadow: 0 0 80px rgba(124,92,245,.14);
  }
  .cta-in {
    background: linear-gradient(135deg, #1a1535 0%, #16162a 55%, #181628 100%);
    border-radius: calc(var(--radius-lg) - 1px);
    padding: 3.5rem 4rem;
    display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap;
  }
  .cta-h2 { font-family: var(--font-d); font-size: clamp(1.6rem,3vw,2.2rem); font-weight: 800; letter-spacing: -1px; line-height: 1.2; }
  .cta-p  { color: var(--text-2); font-size: .92rem; font-weight: 300; margin-top: .5rem; }
  .cta-acts { display: flex; gap: .9rem; flex-shrink: 0; flex-wrap: wrap; }

  /* ═══ FOOTER ═══ */
  .ml-ftr { border-top: 1px solid var(--border); padding: 3.5rem 2rem; background: rgba(5,5,12,.65); }
  .ml-ftr-in { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 2rem; }
  .ftr-links { display: flex; gap: 1.75rem; flex-wrap: wrap; }
  .ftr-a { color: var(--text-3); text-decoration: none; font-size: .86rem; transition: color var(--t); }
  .ftr-a:hover { color: var(--text-2); }
  .ftr-copy { color: var(--text-3); font-size: .8rem; margin-top: .35rem; }

  /* scroll reveal */
  .rev { opacity:0; transform:translateY(22px); transition: opacity .6s var(--ease), transform .6s var(--ease); }
  .rev.on  { opacity:1; transform:translateY(0); }

  @media (max-width:760px) {
    .hero-h1 { letter-spacing:-1.8px; }
    .steps-grid::after { display:none; }
    .cta-in { padding:2.5rem 1.75rem; }
    .hero-strip { display:none; }
    .hs-sep { display:none; }
    .hero-stats { gap:1.5rem; }
  }
`;

/* ─ micro SVG icons ─ */
const Ico = {
  Brain: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2a2.5 2.5 0 0 1 5 0"/><path d="M9.5 22a2.5 2.5 0 0 0 5 0"/>
      <path d="M9 3.5A6.5 6.5 0 0 0 9 20.5"/><path d="M15 3.5a6.5 6.5 0 0 1 0 17"/>
      <path d="M3 9.5a2.5 2.5 0 0 1 0 5"/><path d="M21 9.5a2.5 2.5 0 0 0 0 5"/>
    </svg>
  ),
  Book: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Map: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
      <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  ),
  Arrow: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  Spark: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17 5.8 21.3l2.4-7.4L2 9.4h7.6z"/>
    </svg>
  ),
  Check: () => <span style={{fontWeight:700,fontSize:'.65rem'}}>✓</span>,
};

/* ─ scroll reveal hook ─ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.rev');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useScrollHeader(ref) {
  useEffect(() => {
    const handler = () => ref.current?.classList.toggle('is-scrolled', window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [ref]);
}

/* ══════════════════════════════════════════════════════════════════════════ */
const LandingPage = () => {
  const navigate = useNavigate();
  // const { user } = useAuth();
  const user = null;
  const hdrRef = useRef(null);

  useReveal();
  useScrollHeader(hdrRef);

  const handleDemo = () => navigate(user ? '/dashboard' : '/register');

  const regions = [
    { name: 'United States',        code: 'US'  },
    { name: 'United Arab Emirates', code: 'UAE' },
    { name: 'Saudi Arabia',         code: 'SA'  },
    { name: 'Egypt',                code: 'EG'  },
    { name: 'Nigeria',              code: 'NG'  },
    { name: 'Kenya',                code: 'KE'  },
    { name: 'Jordan',               code: 'JO'  },
    { name: 'Qatar',                code: 'QA'  },
    { name: 'India',                code: 'IN'  },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="ml-page">
        <div className="ml-orb ml-orb-1" />
        <div className="ml-orb ml-orb-2" />
        <div className="ml-orb ml-orb-3" />

        <div className="ml-z">

          {/* ── HEADER ── */}
          <div className="ml-hdr-wrap" ref={hdrRef}>
            <header className="ml-hdr">
              <Link to="/" className="ml-logo">
                <div className="ml-logo-mark">M</div>
                Mind<span className="ml-logo-v">Launch</span>
              </Link>
              <nav className="ml-nav">
                {user ? (
                  <Link to="/dashboard" className="b-vio">Dashboard <Ico.Arrow /></Link>
                ) : (
                  <>
                    <Link to="/login" className="b-ghost">Log in</Link>
                    <Link to="/register" className="b-vio">Get started <Ico.Arrow /></Link>
                  </>
                )}
              </nav>
            </header>
          </div>

          {/* ── HERO ── */}
          <section className="ml-hero">
            <div className="hero-pill">
              <div className="hero-pill-dot" />
              <Ico.Spark /> Empowering global entrepreneurs
            </div>

            <h1 className="hero-h1">
              Launch your startup<br />
              with <span className="h1-vio">AI-guided</span> <span className="h1-gold">learning</span>
            </h1>

            <p className="hero-sub">
              30 structured modules across 5 tracks. A Claude-powered pitch coach that thinks like a VC. Built for founders in 8 global markets.
            </p>

            <div className="hero-acts">
              <Link to="/register" className="b-gold">Get started free <Ico.Arrow /></Link>
              <button onClick={handleDemo} className="b-out">Try demo</button>
            </div>

            <div className="hero-stats">
              <div className="hs-item"><span className="hs-num">30</span><span className="hs-lbl">Modules</span></div>
              <div className="hs-sep" />
              <div className="hs-item"><span className="hs-num">5</span><span className="hs-lbl">Tracks</span></div>
              <div className="hs-sep" />
              <div className="hs-item"><span className="hs-num">9</span><span className="hs-lbl">Regions</span></div>
              <div className="hs-sep" />
              <div className="hs-item"><span className="hs-num">AI</span><span className="hs-lbl">Coach</span></div>
            </div>

            <div className="hero-strip">
              <div className="hero-strip-in">
                <span className="strip-lbl">Your tracks</span>
                <div style={{display:'flex',gap:'.45rem',flexWrap:'wrap'}}>
                  <span className="t-pill tp-v">Foundations</span>
                  <span className="t-pill tp-g">Finance</span>
                  <span className="t-pill tp-e">Operations</span>
                  <span className="t-pill tp-v">Marketing</span>
                  <span className="t-pill tp-g">Fundraising</span>
                </div>
                <div className="live-dot">
                  <div className="live-dot-circle" />
                  <span className="live-dot-text">Claude API live</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── FEATURES ── */}
          <section className="ml-sec bg-stripe">
            <div className="ml-sec-in">
              <div className="rev">
                <div className="sec-eyebrow"><Ico.Spark /> Why MindLaunch</div>
                <h2 className="sec-h2">Everything a founder needs.<br />Nothing they don't.</h2>
                <p className="sec-sub">We replaced the bloated accelerator model with a focused, AI-native curriculum.</p>
              </div>
              <div className="feat-grid">
                {[
                  { icon: <Ico.Brain />, cls: 'fi-v', t: 'AI venture mentor',      p: 'Pitch Coach powered by Anthropic Claude. Mock Q&A, readiness scores across Clarity, Market Fit, and Value Prop. Feels like a ₹4 lakh coach.', d: 0   },
                  { icon: <Ico.Book />,  cls: 'fi-g', t: '30 structured modules',  p: 'Five key tracks — Foundations, Finance, Operations, Marketing, Fundraising. Each module ends with a real deliverable you can export.', d: 80  },
                  { icon: <Ico.Map />,   cls: 'fi-e', t: 'Built for your region',  p: 'Templates and coaching tuned to US, GCC (UAE, Saudi, Qatar), and key African ecosystems. Not generic advice painted over your reality.', d: 160 },
                ].map((f, i) => (
                  <div className="feat-card rev" key={i} style={{transitionDelay:`${f.d}ms`}}>
                    <div className={`feat-ico ${f.cls}`}>{f.icon}</div>
                    <h3 className="feat-h3">{f.t}</h3>
                    <p className="feat-p">{f.p}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section className="ml-sec">
            <div className="ml-sec-in">
              <div className="rev" style={{textAlign:'center'}}>
                <div className="sec-eyebrow" style={{justifyContent:'center'}}>Process</div>
                <h2 className="sec-h2" style={{textAlign:'center'}}>Four steps to investor-ready</h2>
                <p className="sec-sub" style={{margin:'0 auto'}}>From blank idea to a polished startup brief with real deliverables.</p>
              </div>
              <div className="steps-grid">
                {[
                  { n:'01', t:'Describe your idea',    p:'Brief your concept, pick category tiles and target market region.' },
                  { n:'02', t:'Complete each module',  p:'Structured lessons with deliverables you fill out — not just watch.' },
                  { n:'03', t:'Spar with Pitch Coach', p:'AI investor fires real questions. Weak spots get scored and rebuilt.' },
                  { n:'04', t:'Export your brief',     p:'One-click PDF or Word export of your full brief, ready for investors.' },
                ].map((s,i) => (
                  <div className="step-card rev" key={i} style={{transitionDelay:`${i*70}ms`}}>
                    <div className="step-n">{s.n}</div>
                    <h3 className="step-h">{s.t}</h3>
                    <p className="step-p">{s.p}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── PRICING ── */}
          <section className="ml-sec bg-stripe">
            <div className="ml-sec-in">
              <div className="rev">
                <div className="sec-eyebrow">Pricing</div>
                <h2 className="sec-h2">Simple, honest pricing.</h2>
                <p className="sec-sub">No per-module micro-transactions. One price unlocks everything.</p>
              </div>
              <div className="price-grid rev" style={{transitionDelay:'90ms'}}>
                {/* free */}
                <div className="price-card">
                  <div><div className="p-name">Starter</div><div className="p-desc">Explore before you commit.</div></div>
                  <div className="p-price">Free <small>/ forever</small></div>
                  <div className="p-sep" />
                  <div className="p-feats">
                    {['Module 1 unlocked','AI Pitch Coach chat','Basic PDF export','Startup profile'].map(f=>(
                      <div className="p-feat" key={f}><div className="p-ck ck-v"><Ico.Check /></div>{f}</div>
                    ))}
                  </div>
                  <Link to="/register" className="b-out" style={{justifyContent:'center',marginTop:'auto'}}>Start free</Link>
                </div>
                {/* monthly */}
                <div className="price-card">
                  <div><div className="p-name">Premium Monthly</div><div className="p-desc">Perfect for focused learning.</div></div>
                  <div className="p-price">₹399 <small>/ month</small></div>
                  <div className="p-sep" />
                  <div className="p-feats">
                    {['All 30 modules unlocked','AI Pitch Coach + full reports','PDF & Word document exports','Regional template frameworks','Email support'].map(f=>(
                      <div className="p-feat" key={f}><div className="p-ck ck-v"><Ico.Check /></div>{f}</div>
                    ))}
                  </div>
                  <Link to="/register" className="b-vio" style={{justifyContent:'center',marginTop:'auto'}}>Subscribe <Ico.Arrow /></Link>
                </div>
                {/* yearly */}
                <div className="price-card hot">
                  <div className="hot-badge">⭐ Best value</div>
                  <div><div className="p-name">Premium Yearly</div><div className="p-desc">Save 48% annually.</div></div>
                  <div className="p-price">₹2,499 <small>/ year</small></div>
                  <div className="p-sep" />
                  <div className="p-feats">
                    {['All 30 modules unlocked','AI Pitch Coach + full reports','PDF & Word document exports','Regional template frameworks','Priority support'].map(f=>(
                      <div className="p-feat bright" key={f}><div className="p-ck ck-g"><Ico.Check /></div>{f}</div>
                    ))}
                  </div>
                  <Link to="/register" className="b-gold" style={{justifyContent:'center',marginTop:'auto'}}>Get full access <Ico.Arrow /></Link>
                </div>
              </div>
            </div>
          </section>

          {/* ── REGIONS ── */}
          <section className="ml-sec">
            <div className="ml-sec-in">
              <div className="rev">
                <div className="sec-eyebrow">Coverage</div>
                <h2 className="sec-h2">Nine global markets.</h2>
                <p className="sec-sub">Curriculum and templates adapted to your specific local market dynamics and regulations.</p>
              </div>
              <div className="reg-grid">
                {regions.map((r,i)=>(
                  <div className="reg-card rev" key={i} style={{transitionDelay:`${i*35}ms`}}>
                    <div className="reg-code">{r.code}</div>
                    <span className="reg-nm">{r.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA STRIP ── */}
          <div className="cta-wrap rev">
            <div className="cta-grad">
              <div className="cta-in">
                <div>
                  <h2 className="cta-h2">Ready to build your startup?</h2>
                  <p className="cta-p">Join founders across 9 markets going from idea to investor-ready with MindLaunch.</p>
                </div>
                <div className="cta-acts">
                  <Link to="/register" className="b-gold">Start for free <Ico.Arrow /></Link>
                  <button onClick={handleDemo} className="b-out">See demo</button>
                </div>
              </div>
            </div>
          </div>

          {/* ── FOOTER ── */}
          <footer className="ml-ftr">
            <div className="ml-ftr-in">
              <div>
                <Link to="/" className="ml-logo" style={{marginBottom:'.35rem',display:'inline-flex'}}>
                  <div className="ml-logo-mark" style={{width:26,height:26,fontSize:'.82rem'}}>M</div>
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

        </div>{/* ml-z */}
      </div>{/* ml-page */}
    </>
  );
};

export default LandingPage;