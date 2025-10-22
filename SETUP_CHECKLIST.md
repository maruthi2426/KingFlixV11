# MovieFlix Supabase Setup Checklist

## Pre-Setup
- [ ] Have TMDB API key ready
- [ ] Have Telegram Bot token ready
- [ ] Have Supabase account

## Supabase Setup
- [ ] Create new Supabase project
- [ ] Copy Project URL to `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copy Service Role Key to `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Run SQL migration to create tables
- [ ] (Optional) Enable Row Level Security

## Environment Variables
Add to Vercel project settings:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `TMDB_API_KEY`
- [ ] `TELEGRAM_BOT_TOKEN`

## Code Updates
- [ ] Updated `lib/db.ts` to use Supabase
- [ ] Updated `app/api/bot/webhook/route.tsx` to store minimal data
- [ ] Created `lib/tmdb-fetch.ts` for fetching full TMDB data
- [ ] Updated `app/api/db-content/route.ts` to enrich data with TMDB

## Testing
- [ ] Deploy to Vercel
- [ ] Check `/bot-setup` page
- [ ] Test Telegram bot `/start` command
- [ ] Add a test movie via `/add` command
- [ ] Verify movie appears on website
- [ ] Check database size (should be small)

## Verification
- [ ] Database only stores minimal data
- [ ] Website displays full movie details from TMDB
- [ ] Telegram bot shows confirmation with title, year, rating, TMDB ID
- [ ] No rate limit errors
- [ ] Database queries are fast

## Troubleshooting
If issues occur:
1. Check environment variables are set correctly
2. Check Supabase project status
3. Check TMDB API key is valid
4. Check Telegram bot token is valid
5. Check browser console for errors
6. Check Vercel deployment logs
