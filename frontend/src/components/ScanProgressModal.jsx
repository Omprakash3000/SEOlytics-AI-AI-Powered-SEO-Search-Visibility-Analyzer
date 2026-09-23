import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Sparkles, Globe, Shield, Search } from 'lucide-react';

const SCAN_STEPS = [
  { id: 'connect', label: 'Connecting to website safely (SSRF Protection)...' },
  { id: 'fetch', label: 'Fetching HTML & measuring response time...' },
  { id: 'tech', label: 'Auditing Technical SEO, Schema & Headers...' },
  { id: 'content', label: 'Analyzing content quality & readability level...' },
  { id: 'keywords', label: 'Extracting 1/2/3-gram keywords & densities...' },
  { id: 'product', label: 'Checking e-commerce signals & Product schema...' },
  { id: 'issues', label: 'Classifying Critical & Warning SEO issues...' },
  { id: 'ai', label: 'Synthesizing actionable AI recommendations...' }
];

export default function ScanProgressModal({ targetUrl }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < SCAN_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(100, Math.round(((currentStep + 1) / SCAN_STEPS.length) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/80 bg-slate-900/95 p-6 shadow-2xl light:bg-white light:border-slate-300">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 text-white shadow-md">
            <Sparkles className="h-5 w-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white light:text-slate-900">
              Analyzing Webpage...
            </h3>
            <p className="text-xs text-slate-400 light:text-slate-500 font-mono truncate max-w-[260px]">
              {targetUrl}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1.5">
            <span>Scan Progress</span>
            <span className="text-brand-400 font-mono">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 light:bg-slate-200 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step List */}
        <div className="space-y-2.5">
          {SCAN_STEPS.map((step, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                  isDone
                    ? 'text-emerald-400 font-medium'
                    : isCurrent
                    ? 'text-white font-semibold light:text-slate-900'
                    : 'text-slate-500 light:text-slate-400 opacity-50'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 text-brand-400 animate-spin shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-slate-700 light:border-slate-300 shrink-0" />
                )}
                <span>{step.label}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-400 light:border-slate-200">
          Fetching live DOM tree & calculating deterministic scores...
        </div>

      </div>
    </div>
  );
}
