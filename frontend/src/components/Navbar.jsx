import React from 'react';
import { Sparkles, Sun, Moon, Zap, Layers, RefreshCw, FileText, Settings as SettingsIcon } from 'lucide-react';

export default function Navbar({
  theme,
  toggleTheme,
  isDemo,
  toggleDemo,
  onReset,
  hasAnalysis,
  openSettings,
  openExport
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-colors dark:border-slate-800/80 dark:bg-slate-950/80 light:bg-white/80 light:border-slate-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo & Brand */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-white animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white light:text-slate-900">
                SEOlytics <span className="gradient-blue-purple font-extrabold">AI</span>
              </span>
              <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold text-brand-400 border border-brand-500/20">
                v1.0 Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-400 light:text-slate-500 hidden sm:block">
              AI-Powered SEO & Search Visibility Analyzer
            </p>
          </div>
        </div>

        {/* Center / Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasAnalysis && (
            <>
              <button
                onClick={onReset}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition light:bg-slate-100 light:border-slate-300 light:text-slate-700"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                New Analysis
              </button>
              <button
                onClick={openExport}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/30 transition shadow-sm"
              >
                <FileText className="h-3.5 w-3.5 text-indigo-400" />
                <span className="hidden xs:inline">Export</span> Report
              </button>
            </>
          )}

          {/* Demo Mode Toggle */}
          <button
            onClick={toggleDemo}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition ${
              isDemo
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/10'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 light:bg-slate-100 light:border-slate-300 light:text-slate-700'
            }`}
            title="Toggle Demo Mode with pre-populated sample store"
          >
            <Zap className={`h-3.5 w-3.5 ${isDemo ? 'text-amber-400 fill-amber-400' : ''}`} />
            <span>{isDemo ? 'DEMO MODE' : 'Demo Mode'}</span>
          </button>

          {/* Settings */}
          <button
            onClick={openSettings}
            className="rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-slate-400 hover:text-white hover:border-slate-700 transition light:bg-slate-100 light:border-slate-300 light:text-slate-600"
            title="Settings & API Keys"
          >
            <SettingsIcon className="h-4 w-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-slate-400 hover:text-white hover:border-slate-700 transition light:bg-slate-100 light:border-slate-300 light:text-slate-600"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
