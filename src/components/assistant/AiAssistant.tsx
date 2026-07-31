/**
 * Krithiq AI - AI Super Assistant Module
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { askAiAssistant, generateTtsAudio } from '../../services/api';
import { ChatMessage, AssistantCategory } from '../../types';
import { VoiceModeOverlay } from './VoiceModeOverlay';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  FileText,
  Volume2,
  Sparkles,
  Globe,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  HelpCircle,
  FilePlus,
  HeartHandshake,
  AlertOctagon,
  Radio,
} from 'lucide-react';

export const AiAssistant: React.FC = () => {
  const { language, setLanguage, accessibility, theme } = useApp();
  const isLight = theme === 'light';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'assistant',
      text: `Hi, I'm Krithiq AI. I'm your AI assistant. I can help you report civic issues, verify information, discover government schemes, answer questions about public services, and guide you through government processes.`,
      timestamp: 'Just now',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [activeCategory, setActiveCategory] = useState<AssistantCategory>('general');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Gemini Model & Grounding Intelligence Options
  const [useSearchGrounding, setUseSearchGrounding] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.6-flash');

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categoryPresets = [
    { id: 'general', label: 'All Guidance', icon: Sparkles, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { id: 'civic_guidance', label: 'Civic Rights', icon: HelpCircle, color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
    { id: 'govt_schemes', label: 'Govt Schemes', icon: FileText, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { id: 'complaint_drafter', label: 'Draft Complaint', icon: FilePlus, color: 'text-violet-400 bg-violet-500/10 border-violet-500/30' },
    { id: 'elderly_support', label: 'Elderly Mode', icon: HeartHandshake, color: 'text-pink-400 bg-pink-500/10 border-pink-500/30' },
    { id: 'emergency_help', label: 'Emergency Help', icon: AlertOctagon, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  ];

  const handleSend = async (overridePrompt?: string) => {
    const promptToSend = overridePrompt || inputText;
    if (!promptToSend.trim() && !selectedImage && !documentText) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: selectedImage ? [{ type: 'image', url: selectedImage }] : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-10).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await askAiAssistant(
        promptToSend,
        activeCategory,
        language,
        selectedImage || undefined,
        documentText || undefined,
        historyPayload,
        useSearchGrounding,
        selectedModel
      );

      const botMsgId = `bot_${Date.now()}`;
      const botMsg: ChatMessage = {
        id: botMsgId,
        sender: 'assistant',
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Auto-read audio if elderly mode or autoRead is enabled
      if (accessibility.autoReadAIAnswers || accessibility.elderlyMode) {
        handlePlayTts(botMsgId, res.text);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setSelectedImage(null);
      setDocumentText(null);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const handlePlayTts = async (msgId: string, text: string) => {
    setPlayingAudioId(msgId);
    try {
      // Strip markdown stars for speech
      const cleanText = text.replace(/[*#_`~]/g, '').replace(/https?:\/\/\S+/g, 'link');
      const audioBase64 = await generateTtsAudio(cleanText.slice(0, 300), 'Kore');
      if (audioBase64) {
        const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
        audio.play();
        audio.onended = () => setPlayingAudioId(null);
      } else {
        // Fallback to browser Speech Synthesis with correct BCP-47 language tag
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 300));
        utterance.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : 'en-US';
        utterance.rate = language === 'te' ? 0.95 : 1.0;
        
        const voices = synth.getVoices();
        const targetVoice = voices.find(v => v.lang.startsWith(language) || v.lang.includes('te'));
        if (targetVoice) utterance.voice = targetVoice;

        synth.speak(utterance);
        utterance.onend = () => setPlayingAudioId(null);
        utterance.onerror = () => setPlayingAudioId(null);
      }
    } catch (err) {
      setPlayingAudioId(null);
    }
  };

  const handleMicToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser. Try typing your query.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setSelectedImage(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-24 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className={`p-5 rounded-3xl border shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isLight
          ? 'bg-white border-gray-200 text-gray-900 shadow-2xs'
          : 'bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border-cyan-500/30 text-white shadow-2xl'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`p-3 rounded-2xl border ${
            isLight ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
          }`}>
            <Bot className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h2 className={`text-xl font-extrabold flex items-center gap-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
              Krithiq AI Chatbot
              <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold border ${
                isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              }`}>
                Gemini Intelligence
              </span>
            </h2>
            <p className={`text-xs ${isLight ? 'text-gray-600' : 'text-slate-300'}`}>
              Multi-turn reasoning, Search Grounding, Scheme Eligibility & Complaint Drafter.
            </p>
          </div>
        </div>

        {/* Intelligence Controls & Quick Toggles */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Model Selector */}
          <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-2xl border text-xs font-bold ${
            isLight ? 'bg-gray-50 border-gray-200' : 'bg-black/60 border-white/10'
          }`}>
            <span className={`text-[10px] uppercase font-mono font-bold ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={`bg-transparent text-xs font-extrabold focus:outline-none cursor-pointer ${
                isLight ? 'text-blue-900' : 'text-cyan-300'
              }`}
            >
              <option value="gemini-3.6-flash" className={isLight ? 'bg-white text-gray-900' : 'bg-slate-900 text-white'}>Gemini 3.6 Flash (Default)</option>
              <option value="gemini-3.1-pro-preview" className={isLight ? 'bg-white text-gray-900' : 'bg-slate-900 text-white'}>Gemini 3.1 Pro (Deep Logic)</option>
              <option value="gemini-3.1-flash-lite" className={isLight ? 'bg-white text-gray-900' : 'bg-slate-900 text-white'}>Gemini 3.1 Flash-Lite (Fast)</option>
            </select>
          </div>

          {/* Search Grounding Toggle */}
          <button
            onClick={() => setUseSearchGrounding(!useSearchGrounding)}
            className={`px-3 py-1.5 rounded-2xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              useSearchGrounding
                ? isLight
                  ? 'bg-blue-800 text-white border-blue-900 shadow-2xs'
                  : 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/25'
                : isLight
                  ? 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Toggle Google Search Grounding for live web data"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Search Grounding</span>
          </button>

          {/* Voice Mode Overlay Trigger */}
          <button
            onClick={() => setIsVoiceModeOpen(true)}
            className={`px-3.5 py-1.5 rounded-2xl font-black text-xs shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer ${
              isLight
                ? 'bg-blue-800 text-white shadow-2xs'
                : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-400 text-slate-950'
            }`}
            title="Start ChatGPT Voice Mode"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Voice Assistant</span>
          </button>
        </div>
      </div>

      {/* Category Shortcuts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categoryPresets.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? isLight
                    ? 'bg-blue-50 border-blue-600 text-blue-950 font-extrabold shadow-2xs'
                    : cat.color + ' shadow-lg scale-105'
                  : isLight
                    ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Chat Conversation Box */}
      <div className={`p-4 rounded-3xl border shadow-xl min-h-[440px] max-h-[580px] flex flex-col ${
        isLight
          ? 'bg-white border-gray-200 text-gray-900 shadow-2xs'
          : 'bg-slate-950/80 border-white/10 backdrop-blur-2xl shadow-2xl text-white'
      }`}>
        
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  m.sender === 'user'
                    ? isLight
                      ? 'bg-blue-800 text-white font-black'
                      : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-black'
                    : isLight
                      ? 'bg-blue-50 border border-blue-200 text-blue-900'
                      : 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                }`}
              >
                {m.sender === 'user' ? 'You' : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? isLight
                      ? 'bg-blue-800 text-white rounded-tr-none shadow-2xs'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-lg'
                    : isLight
                      ? 'bg-gray-50 border border-gray-200 text-gray-900 rounded-tl-none'
                      : 'bg-white/10 border border-white/10 text-slate-100 rounded-tl-none backdrop-blur-xl'
                }`}
              >
                {m.attachments?.map((att, i) => (
                  <div key={i} className="mb-2">
                    <img src={att.url} className="max-h-48 rounded-xl object-cover border border-gray-200" />
                  </div>
                ))}

                <div className="whitespace-pre-wrap">{m.text}</div>

                <div className={`mt-2 pt-2 border-t flex items-center justify-between gap-2 text-[10px] ${
                  isLight ? 'border-gray-200 text-gray-500' : 'border-white/10 text-slate-400'
                }`}>
                  <span>{m.timestamp}</span>
                  {m.sender === 'assistant' && (
                    <button
                      onClick={() => handlePlayTts(m.id, m.text)}
                      className={`hover:underline flex items-center gap-1 font-bold cursor-pointer ${
                        isLight ? 'text-blue-800' : 'text-cyan-400'
                      }`}
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${playingAudioId === m.id ? 'animate-bounce text-amber-500' : ''}`} />
                      {playingAudioId === m.id ? 'Playing...' : 'Speak Audio'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className={`flex items-center gap-3 text-xs font-bold p-3 rounded-2xl border w-fit animate-pulse ${
              isLight ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
            }`}>
              <Loader2 className="w-4 h-4 animate-spin" />
              Krithiq AI is reasoning with Gemini intelligence...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Selected Image/Document Preview */}
        {selectedImage && (
          <div className={`mt-2 p-2 rounded-2xl border flex items-center justify-between gap-2 ${
            isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/10 border-white/10'
          }`}>
            <div className="flex items-center gap-2">
              <img src={selectedImage} className="w-10 h-10 rounded-lg object-cover" />
              <span className={`text-xs font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>Image Attached for AI Analysis</span>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="text-xs text-rose-600 hover:underline font-bold px-2 py-1"
            >
              Remove
            </button>
          </div>
        )}

        {/* Input Controls */}
        <div className={`mt-3 pt-3 border-t flex items-center gap-2 ${
          isLight ? 'border-gray-200' : 'border-white/10'
        }`}>
          
          {/* Media Attach Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isLight
                ? 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="Attach Image or Document photo"
          >
            <ImageIcon className={`w-4 h-4 ${isLight ? 'text-blue-800' : 'text-cyan-400'}`} />
          </button>

          {/* Microphone Voice Button */}
          <button
            onClick={handleMicToggle}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isRecording
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-600 animate-pulse'
                : isLight
                  ? 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="Voice Mic Input"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className={`w-4 h-4 ${isLight ? 'text-blue-800' : 'text-cyan-400'}`} />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              isRecording
                ? 'Listening to your voice...'
                : 'Ask AI Assistant (e.g. "Draft complaint for broken drainage", "Check PM Awas eligibility")...'
            }
            className={`flex-1 px-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none transition-colors ${
              isLight
                ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-600'
                : 'bg-black/60 border-white/10 text-white focus:border-cyan-500'
            }`}
          />

          {/* Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={isLoading}
            className={`p-2.5 rounded-xl font-black shadow-md hover:scale-105 transition-all cursor-pointer disabled:opacity-50 ${
              isLight
                ? 'bg-blue-800 text-white'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-cyan-500/25'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Suggested Quick Prompts */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suggested Instant Prompts:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            'Draft official municipal complaint for hazardous road pothole',
            'Check eligible farmer schemes under State Agriculture Grant 2026',
            'How to verify if a pharmaceutical medicine batch is genuine?',
            'What are my legal rights during an unannounced power outage?',
          ].map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(promptText)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-left text-xs text-slate-300 hover:text-cyan-300 hover:bg-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
            >
              • {promptText}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time ChatGPT-style Voice Mode Assistant Overlay */}
      <VoiceModeOverlay
        isOpen={isVoiceModeOpen}
        onClose={() => setIsVoiceModeOpen(false)}
        messages={messages}
        onAddMessage={(msg) => setMessages((prev) => [...prev, msg])}
        category={activeCategory}
        language={language}
      />
    </div>
  );
};
