-- Hunnie-Bee Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Goals table
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '🐝',
  target_count INTEGER NOT NULL DEFAULT 100,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goal records table
CREATE TABLE IF NOT EXISTS public.goal_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  note TEXT
);

-- Bee state table (one per user)
CREATE TABLE IF NOT EXISTS public.bee_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Honey',
  bond INTEGER NOT NULL DEFAULT 50 CHECK (bond >= 0 AND bond <= 100),
  honey_count INTEGER NOT NULL DEFAULT 3 CHECK (honey_count >= 0),
  last_interaction_at TIMESTAMPTZ DEFAULT NOW(),
  last_checked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goal_records_user_id ON public.goal_records(user_id);
CREATE INDEX IF NOT EXISTS idx_goal_records_goal_id ON public.goal_records(goal_id);
CREATE INDEX IF NOT EXISTS idx_bee_states_user_id ON public.bee_states(user_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bee_states ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Goals
DROP POLICY IF EXISTS "Users can view own goals" ON public.goals;
CREATE POLICY "Users can view own goals"
  ON public.goals FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own goals" ON public.goals;
CREATE POLICY "Users can create own goals"
  ON public.goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own goals" ON public.goals;
CREATE POLICY "Users can update own goals"
  ON public.goals FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own goals" ON public.goals;
CREATE POLICY "Users can delete own goals"
  ON public.goals FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for Goal Records
DROP POLICY IF EXISTS "Users can view own records" ON public.goal_records;
CREATE POLICY "Users can view own records"
  ON public.goal_records FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own records" ON public.goal_records;
CREATE POLICY "Users can create own records"
  ON public.goal_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own records" ON public.goal_records;
CREATE POLICY "Users can delete own records"
  ON public.goal_records FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for Bee States
DROP POLICY IF EXISTS "Users can view own bee state" ON public.bee_states;
CREATE POLICY "Users can view own bee state"
  ON public.bee_states FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own bee state" ON public.bee_states;
CREATE POLICY "Users can create own bee state"
  ON public.bee_states FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own bee state" ON public.bee_states;
CREATE POLICY "Users can update own bee state"
  ON public.bee_states FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to automatically create bee_state for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.bee_states (user_id, name, bond, honey_count)
  VALUES (NEW.id, 'Honey', 50, 3);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup (create default bee state)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_goals_updated_at ON public.goals;
CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_bee_states_updated_at ON public.bee_states;
CREATE TRIGGER update_bee_states_updated_at
  BEFORE UPDATE ON public.bee_states
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
