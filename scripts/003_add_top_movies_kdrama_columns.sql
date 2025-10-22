-- Add columns to content table for categorization
ALTER TABLE content ADD COLUMN IF NOT EXISTS is_top_movie BOOLEAN DEFAULT false;
ALTER TABLE content ADD COLUMN IF NOT EXISTS is_kdrama BOOLEAN DEFAULT false;
ALTER TABLE content ADD COLUMN IF NOT EXISTS top_movie_rank INTEGER;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_content_is_top_movie ON content(is_top_movie) WHERE is_top_movie = true;
CREATE INDEX IF NOT EXISTS idx_content_is_kdrama ON content(is_kdrama) WHERE is_kdrama = true;
CREATE INDEX IF NOT EXISTS idx_content_top_movie_rank ON content(top_movie_rank) WHERE top_movie_rank IS NOT NULL;
