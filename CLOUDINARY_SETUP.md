# Cloudinary Setup Guide

## Step-by-Step Instructions

### Step 1: Create Cloudinary Account (2 minutes)

1. Go to https://cloudinary.com/users/register_free
2. Sign up with email or GitHub (free account)
3. Fill in the signup form:
   - Choose a **cloud name** (e.g., `overcoffee` or your preferred name)
   - This will be part of your image URLs
   - You can't change it later, so choose carefully!

### Step 2: Get Your Credentials (1 minute)

After signing up, you'll be taken to the dashboard:

1. You'll see a section called **"Account Details"** or **"API Environment variable"**
2. Look for these three values:
   - **Cloud Name** (e.g., `dxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

### Step 3: Copy Your Credentials

You need all three values. They look like this:

```
Cloud Name: your-cloud-name
API Key: 123456789012345
API Secret: AbCdEfGhIjKlMnOpQrStUvWxYz
```

---

## What You'll Get

**Free Tier Includes:**
- ✅ 25 GB storage
- ✅ 25 GB bandwidth/month
- ✅ Automatic image optimization
- ✅ On-the-fly transformations (resize, crop, etc.)
- ✅ CDN delivery worldwide

This is plenty for a blog!

---

## Next Steps

Once you have your three credentials:
1. Paste them here (I'll add to .env)
2. I'll install the Cloudinary package
3. Create the drag-and-drop upload component
4. Update the Create Post page

---

**Please paste your credentials in this format:**

```
Cloud Name: your-cloud-name
API Key: your-api-key
API Secret: your-api-secret
```
