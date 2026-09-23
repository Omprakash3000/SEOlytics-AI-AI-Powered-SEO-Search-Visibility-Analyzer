import React from 'react';
import { Search, Lock, Key, ExternalLink, ShieldCheck, Database, CheckCircle2 } from 'lucide-react';

export default function SearchVisibilitySection({ searchVisibility, onOpenSettings }) {
  const isConnected = searchVisibility?.is_connected || false;

  return (
    <div className="space-y-6">
      
      {/* Top Banner explaining Website-Derived vs External Search Data */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md light:bg-white light:border-slate-200">
        <h3 className="text-sm font-bold text-white light:text-slate-900 mb-2 flex items-center gap-2">
          <Search className="h-4 w-4 text-brand-400" />
          Organic Search Engine Visibility & Ranking Intelligence
        </h3>
        <p className="text-xs text-slate-300 light:text-slate-600 leading-relaxed">
          Search engine analytics are strictly split into two layers: <strong>1) Webpage-Derived Signals</strong> (calculated locally from live DOM structure) and <strong>2) External SERP Intelligence</strong> (Google ranking positions, keyword monthly search volume, backlinks, and organic traffic curves).
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 light:bg-slate-50 light:border-slate-200">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="h-4 w-4" /> Live Webpage Signals (Active)
            </div>
            <p className="text-slate-400 text-[11px]">
              Title, Meta Description, H1-H6 Hierarchy, Content Readability, Schema JSON-LD, Internal Links, Page Load Speed, Image Alt tags.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 light:bg-slate-50 light:border-slate-200">
            <div className="font-bold text-indigo-400 flex items-center gap-1.5 mb-1.5">
              <Database className="h-4 w-4" /> External SERP Intelligence (API Required)
            </div>
            <p className="text-slate-400 text-[11px]">
              Live Google SERP Position, Monthly Search Volumes, Domain Authority, Backlink profiles, Competitor ranking overlap.
            </p>
          </div>
        </div>
      </div>

      {/* External Search Intelligence Provider Card */}
      {!isConnected ? (
        <div className="relative rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-8 text-center backdrop-blur-md light:bg-slate-50/50 light:border-slate-300">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-4 shadow-lg shadow-indigo-500/10">
            <Lock className="h-7 w-7" />
          </div>

          <h4 className="text-base font-bold text-white light:text-slate-900">
            Live Search Provider Disconnected
          </h4>
          <p className="mt-2 text-xs text-slate-300 light:text-slate-600 max-w-lg mx-auto leading-relaxed">
            "Data unavailable — connect a supported SEO/search API to retrieve live ranking data."
          </p>

          <p className="mt-2 text-[11px] text-slate-500 max-w-md mx-auto">
            SEOlytics AI adheres strictly to data transparency and never invents artificial Google ranking positions or fake search volumes.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-500 transition shadow-md shadow-brand-500/20"
            >
              <Key className="h-3.5 w-3.5" />
              Connect SEO Data Provider
            </button>
          </div>

          {/* Supported Providers Badges */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 light:border-slate-200">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Supported External Providers
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['Google Search Console', 'SerpAPI', 'DataForSEO', 'Semrush', 'Ahrefs'].map((prov, i) => (
                <span
                  key={i}
                  className="rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1 text-[11px] font-mono text-slate-400 light:bg-white light:border-slate-200"
                >
                  {prov}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white light:text-slate-900">
                Connected to {searchVisibility.provider_name}
              </h4>
              <p className="text-xs text-emerald-300">
                {searchVisibility.status_message}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
