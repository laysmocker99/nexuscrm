-- =====================================================
-- NEXUSCRM - Supabase Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- LEADS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Contact Info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  position TEXT,

  -- CRM Fields
  status TEXT NOT NULL DEFAULT 'NOUVEAU',
  value NUMERIC NOT NULL DEFAULT 0,
  channel TEXT NOT NULL,
  score INTEGER,
  last_contacted TIMESTAMP,
  avatar_url TEXT,

  -- GA4 Data (stored as JSONB)
  ga_data JSONB DEFAULT '{}'::jsonb,

  -- Interactions (stored as JSONB array)
  interactions JSONB DEFAULT '[]'::jsonb,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS leads_user_id_idx ON leads(user_id);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);

-- =====================================================
-- TASKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'call', 'meeting', 'email', 'todo', 'proposal'
  date DATE NOT NULL,
  time TIME,
  completed BOOLEAN DEFAULT FALSE,
  priority BOOLEAN DEFAULT FALSE,
  description TEXT,
  amount NUMERIC,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_date_idx ON tasks(date);
CREATE INDEX IF NOT EXISTS tasks_completed_idx ON tasks(completed);

-- =====================================================
-- QUOTES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,

  date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'SENT', 'ACCEPTED'
  total_amount NUMERIC NOT NULL DEFAULT 0,

  -- Quote items (stored as JSONB array)
  items JSONB DEFAULT '[]'::jsonb,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS quotes_user_id_idx ON quotes(user_id);
CREATE INDEX IF NOT EXISTS quotes_lead_id_idx ON quotes(lead_id);
CREATE INDEX IF NOT EXISTS quotes_created_at_idx ON quotes(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Leads Policies
CREATE POLICY "Users can view their own leads"
  ON leads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own leads"
  ON leads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads"
  ON leads FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads"
  ON leads FOR DELETE
  USING (auth.uid() = user_id);

-- Tasks Policies
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Quotes Policies
CREATE POLICY "Users can view their own quotes"
  ON quotes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quotes"
  ON quotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quotes"
  ON quotes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quotes"
  ON quotes FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- This will be inserted after you create your first user
-- Example:
-- INSERT INTO leads (user_id, first_name, last_name, email, company, position, status, value, channel, ga_data, last_contacted)
-- VALUES (
--   auth.uid(),
--   'Alice',
--   'Dubois',
--   'alice@techstart.io',
--   'TechStart SaaS',
--   'CMO',
--   'PROPOSITION',
--   12500,
--   'LinkedIn Ads',
--   '{"pagesVisited": ["/tarifs", "/services/seo"], "timeOnSite": 340, "landingPage": "/landing/croissance-saas"}'::jsonb,
--   NOW()
-- );
