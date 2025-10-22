-- Create content table with minimal fields only
CREATE TABLE IF NOT EXISTS content (
  id BIGSERIAL PRIMARY KEY,
  tmdb_id INTEGER NOT NULL UNIQUE,
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('movie', 'tv', 'anime')),
  title VARCHAR(500) NOT NULL,
  release_date VARCHAR(50),
  vote_average DECIMAL(3,1),
  download_link TEXT,
  download_title VARCHAR(500),
  is_top_rated BOOLEAN DEFAULT false,
  is_top_movie BOOLEAN DEFAULT false,
  top_movie_rank INTEGER,
  is_kdrama BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_media_type ON content(media_type);
CREATE INDEX IF NOT EXISTS idx_content_tmdb_id ON content(tmdb_id);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_created_at ON content(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_is_top_rated ON content(is_top_rated) WHERE is_top_rated = true;
CREATE INDEX IF NOT EXISTS idx_content_is_top_movie ON content(is_top_movie, top_movie_rank) WHERE is_top_movie = true;
CREATE INDEX IF NOT EXISTS idx_content_is_kdrama ON content(is_kdrama) WHERE is_kdrama = true;

-- Create bot_logs table
CREATE TABLE IF NOT EXISTS bot_logs (
  id BIGSERIAL PRIMARY KEY,
  action VARCHAR(50) NOT NULL,
  tmdb_id INTEGER,
  user_id BIGINT,
  username VARCHAR(255),
  message TEXT,
  success BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bot_logs_action ON bot_logs(action);
CREATE INDEX IF NOT EXISTS idx_bot_logs_created_at ON bot_logs(created_at DESC);
