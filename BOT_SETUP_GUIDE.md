# Telegram Bot CMS Setup Guide

## Overview
Your website now uses a Telegram bot as a Content Management System. Only movies/TV shows added through the bot will appear on the website.

## Bot Information
- **Bot Token**: `8139158878:AAF2eiOeOrHb5TNZ9aKO69SIe7rBOCLW_10`
- **TMDB API Key**: `61b1d28917bca6adcd5f2dc0e2c772bd`

## Setup Steps

### 1. Create Database Tables
Run the SQL script to create the required tables:
\`\`\`bash
# The script is located at: scripts/001_create_content_tables.sql
# Run it in your Neon database console or use the v0 script runner
\`\`\`

### 2. Set Telegram Webhook
After deploying your site, set the webhook URL so Telegram sends updates to your bot:

\`\`\`bash
curl -X POST "https://api.telegram.org/bot8139158878:AAF2eiOeOrHb5TNZ9aKO69SIe7rBOCLW_10/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://YOUR_DOMAIN.vercel.app/api/telegram"}'
\`\`\`

Replace `YOUR_DOMAIN` with your actual Vercel domain.

### 3. Verify Webhook
Check if webhook is set correctly:
\`\`\`bash
curl "https://api.telegram.org/bot8139158878:AAF2eiOeOrHb5TNZ9aKO69SIe7rBOCLW_10/getWebhookInfo"
\`\`\`

## Bot Commands

### `/start` or `/help`
Shows the help message with all available commands.

### `/add [tmdb_url] [download_link] [download_title]`
Adds a movie or TV show to your website.

**Example:**
\`\`\`
/add https://www.themoviedb.org/movie/603692 https://example.com/download.mp4 Download HD
\`\`\`

**What happens:**
1. Bot fetches movie/TV data from TMDB
2. Stores it in your database with the download link
3. Content appears on your website immediately
4. Bot sends confirmation with movie details

### `/delete [tmdb_id]`
Removes content from your website.

**Example:**
\`\`\`
/delete 603692
\`\`\`

### `/list`
Shows the latest 10 items added to your website.

**Example:**
\`\`\`
/list
\`\`\`

## How It Works

### Content Flow
1. **Add via Bot** → Bot fetches TMDB data → Stores in database with download link
2. **Website** → Fetches content from database → Displays with download button
3. **Delete via Bot** → Marks content as deleted → Removed from website

### Database Structure
- **content table**: Stores all movies/TV shows with TMDB data + download links
- **bot_logs table**: Tracks all bot actions for debugging

### API Endpoints
- `POST /api/telegram` - Telegram webhook (receives bot commands)
- `GET /api/db-content` - Fetches all content for website pages
- `GET /api/db-content/[id]` - Fetches specific content by TMDB ID

## Features

### Website Changes
- **Home page**: Shows only bot-added content
- **Movies page**: Shows only bot-added movies
- **TV page**: Shows only bot-added TV shows
- **Anime page**: Shows only bot-added anime
- **Detail pages**: Show download button if content has download link

### Bot Features
- ✅ Add content with custom download links
- ✅ Delete content by TMDB ID
- ✅ List recent content
- ✅ Automatic TMDB data fetching
- ✅ Action logging for debugging
- ✅ Rich notifications with movie details

## Troubleshooting

### Bot not responding
1. Check webhook is set correctly: `getWebhookInfo`
2. Check bot token is correct
3. Check your domain is accessible

### Content not showing on website
1. Verify content was added successfully (bot sends confirmation)
2. Check database has the content: Query `SELECT * FROM content`
3. Check API endpoint: Visit `/api/db-content` in browser

### Download button not showing
1. Make sure you included download link when adding content
2. Check the content in database has `download_link` field populated

## Example Workflow

1. **Find a movie on TMDB**: https://www.themoviedb.org/movie/603692
2. **Get your download link**: https://example.com/movie.mp4
3. **Send to bot**:
   \`\`\`
   /add https://www.themoviedb.org/movie/603692 https://example.com/movie.mp4 Download 1080p
   \`\`\`
4. **Bot confirms**: ✅ Added Successfully! 🎬 John Wick: Chapter 4...
5. **Check website**: Movie appears on homepage and movies page with download button

## Notes

- The website will be empty until you add content via the bot
- All TMDB data (poster, rating, cast, etc.) is fetched automatically
- Download links are stored securely in your database
- You can update download links by re-adding the same movie
- Deleted content is soft-deleted (marked as deleted, not removed from database)
