-- Add missing columns to content table for Korean content and top rated features
ALTER TABLE content ADD COLUMN IF NOT EXISTS is_top_rated BOOLEAN DEFAULT false;
ALTER TABLE content ADD COLUMN IF NOT EXISTS is_top_movie BOOLEAN DEFAULT false;
ALTER TABLE content ADD COLUMN IF NOT EXISTS top_movie_rank INTEGER;
ALTER TABLE content ADD COLUMN IF NOT EXISTS is_kdrama BOOLEAN DEFAULT false;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_content_is_top_rated ON content(is_top_rated) WHERE is_top_rated = true;
CREATE INDEX IF NOT EXISTS idx_content_is_top_movie ON content(is_top_movie, top_movie_rank) WHERE is_top_movie = true;
CREATE INDEX IF NOT EXISTS idx_content_is_kdrama ON content(is_kdrama) WHERE is_kdrama = true;
CREATE INDEX IF NOT EXISTS idx_content_korean_language ON content(original_language) WHERE original_language = 'ko';
