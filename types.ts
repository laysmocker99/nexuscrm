export enum LeadStatus {
  NEW = 'NOUVEAU',
  QUALIFIED = 'QUALIFIÉ',
  PROPOSAL_SENT = 'PROPOSITION',
  NEGOTIATION = 'NÉGOCIATION',
  CLOSED_WON = 'GAGNÉ',
  CLOSED_LOST = 'PERDU'
}

export enum AcquisitionChannel {
  ORGANIC_SEARCH = 'Recherche Organique',
  PAID_SOCIAL = 'Publicité Sociale (Meta)',
  LINKEDIN_ADS = 'LinkedIn Ads',
  REFERRAL = 'Recommandation',
  DIRECT = 'Direct'
}

export interface GA4Data {
  pagesVisited: string[];
  timeOnSite: number; // seconds
  campaign?: string;
  medium?: string;
  term?: string;
  landingPage: string;
}

export interface Interaction {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'quote_sent';
  date: string;
  content: string;
}

export interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  date: string;
  items: QuoteItem[];
  totalAmount: number;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED';
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: LeadStatus;
  value: number;
  channel: AcquisitionChannel;
  gaData: GA4Data;
  interactions: Interaction[];
  score?: number; // 0-100
  lastContacted: string;
  avatarUrl?: string;
  quotes?: Quote[];
}

export interface KPIData {
  totalRevenue: number;
  activeLeads: number;
  conversionRate: number;
  avgDealSize: number;
}

export interface ChannelPerformance {
  name: string;
  leads: number;
  revenue: number;
  roi: number; // percentage
  visitors: number;
  conversionRate: number;
}

export interface Task {
  id: string;
  title: string;
  type: 'call' | 'meeting' | 'email' | 'todo' | 'proposal';
  date: string;
  time?: string;
  completed: boolean;
  priority: boolean;
  description?: string;
  amount?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  participants: string[];
}