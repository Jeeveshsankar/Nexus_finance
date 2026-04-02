import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import useFinanceStore from '../store/useFinanceStore';
import { Card } from '../components/ui/Card';
import { TrendingUp, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const BUDGET_LIMITS = {
  Food: 12000, Transport: 8000, Entertainment: 5000,
  Shopping: 10000, Health: 4000, Utilities: 6000,
};

const getStatus = (pct) => {
  if (pct >= 100) return { color: '#ef4444', label: 'EXCEEDED', icon: <AlertTriangle size={10} /> };
  if (pct >= 75) return { color: '#f59e0b', label: 'WARNING', icon: <AlertTriangle size={10} /> };
  return { color: '#10b981', label: 'ON_TRACK', icon: <CheckCircle2 size={10} /> };
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: 10 }}>
        <p style={{ color: '#f8fafc', fontSize: 11, fontWeight: 700 }}>{d.name}</p>
        <p style={{ color: d.fill, fontSize: 12, fontWeight: 900, fontFamily: 'monospace' }}>₹{d.value.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

const Budget = () => {
  const containerRef = useRef(null);
  const { transactions } = useFinanceStore();
  const [activeCategory, setActiveCategory] = useState(null);

  useGSAP(() => {
    gsap.fromTo('.budget-card',
      { y: 40, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
    );

    gsap.utils.toArray('.progress-fill').forEach((bar) => {
      const width = bar.getAttribute('data-width');
      gsap.fromTo(bar,
        { width: '0%', boxShadow: 'none' },
        {
          width: `${Math.min(width, 100)}%`,
          duration: 1.8,
          ease: 'power4.out',
          delay: 0.6,
          onUpdate: function () {
            const currentWidth = parseFloat(this.targets()[0].style.width);
            if (currentWidth > 75) {
              this.targets()[0].style.boxShadow = `0 0 12px ${bar.getAttribute('data-color')}80`;
            }
          }
        }
      );
    });

    gsap.utils.toArray('.stat-number').forEach((el) => {
      const end = parseFloat(el.getAttribute('data-end'));
      const obj = { val: 0 };
      gsap.to(obj, {
        val: end, duration: 2, ease: 'power2.out', delay: 0.8,
        onUpdate: () => { el.textContent = '₹' + Math.round(obj.val).toLocaleString('en-IN'); }
      });
    });

    gsap.from('.recharts-pie', { rotate: -90, opacity: 0, duration: 1.2, ease: 'back.out(1.2)', delay: 0.5 });
  }, { scope: containerRef });

  const expenses = transactions.filter(t => t.type === 'expense');
  const catTotals = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const budgets = Object.entries(BUDGET_LIMITS).map(([cat, limit]) => {
    const spent = catTotals[cat] || 0;
    const pct = (spent / limit) * 100;
    const status = getStatus(pct);
    return { category: cat, limit, spent, pct, ...status };
  });

  const totalBudget = budgets.reduce((acc, b) => acc + b.limit, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const overallPct = (totalSpent / totalBudget) * 100;
  const overallStatus = getStatus(overallPct);

  const pieData = budgets.map(b => ({
    name: b.category,
    value: b.spent,
    fill: b.color,
  }));

  const exceeded = budgets.filter(b => b.pct >= 100).length;
  const warning = budgets.filter(b => b.pct >= 75 && b.pct < 100).length;

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-5 pb-8">
      <div className="budget-card flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-warning shadow-[0_0_10px_var(--warning)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-warning">Budget_Protocol</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Budget Tracker</h1>
          <p className="text-foreground-muted font-medium text-sm mt-1">Monitor and control your spending limits in real-time.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          {exceeded > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-danger/10 border border-danger/20">
              <AlertTriangle size={14} className="text-danger" />
              <span className="text-xs font-black text-danger uppercase tracking-wider">{exceeded} Exceeded</span>
            </div>
          )}
          {warning > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-warning/10 border border-warning/20">
              <Zap size={14} className="text-warning" />
              <span className="text-xs font-black text-warning uppercase tracking-wider">{warning} Warning</span>
            </div>
          )}
        </div>
      </div>

      <div className="budget-card grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Budget', value: totalBudget, color: 'text-foreground' },
          { label: 'Total Spent', value: totalSpent, color: totalSpent > totalBudget ? 'text-danger' : 'text-primary' },
          { label: 'Remaining', value: Math.max(0, totalBudget - totalSpent), color: 'text-secondary' },
        ].map((s, i) => (
          <Card key={i} className="p-4 text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground-muted mb-2">{s.label}</p>
            <p className={`text-xl font-black font-mono stat-number ${s.color}`} data-end={s.value}>₹0</p>
          </Card>
        ))}
      </div>

      <div className="budget-card flex flex-col lg:flex-row gap-5">
        <Card className="w-full lg:w-72 shrink-0 flex flex-col items-center p-6">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground-muted mb-4">Overall Utilization</p>
          <div className="relative w-48 h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius="65%" outerRadius="90%"
                  stroke="none"
                  dataKey="value"
                  startAngle={90} endAngle={-270}
                  onClick={(d) => setActiveCategory(activeCategory === d.name ? null : d.name)}
                >
                  {pieData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.fill}
                      opacity={activeCategory && activeCategory !== entry.name ? 0.2 : 1}
                      style={{ cursor: 'pointer', transition: 'opacity 0.3s' }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black font-mono" style={{ color: overallStatus.color }}>
                {Math.round(overallPct)}%
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-foreground-muted mt-0.5">Used</span>
            </div>
          </div>
          <div className="w-full space-y-2 mt-2">
            {pieData.slice(0, 4).map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setActiveCategory(activeCategory === d.name ? null : d.name)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.fill, opacity: activeCategory && activeCategory !== d.name ? 0.2 : 1 }} />
                  <span className="text-[10px] font-bold text-foreground-muted">{d.name}</span>
                </div>
                <span className="text-[10px] font-mono font-black" style={{ color: d.fill }}>₹{d.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex-1 flex flex-col p-6 min-h-0">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground-muted">Category Breakdown</p>
            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-wider">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary inline-block" /> On Track</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning inline-block" /> Warning</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-danger inline-block" /> Exceeded</span>
            </div>
          </div>
          <div className="flex-1 space-y-5 overflow-y-auto custom-scrollbar pr-1">
            {budgets
              .sort((a, b) => b.pct - a.pct)
              .map((b) => (
                <div
                  key={b.category}
                  className="group relative"
                  onMouseEnter={() => setActiveCategory(b.category)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span style={{ color: b.color }}>{b.icon}</span>
                      <span className="text-sm font-bold text-foreground">{b.category}</span>
                      <span
                        className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border"
                        style={{ color: b.color, background: `${b.color}15`, borderColor: `${b.color}30` }}
                      >
                        {b.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-black text-foreground">₹{b.spent.toLocaleString('en-IN')}</span>
                      <span className="text-foreground-muted text-[10px] font-mono"> / ₹{b.limit.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden relative">
                    <div
                      className="progress-fill h-full rounded-full transition-all"
                      data-width={b.pct}
                      data-color={b.color}
                      style={{ backgroundColor: b.color, width: '0%' }}
                    />
                    <div className="absolute top-0 bottom-0 w-px bg-white/10" style={{ left: '75%' }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[9px] font-black uppercase" style={{ color: b.color }}>
                      {Math.round(b.pct)}% used
                    </span>
                    {b.pct < 100 && (
                      <span className="text-[9px] text-foreground-muted font-mono">
                        ₹{Math.max(0, b.limit - b.spent).toLocaleString('en-IN')} remaining
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>

      <Card className="budget-card p-4 bg-gradient-to-r from-primary/5 to-transparent border-primary/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <TrendingUp size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-xs font-black text-foreground">Protocol Insight</p>
            <p className="text-xs text-foreground-muted mt-0.5">
              {exceeded > 0
                ? `[!] ${exceeded} ${exceeded === 1 ? 'category has' : 'categories have'} exceeded budget. Reduce ${budgets.sort((a,b)=>b.pct-a.pct)[0]?.category} spending to improve health.`
                : `All categories within limits. Highest utilization: ${budgets.sort((a,b)=>b.pct-a.pct)[0]?.category} at ${Math.round(budgets.sort((a,b)=>b.pct-a.pct)[0]?.pct)}%.`
              }
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Budget;
