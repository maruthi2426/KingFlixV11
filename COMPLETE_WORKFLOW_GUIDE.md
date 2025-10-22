# MovieFlix Complete Workflow Guide

## System Overview

Your MovieFlix system has three main components working together:

### 1. **Telegram Bot Webhook** (`/api/bot/webhook`)
- Receives commands from Telegram users
- Extracts TMDB URLs and fetches movie data
- Stores minimal data in Supabase database
- Sends confirmation messages back to Telegram

### 2. **Supabase Database** 
- Stores only essential movie information:
  - `tmdb_id` - The TMDB movie ID
  - `title` - Movie/TV show title
  - `release_date` - Release date
  - `vote_average` - TMDB rating (0-10)
  - `media_type` - "movie" or "tv"
  - `download_link` - Optional download URL
  - `is_top_rated`, `is_top_movie`, `is_kdrama` - Category flags

### 3. **Website Display** (`/movies`, `/tv`, `/anime`)
- Fetches minimal data from database
- Enriches with full TMDB details on-demand
- Displays posters, ratings, descriptions, etc.

---

## Complete Workflow: Adding a Movie

### Step 1: User Sends Telegram Command

User sends to your bot:
\`\`\`
/add https://www.themoviedb.org/movie/550 https://example.com/download
\`\`\`

**Available Commands:**
- `/add [tmdb_url] [download_link]` - Add regular content
- `/addtoprated [tmdb_url]` - Add to Top 10 (Movies & TV)
- `/addtopmovie [tmdb_url]` - Add to Top 10 Movies
- `/addkdrama [tmdb_url]` - Add to K-Drama Collection
- `/delete [tmdb_id]` - Delete content
- `/list` - Show all content

### Step 2: Webhook Receives Request

The webhook at `/api/bot/webhook` receives the Telegram update:

\`\`\`typescript
// Webhook extracts:
- Command: "/add"
- TMDB URL: "https://www.themoviedb.org/movie/550"
- Download Link: "https://example.com/download"
- User ID & Username: For logging
\`\`\`

### Step 3: Extract TMDB ID from URL

The `fetchTMDBDataFromUrl()` function parses the URL:

\`\`\`typescript
// Regex extracts: mediaType="movie", tmdbId=550
const match = tmdbUrl.match(/themoviedb\.org\/(movie|tv)\/(\d+)/)
// Result: mediaType="movie", tmdbId=550
\`\`\`

### Step 4: Fetch Full Movie Data from TMDB API

The webhook calls `fetchTMDBMovieDetails()`:

\`\`\`typescript
// Calls TMDB API:
GET https://api.themoviedb.org/3/movie/550?api_key=YOUR_KEY&append_to_response=videos,credits,images,similar,recommendations

// Returns full movie object with:
{
  id: 550,
  title: "Fight Club",
  overview: "An insomniac office worker...",
  poster_path: "/adw6Lq9FiC9zjYEixi33H53NvO8.jpg",
  release_date: "1999-10-15",
  vote_average: 8.8,
  genres: [...],
  runtime: 139,
  // ... 50+ more fields
}
\`\`\`

### Step 5: Store ONLY Minimal Data in Database

Instead of storing the entire TMDB response (50+ fields), we store only:

\`\`\`typescript
// Database INSERT:
{
  tmdb_id: 550,
  media_type: "movie",
  title: "Fight Club",
  release_date: "1999-10-15",
  vote_average: 8.8,
  download_link: "https://example.com/download",
  download_title: "Download Now",
  is_top_rated: false,
  is_top_movie: false,
  is_kdrama: false,
  status: "active",
  created_at: "2024-10-18T12:00:00Z"
}
\`\`\`

**Why minimal data?**
- Reduces database size by 90%
- Avoids rate limit errors
- Always fresh data from TMDB API
- Faster queries

### Step 6: Send Confirmation to Telegram

\`\`\`
✅ Added Successfully!

🎬 Fight Club
📅 1999-10-15
⭐ 8.8/10
🆔 TMDB ID: 550

Your content is now live on the website!
\`\`\`

### Step 7: User Visits Website

User goes to `https://yoursite.com/movies`

The page calls `/api/db-content?type=movie`:

