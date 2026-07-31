/**
 * Krithiq AI - Role Selection Screen
 */

import React, { useState } from 'react';
import { UserRole } from '../../types';
import { User, Building2, HeartHandshake, CheckCircle2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface RoleSelectionScreenProps {
  initialRole?: UserRole;
  onSelectRole: (role: UserRole) => void;
  onBack?: () => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  initialRole = 'citizen',
  onSelectRole,
  onBack,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  const roles = [
    {
      id: 'citizen' as UserRole,
      title: 'Citizen',
      badge: 'Public Guardian',
      icon: User,
      accent: 'cyan',
      description: 'Report civic issues, verify news & counterfeits, earn community rewards, and access AI assistance.',
      features: [
        'Report Complaints & Potholes',
        'Verify Fake News & Deepfakes',
        'QR & Barcode Scanner',
        'Community Rewards & Synks',
      ],
      glow: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/40 text-cyan-400',
      activeRing: 'ring-2 ring-cyan-400 border-cyan-400 bg-cyan-500/10',
    },
    {
      id: 'government' as UserRole,
      title: 'Government Worker',
      badge: 'Municipal Officer',
      icon: Building2,
      accent: 'emerald',
      description: 'Review assigned complaints, inspect site fixes, approve/reject reports, and manage department SLAs.',
      features: [
        'Assigned Complaint Queue',
        'Approve/Reject Resolution Fixes',
        'Live SLA Urgency Countdowns',
        'Department Heat Maps & Analytics',
      ],
      glow: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40 text-emerald-400',
      activeRing: 'ring-2 ring-emerald-400 border-emerald-400 bg-emerald-500/10',
    },
    {
      id: 'ngo' as UserRole,
      title: 'NGO / Volunteer',
      badge: 'Community Organizer',
      icon: HeartHandshake,
      accent: 'violet',
      description: 'Organize volunteer drives, tackle nearby civic issues, run awareness campaigns, and mobilize emergency response.',
      features: [
        'Nearby Unresolved Issues',
        'Volunteer Clean-Up Drives',
        'Donation & Awareness Campaigns',
        'Emergency Hotline Coordination',
      ],
      glow: 'from-violet-500/20 to-purple-600/20 border-violet-500/40 text-violet-400',
      activeRing: 'ring-2 ring-violet-400 border-violet-400 bg-violet-500/10',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl w-full my-auto space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Step 2 of 3 • Choose Your Identity Role</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">Select Your Access Role</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Krithiq AI adapts its user interface, workflows, and tools depending on your civic function. You can change this anytime from Settings.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;

            return (
              <div
                key={r.id}
                onClick={() => {
                  if ('vibrate' in navigator) navigator.vibrate(15);
                  setSelectedRole(r.id);
                }}
                className={`p-5 rounded-3xl bg-slate-900/90 border transition-all duration-300 cursor-pointer flex flex-col justify-between relative group hover:scale-102 backdrop-blur-xl ${
                  isSelected
                    ? r.activeRing
                    : 'border-white/10 hover:border-white/20 hover:bg-slate-900'
                }`}
              >
                {/* Radio Checkmark */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${r.glow} border`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                    isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950 scale-110' : 'border-white/20 bg-white/5'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">{r.title}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-white/10 text-slate-300 border border-white/10">
                      {r.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {r.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  {r.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          {onBack ? (
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold cursor-pointer"
            >
              ← Back
            </button>
          ) : <div />}

          <button
            onClick={() => onSelectRole(selectedRole)}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-black text-xs shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer ml-auto"
          >
            <span>Continue as {selectedRole.toUpperCase()}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
