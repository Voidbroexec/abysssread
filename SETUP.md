# 🚀 AbyssRead Setup Guide

Follow these steps to get AbyssRead running with your Supabase database.

## 📋 Prerequisites

- Node.js 18+ installed
- pnpm package manager
- A Supabase account (free tier works)

## 🔧 Step-by-Step Setup

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd abyssread
pnpm install
\`\`\`

### 2. Environment Configuration

Your Supabase project is already configured! Just add your **service role key**:

1. Go to [Supabase Dashboard → Settings → API](https://supabase.com/dashboard/project/ykbkubowjyuedbrdydaj/settings/api)
2. Copy your **service_role** key (the long one that starts with `eyJ...`)
3. Update `.env.local`:

   \`\`\`env
     NEXT_PUBLIC_SUPABASE_URL=https://ykbkubowjyuedbrdydaj.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrYmt1Ym93anl1ZWRicmR5ZGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzY0NTgsImV4cCI6MjA2Mzc1MjQ1OH0.WLLnZZ8CcybMccXDO1rE4CrnRQd3KonYGM-7nStw2hc
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrYmt1Ym93anl1ZWRicmR5ZGFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE3NjQ1OCwiZXhwIjoyMDYzNzUyNDU4fQ.sTVxv9wHRgTpi16DdCiIJIzdp4w9vApm2rteG06lwzs
   API_KEY=abyssread_secure_api_key_2024_manhwa_scraper_v1
   

   # API key for scraper (already set):
   API_KEY=abyssread_secure_api_key_2024_manhwa_scraper_v1
   \`\`\`

### 3. Set Up Database Schema

1. Go to [Supabase Dashboard → SQL Editor](https://supabase.com/dashboard/project/ykbkubowjyuedbrdydaj/sql)
2. Copy the entire contents of `database/schema.sql`
3. Paste and run the SQL script
4. Verify tables were created in the [Table Editor](https://supabase.com/dashboard/project/ykbkubowjyuedbrdydaj/editor)

### 4. Start Development Server

\`\`\`bash
pnpm dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) - you should see AbyssRead running!

## 🤖 Scraper Integration

### API Endpoint

Your scraper should send data to:
\`\`\`
POST http://localhost:3000/api/scraper
Headers:
  x-api-key: abyssread_secure_api_key_2024_manhwa_scraper_v1
  Content-Type: application/json
\`\`\`

### Example Scraper Request

\`\`\`python
import requests

# Add a new manhwa
data = {
    "type": "manhwa",
    "data": {
        "title": "Solo Leveling",
        "author": "Chugong",
        "artist": "DUBU (REDICE STUDIO)",
        "description": "Story description...",
        "cover_url": "https://example.com/cover.jpg",
        "rating": 4.9,
        "status": "completed",
        "genres": ["Action", "Fantasy"],
        "source_url": "https://source.com/solo-leveling"
    }
}

response = requests.post(
    "http://localhost:3000/api/scraper",
    headers={
        "x-api-key": "abyssread_secure_api_key_2024_manhwa_scraper_v1",
        "Content-Type": "application/json"
    },
    json=data
)

print(response.json())
\`\`\`

## 🔍 Troubleshooting

### "URL constructor: your_supabase_project_url_here/ is not a valid URL"

- This shouldn't happen anymore - your URLs are already configured!
- If you see this, check that you didn't accidentally change the `.env.local` file

### "relation 'content' does not exist"

- You haven't run the database schema
- Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/ykbkubowjyuedbrdydaj/sql) and run `database/schema.sql`

### Authentication not working

- Verify your Supabase URL and anon key are correct (they should be!)
- Check that RLS policies are enabled (they're in the schema)
- Email authentication is built-in with Supabase - no OAuth setup needed

## 📚 Next Steps

1. **Add Content**: Use your scraper to populate the database
2. **Customize**: Modify the UI to match your preferences  
3. **Deploy**: Deploy to Vercel with environment variables
4. **Scale**: Add more features like comments, ratings, etc.

## 🆘 Need Help?

- Check the console for error messages
- Verify your Supabase project is active
- The app will show a setup banner if configuration is incomplete
- All authentication is handled by Supabase's built-in email auth

Happy reading! 📖✨
