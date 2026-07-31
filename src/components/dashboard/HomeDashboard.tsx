/**
 * Krithiq AI - Home Dashboard View
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrustMeter } from '../common/TrustMeter';
import {
  Sparkles,
  Bot,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Users,
  Tv,
  Award,
  Sun,
  Wind,
  Flame,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileText,
  Zap,
  Bell,
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const {
    user,
    reports,
    posts,
    reels,
    challenges,
    notifications,
    setNotificationsModalOpen,
    setActiveTab,
    setReportingModalOpen,
    setSearchModalOpen,
    theme,
  } = useApp();

  const isLight = theme === 'light';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* Top Banner & Primary Hero Actions */}
      <div className={`p-6 rounded-3xl border relative overflow-hidden space-y-6 transition-all duration-300 ${
        isLight
          ? 'bg-white border-slate-200/90 shadow-lg text-slate-900'
          : 'bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border-white/10 shadow-2xl text-white'
      }`}>
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
          isLight ? 'bg-teal-500/10' : 'bg-cyan-500/10'
        }`} />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 border ${
                isLight
                  ? 'bg-teal-50 text-teal-800 border-teal-200'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              }`}>
                <Sparkles className="w-3.5 h-3.5" />
                AI Civic Intelligence Active
              </span>
              <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Madhapur Ward 107</span>
            </div>

            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {getGreeting()}, <span className={isLight ? 'text-teal-800' : 'bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent'}>{user.name}</span>
            </h1>
            <p className={`text-sm mt-1 max-w-xl ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Instant civic reporting, verified government scheme access, and multimodal AI verification for your city.
            </p>
          </div>
        </div>

        {/* Prioritized Top Action Cards (Report Issue, Government Schemes, AI Fact Check) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 relative z-10">
          {/* Action 1: Report Issue */}
          <button
            onClick={() => setReportingModalOpen(true)}
            className={`p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-3 cursor-pointer group text-left relative overflow-hidden ${
              isLight
                ? 'bg-gradient-to-br from-orange-50 to-amber-50/50 border-orange-200 shadow-sm hover:border-orange-400 hover:shadow-md'
                : 'bg-gradient-to-br from-orange-950/70 via-slate-900 to-orange-900/40 border-orange-500/40 shadow-xl hover:border-orange-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl border group-hover:scale-110 transition-transform ${
                isLight
                  ? 'bg-orange-100 text-orange-800 border-orange-300'
                  : 'bg-orange-500/20 text-orange-400 border-orange-500/40'
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                isLight
                  ? 'text-orange-900 bg-orange-100 border-orange-200'
                  : 'text-orange-300 bg-orange-500/20 border-orange-500/30'
              }`}>
                Primary Action
              </span>
            </div>
            <div>
              <h3 className={`text-base font-black transition-colors flex items-center gap-1.5 ${
                isLight ? 'text-slate-900 group-hover:text-orange-900' : 'text-white group-hover:text-orange-300'
              }`}>
                Report Issue
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                AI auto-detects ward, drafts SLA complaint, and alerts municipal authorities.
              </p>
            </div>
          </button>

          {/* Action 2: Government Schemes */}
          <button
            onClick={() => setActiveTab('schemes')}
            className={`p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-3 cursor-pointer group text-left relative overflow-hidden ${
              isLight
                ? 'bg-gradient-to-br from-indigo-50 to-blue-50/50 border-indigo-200 shadow-sm hover:border-indigo-400 hover:shadow-md'
                : 'bg-gradient-to-br from-indigo-950/70 via-slate-900 to-indigo-900/40 border-indigo-500/40 shadow-xl hover:border-indigo-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl border group-hover:scale-110 transition-transform ${
                isLight
                  ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                  : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
              }`}>
                <FileText className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                isLight
                  ? 'text-indigo-900 bg-indigo-100 border-indigo-200'
                  : 'text-indigo-300 bg-indigo-500/20 border-indigo-500/30'
              }`}>
                Schemes & Benefits
              </span>
            </div>
            <div>
              <h3 className={`text-base font-black transition-colors flex items-center gap-1.5 ${
                isLight ? 'text-slate-900 group-hover:text-indigo-900' : 'text-white group-hover:text-indigo-300'
              }`}>
                Government Schemes
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Find eligible state/central welfare schemes and set automated renewal reminders.
              </p>
            </div>
          </button>

          {/* Action 3: AI Fact Check */}
          <button
            onClick={() => setActiveTab('verification')}
            className={`p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-3 cursor-pointer group text-left relative overflow-hidden ${
              isLight
                ? 'bg-gradient-to-br from-emerald-50 to-teal-50/50 border-emerald-200 shadow-sm hover:border-emerald-400 hover:shadow-md'
                : 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-emerald-900/40 border-emerald-500/40 shadow-xl hover:border-emerald-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl border group-hover:scale-110 transition-transform ${
                isLight
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                isLight
                  ? 'text-emerald-900 bg-emerald-100 border-emerald-200'
                  : 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30'
              }`}>
                Multi-Asset Verification
              </span>
            </div>
            <div>
              <h3 className={`text-base font-black transition-colors flex items-center gap-1.5 ${
                isLight ? 'text-slate-900 group-hover:text-emerald-900' : 'text-white group-hover:text-emerald-300'
              }`}>
                AI Fact Check
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Verify fake news, scam QR codes, product authenticity, and deepfakes instantly.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Civic Impact Statistics Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            <Zap className={`w-4 h-4 ${isLight ? 'text-teal-700' : 'text-cyan-400'}`} />
            Live Civic Impact & City Metrics
          </h3>
          <span className={`text-[10px] font-bold ${isLight ? 'text-teal-800' : 'text-cyan-400'}`}>Real-time Verified Ledger</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          <div className={`p-3 rounded-2xl border text-center space-y-0.5 ${
            isLight ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-white/5 border-white/10'
          }`}>
            <span className={`text-[9px] font-bold uppercase block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Issues Reported</span>
            <span className={`text-base sm:text-lg font-black ${isLight ? 'text-orange-700' : 'text-orange-400'}`}>1,240</span>
            <span className={`text-[9px] block ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>This Month</span>
          </div>

          <div className={`p-3 rounded-2xl border text-center space-y-0.5 ${
            isLight ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-white/5 border-white/10'
          }`}>
            <span className={`text-[9px] font-bold uppercase block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Issues Resolved</span>
            <span className={`text-base sm:text-lg font-black ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>1,180</span>
            <span className={`text-[9px] font-semibold block ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>95.1% SLA</span>
          </div>

          <div className={`p-3 rounded-2xl border text-center space-y-0.5 ${
            isLight ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-white/5 border-white/10'
          }`}>
            <span className={`text-[9px] font-bold uppercase block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Citizens Helped</span>
            <span className={`text-base sm:text-lg font-black ${isLight ? 'text-teal-800' : 'text-cyan-400'}`}>48,200+</span>
            <span className={`text-[9px] block ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Ward 107</span>
          </div>

          <div className={`p-3 rounded-2xl border text-center space-y-0.5 ${
            isLight ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-white/5 border-white/10'
          }`}>
            <span className={`text-[9px] font-bold uppercase block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Schemes Claimed</span>
            <span className={`text-base sm:text-lg font-black ${isLight ? 'text-indigo-800' : 'text-indigo-400'}`}>12,850</span>
            <span className={`text-[9px] block ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Direct Credit</span>
          </div>

          <div className={`p-3 rounded-2xl border text-center space-y-0.5 ${
            isLight ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-white/5 border-white/10'
          }`}>
            <span className={`text-[9px] font-bold uppercase block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Active Volunteers</span>
            <span className={`text-base sm:text-lg font-black ${isLight ? 'text-rose-800' : 'text-rose-400'}`}>14,350</span>
            <span className={`text-[9px] block ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Community</span>
          </div>

          <div className={`p-3 rounded-2xl border text-center space-y-0.5 ${
            isLight ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-white/5 border-white/10'
          }`}>
            <span className={`text-[9px] font-bold uppercase block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Community Posts</span>
            <span className={`text-base sm:text-lg font-black ${isLight ? 'text-violet-800' : 'text-violet-400'}`}>3,410</span>
            <span className={`text-[9px] block ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Active Q&A</span>
          </div>

          <div className={`p-3 rounded-2xl border text-center space-y-0.5 col-span-2 sm:col-span-1 ${
            isLight ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-white/5 border-white/10'
          }`}>
            <span className={`text-[9px] font-bold uppercase block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Fact Checks</span>
            <span className={`text-base sm:text-lg font-black ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>8,920</span>
            <span className={`text-[9px] font-semibold block ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>0 Deepfakes</span>
          </div>
        </div>
      </div>

      {/* Live Proactive AI Civic Alerts & Smart Notifications Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-cyan-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shrink-0">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                Live AI Assistant Feed
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {notifications.filter((n) => !n.read).length} Unread Updates
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-white">
              {notifications[0]?.title || 'Proactive Civic Intelligence Feed Active'}
            </h4>
            <p className="text-xs text-slate-300 line-clamp-1">
              {notifications[0]?.body || 'Real-time SLA tracking, nearby municipal water & traffic alerts, and scheme eligibility.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setNotificationsModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:scale-102 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Open Smart Center</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Trust Score Meter & Weather/AQI Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <TrustMeter score={user.trustScore} confidence={96} label="Citizen Trust Index" badgeLevel={user.reputationLevel} />
        </div>

        {/* Live Weather & AQI Widget */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
          isLight
            ? 'bg-white border-gray-200 shadow-2xs text-gray-900'
            : 'bg-white/5 border-white/10 backdrop-blur-xl text-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <span className={`text-[10px] uppercase font-bold ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Environment & Live AQI</span>
              <h3 className={`text-sm font-bold flex items-center gap-1.5 mt-0.5 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                <MapPin className={`w-3.5 h-3.5 ${isLight ? 'text-blue-800' : 'text-cyan-400'}`} />
                Hyderabad, Ward 107
              </h3>
            </div>
            <div className={`p-2 rounded-xl border ${
              isLight ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}>
              <Sun className="w-5 h-5 animate-spin-slow" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-black/40 border-white/5'}`}>
              <div className={`text-[10px] font-semibold ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Temperature</div>
              <div className={`text-xl font-black mt-0.5 ${isLight ? 'text-gray-900' : 'text-white'}`}>28°C</div>
              <div className={`text-[10px] font-bold mt-0.5 ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>Sunny & Clear</div>
            </div>

            <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-black/40 border-white/5'}`}>
              <div className={`text-[10px] font-semibold flex items-center gap-1 ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>
                <Wind className={`w-3 h-3 ${isLight ? 'text-blue-800' : 'text-cyan-400'}`} /> AQI Air Quality
              </div>
              <div className={`text-xl font-black mt-0.5 ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>42 AQI</div>
              <div className={`text-[10px] font-bold mt-0.5 ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>Good (Safe for Outdoor)</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Super Assistant Quick Callout */}
      <div className={`p-5 rounded-2xl border shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isLight
          ? 'bg-blue-900 border-blue-800 text-white shadow-md'
          : 'bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border-cyan-500/30 text-white'
      }`}>
        <div className="flex items-start gap-3.5">
          <div className={`p-3 rounded-2xl border shrink-0 ${
            isLight ? 'bg-white/10 border-white/20 text-white' : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
          }`}>
            <Bot className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Krithiq AI Super Assistant Ready
              <span className={`px-2 py-0.5 text-[10px] rounded-full font-extrabold ${
                isLight ? 'bg-white/20 text-blue-100' : 'bg-cyan-500/20 text-cyan-300'
              }`}>
                Multimodal Text, Voice & Vision
              </span>
            </h3>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-blue-100' : 'text-slate-300'}`}>
              Need help drafting a legal complaint, verifying government scheme benefits, or checking counterfeit medicines?
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('assistant')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
            isLight
              ? 'bg-white text-blue-950 hover:bg-gray-100 shadow-sm font-black'
              : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/25'
          }`}
        >
          Ask AI Assistant <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* AI REMINDERS & DEADLINE CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
            <Clock className={`w-4 h-4 ${isLight ? 'text-blue-800' : 'text-cyan-400'} animate-pulse`} />
            AI Smart Reminders & Upcoming Deadlines
          </h3>
          <button onClick={() => setActiveTab('schemes')} className={`text-xs font-bold hover:underline ${isLight ? 'text-blue-800' : 'text-cyan-400'}`}>
            Manage Renewals →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className={`p-4 rounded-2xl border transition-all relative overflow-hidden group ${
            isLight
              ? 'bg-white border-gray-200 shadow-2xs hover:border-blue-300'
              : 'bg-gradient-to-br from-indigo-950/40 to-slate-900 border-indigo-500/30 hover:border-indigo-400'
          }`}>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className={`px-2 py-0.5 rounded-full font-extrabold border ${
                isLight ? 'bg-blue-50 text-blue-900 border-blue-200' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}>
                Scheme Renewal
              </span>
              <span className={`text-[10px] font-bold ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>In 3 Days</span>
            </div>
            <h4 className={`text-xs font-black ${isLight ? 'text-gray-900' : 'text-white'}`}>Rythu Bharosa Kharif 2026 Application</h4>
            <p className={`text-[11px] mt-1 ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>Submit updated land passbook copy to receive ₹15,000 credit.</p>
            <div className="mt-3 flex items-center justify-between">
              <span className={`text-[10px] ${isLight ? 'text-gray-500' : 'text-slate-500'}`}>Auto-Synced with Meeseva</span>
              <button onClick={() => setActiveTab('schemes')} className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                isLight ? 'bg-blue-800 text-white hover:bg-blue-900' : 'bg-indigo-500 text-white hover:bg-indigo-400'
              }`}>
                Renew Now
              </button>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all relative overflow-hidden group ${
            isLight
              ? 'bg-white border-gray-200 shadow-2xs hover:border-amber-300'
              : 'bg-gradient-to-br from-amber-950/40 to-slate-900 border-amber-500/30 hover:border-amber-400'
          }`}>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className={`px-2 py-0.5 rounded-full font-extrabold border ${
                isLight ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                Property Tax Discount
              </span>
              <span className={`text-[10px] font-bold ${isLight ? 'text-rose-700' : 'text-rose-400'}`}>5 Days Left</span>
            </div>
            <h4 className={`text-xs font-black ${isLight ? 'text-gray-900' : 'text-white'}`}>GHMC Early Bird 5% Tax Rebate</h4>
            <p className={`text-[11px] mt-1 ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>Pay annual property tax before March 31 to claim 5% cashback.</p>
            <div className="mt-3 flex items-center justify-between">
              <span className={`text-[10px] ${isLight ? 'text-gray-500' : 'text-slate-500'}`}>Assessment #107294</span>
              <button onClick={() => alert('Redirecting to GHMC Tax Portal...')} className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                isLight ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
              }`}>
                Pay Direct
              </button>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all relative overflow-hidden group ${
            isLight
              ? 'bg-white border-gray-200 shadow-2xs hover:border-emerald-300'
              : 'bg-gradient-to-br from-emerald-950/40 to-slate-900 border-emerald-500/30 hover:border-emerald-400'
          }`}>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className={`px-2 py-0.5 rounded-full font-extrabold border ${
                isLight ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                Health Insurance
              </span>
              <span className={`text-[10px] font-bold ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>Verified Active</span>
            </div>
            <h4 className={`text-xs font-black ${isLight ? 'text-gray-900' : 'text-white'}`}>Aarogyasri Health Card KYC Renewal</h4>
            <p className={`text-[11px] mt-1 ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>Biometric verification pending for dependent family members.</p>
            <div className="mt-3 flex items-center justify-between">
              <span className={`text-[10px] ${isLight ? 'text-gray-500' : 'text-slate-500'}`}>Coverage: ₹5,00,000</span>
              <button onClick={() => setActiveTab('schemes')} className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                isLight ? 'bg-emerald-700 text-white hover:bg-emerald-800' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              }`}>
                Verify KYC
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NEARBY LOCAL JOBS SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
            <TrendingUp className={`w-4 h-4 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
            Nearby Local Jobs & Municipal Hiring
          </h3>
          <span className={`text-xs font-bold ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>
            Within 5 km radius
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            {
              id: 'j1',
              title: 'Municipal Field Supervisor',
              employer: 'GHMC Ward 107 Sanitation Wing',
              type: 'Government Contract',
              salary: '₹22,000 / month',
              distance: '1.2 km away',
              tags: ['Full Time', 'Urgent Hiring', 'Health Benefits'],
            },
            {
              id: 'j2',
              title: 'Solar Panel Maintenance Technician',
              employer: 'Telangana Renewable Energy Development',
              type: 'Public-Private Partnership',
              salary: '₹28,000 / month',
              distance: '2.8 km away',
              tags: ['Technical', 'Training Provided'],
            },
            {
              id: 'j3',
              title: 'Digital Literacy Community Trainer',
              employer: 'Krithiq Civic Foundation & NGO Alliance',
              type: 'Part-Time / Volunteer Stipend',
              salary: '₹12,000 stipend',
              distance: '800 m away',
              tags: ['Flexible Hours', 'Certification'],
            },
          ].map((job) => (
            <div key={job.id} className={`p-4 rounded-2xl border transition-all space-y-3 ${
              isLight
                ? 'bg-white border-gray-200 shadow-2xs hover:border-emerald-400'
                : 'bg-white/5 border-white/10 hover:border-emerald-500/40'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                  isLight
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                }`}>
                  {job.type}
                </span>
                <span className={`text-[10px] font-bold ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>{job.distance}</span>
              </div>
              <div>
                <h4 className={`text-xs font-black ${isLight ? 'text-gray-900' : 'text-white'}`}>{job.title}</h4>
                <p className={`text-[11px] ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>{job.employer}</p>
              </div>
              <div className={`flex items-center justify-between pt-2 border-t text-xs ${isLight ? 'border-gray-100' : 'border-white/10'}`}>
                <span className={`font-black ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>{job.salary}</span>
                <button
                  onClick={() => alert(`Applied for ${job.title}! Recruiter will contact you via Krithiq AI Verified Messages.`)}
                  className={`px-3 py-1 rounded-xl font-black text-[11px] transition-transform cursor-pointer ${
                    isLight ? 'bg-blue-800 text-white hover:bg-blue-900' : 'bg-emerald-500 text-slate-950 hover:scale-105'
                  }`}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Alerts Ticker */}
      <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
        isLight
          ? 'bg-rose-50 border-rose-200 text-rose-950 shadow-2xs'
          : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
      }`}>
        <div className="flex items-center gap-2.5">
          <Flame className={`w-4 h-4 animate-pulse ${isLight ? 'text-rose-700' : 'text-rose-400'}`} />
          <span className="font-extrabold">CRITICAL SAFETY ALERT:</span>
          <span className={isLight ? 'text-gray-800 font-medium' : 'text-slate-200'}>Counterfeit rabies batch alert issued by State Health Dept. Scan medicine QR codes!</span>
        </div>
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-3 py-1 rounded-lg text-[11px] font-extrabold transition-all whitespace-nowrap cursor-pointer border ${
            isLight
              ? 'bg-rose-600 text-white border-rose-700 hover:bg-rose-700'
              : 'bg-rose-500/20 border-rose-500/40 text-rose-200 hover:bg-rose-500/30'
          }`}
        >
          Scan Batch QR
        </button>
      </div>

      {/* Quick Action Grid */}
      <div className="space-y-3">
        <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-gray-900' : 'text-slate-200'}`}>
          <Zap className={`w-4 h-4 ${isLight ? 'text-blue-800' : 'text-cyan-400'}`} />
          Super App Quick Launchpad
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'verification', label: 'AI Verification', icon: ShieldCheck, colorLight: 'bg-white border-gray-200 text-emerald-800 hover:border-emerald-400', colorDark: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
            { id: 'civic', label: 'Civic Report', icon: AlertTriangle, colorLight: 'bg-white border-gray-200 text-orange-800 hover:border-orange-400', colorDark: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
            { id: 'map', label: 'Civic Map', icon: MapPin, colorLight: 'bg-white border-gray-200 text-teal-800 hover:border-teal-400', colorDark: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
            { id: 'assistant', label: 'AI Assistant', icon: Bot, colorLight: 'bg-white border-gray-200 text-blue-900 hover:border-blue-400', colorDark: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
            { id: 'community', label: 'Community', icon: Users, colorLight: 'bg-white border-gray-200 text-violet-800 hover:border-violet-400', colorDark: 'text-violet-400 bg-violet-500/10 border-violet-500/30' },
            { id: 'community', label: 'SYNKS & Feed', icon: Tv, colorLight: 'bg-white border-gray-200 text-pink-800 hover:border-pink-400', colorDark: 'text-pink-400 bg-pink-500/10 border-pink-500/30' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.id as any)}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer shadow-2xs hover:-translate-y-0.5 ${
                  isLight ? item.colorLight : item.colorDark
                }`}
              >
                <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className={`text-xs font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nearby Active Complaints Ticker & Trending Community Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Active Complaints */}
        <div className={`p-5 rounded-3xl border space-y-4 ${
          isLight
            ? 'bg-white border-gray-200 shadow-2xs text-gray-900'
            : 'bg-white/5 border-white/10 backdrop-blur-xl text-white'
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-gray-100' : 'border-white/10'}`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
              <AlertTriangle className={`w-4 h-4 ${isLight ? 'text-orange-700' : 'text-orange-400'}`} />
              Nearby Civic Complaints
            </h3>
            <button
              onClick={() => setActiveTab('civic')}
              className={`text-xs font-bold hover:underline flex items-center gap-1 ${isLight ? 'text-blue-800' : 'text-cyan-400'}`}
            >
              View All ({reports.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {reports.slice(0, 3).map((r) => (
              <div
                key={r.id}
                onClick={() => setActiveTab('civic')}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isLight
                    ? 'bg-gray-50 border-gray-200 hover:border-blue-300'
                    : 'bg-black/40 border-white/5 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black text-xs ${
                    isLight
                      ? 'bg-orange-100 text-orange-900 border-orange-200'
                      : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                  }`}>
                    {r.severity}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold line-clamp-1 ${isLight ? 'text-gray-900' : 'text-white'}`}>{r.title}</h4>
                    <p className={`text-[11px] flex items-center gap-1 mt-0.5 ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>
                      <MapPin className={`w-3 h-3 ${isLight ? 'text-gray-500' : 'text-slate-500'}`} />
                      {r.locationName}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                    isLight
                      ? 'bg-blue-50 text-blue-900 border-blue-200'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                  }`}>
                    {r.status}
                  </span>
                  <div className={`text-[10px] mt-1 flex items-center gap-1 justify-end ${isLight ? 'text-gray-500 font-medium' : 'text-slate-400'}`}>
                    <Clock className="w-3 h-3" />
                    SLA {r.slaHoursRemaining}h left
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Highlights */}
        <div className={`p-5 rounded-3xl border space-y-4 ${
          isLight
            ? 'bg-white border-gray-200 shadow-2xs text-gray-900'
            : 'bg-white/5 border-white/10 backdrop-blur-xl text-white'
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-gray-100' : 'border-white/10'}`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
              <TrendingUp className={`w-4 h-4 ${isLight ? 'text-violet-800' : 'text-violet-400'}`} />
              Trending Discussions & Solutions
            </h3>
            <button
              onClick={() => setActiveTab('community')}
              className={`text-xs font-bold hover:underline flex items-center gap-1 ${isLight ? 'text-violet-800' : 'text-violet-400'}`}
            >
              Open Feed <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {posts.slice(0, 2).map((p) => (
              <div
                key={p.id}
                onClick={() => setActiveTab('community')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isLight
                    ? 'bg-gray-50 border-gray-200 hover:border-violet-300'
                    : 'bg-black/40 border-white/5 hover:border-violet-500/30'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold flex items-center gap-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                    <img src={p.authorAvatar} className="w-5 h-5 rounded-full object-cover" />
                    {p.authorName}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    isLight
                      ? 'bg-violet-50 text-violet-900 border-violet-200 font-bold'
                      : 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                  }`}>
                    {p.groupName}
                  </span>
                </div>
                <h4 className={`text-xs font-black line-clamp-1 ${isLight ? 'text-gray-900' : 'text-slate-200'}`}>{p.title}</h4>
                <p className={`text-[11px] line-clamp-2 ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>{p.content}</p>
                {p.aiSummary && (
                  <div className={`p-2 rounded-xl border text-[10px] ${
                    isLight
                      ? 'bg-violet-50/80 border-violet-200 text-violet-950 font-medium'
                      : 'bg-violet-500/10 border-violet-500/20 text-violet-200'
                  }`}>
                    {p.aiSummary}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Gamification & Daily Missions Progress */}
      <div className={`p-5 rounded-3xl border shadow-xl space-y-4 ${
        isLight
          ? 'bg-white border-gray-200 text-gray-900 shadow-2xs'
          : 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border-amber-500/30 text-white'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-gray-100' : 'border-white/10'}`}>
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
              <Award className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-amber-400'}`} />
              Daily Civic Missions & Streaks
            </h3>
            <p className={`text-xs ${isLight ? 'text-gray-600' : 'text-slate-300'}`}>Complete missions to earn XP and redeem free public transit passes!</p>
          </div>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs cursor-pointer ${
              isLight
                ? 'bg-blue-800 text-white hover:bg-blue-900 shadow-2xs'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
            }`}
          >
            Redeem Rewards
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {challenges.map((c) => (
            <div key={c.id} className={`p-3 rounded-2xl border space-y-2 ${
              isLight
                ? 'bg-gray-50 border-gray-200'
                : 'bg-black/40 border-white/5'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-black ${isLight ? 'text-gray-900' : 'text-white'}`}>{c.title}</span>
                <span className={`text-[10px] font-black ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>+{c.xpReward} XP</span>
              </div>
              <p className={`text-[11px] ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>{c.description}</p>
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-gray-200' : 'bg-white/10'}`}>
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isLight ? 'bg-amber-600' : 'bg-amber-400'}`}
                  style={{ width: `${(c.progress / c.totalRequired) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
