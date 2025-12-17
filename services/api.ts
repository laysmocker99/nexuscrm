import { Lead, Task, Quote } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Auth helpers
const getToken = () => localStorage.getItem('token');
const setToken = (token: string) => localStorage.setItem('token', token);
const clearToken = () => localStorage.removeItem('token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Generic fetch wrapper
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...options.headers,
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `Request failed: ${response.statusText}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await apiFetch<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    setToken(data.token);
    return data;
  },

  register: async (email: string, password: string, firstName?: string, lastName?: string) => {
    const data = await apiFetch<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName })
    });
    setToken(data.token);
    return data;
  },

  logout: () => {
    clearToken();
  },

  getMe: () => apiFetch<any>('/auth/me'),

  isAuthenticated: () => !!getToken()
};

// Leads API
export const leadsAPI = {
  getAll: () => apiFetch<Lead[]>('/leads'),

  getOne: (id: string) => apiFetch<Lead>(`/leads/${id}`),

  create: (lead: Lead) => apiFetch<Lead>('/leads', {
    method: 'POST',
    body: JSON.stringify(lead)
  }),

  update: (id: string, lead: Partial<Lead>) => apiFetch<Lead>(`/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(lead)
  }),

  updateStatus: (id: string, status: string) => apiFetch<Lead>(`/leads/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),

  delete: (id: string) => apiFetch<{ message: string }>(`/leads/${id}`, {
    method: 'DELETE'
  })
};

// Tasks API
export const tasksAPI = {
  getAll: () => apiFetch<Task[]>('/tasks'),

  create: (task: Task) => apiFetch<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(task)
  }),

  update: (id: string, task: Partial<Task>) => apiFetch<Task>(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(task)
  }),

  toggle: (id: string) => apiFetch<Task>(`/tasks/${id}/toggle`, {
    method: 'PATCH'
  }),

  delete: (id: string) => apiFetch<{ message: string }>(`/tasks/${id}`, {
    method: 'DELETE'
  })
};

// Quotes API
export const quotesAPI = {
  getAll: () => apiFetch<Quote[]>('/quotes'),

  getByLead: (leadId: string) => apiFetch<Quote[]>(`/quotes/lead/${leadId}`),

  create: (quote: Quote) => apiFetch<Quote>('/quotes', {
    method: 'POST',
    body: JSON.stringify(quote)
  }),

  update: (id: string, quote: Partial<Quote>) => apiFetch<Quote>(`/quotes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(quote)
  }),

  delete: (id: string) => apiFetch<{ message: string }>(`/quotes/${id}`, {
    method: 'DELETE'
  })
};

// AI API
export const aiAPI = {
  analyzeLead: (lead: Lead) => apiFetch<any>('/ai/analyze-lead', {
    method: 'POST',
    body: JSON.stringify({ lead })
  }),

  generateEmail: (lead: Lead) => apiFetch<{ emailDraft: string }>('/ai/generate-email', {
    method: 'POST',
    body: JSON.stringify({ lead })
  }),

  generateQuote: (lead: Lead) => apiFetch<{ items: any[] }>('/ai/generate-quote', {
    method: 'POST',
    body: JSON.stringify({ lead })
  })
};
