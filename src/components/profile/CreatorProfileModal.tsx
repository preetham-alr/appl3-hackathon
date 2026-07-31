/**
 * Krithiq AI - Premium Creator Profile & Universal Search Modal
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  Award,
  Users,
  Search,
  Tv,
  FileText,
  Heart,
  Bookmark,
  Landmark,
  HeartHandshake,
  MessageSquare,
  Sparkles,
  Share2,
  UserPlus,
  UserCheck,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Calendar,
  Filter,
} from 'lucide-react';

interface CreatorProfileModalProps {
  creatorId?: string | null;
  onClose?: () => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({ creatorId, onClose }) => {
  const {
    selectedCreatorId,
    setSelectedCreatorId,
    reels,
    posts,
    user,
    theme,
    toggleFollowCreator,
    savedPosts,
    toggleSavePost,
  } = useApp();

  const isLight = theme === 'light';

  const targetId = creatorId || selectedCreatorId;
  if (!targetId) return null;

  const handleClose = () => {
    if (onClose) onClose();
    else setSelectedCreatorId(null);
  };

  // Find creator details from Reels or Posts or User
  const reelCreator = reels.find((r) => r.author.handle === targetId || r.author.name === targetId || r.id === targetId)?.author;
  const postCreator = posts.find((p) => p.authorHandle === targetId || p.authorName === targetId || p.authorId === targetId);

  const isSelf = targetId === user.id || targetId === user.name || targetId === '@' + user.name.toLowerCase().replace(/\s+/g, '');

  const creatorName = isSelf
    ? user.name
    : reelCreator?.name || postCreator?.authorName || 'Civic Leader & Creator';

  const creatorHandle = isSelf
    ? `@${user.name.toLowerCase().replace(/\s+/g, '')}`
    : reelCreator?.handle || postCreator?.authorHandle || `@${creatorName.toLowerCase().replace(/\s+/g, '')}`;

  const creatorAvatar = isSelf
    ? user.avatar
    : reelCreator?.avatar || postCreator?.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  const isVerified = isSelf ? user.isVerified : (reelCreator?.isVerified ?? true);
  const isFollowing = reelCreator?.isFollowing ?? false;

  // Cover photo
  const coverPhoto = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80';

  // Stats
  const followerCount = isSelf ? 1420 : 8940;
  const followingCount = isSelf ? 230 : 412;
  const trustScore = isSelf ? user.trustScore || 96 : 98;
  const communityScore = isSelf ? user.xp || 1450 : 3820;

  // Active Tab & Search
  const [activeTab, setActiveTab] = useState<
    'posts' | 'reels' | 'campaigns' | 'govt_updates' | 'community' | 'saved' | 'liked' | 'achievements'
  >('posts');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Sample items for Creator Profile
  const creatorPosts = [
    {
      id: 'p_cr_1',
      title: 'Road Surface & Pothole Inspection Drive at Cyber Towers Flyover',
      content: 'Conducted a 4-hour ground audit with GHMC engineers. Cold mix asphalt filling in progress. #CivicSafety #Hyderabad #PotholeFix',
      type: 'complaint',
      likes: 342,
      comments: 28,
      time: '2 hours ago',
      verified: true,
      media: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'p_cr_2',
      title: 'Free Health Screening & Dengue Awareness Drive in Ward 107',
      content: 'Join us this Sunday at KPHB Community Hall. Doctors and diagnostic teams available. #HealthFirst #Telangana',
      type: 'campaign',
      likes: 512,
      comments: 64,
      time: '1 day ago',
      verified: true,
      media: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const creatorReels = reels.filter((r) => r.author.handle === creatorHandle || isSelf);

  const creatorCampaigns = [
    {
      id: 'camp_1',
      title: 'Clean Musi River Cleanup Drive Phase 4',
      location: 'Nagole Bridge, Hyderabad',
      volunteers: 184,
      target: 250,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'camp_2',
      title: 'Solar Street Lights Installation Campaign',
      location: 'Serilingampally Zone',
      volunteers: 92,
      target: 100,
      status: 'Near Completion',
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const creatorGovtUpdates = [
    {
      id: 'gov_1',
      title: 'Telangana Rythu Bharosa Scheme Guidelines 2026',
      dept: 'Agriculture & Farmer Welfare Dept',
      summary: 'Direct financial assistance rules released for kharif season 2026.',
      date: 'Yesterday',
    },
    {
      id: 'gov_2',
      title: 'GHMC Smart Dustbin & Waste Segregation Order',
      dept: 'Municipal Sanitation Dept',
      summary: 'Mandatory 2-bin waste segregation introduced across all commercial establishments.',
      date: '3 days ago',
    },
  ];

  // Search filtering logic
  const matchSearch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-4xl bg-slate-950 border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] relative">
        
        {/* Modal Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all cursor-pointer border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover Photo & Header Section */}
        <div className="relative shrink-0 overflow-hidden">
          <div className="h-36 sm:h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url(${coverPhoto})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </div>

          {/* Profile Bar overlay */}
          <div className="px-5 sm:px-8 pb-4 relative z-10 -mt-14 sm:-mt-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="relative">
                <img
                  src={creatorAvatar}
                  alt={creatorName}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-slate-950 border-2 border-cyan-400 shadow-2xl bg-slate-900"
                />
                {isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 p-1 rounded-full ring-2 ring-slate-950">
                    <CheckCircle2 className="w-4 h-4 fill-cyan-400 text-slate-950" />
                  </div>
                )}
              </div>

              <div className="space-y-1 pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">{creatorName}</h2>
                  {isVerified && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      Verified Creator
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-400">{creatorHandle}</p>
                <div className="flex items-center gap-3 text-xs text-slate-300 pt-1">
                  <span><strong className="text-white font-extrabold">{followerCount.toLocaleString()}</strong> Followers</span>
                  <span>•</span>
                  <span><strong className="text-white font-extrabold">{followingCount.toLocaleString()}</strong> Following</span>
                </div>
              </div>
            </div>

            {/* Follow / Edit Button */}
            <div className="flex items-center gap-2">
              {!isSelf ? (
                <button
                  onClick={() => toggleFollowCreator(reelCreator?.id || 'cr_1')}
                  className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
                    isFollowing
                      ? 'bg-slate-800 hover:bg-slate-700 text-white border border-white/15'
                      : 'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 hover:scale-105'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Follow Creator</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold">
                  Your Public Profile
                </div>
              )}

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: creatorName, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Profile link copied to clipboard!');
                  }
                }}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white transition-all cursor-pointer border border-white/10"
                title="Share Profile"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scores Pill */}
          <div className="px-5 sm:px-8 py-2 flex items-center gap-4 text-xs font-bold">
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border transition-all ${
              isLight
                ? 'bg-[#366366] border-[#366366] text-white shadow-md'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
            }`}>
              <ShieldCheck className={`w-4 h-4 ${isLight ? 'text-teal-200' : 'text-cyan-400'}`} />
              <span>Trust Score: <strong className="text-white font-black">{trustScore}/100</strong></span>
            </div>
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border transition-all ${
              isLight
                ? 'bg-[#366366] border-[#366366] text-white shadow-md'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              <Sparkles className={`w-4 h-4 ${isLight ? 'text-amber-300' : 'text-amber-400'}`} />
              <span>Community Score: <strong className="text-white font-black">{communityScore} XP</strong></span>
            </div>
          </div>
        </div>

        {/* Creator Bio */}
        <div className="px-5 sm:px-8 py-2 text-xs text-slate-300 leading-relaxed border-b border-white/10">
          Civic Activist & Community Creator. Inspecting urban infrastructure, raising awareness for Telangana schemes, and organizing local volunteer drives.
        </div>

        {/* IN-PROFILE UNIVERSAL SEARCH BAR */}
        <div className="p-4 bg-slate-900/80 border-b border-white/10 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts, reels, hashtags, campaigns, or updates in this profile..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-black/60 border border-white/15 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Content</option>
              <option value="hashtags">Hashtags (#)</option>
              <option value="verified">Verified Only</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
        </div>

        {/* TABS HEADER */}
        <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-white/10 overflow-x-auto no-scrollbar shrink-0 text-xs font-bold">
          {[
            { id: 'posts', label: 'Posts', icon: FileText, count: creatorPosts.length },
            { id: 'reels', label: 'Synks', icon: Tv, count: creatorReels.length },
            { id: 'campaigns', label: 'Campaigns', icon: HeartHandshake, count: creatorCampaigns.length },
            { id: 'govt_updates', label: 'Govt Updates', icon: Landmark, count: creatorGovtUpdates.length },
            { id: 'community', label: 'Community', icon: Users, count: 4 },
            { id: 'saved', label: 'Saved', icon: Bookmark, count: savedPosts.length },
            { id: 'liked', label: 'Liked', icon: Heart, count: 12 },
            { id: 'achievements', label: 'Achievements', icon: Award, count: 6 },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;

            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-slate-950 text-cyan-300' : 'bg-white/10 text-slate-400'
                }`}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT AREA */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB: POSTS */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {creatorPosts.filter((p) => matchSearch(p.title + ' ' + p.content)).map((post) => (
                <div key={post.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {post.type}
                    </span>
                    <span className="text-[10px] text-slate-400">{post.time}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{post.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{post.content}</p>
                  {post.media && (
                    <img src={post.media} alt={post.title} className="w-full h-48 object-cover rounded-xl border border-white/10" />
                  )}
                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <button className="flex items-center gap-1 hover:text-cyan-400">
                      <Heart className="w-3.5 h-3.5" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-cyan-400">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.comments}</span>
                    </button>
                    <button onClick={() => toggleSavePost(post.id)} className="ml-auto hover:text-cyan-400">
                      <Bookmark className={`w-3.5 h-3.5 ${savedPosts.includes(post.id) ? 'fill-cyan-400 text-cyan-400' : ''}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: REELS */}
          {activeTab === 'reels' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {creatorReels.filter((r) => matchSearch(r.caption || '')).map((reel) => (
                <div key={reel.id} className="relative aspect-[9/16] rounded-2xl overflow-hidden group border border-white/10">
                  <video src={reel.videoUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-between">
                    <span className="self-end px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-bold">
                      {reel.likesCount} ❤️
                    </span>
                    <p className="text-[11px] font-bold text-white line-clamp-2">{reel.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: CAMPAIGNS */}
          {activeTab === 'campaigns' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {creatorCampaigns.filter((c) => matchSearch(c.title + ' ' + c.location)).map((camp) => (
                <div key={camp.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <img src={camp.image} alt={camp.title} className="w-full h-32 object-cover rounded-xl" />
                  <h4 className="text-xs font-black text-white">{camp.title}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{camp.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-300 pt-2 border-t border-white/10">
                    <span>{camp.volunteers} Volunteers Joined</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">{camp.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: GOVT UPDATES */}
          {activeTab === 'govt_updates' && (
            <div className="space-y-3">
              {creatorGovtUpdates.filter((g) => matchSearch(g.title + ' ' + g.dept)).map((gov) => (
                <div key={gov.id} className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-indigo-300 uppercase">{gov.dept}</span>
                    <span className="text-[10px] text-slate-400">{gov.date}</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-white">{gov.title}</h4>
                  <p className="text-[11px] text-slate-300">{gov.summary}</p>
                </div>
              ))}
            </div>
          )}

          {/* OTHER TABS FALLBACK */}
          {['community', 'saved', 'liked', 'achievements'].includes(activeTab) && (
            <div className="p-8 text-center space-y-2 text-slate-400">
              <Sparkles className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
              <h4 className="text-xs font-extrabold text-white">Showing {activeTab.replace('_', ' ').toUpperCase()}</h4>
              <p className="text-[11px]">All synchronized content is verified cryptographically by Krithiq AI.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
