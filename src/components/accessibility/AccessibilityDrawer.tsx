/**
 * Krithiq AI - Universal Accessibility & Elderly Mode Drawer
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Accessibility, Volume2, Eye, Sun, Sparkles, X } from 'lucide-react';

export const AccessibilityDrawer: React.FC = () => {
  const {
    isAccessibilityDrawerOpen,
    setAccessibilityDrawerOpen,
    accessibility,
    updateAccessibility,
  } = useApp();

  if (!isAccessibilityDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-950 border-l border-white/15 h-full p-6 shadow-2xl space-y-6 overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Accessibility className="w-6 h-6 text-amber-400" />
            <h3 className="text-lg font-black text-white">Universal Accessibility</h3>
          </div>
          <button
            onClick={() => setAccessibilityDrawerOpen(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Elderly Mode Switch */}
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Elderly Mode (Senior Friendly)
            </span>
            <input
              type="checkbox"
              checked={accessibility.elderlyMode}
              onChange={(e) => updateAccessibility({ elderlyMode: e.target.checked })}
              className="w-5 h-5 accent-amber-500 cursor-pointer"
            />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Increases font scale, simplifies UI touch buttons, and enables auto voice readouts for elderly citizens.
          </p>
        </div>

        {/* Text Font Size Slider */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Font Size Scale</span>
            <span className="text-cyan-400 capitalize">{accessibility.fontSize}</span>
          </div>

          <div className="flex items-center gap-2">
            {(['normal', 'large', 'extra-large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => updateAccessibility({ fontSize: size })}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer capitalize ${
                  accessibility.fontSize === size
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                {size.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast Mode */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              High Contrast Vision
            </span>
            <p className="text-[10px] text-slate-400">Maximizes text contrast for low vision.</p>
          </div>
          <input
            type="checkbox"
            checked={accessibility.highContrast}
            onChange={(e) => updateAccessibility({ highContrast: e.target.checked })}
            className="w-5 h-5 accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Auto Voice AI Readout */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              Auto Read AI Responses
            </span>
            <p className="text-[10px] text-slate-400">Plays Gemini voice audio automatically.</p>
          </div>
          <input
            type="checkbox"
            checked={accessibility.autoReadAIAnswers}
            onChange={(e) => updateAccessibility({ autoReadAIAnswers: e.target.checked })}
            className="w-5 h-5 accent-cyan-500 cursor-pointer"
          />
        </div>

      </div>
    </div>
  );
};
