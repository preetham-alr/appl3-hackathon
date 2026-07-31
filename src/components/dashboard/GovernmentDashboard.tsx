/**
 * Krithiq AI - Government Worker Role Dashboard
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplaintStatus, CivicReport } from '../../types';
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  FileCheck,
} from 'lucide-react';

export const GovernmentDashboard: React.FC = () => {
  const { reports, updateReportStatus, user, metrics, theme } = useApp();
  const isLight = theme === 'light';
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(null);
  const [actionNote, setActionNote] = useState('');
  const [actionModal, setActionModal] = useState<'approve' | 'reject' | null>(null);

  // Filter government assigned complaints
  const filteredReports = reports.filter((r) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'assigned') return r.status === 'Assigned' || r.status === 'In Progress';
    if (statusFilter === 'resolved') return r.status === 'Resolved';
    if (statusFilter === 'escalated') return r.isEscalated || r.severity === 'Critical';
    return true;
  });

  const handleExecuteAction = () => {
    if (!selectedReport || !actionModal) return;

    if (actionModal === 'approve') {
      updateReportStatus(
        selectedReport.id,
        'Resolved',
        `${user.name} (${user.departmentName || 'GHMC Official'})`,
        actionNote || 'Inspected site and verified work completion by engineering squad.'
      );
    } else {
      updateReportStatus(
        selectedReport.id,
        'Reopened',
        `${user.name} (${user.departmentName || 'GHMC Official'})`,
        actionNote || 'Resolution rejected during inspection. Re-opened for secondary fix.'
      );
    }

    setActionModal(null);
    setSelectedReport(null);
    setActionNote('');
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      
      {/* Role Header Banner */}
      <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
        isLight
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50/80 to-slate-100 border-emerald-200 text-slate-900 shadow-2xs'
          : 'bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/40 text-white shadow-2xl'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isLight
                ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
            }`}>
              <Building2 className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`} />
              <span>{user.departmentName || 'Municipal Administration & Urban Development'}</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-black flex items-center gap-2.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Government Worker Command Center
              <ShieldCheck className={`w-6 h-6 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
            </h2>
            <p className={`text-xs sm:text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Welcome back, <span className={`font-bold ${isLight ? 'text-emerald-900' : 'text-emerald-300'}`}>{user.name}</span>. Manage assigned citizen complaints, enforce SLAs, and approve inspection reports.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`p-3.5 rounded-2xl border text-center ${
              isLight ? 'bg-white border-slate-300 text-slate-900 shadow-2xs' : 'bg-black/50 border-emerald-500/30'
            }`}>
              <div className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>SLA Compliance</div>
              <div className={`text-xl font-black mt-0.5 ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>{metrics.slaComplianceRate}%</div>
            </div>
            <div className={`p-3.5 rounded-2xl border text-center ${
              isLight ? 'bg-white border-slate-300 text-slate-900 shadow-2xs' : 'bg-black/50 border-emerald-500/30'
            }`}>
              <div className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Avg Resolution</div>
              <div className={`text-xl font-black mt-0.5 ${isLight ? 'text-teal-900' : 'text-cyan-400'}`}>{metrics.avgResolutionTimeHours}h</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards / Bubbles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className={`p-4 rounded-2xl border backdrop-blur-xl ${
          isLight ? 'bg-slate-900 border-slate-800 text-white shadow-md' : 'bg-slate-900/90 border-emerald-500/30 text-white'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Assigned Complaints</span>
            <FileCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{reports.length}</div>
          <div className="text-[10px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% efficiency this week
          </div>
        </div>

        <div className={`p-4 rounded-2xl border backdrop-blur-xl ${
          isLight ? 'bg-slate-900 border-slate-800 text-white shadow-md' : 'bg-slate-900/90 border-amber-500/30 text-white'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Pending Inspection</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2">
            {reports.filter((r) => r.status === 'In Progress' || r.status === 'Assigned').length}
          </div>
          <div className="text-[10px] text-amber-300 font-bold mt-1">Requires official sign-off</div>
        </div>

        <div className={`p-4 rounded-2xl border backdrop-blur-xl ${
          isLight ? 'bg-slate-900 border-slate-800 text-white shadow-md' : 'bg-slate-900/90 border-cyan-500/30 text-white'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Verified Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 mt-2">
            {reports.filter((r) => r.status === 'Resolved').length}
          </div>
          <div className="text-[10px] text-cyan-300 font-bold mt-1">98% Citizen satisfaction</div>
        </div>

        <div className={`p-4 rounded-2xl border backdrop-blur-xl ${
          isLight ? 'bg-slate-900 border-slate-800 text-white shadow-md' : 'bg-slate-900/90 border-rose-500/30 text-white'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Critical Escalations</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 mt-2">
            {reports.filter((r) => r.severity === 'Critical').length}
          </div>
          <div className="text-[10px] text-rose-300 font-bold mt-1">Under 12h SLA deadline</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className={`p-4 rounded-2xl border backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 ${
        isLight ? 'bg-white border-slate-200 text-slate-900 shadow-2xs' : 'bg-slate-950/80 border-white/10 text-white'
      }`}>
        <div className="flex items-center gap-2">
          <Filter className={`w-4 h-4 ${isLight ? 'text-teal-800' : 'text-emerald-400'}`} />
          <span className={`text-xs font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Filter Queue:</span>
          {['all', 'assigned', 'resolved', 'escalated'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer ${
                statusFilter === f
                  ? isLight ? 'bg-teal-700 text-white shadow-2xs' : 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : isLight ? 'bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200' : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          Showing <span className={isLight ? 'text-teal-900 font-black' : 'text-emerald-400'}>{filteredReports.length}</span> assigned civic cases
        </div>
      </div>

      {/* Complaints Queue List */}
      <div className="space-y-4">
        {filteredReports.map((r) => (
          <div
            key={r.id}
            className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 hover:border-emerald-500/40 transition-all shadow-xl space-y-4 backdrop-blur-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-xl bg-black/60 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-extrabold">
                  {r.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  r.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {r.severity} Severity
                </span>
                <span className="text-xs text-slate-400 font-medium">Author: {r.authorName}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> SLA Target:
                  <strong className="text-white">{r.slaHoursRemaining}h remaining</strong>
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <h3 className="text-base font-black text-white">{r.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{r.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {r.locationName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Dept: {r.assignedDepartment}
                  </span>
                </div>
              </div>

              {/* Action Buttons for Govt Officer */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setSelectedReport(r);
                    setActionModal('approve');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve Resolution
                </button>

                <button
                  onClick={() => {
                    setSelectedReport(r);
                    setActionModal('reject');
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-rose-400" />
                  Reject & Re-open
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Confirmation Modal */}
      {actionModal && selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-950 border border-emerald-500/40 rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              {actionModal === 'approve' ? 'Approve Civic Complaint Fix' : 'Reject & Order Re-inspection'}
            </h3>
            
            <p className="text-xs text-slate-300">
              Complaint <span className="font-mono text-cyan-400 font-bold">{selectedReport.id}</span>: {selectedReport.title}
            </p>

            <div>
              <label className="text-xs font-bold text-slate-300">Official Officer Inspection Note:</label>
              <textarea
                rows={3}
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder={actionModal === 'approve' ? 'e.g. Inspected site, asphalt re-laying completed satisfactorily.' : 'e.g. Road patch incomplete. Re-dispatch engineering squad.'}
                className="w-full mt-1 p-3 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActionModal(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteAction}
                className={`px-5 py-2 rounded-xl font-black text-xs text-slate-950 shadow-lg ${
                  actionModal === 'approve' ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              >
                Confirm {actionModal === 'approve' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
