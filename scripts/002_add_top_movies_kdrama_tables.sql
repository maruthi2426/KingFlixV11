-- Create top_movies table for Top 10 Movies section
CREATE TABLE IF NOT EXISTS top_movies (
  id SERIAL PRIMARY KEY,
  tmdb_id INTEGER NOT NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  poster_path VARCHAR(500),
  backdrop_path VARCHAR(500),
  overview TEXT,
  release_date VARCHAR(50),
  vote_average DECIMAL(3,1),
  vote_count INTEGER,
  rank INTEGER,
  download_link TEXT,
  download_title VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create k_dramas table for K-Drama section
CREATE TABLE IF NOT EXISTS k_dramas (
  id SERIAL PRIMARY KEY,
  tmdb_id INTEGER NOT NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  poster_path VARCHAR(500),
  backdrop_path VARCHAR(500),
  overview TEXT,
  release_date VARCHAR(50),
  vote_average DECIMAL(3,1),
  vote_count INTEGER,
  genres JSONB,
  download_link TEXT,
  download_title VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create genre_mapping table for genres section
CREATE TABLE IF NOT EXISTS genre_mapping (
  id SERIAL PRIMARY KEY,
  content_id INTEGER NOT NULL,
  genre_id INTEGER NOT NULL,
  genre_name VARCHAR(100) NOT NULL,
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('movie', 'tv')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_top_movies_rank ON top_movies(rank);
CREATE INDEX IF NOT EXISTS idx_k_dramas_vote_average ON k_dramas(vote_average DESC);
CREATE INDEX IF NOT EXISTS idx_genre_mapping_genre ON genre_mapping(genre_name);
CREATE INDEX IF NOT EXISTS idx_genre_mapping_media_type ON genre_mapping(media_type);
