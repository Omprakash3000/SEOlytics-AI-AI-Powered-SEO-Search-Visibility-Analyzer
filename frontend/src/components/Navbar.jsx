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

          {/* GitHub Profile */}
          <a
            href="https://github.com/Omprakash3000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition shadow-sm light:bg-slate-100 light:border-slate-300 light:text-slate-700 light:hover:bg-slate-200"
            title="GitHub: Omprakash3000"
          >
            <img
              src="https://github.com/Omprakash3000.png"
              alt="Omprakash"
              className="h-5 w-5 rounded-full ring-1 ring-brand-500/40 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            <span className="hidden sm:inline font-mono font-semibold text-[11px] text-slate-300 light:text-slate-700">
              @Omprakash3000
            </span>
            <svg
              className="h-3.5 w-3.5 text-slate-400 group-hover:text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

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
