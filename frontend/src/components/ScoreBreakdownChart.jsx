import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function ScoreBreakdownChart({ scores }) {
  if (!scores) return null;

  const data = [
    { name: 'Technical', score: scores.technical_score, weight: '25%', color: '#38bdf8' },
    { name: 'On-Page', score: scores.onpage_score, weight: '25%', color: '#818cf8' },
    { name: 'Content', score: scores.content_score, weight: '20%', color: '#34d399' },
    { name: 'Keywords', score: scores.keyword_score, weight: '15%', color: '#fbbf24' },
    { name: 'Speed', score: scores.performance_score, weight: '10%', color: '#f43f5e' },
    { name: 'Schema', score: scores.social_schema_score, weight: '5%', color: '#c084fc' }
  ];

  if (scores.product_score !== null && scores.product_score !== undefined) {
    data.push({ name: 'Product', score: scores.product_score, weight: 'E-Comm', color: '#ec4899' });
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-2.5 shadow-xl text-xs light:bg-white light:border-slate-300">
          <p className="font-bold text-white light:text-slate-900">{item.name} SEO</p>
          <p className="text-slate-300 light:text-slate-600 mt-0.5">
            Score: <span className="font-mono font-bold text-brand-400">{item.score}/100</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Weight: {item.weight}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#334155' }}
            tickLine={false}
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#334155' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="score" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
