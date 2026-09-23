import React, { useState } from 'react';
import { Search, Check, X, Tag } from 'lucide-react';

export default function KeywordTable({ keywordAnalysis }) {
  const [filterQuery, setFilterQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  if (!keywordAnalysis) return null;

  const allKeywords = [
    ...(keywordAnalysis.primary_keywords || []),
    ...(keywordAnalysis.two_word_phrases || []),
    ...(keywordAnalysis.three_word_phrases || [])
  ];

  const filtered = allKeywords.filter(item => {
    const matchesQuery = item.keyword.toLowerCase().includes(filterQuery.toLowerCase());
    if (filterType === 'all') return matchesQuery;
    return matchesQuery && item.ngram_type === parseInt(filterType);
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md light:bg-white light:border-slate-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white light:text-slate-900 flex items-center gap-2">
            <Tag className="h-4 w-4 text-amber-400" />
            Keyword Placement & Density Matrix
          </h3>
          <p className="text-xs text-slate-400">
            Audit where your key search terms appear across critical on-page tags.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter keywords..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 light:bg-slate-50 light:border-slate-300 light:text-slate-900"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500 light:bg-slate-50 light:border-slate-300 light:text-slate-900"
          >
            <option value="all">All Phrases ({allKeywords.length})</option>
            <option value="1">1-Word Only</option>
            <option value="2">2-Word Only</option>
            <option value="3">3-Word Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 light:border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800 light:bg-slate-100 light:border-slate-200 light:text-slate-600">
            <tr>
              <th className="py-3 px-3.5">Keyword Phrase</th>
              <th className="py-3 px-2 text-center">Type</th>
              <th className="py-3 px-2 text-center">Freq</th>
              <th className="py-3 px-2 text-center">Density</th>
              <th className="py-3 px-2 text-center">Title</th>
              <th className="py-3 px-2 text-center">H1</th>
              <th className="py-3 px-2 text-center">H2</th>
              <th className="py-3 px-2 text-center">Meta Desc</th>
              <th className="py-3 px-2 text-center">1st Para</th>
              <th className="py-3 px-2 text-center">URL</th>
              <th className="py-3 px-2 text-center">Alt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 light:divide-slate-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="11" className="py-8 text-center text-slate-400">
                  No matching keywords found.
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition light:hover:bg-slate-50">
                  <td className="py-2.5 px-3.5 font-medium text-white light:text-slate-900">
                    {item.keyword}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-400 font-mono text-[11px]">
                    {item.ngram_type}w
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono font-semibold text-slate-300 light:text-slate-700">
                    {item.frequency}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono text-slate-300 light:text-slate-700">
                    <span className={item.density_percent > 4.5 ? 'text-rose-400 font-bold' : ''}>
                      {item.density_percent}%
                    </span>
                  </td>

                  {/* Location presence badges */}
                  <td className="py-2.5 px-2 text-center">
                    <LocationBadge present={item.locations?.in_title} />
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <LocationBadge present={item.locations?.in_h1} />
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <LocationBadge present={item.locations?.in_h2} />
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <LocationBadge present={item.locations?.in_meta_description} />
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <LocationBadge present={item.locations?.in_first_paragraph} />
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <LocationBadge present={item.locations?.in_url} />
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <LocationBadge present={item.locations?.in_image_alt} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LocationBadge({ present }) {
  if (present) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
        <Check className="h-3 w-3 stroke-[3]" />
      </span>
    );
  }
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-slate-500 light:bg-slate-200 light:text-slate-400">
      <X className="h-3 w-3" />
    </span>
  );
}
