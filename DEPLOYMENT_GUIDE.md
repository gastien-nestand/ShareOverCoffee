# Custom Domain Deployment Guide

## Overview

Your app is now optimized for deployment with a custom domain! All URLs are environment-based and will automatically work with your domain.

---

## Pre-Deployment Checklist

### ✅ Completed
- [x] Authentication (NextAuth with email & Google OAuth)
- [x] PostgreSQL database (Neon - production-ready)
- [x] Image uploads (Cloudinary with CDN)
- [x] Dynamic metadata/SEO (environment-aware)
- [x] Environment-based URLs (works with any domain)

---

## Deployment Steps

### 1. Deploy to Vercel (10 minutes)

#### A. Push to GitHub
```bash
git add .
git commit -m "Production ready"
git push origin main
```

#### B. Import to Vercel
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js

#### C. Configure Environment Variables
In Vercel project settings, add these:

```env
# Database
DATABASE_URL=postgresql://neondb_owner:npg_FrGTvNHp6t1D@ep-holy-morning-ahzwn8y6-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

# Site URLs (will update after adding custom domain)
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com

# NextAuth
NEXTAUTH_SECRET=k0zEaFcq2NH+Z0euJqrmCEh9zhfT60Uc14Z82MhZaqA=

# Google OAuth (if configured)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dio0clp2c
CLOUDINARY_API_KEY=554827467465163
CLOUDINARY_API_SECRET=kgp1R4i0NC_Bx8w_sXb617kH1a8
```

#### D. Deploy
Click "Deploy" - will take 2-3 minutes

---

### 2. Buy and Configure Custom Domain

#### A. Buy Your Domain
Popular domain registrars:
- **Namecheap** (cheap, good UI)
- **Google Domains/Squarespace** (simple)
- **GoDaddy** (popular)
- **Cloudflare** (cheapest, $9-10/year)

#### B. Add Domain to Vercel
1. In your Vercel project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `yourblog.com`)
4. Vercel will provide DNS records

#### C. Configure DNS
At your domain registrar, add these records:

**For root domain (yourblog.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain (www.yourblog.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### D. Wait for DNS Propagation
- Usually takes 5-60 minutes
- Vercel will auto-issue SSL certificate
- Your site will be live at your custom domain!

---

### 3. Update Service Configurations

#### Google OAuth (if using)
1. Go to https://console.cloud.google.com
2. APIs & Services → Credentials
3. Edit your OAuth client
4. Add to Authorized JavaScript origins:
   - `https://yourdomain.com`
5. Add to Authorized redirect URIs:
   - `https://yourdomain.com/api/auth/callback/google`

#### Update Environment Variables in Vercel
1. Go to Vercel project → Settings → Environment Variables
2. Update these:
   ```
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   NEXTAUTH_URL=https://yourdomain.com
   ```
3. Redeploy for changes to take effect

---

### 4. Create OG Image (Optional but Recommended)

Create a social media preview image at `public/og-image.png`:
- Size: 1200x630 pixels
- Include your blog name/logo
- Tools: Canva, Figma, or Photoshop

---

## What Works with Custom Domain

✅ **SEO & Metadata**
- All meta tags use your custom domain
- Open Graph images work correctly
- Twitter cards display properly

✅ **Authentication**
- NextAuth works with your domain
- Google OAuth redirects correctly
- Session cookies work

✅ **Images**
- Cloudinary uploads work
- CDN delivery optimized
- All image URLs valid

✅ **Database**
- Neon PostgreSQL ready
- Connection pooling configured
- Auto-scales with traffic

---

## Testing Checklist (After Deployment)

- [ ] Visit your custom domain
- [ ] Test sign up / sign in
- [ ] Create a post with image upload
- [ ] Test search functionality
- [ ] Check Google OAuth (if configured)
- [ ] Verify metadata (share on social media)
- [ ] Test on mobile devices

---

## Performance Optimizations (Already Included)

✅ **Next.js 14** - App Router with RSC
✅ **Edge Runtime** - Fast global delivery
✅ **Image Optimization** - Automatic via Cloudinary
✅ **Database Pooling** - Neon connection pooler
✅ **Code Splitting** - Automatic chunking
✅ **Caching** - Browser and CDN caching

---

## Monitoring & Analytics (Optional Next Steps)

### Vercel Analytics
1. In Vercel project → Analytics
2. Enable (free tier available)
3. Track page views, performance

### Google Analytics
1. Create GA4 property
2. Add tracking code to layout
3. Monitor traffic

### Error Tracking
- **Sentry** - Error monitoring
- **LogRocket** - Session replay
- **Vercel Logs** - Built-in

---

## Cost Breakdown (All Free Tiers)

- ✅ **Vercel:** Free (hobby plan)
- ✅ **Neon:** Free (512MB database)
- ✅ **Cloudinary:** Free (25GB storage + bandwidth)
- ✅ **Domain:** $10-15/year (only cost!)

---

## Custom Domain Examples

Good domain patterns for blogs:
- `yourblog.com`
- `yourname.blog`
- `your-niche.io`
- `blog.yourname.com`

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Custom Domains:** https://vercel.com/docs/concepts/projects/domains
- **Environment Variables:** https://vercel.com/docs/concepts/projects/environment-variables

---

## Ready to Deploy?

Your app is fully optimized for custom domain deployment! 

**Next steps:**
1. Push code to GitHub
2. Deploy to Vercel
3. Buy your domain
4. Configure DNS
5. Update environment variables
6. You're live! 🚀
