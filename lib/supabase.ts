import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export type Lead = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  status: string;
  value: number;
  channel: string;
  score?: number;
  last_contacted?: string;
  avatar_url?: string;
  ga_data: any;
  interactions: any[];
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  user_id: string;
  title: string;
  type: 'call' | 'meeting' | 'email' | 'todo' | 'proposal';
  date: string;
  time?: string;
  completed: boolean;
  priority: boolean;
  description?: string;
  amount?: number;
  created_at: string;
};

export type Quote = {
  id: string;
  user_id: string;
  lead_id: string;
  date: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED';
  total_amount: number;
  items: QuoteItem[];
  created_at: string;
  updated_at: string;
};

export type QuoteItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};
