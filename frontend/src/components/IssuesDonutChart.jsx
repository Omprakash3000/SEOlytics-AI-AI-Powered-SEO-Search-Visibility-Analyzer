import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function IssuesDonutChart({ issues = [] }) {
  const critical = issues.filter(i => i.severity === 'critical').length;
  const warning = issues.filter(i => i.severity === 'warning').length;
  const passed = issues.filter(i => i.severity === 'passed').length;

  const data = [
    { name: 'Critical', value: critical, color: '#f43f5e' },
    { name: 'Warnings', value: warning, color: '#fbbf24' },
    { name: 'Passed', value: passed, color: '#10b981' }
  ];

  const total = critical + warning + passed;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
      return (
        <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-2 shadow-xl text-xs light:bg-white light:border-slate-300">
          <p className="font-bold" style={{ color: item.payload.color }}>
            {item.name}: {item.value} ({pct}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full h-56 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center count label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-extrabold text-white light:text-slate-900 font-mono">
          {total}
        </span>
        <span className="text-[10px] font-semibold text-slate-400 uppercase">
          Total Checks
        </span>
      </div>
    </div>
  );
}
