import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';


/* ── Font injection (same id/family as LandingPage/Dashboard/Sidebar — no-op if already loaded) ── */
const injectFonts = () => {
  if (document.getElementById('ml-fonts')) return;
  const l = document.createElement('link');
  l.id = 'ml-fonts'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(l);
};

/* ══════════════════════════════════════════════════════════════
   SVG ICONS
══════════════════════════════════════════════════════════════ */
const Svg = ({ d, size=16, fill="none", sw=2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p,i)=><path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);
const Ic = {
  Lock:    s=><Svg size={s} d={["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z","M7 11V7a5 5 0 0 1 10 0v4"]}/>,
  CheckC:  s=><Svg size={s} d={["M22 11.08V12a10 10 0 1 1-5.93-9.14","M22 4L12 14.01l-3-3"]}/>,
  ChevR:   s=><Svg size={s} d="M9 18l6-6-6-6"/>,
  Sparkle: s=><Svg size={s} fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>,
  Zap:     s=><Svg size={s} fill="currentColor" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>,
  Clock:   s=><Svg size={s} d={["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M12 6v6l4 2"]}/>,
  FileT:   s=><Svg size={s} d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"]}/>,
  Book:    s=><Svg size={s} d={["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z","M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]}/>,
  Layers:  s=><Svg size={s} d={["M12 2L2 7l10 5 10-5-10-5z","M2 17l10 5 10-5","M2 12l10 5 10-5"]}/>,
  Dollar:  s=><Svg size={s} d={["M12 1v22","M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"]}/>,
  Target:  s=><Svg size={s} d={["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z","M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"]}/>,
  Rocket:  s=><Svg size={s} d={["M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z","M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"]}/>,
  Meg:     s=><Svg size={s} d={["M3 11l19-9-9 19-2-8-8-2z"]}/>,
  Check:   s=><Svg size={s} d="M20 6L9 17l-5-5"/>,
  Arrow:   s=><Svg size={s} d={["M5 12h14","M12 5l7 7-7 7"]}/>,
  Filter:  s=><Svg size={s} d="M22 3H2l8 9.46V19l4 2v-8.54z"/>,
  Search:  s=><Svg size={s} d={["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z","M21 21l-4.35-4.35"]}/>,
  BarC:    s=><Svg size={s} d={["M18 20V10","M12 20V4","M6 20v-6"]}/>,
};

/* ── Track config — recolored to the lavender / peach / mint / coral system ── */
const TRACKS = [
  { num:1, name:'Foundations',  desc:'Validate customer discovery and problem-solution fit.',              Icon:s=>Ic.Layers(s),  cls:'ti-v', color:'#7C3AED', bdr:'rgba(167,139,250,.3)', bg:'rgba(167,139,250,.07)' },
  { num:2, name:'Finance',      desc:'Build unit economics and multi-year projection models.',             Icon:s=>Ic.Dollar(s),  cls:'ti-g', color:'#D97706', bdr:'rgba(251,191,36,.3)',  bg:'rgba(251,191,36,.07)'  },
  { num:3, name:'Operations',   desc:'Structure legal setup, MVP roadmap, and KPI frameworks.',           Icon:s=>Ic.Target(s),  cls:'ti-e', color:'#059669', bdr:'rgba(110,231,183,.3)', bg:'rgba(110,231,183,.06)' },
  { num:4, name:'Marketing',    desc:'Acquisition channels, brand identity, and social growth.',          Icon:s=>Ic.Meg(s),     cls:'ti-r', color:'#DB2777', bdr:'rgba(255,107,157,.3)', bg:'rgba(255,107,157,.06)' },
  { num:5, name:'Fundraising',  desc:'Pitch decks, SAFE term sheets, and closing investor rounds.',       Icon:s=>Ic.Rocket(s),  cls:'ti-v', color:'#7C3AED', bdr:'rgba(167,139,250,.3)', bg:'rgba(167,139,250,.07)' },
];

/* ══════════════════════════════════════════════════════════════
   CSS — matches LandingPage / Dashboard / Sidebar token system
══════════════════════════════════════════════════════════════ */
const CSS = `
.mm-page *,.mm-page *::before,.mm-page *::after{box-sizing:border-box}
.mm-page{
  --mm-bg:#FEFCF9;
  --mm-bg2:#FFFFFF;
  --mm-ink:#1A1625;
  --mm-ink2:#4A4458;
  --mm-ink3:#8B849B;
  --mm-lavender:#A78BFA;
  --mm-lavender-d:#7C3AED;
  --mm-coral:#FF6B9D;
  --mm-mint:#6EE7B7;
  --mm-peach:#FBBF24;
  --mm-border:rgba(167,139,250,.15);
  --mm-border2:rgba(167,139,250,.25);
  --mm-glass:rgba(255,255,255,.7);
  --mm-glass-bdr:rgba(255,255,255,.5);
  --mm-shadow-sm:0 2px 8px rgba(167,139,250,.08);
  --mm-shadow-md:0 8px 24px rgba(167,139,250,.12);
  --mm-shadow-lg:0 16px 48px rgba(167,139,250,.15);
  font-family:'Inter',sans-serif;
  color:var(--mm-ink);
  background:var(--mm-bg);
  min-height:100vh;
  position:relative;
}

/* ── AMBIENT BACKGROUND (same gradient-mesh technique as LandingPage/Dashboard) ── */
.mm-mesh-bg{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;background:var(--mm-bg)}
.mm-mesh-bg .mesh-blob{position:absolute;filter:blur(80px);opacity:.45;animation:mmBlob 22s ease-in-out infinite}
.mm-blob-1{width:560px;height:560px;background:linear-gradient(135deg,rgba(167,139,250,.35),rgba(255,107,157,.25));top:-12%;left:-8%;animation-delay:0s}
.mm-blob-2{width:480px;height:480px;background:linear-gradient(135deg,rgba(110,231,183,.28),rgba(125,211,252,.25));top:35%;right:-12%;animation-delay:-6s}
.mm-blob-3{width:420px;height:420px;background:linear-gradient(135deg,rgba(251,191,36,.25),rgba(251,113,133,.2));bottom:-8%;left:25%;animation-delay:-11s}
@keyframes mmBlob{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}50%{border-radius:50% 60% 30% 60%/30% 40% 70% 60%}75%{border-radius:60% 40% 60% 40%/40% 30% 60% 50%}}
.mm-noise{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.02;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

.mm-wrap{position:relative;z-index:2;padding:1.75rem 2rem 4rem;max-width:1400px;display:flex;flex-direction:column;gap:2rem}

/* ── PAGE HEADER ── */
.mm-hdr{animation:mmUp .5s both}
.mm-hdr-inner{display:flex;align-items:flex-end;justify-content:space-between;gap:1.5rem;flex-wrap:wrap}
.mm-title{
  font-family:'Space Grotesk',sans-serif;
  font-size:2rem;font-weight:700;letter-spacing:-1.5px;line-height:1.1;margin-bottom:.4rem;
  background:linear-gradient(135deg,var(--mm-lavender),var(--mm-coral));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.mm-sub{font-size:.9rem;color:var(--mm-ink3);line-height:1.6}
.mm-hdr-right{display:flex;align-items:center;gap:.65rem;flex-shrink:0;flex-wrap:wrap}

/* search */
.mm-search{
  position:relative;display:flex;align-items:center;
}
.mm-search-icon{position:absolute;left:.8rem;color:var(--mm-ink3);pointer-events:none}
.mm-search input{
  padding:.55rem .9rem .55rem 2.3rem;
  border-radius:10px;
  background:var(--mm-glass);
  backdrop-filter:blur(10px);
  border:1px solid var(--mm-border2);
  color:var(--mm-ink);font-family:'Inter',sans-serif;font-size:.82rem;
  outline:none;width:200px;transition:all .25s;
}
.mm-search input::placeholder{color:var(--mm-ink3)}
.mm-search input:focus{
  border-color:rgba(167,139,250,.5);background:#fff;
  box-shadow:0 0 0 3px rgba(167,139,250,.12);width:240px;
}

/* overall progress pill */
.mm-overall{
  display:flex;align-items:center;gap:.65rem;
  padding:.5rem 1rem;border-radius:10px;
  background:var(--mm-glass);backdrop-filter:blur(10px);border:1px solid var(--mm-border);
  box-shadow:var(--mm-shadow-sm);
}
.mm-overall-num{font-family:'Space Grotesk',sans-serif;font-size:.9rem;font-weight:700;color:var(--mm-lavender-d)}
.mm-overall-bar{width:90px;height:5px;background:rgba(167,139,250,.12);border-radius:3px;overflow:hidden}
.mm-overall-fill{height:100%;background:linear-gradient(90deg,var(--mm-lavender),var(--mm-coral),var(--mm-peach));border-radius:3px;transition:width 1.2s cubic-bezier(.25,.46,.45,.94)}
.mm-overall-lbl{font-size:.72rem;color:var(--mm-ink3);font-family:'JetBrains Mono',monospace;white-space:nowrap}

/* ── TRACK SECTION ── */
.mm-track{
  display:flex;flex-direction:column;gap:1.2rem;
  animation:mmUp .5s both;
}
.mm-track-hdr{
  display:flex;align-items:center;justify-content:space-between;
  gap:1rem;flex-wrap:wrap;
  padding:1.2rem 1.5rem;
  border-radius:16px;
  border:1px solid var(--tc-bdr);
  background:var(--tc-bg);
  backdrop-filter:blur(12px);
  position:relative;overflow:hidden;
  box-shadow:var(--mm-shadow-sm);
  transition:all .3s cubic-bezier(.25,.46,.45,.94);
}
.mm-track-hdr::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--tc-color) 50%,transparent);
  opacity:.4;
}
.mm-track-left{display:flex;align-items:center;gap:1rem}
.mm-track-ico{
  width:46px;height:46px;border-radius:13px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  background:#fff;border:1px solid var(--tc-bdr);
  color:var(--tc-color);
  box-shadow:var(--mm-shadow-sm);
  transition:transform .3s cubic-bezier(.34,1.56,.64,1);
}
.mm-track-hdr:hover .mm-track-ico{transform:scale(1.1) rotate(-5deg)}
.mm-track-name{font-family:'Space Grotesk',sans-serif;font-size:1.1rem;font-weight:700;letter-spacing:-.4px;color:var(--mm-ink)}
.mm-track-desc{font-size:.8rem;color:var(--mm-ink3);margin-top:.2rem;line-height:1.5}
.mm-track-right{display:flex;align-items:center;gap:.75rem;flex-wrap:wrap}
.mm-track-prog{
  display:flex;align-items:center;gap:.5rem;
  font-family:'JetBrains Mono',monospace;font-size:.7rem;color:var(--mm-ink3);
}
.mm-track-pbar{width:60px;height:4px;background:rgba(167,139,250,.13);border-radius:2px;overflow:hidden}
.mm-track-pfill{height:100%;border-radius:2px;transition:width 1.2s cubic-bezier(.25,.46,.45,.94);background:var(--tc-color)}
.mm-track-badge{
  display:inline-flex;align-items:center;gap:.3rem;
  padding:.24rem .65rem;border-radius:100px;
  font-size:.65rem;font-weight:700;font-family:'JetBrains Mono',monospace;
  letter-spacing:.04em;text-transform:uppercase;
}
.tb-lock{background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.25);color:#D97706}
.tb-open{background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.28);color:var(--mm-lavender-d)}
.tb-done{background:rgba(110,231,183,.12);border:1px solid rgba(110,231,183,.28);color:#059669}

/* ── MODULE GRID ── */
.mm-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
  gap:1rem;
}

/* ── MODULE CARD ── */
.mm-mod{
  background:var(--mm-glass);
  backdrop-filter:blur(14px);
  border:1px solid var(--mm-glass-bdr);
  border-radius:16px;
  padding:1.25rem;
  display:flex;flex-direction:column;gap:.9rem;
  position:relative;overflow:hidden;
  box-shadow:var(--mm-shadow-sm);
  transition:all .32s cubic-bezier(.25,.46,.45,.94);
}
.mm-mod::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  transform:scaleX(0);transform-origin:left;transition:transform .4s cubic-bezier(.25,.46,.45,.94);
  border-radius:2px;
}
.mm-mod.done::before{background:linear-gradient(90deg,var(--mm-mint),#7DD3FC);transform:scaleX(1)}
.mm-mod.open:hover::before{background:linear-gradient(90deg,var(--mm-lavender),var(--mm-coral));transform:scaleX(1)}
.mm-mod.done{border-color:rgba(110,231,183,.3)}
.mm-mod.open{border-color:rgba(167,139,250,.25)}
.mm-mod.locked{opacity:.65}
.mm-mod:hover{transform:translateY(-4px);box-shadow:var(--mm-shadow-lg)}
.mm-mod.done:hover{border-color:rgba(110,231,183,.42);box-shadow:var(--mm-shadow-lg),0 0 0 1px rgba(110,231,183,.2)}
.mm-mod.open:hover{border-color:rgba(167,139,250,.4);box-shadow:var(--mm-shadow-lg),0 0 0 1px rgba(167,139,250,.2)}

/* card top row */
.mm-mod-top{display:flex;align-items:center;justify-content:space-between}
.mm-mod-num{font-family:'JetBrains Mono',monospace;font-size:.6rem;color:var(--mm-ink3);text-transform:uppercase;letter-spacing:.09em}
.mm-mod-status{
  display:inline-flex;align-items:center;gap:.25rem;
  padding:.18rem .55rem;border-radius:100px;
  font-size:.63rem;font-weight:600;font-family:'JetBrains Mono',monospace;
}
.ms-done{background:rgba(110,231,183,.13);border:1px solid rgba(110,231,183,.28);color:#059669}
.ms-open{background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.28);color:var(--mm-lavender-d)}
.ms-lock{background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.22);color:#D97706}

/* card body */
.mm-mod-body{display:flex;align-items:flex-start;gap:.75rem}
.mm-mod-ico{
  width:40px;height:40px;border-radius:10px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  transition:transform .28s cubic-bezier(.34,1.56,.64,1);
}
.mm-mod:hover .mm-mod-ico{transform:scale(1.1) rotate(-6deg)}
.mi-v{background:linear-gradient(135deg,rgba(167,139,250,.16),rgba(255,107,157,.08));border:1px solid rgba(167,139,250,.25);color:var(--mm-lavender-d)}
.mi-g{background:linear-gradient(135deg,rgba(251,191,36,.16),rgba(255,107,157,.08));border:1px solid rgba(251,191,36,.25);color:#D97706}
.mi-e{background:linear-gradient(135deg,rgba(110,231,183,.16),rgba(125,211,252,.08));border:1px solid rgba(110,231,183,.25);color:#059669}
.mi-r{background:linear-gradient(135deg,rgba(255,107,157,.14),rgba(251,113,133,.08));border:1px solid rgba(255,107,157,.25);color:var(--mm-coral)}
.mm-mod-info{}
.mm-mod-title{font-family:'Space Grotesk',sans-serif;font-size:.95rem;font-weight:700;letter-spacing:-.2px;margin-bottom:.25rem;color:var(--mm-ink)}
.mm-mod.locked .mm-mod-title{color:var(--mm-ink2)}
.mm-mod-desc{font-size:.77rem;color:var(--mm-ink3);line-height:1.52}

/* price badge inside card */
.mm-price{
  position:absolute;top:.9rem;right:.9rem;
  padding:.14rem .45rem;border-radius:6px;
  background:rgba(251,191,36,.12);border:1px solid rgba(251,191,36,.28);
  color:#D97706;font-size:.62rem;font-weight:700;font-family:'JetBrains Mono',monospace;
}

/* card footer */
.mm-mod-foot{
  padding-top:.85rem;border-top:1px solid var(--mm-border);
  display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;
}
.mm-meta{display:flex;align-items:center;gap:.28rem;font-size:.67rem;color:var(--mm-ink3);font-family:'JetBrains Mono',monospace}
.mm-cta{
  margin-left:auto;padding:.42rem .85rem;border-radius:100px;
  font-family:'Space Grotesk',sans-serif;font-size:.75rem;font-weight:700;
  cursor:pointer;text-decoration:none;
  display:inline-flex;align-items:center;gap:.3rem;
  border:none;transition:all .22s cubic-bezier(.34,1.56,.64,1);white-space:nowrap;flex-shrink:0;
}
.cta-pri{background:linear-gradient(135deg,var(--mm-lavender),var(--mm-coral));color:#fff;box-shadow:0 4px 14px rgba(167,139,250,.3)}
.cta-pri:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(255,107,157,.4)}
.cta-done{background:rgba(110,231,183,.14);color:#059669;border:1px solid rgba(110,231,183,.3)}
.cta-done:hover{background:rgba(110,231,183,.22)}
.cta-up{background:linear-gradient(135deg,var(--mm-peach),#FF9F43);color:#3A2400;box-shadow:0 4px 14px rgba(251,191,36,.28)}
.cta-up:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(251,191,36,.4)}
.cta-dis{background:rgba(167,139,250,.06);color:var(--mm-ink3);border:1px solid var(--mm-border);cursor:not-allowed}

/* ── UPGRADE STRIP ── */
.mm-upgrade-strip{
  border-radius:16px;position:relative;overflow:hidden;
  animation:mmUp .5s .08s both;
}
.mm-upgrade-strip::before{
  content:'';position:absolute;inset:0;border-radius:16px;padding:2px;
  background:linear-gradient(135deg,var(--mm-peach),var(--mm-coral),var(--mm-lavender));
  -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;
}
.mm-upgrade-in{
  background:var(--mm-glass);backdrop-filter:blur(16px);
  border-radius:14px;padding:.9rem 1.4rem;
  display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;
  position:relative;
}
.mm-upgrade-left{display:flex;align-items:center;gap:.75rem}
.mm-chip{
  padding:.2rem .6rem;border-radius:100px;
  background:linear-gradient(135deg,var(--mm-peach),#FF9F43);
  color:#3A2400;font-size:.62rem;font-weight:800;
  letter-spacing:.07em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;white-space:nowrap;
}
.mm-upgrade-txt{font-size:.86rem;color:var(--mm-ink2);font-weight:500}
.mm-upgrade-txt span{color:var(--mm-ink3);font-weight:400}
.mm-upgrade-btn{
  padding:.52rem 1.1rem;border-radius:100px;
  background:linear-gradient(135deg,var(--mm-lavender),var(--mm-coral));border:none;cursor:pointer;color:#fff;
  font-family:'Space Grotesk',sans-serif;font-size:.8rem;font-weight:700;
  text-decoration:none;display:inline-flex;align-items:center;gap:.4rem;
  box-shadow:0 4px 14px rgba(167,139,250,.3);
  transition:all .22s cubic-bezier(.34,1.56,.64,1);white-space:nowrap;
}
.mm-upgrade-btn:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(255,107,157,.4)}

/* ── COACH CTA ── */
.mm-coach{
  border-radius:18px;position:relative;overflow:hidden;
  animation:mmUp .5s .12s both;
}
.mm-coach::before{
  content:'';position:absolute;inset:0;border-radius:18px;padding:2px;
  background:linear-gradient(135deg,var(--mm-lavender),var(--mm-coral),var(--mm-mint),var(--mm-peach));
  -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;
}
.mm-coach-in{
  background:var(--mm-glass);backdrop-filter:blur(18px);
  border-radius:16px;padding:1.8rem 2.2rem;
  display:flex;align-items:center;justify-content:space-between;gap:2rem;flex-wrap:wrap;
  position:relative;
}
.mm-coach-ico{
  width:52px;height:52px;border-radius:14px;flex-shrink:0;
  background:linear-gradient(135deg,rgba(167,139,250,.2),rgba(255,107,157,.12));
  border:1px solid rgba(167,139,250,.3);
  display:flex;align-items:center;justify-content:center;color:var(--mm-lavender-d);
  animation:mmIconPulse 3s ease-in-out infinite;
}
@keyframes mmIconPulse{0%,100%{box-shadow:0 0 16px rgba(167,139,250,.2)}50%{box-shadow:0 0 28px rgba(167,139,250,.4)}}
.mm-coach-txt h3{font-family:'Space Grotesk',sans-serif;font-size:1.1rem;font-weight:700;letter-spacing:-.4px;margin-bottom:.3rem;color:var(--mm-ink)}
.mm-coach-txt p{font-size:.84rem;color:var(--mm-ink3);line-height:1.6;max-width:420px}
.mm-coach-acts{display:flex;gap:.7rem;flex-shrink:0;flex-wrap:wrap}
.btn-v{
  padding:.62rem 1.35rem;border-radius:100px;
  background:linear-gradient(135deg,var(--mm-lavender),var(--mm-coral));border:none;cursor:pointer;color:#fff;
  font-family:'Space Grotesk',sans-serif;font-size:.85rem;font-weight:700;
  text-decoration:none;display:inline-flex;align-items:center;gap:.4rem;
  box-shadow:0 4px 16px rgba(167,139,250,.3);
  transition:all .22s cubic-bezier(.34,1.56,.64,1);
}
.btn-v:hover{transform:translateY(-2px);box-shadow:0 8px 26px rgba(255,107,157,.4)}
.btn-ghost{
  padding:.62rem 1.35rem;border-radius:100px;
  border:2px solid var(--mm-border2);background:var(--mm-glass);
  cursor:pointer;color:var(--mm-ink2);
  font-family:'Space Grotesk',sans-serif;font-size:.85rem;font-weight:600;
  text-decoration:none;display:inline-flex;align-items:center;gap:.4rem;
  transition:all .2s;
}
.btn-ghost:hover{border-color:var(--mm-lavender);color:var(--mm-lavender-d);background:rgba(167,139,250,.06);transform:translateY(-1px)}

/* ── LOADING ── */
.mm-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;gap:1rem}
.mm-spin{width:42px;height:42px;border-radius:50%;border:3px solid rgba(167,139,250,.2);border-top-color:var(--mm-lavender);animation:mmSpin .75s linear infinite}
@keyframes mmSpin{to{transform:rotate(360deg)}}
.mm-spin-lbl{color:var(--mm-ink3);font-size:.84rem;font-family:'JetBrains Mono',monospace}

/* ── EMPTY STATE ── */
.mm-empty{
  grid-column:1/-1;text-align:center;
  padding:2.5rem;color:var(--mm-ink3);
  font-family:'JetBrains Mono',monospace;font-size:.8rem;
}


/* ── ANIMATIONS ── */
@keyframes mmUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}

/* ── RESPONSIVE ── */
@media(max-width:900px){
  .mm-wrap{padding:1.25rem 1.25rem 3rem}
  .mm-hdr-inner{flex-direction:column;align-items:flex-start}
  .mm-coach-in{flex-direction:column}
  .mm-coach-acts{width:100%}
  .mm-coach-acts .btn-v,.mm-coach-acts .btn-ghost{flex:1;justify-content:center}
  .mm-upgrade-in{flex-direction:column;align-items:flex-start}
  .mm-upgrade-btn{width:100%;justify-content:center}
}
@media(max-width:580px){
  .mm-title{font-size:1.6rem}
  .mm-grid{grid-template-columns:1fr}
  .mm-search input{width:160px}
  .mm-search input:focus{width:190px}
}
`;

/* ── Track progress bar with animation ── */
function TrackBar({ pct, color }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 500); return () => clearTimeout(t); }, [pct]);
  return (
    <div className="mm-track-pbar">
      <div className="mm-track-pfill" style={{ width:`${w}%`, background:color }}/>
    </div>
  );
}

