/**
 * Krithiq AI - Animated Splash & Get Started Screen
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Sparkles, ArrowRight, LogIn, Users, ShieldAlert, Award, Sun, Moon } from 'lucide-react';

interface SplashScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted, onLogin }) => {
  const { theme, setTheme } = useApp();
  const isLight = theme === 'light';

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 overflow-y-auto transition-colors duration-300 ${
      isLight
        ? 'bg-slate-50 text-slate-900 selection:bg-teal-700 selection:text-white'
        : 'bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950'
    }`}>
      
      {/* Dynamic Background Glows */}
      {isLight ? (
        <>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-200/40 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        </>
      )}

      {/* Top Header Bar with Brand Pill & Theme Toggle Bar */}
      <div className="w-full max-w-4xl pt-4 flex items-center justify-between gap-4 relative z-20 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase backdrop-blur-md border shadow-sm ${
          isLight
            ? 'bg-teal-50 border-teal-300 text-teal-950'
            : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-cyan-500/10'
        }`}>
          <Sparkles className={`w-3.5 h-3.5 animate-spin ${isLight ? 'text-teal-800' : 'text-cyan-400'}`} />
          <span>Krithiq AI • Your AI Civic Assistant</span>
        </div>

        {/* Theme Toggle Bar */}
        <div className={`flex items-center gap-1.5 p-1 rounded-2xl border shadow-xs ${
          isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-white/20'
        }`}>
          <button
            onClick={() => setTheme('light')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              isLight
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light</span>
          </button>
          <button
            onClick={() => setTheme('black')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              !isLight
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark</span>
          </button>
        </div>
      </div>

      {/* Center Hero Card */}
      <div className="my-auto max-w-xl w-full text-center relative z-10 space-y-8 py-6">
        
        {/* Animated Holographic Badge */}
        <div className="relative inline-block group">
          <div className={`absolute -inset-2 rounded-3xl blur-xl transition duration-700 animate-pulse ${
            isLight ? 'bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-400 opacity-40' : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-400 opacity-60'
          }`} />
          <div className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border flex items-center justify-center shadow-2xl mx-auto transform hover:rotate-3 transition-transform duration-300 ${
            isLight
              ? 'bg-white border-teal-300 text-teal-800'
              : 'bg-slate-950 border-cyan-500/50 text-cyan-400'
          }`}>
            <ShieldCheck className="w-16 h-16 sm:w-18 sm:h-18 animate-pulse" />
          </div>
        </div>

        {/* Headline & Tagline */}
        <div className="space-y-3">
          <h1 className={`text-3xl sm:text-5xl font-black tracking-tight leading-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Krithiq <span className={isLight ? 'text-teal-800' : 'text-cyan-400'}>AI</span>
            <br />
            <span className={`text-xl sm:text-2xl font-black block mt-1 ${
              isLight
                ? 'bg-gradient-to-r from-teal-900 via-indigo-900 to-slate-900 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent'
            }`}>
              Your AI Civic Assistant.
            </span>
          </h1>
          <p className={`text-sm sm:text-base max-w-md mx-auto leading-relaxed font-semibold ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}>
            AI-powered verification, instant civic complaint resolution, local jobs, government schemes, and community empowerment for all.
          </p>
        </div>

        {/* Feature Highlights Pills */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 text-left">
          <div className={`p-3 rounded-2xl border backdrop-blur-md space-y-1 ${
            isLight ? 'bg-white border-slate-200/90 shadow-2xs' : 'bg-white/5 border-white/10'
          }`}>
            <Users className={`w-4 h-4 ${isLight ? 'text-teal-800' : 'text-cyan-400'}`} />
            <div className={`text-xs font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Citizen Power</div>
            <div className={`text-[10px] leading-tight font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Report & verify in 1-tap</div>
          </div>
          <div className={`p-3 rounded-2xl border backdrop-blur-md space-y-1 ${
            isLight ? 'bg-white border-slate-200/90 shadow-2xs' : 'bg-white/5 border-white/10'
          }`}>
            <ShieldAlert className={`w-4 h-4 ${isLight ? 'text-teal-800' : 'text-emerald-400'}`} />
            <div className={`text-xs font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Govt Action</div>
            <div className={`text-[10px] leading-tight font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>SLA tracked workflow</div>
          </div>
          <div className={`p-3 rounded-2xl border backdrop-blur-md space-y-1 ${
            isLight ? 'bg-white border-slate-200/90 shadow-2xs' : 'bg-white/5 border-white/10'
          }`}>
            <Award className={`w-4 h-4 ${isLight ? 'text-amber-800' : 'text-amber-400'}`} />
            <div className={`text-xs font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>NGO Volunteers</div>
            <div className={`text-[10px] leading-tight font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Community drives & XP</div>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGetStarted}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group ${
              isLight
                ? 'bg-teal-700 text-white hover:bg-teal-800 shadow-teal-800/20'
                : 'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 shadow-cyan-500/25'
            }`}
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onLogin}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-sm backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isLight
                ? 'bg-white border border-slate-300 text-slate-900 hover:bg-slate-100 shadow-2xs'
                : 'bg-white/10 hover:bg-white/15 border border-white/15 text-white hover:border-cyan-500/40'
            }`}
          >
            <LogIn className={`w-4 h-4 ${isLight ? 'text-teal-800' : 'text-cyan-400'}`} />
            <span>Login / Sign Up</span>
          </button>
        </div>

      </div>

      {/* Footer Info */}
      <div className={`pb-4 text-center text-[11px] font-bold relative z-10 flex items-center gap-3 ${
        isLight ? 'text-slate-600' : 'text-slate-300'
      }`}>
        <span>🔒 Production Security</span>
        <span>•</span>
        <span>⚡ Real-Time SLA Tracking</span>
        <span>•</span>
        <span>🌐 Multi-Language Support</span>
      </div>

    </div>
  );
};

