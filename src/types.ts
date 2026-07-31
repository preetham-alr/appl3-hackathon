/**
 * Krithiq AI - Global Types & Interfaces
 */

export type ThemeMode = 'black' | 'light' | 'system';

export type SectionAccent = 'cyan' | 'emerald' | 'orange' | 'violet' | 'neon' | 'earth' | 'gold';

export type LanguageCode = 'en' | 'te' | 'hi' | 'ta' | 'kn' | 'ml' | 'mr' | 'gu' | 'bn' | 'pa';

export type UserRole = 'citizen' | 'government' | 'ngo';

export type AuthStep = 'splash' | 'login' | 'signup' | 'forgot' | 'role_select' | 'profile_setup' | 'authenticated';

export interface CivicAffiliation {
  id: string;
  title: string;
  organization: string;
  period: string;
  isCurrent?: boolean;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

export interface UserAchievement {
  id: string;
  title: string;
  dateEarned: string;
  category: 'Milestone' | 'Badge' | 'Certificate' | 'Reward' | 'Volunteer';
  icon: string;
  description: string;
  issuer?: string;
  credentialUrl?: string;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'Fixes' | 'Community' | 'Audits' | 'Governance' | 'Leadership';
  isUnlocked: boolean;
  progress: number; // 0-100
  unlockedDate?: string;
  xpValue: number;
}

export interface NetworkConnection {
  id: string;
  name: string;
  avatar: string;
  tagline: string;
  role: UserRole;
  location: string;
  trustScore: number;
  isFollowing: boolean;
  sharedWard?: string;
  mutualCount?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  coverPhoto?: string;
  tagline?: string;
  role: UserRole;
  state?: string;
  district?: string;
  city?: string;
  preferredLanguage?: LanguageCode;
  departmentName?: string; // For Government workers e.g. "GHMC Sanitation & Roads"
  organizationName?: string; // For NGO/Volunteers e.g. "Clean India Foundation"
  trustScore: number; // 0-100
  reputationLevel: string; // e.g. "Civic Champion Level 5"
  xp: number;
  level: number;
  streakDays: number;
  isVerified: boolean;
  isCreator: boolean;
  followersCount: number;
  followingCount: number;
  impactScore: number;
  bio?: string;
  locationName: string;
  coordinates?: { lat: number; lng: number };
  civicAffiliations?: CivicAffiliation[];
  socialLinks?: SocialLinks;
  skills?: string[];
  achievements?: UserAchievement[];
  badges?: UserBadge[];
  networkConnections?: NetworkConnection[];
  // Scheme matching fields
  age?: number;
  occupation?: string;
  incomeLevel?: string;
  gender?: 'male' | 'female' | 'other';
  isStudent?: boolean;
  isFarmer?: boolean;
  isDisabilityStatus?: boolean;
  token?: string;
  createdAt?: string;
}

export interface AuthSession {
  isAuthenticated: boolean;
  user: User | null;
  token?: string;
  biometricsEnabled: boolean;
  devices: {
    id: string;
    deviceName: string;
    lastActive: string;
    isCurrentDevice: boolean;
  }[];
}

export interface TrustScoreBreakdown {
  overallScore: number;
  historicalAccuracy: number;
  communityVerification: number;
  sourceReliability: number;
  crossVerificationScore: number;
  badgeLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Elite Diamond';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  attachments?: {
    type: 'image' | 'video' | 'audio' | 'document';
    url: string;
    name?: string;
  }[];
  audioUrl?: string; // For TTS playback
  structuredData?: any;
}

export type AssistantCategory = 
  | 'general'
  | 'civic_guidance'
  | 'govt_schemes'
  | 'complaint_drafter'
  | 'product_advisor'
  | 'fake_news_checker'
  | 'elderly_support'
  | 'emergency_help';

export type VerificationType = 
  | 'fake_news'
  | 'fake_review'
  | 'qr_barcode'
  | 'product_counterfeit'
  | 'deepfake_image'
  | 'video_analysis'
  | 'social_post'
  | 'document_ocr';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface VerificationResult {
  id: string;
  type: VerificationType;
  queryOrAsset: string;
  trustScore: number; // 0-100
  confidenceScore: number; // 0-100
  riskLevel: RiskLevel;
  verdict: string;
  explanation: string;
  authenticityBreakdown: {
    label: string;
    score: number;
  }[];
  recommendations: string[];
  timestamp: string;
  productDetails?: {
    brandName?: string;
    manufacturingOrigin?: string;
    batchNumber?: string;
    isAuthorizedSeller?: boolean;
    recallStatus?: string;
  };
}

export type ComplaintCategory = 
  | 'potholes_roads'
  | 'garbage_waste'
  | 'water_sewerage'
  | 'electricity_lights'
  | 'public_safety'
  | 'traffic_transit'
  | 'counterfeit_fraud'
  | 'environment_parks'
  | 'other';

