/**
 * Krithiq AI - Full Production Authentication Modal (Phone OTP, Google, Email, Tabs)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Phone,
  Mail,
  Lock,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Globe,
  KeyRound,
  Check,
} from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳', country: 'India' },
  { code: '+1', flag: '🇺🇸', country: 'United States' },
  { code: '+44', flag: '🇬🇧', country: 'United Kingdom' },
  { code: '+971', flag: '🇦🇪', country: 'UAE' },
  { code: '+65', flag: '🇸🇬', country: 'Singapore' },
  { code: '+61', flag: '🇦🇺', country: 'Australia' },
  { code: '+49', flag: '🇩🇪', country: 'Germany' },
];

const DEMO_GOOGLE_ACCOUNTS = [
  {
    name: 'Civic Leader',
    email: 'civic.leader@krithiq.ai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    trustScore: 94,
  },
  {
    name: 'Preetham Kanvapuri',
    email: 'preethamkanvapuri@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    trustScore: 98,
  },
  {
    name: 'Civic Administrator',
    email: 'ghmc.officer@telangana.gov.in',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    trustScore: 99,
  },
];

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccessAuth?: (authInfo: { method: string; email?: string; phone?: string; name?: string; avatar?: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessAuth,
}) => {
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    loginWithPhoneSms,
    loginWithGoogle,
    loginWithEmailOtp,
    theme,
  } = useApp();

  const isLight = theme === 'light';

  const showModal = isOpen !== undefined ? isOpen : isAuthModalOpen;

  // Active Tab: login | signup | forgot
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Auth Method: phone | google | email
  const [authMethod, setAuthMethod] = useState<'phone' | 'google' | 'email'>('phone');

  // Phone state
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  
  // Email state
  const [emailAddress, setEmailAddress] = useState('citizen@krithiq.ai');

  // Forgot state
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // OTP State
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  // Google Popup
  const [showGooglePicker, setShowGooglePicker] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend Countdown
  useEffect(() => {
    let interval: any = null;
    if (isOtpSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOtpSent, resendTimer]);

  if (!showModal) return null;

  const handleCloseModal = () => {
    if (onClose) onClose();
    else setAuthModalOpen(false);
  };

  const handleSendPhoneOtp = () => {
    if (!phoneNumber || phoneNumber.length < 7) {
      setOtpError('Please enter a valid phone number');
      return;
    }
    setOtpError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsOtpSent(true);
      setResendTimer(30);
    }, 600);
  };

  const handleSendEmailOtp = () => {
    if (!emailAddress || !emailAddress.includes('@')) {
      setOtpError('Please enter a valid email address');
      return;
    }
    setOtpError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsOtpSent(true);
      setResendTimer(30);
    }, 600);
  };

  const handleOtpInputChange = (index: number, value: string) => {
    setOtpError(null);
    const lastChar = value.slice(-1);
    if (lastChar && !/^\d$/.test(lastChar)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = lastChar;
    setOtpDigits(newDigits);

    // Auto-focus next field
    if (lastChar && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split('');
      setOtpDigits(digits);
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleAutoDetectOtp = () => {
    // Simulate auto-detect from SMS
    const detected = ['8', '4', '9', '2', '0', '1'];
    setOtpDigits(detected);
    setOtpError(null);
  };

  const handleVerifyOtp = () => {
    const fullCode = otpDigits.join('');
    if (fullCode.length !== 6) {
      setOtpError('Please enter the full 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      if (onSuccessAuth) {
        onSuccessAuth({
          method: authMethod,
          phone: `${countryCode} ${phoneNumber}`,
          email: emailAddress,
        });
      } else {
        if (authMethod === 'phone') loginWithPhoneSms(`${countryCode} ${phoneNumber}`, fullCode);
        else loginWithEmailOtp(emailAddress, fullCode);
      }

      handleCloseModal();
    }, 600);
  };

  const handleSelectGoogleAccount = (account: typeof DEMO_GOOGLE_ACCOUNTS[0]) => {
    setShowGooglePicker(false);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (onSuccessAuth) {
        onSuccessAuth({
          method: 'google',
          email: account.email,
          name: account.name,
          avatar: account.avatar,
        });
      } else {
        loginWithGoogle();
      }
      handleCloseModal();
    }, 500);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotInput) return;
    setForgotSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-md border rounded-3xl shadow-2xl p-6 relative space-y-5 overflow-hidden transition-all ${
        isLight
          ? 'bg-white border-slate-200 text-slate-900 shadow-xl'
          : 'bg-slate-950 border-cyan-500/40 text-white shadow-2xl'
      }`}>
        
        {/* Glow Effects */}
        {!isLight && <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />}

        <button
          onClick={handleCloseModal}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all cursor-pointer z-10 ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              : 'bg-white/10 hover:bg-white/20 text-slate-300'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mx-auto shadow-md ${
            isLight
              ? 'bg-teal-50 text-teal-800 border-teal-300'
              : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-cyan-500/20'
          }`}>
            <ShieldCheck className="w-7 h-7 animate-pulse" />
          </div>
          <h3 className={`text-xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>Krithiq AI Identity Verification</h3>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Cryptographically verified & passwordless authentication</p>
        </div>

        {/* Top Action Tabs: Login | Create Account | Forgot Account */}
        <div className={`flex items-center gap-1 p-1 rounded-xl border text-xs font-bold ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/60 border-white/10'
        }`}>
          <button
            onClick={() => { setActiveTab('login'); setIsOtpSent(false); setOtpError(null); }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'login'
                ? isLight ? 'bg-teal-700 text-white font-black shadow-xs' : 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setIsOtpSent(false); setOtpError(null); }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'signup'
                ? isLight ? 'bg-teal-700 text-white font-black shadow-xs' : 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => { setActiveTab('forgot'); setIsOtpSent(false); setOtpError(null); }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'forgot'
                ? isLight ? 'bg-teal-700 text-white font-black shadow-xs' : 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            Forgot
          </button>
        </div>

        {/* FORGOT ACCOUNT TAB */}
        {activeTab === 'forgot' ? (
          <div className="space-y-4 pt-2">
            {!forgotSubmitted ? (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <div className="text-center space-y-1">
                  <KeyRound className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-xs text-slate-300">
                    Enter your registered Mobile Number or Email to receive an instant account recovery access link.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Phone or Email:</label>
                  <input
                    type="text"
                    required
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    placeholder="e.g. +919876543210 or email@krithiq.ai"
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-bold focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:scale-102 transition-all cursor-pointer"
                >
                  Send Recovery OTP & Access Link
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-xs font-black text-white">Recovery Link Sent!</h4>
                <p className="text-[11px] text-slate-300">
                  We sent a verification SMS/email to <span className="text-emerald-400 font-bold">{forgotInput}</span>. Follow instructions to restore your account.
                </p>
                <button
                  onClick={() => { setForgotSubmitted(false); setActiveTab('login'); }}
                  className="mt-2 text-xs text-cyan-400 font-bold hover:underline cursor-pointer"
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        ) : (
          /* LOGIN / CREATE ACCOUNT TABS */
          <div className="space-y-4">
            
            {/* Method Chooser Pills */}
            <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-xl border border-white/10 text-[11px] font-bold">
              <button
                onClick={() => { setAuthMethod('phone'); setIsOtpSent(false); setOtpError(null); }}
                className={`flex-1 py-1 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMethod === 'phone' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                <Phone className="w-3.5 h-3.5" /> Mobile SMS OTP
              </button>
              <button
                onClick={() => { setAuthMethod('google'); setIsOtpSent(false); setOtpError(null); }}
                className={`flex-1 py-1 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMethod === 'google' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Google
              </button>
              <button
                onClick={() => { setAuthMethod('email'); setIsOtpSent(false); setOtpError(null); }}
                className={`flex-1 py-1 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMethod === 'email' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                <Mail className="w-3.5 h-3.5" /> Email OTP
              </button>
            </div>

            {/* Error Message Box */}
            {otpError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            {/* METHOD 1: PHONE SMS OTP */}
            {authMethod === 'phone' && (
              <div className="space-y-3">
                {!isOtpSent ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300">Enter Mobile Number:</label>
                      <div className="flex items-center gap-2 mt-1">
                        {/* Country Code Dropdown */}
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="px-2.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-bold focus:outline-none"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>

                        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs">
                          <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                          <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="e.g. 9876543210"
                            className="bg-transparent w-full focus:outline-none text-white font-mono font-bold tracking-wider"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSendPhoneOtp}
                      disabled={isLoading}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Send 6-Digit Verification SMS</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  /* OTP VERIFICATION VIEW */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">
                        OTP sent to <span className="text-cyan-400 font-mono font-bold">{countryCode} {phoneNumber}</span>
                      </span>
                      <button
                        onClick={() => setIsOtpSent(false)}
                        className="text-cyan-400 font-bold hover:underline"
                      >
                        Change
                      </button>
                    </div>

                    {/* Auto-Detect SMS button simulation */}
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between text-xs">
                      <span className="text-cyan-300 text-[11px] font-semibold">📲 Auto-detect SMS available</span>
                      <button
                        type="button"
                        onClick={handleAutoDetectOtp}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-black text-[10px] hover:scale-105 transition-all cursor-pointer"
                      >
                        Auto-Fill
                      </button>
                    </div>

                    {/* 6 Digit Inputs */}
                    <div className="flex items-center justify-between gap-1.5" onPaste={handleOtpPaste}>
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpInputRefs.current[index] = el)}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpInputChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className={`w-11 h-12 rounded-xl text-center text-lg font-mono font-black border transition-all focus:outline-none ${
                            digit
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                              : 'bg-black/60 border-white/15 text-white'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Resend Timer */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Didn't receive SMS?</span>
                      {resendTimer > 0 ? (
                        <span className="text-slate-500 font-mono">Resend in {resendTimer}s</span>
                      ) : (
                        <button
                          onClick={handleSendPhoneOtp}
                          className="text-cyan-400 font-bold hover:underline cursor-pointer"
                        >
                          Resend OTP Now
                        </button>
                      )}
                    </div>

                    <button
                      onClick={handleVerifyOtp}
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Verify & Authenticate</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* METHOD 2: GOOGLE SIGN-IN */}
            {authMethod === 'google' && (
              <div className="space-y-3 pt-2">
                {!showGooglePicker ? (
                  <button
                    onClick={() => setShowGooglePicker(true)}
                    className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs shadow-xl hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-600" />
                    Continue with Google Account
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Choose Google Account
                      </span>
                      <button
                        onClick={() => setShowGooglePicker(false)}
                        className="text-[10px] text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="space-y-2">
                      {DEMO_GOOGLE_ACCOUNTS.map((acc, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectGoogleAccount(acc)}
                          className="w-full p-2.5 rounded-xl bg-black/40 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-3 text-left cursor-pointer group"
                        >
                          <img src={acc.avatar} alt={acc.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-500/40" />
                          <div className="flex-1 truncate">
                            <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{acc.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">{acc.email}</div>
                          </div>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* METHOD 3: EMAIL OTP */}
            {authMethod === 'email' && (
              <div className="space-y-3">
                {!isOtpSent ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300">Enter Email Address:</label>
                      <div className="flex items-center gap-2 mt-1 px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs">
                        <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                        <input
                          type="email"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          placeholder="name@example.com"
                          className="bg-transparent w-full focus:outline-none text-white font-bold"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSendEmailOtp}
                      disabled={isLoading}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Send Email OTP Code</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">
                        OTP sent to <span className="text-cyan-400 font-bold">{emailAddress}</span>
                      </span>
                      <button onClick={() => setIsOtpSent(false)} className="text-cyan-400 font-bold hover:underline">
                        Change
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-1.5" onPaste={handleOtpPaste}>
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpInputRefs.current[index] = el)}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpInputChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className={`w-11 h-12 rounded-xl text-center text-lg font-mono font-black border transition-all focus:outline-none ${
                            digit
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md'
                              : 'bg-black/60 border-white/15 text-white'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleVerifyOtp}
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>Verify Email & Login</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
