import React, { useState } from 'react';
import { X, Settings, Key, Shield, Check, Info } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const [aiProvider, setAiProvider] = useState(() => localStorage.getItem('seolytics_ai_prov') || 'builtin');
  const [aiKey, setAiKey] = useState(() => localStorage.getItem('seolytics_ai_key') || '');
  const [seoProvider, setSeoProvider] = useState(() => localStorage.getItem('seolytics_seo_prov') || 'none');
  const [seoKey, setSeoKey] = useState(() => localStorage.getItem('seolytics_seo_key') || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('seolytics_ai_prov', aiProvider);
    localStorage.setItem('seolytics_ai_key', aiKey);
    localStorage.setItem('seolytics_seo_prov', seoProvider);
    localStorage.setItem('seolytics_seo_key', seoKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 no-print">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl light:bg-white light:border-slate-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 light:border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600/20 text-brand-400">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white light:text-slate-900">
                Integration & API Settings
              </h3>
              <p className="text-xs text-slate-400">
                Manage optional AI and live search data provider keys
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white light:hover:text-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="py-5 space-y-4 text-xs">
          
          {/* AI Recommendation Engine */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 light:bg-slate-50 light:border-slate-200">
            <label className="block font-bold text-white light:text-slate-900 mb-1">
              AI Recommendation Engine
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              Select recommendation provider (defaults to built-in expert heuristic engine).
            </p>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {['builtin', 'gemini', 'openai'].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setAiProvider(p)}
                  className={`rounded-lg py-1.5 font-medium uppercase text-[10px] border transition ${
                    aiProvider === p
                      ? 'bg-brand-600 border-brand-500 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 light:bg-white light:border-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {aiProvider !== 'builtin' && (
              <input
                type="password"
                value={aiKey}
                onChange={(e) => setAiKey(e.target.value)}
                placeholder={`Enter ${aiProvider.toUpperCase()} API Key`}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-white font-mono placeholder-slate-500 focus:border-brand-500 light:bg-white light:border-slate-300 light:text-slate-900"
              />
            )}
          </div>

          {/* External SEO / SERP Provider */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 light:bg-slate-50 light:border-slate-200">
            <label className="block font-bold text-white light:text-slate-900 mb-1">
              External Search & Ranking Provider
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              Connect external search engine data providers for live Google SERP positions.
            </p>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {['none', 'serpapi', 'dataforseo'].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setSeoProvider(p)}
                  className={`rounded-lg py-1.5 font-medium uppercase text-[10px] border transition ${
                    seoProvider === p
                      ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 light:bg-white light:border-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {seoProvider !== 'none' && (
              <input
                type="password"
                value={seoKey}
                onChange={(e) => setSeoKey(e.target.value)}
                placeholder={`Enter ${seoProvider.toUpperCase()} API Key`}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-white font-mono placeholder-slate-500 focus:border-brand-500 light:bg-white light:border-slate-300 light:text-slate-900"
              />
            )}
          </div>

          {/* Developer & Project Profile */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-brand-950/40 via-slate-950/60 to-purple-950/40 border border-brand-500/30 light:bg-slate-50 light:border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white light:text-slate-900 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Developer Profile
              </span>
              <span className="text-[10px] uppercase font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                Author
              </span>
            </div>
            
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2.5">
                <img
                  src="https://github.com/Omprakash3000.png"
                  alt="Omprakash"
                  className="h-9 w-9 rounded-xl ring-2 ring-brand-500/40 object-cover shadow"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
                <div>
                  <div className="font-bold text-white light:text-slate-900 text-xs">
                    Omprakash
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    @Omprakash3000
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/Omprakash3000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 text-[11px] font-semibold text-white transition flex items-center gap-1.5 light:bg-slate-200 light:text-slate-800 light:border-slate-300"
                >
                  <span>Profile</span>
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                </a>
                <a
                  href="https://github.com/Omprakash3000/SEOlytics-AI-AI-Powered-SEO-Search-Visibility-Analyzer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-brand-600 hover:bg-brand-500 px-2.5 py-1.5 text-[11px] font-bold text-white transition flex items-center gap-1.5 shadow"
                >
                  <span>Repository</span>
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/30 border border-slate-800/60 text-[11px] text-slate-400">
            <Shield className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              All API keys are protected client-side and only forwarded to your local backend. Never exposed publicly.
            </span>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Check className="h-4 w-4" />
              <span>Settings saved successfully!</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800 light:border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 font-semibold text-slate-400 hover:text-white light:hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-brand-600 px-5 py-2 font-bold text-white hover:bg-brand-500 transition shadow-md"
            >
              Save Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
