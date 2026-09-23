import React from 'react';
import { BookOpen, FileText, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

export default function ContentAnalysisCard({ contentAnalysis }) {
  if (!contentAnalysis) return null;

  const {
    word_count,
    sentence_count,
    paragraph_count,
    avg_sentence_length,
    reading_ease_score,
    reading_level,
    content_status,
    text_to_html_ratio
  } = contentAnalysis;

  // Reading ease color
  let readingColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  if (reading_ease_score < 50) readingColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  if (reading_ease_score < 30) readingColor = 'text-rose-400 border-rose-500/30 bg-rose-500/10';

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md light:bg-white light:border-slate-200">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Word Count</div>
          <div className="text-2xl font-extrabold font-mono text-white light:text-slate-900 mt-1">
            {formatNumber(word_count)}
          </div>
          <div className="text-[11px] font-medium text-brand-400 mt-1">
            {content_status}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md light:bg-white light:border-slate-200">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Sentence Count</div>
          <div className="text-2xl font-extrabold font-mono text-cyan-400 mt-1">
            {sentence_count}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Avg {avg_sentence_length} words / sent
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md light:bg-white light:border-slate-200">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Paragraphs</div>
          <div className="text-2xl font-extrabold font-mono text-purple-400 mt-1">
            {paragraph_count}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Structural Sections
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md light:bg-white light:border-slate-200">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Text / HTML Ratio</div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">
            {text_to_html_ratio}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Content Density
          </div>
        </div>
      </div>

      {/* Readability & Content Depth Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md light:bg-white light:border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white light:text-slate-900 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              Content Readability & Comprehension Heuristics
            </h3>
            <p className="text-xs text-slate-400">
              Flesch Reading Ease algorithm evaluates sentence flow and syllable density.
            </p>
          </div>

          <div className={`rounded-xl border px-3 py-1.5 text-xs font-bold ${readingColor}`}>
            Score: {reading_ease_score}/100 • {reading_level}
          </div>
        </div>

        {/* Readability Meter */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 light:bg-slate-50 light:border-slate-200">
          <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1.5">
            <span>Reading Difficulty Scale</span>
            <span className="text-white light:text-slate-900">{reading_level}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-800 light:bg-slate-200 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(10, reading_ease_score))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>0 (Very Difficult)</span>
            <span>50 (Standard)</span>
            <span>100 (Very Easy)</span>
          </div>
        </div>

        {/* Content Completeness Indicators */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 light:bg-slate-50 light:border-slate-200">
            <CheckCircle2 className={`h-4 w-4 shrink-0 ${word_count >= 300 ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="text-slate-300 light:text-slate-700">
              {word_count >= 300 ? 'Sufficient word depth (300+ words)' : 'Thin content warning (<300 words)'}
            </span>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 light:bg-slate-50 light:border-slate-200">
            <CheckCircle2 className={`h-4 w-4 shrink-0 ${avg_sentence_length <= 25 ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="text-slate-300 light:text-slate-700">
              {avg_sentence_length <= 25 ? 'Ideal sentence length (<25 words)' : 'Complex run-on sentences detected'}
            </span>
          </div>
        </div>

        <div className="mt-4 text-[11px] text-slate-400 flex items-center gap-1.5 italic">
          <HelpCircle className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span>Note: Algorithmic measurements represent heuristic quality indicators. Content value also depends on search intent and user engagement.</span>
        </div>
      </div>

    </div>
  );
}
