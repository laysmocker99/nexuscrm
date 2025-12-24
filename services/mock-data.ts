import { Lead, Task, Quote, LeadStatus, AcquisitionChannel } from '../types';

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '0612345678',
    company: 'Tech Solutions',
    position: 'CTO',
    status: LeadStatus.NEW,
    value: 15000,
    channel: AcquisitionChannel.ORGANIC_SEARCH,
    gaData: {
      pagesVisited: ['/pricing', '/features'],
      timeOnSite: 120,
      landingPage: '/landing-a'
    },
    interactions: [
      { id: 'i1', type: 'email', date: new Date().toISOString(), content: 'Premier contact via formulaire' }
    ],
    lastContacted: new Date().toISOString(),
    score: 85
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@innovate.fr',
    phone: '0798765432',
    company: 'Innovate SA',
    position: 'Directrice Marketing',
    status: LeadStatus.QUALIFIED,
    value: 25000,
    channel: AcquisitionChannel.LINKEDIN_ADS,
    gaData: {
      pagesVisited: ['/blog/article-1', '/contact'],
      timeOnSite: 300,
      landingPage: '/blog/article-1'
    },
    interactions: [],
    lastContacted: new Date().toISOString(),
    score: 60
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Relancer Jean Dupont',
    type: 'call',
    date: new Date().toISOString().split('T')[0],
    completed: false,
    priority: true,
    description: 'Discuter du budget'
  },
  {
    id: 't2',
    title: 'Préparer la démo pour Innovate SA',
    type: 'meeting',
    date: new Date().toISOString().split('T')[0],
    completed: false,
    priority: false
  }
];

export const MOCK_QUOTES: Quote[] = [
  {
    id: 'q1',
    date: new Date().toISOString(),
    items: [
      { description: 'Licence Enterprise', quantity: 1, unitPrice: 15000, total: 15000 }
    ],
    totalAmount: 15000,
    status: 'DRAFT'
  }
];
