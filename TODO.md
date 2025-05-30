# 📋 AbyssRead Setup & Configuration TODO

Complete checklist for setting up your manga and manhwa reading platform.

## 🚀 Initial Setup Checklist

### ✅ 1. Environment Configuration

#### **Required Actions:**
- [ ] **Update `.env.local` with your actual Supabase credentials**
  \`\`\`env
  # Replace these placeholder values:
  NEXT_PUBLIC_SUPABASE_URL=https://ykbkubowjyuedbrdydaj.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  
  # Add your service role key:
  SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
  
  # Keep this API key or generate a new secure one:
  API_KEY=abyssread_secure_api_key_2024_manhwa_scraper_v1
  \`\`\`

#### **Where to Find Keys:**
1. **Supabase URL & Anon Key**: [Project Settings → API](https://supabase.com/dashboard/project/ykbkubowjyuedbrdydaj/settings/api)
2. **Service Role Key**: Same page, copy the `service_role` key (⚠️ Keep this secret!)

#### **Optional OAuth Setup:**
- [ ] **Google OAuth** (if you want Google login):
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Create OAuth 2.0 credentials
  3. Add to `.env.local`: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
  4. Configure in Supabase: [Auth → Providers → Google](https://supabase.com/dashboard/project/ykbkubowjyuedbrdydaj/auth/providers)

- [ ] **Facebook OAuth** (if you want Facebook login):
  1. Go to [Facebook Developers](https://developers.facebook.com/)
  2. Create app and get credentials
  3. Add to `.env.local`: `FACEBOOK_CLIENT_ID` and `FACEBOOK_CLIENT_SECRET`
  4. Configure in Supabase: [Auth → Providers → Facebook](https://supabase.com/dashboard/project/ykbkubowjyuedbrdydaj/auth/providers)

### ✅ 2. Database Setup

#### **Required Actions:**
- [ ] **Run Database Schema**
  1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/ykbkubowjyuedbrdydaj/sql)
  2. Copy entire contents of `database/schema.sql`
  3. Paste and click "Run"
  4. Verify tables created in [Table Editor](https://supabase.com/dashboard/project/ykbkubowjyuedbrdydaj/editor)

#### **Expected Tables:**
- [ ] `content` (unified manga/manhwa table)
- [ ] `chapters` (chapter data with pages)
- [ ] `user_profiles` (user information)
- [ ] `user_preferences` (favorites, bookmarks, likes)
- [ ] `reading_history` (reading progress)

#### **Verify Setup:**
- [ ] Check that RLS (Row Level Security) is enabled on all tables
- [ ] Verify functions exist: `get_all_genres()`, `get_genres_by_type()`
- [ ] Test connection by running: `SELECT * FROM content LIMIT 1;`

### ✅ 3. Development Environment

#### **Required Actions:**
- [ ] **Install Dependencies**
  \`\`\`bash
  pnpm install
  \`\`\`

- [ ] **Start Development Server**
  \`\`\`bash
  pnpm dev
  \`\`\`

- [ ] **Verify Setup**
  - [ ] Visit [http://localhost:3000](http://localhost:3000)
  - [ ] Check that no setup banner appears (means Supabase is configured)
  - [ ] Test content type toggle (Manhwa/Manga buttons)
  - [ ] Try signing up/logging in

## 🤖 Scraper Setup Checklist

### ✅ 4. Python Scraper Setup

#### **Required Actions:**
- [ ] **Install Python Dependencies**
  \`\`\`bash
  pip install requests
  \`\`\`

- [ ] **Update Scraper Configuration**
  Edit `manga-scraper-example.py` and `scraper-example.py`:
  \`\`\`python
  # Update these values:
  BASE_URL = "http://localhost:3000"  # Your AbyssRead URL
  API_KEY = "abyssread_secure_api_key_2024_manhwa_scraper_v1"  # From .env.local
  \`\`\`

- [ ] **Test Scrapers**
  \`\`\`bash
  # Test manga scraper
  python manga-scraper-example.py
  
  # Test manhwa scraper  
  python scraper-example.py
  \`\`\`

### ✅ 5. JavaScript Scraper Setup

#### **Required Actions:**
- [ ] **Install Node.js Dependencies**
  \`\`\`bash
  npm install node-fetch
  \`\`\`

- [ ] **Update Scraper Configuration**
  Edit `scraper-example.js`:
  \`\`\`javascript
  // Update these values:
  const BASE_URL = "http://localhost:3000"  // Your AbyssRead URL
  const API_KEY = "abyssread_secure_api_key_2024_manhwa_scraper_v1"  // From .env.local
  \`\`\`

- [ ] **Test Scraper**
  \`\`\`bash
  node scraper-example.js
  \`\`\`

### ✅ 6. API Testing

#### **Required Actions:**
- [ ] **Test Manga Endpoint**
  \`\`\`bash
  curl -X POST http://localhost:3000/api/scraper \
    -H "x-api-key: abyssread_secure_api_key_2024_manhwa_scraper_v1" \
    -H "Content-Type: application/json" \
    -d '{
      "type": "manga",
      "data": {
        "title": "Test Manga",
        "author": "Test Author",
        "source_url": "https://test.com/manga"
      }
    }'
  \`\`\`

- [ ] **Test Manhwa Endpoint**
  \`\`\`bash
  curl -X POST http://localhost:3000/api/scraper \
    -H "x-api-key: abyssread_secure_api_key_2024_manhwa_scraper_v1" \
    -H "Content-Type: application/json" \
    -d '{
      "type": "manhwa",
      "data": {
        "title": "Test Manhwa",
        "author": "Test Author",
        "source_url": "https://test.com/manhwa"
      }
    }'
  \`\`\`

- [ ] **Verify Data in Database**
  Check [Supabase Table Editor](https://supabase.com/dashboard/project/ykbkubowjyuedbrdydaj/editor) for new entries

## 🎨 Content Population Checklist

### ✅ 7. Add Sample Content

#### **Popular Manga to Add:**
- [ ] One Piece
- [ ] Naruto
- [ ] Attack on Titan
- [ ] Demon Slayer
- [ ] My Hero Academia
- [ ] Dragon Ball
- [ ] Death Note
- [ ] Fullmetal Alchemist

#### **Popular Manhwa to Add:**
- [ ] Solo Leveling
- [ ] Tower of God
- [ ] The Beginning After The End
- [ ] Omniscient Reader
- [ ] Lookism
- [ ] The God of High School
- [ ] Noblesse
- [ ] Hardcore Leveling Warrior

#### **Sample Data Template:**
\`\`\`python
# Manga example
manga_data = {
    "title": "One Piece",
    "author": "Eiichiro Oda",
    "description": "Monkey D. Luffy sets off on an adventure...",
    "cover_url": "https://example.com/covers/one-piece.jpg",
    "rating": 4.9,
    "status": "ongoing",
    "genres": ["Adventure", "Comedy", "Action"],
    "source_url": "https://your-manga-source.com/one-piece"
}

# Manhwa example
manhwa_data = {
    "title": "Solo Leveling",
    "author": "Chugong",
    "artist": "DUBU (REDICE STUDIO)",
    "description": "10 years ago, after 'the Gate'...",
    "cover_url": "https://example.com/covers/solo-leveling.jpg",
    "rating": 4.9,
    "status": "completed",
    "genres": ["Action", "Fantasy", "Adventure"],
    "source_url": "https://your-manhwa-source.com/solo-leveling"
}
\`\`\`

### ✅ 8. Add Chapters

#### **Required Actions:**
- [ ] **Add chapters for each content**
  \`\`\`python
  chapter_data = {
      "content_source_url": "https://your-source.com/content-url",
      "chapter_number": 1,
      "title": "Chapter 1: Title",
      "pages": [
          "https://example.com/page1.jpg",
          "https://example.com/page2.jpg"
      ],
      "source_url": "https://your-source.com/chapter-url"
  }
  \`\`\`

## 🚀 Production Deployment Checklist

### ✅ 9. Vercel Deployment

#### **Required Actions:**
- [ ] **Deploy to Vercel**
  \`\`\`bash
  vercel --prod
  \`\`\`

- [ ] **Add Environment Variables in Vercel Dashboard**
  1. Go to your Vercel project settings
  2. Add all environment variables from `.env.local`
  3. Make sure to use production Supabase URLs if different

- [ ] **Configure Custom Domain** (optional)
  1. Add domain in Vercel dashboard
  2. Update DNS settings
  3. Update OAuth redirect URLs

### ✅ 10. Security Checklist

#### **Required Actions:**
- [ ] **Verify `.gitignore` includes:**
  - [ ] `.env*.local`
  - [ ] `.env`
  - [ ] `node_modules/`
  - [ ] `.vercel`

- [ ] **Check Supabase Security:**
  - [ ] RLS enabled on all tables
  - [ ] Service role key is secret
  - [ ] OAuth providers configured correctly

- [ ] **API Security:**
  - [ ] API key is secure and not exposed
  - [ ] Rate limiting considered for production
  - [ ] Input validation working

## 🔧 How to Use

### **For End Users:**

#### **1. Content Discovery**
- **Toggle Content Type**: Use Manhwa/Manga buttons in header
- **Browse Library**: View all available content
- **Search**: Use search bar to find specific titles
- **Filter**: Browse by trending, new releases, or continue reading

#### **2. Reading Experience**
- **Start Reading**: Click any content card → "Read Now"
- **Reader Controls**: 
  - Vertical/Horizontal reading modes
  - Page navigation (click sides or use arrows)
  - Progress tracking automatic
- **Bookmarks**: Heart icon to favorite, bookmark icon to save for later

#### **3. User Features**
- **Sign Up/Login**: Email, Google, or Facebook
- **Profile**: View reading stats and history
- **Favorites**: Access from user menu
- **Continue Reading**: Pick up where you left off

### **For Content Managers:**

#### **1. Adding Content via Scraper**
\`\`\`python
# Initialize API
api = AbyssReadAPI("http://localhost:3000", "your_api_key")

# Add manga
api.add_manga(manga_data)

# Add manhwa  
api.add_manhwa(manhwa_data)

# Add chapters
api.add_chapter(chapter_data)

# Batch upload
api.batch_upload(manhwa_list, manga_list, chapters_list)
\`\`\`

#### **2. Content Management**
- **Database Access**: Use Supabase dashboard for direct editing
- **Bulk Operations**: Use batch upload for efficiency
- **Content Updates**: Re-upload with same `source_url` to update

## 🐛 How to Debug

### **Common Issues & Solutions:**

#### **1. "Supabase not configured" Error**
**Symptoms:** Setup banner appears, mock data shown
**Solutions:**
- [ ] Check `.env.local` has real Supabase URL (not placeholder)
- [ ] Verify anon key is correct
- [ ] Restart development server after changing `.env.local`
- [ ] Check browser console for specific errors

#### **2. "relation 'content' does not exist"**
**Symptoms:** Database errors, empty content
**Solutions:**
- [ ] Run `database/schema.sql` in Supabase SQL Editor
- [ ] Check table creation was successful
- [ ] Verify you're connected to correct Supabase project

#### **3. Authentication Not Working**
**Symptoms:** Login fails, OAuth errors
**Solutions:**
- [ ] Check Supabase URL and anon key are correct
- [ ] Verify OAuth providers configured in Supabase dashboard
- [ ] Check redirect URLs match your domain
- [ ] Clear browser cache and cookies

#### **4. Scraper API Errors**
**Symptoms:** 401 Unauthorized, 500 errors
**Solutions:**
- [ ] Verify API key matches `.env.local`
- [ ] Check request headers include `x-api-key`
- [ ] Validate JSON data structure
- [ ] Check server logs for specific errors

#### **5. Images Not Loading**
**Symptoms:** Broken image placeholders
**Solutions:**
- [ ] Verify image URLs are accessible
- [ ] Check CORS settings on image host
- [ ] Use placeholder URLs for testing
- [ ] Check network tab for failed requests

### **Debugging Tools:**

#### **1. Browser Developer Tools**
- **Console**: Check for JavaScript errors
- **Network**: Monitor API requests and responses
- **Application**: Check localStorage and cookies
- **Elements**: Inspect UI components

#### **2. Supabase Dashboard**
- **Table Editor**: View and edit data directly
- **SQL Editor**: Run custom queries
- **Auth**: Monitor user sessions
- **Logs**: Check database and auth logs

#### **3. Server Logs**
\`\`\`bash
# Development server logs
pnpm dev

# Check API responses
curl -v http://localhost:3000/api/scraper

# Database connection test
node -e "
const { supabase } = require('./lib/supabase.ts');
supabase.from('content').select('count').then(console.log);
"
\`\`\`

## 💡 Tips & Best Practices

### **Development Tips:**

#### **1. Content Management**
- **Use Batch Upload**: More efficient for large datasets
- **Consistent Source URLs**: Use as unique identifiers
- **Image Optimization**: Compress images for better performance
- **Genre Standardization**: Use consistent genre names

#### **2. Performance Optimization**
- **Image Lazy Loading**: Already implemented
- **Database Indexing**: Included in schema
- **Caching**: Consider Redis for production
- **CDN**: Use for image hosting

#### **3. User Experience**
- **Loading States**: Already implemented with purple animations
- **Error Handling**: Graceful fallbacks to mock data
- **Responsive Design**: Works on all devices
- **Accessibility**: Screen reader support included

### **Production Tips:**

#### **1. Monitoring**
- **Supabase Analytics**: Monitor database usage
- **Vercel Analytics**: Track page performance
- **Error Tracking**: Consider Sentry integration
- **User Feedback**: Implement feedback system

#### **2. Scaling**
- **Database Optimization**: Monitor query performance
- **Image Storage**: Use Supabase Storage or CDN
- **Rate Limiting**: Implement for API endpoints
- **Caching Strategy**: Redis or Vercel Edge Cache

#### **3. Security**
- **Regular Updates**: Keep dependencies updated
- **Security Audits**: Run `npm audit` regularly
- **Backup Strategy**: Regular database backups
- **Access Control**: Monitor admin access

### **Content Strategy:**

#### **1. Popular Content First**
- Start with well-known manga/manhwa
- Focus on completed series for full experience
- Add trending/seasonal content regularly

#### **2. Quality Control**
- Verify image quality and consistency
- Check chapter ordering and numbering
- Validate metadata accuracy

#### **3. User Engagement**
- Monitor reading patterns
- Add popular genres first
- Consider user requests and feedback

## 📞 Support & Resources

### **Documentation:**
- [ ] `README.md` - Main project overview
- [ ] `SETUP.md` - Detailed setup guide
- [ ] `SCRAPER_GUIDE.md` - Scraper integration guide
- [ ] `MANGA_SCRAPER_GUIDE.md` - Manga-specific scraper guide
- [ ] `SECURITY.md` - Security guidelines

### **External Resources:**
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### **Getting Help:**
1. **Check Console Errors**: Browser and server logs
2. **Review Documentation**: Comprehensive guides included
3. **Test API Endpoints**: Use curl or Postman
4. **Supabase Support**: Check their documentation and community
5. **GitHub Issues**: Create issues for bugs or feature requests

---

## ✅ Final Checklist

Before going live, ensure:
- [ ] All environment variables configured
- [ ] Database schema deployed
- [ ] Sample content added
- [ ] Authentication working
- [ ] Scrapers tested
- [ ] Production deployment successful
- [ ] Security measures in place
- [ ] Monitoring set up

**🎉 Congratulations! Your AbyssRead platform is ready for manga and manhwa lovers worldwide!**
