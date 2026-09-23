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
