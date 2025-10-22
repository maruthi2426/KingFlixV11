# Telegram Bot Setup - Complete Guide

## Current Status
Your bot is **NOT responding** because the webhook URL is incorrect.

## Problem
The webhook is pointing to: `/tv/286801/api/telegram-webhook` ❌
It should point to: `/api/bot/webhook` ✅

## Quick Fix (3 Steps)

### Step 1: Visit Setup Page
Go to: `https://v0-movie-flix-v-1.vercel.app/bot-setup`

### Step 2: Click "Fix Webhook URL Now"
The page will automatically detect the wrong URL and show a red alert with a fix button.

### Step 3: Test in Telegram
Open your bot and send:
\`\`\`
/start
\`\`\`

You should get a welcome message immediately.

## How to Add Movies

Once the webhook is fixed, use this command format:

\`\`\`
/add https://www.themoviedb.org/movie/1186350 https://example.com/download
\`\`\`

The bot will:
1. Fetch movie data from TMDB
2. Store it in your database with the download link
3. Display it on your website automatically

## All Commands

- `/start` - Welcome message and help
- `/list` - Show all content in database
- `/add [tmdb_url] [download_link]` - Add new content
- `/delete [tmdb_id]` - Remove content

## Troubleshooting

### Bot not responding?
1. Check webhook URL at `/bot-setup`
2. Make sure it ends with `/api/bot/webhook`
3. Click "Fix Webhook URL Now" if incorrect

### Movies not showing on website?
1. Send `/list` to bot to verify content was added
2. Refresh your website homepage
3. Check browser console for errors

### Database errors?
The database tables already exist. If you see SQL warnings, they're just notices and can be ignored.

## Technical Details

- **Bot Token**: `8139158878:AAF2eiOeOrHb5TNZ9aKO69SIe7rBOCLW_10`
- **TMDB API Key**: `61b1d28917bca6adcd5f2dc0e2c772bd`
- **Webhook Path**: `/api/bot/webhook`
- **Database**: Neon (connected)
- **Tables**: `content`, `bot_logs`

## What Happens When You Add Content

1. You send `/add` command with TMDB URL
2. Bot fetches full movie data from TMDB API
3. Bot stores data + your download link in Neon database
4. Website queries database and displays the content
5. Download button appears on detail pages

## Important Notes

- Website shows ONLY content added via bot
- No content = empty website
- Each movie needs a unique TMDB ID
- Download links are stored as-is (not validated)
