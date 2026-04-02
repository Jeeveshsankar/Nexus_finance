import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import CountUp from 'react-countup';
import { ArrowUpRight, Wallet, TrendingUp, PiggyBank, Activity, ShieldCheck, Zap, Target, Cpu } from 'lucide-react';
import { Card, cn } from '../components/ui/Card';
import useFinanceStore from '../store/useFinanceStore';
import AreaChartComponent from '../components/charts/AreaChartComponent';
import CategoryList from '../components/charts/CategoryList';
import InsightsPanel from '../components/dashboard/InsightsPanel';

const StatCard = ({ title, value, icon, trend, loading, isPercent, type }) => (
  <Card className={cn(
    "stat-card p-6 transition-all duration-500 min-h-[140px] flex flex-col justify-between",
    loading ? "animate-pulse" : "hover:bg-primary/[0.02]"
  )}>
    {loading ? (
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="h-4 w-20 bg-white/5 rounded" />
          <div className="h-10 w-10 bg-white/5 rounded-full" />
        </div>
        <div className="h-8 w-24 bg-white/5 rounded" />
      </div>
    ) : (
      <>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-foreground-muted font-black text-[10px] uppercase tracking-[0.2em]">{title}</p>
            <h3 className={cn(
              "text-2xl font-bold font-sans mt-2 tracking-tight",
              type === 'primary' ? 'text-primary' : type === 'danger' ? 'text-danger' : type === 'secondary' ? 'text-secondary' : 'text-foreground'
            )}>
              {isPercent ? '' : '₹'}<CountUp end={value} duration={2} separator="," decimals={isPercent ? 1 : 0} />{isPercent ? '%' : ''}
              {type === 'primary' && <span className="text-[10px] ml-2 opacity-40 font-mono">NODE_UP</span>}
            </h3>
          </div>
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
            type === 'primary' ? 'bg-primary/10 text-primary' : type === 'danger' ? 'bg-danger/10 text-danger' : type === 'secondary' ? 'bg-secondary/10 text-secondary' : 'bg-foreground/5 text-foreground-muted'
          )}>
            {icon}
          </div>
        </div>
        {trend && (
          <div className="mt-6 flex items-center text-[10px] font-black tracking-widest uppercase">
            <span className="flex items-center text-primary"><ArrowUpRight size={14} className="mr-1"/> {trend}</span>
            <span className="text-foreground-muted/40 ml-3">Efficiency_Index</span>
          </div>
        )}
      </>
    )}
  </Card>
);

