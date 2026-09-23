import React from 'react';
import HeroSection from '../components/HeroSection';
import { 
  ShieldCheck, 
  Search, 
  Cpu, 
  Sparkles, 
  BarChart3, 
  FileText, 
  ShoppingBag, 
  Layers, 
  TrendingUp, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage({ onAnalyze, isLoading, onDemoClick }) {
  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <HeroSection 
        onAnalyze={onAnalyze} 
        isLoading={isLoading} 
        onDemoClick={onDemoClick} 
      />

      {/* Feature Showcase Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900 tracking-tight">
            Comprehensive SEO Auditing & Deep Visibility Insights
          </h2>
          <p className="mt-3 text-sm text-slate-400 light:text-slate-600">
            Everything your brand needs to diagnose search engine ranking hurdles, fix technical blockers, and win higher SERP real estate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Technical SEO */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md transition hover:border-brand-500/40 light:bg-white light:border-slate-200">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 mb-4">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white light:text-slate-900">
              Technical & Core Web Directives
            </h3>
            <p className="mt-2 text-xs text-slate-400 light:text-slate-600 leading-relaxed">
              Verify SSL encryption, canonical tags, noindex robots directives, HTTP headers, image alt attributes, and Schema.org JSON-LD structured data.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-300 light:text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Title & Meta bounds check
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> H1-H6 semantic hierarchy
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> OpenGraph & Twitter Cards
              </li>
            </ul>
          </div>

          {/* Card 2: Content & Readability */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md transition hover:border-brand-500/40 light:bg-white light:border-slate-200">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white light:text-slate-900">
              Content Quality & Readability
            </h3>
            <p className="mt-2 text-xs text-slate-400 light:text-slate-600 leading-relaxed">
              Measure word count depth, sentence structure, Flesch Reading Ease level, paragraph distribution, and thin-content indicators.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-300 light:text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Flesch reading score algorithm
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Text-to-HTML ratio
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Thin content detection
              </li>
            </ul>
          </div>

          {/* Card 3: AI Action Engine */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md transition hover:border-brand-500/40 light:bg-white light:border-slate-200">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white light:text-slate-900">
              Actionable AI Recommendations
            </h3>
            <p className="mt-2 text-xs text-slate-400 light:text-slate-600 leading-relaxed">
              Transform detected audit issues into high-impact, prioritized fix plans with copy improvements, meta templates, and code snippets.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-300 light:text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> High/Medium/Low priority fixes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> Ready-to-use code snippets
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> One-click PDF & HTML export
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Trust & Methodology Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-slate-950 p-8 sm:p-12 text-center relative overflow-hidden light:bg-slate-50 light:border-slate-300">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="h-4 w-4" /> 100% Real Analysis Guarantee
            </div>
            <h3 className="text-2xl font-bold text-white light:text-slate-900">
              Deterministic Scoring. Zero Fabricated Metrics.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 light:text-slate-600 leading-relaxed">
              Unlike generic audit tools that fabricate fake Google ranks, SEOlytics AI audits actual live DOM structure, headers, schema, and content. External SERP data requires an active search provider connection.
            </p>
            <div className="pt-2">
              <button
                onClick={onDemoClick}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 px-6 py-3 text-xs font-bold text-white shadow-lg hover:from-brand-500 hover:to-purple-500 transition"
              >
                <span>Launch Interactive Demo Store</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
