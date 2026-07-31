/**
 * Krithiq AI - Transparency & Accountability Dashboard
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, CheckCircle2, Clock, AlertTriangle, TrendingUp, Building2, ShieldCheck, Award } from 'lucide-react';

export const TransparencyDashboard: React.FC = () => {
  const { metrics, reports, theme } = useApp();
  const isLight = theme === 'light';

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isLight
          ? 'bg-gradient-to-r from-slate-100 via-teal-50/70 to-slate-100 border-slate-300 text-slate-900 shadow-2xs'
          : 'bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 text-white shadow-2xl'
      }`}>
        <div>
          <h2 className={`text-2xl font-extrabold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Civic Transparency & Government SLA Dashboard
            <span className={`px-2.5 py-0.5 text-xs rounded-full font-bold border ${
              isLight ? 'bg-amber-100 text-amber-950 border-amber-300' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              Public Ledger
            </span>
          </h2>
          <p className={`text-xs mt-1 font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Real-time municipal performance metrics, department rankings, and SLA compliance audits.
          </p>
        </div>

        <div className={`px-4 py-2 rounded-2xl border font-black text-xs ${
          isLight ? 'bg-white border-slate-300 text-teal-900 shadow-2xs' : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
        }`}>
          Open Governance Index: 98.2%
        </div>
      </div>

      {/* Hero Metric Cards / Bubbles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Complaints Filed', value: (metrics?.totalComplaintsFiled ?? 14250).toLocaleString(), icon: AlertTriangle, accentLight: 'text-teal-800', accentDark: 'text-cyan-400' },
          { label: 'Resolved Complaints', value: (metrics?.resolvedComplaints ?? 13410).toLocaleString(), icon: CheckCircle2, accentLight: 'text-emerald-800', accentDark: 'text-emerald-400' },
          { label: 'Avg SLA Resolution Time', value: (metrics?.avgResolutionTimeHours ?? 28.4) + ' Hours', icon: Clock, accentLight: 'text-amber-900', accentDark: 'text-amber-400' },
          { label: 'SLA Adherence Rate', value: (metrics?.slaComplianceRate ?? 94.1) + '%', icon: TrendingUp, accentLight: 'text-indigo-900', accentDark: 'text-teal-400' },
        ].map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-3xl border transition-all space-y-2 shadow-md ${
                isLight
                  ? 'bg-slate-900 border-slate-800 text-white' // Black/dark bubble for high contrast card structure
                  : 'bg-slate-900/90 border-white/15 text-white backdrop-blur-xl'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black ${isLight ? 'text-slate-200' : 'text-slate-300'}`}>
                  {m.label}
                </span>
                <Icon className={`w-5 h-5 ${isLight ? 'text-teal-300' : m.accentDark}`} />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">{m.value}</div>
            </div>
          );
        })}
      </div>

      {/* Department SLA & Performance Leaderboard */}
      <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
        isLight ? 'bg-white border-slate-200 text-slate-900 shadow-2xs' : 'bg-slate-950/80 border border-white/10 text-white backdrop-blur-2xl shadow-2xl'
      }`}>
        <h3 className={`text-sm font-black flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          <Building2 className={`w-4 h-4 ${isLight ? 'text-teal-800' : 'text-amber-400'}`} />
          Department Performance & SLA Honor Roll
        </h3>

        <div className="space-y-3">
          {(metrics?.departmentStats ?? []).map((dept, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-black/40 border-white/5 text-slate-200'
              }`}
            >
              <div className="space-y-0.5">
                <div className={`font-black text-sm flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isLight ? 'bg-teal-100 text-teal-950' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    #{idx + 1}
                  </span>
                  {dept.name}
                </div>
                <div className={`text-[11px] font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Total Complaints Assigned: <strong className={isLight ? 'text-slate-900 font-black' : 'text-white'}>{dept.totalAssigned}</strong> | Solved: <strong className={isLight ? 'text-emerald-800 font-black' : 'text-emerald-400'}>{dept.solved}</strong>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className={`text-[10px] font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Avg SLA Time</div>
                  <div className={`font-black text-sm ${isLight ? 'text-teal-800' : 'text-cyan-400'}`}>{dept.avgHours} hrs</div>
                </div>

                <div className="text-right">
                  <div className={`text-[10px] font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Satisfaction</div>
                  <div className={`font-black text-sm ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>{dept.satisfactionRating} / 5.0 ★</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ward Ranking & Accountability */}
      <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
        isLight ? 'bg-white border-slate-200 text-slate-900 shadow-2xs' : 'bg-slate-950/80 border border-white/10 text-white backdrop-blur-2xl shadow-2xl'
      }`}>
        <h3 className={`text-sm font-black flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          <Award className={`w-4 h-4 ${isLight ? 'text-teal-800' : 'text-emerald-400'}`} />
          Ward Cleanliness & Resolution Rankings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { ward: 'Ward 107 - Madhapur', score: 96, status: 'Top Performer', colorLight: 'text-emerald-950 bg-emerald-100 border-emerald-300', colorDark: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' },
            { ward: 'Ward 108 - Gachibowli', score: 92, status: 'High SLA Compliance', colorLight: 'text-teal-950 bg-teal-100 border-teal-300', colorDark: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40' },
            { ward: 'Ward 109 - Jubilee Hills', score: 88, status: 'Satisfactory', colorLight: 'text-amber-950 bg-amber-100 border-amber-300', colorDark: 'text-amber-400 bg-amber-500/20 border-amber-500/40' },
          ].map((w, i) => (
            <div key={i} className={`p-4 rounded-2xl border space-y-2 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{w.ward}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${isLight ? w.colorLight : w.colorDark}`}>
                  {w.status}
                </span>
              </div>
              <div className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{w.score} / 100 Index</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
