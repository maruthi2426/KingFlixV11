# 🤖 Telegram Bot Setup Guide

Your MovieFlix website is now powered by a Telegram bot! Follow these steps to get it running.

## 📋 Quick Setup

### Step 1: Deploy Your Website

Deploy your website to Vercel first. You'll need the live URL for the webhook.

### Step 2: Set the Webhook

After deployment, visit this URL in your browser (replace with your actual domain):

\`\`\`
https://YOUR-DOMAIN.vercel.app/api/bot/setup
\`\`\`

This will show you the current webhook status. To set the webhook, use this command in your terminal or a tool like Postman:

\`\`\`bash
curl -X POST https://YOUR-DOMAIN.vercel.app/api/bot/setup \
  -H "Content-Type: application/json" \
  -d '{"webhookUrl": "https://YOUR-DOMAIN.vercel.app/api/bot"}'
\`\`\`

Or visit this URL directly in your browser:
\`\`\`
https://api.telegram.org/bot8139158878:AAF2eiOeOrHb5TNZ9aKO69SIe7rBOCLW_10/setWebhook?url=https://YOUR-DOMAIN.vercel.app/api/bot
\`\`\`

### Step 3: Start Using the Bot

Open Telegram and search for your bot, then send `/start` to begin!

## 🎬 Bot Commands

### `/start` or `/help`
Shows welcome message and available commands

### `/add` - Add New Content
Add a movie or TV show to your website:

\`\`\`
/add https://www.themoviedb.org/movie/603692
1080p BluRay
https://example.com/download/john-wick-4
\`\`\`

Format:
- Line 1: `/add` followed by TMDB URL
- Line 2: Download title (e.g., "1080p BluRay", "4K HDR")
- Line 3: Download link (optional)

### `/delete [TMDB_ID]` - Remove Content
Delete content from your website:

\`\`\`
/delete 603692
\`\`\`

### `/list` - View All Content
See all movies and TV shows currently on your website

## 🔍 How It Works

1. **You send a TMDB URL** to the bot with `/add`
2. **Bot fetches movie data** from TMDB (title, poster, rating, etc.)
3. **Bot stores it in your database** with your custom download link
4. **Website displays the content** automatically
5. **Users see the download button** on the detail page

## 🎯 Features

- ✅ Only content you add via bot appears on website
- ✅ Custom download links for each movie/TV show
- ✅ Automatic TMDB data fetching
- ✅ Real-time updates to website
- ✅ Activity logging
- ✅ Easy content management

## 🚀 Example Workflow

1. Find a movie on TMDB: `https://www.themoviedb.org/movie/603692`
2. Send to bot:
   \`\`\`
   /add https://www.themoviedb.org/movie/603692
   1080p BluRay
   https://drive.google.com/file/d/xyz
   \`\`\`
3. Bot confirms: "✅ Successfully added! John Wick: Chapter 4 is now live!"
4. Movie appears on your website with download button

## 🛠 Troubleshooting

**Bot not responding?**
- Check webhook status: `https://YOUR-DOMAIN.vercel.app/api/bot/setup`
- Make sure webhook URL is set correctly
- Check Vercel logs for errors

**Content not showing on website?**
- Check database connection
- Verify TMDB API key is correct
- Check browser console for errors

**Download button not showing?**
- Make sure you provided a download link when adding content
- Check the detail page for the specific movie/TV show

## 📝 Notes

- Bot token and TMDB API key are hardcoded in the bot route
- Database tables are already created
- Website shows empty state until you add content via bot
- All bot actions are logged in the `bot_logs` table
\`\`\`

\`\`\`typescriptreact file="app/api/telegram-webhook/route.tsx" isDeleted="true"
...deleted...
