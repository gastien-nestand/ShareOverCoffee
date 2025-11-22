# Cloudinary Upload Preset Setup

## Important: One More Step Needed!

To allow uploads from the browser, you need to create an **unsigned upload preset** in Cloudinary.

### Steps (2 minutes):

1. Go to your Cloudinary dashboard: https://cloudinary.com/console
2. Click on **Settings** (gear icon)
3. Click on the **Upload** tab
4. Scroll down to **Upload presets**
5. Click **"Add upload preset"**

6. Configure the preset:
   - **Upload preset name:** `unsigned_upload` (use exactly this name)
   - **Signing Mode:** Select **"Unsigned"**
   - **Folder:** (optional) `overcoffee/posts`
   - **Resource type:** Image
   - **Access mode:** Public
   - Everything else can stay default

7. Click **"Save"**

---

## Why This is Needed

- **Unsigned presets** allow uploads directly from the browser
- Without it, you'd need to sign every upload on the server
- This is faster and simpler for client-side uploads

---

## After Setup

Once you've created the preset:
1. The upload component will work automatically
2. Users can drag-and-drop images
3. Images will be stored in Cloudinary
4. URLs will be automatically added to posts

---

**Let me know when you've created the preset and I'll update the Create Post page!**
