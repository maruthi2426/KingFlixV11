# Environment Variables Setup Guide

Your Neon database is connected! Now you need to add one more environment variable to make everything work.

## What You Have ✅
- `NEON_NEON_DATABASE_URL` - Your Neon connection string
- `TELEGRAM_BOT_TOKEN` - Your Telegram bot token
- `TMDB_API_KEY` - Your TMDB API key
- All Postgres connection parameters (PGHOST, PGUSER, PGPASSWORD, etc.)

## What You Need to Add ❌

The app is looking for a `DATABASE_URL` environment variable. You need to:

### Option 1: Add DATABASE_URL (Recommended)
1. Go to **Vars** in the v0 sidebar
2. Click the **+** button to add a new variable
3. Set the name to: `DATABASE_URL`
4. Copy the value from your `NEON_DATABASE_URL` variable
5. Click Save

### Option 2: Rename NEON_DATABASE_URL to DATABASE_URL
If you prefer, you can rename the existing `NEON_DATABASE_URL` to `DATABASE_URL` instead.

## After Adding DATABASE_URL

1. **Redeploy** your application (push to GitHub or click Publish in v0)
2. **Wait for deployment** to complete
3. **Use your Telegram bot** to add movies/shows:
   - Send `/start` to your bot
   - Send `/add_movie` or `/add_show` with TMDB IDs
   - The content will automatically appear on your website

## Database Tables

The app will automatically create these tables on first run:
- `content` - Stores movies, TV shows, and anime
- `bot_logs` - Tracks bot actions

## Troubleshooting

If you still see "Unable to Load Content":
1. Check that `DATABASE_URL` is set in Vars
2. Verify the deployment completed successfully
3. Check the debug logs for any connection errors
4. Make sure your Telegram bot has added at least one item

## Next Steps

Once everything is set up:
1. Use your Telegram bot to add content
2. Content will appear on the homepage, movies, TV, and anime pages
3. Users can search and browse your content
