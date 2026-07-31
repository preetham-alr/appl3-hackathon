/**
 * Krithiq AI - Government Schemes Dashboard & Smart Renewal Reminders
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { GovtScheme, SchemeCategory, SchemeRenewalReminder } from '../../types';
import { INITIAL_SCHEMES, INITIAL_RENEWAL_REMINDERS } from '../../data/mockSchemes';
import {
  Landmark,
  Sparkles,
  Search,
  Filter,
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Clock,
  Calendar,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Bell,
  Send,
  Share2,
  ChevronRight,
  ShieldAlert,
  Zap,
  Building,
  User as UserIcon,
  Briefcase,
  DollarSign,
  GraduationCap,
  Sprout,
  Heart,
  HelpCircle,
  X,
  Check,
  RefreshCw,
  ShieldCheck,
  Shield,
  Lock,
  Globe,
  FileCheck,
  Award,
  Info,
} from 'lucide-react';

export const SchemesDashboard: React.FC = () => {
  const { user, updateUser, addXp, theme } = useApp();
  const isLight = theme === 'light';

  const [schemes, setSchemes] = useState<GovtScheme[]>(INITIAL_SCHEMES);
  const [reminders, setReminders] = useState<SchemeRenewalReminder[]>(INITIAL_RENEWAL_REMINDERS);
  
  const [activeCategory, setActiveCategory] = useState<SchemeCategory>('Recommended');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Trust Index filters & modal states
  const [trustAuditScheme, setTrustAuditScheme] = useState<GovtScheme | null>(null);
  const [isTrustInfoModalOpen, setIsTrustInfoModalOpen] = useState(false);
  const [onlyDirectGovt, setOnlyDirectGovt] = useState(false);
  const [sortBy, setSortBy] = useState<'match' | 'trust'>('match');
  
  // Modal states
  const [selectedScheme, setSelectedScheme] = useState<GovtScheme | null>(null);
  const [applyModalScheme, setApplyModalScheme] = useState<GovtScheme | null>(null);
  const [renewalModalItem, setRenewalModalItem] = useState<SchemeRenewalReminder | null>(null);
  const [isProfileTunerOpen, setIsProfileTunerOpen] = useState(false);

  // Application submission state
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [appSubmittedSuccess, setAppSubmittedSuccess] = useState(false);
  const [uploadedDocNames, setUploadedDocNames] = useState<string[]>([]);

  // Local state for profile tuner
  const [profileForm, setProfileForm] = useState({
    age: user?.age || 28,
    occupation: user?.occupation || 'Farmer',
    incomeLevel: user?.incomeLevel || '300000',
    gender: user?.gender || 'all',
    isStudent: user?.isStudent || false,
    isFarmer: user?.isFarmer || true,
    isDisabilityStatus: user?.isDisabilityStatus || false,
    state: user?.state || 'Telangana',
    district: user?.district || 'Hyderabad',
    city: user?.city || 'Hyderabad',
  });

  // Calculate Match Score for each scheme based on profile criteria
  const evaluatedSchemes = useMemo(() => {
    return schemes.map((scheme) => {
      let score = 70; // baseline

      if (scheme.requiresFarmer && profileForm.isFarmer) score += 20;
      if (scheme.requiresStudent && profileForm.isStudent) score += 20;
      if (scheme.requiresDisability && profileForm.isDisabilityStatus) score += 25;

      if (scheme.targetGender && scheme.targetGender !== 'all') {
        if (scheme.targetGender === profileForm.gender) score += 15;
        else score -= 30;
      }

      if (scheme.targetMinAge && profileForm.age < scheme.targetMinAge) score -= 25;
      if (scheme.targetMaxAge && profileForm.age > scheme.targetMaxAge) score -= 25;

      if (scheme.targetMaxIncome) {
        const incomeNum = parseInt(profileForm.incomeLevel) || 300000;
        if (incomeNum <= scheme.targetMaxIncome) score += 15;
        else score -= 20;
      }

      if (scheme.govtType === 'State' && scheme.stateName && scheme.stateName === profileForm.state) {
        score += 15;
      }

      const finalMatch = Math.min(100, Math.max(10, score));
      return { ...scheme, matchScore: finalMatch };
    });
  }, [schemes, profileForm]);

  // Filter & sort schemes based on active category, search, trust filter & sorting
  const filteredSchemes = useMemo(() => {
    let result = evaluatedSchemes.filter((scheme) => {
      // Category filtering
      if (activeCategory === 'Recommended' && (scheme.matchScore || 0) < 65) return false;
      if (activeCategory === 'Central Government' && scheme.govtType !== 'Central') return false;
      if (activeCategory === 'State Government' && scheme.govtType !== 'State') return false;
      if (activeCategory === 'Saved' && !scheme.isSaved) return false;
      if (activeCategory === 'Active Applications' && !scheme.isApplied) return false;
      if (activeCategory === 'Scholarship' && scheme.category !== 'Scholarship') return false;
      if (activeCategory === 'Pension' && scheme.category !== 'Pension') return false;
      if (activeCategory === 'Farmer' && scheme.category !== 'Farmer') return false;
      if (activeCategory === 'Women Welfare' && scheme.category !== 'Women Welfare') return false;
      if (activeCategory === 'Startup & MSME' && scheme.category !== 'Startup & MSME') return false;

      // Direct govt website filter
      if (onlyDirectGovt && !scheme.isDirectGovtWebsite) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = scheme.name.toLowerCase().includes(q);
        const matchesDesc = scheme.description.toLowerCase().includes(q);
        const matchesCategory = scheme.category.toLowerCase().includes(q);
        const matchesGovt = scheme.govtType.toLowerCase().includes(q);
        const matchesDomain = scheme.trustSourceDomain?.toLowerCase().includes(q);
        return matchesName || matchesDesc || matchesCategory || matchesGovt || matchesDomain;
      }

      return true;
    });

    // Sort
    if (sortBy === 'trust') {
      result.sort((a, b) => b.trustIndex - a.trustIndex);
    } else {
      result.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    return result;
  }, [evaluatedSchemes, activeCategory, searchQuery, onlyDirectGovt, sortBy]);

  // Toggle Bookmark
  const handleToggleSave = (schemeId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSchemes((prev) =>
      prev.map((s) => (s.id === schemeId ? { ...s, isSaved: !s.isSaved } : s))
    );
  };

  // Share Scheme
  const handleShare = (scheme: GovtScheme, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const shareText = `Check out "${scheme.name}" on CivicAI Super App: ${scheme.officialWebsite}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      alert('Scheme details copied to clipboard!');
    } else {
      alert(shareText);
    }
  };

  // Submit Scheme Application
  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModalScheme) return;

    setIsSubmittingApp(true);
    setTimeout(() => {
      setIsSubmittingApp(false);
      setAppSubmittedSuccess(true);
      
      // Update state
      const appId = 'APP-' + Math.floor(100000 + Math.random() * 900000);
      setSchemes((prev) =>
        prev.map((s) =>
          s.id === applyModalScheme.id
            ? { ...s, isApplied: true, applicationStatus: 'Under Review', applicationId: appId }
            : s
        )
      );

      // Reward XP
      addXp(150);
    }, 1200);
  };

  // Toggle Renewal Reminder Notification Channels
  const handleToggleChannel = (reminderId: string, channelKey: 'push' | 'inApp' | 'email' | 'sms') => {
    setReminders((prev) =>
      prev.map((rem) => {
        if (rem.id === reminderId) {
          return {
            ...rem,
            channels: {
              ...rem.channels,
              [channelKey]: !rem.channels[channelKey],
            },
          };
        }
        return rem;
      })
    );
  };

  const categoriesList: SchemeCategory[] = [
    'Recommended',
    'Central Government',
    'State Government',
    'Recently Added',
    'Expiring Soon',
    'Active Applications',
    'Saved',
    'Scholarship',
    'Pension',
    'Farmer',
    'Women Welfare',
    'Startup & MSME',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden shadow-xl ${
        isLight
          ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border-indigo-200 text-gray-900 shadow-2xs'
          : 'bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 text-white shadow-2xl'
      }`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2 max-w-2xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
              isLight ? 'bg-indigo-100 border-indigo-300 text-indigo-900' : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
            }`}>
              <Landmark className="w-3.5 h-3.5 text-indigo-600" />
              <span>CivicAI Govt Schemes & Subsidies Engine</span>
            </div>
            <h1 className={`text-2xl sm:text-4xl font-black tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
              Government Schemes & Citizen Welfare Hub
            </h1>
            <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>
              AI-powered smart profile matching connects you to Central & State schemes, pensions, scholarships, and grants tailored to your age, income, and occupation.
            </p>
          </div>

          {/* Quick Profile Tuner Trigger Card */}
          <div className={`p-4 rounded-2xl border shrink-0 flex flex-col justify-between space-y-3 ${
            isLight ? 'bg-white border-indigo-200 shadow-2xs' : 'bg-black/60 border-indigo-500/30'
          }`}>
            <div className="flex items-center justify-between gap-4">
              <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-gray-800' : 'text-slate-300'}`}>
                <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                Active Profile Match Matrix
              </span>
              <button
                onClick={() => setIsProfileTunerOpen(true)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1 cursor-pointer transition-all ${
                  isLight
                    ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-300 text-indigo-900'
                    : 'bg-indigo-500/20 hover:bg-indigo-500/30 border-indigo-500/40 text-indigo-300'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Edit Criteria</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-medium pt-1">
              <div className={`p-2 rounded-xl border ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/5'}`}>
                <span className={`block text-[9px] uppercase font-bold ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Occupation / Role</span>
                <span className={`font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{profileForm.occupation}</span>
              </div>
              <div className={`p-2 rounded-xl border ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/5'}`}>
                <span className={`block text-[9px] uppercase font-bold ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Annual Income</span>
                <span className={`font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>₹{parseInt(profileForm.incomeLevel).toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Smart Renewal Reminders Alert Panel */}
      {reminders.length > 0 && (
        <div className={`p-5 rounded-3xl border space-y-4 ${
          isLight ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-2xs' : 'bg-amber-500/10 border-amber-500/30 text-white backdrop-blur-xl'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl border ${
                isLight ? 'bg-amber-200 border-amber-400 text-amber-900' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}>
                <Bell className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <h3 className={`text-sm font-black ${isLight ? 'text-amber-950' : 'text-amber-200'}`}>Smart Renewal Reminders ({reminders.length} Due)</h3>
                <p className={`text-[11px] font-medium ${isLight ? 'text-amber-800' : 'text-amber-300/80'}`}>Automatic alerts scheduled at 30, 15, 7, and 1 day before scheme expiration.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className={`p-4 rounded-2xl border space-y-3 flex flex-col justify-between ${
                  isLight ? 'bg-white border-amber-300 shadow-2xs' : 'bg-black/60 border-amber-500/30'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                      isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {rem.daysRemaining} Days Left
                    </span>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Due: {rem.expiryDate}</span>
                  </div>
                  <h4 className={`text-xs font-bold leading-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>{rem.schemeName}</h4>
                </div>

                {/* Alert Channel Toggles */}
                <div className={`space-y-1.5 pt-1 border-t ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
                  <span className={`text-[9px] font-bold block ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Alert Channels:</span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    {(['push', 'inApp', 'email', 'sms'] as const).map((ch) => {
                      const isActive = rem.channels[ch];
                      return (
                        <button
                          key={ch}
                          onClick={() => handleToggleChannel(rem.id, ch)}
                          className={`px-2 py-0.5 rounded-md font-bold uppercase transition-all cursor-pointer ${
                            isActive
                              ? isLight ? 'bg-amber-500 text-white shadow-2xs' : 'bg-amber-400 text-slate-950 shadow-sm'
                              : isLight ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {ch}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => setRenewalModalItem(rem)}
                  className={`w-full py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isLight ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-2xs' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Renew Scheme Now</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls Bar: Search, Categories & Trust Index Filters */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-gray-400' : 'text-slate-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schemes, official portals (.gov.in), pensions, scholarships..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs focus:outline-none transition-all ${
                isLight
                  ? 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-600 shadow-2xs'
                  : 'bg-slate-900/90 border-white/10 text-white placeholder-slate-400 focus:border-indigo-500'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${isLight ? 'text-gray-400 hover:text-gray-700' : 'text-slate-400 hover:text-white'}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Direct Govt Toggle */}
            <button
              onClick={() => setOnlyDirectGovt(!onlyDirectGovt)}
              className={`px-3.5 py-2.5 rounded-2xl border text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                onlyDirectGovt
                  ? isLight ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs' : 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-lg shadow-emerald-500/20'
                  : isLight ? 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Direct Govt Portals Only</span>
            </button>

            {/* Sort Toggle */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`px-3 py-2.5 rounded-2xl border text-xs font-bold focus:outline-none cursor-pointer transition-all ${
                isLight
                  ? 'bg-white border-gray-200 text-gray-800 hover:border-gray-300 shadow-2xs'
                  : 'bg-slate-900 border-white/10 text-slate-200 hover:border-white/20'
              }`}
            >
              <option value="match">Sort: Match Score</option>
              <option value="trust">Sort: Highest Trust Index</option>
            </select>

            {/* Profile Tuner Trigger */}
            <button
              onClick={() => setIsProfileTunerOpen(true)}
              className={`px-3.5 py-2.5 rounded-2xl border text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                isLight
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-900 hover:bg-indigo-100 shadow-2xs'
                  : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Profile Tuner</span>
            </button>
          </div>

        </div>

        {/* Scrollable Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categoriesList.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? isLight ? 'bg-indigo-700 text-white border-indigo-700 shadow-2xs font-black scale-102' : 'bg-indigo-500 text-slate-950 border-indigo-400 shadow-lg shadow-indigo-500/25 font-black scale-102'
                    : isLight ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length === 0 ? (
        <div className={`p-12 text-center rounded-3xl border space-y-3 ${
          isLight ? 'bg-white border-gray-200 text-gray-900 shadow-2xs' : 'bg-slate-900/50 border-white/10 text-white'
        }`}>
          <Landmark className="w-12 h-12 text-indigo-400 mx-auto" />
          <h3 className={`text-base font-extrabold ${isLight ? 'text-gray-900' : 'text-white'}`}>No Schemes Match Filters</h3>
          <p className={`text-xs max-w-md mx-auto ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>
            Try disabling "Direct Govt Portals Only", clearing your search query, or adjusting your profile criteria matrix.
          </p>
          <button
            onClick={() => {
              setActiveCategory('Recommended');
              setSearchQuery('');
              setOnlyDirectGovt(false);
              setSortBy('match');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer inline-flex items-center gap-1.5 ${
              isLight ? 'bg-indigo-700 text-white hover:bg-indigo-800' : 'bg-indigo-500 text-slate-950'
            }`}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              onClick={() => setSelectedScheme(scheme)}
              className={`group p-5 rounded-3xl border transition-all duration-300 hover:-translate-y-1 shadow-md flex flex-col justify-between space-y-4 cursor-pointer relative overflow-hidden ${
                isLight
                  ? 'bg-white border-gray-200 hover:border-indigo-400 text-gray-900 shadow-2xs'
                  : 'bg-slate-900/80 border-white/10 hover:border-indigo-500/50 text-white shadow-xl'
              }`}
            >
              <div className="space-y-3">
                
                {/* Header Badge Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                      scheme.govtType === 'Central'
                        ? isLight ? 'bg-indigo-100 text-indigo-900 border-indigo-200' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        : isLight ? 'bg-emerald-100 text-emerald-900 border-emerald-200' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {scheme.govtType} {scheme.stateName || 'Govt'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                      isLight ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-white/5 text-slate-300 border-white/10'
                    }`}>
                      {scheme.category}
                    </span>
                  </div>

                  {/* Eligibility Match Pill */}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shadow-2xs flex items-center gap-1 ${
                    isLight ? 'bg-emerald-600 text-white' : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950'
                  }`}>
                    <Sparkles className="w-3 h-3" />
                    {scheme.matchScore}% Match
                  </span>
                </div>

                {/* TRUST INDEX BADGE & DIRECT GOVT SOURCE INDICATOR */}
                <div className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2 transition-all ${
                  isLight
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                }`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 rounded-xl bg-emerald-600 text-white shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black tracking-tight text-emerald-700 dark:text-emerald-300">
                          {scheme.trustIndex}% Trust Index
                        </span>
                        {scheme.isDirectGovtWebsite && (
                          <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider ${
                            isLight ? 'bg-emerald-200 text-emerald-900' : 'bg-emerald-500/30 text-emerald-300'
                          }`}>
                            Direct Portal
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-bold truncate opacity-90">
                        {scheme.trustSourceDomain || scheme.officialWebsite.replace('https://', '')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTrustAuditScheme(scheme);
                    }}
                    className={`px-2 py-1 rounded-xl border text-[10px] font-black cursor-pointer shrink-0 transition-all ${
                      isLight
                        ? 'bg-white hover:bg-emerald-100 border-emerald-300 text-emerald-900 shadow-2xs'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/40 text-emerald-300'
                    }`}
                    title="View Trust Audit Breakdown"
                  >
                    Audit
                  </button>
                </div>

                {/* Scheme Title & Description */}
                <div>
                  <h3 className={`text-base font-extrabold transition-colors leading-snug ${
                    isLight ? 'text-gray-900 group-hover:text-indigo-800' : 'text-white group-hover:text-indigo-300'
                  }`}>
                    {scheme.name}
                  </h3>
                  <p className={`text-xs font-medium line-clamp-2 mt-1 ${
                    isLight ? 'text-gray-600' : 'text-slate-300/80'
                  }`}>
                    {scheme.description}
                  </p>
                </div>

                {/* Key Benefits Snippet */}
                <div className={`p-3 rounded-2xl border space-y-1 ${
                  isLight ? 'bg-indigo-50/50 border-indigo-100' : 'bg-white/5 border-white/5'
                }`}>
                  <span className={`text-[10px] font-bold flex items-center gap-1 ${
                    isLight ? 'text-indigo-900' : 'text-indigo-300'
                  }`}>
                    <Zap className="w-3 h-3 text-indigo-600" /> Key Benefit:
                  </span>
                  <p className={`text-[11px] font-semibold line-clamp-2 ${
                    isLight ? 'text-gray-800' : 'text-slate-200'
                  }`}>
                    {scheme.benefits[0]}
                  </p>
                </div>

                {/* Metadata details */}
                <div className={`grid grid-cols-2 gap-2 text-[10px] font-medium ${
                  isLight ? 'text-gray-500' : 'text-slate-400'
                }`}>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-indigo-600" />
                    <span>Last Date: <strong className={isLight ? 'text-gray-800' : 'text-slate-200'}>{scheme.lastDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-600" />
                    <span>Processing: <strong className={isLight ? 'text-gray-800' : 'text-slate-200'}>{scheme.estimatedProcessingTime}</strong></span>
                  </div>
                </div>

              </div>

              {/* Card Footer Actions */}
              <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
                isLight ? 'border-gray-200' : 'border-white/10'
              }`}>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleToggleSave(scheme.id, e)}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      scheme.isSaved
                        ? isLight ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : isLight ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200' : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10'
                    }`}
                    title={scheme.isSaved ? 'Saved Scheme' : 'Save Scheme'}
                  >
                    {scheme.isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={(e) => handleShare(scheme, e)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isLight ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-200' : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10'
                    }`}
                    title="Share Scheme"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <a
                    href={scheme.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
                      isLight ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}
                    title="Visit Direct Official Govt Portal"
                  >
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {scheme.isApplied ? (
                  <span className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 ${
                    isLight ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {scheme.applicationStatus || 'Applied'}
                  </span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setApplyModalScheme(scheme);
                      setAppSubmittedSuccess(false);
                      setUploadedDocNames([]);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1 cursor-pointer ${
                      isLight ? 'bg-indigo-700 hover:bg-indigo-800 text-white' : 'bg-indigo-500 hover:bg-indigo-400 text-slate-950 shadow-indigo-500/25'
                    }`}
                  >
                    <span>Apply Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Scheme Detail View Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-2xl border rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto ${
            isLight ? 'bg-white border-gray-200 text-gray-900 shadow-2xs' : 'bg-slate-950 border-indigo-500/40 text-white'
          }`}>
            
            <div className={`flex items-start justify-between gap-4 pb-4 border-b ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                    isLight ? 'bg-indigo-100 text-indigo-900 border-indigo-200' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                  }`}>
                    {selectedScheme.govtType} {selectedScheme.stateName || 'Govt'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                    isLight ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-white/5 text-slate-300'
                  }`}>
                    {selectedScheme.category}
                  </span>
                </div>
                <h2 className={`text-xl font-black ${isLight ? 'text-gray-900' : 'text-white'}`}>{selectedScheme.name}</h2>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className={`p-2 rounded-full cursor-pointer ${
                  isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className={`text-xs leading-relaxed font-medium ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>{selectedScheme.description}</p>

            {/* Benefits & Eligibility Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className={`p-4 rounded-2xl border space-y-2 ${
                isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-emerald-500/10 border-emerald-500/30'
              }`}>
                <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                  isLight ? 'text-emerald-900' : 'text-emerald-300'
                }`}>
                  <Zap className="w-4 h-4 text-emerald-600" /> Key Benefits
                </h4>
                <ul className={`space-y-1 text-xs font-medium ${isLight ? 'text-gray-800' : 'text-slate-200'}`}>
                  {selectedScheme.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`p-4 rounded-2xl border space-y-2 ${
                isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-950' : 'bg-indigo-500/10 border-indigo-500/30'
              }`}>
                <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                  isLight ? 'text-indigo-900' : 'text-indigo-300'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Eligibility Criteria
                </h4>
                <ul className={`space-y-1 text-xs font-medium ${isLight ? 'text-gray-800' : 'text-slate-200'}`}>
                  {selectedScheme.eligibility.map((e, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Trust Index & Official Source Verification Panel */}
            <div className={`p-4 rounded-2xl border space-y-3 ${
              isLight ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950' : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            }`}>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-emerald-900 dark:text-emerald-200">
                        {selectedScheme.trustIndex}% Trust Index
                      </h4>
                      {selectedScheme.isDirectGovtWebsite && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-200 text-emerald-950 dark:bg-emerald-500/30 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40">
                          Direct Govt Portal
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                      {selectedScheme.trustBadgeLabel || 'Official Government Source'}
                    </p>
                  </div>
                </div>

                <a
                  href={selectedScheme.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1 transition-all ${
                    isLight ? 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-800 shadow-2xs' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Visit {selectedScheme.trustSourceDomain || 'Govt Portal'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {selectedScheme.trustVerificationFactors && (
                <div className="pt-2 border-t border-emerald-200 dark:border-emerald-500/20 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-semibold text-emerald-900 dark:text-emerald-200">
                  {selectedScheme.trustVerificationFactors.map((factor, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Required Documents */}
            <div className={`p-4 rounded-2xl border space-y-2 ${
              isLight ? 'bg-gray-50 border-gray-200' : 'bg-slate-900 border-white/10'
            }`}>
              <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-gray-800' : 'text-slate-300'
              }`}>
                <FileText className="w-4 h-4 text-blue-600" /> Required Documents for Application
              </h4>
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedScheme.requiredDocuments.map((doc, i) => (
                  <span key={i} className={`px-2.5 py-1 rounded-xl border text-xs font-semibold ${
                    isLight ? 'bg-white border-gray-200 text-gray-800 shadow-2xs' : 'bg-white/5 border-white/10 text-slate-200'
                  }`}>
                    📄 {doc}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className={`flex items-center justify-between pt-3 border-t ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
              <a
                href={selectedScheme.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs font-bold hover:underline inline-flex items-center gap-1 ${
                  isLight ? 'text-indigo-700' : 'text-indigo-400'
                }`}
              >
                <span>Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedScheme(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setApplyModalScheme(selectedScheme);
                    setSelectedScheme(null);
                    setAppSubmittedSuccess(false);
                    setUploadedDocNames([]);
                  }}
                  className={`px-5 py-2 rounded-xl text-xs font-black shadow-md cursor-pointer ${
                    isLight ? 'bg-indigo-700 hover:bg-indigo-800 text-white' : 'bg-indigo-500 hover:bg-indigo-400 text-slate-950 shadow-indigo-500/25'
                  }`}
                >
                  Apply Now
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Apply Modal */}
      {applyModalScheme && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-lg border rounded-3xl p-6 shadow-2xl space-y-5 ${
            isLight ? 'bg-white border-indigo-200 text-gray-900 shadow-2xs' : 'bg-slate-950 border-indigo-500/50 text-white'
          }`}>
            
            <div className={`flex items-center justify-between pb-3 border-b ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
              <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-indigo-900' : 'text-indigo-400'
              }`}>
                <Landmark className="w-4 h-4" /> Direct Scheme Application
              </span>
              <button
                onClick={() => setApplyModalScheme(null)}
                className={`p-1.5 rounded-full cursor-pointer ${
                  isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {appSubmittedSuccess ? (
              <div className={`p-6 rounded-2xl border text-center space-y-3 ${
                isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-emerald-500/10 border-emerald-500/30'
              }`}>
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h3 className={`text-lg font-black ${isLight ? 'text-gray-900' : 'text-white'}`}>Application Submitted Successfully!</h3>
                <p className={`text-xs ${isLight ? 'text-emerald-900' : 'text-emerald-300'}`}>
                  Your application for <strong>{applyModalScheme.name}</strong> has been transmitted to government servers.
                </p>
                <div className={`p-3 rounded-xl border text-xs font-mono ${
                  isLight ? 'bg-white border-gray-200 text-gray-900' : 'bg-black/60 border-emerald-500/20 text-slate-300'
                }`}>
                  Tracking ID: {applyModalScheme.applicationId || 'APP-884920'}
                </div>
                <button
                  onClick={() => setApplyModalScheme(null)}
                  className={`px-5 py-2 rounded-xl text-xs font-black cursor-pointer ${
                    isLight ? 'bg-emerald-700 text-white hover:bg-emerald-800' : 'bg-emerald-500 text-slate-950'
                  }`}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div>
                  <h3 className={`text-base font-extrabold ${isLight ? 'text-gray-900' : 'text-white'}`}>{applyModalScheme.name}</h3>
                  <p className={`text-xs ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Processing Time: {applyModalScheme.estimatedProcessingTime}</p>
                </div>

                {/* Auto-filled Citizen Profile */}
                <div className={`p-3.5 rounded-2xl border space-y-2 text-xs ${
                  isLight ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-white/5 border-white/10 text-slate-300'
                }`}>
                  <span className={`font-bold block ${isLight ? 'text-indigo-900' : 'text-indigo-300'}`}>Applicant Details (Auto-filled from Profile):</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>Name: <strong className={isLight ? 'text-gray-900' : 'text-white'}>{user?.name}</strong></div>
                    <div>State: <strong className={isLight ? 'text-gray-900' : 'text-white'}>{profileForm.state}</strong></div>
                    <div>Occupation: <strong className={isLight ? 'text-gray-900' : 'text-white'}>{profileForm.occupation}</strong></div>
                    <div>Income: <strong className={isLight ? 'text-gray-900' : 'text-white'}>₹{parseInt(profileForm.incomeLevel).toLocaleString()}</strong></div>
                  </div>
                </div>

                {/* Document Upload Simulator */}
                <div className="space-y-2">
                  <label className={`text-xs font-bold block ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>Required Documents Checklist:</label>
                  <div className="space-y-1.5">
                    {applyModalScheme.requiredDocuments.map((doc, idx) => {
                      const isUploaded = uploadedDocNames.includes(doc);
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (isUploaded) {
                              setUploadedDocNames(uploadedDocNames.filter((d) => d !== doc));
                            } else {
                              setUploadedDocNames([...uploadedDocNames, doc]);
                            }
                          }}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                            isUploaded
                              ? isLight ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                              : isLight ? 'bg-white border-gray-200 text-gray-800 hover:border-gray-300' : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          <span className="font-medium">📄 {doc}</span>
                          <span className="text-[10px] font-bold">
                            {isUploaded ? '✓ Attached' : 'Attach File'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setApplyModalScheme(null)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                      isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingApp}
                    className={`px-5 py-2 rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5 ${
                      isLight ? 'bg-indigo-700 hover:bg-indigo-800 text-white' : 'bg-indigo-500 hover:bg-indigo-400 text-slate-950 shadow-indigo-500/25'
                    }`}
                  >
                    {isSubmittingApp ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Transmitting...</span>
                      </>
                    ) : (
                      <span>Submit Official Application</span>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Renewal Modal View */}
      {renewalModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-md border rounded-3xl p-6 shadow-2xl space-y-4 ${
            isLight ? 'bg-white border-amber-300 text-gray-900 shadow-2xs' : 'bg-slate-950 border-amber-500/50 text-white'
          }`}>
            
            <div className={`flex items-center justify-between pb-2 border-b ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
              <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-amber-800' : 'text-amber-400'
              }`}>
                <RefreshCw className="w-4 h-4" /> Scheme Renewal Portal
              </span>
              <button
                onClick={() => setRenewalModalItem(null)}
                className={`p-1 rounded-full cursor-pointer ${
                  isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-slate-300'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className={`text-base font-extrabold ${isLight ? 'text-gray-900' : 'text-white'}`}>{renewalModalItem.schemeName}</h3>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-amber-800 font-semibold' : 'text-amber-300'}`}>Expires in {renewalModalItem.daysRemaining} days on {renewalModalItem.expiryDate}</p>
            </div>

            <div className={`p-3.5 rounded-2xl border space-y-2 ${
              isLight ? 'bg-amber-50 border-amber-200 text-amber-950' : 'bg-amber-500/10 border-amber-500/30'
            }`}>
              <span className={`text-xs font-bold block ${isLight ? 'text-amber-900' : 'text-amber-300'}`}>Required Renewal Verification Docs:</span>
              <ul className={`text-xs space-y-1 font-medium ${isLight ? 'text-gray-800' : 'text-slate-200'}`}>
                {renewalModalItem.requiredDocs.map((doc, i) => (
                  <li key={i}>• {doc}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2">
              <a
                href={renewalModalItem.renewalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  isLight ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-2xs' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                <span>Proceed to Official Govt Renewal Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => {
                  alert('Renewal status updated! Verification alert dismissed.');
                  setReminders(reminders.filter((r) => r.id !== renewalModalItem.id));
                  setRenewalModalItem(null);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                Mark Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Profile Tuner Drawer Modal */}
      {isProfileTunerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-lg border rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
            isLight ? 'bg-white border-indigo-200 text-gray-900 shadow-2xs' : 'bg-slate-950 border-indigo-500/50 text-white'
          }`}>
            
            <div className={`flex items-center justify-between pb-3 border-b ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
              <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-indigo-900' : 'text-indigo-400'
              }`}>
                <SlidersHorizontal className="w-4 h-4" /> AI Profile Eligibility Matrix Tuner
              </span>
              <button
                onClick={() => setIsProfileTunerOpen(false)}
                className={`p-1.5 rounded-full cursor-pointer ${
                  isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className={`space-y-4 text-xs ${isLight ? 'text-gray-800' : 'text-slate-300'}`}>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`font-bold block mb-1 ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>Age (Years)</label>
                  <input
                    type="number"
                    value={profileForm.age}
                    onChange={(e) => setProfileForm({ ...profileForm, age: parseInt(e.target.value) || 18 })}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isLight ? 'bg-gray-50 border-gray-300 text-gray-900' : 'bg-white/10 border-white/15 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>Gender</label>
                  <select
                    value={profileForm.gender}
                    onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value as any })}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isLight ? 'bg-gray-50 border-gray-300 text-gray-900' : 'bg-slate-900 border-white/15 text-white'
                    }`}
                  >
                    <option value="all">All / Unspecified</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`font-bold block mb-1 ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>Primary Occupation</label>
                <select
                  value={profileForm.occupation}
                  onChange={(e) => setProfileForm({ ...profileForm, occupation: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                    isLight ? 'bg-gray-50 border-gray-300 text-gray-900' : 'bg-slate-900 border-white/15 text-white'
                  }`}
                >
                  <option value="Farmer">Farmer / Agriculturalist</option>
                  <option value="Student">Student</option>
                  <option value="Worker">Daily Wager / Unorganized Worker</option>
                  <option value="Entrepreneur">Entrepreneur / Small Business Owner</option>
                  <option value="Private Sector">Private Sector Employee</option>
                  <option value="Self Employed">Self Employed / Freelancer</option>
                </select>
              </div>

              <div>
                <label className={`font-bold block mb-1 ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>Annual Household Income (INR)</label>
                <input
                  type="number"
                  value={profileForm.incomeLevel}
                  onChange={(e) => setProfileForm({ ...profileForm, incomeLevel: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                    isLight ? 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400' : 'bg-white/10 border-white/15 text-white placeholder-slate-400'
                  }`}
                  placeholder="e.g. 300000"
                />
              </div>

              {/* Status Toggles */}
              <div className="space-y-2 pt-1">
                <label className={`font-bold block ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>Category Badges:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setProfileForm({ ...profileForm, isFarmer: !profileForm.isFarmer })}
                    className={`p-2.5 rounded-xl border font-bold text-[11px] cursor-pointer transition-all ${
                      profileForm.isFarmer
                        ? isLight ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : isLight ? 'bg-gray-100 border-gray-200 text-gray-600' : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    🌾 Farmer
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfileForm({ ...profileForm, isStudent: !profileForm.isStudent })}
                    className={`p-2.5 rounded-xl border font-bold text-[11px] cursor-pointer transition-all ${
                      profileForm.isStudent
                        ? isLight ? 'bg-indigo-100 text-indigo-900 border-indigo-300' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        : isLight ? 'bg-gray-100 border-gray-200 text-gray-600' : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    🎓 Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfileForm({ ...profileForm, isDisabilityStatus: !profileForm.isDisabilityStatus })}
                    className={`p-2.5 rounded-xl border font-bold text-[11px] cursor-pointer transition-all ${
                      profileForm.isDisabilityStatus
                        ? isLight ? 'bg-teal-100 text-teal-900 border-teal-300' : 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                        : isLight ? 'bg-gray-100 border-gray-200 text-gray-600' : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    ♿ Disability
                  </button>
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className={`font-bold block mb-1 ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>State</label>
                  <input
                    type="text"
                    value={profileForm.state}
                    onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isLight ? 'bg-gray-50 border-gray-300 text-gray-900' : 'bg-white/10 border-white/15 text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className={`font-bold block mb-1 ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>District / City</label>
                  <input
                    type="text"
                    value={profileForm.district}
                    onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isLight ? 'bg-gray-50 border-gray-300 text-gray-900' : 'bg-white/10 border-white/15 text-white'
                    }`}
                  />
                </div>
              </div>

            </div>

            <div className={`pt-3 border-t flex items-center justify-between ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
              <button
                type="button"
                onClick={() => setIsProfileTunerOpen(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateUser({
                    age: profileForm.age,
                    occupation: profileForm.occupation,
                    incomeLevel: profileForm.incomeLevel,
                    gender: profileForm.gender as any,
                    isStudent: profileForm.isStudent,
                    isFarmer: profileForm.isFarmer,
                    isDisabilityStatus: profileForm.isDisabilityStatus,
                    state: profileForm.state,
                    district: profileForm.district,
                  });
                  setIsProfileTunerOpen(false);
                }}
                className={`px-5 py-2 rounded-xl text-xs font-black cursor-pointer shadow-md ${
                  isLight ? 'bg-indigo-700 hover:bg-indigo-800 text-white' : 'bg-indigo-500 hover:bg-indigo-400 text-slate-950 shadow-indigo-500/25'
                }`}
              >
                Apply Criteria Matrix
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Dedicated Scheme Trust Audit Breakdown Modal */}
      {trustAuditScheme && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-lg border rounded-3xl p-6 shadow-2xl space-y-5 ${
            isLight ? 'bg-white border-emerald-200 text-gray-900 shadow-2xs' : 'bg-slate-950 border-emerald-500/50 text-white'
          }`}>
            
            <div className={`flex items-center justify-between pb-3 border-b ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className={`text-xs font-black uppercase tracking-wider ${
                  isLight ? 'text-emerald-900' : 'text-emerald-400'
                }`}>
                  Scheme Authenticity & Trust Audit Report
                </span>
              </div>
              <button
                onClick={() => setTrustAuditScheme(null)}
                className={`p-1.5 rounded-full cursor-pointer ${
                  isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center space-y-2 py-2">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white text-2xl font-black shadow-xl shadow-emerald-500/20 border-4 border-emerald-200 dark:border-emerald-500/30">
                {trustAuditScheme.trustIndex}%
              </div>
              <h3 className={`text-lg font-black ${isLight ? 'text-gray-900' : 'text-white'}`}>{trustAuditScheme.name}</h3>
              <p className={`text-xs font-bold ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>
                {trustAuditScheme.trustBadgeLabel || 'Official Government Source Verified'}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border space-y-2.5 text-xs ${
              isLight ? 'bg-emerald-50/70 border-emerald-200' : 'bg-white/5 border-white/10'
            }`}>
              <span className={`font-black uppercase tracking-wider block text-[10px] ${isLight ? 'text-emerald-900' : 'text-emerald-300'}`}>
                Domain & Security Parameters
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="space-y-0.5">
                  <span className={`block text-[10px] font-bold ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Official Website</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 truncate block">{trustAuditScheme.trustSourceDomain || trustAuditScheme.officialWebsite}</span>
                </div>
                <div className="space-y-0.5">
                  <span className={`block text-[10px] font-bold ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Domain Security</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-600" /> SSL 256-Bit Encrypted
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className={`text-xs font-black uppercase tracking-wider ${isLight ? 'text-gray-800' : 'text-slate-300'}`}>
                Verification Audit Factor Breakdown
              </h4>
              <div className="space-y-2">
                {(trustAuditScheme.trustVerificationFactors || [
                  'Directly hosted on National Informatics Centre (.gov.in) domain',
                  'SSL 256-Bit Encrypted direct connection to ministry servers',
                  '0 Misinformation flags across community audited database'
                ]).map((factor, i) => (
                  <div key={i} className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium ${
                    isLight ? 'bg-white border-gray-200 text-gray-800' : 'bg-slate-900 border-white/10 text-slate-200'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                onClick={() => setTrustAuditScheme(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                Close Audit
              </button>
              <a
                href={trustAuditScheme.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-5 py-2 rounded-xl text-xs font-black cursor-pointer shadow-md flex items-center gap-1.5 ${
                  isLight ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                <span>Launch Direct Govt Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
