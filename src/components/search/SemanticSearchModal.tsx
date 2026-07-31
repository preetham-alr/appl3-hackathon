/**
 * Krithiq AI - Universal Smart Search Engine & Live Suggestions
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Sparkles,
  X,
  User as UserIcon,
  Tag,
  Users,
  FileText,
  Tv,
  AlertTriangle,
  Building2,
  QrCode,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';

export const SemanticSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setSearchModalOpen,
    setActiveTab,
    reports,
    posts,
    reels,
    groups,
    user,
    setProfileModalOpen,
  } = useApp();

  const [query, setQuery] = useState('');

  // Comprehensive index of searchable items
  const liveSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: Array<{
      id: string;
      title: string;
      subtitle: string;
      category:
        | 'People'
        | 'Hashtags'
        | 'Communities'
        | 'Complaints'
        | 'Synks'
        | 'Posts'
        | 'Government & Business'
        | 'QR & Products'
        | 'Nearby Places';
      icon: any;
      action: () => void;
    }> = [];

    // 1. Search People & Verified Users & Creators
    const userNameStr = user?.name || 'Civic Leader';
    if (
      userNameStr.toLowerCase().includes(q) ||
      'dr. vikramaditya rao'.includes(q) ||
      'rahul verma'.includes(q) ||
      'sneha patel'.includes(q)
    ) {
      results.push({
        id: 'p_user_me',
        title: userNameStr,
        subtitle: `${user?.reputationLevel || 'Verified Citizen'} • Ward 107 Top Contributor`,
        category: 'People',
        icon: UserIcon,
        action: () => {
          setSearchModalOpen(false);
          setProfileModalOpen(true);
        },
      });
      results.push({
        id: 'p_vikram',
        title: 'Dr. Vikramaditya Rao',
        subtitle: 'Verified Urban Planning Expert & Environmental Consultant',
        category: 'People',
        icon: ShieldCheck,
        action: () => {
          setSearchModalOpen(false);
          setActiveTab('community');
        },
      });
    }

    // 2. Hashtags
    if (q.includes('#') || 'roadsafety'.includes(q) || 'krithiq'.includes(q) || 'zerowaste'.includes(q)) {
      results.push({
        id: 'h_road',
        title: '#RoadSafety & Potholes',
        subtitle: '42 active posts & Synks tagged with #RoadSafety',
        category: 'Hashtags',
        icon: Tag,
        action: () => {
          setSearchModalOpen(false);
          setActiveTab('community');
        },
      });
      results.push({
        id: 'h_zerowaste',
        title: '#ZeroWasteHyderabad',
        subtitle: '18 community waste management drives',
        category: 'Hashtags',
        icon: Tag,
        action: () => {
          setSearchModalOpen(false);
          setActiveTab('community');
        },
      });
    }

    // 3. Communities & Wards
    groups.forEach((g) => {
      if (
        g.name.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.locationName.toLowerCase().includes(q)
      ) {
        results.push({
          id: `g_${g.id}`,
          title: g.name,
          subtitle: `${g.membersCount.toLocaleString()} Members • ${g.locationName}`,
          category: 'Communities',
          icon: Users,
          action: () => {
            setSearchModalOpen(false);
            setActiveTab('community');
          },
        });
      }
    });

    // 4. Complaints & Reports
    reports.forEach((r) => {
      if (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.locationName.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      ) {
        results.push({
          id: `r_${r.id}`,
          title: r.title,
          subtitle: `${r.id} • ${r.status} • ${r.locationName}`,
          category: 'Complaints',
          icon: AlertTriangle,
          action: () => {
            setSearchModalOpen(false);
            setActiveTab('civic');
          },
        });
      }
    });

    // 5. Reels
    reels.forEach((rl) => {
      if (
        rl.caption.toLowerCase().includes(q) ||
        rl.creatorName.toLowerCase().includes(q) ||
        rl.aiSummary.toLowerCase().includes(q)
      ) {
        results.push({
          id: `rl_${rl.id}`,
          title: rl.caption,
          subtitle: `Creator: ${rl.creatorName} • ${rl.likesCount} Likes`,
          category: 'Synks',
          icon: Tv,
          action: () => {
            setSearchModalOpen(false);
            setActiveTab('reels');
          },
        });
      }
    });

    // 6. Posts
    posts.forEach((p) => {
      if (p.content.toLowerCase().includes(q) || (p.title && p.title.toLowerCase().includes(q))) {
        results.push({
          id: `post_${p.id}`,
          title: p.title || p.content.slice(0, 50),
          subtitle: `By ${p.authorName} • ${p.upvotesCount} Upvotes`,
          category: 'Posts',
          icon: FileText,
          action: () => {
            setSearchModalOpen(false);
            setActiveTab('community');
          },
        });
      }
    });

    // 7. Government Offices & Businesses
    if (
      'ghmc'.includes(q) ||
      'road engineering'.includes(q) ||
      'tsspdcl'.includes(q) ||
      'electricity'.includes(q) ||
      'consumer forum'.includes(q) ||
      'pharmacy'.includes(q) ||
      'medicine'.includes(q)
    ) {
      results.push({
        id: 'gov_ghmc',
        title: 'GHMC Road Infrastructure Engineering Wing',
        subtitle: 'Assigned Department for Ward 107 Potholes & Asphalt',
        category: 'Government & Business',
        icon: Building2,
        action: () => {
          setSearchModalOpen(false);
          setActiveTab('transparency');
        },
      });
      results.push({
        id: 'gov_tsspdcl',
        title: 'TSSPDCL Electrical Substation & Streetlighting',
        subtitle: 'Official Electricity Service Board',
        category: 'Government & Business',
        icon: Briefcase,
        action: () => {
          setSearchModalOpen(false);
          setActiveTab('transparency');
        },
      });
    }

    // 8. Medicine / Products / QR History
    if (
      'medicine'.includes(q) ||
      'qr'.includes(q) ||
      'fake'.includes(q) ||
      'rabies'.includes(q) ||
      'pharmacy'.includes(q)
    ) {
      results.push({
        id: 'qr_med',
        title: 'Fake Medicine Batch Alert & Verified Pharmacies',
        subtitle: 'AI verification scanner for pharmaceutical batch hashes',
        category: 'QR & Products',
        icon: QrCode,
        action: () => {
          setSearchModalOpen(false);
          setActiveTab('verification');
        },
      });
    }

    // 9. Nearby Places & Locations
    if (
      'hyderabad'.includes(q) ||
      'madhapur'.includes(q) ||
      'cyber towers'.includes(q) ||
      'gachibowli'.includes(q) ||
      'kondapur'.includes(q)
    ) {
      results.push({
        id: 'place_hyd',
        title: 'Madhapur, Cyber Towers & Ward 107',
        subtitle: 'Nearby Reports, Verified Businesses & Civic Offices',
        category: 'Nearby Places',
        icon: MapPin,
        action: () => {
          setSearchModalOpen(false);
          setActiveTab('map');
        },
      });
    }

    return results;
  }, [query, reports, posts, reels, groups, user]);

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-3 sm:p-5 pt-12 sm:pt-20 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-950 border border-cyan-500/50 rounded-3xl shadow-2xl overflow-hidden space-y-4 p-5 relative max-h-[85vh] flex flex-col">
        
        {/* Close button */}
        <button
          onClick={() => setSearchModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
          <h3 className="text-lg font-extrabold text-white">Krithiq Universal AI Search</h3>
        </div>

        {/* Real-time Input */}
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-black/80 border border-white/20 shrink-0">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search issues, schemes, campaigns, communities, or people..."
            className="w-full bg-transparent text-white text-xs sm:text-sm focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/10"
            >
              Clear
            </button>
          )}
        </div>

        {/* Preset Prompt Badges */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs shrink-0">
          <span className="text-slate-400 font-bold">Try searching:</span>
          {[user?.name?.split(' ')[0] || 'Civic', '#RoadSafety', 'Hyderabad', 'Medicine', 'GHMC', 'Pothole'].map((prompt, i) => (
            <button
              key={i}
              onClick={() => setQuery(prompt)}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 text-[11px] font-medium cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Search Live Results Feed */}
        <div className="overflow-y-auto space-y-2 flex-1 pr-1">
          {!query.trim() && (
            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
              <p className="text-slate-300 font-bold">Type anything above for instant live suggestions.</p>
              <p>Supports People, Creators, Hashtags, Communities, Complaints, Businesses, Events, & QR History.</p>
            </div>
          )}

          {query.trim() && liveSuggestions.length === 0 && (
            <div className="p-6 text-center text-xs text-slate-400">
              No direct matches found for "{query}". Try searching "{user?.name?.split(' ')[0] || 'Civic'}", "Pothole", "Medicine", or "#RoadSafety".
            </div>
          )}

          {liveSuggestions.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={item.action}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{item.title}</span>
                      <span className="px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[9px] uppercase">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">{item.subtitle}</p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
