# Telegram Bot Quick Start Guide

## Your Bot is Ready! 🎉

Your Telegram bot is configured and ready to manage your movie website content.

### Setup Steps

1. **Set the Webhook** (One-time setup)
   - Visit: `https://your-domain.vercel.app/bot-setup`
   - Click "Set Webhook" button
   - The webhook URL will be automatically configured

2. **Start Using Your Bot**
   - Open Telegram and search for your bot
   - Send `/start` to see available commands

### Bot Commands

\`\`\`
/start
Shows welcome message and available commands

/add [tmdb_url] [download_link]
Adds a movie or TV show to your website
Example: /add https://www.themoviedb.org/movie/1186350 https://example.com/download

/delete [tmdb_id]
Removes content from your website
Example: /delete 1186350

/list
Shows all content currently on your website
\`\`\`

### How It Works

1. You send a TMDB URL to the bot with `/add`
2. Bot fetches all movie data from TMDB (title, poster, cast, etc.)
3. Bot stores it in your database with your download link
4. Content appears instantly on your website with a download button
5. Website only shows content you've added via the bot

### Important Notes

- **Website is empty by default** - No content shows until you add it via bot
- **TMDB URL format**: `https://www.themoviedb.org/movie/123` or `/tv/456`
- **Download link**: Any URL where users can download the content
- **Bot responds instantly** with success/error messages

### Troubleshooting

If bot doesn't respond:
1. Check webhook is set correctly at `/bot-setup`
2. Make sure you're using the correct bot token
3. Verify your Vercel deployment is live
4. Check the webhook URL matches your domain

### Your Configuration

- **Bot Token**: `8139158878:AAF2eiOeOrHb5TNZ9aKO69SIe7rBOCLW_10`
- **TMDB API Key**: `61b1d28917bca6adcd5f2dc0e2c772bd`
- **Webhook URL**: `https://your-domain.vercel.app/api/bot/webhook`

Replace `your-domain.vercel.app` with your actual Vercel domain after deployment.
