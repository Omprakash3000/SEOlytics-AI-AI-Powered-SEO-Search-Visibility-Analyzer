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

          <div className="flex items-center gap-6 text-xs flex-wrap justify-center">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="h-4 w-4" /> SSRF Protected Engine
            </span>
            <span className="flex items-center gap-1 text-indigo-400">
              <Sparkles className="h-4 w-4" /> 100+ SEO & Schema Audits
            </span>
            <a
              href="https://github.com/Omprakash3000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition font-medium light:text-slate-700 light:hover:text-black"
            >
              <img
                src="https://github.com/Omprakash3000.png"
                alt="Omprakash"
                className="h-4 w-4 rounded-full ring-1 ring-brand-500/40 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
              <span>Created by <strong className="text-white light:text-slate-900">@Omprakash3000</strong></span>
            </a>
          </div>

          <div className="text-xs text-slate-500 text-center md:text-right">
            © {new Date().getFullYear()} SEOlytics AI. Open Source on <a href="https://github.com/Omprakash3000/SEOlytics-AI-AI-Powered-SEO-Search-Visibility-Analyzer" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">GitHub</a>.
          </div>

        </div>
      </div>
    </footer>
  );
}
