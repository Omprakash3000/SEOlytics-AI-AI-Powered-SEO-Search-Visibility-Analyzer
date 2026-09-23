import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Code2, Copy, Check } from 'lucide-react';

export default function RecommendationsList({ recommendations = [] }) {
  const [copiedId, setCopiedId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', ...new Set(recommendations.map(r => r.category))];

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = recommendations.filter(item => {
    if (filterCategory === 'All') return true;
    return item.category === filterCategory;
  });

  return (
    <div className="space-y-4">
      
      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md light:bg-white light:border-slate-200">
        <span className="text-xs font-semibold text-slate-400 mr-1">Category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              filterCategory === cat
                ? 'bg-brand-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-white light:text-slate-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-slate-800 bg-slate-900/40 text-xs text-slate-400">
            No recommendations in this category.
          </div>
        ) : (
          filtered.map((rec) => {
            let priorityBadge = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            if (rec.priority === 'High') priorityBadge = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
            else if (rec.priority === 'Medium') priorityBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/30';

            return (
              <div
                key={rec.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md transition hover:border-brand-500/40 light:bg-white light:border-slate-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white light:text-slate-900">
                      {rec.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400 light:bg-slate-100 light:text-slate-600">
                      {rec.category}
                    </span>
                    <span className={`rounded-md border px-2.5 py-0.5 text-[10px] font-bold uppercase ${priorityBadge}`}>
                      {rec.priority} Priority
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 light:bg-slate-50 light:border-slate-200">
                    <span className="font-semibold text-slate-400">Identified Gaps: </span>
                    <span className="text-slate-200 light:text-slate-700">{rec.problem}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-brand-950/20 border border-brand-500/20 light:bg-brand-50/50 light:border-brand-200">
                    <span className="font-bold text-brand-400">Action Plan: </span>
                    <span className="text-slate-100 font-medium light:text-slate-900">{rec.action}</span>
                  </div>

                  {rec.example && (
                    <div className="mt-3 relative">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                        <span className="flex items-center gap-1.5">
                          <Code2 className="h-3.5 w-3.5 text-indigo-400" />
                          Recommended Implementation Snippet:
                        </span>
                        <button
                          onClick={() => handleCopy(rec.id, rec.example)}
                          className="inline-flex items-center gap-1 text-[10px] text-brand-400 hover:text-brand-300 transition"
                        >
                          {copiedId === rec.id ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" /> Copy Code
                            </>
                          )}
                        </button>
                      </div>

                      <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap light:bg-slate-900 light:text-slate-200">
                        {rec.example}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
