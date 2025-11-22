# PostgreSQL Migration Steps

## ✅ Step 1: Update .env File

**Please update your `.env` file with the encoded connection string:**

```env
DATABASE_URL="postgresql://postgres:2TPc4EfP%24FnQ8r%21@db.dyqcqyzbfrbxaoghvlcp.supabase.co:5432/postgres"
```

See [UPDATE_ENV.md](file:///c:/Users/7vault/overcoffee/UPDATE_ENV.md) for details.

---

## ✅ Step 2: Schema Updated

I've updated `prisma/schema.prisma` to use PostgreSQL.

---

## Next Steps (after you update .env):

### Step 3: Run Migration
```bash
npx prisma migrate dev --name init_postgres
```
This creates the database schema in Supabase.

### Step 4: Generate Prisma Client
```bash
npx prisma generate
```

### Step 5: Seed Database
```bash
npm run seed
```

### Step 6: Test Application
```bash
npm run dev
```

---

**Let me know once you've updated the .env file, and I'll run these commands for you!**
