/**
 * Krithiq AI - Gamification & Citizen Rewards View
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { Award, Flame, Sparkles, CheckCircle2, Ticket, Gift, Zap, ShieldCheck } from 'lucide-react';

export const RewardsView: React.FC = () => {
  const { user, rewards, challenges, redeemReward, claimChallengeReward, theme } = useApp();
  const isLight = theme === 'light';

  const triggerFireworks = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 ${
        isLight
          ? 'bg-white border-slate-200/90 text-slate-900 shadow-lg'
          : 'bg-gradient-to-r from-slate-900 via-amber-950/50 to-slate-900 border border-amber-500/30 text-white'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-2xl border ${
            isLight ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
          }`}>
            <Award className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <h2 className={`text-2xl font-extrabold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Citizen Gamification & Rewards Pass
              <span className={`px-2.5 py-0.5 text-xs rounded-full font-bold border ${
                isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                Level {user?.reputationLevel ?? 1}
              </span>
            </h2>
            <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Earn XP by verifying news, reporting potholes, & participating in community Q&A.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl border text-center ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/60 border-white/10'
          }`}>
            <div className={`text-[10px] font-bold uppercase ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Your XP Points</div>
            <div className={`text-xl font-black ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>{(user?.points ?? 0).toLocaleString()} XP</div>
          </div>
          <div className={`p-3 rounded-2xl border text-center ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/60 border-white/10'
          }`}>
            <div className={`text-[10px] font-bold uppercase flex items-center gap-1 justify-center ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <Flame className={`w-3 h-3 ${isLight ? 'text-orange-700' : 'text-orange-400'}`} /> Streak
            </div>
            <div className={`text-xl font-black ${isLight ? 'text-orange-700' : 'text-orange-400'}`}>{user?.streakDays ?? 0} Days</div>
          </div>
        </div>
      </div>

      {/* Daily & Weekly Civic Missions */}
      <div className={`p-6 rounded-3xl border shadow-2xl space-y-4 ${
        isLight ? 'bg-white border-slate-200/90 text-slate-900' : 'bg-slate-950/80 border border-white/10 backdrop-blur-2xl text-white'
      }`}>
        <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          <Zap className={`w-4 h-4 ${isLight ? 'text-amber-800' : 'text-amber-400'}`} />
          Active Daily & Weekly Civic Missions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {challenges.map((c) => (
            <div key={c.id} className={`p-4 rounded-2xl border space-y-3 flex flex-col justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{c.title}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                    isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}>
                    +{c.xpReward} XP
                  </span>
                </div>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{c.description}</p>
              </div>

              <div className="space-y-2">
                <div className={`flex items-center justify-between text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  <span>Progress ({c.progress} / {c.totalRequired})</span>
                  <span>{Math.round((c.progress / c.totalRequired) * 100)}%</span>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}>
                  <div
                    className={`${isLight ? 'bg-amber-600' : 'bg-amber-400'} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${(c.progress / c.totalRequired) * 100}%` }}
                  />
                </div>

                <button
                  disabled={c.progress < c.totalRequired || c.completed}
                  onClick={() => {
                    claimChallengeReward(c.id);
                    triggerFireworks();
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    c.completed
                      ? isLight ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : c.progress >= c.totalRequired
                      ? isLight ? 'bg-teal-700 text-white shadow-md hover:bg-teal-800' : 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 animate-pulse'
                      : isLight ? 'bg-slate-200 text-slate-500 border border-slate-300' : 'bg-white/5 text-slate-500 border border-white/5'
                  }`}
                >
                  {c.completed ? 'Claimed ✓' : c.progress >= c.totalRequired ? 'Claim XP Reward!' : 'In Progress'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Catalog */}
      <div className={`p-6 rounded-3xl border shadow-2xl space-y-4 ${
        isLight ? 'bg-white border-slate-200/90 text-slate-900' : 'bg-slate-950/80 border border-white/10 backdrop-blur-2xl text-white'
      }`}>
        <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          <Gift className={`w-4 h-4 ${isLight ? 'text-teal-800' : 'text-amber-400'}`} />
          Redeemable Rewards Catalog (Transit & Vouchers)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rewards.map((r) => (
            <div key={r.id} className={`p-4 rounded-2xl border space-y-3 relative overflow-hidden flex flex-col justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/10'
            }`}>
              <div className="space-y-2">
                <div className="h-32 rounded-xl overflow-hidden border border-slate-200 relative">
                  <img src={r.imageUrl} className="w-full h-full object-cover" />
                  <span className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                    isLight ? 'bg-teal-900 text-white border-teal-700' : 'bg-slate-950/90 text-amber-400 border-amber-500/30'
                  }`}>
                    {r.pointsCost} XP
                  </span>
                </div>

                <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{r.title}</h4>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{r.description}</p>
              </div>

              <button
                disabled={user.points < r.pointsCost || r.isRedeemed}
                onClick={() => {
                  redeemReward(r.id);
                  triggerFireworks();
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  r.isRedeemed
                    ? isLight ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : user.points >= r.pointsCost
                    ? isLight ? 'bg-teal-800 text-white hover:bg-teal-900 shadow-md' : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-102'
                    : isLight ? 'bg-slate-200 text-slate-500 border border-slate-300' : 'bg-white/5 text-slate-500 border border-white/5'
                }`}
              >
                {r.isRedeemed ? 'Redeemed Code ✓' : user.points >= r.pointsCost ? 'Redeem Ticket' : 'Not Enough XP'}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
