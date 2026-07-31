/**
 * Krithiq AI - App Settings Modal
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, ShieldCheck, Wifi, Bell, Key, X, CheckCircle2 } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { isSettingsModalOpen, setSettingsModalOpen, isOffline, triggerSync, theme } = useApp();
  const isLight = theme === 'light';

  if (!isSettingsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-md border rounded-3xl shadow-2xl p-6 relative space-y-5 ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-white/15 text-white'
      }`}>
        
        <button
          onClick={() => setSettingsModalOpen(false)}
          className={`absolute top-4 right-4 p-2 rounded-full cursor-pointer ${
            isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/10 hover:bg-white/20 text-slate-300'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <Settings className={`w-6 h-6 ${isLight ? 'text-teal-700' : 'text-cyan-400'}`} />
          <h3 className={`text-lg font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>Application Settings</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
          }`}>
            <div>
              <div className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Wifi className={`w-4 h-4 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
                Offline First Mode & Local Queue
              </div>
              <p className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Allows offline report drafting & auto sync when online.</p>
            </div>
            <button
              onClick={triggerSync}
              className={`px-3 py-1 rounded-xl font-bold border cursor-pointer ${
                isLight
                  ? 'bg-teal-100 text-teal-900 border-teal-300 hover:bg-teal-200'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30'
              }`}
            >
              Sync Now
            </button>
          </div>

          <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
          }`}>
            <div>
              <div className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Bell className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-amber-400'}`} />
                Civic Emergency Push Alerts
              </div>
              <p className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Receive instant SLA updates & local ward warnings.</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-teal-600 cursor-pointer" />
          </div>

          <div className={`p-3.5 rounded-2xl border space-y-1 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
          }`}>
            <div className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Key className={`w-4 h-4 ${isLight ? 'text-teal-700' : 'text-cyan-400'}`} />
              Cryptographic Key Hash:
            </div>
            <div className={`p-2 rounded-xl font-mono text-[10px] truncate ${
              isLight ? 'bg-slate-200 text-teal-950 font-bold' : 'bg-black text-cyan-300'
            }`}>
              0x8a92f8b910e2d312c49a5b67e89f213a45c67d89
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
