import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import {
  Command, Mail, Lock, ArrowRight, Chrome, Github,
  Shield, Zap, Globe, Activity, Eye, EyeOff, CheckCircle,
  TrendingUp, MoreHorizontal, Bell,
} from 'lucide-react';

gsap.registerPlugin(TextPlugin);

const C = {
  bg:          '#030712',
  primary:     '#00ff88',
  primaryDim:  'rgba(0,255,136,0.12)',
  primaryBorder:'rgba(0,255,136,0.2)',
  primaryGlow: 'rgba(0,255,136,0.5)',
  secondary:   '#0ea5e9',
  secondaryDim:'rgba(14,165,233,0.15)',
  card:        'rgba(255,255,255,0.05)',
  cardBorder:  'rgba(255,255,255,0.1)',
  grid:        'rgba(255,255,255,0.02)',
  danger:      '#ff3366',
  warning:     '#fbbf24',
  fg:          '#ffffff',
  fgMuted:     'rgba(255,255,255,0.4)',
  fgDim:       'rgba(255,255,255,0.2)',
};

const Sparkline = ({ points, color }) => (
  <svg viewBox="0 0 120 40" className="w-full h-9" preserveAspectRatio="none">
    <defs>
      <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.25" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
    <polygon points={`0,40 ${points} 120,40`} fill={`url(#sg-${color.replace('#','')})`} />
    <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MockupPortfolio = () => (
  <div className="rounded-2xl overflow-hidden select-none"
    style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${C.cardBorder}`,
      boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,136,0.04)`,
      width: 272,
      backdropFilter: 'blur(20px)',
    }}>
    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: C.primaryDim }}>
          <TrendingUp size={10} style={{ color: C.primary }} />
        </div>
        <span className="text-xs font-bold" style={{ color: C.fg }}>Portfolio</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: C.card }}>
          <Bell size={9} style={{ color: C.fgDim }} />
        </div>
        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: C.card }}>
          <MoreHorizontal size={9} style={{ color: C.fgDim }} />
        </div>
      </div>
    </div>
    <div className="px-4 pt-3 pb-2">
      <p className="text-[10px] font-semibold mb-0.5" style={{ color: C.fgMuted }}>Total Balance</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xl font-black leading-none" style={{ color: C.fg }}>$248,914</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: C.primaryDim, color: C.primary, border: `1px solid ${C.primaryBorder}` }}>
              ↑ 18.4%
            </span>
            <span className="text-[9px]" style={{ color: C.fgDim }}>vs last month</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold" style={{ color: C.fgDim }}>P&L Today</p>
          <p className="text-sm font-black" style={{ color: C.primary }}>+$1,241</p>
        </div>
      </div>
      <div className="mt-2">
        <Sparkline color={C.primary} points="0,36 15,28 30,32 45,18 60,22 75,12 90,16 105,6 120,10" />
      </div>
      <div className="mt-2 space-y-1.5">
        {[
          { label: 'Equities', pct: 62, color: C.primary },
          { label: 'Crypto',  pct: 23, color: C.secondary },
          { label: 'Bonds',   pct: 15, color: C.warning },
        ].map(a => (
          <div key={a.label} className="flex items-center gap-2">
            <span className="text-[9px] w-12 flex-shrink-0 font-semibold" style={{ color: C.fgMuted }}>{a.label}</span>
            <div className="flex-1 h-1.5 rounded-full" style={{ background: C.card }}>
              <div className="h-1.5 rounded-full" style={{ width: `${a.pct}%`, background: a.color }} />
            </div>
            <span className="text-[9px] font-bold w-6 text-right" style={{ color: C.fgDim }}>{a.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MockupTransactions = () => (
  <div className="rounded-2xl overflow-hidden select-none"
    style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${C.cardBorder}`,
      boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
      width: 252,
      backdropFilter: 'blur(20px)',
    }}>
    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
      <span className="text-xs font-bold" style={{ color: C.fg }}>Recent Activity</span>
      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
        style={{ background: C.primaryDim, color: C.primary, border: `1px solid ${C.primaryBorder}` }}>
        Live
      </span>
    </div>
    <div className="px-4 py-3 space-y-2.5">
      {[
        { name: 'NVIDIA Corp', ticker: 'NVDA', change: '+$312.40', pct: '+3.4%', pos: true,  letter: 'N', clr: C.primary   },
        { name: 'Apple Inc',   ticker: 'AAPL', change: '+$89.20',  pct: '+1.2%', pos: true,  letter: 'A', clr: C.secondary },
        { name: 'Tesla Inc',   ticker: 'TSLA', change: '-$44.60',  pct: '-1.1%', pos: false, letter: 'T', clr: C.danger    },
        { name: 'Bitcoin',     ticker: 'BTC',  change: '+$1,240',  pct: '+2.8%', pos: true,  letter: '₿', clr: C.warning   },
      ].map((t, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-[10px] font-black"
            style={{ background: `${t.clr}18`, color: t.clr, border: `1px solid ${t.clr}30` }}>
            {t.letter}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold truncate" style={{ color: C.fg }}>{t.name}</p>
            <p className="text-[9px]" style={{ color: C.fgDim }}>{t.ticker}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] font-black" style={{ color: t.pos ? C.primary : C.danger }}>{t.change}</p>
            <p className="text-[9px] font-bold" style={{ color: t.pos ? 'rgba(0,255,136,0.5)' : 'rgba(255,51,102,0.6)' }}>{t.pct}</p>
          </div>
        </div>
      ))}
    </div>
    <div className="px-4 pb-3">
      <div className="flex items-end gap-1 h-8">
        {[40,65,45,80,55,90,70,85,60,75].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 6 ? C.primary : `${C.primary}28` }} />
        ))}
      </div>
      <p className="text-[8px] mt-1 font-semibold" style={{ color: C.fgDim }}>Volume · Last 10 days</p>
    </div>
  </div>
);

const MockupAnalytics = () => (
  <div className="rounded-2xl overflow-hidden select-none"
    style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${C.cardBorder}`,
      boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
      width: 252,
      backdropFilter: 'blur(20px)',
    }}>
    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
      <span className="text-xs font-bold" style={{ color: C.fg }}>Analytics</span>
      <div className="flex gap-1">
        {['1D','1W','1M'].map((t, i) => (
          <span key={t} className="text-[8px] font-bold px-1.5 py-0.5 rounded"
            style={{
              background: i === 2 ? C.primaryDim : 'transparent',
              color: i === 2 ? C.primary : C.fgDim,
              border: i === 2 ? `1px solid ${C.primaryBorder}` : '1px solid transparent',
            }}>{t}</span>
        ))}
      </div>
    </div>
    <div className="px-4 py-3 flex items-center gap-4">
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
          <circle cx="32" cy="32" r="24" fill="none" stroke={C.card} strokeWidth="8" />
          <circle cx="32" cy="32" r="24" fill="none" stroke={C.primary} strokeWidth="8" strokeDasharray="94 57" strokeLinecap="round" />
          <circle cx="32" cy="32" r="24" fill="none" stroke={C.secondary} strokeWidth="8" strokeDasharray="36 115" strokeDashoffset="-94" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-black" style={{ color: C.fg }}>62%</span>
        </div>
      </div>
      <div className="space-y-1.5">
        {[
          { l: 'Profit',   v: '$31.2K', clr: C.primary   },
          { l: 'Invested', v: '$18.4K', clr: C.secondary },
          { l: 'Cash',     v: '$9.8K',  clr: C.fgDim     },
        ].map(s => (
          <div key={s.l} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.clr }} />
            <span className="text-[9px] font-semibold" style={{ color: C.fgMuted }}>{s.l}</span>
            <span className="text-[9px] font-black ml-auto pl-2" style={{ color: C.fg }}>{s.v}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-2 divide-x" style={{ borderTop: `1px solid ${C.cardBorder}`, borderColor: C.cardBorder }}>
      {[
        { label: 'Win Rate', val: '73%',  delta: '↑ 4%'  },
        { label: 'Sharpe',   val: '2.41', delta: '↑ 0.3' },
      ].map(s => (
        <div key={s.label} className="px-3 py-2.5" style={{ borderColor: C.cardBorder }}>
          <p className="text-[9px] font-semibold mb-0.5" style={{ color: C.fgDim }}>{s.label}</p>
          <p className="text-sm font-black leading-none" style={{ color: C.fg }}>{s.val}</p>
          <p className="text-[9px] font-bold mt-0.5" style={{ color: C.primary }}>{s.delta}</p>
        </div>
      ))}
    </div>
  </div>
);

const Feature = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3">
    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: C.primaryDim, border: `1px solid ${C.primaryBorder}` }}>
      <Icon size={10} style={{ color: C.primary }} />
    </div>
    <span className="text-[12px] font-medium" style={{ color: C.fgMuted }}>{text}</span>
  </div>
);