export type ComplaintStatus = 
  | 'Submitted'
  | 'AI Analysis'
  | 'Assigned'
  | 'Inspection'
  | 'In Progress'
  | 'Escalated'
  | 'Citizen Verification'
  | 'Resolved'
  | 'Reopened';

export interface TimelineEvent {
  status: ComplaintStatus;
  timestamp: string;
  description: string;
  actor: string; // e.g. "AI Engine", "GHMC Municipal Officer", "Citizen"
  photos?: string[];
}

export interface BeforeAfterComparison {
  beforePhoto: string;
  afterPhoto: string;
  aiMatchScore: number; // e.g. 96%
  aiFindings: string;
  isConfirmedByCitizen?: boolean;
}

export interface CivicReport {
  id: string; // VRX-2026-XXXX
  title: string;
  description: string;
  category: ComplaintCategory;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  urgencyDays: number;
  status: ComplaintStatus;
  locationName: string;
  coordinates: { lat: number; lng: number };
  media: {
    type: 'image' | 'video' | 'audio';
    url: string;
  }[];
  authorName: string;
  authorId: string;
  assignedDepartment: string;
  assignedOfficer?: string;
  slaTargetHours: number;
  slaHoursRemaining: number;
  isEscalated: boolean;
  timeline: TimelineEvent[];
  beforeAfter?: BeforeAfterComparison;
  upvotesCount: number;
  createdTimestamp: string;
  updatedTimestamp: string;
}

export interface MapMarker {
  id: string;
  reportId?: string;
  type: ComplaintCategory | 'event' | 'safety_alert';
  title: string;
  lat: number;
  lng: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: string;
  address: string;
  timestamp: string;
  createdDate?: string; // YYYY-MM-DD or ISO string for timeline filter
  aiSummary?: string;
  supportersCount?: number;
  distanceKm?: number;
}

export interface GovernmentAsset {
  id: string;
  name: string;
  type: 'ward_office' | 'police' | 'hospital' | 'drf_depot' | 'eseva' | 'fire_station';
  categoryLabel: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  operatingHours: string;
  icon: string;
}

export type PostType = 'text' | 'photo' | 'video' | 'poll' | 'question' | 'event';

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  upvotes: number;
  isBestAnswer?: boolean;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorTitle?: string;
  isVerifiedExpert?: boolean;
  groupId?: string;
  groupName?: string;
  type: PostType;
  title?: string;
  content: string;
  mediaUrl?: string;
  pollOptions?: { id: string; optionText: string; votesCount: number }[];
  pollTotalVotes?: number;
  userPollVoteId?: string;
  upvotesCount: number;
  downvotesCount: number;
  userVote?: 'up' | 'down' | null;
  commentsCount: number;
  comments: PostComment[];
  isSolved?: boolean;
  aiSummary?: string;
  createdTimestamp: string;
  locationTag?: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  type: 'Village' | 'City' | 'Area' | 'Apartment' | 'Ward' | 'College' | 'Tech' | 'Environment' | 'Business';
  description: string;
  bannerImage: string;
  membersCount: number;
  isJoined: boolean;
  locationName: string;
  moderationScore: number;
}

export interface Reel {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  creatorId: string;
  creatorHandle?: string;
  creatorTitle?: string;
  isVerifiedCreator?: boolean;
  isVerified?: boolean;
  trustScore?: number;
  videoUrl: string;
  thumbnailUrl: string;
  title?: string;
  caption: string;
  category?: string;
  locationName?: string;
  createdTimestamp?: string;
  aiSummary: string;
  aiCaptionsEn?: string;
  aiCaptionsTe?: string;
  aiCaptionsHi?: string;
  aiCaptionsTa?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isFollowingCreator?: boolean;
  safetyRating?: 'Verified Safe' | 'Educational' | 'Community Watch' | 'Verified Eco' | 'Govt Verified' | 'Community Drive' | string;
  factCheckBadge?: string;
  misinformationRiskScore?: number;
  audioTrackName?: string;
}

export interface CityMetrics {
  cityName: string;
  totalComplaints: number;
  pendingComplaints: number;
  solvedComplaints: number;
  resolutionRatePercent: number;
  avgResolutionTimeHours: number;
  cityScore: number; // 0-100
  stateScore: number;
}

export interface DepartmentPerformance {
  departmentName: string;
  iconName: string;
  resolvedCount: number;
  pendingCount: number;
  avgHours: number;
  satisfactionScore: number; // 0-100
}

export interface AreaRanking {
  rank: number;
  areaName: string;
  score: number;
  complaintsResolved: number;
  badge: string;
}

export interface MissionChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  type: 'daily' | 'weekly' | 'monthly';
  progress: number; // e.g. 1
  totalRequired: number; // e.g. 3
  isCompleted: boolean;
}

