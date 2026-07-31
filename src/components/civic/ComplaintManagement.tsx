/**
 * Krithiq AI - Complaint Management & Interactive Timeline
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { compareResolutionPhotos } from '../../services/api';
import { CivicReport, ComplaintStatus } from '../../types';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  MapPin,
  Building2,
  User,
  ShieldAlert,
  ArrowRight,
  Eye,
  RefreshCw,
  Sparkles,
  Camera,
  ThumbsUp,
} from 'lucide-react';

export const ComplaintManagement: React.FC = () => {
  const {
    reports,
    confirmReportResolution,
    reopenReport,
    upvoteReport,
    setReportingModalOpen,
    theme,
  } = useApp();

  const isLight = theme === 'light';

  const [selectedReport, setSelectedReport] = useState<CivicReport>(reports[0] || null);
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'active' | 'verification' | 'resolved'>('all');
  const [reopenReason, setReopenReason] = useState('');
  const [showReopenBox, setShowReopenBox] = useState(false);

  const filteredReports = reports.filter((r) => {
    if (activeTabFilter === 'active') return r.status !== 'Resolved';
    if (activeTabFilter === 'verification') return r.status === 'Citizen Verification';
    if (activeTabFilter === 'resolved') return r.status === 'Resolved';
    return true;
  });

  const timelineSteps: ComplaintStatus[] = [
    'Submitted',
    'AI Analysis',
    'Assigned',
    'Inspection',
    'In Progress',
    'Escalated',
    'Citizen Verification',
    'Resolved',
  ];

  const getStatusStepIndex = (status: ComplaintStatus) => {
    const idx = timelineSteps.indexOf(status);
    return idx === -1 ? 4 : idx;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isLight
          ? 'bg-white border-gray-200 text-gray-900 shadow-2xs'
          : 'bg-gradient-to-r from-slate-900 via-orange-950/40 to-slate-900 border-orange-500/30 text-white shadow-2xl'
      }`}>
        <div>
          <h2 className={`text-2xl font-extrabold flex items-center gap-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
            Civic Complaint Resolution Portal
            <span className={`px-2.5 py-0.5 text-xs border rounded-full font-bold ${
              isLight ? 'bg-orange-50 text-orange-900 border-orange-200' : 'bg-orange-500/20 text-orange-300 border-orange-500/30'
            }`}>
              Live SLA Tracking
            </span>
          </h2>
          <p className={`text-xs mt-1 ${isLight ? 'text-gray-600' : 'text-slate-300'}`}>
            Real-time municipal department dispatch, AI verification of work, and citizen confirmation.
          </p>
        </div>

        <button
          onClick={() => setReportingModalOpen(true)}
          className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
            isLight
              ? 'bg-blue-800 text-white hover:bg-blue-900 shadow-2xs'
              : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 hover:scale-105 shadow-orange-500/30'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          + File New Complaint
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: `All Reports (${reports.length})` },
          { id: 'active', label: 'Active In Progress' },
          { id: 'verification', label: 'Awaiting Citizen Verification' },
          { id: 'resolved', label: 'Resolved' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap cursor-pointer ${
              activeTabFilter === tab.id
                ? isLight
                  ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-2xs font-extrabold'
                  : 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-lg font-extrabold'
                : isLight
                  ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid: List on Left, Interactive Timeline & Resolution on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Reports Sidebar List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredReports.map((r) => {
            const isSelected = selectedReport?.id === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedReport(r)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? isLight
                      ? 'bg-blue-50/70 border-blue-500 shadow-2xs ring-2 ring-blue-500/20'
                      : 'bg-slate-900 border-orange-500/60 shadow-xl ring-2 ring-orange-500/30'
                    : isLight
                      ? 'bg-white border-gray-200 hover:border-gray-300 shadow-2xs'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-mono text-[10px] font-bold ${isLight ? 'text-blue-900' : 'text-cyan-400'}`}>{r.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      r.status === 'Resolved'
                        ? isLight ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : r.status === 'Citizen Verification'
                        ? isLight ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                        : isLight ? 'bg-orange-50 text-orange-900 border-orange-200' : 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>

                <h4 className={`text-sm font-bold line-clamp-1 ${isLight ? 'text-gray-900' : 'text-white'}`}>{r.title}</h4>
                <p className={`text-xs line-clamp-2 ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>{r.description}</p>

                <div className={`flex items-center justify-between text-[11px] pt-2 border-t ${
                  isLight ? 'border-gray-100 text-gray-500' : 'border-white/10 text-slate-400'
                }`}>
                  <span className="flex items-center gap-1">
                    <MapPin className={`w-3 h-3 ${isLight ? 'text-orange-700' : 'text-orange-400'}`} />
                    {r.locationName.split(',')[0]}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        upvoteReport(r.id);
                      }}
                      className={`px-2 py-0.5 rounded-lg border flex items-center gap-1 font-bold text-[10px] ${
                        isLight ? 'bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200' : 'bg-white/10 border-transparent text-slate-200 hover:bg-white/20'
                      }`}
                    >
                      <ThumbsUp className={`w-3 h-3 ${isLight ? 'text-blue-800' : 'text-cyan-400'}`} />
                      {r.upvotesCount}
                    </button>
                    <span className={`font-bold ${isLight ? 'text-blue-900' : 'text-cyan-400'}`}>SLA {r.slaHoursRemaining}h</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Complaint Detail & Timeline */}
        {selectedReport && (
          <div className={`lg:col-span-7 space-y-5 p-6 rounded-3xl border shadow-xl ${
            isLight
              ? 'bg-white border-gray-200 shadow-2xs text-gray-900'
              : 'bg-slate-950/90 border-white/15 backdrop-blur-2xl shadow-2xl text-white'
          }`}>
            
            {/* Header */}
            <div className={`flex items-start justify-between gap-3 border-b pb-4 ${isLight ? 'border-gray-100' : 'border-white/10'}`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full border ${
                    isLight ? 'bg-blue-50 text-blue-900 border-blue-200' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                  }`}>
                    {selectedReport.id}
                  </span>
                  <span className={`text-xs font-bold capitalize ${isLight ? 'text-orange-800' : 'text-orange-400'}`}>
                    {selectedReport.category.replace('_', ' ')}
                  </span>
                </div>
                <h3 className={`text-lg font-extrabold mt-1 ${isLight ? 'text-gray-900' : 'text-white'}`}>{selectedReport.title}</h3>
                <p className={`text-xs flex items-center gap-1 mt-1 ${isLight ? 'text-gray-600' : 'text-slate-300'}`}>
                  <MapPin className={`w-3.5 h-3.5 ${isLight ? 'text-orange-700' : 'text-orange-400'}`} />
                  {selectedReport.locationName}
                </p>
              </div>

              <div className="text-right">
                <span className={`text-xs font-bold ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Priority SLA</span>
                <div className={`text-lg font-black ${isLight ? 'text-blue-900' : 'text-cyan-400'}`}>{selectedReport.slaTargetHours} Hours</div>
                <span className={`text-[10px] ${isLight ? 'text-gray-400' : 'text-slate-500'}`}>{selectedReport.slaHoursRemaining}h remaining</span>
              </div>
            </div>

            {/* Department Assignment */}
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
              isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-center gap-2.5">
                <Building2 className={`w-4 h-4 ${isLight ? 'text-blue-800' : 'text-cyan-400'}`} />
                <div>
                  <div className={`font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{selectedReport.assignedDepartment}</div>
                  <div className={`text-[10px] ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>{selectedReport.assignedOfficer || 'Auto-Assigned Duty Inspector'}</div>
                </div>
              </div>
            </div>

            {/* Verified Resolution (Before vs After Comparison) */}
            {selectedReport.beforeAfter && (
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isLight ? 'bg-emerald-50/60 border-emerald-200' : 'bg-emerald-500/10 border-emerald-500/30'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-emerald-950' : 'text-emerald-300'}`}>
                    <Sparkles className="w-4 h-4" />
                    Verified Resolution (AI Before & After Match)
                  </h4>
                  <span className={`px-2 py-0.5 text-[10px] font-black rounded-full border ${
                    isLight ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {selectedReport.beforeAfter.aiMatchScore}% Verified Fixed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className={`text-[10px] font-bold ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>Before (Citizen Report):</div>
                    <img src={selectedReport.beforeAfter.beforePhoto} className="h-28 w-full object-cover rounded-xl border border-gray-200" />
                  </div>
                  <div className="space-y-1">
                    <div className={`text-[10px] font-bold ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>After (Municipal Inspection):</div>
                    <img src={selectedReport.beforeAfter.afterPhoto} className="h-28 w-full object-cover rounded-xl border border-gray-200" />
                  </div>
                </div>

                <p className={`text-xs leading-relaxed p-2.5 rounded-xl border ${
                  isLight ? 'bg-white border-gray-200 text-gray-800' : 'bg-black/40 border-white/5 text-slate-200'
                }`}>
                  {selectedReport.beforeAfter.aiFindings}
                </p>

                {/* Citizen Confirmation Buttons */}
                {selectedReport.status === 'Citizen Verification' && (
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => confirmReportResolution(selectedReport.id)}
                      className={`flex-1 py-2.5 rounded-xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isLight ? 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-2xs' : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:scale-102 shadow-emerald-500/25'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm & Mark Solved
                    </button>

                    <button
                      onClick={() => setShowReopenBox(!showReopenBox)}
                      className={`px-4 py-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                        isLight ? 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100' : 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                      }`}
                    >
                      Reopen Complaint
                    </button>
                  </div>
                )}

                {showReopenBox && (
                  <div className={`p-3 rounded-xl border space-y-2 ${isLight ? 'bg-white border-rose-300' : 'bg-black/80 border-rose-500/40'}`}>
                    <input
                      type="text"
                      value={reopenReason}
                      onChange={(e) => setReopenReason(e.target.value)}
                      placeholder="Specify why repair is incomplete..."
                      className={`w-full px-3 py-2 rounded-lg border text-xs ${
                        isLight ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-slate-900 border-white/10 text-white'
                      }`}
                    />
                    <button
                      onClick={() => {
                        reopenReport(selectedReport.id, reopenReason || 'Work incomplete');
                        setShowReopenBox(false);
                      }}
                      className="w-full py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs"
                    >
                      Submit Reopen Demand
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Interactive Timeline */}
            <div className="space-y-3">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-gray-900' : 'text-slate-300'}`}>
                Interactive Resolution Timeline
              </h4>

              <div className={`relative pl-6 space-y-4 border-l-2 ml-2 ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
                {selectedReport.timeline.map((event, idx) => (
                  <div key={idx} className="relative group">
                    <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] font-bold ${
                      isLight ? 'bg-orange-600 text-white border-white' : 'bg-orange-500 text-slate-950 border-slate-950'
                    }`}>
                      ✓
                    </div>
                    <div className="text-xs">
                      <div className={`flex items-center justify-between ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>
                        <span className={`font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{event.status}</span>
                        <span className={`text-[10px] ${isLight ? 'text-gray-400' : 'text-slate-500'}`}>{event.timestamp}</span>
                      </div>
                      <p className={`mt-0.5 ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>{event.description}</p>
                      <span className={`text-[10px] font-semibold ${isLight ? 'text-orange-800' : 'text-orange-400'}`}>By: {event.actor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
