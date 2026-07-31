/**
 * Krithiq AI - Refined Top Header Navigation Bar
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { IntegrityDashboardModal } from './IntegrityDashboardModal';
import {
  ShieldCheck,
  Search,
  Award,
  Bell,
  Globe,
  Sun,
  Moon,
  MapPin,
  Sparkles,
  CheckCheck,
  Trash2,
  ArrowRight,
  Activity,
  ArrowLeft,
  Home,
} from 'lucide-react';
import { LANGUAGE_NAMES, t } from '../../utils/translations';
import { LanguageCode } from '../../types';

export const Header: React.FC = () => {
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    user,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    setNotificationsModalOpen,
    setSearchModalOpen,
    setRewardsModalOpen,
    setProfileModalOpen,
    setLocationModalOpen,
    currentLocation,
    activeTab,
    setActiveTab,
    goBack,
  } = useApp();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [isIntegrityModalOpen, setIsIntegrityModalOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const languagesList: Array<{ code: LanguageCode; label: string; flag: string }> = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
    { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', label: 'മലയാളം', flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', label: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'bn', label: 'বাংলা', flag: '🇮🇳' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  ];

  // Close notification dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifDropdown(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNotifDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isLight = theme === 'light';

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-xl transition-all duration-300 ${
        isLight
          ? 'bg-white/95 border-b border-gray-200 text-gray-900 shadow-xs'
          : 'bg-slate-950/85 border-b border-slate-800 text-slate-100 shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2.5">
        
        {/* 1. Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl shadow-xs group-hover:scale-105 transition-transform duration-300 ${
              isLight
                ? 'bg-gradient-to-tr from-teal-800 via-teal-900 to-indigo-950 text-white shadow-md'
                : 'bg-gradient-to-tr from-teal-600 via-blue-800 to-indigo-900 p-[1.5px]'
            }`}>
              {isLight ? (
                <ShieldCheck className="w-5 h-5 text-white animate-pulse" />
              ) : (
                <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-cyan-400 animate-pulse" />
                </div>
              )}
            </div>
            <div className="hidden xs:block">
              <div className="flex items-center gap-1.5">
                <span className={`font-black text-base sm:text-lg tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
                  Krithiq<span className={isLight ? 'text-teal-800 font-black' : 'text-cyan-400 font-black'}> AI</span>
                </span>
                <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full hidden sm:inline-block ${
                  isLight ? 'bg-teal-100 text-teal-950 border border-teal-300' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`}>
                  Super App
                </span>
              </div>
              <p className={`text-[10px] font-semibold hidden md:block ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>
                {t('appTagline', language)}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Location Chip Trigger */}
        <button
          onClick={() => setLocationModalOpen(true)}
          className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer truncate max-w-[170px] ${
            isLight
              ? 'bg-white border-gray-200 hover:border-blue-600 text-gray-800 hover:text-blue-900 shadow-2xs'
              : 'bg-white/5 border-white/10 hover:border-teal-500/40 text-teal-300'
          }`}
          title="Change location & radius"
        >
          <MapPin className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-blue-800' : 'text-teal-400'}`} />
          <span className="truncate">{currentLocation.name.split(',')[0]}</span>
        </button>

        {/* 3. Global AI Search */}
        <button
          onClick={() => setSearchModalOpen(true)}
          className={`flex-1 max-w-sm hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs transition-all cursor-pointer group ${
            isLight
              ? 'bg-white border-gray-200 text-gray-600 hover:border-blue-600 hover:shadow-2xs focus-within:ring-2 focus-within:ring-blue-600'
              : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-cyan-500/40'
          }`}
        >
          <Search className={`w-4 h-4 transition-colors shrink-0 ${isLight ? 'text-gray-500 group-hover:text-blue-800' : 'text-slate-400 group-hover:text-cyan-400'}`} />
          <span className={`flex-1 text-left truncate ${isLight ? 'text-gray-500 font-medium' : 'text-slate-400'}`}>{t('searchPlaceholder', language)}</span>
          <kbd className={`px-1.5 py-0.5 text-[9px] font-mono rounded border ${
            isLight ? 'bg-gray-100 text-gray-600 border-gray-200 font-bold' : 'bg-white/10 text-slate-300 border-white/10'
          }`}>
            ⌘K
          </kbd>
        </button>

        {/* Right Nav Bar Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Mobile Search Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className={`p-2 rounded-xl border md:hidden cursor-pointer ${
              isLight ? 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50' : 'bg-white/5 border-white/10 text-slate-300'
            }`}
            title="Global Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* 4. Rewards Section Button */}
          <button
            onClick={() => setRewardsModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              isLight
                ? 'bg-amber-50 border-amber-200 text-amber-950 hover:bg-amber-100/80'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25'
            }`}
            title="Open Rewards & Missions Dashboard"
          >
            <Award className={`w-4 h-4 animate-pulse shrink-0 ${isLight ? 'text-amber-700' : 'text-amber-400'}`} />
            <span className="hidden sm:inline font-black">{(user?.xp ?? 1420).toLocaleString()} XP</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${
              isLight ? 'bg-amber-200/90 text-amber-950' : 'bg-amber-500/30 text-amber-200'
            }`}>
              L{user?.level ?? 5}
            </span>
          </button>

          {/* 5. Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className={`p-2 rounded-xl border transition-all relative cursor-pointer ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200/80'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className={`absolute -top-1 -right-1 w-4 h-4 font-black text-[10px] rounded-full flex items-center justify-center animate-bounce ${
                  isLight ? 'bg-teal-600 text-white' : 'bg-cyan-500 text-slate-950'
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className={`absolute right-0 mt-3 w-80 sm:w-96 p-3.5 border rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-cyan-500/40 text-slate-100'
              }`}>
                <div className={`flex items-center justify-between pb-2.5 mb-2.5 border-b ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
                  <h4 className={`text-xs font-extrabold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-teal-700' : 'text-cyan-400'}`} />
                    {t('notifications', language)} & Live Alerts
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <button
                      onClick={markAllNotificationsRead}
                      className={`${isLight ? 'text-teal-700' : 'text-cyan-400'} hover:underline font-semibold flex items-center gap-1 cursor-pointer`}
                    >
                      <CheckCheck className="w-3 h-3" /> Read All
                    </button>
                    <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>|</span>
                    <button
                      onClick={clearNotifications}
                      className="text-slate-400 hover:text-rose-500 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">No notifications right now.</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          setShowNotifDropdown(false);
                          if (n.actionTab) {
                            setActiveTab(n.actionTab);
                          } else if (n.category === 'complaints') {
                            setActiveTab('civic');
                          } else if (n.category === 'schemes') {
                            setActiveTab('schemes');
                          } else if (n.category === 'nearby') {
                            setActiveTab('map');
                          } else {
                            setActiveTab('community');
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                          n.read
                            ? isLight ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-white/5 border-white/5 text-slate-400'
                            : isLight ? 'bg-teal-50/70 border-teal-200 text-slate-900 shadow-xs' : 'bg-cyan-500/10 border-cyan-500/30 text-slate-200 shadow-md'
                        }`}
                      >
                        {/* Indicator Dot */}
                        <span
                          className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                            n.read ? 'bg-slate-400' : isLight ? 'bg-teal-600' : 'bg-cyan-400 animate-ping'
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className={`font-bold text-[11px] truncate max-w-[200px] ${isLight ? 'text-slate-900' : 'text-white'}`}>{n.title}</span>
                            <span className="text-[9px] text-slate-400 shrink-0">{n.time}</span>
                          </div>
                          <p className={`text-[11px] leading-snug line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{n.body}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Open Full Notification Center Button */}
                <div className={`pt-2.5 mt-2.5 border-t text-center ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
                  <button
                    onClick={() => {
                      setShowNotifDropdown(false);
                      setNotificationsModalOpen(true);
                    }}
                    className={`w-full py-2 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isLight
                        ? 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
                        : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    <span>Open Notification Center</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 6. Language Selector with 10 Languages */}
          <div className="relative group">
            <button className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
            }`}>
              <Globe className={`w-4 h-4 ${isLight ? 'text-teal-700' : 'text-cyan-400'}`} />
              <span className="uppercase font-bold">{language}</span>
            </button>
            <div className={`absolute right-0 mt-2 w-44 py-2 border rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 max-h-80 overflow-y-auto ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-cyan-500/30 text-slate-100'
            }`}>
              {languagesList.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    language === l.code
                      ? isLight ? 'text-teal-800 font-bold bg-teal-50' : 'text-cyan-400 font-bold bg-cyan-500/15'
                      : isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase">{l.code}</span>
                </button>
              ))}
            </div>
          </div>


          {/* 7. Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'black' ? 'light' : 'black')}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-amber-600 hover:bg-slate-200/80'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Light / Dark Theme"
          >
            {theme === 'black' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-700" />}
          </button>

          {/* 8. Profile Modal Launcher */}
          <button
            onClick={() => {
              setActiveTab('profile');
              setProfileModalOpen(true);
            }}
            className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-100 border-slate-200 hover:border-teal-600'
                : 'bg-white/5 border-white/10 hover:border-cyan-500/40'
            }`}
            title="View Full Profile & Role Settings"
          >
            <img
              src={user?.avatar}
              alt={user?.name}
              className={`w-7 h-7 rounded-lg object-cover ring-2 ${isLight ? 'ring-teal-600/40' : 'ring-cyan-500/40'}`}
            />
            <div className="text-left hidden lg:block">
              <div className="flex items-center gap-1.5">
                <p className={`text-xs font-bold leading-none truncate max-w-[80px] ${isLight ? 'text-slate-900' : 'text-white'}`}>{user?.name}</p>
                <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase ${
                  user?.role === 'government'
                    ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/40'
                    : user?.role === 'ngo'
                    ? 'bg-violet-500/20 text-violet-700 border border-violet-500/40'
                    : isLight
                    ? 'bg-teal-100 text-teal-800 border border-teal-300'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`}>
                  {user?.role || 'Citizen'}
                </span>
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-semibold mt-0.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                <ShieldCheck className="w-3 h-3" />
                <span>{user?.trustScore} Trust</span>
              </div>
            </div>
          </button>

        </div>
      </div>

      {/* Integrity & Health Diagnostic Console Overlay */}
      <IntegrityDashboardModal
        isOpen={isIntegrityModalOpen}
        onClose={() => setIsIntegrityModalOpen(false)}
      />
    </header>
  );
};

