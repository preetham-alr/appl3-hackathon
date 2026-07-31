/**
 * Krithiq AI - Full Profile & Executive Dashboard Modal Overlay
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfileView } from './UserProfileView';
import { X } from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const { isProfileModalOpen, setProfileModalOpen, theme } = useApp();

  if (!isProfileModalOpen) return null;

  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className={`w-full max-w-5xl border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] relative transition-colors ${
        isLight
          ? 'bg-slate-50 border-slate-200 text-slate-900'
          : 'bg-slate-950 border-white/10 text-white'
      }`}>
        
        {/* Sticky Close Header */}
        <div className={`px-6 py-3 border-b shrink-0 flex items-center justify-between z-30 sticky top-0 ${
          isLight ? 'bg-white/90 backdrop-blur-md border-slate-200' : 'bg-slate-900/90 backdrop-blur-md border-white/10'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-wider">Executive Civic Profile Dashboard</h3>
          </div>

          <button
            onClick={() => setProfileModalOpen(false)}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/10 hover:bg-white/20 text-slate-300'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Dashboard Container */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
          <UserProfileView />
        </div>

      </div>
    </div>
  );
};
