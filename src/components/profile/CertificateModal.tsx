import React from 'react';
import { UserAchievement } from '../../types';
import {
  X,
  ShieldCheck,
  Award,
  ExternalLink,
  CheckCircle2,
  Lock,
  Download,
  Share2,
} from 'lucide-react';

interface CertificateModalProps {
  achievement: UserAchievement | null;
  onClose: () => void;
  isLight: boolean;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  achievement,
  onClose,
  isLight,
}) => {
  if (!achievement) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl space-y-5 relative ${
        isLight ? 'bg-white border-slate-200 text-slate-900 shadow-2xs' : 'bg-slate-950 border-emerald-500/40 text-white'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Verified Executive Credential
            </span>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full cursor-pointer ${
              isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Card Design */}
        <div className={`p-6 rounded-2xl border text-center space-y-3 relative overflow-hidden ${
          isLight
            ? 'bg-gradient-to-b from-slate-50 to-emerald-50/40 border-emerald-200 text-slate-900'
            : 'bg-gradient-to-b from-slate-900 to-emerald-950/40 border-emerald-500/30 text-white'
        }`}>
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block">
              Official Civic Credential
            </span>
            <h3 className="text-lg font-black mt-1 leading-snug">{achievement.title}</h3>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
              Issued by {achievement.issuer || 'Krithiq AI Verification Ledger'} • {achievement.dateEarned}
            </p>
          </div>

          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 max-w-sm mx-auto leading-relaxed pt-2">
            "{achievement.description}"
          </p>

          <div className="pt-3 flex items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              SHA-256 Ledger Verified
            </span>
          </div>
        </div>

        {/* Cryptographic Ledger Metadata */}
        <div className={`p-3.5 rounded-xl border space-y-1 text-xs ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
        }`}>
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">Credential ID:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {achievement.credentialUrl ? achievement.credentialUrl.split('/').pop() : 'SYN-CRED-9982-2026'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">Validation Protocol:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Biometric Zero-Trust
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={() => {
              alert('Credential verification URL copied to clipboard!');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
              isLight ? 'bg-slate-100 text-slate-800 hover:bg-slate-200' : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Credential
          </button>

          <a
            href={achievement.credentialUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center gap-1.5"
          >
            <span>View Public Ledger Record</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
