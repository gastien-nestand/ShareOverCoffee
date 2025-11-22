# Update Your .env File

## IMPORTANT: URL Encoding Required

Your password contains special characters (`$` and `!`) that must be URL-encoded:

### Original Connection String:
```
postgresql://postgres:2TPc4EfP$FnQ8r!@db.dyqcqyzbfrbxaoghvlcp.supabase.co:5432/postgres
```

### ✅ Encoded Connection String (USE THIS):
```
postgresql://postgres:2TPc4EfP%24FnQ8r%21@db.dyqcqyzbfrbxaoghvlcp.supabase.co:5432/postgres
```

**What changed:**
- `$` → `%24`
- `!` → `%21`

---

## Update Your .env File

**Open `c:\Users\7vault\overcoffee\.env` and update the DATABASE_URL:**

Replace the current SQLite line:
```env
DATABASE_URL="file:./dev.db"
```

With this PostgreSQL connection:
```env
DATABASE_URL="postgresql://postgres:2TPc4EfP%24FnQ8r%21@db.dyqcqyzbfrbxaoghvlcp.supabase.co:5432/postgres"
```

Your complete `.env` should look like:
```env
DATABASE_URL="postgresql://postgres:2TPc4EfP%24FnQ8r%21@db.dyqcqyzbfrbxaoghvlcp.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=k0zEaFcq2NH+Z0euJqrmCEh9zhfT60Uc14Z82MhZaqA=

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## ⚠️ Security Notice

This file contains sensitive credentials. Never commit it to Git (it's already in .gitignore).

---

**Once you've updated the .env file, let me know and I'll continue with the migration!**
