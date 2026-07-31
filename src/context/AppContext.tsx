/**
 * Krithiq AI - Global Application Context
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  AuthSession,
  ThemeMode,
  SectionAccent,
  LanguageCode,
  UserRole,
  AuthStep,
  CivicReport,
  VerificationResult,
  CommunityPost,
  CommunityGroup,
  Reel,
  MapMarker,
  AccessibilitySettings,
  MissionChallenge,
  RewardItem,
  ComplaintStatus,
  SmartNotification,
} from '../types';

import {
  initialUser,
  initialCivicReports,
  initialMapMarkers,
  initialPosts,
  initialGroups,
  initialReels,
  initialChallenges,
  initialRewards,
} from '../data/mockData';

import {
  getStoredSession,
  saveSession,
  getStoredUser,
  saveUser,
  getStoredAuthStep,
  saveAuthStep,
  clearAuthStorage,
  generateSecureToken,
} from '../utils/authStorage';

import {
  t as translateHelper,
} from '../utils/translations';

export type NavTab =
  | 'dashboard'
  | 'assistant'
  | 'verification'
  | 'civic'
  | 'map'
  | 'community'
  | 'reels'
  | 'transparency'
  | 'schemes'
  | 'volunteers'
  | 'rewards'
  | 'profile';

interface AppContextType {
  // Navigation & Theme
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  goBack: () => void;
  accentColor: SectionAccent;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  
  // Auth & Onboarding Lifecycle
  authStep: AuthStep;
  setAuthStep: (step: AuthStep) => void;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  session: AuthSession;
  switchUserRole: (role: UserRole) => void;
  completeOnboarding: (profileData: Partial<User>) => void;
  loginUser: (userData?: Partial<User>) => void;
  loginWithGoogle: (email?: string, name?: string, avatar?: string) => void;
  loginWithEmailOtp: (email: string, otp: string) => void;
  loginWithPhoneSms: (phone: string, otp: string) => void;
  loginWithBiometrics: () => boolean;
  logout: () => void;

  // Civic Reports
  reports: CivicReport[];
  addCivicReport: (report: CivicReport) => void;
  updateReportStatus: (id: string, newStatus: ComplaintStatus, actor: string, note: string) => void;
  confirmReportResolution: (id: string) => void;
  reopenReport: (id: string, reason: string) => void;
  upvoteReport: (id: string) => void;

  // Map Markers
  mapMarkers: MapMarker[];

  // Verification Results History
  verificationHistory: VerificationResult[];
  addVerificationResult: (res: VerificationResult) => void;

  // Community Posts & Groups
  posts: CommunityPost[];
  addPost: (post: CommunityPost) => void;
  votePost: (postId: string, direction: 'up' | 'down') => void;
  addComment: (postId: string, commentText: string) => void;
  votePollOption: (postId: string, optionId: string) => void;
  groups: CommunityGroup[];
  toggleGroupJoin: (groupId: string) => void;

  // Reels
  reels: Reel[];
  addReel: (reel: Reel) => void;
  toggleLikeReel: (reelId: string) => void;
  toggleSaveReel: (reelId: string) => void;
  toggleFollowCreator: (creatorId: string) => void;

  // Modal Controls
  isCreatorStudioOpen: boolean;
  setCreatorStudioOpen: (open: boolean) => void;

  // Accessibility
  accessibility: AccessibilitySettings;
  setAccessibility: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  toggleElderlyMode: () => void;

  // Gamification & Rewards
  challenges: MissionChallenge[];
  rewards: RewardItem[];
  addXp: (amount: number, reason: string) => void;
  redeemReward: (rewardId: string) => boolean;
  claimChallengeReward: (challengeId: string) => void;

  // Offline & Notifications
  isOffline: boolean;
  offlineQueueCount: number;
  triggerSync: () => void;
  notifications: SmartNotification[];
  markNotificationRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  // Modal Controls
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  isReportingModalOpen: boolean;
  setReportingModalOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setSettingsModalOpen: (open: boolean) => void;
  isAccessibilityDrawerOpen: boolean;
  setAccessibilityDrawerOpen: (open: boolean) => void;
  isRewardsModalOpen: boolean;
  setRewardsModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setProfileModalOpen: (open: boolean) => void;
  isLocationModalOpen: boolean;
  setLocationModalOpen: (open: boolean) => void;
  isNotificationsModalOpen: boolean;
  setNotificationsModalOpen: (open: boolean) => void;
  selectedCreatorId: string | null;
  setSelectedCreatorId: (id: string | null) => void;
  openCreatorProfile: (creatorId: string) => void;

  // Location Services State
  currentLocation: {
    name: string;
    coordinates: { lat: number; lng: number };
    radiusKm: number;
    isGpsActive: boolean;
  };
  setCurrentLocation: React.Dispatch<
    React.SetStateAction<{
      name: string;
      coordinates: { lat: number; lng: number };
      radiusKm: number;
      isGpsActive: boolean;
    }>
  >;

  // Bookmarks & Saved Items
  savedPosts: string[];
  toggleSavePost: (postId: string) => void;
  bookmarkedReports: string[];
  toggleBookmarkReport: (reportId: string) => void;

  // City Metrics
  metrics: {
    totalComplaintsFiled: number;
    resolvedComplaints: number;
    avgResolutionTimeHours: number;
    slaComplianceRate: number;
    departmentStats: Array<{
      name: string;
      totalAssigned: number;
      solved: number;
      avgHours: number;
      satisfactionRating: number;
    }>;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<NavTab>('dashboard');
  const [tabHistory, setTabHistory] = useState<NavTab[]>(['dashboard']);

  const setActiveTab = (newTab: NavTab) => {
    setActiveTabState(newTab);
    setTabHistory((prev) => {
      if (prev[prev.length - 1] === newTab) return prev;
      return [...prev.slice(-15), newTab];
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setTabHistory((prev) => {
      if (prev.length <= 1) {
        setActiveTabState('dashboard');
        return ['dashboard'];
      }
      const updated = prev.slice(0, -1);
      const target = updated[updated.length - 1] || 'dashboard';
      setActiveTabState(target);
      return updated;
    });
  };
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('krithiq_theme') as ThemeMode) || 'light';
  });
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('krithiq_language') as LanguageCode) || 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('krithiq_language', lang);
    setUser((prev) => {
      const updated = { ...prev, preferredLanguage: lang };
      saveUser(updated);
      return updated;
    });
  };

  const tFunc = (key: string, fallback?: string) => translateHelper(key, language, fallback);

  // Load persistent auth state or fallback
  const storedSession = getStoredSession();
  const storedUser = getStoredUser();
  const storedStep = getStoredAuthStep();

  const [authStep, setAuthStepState] = useState<AuthStep>(
    storedSession?.isAuthenticated ? 'authenticated' : (storedStep || 'splash')
  );

  const [user, setUser] = useState<User>(storedUser || initialUser);

  const [session, setSession] = useState<AuthSession>(
    storedSession || {
      isAuthenticated: false,
      user: null,
      biometricsEnabled: true,
      devices: [
        { id: 'd1', deviceName: 'Samsung Galaxy S24 Ultra (Active)', lastActive: 'Just now', isCurrentDevice: true },
        { id: 'd2', deviceName: 'Chrome / Linux AI Studio Container', lastActive: '2 mins ago', isCurrentDevice: false },
      ],
    }
  );

  const setAuthStep = (step: AuthStep) => {
    setAuthStepState(step);
    saveAuthStep(step);
  };

  const [reports, setReports] = useState<CivicReport[]>(initialCivicReports);
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>(initialMapMarkers);
  const [verificationHistory, setVerificationHistory] = useState<VerificationResult[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [groups, setGroups] = useState<CommunityGroup[]>(initialGroups);
  const [reels, setReels] = useState<Reel[]>(initialReels);
  const [challenges, setChallenges] = useState<MissionChallenge[]>(initialChallenges);
  const [rewards, setRewards] = useState<RewardItem[]>(initialRewards);

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    elderlyMode: false,
    largeText: false,
    highContrast: false,
    voiceNavigationEnabled: true,
    ttsSpeed: 1.0,
    autoReadAIAnswers: false,
  });

  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);

  const [notifications, setNotifications] = useState<SmartNotification[]>([
    {
      id: 'n1',
      title: '✔️ Issue Resolved: Complaint VRX-2026-9812',
      body: 'GHMC Engineering squad completed asphalt re-laying for Cyber Towers pothole. Please rate your experience!',
      time: '12m ago',
      timestampGroup: 'Today',
      read: false,
      priority: 'success',
      category: 'complaints',
      progressStep: 'resolved',
      complaintId: 'VRX-2026-9812',
      actionLabel: 'Rate Experience',
      actionTab: 'civic',
    },
    {
      id: 'n2',
      title: '🔴 Water Leakage 200m From Your Location',
      body: 'Major mainline fracture reported near Mindspace Road entrance. GHMC water tanker on site.',
      time: '25m ago',
      timestampGroup: 'Today',
      read: false,
      priority: 'critical',
      category: 'nearby',
      locationDistance: '200m away',
      actionLabel: 'View on Map',
      actionTab: 'map',
    },
    {
      id: 'n3',
      title: '🟠 Eligible: PM Kisan Samman Nidhi Scheme',
      body: 'AI matched your profile in Ward 107 for ₹6,000 annual direct benefit transfer. Submit Aadhaar e-KYC.',
      time: '2h ago',
      timestampGroup: 'Today',
      read: false,
      priority: 'important',
      category: 'schemes',
      schemeId: 'scheme_1',
      actionLabel: 'Claim Benefit',
      actionTab: 'schemes',
    },
    {
      id: 'n4',
      title: '🚧 Work Started: Pothole Patching #1072',
      body: 'Sanitation & road engineering squad has begun asphalt work near Hitec City Metro Station.',
      time: '3h ago',
      timestampGroup: 'Today',
      read: false,
      priority: 'important',
      category: 'complaints',
      progressStep: 'in_progress',
      complaintId: 'VRX-2026-1072',
      actionLabel: 'Track Progress',
      actionTab: 'civic',
    },
    {
      id: 'n5',
      title: '📊 AI Civic Insight: Ward Resolution Speed +18%',
      body: '15 potholes were resolved in your ward this week! Overall municipal resolution speed improved by 18%.',
      time: '5h ago',
      timestampGroup: 'Today',
      read: false,
      priority: 'informational',
      category: 'insights',
      aiInsightStat: '15 Resolved',
      actionLabel: 'View Insights',
      actionTab: 'transparency',
    },
    {
      id: 'n6',
      title: '🔵 Haritha Haram Plantation Drive Tomorrow',
      body: 'Tree plantation campaign at Durgam Cheruvu Park starts at 7 AM. 150+ volunteers joined.',
      time: 'Yesterday',
      timestampGroup: 'Yesterday',
      read: true,
      priority: 'informational',
      category: 'campaigns',
      campaignId: 'camp_1',
      actionLabel: 'Join Drive',
      actionTab: 'volunteers',
    },
    {
      id: 'n7',
      title: '🔴 Scholarship Renewal Due in 5 Days',
      body: 'Telangana Overseas Vidya Nidhi document verification deadline is March 31. Upload fee receipts.',
      time: 'Yesterday',
      timestampGroup: 'Yesterday',
      read: false,
      priority: 'critical',
      category: 'schemes',
      schemeId: 'scheme_3',
      actionLabel: 'Renew Now',
      actionTab: 'schemes',
    },
    {
      id: 'n8',
      title: '👨💼 Assigned: Drainage Overflow #881',
      body: 'Complaint assigned to Municipal Executive Engineer Vijay Kumar for dispatch within 24 hours.',
      time: 'Yesterday',
      timestampGroup: 'Yesterday',
      read: true,
      priority: 'informational',
      category: 'complaints',
      progressStep: 'assigned',
      complaintId: 'VRX-2026-881',
      actionLabel: 'View Status',
      actionTab: 'civic',
    },
    {
      id: 'n9',
      title: '🔵 42 Replies on Waste Management Poll',
      body: 'Neighbors in Ward 107 overwhelmingly voted in favor of twice-daily segregated trash collection.',
      time: '2 days ago',
      timestampGroup: 'Earlier',
      read: true,
      priority: 'informational',
      category: 'community',
      postId: 'post_1',
      actionLabel: 'View Discussion',
      actionTab: 'community',
    },
    {
      id: 'n10',
      title: '🟢 Cleanliness Score Improved +12%',
      body: 'Your district cleanliness index rose to 88/100 following community weekend cleanup drives.',
      time: '4 days ago',
      timestampGroup: 'Earlier',
      read: true,
      priority: 'success',
      category: 'insights',
      aiInsightStat: '+12% Cleanliness',
      actionLabel: 'View Ranking',
      actionTab: 'transparency',
    },
  ]);

  // Modals
  const [isCreatorStudioOpen, setCreatorStudioOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isReportingModalOpen, setReportingModalOpen] = useState(false);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isAccessibilityDrawerOpen, setAccessibilityDrawerOpen] = useState(false);
  const [isRewardsModalOpen, setRewardsModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [isNotificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);

  const openCreatorProfile = (creatorId: string) => {
    setSelectedCreatorId(creatorId);
  };

  // Location tracking state
  const [currentLocation, setCurrentLocation] = useState({
    name: 'Madhapur, Hyderabad (Ward 107)',
    coordinates: { lat: 17.4486, lng: 78.3908 },
    radiusKm: 5,
    isGpsActive: true,
  });

  // Bookmarks & Saved Items
  const [savedPosts, setSavedPosts] = useState<string[]>(['post_1']);
  const [bookmarkedReports, setBookmarkedReports] = useState<string[]>(['VRX-2026-9812']);

  const toggleSavePost = (postId: string) => {
    setSavedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const toggleBookmarkReport = (reportId: string) => {
    setBookmarkedReports((prev) =>
      prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Monitor Network
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Compute section accent color dynamically per tab
  const getSectionAccent = (tab: NavTab): SectionAccent => {
    switch (tab) {
      case 'assistant':
        return 'cyan';
      case 'verification':
        return 'emerald';
      case 'civic':
        return 'orange';
      case 'community':
        return 'violet';
      case 'reels':
        return 'neon';
      case 'map':
        return 'earth';
      case 'rewards':
      case 'transparency':
      case 'profile':
        return 'gold';
      default:
        return 'cyan';
    }
  };

  const accentColor = getSectionAccent(activeTab);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('krithiq_theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const updateAccessibility = (settings: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...settings }));
  };

  const toggleElderlyMode = () => {
    setAccessibility((prev) => {
      const next = !prev.elderlyMode;
      return {
        ...prev,
        elderlyMode: next,
        largeText: next,
        highContrast: next,
        autoReadAIAnswers: next,
      };
    });
  };

  // Auth & Onboarding Actions
  const switchUserRole = (newRole: UserRole) => {
    setUser((prev) => {
      const updated = { ...prev, role: newRole };
      saveUser(updated);
      return updated;
    });
    setSession((prev) => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, role: newRole };
      const updatedSession = { ...prev, user: updatedUser };
      saveSession(updatedSession);
      return updatedSession;
    });
  };

  const completeOnboarding = (profileData: Partial<User>) => {
    const token = generateSecureToken();
    const completedUser: User = {
      ...initialUser,
      ...user,
      ...profileData,
      token,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    const newSession: AuthSession = {
      isAuthenticated: true,
      user: completedUser,
      token,
      biometricsEnabled: true,
      devices: [
        { id: `dev_${Date.now()}`, deviceName: 'Active Session Device', lastActive: 'Just now', isCurrentDevice: true },
      ],
    };

    setUser(completedUser);
    setSession(newSession);
    saveUser(completedUser);
    saveSession(newSession);
    setAuthStep('authenticated');
    setAuthModalOpen(false);
  };

  const loginUser = (userData?: Partial<User>) => {
    setUser((prev) => {
      const updated = { ...prev, ...(userData || {}) };
      saveUser(updated);
      return updated;
    });
    setAuthStep('role_select');
    setAuthModalOpen(false);
  };

  const loginWithGoogle = (email?: string, name?: string, avatar?: string) => {
    setUser((prev) => {
      const updated = {
        ...prev,
        email: email || prev.email,
        name: name || prev.name,
        avatar: avatar || prev.avatar,
      };
      saveUser(updated);
      return updated;
    });
    setAuthStep('role_select');
    setAuthModalOpen(false);
  };

  const loginWithEmailOtp = (email: string, otp: string) => {
    setUser((prev) => {
      const updated = { ...prev, email };
      saveUser(updated);
      return updated;
    });
    setAuthStep('role_select');
    setAuthModalOpen(false);
  };

  const loginWithPhoneSms = (phone: string, otp: string) => {
    setUser((prev) => {
      const updated = { ...prev, phone };
      saveUser(updated);
      return updated;
    });
    setAuthStep('role_select');
    setAuthModalOpen(false);
  };

  const loginWithBiometrics = (): boolean => {
    setAuthStep('role_select');
    setAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    clearAuthStorage();
    setSession({ isAuthenticated: false, user: null, biometricsEnabled: true, devices: [] });
    setUser(initialUser);
    setAuthStep('splash');
  };

  // XP & Gamification
  const addXp = (amount: number, reason: string) => {
    setUser((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 300) + 1;
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        reputationLevel: `Civic Guardian Level ${newLevel}`,
      };
    });
  };

  const redeemReward = (rewardId: string): boolean => {
    const target = rewards.find((r) => r.id === rewardId);
    if (!target || target.isRedeemed) return false;
    if (user.xp < target.xpCost) return false;

    setUser((prev) => ({ ...prev, xp: prev.xp - target.xpCost }));
    setRewards((prev) => prev.map((r) => (r.id === rewardId ? { ...r, isRedeemed: true } : r)));
    return true;
  };

  const claimChallengeReward = (challengeId: string) => {
    const target = challenges.find((c) => c.id === challengeId);
    if (!target || target.completed) return;

    setChallenges((prev) => prev.map((c) => (c.id === challengeId ? { ...c, completed: true } : c)));
    addXp(target.rewardXp, `Completed Mission: ${target.title}`);
  };

  // Civic Report Operations
  const addCivicReport = (report: CivicReport) => {
    if (isOffline) {
      setOfflineQueueCount((c) => c + 1);
    }
    setReports((prev) => [report, ...prev]);

    // Add map marker
    const newMarker: MapMarker = {
      id: `m_${report.id}`,
      reportId: report.id,
      type: report.category,
      title: report.title,
      lat: report.coordinates.lat,
      lng: report.coordinates.lng,
      severity: report.severity,
      status: report.status,
      address: report.locationName,
      timestamp: 'Just now',
    };
    setMapMarkers((prev) => [newMarker, ...prev]);

    addXp(100, 'Filed a Civic Complaint');
  };

  const updateReportStatus = (id: string, newStatus: ComplaintStatus, actor: string, note: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const newTimeline = [
            ...r.timeline,
            {
              status: newStatus,
              timestamp: new Date().toLocaleString(),
              description: note,
              actor,
            },
          ];
          return {
            ...r,
            status: newStatus,
            timeline: newTimeline,
            updatedTimestamp: new Date().toISOString(),
          };
        }
        return r;
      })
    );
  };

  const confirmReportResolution = (id: string) => {
    updateReportStatus(id, 'Resolved', 'Citizen Confirmation', 'Citizen inspected site and confirmed complete resolution.');
    addXp(150, 'Verified Resolved Civic Issue');
  };

  const reopenReport = (id: string, reason: string) => {
    updateReportStatus(id, 'Reopened', 'Citizen Re-Open', `Issue reopened by citizen: ${reason}`);
  };

  const upvoteReport = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotesCount: r.upvotesCount + 1 } : r))
    );
  };

  const addVerificationResult = (res: VerificationResult) => {
    setVerificationHistory((prev) => [res, ...prev]);
    addXp(40, 'Ran AI Verification Engine');
  };

  // Community
  const addPost = (post: CommunityPost) => {
    setPosts((prev) => [post, ...prev]);
    addXp(60, 'Created Community Post');
  };

  const votePost = (postId: string, direction: 'up' | 'down') => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          if (p.userVote === direction) {
            // Undo vote
            return {
              ...p,
              userVote: null,
              upvotesCount: direction === 'up' ? p.upvotesCount - 1 : p.upvotesCount,
              downvotesCount: direction === 'down' ? p.downvotesCount - 1 : p.downvotesCount,
            };
          } else {
            return {
              ...p,
              userVote: direction,
              upvotesCount: direction === 'up' ? p.upvotesCount + 1 : p.userVote === 'up' ? p.upvotesCount - 1 : p.upvotesCount,
              downvotesCount: direction === 'down' ? p.downvotesCount + 1 : p.userVote === 'down' ? p.downvotesCount - 1 : p.downvotesCount,
            };
          }
        }
        return p;
      })
    );
  };

  const addComment = (postId: string, commentText: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c_${Date.now()}`,
            authorName: user.name,
            authorAvatar: user.avatar,
            text: commentText,
            timestamp: 'Just now',
            upvotes: 0,
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );
  };

  const votePollOption = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.pollOptions && !p.userPollVoteId) {
          const updatedOptions = p.pollOptions.map((opt) =>
            opt.id === optionId ? { ...opt, votesCount: opt.votesCount + 1 } : opt
          );
          return {
            ...p,
            pollOptions: updatedOptions,
            pollTotalVotes: (p.pollTotalVotes || 0) + 1,
            userPollVoteId: optionId,
          };
        }
        return p;
      })
    );
  };

  const toggleGroupJoin = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const next = !g.isJoined;
          return {
            ...g,
            isJoined: next,
            membersCount: next ? g.membersCount + 1 : g.membersCount - 1,
          };
        }
        return g;
      })
    );
  };

  // Reels
  const addReel = (reel: Reel) => {
    setReels((prev) => [reel, ...prev]);
    addXp(150, 'Published a SYNKS Civic Update');
  };

  const toggleLikeReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const next = !r.isLiked;
          return {
            ...r,
            isLiked: next,
            likesCount: next ? r.likesCount + 1 : r.likesCount - 1,
          };
        }
        return r;
      })
    );
  };

  const toggleSaveReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => (r.id === reelId ? { ...r, isSaved: !r.isSaved } : r))
    );
  };

  const toggleFollowCreator = (creatorId: string) => {
    setReels((prev) =>
      prev.map((r) =>
        r.creatorId === creatorId ? { ...r, isFollowingCreator: !r.isFollowingCreator } : r
      )
    );
  };

  const triggerSync = () => {
    setOfflineQueueCount(0);
    setIsOffline(false);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        goBack,
        accentColor,
        theme,
        setTheme,
        language,
        setLanguage,
        t: tFunc,

        user,
        setUser,
        session,
        authStep,
        setAuthStep,
        switchUserRole,
        completeOnboarding,
        loginUser,
        loginWithGoogle,
        loginWithEmailOtp,
        loginWithPhoneSms,
        loginWithBiometrics,
        logout,

        reports,
        addCivicReport,
        updateReportStatus,
        confirmReportResolution,
        reopenReport,
        upvoteReport,

        mapMarkers,
        verificationHistory,
        addVerificationResult,

        posts,
        addPost,
        votePost,
        addComment,
        votePollOption,
        groups,
        toggleGroupJoin,

        reels,
        addReel,
        toggleLikeReel,
        toggleSaveReel,
        toggleFollowCreator,

        accessibility,
        setAccessibility,
        updateAccessibility,
        toggleElderlyMode,

        challenges,
        rewards,
        addXp,
        redeemReward,
        claimChallengeReward,

        isOffline,
        offlineQueueCount,
        triggerSync,
        notifications,
        markNotificationRead,
        deleteNotification,
        markAllNotificationsRead,
        clearNotifications,

        isCreatorStudioOpen,
        setCreatorStudioOpen,
        isAuthModalOpen,
        setAuthModalOpen,
        isReportingModalOpen,
        setReportingModalOpen,
        isSearchModalOpen,
        setSearchModalOpen,
        isSettingsModalOpen,
        setSettingsModalOpen,
        isAccessibilityDrawerOpen,
        setAccessibilityDrawerOpen,
        isRewardsModalOpen,
        setRewardsModalOpen,
        isProfileModalOpen,
        setProfileModalOpen,
        isLocationModalOpen,
        setLocationModalOpen,
        isNotificationsModalOpen,
        setNotificationsModalOpen,
        selectedCreatorId,
        setSelectedCreatorId,
        openCreatorProfile,

        currentLocation,
        setCurrentLocation,
        savedPosts,
        toggleSavePost,
        bookmarkedReports,
        toggleBookmarkReport,

        metrics: {
          totalComplaintsFiled: 14250,
          resolvedComplaints: 13410,
          avgResolutionTimeHours: 28.4,
          slaComplianceRate: 94.1,
          departmentStats: [
            { name: 'Sanitation & Solid Waste (GHMC)', totalAssigned: 5390, solved: 5210, avgHours: 18.2, satisfactionRating: 4.8 },
            { name: 'Road Infrastructure & Bridges', totalAssigned: 3710, solved: 3400, avgHours: 36.5, satisfactionRating: 4.5 },
            { name: 'Water Supply & Sewerage (HMWS&SB)', totalAssigned: 3030, solved: 2890, avgHours: 24.0, satisfactionRating: 4.6 },
            { name: 'Electricity & Lighting (TSSPDCL)', totalAssigned: 2120, solved: 1910, avgHours: 16.8, satisfactionRating: 4.7 },
          ],
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
