'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface PortfolioHistoryChartProps {
  currentValue: number;
  totalInvested: number;
}

// Generate mock historical data based on current portfolio
function generateHistoricalData(currentValue: number, totalInvested: number) {
  const data = [];
  const days = 30;
  const today = new Date();

  // Calculate a growth factor
  const growthRate = currentValue > 0 ? (currentValue / Math.max(totalInvested, 1)) : 1;

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Create a smooth progression with some variation
    const progress = (days - i) / days;
    const baseValue = totalInvested * (1 + (growthRate - 1) * progress);

    // Add some realistic variation (-2% to +2%)
    const variation = 1 + (Math.sin(i * 0.5) * 0.02) + (Math.random() - 0.5) * 0.01;
    const value = Math.round(baseValue * variation);

    data.push({
      date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      value: Math.max(value, 0),
      fullDate: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    });
  }

  return data;
}

export default function PortfolioHistoryChart({ currentValue, totalInvested }: PortfolioHistoryChartProps) {
  const data = generateHistoricalData(currentValue, totalInvested);

  const formatCurrency = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const formatTooltipCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; payload: { fullDate: string } }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="text-gray-400 text-sm mb-1">{payload[0].payload.fullDate}</p>
          <p className="text-green-400 font-semibold">{formatTooltipCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  if (currentValue === 0 && totalInvested === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <span className="text-4xl block mb-2">📈</span>
          <p>Start investing to see your portfolio history</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey="date"
          stroke="#6b7280"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          stroke="#6b7280"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          tickFormatter={formatCurrency}
          tickLine={false}
          axisLine={false}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#10b981"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorValue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
