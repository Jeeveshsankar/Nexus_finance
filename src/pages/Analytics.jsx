import { useRef, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useFinanceStore from '../store/useFinanceStore';
import { Card } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Analytics = () => {
  const containerRef = useRef(null);
  const { transactions } = useFinanceStore();

  useGSAP(() => {
    gsap.from('.reveal-card', {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'expo.out',
      clearProps: 'all'
    });
  }, { scope: containerRef });

  const expenses = transactions.filter(t => t.type === 'expense');
  const catTotals = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});
  
  const topCat = Object.keys(catTotals).sort((a,b) => catTotals[b] - catTotals[a])[0] || 'N/A';
  const biggestTx = [...expenses].sort((a,b) => b.amount - a.amount)[0]?.amount || 0;

  const heatmapData = useMemo(() =>
    Array.from({ length: 42 }, () => Math.random()),
  []);

  const barData = [
    { name: 'Nov', income: 40000, expense: 24000 },
    { name: 'Dec', income: 45000, expense: 28000 },
    { name: 'Jan', income: 45000, expense: 22000 },
    { name: 'Feb', income: 50000, expense: 35000 },
    { name: 'Mar', income: 48000, expense: 29000 },
    { name: 'Apr', income: 55000, expense: 32000 },
  ];

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2 reveal-card">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_var(--secondary)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Advanced_Heuristics</span>
          </div>
          <h1 className="text-3xl md:text-2xl font-bold font-sans tracking-tight text-foreground">Deep Analytics</h1>
          <p className="text-foreground-muted font-medium text-sm mt-1">Uncovering hidden vectors in your capital flow.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="reveal-card p-8 flex flex-col justify-between">
          <p className="text-foreground-muted text-[10px] uppercase font-black tracking-widest opacity-40">Primary_Leak</p>
          <div className="mt-6">
            <p className="text-3xl font-black text-primary font-heading tracking-tight uppercase grow-on-hover">{topCat}</p>
            <p className="text-[9px] text-foreground-muted font-black uppercase tracking-widest mt-2">Highest Category Spend</p>
          </div>
        </Card>
        <Card className="reveal-card p-8 flex flex-col justify-between">
          <p className="text-foreground-muted text-[10px] uppercase font-black tracking-widest opacity-40">Quantum_Spike</p>
          <div className="mt-6">
            <p className="text-3xl font-black text-danger font-heading tracking-tight grow-on-hover">₹{biggestTx.toLocaleString('en-IN')}</p>
            <p className="text-[9px] text-foreground-muted font-black uppercase tracking-widest mt-2">Single Largest Outflow</p>
          </div>
        </Card>
        <Card className="reveal-card p-8 flex flex-col justify-between">
          <p className="text-foreground-muted text-[10px] uppercase font-black tracking-widest opacity-40">Settlement_Ratio</p>
          <div className="mt-6">
            <p className="text-3xl font-black text-secondary font-heading tracking-tight grow-on-hover">+14.2%</p>
            <p className="text-[9px] text-foreground-muted font-black uppercase tracking-widest mt-2">Month over Month Efficiency</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="reveal-card lg:col-span-8 p-8">
           <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-black font-heading text-foreground tracking-tight">Flow Delta</h3>
                <p className="text-[10px] text-foreground-muted mt-1 uppercase tracking-widest font-black opacity-40">Inbound vs Outbound Projection</p>
              </div>
           </div>
           <div className="h-[300px] md:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="var(--card-border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground-muted)', fontSize: 11, fontWeight: '700', fontFamily: 'Outfit' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground-muted)', fontSize: 10, fontWeight: '500', fontFamily: 'JetBrains Mono' }} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip 
                    cursor={{ fill: 'var(--foreground)', opacity: 0.05 }} 
                    contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', backdropFilter: 'blur(20px)', color: 'var(--foreground)', borderRadius: '16px', border: '1px solid var(--card-border)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}
                    itemStyle={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  />
                  <Bar dataKey="income" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expense" fill="var(--danger)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </Card>

        <Card className="reveal-card lg:col-span-4 p-8 flex flex-col">
          <h3 className="text-xl font-black font-heading text-foreground tracking-tight mb-8">Pulse Intensity</h3>
          <div className="flex-1 grid grid-cols-7 gap-2">
            {heatmapData.map((intensity, i) => (
                <div 
                  key={i} 
                  className="rounded-lg border border-card-border transition-all hover:scale-110 hover:border-primary/40 cursor-help aspect-square"
                  style={{ backgroundColor: `rgba(16, 185, 129, ${intensity < 0.1 ? 0.05 : intensity * 0.4})` }}
                  title={`Node Activity: ${(intensity * 100).toFixed(0)}%`}
                ></div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-card-border flex justify-between items-center">
             <span className="text-[9px] font-black uppercase tracking-widest text-foreground-muted">Low_Activity</span>
             <div className="flex gap-1">
                {[0.1, 0.3, 0.6, 1].map(o => <div key={o} className="w-3 h-3 rounded-sm" style={{ backgroundColor: `rgba(16, 185, 129, ${o * 0.4})` }} />)}
             </div>
             <span className="text-[9px] font-black uppercase tracking-widest text-foreground-muted">Peak_Flow</span>
          </div>
        </Card>
      </div>

      <div className="reveal-card p-6 md:p-12 border-dashed border-card-border bg-gradient-to-r from-primary/5 to-secondary/5 rounded-[3rem] flex flex-col items-center text-center gap-6">
         <div className="w-16 h-16 rounded-3xl bg-secondary/10 text-secondary flex items-center justify-center animate-bounce">
            <Globe size={32} />
         </div>
         <div>
            <h2 className="text-2xl md:text-3xl font-black font-heading text-foreground tracking-tight">Your Wealth is Compounding.</h2>
            <p className="text-foreground-muted mt-2 max-w-md">Nexus heuristics identify a 12.4% increase in capital retention across your connected nodes this quarter.</p>
         </div>
      </div>
    </div>
  );
};

export default Analytics;