/* ── Overall progress bar ── */
function OverallBar({ pct }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 600); return () => clearTimeout(t); }, [pct]);
  return <div className="mm-overall-bar"><div className="mm-overall-fill" style={{ width:`${w}%` }}/></div>;
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const MyModules = () => {
  const { user, token } = useAuth();
  const [modules,  setModules]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  /* fetch */
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/modules`, { headers:{ Authorization:`Bearer ${token}` } });
        if (res.ok) setModules(await res.json());
      } catch(e){ console.error(e); }
      finally { setLoading(false); }
    })();
  }, [token]);

  /* CSS + fonts */
  useEffect(() => {
    injectFonts();
    let el = document.getElementById('mm-css');
    if (!el) { el=document.createElement('style'); el.id='mm-css'; document.head.appendChild(el); }
    el.textContent = CSS;
  }, []);

  /* derived */
  const totalDone   = modules.filter(m=>m.status==='completed').length;
  const totalPct    = Math.round((totalDone/30)*100);
  const isPremium   = user?.plan === 'premium';

  /* filter by search */
  const q = search.toLowerCase().trim();
  const filtered = q ? modules.filter(m=>m.title?.toLowerCase().includes(q)) : null;

  /* loading */
  if (loading) return (
    <div className="mm-page">
      <style>{CSS}</style>
      <div className="mm-mesh-bg" aria-hidden="true">
        <div className="mesh-blob mm-blob-1"/>
        <div className="mesh-blob mm-blob-2"/>
        <div className="mesh-blob mm-blob-3"/>
      </div>
      <div className="mm-loading">
        <div className="mm-spin"/>
        <p className="mm-spin-lbl">Loading curriculum...</p>
      </div>
    </div>
  );

  /* track stats helper */
  const trackDone = num => modules.filter(m=>m.track===num&&m.status==='completed').length;
  const trackTotal= num => modules.filter(m=>m.track===num).length;

  return (
    <div className="mm-page">

      {/* Ambient gradient-mesh background — same technique as LandingPage/Dashboard */}
      <div className="mm-mesh-bg" aria-hidden="true">
        <div className="mesh-blob mm-blob-1"/>
        <div className="mesh-blob mm-blob-2"/>
        <div className="mesh-blob mm-blob-3"/>
      </div>
      <div className="mm-noise"/>

      <div className="mm-wrap">

        {/* ── PAGE HEADER ── */}
        <div className="mm-hdr">
          <div className="mm-hdr-inner">
            <div>
              <h1 className="mm-title">Startup Curriculum</h1>
              <p className="mm-sub">Complete all 30 modules across 5 tracks to build a venture-grade investor brief.</p>
            </div>
            <div className="mm-hdr-right">
              {/* Overall progress */}
              <div className="mm-overall">
                <span className="mm-overall-num">{totalDone}/30</span>
                <OverallBar pct={totalPct}/>
                <span className="mm-overall-lbl">{totalPct}% done</span>
              </div>
              {/* Search */}
              <div className="mm-search">
                <span className="mm-search-icon">{Ic.Search(13)}</span>
                <input
                  type="text"
                  placeholder="Search modules…"
                  value={search}
                  onChange={e=>setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── UPGRADE BANNER ── */}
        {!isPremium && (
          <div className="mm-upgrade-strip">
            <div className="mm-upgrade-in">
              <div className="mm-upgrade-left">
                <span className="mm-chip">Free Plan</span>
                <p className="mm-upgrade-txt">
                  Track 1 is unlocked.{' '}
                  <span>Upgrade to access all 5 tracks and 30 modules.</span>
                </p>
              </div>
              <Link to="/subscription" className="mm-upgrade-btn">
                Upgrade — ₹399/mo or ₹2,499/yr {Ic.Arrow(13)}
              </Link>
            </div>
          </div>
        )}

        {/* ── SEARCH RESULTS MODE ── */}
        {filtered && (
          <div style={{ animation:'mmUp .4s both' }}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.85rem',flexWrap:'wrap',gap:'.5rem' }}>
              <p style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:'.78rem',color:'var(--mm-ink3)' }}>
                {filtered.length} result{filtered.length!==1?'s':''} for "{search}"
              </p>
              <button onClick={()=>setSearch('')} style={{ background:'none',border:'none',color:'var(--mm-lavender-d)',cursor:'pointer',fontSize:'.78rem',fontFamily:"'Inter',sans-serif" }}>
                Clear search
              </button>
            </div>
            <div className="mm-grid">
              {filtered.length===0
                ? <div className="mm-empty">No modules match your search.</div>
                : filtered.map(mod => <ModCard key={mod.moduleId} mod={mod} user={user} tracks={TRACKS}/>)
              }
            </div>
          </div>
        )}

        {/* ── TRACKS ── */}
        {!filtered && TRACKS.map((track, ti) => {
          const trackMods  = modules.filter(m=>m.track===track.num);
          const done       = trackDone(track.num);
          const total      = trackTotal(track.num);
          const tPct       = total>0 ? Math.round((done/total)*100) : 0;
          const isLocked   = !isPremium && track.num > 1;
          const allDone    = done===total && total>0;

          return (
            <div
              key={track.num}
              className="mm-track"
              style={{ '--tc-color':track.color,'--tc-bdr':track.bdr,'--tc-bg':track.bg, animationDelay:`${ti*.07}s` }}
            >
              {/* Track header */}
              <div className="mm-track-hdr">
                <div className="mm-track-left">
                  <div className="mm-track-ico">{track.Icon(20)}</div>
                  <div>
                    <div className="mm-track-name">Track {track.num} — {track.name}</div>
                    <div className="mm-track-desc">{track.desc}</div>
                  </div>
                </div>
                <div className="mm-track-right">
                  <div className="mm-track-prog">
                    <TrackBar pct={tPct} color={track.color}/>
                    <span>{done}/{total}</span>
                  </div>
                  {isLocked
                    ? <span className="mm-track-badge tb-lock">{Ic.Lock(10)} Upgrade to unlock</span>
                    : allDone
                    ? <span className="mm-track-badge tb-done">{Ic.CheckC(10)} Complete</span>
                    : <span className="mm-track-badge tb-open">{Ic.Zap(10)} In progress</span>
                  }
                </div>
              </div>

              {/* Module grid */}
              <div className="mm-grid">
                {trackMods.length===0
                  ? <div className="mm-empty">No modules in this track yet.</div>
                  : trackMods.map(mod=>(
                    <ModCard key={mod.moduleId} mod={mod} user={user} tracks={TRACKS}/>
                  ))
                }
              </div>
            </div>
          );
        })}

        {/* ── PITCH COACH CTA ── */}
        <div className="mm-coach">
          <div className="mm-coach-in">
            <div className="mm-coach-ico">{Ic.Sparkle(22)}</div>
            <div className="mm-coach-txt">
              <h3>Test your knowledge with Pitch Coach</h3>
              <p>After completing a track, fire your pitch at our Claude-powered AI investor. Get scored on Clarity, Market Fit, and Value Prop — and rebuild weak spots instantly.</p>
            </div>
            <div className="mm-coach-acts">
              <Link to="/pitch-coach" className="btn-v">{Ic.Sparkle(13)} Launch Pitch Coach</Link>
              <Link to="/dashboard"   className="btn-ghost">Back to Dashboard</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MODULE CARD — extracted for reuse in search results
══════════════════════════════════════════════════════════════ */
function ModCard({ mod, user, tracks }) {
  const done    = mod.status==='completed';
  const open    = mod.status==='unlocked' || done;
  const cls     = done?'done':open?'open':'locked';
  const track   = tracks.find(t=>t.num===mod.track)||tracks[0];
  const icoMap  = { 1:'mi-v', 2:'mi-g', 3:'mi-e', 4:'mi-r', 5:'mi-v' };

  return (
    <div className={`mm-mod ${cls}`}>
      {mod.price > 0 && <span className="mm-price">₹{mod.price}</span>}

      <div className="mm-mod-top">
        <span className="mm-mod-num">Module {String(mod.moduleId).padStart(2,'0')}</span>
        <span className={`mm-mod-status ${done?'ms-done':open?'ms-open':'ms-lock'}`}>
          {done ? <>{Ic.CheckC(10)} Complete</>
               : open ? <>{Ic.Zap(10)} Unlocked</>
               : <>{Ic.Lock(10)} Locked</>}
        </span>
      </div>

      <div className="mm-mod-body">
        <div className={`mm-mod-ico ${icoMap[mod.track]||'mi-v'}`}>{track.Icon(17)}</div>
        <div>
          <div className="mm-mod-title">{mod.title}</div>
          {mod.description
            ? <div className="mm-mod-desc">{mod.description}</div>
            : <div className="mm-mod-desc">
                {open
                  ? `Define and map key concepts for ${mod.title}. Produces an exportable deliverable.`
                  : 'Complete prior modules or upgrade to premium to unlock.'}
              </div>
          }
        </div>
      </div>

      <div className="mm-mod-foot">
        <div className="mm-meta">{Ic.Clock(10)} ~25 min</div>
        <div className="mm-meta">{Ic.FileT(10)} Deliverable</div>
        {open
          ? <Link to={`/modules/${mod.moduleId}`} className={`mm-cta ${done?'cta-done':'cta-pri'}`}>
              {done ? <>{Ic.Book(11)} Review</> : <>Start {Ic.Arrow(11)}</>}
            </Link>
          : user?.plan!=='premium'
          ? <Link to="/subscription" className="mm-cta cta-up">{Ic.Sparkle(11)} Upgrade</Link>
          : <span className="mm-cta cta-dis">{Ic.Lock(11)} Locked</span>
        }
      </div>
    </div>
  );
}

export default MyModules;