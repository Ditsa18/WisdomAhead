import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import {
  Rocket,
  Brain,
  Bot,
  Globe,
  Sparkles,
  Target,
  ArrowRight,
  DollarSign,
  Users,
  BookOpen,
  Lightbulb,
  CirclePlay,
  Zap,
  Gem,
  Star,
  Eye,
  Fish,
  Trophy,
  FileText,
  Megaphone,
  Settings,
  Sprout,
  Heart,
  Award,
  Play,
  Mail,
  Check,
  ShoppingBag,
  Clock
} from "lucide-react";

/*
  MindLaunch Landing Page — Gen-Z Aesthetic
  ─ Soft pastel palette with vibrant accents
  ─ Glassmorphism, gradient meshes, playful animations
  ─ Bouncy interactions
*/

const injectFonts = () => {
  if (document.getElementById('ml-fonts')) return;
  const l = document.createElement('link');
  l.id = 'ml-fonts'; l.rel = 'stylesheet';
  l.href = '[fonts.googleapis.com](https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap)';
  document.head.appendChild(l);
};

/* ══════════════════════════════════════════════════════════════
   CSS — GEN-Z AESTHETIC
   Palette:
     --bg:        #FEFCF9  (warm cream)
     --bg2:       #FFFFFF  (pure white)
     --bg3:       #F8F6FF  (soft lavender tint)
     --ink:       #1A1625  (deep purple-black)
     --ink2:      #4A4458  (muted purple)
     --ink3:      #8B849B  (soft purple-gray)
     --lavender:  #A78BFA  (primary purple)
     --coral:     #FF6B9D  (vibrant pink-coral)
     --mint:      #6EE7B7  (fresh mint)
     --sky:       #7DD3FC  (bright sky blue)
     --peach:     #FBBF24  (warm yellow)
     --rose:      #FB7185  (soft rose)
══════════════════════════════════════════════════════════════ */
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;scroll-padding-top:80px}
:root{
  --bg:#FEFCF9;
  --bg2:#FFFFFF;
  --bg3:#F8F6FF;
  --bg4:#FFF5F8;
  --ink:#1A1625;
  --ink2:#4A4458;
  --ink3:#8B849B;
  --lavender:#A78BFA;
  --lavender-light:#DDD6FE;
  --coral:#FF6B9D;
  --coral-light:#FECDD3;
  --mint:#6EE7B7;
  --mint-light:#D1FAE5;
  --sky:#7DD3FC;
  --sky-light:#E0F2FE;
  --peach:#FBBF24;
  --peach-light:#FEF3C7;
  --rose:#FB7185;
  --border:rgba(167,139,250,.15);
  --border2:rgba(167,139,250,.25);
  --glass:rgba(255,255,255,.7);
  --glass-border:rgba(255,255,255,.5);
  --shadow-sm:0 2px 8px rgba(167,139,250,.08);
  --shadow-md:0 8px 24px rgba(167,139,250,.12);
  --shadow-lg:0 16px 48px rgba(167,139,250,.15);
  --shadow-xl:0 24px 64px rgba(167,139,250,.18);
  --shadow-glow:0 0 40px rgba(167,139,250,.25);
  --r:16px;--rl:24px;--rp:100px;
  --ease:cubic-bezier(.25,.46,.45,.94);
  --spring:cubic-bezier(.34,1.56,.64,1);
  --bounce:cubic-bezier(.68,-.55,.265,1.55);
  --font-d:'Space Grotesk',sans-serif;
  --font-b:'Inter',sans-serif;
  --font-m:'JetBrains Mono',monospace;
}
body{background:var(--bg);color:var(--ink);font-family:var(--font-b);overflow-x:hidden;cursor:auto}

/* ── GLOBAL KEYFRAMES ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-20px) rotate(5deg)}}
@keyframes float-slow{0%,100%{transform:translateY(0)}50%{transform:translateY(-15px)}}
@keyframes float-reverse{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(15px) rotate(-3deg)}}
@keyframes pulse-glow{0%,100%{box-shadow:0 0 20px rgba(167,139,250,.3)}50%{box-shadow:0 0 40px rgba(167,139,250,.5)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes rotate-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes wiggle{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
@keyframes bounce-soft{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes scale-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes gradient-shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes blob-morph{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}50%{border-radius:50% 60% 30% 60%/30% 40% 70% 60%}75%{border-radius:60% 40% 60% 40%/40% 30% 60% 50%}}
@keyframes slide-in-right{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
@keyframes pop-in{0%{opacity:0;transform:scale(.8) rotate(-5deg)}70%{transform:scale(1.1) rotate(2deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes typewriter{from{width:0}to{width:100%}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes confetti{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(-100vh) rotate(720deg);opacity:0}}

/* ── RESTORE DEFAULT CURSOR ── */
html,body,*{cursor:auto!important}

/* ── GRADIENT MESH BACKGROUND ── */
.ml-mesh-bg{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.mesh-blob{position:absolute;filter:blur(80px);opacity:.5;animation:blob-morph 20s ease-in-out infinite}
.blob-1{width:600px;height:600px;background:linear-gradient(135deg,rgba(167,139,250,.4),rgba(255,107,157,.3));top:-15%;left:-10%;animation-delay:0s}
.blob-2{width:500px;height:500px;background:linear-gradient(135deg,rgba(110,231,183,.3),rgba(125,211,252,.3));top:40%;right:-15%;animation-delay:-5s}
.blob-3{width:450px;height:450px;background:linear-gradient(135deg,rgba(251,191,36,.3),rgba(251,113,133,.3));bottom:-10%;left:30%;animation-delay:-10s}
.blob-4{width:350px;height:350px;background:linear-gradient(135deg,rgba(167,139,250,.25),rgba(110,231,183,.25));top:20%;left:50%;animation-delay:-15s}

/* ── FLOATING DECORATIONS ── */
.ml-floaties{position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden}
.floaty{position:absolute;font-size:2rem;opacity:.15;animation:float 8s ease-in-out infinite}
.f1{top:10%;left:5%;animation-delay:0s}
.f2{top:25%;right:8%;animation-delay:-2s;animation-name:float-reverse}
.f3{top:60%;left:3%;animation-delay:-4s}
.f4{top:75%;right:5%;animation-delay:-1s;animation-name:float-slow}
.f5{top:40%;left:85%;animation-delay:-3s}
.f6{top:85%;left:20%;animation-delay:-5s;animation-name:float-reverse}
.f7{top:15%;left:70%;animation-delay:-2.5s}
.f8{top:50%;left:92%;animation-delay:-4.5s;animation-name:float-slow}

.ml-page{position:relative;z-index:2;min-height:100vh}

/* HEADER */
.ml-hdr-wrap{position:fixed;top:0;left:0;right:0;z-index:500;padding:1rem 2rem;transition:all .4s var(--ease)}
.ml-hdr-wrap.solid{background:rgba(254,252,249,.85);backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);padding:.75rem 2rem;border-bottom:1px solid var(--border)}
.ml-hdr{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
.ml-logo{display:flex;align-items:center;gap:.5rem;text-decoration:none;color:var(--ink);font-family:var(--font-d);font-size:1.3rem;font-weight:700;letter-spacing:-.5px}
.ml-logo-icon{width:38px;height:38px;background:linear-gradient(135deg,var(--lavender),var(--coral));border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;color:#fff;box-shadow:0 4px 16px rgba(167,139,250,.35);transition:all .3s var(--spring);position:relative;overflow:hidden}
.ml-logo-icon::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--coral),var(--peach));opacity:0;transition:opacity .3s}
.ml-logo:hover .ml-logo-icon{transform:rotate(-10deg) scale(1.1);box-shadow:0 8px 28px rgba(255,107,157,.4)}
.ml-logo:hover .ml-logo-icon::before{opacity:1}
.ml-logo-icon span{position:relative;z-index:1}
.ml-logo-text{background:linear-gradient(135deg,var(--lavender),var(--coral));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.ml-nav-links{display:flex;align-items:center;gap:2.5rem}
.ml-nav-link{color:var(--ink3);font-size:.9rem;font-weight:500;cursor:pointer;text-decoration:none;transition:all .25s;position:relative;padding:.25rem 0}
.ml-nav-link::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--lavender),var(--coral));transform:scaleX(0);transform-origin:right;transition:transform .3s var(--ease)}
.ml-nav-link:hover{color:var(--ink)}
.ml-nav-link:hover::after{transform:scaleX(1);transform-origin:left}
.ml-hdr-btns{display:flex;align-items:center;gap:.75rem}
.ml-hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:8px}
.ml-hamburger span{width:24px;height:2.5px;background:linear-gradient(90deg,var(--lavender),var(--coral));border-radius:2px;transition:all .3s var(--ease)}
.ml-hamburger.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}
.ml-hamburger.open span:nth-child(2){opacity:0}
.ml-hamburger.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}
.ml-mobile-overlay{position:fixed;inset:0;background:rgba(26,22,37,.3);backdrop-filter:blur(8px);z-index:498;opacity:0;transition:opacity .3s}
.ml-mobile-menu{position:fixed;top:0;right:0;width:300px;height:100vh;background:var(--glass);backdrop-filter:blur(24px);border-left:1px solid var(--glass-border);z-index:499;padding:5rem 2rem 2rem;flex-direction:column;gap:1.25rem;transform:translateX(100%);transition:transform .3s var(--ease)}
.ml-mobile-menu.open{transform:translateX(0)}
.ml-mobile-menu .ml-nav-link{display:block;padding:1rem 0;font-size:1.1rem;border-bottom:1px solid var(--border)}
@media(max-width:768px){.ml-nav-links{display:none}.ml-hdr-btns.dk{display:none}.ml-hamburger{display:flex}}

