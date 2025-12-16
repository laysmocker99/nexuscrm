import { AcquisitionChannel, Lead, LeadStatus, ChannelPerformance } from './types';

export const MOCK_LEADS: Lead[] = [
  {
    id: 'l-1',
    firstName: 'Alice',
    lastName: 'Dubois',
    email: 'alice@techstart.io',
    phone: '+33 6 12 34 56 78',
    company: 'TechStart SaaS',
    position: 'CMO',
    status: LeadStatus.PROPOSAL_SENT,
    value: 12500,
    channel: AcquisitionChannel.LINKEDIN_ADS,
    lastContacted: '2023-10-25',
    gaData: {
      pagesVisited: ['/tarifs', '/services/seo', '/etudes-de-cas/fintech'],
      timeOnSite: 340,
      campaign: 'q4_lead_gen',
      medium: 'cpc',
      landingPage: '/landing/croissance-saas'
    },
    interactions: [
      { id: 'i-1', type: 'email', date: '2023-10-20', content: 'Email d\'introduction envoyé' },
      { id: 'i-2', type: 'quote_sent', date: '2023-10-24', content: 'Proposition SEO & Contenu #Q-102 envoyée' }
    ],
    quotes: [
        {
            id: 'Q-2023-102',
            date: '2023-10-24',
            status: 'SENT',
            totalAmount: 12500,
            items: [
                { description: 'Audit Technique SEO', quantity: 1, unitPrice: 2500, total: 2500 },
                { description: 'Stratégie de Contenu Q4', quantity: 1, unitPrice: 5000, total: 5000 },
                { description: 'Backlinking Mensuel', quantity: 2, unitPrice: 2500, total: 5000 }
            ]
        }
    ]
  },
  {
    id: 'l-2',
    firstName: 'Marc',
    lastName: 'Moreau',
    email: 'm.moreau@retail-solutions.fr',
    phone: '+33 6 98 76 54 32',
    company: 'Retail Solutions',
    position: 'PDG',
    status: LeadStatus.NEW,
    value: 45000,
    channel: AcquisitionChannel.PAID_SOCIAL,
    lastContacted: '2023-10-26',
    gaData: {
      pagesVisited: ['/contact', '/a-propos'],
      timeOnSite: 45,
      campaign: 'fb_retargeting',
      medium: 'social',
      landingPage: '/services/dev-web'
    },
    interactions: []
  },
  {
    id: 'l-3',
    firstName: 'Sophie',
    lastName: 'Laurent',
    email: 'sophie@greenenergy.com',
    phone: '+33 7 00 11 22 33',
    company: 'Green Energy Co',
    position: 'Directrice Marketing',
    status: LeadStatus.QUALIFIED,
    value: 8200,
    channel: AcquisitionChannel.ORGANIC_SEARCH,
    lastContacted: '2023-10-22',
    gaData: {
      pagesVisited: ['/blog/marketing-durable', '/services/branding'],
      timeOnSite: 120,
      term: 'agence branding paris',
      landingPage: '/blog/marketing-durable'
    },
    interactions: [
      { id: 'i-3', type: 'call', date: '2023-10-22', content: 'Appel découverte - intéressée par un rebranding' }
    ],
    quotes: [
        {
            id: 'Q-2023-098',
            date: '2023-10-20',
            status: 'DRAFT',
            totalAmount: 8200,
            items: [
                { description: 'Refonte Identité Visuelle', quantity: 1, unitPrice: 8200, total: 8200 }
            ]
        }
    ]
  },
  {
    id: 'l-4',
    firstName: 'Jean',
    lastName: 'Pierre',
    email: 'jp@consulting-corp.com',
    phone: '+33 6 55 44 33 22',
    company: 'Consulting Corp',
    position: 'Associé',
    status: LeadStatus.NEGOTIATION,
    value: 22000,
    channel: AcquisitionChannel.REFERRAL,
    lastContacted: '2023-10-24',
    gaData: {
      pagesVisited: ['/accueil'],
      timeOnSite: 600,
      landingPage: '/'
    },
    interactions: [
      { id: 'i-4', type: 'meeting', date: '2023-10-15', content: 'Déjeuner avec le PDG' },
      { id: 'i-5', type: 'quote_sent', date: '2023-10-18', content: 'Proposition #Q-99 envoyée' }
    ],
    quotes: [
        {
            id: 'Q-2023-099',
            date: '2023-10-18',
            status: 'ACCEPTED',
            totalAmount: 22000,
            items: [
                { description: 'Pack Transformation Digitale', quantity: 1, unitPrice: 22000, total: 22000 }
            ]
        }
    ]
  },
  {
    id: 'l-5',
    firstName: 'Elise',
    lastName: 'Martin',
    email: 'elise@fashionbrand.com',
    phone: '+33 6 88 99 00 11',
    company: 'Fashion Brand',
    position: 'Fondatrice',
    status: LeadStatus.CLOSED_WON,
    value: 15000,
    channel: AcquisitionChannel.PAID_SOCIAL,
    lastContacted: '2023-10-01',
    gaData: {
      pagesVisited: ['/services/social-media', '/tarifs'],
      timeOnSite: 400,
      campaign: 'ig_stories_promo',
      medium: 'social',
      landingPage: '/services/social-media'
    },
    interactions: []
  }
];

export const MOCK_CHANNEL_PERFORMANCE: ChannelPerformance[] = [
  { name: 'LinkedIn Ads', leads: 45, revenue: 125000, roi: 320, visitors: 1200, conversionRate: 3.75 },
  { name: 'SEO (Organique)', leads: 120, revenue: 85000, roi: 850, visitors: 5400, conversionRate: 2.2 },
  { name: 'Social Ads (Meta)', leads: 85, revenue: 92000, roi: 210, visitors: 3100, conversionRate: 2.7 },
  { name: 'Recommandation', leads: 15, revenue: 60000, roi: 1200, visitors: 100, conversionRate: 15.0 },
  { name: 'Direct', leads: 10, revenue: 15000, roi: 0, visitors: 800, conversionRate: 1.25 },
];

export const ANALYTICS_TREND_DATA = [
  { day: 'Lun', social: 400, organic: 240, paid: 150 },
  { day: 'Mar', social: 300, organic: 139, paid: 220 },
  { day: 'Mer', social: 200, organic: 980, paid: 229 },
  { day: 'Jeu', social: 278, organic: 390, paid: 200 },
  { day: 'Ven', social: 189, organic: 480, paid: 218 },
  { day: 'Sam', social: 239, organic: 380, paid: 250 },
  { day: 'Dim', social: 349, organic: 430, paid: 210 },
];