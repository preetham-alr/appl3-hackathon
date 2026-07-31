/**
 * Krithiq AI - SYNKS Short Video & Civic Content Platform
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Tv,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Sparkles,
  ShieldCheck,
  Globe,
  Volume2,
  VolumeX,
  ChevronDown,
  ArrowLeft,
  Home,
  Plus,
  Compass,
  Users,
  Video,
  MapPin,
  User as UserIcon,
} from 'lucide-react';
import { Reel } from '../../types';

interface SingleSynkCardProps {
  synk: Reel;
  index: number;
  total: number;
  selectedCaptionLang: 'en' | 'te' | 'hi';
  isMuted: boolean;
  toggleMute: () => void;
  toggleLikeSynk: (id: string) => void;
  toggleSaveSynk: (id: string) => void;
  toggleFollowCreator: (id: string) => void;
  openCreatorProfile: (id: string) => void;
}

const SingleSynkCard: React.FC<SingleSynkCardProps> = ({
  synk,
  index,
  total,
  selectedCaptionLang,
  isMuted,
  toggleMute,
  toggleLikeSynk,
  toggleSaveSynk,
  toggleFollowCreator,
  openCreatorProfile,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          } else {
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const getSubtitle = () => {
    if (selectedCaptionLang === 'te' && synk.aiCaptionsTe) return synk.aiCaptionsTe;
    if (selectedCaptionLang === 'hi') return synk.aiCaptionsTe || synk.aiCaptionsEn;
    return synk.aiCaptionsEn || synk.caption;
  };

  return (
    <div className="relative h-[calc(100vh-125px)] min-h-[560px] max-h-[820px] w-full max-w-[440px] mx-auto rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black flex flex-col justify-between p-4 snap-start shrink-0 mb-4 my-auto">
      {/* HTML5 Video Player */}
      <video
        ref={videoRef}
        src={synk.videoUrl}
        poster={synk.thumbnailUrl}
        loop
        muted={isMuted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 cursor-pointer"
        onClick={() => {
          if (videoRef.current) {
            if (videoRef.current.paused) {
              videoRef.current.play();
              setIsPlaying(true);
            } else {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        }}
      />

      {/* Video Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none z-10" />

      {/* Top Controls Overlay inside Card */}
      <div className="relative z-20 flex items-center justify-between">
        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-bold text-emerald-300 flex items-center gap-1.5 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          {synk.safetyRating || 'Verified Safe'}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/80 font-mono font-bold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
            {index + 1} / {total}
          </span>
          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white cursor-pointer hover:bg-black/80 transition-all shadow-sm"
            title={isMuted ? 'Unmute sound' : 'Mute sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Right Action Side Panel */}
      <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center space-y-3.5">
        {/* Like */}
        <button
          onClick={() => toggleLikeSynk(synk.id)}
          className="flex flex-col items-center gap-1 cursor-pointer group"
        >
          <div
            className={`p-3 rounded-full backdrop-blur-md border transition-all duration-200 group-hover:scale-110 shadow-lg ${
              synk.isLiked ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-600/40' : 'bg-black/60 border-white/20 text-white hover:bg-black/80'
            }`}
          >
            <Heart className={`w-5 h-5 ${synk.isLiked ? 'fill-current' : ''}`} />
          </div>
          <span className="text-[10px] font-black text-white drop-shadow-md">{synk.likesCount}</span>
        </button>

        {/* Comments */}
        <button className="flex flex-col items-center gap-1 cursor-pointer group">
          <div className="p-3 rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-md group-hover:scale-110 transition-all shadow-lg hover:bg-black/80">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black text-white drop-shadow-md">{synk.commentsCount}</span>
        </button>

        {/* Save */}
        <button
          onClick={() => toggleSaveSynk(synk.id)}
          className="flex flex-col items-center gap-1 cursor-pointer group"
        >
          <div
            className={`p-3 rounded-full backdrop-blur-md border transition-all duration-200 group-hover:scale-110 shadow-lg ${
              synk.isSaved ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/40' : 'bg-black/60 border-white/20 text-white hover:bg-black/80'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${synk.isSaved ? 'fill-current' : ''}`} />
          </div>
          <span className="text-[10px] font-black text-white drop-shadow-md">Save</span>
        </button>

        {/* Share */}
        <button
          onClick={() => alert('SYNKS video link copied to clipboard!')}
          className="flex flex-col items-center gap-1 cursor-pointer group"
        >
          <div className="p-3 rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-md group-hover:scale-110 transition-all shadow-lg hover:bg-black/80">
            <Share2 className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black text-white drop-shadow-md">{synk.sharesCount}</span>
        </button>
      </div>

      {/* Bottom Metadata & AI Captions Overlay */}
      <div className="relative z-20 space-y-2 pr-14">
        {/* Creator Profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openCreatorProfile(synk.author?.handle || synk.author?.name || synk.creatorId || synk.id)}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <img src={synk.creatorAvatar || synk.author?.avatar} className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500 shadow-md" />
            <span className="text-xs font-extrabold text-white drop-shadow-md">{synk.creatorName || synk.author?.name}</span>
          </button>
          <button
            onClick={() => toggleFollowCreator(synk.creatorId)}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer shadow-sm ${
              synk.isFollowingCreator
                ? 'bg-white/20 text-slate-100 hover:bg-white/30'
                : 'bg-[#0F766E] text-white hover:bg-[#0D625C]'
            }`}
          >
            {synk.isFollowingCreator ? 'Following' : '+ Follow'}
          </button>
        </div>

        {/* Caption */}
        <p className="text-xs text-slate-100 font-medium line-clamp-2 drop-shadow-sm">{synk.caption}</p>

        {/* AI Real-time Subtitles / Captions */}
        <div className="p-2.5 rounded-2xl bg-black/75 border border-emerald-500/30 backdrop-blur-md text-xs space-y-1 shadow-lg">
          <div className="text-[9px] font-extrabold text-emerald-400 flex items-center gap-1 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-300" />
            AI Subtitles ({selectedCaptionLang.toUpperCase()})
          </div>
          <p className="text-[11px] text-slate-200 font-sans leading-snug">
            {getSubtitle()}
          </p>
        </div>

        {/* Scroll indicator for next synk */}
        {index < total - 1 && (
          <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-300/90 pt-0.5 animate-bounce">
            <span>Swipe up for next Synk</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        )}
      </div>
    </div>
  );
};

export const AiReels: React.FC = () => {
  const { reels, toggleLikeReel, toggleSaveReel, toggleFollowCreator, openCreatorProfile, theme, setCreatorStudioOpen, setActiveTab, setProfileModalOpen } = useApp();

  const [selectedCaptionLang, setSelectedCaptionLang] = useState<'en' | 'te' | 'hi'>('en');
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between overflow-hidden animate-in fade-in duration-300">
      {/* Full-Screen SYNKS Navigation Header */}
      <div className="shrink-0 p-2.5 sm:p-3.5 bg-slate-950/95 border-b border-white/10 backdrop-blur-xl flex items-center justify-between z-30 max-w-2xl mx-auto w-full px-4">
        
        {/* Navigation Back Buttons: Home & Community */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/15 hover:scale-105 active:scale-95"
            title="Return to Home Dashboard"
          >
            <Home className="w-4 h-4 text-cyan-400" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/15 hover:scale-105 active:scale-95"
            title="Go to Community Hub"
          >
            <Users className="w-4 h-4 text-pink-400" />
            <span>Community</span>
          </button>
        </div>

        {/* Language Switcher Badge */}
        <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-black/60 border border-white/15 text-[10px] font-bold">
          <Globe className="w-3.5 h-3.5 text-emerald-400 ml-1" />
          <button
            onClick={() => setSelectedCaptionLang('en')}
            className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
              selectedCaptionLang === 'en' ? 'bg-emerald-600 text-white font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setSelectedCaptionLang('te')}
            className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
              selectedCaptionLang === 'te' ? 'bg-emerald-600 text-white font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            TE
          </button>
          <button
            onClick={() => setSelectedCaptionLang('hi')}
            className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
              selectedCaptionLang === 'hi' ? 'bg-emerald-600 text-white font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            HI
          </button>
        </div>

        {/* Creator Studio Direct Button */}
        <button
          onClick={() => setCreatorStudioOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <Video className="w-4 h-4 fill-slate-950/20" />
          <span>Creator Studio</span>
        </button>

      </div>

      {/* Main Vertical Full Viewport Video Container */}
      <div className="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth no-scrollbar py-2 px-2 max-w-xl mx-auto w-full flex flex-col items-center justify-center">
        {reels.map((synk, idx) => (
          <SingleSynkCard
            key={synk.id}
            synk={synk}
            index={idx}
            total={reels.length}
            selectedCaptionLang={selectedCaptionLang}
            isMuted={isMuted}
            toggleMute={() => setIsMuted((m) => !m)}
            toggleLikeSynk={toggleLikeReel}
            toggleSaveSynk={toggleSaveReel}
            toggleFollowCreator={toggleFollowCreator}
            openCreatorProfile={openCreatorProfile}
          />
        ))}
      </div>

      {/* Minimal Full-Screen SYNKS Bottom Toolbar */}
      <div className="shrink-0 p-2 sm:p-3 bg-slate-950/95 border-t border-white/10 backdrop-blur-xl flex items-center justify-around z-30 max-w-2xl mx-auto w-full px-6">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer group"
        >
          <Home className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('community')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer group"
        >
          <Users className="w-5 h-5 group-hover:text-pink-400 transition-colors" />
          <span className="text-[10px] font-semibold">Community</span>
        </button>

        {/* Prominent Center Creator Studio Button */}
        <button
          onClick={() => setCreatorStudioOpen(true)}
          className="p-3.5 -mt-6 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-400 hover:brightness-110 text-slate-950 shadow-xl shadow-cyan-500/30 border border-cyan-300 transition-all hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center gap-1 font-black"
          title="Open SYNKS Creator Studio"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer group"
        >
          <MapPin className="w-5 h-5 group-hover:text-emerald-400 transition-colors" />
          <span className="text-[10px] font-semibold">Civic Radar</span>
        </button>

        <button
          onClick={() => setProfileModalOpen(true)}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer group"
        >
          <UserIcon className="w-5 h-5 group-hover:text-amber-400 transition-colors" />
          <span className="text-[10px] font-semibold">Profile</span>
        </button>
      </div>
    </div>
  );
};



