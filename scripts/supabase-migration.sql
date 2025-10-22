-- Create content table with minimal fields to store only essential data
CREATE TABLE IF NOT EXISTS public.content (
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

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_content_status ON public.content(status);
CREATE INDEX IF NOT EXISTS idx_content_media_type ON public.content(media_type);
CREATE INDEX IF NOT EXISTS idx_content_tmdb_id ON public.content(tmdb_id);
CREATE INDEX IF NOT EXISTS idx_content_is_kdrama ON public.content(is_kdrama);
CREATE INDEX IF NOT EXISTS idx_content_created_at ON public.content(created_at DESC);

-- Create bot_logs table for tracking bot actions
CREATE TABLE IF NOT EXISTS public.bot_logs (
  id BIGSERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  tmdb_id INTEGER,
  user_id TEXT,
  username TEXT,
  message TEXT,
  success BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for bot logs
CREATE INDEX IF NOT EXISTS idx_bot_logs_created_at ON public.bot_logs(created_at DESC);

-- Enable Row Level Security (RLS) for security
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies to allow public read access (optional, adjust as needed)
CREATE POLICY "Allow public read access to content" ON public.content
  FOR SELECT USING (status = 'active');

CREATE POLICY "Allow service role full access to content" ON public.content
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to bot_logs" ON public.bot_logs
  FOR ALL USING (auth.role() = 'service_role');
