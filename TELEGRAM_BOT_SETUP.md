# 🤖 Telegram Bot Setup Guide

Your MovieFlix website is now powered by a Telegram bot! This means **only content you add through the bot will appear on your website**.

## 📋 Quick Start

### 1. Set Up the Webhook (After Deployment)

Once you deploy to Vercel, set the webhook URL:

\`\`\`bash
curl -X POST https://your-domain.vercel.app/api/bot/setup \
  -H "Content-Type: application/json" \
  -d '{"webhookUrl": "https://your-domain.vercel.app/api/bot/webhook"}'
\`\`\`

Or visit: `https://your-domain.vercel.app/api/bot/setup` to check webhook status.

### 2. Find Your Bot on Telegram

Search for your bot on Telegram using the bot token: `@your_bot_username`

Send `/start` to begin!

## 🎬 Bot Commands

### `/start`
Shows welcome message and available commands.

### `/add [tmdb_url] [download_link]`
Adds a movie or TV show to your website.

**Example:**
\`\`\`
/add https://www.themoviedb.org/movie/603 https://example.com/matrix-download
\`\`\`

**What happens:**
1. Bot fetches movie data from TMDB
2. Stores it in your database with the download link
3. Content appears on your website immediately
4. Download button is added to the detail page

### `/delete [tmdb_id]`
Removes content from your website.

**Example:**
\`\`\`
/delete 603
\`\`\`

### `/list`
Shows all content currently on your website.

## 🔧 Configuration

### Bot Token
Already configured: `8139158878:AAF2eiOeOrHb5TNZ9aKO69SIe7rBOCLW_10`

### TMDB API Key
Already configured: `61b1d28917bca6adcd5f2dc0e2c772bd`

### Database
Using Neon PostgreSQL (already connected)

## 📝 How It Works

1. **Empty by Default**: Your website shows no content until you add it via the bot
2. **Bot as CMS**: The Telegram bot acts as your content management system
3. **TMDB Integration**: Bot fetches movie/TV data from TMDB automatically
4. **Custom Downloads**: You provide download links when adding content
5. **Real-time Updates**: Content appears on the website immediately after adding

## 🎯 Workflow Example

1. Find a movie on TMDB: `https://www.themoviedb.org/movie/603`
2. Get your download link: `https://example.com/download/matrix`
3. Send to bot: `/add https://www.themoviedb.org/movie/603 https://example.com/download/matrix`
4. Bot confirms: "✅ Added Successfully! The Matrix is now live on your website!"
5. Visit your website: Movie appears with download button

## 🚀 Deployment Checklist

- [x] Database tables created (content, bot_logs)
- [x] Bot webhook route created (`/api/bot/webhook`)
- [x] All pages fetch from database
- [ ] Deploy to Vercel
- [ ] Set webhook URL (see step 1 above)
- [ ] Test bot with `/start` command
- [ ] Add your first movie with `/add`

## 🐛 Troubleshooting

**Bot not responding?**
- Check webhook is set correctly: Visit `/api/bot/setup`
- Verify bot token is correct
- Check Vercel logs for errors

**Content not appearing?**
- Verify database connection
- Check bot logs table for errors
- Ensure TMDB URL format is correct

**Download button not showing?**
- Make sure you provided a download link when adding content
- Check the content in database has `download_link` field

## 📊 Database Schema

### `content` table
Stores all movies/TV shows added via bot.

### `bot_logs` table
Tracks all bot actions for debugging.

## 🎉 You're All Set!

Your website is now a curated collection managed entirely through Telegram. Add content via the bot and watch it appear on your site instantly!
