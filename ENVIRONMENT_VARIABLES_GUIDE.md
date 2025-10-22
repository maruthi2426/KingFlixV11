# Environment Variables Setup Guide

## Overview
Your MovieFlix app uses environment variables for configuration. Some are **public** (visible in browser) and some are **secret** (server-only).

---

## All Required Environment Variables

### 1. **Supabase Database** (Required)
**Files Used In:**
- `lib/db.ts` - Database connection
- `app/api/db-content/route.ts` - API routes
- `app/api/bot/webhook/route.tsx` - Telegram webhook

**Variables:**
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

**Where to get them:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Settings** → **API**
4. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `Service Role Secret` → `SUPABASE_SERVICE_ROLE_KEY`

---

### 2. **TMDB API Key** (Required - Server Only)
**Files Used In:**
- `lib/tmdb.ts` - Get API key (server-only)
- `app/api/tmdb/movie/route.ts` - Server route to fetch TMDB data

**Variables:**
\`\`\`
TMDB_API_KEY=your-tmdb-api-key
\`\`\`

**⚠️ IMPORTANT:** This is a server-only variable. Do NOT prefix with `NEXT_PUBLIC_` - this keeps the key secure on the server.

**Where to get it:**
1. Go to [TMDB Website](https://www.themoviedb.org)
2. Sign up or login
3. Go to **Settings** → **API**
4. Copy your **API Key (v3 auth)**

---

### 3. **Telegram Bot Token** (Required - Server Only)
**Files Used In:**
- `app/api/bot/webhook/route.tsx` - Receive Telegram messages
- `lib/telegram.ts` - Send Telegram messages

**Variables:**
\`\`\`
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
\`\`\`

**Where to get it:**
1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow the steps to create a bot
4. Copy the **HTTP API token**

---

### 4. **Site URL** (Optional but Recommended)
**Files Used In:**
- `app/page.tsx` - Homepage
- `app/movies/page.tsx` - Movies page
- `app/tv/page.tsx` - TV shows page
- `app/anime/page.tsx` - Anime page
- `app/api/bot/setup/route.ts` - Bot setup

**Variables:**
\`\`\`
NEXT_PUBLIC_SITE_URL=https://your-domain.com
\`\`\`

**What to use:**
- If deployed on Vercel: `https://your-project.vercel.app`
- If custom domain: `https://yourdomain.com`
- Leave empty to auto-detect from `VERCEL_URL`

---

## How to Add Variables to Vercel

### Step 1: Go to Vercel Dashboard
1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **MovieFlix** project

### Step 2: Add Environment Variables
1. Click **Settings** (top menu)
2. Click **Environment Variables** (left sidebar)
3. For each variable, click **Add New**

### Step 3: Enter Variables
For each variable:
- **Name:** (e.g., `TMDB_API_KEY`)
- **Value:** (paste the actual value)
- **Environments:** Select `Production`, `Preview`, and `Development`
- Click **Save**

### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click the three dots on the latest deployment
3. Click **Redeploy**

---

## Variable Checklist

Copy and paste this into Vercel:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
TMDB_API_KEY=
TELEGRAM_BOT_TOKEN=
NEXT_PUBLIC_SITE_URL=
\`\`\`

---

## Public vs Secret Variables

### Public Variables (Visible in Browser)
- `NEXT_PUBLIC_SUPABASE_URL` - Safe to expose
- `NEXT_PUBLIC_SITE_URL` - Safe to expose

### Secret Variables (Server-Only)
- `SUPABASE_SERVICE_ROLE_KEY` - **NEVER expose** - Only used on server
- `TMDB_API_KEY` - **NEVER expose** - Only used on server via API routes
- `TELEGRAM_BOT_TOKEN` - **NEVER expose** - Only used on server

---

## Testing Variables

### Test Supabase Connection
\`\`\`bash
curl -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  https://your-project.supabase.co/rest/v1/content?limit=1
\`\`\`

### Test TMDB API
\`\`\`bash
curl "https://api.themoviedb.org/3/movie/550?api_key=YOUR_TMDB_API_KEY"
\`\`\`

### Test Telegram Bot
\`\`\`bash
curl -X POST https://api.telegram.org/botYOUR_BOT_TOKEN/getMe
\`\`\`

---

## Troubleshooting

### "Missing environment variables" error
- Check all variables are added in Vercel
- Redeploy after adding variables
- Wait 2-3 minutes for changes to take effect

### "Supabase connection failed"
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct (not the anon key)
- Check Supabase project is active

### "TMDB API key invalid"
- Verify you copied the **v3 auth** key (not v4)
- Check key hasn't expired
- Verify no extra spaces in the key
- Ensure the variable is named `TMDB_API_KEY` (server-only)

### "Telegram bot not responding"
- Verify `TELEGRAM_BOT_TOKEN` is correct
- Check bot is active in BotFather
- Verify webhook URL is set correctly

---

## Next Steps

1. ✅ Add `TMDB_API_KEY` to Vercel (server-only, no NEXT_PUBLIC prefix)
2. ✅ Add all other variables to Vercel
3. ✅ Redeploy your project
4. ✅ Test the Telegram bot
5. ✅ Add movies via bot
6. ✅ View movies on website
