import React, { useState } from 'react';
import { Search, Globe, Sparkles, ArrowRight, Shield, Zap, CheckCircle2, TrendingUp, Cpu, BarChart3, Database } from 'lucide-react';

export default function HeroSection({ onAnalyze, isLoading, onDemoClick }) {
  const [urlInput, setUrlInput] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    const kwList = targetKeywords
      ? targetKeywords.split(',').map(k => k.trim()).filter(Boolean)
      : null;
    onAnalyze(urlInput.trim(), kwList);
  };

  const setSampleUrl = (sample) => {
    setUrlInput(sample);
  };

  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background Decorative Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-80">
        <div 
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#3b82f6] via-[#8b5cf6] to-[#ec4899] opacity-20 dark:opacity-25"
          style={{
            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
          }}
        />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300 backdrop-blur-md mb-6 animate-pulse-slow">
          <Sparkles className="h-3.5 w-3.5 text-brand-400" />
          <span>Next-Gen Full-Stack SEO Audit Engine & Product Intelligence</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white light:text-slate-900 leading-[1.15]">
          Know Exactly Why Your Website <br className="hidden sm:inline" />
          <span className="gradient-text">Isn't Ranking.</span>
        </h1>

        {/* Subheading */}
        <p className="mt-5 text-base sm:text-lg text-slate-300 light:text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Analyze your website or product page, discover hidden SEO problems, and get AI-powered recommendations to improve your organic visibility.
        </p>

        {/* URL Input Form */}
        <div className="mt-8 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex flex-col sm:flex-row items-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/90 p-2 shadow-2xl shadow-brand-500/10 backdrop-blur-xl transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 light:bg-white light:border-slate-300 light:shadow-slate-300/50">
              <div className="flex items-center gap-2 flex-1 w-full px-3">
                <Globe className="h-5 w-5 text-slate-400 light:text-slate-500 shrink-0" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://yourwebsite.com/product"
                  required
                  className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none light:text-slate-900 light:placeholder-slate-400 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !urlInput.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/30 hover:from-brand-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-brand-400 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-95"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Analyze SEO</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {/* Advanced target keyword toggle */}
            <div className="flex items-center justify-between px-2 mt-2 text-xs text-slate-400">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="hover:text-brand-400 transition underline underline-offset-4"
              >
                {showAdvanced ? '- Hide target keyword check' : '+ Add custom target keywords (optional)'}
              </button>
              <button
                type="button"
                onClick={onDemoClick}
                className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 transition"
              >
                <Zap className="h-3 w-3 fill-amber-400" /> Explore Demo Store Data
              </button>
            </div>

            {showAdvanced && (
              <div className="mt-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left light:bg-slate-50 light:border-slate-200">
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                  Target Keywords (comma-separated):
                </label>
                <input
                  type="text"
                  value={targetKeywords}
                  onChange={(e) => setTargetKeywords(e.target.value)}
                  placeholder="e.g. running shoes, marathon sneakers, trail footwear"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none light:bg-white light:border-slate-300 light:text-slate-900"
                />
              </div>
            )}
          </form>

          {/* Quick Sample Links */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="text-slate-500 font-medium">Try instant sample:</span>
            <button
              onClick={() => setSampleUrl('https://example.com')}
              className="rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 hover:border-brand-500 hover:text-brand-300 transition light:bg-slate-100 light:border-slate-200 light:text-slate-700"
            >
              example.com
            </button>
            <button
              onClick={() => setSampleUrl('https://python.org')}
              className="rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 hover:border-brand-500 hover:text-brand-300 transition light:bg-slate-100 light:border-slate-200 light:text-slate-700"
            >
              python.org
            </button>
            <button
              onClick={() => setSampleUrl('https://news.ycombinator.com')}
              className="rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 hover:border-brand-500 hover:text-brand-300 transition light:bg-slate-100 light:border-slate-200 light:text-slate-700"
            >
              news.ycombinator.com
            </button>
          </div>
        </div>

        {/* Feature Badges Grid */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 text-left backdrop-blur-md light:bg-white light:border-slate-200 light:shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white light:text-slate-900">100+ Checks</div>
              <div className="text-[11px] text-slate-400">Audit Standards</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 text-left backdrop-blur-md light:bg-white light:border-slate-200 light:shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white light:text-slate-900">Technical SEO</div>
              <div className="text-[11px] text-slate-400">Meta, Schema, SSL</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 text-left backdrop-blur-md light:bg-white light:border-slate-200 light:shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white light:text-slate-900">Content Quality</div>
              <div className="text-[11px] text-slate-400">Reading & Depth</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 text-left backdrop-blur-md light:bg-white light:border-slate-200 light:shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white light:text-slate-900">Keywords</div>
              <div className="text-[11px] text-slate-400">N-gram Intelligence</div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 text-left backdrop-blur-md light:bg-white light:border-slate-200 light:shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white light:text-slate-900">AI Fix Engine</div>
              <div className="text-[11px] text-slate-400">Actionable Steps</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