const Login = () => {
  const navigate   = useNavigate();
  const containerRef = useRef(null);
  const [loading,  setLoading]  = useState(false);
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [focused,  setFocused]  = useState(null);

  useGSAP(() => {
    gsap.set('.lp-left',    { x: -50, opacity: 0 });
    gsap.set('.lp-right',   { x:  50, opacity: 0 });
    gsap.set('.lp-divider', { scaleY: 0, transformOrigin: 'top' });
    gsap.set('.char-r',     { y: '110%', rotateX: 50, opacity: 0 });
    gsap.set('.sub-r',      { y: 12, opacity: 0 });
    gsap.set('.feat-r',     { x: -16, opacity: 0 });
    gsap.set('.proof-r',    { y: 10, opacity: 0 });
    gsap.set('.card-1',     { y: 40, opacity: 0, rotate: -3 });
    gsap.set('.card-2',     { y: 60, opacity: 0, rotate:  3 });
    gsap.set('.card-3',     { y: 80, opacity: 0, rotate: -2 });
    gsap.set('.rf-el',      { y: 22, opacity: 0 });
    gsap.set('.badge-r',    { scale: 0.75, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.lp-left',    { x: 0, opacity: 1, duration: 0.85 }, 0)
      .to('.lp-right',   { x: 0, opacity: 1, duration: 0.85 }, 0.1)
      .to('.lp-divider', { scaleY: 1, duration: 1.1, ease: 'power3.inOut' }, 0.2)
      .to('.badge-r',    { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }, 0.55)
      .to('.char-r',     { y: '0%', rotateX: 0, opacity: 1, stagger: 0.018, duration: 0.6 }, 0.65)
      .to('.sub-r',      { y: 0, opacity: 1, duration: 0.6 }, 1.25)
      .to('.feat-r',     { x: 0, opacity: 1, stagger: 0.09, duration: 0.55 }, 1.4)
      .to('.proof-r',    { y: 0, opacity: 1, duration: 0.5 }, 1.8)
      .to('.card-1',     { y: 0, opacity: 1, rotate: -3, duration: 0.9, ease: 'power4.out' }, 1.0)
      .to('.card-2',     { y: 0, opacity: 1, rotate:  2, duration: 0.9, ease: 'power4.out' }, 1.15)
      .to('.card-3',     { y: 0, opacity: 1, rotate: -1.5, duration: 0.9, ease: 'power4.out' }, 1.3)
      .to('.rf-el',      { y: 0, opacity: 1, stagger: 0.08, duration: 0.6 }, 0.8);

    gsap.to('.card-1', { y: -10, x:  4, duration: 4.0, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5 });
    gsap.to('.card-2', { y:   8, x: -5, duration: 5.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.0 });
    gsap.to('.card-3', { y:  -7, x:  3, duration: 3.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.2 });
    gsap.to('.orb-a', { scale: 1.18, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.orb-b', { scale: 1.22, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 });
    gsap.to('.live-dot', { scale: 1.6, opacity: 0.4, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.fromTo('.scan-line', { y: '-2px' }, { y: '100vh', duration: 5, repeat: -1, ease: 'none', delay: 1.5 });
  }, { scope: containerRef });

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    gsap.to(containerRef.current, {
      opacity: 0, scale: 1.03, filter: 'blur(10px)',
      duration: 0.6, ease: 'power3.inOut',
      onComplete: () => navigate('/dashboard'),
    });
  };

  const headlineLines = [
    { text: 'A Unified Hub for',  accent: false },
    { text: 'Smarter Financial',  accent: true  },
    { text: 'Decisions.',         accent: true  },
  ];

  return (
    <div ref={containerRef} className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden font-sans" style={{ background: C.bg }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, ${C.grid} 1px, transparent 1px), linear-gradient(to bottom, ${C.grid} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />
        <div className="orb-a absolute top-[0%] left-[5%] w-[600px] h-[600px] rounded-full"
          style={{ background: `radial-gradient(circle, rgba(0,255,136,0.07) 0%, transparent 65%)`, filter: 'blur(40px)' }} />
        <div className="orb-b absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 65%)`, filter: 'blur(50px)' }} />
        <div className="scan-line absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent 10%, ${C.primary}50 50%, transparent 90%)` }} />
      </div>
      <div className="lp-left relative flex-1 hidden lg:flex overflow-hidden" style={{ minWidth: 0 }}>
        <div className="flex flex-col justify-between py-10 px-10 xl:px-14 z-10 relative w-1/2 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: C.primaryDim, border: `1px solid ${C.primaryBorder}` }}>
              <Command size={18} style={{ color: C.primary }} />
            </div>
            <div className="text-sm font-black leading-none font-heading">
              <span style={{ color: C.fg }}>Nexus</span>
              <span style={{ color: C.primary }}> Finance</span>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="badge-r inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full" style={{ background: C.primaryDim, border: `1px solid ${C.primaryBorder}` }}>
              <span className="live-dot w-1.5 h-1.5 rounded-full" style={{ background: C.primary, boxShadow: `0 0 6px ${C.primaryGlow}` }} />
              <span className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: C.primary }}>Nexus Finance · Protocol v2.1</span>
            </div>
            <div className="[perspective:1000px]">
              <h1 className="font-black tracking-tight font-heading m-0 p-0" style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.6rem)', lineHeight: 1.08 }}>
                {headlineLines.map((line, li) => (
                  <div key={li} className="overflow-hidden block" style={{ display: 'block' }}>
                    {line.text.split('').map((char, ci) => (
                      <span key={`${li}-${ci}`} className="char-r inline-block"
                        style={{
                          color:      line.accent ? C.primary : C.fg,
                          textShadow: line.accent ? `0 0 18px ${C.primaryGlow}` : 'none',
                          whiteSpace: char === ' ' ? 'pre' : 'normal',
                        }}>{char === ' ' ? '\u00A0' : char}</span>
                    ))}
                  </div>
                ))}
              </h1>
            </div>
            <p className="sub-r text-sm leading-relaxed" style={{ color: C.fgMuted, maxWidth: 310 }}>Nexus empowers you with a unified financial command center — delivering deep insights and a 360° view of your entire economic world.</p>
            <div className="flex flex-col gap-2.5">
              {[
                { icon: Shield, text: 'Bank-grade AES-256 encryption' },
                { icon: Zap,    text: 'Real-time AI portfolio intelligence' },
                { icon: Globe,  text: 'Multi-currency across 180+ markets'  },
                { icon: Activity,text:'Sub-100ms latency · 99.99% uptime'   },
              ].map((f, i) => (
                <div key={i} className="feat-r"><Feature icon={f.icon} text={f.text} /></div>
              ))}
            </div>
            <div className="proof-r flex items-center gap-3">
              <div className="flex -space-x-2">
                {[C.primary, C.secondary, C.warning, C.danger, '#a855f7'].map((clr, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-black"
                    style={{ background: `${clr}20`, borderColor: clr, color: clr, zIndex: 5 - i }}>{String.fromCharCode(65 + i)}</div>
                ))}
              </div>
              <div>
                <p className="text-xs font-black" style={{ color: C.fg }}>2,400+ finance teams</p>
                <div className="flex gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3 h-3" fill={C.warning} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="proof-r flex items-center gap-4 pt-4" style={{ borderTop: `1px solid ${C.cardBorder}` }}>
            {['SOC 2 Type II', 'ISO 27001', 'GDPR Ready'].map(b => (
              <div key={b} className="flex items-center gap-1.5">
                <Shield size={9} style={{ color: `${C.primary}60` }} />
                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: C.fgDim }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: `linear-gradient(to right, ${C.bg}, transparent)` }} />
          <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none" style={{ background: `linear-gradient(to left, ${C.bg}, transparent)` }} />
          <div className="absolute top-0 left-0 right-0 h-12 z-10 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${C.bg}, transparent)` }} />
          <div className="absolute bottom-0 left-0 right-0 h-12 z-10 pointer-events-none" style={{ background: `linear-gradient(to top, ${C.bg}, transparent)` }} />
          <div className="relative" style={{ width: 290, height: 510 }}>
            <div className="card-1 absolute" style={{ top: 0, left: 0, zIndex: 3 }}><MockupPortfolio /></div>
            <div className="card-2 absolute" style={{ top: 135, right: -24, zIndex: 2 }}><MockupTransactions /></div>
            <div className="card-3 absolute" style={{ bottom: 0, left: 8, zIndex: 1 }}><MockupAnalytics /></div>
          </div>
        </div>
      </div>
      <div className="lp-divider hidden lg:flex flex-shrink-0 w-px self-stretch" style={{ background: `linear-gradient(to bottom, transparent, ${C.primaryBorder} 25%, ${C.cardBorder} 75%, transparent)` }} />
      <div className="lp-right flex-1 lg:flex-none flex items-center justify-center px-6 md:px-10 xl:px-14 bg-background lg:bg-transparent" style={{ width: 'auto', lgWidth: '38%', minWidth: 320 }}>
        <div className="w-full" style={{ maxWidth: 400 }}>
          <div className="rf-el mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-5" style={{ background: C.primaryDim, border: `1px solid ${C.primaryBorder}` }}>
              <CheckCircle size={11} style={{ color: C.primary }} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: C.primary }}>Secure Connection</span>
            </div>
            <h2 className="font-black text-[2rem] leading-tight mb-2 font-heading" style={{ color: C.fg }}>Welcome back</h2>
            <p className="text-sm" style={{ color: C.fgMuted }}>Sign in to your Nexus account to continue.</p>
          </div>
          <div className="rf-el flex mb-7 rounded-2xl p-1" style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
            {['Sign In', 'Sign Up'].map((t, i) => (
              <button key={t} type="button" className="flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-200"
                style={{
                  background: i === 0 ? C.primaryDim : 'transparent',
                  color: i === 0 ? C.primary : C.fgDim,
                  border: i === 0 ? `1px solid ${C.primaryBorder}` : '1px solid transparent',
                }}>{t}</button>
            ))}
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="rf-el space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: C.fgMuted }}>Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150"
                  style={{ color: focused === 'email' ? C.primary : C.fgDim }} />
                <input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address" onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} className="w-full rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:outline-none transition-all duration-200"
                  style={{
                    background: focused === 'email' ? 'rgba(0,255,136,0.04)' : C.card,
                    border: focused === 'email' ? `1px solid ${C.primaryBorder}` : `1px solid ${C.cardBorder}`,
                    color: C.fg,
                    caretColor: C.primary,
                    boxShadow: focused === 'email' ? `0 0 0 3px rgba(0,255,136,0.07)` : 'none',
                  }} />
              </div>
            </div>
            <div className="rf-el space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: C.fgMuted }}>Password</label>
                <button type="button" className="text-[10px] font-bold transition-colors hover:underline" style={{ color: `${C.primary}90` }}>Forgot password?</button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150"
                  style={{ color: focused === 'pass' ? C.primary : C.fgDim }} />
                <input type={showPass ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" onFocus={() => setFocused('pass')} onBlur={() => setFocused(null)} className="w-full rounded-2xl py-3.5 pl-11 pr-11 text-sm font-medium focus:outline-none transition-all duration-200"
                  style={{
                    background: focused === 'pass' ? 'rgba(0,255,136,0.04)' : C.card,
                    border: focused === 'pass' ? `1px solid ${C.primaryBorder}` : `1px solid ${C.cardBorder}`,
                    color: C.fg,
                    caretColor: C.primary,
                    boxShadow: focused === 'pass' ? `0 0 0 3px rgba(0,255,136,0.07)` : 'none',
                  }} />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: C.fgDim }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div className="rf-el pt-1">
              <button id="login-submit-btn" type="submit" disabled={loading} className="relative w-full py-4 rounded-2xl font-black uppercase tracking-[0.12em] text-[11px] flex items-center justify-center gap-2 overflow-hidden group transition-all active:scale-[0.98] disabled:opacity-60"
                style={{
                  background: `linear-gradient(135deg, ${C.primary} 0%, #00cc6a 100%)`,
                  color: C.bg,
                  boxShadow: `0 0 30px rgba(0,255,136,0.25), 0 4px 20px rgba(0,255,136,0.15)`,
                }}>
                <div className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-[#030712]/30 border-t-[#030712] rounded-full animate-spin" /> Authenticating...Units</>
                  ) : (
                    <>Sign In <ArrowRight size={13} /></>
                  )}
                </span>
              </button>
            </div>
          </form>
          <div className="rf-el relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: `1px solid ${C.cardBorder}` }} />
            </div>
            <span className="relative px-3 text-[9px] font-black uppercase tracking-[0.2em]" style={{ background: C.bg, color: C.fgDim }}>Or continue with</span>
          </div>
          <div className="rf-el grid grid-cols-2 gap-3">
            {[ { icon: Chrome, label: 'Google' }, { icon: Github, label: 'GitHub' } ].map(b => (
              <button key={b.label} id={`oauth-${b.label.toLowerCase()}-btn`} type="button" className="flex items-center justify-center gap-2 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.fgMuted }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = C.primaryBorder; e.currentTarget.style.color = C.fg; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.card; e.currentTarget.style.borderColor = C.cardBorder; e.currentTarget.style.color = C.fgMuted; }}
              ><b.icon size={14} /> {b.label}</button>
            ))}
          </div>
          <p className="rf-el text-center text-[11px] font-medium mt-7" style={{ color: C.fgDim }}>Don't have an account? <button className="font-bold hover:underline" style={{ color: C.primary }}>Request Node Access</button></p>
          <p className="rf-el text-center text-[9px] mt-2" style={{ color: 'rgba(255,255,255,0.15)' }}>By signing in, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
