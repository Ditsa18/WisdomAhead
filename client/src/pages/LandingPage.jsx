import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles, BookOpen, MapPin, CheckCircle, BrainCircuit
} from 'lucide-react';

// ─── Inline styles object ───────────────────────────────────────────────────
const S = {
  root: { minHeight: '100vh', background: '#09090f', color: '#e8e8f0', fontFamily: 'system-ui, sans-serif', overflowX: 'hidden' },

  // NAV
  nav: { position: 'sticky', top: 0, zIndex: 100, background: 'rgba(9,9,15,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { width: 36, height: 36, background: '#6c63ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', color: '#fff', animation: 'mlFloat 3s ease infinite' },
  logoText: { fontWeight: 800, fontSize: '1.2rem' },
  navLinks: { display: 'flex', gap: 6, alignItems: 'center' },

  // HERO
  hero: { textAlign: 'center', padding: '6rem 2rem 4rem', position: 'relative', overflow: 'hidden', animation: 'mlFadeUp 0.7s 0.1s both' },
  heroGlow: { position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)', top: -200, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' },
  heroBadge: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: '#6c63ff', borderRadius: 100, padding: '5px 14px', fontSize: 13, fontWeight: 600 },
  heroH1: { fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 1.1, fontWeight: 900, margin: '1.5rem auto', maxWidth: 780, letterSpacing: '-1.5px' },
  heroAccent: { background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  heroSub: { fontSize: '1.15rem', color: '#a0a0b8', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.7 },
  heroCtas: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  heroPills: { display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' },
  heroPill: { display: 'flex', alignItems: 'center', gap: 6, color: '#a0a0b8', fontSize: 14 },

  // SECTION SHELL
  sectionInner: (maxW = 1100) => ({ padding: '5rem 2rem', maxWidth: maxW, margin: '0 auto' }),
  sectionLabel: { textAlign: 'center', color: '#6c63ff', fontWeight: 700, fontSize: 13, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.75rem' },
  sectionH2: { textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '3.5rem' },
  sectionSub: { textAlign: 'center', color: '#a0a0b8', marginBottom: '3.5rem' },

  divider: { height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)' },

  // CARDS
  card: { background: '#0f0f1e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'all 0.3s cubic-bezier(.4,0,.2,1)', cursor: 'default' },
  iconBox: (bg, color) => ({ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, color }),

  // STEP CARDS
  stepCard: { background: '#0f0f1e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.75rem', transition: 'all 0.3s', cursor: 'default' },
  stepNum: { fontSize: '2.5rem', fontWeight: 900, color: 'rgba(108,99,255,0.25)', lineHeight: 1, marginBottom: '0.75rem' },

  // PRICE
  priceCard: (featured) => ({ background: '#0f0f1e', border: featured ? '1.5px solid #f5a623' : '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '2rem', flex: 1, position: 'relative', transition: 'all 0.3s', minWidth: 260 }),
  priceBadge: { position: 'absolute', top: -14, right: 20, background: '#f5a623', color: '#1a0f00', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 100 },

  // REGION
  regionTag: { background: '#0f0f1e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.25s', cursor: 'default' },
  regionCode: { width: 38, height: 38, background: 'rgba(108,99,255,0.12)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#6c63ff', flexShrink: 0 },

  // FOOTER
  footer: { borderTop: '1px solid rgba(255,255,255,0.05)', padding: '2.5rem 2rem', background: '#06060d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginTop: '2rem' },
  footerLink: { color: '#a0a0b8', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' },
};

// ─── Keyframe injection ─────────────────────────────────────────────────────
const injectKeyframes = () => {
  if (document.getElementById('ml-keyframes')) return;
  const style = document.createElement('style');
  style.id = 'ml-keyframes';
  style.textContent = `
    @keyframes mlFadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    @keyframes mlFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
    @keyframes mlPulse { 0%,100% { box-shadow:0 0 0 0 rgba(108,99,255,0.5); } 70% { box-shadow:0 0 0 12px rgba(108,99,255,0); } }
    .ml-card:hover { border-color:rgba(108,99,255,0.38)!important; transform:translateY(-4px); box-shadow:0 20px 60px rgba(108,99,255,0.12); }
    .ml-step:hover { border-color:rgba(108,99,255,0.4)!important; transform:translateY(-4px); }
    .ml-region:hover { border-color:rgba(108,99,255,0.4)!important; background:rgba(108,99,255,0.07)!important; transform:scale(1.02); }
    .ml-price:hover { transform:translateY(-4px); }
    .ml-nav-link:hover { color:#fff!important; background:rgba(255,255,255,0.07)!important; }
    .ml-footer-link:hover { color:#e8e8f0!important; }
    .ml-btn-primary { background:#6c63ff!important; color:#fff!important; border:none!important; padding:0.85rem 2rem!important; border-radius:10px!important; font-size:1rem!important; font-weight:600!important; cursor:pointer!important; transition:all 0.25s!important; animation:mlPulse 2.5s infinite; }
    .ml-btn-primary:hover { background:#7b73ff!important; box-shadow:0 8px 30px rgba(108,99,255,0.4)!important; transform:translateY(-1px)!important; }
    .ml-btn-outline { background:transparent!important; color:#e8e8f0!important; border:1px solid rgba(255,255,255,0.2)!important; padding:0.85rem 2rem!important; border-radius:10px!important; font-size:1rem!important; cursor:pointer!important; transition:all 0.25s!important; }
    .ml-btn-outline:hover { background:rgba(255,255,255,0.06)!important; border-color:rgba(255,255,255,0.35)!important; }
    .ml-btn-outline-sm { background:transparent!important; color:#e8e8f0!important; border:1px solid rgba(255,255,255,0.2)!important; padding:7px 16px!important; border-radius:8px!important; font-size:15px!important; cursor:pointer!important; transition:all 0.2s!important; }
    .ml-btn-outline-sm:hover { color:#fff!important; background:rgba(255,255,255,0.07)!important; border-color:rgba(255,255,255,0.3)!important; }
  `;
  document.head.appendChild(style);
};

// ─── Sub-components ─────────────────────────────────────────────────────────
const Divider = () => <div style={S.divider} />;

const CheckItem = ({ color = '#4caf50', children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
    <span style={{ color }}>✓</span> {children}
  </div>
);

const regions = [
  { name: 'United States', code: 'US' },
  { name: 'India', code: 'IN' },
  { name: 'United Arab Emirates', code: 'UAE' },
  { name: 'Saudi Arabia', code: 'SA' },
  { name: 'Egypt', code: 'EG' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Jordan', code: 'JO' },
  { name: 'Qatar', code: 'QA' },
];

// ─── Main Component ──────────────────────────────────────────────────────────
const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => { injectKeyframes(); }, []);

  const handleDemoClick = () => navigate(user ? '/dashboard' : '/register');

  return (
    <div style={S.root}>

      {/* ── NAV ── */}
      <nav style={S.nav}>
        <div style={S.logo}>
          <div style={S.logoIcon}>M</div>
          <span style={S.logoText}>Mind<span style={{ color: '#6c63ff' }}>Launch</span></span>
        </div>
        <div style={S.navLinks}>
          {user ? (
            <Link to="/dashboard" className="ml-btn-primary" style={{ textDecoration: 'none', padding: '8px 20px', fontSize: 14 }}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="ml-btn-outline-sm" style={{ textDecoration: 'none' }}>Log In</Link>
              <Link to="/register" className="ml-btn-primary" style={{ textDecoration: 'none', padding: '8px 20px', fontSize: 14 }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={S.hero}>
        <div style={S.heroGlow} />
        <div style={S.heroBadge}><Sparkles size={13} /> Empowering Global Entrepreneurs</div>
        <h1 style={S.heroH1}>
          Launch Your Startup with{' '}
          <span style={S.heroAccent}>AI-Guided</span> Learning
        </h1>
        <p style={S.heroSub}>
          Master customer discovery, model projections, and fundraising.
          Get coached by Claude-powered investor mentors tuned to your local market.
        </p>
        <div style={S.heroCtas}>
          <Link to="/register" className="ml-btn-primary" style={{ textDecoration: 'none', fontSize: '1.05rem' }}>
            Get Started Free →
          </Link>
          <button className="ml-btn-outline" onClick={handleDemoClick} style={{ fontSize: '1.05rem' }}>
            Try Demo
          </button>
        </div>
        <div style={S.heroPills}>
          {['No credit card required', '30 structured modules', '9 global markets'].map((t) => (
            <div key={t} style={S.heroPill}><span style={{ color: '#4caf50', fontSize: 16 }}>✓</span> {t}</div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── FEATURES ── */}
      <section style={{ animation: 'mlFadeUp 0.7s 0.2s both' }}>
        <div style={S.sectionInner()}>
          <p style={S.sectionLabel}>WHY MINDLAUNCH</p>
          <h2 style={S.sectionH2}>Built for founders who move fast</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: '1.5rem' }}>
            {[
              { icon: <BrainCircuit size={22} />, bg: 'rgba(108,99,255,0.15)', color: '#6c63ff', title: 'AI Venture Mentor', body: 'Claude-powered pitch coach with real-time feedback, mock Q&A, and readiness reports scored across Clarity, Market, and Value Prop.' },
              { icon: <BookOpen size={22} />, bg: 'rgba(76,175,80,0.12)', color: '#4caf50', title: '30 Structured Modules', body: '5 tracks: Foundations, Finance, Operations, Marketing, and Fundraising. Complete action items and export to PDF or Word.' },
              { icon: <MapPin size={22} />, bg: 'rgba(245,166,35,0.12)', color: '#f5a623', title: 'Built For Your Region', body: 'Customized templates and regulatory guidance for the US, GCC (UAE, Saudi Arabia, Qatar), and African tech ecosystems.' },
            ].map((f) => (
              <div key={f.title} className="ml-card" style={S.card}>
                <div style={S.iconBox(f.bg, f.color)}>{f.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{f.title}</h3>
                <p style={{ color: '#a0a0b8', fontSize: '0.92rem', lineHeight: 1.7 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── HOW IT WORKS ── */}
      <section style={{ animation: 'mlFadeUp 0.7s 0.25s both' }}>
        <div style={S.sectionInner()}>
          <p style={S.sectionLabel}>HOW IT WORKS</p>
          <h2 style={S.sectionH2}>Four steps to investor-ready</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.5rem' }}>
            {[
              { num: '01', title: 'Onboard & Describe', body: 'Describe your startup idea and select your category and target region.' },
              { num: '02', title: 'Complete Modules', body: 'Learn key concepts and fill out deliverables for each module.' },
              { num: '03', title: 'Sharpen with Coach', body: 'Engage with our AI investor coach to stress-test your assumptions.' },
              { num: '04', title: 'Export Startup Brief', body: 'Export pitch summaries and legal docs directly to PDF or Word.' },
            ].map((s) => (
              <div key={s.num} className="ml-step" style={S.stepCard}>
                <div style={S.stepNum}>{s.num}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ color: '#a0a0b8', fontSize: '0.88rem', lineHeight: 1.6 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── PRICING ── */}
      <section style={{ animation: 'mlFadeUp 0.7s 0.3s both' }}>
        <div style={S.sectionInner(900)}>
          <p style={S.sectionLabel}>PRICING</p>
          <h2 style={{ ...S.sectionH2, marginBottom: '0.5rem' }}>Simple, transparent pricing</h2>
          <p style={{ ...S.sectionSub }}>No hidden fees. Cancel anytime.</p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>

            {/* Basic */}
            <div className="ml-price" style={S.priceCard(false)}>
              <div style={{ fontSize: 13, color: '#a0a0b8', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Basic</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.25rem' }}>Free</div>
              <div style={{ color: '#a0a0b8', fontSize: 14, marginBottom: '1.75rem' }}>Demo mode · No card needed</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '2rem' }}>
                <CheckItem>Track 1: Module 1 unlocked</CheckItem>
                <CheckItem>AI Pitch Coach chat</CheckItem>
                <CheckItem>Basic PDF generation</CheckItem>
              </div>
              <Link to="/register" className="ml-btn-outline" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', padding: '0.75rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', color: '#e8e8f0', transition: 'all 0.25s', fontSize: 15 }}>
                Get Started Free
              </Link>
            </div>

            {/* Premium */}
            <div className="ml-price" style={S.priceCard(true)}>
              <div style={S.priceBadge}>⭐ Recommended</div>
              <div style={{ fontSize: 13, color: '#f5a623', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Premium</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.1rem' }}>₹999</div>
              <div style={{ color: '#a0a0b8', fontSize: 14, marginBottom: '1.75rem' }}>per year · ₹99/month</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '2rem' }}>
                <CheckItem color="#f5a623">All 30 modules (5 tracks)</CheckItem>
                <CheckItem color="#f5a623">Complete AI Pitch Coach reports</CheckItem>
                <CheckItem color="#f5a623">DOCX + PDF downloads</CheckItem>
                <CheckItem color="#f5a623">Priority regional templates</CheckItem>
              </div>
              <Link to="/register" className="ml-btn-primary" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', padding: '0.75rem', borderRadius: 10, fontSize: 15 }}>
                Upgrade Now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── REGIONS ── */}
      <section style={{ animation: 'mlFadeUp 0.7s 0.35s both' }}>
        <div style={S.sectionInner()}>
          <p style={S.sectionLabel}>GLOBAL REACH</p>
          <h2 style={{ ...S.sectionH2, marginBottom: '0.5rem' }}>Markets we support</h2>
          <p style={S.sectionSub}>Localized coaching, templates, and regulatory frameworks.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem' }}>
            {regions.map((r) => (
              <div key={r.code} className="ml-region" style={S.regionTag}>
                <div style={S.regionCode}>{r.code}</div>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{r.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={S.footer}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 26, height: 26, background: '#6c63ff', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem', color: '#fff' }}>M</div>
            <span style={{ fontWeight: 800 }}>MindLaunch</span>
          </div>
          <p style={{ color: '#a0a0b8', fontSize: 13 }}>© 2026 MindLaunch. All rights reserved.</p>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Privacy Policy', 'Terms of Service', 'Support'].map((l) => (
            <a key={l} href="#" className="ml-footer-link" style={S.footerLink}>{l}</a>
          ))}
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;