'use client';

import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

export default function MedicalDisclaimer() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border-b border-amber-500/20 px-4 py-2 text-xs text-amber-200/90 flex items-center justify-between z-40 sticky top-0">
      <div className="flex items-center gap-2 max-w-7xl mx-auto flex-1">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
        <p className="leading-tight">
          <strong className="font-semibold text-amber-300">Medical Disclaimer:</strong> FitMind AI provides fitness and nutritional suggestions for educational purposes and should not replace professional medical advice. Always consult a healthcare professional before starting any new diet or exercise regimen.
        </p>
      </div>
      <button 
        onClick={() => setDismissed(true)} 
        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-amber-200 transition-colors"
        aria-label="Dismiss disclaimer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
