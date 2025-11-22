# OverCoffee - Modern Blog Platform

A production-ready blog platform built with Next.js 14, TypeScript, and Prisma, featuring Vercel's design aesthetic and Medium's functionality.

## Features

- ✨ **Modern Design**: Vercel-inspired minimalist UI with dark/light mode
- 📝 **Rich Content**: Markdown support with syntax highlighting
- 💬 **Engagement**: Likes, comments, bookmarks, and follows
- 👤 **User Profiles**: Author pages with published articles
- 🔍 **Search & Filter**: Find articles by tags and keywords
- 📱 **Responsive**: Mobile-first design
- ⚡ **Performance**: Server Components and optimized images
- 🎨 **Animations**: Smooth transitions and micro-interactions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (Prisma ORM)
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js (planned)
- **Animations**: Framer Motion
- **Markdown**: react-markdown with syntax highlighting

## Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

Initialize Prisma and create the database:

```bash
npx prisma generate
npx prisma db push
```

### 3. Seed Database

Populate the database with sample data:

```bash
npm run seed
```

This will create:
- 3 sample users
- 6 blog posts with rich content
- Tags, comments, likes, and follows

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
overcoffee/
├── app/                    # Next.js App Router
│   ├── blog/[slug]/       # Individual blog post pages
│   ├── create/            # Create/edit post page
│   ├── profile/[id]/      # User profile pages
│   ├── search/            # Search and explore page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Footer
│   ├── ArticleCard.tsx    # Article card component
│   ├── LikeButton.tsx     # Like/clap button
│   ├── BookmarkButton.tsx # Bookmark toggle
│   └── ...
├── lib/                   # Utilities and configurations
│   ├── prisma.ts          # Prisma client
│   ├── utils.ts           # Helper functions
│   └── db/seed.ts         # Database seeding script
├── prisma/
│   └── schema.prisma      # Database schema
└── public/                # Static assets
```

## Database Schema

The application uses the following models:

- **User**: User accounts with profiles
- **Post**: Blog posts with content
- **Comment**: Nested comments on posts
- **Like**: Post likes/claps
- **Bookmark**: Saved posts
- **Tag**: Content categorization
- **Follow**: User following relationships

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth (for authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## Features Roadmap

- [x] Homepage with featured articles
- [x] Individual blog post pages
- [x] Reading progress indicator
- [x] Like/clap system
- [x] Bookmark functionality
- [x] Social sharing
- [x] Related articles
- [ ] Rich text editor (Tiptap)
- [ ] Comment system with nesting
- [ ] User authentication (NextAuth.js)
- [ ] User profiles
- [ ] Search functionality
- [ ] Tag filtering
- [ ] Follow system
- [ ] Image uploads

## Design Philosophy

This project follows Vercel's design principles:

- **Minimalism**: Clean layouts with generous whitespace
- **Typography**: Inter font for modern, readable text
- **Color**: Monochromatic scheme with subtle accents
- **Motion**: Smooth, purposeful animations
- **Dark Mode**: Default dark theme with light mode option

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

- Design inspired by [Vercel](https://vercel.com)
- Functionality inspired by [Medium](https://medium.com)
- Built with [Next.js](https://nextjs.org)

---

**Note**: This is a demo application. For production use, implement proper authentication, authorization, input validation, and security measures.