\`\`\`typescript
// API returns minimal data from database:
[
  {
    id: 1,
    tmdb_id: 550,
    title: "Fight Club",
    release_date: "1999-10-15",
    vote_average: 8.8,
    media_type: "movie",
    download_link: "https://example.com/download"
  }
]
\`\`\`

### Step 8: Website Enriches Data with TMDB Details

The `MediaCard` component calls `fetchTMDBMovieDetails()`:

\`\`\`typescript
// For each movie, fetch full details:
const fullData = await fetchTMDBMovieDetails(550, "movie")

// Now we have:
{
  poster_path: "/adw6Lq9FiC9zjYEixi33H53NvO8.jpg",
  backdrop_path: "/...",
  overview: "An insomniac office worker...",
  genres: ["Drama", "Thriller"],
  runtime: 139,
  credits: { cast: [...], crew: [...] },
  videos: { results: [...] },
  // ... all 50+ fields
}
\`\`\`

### Step 9: Display Movie on Website

The `MediaCard` component renders:

\`\`\`
┌─────────────────┐
│   [Poster]      │  ← From TMDB API
│                 │
│  Fight Club     │  ← From Database
│  ⭐ 8.8/10      │  ← From Database
│  1999-10-15     │  ← From Database
│                 │
│ [Download]      │  ← From Database
└─────────────────┘
\`\`\`

---

## Database Schema

\`\`\`sql
CREATE TABLE content (
  id BIGSERIAL PRIMARY KEY,
  tmdb_id INTEGER UNIQUE NOT NULL,
  media_type TEXT NOT NULL,
  title TEXT NOT NULL,
  release_date TEXT,
  vote_average DECIMAL(3,1),
  download_link TEXT,
  download_title TEXT,
  is_top_rated BOOLEAN DEFAULT FALSE,
  is_top_movie BOOLEAN DEFAULT FALSE,
  top_movie_rank INTEGER,
  is_kdrama BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

---

## API Endpoints

### 1. Telegram Webhook
- **URL:** `/api/bot/webhook`
- **Method:** POST
- **Purpose:** Receives Telegram updates
- **Payload:** Telegram message object

### 2. Get Database Content
- **URL:** `/api/db-content?type=movie&limit=20`
- **Method:** GET
- **Purpose:** Fetch movies/TV from database
- **Response:** Array of content items

### 3. Bot Setup
- **URL:** `/api/bot/setup`
- **Method:** POST
- **Purpose:** Register webhook with Telegram

---

## Environment Variables Required

\`\`\`
TELEGRAM_BOT_TOKEN=your_bot_token_here
TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
\`\`\`

---

## Testing the System

### Test 1: Add a Movie via Telegram

1. Open Telegram and find your bot
2. Send: `/add https://www.themoviedb.org/movie/550 https://example.com/download`
3. Bot should respond with confirmation
4. Check Supabase: Table `content` should have 1 new row

### Test 2: View on Website

1. Go to `https://yoursite.com/movies`
2. You should see the Fight Club movie card
3. Click on it to see full details from TMDB

### Test 3: List All Content

1. Send `/list` to the bot
2. Bot should show all movies in database

### Test 4: Delete Content

1. Send `/delete 550` to the bot
2. Movie should be removed from website

---

## Troubleshooting

### Bot doesn't respond
- Check `TELEGRAM_BOT_TOKEN` is correct
- Verify webhook is registered: `/api/bot/setup`
- Check bot logs in Telegram

### Movies don't appear on website
- Check Supabase table has data: `SELECT * FROM content`
- Verify `TMDB_API_KEY` is correct
- Check browser console for errors

### Database errors
- Ensure SQL migration script was run
- Check Supabase credentials in environment variables
- Verify table `content` exists in Supabase

---

## Key Features

✅ **Minimal Database Storage** - Only essential data stored
✅ **Fresh TMDB Data** - Always fetches latest details
✅ **No Rate Limits** - Reduced API calls to TMDB
✅ **Fast Queries** - Minimal data = faster database queries
✅ **Easy Management** - Simple Telegram commands
✅ **Scalable** - Can handle thousands of movies

---

## Next Steps

1. **Test adding a movie** via Telegram bot
2. **Verify it appears** on the website
3. **Add more movies** using different commands
4. **Customize categories** (Top Rated, Top Movies, K-Dramas)
5. **Monitor database** growth and performance
