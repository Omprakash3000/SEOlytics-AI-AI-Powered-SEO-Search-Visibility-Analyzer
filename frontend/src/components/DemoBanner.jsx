import React from 'react';
import { Zap, AlertTriangle, ArrowRight } from 'lucide-react';

export default function DemoBanner({ onSwitchToLive }) {
  return (
    <div className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2 text-xs font-semibold shadow-md flex items-center justify-between gap-3 no-print">
      <div className="flex items-center gap-2 mx-auto sm:mx-0">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/30 text-amber-200">
          <Zap className="h-3 w-3 fill-amber-300" />
        </span>
        <span>
          <strong className="tracking-wider uppercase bg-black/40 px-1.5 py-0.5 rounded text-[10px] mr-1.5 border border-white/20">
            DEMO DATA
          </strong>
          You are viewing sample audit data for a demo marathon footwear store.
        </span>
      </div>

      <button
        onClick={onSwitchToLive}
        className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-black/40 hover:bg-black/60 px-3 py-1 text-xs text-amber-100 transition border border-white/20 shrink-0"
      >
        <span>Analyze Live URL</span>
        <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}
