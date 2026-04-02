import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AreaChartComponent = ({ data }) => {
  const chartData = data.slice().reverse().reduce((acc, tx) => {
    const month = new Date(tx.date).toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.balance += (tx.type === 'income' ? tx.amount : -tx.amount);
    } else {
      const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
      acc.push({ month, balance: lastBalance + (tx.type === 'income' ? tx.amount : -tx.amount) });
    }
    return acc;
  }, []);

  const finalData = chartData.length > 2 ? chartData : [
    { month: 'Jan', balance: 10000 }, { month: 'Feb', balance: 15000 }, { month: 'Mar', balance: 12000 },
    { month: 'Apr', balance: 25000 }, { month: 'May', balance: 40000 }, { month: 'Jun', balance: 35000 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 font-mono shadow-2xl border-primary/20 backdrop-blur-3xl min-w-[140px]">
          <p className="text-foreground-muted text-[10px] uppercase tracking-widest mb-2">{label}</p>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
             <p className="text-foreground font-black text-lg">₹{payload[0].value.toLocaleString('en-IN')}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={finalData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="var(--card-border)" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--foreground-muted)', fontSize: 11, fontWeight: '700', fontFamily: 'Outfit' }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--foreground-muted)', fontSize: 10, fontWeight: '500', fontFamily: 'JetBrains Mono' }} 
              tickFormatter={(val) => `₹${val/1000}k`} 
              dx={-10} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="var(--primary)" 
              strokeWidth={4}
              strokeLinecap="round"
              fillOpacity={1} 
              fill="url(#colorBalance)" 
              animationDuration={2500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default AreaChartComponent;
