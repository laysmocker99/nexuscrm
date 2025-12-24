import { supabase, isDemoMode } from '../lib/supabase';
import type { Lead as DBLead, Task as DBTask, Quote as DBQuote } from '../lib/supabase';
import type { Lead, Task, Quote, QuoteItem } from '../types';
import { MOCK_LEADS, MOCK_TASKS, MOCK_QUOTES } from './mock-data';

// =====================================================
// LocalStorage Persistence for Demo Mode
// =====================================================
const STORAGE_KEYS = {
  LEADS: 'demo_leads',
  TASKS: 'demo_tasks',
  QUOTES: 'demo_quotes',
  USER: 'demo_user'
};

const getStorage = <T>(key: string, defaultData: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) return defaultData;
  try {
    return JSON.parse(stored);
  } catch {
    return defaultData;
  }
};

const setStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// =====================================================
// Helper: Convert snake_case to camelCase
// =====================================================
function toCamelCase<T>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item)) as T;
  }

  if (obj && typeof obj === 'object') {
    const converted: any = {};
    for (const key in obj) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      converted[camelKey] = toCamelCase(obj[key]);
    }
    return converted as T;
  }

  return obj as T;
}

// Helper: Convert camelCase to snake_case
function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => toSnakeCase(item));
  }

  if (obj && typeof obj === 'object') {
    const converted: any = {};
    for (const key in obj) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      converted[snakeKey] = toSnakeCase(obj[key]);
    }
    return converted;
  }

  return obj;
}

