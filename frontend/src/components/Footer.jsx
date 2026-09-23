import React from 'react';
import { ShieldCheck, Zap, Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 py-8 text-slate-400 light:border-slate-200 light:bg-slate-100 light:text-slate-600 no-print transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm">
              S
            </div>
            <div>
              <p className="text-sm font-semibold text-white light:text-slate-900">
                SEOlytics AI
              </p>
              <p className="text-xs text-slate-500">
                AI-Powered SEO & Search Visibility Analyzer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="h-4 w-4" /> SSRF Protected Engine
            </span>
            <span className="flex items-center gap-1 text-indigo-400">
              <Sparkles className="h-4 w-4" /> 100+ SEO & Schema Audits
            </span>
            <span className="text-slate-500">
              Deterministic 0–100 Real Scoring
            </span>
          </div>

          <div className="text-xs text-slate-500 text-center md:text-right">
            © {new Date().getFullYear()} SEOlytics AI. Production Full-Stack Architecture.
          </div>

        </div>
      </div>
    </footer>
  );
}
