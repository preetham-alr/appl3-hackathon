/**
 * Krithiq AI - First-Time Profile Creation & Onboarding
 */

import React, { useState } from 'react';
import { User, UserRole, LanguageCode } from '../../types';
import { ShieldCheck, Camera, MapPin, Globe, User as UserIcon, Phone, Mail, Building, Check, Sparkles, ArrowRight, ShieldAlert, KeyRound } from 'lucide-react';
import { AvatarPicker } from '../common/AvatarPicker';
import { verifyRoleCredentials } from '../../services/api';

interface ProfileSetupScreenProps {
  initialData: Partial<User>;
  role: UserRole;
  onComplete: (profileData: Partial<User>) => void;
  onBack?: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
];

const STATES = [
  'Telangana',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Delhi NCR',
  'California',
  'New York',
  'Other State/Province',
];

const DISTRICTS_MAP: Record<string, string[]> = {
  Telangana: ['Hyderabad', 'Rangareddy', 'Medchal-Malkajgiri', 'Warangal', 'Nizamabad'],
  Maharashtra: ['Mumbai Suburban', 'Pune', 'Thane', 'Nagpur', 'Nashik'],
  Karnataka: ['Bengaluru Urban', 'Mysuru', 'Mangaluru', 'Hubballi-Dharwad'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
  'Delhi NCR': ['Central Delhi', 'South Delhi', 'Gurugram', 'Noida'],
  California: ['Santa Clara', 'San Francisco', 'Los Angeles', 'Alameda'],
  'New York': ['Manhattan', 'Brooklyn', 'Queens'],
};

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({
  initialData,
  role,
  onComplete,
  onBack,
}) => {
  const [name, setName] = useState(initialData.name || '');
  const [email, setEmail] = useState(initialData.email || (role === 'government' ? 'officer.admin@ghmc.gov.in' : 'volunteer@cleanindia.org'));
  const [phone, setPhone] = useState(initialData.phone || '');
  const [avatar, setAvatar] = useState(initialData.avatar || AVATAR_PRESETS[0]);
  const [state, setState] = useState(initialData.state || 'Telangana');
  const [district, setDistrict] = useState(initialData.district || 'Hyderabad');
  const [city, setCity] = useState(initialData.city || 'Madhapur Ward 107');
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>(initialData.preferredLanguage || 'en');
  const [departmentName, setDepartmentName] = useState(initialData.departmentName || 'GHMC Roads & Sanitation');
  const [organizationName, setOrganizationName] = useState(initialData.organizationName || 'Clean India Volunteer Network');
  const [credentialId, setCredentialId] = useState(
    role === 'government' ? 'GOV-8921-GHMC' : role === 'ngo' ? 'NGO-REG-4492' : ''
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationHash, setVerificationHash] = useState<string | null>(null);

  const handleStateChange = (newVal: string) => {
    setState(newVal);
    const districts = DISTRICTS_MAP[newVal] || ['Central Zone'];
    setDistrict(districts[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setVerificationError(null);

    // Verify Official Role Credentials via API
    if (role === 'government' || role === 'ngo') {
      const result = await verifyRoleCredentials(
        role,
        credentialId,
        email,
        role === 'government' ? departmentName : organizationName
      );

      if (!result.verified) {
        setVerificationError(result.error || 'Official credential verification failed. Please check your badge ID.');
        setIsSubmitting(false);
        return;
      }

      setVerificationHash(result.verificationHash || null);
    }

    setTimeout(() => {
      onComplete({
        name,
        email,
        phone,
        avatar,
        role,
        state,
        district,
        city,
        preferredLanguage,
        departmentName: role === 'government' ? departmentName : undefined,
        organizationName: role === 'ngo' ? organizationName : undefined,
        locationName: `${city}, ${district}, ${state}`,
        isVerified: true,
        verificationBadge: role === 'government' ? 'Official Gov Executive' : role === 'ngo' ? 'Verified NGO Partner' : 'Citizen Member',
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-xl w-full my-auto space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Step 3 of 3 • Profile Setup</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Complete Your Civic Profile</h2>
          <p className="text-xs text-slate-300">
            Set up your identity details for verified reporting and official credentials.
          </p>
        </div>

        {/* Profile Setup Form */}
        <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-5">
          
          {/* Interactive Avatar Picker (Camera, File Upload & Presets) */}
          <AvatarPicker
            currentAvatar={avatar}
            onAvatarChange={(newAvatar) => setAvatar(newAvatar)}
            label="Select or Capture Profile Photo:"
          />

          {/* Full Name & Role Banner */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Enter your full name"
                className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-cyan-400 text-white text-xs font-bold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-cyan-400 text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-cyan-400 text-white text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Role specific inputs & Official Credential Verification */}
            {role === 'government' && (
              <div className="space-y-3 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                <div>
                  <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-emerald-400" />
                    Department / Authority Name
                  </label>
                  <input
                    type="text"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    placeholder="e.g. GHMC Road Infrastructure & Engineering"
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                    Official Government Badge / Officer ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    placeholder="e.g. GOV-8921-GHMC"
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/60 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold focus:outline-none"
                  />
                  <p className="text-[10px] text-emerald-400/80 mt-1">Format: GOV-XXXX or GHMC-XXXX. Mandatory for official authority dashboard access.</p>
                </div>
              </div>
            )}

            {role === 'ngo' && (
              <div className="space-y-3 p-3.5 rounded-2xl bg-violet-950/40 border border-violet-500/30">
                <div>
                  <label className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-violet-400" />
                    NGO / Volunteer Organization Name
                  </label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="e.g. Clean Cities & Green Earth NGO"
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/60 border border-violet-500/40 text-violet-300 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-violet-400" />
                    NGO Registration Badge / Volunteer ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    placeholder="e.g. NGO-REG-4492"
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/60 border border-violet-500/50 text-violet-300 text-xs font-mono font-bold focus:outline-none"
                  />
                  <p className="text-[10px] text-violet-400/80 mt-1">Format: NGO-XXXX or REG-XXXX. Verified against central registry.</p>
                </div>
              </div>
            )}

            {/* Verification Failure Error Box */}
            {verificationError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-rose-200">Verification Rejected</strong>
                  <span>{verificationError}</span>
                </div>
              </div>
            )}

            {/* Location dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" /> State
                </label>
                <select
                  value={state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none"
                >
                  {STATES.map((s) => (
                    <option key={s} value={s} className="bg-slate-900 text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none"
                >
                  {(DISTRICTS_MAP[state] || ['Central']).map((d) => (
                    <option key={d} value={d} className="bg-slate-900 text-white">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">City / Ward</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Madhapur Ward 107"
                  className="w-full mt-1 px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Language Selection */}
            <div>
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" /> Preferred App Language
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-1">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'te', label: 'తెలుగు' },
                  { code: 'hi', label: 'हिन्दी' },
                  { code: 'ta', label: 'தமிழ்' },
                  { code: 'kn', label: 'ಕನ್ನಡ' },
                  { code: 'ml', label: 'മലയാളം' },
                  { code: 'mr', label: 'మరాఠీ' },
                  { code: 'gu', label: 'ગુજરાતી' },
                  { code: 'bn', label: 'বাংলা' },
                  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
                ].map((l) => (
                  <button
                    type="button"
                    key={l.code}
                    onClick={() => setPreferredLanguage(l.code as any)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      preferredLanguage === l.code
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                        : 'bg-black/40 border-white/10 text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs font-bold cursor-pointer"
              >
                ← Back
              </button>
            ) : <div />}

            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Generating Cryptographic Session...</span>
              ) : (
                <>
                  <span>Complete Profile & Enter Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
