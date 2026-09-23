import React from 'react';
import { Shield, ShieldAlert, Check, X, Code, Image as ImageIcon, Link as LinkIcon, Globe, FileCode2, Layers } from 'lucide-react';

export default function TechnicalSeoCard({ technicalSeo }) {
  if (!technicalSeo) return null;

  const { meta, headings, images, links, structured_data, security_headers } = technicalSeo;

  return (
    <div className="space-y-6">
      
      {/* Top Technical Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md light:bg-white light:border-slate-200">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">HTTP Status</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {technicalSeo.status_code} OK
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Redirects: {technicalSeo.redirect_count}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md light:bg-white light:border-slate-200">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Response Time</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
            {Math.round(technicalSeo.response_time_ms)} ms
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {technicalSeo.response_time_ms < 800 ? '⚡ Ultra Fast TTFB' : 'Standard Response'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md light:bg-white light:border-slate-200">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Security / SSL</div>
          <div className="text-xl font-bold font-mono text-brand-400 mt-1 flex items-center gap-1.5">
            {technicalSeo.is_https ? (
              <>
                <Shield className="h-5 w-5 text-emerald-400" />
                <span>HTTPS</span>
              </>
            ) : (
              <>
                <ShieldAlert className="h-5 w-5 text-rose-400" />
                <span className="text-rose-400">HTTP Insecure</span>
              </>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            HSTS: {security_headers.hsts ? 'Active' : 'Missing'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md light:bg-white light:border-slate-200">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Page Size</div>
          <div className="text-xl font-bold font-mono text-purple-400 mt-1">
            {technicalSeo.page_size_kb} KB
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            HTML Document Weight
          </div>
        </div>
      </div>

      {/* Meta & Canonical Details */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md light:bg-white light:border-slate-200">
        <h3 className="text-sm font-bold text-white light:text-slate-900 mb-3 flex items-center gap-2">
          <Globe className="h-4 w-4 text-brand-400" />
          Meta & Core HTML Directives
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 light:bg-slate-50 light:border-slate-200">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="font-semibold text-white light:text-slate-900">Title Tag:</span>
              <span className="font-mono">{meta.title_length} characters</span>
            </div>
            <p className="text-slate-200 light:text-slate-800 font-medium">
              {meta.title || <span className="text-rose-400 italic">No Title Tag Detected</span>}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 light:bg-slate-50 light:border-slate-200">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="font-semibold text-white light:text-slate-900">Meta Description:</span>
              <span className="font-mono">{meta.description_length} characters</span>
            </div>
            <p className="text-slate-200 light:text-slate-800">
              {meta.description || <span className="text-amber-400 italic">No Meta Description Detected</span>}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 light:bg-slate-50 light:border-slate-200">
              <span className="text-slate-400 block text-[11px]">Canonical URL:</span>
              <span className="font-mono text-white light:text-slate-900 truncate block mt-0.5" title={meta.canonical}>
                {meta.canonical || 'Not specified'}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 light:bg-slate-50 light:border-slate-200">
              <span className="text-slate-400 block text-[11px]">Robots Directives:</span>
              <span className="font-mono text-white light:text-slate-900 truncate block mt-0.5">
                {meta.robots || 'index, follow (default)'}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 light:bg-slate-50 light:border-slate-200">
              <span className="text-slate-400 block text-[11px]">Viewport / Charset:</span>
              <span className="font-mono text-white light:text-slate-900 truncate block mt-0.5">
                {meta.charset || 'UTF-8'} • {meta.viewport ? 'Mobile Friendly' : 'Missing'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Headings Structure & Hierarchy */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md light:bg-white light:border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white light:text-slate-900 flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-400" />
            Heading Structure (H1 – H3 Hierarchy)
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {headings.total_headings} Total Headings
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 light:bg-slate-50 light:border-slate-200">
            <div className="flex items-center justify-between font-semibold text-brand-400 mb-1">
              <span>H1 Heading ({headings.h1_count})</span>
              <span className={headings.h1_count === 1 ? 'text-emerald-400' : 'text-amber-400'}>
                {headings.h1_count === 1 ? '✓ Optimal (Single H1)' : '⚠ Check H1 Count'}
              </span>
            </div>
            {headings.h1_tags.length > 0 ? (
              headings.h1_tags.map((h, i) => (
                <p key={i} className="text-white light:text-slate-900 font-medium">
                  "{h}"
                </p>
              ))
            ) : (
              <p className="text-rose-400 italic">Missing primary H1 tag</p>
            )}
          </div>

          {headings.h2_tags.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 light:bg-slate-50 light:border-slate-200">
              <div className="font-semibold text-indigo-400 mb-1.5">
                H2 Subheadings ({headings.h2_count})
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 light:text-slate-700">
                {headings.h2_tags.slice(0, 6).map((h, i) => (
                  <li key={i} className="truncate">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Images & Links Audit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Images Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md light:bg-white light:border-slate-200">
          <h3 className="text-sm font-bold text-white light:text-slate-900 mb-3 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-emerald-400" />
            Images & Alt Attributes
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 light:bg-slate-50 light:border-slate-200">
              <div className="text-base font-bold font-mono text-white light:text-slate-900">{images.total_images}</div>
              <div className="text-[10px] text-slate-400 uppercase">Total Images</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 light:bg-slate-50 light:border-slate-200">
              <div className="text-base font-bold font-mono text-emerald-400">{images.images_with_alt}</div>
              <div className="text-[10px] text-slate-400 uppercase">With Alt</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 light:bg-slate-50 light:border-slate-200">
              <div className={`text-base font-bold font-mono ${images.images_missing_alt > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                {images.images_missing_alt}
              </div>
              <div className="text-[10px] text-slate-400 uppercase">Missing Alt</div>
            </div>
          </div>
          {images.sample_images.length > 0 && (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-[11px]">
              {images.sample_images.slice(0, 4).map((img, idx) => (
                <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-slate-950/30 border border-slate-800/40 light:bg-slate-50 light:border-slate-200">
                  <span className="truncate max-w-[200px] text-slate-400 font-mono">{img.src}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${img.has_alt && !img.is_empty_alt ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {img.has_alt && !img.is_empty_alt ? 'Alt OK' : 'Missing Alt'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Links Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md light:bg-white light:border-slate-200">
          <h3 className="text-sm font-bold text-white light:text-slate-900 mb-3 flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-cyan-400" />
            Link Profile & Anchor Structure
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 light:bg-slate-50 light:border-slate-200">
              <div className="text-base font-bold font-mono text-white light:text-slate-900">{links.total_links}</div>
              <div className="text-[10px] text-slate-400 uppercase">Total Links</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 light:bg-slate-50 light:border-slate-200">
              <div className="text-base font-bold font-mono text-cyan-400">{links.internal_links_count}</div>
              <div className="text-[10px] text-slate-400 uppercase">Internal</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 light:bg-slate-50 light:border-slate-200">
              <div className="text-base font-bold font-mono text-purple-400">{links.external_links_count}</div>
              <div className="text-[10px] text-slate-400 uppercase">External</div>
            </div>
          </div>
          {links.empty_anchor_count > 0 && (
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
              ⚠ {links.empty_anchor_count} links have empty anchor text.
            </div>
          )}
        </div>

      </div>

      {/* Structured Data / Schema */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md light:bg-white light:border-slate-200">
        <h3 className="text-sm font-bold text-white light:text-slate-900 mb-2 flex items-center gap-2">
          <FileCode2 className="h-4 w-4 text-amber-400" />
          Detected Schema.org Structured Data
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          JSON-LD & Microdata markup enables Google Rich Snippets, Star Ratings & Merchant Badges.
        </p>

        {structured_data.schema_types.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {structured_data.schema_types.map((type, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 font-mono"
              >
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                Schema: {type}
              </span>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
            No Schema.org structured data detected on this webpage.
          </div>
        )}
      </div>

    </div>
  );
}
