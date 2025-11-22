# Neon PostgreSQL Setup Guide

## Why Neon?

- **Serverless** - Auto-scales, auto-suspends when idle
- **Fast provisioning** - Database ready in seconds
- **Generous free tier** - 512MB storage, 5GB data transfer/month
- **Vercel-optimized** - Great for Next.js deployments
- **Reliable connection** - Better network connectivity

---

## Step-by-Step Setup (3 minutes)

### Step 1: Create Neon Account

1. Go to https://neon.tech
2. Click **"Sign Up"** (use GitHub or email)
3. It's free - no credit card required

### Step 2: Create a Project

1. Once logged in, click **"Create a project"** or **"New Project"**
2. **Project name:** `overcoffee` (or whatever you prefer)
3. **PostgreSQL version:** Keep default (16 is fine)
4. **Region:** Select closest to you:
   - US East (Ohio) - `aws-us-east-2`
   - US West (Oregon) - `aws-us-west-2`
   - Europe - `aws-eu-central-1`
5. Click **"Create Project"**

⏱️ Your database will be ready in **5-10 seconds**!

### Step 3: Get Connection String

After project creation, you'll see:

1. **"Connection Details"** section
2. Multiple connection string options
3. Select **"Pooled connection"** (recommended)
4. Click **"Copy"** next to the connection string

The string will look like:
```
postgresql://neondb_owner:npg_xxx...@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Important:** This string is complete - no password to replace!

### Step 4: Security Settings (Optional but Recommended)

In Neon's **Settings** → **IP Allow**:
- You can add your IP for extra security
- Or leave it open (fine for development)

---

## What's Next?

Once you copy the connection string:
1. Paste it here
2. I'll update your `.env`
3. Run the migration
4. Seed the database
5. You're ready to go!

---

## Neon Features You'll Love

- **Auto-suspend**: Database pauses when idle (saves resources)
- **Branching**: Create database copies for testing
- **Fast queries**: Optimized for serverless
- **Web console**: View/edit data in browser

Ready? Create your Neon project and paste the connection string!
