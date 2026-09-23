import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  LayoutDashboard, 
  Cpu, 
  FileText, 
  Tag, 
  Search, 
  ShoppingBag, 
  AlertOctagon, 
  Sparkles, 
  Download, 
  Settings as SettingsIcon,
  RefreshCw,
  ExternalLink,
  Globe,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowUpRight
} from 'lucide-react';

import ScoreGauge from '../components/ScoreGauge';
import ScoreBreakdownChart from '../components/ScoreBreakdownChart';
import IssuesDonutChart from '../components/IssuesDonutChart';
import KeywordCloud from '../components/KeywordCloud';
import KeywordTable from '../components/KeywordTable';
import TechnicalSeoCard from '../components/TechnicalSeoCard';
import ContentAnalysisCard from '../components/ContentAnalysisCard';
import ProductSeoCard from '../components/ProductSeoCard';
import SearchVisibilitySection from '../components/SearchVisibilitySection';
import IssuesList from '../components/IssuesList';
import RecommendationsList from '../components/RecommendationsList';
import { formatDate, getScoreColor } from '../utils/formatters';

export default function DashboardPage({
  analysisData,
  onReAnalyze,
  isLoading,
  openExport,
  openSettings
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'technical', 'content', 'keywords', 'visibility', 'product', 'issues', 'recommendations'

  const { scores, technical_seo, content_analysis, keyword_analysis, product_seo, issues, recommendations, url, analyzed_at, is_demo } = analysisData;

  const criticalIssuesCount = issues.filter(i => i.severity === 'critical').length;
  const warningIssuesCount = issues.filter(i => i.severity === 'warning').length;
  const passedChecksCount = issues.filter(i => i.severity === 'passed').length;

  useEffect(() => {
    if (scores.overall_score >= 80) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  }, [scores.overall_score]);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'technical', label: 'Technical SEO', icon: <Cpu className="h-4 w-4" />, count: technical_seo.score },
    { id: 'content', label: 'Content Quality', icon: <FileText className="h-4 w-4" />, count: content_analysis.score },
    { id: 'keywords', label: 'Keywords', icon: <Tag className="h-4 w-4" />, count: keyword_analysis.score },
    { id: 'visibility', label: 'Search Visibility', icon: <Search className="h-4 w-4" /> },
    ...(product_seo.is_product_page ? [{ id: 'product', label: 'Product SEO', icon: <ShoppingBag className="h-4 w-4" />, count: product_seo.score }] : []),
    { id: 'issues', label: 'Issues & Checks', icon: <AlertOctagon className="h-4 w-4" />, badge: criticalIssuesCount > 0 ? `${criticalIssuesCount} Crit` : null },
    { id: 'recommendations', label: 'AI Recommendations', icon: <Sparkles className="h-4 w-4" />, count: recommendations.length }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Header Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 backdrop-blur-xl mb-6 shadow-xl light:bg-white light:border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600/20 border border-brand-500/30 text-brand-400">
              <Globe className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Target Website / URL:
                </span>
                <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  HTTP {technical_seo.status_code} OK
                </span>
                {product_seo.is_product_page && (
                  <span className="rounded-md bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-bold text-indigo-300">
                    E-Commerce Product
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <h1 className="text-base sm:text-lg font-bold text-white light:text-slate-900 font-mono truncate max-w-xl">
                  {url}
                </h1>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-white transition"
                  title="Open live URL in new tab"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Analyzed: {formatDate(analyzed_at)}
                </span>
                <span>•</span>
                <span>Scan Time: {analysisData.execution_time_seconds || '1.2'}s</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onReAnalyze}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition disabled:opacity-50 light:bg-slate-100 light:border-slate-300 light:text-slate-700"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Re-Analyze</span>
            </button>

            <button
              onClick={openExport}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-brand-500/20 hover:from-brand-500 hover:to-indigo-500 transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Report</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Dashboard Layout: Sidebar + Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar Tabs Navigation */}
        <div className="lg:col-span-3 space-y-1.5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 backdrop-blur-md light:bg-white light:border-slate-200">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
              Audit Modules
            </div>
            
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition ${
                      isActive
                        ? 'bg-brand-600 text-white font-bold shadow-md shadow-brand-500/20'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-white light:text-slate-600 light:hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="rounded-md bg-rose-500/30 border border-rose-500/40 px-1.5 py-0.5 text-[10px] font-bold text-rose-200">
                        {item.badge}
                      </span>
                    )}

                    {item.count !== undefined && !item.badge && (
                      <span className={`font-mono text-[11px] ${isActive ? 'text-white' : 'text-slate-400'}`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 pt-3 border-t border-slate-800/80 light:border-slate-200">
              <button
                onClick={openSettings}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800/60 hover:text-white transition light:text-slate-600 light:hover:bg-slate-100"
              >
                <SettingsIcon className="h-4 w-4" />
                <span>API Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Dynamic Tab Content */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Score Gauge & Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Gauge Card */}
                <div className="md:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md flex flex-col items-center justify-center light:bg-white light:border-slate-200">
                  <ScoreGauge score={scores.overall_score} size={210} strokeWidth={16} title="Overall SEO Score" />
                  
                  <div className="mt-3 grid grid-cols-3 gap-2 w-full text-center text-xs pt-3 border-t border-slate-800 light:border-slate-200">
                    <div>
                      <div className="font-mono font-bold text-rose-400 text-sm">{criticalIssuesCount}</div>
                      <div className="text-[10px] text-slate-400 uppercase">Critical</div>
                    </div>
                    <div>
                      <div className="font-mono font-bold text-amber-400 text-sm">{warningIssuesCount}</div>
                      <div className="text-[10px] text-slate-400 uppercase">Warnings</div>
                    </div>
                    <div>
                      <div className="font-mono font-bold text-emerald-400 text-sm">{passedChecksCount}</div>
                      <div className="text-[10px] text-slate-400 uppercase">Passed</div>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown Bar Chart */}
                <div className="md:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md flex flex-col justify-between light:bg-white light:border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-white light:text-slate-900 flex items-center gap-2">
                      <Layers className="h-4 w-4 text-brand-400" />
                      Weighted Category Scores
                    </h3>
                    <span className="text-[11px] text-slate-400">Total: 100%</span>
                  </div>
                  <ScoreBreakdownChart scores={scores} />
                </div>

              </div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div 
                  onClick={() => setActiveTab('technical')}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 cursor-pointer hover:border-brand-500 transition light:bg-white light:border-slate-200"
                >
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Technical SEO</div>
                  <div className="text-2xl font-extrabold font-mono text-cyan-400 mt-1">
                    {scores.technical_score}/100
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    SSL, Meta, Canonical, Speed
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('content')}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 cursor-pointer hover:border-brand-500 transition light:bg-white light:border-slate-200"
                >
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Content Quality</div>
                  <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">
                    {scores.content_score}/100
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {content_analysis.word_count} words • Readability
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('keywords')}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 cursor-pointer hover:border-brand-500 transition light:bg-white light:border-slate-200"
                >
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Keyword Score</div>
                  <div className="text-2xl font-extrabold font-mono text-amber-400 mt-1">
                    {scores.keyword_score}/100
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {keyword_analysis.total_keywords_extracted} Extracted Phrases
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('issues')}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 cursor-pointer hover:border-brand-500 transition light:bg-white light:border-slate-200"
                >
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">SEO Issues Found</div>
                  <div className="text-2xl font-extrabold font-mono text-rose-400 mt-1">
                    {criticalIssuesCount + warningIssuesCount}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {criticalIssuesCount} Critical • {warningIssuesCount} Warnings
                  </div>
                </div>
              </div>

              {/* Priority Issues & Action Items */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md light:bg-white light:border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white light:text-slate-900 flex items-center gap-2">
                    <AlertOctagon className="h-4 w-4 text-rose-400" />
                    Top Detected SEO Gaps & Action Items
                  </h3>
                  <button
                    onClick={() => setActiveTab('issues')}
                    className="text-xs text-brand-400 hover:text-brand-300 font-semibold transition"
                  >
                    View All ({issues.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {issues.filter(i => i.severity !== 'passed').slice(0, 4).map((issue) => (
                    <div
                      key={issue.id}
                      className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 light:bg-slate-50 light:border-slate-200"
                    >
                      <div className="flex items-start gap-3">
                        {issue.severity === 'critical' ? (
                          <AlertOctagon className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white light:text-slate-900">{issue.title}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">({issue.category})</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{issue.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top AI Recommendations */}
              <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 via-slate-900/60 to-slate-900/60 p-5 backdrop-blur-md light:bg-indigo-50/40 light:border-indigo-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white light:text-slate-900">
                      Top AI Recommendations
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('recommendations')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition"
                  >
                    View All ({recommendations.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {recommendations.slice(0, 3).map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 light:bg-white light:border-slate-200"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white light:text-slate-900">{rec.title}</span>
                        <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300">
                          {rec.priority} Priority
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 light:text-slate-600">{rec.action}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: TECHNICAL SEO */}
          {activeTab === 'technical' && (
            <TechnicalSeoCard technicalSeo={technical_seo} />
          )}

          {/* TAB 3: CONTENT QUALITY */}
          {activeTab === 'content' && (
            <ContentAnalysisCard contentAnalysis={content_analysis} />
          )}

          {/* TAB 4: KEYWORDS */}
          {activeTab === 'keywords' && (
            <div className="space-y-6">
              <KeywordCloud keywordAnalysis={keyword_analysis} />
              <KeywordTable keywordAnalysis={keyword_analysis} />
            </div>
          )}

          {/* TAB 5: SEARCH VISIBILITY */}
          {activeTab === 'visibility' && (
            <SearchVisibilitySection
              searchVisibility={analysisData.search_visibility}
              onOpenSettings={openSettings}
            />
          )}

          {/* TAB 6: PRODUCT SEO */}
          {activeTab === 'product' && (
            <ProductSeoCard productSeo={product_seo} />
          )}

          {/* TAB 7: ISSUES & CHECKS */}
          {activeTab === 'issues' && (
            <IssuesList issues={issues} />
          )}

          {/* TAB 8: AI RECOMMENDATIONS */}
          {activeTab === 'recommendations' && (
            <RecommendationsList recommendations={recommendations} />
          )}

        </div>

      </div>

    </div>
  );
}
