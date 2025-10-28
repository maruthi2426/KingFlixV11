-- ============================================================================
-- MOVIEFLIX SUPABASE DATABASE SETUP - CLEAN MIGRATION
-- Run this ONCE in your Supabase SQL Editor to set up the database
-- ============================================================================

-- ============================================================================
-- DROP EXISTING TABLES (Clean slate)
-- ============================================================================
DROP TABLE IF EXISTS public.bot_logs CASCADE;
DROP TABLE IF EXISTS public.content CASCADE;

-- ============================================================================
-- CREATE CONTENT TABLE
-- ============================================================================
CREATE TABLE public.content (
  id BIGSERIAL PRIMARY KEY,
  tmdb_id INTEGER UNIQUE NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv', 'anime')),
  title TEXT NOT NULL,
  release_date TEXT,
  vote_average DECIMAL(3,1),
  download_link TEXT,
  download_title TEXT,
  is_top_rated BOOLEAN DEFAULT FALSE,
  is_top_movie BOOLEAN DEFAULT FALSE,
  top_movie_rank INTEGER,
  is_kdrama BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX idx_content_status ON public.content(status);
CREATE INDEX idx_content_media_type ON public.content(media_type);
CREATE INDEX idx_content_tmdb_id ON public.content(tmdb_id);
CREATE INDEX idx_content_is_kdrama ON public.content(is_kdrama) WHERE is_kdrama = true;
CREATE INDEX idx_content_is_top_rated ON public.content(is_top_rated) WHERE is_top_rated = true;
CREATE INDEX idx_content_is_top_movie ON public.content(is_top_movie) WHERE is_top_movie = true;
CREATE INDEX idx_content_created_at ON public.content(created_at DESC);

-- ============================================================================
-- CREATE BOT LOGS TABLE
-- ============================================================================
CREATE TABLE public.bot_logs (
  id BIGSERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  tmdb_id INTEGER,
  user_id TEXT,
  username TEXT,
  message TEXT,
  success BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CREATE INDEXES FOR BOT LOGS
-- ============================================================================
CREATE INDEX idx_bot_logs_created_at ON public.bot_logs(created_at DESC);
CREATE INDEX idx_bot_logs_action ON public.bot_logs(action);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATE RLS POLICIES
-- ============================================================================

-- Allow public read access to active content
CREATE POLICY "Allow public read access to content" ON public.content
  FOR SELECT USING (status = 'active');

-- Allow service role full access to content
CREATE POLICY "Allow service role full access to content" ON public.content
  FOR ALL USING (auth.role() = 'service_role');

-- Allow service role full access to bot logs
CREATE POLICY "Allow service role full access to bot_logs" ON public.bot_logs
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- VERIFY SETUP
-- ============================================================================
-- Run these queries to verify the setup:
-- SELECT COUNT(*) FROM public.content;
-- SELECT COUNT(*) FROM public.bot_logs;
-- SELECT * FROM information_schema.tables WHERE table_schema = 'public';
