import { BrainCircuit, TrendingUp, AlertCircle, CheckCircle2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';

const InsightsPanel = () => {
  const { transactions } = useFinanceStore();
  const expenses = transactions.filter(t => t.type === 'expense');
  
  // Calculate highest spending category
  const categories = expenses.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});
  
  const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  const highestCategory = sortedCategories[0] || ['None', 0];

  // Mock monthly comparison (as we usually only have current month in mock data)
  const currentMonthTotal = expenses.reduce((sum, tx) => sum + tx.amount, 0);
  const lastMonthTotal = currentMonthTotal * 0.92; // Mock prev month
  const diff = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BrainCircuit size={18} className="text-secondary" />
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">AI Insights</h3>
        </div>
        <div className="px-2 py-0.5 rounded bg-secondary/10 border border-secondary/20 block">
           <span className="text-[8px] font-black text-secondary uppercase animate-pulse">Live Analysis</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Highest Category */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-secondary/30 transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-secondary/10 transition-all"></div>
          <div className="flex justify-between items-start mb-3 relative z-10">
            <span className="text-[10px] font-bold text-foreground-muted tracking-widest uppercase">Top Spending</span>
            <AlertCircle size={14} className="text-secondary opacity-50" />
          </div>
          <div className="relative z-10">
            <p className="text-lg font-bold text-foreground">{highestCategory[0]}</p>
            <div className="flex items-center gap-2 mt-1">
               <div className="flex-1 h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                 <div className="h-full bg-secondary rounded-full" style={{ width: '65%' }}></div>
               </div>
               <span className="text-[10px] text-foreground-muted font-mono">₹{highestCategory[1].toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-all"></div>
          <div className="flex justify-between items-start mb-3 relative z-10">
            <span className="text-[10px] font-bold text-foreground-muted tracking-widest uppercase">Efficiency</span>
            {diff > 0 ? <ArrowUpRight size={14} className="text-danger" /> : <ArrowDownRight size={14} className="text-primary" />}
          </div>
          <div className="relative z-10">
            <div className="flex items-end gap-2">
              <p className="text-2xl font-black text-foreground">{diff > 0 ? '+' : ''}{Math.abs(diff).toFixed(1)}%</p>
              <span className="text-[10px] text-foreground-muted mb-1 font-mono uppercase">{diff > 0 ? 'Increase' : 'Saving'}</span>
            </div>
            <div className="flex gap-1 mt-2">
               {[1,2,3,4,5,6,7,8].map(i => (
                 <div key={i} className={`flex-1 h-3 rounded-sm ${i < 6 ? (diff > 0 ? 'bg-danger/20' : 'bg-primary/40') : 'bg-foreground/5'}`} />
               ))}
            </div>
          </div>
        </div>

        {/* Actionable Insight */}
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Optimizer</span>
          </div>
          <p className="text-xs text-foreground-muted leading-relaxed font-sans">
            Your {highestCategory[0]} spending is <span className="text-foreground font-bold">outpacing</span> your budget. Adjusting this single category could increase your monthly savings by <span className="text-primary font-bold">₹{(highestCategory[1]*0.15).toFixed(0)}</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