export interface RewardItem {
  id: string;
  title: string;
  category: 'Civic Pass' | 'Eco Discount' | 'Certificate' | 'Badge';
  xpCost: number;
  description: string;
  code: string;
  isRedeemed?: boolean;
}

export interface AccessibilitySettings {
  elderlyMode: boolean;
  largeText: boolean;
  highContrast: boolean;
  voiceNavigationEnabled: boolean;
  ttsSpeed: number;
  autoReadAIAnswers: boolean;
}

// Government Schemes Types
export type SchemeCategory =
  | 'Recommended'
  | 'Central Government'
  | 'State Government'
  | 'Recently Added'
  | 'Expiring Soon'
  | 'Active Applications'
  | 'Saved'
  | 'Scholarship'
  | 'Pension'
  | 'Farmer'
  | 'Women Welfare'
  | 'Startup & MSME';

export interface GovtScheme {
  id: string;
  name: string;
  category: SchemeCategory;
  govtType: 'Central' | 'State';
  stateName?: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  requiredDocuments: string[];
  lastDate: string;
  estimatedProcessingTime: string;
  officialWebsite: string;
  matchScore?: number; // 0-100% calculated
  isSaved?: boolean;
  isApplied?: boolean;
  applicationStatus?: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Disbursed';
  applicationId?: string;
  // Trust Index & Verification
  trustIndex: number; // 0-100 score indicating trustworthiness
  isDirectGovtWebsite: boolean; // true if directly from official govt website (.gov.in / .nic.in)
  trustBadgeLabel?: string; // e.g. 'Official Central Govt Portal', 'Direct Ministry Site (.gov.in)', 'State Revenue Direct'
  trustSourceDomain?: string; // e.g. 'pmkisan.gov.in'
  trustVerificationFactors?: string[]; // Verification checks backing the score
  // Criteria filters
  targetMinAge?: number;
  targetMaxAge?: number;
  targetGender?: 'male' | 'female' | 'other' | 'all';
  targetOccupations?: string[];
  targetMaxIncome?: number; // in INR e.g. 500000
  requiresStudent?: boolean;
  requiresFarmer?: boolean;
  requiresDisability?: boolean;
}

export interface SchemeRenewalReminder {
  id: string;
  schemeId: string;
  schemeName: string;
  expiryDate: string;
  daysRemaining: number;
  status: '30_days' | '15_days' | '7_days' | '1_day' | 'expired' | 'renewed';
  channels: {
    push: boolean;
    inApp: boolean;
    email: boolean;
    sms: boolean;
  };
  requiredDocs: string[];
  renewalUrl?: string;
}

// Volunteer Campaigns Types
export type VolunteerCategory =
  | 'Beach Cleanups'
  | 'Park Cleaning'
  | 'Tree Plantation'
  | 'Blood Donation Camps'
  | 'Book Donation Drives'
  | 'Food Distribution'
  | 'Clothes Donation'
  | 'Animal Rescue'
  | 'School Volunteering'
  | 'Awareness Rallies'
  | 'Disaster Relief'
  | 'Medical Camps'
  | 'River Cleaning'
  | 'Plastic Collection'
  | 'E-Waste Drives'
  | 'Women Empowerment'
  | 'Senior Citizen Assistance'
  | 'Child Education Programs'
  | 'Community Health Camps'
  | 'Road Safety Campaigns';

export interface VolunteerCampaign {
  id: string;
  title: string;
  category: VolunteerCategory;
  categories?: string[];
  description: string;
  coverImage: string;
  organizerName: string;
  organizerAvatar: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  googleMapsUrl: string;
  volunteersNeeded: number;
  registeredVolunteersCount: number;
  registeredUsers: { id: string; name: string; avatar: string; registeredAt: string }[];
  contactInfo: string;
  isJoined?: boolean;
  isSaved?: boolean;
  hoursReward: number;
  xpReward: number;
  isCompleted?: boolean;
}

export interface VolunteerCertificate {
  id: string;
  campaignTitle: string;
  volunteerName: string;
  dateCompleted: string;
  hoursServed: number;
  certificateNumber: string;
  issuer: string;
}

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

export type NotificationPriority = 'critical' | 'important' | 'informational' | 'success';

export type NotificationCategory =
  | 'complaints'
  | 'schemes'
  | 'campaigns'
  | 'community'
  | 'nearby'
  | 'insights';

export interface SmartNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  timestampGroup: 'Today' | 'Yesterday' | 'Earlier';
  read: boolean;
  priority: NotificationPriority;
  category: NotificationCategory;
  
  // Progress tracking metadata (e.g. for complaints)
  progressStep?: 'received' | 'assigned' | 'in_progress' | 'resolved' | 'rate';
  complaintId?: string;
  schemeId?: string;
  campaignId?: string;
  postId?: string;

  actionLabel?: string;
  actionTab?: NavTab;
  locationDistance?: string;
  aiInsightStat?: string;
}

