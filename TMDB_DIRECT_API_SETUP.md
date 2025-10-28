# MovieFlix - TMDB Direct API Setup

## Overview

This version of MovieFlix fetches all content directly from TMDB API. **No database is required** - all data comes from TMDB in real-time.

## What Changed

✅ **Removed:**
- Telegram bot webhook (no more database storage)
- Supabase database dependency
- Database migration scripts
- All database queries

✅ **Added:**
- Direct TMDB API integration
- Real-time movie/TV show fetching
- Automatic caching for performance
- Korean content filtering (K-dramas)
- Animation genre filtering

## Environment Variables Required

Add these to your Vercel project:

\`\`\`
TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_SITE_URL=https://your-domain.com (optional)
\`\`\`

## How It Works

### Homepage
- **Top 10**: Fetches top-rated movies and TV shows from TMDB
- **Recently Added**: Shows movies in theaters now
- **K-Dramas**: Filters TV shows by Korean region
- **Anime**: Filters movies by animation genre (ID: 16)
- **Movies/TV Shows**: Popular content from TMDB

### Pages
- `/movies` - Popular movies from TMDB
- `/tv` - Popular TV shows from TMDB
- `/anime` - Animation genre movies from TMDB

## API Routes

All routes now fetch from TMDB:

- `GET /api/db-content?type=movie|tv&limit=20&page=1` - Popular content
- `GET /api/top-rated-combined` - Top 10 movies and TV shows
- `GET /api/kdramas-db` - Korean TV shows
- `GET /api/animation` - Animation movies
- `GET /api/recently-added` - Movies in theaters now

## Caching

All responses are cached for performance:
- Popular content: 1 hour cache
- Search results: 30 minutes cache
- Top rated: 1 hour cache

## Getting TMDB API Key

1. Go to https://www.themoviedb.org/settings/api
2. Sign up for a free account
3. Request an API key
4. Copy your API key
5. Add to Vercel environment variables as `TMDB_API_KEY`

## Deployment

1. Add `TMDB_API_KEY` to Vercel environment variables
2. Deploy your project
3. All content will load from TMDB automatically

## No Database Needed

This version works completely without a database. All data is fetched from TMDB API in real-time.
