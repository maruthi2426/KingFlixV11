-- Create content table for movies, TV shows, and anime
CREATE TABLE IF NOT EXISTS content (
  id SERIAL PRIMARY KEY,
  tmdb_id INTEGER NOT NULL UNIQUE,
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('movie', 'tv', 'anime')),
  title VARCHAR(500) NOT NULL,
  original_title VARCHAR(500),
  overview TEXT,
  poster_path VARCHAR(500),
  backdrop_path VARCHAR(500),
  release_date VARCHAR(50),
  vote_average DECIMAL(3,1),
  vote_count INTEGER,
  popularity DECIMAL(10,3),
  runtime INTEGER,
  genres JSONB,
  videos JSONB,
  credits JSONB,
  seasons JSONB,
  number_of_seasons INTEGER,
  download_link TEXT,
  download_title VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_content_media_type ON content(media_type);
CREATE INDEX IF NOT EXISTS idx_content_tmdb_id ON content(tmdb_id);
CREATE INDEX IF NOT EXISTS idx_content_popularity ON content(popularity DESC);
CREATE INDEX IF NOT EXISTS idx_content_created_at ON content(created_at DESC);

-- Create bot_logs table to track bot actions
CREATE TABLE IF NOT EXISTS bot_logs (
  id SERIAL PRIMARY KEY,
  action VARCHAR(50) NOT NULL,
  tmdb_id INTEGER,
  user_id BIGINT,
  username VARCHAR(255),
  message TEXT,
  success BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
