/**
 * Krithiq AI - Trust Score Gauge & Meter Component
 */

import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TrustMeterProps {
  score: number; // 0-100
  confidence?: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  badgeLevel?: string;
}

export const TrustMeter: React.FC<TrustMeterProps> = ({
  score,
  confidence = 95,
  size = 'md',
  label = 'AI Trust Score',
  badgeLevel = 'Gold Elite',
}) => {
  const { theme: appTheme } = useApp();
  const isLight = appTheme === 'light';

  // Determine color based on trust score
  const getColor = (val: number) => {
    if (val >= 85) return { stroke: '#059669', bg: isLight ? 'text-emerald-700' : 'text-emerald-400', border: isLight ? 'border-gray-200' : 'border-emerald-500/30' };
    if (val >= 65) return { stroke: '#d97706', bg: isLight ? 'text-amber-700' : 'text-amber-400', border: isLight ? 'border-gray-200' : 'border-amber-500/30' };
    return { stroke: '#dc2626', bg: isLight ? 'text-rose-700' : 'text-rose-400', border: isLight ? 'border-gray-200' : 'border-rose-500/30' };
  };

  const theme = getColor(score);
  const radius = size === 'sm' ? 24 : size === 'lg' ? 44 : 34;
  const strokeWidth = size === 'sm' ? 4 : size === 'lg' ? 7 : 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const dim = (radius + strokeWidth) * 2;

  return (
    <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
      isLight
        ? 'bg-white border-gray-200 shadow-2xs text-gray-900'
        : `bg-white/5 ${theme.border} backdrop-blur-xl text-white`
    }`}>
      <div className="relative flex items-center justify-center shrink-0">
        <svg width={dim} height={dim} className="transform -rotate-90">
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className={isLight ? 'text-gray-200' : 'text-white/10'}
            fill="transparent"
          />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            stroke={theme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`font-black ${size === 'lg' ? 'text-2xl' : 'text-lg'} ${theme.bg}`}>
            {score}
          </span>
          <span className={`text-[9px] font-bold uppercase tracking-wider ${isLight ? 'text-gray-400' : 'text-slate-400'}`}>/100</span>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-gray-900' : 'text-slate-300'}`}>
            <ShieldCheck className={`w-4 h-4 ${theme.bg}`} />
            {label}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border flex items-center gap-1 ${
            isLight
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}>
            <Award className="w-3 h-3" />
            {badgeLevel}
          </span>
        </div>

        <p className={`text-[11px] leading-snug ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>
          Calculated via cryptographic signatures, AI cross-verification, and community consensus.
        </p>

        <div className="mt-2 flex items-center gap-3 text-[10px]">
          <span className={isLight ? 'text-gray-500' : 'text-slate-400'}>
            Confidence: <strong className={`font-bold ${isLight ? 'text-blue-900' : 'text-cyan-400'}`}>{confidence}%</strong>
          </span>
          <span className={isLight ? 'text-gray-500' : 'text-slate-400'}>
            Audit Status: <strong className={`font-bold ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>Verified</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
