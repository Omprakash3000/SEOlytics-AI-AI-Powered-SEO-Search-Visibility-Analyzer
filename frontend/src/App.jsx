import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DemoBanner from './components/DemoBanner';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ScanProgressModal from './components/ScanProgressModal';
import ReportExportModal from './components/ReportExportModal';
import SettingsModal from './components/SettingsModal';
import { useTheme } from './hooks/useTheme';
import { analyzeUrl } from './services/api';
import { DEMO_ANALYSIS_DATA } from './services/demoData';
import { AlertCircle, X } from 'lucide-react';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [targetUrlScanning, setTargetUrlScanning] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Trigger analysis for target URL
  const handleAnalyze = async (url, targetKeywords = null) => {
    setIsLoading(true);
    setTargetUrlScanning(url);
    setErrorMessage('');

    try {
      const data = await analyzeUrl(url, targetKeywords, true);
      setAnalysisData(data);
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred while analyzing the webpage.');
    } finally {
      setIsLoading(false);
      setTargetUrlScanning('');
    }
  };

  // Toggle demo mode
  const handleToggleDemo = () => {
    if (analysisData?.is_demo) {
      setAnalysisData(null);
    } else {
      setAnalysisData(DEMO_ANALYSIS_DATA);
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 transition-colors dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900">
      
      {/* Demo Banner if active */}
      {analysisData?.is_demo && (
        <DemoBanner onSwitchToLive={() => setAnalysisData(null)} />
      )}

      {/* Navbar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        isDemo={!!analysisData?.is_demo}
        toggleDemo={handleToggleDemo}
        onReset={handleReset}
        hasAnalysis={!!analysisData}
        openSettings={() => setIsSettingsOpen(true)}
        openExport={() => setIsExportOpen(true)}
      />

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="mx-auto max-w-4xl px-4 mt-4 w-full">
          <div className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-xs font-semibold text-rose-300 flex items-start justify-between gap-3 shadow-lg shadow-rose-950/20 light:bg-rose-50 light:border-rose-300 light:text-rose-800">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Unable to Complete SEO Scan</p>
                <p className="mt-0.5 text-xs text-rose-200 light:text-rose-700">{errorMessage}</p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Tip: Ensure the URL is public, begins with https://, and is not an internal or restricted IP.
                </p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage('')}
              className="text-rose-400 hover:text-white p-1 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {isLoading && (
          <ScanProgressModal targetUrl={targetUrlScanning} />
        )}

        {analysisData ? (
          <DashboardPage
            analysisData={analysisData}
            onReAnalyze={() => handleAnalyze(analysisData.url)}
            isLoading={isLoading}
            openExport={() => setIsExportOpen(true)}
            openSettings={() => setIsSettingsOpen(true)}
          />
        ) : (
          <LandingPage
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            onDemoClick={() => setAnalysisData(DEMO_ANALYSIS_DATA)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ReportExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        analysisData={analysisData}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

    </div>
  );
}