/* BUTTONS */
.btn-ghost{padding:.5rem 1.25rem;border-radius:var(--rp);background:transparent;border:2px solid var(--border2);cursor:pointer;color:var(--ink2);font-family:var(--font-b);font-size:.9rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:.4rem;transition:all .25s var(--ease)}
.btn-ghost:hover{border-color:var(--lavender);color:var(--lavender);background:rgba(167,139,250,.05)}
.btn-primary{padding:.6rem 1.5rem;border-radius:var(--rp);background:linear-gradient(135deg,var(--lavender),var(--coral));border:none;cursor:pointer;color:#fff;font-family:var(--font-b);font-size:.9rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:.5rem;box-shadow:0 4px 16px rgba(167,139,250,.3);transition:all .25s var(--spring);position:relative;overflow:hidden}
.btn-primary::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--coral),var(--peach));opacity:0;transition:opacity .3s}
.btn-primary span,.btn-primary svg{position:relative;z-index:1}
.btn-primary:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 8px 28px rgba(255,107,157,.4)}
.btn-primary:hover::before{opacity:1}
.btn-hero{padding:.85rem 2.2rem;border-radius:var(--rp);background:linear-gradient(135deg,var(--lavender),var(--coral),var(--peach));background-size:200% 200%;animation:gradient-shift 4s ease infinite;border:none;cursor:pointer;color:#fff;font-family:var(--font-d);font-size:1.1rem;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:.6rem;box-shadow:0 8px 32px rgba(167,139,250,.35);transition:all .3s var(--spring);position:relative}
.btn-hero:hover{transform:translateY(-4px) scale(1.03);box-shadow:0 12px 40px rgba(255,107,157,.45)}
.btn-outline-hero{padding:.85rem 2.2rem;border-radius:var(--rp);background:var(--glass);backdrop-filter:blur(12px);border:2px solid var(--border2);cursor:pointer;color:var(--ink);font-family:var(--font-d);font-size:1.1rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:.6rem;box-shadow:var(--shadow-md);transition:all .25s var(--ease)}
.btn-outline-hero:hover{border-color:var(--lavender);background:rgba(167,139,250,.08);transform:translateY(-2px);box-shadow:var(--shadow-lg)}

/* SECTION UTILS */
.ml-sec{padding:7rem 2.5rem;position:relative;max-width:1200px;margin:0 auto}
@media(max-width:768px){.ml-sec{padding:5rem 1.5rem}}
.bg-glass{background:linear-gradient(180deg,rgba(248,246,255,.8) 0%,rgba(255,245,248,.6) 100%);backdrop-filter:blur(40px);border-top:1px solid var(--glass-border);border-bottom:1px solid var(--glass-border)}
.sec-tag{display:inline-flex;align-items:center;gap:.6rem;padding:.4rem 1rem;border-radius:var(--rp);background:linear-gradient(135deg,rgba(167,139,250,.1),rgba(255,107,157,.08));border:1px solid rgba(167,139,250,.2);color:var(--lavender);font-family:var(--font-m);font-size:.75rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1.5rem;animation:pop-in .5s var(--spring) both}
.sec-tag-emoji{font-size:1rem;animation:wiggle 2s ease-in-out infinite}
.sec-h2{font-family:var(--font-d);font-size:clamp(2rem,5vw,3.5rem);font-weight:700;letter-spacing:-2px;line-height:1.1;margin-bottom:1rem;color:var(--ink)}
.sec-sub{color:var(--ink3);font-size:1.05rem;max-width:520px;line-height:1.75;font-weight:400}
.grad-text{background:linear-gradient(135deg,#7C3AED,#DB2777);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.grad-mint{background:linear-gradient(135deg,#059669,#0284C7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.grad-peach{background:linear-gradient(135deg,#D97706,#DB2777);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.rev{opacity:0;transform:translateY(30px);transition:opacity .7s var(--ease),transform .7s var(--ease)}
.rev.vis{opacity:1;transform:translateY(0)}

/* HERO */
.ml-hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:10rem 2rem 6rem;position:relative}
@media(max-width:580px){.ml-hero{padding:8rem 1.5rem 5rem}}
.hero-badge{display:inline-flex;align-items:center;gap:.6rem;padding:.45rem 1.1rem;border-radius:var(--rp);background:linear-gradient(135deg,rgba(110,231,183,.15),rgba(125,211,252,.12));border:1px solid rgba(110,231,183,.3);color:var(--mint);font-size:.8rem;font-weight:600;letter-spacing:.05em;margin-bottom:2.5rem;animation:pop-in .6s .1s var(--spring) both}
.hero-badge span{font-size:1.1rem;animation:bounce-soft 2s ease-in-out infinite}
.hero-h1{font-family:var(--font-d);font-size:clamp(2.5rem,8vw,5.5rem);font-weight:700;letter-spacing:-3px;line-height:1.05;margin-bottom:1.75rem;animation:fadeUp .8s .2s var(--ease) both;color:var(--ink);text-shadow:0 2px 20px rgba(26,22,37,.15),0 0 40px rgba(254,252,249,.6)}
@media(max-width:580px){.hero-h1{letter-spacing:-2px}}
.hero-h1 .line-2{display:block;margin-top:.1em}
.hero-p{font-size:1.15rem;color:var(--ink3);max-width:600px;line-height:1.8;margin:0 auto 3rem;font-weight:400;animation:fadeUp .8s .35s var(--ease) both}
.hero-p strong{color:var(--ink2);font-weight:600}

/* VC Banner */
.vc-banner{width:100%;max-width:720px;border-radius:var(--rl);overflow:hidden;margin-bottom:2.5rem;animation:fadeUp .8s .4s var(--ease) both;position:relative}
.vc-banner::before{content:'';position:absolute;inset:0;border-radius:var(--rl);padding:2px;background:linear-gradient(135deg,var(--lavender),var(--coral),var(--mint));-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
.vc-banner-in{background:var(--glass);backdrop-filter:blur(16px);border-radius:calc(var(--rl) - 2px);padding:1.75rem 2rem;display:flex;align-items:center;gap:1.5rem;text-align:left}
@media(max-width:580px){.vc-banner-in{flex-direction:column;text-align:center;padding:1.5rem}}
.vc-banner-icon{font-size:2.5rem;animation:float-slow 3s ease-in-out infinite}
.vc-banner-title{font-family:var(--font-d);font-size:1.15rem;font-weight:700;color:var(--ink);margin-bottom:.4rem}
.vc-banner-body{font-size:.9rem;color:var(--ink3);line-height:1.65}

.hero-acts{display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;margin-bottom:3.5rem;animation:fadeUp .8s .5s var(--ease) both}

/* Stats */
.hero-stats{display:flex;gap:0;flex-wrap:wrap;justify-content:center;background:var(--glass);backdrop-filter:blur(16px);border:1px solid var(--glass-border);border-radius:var(--rl);overflow:hidden;animation:fadeUp .8s .6s var(--ease) both;box-shadow:var(--shadow-lg)}
.hs-item{padding:1.25rem 2rem;border-right:1px solid var(--border);display:flex;flex-direction:column;align-items:center;gap:.25rem;transition:all .3s var(--ease)}
.hs-item:hover{background:rgba(167,139,250,.05)}
@media(max-width:600px){.hs-item{padding:1rem 1.5rem}}
.hs-item:last-child{border-right:none}
.hs-n{font-family:var(--font-d);font-size:1.8rem;font-weight:700;letter-spacing:-1px;background:linear-gradient(135deg,var(--lavender),var(--coral));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hs-l{font-size:.7rem;color:var(--ink3);text-transform:uppercase;letter-spacing:1px;font-weight:600}

/* Tracks */
.hero-tracks{width:100%;max-width:800px;background:var(--glass);backdrop-filter:blur(16px);border:1px solid var(--glass-border);border-radius:var(--rl);padding:1rem 1.75rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin-top:1.5rem;animation:fadeUp .8s .7s var(--ease) both;box-shadow:var(--shadow-md)}
@media(max-width:580px){.hero-tracks{padding:1rem 1.25rem;gap:.75rem}}
.trk-lbl{color:var(--ink3);font-size:.72rem;font-family:var(--font-m);white-space:nowrap;text-transform:uppercase;letter-spacing:.08em}
.trk-pills{display:flex;gap:.4rem;flex-wrap:wrap}
.trk-pill{padding:.3rem .75rem;border-radius:var(--rp);font-size:.75rem;font-weight:600;transition:all .25s var(--spring);cursor:default}
.trk-pill:hover{transform:translateY(-2px) scale(1.05)}
.tp1{background:rgba(167,139,250,.12);color:var(--lavender);border:1px solid rgba(167,139,250,.25)}
.tp2{background:rgba(251,191,36,.12);color:#D97706;border:1px solid rgba(251,191,36,.25)}
.tp3{background:rgba(110,231,183,.12);color:#059669;border:1px solid rgba(110,231,183,.25)}
.tp4{background:rgba(255,107,157,.1);color:var(--coral);border:1px solid rgba(255,107,157,.2)}
.trk-live{margin-left:auto;display:flex;align-items:center;gap:.5rem;flex-shrink:0;padding:.35rem .85rem;background:rgba(110,231,183,.1);border:1px solid rgba(110,231,183,.25);border-radius:var(--rp)}
.trk-live-dot{width:8px;height:8px;border-radius:50%;background:var(--mint);box-shadow:0 0 12px var(--mint);animation:pulse-glow 2s ease-in-out infinite}
.trk-live-lbl{font-size:.72rem;color:#059669;font-family:var(--font-m);font-weight:500}

/* Scroll Hint */
.scroll-hint{position:absolute;bottom:3rem;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:.6rem;opacity:.5;animation:fadeIn 1s 1.5s both}
.scroll-ring{width:40px;height:40px;border:2px solid var(--border2);border-radius:50%;display:flex;align-items:center;justify-content:center;animation:bounce-soft 2.5s ease-in-out infinite}
.scroll-txt{font-size:.68rem;color:var(--ink3);letter-spacing:.1em;text-transform:uppercase;font-family:var(--font-m)}

/* ══════════════════════════════════════
   DEMO SECTION
══════════════════════════════════════ */
.demo-section{padding:7rem 1.5rem;position:relative;overflow:hidden}
@media(max-width:768px){.demo-section{padding:5rem 1rem}}
.demo-container{max-width:1100px;margin:0 auto}
.demo-hdr{text-align:center;margin-bottom:3.5rem}

.demo-stage{display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:2rem;align-items:center;min-height:540px}
@media(max-width:900px){
  .demo-stage{grid-template-columns:1fr;gap:1.5rem;min-height:auto}
  .demo-stage .demo-left,.demo-stage .demo-right{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
  .demo-stage .demo-phone-wrap{order:-1}
}
@media(max-width:540px){
  .demo-stage .demo-left,.demo-stage .demo-right{grid-template-columns:1fr}
}

.demo-left,.demo-right{display:flex;flex-direction:column;gap:1rem}
.demo-trigger{display:flex;align-items:center;gap:1rem;padding:1rem 1.25rem;border-radius:var(--r);background:var(--glass);backdrop-filter:blur(12px);border:1px solid var(--glass-border);cursor:pointer;transition:all .3s var(--spring);position:relative;overflow:hidden;text-align:left;box-shadow:var(--shadow-sm)}
.demo-trigger::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,var(--lavender),var(--coral));transform:scaleY(0);transform-origin:bottom;transition:transform .3s var(--ease);border-radius:2px}
.demo-trigger:hover{transform:translateX(4px);border-color:rgba(167,139,250,.3)}
.demo-trigger.active{background:#fff;border-color:rgba(167,139,250,.4);box-shadow:var(--shadow-lg)}
.demo-trigger.active::before{transform:scaleY(1)}
.demo-trigger.done{border-color:rgba(110,231,183,.4);background:rgba(110,231,183,.05)}
.dt-num{width:38px;height:38px;border-radius:10px;background:var(--bg3);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-family:var(--font-m);font-size:.8rem;font-weight:500;color:var(--ink3);flex-shrink:0;transition:all .3s var(--spring)}
.demo-trigger.active .dt-num{background:linear-gradient(135deg,var(--lavender),var(--coral));border-color:transparent;color:#fff;transform:scale(1.1)}
.demo-trigger.done .dt-num{background:linear-gradient(135deg,var(--mint),var(--sky));border-color:transparent;color:#fff}
.dt-content{flex:1;min-width:0}
.dt-label{font-family:var(--font-d);font-size:.95rem;font-weight:600;color:var(--ink);margin-bottom:.15rem;display:flex;align-items:center;gap:.4rem}
.dt-emoji{font-size:1rem}
.dt-sub{font-size:.78rem;color:var(--ink3);line-height:1.45}

/* PHONE */
.demo-phone-wrap{position:relative;display:flex;align-items:center;justify-content:center}
.demo-phone{
  width:270px;
  background:linear-gradient(180deg,#FEFCF9,#F8F6FF);
  border:1px solid rgba(167,139,250,.2);
  border-radius:40px;
  overflow:hidden;
  box-shadow:0 0 0 8px rgba(167,139,250,.08),var(--shadow-xl);
  position:relative;
  isolation:isolate;
}
@media(max-width:540px){.demo-phone{width:240px}}
.demo-phone::before{
  content:'';position:absolute;top:0;left:50%;
  transform:translateX(-50%);
  width:90px;height:26px;
  background:linear-gradient(180deg,#FEFCF9,#F8F6FF);
  border-radius:0 0 16px 16px;
  z-index:10;
  border:1px solid rgba(167,139,250,.15);
  border-top:none;
}
.demo-phone::after{
  content:'';position:absolute;top:8px;left:50%;
  transform:translateX(-50%);
  width:50px;height:5px;
  background:linear-gradient(90deg,var(--lavender),var(--coral));
  border-radius:3px;
  z-index:11;
  opacity:.6;
}
.phone-screen{
  height:520px;
  position:relative;
  overflow:hidden;
  padding-top:32px;
  background:linear-gradient(180deg,#FEFCF9 0%,#F8F6FF 50%,#FFF5F8 100%);
}
@media(max-width:540px){.phone-screen{height:460px}}

.demo-slide{
  position:absolute;
  top:0;left:0;right:0;bottom:0;
  padding-top:32px;
  opacity:0;
  transform:translateY(20px) scale(.96);
  transition:all .45s var(--ease);
  pointer-events:none;
  will-change:opacity,transform;
  z-index:1;
}
.demo-slide.active{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;z-index:2}
.demo-slide.exit{opacity:0;transform:translateY(-15px) scale(.95);z-index:1}

/* Demo slides progress */
.demo-progress{display:flex;justify-content:center;gap:.6rem;margin-top:2.5rem}
.demo-dot{width:8px;height:8px;border-radius:50%;background:var(--border2);cursor:pointer;transition:all .3s var(--spring)}
.demo-dot.active{width:28px;border-radius:4px;background:linear-gradient(90deg,var(--lavender),var(--coral));box-shadow:0 0 12px rgba(167,139,250,.5)}
.demo-dot:hover:not(.active){background:var(--lavender);transform:scale(1.2)}

/* ── SLIDE 1 ── */
.s1-scene{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.25rem;padding:1.25rem}
.s1-illustration{width:180px;height:160px;position:relative}
.s1-caption{font-family:var(--font-d);font-size:.85rem;font-weight:600;color:var(--ink2);text-align:center}
.s1-caption span{background:linear-gradient(135deg,var(--lavender),var(--coral));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.s1-next-hint{padding:.35rem .85rem;border-radius:var(--rp);background:linear-gradient(135deg,rgba(167,139,250,.1),rgba(255,107,157,.08));border:1px solid rgba(167,139,250,.2);color:var(--lavender);font-size:.7rem;font-family:var(--font-m)}

/* ── SLIDE 2 ── */
.s2-scene{width:100%;height:100%;display:flex;flex-direction:column;padding:1rem;gap:.7rem}
.s2-app-bar{display:flex;align-items:center;gap:.55rem;padding:.5rem .75rem;background:linear-gradient(135deg,rgba(167,139,250,.08),rgba(255,107,157,.05));border:1px solid rgba(167,139,250,.15);border-radius:12px}
.s2-app-logo{width:24px;height:24px;background:linear-gradient(135deg,var(--lavender),var(--coral));border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:#fff}
.s2-app-name{font-family:var(--font-d);font-size:.8rem;font-weight:700;background:linear-gradient(135deg,var(--lavender),var(--coral));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.s2-prompt-box{background:#fff;border:1px solid var(--border);border-radius:12px;padding:.7rem .85rem;box-shadow:var(--shadow-sm)}
.s2-prompt-label{font-size:.62rem;color:var(--ink3);font-family:var(--font-m);margin-bottom:.35rem;text-transform:uppercase;letter-spacing:.08em}
.s2-typed{font-family:var(--font-d);font-size:.95rem;font-weight:600;background:linear-gradient(135deg,var(--lavender),var(--coral));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;min-height:1.3em}
.s2-typed-placeholder{opacity:.35;background:none;-webkit-text-fill-color:var(--ink3)}
.s2-cursor{display:inline-block;width:2px;height:1em;background:linear-gradient(180deg,var(--lavender),var(--coral));margin-left:2px;animation:blink .7s step-end infinite;vertical-align:middle}
.s2-tracks-label{font-size:.65rem;color:var(--ink3);font-family:var(--font-m);text-transform:uppercase;letter-spacing:.08em}
.s2-track-chips{display:flex;flex-wrap:wrap;gap:.35rem}
.s2-chip{padding:.25rem .6rem;border-radius:var(--rp);font-size:.65rem;font-weight:600;transition:all .2s var(--spring)}
.s2-chip-v{background:rgba(167,139,250,.1);color:var(--lavender);border:1px solid rgba(167,139,250,.25)}
.s2-chip-g{background:rgba(251,191,36,.1);color:#D97706;border:1px solid rgba(251,191,36,.25)}
.s2-chip-e{background:rgba(110,231,183,.1);color:#059669;border:1px solid rgba(110,231,183,.25)}
.s2-cta{width:100%;padding:.55rem;border-radius:10px;background:linear-gradient(135deg,var(--lavender),var(--coral));border:none;color:#fff;font-family:var(--font-d);font-size:.75rem;font-weight:700;display:flex;align-items:center;justify-content:center;gap:.4rem;box-shadow:0 4px 16px rgba(167,139,250,.3);margin-top:auto;cursor:pointer;transition:all .25s var(--spring)}
.s2-cta:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(255,107,157,.4)}

/* ── SLIDE 3 ── */
.s3-scene{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:.9rem;gap:.6rem;overflow:hidden}
.s3-bag-stage{position:relative;width:140px;height:120px;flex-shrink:0}
.s3-coach-panel{width:100%;flex:1;background:#fff;border:1px solid var(--border);border-radius:14px;padding:.7rem .8rem;display:flex;flex-direction:column;gap:.5rem;overflow:hidden;box-shadow:var(--shadow-md)}
.s3-coach-hdr{display:flex;align-items:center;gap:.5rem}
.s3-coach-avatar{width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,var(--lavender),var(--coral));display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.8rem}
.s3-coach-name{font-family:var(--font-d);font-size:.75rem;font-weight:700;color:var(--ink)}
.s3-coach-status{font-size:.6rem;color:var(--mint);font-family:var(--font-m);display:flex;align-items:center;gap:.3rem}
.s3-coach-status::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--mint);box-shadow:0 0 6px var(--mint)}
.s3-chat{display:flex;flex-direction:column;gap:.4rem;flex:1;overflow:hidden}
.s3-bubble{padding:.4rem .55rem;border-radius:10px;font-size:.68rem;line-height:1.5;max-width:92%}
.s3-bubble.ai{background:linear-gradient(135deg,rgba(167,139,250,.08),rgba(255,107,157,.05));border:1px solid rgba(167,139,250,.15);align-self:flex-start;border-radius:10px 10px 10px 3px}
.s3-bubble.user{background:linear-gradient(135deg,rgba(251,191,36,.08),rgba(255,107,157,.05));border:1px solid rgba(251,191,36,.15);align-self:flex-end;text-align:right;border-radius:10px 10px 3px 10px}
.s3-bubble-who{display:block;font-size:.55rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.15rem}
.s3-bubble.ai .s3-bubble-who{color:var(--lavender)}
.s3-bubble.user .s3-bubble-who{color:#D97706}
.s3-score{display:flex;align-items:center;gap:.45rem;padding:.4rem .55rem;background:linear-gradient(135deg,rgba(110,231,183,.08),rgba(125,211,252,.05));border:1px solid rgba(110,231,183,.2);border-radius:8px}
.s3-score-lbl{font-size:.6rem;color:var(--ink3)}
.s3-score-bar{flex:1;height:4px;background:var(--bg3);border-radius:2px;overflow:hidden}
.s3-score-fill{height:100%;background:linear-gradient(90deg,var(--mint),var(--sky));border-radius:2px;transition:width 1.2s var(--ease)}
.s3-score-val{font-family:var(--font-d);font-size:.8rem;font-weight:700;color:#059669}

/* ── SLIDE 4 ── */
.s4-scene{width:100%;height:100%;display:flex;flex-direction:column;padding:.95rem;gap:.55rem;overflow:hidden}
.s4-title{font-family:var(--font-d);font-size:.9rem;font-weight:700;color:var(--ink);text-align:center;display:flex;align-items:center;justify-content:center;gap:.4rem}
.s4-sub{font-size:.65rem;color:var(--mint);text-align:center;font-family:var(--font-m)}
.s4-net-stage{position:relative;width:100%;height:130px;flex-shrink:0;overflow:hidden}
.s4-vc-list{display:flex;flex-direction:column;gap:.4rem;flex:1;overflow:hidden}
.s4-vc-row{display:flex;align-items:center;gap:.55rem;padding:.45rem .6rem;border-radius:10px;background:#fff;border:1px solid var(--border);transform:translateX(40px);opacity:0;transition:all .5s var(--spring);box-shadow:var(--shadow-sm)}
.s4-vc-row.in{transform:translateX(0);opacity:1}
.s4-vc-dot{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.9rem}
.s4-vc-info{flex:1;min-width:0}
.s4-vc-name{font-family:var(--font-d);font-size:.72rem;font-weight:700;color:var(--ink)}
.s4-vc-firm{font-size:.6rem;color:var(--ink3)}
.s4-badge{font-size:.58rem;padding:.15rem .45rem;border-radius:var(--rp);font-family:var(--font-m);white-space:nowrap}
.s4-badge.match{color:#059669;border:1px solid rgba(110,231,183,.35);background:rgba(110,231,183,.1)}
.s4-badge.rev{color:#D97706;border:1px solid rgba(251,191,36,.35);background:rgba(251,191,36,.1)}
.s4-notify{display:flex;align-items:center;gap:.45rem;padding:.5rem .6rem;border-radius:10px;background:linear-gradient(135deg,rgba(251,191,36,.08),rgba(255,107,157,.05));border:1px solid rgba(251,191,36,.25);font-size:.65rem;color:var(--ink2);transform:translateY(12px);opacity:0;transition:all .5s .8s var(--spring);box-shadow:var(--shadow-sm)}
.s4-notify.in{transform:translateY(0);opacity:1}
.s4-notify strong{color:#D97706}

/* FEATURES */
.feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.25rem;margin-top:3.5rem}
@media(max-width:600px){.feat-grid{grid-template-columns:1fr}}
.feat-card{background:var(--glass);backdrop-filter:blur(16px);border:1px solid var(--glass-border);border-radius:var(--rl);padding:2.25rem;display:flex;flex-direction:column;gap:1.25rem;position:relative;overflow:hidden;transition:all .35s var(--spring);cursor:default;box-shadow:var(--shadow-md)}
.feat-glow{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--lavender) 30%,var(--coral) 70%,transparent);opacity:0;transition:opacity .3s}
.feat-card:hover{transform:translateY(-8px) scale(1.01);box-shadow:var(--shadow-xl),0 0 40px rgba(167,139,250,.12)}
.feat-card:hover .feat-glow{opacity:1}
.feat-ico{width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;transition:all .35s var(--spring)}
.feat-card:hover .feat-ico{transform:scale(1.15) rotate(-8deg)}
.fi-v{background:linear-gradient(135deg,rgba(167,139,250,.15),rgba(255,107,157,.1));border:1px solid rgba(167,139,250,.2);box-shadow:0 4px 20px rgba(167,139,250,.15)}
.fi-g{background:linear-gradient(135deg,rgba(251,191,36,.15),rgba(255,107,157,.1));border:1px solid rgba(251,191,36,.2);box-shadow:0 4px 20px rgba(251,191,36,.15)}
.fi-e{background:linear-gradient(135deg,rgba(110,231,183,.15),rgba(125,211,252,.1));border:1px solid rgba(110,231,183,.2);box-shadow:0 4px 20px rgba(110,231,183,.15)}
.feat-h3{font-family:var(--font-d);font-size:1.2rem;font-weight:700;letter-spacing:-.3px;color:var(--ink)}
.feat-p{color:var(--ink3);font-size:.92rem;line-height:1.72}

/* STEPS */
.steps-section{
    position:relative;
    min-height:350vh;
}

.steps-sticky{
    position:sticky;
    top:0;
    height:100vh;
    overflow:hidden;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:0 1rem;
}

.steps-bg-gradient{
    position:absolute;
    inset:0;
    background:linear-gradient(
        180deg,
        var(--bg) 0%,
        var(--bg3) 50%,
        var(--bg4) 100%
    );
}

#ml-steps-canvas{
    position:absolute;
    inset:0;
    width:100%;
    height:100%;
    opacity:.7;
}

.steps-ui{
    position:relative;
    z-index:10;
    width:100%;
    max-width:1100px;
    padding:0 2rem;
    display:flex;
    flex-direction:column;
    align-items:center;
    box-sizing:border-box;
}

.steps-hdr{
    text-align:center;
    margin-bottom:2.5rem;
}

.steps-grid{
    width:100%;
    display:grid;
    grid-template-columns:repeat(4,minmax(0,1fr));
    gap:1rem;
}

.step-card{
    background:var(--glass);
    backdrop-filter:blur(16px);
    border:1px solid var(--glass-border);
    border-radius:var(--r);
    padding:1.5rem;
    display:flex;
    flex-direction:column;
    gap:.75rem;
    min-height:190px;
    position:relative;
    overflow:hidden;
    box-shadow:var(--shadow-sm);
    transition:all .45s var(--spring);

    opacity:.45;
    transform:translateY(10px) scale(.97);
}

.step-card.lit{
    opacity:1;
    transform:translateY(-5px) scale(1.02);
    border-color:rgba(167,139,250,.35);
    background:#fff;
    box-shadow:var(--shadow-lg);
}

.step-card-line{
    position:absolute;
    top:0;
    left:0;
    right:0;
    height:3px;
    background:linear-gradient(90deg,var(--lavender),var(--coral));
    transform:scaleX(0);
    transform-origin:left;
    transition:transform .6s var(--ease);
}

.step-card.lit .step-card-line{
    transform:scaleX(1);
}

.step-n{
    width:44px;
    height:44px;
    border-radius:12px;
    background:var(--bg3);
    border:1px solid var(--border);
    display:flex;
    align-items:center;
    justify-content:center;
    font-family:var(--font-m);
    font-size:.8rem;
    font-weight:500;
    color:var(--ink3);
    transition:.4s;
}

.step-card.lit .step-n{
    background:linear-gradient(135deg,var(--lavender),var(--coral));
    color:#fff;
    border:none;
}

.step-h{
    font-family:var(--font-d);
    font-size:1rem;
    font-weight:700;
}

.step-p{
    color:var(--ink3);
    font-size:.85rem;
    line-height:1.6;
}

.steps-progress{
    display:flex;
    gap:.5rem;
    margin-top:1.75rem;
}

.prog-dot{
    width:8px;
    height:8px;
    border-radius:50%;
    background:var(--border2);
    transition:.3s;
}

.prog-dot.active{
    background:linear-gradient(135deg,var(--lavender),var(--coral));
}

/* ---------------- MOBILE FIX ---------------- */

@media (max-width:900px){

    .steps-grid{
        grid-template-columns:repeat(2,1fr);
    }

}

@media (max-width:600px){

    .steps-section{
        min-height:auto;
    }

    .steps-sticky{
        position:relative;
        height:auto;
        overflow:visible;
        padding:5rem 1rem;
    }

    #ml-steps-canvas{
        display:none;
    }

    .steps-ui{
        padding:0;
    }

    .steps-grid{
        grid-template-columns:1fr;
        gap:1rem;
    }

    .steps-progress{
        display:none;
    }

    .step-card{
        opacity:1;
        transform:none;
        min-height:auto;
    }

    .step-card.lit{
        transform:none;
    }

}
    
/* PRICING */
.price-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem;margin-top:3.5rem}
@media(max-width:600px){.price-grid{grid-template-columns:1fr}}
.price-card{background:var(--glass);backdrop-filter:blur(16px);border:1px solid var(--glass-border);border-radius:var(--rl);padding:2.25rem;display:flex;flex-direction:column;gap:1.5rem;transition:all .35s var(--spring);position:relative;overflow:hidden;box-shadow:var(--shadow-md)}
.price-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-xl)}
.price-card.hot{background:linear-gradient(145deg,rgba(167,139,250,.08),rgba(255,107,157,.05),var(--bg2));border-color:rgba(167,139,250,.3)}
.price-card.hot::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--lavender),var(--coral),var(--peach))}
.price-card.hot:hover{box-shadow:var(--shadow-xl),var(--shadow-glow)}
.hot-chip{position:absolute;top:1.25rem;right:1.25rem;padding:.25rem .7rem;border-radius:var(--rp);background:linear-gradient(135deg,var(--lavender),var(--coral));color:#fff;font-size:.7rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;box-shadow:0 2px 8px rgba(167,139,250,.3)}
.p-name{font-family:var(--font-d);font-size:1.1rem;font-weight:700;color:var(--ink)}
.p-desc{color:var(--ink3);font-size:.85rem;margin-top:.2rem}
.p-price{font-family:var(--font-d);font-size:2.8rem;font-weight:700;letter-spacing:-2px;line-height:1;background:linear-gradient(135deg,var(--lavender),var(--coral));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.p-price small{font-size:.95rem;font-weight:400;-webkit-text-fill-color:var(--ink3)}
.p-div{height:1px;background:var(--border)}
.p-feats{display:flex;flex-direction:column;gap:.65rem}
.p-feat{display:flex;align-items:flex-start;gap:.55rem;font-size:.88rem;color:var(--ink3)}
.p-feat.bright{color:var(--ink)}
.p-ck{width:20px;height:20px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.6rem;font-weight:800;margin-top:1px}
.ck-v{background:linear-gradient(135deg,rgba(167,139,250,.15),rgba(255,107,157,.1));color:var(--lavender);border:1px solid rgba(167,139,250,.25)}
.ck-g{background:linear-gradient(135deg,rgba(110,231,183,.15),rgba(125,211,252,.1));color:#059669;border:1px solid rgba(110,231,183,.25)}
.btn-p-outline{width:100%;padding:.6rem 1rem;border-radius:var(--rp);border:2px solid var(--border2);background:transparent;cursor:pointer;color:var(--ink2);font-family:var(--font-b);font-size:.9rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;margin-top:auto;transition:all .25s var(--ease)}
.btn-p-outline:hover{border-color:var(--lavender);color:var(--lavender);background:rgba(167,139,250,.05)}
.btn-p-primary{width:100%;padding:.6rem 1rem;border-radius:var(--rp);background:linear-gradient(135deg,var(--lavender),var(--coral));border:none;cursor:pointer;color:#fff;font-family:var(--font-b);font-size:.9rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:.35rem;box-shadow:0 4px 16px rgba(167,139,250,.25);margin-top:auto;transition:all .25s var(--spring)}
.btn-p-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(255,107,157,.35)}
.btn-p-gold{width:100%;padding:.6rem 1rem;border-radius:var(--rp);background:linear-gradient(135deg,var(--lavender),var(--coral),var(--peach));background-size:200% 200%;animation:gradient-shift 3s ease infinite;border:none;cursor:pointer;color:#fff;font-family:var(--font-b);font-size:.9rem;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:.35rem;box-shadow:0 4px 16px rgba(167,139,250,.3);margin-top:auto;transition:all .25s var(--spring)}
.btn-p-gold:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(255,107,157,.4)}

/* REGIONS */
.reg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.9rem;margin-top:3.5rem}
@media(max-width:480px){.reg-grid{grid-template-columns:1fr 1fr}}
.reg-card{background:var(--glass);backdrop-filter:blur(12px);border:1px solid var(--glass-border);border-radius:var(--r);padding:.95rem 1.1rem;display:flex;align-items:center;gap:.85rem;transition:all .3s var(--spring);cursor:default;box-shadow:var(--shadow-sm)}
.reg-card:hover{transform:translateX(6px) translateY(-2px);border-color:rgba(167,139,250,.3);background:#fff;box-shadow:var(--shadow-lg)}
.reg-code{width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,rgba(167,139,250,.1),rgba(255,107,157,.08));border:1px solid rgba(167,139,250,.2);display:flex;align-items:center;justify-content:center;font-family:var(--font-m);font-size:.7rem;font-weight:600;color:var(--lavender);flex-shrink:0;transition:all .3s var(--spring)}
.reg-card:hover .reg-code{background:linear-gradient(135deg,var(--lavender),var(--coral));color:#fff;transform:scale(1.1);box-shadow:0 4px 16px rgba(167,139,250,.3)}
.reg-nm{font-size:.9rem;font-weight:500;color:var(--ink2)}

/* CTA */
.cta-outer{padding:2rem 2.5rem 9rem;max-width:1200px;margin:0 auto}
@media(max-width:768px){.cta-outer{padding:2rem 1.5rem 6rem}}
.cta-wrap{border-radius:var(--rl);overflow:hidden;position:relative}
.cta-wrap::before{content:'';position:absolute;inset:0;border-radius:var(--rl);padding:2px;background:linear-gradient(135deg,var(--lavender),var(--coral),var(--mint),var(--peach));background-size:300% 300%;animation:gradient-shift 5s ease infinite;-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
.cta-in{background:var(--glass);backdrop-filter:blur(20px);padding:4rem;display:flex;align-items:center;justify-content:space-between;gap:2.5rem;flex-wrap:wrap;position:relative}
@media(max-width:768px){.cta-in{padding:2.5rem 1.75rem;flex-direction:column;text-align:center}}
.cta-emoji{font-size:3rem;animation:float 4s ease-in-out infinite}
.cta-h2{font-family:var(--font-d);font-size:clamp(1.6rem,3.5vw,2.4rem);font-weight:700;letter-spacing:-1px;line-height:1.2;color:var(--ink)}
.cta-p{color:var(--ink3);font-size:.95rem;margin-top:.5rem}
.cta-acts{display:flex;gap:1rem;flex-shrink:0;flex-wrap:wrap}
@media(max-width:768px){.cta-acts{width:100%;flex-direction:column}.cta-acts .btn-hero,.cta-acts .btn-outline-hero{justify-content:center}}

/* FOOTER */
.ml-ftr{border-top:1px solid var(--border);padding:3rem 2.5rem;background:var(--bg2)}
@media(max-width:580px){.ml-ftr{padding:2.5rem 1.5rem}}
.ml-ftr-in{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1.5rem}
.ftr-logo{display:flex;align-items:center;gap:.5rem;text-decoration:none}
.ftr-logo-icon{width:28px;height:28px;background:linear-gradient(135deg,var(--lavender),var(--coral));border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.85rem;color:#fff}
.ftr-logo-text{font-family:var(--font-d);font-size:1.1rem;font-weight:700;background:linear-gradient(135deg,var(--lavender),var(--coral));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.ftr-links{display:flex;gap:1.75rem;flex-wrap:wrap}
.ftr-a{color:var(--ink3);font-size:.85rem;text-decoration:none;transition:all .25s}
.ftr-a:hover{color:var(--lavender)}
.ftr-copy{color:var(--ink3);font-size:.78rem;margin-top:.35rem;display:flex;align-items:center;gap:.4rem}
.ftr-copy span{font-size:.9rem}
`;

/* ══════════════════════════════════════════════════════════════
   SVG ICONS
══════════════════════════════════════════════════════════════ */
const IconArrow = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
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

/* ══════════════════════════════════════════════════════════════
   THREE.JS STEPS SCENE
══════════════════════════════════════════════════════════════ */
function createStepsScene(canvas) {
  if (!canvas) return { destroy: () => {}, setProgress: () => {} };
  const W = canvas.offsetWidth || innerWidth, H = canvas.offsetHeight || innerHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
  cam.position.set(0, 0, 10);

  // Pastel colors
  const COLORS = [0xA78BFA, 0xFF6B9D, 0x6EE7B7, 0x7DD3FC];
  const X = [-5, -1.7, 1.7, 5];
  const nodes = X.map((x, i) => {
    const grp = new THREE.Group();
    grp.position.set(x, 0, 0);
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(.5, 16, 16), new THREE.MeshBasicMaterial({ color: COLORS[i], transparent: true, opacity: .12 }));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.0, .015, 8, 40), new THREE.MeshBasicMaterial({ color: COLORS[i], transparent: true, opacity: .2 }));
    ring.rotation.x = Math.PI / 3 + i * .3;
    const pCount = 40, pGeo = new THREE.BufferGeometry(), pPos = new Float32Array(pCount * 3);
    for (let j = 0; j < pCount; j++) { const a=Math.random()*Math.PI*2, r=.7+Math.random()*.6; pPos[j*3]=Math.cos(a)*r; pPos[j*3+1]=(Math.random()-.5)*.4; pPos[j*3+2]=Math.sin(a)*r; }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: COLORS[i], size: .05, transparent: true, opacity: .4 });
    grp.add(sphere, ring, new THREE.Points(pGeo, pMat));
    grp.userData = { i, spd: .25+i*.07, off: i*1.5, lit: false, sphere, ring, pMat };
    scene.add(grp);
    return grp;
  });
  const beams = [];
  for (let i = 0; i < 3; i++) {
    const pts2 = [new THREE.Vector3(X[i]+.65,0,0), new THREE.Vector3(X[i+1]-.65,0,0)];
    const bMat = new THREE.LineBasicMaterial({ color: 0xDDD6FE, transparent: true, opacity: .5 });
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts2), bMat));
    beams.push(bMat);
  }

  function setProgress(p) {
    const litCount = p >= 0.88 ? 4 : Math.min(4, Math.floor(p * 4) + 1);
    nodes.forEach((g, i) => {
      const isLit = i < litCount, isActive = i === litCount - 1;
      g.userData.lit = isLit;
      g.userData.sphere.material.opacity = isLit ? .2 : .06;
      g.userData.ring.material.opacity = isLit ? (isActive ? .5 : .2) : .08;
      g.userData.pMat.opacity = isLit ? .6 : .2;
    });
    beams.forEach((bm, i) => { bm.opacity = Math.min(.6, Math.max(.15, (litCount - i) * .25)); });
  }

  let mx = 0, my = 0;
  const onMM = e => { const r=canvas.getBoundingClientRect(); mx=((e.clientX-r.left)/r.width-.5)*2; my=-((e.clientY-r.top)/r.height-.5)*2; };
  const onResize = () => { const w=canvas.offsetWidth,h=canvas.offsetHeight; renderer.setSize(w,h); cam.aspect=w/h; cam.updateProjectionMatrix(); };
  canvas.addEventListener('mousemove', onMM, { passive: true });
  window.addEventListener('resize', onResize);
  const clock = new THREE.Clock();
  let raf, frame = 0;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    frame++;
    if (frame % 2 !== 0) return;
    const t = clock.getElapsedTime();
    nodes.forEach(g => {
      g.rotation.y = t * g.userData.spd * .25;
      g.rotation.x = t * g.userData.spd * .14;
      g.position.y = Math.sin(t * 1.0 + g.userData.off) * (g.userData.lit ? .16 : .06);
      g.scale.setScalar((g.userData.lit ? 1.12 : 1) + Math.sin(t*1.6+g.userData.i)*(g.userData.lit?.025:.005));
      g.userData.ring.rotation.z = t * .3;
    });
    cam.position.x += (mx * .4 - cam.position.x) * .04;
    cam.position.y += (my * .25 - cam.position.y) * .04;
    cam.lookAt(0, 0, 0);
    renderer.render(scene, cam);
  };
  tick();
  return {
    setProgress,
    destroy() { cancelAnimationFrame(raf); canvas.removeEventListener('mousemove', onMM); window.removeEventListener('resize', onResize); renderer.dispose(); }
  };
}

/* ══════════════════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } }),
      { threshold: .1, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('.rev').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ══════════════════════════════════════════════════════════════
   SLIDE COMPONENTS
══════════════════════════════════════════════════════════════ */
const Slide1 = ({ active }) => {
  const [phase, setPhase] = useState(0);
  const timersRef = useRef([]);
  useEffect(() => {
    timersRef.current.forEach(clearTimeout); timersRef.current = [];
    if (!active) { setPhase(0); return; }
    [400,1000,1700,2400].forEach((d,i) => { const t=setTimeout(()=>setPhase(i+1),d); timersRef.current.push(t); });
    return () => timersRef.current.forEach(clearTimeout);
  }, [active]);

  return (
    <div className={`demo-slide${active?' active':''}`}>
      <div className="s1-scene">
        <div className="s1-illustration">
          <svg width="180" height="160" viewBox="0 0 180 160" fill="none"
            style={{ animation: active ? 'float-slow 3.5s ease-in-out infinite' : 'none' }}>
            {/* Person thinking */}
            <circle cx="90" cy="70" r="28" fill="url(#grad1)" opacity=".15"/>
            <circle cx="90" cy="70" r="20" fill="#FEFCF9" stroke="url(#grad1)" strokeWidth="2"/>
            <circle cx="83" cy="67" r="3" fill="#A78BFA"/>
            <circle cx="97" cy="67" r="3" fill="#A78BFA"/>
            <path d="M85 78 Q90 83 95 78" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" fill="none"/>
            
            {/* Thought bubbles */}
            {phase>=1 && (
              <g style={{animation:'pop-in .5s var(--spring) both'}}>
                <circle cx="120" cy="50" r="5" fill="rgba(167,139,250,.2)" stroke="rgba(167,139,250,.4)" strokeWidth="1.5"/>
                <circle cx="130" cy="38" r="8" fill="rgba(167,139,250,.15)" stroke="rgba(167,139,250,.35)" strokeWidth="1.5"/>
                <circle cx="143" cy="22" r="12" fill="rgba(255,107,157,.1)" stroke="rgba(255,107,157,.3)" strokeWidth="1.5"/>
              </g>
            )}
            
            {/* Lightbulb */}
            {phase>=2 && (
              <g style={{animation:'pop-in .6s .2s var(--spring) both'}}>
                <circle cx="143" cy="22" r="8" fill="url(#grad2)">
                  <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite"/>
                </circle>
              </g>
            )}
            
            {/* Question marks */}
            {phase>=1 && (
              <>
                <text x="55" y="45" fontSize="14" fill="rgba(167,139,250,.5)" style={{animation:'pop-in .4s .1s both'}}>?</text>
                <text x="125" y="75" fontSize="10" fill="rgba(167,139,250,.4)" style={{animation:'pop-in .4s .3s both'}}>?</text>
              </>
            )}
            
            {/* Labels */}
            {phase>=3 && (
              <>
                <text x="30" y="35" fontSize="9" fill="rgba(167,139,250,.7)" fontFamily="var(--font-m)" style={{animation:'fadeUp .4s both'}}>startup?</text>
                <text x="120" y="95" fontSize="9" fill="rgba(255,107,157,.6)" fontFamily="var(--font-m)" style={{animation:'fadeUp .4s .15s both'}}>funding?</text>
              </>
            )}
            
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A78BFA"/>
                <stop offset="100%" stopColor="#FF6B9D"/>
              </linearGradient>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24"/>
                <stop offset="100%" stopColor="#FF6B9D"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="s1-caption">
          {phase===0 && <span>A founder with a spark <Sparkles size={16}/></span>}
          {phase===1 && <span>Hmm, I have an idea...</span>}
          {phase===2 && <><span>The idea hits!</span> Now what?</>}
          {phase>=3 && <>Where do I even <span>start?</span></>}
        </div>
        {phase>=4 && (
          <div className="s1-next-hint" style={{animation:'fadeUp .4s both'}}>
            MindLaunch can help →
          </div>
        )}
      </div>
    </div>
  );
};

const Slide2 = ({ active }) => {
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState('');
  const timersRef = useRef([]);
  const intervalRef = useRef(null);
  const TARGET = 'E-Commerce Store';

  useEffect(() => {
    timersRef.current.forEach(clearTimeout); timersRef.current = [];
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (!active) { setPhase(0); setTyped(''); return; }
    const t1=setTimeout(()=>setPhase(1),300); const t2=setTimeout(()=>setPhase(2),900);
    timersRef.current.push(t1,t2);
    const t3=setTimeout(()=>{
      let i=0;
      intervalRef.current=setInterval(()=>{
        i++; setTyped(TARGET.slice(0,i));
        if(i>=TARGET.length){
          clearInterval(intervalRef.current); intervalRef.current=null;
          const ta=setTimeout(()=>setPhase(3),300); const tb=setTimeout(()=>setPhase(4),900);
          timersRef.current.push(ta,tb);
        }
      },85);
    },1400);
    timersRef.current.push(t3);
    return()=>{timersRef.current.forEach(clearTimeout);if(intervalRef.current)clearInterval(intervalRef.current);};
  },[active]);

  return (
    <div className={`demo-slide${active?' active':''}`}>
      <div className="s2-scene">
        {phase>=1 && (
          <div className="s2-app-bar" style={{animation:'fadeUp .4s both'}}>
            <div className="s2-app-logo">M</div>
            <span className="s2-app-name">MindLaunch</span>
            <div style={{marginLeft:'auto',width:7,height:7,borderRadius:'50%',background:'var(--mint)',boxShadow:'0 0 8px var(--mint)'}}/>
          </div>
        )}
        {phase>=1 && (
          <div style={{display:'flex',justifyContent:'center',margin:'.5rem 0',animation:'fadeUp .4s .1s both'}}>
            <Rocket size={40}/>
          </div>
        )}
        {phase>=1 && (
          <div className="s2-prompt-box" style={{animation:'fadeUp .4s .15s both'}}>
            <div className="s2-prompt-label">My Startup Idea</div>
            <div className="s2-typed">
              {typed || <span className="s2-typed-placeholder">Start typing…</span>}
              {typed.length>0 && typed.length<TARGET.length && <span className="s2-cursor"/>}
              {typed.length===0 && phase>=2 && <span className="s2-cursor"/>}
            </div>
          </div>
        )}
        {phase>=3 && (
          <div style={{animation:'fadeUp .4s both'}}>
            <div className="s2-tracks-label" style={{marginBottom:'.4rem'}}><Sparkles size={12}/> Recommended tracks</div>
            <div className="s2-track-chips">
              <span className="s2-chip s2-chip-v">Foundations</span>
              <span className="s2-chip s2-chip-g">Finance</span>
              <span className="s2-chip s2-chip-e">Marketing</span>
              <span className="s2-chip s2-chip-v">Fundraising</span>
            </div>
          </div>
        )}
        {phase>=4 && (
          <button className="s2-cta" style={{animation:'pop-in .5s both'}}>
            Build My Roadmap <Sparkles size={14}/>
          </button>
        )}
      </div>
    </div>
  );
};

const Slide3 = ({ active }) => {
  const [phase, setPhase] = useState(0);
  const [msgs, setMsgs] = useState([]);
  const [scoreW, setScoreW] = useState(0);
  const timersRef = useRef([]);
  const MSGS = [
    {who:'ai',   text:"What's your edge over Amazon?"},
    {who:'user', text:"AI-curated local inventory <Target size={12}/>"},
    {who:'ai',   text:"Strong! Revenue model?"},
  ];
  useEffect(() => {
    timersRef.current.forEach(clearTimeout); timersRef.current = [];
    if(!active){setPhase(0);setMsgs([]);setScoreW(0);return;}
    [300,800,1400,2000,2600,3200,4000,4800].forEach((d,i)=>{const t=setTimeout(()=>setPhase(i+1),d);timersRef.current.push(t);});
    MSGS.forEach((msg,i)=>{const t=setTimeout(()=>setMsgs(prev=>prev.length<=i?[...prev,msg]:prev),2600+i*800);timersRef.current.push(t);});
    const st=setTimeout(()=>setScoreW(82),5200);timersRef.current.push(st);
    return()=>timersRef.current.forEach(clearTimeout);
  },[active]);

  return (
    <div className={`demo-slide${active?' active':''}`}>
      <div className="s3-scene">
        <div className="s3-bag-stage">
          <div style={{fontSize:'4rem',textAlign:'center',animation:phase>=1?'pop-in .5s both':'none'}}><ShoppingBag size={64}/></div>
          {phase>=3 && (
            <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'#fff',borderRadius:'12px',padding:'.5rem',border:'1px solid var(--border)',boxShadow:'var(--shadow-md)',animation:'pop-in .5s both'}}>
              <Bot size={24}/>
            </div>
          )}
        </div>
        {phase>=4 && (
          <div className="s3-coach-panel" style={{animation:'fadeUp .5s both'}}>
            <div className="s3-coach-hdr">
              <div className="s3-coach-avatar"><Brain size={16}/></div>
              <div>
                <div className="s3-coach-name">AI Pitch Coach</div>
                <div className="s3-coach-status">Live session</div>
              </div>
            </div>
            <div className="s3-chat">
              {msgs.map((m,i)=>(
                <div key={i} className={`s3-bubble ${m.who}`} style={{animation:'slide-in-right .4s both'}}>
                  <span className="s3-bubble-who">{m.who==='ai'?(<><Bot size={10}/> AI</>):(<><Users size={10}/> You</>)}</span>
                  {m.text}
                </div>
              ))}
            </div>
            {scoreW>0 && (
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

const Slide4 = ({ active }) => {
  const [phase, setPhase] = useState(0);
  const [vcIn, setVcIn] = useState([]);
  const [notifyIn, setNotifyIn] = useState(false);
  const timersRef = useRef([]);
  const VCS = [
    {name:'Sequoia Capital',  firm:'Series A · $500K–$5M',icon:<Award size={16}/>,status:'match'},
    {name:'Accel Partners',   firm:'Seed · $100K–$1M',   icon:<Rocket size={16}/>,status:'rev'},
    {name:'Elevation Capital',firm:'Early · $250K+',     icon:<Zap size={16}/>,status:'match'},
  ];
  useEffect(()=>{
    timersRef.current.forEach(clearTimeout);timersRef.current=[];
    if(!active){setPhase(0);setVcIn([]);setNotifyIn(false);return;}
    const t1=setTimeout(()=>setPhase(1),300);const t2=setTimeout(()=>setPhase(2),900);
    timersRef.current.push(t1,t2);
    VCS.forEach((_,i)=>{const t=setTimeout(()=>setVcIn(prev=>prev.includes(i)?prev:[...prev,i]),1200+i*600);timersRef.current.push(t);});
    const tN=setTimeout(()=>setNotifyIn(true),3200);timersRef.current.push(tN);
    return()=>timersRef.current.forEach(clearTimeout);
  },[active]);

  return (
    <div className={`demo-slide${active?' active':''}`}>
      <div className="s4-scene">
        <div className="s4-title" style={{animation:active?'fadeUp .4s both':'none'}}>
          <Target size={20}/> VCs Matched!
        </div>
        <div className="s4-sub" style={{animation:active?'fadeUp .4s .1s both':'none'}}>
          {phase>=2?`${vcIn.length} match${vcIn.length!==1?'es':''} found <Sparkles size={14}/>}`:'Scanning investor network...'}
        </div>
        <div className="s4-net-stage">
          <svg width="100%" height="130" viewBox="0 0 220 130" fill="none" preserveAspectRatio="xMidYMid meet">
            <circle cx="110" cy="65" r="22" fill="url(#cgrad)" opacity=".15"/>
            <circle cx="110" cy="65" r="15" fill="#FEFCF9" stroke="url(#cgrad)" strokeWidth="2"/>
            <text x="103" y="70" fontSize="12">👤</text>
            
            {[{cx:38,cy:32},{cx:182,cy:32},{cx:38,cy:98},{cx:182,cy:98}].map((n,i)=>(
              <g key={i} style={{opacity:vcIn.includes(i)?1:.25,transition:'all .5s var(--spring)'}}>
                <line x1={n.cx>110?n.cx-14:n.cx+14} y1={n.cy>65?n.cy-10:n.cy+10} 
                      x2={n.cx>110?125:95} y2={n.cy>65?78:52}
                      stroke="url(#cgrad)" strokeWidth="2" opacity=".4" strokeDasharray="5 4">
                  {vcIn.includes(i) && <animate attributeName="stroke-dashoffset" values="18;0" dur="1s" repeatCount="indefinite"/>}
                </line>
                <circle cx={n.cx} cy={n.cy} r="16" fill="#FEFCF9" stroke="url(#cgrad)" strokeWidth="1.5"/>
                <text x={n.cx-6} y={n.cy+5} fontSize="10">{['🏆','🚀','⚡','💎'][i]}</text>
              </g>
            ))}
            
            <defs>
              <linearGradient id="cgrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A78BFA"/>
                <stop offset="100%" stopColor="#FF6B9D"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="s4-vc-list">
          {VCS.map((v,i)=>(
            <div key={i} className={`s4-vc-row${vcIn.includes(i)?' in':''}`} style={{transitionDelay:`${i*.05}s`}}>
              <div className="s4-vc-dot" style={{background:`linear-gradient(135deg,rgba(167,139,250,.1),rgba(255,107,157,.08))`}}>
                {v.icon}
              </div>
              <div className="s4-vc-info">
                <div className="s4-vc-name">{v.name}</div>
                <div className="s4-vc-firm">{v.firm}</div>
              </div>
              <span className={`s4-badge ${v.status}`}>{v.status==='match'?(<><Check size={10}/> Match</>):(<><Clock size={10}/> Review</>)}</span>
            </div>
          ))}
        </div>
        <div className={`s4-notify${notifyIn?' in':''}`}>
          <Mail size={16}/>
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

  const stepsCanRef   = useRef(null);
  const stepSecRef    = useRef(null);
  const hdrRef        = useRef(null);
  const stepsApiRef   = useRef(null);

  const [activeStep, setActiveStep] = useState(-1);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoActive, setDemoActive] = useState(0);
  const [autoPlay,   setAutoPlay]   = useState(true);

  useReveal();

  useEffect(() => {
    injectFonts();
    let el = document.getElementById('ml-css-genz');
    if (!el) { el = document.createElement('style'); el.id = 'ml-css-genz'; document.head.appendChild(el); }
    el.textContent = CSS;
    // Remove old style tags
    ['ml-css-v5','ml-css-v5-fixed','ml-css-light'].forEach(id => { const old=document.getElementById(id); if(old) old.remove(); });
  }, []);

  // Header scroll
  useEffect(()=>{
    const fn=()=>hdrRef.current?.classList.toggle('solid',scrollY>30);
    window.addEventListener('scroll',fn,{passive:true});
    return()=>window.removeEventListener('scroll',fn);
  },[]);

  // Steps 3D
  useEffect(()=>{if(!stepsCanRef.current)return;const api=createStepsScene(stepsCanRef.current);stepsApiRef.current=api;return()=>api.destroy();},[]);

  // Scroll steps
  useEffect(()=>{
    const fn=()=>{
      if(!stepSecRef.current)return;
      const rect=stepSecRef.current.getBoundingClientRect();
      const total=stepSecRef.current.offsetHeight-innerHeight;
      const p=Math.max(0,Math.min(1,-rect.top/total));
      stepsApiRef.current?.setProgress(p);
      const litCount = p >= 0.88 ? 4 : Math.min(4, Math.floor(p * 4) + 1);
      setActiveStep(litCount - 1);
    };
    window.addEventListener('scroll',fn,{passive:true});fn();
    return()=>window.removeEventListener('scroll',fn);
  },[]);

  // Auto-cycle demo
  useEffect(()=>{if(!autoPlay)return;const id=setInterval(()=>setDemoActive(p=>(p+1)%4),5500);return()=>clearInterval(id);},[autoPlay]);

  const scrollTo=id=>{const el=document.getElementById(id);if(!el)return;window.scrollTo({top:el.getBoundingClientRect().top+scrollY-80,behavior:'smooth'});setMobileOpen(false);};
  const handleDemoClick=id=>{setDemoActive(id);setAutoPlay(false);};
  const Chk=()=><IconCheck size={9}/>;

  const features=[
    {icon:<Brain size={28}/>,cls:'fi-v',t:'AI Venture Mentor',     p:'Pitch Coach powered by Claude. Mock Q&A with readiness scores across Clarity, Market Fit, and Value Prop.'},
    {icon:<BookOpen size={28}/>,cls:'fi-g',t:'30 Structured Modules', p:'Five focused tracks — Foundations, Finance, Operations, Marketing, Fundraising. Each module produces an exportable deliverable.'},
    {icon:<Globe size={28}/>,cls:'fi-e',t:'Built For Your Region',  p:'Templates and coaching tuned for US, GCC, and key African ecosystems. Not generic advice painted over your local reality.'},
  ];
  const steps=[
    {n:'01',t:'Describe your idea',    p:'Brief your concept, pick category tiles and your target region.',icon:<Lightbulb size={20}/>},
    {n:'02',t:'Complete each module',  p:'Structured lessons with deliverables you fill out — not just watch.',icon:<FileText size={20}/>},
    {n:'03',t:'Spar with Pitch Coach', p:'AI investor fires real questions. Weak spots scored and rebuilt.',icon:<Target size={20}/>},
    {n:'04',t:'Export your brief',     p:'One-click PDF or Word export, ready to send to investors.',icon:<Rocket size={20}/>},
  ];
  const DEMO_STEPS=[
    {id:0,label:'The Spark',          sub:"A founder has an idea — but doesn't know where to begin",side:'left',icon:<Sparkles size={18}/>},
    {id:1,label:'Open MindLaunch',    sub:'Type your idea. Get a tailored roadmap in seconds',       side:'left',icon:<Target size={18}/>},
    {id:2,label:'Pitch Coach Session',sub:'Your product emerges. AI investor fires real questions',   side:'right',icon:<Bot size={18}/>},
    {id:3,label:'VC Connections Live',sub:'Profile goes live. Investors match and request meetings',  side:'right',icon:<Fish size={18}/>},
  ];
  const regions=[
    {name:'United States',code:'US'},{name:'UAE',code:'AE'},{name:'Saudi Arabia',code:'SA'},
    {name:'Egypt',code:'EG'},{name:'Nigeria',code:'NG'},{name:'Kenya',code:'KE'},
    {name:'Jordan',code:'JO'},{name:'Qatar',code:'QA'},{name:'India',code:'IN'},
  ];

  return (
    <>
      

      {/* Gradient mesh background */}
      <div className="ml-mesh-bg" aria-hidden="true">
        <div className="mesh-blob blob-1"/>
        <div className="mesh-blob blob-2"/>
        <div className="mesh-blob blob-3"/>
        <div className="mesh-blob blob-4"/>
      </div>
      
      {/* Floating decorations */}
      <div className="ml-floaties" aria-hidden="true">
        <div className="floaty f1"><Sparkles size={32}/></div>
        <div className="floaty f2"><Rocket size={32}/></div>
        <div className="floaty f3"><Lightbulb size={32}/></div>
        <div className="floaty f4"><Target size={32}/></div>
        <div className="floaty f5"><Zap size={32}/></div>
        <div className="floaty f6"><Gem size={32}/></div>
        <div className="floaty f7"><Star size={32}/></div>
        <div className="floaty f8"><Eye size={32}/></div>
      </div>
      
      <div className="ml-page">

        {/* HEADER */}
        <div className="ml-hdr-wrap" ref={hdrRef}>
          <header className="ml-hdr">
            <Link to="/" className="ml-logo">
              <div className="ml-logo-icon"><span>M</span></div>
              <span className="ml-logo-text">MindLaunch</span>
            </Link>
            <nav className="ml-nav-links">
              {[['features','Features'],['demo','See It Live'],['steps','How It Works'],['pricing','Pricing'],['regions','Regions']].map(([id,label])=>(
                <span key={id} className="ml-nav-link" onClick={()=>scrollTo(id)}>{label}</span>
              ))}
            </nav>
            <div className="ml-hdr-btns dk">
              {user
                ?<Link to="/dashboard" className="btn-primary"><span>Dashboard</span> <IconArrow/></Link>
                :<><Link to="/login" className="btn-ghost">Log in</Link><Link to="/register" className="btn-primary"><span>Get started</span> <IconArrow/></Link></>
              }
            </div>
            <button className={`ml-hamburger${mobileOpen?' open':''}`} onClick={()=>setMobileOpen(v=>!v)} aria-label="Menu"><span/><span/><span/></button>
          </header>
          <div className={`ml-mobile-overlay${mobileOpen?' open':''}`} onClick={()=>setMobileOpen(false)} style={{display:mobileOpen?'block':'none'}}/>
          <nav className={`ml-mobile-menu${mobileOpen?' open':''}`} style={{display:mobileOpen?'flex':'none'}}>
            {[['features','Features'],['demo','See It Live'],['steps','How It Works'],['pricing','Pricing'],['regions','Regions']].map(([id,label])=>(
              <span key={id} className="ml-nav-link" onClick={()=>scrollTo(id)}>{label}</span>
            ))}
            <div style={{display:'flex',flexDirection:'column',gap:'.75rem',marginTop:'1.25rem'}}>
              <Link to="/login" className="btn-ghost">Log in</Link>
              <Link to="/register" className="btn-primary"><span>Get started</span> <IconArrow/></Link>
            </div>
          </nav>
        </div>

        {/* HERO */}
        <section className="ml-hero">
          <div className="hero-badge">
            <Fish size={18}/>
            Shark Tank–style VC matchmaking
          </div>
          <h1 className="hero-h1">
            Launch your startup
            <span className="hero-h1 line-2">with <span className="grad-text">AI-guided</span> learning <Sparkles size={20}/></span>
          </h1>
          <p className="hero-p">30 structured modules across <strong>5 tracks</strong>. A Claude-powered pitch coach that thinks like a VC. Built for founders in <strong>9 global markets</strong> — from Mumbai to Manhattan.</p>
          <div className="vc-banner">
            <div className="vc-banner-in">
              <div className="vc-banner-icon"><Trophy size={40}/></div>
              <div>
                <h3 className="vc-banner-title">Complete Your Journey — Get Funded</h3>
                <p className="vc-banner-body">Finish all courses with your pitch deck and presentation. Your profile gets automatically listed with our connected VC network for evaluation and funding — just like Shark Tank, but global.</p>
              </div>
            </div>
          </div>
          <div className="hero-acts">
            <Link to="/register" className="btn-hero">Get started free <IconArrow/></Link>
            <button className="btn-outline-hero" onClick={()=>scrollTo('demo')}>See it in action <Sparkles size={18}/></button>
          </div>
          <div className="hero-stats">
            {[['30','Modules'],['5','Tracks'],['9','Regions'],['AI','Coach']].map(([n,l])=>(
              <div className="hs-item" key={l}>
                <span className="hs-n">{n}</span>
                <span className="hs-l">{l}</span>
              </div>
            ))}
          </div>
          <div className="hero-tracks">
            <span className="trk-lbl">YOUR TRACKS</span>
            <div className="trk-pills">
              <span className="trk-pill tp1"><Sparkles size={14}/> Foundations</span>
              <span className="trk-pill tp2"><DollarSign size={14}/> Finance</span>
              <span className="trk-pill tp3"><Settings size={14}/> Operations</span>
              <span className="trk-pill tp4"><Megaphone size={14}/> Marketing</span>
              <span className="trk-pill tp1"><Rocket size={14}/> Fundraising</span>
            </div>
            <div className="trk-live">
              <div className="trk-live-dot"/>
              <span className="trk-live-lbl">Claude API live</span>
            </div>
          </div>
          <div className="scroll-hint">
            <div className="scroll-ring">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </div>
            <span className="scroll-txt">Scroll to explore</span>
          </div>
        </section>

        {/* DEMO */}
        <section className="demo-section bg-glass" id="demo">
          <div className="demo-container">
            <div className="demo-hdr rev">
              <div className="sec-tag"><span className="sec-tag-emoji"><Play size={16}/></span>See It In Action</div>
              <h2 className="sec-h2" style={{textAlign:'center'}}>From spark to <span className="grad-peach">funded founder</span><br/>in four scenes</h2>
              <p className="sec-sub" style={{margin:'0 auto',textAlign:'center',maxWidth:'520px'}}>Watch a real founder journey — idea, roadmap, pitch session, investor match. Click any scene or let it play.</p>
            </div>
            <div className="demo-stage rev" style={{transitionDelay:'100ms'}}>
              <div className="demo-left">
                {DEMO_STEPS.filter(s=>s.side==='left').map(s=>(
                  <div key={s.id} className={`demo-trigger${demoActive===s.id?' active':''}${demoActive>s.id?' done':''}`} onClick={()=>handleDemoClick(s.id)}>
                    <div className="dt-num">{demoActive>s.id?<Chk/>:s.icon}</div>
                    <div className="dt-content">
                      <div className="dt-label">{s.label}</div>
                      <div className="dt-sub">{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="demo-right">
                {DEMO_STEPS.filter(s=>s.side==='right').map(s=>(
                  <div key={s.id} className={`demo-trigger${demoActive===s.id?' active':''}${demoActive>s.id?' done':''}`} onClick={()=>handleDemoClick(s.id)}>
                    <div className="dt-num">{demoActive>s.id?<Chk/>:s.icon}</div>
                    <div className="dt-content">
                      <div className="dt-label">{s.label}</div>
                      <div className="dt-sub">{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="demo-progress">
              {DEMO_STEPS.map(s=>(
                <div key={s.id} className={`demo-dot${demoActive===s.id?' active':''}`} onClick={()=>handleDemoClick(s.id)}/>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="ml-sec" id="features">
          <div className="rev">
            <div className="sec-tag"><span className="sec-tag-emoji"><Gem size={16}/></span>Why MindLaunch</div>
            <h2 className="sec-h2">Everything a founder needs.<br/><span className="grad-text">Nothing they don't.</span></h2>
            <p className="sec-sub">We replaced the bloated accelerator model with a focused, AI-native curriculum.</p>
          </div>
          <div className="feat-grid">
            {features.map(({icon,cls,t,p},i)=>(
              <div key={i} className="feat-card rev" style={{transitionDelay:`${i*100}ms`}}>
                <div className="feat-glow"/>
                <div className={`feat-ico ${cls}`}>{icon}</div>
                <h3 className="feat-h3">{t}</h3>
                <p className="feat-p">{p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STEPS */}
        <div id="steps" ref={stepSecRef} className="steps-section">
          <div className="steps-sticky">
            <div className="steps-bg-gradient"/>
            <canvas ref={stepsCanRef} id="ml-steps-canvas"/>
            <div className="steps-ui">
              <div className="steps-hdr">
                <div className="sec-tag" style={{justifyContent:'center'}}><span className="sec-tag-emoji"><Target size={16}/></span>Process</div>
                <h2 className="sec-h2" style={{textAlign:'center'}}>Four steps to <span className="grad-text">investor-ready</span></h2>
                <p className="sec-sub" style={{margin:'0 auto',textAlign:'center'}}>Scroll down — the orbs light up as you move through each phase <Sparkles size={14}/></p>
              </div>
              <div className="steps-grid">
                {steps.map((s,i)=>(
                  <div key={i} className={`step-card${activeStep>=i?' lit':''}`}>
                    <div className="step-card-line"/>
                    <div className="step-n">{activeStep>=i?s.icon:s.n}</div>
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
        <section className="ml-sec bg-glass" id="pricing">
          <div className="rev">
            <div className="sec-tag"><span className="sec-tag-emoji"><DollarSign size={16}/></span>Pricing</div>
            <h2 className="sec-h2">Simple, <span className="grad-text">honest pricing.</span></h2>
            <p className="sec-sub">No micro-transactions. One price unlocks everything. Cancel anytime.</p>
          </div>
          <div className="price-grid">
            <div className="price-card rev">
              <div><div className="p-name"><Sprout size={20}/> Starter</div><div className="p-desc">Explore before you commit.</div></div>
              <div className="p-price">Free <small>/ forever</small></div>
              <div className="p-div"/>
              <div className="p-feats">
                {['Module 1 unlocked','AI Pitch Coach chat','Basic PDF export','Startup profile'].map(f=>(
                  <div className="p-feat" key={f}><div className="p-ck ck-v"><Chk/></div>{f}</div>
                ))}
              </div>
              <Link to="/register" className="btn-p-outline">Start free</Link>
            </div>
            <div className="price-card rev" style={{transitionDelay:'100ms'}}>
              <div><div className="p-name"><Zap size={20}/> Premium Monthly</div><div className="p-desc">Perfect for focused learning.</div></div>
              <div className="p-price">₹399 <small>/ month</small></div>
              <div className="p-div"/>
              <div className="p-feats">
                {['All 30 modules unlocked','AI Pitch Coach + full reports','PDF & Word exports','Regional frameworks','Email support'].map(f=>(
                  <div className="p-feat" key={f}><div className="p-ck ck-v"><Chk/></div>{f}</div>
                ))}
              </div>
              <Link to="/register" className="btn-p-primary">Subscribe <IconArrow size={12}/></Link>
            </div>
            <div className="price-card hot rev" style={{transitionDelay:'200ms'}}>
              <div className="hot-chip"><Sparkles size={14}/> Best value</div>
              <div><div className="p-name"><Rocket size={20}/> Premium Yearly</div><div className="p-desc">Save 48% vs monthly.</div></div>
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

        {/* REGIONS */}
        <section className="ml-sec" id="regions">
          <div className="rev">
            <div className="sec-tag"><span className="sec-tag-emoji"><Globe size={16}/></span>Coverage</div>
            <h2 className="sec-h2">Nine global markets. <span className="grad-mint">One platform.</span></h2>
            <p className="sec-sub">Curriculum and templates adapted to your local market dynamics and regulations.</p>
          </div>
          <div className="reg-grid">
            {regions.map((r,i)=>(
              <div className="reg-card rev" key={i} style={{transitionDelay:`${i*40}ms`}}>
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
              <div className="cta-emoji"><Rocket size={48}/></div>
              <div>
                <h2 className="cta-h2">Ready to build your startup?</h2>
                <p className="cta-p">Join founders across 9 markets going from idea to investor-ready with MindLaunch <Sparkles size={16}/></p>
              </div>
              <div className="cta-acts">
                <Link to="/register" className="btn-hero">Start for free <IconArrow/></Link>
                <button className="btn-outline-hero" onClick={()=>scrollTo('demo')}>See demo</button>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="ml-ftr">
          <div className="ml-ftr-in">
            <div>
              <Link to="/" className="ftr-logo">
                <div className="ftr-logo-icon">M</div>
                <span className="ftr-logo-text">MindLaunch</span>
              </Link>
              <div className="ftr-copy"> © 2026 MindLaunch. All rights reserved.</div>
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
