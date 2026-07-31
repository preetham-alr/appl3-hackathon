/**
 * Krithiq AI - Alive Bottom Navigation Bar
 */

import React from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Users,
  Tv,
  BarChart3,
  Landmark,
  HeartHandshake,
  User,
} from 'lucide-react';
import { t } from '../../utils/translations';

interface NavItem {
  id: NavTab;
  translationKey: string;
  defaultLabel: string;
  icon: React.ElementType;
  accent: string;
}

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, language, theme } = useApp();
  const isLight = theme === 'light';

  const navItems: NavItem[] = [
    { id: 'dashboard', translationKey: 'home', defaultLabel: 'Home', icon: LayoutDashboard, accent: 'cyan' },
    { id: 'verification', translationKey: 'verification', defaultLabel: 'Verify', icon: ShieldCheck, accent: 'emerald' },
    { id: 'civic', translationKey: 'civic', defaultLabel: 'Civic', icon: AlertTriangle, accent: 'orange' },
    { id: 'map', translationKey: 'map', defaultLabel: 'Civic Map', icon: MapPin, accent: 'earth' },
    { id: 'community', translationKey: 'community', defaultLabel: 'Community', icon: Users, accent: 'violet' },
    { id: 'schemes', translationKey: 'schemes', defaultLabel: 'Schemes', icon: Landmark, accent: 'indigo' },
    { id: 'volunteers', translationKey: 'volunteers', defaultLabel: 'Campaigns', icon: HeartHandshake, accent: 'rose' },
    { id: 'transparency', translationKey: 'dashboard', defaultLabel: 'Metrics', icon: BarChart3, accent: 'gold' },
  ];

  // Helper for dynamic active tab styles
  const getGlowStyle = (accent: string, isActive: boolean) => {
    if (!isActive) {
      return isLight
        ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
        : 'text-slate-400 hover:text-white hover:bg-white/5';
    }

    if (isLight) {
      return 'text-blue-800 bg-blue-50 border-blue-300 font-black shadow-xs';
    }

    switch (accent) {
      case 'emerald':
        return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40 shadow-lg shadow-emerald-500/25';
      case 'orange':
        return 'text-orange-400 bg-orange-500/15 border-orange-500/40 shadow-lg shadow-orange-500/25';
      case 'violet':
        return 'text-violet-400 bg-violet-500/15 border-violet-500/40 shadow-lg shadow-violet-500/25';
      case 'neon':
        return 'text-pink-400 bg-pink-500/15 border-pink-500/40 shadow-lg shadow-pink-500/25';
      case 'earth':
        return 'text-teal-400 bg-teal-500/15 border-teal-500/40 shadow-lg shadow-teal-500/25';
      case 'gold':
        return 'text-amber-400 bg-amber-500/15 border-amber-500/40 shadow-lg shadow-amber-500/25';
      case 'indigo':
        return 'text-indigo-400 bg-indigo-500/15 border-indigo-500/40 shadow-lg shadow-indigo-500/25';
      case 'rose':
        return 'text-rose-400 bg-rose-500/15 border-rose-500/40 shadow-lg shadow-rose-500/25';
      case 'cyan':
      default:
        return 'text-cyan-400 bg-cyan-500/15 border-cyan-500/40 shadow-lg shadow-cyan-500/25';
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-3 pointer-events-none">
      <div className={`max-w-6xl mx-auto backdrop-blur-2xl rounded-2xl p-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar pointer-events-auto transition-all duration-300 border ${
        isLight
          ? 'bg-white/95 border-slate-200/90 shadow-xl text-slate-800'
          : 'bg-slate-950/90 border-slate-800 shadow-2xl text-slate-100'
      }`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const activeStyle = getGlowStyle(item.accent, isActive);
          const labelText = t(item.translationKey, language, item.defaultLabel);

          return (
            <button
              key={item.id}
              onClick={() => {
                if ('vibrate' in navigator) navigator.vibrate(10);
                setActiveTab(item.id);
              }}
              className={`relative flex-1 min-w-[62px] sm:min-w-0 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center transition-all duration-300 group cursor-pointer border border-transparent ${activeStyle}`}
            >
              {/* Floating indicator dot */}
              {isActive && (
                <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor] animate-ping" />
              )}

              <Icon
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                  isActive ? 'scale-110 -translate-y-0.5' : 'group-hover:scale-105'
                }`}
              />

              <span
                className={`text-[9px] sm:text-[10px] font-bold tracking-tight mt-0.5 truncate max-w-full ${
                  isActive ? 'opacity-100 font-black' : 'opacity-70 group-hover:opacity-100'
                }`}
              >
                {labelText}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

