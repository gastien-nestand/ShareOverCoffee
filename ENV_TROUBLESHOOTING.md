# Troubleshooting .env File

## The Error

```
Error: the URL must start with the protocol `postgresql://` or `postgres://`
```

This means Prisma can't read the DATABASE_URL from your .env file.

## Common Issues

### 1. Extra Spaces or Line Breaks
❌ **Wrong:**
```env
DATABASE_URL = "postgresql://..."
DATABASE_URL="postgresql://
postgres:2TPc4EfP%24FnQ8r%21@db..."
```

✅ **Correct:**
```env
DATABASE_URL="postgresql://postgres:2TPc4EfP%24FnQ8r%21@db.dyqcqyzbfrbxaoghvlcp.supabase.co:5432/postgres"
```

### 2. Missing Quotes
❌ **Wrong:**
```env
DATABASE_URL=postgresql://...
```

✅ **Correct:**
```env
DATABASE_URL="postgresql://..."
```

### 3. Not Replaced
Make sure you **replaced** the old SQLite line, not added a new line.

❌ **Wrong (both lines present):**
```env
DATABASE_URL="file:./dev.db"
DATABASE_URL="postgresql://..."
```

✅ **Correct (only PostgreSQL):**
```env
DATABASE_URL="postgresql://postgres:2TPc4EfP%24FnQ8r%21@db.dyqcqyzbfrbxaoghvlcp.supabase.co:5432/postgres"
```

## What Your .env Should Look Like

```env
DATABASE_URL="postgresql://postgres:2TPc4EfP%24FnQ8r%21@db.dyqcqyzbfrbxaoghvlcp.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=k0zEaFcq2NH+Z0euJqrmCEh9zhfT60Uc14Z82MhZaqA=

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Next Step

Please check your .env file and paste the DATABASE_URL line here so I can verify it's correct.
