import { TrendingUp, ShoppingBag, Home, Coffee, Car, Utensils, Zap, Package } from 'lucide-react';

const COLORS = [
  { stroke: '#00ff88', bg: 'rgba(0,255,136,0.1)',    label: '#00ff88'   },
  { stroke: '#0ea5e9', bg: 'rgba(14,165,233,0.1)',   label: '#0ea5e9'   },
  { stroke: '#ff3366', bg: 'rgba(255,51,102,0.1)',   label: '#ff3366'   },
  { stroke: '#fbbf24', bg: 'rgba(251,191,36,0.1)',   label: '#fbbf24'   },
  { stroke: '#a855f7', bg: 'rgba(168,85,247,0.1)',   label: '#a855f7'   },
];

const ICONS = {
  Food:          <Utensils   size={12} />,
  Rent:          <Home       size={12} />,
  Shopping:      <ShoppingBag size={12}/>,
  Travel:        <Car        size={12} />,
  Utilities:     <Zap        size={12} />,
  Entertainment: <Coffee     size={12} />,
  Groceries:     <ShoppingBag size={12}/>,
  Salary:        <TrendingUp size={12} />,
  Health:        <Package    size={12} />,
  Other:         <Package    size={12} />,
};

const DonutChart = ({ segments }) => {
  const cx = 80, cy = 80, r = 60;
  const circ = 2 * Math.PI * r;
  const gap  = 3;
  const gapFrac = (gap / 360) * circ;

  let offset = 0;
  const arcs = segments.map((s, i) => {
    const arcLength = (s.pct / 100) * circ - gapFrac;
    const dasharray = `${Math.max(0, arcLength).toFixed(2)} ${circ.toFixed(2)}`;
    const dashoffset = -offset;
    offset += (s.pct / 100) * circ;
    return { ...s, dasharray, dashoffset, color: COLORS[i % COLORS.length] };
  });

  return (
    <svg width={160} height={160} viewBox="0 0 160 160">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="14" />
      {arcs.map((arc, i) => (
        <circle key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={arc.color.stroke}
          strokeWidth="14"
          strokeDasharray={arc.dasharray}
          strokeDashoffset={arc.dashoffset}
          strokeLinecap="round"
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: `${cx}px ${cy}px`,
            filter: `drop-shadow(0 0 4px ${arc.color.stroke}80)`,
            transition: 'stroke-dasharray 0.8s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fontWeight="800"
        fontFamily="JetBrains Mono, monospace" fill="rgba(255,255,255,0.9)">
        Top 5
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fontWeight="600"
        fontFamily="Space Grotesk, sans-serif" fill="rgba(255,255,255,0.3)"
        letterSpacing="1">
        CATEGORIES
      </text>
    </svg>
  );
};

const CategoryList = ({ data }) => {
  const aggregated = (data || []).reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});

  const total = Object.values(aggregated).reduce((s, v) => s + v, 0);

  const chartData = Object.entries(aggregated)
    .map(([name, value]) => ({ name, value, pct: total > 0 ? (value / total) * 100 : 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-xs font-mono"
        style={{ color: 'rgba(255,255,255,0.3)' }}>
        No spending data recorded
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-center">
        <DonutChart segments={chartData} />
      </div>
      <div className="flex flex-col gap-2.5">
        {chartData.map((item, i) => {
          const clr = COLORS[i % COLORS.length];
          return (
            <div key={item.name} className="flex items-center gap-3 group">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: clr.bg, border: `1px solid ${clr.stroke}30`, color: clr.stroke }}>
                {ICONS[item.name] || ICONS['Other']}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs font-semibold truncate"
                    style={{ color: 'var(--foreground)' }}>
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className="text-[10px] font-black font-mono"
                      style={{ color: clr.stroke }}>
                      ₹{item.value.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{ background: clr.bg, color: clr.stroke }}>
                      {item.pct.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="h-1 w-full rounded-full"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full rounded-full"
                    style={{
                      width:      `${item.pct}%`,
                      background: clr.stroke,
                      boxShadow:  `0 0 6px ${clr.stroke}60`,
                      transition: `width 0.8s cubic-bezier(0.34,1.56,0.64,1) ${i * 80}ms`,
                    }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;
