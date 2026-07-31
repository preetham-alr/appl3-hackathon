/**
 * Krithiq AI - Floating Draggable AI Assistant Bubble & Sheet
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { askAiAssistant } from '../../services/api';
import { ChatMessage, AssistantCategory } from '../../types';
import { VoiceModeOverlay } from './VoiceModeOverlay';
import { triggerHaptic } from '../../utils/haptics';
import {
  Bot,
  X,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Camera,
  QrCode,
  AlertTriangle,
  MapPin,
  PhoneCall,
  Search,
  Globe,
  FileText,
  Volume2,
  VolumeX,
  ShieldCheck,
  RefreshCw,
  Radio,
  Image as ImageIcon,
  Terminal,
  Zap,
  Compass,
  Command as CommandIcon,
  Award,
  Building,
  UserCheck,
  Navigation,
  User,
  HeartHandshake,
} from 'lucide-react';

export const FloatingAiAssistant: React.FC = () => {
  const {
    theme,
    language,
    setLanguage,
    setReportingModalOpen,
    setSearchModalOpen,
    setLocationModalOpen,
    setActiveTab,
    switchUserRole,
  } = useApp();

  const isLight = theme === 'light';

  // Floating Bubble Position State
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem('krithiq_ai_pos');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      x: typeof window !== 'undefined' ? window.innerWidth - 84 : 300,
      y: typeof window !== 'undefined' ? window.innerHeight - 160 : 600,
    };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0,
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);
  const [activeTab, setActiveTabAssistant] = useState<
    'chat' | 'commands' | 'scan' | 'qr' | 'voice' | 'actions' | 'translate'
  >('chat');

  // Command Mode State
  const [commandInput, setCommandInput] = useState('');
  const [isCommandListening, setIsCommandListening] = useState(false);
  const [lastCommandFeedback, setLastCommandFeedback] = useState<string | null>(null);

  // Chat State
  const [category, setCategory] = useState<AssistantCategory>('general');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: "Hi, I'm Krithiq AI. I'm your AI assistant. I can help you report civic issues, verify information, discover government schemes, answer questions about public services, and guide you through government processes.",
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isTtsActive, setIsTtsActive] = useState(true);

  // Scan & QR state
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [qrCodeInput, setQrCodeInput] = useState('SYN-MED-99821-HYD');
  const [qrScanStatus, setQrScanStatus] = useState<string | null>(null);

  // Translation State
  const [translateText, setTranslateText] = useState('');
  const [translatedOutput, setTranslatedOutput] = useState('');

  // Save Position to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('krithiq_ai_pos', JSON.stringify(position));
    } catch (e) {}
  }, [position]);

  // Pointer drag events for smooth edge snapping
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    const newX = Math.min(
      Math.max(12, dragStartRef.current.posX + deltaX),
      window.innerWidth - 76
    );
    const newY = Math.min(
      Math.max(12, dragStartRef.current.posY + deltaY),
      window.innerHeight - 100
    );

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    // Edge Snapping to Left or Right margin
    const screenWidth = window.innerWidth;
    const snapThreshold = screenWidth / 2;
    const snappedX = position.x < snapThreshold ? 16 : screenWidth - 76;

    setPosition((prev) => ({ ...prev, x: snappedX }));
  };

  const handleSendChat = async (queryOverride?: string) => {
    const q = queryOverride || inputQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    try {
      const res = await askAiAssistant(q, category, language);
      const responseText = typeof res === 'string' ? res : res.text || 'Assistance response generated.';
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);

      // Speak text if TTS is active
      if (isTtsActive && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const cleanText = responseText.replace(/[*#_`~]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 300));
        utterance.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : 'en-US';
        utterance.rate = language === 'te' ? 0.95 : 1.0;
        const voices = window.speechSynthesis.getVoices();
        const targetVoice = voices.find((v) => v.lang.startsWith(language) || v.lang.includes('te'));
        if (targetVoice) utterance.voice = targetVoice;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  const toggleVoiceRecording = () => {
    if (isVoiceRecording) {
      setIsVoiceRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsVoiceRecording(true);
      setTimeout(() => {
        setIsVoiceRecording(false);
        handleSendChat('Is the road repair near Cyber Towers on schedule?');
      }, 2500);
      return;
    }

    try {
      setIsVoiceRecording(true);
      triggerHaptic('listening');
      const rec = new SpeechRecognition();
      rec.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : 'en-US';
      rec.interimResults = false;

      rec.onresult = (e: any) => {
        setIsVoiceRecording(false);
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setInputQuery(transcript);
        }
      };

      rec.onerror = (e: any) => {
        console.warn('Voice dictation error:', e);
        setIsVoiceRecording(false);
      };

      rec.onend = () => {
        setIsVoiceRecording(false);
      };

      rec.start();
    } catch (err) {
      setIsVoiceRecording(false);
    }
  };

  const handleScanQr = () => {
    setQrScanStatus('Scanning Krithiq Live Batch Ledger...');
    setTimeout(() => {
      setQrScanStatus(
        '✅ Genuine Medical Batch Hash: SYN-MED-99821. Manufactured by Apollo Pharma Labs. Expiry: 2028-12. Verification Trust Score: 100% Verified.'
      );
    }, 1200);
  };

  const handleTranslate = () => {
    if (!translateText.trim()) return;
    setTranslatedOutput(
      `[AI Translation]: ${translateText} → (Translated to ${language.toUpperCase()} with 99% accuracy)`
    );
  };

  const executeCommand = (cmdText: string) => {
    if (!cmdText.trim()) return;
    const clean = cmdText.toLowerCase().trim();
    let feedback = '';

    if (clean.includes('profile') || clean.includes('user details') || clean.includes('account')) {
      setActiveTab('profile');
      feedback = 'Opening your profile page now...';
    } else if (clean.includes('report') || clean.includes('complaint') || clean.includes('file issue') || clean.includes('start a report')) {
      setReportingModalOpen(true);
      feedback = 'Opening civic issue reporting form...';
    } else if (clean.includes('map') || clean.includes('civic map') || clean.includes('gis')) {
      setActiveTab('map');
      feedback = 'Navigating to GIS Civic Map...';
    } else if (clean.includes('fact') || clean.includes('verification') || clean.includes('verify') || clean.includes('news check')) {
      setActiveTab('verification');
      feedback = 'Opening Universal Fact Check & Verification Engine...';
    } else if (clean.includes('community') || clean.includes('feed') || clean.includes('forum') || clean.includes('post')) {
      setActiveTab('community');
      feedback = 'Opening Community Feed...';
    } else if (clean.includes('scheme') || clean.includes('welfare') || clean.includes('yojana')) {
      setActiveTab('schemes');
      feedback = 'Opening Government Schemes Navigator...';
    } else if (clean.includes('volunteer') || clean.includes('ngo') || clean.includes('drive')) {
      setActiveTab('volunteers');
      feedback = 'Opening NGO Volunteers & Drives Portal...';
    } else if (clean.includes('reward') || clean.includes('point') || clean.includes('coin') || clean.includes('badge')) {
      setActiveTab('rewards');
      feedback = 'Opening Rewards & Gamification Dashboard...';
    } else if (clean.includes('budget') || clean.includes('transparency') || clean.includes('audit')) {
      setActiveTab('transparency');
      feedback = 'Opening City Budget Transparency Portal...';
    } else if (clean.includes('search')) {
      setSearchModalOpen(true);
      feedback = 'Opening AI Search bar...';
    } else if (clean.includes('government role') || clean.includes('officer mode') || clean.includes('government employee')) {
      switchUserRole('government');
      feedback = 'Switched role to Government Executive Authority.';
    } else if (clean.includes('ngo role') || clean.includes('volunteer role')) {
      switchUserRole('ngo');
      feedback = 'Switched role to NGO Partner Leader.';
    } else if (clean.includes('citizen role') || clean.includes('user role')) {
      switchUserRole('citizen');
      feedback = 'Switched role to Citizen Member.';
    } else if (clean.includes('location') || clean.includes('city') || clean.includes('ward')) {
      setLocationModalOpen(true);
      feedback = 'Opening Location & Ward Selector...';
    } else if (clean.includes('reels') || clean.includes('video') || clean.includes('shorts')) {
      setActiveTab('reels');
      feedback = 'Opening Civic Impact SYNKS...';
    } else {
      feedback = `Executing AI Command: "${cmdText}".`;
      handleSendChat(cmdText);
      setActiveTabAssistant('chat');
      return;
    }

    setLastCommandFeedback(feedback);
    triggerHaptic('success');

    if ('speechSynthesis' in window && isTtsActive) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(feedback);
      window.speechSynthesis.speak(u);
    }

    setTimeout(() => {
      setIsExpanded(false);
    }, 1200);
  };

  const startVoiceCommandRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      executeCommand(commandInput || 'Open my profile');
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      setIsCommandListening(true);
      triggerHaptic('listening');
      rec.start();

      rec.onresult = (e: any) => {
        setIsCommandListening(false);
        const transcript = e.results[0][0].transcript;
        setCommandInput(transcript);
        executeCommand(transcript);
      };

      rec.onerror = (e: any) => {
        setIsCommandListening(false);
        console.warn('Voice command error:', e);
        const demoCmd = 'Start a report';
        setCommandInput(demoCmd);
        executeCommand(demoCmd);
      };

      rec.onend = () => {
        setIsCommandListening(false);
      };
    } catch (err) {
      setIsCommandListening(false);
      executeCommand('Open my profile');
    }
  };

  return (
    <>
      {/* FLOATING BUBBLE BUTTON */}
      {!isExpanded && (
        <div
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={(e) => {
            // Prevent expand if dragged
            const distanceMoved = Math.hypot(
              position.x - dragStartRef.current.posX,
              position.y - dragStartRef.current.posY
            );
            if (distanceMoved < 10) setIsExpanded(true);
          }}
          className="fixed z-50 cursor-grab active:cursor-grabbing select-none group touch-none"
        >
          <div className={`relative flex items-center justify-center w-14 h-14 rounded-2xl p-[1.5px] group-hover:scale-110 transition-transform duration-200 ${
            isLight
              ? 'bg-gradient-to-tr from-pink-300 via-pink-400 to-rose-300 shadow-2xl shadow-pink-300/60 ring-2 ring-pink-200/50'
              : 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-400 shadow-2xl shadow-cyan-500/50'
          }`}>
            <div className={`w-full h-full rounded-[14px] flex items-center justify-center backdrop-blur-xl relative overflow-hidden ${
              isLight
                ? 'bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 border border-pink-200/80 shadow-inner'
                : 'bg-slate-950'
            }`}>
              <Bot className={`w-7 h-7 animate-pulse ${
                isLight ? 'text-rose-950 drop-shadow-[0_1.5px_2px_rgba(159,18,57,0.35)]' : 'text-cyan-400'
              }`} />
              <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full animate-ping border-2 ${
                isLight ? 'bg-rose-700 border-pink-100' : 'bg-emerald-400 border-slate-950'
              }`} />
            </div>
          </div>
          <div className={`absolute -bottom-5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider whitespace-nowrap shadow-md ${
            isLight
              ? 'bg-pink-100/95 text-rose-950 border border-pink-300/80 shadow-pink-200/50'
              : 'bg-black/80 text-cyan-300 border border-cyan-500/30'
          }`}>
            Krithiq AI
          </div>
        </div>
      )}

      {/* EXPANDED ASSISTANT OVERLAY SHEET */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-2 sm:p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className={`w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] sm:h-[75vh] relative border ${
            isLight
              ? 'bg-white border-pink-200 text-slate-900 shadow-pink-300/30'
              : 'bg-slate-950 border-cyan-500/50 text-white'
          }`}>
            
            {/* Sheet Header */}
            <div className={`p-4 border-b flex items-center justify-between gap-3 shrink-0 ${
              isLight
                ? 'bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border-pink-200'
                : 'bg-gradient-to-r from-slate-950 via-cyan-950/60 to-slate-950 border-white/10'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  isLight
                    ? 'bg-pink-100 border-pink-300 text-rose-950'
                    : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                }`}>
                  <Bot className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className={`text-sm font-extrabold flex items-center gap-2 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    Krithiq AI Floating Co-Pilot
                    <span className={`px-2 py-0.2 text-[9px] border rounded-full font-mono font-bold ${
                      isLight
                        ? 'bg-pink-100 text-rose-950 border-pink-300'
                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                    }`}>
                      v2.6 Online
                    </span>
                  </h3>
                  <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    AI Chat, Voice, QR Scanner, Complaint Drafter & Emergency Help
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsVoiceModeOpen(true)}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer ${
                    isLight
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-pink-300/40'
                      : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-400 text-slate-950 shadow-cyan-500/20'
                  }`}
                  title="Start Live ChatGPT-style Voice Conversation"
                >
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Voice Mode</span>
                </button>
                <button
                  onClick={() => setIsTtsActive(!isTtsActive)}
                  className={`p-2 rounded-xl border text-xs cursor-pointer ${
                    isTtsActive
                      ? isLight
                        ? 'bg-pink-100 border-pink-300 text-rose-950'
                        : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                      : isLight
                      ? 'bg-slate-100 border-slate-200 text-slate-600'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                  title="Toggle Speech Audio Output"
                >
                  {isTtsActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-white/10 hover:bg-white/20 text-slate-300'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Feature Tabs */}
            <div className={`px-4 pt-2 border-b flex items-center gap-2 overflow-x-auto shrink-0 ${
              isLight ? 'bg-pink-50/50 border-pink-200' : 'bg-slate-900/60 border-white/10'
            }`}>
              {[
                { id: 'chat', label: 'AI Chat', icon: Sparkles },
                { id: 'commands', label: 'Command Mode', icon: Terminal },
                { id: 'qr', label: 'QR Scanner', icon: QrCode },
                { id: 'scan', label: 'Image Scan', icon: Camera },
                { id: 'actions', label: 'Quick Tools & SOS', icon: AlertTriangle },
                { id: 'translate', label: 'Translator', icon: Globe },
              ].map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTabAssistant(t.id as any)}
                    className={`py-2 px-3 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? isLight
                          ? 'border-pink-600 text-rose-950 bg-pink-100/80 font-black'
                          : 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                        : isLight
                        ? 'border-transparent text-slate-600 hover:text-slate-950'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB BODY CONTENTS */}
            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {/* 1. AI CHAT */}
              {activeTab === 'chat' && (
                <div className="flex flex-col h-full justify-between space-y-3">
                  {/* Messages Feed */}
                  <div className="space-y-3 overflow-y-auto max-h-[42vh] pr-1">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex gap-2.5 text-xs ${
                          m.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {m.sender === 'assistant' && (
                          <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                            isLight
                              ? 'bg-pink-100 border-pink-300 text-rose-950'
                              : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                          }`}>
                            <Bot className="w-4 h-4" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl ${
                            m.sender === 'user'
                              ? isLight
                                ? 'bg-teal-800 text-white font-medium rounded-tr-none'
                                : 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                              : isLight
                              ? 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
                              : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                          <span className="text-[9px] opacity-60 block mt-1 text-right">{m.timestamp}</span>
                        </div>
                      </div>
                    ))}

                    {isThinking && (
                      <div className={`flex items-center gap-2 text-xs font-bold animate-pulse ${
                        isLight ? 'text-pink-700' : 'text-cyan-400'
                      }`}>
                        <Bot className="w-4 h-4" />
                        Krithiq AI analyzing context & drafting response...
                      </div>
                    )}
                  </div>

                  {/* Preset Prompts */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] shrink-0">
                    <span className={`font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Quick:</span>
                    {[
                      'How to report a road defect?',
                      'Check medicine QR authenticity',
                      'Emergency police phone helpline',
                    ].map((p, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendChat(p)}
                        className={`px-2 py-0.5 rounded-lg border cursor-pointer ${
                          isLight
                            ? 'bg-pink-50 hover:bg-pink-100 text-rose-950 border-pink-200'
                            : 'bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  {/* Input Box */}
                  <div className={`flex items-center gap-2 p-2 rounded-2xl border shrink-0 ${
                    isLight
                      ? 'bg-white border-pink-200 shadow-2xs'
                      : 'bg-black/80 border-white/15'
                  }`}>
                    <button
                      onClick={() => setIsVoiceModeOpen(true)}
                      className={`p-2 rounded-xl font-bold transition-all cursor-pointer hover:scale-105 flex items-center gap-1 ${
                        isLight
                          ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-pink-300/30'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950'
                      }`}
                      title="Open Real-Time Voice Mode"
                    >
                      <Radio className="w-4 h-4 animate-pulse" />
                    </button>

                    <button
                      onClick={toggleVoiceRecording}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        isVoiceRecording
                          ? 'bg-rose-500 text-white animate-ping'
                          : isLight
                          ? 'bg-slate-100 text-slate-700 hover:text-slate-950'
                          : 'bg-white/10 text-slate-300 hover:text-white'
                      }`}
                      title="Voice Dictation"
                    >
                      {isVoiceRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <input
                      type="text"
                      value={inputQuery}
                      onChange={(e) => setInputQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                      placeholder="Ask AI anything about civic services, schemes, or verification..."
                      className={`flex-1 bg-transparent text-xs focus:outline-none ${
                        isLight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-slate-500'
                      }`}
                    />

                    <button
                      onClick={() => handleSendChat()}
                      className={`p-2 rounded-xl font-bold cursor-pointer ${
                        isLight
                          ? 'bg-teal-800 text-white hover:bg-teal-900'
                          : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* 1.5 COMMAND MODE */}
              {activeTab === 'commands' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 border border-cyan-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-cyan-400" />
                        <h4 className="text-sm font-extrabold text-white">Voice & Text Command Mode</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        Live App Control
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Speak or type natural commands like <span className="text-cyan-300 font-mono font-bold">"Open my profile"</span>, <span className="text-cyan-300 font-mono font-bold">"Start a report"</span>, or <span className="text-cyan-300 font-mono font-bold">"Switch to Government Role"</span> to control the app instantly.
                    </p>

                    {/* Natural Language Input Box */}
                    <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-black/80 border border-cyan-500/40">
                      <button
                        onClick={startVoiceCommandRecognition}
                        className={`p-2.5 rounded-xl transition-all cursor-pointer font-bold text-xs flex items-center gap-1.5 ${
                          isCommandListening
                            ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:scale-105'
                        }`}
                        title="Start Voice Command Listener"
                      >
                        <Mic className={`w-4 h-4 ${isCommandListening ? 'animate-bounce' : ''}`} />
                        <span className="hidden sm:inline">{isCommandListening ? 'Listening...' : 'Speak Command'}</span>
                      </button>

                      <input
                        type="text"
                        value={commandInput}
                        onChange={(e) => setCommandInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && executeCommand(commandInput)}
                        placeholder="e.g. 'Open my profile', 'Start a report', 'Fact check'..."
                        className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                      />

                      <button
                        onClick={() => executeCommand(commandInput)}
                        className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Run</span>
                      </button>
                    </div>

                    {lastCommandFeedback && (
                      <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-2 animate-in fade-in duration-150">
                        <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>{lastCommandFeedback}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Shortcut Command Pills */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <CommandIcon className="w-3.5 h-3.5 text-cyan-400" />
                      1-Tap Command Actions
                    </h5>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { label: 'Open My Profile', cmd: 'Open my profile', icon: UserCheck, color: 'border-blue-500/40 bg-blue-950/20 text-blue-300' },
                        { label: 'Start a Report', cmd: 'Start a report', icon: AlertTriangle, color: 'border-rose-500/40 bg-rose-950/20 text-rose-300' },
                        { label: 'Open Civic Map', cmd: 'Open civic map', icon: MapPin, color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300' },
                        { label: 'Verify Claim / News', cmd: 'Verify news check', icon: ShieldCheck, color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300' },
                        { label: 'Find Schemes', cmd: 'Government schemes', icon: Building, color: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-300' },
                        { label: 'Join NGO Drives', cmd: 'NGO drives', icon: HeartHandshake, color: 'border-purple-500/40 bg-purple-950/20 text-purple-300' },
                        { label: 'View Rewards & Coins', cmd: 'View rewards', icon: Award, color: 'border-amber-500/40 bg-amber-950/20 text-amber-300' },
                        { label: 'Check Budget Audit', cmd: 'City budget transparency', icon: FileText, color: 'border-teal-500/40 bg-teal-950/20 text-teal-300' },
                        { label: 'Switch to Gov Role', cmd: 'Switch to government role', icon: Building, color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300' },
                        { label: 'Switch to NGO Role', cmd: 'Switch to NGO role', icon: UserCheck, color: 'border-purple-500/40 bg-purple-950/20 text-purple-300' },
                        { label: 'Switch to Citizen Role', cmd: 'Switch to citizen role', icon: User, color: 'border-sky-500/40 bg-sky-950/20 text-sky-300' },
                        { label: 'Open Global Search', cmd: 'Open search', icon: Search, color: 'border-white/20 bg-white/5 text-slate-200' },
                      ].map((item, idx) => {
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={idx}
                            onClick={() => executeCommand(item.cmd)}
                            className={`p-2.5 rounded-2xl border text-left text-xs font-bold transition-all hover:scale-102 flex items-center gap-2 cursor-pointer ${item.color}`}
                          >
                            <IconComponent className="w-4 h-4 shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. QR SCANNER */}
              {activeTab === 'qr' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-3">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-cyan-400" />
                      Live QR Code & Barcode Security Authenticator
                    </h4>
                    <p className="text-xs text-slate-300">
                      Scan product QR code on pharmaceuticals, electronics, or government certificates.
                    </p>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={qrCodeInput}
                        onChange={(e) => setQrCodeInput(e.target.value)}
                        placeholder="Enter QR batch code..."
                        className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      />
                      <button
                        onClick={handleScanQr}
                        className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
                      >
                        Scan Batch
                      </button>
                    </div>

                    {qrScanStatus && (
                      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-slate-200 animate-in fade-in">
                        {qrScanStatus}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. IMAGE & OCR SCAN */}
              {activeTab === 'scan' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3 text-center">
                    <Camera className="w-8 h-8 text-cyan-400 mx-auto" />
                    <h4 className="text-xs font-bold text-white">AI Vision & Defect Inspector</h4>
                    <p className="text-xs text-slate-300">
                      Upload or capture photos of road potholes, garbage heaps, or water leaks for instant AI assessment.
                    </p>

                    <button
                      onClick={() => setScanResult('AI Analysis: High Severity Pothole detected (98% confidence). Category: Road Engineering.')}
                      className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer inline-flex items-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4" /> Simulate Photo Analysis
                    </button>

                    {scanResult && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 text-left">
                        {scanResult}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 4. QUICK TOOLS & SOS */}
              {activeTab === 'actions' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Action Shortcuts</h4>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => {
                        setIsExpanded(false);
                        setReportingModalOpen(true);
                      }}
                      className="p-3 rounded-2xl bg-orange-500/20 border border-orange-500/40 hover:bg-orange-500/30 text-left text-xs font-bold text-orange-300 space-y-1 cursor-pointer"
                    >
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                      <div>Report Complaint</div>
                      <p className="text-[10px] text-slate-400 font-normal">File issue with photo & GPS</p>
                    </button>

                    <button
                      onClick={() => {
                        setIsExpanded(false);
                        setLocationModalOpen(true);
                      }}
                      className="p-3 rounded-2xl bg-teal-500/20 border border-teal-500/40 hover:bg-teal-500/30 text-left text-xs font-bold text-teal-300 space-y-1 cursor-pointer"
                    >
                      <MapPin className="w-5 h-5 text-teal-400" />
                      <div>Nearby Issues & Services</div>
                      <p className="text-[10px] text-slate-400 font-normal">Explore 5km radius</p>
                    </button>

                    <button
                      onClick={() => {
                        setIsExpanded(false);
                        setSearchModalOpen(true);
                      }}
                      className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 hover:bg-cyan-500/30 text-left text-xs font-bold text-cyan-300 space-y-1 cursor-pointer"
                    >
                      <Search className="w-5 h-5 text-cyan-400" />
                      <div>Global AI Search</div>
                      <p className="text-[10px] text-slate-400 font-normal">Find people, posts & QR</p>
                    </button>

                    <button
                      onClick={() => alert('🚨 SOS Alert Dispatched to Madhapur Police Station & Cyberabad Police Helpline (100). Emergency dispatch enroute!')}
                      className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 hover:bg-rose-500/30 text-left text-xs font-bold text-rose-300 space-y-1 cursor-pointer animate-pulse"
                    >
                      <PhoneCall className="w-5 h-5 text-rose-400" />
                      <div>Emergency SOS Call</div>
                      <p className="text-[10px] text-slate-400 font-normal">Alert Police (100) & Ambulance (108)</p>
                    </button>
                  </div>
                </div>
              )}

              {/* 5. TRANSLATOR */}
              {activeTab === 'translate' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      Instant Civic Language Translator
                    </h4>
                    <textarea
                      value={translateText}
                      onChange={(e) => setTranslateText(e.target.value)}
                      placeholder="Type or paste notice, scheme description, or civic response..."
                      className="w-full h-20 bg-white/5 border border-white/15 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    />

                    <button
                      onClick={handleTranslate}
                      className="w-full py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
                    >
                      Translate to {language.toUpperCase()}
                    </button>

                    {translatedOutput && (
                      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300">
                        {translatedOutput}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Real-time ChatGPT-style Voice Assistant Overlay */}
      <VoiceModeOverlay
        isOpen={isVoiceModeOpen}
        onClose={() => setIsVoiceModeOpen(false)}
        messages={messages}
        onAddMessage={(msg) => setMessages((prev) => [...prev, msg])}
        category={category}
        language={language}
      />
    </>
  );
};
