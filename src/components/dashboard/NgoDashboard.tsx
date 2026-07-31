/**
 * Krithiq AI - NGO / Volunteer Role Dashboard
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HeartHandshake,
  Users,
  MapPin,
  Calendar,
  Sparkles,
  Award,
  AlertCircle,
  Megaphone,
  DollarSign,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';

export const NgoDashboard: React.FC = () => {
  const { user, reports, addXp, theme } = useApp();
  const isLight = theme === 'light';
  const [joinedDrives, setJoinedDrives] = useState<string[]>(['drive_1']);
  const [donatedAmount, setDonatedAmount] = useState<number>(50);

  const volunteerDrives = [
    {
      id: 'drive_1',
      title: 'Clean Cyberabad Lake Restoration & Plastic Sweep',
      location: 'Durgam Cheruvu Lake Park, Ward 107',
      time: 'This Saturday • 7:00 AM - 11:00 AM',
      volunteersCount: 84,
      targetVolunteers: 100,
      xpReward: 250,
      organizer: 'Clean Earth Foundation NGO',
    },
    {
      id: 'drive_2',
      title: 'Pothole Alert & Tree Planting Campaign',
      location: 'Madhapur Main Road Section B',
      time: 'Sunday • 8:00 AM - 12:00 PM',
      volunteersCount: 42,
      targetVolunteers: 60,
      xpReward: 200,
      organizer: 'Green City Volunteer Corps',
    },
    {
      id: 'drive_3',
      title: 'Elderly Digital Literacy & Scam Awareness Camp',
      location: 'Community Hall, Sector 4',
      time: 'Next Wednesday • 4:00 PM - 6:30 PM',
      volunteersCount: 19,
      targetVolunteers: 30,
      xpReward: 180,
      organizer: 'Senior Care & Cyber Safety Alliance',
    },
  ];

  const toggleJoinDrive = (driveId: string) => {
    if (joinedDrives.includes(driveId)) {
      setJoinedDrives((prev) => prev.filter((id) => id !== driveId));
    } else {
      setJoinedDrives((prev) => [...prev, driveId]);
      addXp(200, 'Registered for Volunteer Civic Drive');
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      
      {/* Role Header Banner */}
      <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
        isLight
          ? 'bg-gradient-to-r from-teal-50 via-indigo-50/80 to-slate-100 border-teal-200 text-slate-900 shadow-2xs'
          : 'bg-gradient-to-r from-violet-950 via-slate-900 to-slate-950 border border-violet-500/40 text-white shadow-2xl'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isLight
                ? 'bg-teal-100 text-teal-950 border-teal-300'
                : 'bg-violet-500/15 border-violet-500/30 text-violet-300'
            }`}>
              <HeartHandshake className={`w-3.5 h-3.5 ${isLight ? 'text-teal-800' : 'text-violet-400'}`} />
              <span>{user.organizationName || 'Clean India Volunteer Network'}</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-black flex items-center gap-2.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              NGO & Volunteer Community Portal
              <Award className={`w-6 h-6 ${isLight ? 'text-amber-800' : 'text-amber-400'}`} />
            </h2>
            <p className={`text-xs sm:text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Welcome, <span className={`font-bold ${isLight ? 'text-teal-900' : 'text-violet-300'}`}>{user.name}</span>. Coordinate local volunteer drives, tackle nearby civic issues, and dispatch emergency support.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`p-3.5 rounded-2xl border text-center ${
              isLight ? 'bg-white border-slate-300 text-slate-900 shadow-2xs' : 'bg-black/50 border-violet-500/30'
            }`}>
              <div className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Volunteer Hours</div>
              <div className={`text-xl font-black mt-0.5 ${isLight ? 'text-teal-900' : 'text-violet-400'}`}>148 Hours</div>
            </div>
            <div className={`p-3.5 rounded-2xl border text-center ${
              isLight ? 'bg-white border-slate-300 text-slate-900 shadow-2xs' : 'bg-black/50 border-violet-500/30'
            }`}>
              <div className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Impact XP</div>
              <div className={`text-xl font-black mt-0.5 ${isLight ? 'text-amber-900' : 'text-amber-400'}`}>{user.xp} XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards / Bubbles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className={`p-4 rounded-2xl border backdrop-blur-xl ${
          isLight ? 'bg-slate-900 border-slate-800 text-white shadow-md' : 'bg-slate-900/90 border-violet-500/30 text-white'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Active Volunteer Drives</span>
            <Users className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">12 Drives</div>
          <div className="text-[10px] text-violet-300 font-bold mt-1">3 drives near you</div>
        </div>

        <div className={`p-4 rounded-2xl border backdrop-blur-xl ${
          isLight ? 'bg-slate-900 border-slate-800 text-white shadow-md' : 'bg-slate-900/90 border-emerald-500/30 text-white'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Community Funds Raised</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">$24,500</div>
          <div className="text-[10px] text-emerald-300 font-bold mt-1">100% transparent audit</div>
        </div>

        <div className={`p-4 rounded-2xl border backdrop-blur-xl ${
          isLight ? 'bg-slate-900 border-slate-800 text-white shadow-md' : 'bg-slate-900/90 border-amber-500/30 text-white'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Awareness Campaigns</span>
            <Megaphone className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2">8 Active</div>
          <div className="text-[10px] text-amber-300 font-bold mt-1">5,400 citizens reached</div>
        </div>

        <div className={`p-4 rounded-2xl border backdrop-blur-xl ${
          isLight ? 'bg-slate-900 border-slate-800 text-white shadow-md' : 'bg-slate-900/90 border-rose-500/30 text-white'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Emergency Hotline</span>
            <PhoneCall className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 mt-2">2 Alerts</div>
          <div className="text-[10px] text-rose-300 font-bold mt-1">Dispatched support</div>
        </div>
      </div>

      {/* Volunteer Drives Section */}
      <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-400" />
            Nearby Volunteer Drives & Clean-Up Events
          </h3>
          <button
            onClick={() => alert('Organize Drive modal opened! You can publish your NGO drive.')}
            className="px-3.5 py-1.5 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/40 text-xs font-bold hover:bg-violet-500/30 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Host New Drive
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {volunteerDrives.map((drive) => {
            const isJoined = joinedDrives.includes(drive.id);

            return (
              <div
                key={drive.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-violet-500/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                      +{drive.xpReward} XP
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{drive.organizer}</span>
                  </div>

                  <h4 className="text-sm font-black text-white">{drive.title}</h4>
                  
                  <div className="text-xs text-slate-300 space-y-1 pt-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{drive.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span>{drive.time}</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                    <span>Volunteers</span>
                    <span className="text-violet-400">{drive.volunteersCount} / {drive.targetVolunteers}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                      style={{ width: `${(drive.volunteersCount / drive.targetVolunteers) * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => toggleJoinDrive(drive.id)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isJoined
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-violet-500 text-slate-950 hover:bg-violet-400 shadow-lg shadow-violet-500/20 font-black'
                  }`}
                >
                  {isJoined ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Registered as Volunteer</span>
                    </>
                  ) : (
                    <>
                      <span>Join Volunteer Drive</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
