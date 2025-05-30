# 🔧 AbyssRead Troubleshooting Guide

Quick solutions for common issues.

## 🚨 Common Issues

### **1. Setup Banner Won't Disappear**
**Problem:** "Setup Required" banner shows even after configuration

**Solutions:**
\`\`\`bash
# Check your .env.local file
cat .env.local

# Make sure URLs don't contain "your_" or "_here"
# Restart development server
pnpm dev
\`\`\`

### **2. Database Connection Errors**
**Problem:** "relation 'content' does not exist"

**Solutions:**
1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/ykbkubowjyuedbrdydaj/sql)
2. Run the entire `database/schema.sql` file
3. Check [Table Editor](https://supabase.com/dashboard/project/ykbkubowjyuedbrdydaj/editor) for tables

### **3. Scraper API Returns 401**
**Problem:** Unauthorized errors when testing scrapers

**Solutions:**
\`\`\`bash
# Check API key in .env.local matches your requests
grep API_KEY .env.local

# Test with correct header
curl -H "x-api-key: abyssread_secure_api_key_2024_manhwa_scraper_v1" \
     http://localhost:3000/api/scraper
\`\`\`

### **4. Authentication Not Working**
**Problem:** Login/signup fails

**Solutions:**
1. Check Supabase URL and anon key in `.env.local`
2. Verify [Auth settings](https://supabase.com/dashboard/project/ykbkubowjyuedbrdydaj/auth/users) in Supabase
3. Clear browser cache and cookies

### **5. Images Not Loading**
**Problem:** Broken image placeholders

**Solutions:**
- Use placeholder URLs for testing: `/placeholder.svg?height=300&width=200`
- Check image URLs are publicly accessible
- Verify CORS settings on image host

## 🔍 Debug Commands

### **Check Environment**
\`\`\`bash
# Verify environment variables
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"

# Test Supabase connection
node -e "
const { supabase } = require('./lib/supabase.ts');
supabase.from('content').select('count').then(console.log);
"
\`\`\`

### **Test API Endpoints**
\`\`\`bash
# Test manga endpoint
curl -X POST http://localhost:3000/api/scraper \
  -H "x-api-key: abyssread_secure_api_key_2024_manhwa_scraper_v1" \
  -H "Content-Type: application/json" \
  -d '{"type": "manga", "data": {"title": "Test", "author": "Test", "source_url": "test"}}'

# Check response
echo $?
\`\`\`

### **Database Queries**
\`\`\`sql
-- Check content exists
SELECT COUNT(*) FROM content;

-- Check content types
SELECT content_type, COUNT(*) FROM content GROUP BY content_type;

-- Check user profiles
SELECT COUNT(*) FROM user_profiles;
\`\`\`

## 📞 Getting Help

1. **Check Browser Console** for JavaScript errors
2. **Check Server Logs** in terminal
3. **Review TODO.md** for detailed setup steps
4. **Test with curl** to isolate API issues
5. **Check Supabase Dashboard** for database issues

## 🎯 Quick Fixes

### **Reset Everything**
\`\`\`bash
# Clear all data and start fresh
rm -rf .next
rm -rf node_modules
pnpm install
pnpm dev
\`\`\`

### **Test with Mock Data**
If database issues persist, the app will automatically use mock data so you can test the UI while fixing database connectivity.

### **Verify Deployment**
\`\`\`bash
# Check if all files are present
ls -la database/
ls -la lib/
ls -la app/api/scraper/
\`\`\`

**Still having issues?** Check the detailed `TODO.md` file for comprehensive troubleshooting steps.
