import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SmartNotification, NotificationPriority, NotificationCategory } from '../../types';
import {
  X,
  Bell,
  CheckCheck,
  Trash2,
  Sparkles,
  AlertTriangle,
  Landmark,
  HeartHandshake,
  Users,
  MapPin,
  TrendingUp,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldAlert,
  Info,
  Filter,
  Zap,
  ArrowRight,
  Star,
} from 'lucide-react';

export const NotificationsModal: React.FC = () => {
  const {
    isNotificationsModalOpen,
    setNotificationsModalOpen,
    notifications,
    markNotificationRead,
    deleteNotification,
    markAllNotificationsRead,
    clearNotifications,
    setActiveTab,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<NotificationCategory | 'all'>('all');
  const [activePriority, setActivePriority] = useState<NotificationPriority | 'all'>('all');
  const [onlyUnread, setOnlyUnread] = useState(false);

  if (!isNotificationsModalOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Filtered Notifications
  const filteredNotifications = notifications.filter((n) => {
    if (activeCategory !== 'all' && n.category !== activeCategory) return false;
    if (activePriority !== 'all' && n.priority !== activePriority) return false;
    if (onlyUnread && n.read) return false;
    return true;
  });

  // Group by Time
  const todayList = filteredNotifications.filter((n) => n.timestampGroup === 'Today');
  const yesterdayList = filteredNotifications.filter((n) => n.timestampGroup === 'Yesterday');
  const earlierList = filteredNotifications.filter((n) => n.timestampGroup === 'Earlier');

  const getPriorityBadge = (priority: NotificationPriority) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            🔴 Critical
          </span>
        );
      case 'important':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            🟠 Important
          </span>
        );
      case 'informational':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            🔵 Info
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            🟢 Completed
          </span>
        );
    }
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'complaints':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'schemes':
        return <Landmark className="w-4 h-4 text-indigo-400" />;
      case 'campaigns':
        return <HeartHandshake className="w-4 h-4 text-rose-400" />;
      case 'community':
        return <Users className="w-4 h-4 text-violet-400" />;
      case 'nearby':
        return <MapPin className="w-4 h-4 text-teal-400" />;
      case 'insights':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  const handleNotificationAction = (n: SmartNotification) => {
    markNotificationRead(n.id);
    if (n.actionTab) {
      setActiveTab(n.actionTab);
    }
    setNotificationsModalOpen(false);
  };

  const renderProgressStepper = (step?: 'received' | 'assigned' | 'in_progress' | 'resolved' | 'rate') => {
    if (!step) return null;
    const steps = [
      { key: 'received', label: 'Received' },
      { key: 'assigned', label: 'Assigned' },
      { key: 'in_progress', label: 'In Progress' },
      { key: 'resolved', label: 'Resolved' },
      { key: 'rate', label: 'Rate' },
    ];

    const currentIdx = steps.findIndex((s) => s.key === step);

    return (
      <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span>Complaint Progress Tracker</span>
          <span className="text-cyan-400">{steps[currentIdx]?.label}</span>
        </div>
        <div className="flex items-center justify-between gap-1">
          {steps.map((s, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <div key={s.key} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full h-1.5 rounded-full transition-all ${
                    isCurrent
                      ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50'
                      : isCompleted
                      ? 'bg-emerald-500'
                      : 'bg-slate-800'
                  }`}
                />
                <span
                  className={`text-[8px] font-semibold truncate ${
                    isCurrent ? 'text-cyan-300 font-black' : isCompleted ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderNotificationCard = (n: SmartNotification) => (
    <div
      key={n.id}
      className={`p-4 rounded-2xl border transition-all duration-200 relative group ${
        n.read
          ? 'bg-slate-900/40 border-white/5 text-slate-300'
          : 'bg-slate-900/90 border-cyan-500/40 shadow-xl shadow-cyan-950/20 text-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 shrink-0 mt-0.5">
            {getCategoryIcon(n.category)}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {getPriorityBadge(n.priority)}
              {n.locationDistance && (
                <span className="text-[10px] font-bold text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded-full border border-teal-500/30 flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" />
                  {n.locationDistance}
                </span>
              )}
              {n.aiInsightStat && (
                <span className="text-[10px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  {n.aiInsightStat}
                </span>
              )}
              <span className="text-[10px] text-slate-400 font-medium ml-auto flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {n.time}
              </span>
            </div>

            <h4 className="text-sm font-extrabold text-white leading-snug pt-0.5 flex items-center gap-2">
              {!n.read && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />}
              {n.title}
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed pt-0.5">{n.body}</p>

            {/* Stepper if complaint */}
            {renderProgressStepper(n.progressStep)}

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between gap-2">
              {n.actionLabel && (
                <button
                  onClick={() => handleNotificationAction(n)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs shadow-md hover:scale-102 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{n.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                {!n.read && (
                  <button
                    onClick={() => markNotificationRead(n.id)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-cyan-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    title="Mark as Read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Read</span>
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(n.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  title="Delete Notification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-950 border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/50 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Bell className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">Smart Notification Center</h2>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black text-xs">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">
                Personalized proactive alerts, complaint SLA tracking, and local civic intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setNotificationsModalOpen(false)}
              className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Civic Insights Summary Banner */}
        <div className="mx-5 sm:mx-6 mt-4 p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-blue-950/40 to-slate-900 border border-cyan-500/30 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              Proactive AI Assistant Summary
            </h3>
            <span className="text-[10px] font-bold text-slate-400">Ward 107 • Madhapur</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            "Your submitted pothole report VRX-2026-9812 was <strong className="text-emerald-400">resolved 12m ago</strong>. 
            Nearby water leakage on Mindspace Road is under active repair. You have <strong className="text-amber-300">1 eligible scheme</strong> awaiting claim."
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-5 sm:p-6 space-y-3 border-b border-white/5 shrink-0">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3 text-cyan-400" /> Category:
            </span>

            {[
              { id: 'all', label: 'All Alerts', icon: Bell },
              { id: 'complaints', label: 'Complaints', icon: AlertTriangle },
              { id: 'schemes', label: 'Government Schemes', icon: Landmark },
              { id: 'campaigns', label: 'Campaigns', icon: HeartHandshake },
              { id: 'community', label: 'Community', icon: Users },
              { id: 'nearby', label: 'Nearby Alerts', icon: MapPin },
              { id: 'insights', label: 'AI Insights', icon: Sparkles },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/25 scale-102'
                      : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Priority & Unread Toggle Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Priority Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-slate-400">Priority:</span>
              {[
                { id: 'all', label: 'All' },
                { id: 'critical', label: '🔴 Critical' },
                { id: 'important', label: '🟠 Important' },
                { id: 'informational', label: '🔵 Info' },
                { id: 'success', label: '🟢 Success' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePriority(p.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                    activePriority === p.id
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Quick Bulk Actions */}
            <div className="flex items-center gap-3 ml-auto text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 text-[11px] font-bold">
                <input
                  type="checkbox"
                  checked={onlyUnread}
                  onChange={(e) => setOnlyUnread(e.target.checked)}
                  className="rounded border-white/20 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Only Unread</span>
              </label>

              <button
                onClick={markAllNotificationsRead}
                className="text-cyan-400 hover:underline font-bold flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark All Read
              </button>

              <button
                onClick={clearNotifications}
                className="text-slate-400 hover:text-rose-400 font-bold flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>
        </div>

        {/* Notification Stream (Grouped by Today, Yesterday, Earlier) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Bell className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">No notifications match your filter</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try switching categories or clearing your active filters to view all civic updates.
              </p>
            </div>
          ) : (
            <>
              {/* Today */}
              {todayList.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-cyan-400">Today</span>
                    <span className="h-px bg-white/10 flex-1" />
                    <span className="text-[10px] text-slate-500 font-bold">{todayList.length} Alerts</span>
                  </div>
                  <div className="space-y-3">
                    {todayList.map((n) => renderNotificationCard(n))}
                  </div>
                </div>
              )}

              {/* Yesterday */}
              {yesterdayList.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">Yesterday</span>
                    <span className="h-px bg-white/10 flex-1" />
                    <span className="text-[10px] text-slate-500 font-bold">{yesterdayList.length} Alerts</span>
                  </div>
                  <div className="space-y-3">
                    {yesterdayList.map((n) => renderNotificationCard(n))}
                  </div>
                </div>
              )}

              {/* Earlier */}
              {earlierList.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">Earlier</span>
                    <span className="h-px bg-white/10 flex-1" />
                    <span className="text-[10px] text-slate-500 font-bold">{earlierList.length} Alerts</span>
                  </div>
                  <div className="space-y-3">
                    {earlierList.map((n) => renderNotificationCard(n))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
