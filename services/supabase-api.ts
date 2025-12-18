import { supabase } from '../lib/supabase';
import type { Lead as DBLead, Task as DBTask, Quote as DBQuote } from '../lib/supabase';
import type { Lead, Task, Quote, QuoteItem } from '../types';

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
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getMe() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    return user;
  },

  isAuthenticated() {
    return supabase.auth.getSession().then(({ data }) => !!data.session);
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },
};

// =====================================================
// Leads API
// =====================================================
export const leadsAPI = {
  async getAll(): Promise<Lead[]> {
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });

    if (error) throw error;
    return toCamelCase<Lead[]>(data || []);
  },

  async getOne(id: string): Promise<Lead> {
    const { data, error } = await supabase.from('leads').select('*').eq('id', id).single();

    if (error) throw error;
    return toCamelCase<Lead>(data);
  },

  async create(lead: Partial<Lead>): Promise<Lead> {
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
    const dbLead = toSnakeCase(lead);
    delete dbLead.id;
    delete dbLead.user_id;
    delete dbLead.created_at;

    const { data, error } = await supabase.from('leads').update(dbLead).eq('id', id).select().single();

    if (error) throw error;
    return toCamelCase<Lead>(data);
  },

  async updateStatus(id: string, status: string): Promise<Lead> {
    const { data, error } = await supabase.from('leads').update({ status }).eq('id', id).select().single();

    if (error) throw error;
    return toCamelCase<Lead>(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('leads').delete().eq('id', id);

    if (error) throw error;
  },
};

// =====================================================
// Tasks API
// =====================================================
export const tasksAPI = {
  async getAll(): Promise<Task[]> {
    const { data, error } = await supabase.from('tasks').select('*').order('date', { ascending: false });

    if (error) throw error;
    return toCamelCase<Task[]>(data || []);
  },

  async create(task: Partial<Task>): Promise<Task> {
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
    const dbTask = toSnakeCase(task);
    delete dbTask.id;
    delete dbTask.user_id;
    delete dbTask.created_at;

    const { data, error } = await supabase.from('tasks').update(dbTask).eq('id', id).select().single();

    if (error) throw error;
    return toCamelCase<Task>(data);
  },

  async toggle(id: string): Promise<Task> {
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
    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) throw error;
  },
};

// =====================================================
// Quotes API
// =====================================================
export const quotesAPI = {
  async getAll(): Promise<Quote[]> {
    const { data, error } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });

    if (error) throw error;
    return toCamelCase<Quote[]>(data || []);
  },

  async getByLead(leadId: string): Promise<Quote[]> {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return toCamelCase<Quote[]>(data || []);
  },

  async create(quote: Partial<Quote> & { leadId: string }): Promise<Quote> {
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
    const { error } = await supabase.from('quotes').delete().eq('id', id);

    if (error) throw error;
  },
};

// =====================================================
// AI API (Edge Function)
// =====================================================
export const aiAPI = {
  async analyzeLead(lead: Lead) {
    const { data, error } = await supabase.functions.invoke('gemini-ai', {
      body: { action: 'analyze-lead', lead },
    });

    if (error) throw error;
    return data;
  },

  async generateEmail(lead: Lead) {
    const { data, error } = await supabase.functions.invoke('gemini-ai', {
      body: { action: 'generate-email', lead },
    });

    if (error) throw error;
    return data;
  },

  async generateQuote(lead: Lead) {
    const { data, error } = await supabase.functions.invoke('gemini-ai', {
      body: { action: 'generate-quote', lead },
    });

    if (error) throw error;
    return data;
  },
};
