# Environment Setup Instructions

Add these to your `.env` file:

```env
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=k0zEaFcq2NH+Z0euJqrmCEh9zhfT60Uc14Z82MhZaqA=

# Google OAuth (optional - leave empty if not using Google sign-in)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## To enable Google Sign-In:

1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3002/api/auth/callback/google`
6. Copy Client ID and Client Secret to .env
