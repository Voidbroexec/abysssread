# 🔒 Security Guidelines for AbyssRead

## 🚨 Important Security Notes

### Environment Variables
- **NEVER** commit `.env.local` or any `.env*` files to version control
- The `.gitignore` file is configured to prevent accidental commits
- Always use `.env.example` as a template for new environments

### API Keys
- **Supabase Anon Key**: Safe to expose in client-side code (has RLS protection)
- **Service Role Key**: NEVER expose in client-side code (bypasses RLS)
- **API Key**: Keep secure, used for scraper authentication

### Database Security
- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data
- Public read access for manhwa/content tables
- Admin operations require service role key

## 🛡️ Best Practices

### Development
1. Use `.env.local` for local development
2. Never share environment files
3. Regenerate keys if accidentally exposed
4. Use different keys for development/production

### Production
1. Set environment variables in Vercel dashboard
2. Enable Supabase's security features
3. Monitor API usage and rate limits
4. Regular security audits

### Scraper Security
1. Use HTTPS for all API calls
2. Validate all incoming data
3. Rate limit scraper requests
4. Monitor for suspicious activity

## 🔑 Key Management

### If Keys Are Compromised
1. **Immediately** regenerate all affected keys
2. Update environment variables everywhere
3. Check logs for unauthorized access
4. Consider rotating database passwords

### Regular Maintenance
- Review access logs monthly
- Update dependencies regularly
- Monitor Supabase security advisories
- Backup database regularly

## 📞 Security Contact
If you discover a security vulnerability, please report it responsibly.
