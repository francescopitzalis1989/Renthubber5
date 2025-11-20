
export type ListingCategory = 'oggetto' | 'spazio';
export type ListingStatus = 'draft' | 'published' | 'hidden' | 'suspended';
export type Condition = 'nuovo' | 'come_nuovo' | 'buono' | 'usato' | 'molto_usato';
export type CancellationPolicyType = 'flexible' | 'moderate' | 'strict';
export type ActiveMode = 'renter' | 'hubber';

// --- SYSTEM CONFIGURATION ---
export interface FeeConfig {
  platformPercentage: number;
  fixedFeeEur: number;
  superHubberDiscount: number;
}

export interface ReferralConfig {
  isActive: boolean;
  bonusAmount: number;
}

export interface PolicyRule {
  id: CancellationPolicyType;
  label: string;
  description: string;
  refundPercentage: number;
  cutoffHours: number;
  color: string;
}

// NEW: CMS Content Configuration
export interface CmsConfig {
  heroTitle: string;
  heroSubtitle: string;
  footerText: string;
  faq: { question: string; answer: string }[];
  termsUrl: string;
  privacyUrl: string;
}

// NEW: Branding Configuration
export interface BrandConfig {
  primaryColor: string;
  logoUrl: string;
  faviconUrl: string;
  heroImageUrl: string;
}

// NEW: Notification Configuration
export interface NotificationConfig {
  emailEnabled: boolean;
  pushEnabled: boolean;
  templates: {
    bookingConfirmed: string;
    bookingCancelled: string;
    payoutProcessed: string;
  };
}

export interface SystemConfig {
  fees: FeeConfig;
  referral: ReferralConfig;
  cancellationPolicies: PolicyRule[];
  completenessThreshold: number;
  superHubberMinRating: number;
  // New Sections
  cms: CmsConfig;
  brand: BrandConfig;
  notifications: NotificationConfig;
}

// --- USER & BANK ---
export interface BankDetails {
  accountHolderName: string;
  accountHolderSurname: string;
  iban: string;
  bankName: string;
  bicSwift: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  rating: number;
  reviewCount?: number; // Total reviews received
  isSuperHubber: boolean;
  role?: 'renter' | 'hubber' | 'admin';
  roles: string[];
  hubberSince?: string;
  status?: 'active' | 'suspended' | 'pending_verification';
  customCommissionRate?: number;
  address?: string;
  phoneNumber?: string;
  renterBalance: number;
  hubberBalance: number;
  referralCode: string;
  bankDetails?: BankDetails;
  
  // NEW PROFILE FIELDS
  bio?: string;
  languages?: string[];
  responseTime?: string;
  responseRate?: number; // 0-100
  verifications?: {
    email: boolean;
    phone: boolean;
    identity: boolean;
  };
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface TechSpecs {
  brand?: string;
  model?: string;
  year?: string;
  condition?: Condition;
  wattage?: string;
  dimensions?: string;
  accessories?: string[];
  manualUrl?: string;
}

export interface SpaceSpecs {
  sqm?: number;
  floor?: number;
  capacity?: number;
  accessibility?: boolean;
  bathrooms?: number;
  layoutTypes?: string[];
}

// --- LISTING MODEL EXPANDED ---
export interface Listing {
  id: string;
  title: string;
  category: ListingCategory;
  subCategory: string;
  description: string;
  price: number;
  priceUnit: 'ora' | 'giorno' | 'settimana' | 'mese';
  images: string[];
  location: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  reviewCount: number;
  reviews: Review[];
  owner: User;
  features: string[];
  rules: string[];
  deposit?: number;
  status?: ListingStatus;
  cancellationPolicy?: CancellationPolicyType;
  techSpecs?: TechSpecs;
  spaceSpecs?: SpaceSpecs;
  minDuration?: number;
  maxDuration?: number;
  completenessScore?: number;

  // NEW FIELDS FOR FULL EDITOR
  zoneDescription?: string;      // Descrizione del quartiere
  openingHours?: string;         // Es. "09:00 - 18:00" per spazi
  maxGuests?: number;            // Per spazi
  manualBadges?: string[];       // Es. "Offerta", "Last Minute"
  hostRules?: string[];          // Regole specifiche (alias di rules, ma esplicito)
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: 'credit' | 'debit';
  walletType?: 'renter' | 'hubber';
}

export interface PayoutRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  iban: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
  lastMessageTime: string;
}

export interface ListingDraft {
  step: number;
  category: ListingCategory;
  title: string;
  subCategory: string;
  description: string;
  features: string;
  brand: string;
  model: string;
  condition: Condition;
  sqm: string;
  capacity: string;
  price: string;
  priceUnit: 'ora' | 'giorno';
  deposit: string;
  cancellationPolicy: CancellationPolicyType;
  location: string;
  images: string[];
}

export interface BookingRequest {
  id: string;
  listingTitle: string;
  listingImage: string;
  renterName: string;
  renterAvatar: string;
  dates: string;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'rejected';
  timeLeft: string;
}

export interface DashboardStats {
  earningsMonth: number;
  activeBookings: number;
  views: number;
  responseRate: number;
}

export interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  target: string;
  timestamp: string;
  details: string;
}

export interface Report {
  id: string;
  type: 'listing' | 'user' | 'review';
  targetId: string;
  reporterName: string;
  reason: string;
  status: 'open' | 'resolved';
  date: string;
}
