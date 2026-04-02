import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useState } from 'react';

const COLORS = ['#00ff88', '#0ea5e9', '#ff3366', '#fbbf24', '#a855f7', '#ec4899'];

const DonutChartComponent = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const aggregated = data.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});

  const chartData = Object.entries(aggregated)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 font-mono">
          <p className="text-white text-xs mb-1">{payload[0].name}</p>
          <p className="font-bold text-base mt-1" style={{ color: payload[0].payload.fill }}>
            ₹{payload[0].value.toLocaleString('en-IN')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
        <p className="text-gray-500 text-xs font-sans uppercase tracking-widest">Spent</p>
        <p className="text-white font-mono font-bold text-2xl mt-1">₹{(total/1000).toFixed(1)}k</p>
      </div>
      <div className="absolute inset-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius="65%"
              outerRadius="85%"
              paddingAngle={5}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              stroke="none"
              animationDuration={1500}
              animationBegin={500}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  style={{ 
                    filter: activeIndex === index ? `drop-shadow(0 0 10px ${COLORS[index % COLORS.length]})` : 'none',
                    outline: 'none',
                    opacity: activeIndex === index || activeIndex === -1 ? 1 : 0.5,
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', fontFamily: '"Space Grotesk"', paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default DonutChartComponent;
