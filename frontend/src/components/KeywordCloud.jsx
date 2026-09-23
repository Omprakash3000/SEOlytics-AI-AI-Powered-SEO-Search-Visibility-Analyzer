import React, { useState } from 'react';
import { Tag, Sparkles } from 'lucide-react';

export default function KeywordCloud({ keywordAnalysis }) {
  const [activeTab, setActiveTab] = useState('1'); // '1', '2', '3'

  if (!keywordAnalysis) return null;

  let currentKeywords = [];
  if (activeTab === '1') currentKeywords = keywordAnalysis.primary_keywords || [];
  else if (activeTab === '2') currentKeywords = keywordAnalysis.two_word_phrases || [];
  else if (activeTab === '3') currentKeywords = keywordAnalysis.three_word_phrases || [];

  const maxFreq = Math.max(...currentKeywords.map(k => k.frequency), 1);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md light:bg-white light:border-slate-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white light:text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-400" />
            Extracted Keyword Cloud & Density
          </h3>
          <p className="text-xs text-slate-400">
            Interactive keyword prominence derived from live page body & headings.
          </p>
        </div>

        {/* N-gram Tabs */}
        <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs light:bg-slate-100 light:border-slate-300">
          <button
            onClick={() => setActiveTab('1')}
            className={`rounded-lg px-2.5 py-1 font-medium transition ${
              activeTab === '1'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white light:text-slate-600'
            }`}
          >
            1-Word
          </button>
          <button
            onClick={() => setActiveTab('2')}
            className={`rounded-lg px-2.5 py-1 font-medium transition ${
              activeTab === '2'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white light:text-slate-600'
            }`}
          >
            2-Word Phrases
          </button>
          <button
            onClick={() => setActiveTab('3')}
            className={`rounded-lg px-2.5 py-1 font-medium transition ${
              activeTab === '3'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white light:text-slate-600'
            }`}
          >
            3-Word Phrases
          </button>
        </div>
      </div>

      {/* Cloud Tag Badges */}
      <div className="flex flex-wrap items-center gap-2.5 p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 light:bg-slate-50 light:border-slate-200 min-h-[140px]">
        {currentKeywords.length === 0 ? (
          <div className="w-full text-center py-6 text-xs text-slate-400">
            No {activeTab}-word keyword phrases with sufficient density detected.
          </div>
        ) : (
          currentKeywords.map((kw, idx) => {
            // Scale font size based on frequency ratio
            const weightRatio = kw.frequency / maxFreq;
            let sizeClass = 'text-xs';
            let bgClass = 'bg-slate-800/60 border-slate-700/60 text-slate-300';
            
            if (weightRatio >= 0.75) {
              sizeClass = 'text-sm font-bold';
              bgClass = 'bg-brand-500/20 border-brand-500/40 text-brand-300 shadow-sm shadow-brand-500/10';
            } else if (weightRatio >= 0.45) {
              sizeClass = 'text-xs font-semibold';
              bgClass = 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300';
            }

            return (
              <span
                key={idx}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 transition transform hover:scale-105 cursor-default ${sizeClass} ${bgClass}`}
              >
                <span>{kw.keyword}</span>
                <span className="rounded-md bg-slate-900/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 light:bg-slate-200 light:text-slate-700">
                  {kw.frequency}x ({kw.density_percent}%)
                </span>
              </span>
            );
          })
        )}
      </div>
    </div>
  );
}