// =====================================================
// Auth API
// =====================================================
export const authAPI = {
  async login(email: string, password: string) {
    if (isDemoMode) {
      const user = { id: 'demo-user-id', email, created_at: new Date().toISOString() };
      setStorage(STORAGE_KEYS.USER, user);
      return { token: 'demo-token', user };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return {
      token: data.session?.access_token,
      user: data.user,
    };
  },

  async register(email: string, password: string, metadata?: { firstName?: string; lastName?: string }) {
    if (isDemoMode) {
      const user = { id: 'demo-user-id', email, user_metadata: metadata, created_at: new Date().toISOString() };
      setStorage(STORAGE_KEYS.USER, user);
      return { token: 'demo-token', user };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) throw error;

    return {
      token: data.session?.access_token,
      user: data.user,
    };
  },

  async logout() {
    if (isDemoMode) {
      localStorage.removeItem(STORAGE_KEYS.USER);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getMe() {
    if (isDemoMode) {
      const user = getStorage(STORAGE_KEYS.USER, null);
      if (!user) throw new Error('Not authenticated');
      return user;
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    return user;
  },

  isAuthenticated() {
    if (isDemoMode) {
      return Promise.resolve(!!getStorage(STORAGE_KEYS.USER, null));
    }
    return supabase.auth.getSession().then(({ data }) => !!data.session);
  },

  async getSession() {
    if (isDemoMode) {
      const user = getStorage(STORAGE_KEYS.USER, null);
      return user ? { access_token: 'demo-token', user } : null;
    }
    const { data } = await supabase.auth.getSession();
    return data.session;
  },
};

// =====================================================
// Leads API
// =====================================================
export const leadsAPI = {
  async getAll(): Promise<Lead[]> {
    if (isDemoMode) {
      return getStorage<Lead[]>(STORAGE_KEYS.LEADS, MOCK_LEADS);
    }

    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });

    if (error) throw error;
    return toCamelCase<Lead[]>(data || []);
  },

  async getOne(id: string): Promise<Lead> {
    if (isDemoMode) {
      const leads = getStorage<Lead[]>(STORAGE_KEYS.LEADS, MOCK_LEADS);
      const lead = leads.find(l => l.id === id);
      if (!lead) throw new Error('Lead not found');
      return lead;
    }

    const { data, error } = await supabase.from('leads').select('*').eq('id', id).single();

    if (error) throw error;
    return toCamelCase<Lead>(data);
  },

  async create(lead: Partial<Lead>): Promise<Lead> {
    if (isDemoMode) {
      const leads = getStorage<Lead[]>(STORAGE_KEYS.LEADS, MOCK_LEADS);
      const newLead = {
        ...lead,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'demo-user-id',
        gaData: {},
        interactions: []
      } as Lead;

      const updatedLeads = [newLead, ...leads];
      setStorage(STORAGE_KEYS.LEADS, updatedLeads);
      return newLead;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const dbLead = toSnakeCase({ ...lead, userId: user.id });

    const { data, error } = await supabase.from('leads').insert(dbLead).select().single();

    if (error) throw error;
    return toCamelCase<Lead>(data);
  },

  async update(id: string, lead: Partial<Lead>): Promise<Lead> {
    if (isDemoMode) {
      const leads = getStorage<Lead[]>(STORAGE_KEYS.LEADS, MOCK_LEADS);
      const index = leads.findIndex(l => l.id === id);
      if (index === -1) throw new Error('Lead not found');

      const updatedLead = { ...leads[index], ...lead, updated_at: new Date().toISOString() };
      leads[index] = updatedLead;
      setStorage(STORAGE_KEYS.LEADS, leads);
      return updatedLead;
    }

    const dbLead = toSnakeCase(lead);
    delete dbLead.id;
    delete dbLead.user_id;
    delete dbLead.created_at;

    const { data, error } = await supabase.from('leads').update(dbLead).eq('id', id).select().single();

    if (error) throw error;
    return toCamelCase<Lead>(data);
  },

  async updateStatus(id: string, status: string): Promise<Lead> {
    if (isDemoMode) {
      const leads = getStorage<Lead[]>(STORAGE_KEYS.LEADS, MOCK_LEADS);
      const index = leads.findIndex(l => l.id === id);
      if (index === -1) throw new Error('Lead not found');

      const updatedLead = { ...leads[index], status, updated_at: new Date().toISOString() };
      leads[index] = updatedLead;
      setStorage(STORAGE_KEYS.LEADS, leads);
      return updatedLead;
    }

    const { data, error } = await supabase.from('leads').update({ status }).eq('id', id).select().single();

    if (error) throw error;
    return toCamelCase<Lead>(data);
  },

  async delete(id: string): Promise<void> {
    if (isDemoMode) {
      const leads = getStorage<Lead[]>(STORAGE_KEYS.LEADS, MOCK_LEADS);
      const filtered = leads.filter(l => l.id !== id);
      setStorage(STORAGE_KEYS.LEADS, filtered);
      return;
    }

    const { error } = await supabase.from('leads').delete().eq('id', id);

    if (error) throw error;
  },
};

// =====================================================
// Tasks API
// =====================================================
export const tasksAPI = {
  async getAll(): Promise<Task[]> {
    if (isDemoMode) {
      return getStorage<Task[]>(STORAGE_KEYS.TASKS, MOCK_TASKS);
    }

    const { data, error } = await supabase.from('tasks').select('*').order('date', { ascending: false });

    if (error) throw error;
    return toCamelCase<Task[]>(data || []);
  },

  async create(task: Partial<Task>): Promise<Task> {
    if (isDemoMode) {
      const tasks = getStorage<Task[]>(STORAGE_KEYS.TASKS, MOCK_TASKS);
      const newTask = {
        ...task,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        user_id: 'demo-user-id',
        completed: false
      } as Task;

      const updatedTasks = [newTask, ...tasks];
      setStorage(STORAGE_KEYS.TASKS, updatedTasks);
      return newTask;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const dbTask = toSnakeCase({ ...task, userId: user.id });

    const { data, error } = await supabase.from('tasks').insert(dbTask).select().single();

    if (error) throw error;
    return toCamelCase<Task>(data);
  },

  async update(id: string, task: Partial<Task>): Promise<Task> {
    if (isDemoMode) {
      const tasks = getStorage<Task[]>(STORAGE_KEYS.TASKS, MOCK_TASKS);
      const index = tasks.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Task not found');

      const updatedTask = { ...tasks[index], ...task };
      tasks[index] = updatedTask;
      setStorage(STORAGE_KEYS.TASKS, tasks);
      return updatedTask;
    }

    const dbTask = toSnakeCase(task);
    delete dbTask.id;
    delete dbTask.user_id;
    delete dbTask.created_at;

    const { data, error } = await supabase.from('tasks').update(dbTask).eq('id', id).select().single();

    if (error) throw error;
    return toCamelCase<Task>(data);
  },

  async toggle(id: string): Promise<Task> {
    if (isDemoMode) {
      const tasks = getStorage<Task[]>(STORAGE_KEYS.TASKS, MOCK_TASKS);
      const index = tasks.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Task not found');

      const updatedTask = { ...tasks[index], completed: !tasks[index].completed };
      tasks[index] = updatedTask;
      setStorage(STORAGE_KEYS.TASKS, tasks);
      return updatedTask;
    }

    const { data: task } = await supabase.from('tasks').select('completed').eq('id', id).single();

    const { data, error } = await supabase
      .from('tasks')
      .update({ completed: !task?.completed })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return toCamelCase<Task>(data);
  },

  async delete(id: string): Promise<void> {
    if (isDemoMode) {
      const tasks = getStorage<Task[]>(STORAGE_KEYS.TASKS, MOCK_TASKS);
      const filtered = tasks.filter(t => t.id !== id);
      setStorage(STORAGE_KEYS.TASKS, filtered);
      return;
    }

    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) throw error;
  },
};

// =====================================================
// Quotes API
// =====================================================
export const quotesAPI = {
  async getAll(): Promise<Quote[]> {
    if (isDemoMode) {
      return getStorage<Quote[]>(STORAGE_KEYS.QUOTES, MOCK_QUOTES);
    }

    const { data, error } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });

    if (error) throw error;
    return toCamelCase<Quote[]>(data || []);
  },

  async getByLead(leadId: string): Promise<Quote[]> {
    if (isDemoMode) {
      const quotes = getStorage<Quote[]>(STORAGE_KEYS.QUOTES, MOCK_QUOTES);
      // In mock data we don't strictly link quotes to lead IDs but let's filter if we can
      // For simplicity in demo, we return all or filter if we had leadId in mock data
      // Let's assume mock quotes are global or just return empty if none match
      return quotes;
    }

    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return toCamelCase<Quote[]>(data || []);
  },

  async create(quote: Partial<Quote> & { leadId: string }): Promise<Quote> {
    if (isDemoMode) {
      const quotes = getStorage<Quote[]>(STORAGE_KEYS.QUOTES, MOCK_QUOTES);
      const newQuote = {
        ...quote,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'demo-user-id',
        status: 'DRAFT'
      } as Quote;

      const updatedQuotes = [newQuote, ...quotes];
      setStorage(STORAGE_KEYS.QUOTES, updatedQuotes);
      return newQuote;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const dbQuote = toSnakeCase({ ...quote, userId: user.id });

    const { data, error } = await supabase.from('quotes').insert(dbQuote).select().single();

    if (error) throw error;
    return toCamelCase<Quote>(data);
  },

  async update(id: string, quote: Partial<Quote>): Promise<Quote> {
    if (isDemoMode) {
      const quotes = getStorage<Quote[]>(STORAGE_KEYS.QUOTES, MOCK_QUOTES);
      const index = quotes.findIndex(q => q.id === id);
      if (index === -1) throw new Error('Quote not found');

      const updatedQuote = { ...quotes[index], ...quote, updated_at: new Date().toISOString() };
      quotes[index] = updatedQuote;
      setStorage(STORAGE_KEYS.QUOTES, quotes);
      return updatedQuote;
    }

    const dbQuote = toSnakeCase(quote);
    delete dbQuote.id;
    delete dbQuote.user_id;
    delete dbQuote.lead_id;
    delete dbQuote.created_at;

    const { data, error } = await supabase.from('quotes').update(dbQuote).eq('id', id).select().single();

    if (error) throw error;
    return toCamelCase<Quote>(data);
  },

  async delete(id: string): Promise<void> {
    if (isDemoMode) {
      const quotes = getStorage<Quote[]>(STORAGE_KEYS.QUOTES, MOCK_QUOTES);
      const filtered = quotes.filter(q => q.id !== id);
      setStorage(STORAGE_KEYS.QUOTES, filtered);
      return;
    }

    const { error } = await supabase.from('quotes').delete().eq('id', id);

    if (error) throw error;
  },
};

// =====================================================
// AI API (Edge Function)
// =====================================================
export const aiAPI = {
  async analyzeLead(lead: Lead) {
    if (isDemoMode) {
      // Return a fake analysis
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      return {
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        summary: "Ce lead montre un fort intérêt pour les solutions Enterprise. Le profil LinkedIn suggère une croissance récente de l'équipe technique.",
        nextAction: "Proposer une démo personnalisée sur les fonctionnalités d'intégration.",
        dealProbability: "Élevée"
      };
    }

    const { data, error } = await supabase.functions.invoke('gemini-ai', {
      body: { action: 'analyze-lead', lead },
    });

    if (error) throw error;
    return data;
  },

  async generateEmail(lead: Lead) {
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        emailDraft: `Bonjour ${lead.firstName},\n\nJ'ai vu que ${lead.company} est en pleine expansion. Notre solution CRM pourrait vous aider à structurer cette croissance.\n\nAuriez-vous 15min pour en discuter ?\n\nCordialement,`
      };
    }

    const { data, error } = await supabase.functions.invoke('gemini-ai', {
      body: { action: 'generate-email', lead },
    });

    if (error) throw error;
    return data;
  },

  async generateQuote(lead: Lead) {
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        items: [
          { description: 'Setup & Onboarding', quantity: 1, unitPrice: 1500, total: 1500 },
          { description: 'Licence Annuelle', quantity: 1, unitPrice: 12000, total: 12000 }
        ]
      };
    }

    const { data, error } = await supabase.functions.invoke('gemini-ai', {
      body: { action: 'generate-quote', lead },
    });

    if (error) throw error;
    return data;
  },
};
