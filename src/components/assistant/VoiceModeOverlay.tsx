/**
 * Krithiq AI - Real-Time ChatGPT-Style Voice Mode Assistant Overlay
 * Fully Audited & Calibrated for Telugu (te-IN) Speech Recognition & Voice Synthesis
 */

import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, AssistantCategory } from '../../types';
import { askAiAssistant, generateTtsAudio } from '../../services/api';
import { triggerHaptic } from '../../utils/haptics';
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  MessageSquare,
  Bot,
  Square,
  RefreshCw,
  Zap,
  Globe,
  Languages,
} from 'lucide-react';

interface VoiceModeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
  category?: AssistantCategory;
  language?: string;
}

type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'interrupted';

export const VoiceModeOverlay: React.FC<VoiceModeOverlayProps> = ({
  isOpen,
  onClose,
  messages,
  onAddMessage,
  category = 'general',
  language = 'te',
}) => {
  const [selectedLang, setSelectedLang] = useState<string>(language || 'te');
  const [voiceState, setVoiceStateState] = useState<VoiceState>('listening');
  const voiceStateRef = useRef<VoiceState>('listening');
  const setVoiceState = (newState: VoiceState) => {
    voiceStateRef.current = newState;
    setVoiceStateState(newState);
  };

  const [transcript, setTranscript] = useState('');
  const [lastAiResponse, setLastAiResponse] = useState<string>('');
  const [isMuted, setIsMuted] = useState(false);
  const [voiceVolume, setVoiceVolume] = useState<number>(0.5);

  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMounted = useRef<boolean>(true);

  // Sync prop language changes
  useEffect(() => {
    if (language) {
      setSelectedLang(language);
    }
  }, [language]);

  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
      stopAudioPlayback();
      stopRecognition();
    };
  }, []);

  // Audio Synth Cues for Start/Think/Reply/Interrupt
  const playSoundCue = (type: 'start' | 'think' | 'reply' | 'interrupt') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'start') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'think') {
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'reply') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'interrupt') {
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (e) {
      // AudioContext fallback ignored
    }
  };

  // Stop any active TTS audio
  const stopAudioPlayback = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Stop Speech Recognition
  const stopRecognition = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
  };

  // Start Voice Recognition Loop (Calibrated for Telugu te-IN)
  const startRecognition = () => {
    stopAudioPlayback();
    stopRecognition();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setTranscript(
        selectedLang === 'te'
          ? 'వెబ్ స్పీచ్ API లభ్యం కాలేదు. ప్రత్యక్ష సమాధానం పొందేందుకు కింద ఉన్న 1-ట్యాప్ నమూనా ప్రశ్నను నొక్కండి.'
          : 'Speech Recognition API unavailable. Tap a sample query below to test voice AI output.'
      );
      setVoiceState('listening');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      // Calibrate Exact BCP-47 Tag
      const bcpLang =
        selectedLang === 'te'
          ? 'te-IN'
          : selectedLang === 'hi'
          ? 'hi-IN'
          : selectedLang === 'ta'
          ? 'ta-IN'
          : 'en-US';
      
      recognition.lang = bcpLang;

      recognition.onstart = () => {
        if (!isComponentMounted.current) return;
        setVoiceState('listening');
        playSoundCue('start');
        triggerHaptic('listening');
      };

      recognition.onresult = (event: any) => {
        if (!isComponentMounted.current) return;

        // Interrupted by user speaking while AI is talking
        if (voiceState === 'speaking') {
          stopAudioPlayback();
          playSoundCue('interrupt');
          setVoiceState('listening');
        }

        let interimText = '';
        let finalSegment = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalSegment += res[0].transcript;
          } else {
            interimText += res[0].transcript;
          }
        }

        const currentText = (finalSegment || interimText).trim();
        setTranscript(currentText);

        setVoiceVolume(Math.min(1, Math.max(0.2, currentText.length / 40 + Math.random() * 0.4)));

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        if (currentText.length > 2) {
          // Telugu intonation silence window: 1.5s
          silenceTimerRef.current = setTimeout(() => {
            if (isComponentMounted.current && currentText.trim()) {
              handleSendSpeechPrompt(currentText);
            }
          }, 1500);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          // Soft prompt
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setTranscript(
            selectedLang === 'te'
              ? 'మైక్రోఫోన్ అనుమతి తిరస్కరించబడింది. దయచేసి కింద ఉన్న నమూనా ప్రశ్నను నొక్కండి.'
              : 'Microphone access blocked. Tap a sample prompt below to test AI Voice.'
          );
          setVoiceState('listening');
        }
      };

      recognition.onend = () => {
        if (isComponentMounted.current && voiceStateRef.current === 'listening' && !isMuted) {
          try {
            recognition.start();
          } catch (e) {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed starting speech recognition:', err);
      setVoiceState('idle');
    }
  };

  // Submit User Speech to Gemini & Read Response Aloud in Telugu
  const handleSendSpeechPrompt = async (promptText: string) => {
    if (!promptText.trim()) return;

    stopRecognition();
    stopAudioPlayback();
    setVoiceState('thinking');
    playSoundCue('think');

    const userMsg: ChatMessage = {
      id: `usr_voice_${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    onAddMessage(userMsg);

    try {
      const historyPayload = messages.slice(-10).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await askAiAssistant(
        promptText,
        category,
        selectedLang,
        undefined,
        undefined,
        historyPayload
      );

      const responseText = res.text || (selectedLang === 'te' ? 'మీ అభ్యర్థనను పరిశీలించాను.' : 'I have processed your request.');
      setLastAiResponse(responseText);

      const aiMsg: ChatMessage = {
        id: `bot_voice_${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onAddMessage(aiMsg);

      speakResponseAloud(responseText);
    } catch (err) {
      console.error('Voice Assistant Error:', err);
      const fallbackErrMsg =
        selectedLang === 'te'
          ? 'క్షమించండి, సర్వర్‌ను కనెక్ట్ చేయడంలో సమస్య ఏర్పడింది. దయచేసి మళ్లీ చెప్పండి.'
          : 'Sorry, I encountered an issue. Please try speaking again.';
      speakResponseAloud(fallbackErrMsg);
    }
  };

  // Speak AI Response with Calibrated Voice & BCP-47 Language Tag
  const speakResponseAloud = async (text: string) => {
    setVoiceState('speaking');
    playSoundCue('reply');

    // Strip markdown, URLs, and asterisks for smooth speech
    const speechText = text
      .replace(/[*#_`~]/g, '')
      .replace(/https?:\/\/\S+/g, 'లింక్')
      .slice(0, 450);

    try {
      // Try Gemini Server TTS API
      const base64Audio = await generateTtsAudio(speechText, 'Kore');

      if (base64Audio) {
        const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
        currentAudioRef.current = audio;

        audio.onplay = () => {
          if (isComponentMounted.current) setVoiceState('speaking');
        };

        audio.onended = () => {
          if (isComponentMounted.current) {
            setTranscript('');
            startRecognition();
          }
        };

        audio.onerror = () => {
          fallbackBrowserSpeech(speechText);
        };

        await audio.play();
        return;
      }
    } catch (e) {
      // Fallback below
    }

    fallbackBrowserSpeech(speechText);
  };

  const fallbackBrowserSpeech = (speechText: string) => {
    if (!('speechSynthesis' in window)) {
      setTimeout(() => {
        setTranscript('');
        startRecognition();
      }, 3000);
      return;
    }

    stopAudioPlayback();

    try {
      window.speechSynthesis.resume();
    } catch (e) {}

    const utterance = new SpeechSynthesisUtterance(speechText);
    const bcpLang =
      selectedLang === 'te'
        ? 'te-IN'
        : selectedLang === 'hi'
        ? 'hi-IN'
        : selectedLang === 'ta'
        ? 'ta-IN'
        : 'en-US';

    utterance.lang = bcpLang;
    utterance.rate = selectedLang === 'te' ? 0.95 : 1.0;
    utterance.pitch = 1.0;

    const assignVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const targetVoice =
        voices.find((v) => v.lang.startsWith(selectedLang) || v.lang === bcpLang) ||
        voices.find((v) => v.lang.startsWith('te')) ||
        voices.find((v) => v.lang.startsWith('hi')) ||
        voices.find((v) => v.lang.startsWith('en'));

      if (targetVoice) utterance.voice = targetVoice;

      utterance.onend = () => {
        if (isComponentMounted.current) {
          setTranscript('');
          startRecognition();
        }
      };

      utterance.onerror = () => {
        if (isComponentMounted.current) {
          setTranscript('');
          startRecognition();
        }
      };

      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        assignVoiceAndSpeak();
      };
      assignVoiceAndSpeak();
    } else {
      assignVoiceAndSpeak();
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      startRecognition();
    } else {
      setIsMuted(true);
      stopRecognition();
      stopAudioPlayback();
      setVoiceState('idle');
    }
  };

  const handleInterruptSpeaking = () => {
    stopAudioPlayback();
    playSoundCue('interrupt');
    setTranscript('');
    startRecognition();
  };

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setIsMuted(false);
      startRecognition();
    } else {
      stopAudioPlayback();
      stopRecognition();
    }
  }, [isOpen, selectedLang]);

  if (!isOpen) return null;

  const isTe = selectedLang === 'te';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-300 select-none overflow-hidden text-slate-100">
      
      {/* Top Bar Controls */}
      <div className="flex items-center justify-between w-full max-w-2xl mx-auto z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              {isTe ? 'Krithiq AI వాయిస్ మోడ్' : 'Krithiq Voice Mode'}
              <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {isTe ? 'ప్రత్యక్ష తెలుగు వాయిస్' : 'Live 2-Way Voice'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {isTe ? 'తెలుగు మాట్లాడి సమాధానాలు పొందండి' : 'Continuous AI Voice Conversation'}
            </p>
          </div>
        </div>

        {/* Language Selector Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center bg-white/10 border border-white/20 rounded-xl px-2 py-1">
            <Languages className="w-4 h-4 text-cyan-400 mr-1.5 shrink-0" />
            <select
              value={selectedLang}
              onChange={(e) => {
                setSelectedLang(e.target.value);
                triggerHaptic('light');
              }}
              className="bg-transparent text-xs font-extrabold text-cyan-300 focus:outline-none cursor-pointer"
            >
              <option value="te" className="bg-slate-900 text-white">🇮🇳 తెలుగు (te-IN)</option>
              <option value="en" className="bg-slate-900 text-white">🇬🇧 English (en-US)</option>
              <option value="hi" className="bg-slate-900 text-white">🇮🇳 हिन्दी (hi-IN)</option>
              <option value="ta" className="bg-slate-900 text-white">🇮🇳 தமிழ் (ta-IN)</option>
            </select>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10 transition-all cursor-pointer hover:scale-105"
            title="Exit Voice Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Interactive AI Voice Orb & Waveforms */}
      <div className="flex-1 flex flex-col items-center justify-center relative my-4 sm:my-6">
        
        {/* Dynamic Background Ambient Aura */}
        <div
          className={`absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-30 transition-all duration-700 pointer-events-none ${
            voiceState === 'listening'
              ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-400 scale-110 animate-pulse'
              : voiceState === 'thinking'
              ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 scale-100 animate-spin'
              : voiceState === 'speaking'
              ? 'bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400 scale-125'
              : 'bg-slate-800 scale-90'
          }`}
        />

        {/* Outer Pulsing Wave Rings */}
        <div className="relative flex items-center justify-center">
          {voiceState === 'listening' && (
            <>
              <div className="absolute w-60 h-60 sm:w-80 sm:h-80 rounded-full border border-cyan-500/30 animate-ping duration-1000" />
              <div className="absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-blue-500/40 animate-pulse" />
            </>
          )}

          {voiceState === 'speaking' && (
            <>
              <div className="absolute w-64 h-64 sm:w-84 sm:h-84 rounded-full border border-emerald-400/40 animate-ping duration-700" />
              <div className="absolute w-52 h-52 sm:w-68 sm:h-68 rounded-full border border-cyan-400/50 animate-pulse" />
            </>
          )}

          {/* Core Interactive AI Voice Sphere */}
          <button
            onClick={() => {
              if (voiceState === 'speaking') {
                handleInterruptSpeaking();
              } else if (voiceState === 'listening') {
                const isWarningText = transcript.startsWith('Microphone') || transcript.startsWith('Speech Recognition') || transcript.startsWith('వెబ్ స్పీచ్') || transcript.startsWith('మైక్రోఫోన్');
                const defaultQuery = isTe ? 'రోడ్డు గుంతపై అధికారిక ఫిర్యాదు ఎలా నమోదు చేయాలి?' : 'How do I submit a civic complaint for a road pothole?';
                const queryToSend = (!isWarningText && transcript.trim()) ? transcript.trim() : defaultQuery;
                handleSendSpeechPrompt(queryToSend);
              } else {
                startRecognition();
              }
            }}
            className={`w-32 h-32 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center gap-2 p-1 relative z-10 shadow-2xl transition-all duration-300 cursor-pointer active:scale-95 ${
              voiceState === 'listening'
                ? 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-400 shadow-cyan-500/50 ring-4 ring-cyan-400/30'
                : voiceState === 'thinking'
                ? 'bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-500 shadow-purple-500/50 ring-4 ring-purple-400/30 animate-pulse'
                : voiceState === 'speaking'
                ? 'bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 shadow-emerald-500/50 ring-4 ring-emerald-400/30'
                : 'bg-slate-800 border border-white/20'
            }`}
          >
            <div className="w-full h-full rounded-full bg-slate-950/80 backdrop-blur-xl flex flex-col items-center justify-center p-3 text-center">
              {voiceState === 'listening' && (
                <>
                  <Mic className="w-9 h-9 text-cyan-400 animate-bounce" />
                  <span className="text-xs font-extrabold text-cyan-300 mt-1">
                    {isTe ? 'మాట్లాడండి లేదా నొక్కండి' : 'Tap or Speak'}
                  </span>
                </>
              )}

              {voiceState === 'thinking' && (
                <>
                  <RefreshCw className="w-9 h-9 text-purple-400 animate-spin" />
                  <span className="text-xs font-extrabold text-purple-300 mt-1">
                    {isTe ? 'ఆలోచిస్తున్నాను...' : 'Processing...'}
                  </span>
                </>
              )}

              {voiceState === 'speaking' && (
                <>
                  <Volume2 className="w-9 h-9 text-emerald-400 animate-pulse" />
                  <span className="text-xs font-extrabold text-emerald-300 mt-1">
                    {isTe ? 'AI సమాధానం...' : 'AI Speaking'}
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {isTe ? 'ఆపడానికి నొక్కండి' : 'Tap to Interrupt'}
                  </span>
                </>
              )}

              {voiceState === 'idle' && (
                <>
                  <MicOff className="w-9 h-9 text-slate-400" />
                  <span className="text-xs font-extrabold text-slate-300 mt-1">
                    {isTe ? 'ఆపివేయబడింది' : 'Paused'}
                  </span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Live Audio Spectrum Bar Visualizer */}
        <div className="flex items-center justify-center gap-1.5 h-10 my-4 z-10">
          {[...Array(16)].map((_, idx) => {
            let height = 'h-2';
            if (voiceState === 'listening') {
              const activeHeights = ['h-4', 'h-8', 'h-10', 'h-6', 'h-12', 'h-7', 'h-5', 'h-9'];
              height = activeHeights[(idx + Math.floor(voiceVolume * 10)) % activeHeights.length];
            } else if (voiceState === 'speaking') {
              const speakHeights = ['h-6', 'h-10', 'h-12', 'h-8', 'h-11', 'h-5', 'h-9'];
              height = speakHeights[idx % speakHeights.length];
            } else if (voiceState === 'thinking') {
              height = 'h-3 animate-pulse';
            }
            return (
              <div
                key={idx}
                className={`w-1.5 rounded-full transition-all duration-150 ${height} ${
                  voiceState === 'listening'
                    ? 'bg-cyan-400'
                    : voiceState === 'speaking'
                    ? 'bg-emerald-400'
                    : voiceState === 'thinking'
                    ? 'bg-purple-400'
                    : 'bg-slate-700'
                }`}
              />
            );
          })}
        </div>

        {/* Live Speech Transcription Box */}
        <div className="w-full max-w-xl bg-slate-900/90 border border-white/10 rounded-2xl p-4 min-h-[85px] flex flex-col justify-center items-center text-center shadow-xl backdrop-blur-md z-10">
          {voiceState === 'listening' && (
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-cyan-400 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                {isTe ? 'ప్రత్యక్ష తెలుగు ట్రాన్స్‌క్రిప్షన్ (te-IN)' : 'Live Transcription (en-US)'}
              </span>
              <p className="text-sm font-medium text-slate-200">
                {transcript || (isTe ? "వింటున్నాను... దయచేసి బిగ్గరగా మాట్లాడండి" : "Listening to your voice... Speak anytime")}
              </p>
            </div>
          )}

          {voiceState === 'thinking' && (
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-purple-400 flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                {isTe ? 'జెమిని AI విశ్లేషణ' : 'Gemini Intelligence'}
              </span>
              <p className="text-sm font-medium text-purple-200">
                {isTe ? 'మీ మాటలను విశ్లేషించి తెలుగులో సమాధానం సిద్ధం చేస్తోంది...' : 'Analyzing speech & formulating response...'}
              </p>
            </div>
          )}

          {voiceState === 'speaking' && (
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-400 flex items-center justify-center gap-1">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                {isTe ? 'AI వాయిస్ సమాధానం' : 'AI Voice Response'}
              </span>
              <p className="text-sm font-medium text-slate-100 max-h-20 overflow-y-auto line-clamp-3">
                "{lastAiResponse}"
              </p>
            </div>
          )}

          {voiceState === 'idle' && (
            <p className="text-xs text-slate-400">
              {isTe ? 'మైక్రోఫోన్ ఆపివేయబడింది. మాట్లాడటానికి సెంటర్ ఆర్‌బ్‌ను నొక్కండి.' : 'Microphone paused. Tap the center orb or unmute to speak.'}
            </p>
          )}
        </div>

        {/* 1-Tap Quick Sample Telugu Voice Chips */}
        <div className="w-full max-w-xl mt-3 z-10">
          <div className="flex items-center gap-1.5 mb-1.5 justify-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>{isTe ? '1-ట్యాప్ తెలుగు నమూనా ప్రశ్నలు (వాయిస్ టెస్ట్):' : '1-Tap Sample Voice Queries:'}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {[
              {
                labelTe: '🛣️ రోడ్డు గుంతపై ఫిర్యాదు',
                labelEn: '🛣️ Report Road Pothole',
                queryTe: 'నా వీధిలో ఉన్న రోడ్డు గుంతపై అధికారిక ఫిర్యాదు ఎలా నమోదు చేయాలి?',
                queryEn: 'How to report a road pothole in my neighborhood?',
              },
              {
                labelTe: '🌾 పిఎం కిసాన్ వివరాలు',
                labelEn: '🌾 PM Kisan Scheme',
                queryTe: 'పిఎం కిసాన్ సమ్మాన్ నిధి పథకం అర్హత వివరాలు ఏమిటి?',
                queryEn: 'What are the eligibility details for PM Kisan Samman Nidhi?',
              },
              {
                labelTe: '💊 నకిలీ మందుల తనిఖీ',
                labelEn: '💊 Fake Medicine Check',
                queryTe: 'నకిలీ మందుల QR కోడ్‌ను ఎలా సరిచూసుకోవాలి?',
                queryEn: 'How to verify authenticity of medicine QR code?',
              },
              {
                labelTe: '💧 నీటి సరఫరా సమస్య',
                labelEn: '💧 Water Leakage Issue',
                queryTe: 'తాగునీటి సరఫరా లీకేజీ సమస్యను మున్సిపల్ అధికారులకు ఎలా నివేదించాలి?',
                queryEn: 'How to report mainline water supply leakage?',
              },
              {
                labelTe: '👵 వృద్ధుల పింఛను దరఖాస్తు',
                labelEn: '👵 Old Age Pension',
                queryTe: 'వృద్ధుల పింఛను దరఖాస్తుకు కావలసిన పత్రాలు ఏమిటి?',
                queryEn: 'What documents are needed for senior citizen pension application?',
              },
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const prompt = isTe ? chip.queryTe : chip.queryEn;
                  handleSendSpeechPrompt(prompt);
                  triggerHaptic('light');
                }}
                className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-[11px] font-semibold text-slate-200 hover:text-cyan-300 transition-all cursor-pointer whitespace-nowrap shadow-xs"
              >
                {isTe ? chip.labelTe : chip.labelEn}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Action Toolbar */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-center gap-3 z-10">
        
        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className={`px-4 py-2.5 rounded-2xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
            isMuted
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
              : 'bg-white/10 border-white/20 text-slate-200 hover:bg-white/20'
          }`}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-cyan-400" />}
          {isMuted ? (isTe ? 'అన్‌మ్యూట్ చేయి' : 'Unmute Mic') : (isTe ? 'మ్యూట్ చేయి' : 'Mute Mic')}
        </button>

        {/* Interrupt / Stop AI Speaking */}
        {voiceState === 'speaking' && (
          <button
            onClick={handleInterruptSpeaking}
            className="px-4 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-2 text-xs font-bold transition-all cursor-pointer hover:bg-amber-500/30"
          >
            <Square className="w-4 h-4 fill-amber-300" />
            {isTe ? 'ఆపివేయి' : 'Interrupt'}
          </button>
        )}

        {/* Switch to Text Chat */}
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 hover:brightness-110 transition-all cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          {isTe ? 'టెక్స్ట్ చాట్‌కు మారండి' : 'Switch to Text Chat'}
        </button>
      </div>

    </div>
  );
};
