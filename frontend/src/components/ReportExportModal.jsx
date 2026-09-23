import React, { useState } from 'react';
import { X, FileText, Download, Printer, CheckCircle2, Loader2 } from 'lucide-react';
import { downloadHtmlReport } from '../services/api';

export default function ReportExportModal({ isOpen, onClose, analysisData }) {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !analysisData) return null;

  const handlePrintPdf = () => {
    window.print();
  };

  const handleDownloadHtml = async () => {
    setIsExporting(true);
    try {
      await downloadHtmlReport(analysisData);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      alert('Error exporting report: ' + e.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(analysisData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `SEOlytics_${new URL(analysisData.url).hostname}_audit.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 no-print">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl light:bg-white light:border-slate-300">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 light:border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white light:text-slate-900">
                Export SEO Audit Report
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-[280px]">
                {analysisData.url}
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

        {/* Modal Body */}
        <div className="py-6 space-y-4">
          <p className="text-xs text-slate-300 light:text-slate-600">
            Select your preferred export format for client presentation or archival:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Print / Save to PDF */}
            <div 
              onClick={handlePrintPdf}
              className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-brand-500 cursor-pointer transition text-left group light:bg-slate-50 light:border-slate-200"
            >
              <div className="flex items-center justify-between mb-2">
                <Printer className="h-5 w-5 text-brand-400 group-hover:scale-110 transition-transform" />
                <span className="rounded bg-brand-500/20 px-2 py-0.5 text-[10px] font-bold text-brand-300 uppercase">
                  Instant
                </span>
              </div>
              <h4 className="text-sm font-bold text-white light:text-slate-900">
                Print / Save as PDF
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Generates a clean print-optimized PDF view using your system dialog.
              </p>
            </div>

            {/* Standalone HTML File */}
            <div 
              onClick={handleDownloadHtml}
              className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500 cursor-pointer transition text-left group light:bg-slate-50 light:border-slate-200"
            >
              <div className="flex items-center justify-between mb-2">
                {isExporting ? (
                  <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
                ) : (
                  <Download className="h-5 w-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                )}
                <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 uppercase">
                  Standalone
                </span>
              </div>
              <h4 className="text-sm font-bold text-white light:text-slate-900">
                Download HTML Report
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Self-contained HTML file with embedded styling and all audit scores.
              </p>
            </div>

          </div>

          {/* JSON Export */}
          <div 
            onClick={handleDownloadJson}
            className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/30 hover:border-slate-700 cursor-pointer transition flex items-center justify-between text-xs text-slate-300 light:bg-slate-50 light:border-slate-200 light:text-slate-700"
          >
            <span>Raw Structured JSON Audit File</span>
            <span className="font-mono text-[11px] text-slate-400 underline">Download .json</span>
          </div>

          {downloadSuccess && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Report successfully compiled and downloaded!</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800 light:border-slate-200">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white light:hover:text-slate-900"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
