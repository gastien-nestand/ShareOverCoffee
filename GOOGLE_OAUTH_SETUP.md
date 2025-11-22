# Google OAuth Setup Guide

## Overview

To enable "Sign in with Google", we need to create OAuth credentials in Google Cloud Console. This takes about 5 minutes.

---

## Step-by-Step Instructions

### Step 1: Go to Google Cloud Console (1 minute)

1. Visit: https://console.cloud.google.com
2. Sign in with your Google account
3. If prompted, agree to terms of service

### Step 2: Create a New Project (1 minute)

1. Click the **project dropdown** at the top (says "Select a project")
2. Click **"NEW PROJECT"**
3. **Project name:** `OverCoffee` (or your preferred name)
4. Click **"CREATE"**
5. Wait a few seconds for it to be created
6. Make sure the new project is selected (check top bar)

### Step 3: Configure OAuth Consent Screen (2 minutes)

1. In the left sidebar, go to **"APIs & Services"** → **"OAuth consent screen"**
   - Or search for "OAuth consent screen" in the top search bar

2. **User Type:**
   - Select **"External"**
   - Click **"CREATE"**

3. **App Information:**
   - **App name:** `OverCoffee` (or your blog name)
   - **User support email:** Select your email from dropdown
   - **App logo:** (optional, can skip)

4. **App Domain** (optional, can skip for development):
   - Leave blank for now
   - Can add later for production

5. **Developer contact information:**
   - **Email:** Enter your email
   - Click **"SAVE AND CONTINUE"**

6. **Scopes:**
   - Click **"SAVE AND CONTINUE"** (no changes needed)

7. **Test users:**
   - Click **"ADD USERS"**
   - Add your email address (so you can test)
   - Click **"SAVE AND CONTINUE"**

8. **Summary:**
   - Review and click **"BACK TO DASHBOARD"**

### Step 4: Create OAuth Credentials (2 minutes)

1. In the left sidebar, go to **"Credentials"**

2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**

4. **Application type:**
   - Select **"Web application"**

5. **Name:**
   - Enter: `OverCoffee Web Client`

6. **Authorized JavaScript origins:**
   - Click **"+ ADD URI"**
   - Add: `http://localhost:3002`
   - (For production, you'll add your Vercel URL later)

7. **Authorized redirect URIs:**
   - Click **"+ ADD URI"**
   - Add: `http://localhost:3002/api/auth/callback/google`
   - This MUST be exact!

8. Click **"CREATE"**

### Step 5: Copy Your Credentials

A modal will appear with your credentials:

- **Client ID:** Long string like `123456789-abc...xyz.apps.googleusercontent.com`
- **Client Secret:** Shorter string like `GOCSPX-abc...xyz`

**Copy both of these!**

---

## What Your Credentials Look Like

```
Client ID: 123456789-abcdefghijklmnop.apps.googleusercontent.com
Client Secret: GOCSPX-AbCdEfGhIjKlMnOpQrSt
```

---

## Important Notes

### For Development (localhost)
- Use `http://localhost:3002`
- Works only on your computer

### For Production (after deploying to Vercel)
You'll need to:
1. Go back to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Add your Vercel URL:
   - Authorized JavaScript origins: `https://your-app.vercel.app`
   - Authorized redirect URIs: `https://your-app.vercel.app/api/auth/callback/google`

---

## Common Issues

### "Access blocked: This app's request is invalid"
- Check your redirect URI is exactly: `http://localhost:3002/api/auth/callback/google`
- Make sure you're using the correct port (3002)

### "Error 400: redirect_uri_mismatch"
- Your redirect URI doesn't match what's in Google Cloud Console
- Double-check the URL is exact

### "This app isn't verified"
- Normal for testing! Click "Advanced" → "Go to OverCoffee (unsafe)"
- Only needed during development
- For production, you can verify the app with Google

---

## Next Steps

Once you have both credentials:
1. Paste them here
2. I'll add to `.env`
3. Google OAuth will work!

**Please provide:**
```
Client ID: your-client-id
Client Secret: your-client-secret
```
