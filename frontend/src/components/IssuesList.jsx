import React, { useState } from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Filter } from 'lucide-react';

export default function IssuesList({ issues = [] }) {
  const [filterSeverity, setFilterSeverity] = useState('all'); // 'all', 'critical', 'warning', 'passed'
  const [expandedIds, setExpandedIds] = useState({});

  const toggleExpand = (id) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const passedCount = issues.filter(i => i.severity === 'passed').length;

  const filteredIssues = issues.filter(item => {
    if (filterSeverity === 'all') return true;
    return item.severity === filterSeverity;
  });

  return (
    <div className="space-y-4">
      
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md light:bg-white light:border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300 light:text-slate-700">Filter Issues:</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`rounded-lg px-3 py-1.5 transition ${
              filterSeverity === 'all'
                ? 'bg-slate-700 text-white font-bold'
                : 'text-slate-400 hover:text-white light:text-slate-600'
            }`}
          >
            All ({issues.length})
          </button>
          <button
            onClick={() => setFilterSeverity('critical')}
            className={`rounded-lg px-3 py-1.5 transition flex items-center gap-1.5 ${
              filterSeverity === 'critical'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            <AlertOctagon className="h-3.5 w-3.5 text-rose-400" />
            Critical ({criticalCount})
          </button>
          <button
            onClick={() => setFilterSeverity('warning')}
            className={`rounded-lg px-3 py-1.5 transition flex items-center gap-1.5 ${
              filterSeverity === 'warning'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            Warnings ({warningCount})
          </button>
          <button
            onClick={() => setFilterSeverity('passed')}
            className={`rounded-lg px-3 py-1.5 transition flex items-center gap-1.5 ${
              filterSeverity === 'passed'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Passed ({passedCount})
          </button>
        </div>
      </div>

      {/* Issues List Items */}
      <div className="space-y-3">
        {filteredIssues.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-slate-800 bg-slate-900/40 text-xs text-slate-400">
            No issues found in this category.
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const isExpanded = !!expandedIds[issue.id];

            let badgeConfig = {
              border: 'border-slate-800',
              bg: 'bg-slate-900/60',
              icon: <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />,
              badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            };

            if (issue.severity === 'critical') {
              badgeConfig = {
                border: 'border-rose-500/30',
                bg: 'bg-rose-950/20',
                icon: <AlertOctagon className="h-4 w-4 text-rose-400 shrink-0" />,
                badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              };
            } else if (issue.severity === 'warning') {
              badgeConfig = {
                border: 'border-amber-500/30',
                bg: 'bg-amber-950/20',
                icon: <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />,
                badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              };
            }

            return (
              <div
                key={issue.id}
                className={`rounded-2xl border ${badgeConfig.border} ${badgeConfig.bg} p-4 transition backdrop-blur-md light:bg-white light:border-slate-200`}
              >
                <div
                  onClick={() => toggleExpand(issue.id)}
                  className="flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    {badgeConfig.icon}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white light:text-slate-900">
                          {issue.title}
                        </span>
                        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${badgeConfig.badge}`}>
                          {issue.severity}
                        </span>
                        <span className="text-[11px] text-slate-400 hidden sm:inline">
                          • {issue.category}
                        </span>
                      </div>
                      {issue.problem && issue.problem !== 'None' && (
                        <p className="text-xs text-slate-300 light:text-slate-600 mt-1 line-clamp-1">
                          {issue.problem}
                        </p>
                      )}
                    </div>
                  </div>

                  <button className="text-slate-400 hover:text-white p-1 rounded-lg">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs space-y-2 light:border-slate-200">
                    {issue.problem && issue.problem !== 'None' && (
                      <div>
                        <span className="font-semibold text-slate-400">Problem: </span>
                        <span className="text-slate-200 light:text-slate-700">{issue.problem}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-slate-400">Why It Matters: </span>
                      <span className="text-slate-200 light:text-slate-700">{issue.why_it_matters}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-brand-400">Recommended Action: </span>
                      <span className="text-slate-100 font-medium light:text-slate-900">{issue.recommendation}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
