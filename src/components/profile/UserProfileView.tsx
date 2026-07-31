/**
 * Krithiq AI - Premium Executive Civic Profile & Personal Dashboard
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrustMeter } from '../common/TrustMeter';
import { EditProfileModal } from './EditProfileModal';
import { CertificateModal } from './CertificateModal';
import { INITIAL_SCHEMES } from '../../data/mockSchemes';
import { UserAchievement, UserBadge, NetworkConnection, UserRole, LanguageCode } from '../../types';
import {
  User as UserIcon,
  ShieldCheck,
  Award,
  Smartphone,
  MapPin,
  Clock,
  Key,
  LogOut,
  Settings,
  Bell,
  CheckCircle2,
  Lock,
  Edit3,
  Globe,
  Share2,
  Bookmark,
  Users,
  ChevronRight,
  ChevronLeft,
  Zap,
  AlertTriangle,
  HeartHandshake,
  Landmark,
  FileText,
  Check,
  X,
  Moon,
  Sun,
  Briefcase,
  Sparkles,
  Search,
  Plus,
  ExternalLink,
  Wifi,
  BarChart2,
  Database,
  Eye,
  Sliders,
  TrendingUp,
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const {
    user,
    setUser,
    reports = [],
    setLanguage,
    setTheme,
    theme,
    setAuthModalOpen,
  } = useApp();

  const savedSchemes = INITIAL_SCHEMES.filter((s) => s.isSaved) || [];

  const isLight = theme === 'light';

  // Active Tab State
  const [activeTab, setActiveTab] = useState<
    'overview' | 'achievements' | 'badges' | 'bookmarks' | 'network' | 'settings'
  >('overview');

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<UserAchievement | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Settings tab form state
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [visibility, setVisibility] = useState<'public' | 'ward_only' | 'private'>('public');
  const [notifyWardAlerts, setNotifyWardAlerts] = useState(true);
  const [notifySchemeUpdates, setNotifySchemeUpdates] = useState(true);
  const [notifyCommunityMentions, setNotifyCommunityMentions] = useState(true);

  // Network tab state
  const [networkFilter, setNetworkFilter] = useState<'all' | 'followers' | 'following' | 'recommended'>('all');
  const [networkSearch, setNetworkSearch] = useState('');
  const [networkConnections, setNetworkConnections] = useState<NetworkConnection[]>(
    user.networkConnections || []
  );

  // Bookmarks tab filter
  const [bookmarkFilter, setBookmarkFilter] = useState<'all' | 'schemes' | 'reports'>('all');

  // Badge category filter
  const [badgeCategory, setBadgeCategory] = useState<string>('All');

  // Horizontal scroll for Achievements Carousel
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleToggleFollow = (id: string) => {
    setNetworkConnections((prev) =>
      prev.map((conn) => {
        if (conn.id === id) {
          const nextState = !conn.isFollowing;
          showToast(nextState ? `You are now following ${conn.name}` : `Unfollowed ${conn.name}`);
          return { ...conn, isFollowing: nextState };
        }
        return conn;
      })
    );
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.newPass || passwordForm.newPass !== passwordForm.confirm) {
      showToast('Passwords do not match or are empty');
      return;
    }
    setPasswordSuccess(true);
    showToast('Password updated successfully!');
    setPasswordForm({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setPasswordSuccess(false), 2000);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setUser((prev) => ({ ...prev, role: newRole }));
    showToast(`Account role switched to ${newRole.toUpperCase()}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-28 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white border border-emerald-500/50 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* EXECUTIVE LINKEDIN-STYLE PROFILE OVERVIEW CARD */}
      <div className={`rounded-3xl border shadow-xl overflow-hidden transition-all duration-300 ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-white/10 text-white'
      }`}>
        
        {/* Top Cover Banner */}
        <div className="relative h-44 sm:h-52 w-full bg-slate-900 overflow-hidden">
          <img
            src={user.coverPhoto || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'}
            alt="Cover"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
          
          {/* Cover Edit Trigger */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer shadow-lg"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Profile Avatar & Primary Info Header */}
        <div className="px-6 pb-6 pt-0 relative">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Overlapping Avatar */}
            <div className="relative group">
              <img
                src={user.avatar}
                alt={user.name}
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 shadow-2xl ${
                  isLight ? 'ring-white bg-white' : 'ring-slate-950 bg-slate-950'
                }`}
              />
              {user.isVerified && (
                <div className="absolute bottom-1 right-1 p-1.5 rounded-xl bg-emerald-600 text-white shadow-lg ring-2 ring-white dark:ring-slate-950" title="100% Cryptographically Verified">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className={`px-4 py-2 rounded-2xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                  isLight
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700'
                    : 'bg-indigo-500 hover:bg-indigo-600 text-slate-950 font-black'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('Public profile link copied to clipboard!');
                }}
                className={`px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/10'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Name, Tagline & Location */}
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight">{user.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border w-max mx-auto sm:mx-0 ${
                user.role === 'government'
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40'
                  : user.role === 'ngo'
                  ? 'bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/40'
                  : 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/40'
              }`}>
                {user.role} Leader
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
              {user.tagline || 'Civic Leader & Community Mentor • GHMC Ward Advisory'}
            </p>

            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              {user.bio}
            </p>

            {/* Location & Contact Meta */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                {user.locationName}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                {user.email}
              </span>
              {user.socialLinks?.linkedin && (
                <a
                  href={user.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <ExternalLink className="w-3 h-3" />
                  LinkedIn Profile
                </a>
              )}
            </div>
          </div>

          {/* Executive Metrics Grid */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3.5 rounded-2xl border text-center ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/5'
            }`}>
              <span className="text-[10px] font-black uppercase text-slate-500 block">Trust Index</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{user.trustScore}%</span>
              <span className="text-[9px] font-bold text-slate-400 block">Verified Citizen</span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-center ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/5'
            }`}>
              <span className="text-[10px] font-black uppercase text-slate-500 block">XP & Level</span>
              <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{user.xp} XP</span>
              <span className="text-[9px] font-bold text-slate-400 block">{user.reputationLevel}</span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-center ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/5'
            }`}>
              <span className="text-[10px] font-black uppercase text-slate-500 block">Impact Score</span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400">{user.impactScore}</span>
              <span className="text-[9px] font-bold text-slate-400 block">Civic Resolutions</span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-center ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/5'
            }`}>
              <span className="text-[10px] font-black uppercase text-slate-500 block">Network Reach</span>
              <span className="text-xl font-black text-teal-600 dark:text-teal-400">{user.followersCount}</span>
              <span className="text-[9px] font-bold text-slate-400 block">{user.followingCount} Following</span>
            </div>
          </div>

          <div className="mt-4">
            <TrustMeter score={user.trustScore} confidence={99} label="Cryptographic Identity Trust Meter" />
          </div>

        </div>
      </div>

      {/* DASHBOARD TAB NAVIGATION BAR */}
      <div className={`p-1.5 rounded-2xl border flex items-center gap-1 overflow-x-auto custom-scrollbar shadow-sm ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950 border-white/10 text-white'
      }`}>
        {[
          { id: 'overview', label: 'Overview', icon: BarChart2 },
          { id: 'achievements', label: 'Achievements & Certificates', icon: Award, count: (user.achievements || []).length },
          { id: 'badges', label: 'Badges & Level', icon: Zap, count: (user.badges || []).length },
          { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark, count: savedSchemes.length + reports.length },
          { id: 'network', label: 'Network', icon: Users, count: networkConnections.length },
          { id: 'settings', label: 'Account & Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? isLight
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                  : isLight
                  ? 'hover:bg-slate-100 text-slate-600'
                  : 'hover:bg-white/10 text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                  isActive
                    ? isLight ? 'bg-slate-700 text-white' : 'bg-slate-950 text-emerald-400'
                    : isLight ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* HORIZONTAL SCROLLABLE ACHIEVEMENTS & CERTIFICATES SHOWCASE */}
          <div className={`p-6 rounded-3xl border shadow-lg space-y-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-white/10'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-500" />
                  Achievements & Verified Certificates
                </h3>
                <p className="text-xs text-slate-500">
                  Cryptographically audited honors, awards, volunteer hours, and milestones
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollCarousel('left')}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300' : 'bg-white/10 hover:bg-white/20 border-white/10'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300' : 'bg-white/10 hover:bg-white/20 border-white/10'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Container */}
            <div
              ref={carouselRef}
              className="flex items-stretch gap-4 overflow-x-auto pb-2 custom-scrollbar snap-x snap-mandatory"
            >
              {(user.achievements || []).map((ach) => (
                <div
                  key={ach.id}
                  className={`min-w-[280px] sm:min-w-[320px] p-4 rounded-2xl border flex flex-col justify-between space-y-3 snap-start transition-all hover:scale-[1.01] ${
                    isLight
                      ? 'bg-gradient-to-br from-slate-50 to-emerald-50/30 border-emerald-200 text-slate-900 shadow-2xs'
                      : 'bg-gradient-to-br from-slate-900 to-emerald-950/30 border-emerald-500/30 text-white'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        {ach.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{ach.dateEarned}</span>
                    </div>

                    <h4 className="text-sm font-black leading-snug">{ach.title}</h4>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300 line-clamp-2">
                      {ach.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500">{ach.issuer}</span>
                    <button
                      onClick={() => setSelectedCertificate(ach)}
                      className="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Audit Credential</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CIVIC PROGRESS & LEVEL METER */}
          <div className={`p-6 rounded-3xl border shadow-lg space-y-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-white/10'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Civic Progression & Level Milestone
                </h3>
                <p className="text-xs text-slate-500">Track progress to Level 6 Civic Master Rank</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 font-extrabold text-xs">
                Level 5 Active
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold">
                <span>Current: 1,420 XP</span>
                <span className="text-indigo-600 dark:text-indigo-400">Target: 2,000 XP (Level 6)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full w-[71%] transition-all duration-500" />
              </div>
              <p className="text-[11px] font-bold text-slate-500 text-right">
                580 XP needed for Level 6 Master Rank
              </p>
            </div>
          </div>

          {/* CIVIC AFFILIATIONS & SKILLS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Affiliations */}
            <div className={`p-6 rounded-3xl border shadow-lg space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-white/10'
            }`}>
              <h3 className="text-base font-black flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-500" />
                Civic Affiliations
              </h3>
              <div className="space-y-3">
                {(user.civicAffiliations || []).map((aff) => (
                  <div key={aff.id} className={`p-3.5 rounded-2xl border text-xs ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
                  }`}>
                    <div className="font-extrabold">{aff.title}</div>
                    <div className="text-[11px] font-bold text-slate-500">{aff.organization}</div>
                    <div className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5">{aff.period}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className={`p-6 rounded-3xl border shadow-lg space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-white/10'
            }`}>
              <h3 className="text-base font-black flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-500" />
                Civic Expertise & Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {(user.skills || []).map((skill, idx) => (
                  <span key={idx} className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                    isLight ? 'bg-teal-50 border-teal-200 text-teal-900' : 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                  }`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* RECENT FILED CIVIC REPORTS */}
          <div className={`p-6 rounded-3xl border shadow-lg space-y-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-white/10'
          }`}>
            <h3 className="text-base font-black flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Your Active Filed Civic Reports ({reports.length})
            </h3>

            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
                }`}>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-indigo-500">{r.id}</span>
                    <h4 className="text-xs font-bold mt-0.5">{r.title}</h4>
                    <p className="text-[11px] text-slate-500">{r.locationName}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full border text-[10px] font-bold bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-500/30">
                      {r.status}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">SLA {r.slaHoursRemaining}h remaining</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: ACHIEVEMENTS & CERTIFICATES */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border shadow-lg space-y-6 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-white/10'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-500" />
                  Full Achievement & Certificate Portfolio
                </h3>
                <p className="text-xs text-slate-500">
                  Tap any certificate card to inspect cryptographic ledger verification details
                </p>
              </div>

              <button
                onClick={() => showToast('Log New Certificate modal coming soon!')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Log Achievement</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(user.achievements || []).map((ach) => (
                <div
                  key={ach.id}
                  onClick={() => setSelectedCertificate(ach)}
                  className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3 cursor-pointer transition-all hover:scale-[1.01] ${
                    isLight
                      ? 'bg-gradient-to-br from-slate-50 to-emerald-50/40 border-emerald-200 text-slate-900 shadow-2xs hover:border-emerald-400'
                      : 'bg-gradient-to-br from-slate-900 to-emerald-950/40 border-emerald-500/30 text-white hover:border-emerald-500'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        {ach.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{ach.dateEarned}</span>
                    </div>

                    <h4 className="text-base font-black leading-snug">{ach.title}</h4>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      {ach.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">{ach.issuer}</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span>Audit Credential</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BADGES & PROGRESS */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border shadow-lg space-y-6 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-white/10'
          }`}>
            <div>
              <h3 className="text-lg font-black flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Civic Badges & Milestone Catalog
              </h3>
              <p className="text-xs text-slate-500">
                Unlocked badges grant trust score bonuses and reputation perks
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['All', 'Fixes', 'Community', 'Audits', 'Governance', 'Leadership'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setBadgeCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    badgeCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(user.badges || [])
                .filter((b) => badgeCategory === 'All' || b.category === badgeCategory)
                .map((b) => (
                  <div key={b.id} className={`p-4 rounded-2xl border space-y-3 relative overflow-hidden ${
                    b.isUnlocked
                      ? isLight ? 'bg-amber-50/70 border-amber-300 text-slate-900 shadow-2xs' : 'bg-amber-950/20 border-amber-500/40 text-white'
                      : isLight ? 'bg-slate-50 border-slate-200 text-slate-500 opacity-80' : 'bg-slate-900/50 border-white/10 text-slate-400 opacity-80'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        b.isUnlocked
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {b.isUnlocked ? 'Unlocked' : 'Locked'}
                      </span>
                      <span className="text-[10px] font-mono font-extrabold text-amber-600 dark:text-amber-400">
                        +{b.xpValue} XP
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black">{b.name}</h4>
                      <p className="text-xs font-medium mt-0.5">{b.description}</p>
                    </div>

                    {!b.isUnlocked && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>Progress</span>
                          <span>{b.progress}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${b.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BOOKMARKS */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border shadow-lg space-y-6 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-white/10'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-indigo-500" />
                  Bookmarked & Saved Items
                </h3>
                <p className="text-xs text-slate-500">Your saved welfare schemes, civic complaints, and campaigns</p>
              </div>

              <div className="flex items-center gap-2">
                {['all', 'schemes', 'reports'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setBookmarkFilter(f as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      bookmarkFilter === f
                        ? 'bg-indigo-600 text-white font-black'
                        : isLight ? 'bg-slate-100 text-slate-700' : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Schemes List */}
            {(bookmarkFilter === 'all' || bookmarkFilter === 'schemes') && (
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-500">Saved Government Schemes</h4>
                {savedSchemes.length === 0 ? (
                  <p className="text-xs font-bold text-slate-400 italic">No bookmarked schemes yet.</p>
                ) : (
                  savedSchemes.map((s) => (
                    <div key={s.id} className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
                    }`}>
                      <div>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{s.category}</span>
                        <h5 className="font-extrabold text-sm">{s.name}</h5>
                        <p className="text-slate-500 text-[11px]">{s.description}</p>
                      </div>
                      <a
                        href={s.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-black shrink-0 flex items-center gap-1"
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: NETWORK & FOLLOWERS */}
      {activeTab === 'network' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border shadow-lg space-y-6 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-white/10'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  Followers & Civic Network
                </h3>
                <p className="text-xs text-slate-500">Connect with Ward Committee leaders, NGO heads, and fellow citizens</p>
              </div>

              {/* Network Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={networkSearch}
                  onChange={(e) => setNetworkSearch(e.target.value)}
                  placeholder="Search connections..."
                  className={`w-full pl-9 pr-3 py-1.5 rounded-xl border text-xs focus:outline-none ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
                  }`}
                />
              </div>
            </div>

            {/* Connections Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {networkConnections
                .filter((c) => !networkSearch || c.name.toLowerCase().includes(networkSearch.toLowerCase()))
                .map((conn) => (
                  <div key={conn.id} className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
                  }`}>
                    <div className="flex items-center gap-3">
                      <img src={conn.avatar} alt={conn.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-extrabold">{conn.name}</h4>
                        <p className="text-[11px] text-slate-500">{conn.tagline}</p>
                        <span className="text-[10px] font-bold text-indigo-500">{conn.location} • {conn.trustScore}% Trust</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleFollow(conn.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                        conn.isFollowing
                          ? isLight ? 'bg-slate-200 text-slate-800 hover:bg-slate-300' : 'bg-white/10 text-slate-200 hover:bg-white/20'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {conn.isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ACCOUNT & SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border shadow-lg space-y-6 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-white/10'
          }`}>
            <div>
              <h3 className="text-lg font-black flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-500" />
                Executive Account Controls & Preferences
              </h3>
              <p className="text-xs text-slate-500">Manage credentials, roles, privacy, offline mode, and security</p>
            </div>

            {/* 1. ROLE SWITCHER */}
            <div className={`p-5 rounded-2xl border space-y-3 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
            }`}>
              <h4 className="text-xs font-black uppercase text-slate-500">Switch Active Persona / Role</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { role: 'citizen', label: 'Citizen Leader', desc: 'Report issues & track schemes' },
                  { role: 'government', label: 'Govt Official', desc: 'Resolve SLAs & post updates' },
                  { role: 'ngo', label: 'NGO Representative', desc: 'Lead campaigns & volunteer' },
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleRoleChange(item.role as UserRole)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      user.role === item.role
                        ? 'bg-indigo-600 text-white border-indigo-700 font-bold shadow-md'
                        : isLight ? 'bg-white hover:bg-slate-100 border-slate-300' : 'bg-black/40 hover:bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="text-xs font-extrabold">{item.label}</div>
                    <div className={`text-[10px] ${user.role === item.role ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. SECURITY & PASSWORD FORM */}
            <form onSubmit={handlePasswordSubmit} className={`p-5 rounded-2xl border space-y-4 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
            }`}>
              <h4 className="text-xs font-black uppercase text-slate-500 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-emerald-500" />
                Change Account Password
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  placeholder="Current Password"
                  className={`px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-white/10'
                  }`}
                />
                <input
                  type="password"
                  value={passwordForm.newPass}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                  placeholder="New Password"
                  className={`px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-white/10'
                  }`}
                />
                <input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  placeholder="Confirm New Password"
                  className={`px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-white/10'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-bold">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={biometricsEnabled}
                      onChange={(e) => setBiometricsEnabled(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span>Enable Biometric FaceID Lock</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white text-xs font-black cursor-pointer shadow-md"
                >
                  Update Password
                </button>
              </div>
            </form>

            {/* 3. LANGUAGE & THEME */}
            <div className={`p-5 rounded-2xl border space-y-4 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
            }`}>
              <h4 className="text-xs font-black uppercase text-slate-500">Language & Display Theme</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1">Preferred Language</label>
                  <select
                    value={user.preferredLanguage || 'en'}
                    onChange={(e) => {
                      const lang = e.target.value as LanguageCode;
                      setLanguage(lang);
                      setUser((prev) => ({ ...prev, preferredLanguage: lang }));
                      showToast(`Language updated to ${lang.toUpperCase()}`);
                    }}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-bold focus:outline-none cursor-pointer ${
                      isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-white/10'
                    }`}
                  >
                    <option value="en">English (Default)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="mr">मराठी (Marathi)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">Theme Toggle</label>
                  <button
                    type="button"
                    onClick={() => setTheme(isLight ? 'dark' : 'light')}
                    className={`w-full px-4 py-2 rounded-xl border text-xs font-black flex items-center justify-between cursor-pointer ${
                      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-white/10 text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isLight ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                      <span>Active Theme: {isLight ? 'Light Mode' : 'Dark Mode'}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Click to Switch</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4. OFFLINE MODE & NOTIFICATIONS */}
            <div className={`p-5 rounded-2xl border space-y-4 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
            }`}>
              <h4 className="text-xs font-black uppercase text-slate-500">Offline Caching & Notifications</h4>

              <div className="space-y-3 text-xs font-bold">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-indigo-500" />
                    <span>Offline Mode & Local Storage Cache</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={offlineMode}
                    onChange={(e) => setOfflineMode(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-500" />
                    <span>Ward Emergency Alerts & SLA Overdue Push Notifications</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={notifyWardAlerts}
                    onChange={(e) => setNotifyWardAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* 5. LOGOUT & ACTIVE SESSIONS */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Logged in as <span className="font-bold text-slate-900 dark:text-white">{user.email}</span>
              </div>

              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out / Switch User</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* CERTIFICATE AUDIT MODAL */}
      <CertificateModal
        achievement={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
        isLight={isLight}
      />

    </div>
  );
};
