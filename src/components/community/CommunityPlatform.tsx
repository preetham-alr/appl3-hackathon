/**
 * Krithiq AI - Community Platform (Reddit + LinkedIn + X inspired)
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CommunityPost } from '../../types';
import { AiReels } from '../reels/AiReels';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Plus,
  Send,
  Award,
  BarChart2,
  FileText,
  Tv,
  ArrowLeft,
  Home,
  Video,
  Wand2,
  Tag,
  AtSign,
  Sliders,
  Music,
  Film,
} from 'lucide-react';

export const CommunityPlatform: React.FC = () => {
  const {
    posts,
    votePost,
    addComment,
    votePollOption,
    groups,
    toggleGroupJoin,
    addPost,
    user,
    openCreatorProfile,
    savedPosts,
    toggleSavePost,
    theme,
    setActiveTab,
    goBack,
    setCreatorStudioOpen,
  } = useApp();

  const isLight = theme === 'light';

  const [mainTab, setMainTab] = useState<'posts' | 'synks'>('posts');
  const [activeFeed, setActiveFeed] = useState<'trending' | 'nearby' | 'local'>('trending');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [newPostText, setNewPostText] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showCreateBox, setShowCreateBox] = useState(false);

  const filteredPosts = posts.filter((p) => {
    if (selectedGroupId && p.groupId !== selectedGroupId) return false;
    return true;
  });

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorTitle: user.reputationLevel,
      isVerifiedExpert: true,
      groupName: groups[0]?.name || 'Ward Citizens Alliance',
      type: 'text',
      title: newPostTitle || 'Community Update & Discussion',
      content: newPostText,
      upvotesCount: 1,
      downvotesCount: 0,
      commentsCount: 0,
      comments: [],
      createdTimestamp: 'Just now',
      locationTag: user.locationName,
    };
    addPost(newPost);
    setNewPostText('');
    setNewPostTitle('');
    setShowCreateBox(false);
  };

  if (mainTab === 'synks') {
    return (
      <div className="max-w-4xl mx-auto space-y-4 pb-24 animate-in fade-in duration-300">
        {/* Dedicated Synks Top Header */}
        <div className={`p-4 rounded-2xl border shadow-md flex items-center justify-between gap-3 ${
          isLight
            ? 'bg-slate-100 border-slate-300 text-slate-900'
            : 'bg-slate-950/90 border-pink-500/30 text-white shadow-xl'
        }`}>
          {/* Back & Home Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMainTab('posts')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border ${
                isLight
                  ? 'bg-teal-700 text-white border-teal-800 hover:bg-teal-800 shadow-2xs'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-400 shadow-md hover:scale-105'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Community</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                  : 'bg-slate-900 border-white/20 text-slate-200 hover:bg-slate-800'
              }`}
              title="Return to Home Dashboard"
            >
              <Home className={`w-4 h-4 ${isLight ? 'text-teal-800' : 'text-cyan-400'}`} />
              <span className="hidden sm:inline">Home</span>
            </button>
          </div>

          {/* Title Badge & Creator Studio Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCreatorStudioOpen(true)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer ${
                isLight
                  ? 'bg-teal-800 text-white hover:bg-teal-900 shadow-2xs'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-pink-500/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Creator Studio</span>
            </button>

            <div className="flex items-center gap-2">
              <Tv className={`w-5 h-5 ${isLight ? 'text-teal-800' : 'text-pink-400 animate-bounce'}`} />
              <div>
                <h3 className={`text-sm sm:text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>SYNKS</h3>
                <p className={`text-[10px] font-bold ${isLight ? 'text-teal-900' : 'text-pink-300'}`}>Short Civic Synks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reels Viewer */}
        <AiReels />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isLight
          ? 'bg-gradient-to-r from-slate-100 via-teal-50/60 to-slate-100 border-slate-300 text-slate-900 shadow-2xs'
          : 'bg-gradient-to-r from-slate-900 via-violet-950/40 to-slate-900 border border-violet-500/30 shadow-2xl'
      }`}>
        <div>
          <h2 className={`text-2xl font-extrabold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Krithiq AI Citizen Community & Groups
            <span className={`px-2.5 py-0.5 text-xs rounded-full font-bold border ${
              isLight ? 'bg-teal-100 text-teal-950 border-teal-300' : 'bg-violet-500/20 text-violet-300 border-violet-500/30'
            }`}>
              AI Moderated
            </span>
          </h2>
          <p className={`text-xs mt-1 font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Connect with verified neighbors, ask Q&A, vote on polls, share civic solutions, and watch short SYNKS video updates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCreatorStudioOpen(true)}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs shadow-md hover:scale-105 transition-all flex items-center gap-2 cursor-pointer ${
              isLight
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:from-pink-700 hover:to-rose-700 shadow-pink-600/20'
                : 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-pink-500/30'
            }`}
          >
            <Video className="w-4 h-4 fill-white/20" />
            <span>Create SYNKS Video</span>
          </button>

          <button
            onClick={() => {
              setMainTab('posts');
              setShowCreateBox(!showCreateBox);
            }}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs shadow-md hover:scale-105 transition-all flex items-center gap-2 cursor-pointer ${
              isLight
                ? 'bg-teal-800 text-white hover:bg-teal-900 shadow-2xs'
                : 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-white/10'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>New Post / Poll</span>
          </button>
        </div>
      </div>

      {/* Creator Studio Highlights Suite Bar */}
      <div className={`p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 ${
        isLight
          ? 'bg-slate-50 border-teal-200/80 text-slate-900'
          : 'bg-slate-900/80 border-pink-500/20 text-slate-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl shadow-inner ${
            isLight ? 'bg-teal-100 text-teal-800' : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
          }`}>
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black flex items-center gap-2">
              SYNKS Creator Studio Suite
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30">
                AI Powered
              </span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
              Filters • Video Trimmer • Taglines & Hashtags • Tag People & Officials • AI Audio
            </p>
          </div>
        </div>

        {/* Feature Badges & Direct Launch */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCreatorStudioOpen(true)}
            className="px-2.5 py-1 rounded-xl text-[10px] font-bold border border-teal-500/30 bg-teal-500/10 text-teal-300 flex items-center gap-1 hover:bg-teal-500/20 transition-all cursor-pointer"
          >
            <Wand2 className="w-3 h-3 text-cyan-400" />
            <span>AI Filters</span>
          </button>

          <button
            onClick={() => setCreatorStudioOpen(true)}
            className="px-2.5 py-1 rounded-xl text-[10px] font-bold border border-pink-500/30 bg-pink-500/10 text-pink-300 flex items-center gap-1 hover:bg-pink-500/20 transition-all cursor-pointer"
          >
            <Sliders className="w-3 h-3 text-pink-400" />
            <span>Video Edit</span>
          </button>

          <button
            onClick={() => setCreatorStudioOpen(true)}
            className="px-2.5 py-1 rounded-xl text-[10px] font-bold border border-amber-500/30 bg-amber-500/10 text-amber-300 flex items-center gap-1 hover:bg-amber-500/20 transition-all cursor-pointer"
          >
            <Tag className="w-3 h-3 text-amber-400" />
            <span>Taglines</span>
          </button>

          <button
            onClick={() => setCreatorStudioOpen(true)}
            className="px-2.5 py-1 rounded-xl text-[10px] font-bold border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 flex items-center gap-1 hover:bg-indigo-500/20 transition-all cursor-pointer"
          >
            <AtSign className="w-3 h-3 text-indigo-400" />
            <span>Tag People</span>
          </button>

          <button
            onClick={() => setCreatorStudioOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 hover:scale-105 transition-all shadow-md cursor-pointer flex items-center gap-1 ml-1"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950/20" />
            <span>Launch Studio</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Switcher: Posts vs SYNKS */}
      <div className={`flex items-center gap-3 p-1.5 rounded-2xl border ${
        isLight ? 'bg-slate-200/80 border-slate-300' : 'bg-black/60 border-white/10'
      }`}>
        <button
          onClick={() => setMainTab('posts')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mainTab === 'posts'
              ? isLight ? 'bg-white text-teal-950 border border-teal-400 shadow-2xs' : 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/25 scale-[1.01]'
              : isLight ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className={`w-4 h-4 ${isLight ? 'text-teal-800' : 'text-violet-300'}`} />
          <span>Posts & Discussions</span>
        </button>

        <button
          onClick={() => setMainTab('synks')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mainTab === 'synks'
              ? isLight ? 'bg-teal-800 text-white border border-teal-900 shadow-2xs' : 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-lg shadow-pink-500/25 scale-[1.01]'
              : isLight ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Tv className={`w-4 h-4 ${isLight ? 'text-teal-200' : 'text-amber-200 animate-pulse'}`} />
          <div className="text-left leading-tight">
            <span className="block font-black tracking-wider">SYNKS</span>
            <span className={`block text-[10px] font-medium hidden sm:block ${isLight ? 'text-[#0F766E]' : 'text-emerald-400'}`}>Short-Form Civic Content</span>
          </div>
        </button>
      </div>

      {mainTab === 'synks' ? (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className={`p-5 rounded-3xl border text-center space-y-3 shadow-md relative overflow-hidden ${
            isLight
              ? 'bg-gradient-to-r from-teal-50 via-slate-50 to-emerald-50 border-teal-200/80 text-slate-900'
              : 'bg-gradient-to-r from-slate-950 via-teal-950/40 to-slate-950 border-teal-500/30 text-white shadow-xl'
          }`}>
            <h3 className={`text-lg font-black flex items-center justify-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Tv className={`w-5 h-5 animate-bounce ${isLight ? 'text-[#0F766E]' : 'text-emerald-400'}`} />
              SYNKS Short Civic Videos & Creator Studio
            </h3>
            <p className={`text-xs font-medium tracking-wide ${isLight ? 'text-[#0F766E]' : 'text-emerald-400'}`}>
              "Stay in sync with your city • Create & Publish with AI Tools"
            </p>
            <p className={`text-[11px] max-w-lg mx-auto leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Record or upload videos, apply AI filters, trim clips, add taglines, tag citizens & officials (@mentions), overlay AI music, and pass Gemini safety audit before posting.
            </p>

            {/* Creator Tools Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                onClick={() => setCreatorStudioOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-teal-500/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Filters & Aspect Crop</span>
              </button>

              <button
                onClick={() => setCreatorStudioOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-pink-500/30 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-pink-400" />
                <span>Video Trimmer</span>
              </button>

              <button
                onClick={() => setCreatorStudioOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Taglines & Hashtags</span>
              </button>

              <button
                onClick={() => setCreatorStudioOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <AtSign className="w-3.5 h-3.5 text-indigo-400" />
                <span>Tag People (@Mentions)</span>
              </button>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setCreatorStudioOpen(true)}
                className={`px-6 py-2.5 rounded-2xl text-xs font-black shadow-lg hover:scale-105 transition-all flex items-center gap-2 cursor-pointer ${
                  isLight
                    ? 'bg-[#0F766E] text-white hover:bg-[#0D625C] shadow-teal-700/20'
                    : 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-pink-500/30'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300/30 animate-pulse" />
                <span>Open Creator Studio & Create SYNKS</span>
              </button>
            </div>
          </div>

          <AiReels />
        </div>
      ) : (
        <>

      {/* Community Groups Carousel */}
      <div className="space-y-2">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-gray-600' : 'text-slate-300'}`}>Your Community Groups</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {groups.map((g) => (
            <div
              key={g.id}
              onClick={() => setSelectedGroupId(selectedGroupId === g.id ? null : g.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 relative overflow-hidden ${
                selectedGroupId === g.id
                  ? isLight ? 'bg-violet-50 border-violet-500 shadow-md ring-2 ring-violet-400' : 'bg-violet-950/60 border-violet-500 shadow-xl ring-2 ring-violet-500/40'
                  : isLight ? 'bg-white border-gray-200 hover:border-gray-300 shadow-2xs' : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded-full font-bold border ${
                  isLight ? 'bg-violet-100 text-violet-900 border-violet-200' : 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                }`}>
                  {g.type}
                </span>
                <span className={`text-[10px] font-bold ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>{g.membersCount} Members</span>
              </div>

              <h4 className={`text-sm font-bold line-clamp-1 ${isLight ? 'text-gray-900' : 'text-white'}`}>{g.name}</h4>
              <p className={`text-[11px] line-clamp-2 ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>{g.description}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleGroupJoin(g.id);
                }}
                className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all ${
                  g.isJoined
                    ? isLight ? 'bg-gray-100 text-gray-700 hover:bg-rose-100 hover:text-rose-700' : 'bg-white/10 text-slate-300 hover:bg-rose-500/20 hover:text-rose-300'
                    : isLight ? 'bg-violet-700 text-white shadow-2xs' : 'bg-violet-500 text-white shadow-md'
                }`}
              >
                {g.isJoined ? 'Joined ✓' : '+ Join Group'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create Post Box */}
      {showCreateBox && (
        <div className={`p-5 rounded-3xl border shadow-xl space-y-3 animate-in fade-in duration-200 ${
          isLight ? 'bg-white border-violet-300 shadow-md text-gray-900' : 'bg-slate-950 border-violet-500/40 shadow-2xl text-white'
        }`}>
          <h4 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
            <Sparkles className="w-4 h-4 text-violet-600" />
            New Community Post
          </h4>
          <input
            type="text"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            placeholder="Title / Question..."
            className={`w-full px-4 py-2 rounded-xl border text-xs ${
              isLight ? 'bg-gray-50 border-gray-200 text-gray-900 focus:outline-none focus:border-violet-600' : 'bg-black/60 border-white/10 text-white'
            }`}
          />
          <textarea
            rows={3}
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="Share details, civic news, or ask neighbors for recommendations..."
            className={`w-full px-4 py-2.5 rounded-xl border text-xs ${
              isLight ? 'bg-gray-50 border-gray-200 text-gray-900 focus:outline-none focus:border-violet-600' : 'bg-black/60 border-white/10 text-white'
            }`}
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setShowCreateBox(false)}
              className={`px-4 py-2 rounded-xl text-xs font-bold ${
                isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-slate-300'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePost}
              className={`px-5 py-2 rounded-xl font-bold text-xs shadow-md ${
                isLight ? 'bg-violet-700 text-white hover:bg-violet-800' : 'bg-violet-500 text-white shadow-lg'
              }`}
            >
              Publish Post
            </button>
          </div>
        </div>
      )}

      {/* Posts Stream */}
      <div className="space-y-4">
        {filteredPosts.map((p) => (
          <div
            key={p.id}
            className={`p-5 rounded-3xl border shadow-xl space-y-3 ${
              isLight
                ? 'bg-white border-gray-200 text-gray-900 shadow-2xs'
                : 'bg-slate-950/80 border-white/10 backdrop-blur-2xl shadow-2xl text-white'
            }`}
          >
            {/* Author Header */}
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={() => openCreatorProfile(p.authorHandle || p.authorName || p.authorId)}
                className="flex items-center gap-2.5 text-left hover:opacity-80 transition-opacity cursor-pointer group"
              >
                <img src={p.authorAvatar} className="w-9 h-9 rounded-xl object-cover ring-2 ring-violet-500/30 group-hover:ring-blue-600 transition-all" />
                <div>
                  <div className={`font-bold flex items-center gap-1.5 transition-colors ${
                    isLight ? 'text-gray-900 group-hover:text-blue-900' : 'text-white group-hover:text-cyan-300'
                  }`}>
                    {p.authorName}
                    {p.isVerifiedExpert && (
                      <span className={`px-1.5 py-0.5 text-[9px] rounded font-bold border ${
                        isLight ? 'bg-blue-50 text-blue-900 border-blue-200' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                      }`}>
                        Verified Expert
                      </span>
                    )}
                  </div>
                  <div className={`text-[10px] ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>{p.authorTitle || p.groupName}</div>
                </div>
              </button>

              <div className="text-right">
                <span className={`text-[10px] ${isLight ? 'text-gray-400' : 'text-slate-500'}`}>{p.createdTimestamp}</span>
              </div>
            </div>

            {/* Post Title & Content */}
            <div className="space-y-1">
              {p.title && <h3 className={`text-base font-extrabold ${isLight ? 'text-gray-900' : 'text-white'}`}>{p.title}</h3>}
              <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>{p.content}</p>
            </div>

            {/* AI Discussion Summary */}
            {p.aiSummary && (
              <div className={`p-3 rounded-2xl border text-xs flex items-start gap-2 ${
                isLight ? 'bg-violet-50 border-violet-200 text-violet-950' : 'bg-violet-500/10 border-violet-500/20 text-violet-200'
              }`}>
                <Sparkles className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                <span className="font-medium">{p.aiSummary}</span>
              </div>
            )}

            {/* Photo / Media Attachment */}
            {p.mediaUrl && (
              <div className={`rounded-2xl overflow-hidden border max-h-96 ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
                <img src={p.mediaUrl} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Poll Component */}
            {p.pollOptions && (
              <div className={`p-4 rounded-2xl border space-y-2 ${
                isLight ? 'bg-gray-50 border-gray-200' : 'bg-black/50 border-white/10'
              }`}>
                <div className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>
                  <BarChart2 className="w-4 h-4 text-violet-600" />
                  Community Poll ({p.pollTotalVotes} Total Votes)
                </div>
                <div className="space-y-2">
                  {p.pollOptions.map((opt) => {
                    const pct = p.pollTotalVotes ? Math.round((opt.votesCount / p.pollTotalVotes) * 100) : 0;
                    const isVoted = p.userPollVoteId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => votePollOption(p.id, opt.id)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold transition-all relative overflow-hidden cursor-pointer ${
                          isVoted
                            ? isLight ? 'border-violet-600 text-violet-950 bg-violet-50' : 'border-violet-500 text-violet-300'
                            : isLight ? 'border-gray-200 text-gray-800 bg-white' : 'border-white/10 text-slate-300'
                        }`}
                      >
                        <div
                          className={`absolute inset-0 transition-all duration-500 pointer-events-none ${
                            isLight ? 'bg-violet-100' : 'bg-violet-500/20'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                        <div className="relative z-10 flex items-center justify-between">
                          <span>{opt.optionText}</span>
                          <span className={`font-mono text-[10px] ${isLight ? 'text-violet-800' : 'text-violet-400'}`}>{pct}% ({opt.votesCount})</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Engagement Actions */}
            <div className={`pt-2 border-t flex items-center justify-between text-xs ${
              isLight ? 'border-gray-200 text-gray-600' : 'border-white/10 text-slate-400'
            }`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => votePost(p.id, 'up')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold transition-colors ${
                    p.userVote === 'up'
                      ? isLight ? 'bg-blue-100 text-blue-900' : 'bg-cyan-500/20 text-cyan-300'
                      : isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {p.upvotesCount}
                </button>

                <button
                  onClick={() => votePost(p.id, 'down')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold transition-colors ${
                    p.userVote === 'down'
                      ? isLight ? 'bg-rose-100 text-rose-900' : 'bg-rose-500/20 text-rose-300'
                      : isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>

                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-violet-600" />
                  {p.commentsCount} Comments
                </span>
              </div>
            </div>

            {/* Comments Stream */}
            <div className={`pt-2 space-y-2 border-t ${isLight ? 'border-gray-100' : 'border-white/5'}`}>
              {p.comments?.map((c) => (
                <div key={c.id} className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/5'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                      <img src={c.authorAvatar} className="w-4 h-4 rounded-full" />
                      {c.authorName}
                      {c.isBestAnswer && (
                        <span className={`px-1.5 py-0.2 text-[9px] rounded font-bold border ${
                          isLight ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}>
                          Best Answer ✓
                        </span>
                      )}
                    </span>
                    <span className={`text-[9px] ${isLight ? 'text-gray-400' : 'text-slate-500'}`}>{c.timestamp}</span>
                  </div>
                  <p className={isLight ? 'text-gray-700 font-medium' : 'text-slate-300'}>{c.text}</p>
                </div>
              ))}

              {/* Add Comment Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={commentInputs[p.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [p.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && commentInputs[p.id]) {
                      addComment(p.id, commentInputs[p.id]);
                      setCommentInputs({ ...commentInputs, [p.id]: '' });
                    }
                  }}
                  placeholder="Write a neighborly response or expert advice..."
                  className={`flex-1 px-3 py-1.5 rounded-xl border text-xs focus:outline-none ${
                    isLight
                      ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-600 placeholder-gray-400'
                      : 'bg-black/60 border-white/10 text-white focus:border-violet-500'
                  }`}
                />
                <button
                  onClick={() => {
                    if (commentInputs[p.id]) {
                      addComment(p.id, commentInputs[p.id]);
                      setCommentInputs({ ...commentInputs, [p.id]: '' });
                    }
                  }}
                  className={`p-2 rounded-xl font-bold text-xs ${
                    isLight ? 'bg-violet-700 text-white hover:bg-violet-800' : 'bg-violet-500 text-white'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
        </>
      )}

    </div>
  );
};
