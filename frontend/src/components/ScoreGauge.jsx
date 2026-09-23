import React, { useEffect, useState } from 'react';
import { getScoreBadge } from '../utils/formatters';

export default function ScoreGauge({ score = 0, size = 200, strokeWidth = 14, title = "Overall SEO Score" }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.min(100, Math.max(0, score));
    if (end === 0) {
      setAnimatedScore(0);
      return;
    }
    const duration = 1000;
    const stepTime = 15;
    const step = (end / (duration / stepTime));

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const badge = getScoreBadge(score);

  // Gradient color based on score
  let strokeGradient = 'from-rose-500 to-amber-500';
  let textColor = 'text-rose-400';
  if (score >= 85) {
    strokeGradient = 'from-emerald-400 to-teal-500';
    textColor = 'text-emerald-400';
  } else if (score >= 70) {
    strokeGradient = 'from-blue-400 to-indigo-500';
    textColor = 'text-blue-400';
  } else if (score >= 50) {
    strokeGradient = 'from-amber-400 to-orange-500';
    textColor = 'text-amber-400';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800/80 light:text-slate-200"
            fill="transparent"
          />
          {/* Animated progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#score-gradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
          />
          <defs>
            <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              {score >= 85 ? (
                <>
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </>
              ) : score >= 70 ? (
                <>
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#818cf8" />
                </>
              ) : score >= 50 ? (
                <>
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f97316" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#e11d48" />
                </>
              )}
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight font-mono ${textColor}`}>
            {animatedScore}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <span className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${badge.color}`}>
          {badge.label}
        </span>
        <p className="mt-1.5 text-xs text-slate-400 font-medium">{title}</p>
      </div>
    </div>
  );
}