const Dashboard = () => {
  const containerRef = useRef(null);
  const { transactions } = useFinanceStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  useGSAP(() => {
    gsap.from('.dashboard-reveal', {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'expo.out',
      clearProps: 'all'
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-8 pb-20">
      <div className="dashboard-reveal flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-2">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--primary)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary">Protocol Active</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-sans tracking-tight text-foreground leading-none">Command Center</h1>
          <p className="text-foreground-muted font-medium text-sm">Orchestrating your financial ecosystem in real-time.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-6 py-3 bg-card-bg border border-card-border rounded-2xl flex items-center gap-4 shadow-xl">
              <div className="text-right">
                 <p className="text-[9px] font-black uppercase tracking-widest text-foreground-muted leading-none mb-1">Market_Pulse</p>
                 <p className="text-sm font-bold font-mono text-primary">+2.4%</p>
              </div>
              <Activity size={24} className="text-primary/40" />
           </div>
           <div className="px-6 py-3 bg-card-bg border border-card-border rounded-2xl flex items-center gap-4 shadow-xl">
              <div className="text-right">
                 <p className="text-[9px] font-black uppercase tracking-widest text-foreground-muted leading-none mb-1">System_Health</p>
                 <p className="text-sm font-bold font-mono text-secondary">A++</p>
              </div>
              <ShieldCheck size={24} className="text-secondary/40" />
           </div>
        </div>
      </div>

      <div className="dashboard-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Liquidity" value={balance} icon={<Wallet size={24}/>} trend="+12.5%" loading={isLoading} type="default" />
        <StatCard title="Inbound Flow" value={income} icon={<TrendingUp size={24}/>} loading={isLoading} type="primary" />
        <StatCard title="Outbound Flow" value={expenses} icon={<TrendingUp size={24} className="rotate-180"/>} loading={isLoading} type="danger" />
        <StatCard title="Reserve Ratio" value={savingsRate} isPercent icon={<PiggyBank size={24}/>} loading={isLoading} type="secondary" />
      </div>

      <div className="dashboard-reveal grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Card className="p-8 group">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-black font-heading text-foreground tracking-tight">Growth Trajectory</h3>
                <p className="text-xs text-foreground-muted mt-1 uppercase tracking-widest font-black opacity-40">Cumulative Protocol Performance</p>
              </div>
              <div className="flex gap-2">
                 {['1D', '1W', '1M', '1Y'].map(t => (
                   <button key={t} className="w-10 h-10 rounded-xl border border-card-border text-[10px] font-black hover:bg-primary/10 hover:text-primary transition-all">{t}</button>
                 ))}
              </div>
            </div>
            <div className="h-[300px] md:h-[400px] w-full">
              <AreaChartComponent data={transactions} />
            </div>
          </Card>
  
          <Card className="p-8">
             <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                 <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <Target size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black font-heading text-foreground">Transaction Stream</h3>
                    <p className="text-xs text-foreground-muted uppercase tracking-widest font-black opacity-40">Live Ledger Updates</p>
                 </div>
              </div>
              <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:underline">View Full Ledger</button>
            </div>
            <div className="space-y-3">
              {(transactions || []).slice(0, 8).map((tx) => {
                const isIncome = tx?.type === 'income';
                return (
                  <div key={tx?.id || Math.random()} className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-card-border hover:bg-white/[0.05] hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                        isIncome ? 'bg-primary/10 text-primary' : 'bg-foreground/5 text-foreground-muted'
                      )}>
                        <Cpu size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm tracking-tight">{tx?.category || 'General'}</p>
                        <p className="text-[10px] text-foreground-muted font-black uppercase tracking-widest mt-1">
                          {tx?.date ? new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-mono font-black text-lg tracking-tighter",
                        isIncome ? 'text-primary' : 'text-foreground'
                      )}>
                        {isIncome ? '+' : '-'}₹{(tx?.amount || 0).toLocaleString('en-IN')}
                      </p>
                      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-foreground-muted/30">CONFIRMED_BLOCK</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6 md:space-y-8 min-w-0 overflow-hidden">
          <Card className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black font-heading text-foreground tracking-tight">Flow Distribution</h3>
              <p className="text-[10px] text-foreground-muted font-black uppercase tracking-widest opacity-40">BY_CATEGORY</p>
            </div>
            <div className="w-full">
              <CategoryList data={transactions.filter(t => t.type === 'expense')} />
            </div>
          </Card>
  
          <Card className="p-8 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 border-primary/20 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
            <InsightsPanel />
          </Card>

          <Card className="p-6 relative overflow-hidden border-primary/10 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 flex flex-col">
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full animate-pulse pointer-events-none" />
             <div className="absolute -left-5 -bottom-5 w-32 h-32 bg-secondary/10 blur-[60px] rounded-full pointer-events-none" />

             <div className="relative z-10 flex flex-col flex-1 gap-4">

               <div className="flex items-start justify-between">
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <div className="relative flex-shrink-0">
                       <div className="w-2 h-2 rounded-full bg-primary" />
                       <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary animate-ping opacity-60" />
                     </div>
                     <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">AI Protocol Active</span>
                   </div>
                   <h4 className="text-base font-black text-foreground tracking-tight leading-tight">Drift Analysis</h4>
                 </div>
                 <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0">
                   <Zap size={10} className="text-primary" />
                   <span className="text-[9px] font-black text-primary uppercase">Live</span>
                 </div>
               </div>

               <div className="flex flex-col gap-2">
                 {[
                   { label: 'Accuracy',   pct: 94, value: '94.2%', color: '#00ff88', bg: 'rgba(0,255,136,0.07)',   bd: 'rgba(0,255,136,0.18)'  },
                   { label: 'Confidence', pct: 88, value: '87.6%', color: '#0ea5e9', bg: 'rgba(14,165,233,0.07)', bd: 'rgba(14,165,233,0.18)' },
                 ].map(({ label, pct, value, color, bg, bd }) => {
                   const r = 18, circ = 2 * Math.PI * r, dash = (pct / 100) * circ;
                   return (
                     <div key={label}
                       className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                       style={{ background: bg, border: `1px solid ${bd}` }}>
                       <div className="flex-shrink-0">
                         <svg width="44" height="44" viewBox="0 0 44 44">
                           <g transform="rotate(-90 22 22)">
                             <circle cx="22" cy="22" r={r} fill="none" stroke={`${color}25`} strokeWidth="4" />
                             <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="4"
                               strokeDasharray={`${dash.toFixed(2)} ${circ.toFixed(2)}`}
                               strokeLinecap="round"
                               style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
                           </g>
                           <text x="22" y="26" textAnchor="middle"
                             fontSize="9" fontWeight="800"
                             fontFamily="JetBrains Mono, monospace"
                             fill={color}>
                             {pct}%
                           </text>
                         </svg>
                       </div>
                       <div className="min-w-0">
                         <p className="text-[8px] font-bold uppercase tracking-widest opacity-40"
                           style={{ color: 'var(--foreground)' }}>{label}</p>
                         <p className="text-base font-black font-mono leading-tight mt-0.5"
                           style={{ color }}>{value}</p>
                       </div>
                     </div>
                   );
                 })}
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                 <div className="px-4 py-3 rounded-2xl"
                   style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.2)' }}>
                   <p className="text-[8px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Drift Score</p>
                   <p className="text-xl font-black font-mono leading-none" style={{ color: '#fbbf24', textShadow: '0 0 10px rgba(251,191,36,0.4)' }}>+0.12</p>
                   <p className="text-[8px] font-bold mt-2" style={{ color: 'rgba(251,191,36,0.55)' }}>▲ Low variance</p>
                 </div>
                 <div className="px-4 py-3 rounded-2xl"
                   style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                   <p className="text-[8px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Active Nodes</p>
                   <div className="flex items-center gap-1.5 mb-2">
                     {[1,2,3,4,5].map(n => (
                       <span key={n} className="w-2.5 h-2.5 rounded-full"
                         style={{ background: n <= 3 ? '#00ff88' : 'rgba(255,255,255,0.1)', boxShadow: n <= 3 ? '0 0 5px rgba(0,255,136,0.7)' : 'none' }} />
                     ))}
                   </div>
                   <p className="text-lg font-black font-mono leading-none text-foreground">3 <span className="text-[10px] opacity-30">/ 5</span></p>
                 </div>
               </div>

               <div className="rounded-2xl px-4 py-3"
                 style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                 <div className="flex items-center justify-between mb-2">
                   <p className="text-[8px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Weekly Trend</p>
                   <span className="text-[9px] font-bold" style={{ color: '#00ff88' }}>↑ 14.2% WoW</span>
                 </div>
                 <svg viewBox="0 0 220 44" className="w-full" style={{ height: 44 }} preserveAspectRatio="none">
                   <defs>
                     <linearGradient id="dg2" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor="#00ff88" stopOpacity="0.3" />
                       <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
                     </linearGradient>
                   </defs>
                   <polygon points="0,44 0,34 32,26 65,30 98,18 130,14 163,7 197,3 220,2 220,44" fill="url(#dg2)" />
                   <polyline points="0,34 32,26 65,30 98,18 130,14 163,7 197,3 220,2"
                     fill="none" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     style={{ filter: 'drop-shadow(0 0 4px rgba(0,255,136,0.6))' }} />
                   {[[0,34],[32,26],[65,30],[98,18],[130,14],[163,7],[197,3],[220,2]].map(([x,y],i) => (
                     <circle key={i} cx={x} cy={y} r="2.5" fill="#030712" stroke="#00ff88" strokeWidth="1.5"
                       style={{ filter: 'drop-shadow(0 0 3px #00ff88)' }} />
                   ))}
                 </svg>
                 <div className="flex justify-between mt-1.5">
                   {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i) => (
                     <span key={i} className="text-[7px] font-bold" style={{ color: 'rgba(255,255,255,0.2)' }}>{d}</span>
                   ))}
                 </div>
               </div>

               <button className="w-full py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 group mt-auto transition-all"
                 style={{ background: 'linear-gradient(135deg,rgba(0,255,136,0.12) 0%,rgba(14,165,233,0.07) 100%)', border: '1px solid rgba(0,255,136,0.28)', color: '#00ff88' }}
                 onMouseEnter={e => { e.currentTarget.style.background='linear-gradient(135deg,rgba(0,255,136,0.22) 0%,rgba(14,165,233,0.14) 100%)'; e.currentTarget.style.boxShadow='0 0 18px rgba(0,255,136,0.15)'; e.currentTarget.style.borderColor='rgba(0,255,136,0.5)'; }}
                 onMouseLeave={e => { e.currentTarget.style.background='linear-gradient(135deg,rgba(0,255,136,0.12) 0%,rgba(14,165,233,0.07) 100%)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='rgba(0,255,136,0.28)'; }}
               >
                 <Zap size={12} />
                 Run Full Analysis
                 <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
               </button>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
