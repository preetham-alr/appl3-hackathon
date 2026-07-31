/**
 * Krithiq AI - Premium Top-Bar Rewards Dashboard Modal
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import {
  Award,
  Flame,
  Zap,
  Gift,
  Trophy,
  X,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Ticket,
} from 'lucide-react';

export const RewardsModal: React.FC = () => {
  const {
    user,
    rewards,
    challenges,
    redeemReward,
    claimChallengeReward,
    isRewardsModalOpen,
    setRewardsModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'missions' | 'store' | 'badges' | 'leaderboard' | 'coupons'
  >('missions');

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isRewardsModalOpen) return null;

  const triggerFireworks = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // fallback
    }
  };

  const currentXp = user?.xp ?? user?.points ?? 1420;
  const currentLevel = user?.level ?? 5;
  const nextLevelXp = currentLevel * 400;
  const prevLevelXp = (currentLevel - 1) * 400;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((currentXp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100))
  );

  const badges = [
    {
      id: 'b1',
      title: 'Civic Guardian L5',
      desc: 'Top citizen in Ward 107 for infrastructure reporting',
      icon: '🛡️',
      earned: true,
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300',
    },
    {
      id: 'b2',
      title: 'AI Fact Checker',
      desc: 'Ran over 25 news & QR security verification scans',
      icon: '🔍',
      earned: true,
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-300',
    },
    {
      id: 'b3',
      title: 'Eco Warrior',
      desc: 'Participated in zero-waste & park cleanup initiatives',
      icon: '🌱',
      earned: true,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300',
    },
    {
      id: 'b4',
      title: 'First Responder',
      desc: 'Reported critical hazards within 5 minutes of occurrence',
      icon: '⚡',
      earned: false,
      color: 'from-slate-800 to-slate-900 border-white/10 text-slate-500',
    },
  ];

  const leaderboards = [
    { rank: 1, name: `${user?.name || 'Civic Leader'} (You)`, xp: currentXp, trust: 94, avatar: user?.avatar, badge: 'Ward #1 Top Citizen' },
    { rank: 2, name: 'Dr. Vikramaditya Rao', xp: 1380, trust: 98, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', badge: 'Urban Planning Expert' },
    { rank: 3, name: 'Rahul Verma', xp: 1210, trust: 91, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', badge: 'Sanitation Volunteer' },
    { rank: 4, name: 'Sneha Patel', xp: 1050, trust: 89, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', badge: 'Lighting Vigilante' },
  ];

  const redeemedCoupons = rewards.filter((r) => r.isRedeemed);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-4xl bg-slate-950 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
        
        {/* Modal Close */}
        <button
          onClick={() => setRewardsModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-all z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Banner */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-amber-950/60 to-slate-950 border-b border-amber-500/20 shrink-0 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pr-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
                <Award className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  Citizen Gamification & Rewards
                  <span className="px-2.5 py-0.5 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-bold">
                    Level {currentLevel}
                  </span>
                </h2>
                <p className="text-xs text-slate-300">
                  Earn XP by verifying issues, filing civic reports, & helping ward members.
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="px-3.5 py-2 rounded-2xl bg-black/70 border border-amber-500/30 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Total XP</div>
                <div className="text-lg font-black text-amber-400">{currentXp.toLocaleString()} XP</div>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-black/70 border border-orange-500/30 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 justify-center">
                  <Flame className="w-3 h-3 text-orange-400" /> Streak
                </div>
                <div className="text-lg font-black text-orange-400">{user?.streakDays ?? 12} Days</div>
              </div>
            </div>
          </div>

          {/* Level Progress Tracker */}
          <div className="space-y-1.5 bg-black/40 p-3 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-bold flex items-center gap-1 text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                Level {currentLevel} Progress
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                {currentXp} / {nextLevelXp} XP ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 bg-slate-900/60 border-b border-white/10 flex items-center gap-2 overflow-x-auto shrink-0">
          {[
            { id: 'missions', label: 'Daily & Weekly Missions', icon: Zap },
            { id: 'store', label: 'Redeem Store', icon: Gift },
            { id: 'coupons', label: `My Coupons (${redeemedCoupons.length})`, icon: Ticket },
            { id: 'badges', label: 'Badges & Badging', icon: Award },
            { id: 'leaderboard', label: 'Ward Leaderboard', icon: Trophy },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Container */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* 1. Missions */}
          {activeTab === 'missions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Active Missions & XP Tasks
                </h3>
                <span className="text-[11px] text-slate-400">Resets in 14h 22m</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {challenges.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 flex flex-col justify-between hover:border-amber-500/30 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{c.title}</span>
                        <span className="text-[10px] font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                          +{c.xpReward} XP
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{c.description}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Progress ({c.progress}/{c.totalRequired})</span>
                        <span>{Math.round((c.progress / c.totalRequired) * 100)}%</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${(c.progress / c.totalRequired) * 100}%` }}
                        />
                      </div>

                      <button
                        disabled={c.progress < c.totalRequired || c.isCompleted}
                        onClick={() => {
                          claimChallengeReward(c.id);
                          triggerFireworks();
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          c.isCompleted
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : c.progress >= c.totalRequired
                            ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 animate-pulse'
                            : 'bg-white/5 text-slate-500 border border-white/5'
                        }`}
                      >
                        {c.isCompleted ? 'Claimed ✓' : c.progress >= c.totalRequired ? 'Claim XP Reward!' : 'In Progress'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Redeem Store */}
          {activeTab === 'store' && (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-400" />
                Transit Smart Passes & Eco Vouchers
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {rewards.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 flex flex-col justify-between hover:border-amber-500/40 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                          {r.category}
                        </span>
                        <span className="text-xs font-black text-amber-400">{r.xpCost} XP</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{r.title}</h4>
                      <p className="text-xs text-slate-300 leading-snug">{r.description}</p>
                    </div>

                    <button
                      disabled={currentXp < r.xpCost || r.isRedeemed}
                      onClick={() => {
                        const success = redeemReward(r.id);
                        if (success) triggerFireworks();
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        r.isRedeemed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : currentXp >= r.xpCost
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-102'
                          : 'bg-white/5 text-slate-500 border border-white/5'
                      }`}
                    >
                      {r.isRedeemed ? 'Redeemed ✓' : currentXp >= r.xpCost ? 'Redeem Voucher' : 'Not Enough XP'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. My Coupons */}
          {activeTab === 'coupons' && (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-amber-400" />
                Unlocked Voucher Codes
              </h3>

              {redeemedCoupons.length === 0 ? (
                <div className="p-8 text-center bg-white/5 border border-white/10 rounded-2xl text-slate-400 text-xs space-y-2">
                  <p className="font-bold text-slate-300">No redeemed coupons yet.</p>
                  <p>Earn XP from civic missions and unlock metro passes and vouchers above!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {redeemedCoupons.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-black border border-amber-500/30 space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] text-amber-400 font-bold uppercase">{c.category}</span>
                        <h4 className="text-xs font-bold text-white">{c.title}</h4>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black border border-amber-500/40 flex items-center justify-between">
                        <code className="text-xs font-mono font-bold text-amber-300">{c.code}</code>
                        <button
                          onClick={() => handleCopyCode(c.code)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedCode === c.code ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedCode === c.code ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. Badges & Badging */}
          {activeTab === 'badges' && (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Civic Achievement Badges
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {badges.map((b) => (
                  <div
                    key={b.id}
                    className={`p-4 rounded-2xl bg-gradient-to-r border flex items-center gap-3.5 ${b.color}`}
                  >
                    <div className="text-3xl p-3 bg-black/40 rounded-2xl border border-white/10 shrink-0">
                      {b.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-white">{b.title}</h4>
                        {b.earned && (
                          <span className="px-2 py-0.2 text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-bold">
                            Unlocked
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Leaderboard */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                Ward 107 Top Citizens Leaderboard
              </h3>

              <div className="space-y-2">
                {leaderboards.map((lb) => (
                  <div
                    key={lb.rank}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                      lb.rank === 1
                        ? 'bg-amber-500/10 border-amber-500/40 text-white'
                        : 'bg-white/5 border-white/5 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 text-center font-black ${lb.rank === 1 ? 'text-amber-400 text-base' : 'text-slate-400'}`}>
                        #{lb.rank}
                      </span>
                      <img src={lb.avatar} alt={lb.name} className="w-9 h-9 rounded-xl object-cover ring-2 ring-white/10" />
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {lb.name}
                          <span className="px-1.5 py-0.2 text-[9px] bg-white/10 text-cyan-300 rounded">
                            {lb.badge}
                          </span>
                        </div>
                        <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="w-3 h-3" /> {lb.trust} Trust Score
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-amber-400">{lb.xp} XP</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
