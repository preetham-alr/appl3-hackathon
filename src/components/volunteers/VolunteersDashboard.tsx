/**
 * Krithiq AI - Volunteer Community Dashboard & Certification Engine
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { VolunteerCampaign, VolunteerCategory, VolunteerCertificate } from '../../types';
import { VOLUNTEER_CATEGORIES, INITIAL_VOLUNTEER_CAMPAIGNS, MOCK_CERTIFICATES } from '../../data/mockVolunteers';
import {
  HeartHandshake,
  PlusCircle,
  Users,
  Award,
  Calendar,
  Clock,
  MapPin,
  Share2,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Download,
  Flame,
  X,
  Search,
  Filter,
  Check,
  UserPlus,
  Send,
  Image as ImageIcon,
  ShieldCheck,
  Phone,
  FileText,
} from 'lucide-react';

export const VolunteersDashboard: React.FC = () => {
  const { user, addXp, theme } = useApp();
  const isLight = theme === 'light';

  const [campaigns, setCampaigns] = useState<VolunteerCampaign[]>(INITIAL_VOLUNTEER_CAMPAIGNS);
  const [certificates, setCertificates] = useState<VolunteerCertificate[]>(MOCK_CERTIFICATES);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOption, setSortOption] = useState<'Trending' | 'Nearby' | 'Most Joined' | 'Upcoming'>('Trending');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [selectedCampaign, setSelectedCampaign] = useState<VolunteerCampaign | null>(null);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [isLogHoursOpen, setIsLogHoursOpen] = useState(false);
  const [selectedCertToDownload, setSelectedCertToDownload] = useState<VolunteerCertificate | null>(null);
  const [inviteModalCampaign, setInviteModalCampaign] = useState<VolunteerCampaign | null>(null);

  // Volunteer stats
  const [loggedHours, setLoggedHours] = useState(14);
  const [streakDays, setStreakDays] = useState(user?.streakDays || 5);

  // New Host Campaign Form State
  const [hostForm, setHostForm] = useState({
    title: '',
    category: VOLUNTEER_CATEGORIES[0],
    description: '',
    eventDate: '',
    eventTime: '08:00 AM - 12:00 PM',
    venue: '',
    googleMapsUrl: '',
    volunteersNeeded: 50,
    coverImage: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80',
    contactInfo: `${user?.phone || '+91 98765 43210'} • ${user?.email}`,
  });

  // Log hours form state
  const [logHoursForm, setLogHoursForm] = useState({
    campaignName: campaigns[0]?.title || 'Civic Cleanup',
    hours: 3,
    notes: 'Cleared plastic waste and planted 10 saplings.',
  });

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((camp) => {
    if (selectedCategory !== 'All') {
      const CATEGORY_MAP: Record<string, string[]> = {
        'Environment': ['Environment', 'Tree Plantation', 'River Cleaning', 'Beach Cleanups', 'Park Cleaning', 'Plastic Collection', 'E-Waste Drives', 'Cleanliness'],
        'Cleanliness': ['Cleanliness', 'Beach Cleanups', 'Park Cleaning', 'River Cleaning', 'Plastic Collection'],
        'Health': ['Health', 'Blood Donation', 'Blood Donation Camps', 'Medical Camps', 'Community Health Camps'],
        'Blood Donation': ['Blood Donation', 'Blood Donation Camps'],
        'Community': ['Community', 'Community Events', 'Food Distribution', 'Clothes Donation', 'Book Donation Drives', 'Animal Rescue', 'Senior Citizen Assistance'],
        'Community Events': ['Community', 'Community Events', 'Food Distribution', 'Clothes Donation', 'Book Donation Drives', 'Senior Citizen Assistance'],
        'Emergency': ['Emergency', 'Disaster Relief'],
        'Disaster Relief': ['Emergency', 'Disaster Relief'],
        'Government Initiatives': ['Government Initiatives', 'Awareness Rallies', 'Road Safety Campaigns', 'Women Empowerment'],
        'Education': ['Education', 'Book Donation Drives', 'School Volunteering', 'Child Education Programs'],
      };

      const campCats = camp.categories || [camp.category];
      const targetMatches = CATEGORY_MAP[selectedCategory] || [selectedCategory];

      const matchesCategory = campCats.some((c) =>
        c.toLowerCase() === selectedCategory.toLowerCase() ||
        targetMatches.some((tm) => tm.toLowerCase() === c.toLowerCase())
      );

      if (!matchesCategory) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const campCatsStr = (camp.categories || []).join(' ').toLowerCase();
      return (
        camp.title.toLowerCase().includes(q) ||
        camp.description.toLowerCase().includes(q) ||
        camp.venue.toLowerCase().includes(q) ||
        camp.category.toLowerCase().includes(q) ||
        campCatsStr.includes(q)
      );
    }
    return true;
  });

  // Toggle Join Campaign
  const handleToggleJoin = (campId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campId) {
          const newIsJoined = !c.isJoined;
          if (newIsJoined) {
            addXp(c.xpReward || 200);
            if ('vibrate' in navigator) navigator.vibrate(20);
          }
          return {
            ...c,
            isJoined: newIsJoined,
            registeredVolunteersCount: newIsJoined
              ? c.registeredVolunteersCount + 1
              : Math.max(0, c.registeredVolunteersCount - 1),
          };
        }
        return c;
      })
    );
  };

  // Toggle Save Event
  const handleToggleSave = (campId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campId ? { ...c, isSaved: !c.isSaved } : c))
    );
  };

  // Handle Host Campaign submit
  const handleHostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostForm.title || !hostForm.venue || !hostForm.eventDate) {
      alert('Please fill out event title, date, and venue location.');
      return;
    }

    const newCampaign: VolunteerCampaign = {
      id: 'vol-' + Date.now(),
      title: hostForm.title,
      category: hostForm.category as VolunteerCategory,
      description: hostForm.description || 'Community volunteer drive open for all civic leaders.',
      coverImage: hostForm.coverImage,
      organizerName: user?.name || 'Civic Champion',
      organizerAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      eventDate: hostForm.eventDate,
      eventTime: hostForm.eventTime,
      venue: hostForm.venue,
      googleMapsUrl: hostForm.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(hostForm.venue)}`,
      volunteersNeeded: Number(hostForm.volunteersNeeded) || 50,
      registeredVolunteersCount: 1,
      registeredUsers: [{ id: user?.id || 'u0', name: user?.name || 'You', avatar: user?.avatar || '', registeredAt: 'Just now' }],
      contactInfo: hostForm.contactInfo,
      hoursReward: 4,
      xpReward: 300,
      isJoined: true,
    };

    setCampaigns([newCampaign, ...campaigns]);
    addXp(400); // Reward for organizing!
    setIsHostModalOpen(false);
    alert('🎉 Your campaign has been hosted and published to the CivicAI Volunteer Network!');
  };

  // Handle Log Hours submit & generate certificate
  const handleLogHoursSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const addedHrs = Number(logHoursForm.hours) || 2;
    setLoggedHours((prev) => prev + addedHrs);
    addXp(addedHrs * 50);

    // Generate certificate entry
    const newCert: VolunteerCertificate = {
      id: 'cert-' + Math.floor(1000 + Math.random() * 9000),
      campaignTitle: logHoursForm.campaignName,
      volunteerName: user?.name || 'Civic Volunteer',
      dateCompleted: new Date().toISOString().split('T')[0],
      hoursServed: addedHrs,
      certificateNumber: 'CIVIC-CERT-2026-' + Math.floor(1000 + Math.random() * 9000),
      issuer: 'CivicAI Global Volunteer Network',
    };

    setCertificates([newCert, ...certificates]);
    setIsLogHoursOpen(false);
    alert(`Logged ${addedHrs} volunteer hours! A verified participation certificate was added to your profile.`);
  };

  // Download Certificate Image / Document Canvas
  const handleDownloadCertificate = (cert: VolunteerCertificate) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Certificate background fill
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, 1200, 800);

      // Gold / Cyan Decorative Border
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#06b6d4';
      ctx.strokeRect(30, 30, 1140, 740);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#eab308';
      ctx.strokeRect(45, 45, 1110, 710);

      // Header Text
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CIVICAI VOLUNTEER NETWORK', 600, 120);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 50px serif';
      ctx.fillText('CERTIFICATE OF APPRECIATION', 600, 200);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '22px sans-serif';
      ctx.fillText('THIS CERTIFICATE IS PROUDLY PRESENTED TO', 600, 270);

      // Volunteer Name
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 46px sans-serif';
      ctx.fillText(cert.volunteerName.toUpperCase(), 600, 340);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '22px sans-serif';
      ctx.fillText(`FOR OUTSTANDING CIVIC SERVICE AND ${cert.hoursServed} VOLUNTEER HOURS IN`, 600, 420);

      // Campaign Name
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(`"${cert.campaignTitle}"`, 600, 480);

      // Certificate details
      ctx.fillStyle = '#64748b';
      ctx.font = '18px monospace';
      ctx.fillText(`DATE: ${cert.dateCompleted}  |  CERTIFICATE ID: ${cert.certificateNumber}`, 600, 570);

      // Signature line
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'italic 20px serif';
      ctx.fillText('CivicAI Governance & Environmental Directorate', 600, 670);

      // Trigger Download
      const link = document.createElement('a');
      link.download = `${cert.volunteerName.replace(/\s+/g, '_')}_Volunteer_Certificate.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden shadow-xl ${
        isLight
          ? 'bg-gradient-to-r from-rose-50 via-pink-50 to-slate-50 border-rose-200 text-gray-900 shadow-2xs'
          : 'bg-gradient-to-r from-slate-900 via-rose-950/80 to-slate-900 border border-rose-500/30 text-white shadow-2xl'
      }`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
              isLight ? 'bg-rose-100 border-rose-300 text-rose-900' : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
            }`}>
              <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
              <span>CivicAI Volunteer & Campaign Network</span>
            </div>
            <h1 className={`text-2xl sm:text-4xl font-black tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
              Community Volunteer Hub
            </h1>
            <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>
              Join environmental cleanups, blood drives, disaster relief, and tree plantations. Earn verified XP, level up your civic rank, and download participation certificates.
            </p>
          </div>

          {/* Action CTAs & User Stats */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            
            <div className={`p-3.5 rounded-2xl border flex items-center justify-around gap-4 text-center ${
              isLight ? 'bg-white border-rose-200 shadow-2xs' : 'bg-black/60 border-rose-500/30'
            }`}>
              <div>
                <span className={`text-[10px] font-bold block uppercase ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Hours Served</span>
                <span className="text-lg font-black text-rose-600">{loggedHours} hrs</span>
              </div>
              <div className={`w-px h-8 ${isLight ? 'bg-gray-200' : 'bg-white/10'}`} />
              <div>
                <span className={`text-[10px] font-bold block uppercase ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Streak</span>
                <span className="text-lg font-black text-amber-600 flex items-center justify-center gap-0.5">
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500" /> {streakDays}d
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsHostModalOpen(true)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isLight ? 'bg-rose-700 hover:bg-rose-800 text-white' : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-slate-950 shadow-rose-500/25'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Host Campaign</span>
              </button>

              <button
                onClick={() => setIsLogHoursOpen(true)}
                className={`px-4 py-2 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isLight ? 'bg-white hover:bg-gray-100 border-gray-300 text-gray-800 shadow-2xs' : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                }`}
              >
                <Clock className="w-4 h-4 text-rose-600" />
                <span>Log Hours</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Impact Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className={`p-3.5 rounded-2xl border text-center space-y-1 shadow-xs ${
          isLight ? 'bg-white border-rose-200 text-gray-900' : 'bg-gradient-to-br from-rose-950/40 to-slate-900 border-rose-500/30'
        }`}>
          <span className={`text-[10px] font-bold block uppercase tracking-wider ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Active Campaigns</span>
          <span className="text-xl sm:text-2xl font-black text-rose-600">28</span>
          <span className={`text-[9px] font-semibold block ${isLight ? 'text-rose-800' : 'text-rose-300'}`}>Across 12 Wards</span>
        </div>

        <div className={`p-3.5 rounded-2xl border text-center space-y-1 shadow-xs ${
          isLight ? 'bg-white border-emerald-200 text-gray-900' : 'bg-gradient-to-br from-emerald-950/40 to-slate-900 border-emerald-500/30'
        }`}>
          <span className={`text-[10px] font-bold block uppercase tracking-wider ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Volunteers Joined</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600">14,350+</span>
          <span className={`text-[9px] font-semibold block ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>+12% this week</span>
        </div>

        <div className={`p-3.5 rounded-2xl border text-center space-y-1 shadow-xs ${
          isLight ? 'bg-white border-teal-200 text-gray-900' : 'bg-gradient-to-br from-teal-950/40 to-slate-900 border-teal-500/30'
        }`}>
          <span className={`text-[10px] font-bold block uppercase tracking-wider ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Trees Planted</span>
          <span className="text-xl sm:text-2xl font-black text-teal-600">42,800+</span>
          <span className={`text-[9px] font-semibold block ${isLight ? 'text-teal-800' : 'text-teal-300'}`}>Haritha Haram</span>
        </div>

        <div className={`p-3.5 rounded-2xl border text-center space-y-1 shadow-xs ${
          isLight ? 'bg-white border-amber-200 text-gray-900' : 'bg-gradient-to-br from-amber-950/40 to-slate-900 border-amber-500/30'
        }`}>
          <span className={`text-[10px] font-bold block uppercase tracking-wider ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Hours Contributed</span>
          <span className="text-xl sm:text-2xl font-black text-amber-600">95,400 hrs</span>
          <span className={`text-[9px] font-semibold block ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>Verified Impact</span>
        </div>

        <div className={`p-3.5 rounded-2xl border text-center space-y-1 shadow-xs col-span-2 sm:col-span-1 ${
          isLight ? 'bg-white border-violet-200 text-gray-900' : 'bg-gradient-to-br from-violet-950/40 to-slate-900 border-violet-500/30'
        }`}>
          <span className={`text-[10px] font-bold block uppercase tracking-wider ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Funds Raised</span>
          <span className="text-xl sm:text-2xl font-black text-violet-600">₹1.4 Cr</span>
          <span className={`text-[9px] font-semibold block ${isLight ? 'text-violet-800' : 'text-violet-300'}`}>Community Pool</span>
        </div>
      </div>

      {/* Certificates Library Ribbon */}
      {certificates.length > 0 && (
        <div className={`p-5 rounded-3xl border backdrop-blur-xl space-y-3 ${
          isLight ? 'bg-white border-gray-200 shadow-2xs' : 'bg-slate-900/90 border-white/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
              isLight ? 'text-gray-900' : 'text-slate-200'
            }`}>
              <Award className="w-4 h-4 text-amber-500" /> Your Verified Participation Certificates ({certificates.length})
            </span>
            <span className={`text-[10px] font-bold ${isLight ? 'text-teal-700' : 'text-cyan-400'}`}>Official Digital Proof</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-xs ${
                  isLight ? 'bg-amber-50/60 border-amber-200' : 'bg-black/60 border-amber-500/30'
                }`}
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className={`text-[10px] font-mono truncate ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>{cert.certificateNumber}</span>
                  </div>
                  <h4 className={`text-xs font-extrabold truncate ${isLight ? 'text-gray-900' : 'text-white'}`}>{cert.campaignTitle}</h4>
                  <p className={`text-[10px] ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>Issued for {cert.hoursServed} hours on {cert.dateCompleted}</p>
                </div>

                <button
                  onClick={() => handleDownloadCertificate(cert)}
                  className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isLight ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-2xs' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters & Search & Quick Sorting */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          <div className="relative flex-1 w-full">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-gray-500' : 'text-slate-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search issues, schemes, campaigns, communities, or people..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs focus:outline-none transition-all ${
                isLight
                  ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-rose-600 shadow-2xs'
                  : 'bg-slate-900/90 border-white/10 text-white placeholder-slate-400 focus:border-rose-500'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${isLight ? 'text-gray-500 hover:text-gray-800' : 'text-slate-400 hover:text-white'}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Sort Options */}
          <div className={`flex items-center gap-1.5 p-1.5 rounded-2xl border shrink-0 w-full sm:w-auto overflow-x-auto no-scrollbar ${
            isLight ? 'bg-gray-100 border-gray-200' : 'bg-black/60 border-white/10'
          }`}>
            <span className={`text-[10px] font-bold px-2 flex items-center gap-1 ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>
              <Filter className="w-3 h-3 text-rose-600" /> Sort:
            </span>
            {(['Trending', 'Nearby', 'Most Joined', 'Upcoming'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setSortOption(opt)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  sortOption === opt
                    ? isLight ? 'bg-rose-600 text-white font-black shadow-2xs' : 'bg-rose-500 text-slate-950 font-black shadow-md shadow-rose-500/20'
                    : isLight ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-200' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

        </div>

        {/* Category Filters requested by user */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            'All',
            'Environment',
            'Cleanliness',
            'Education',
            'Health',
            'Blood Donation',
            'Disaster Relief',
            'Community Events',
            'Government Initiatives',
          ].map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? isLight ? 'bg-rose-600 text-white border-rose-700 font-black shadow-2xs scale-102' : 'bg-rose-500 text-slate-950 border-rose-400 font-black shadow-lg shadow-rose-500/25 scale-102'
                    : isLight ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className={`p-12 text-center rounded-3xl border space-y-3 ${
          isLight ? 'bg-white border-gray-200 shadow-2xs' : 'bg-slate-900/50 border-white/10'
        }`}>
          <HeartHandshake className="w-12 h-12 text-rose-500/50 mx-auto" />
          <h3 className={`text-base font-extrabold ${isLight ? 'text-gray-900' : 'text-white'}`}>No Volunteer Campaigns Match Search</h3>
          <p className={`text-xs max-w-md mx-auto ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>
            Try resetting your search query or host your own community campaign to mobilize local volunteers!
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
              isLight ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-rose-500 text-slate-950'
            }`}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCampaigns.map((camp) => (
            <div
              key={camp.id}
              onClick={() => setSelectedCampaign(camp)}
              className={`group p-5 rounded-3xl border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4 cursor-pointer relative overflow-hidden ${
                isLight
                  ? 'bg-white border-gray-200 hover:border-rose-400 shadow-2xs hover:shadow-md'
                  : 'bg-slate-900/80 border-white/10 hover:border-rose-500/50 shadow-xl'
              }`}
            >
              
              {/* Cover Image Header */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/60 border border-white/10">
                <img
                  src={camp.coverImage}
                  alt={camp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-black text-rose-300">
                  {camp.category}
                </span>

                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 text-[10px] font-black shadow-xs">
                  +{camp.xpReward} XP
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className={`text-base font-extrabold transition-colors leading-snug ${
                  isLight ? 'text-gray-900 group-hover:text-rose-700' : 'text-white group-hover:text-rose-300'
                }`}>
                  {camp.title}
                </h3>
                <p className={`text-xs font-medium line-clamp-2 ${isLight ? 'text-gray-600' : 'text-slate-300/80'}`}>
                  {camp.description}
                </p>
              </div>

              {/* Event Metadata */}
              <div className={`space-y-2 text-[11px] font-medium p-3 rounded-2xl border ${
                isLight ? 'bg-gray-50 border-gray-200 text-gray-700' : 'bg-white/5 border-white/5 text-slate-300'
              }`}>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>{camp.eventDate} ({camp.eventTime})</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span className="truncate">{camp.venue}</span>
                </div>

                {/* Progress Bar & Participant Stats */}
                <div className={`pt-1.5 border-t space-y-1 ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className={`font-bold flex items-center gap-1 ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>
                      <Users className="w-3 h-3 text-rose-600" />
                      Participants: <strong className={isLight ? 'text-gray-900' : 'text-white'}>{camp.registeredVolunteersCount} / {camp.volunteersNeeded}</strong>
                    </span>
                    <span className={`font-black ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                      {Math.min(100, Math.round((camp.registeredVolunteersCount / camp.volunteersNeeded) * 100))}%
                    </span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden border ${
                    isLight ? 'bg-gray-200 border-gray-300' : 'bg-slate-950/80 border-white/10'
                  }`}>
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((camp.registeredVolunteersCount / camp.volunteersNeeded) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className={`pt-2 border-t flex items-center justify-between gap-2 ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleToggleSave(camp.id, e)}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      camp.isSaved
                        ? isLight ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : isLight ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200' : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10'
                    }`}
                  >
                    {camp.isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInviteModalCampaign(camp);
                    }}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isLight ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200' : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/10'
                    }`}
                    title="Invite Friends"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={(e) => handleToggleJoin(camp.id, e)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    camp.isJoined
                      ? isLight ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : isLight ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs' : 'bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-lg shadow-rose-500/25'
                  }`}
                >
                  {camp.isJoined ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Registered</span>
                    </>
                  ) : (
                    <span>Register / Join</span>
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Campaign Details View Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-2xl border rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto ${
            isLight ? 'bg-white border-rose-200 text-gray-900 shadow-2xs' : 'bg-slate-950 border-rose-500/40 text-white'
          }`}>
            
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10">
              <img src={selectedCampaign.coverImage} alt={selectedCampaign.title} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedCampaign(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/80 text-white hover:bg-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                isLight ? 'bg-rose-100 text-rose-900 border-rose-300' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {selectedCampaign.category}
              </span>
              <h2 className={`text-xl font-black ${isLight ? 'text-gray-900' : 'text-white'}`}>{selectedCampaign.title}</h2>
              <p className={`text-xs leading-relaxed font-medium ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>{selectedCampaign.description}</p>
            </div>

            {/* Event Details Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium ${isLight ? 'text-gray-800' : 'text-slate-300'}`}>
              <div className={`p-3.5 rounded-2xl border space-y-1 ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'}`}>
                <span className={`text-[10px] font-bold block ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Organizer:</span>
                <span className={`font-extrabold ${isLight ? 'text-gray-900' : 'text-white'}`}>{selectedCampaign.organizerName}</span>
                <p className={`text-[10px] ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>{selectedCampaign.contactInfo}</p>
              </div>

              <div className={`p-3.5 rounded-2xl border space-y-1 ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'}`}>
                <span className={`text-[10px] font-bold block ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Date & Venue:</span>
                <span className={`font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{selectedCampaign.eventDate} ({selectedCampaign.eventTime})</span>
                <a
                  href={selectedCampaign.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-rose-600 hover:underline flex items-center gap-1 font-bold pt-1"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Actions Bar */}
            <div className={`flex items-center justify-between pt-3 border-t ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
              <button
                onClick={() => setInviteModalCampaign(selectedCampaign)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 ${
                  isLight ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <UserPlus className="w-4 h-4 text-rose-600" />
                <span>Invite Friends</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  Close
                </button>

                <button
                  onClick={() => handleToggleJoin(selectedCampaign.id)}
                  className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    selectedCampaign.isJoined
                      ? isLight ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : isLight ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs' : 'bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-lg shadow-rose-500/25'
                  }`}
                >
                  {selectedCampaign.isJoined ? 'Registered' : 'Register Now'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Host Campaign Modal */}
      {isHostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-lg border rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
            isLight ? 'bg-white border-rose-200 text-gray-900 shadow-2xs' : 'bg-slate-950 border-rose-500/50 text-white'
          }`}>
            
            <div className={`flex items-center justify-between pb-3 border-b ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
              <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-rose-800' : 'text-rose-400'
              }`}>
                <PlusCircle className="w-4 h-4" /> Host New Volunteer Drive
              </span>
              <button
                onClick={() => setIsHostModalOpen(false)}
                className={`p-1.5 rounded-full cursor-pointer ${
                  isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleHostSubmit} className={`space-y-3.5 text-xs ${isLight ? 'text-gray-800' : 'text-slate-300'}`}>
              
              <div>
                <label className={`font-bold block mb-1 ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>Campaign Event Name *</label>
                <input
                  type="text"
                  required
                  value={hostForm.title}
                  onChange={(e) => setHostForm({ ...hostForm, title: e.target.value })}
                  placeholder="e.g. Clean City Plastic Awareness Rally"
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                    isLight ? 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400' : 'bg-white/10 border-white/15 text-white placeholder-slate-400'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`font-bold block mb-1 ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>Category *</label>
                  <select
                    value={hostForm.category}
                    onChange={(e) => setHostForm({ ...hostForm, category: e.target.value as any })}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isLight ? 'bg-gray-50 border-gray-300 text-gray-900' : 'bg-slate-900 border-white/15 text-white'
                    }`}
                  >
                    {VOLUNTEER_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>Max Volunteers</label>
                  <input
                    type="number"
                    value={hostForm.volunteersNeeded}
                    onChange={(e) => setHostForm({ ...hostForm, volunteersNeeded: parseInt(e.target.value) || 50 })}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isLight ? 'bg-gray-50 border-gray-300 text-gray-900' : 'bg-white/10 border-white/15 text-white'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`font-bold block mb-1 ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>Description</label>
                <textarea
                  rows={2}
                  value={hostForm.description}
                  onChange={(e) => setHostForm({ ...hostForm, description: e.target.value })}
                  placeholder="Describe purpose, guidelines, and what volunteers should bring..."
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                    isLight ? 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400' : 'bg-white/10 border-white/15 text-white placeholder-slate-400'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`font-bold block mb-1 ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>Event Date *</label>
                  <input
                    type="date"
                    required
                    value={hostForm.eventDate}
                    onChange={(e) => setHostForm({ ...hostForm, eventDate: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isLight ? 'bg-gray-50 border-gray-300 text-gray-900' : 'bg-white/10 border-white/15 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>Event Time</label>
                  <input
                    type="text"
                    value={hostForm.eventTime}
                    onChange={(e) => setHostForm({ ...hostForm, eventTime: e.target.value })}
                    placeholder="08:00 AM - 12:00 PM"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isLight ? 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400' : 'bg-white/10 border-white/15 text-white placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`font-bold block mb-1 ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>Venue Address *</label>
                <input
                  type="text"
                  required
                  value={hostForm.venue}
                  onChange={(e) => setHostForm({ ...hostForm, venue: e.target.value })}
                  placeholder="e.g. Central Park, Main Gate"
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                    isLight ? 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400' : 'bg-white/10 border-white/15 text-white placeholder-slate-400'
                  }`}
                />
              </div>

              <div className={`pt-2 flex items-center justify-end gap-2 border-t ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
                <button
                  type="button"
                  onClick={() => setIsHostModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-black shadow-md cursor-pointer ${
                    isLight ? 'bg-rose-700 hover:bg-rose-800 text-white' : 'bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-rose-500/25'
                  }`}
                >
                  Publish Campaign (+400 XP)
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Log Hours Modal */}
      {isLogHoursOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-md border rounded-3xl p-6 shadow-2xl space-y-4 ${
            isLight ? 'bg-white border-rose-200 text-gray-900 shadow-2xs' : 'bg-slate-950 border-rose-500/50 text-white'
          }`}>
            
            <div className={`flex items-center justify-between pb-2 border-b ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
              <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-rose-800' : 'text-rose-400'
              }`}>
                <Clock className="w-4 h-4" /> Log Volunteer Hours & Claim Certificate
              </span>
              <button
                onClick={() => setIsLogHoursOpen(false)}
                className={`p-1.5 rounded-full cursor-pointer ${
                  isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLogHoursSubmit} className={`space-y-3 text-xs ${isLight ? 'text-gray-800' : 'text-slate-300'}`}>
              
              <div>
                <label className={`font-bold block mb-1 ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>Campaign Event Title</label>
                <input
                  type="text"
                  required
                  value={logHoursForm.campaignName}
                  onChange={(e) => setLogHoursForm({ ...logHoursForm, campaignName: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                    isLight ? 'bg-gray-50 border-gray-300 text-gray-900' : 'bg-white/10 border-white/15 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`font-bold block mb-1 ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>Number of Hours Served</label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  required
                  value={logHoursForm.hours}
                  onChange={(e) => setLogHoursForm({ ...logHoursForm, hours: parseInt(e.target.value) || 1 })}
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                    isLight ? 'bg-gray-50 border-gray-300 text-gray-900' : 'bg-white/10 border-white/15 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`font-bold block mb-1 ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>Brief Work Notes / Tasks Completed</label>
                <textarea
                  rows={2}
                  value={logHoursForm.notes}
                  onChange={(e) => setLogHoursForm({ ...logHoursForm, notes: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                    isLight ? 'bg-gray-50 border-gray-300 text-gray-900' : 'bg-white/10 border-white/15 text-white'
                  }`}
                />
              </div>

              <div className={`pt-2 flex items-center justify-end gap-2 border-t ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
                <button
                  type="button"
                  onClick={() => setIsLogHoursOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    isLight ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-black cursor-pointer shadow-md ${
                    isLight ? 'bg-rose-700 hover:bg-rose-800 text-white' : 'bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-rose-500/25'
                  }`}
                >
                  Log & Issue Certificate
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Invite Friends Modal */}
      {inviteModalCampaign && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-sm border rounded-3xl p-6 shadow-2xl space-y-4 text-center ${
            isLight ? 'bg-white border-rose-200 text-gray-900 shadow-2xs' : 'bg-slate-950 border-rose-500/50 text-white'
          }`}>
            
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mx-auto ${
              isLight ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
            }`}>
              <UserPlus className="w-6 h-6" />
            </div>

            <div>
              <h3 className={`text-base font-extrabold ${isLight ? 'text-gray-900' : 'text-white'}`}>Invite Friends to Join</h3>
              <p className={`text-xs mt-1 ${isLight ? 'text-gray-600' : 'text-slate-300'}`}>{inviteModalCampaign.title}</p>
            </div>

            <div className={`p-3 rounded-2xl border text-xs font-mono break-all select-all ${
              isLight ? 'bg-gray-50 border-gray-200 text-teal-800' : 'bg-black/60 border-white/10 text-cyan-400'
            }`}>
              https://civicai.app/volunteer/{inviteModalCampaign.id}?invite={user?.id || 'ref'}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`Join me for "${inviteModalCampaign.title}" on CivicAI! https://civicai.app/volunteer/${inviteModalCampaign.id}`);
                  alert('Invite link copied to clipboard!');
                  setInviteModalCampaign(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-black cursor-pointer"
              >
                Copy Invite Link
              </button>
              <button
                onClick={() => setInviteModalCampaign(null)}
                className="px-4 py-2.5 rounded-xl bg-white/10 text-slate-300 hover:bg-white/20 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
