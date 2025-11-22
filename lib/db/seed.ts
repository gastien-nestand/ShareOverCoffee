import { prisma } from '../prisma';
import bcrypt from 'bcryptjs';
import { generateSlug, calculateReadingTime } from '../utils';


const samplePosts = [
    {
        title: 'Building Modern Web Applications with Next.js 14',
        content: `# Introduction to Next.js 14

Next.js 14 represents a significant leap forward in web development, introducing groundbreaking features that make building production-ready applications faster and more intuitive than ever before.

## The Power of Server Components

Server Components are revolutionizing how we think about React applications. By default, all components in the App Router are Server Components, which means:

- **Zero JavaScript by default**: Components render on the server, sending only HTML to the client
- **Direct database access**: Query your database directly in your components
- **Improved performance**: Smaller bundle sizes and faster initial page loads

\`\`\`typescript
async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await db.post.findUnique({
    where: { slug: params.slug }
  });
  
  return <article>{post.content}</article>;
}
\`\`\`

## Streaming and Suspense

Next.js 14 makes it incredibly easy to stream content to users, improving perceived performance:

\`\`\`tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SlowComponent />
    </Suspense>
  );
}
\`\`\`

## Conclusion

Next.js 14 is not just an incremental update—it's a paradigm shift in how we build web applications. The combination of Server Components, improved routing, and enhanced developer experience makes it the go-to framework for modern web development.`,
        excerpt: 'Explore the revolutionary features of Next.js 14 and learn how Server Components are changing the game for web developers.',
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop',
        featured: true,
    },
    {
        title: 'The Art of Minimalist Design in 2024',
        content: `# Minimalism: Less is More

Minimalist design has evolved from a trend to a fundamental principle in modern digital experiences. In 2024, we're seeing a refined approach that balances simplicity with functionality.

## Core Principles

1. **Whitespace is Your Friend**: Don't fear empty space—it gives your content room to breathe
2. **Typography Matters**: Choose fonts carefully and use hierarchy effectively
3. **Color with Purpose**: A limited palette creates cohesion and impact

## Practical Applications

Modern minimalist design isn't about removing features—it's about presenting them elegantly. Consider how Vercel's design language uses subtle gradients, generous spacing, and monochromatic color schemes to create a premium feel.

## The Future

As interfaces become more complex, minimalism will continue to be our guide toward clarity and usability.`,
        excerpt: 'Discover how minimalist design principles are shaping the digital landscape and creating more intuitive user experiences.',
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=600&fit=crop',
        featured: false,
    },
    {
        title: 'TypeScript Best Practices for Large-Scale Applications',
        content: `# Scaling TypeScript

TypeScript has become the de facto standard for large-scale JavaScript applications. Here's how to leverage it effectively.

## Type Safety at Scale

\`\`\`typescript
// Use discriminated unions for complex state
type LoadingState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Data }
  | { status: 'error'; error: Error };
\`\`\`

## Utility Types

TypeScript's utility types are powerful tools:

- \`Partial<T>\`: Make all properties optional
- \`Pick<T, K>\`: Select specific properties
- \`Omit<T, K>\`: Exclude specific properties

## Conclusion

Mastering TypeScript's advanced features will make your codebase more maintainable and your team more productive.`,
        excerpt: 'Learn essential TypeScript patterns and practices that will help you build robust, maintainable applications at scale.',
        coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=600&fit=crop',
        featured: false,
    },
    {
        title: 'Understanding React Server Components',
        content: `# React Server Components Explained

Server Components represent a fundamental shift in how we build React applications. Let's break down what makes them special.

## What Are Server Components?

Server Components run exclusively on the server, never sending their code to the client. This means:

- Smaller bundle sizes
- Direct access to backend resources
- Improved security (API keys never exposed)

## When to Use Them

Use Server Components for:
- Data fetching
- Accessing backend resources
- Rendering static content

Use Client Components for:
- Interactivity
- Browser APIs
- State management

## Best Practices

Always start with Server Components and only use 'use client' when necessary. This keeps your application fast and efficient.`,
        excerpt: 'A comprehensive guide to React Server Components and how they are revolutionizing the way we build React applications.',
        coverImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=1200&h=600&fit=crop',
        featured: false,
    },
    {
        title: 'The Future of Web Development: AI-Powered Tools',
        content: `# AI in Web Development

Artificial Intelligence is transforming how we write code, design interfaces, and solve problems. Here's what you need to know.

## Code Generation

Tools like GitHub Copilot and ChatGPT are becoming indispensable coding assistants, helping developers:

- Write boilerplate code faster
- Debug complex issues
- Learn new frameworks

## Design Automation

AI-powered design tools can now:
- Generate color palettes
- Suggest layouts
- Create responsive designs

## The Human Element

While AI is powerful, the creative and strategic aspects of development still require human insight. The future is about collaboration between human creativity and AI efficiency.`,
        excerpt: 'Explore how AI-powered tools are reshaping the web development landscape and what it means for developers.',
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
        featured: false,
    },
    {
        title: 'CSS Grid vs Flexbox: When to Use Each',
        content: `# Mastering CSS Layouts

CSS Grid and Flexbox are both powerful layout tools, but they excel in different scenarios.

## Flexbox: One-Dimensional Layouts

Flexbox is perfect for:
- Navigation bars
- Card layouts in a row
- Centering content
- Distributing space along a single axis

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

## Grid: Two-Dimensional Layouts

CSS Grid shines when you need:
- Complex page layouts
- Overlapping elements
- Precise control over rows and columns

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
\`\`\`

## The Verdict

Use both! They complement each other perfectly. Grid for overall page structure, Flexbox for component internals.`,
        excerpt: 'Learn when to use CSS Grid versus Flexbox and how to combine them for powerful, responsive layouts.',
        coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&h=600&fit=crop',
        featured: false,
    },
];

const tags = [
    { name: 'Psychology', slug: 'psychology' },
    { name: 'Business Intelligence', slug: 'business-intelligence' },
    { name: 'Systems Analysis', slug: 'systems-analysis' },
    { name: 'Technology', slug: 'technology' },
    { name: 'Finance', slug: 'finance' },
    { name: 'Stories', slug: 'stories' },
];

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await prisma.follow.deleteMany();
    await prisma.bookmark.deleteMany();
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.postTag.deleteMany();
    await prisma.post.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Cleared existing data');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await Promise.all([
        prisma.user.create({
            data: {
                name: 'Sarah Chen',
                email: 'sarah@example.com',
                password: hashedPassword,
                bio: 'Full-stack developer passionate about building beautiful, performant web applications.',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
            },
        }),
        prisma.user.create({
            data: {
                name: 'Alex Rivera',
                email: 'alex@example.com',
                password: hashedPassword,
                bio: 'UI/UX designer and frontend developer. Love creating delightful user experiences.',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
            },
        }),
        prisma.user.create({
            data: {
                name: 'Jordan Kim',
                email: 'jordan@example.com',
                password: hashedPassword,
                bio: 'Tech enthusiast and writer. Exploring the intersection of AI and web development.',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
            },
        }),
    ]);

    console.log('✅ Created users');

    // Create tags
    const createdTags = await Promise.all(
        tags.map((tag) =>
            prisma.tag.create({
                data: tag,
            })
        )
    );

    console.log('✅ Created tags');

    // Create posts
    const createdPosts = await Promise.all(
        samplePosts.map((post, index) =>
            prisma.post.create({
                data: {
                    title: post.title,
                    slug: generateSlug(post.title),
                    content: post.content,
                    excerpt: post.excerpt,
                    coverImage: post.coverImage,
                    published: true,
                    featured: post.featured,
                    readingTime: calculateReadingTime(post.content),
                    authorId: users[index % users.length].id,
                    tags: {
                        create: [
                            { tagId: createdTags[index % createdTags.length].id },
                            { tagId: createdTags[(index + 1) % createdTags.length].id },
                        ],
                    },
                },
            })
        )
    );

    console.log('✅ Created posts');

    // Create comments
    await Promise.all(
        createdPosts.slice(0, 3).map((post, index) =>
            prisma.comment.create({
                data: {
                    content: 'Great article! Really helpful insights.',
                    postId: post.id,
                    authorId: users[(index + 1) % users.length].id,
                },
            })
        )
    );

    console.log('✅ Created comments');

    // Create likes
    await Promise.all(
        createdPosts.flatMap((post) =>
            users.slice(0, 2).map((user) =>
                prisma.like.create({
                    data: {
                        postId: post.id,
                        userId: user.id,
                    },
                })
            )
        )
    );

    console.log('✅ Created likes');

    // Create follows
    await prisma.follow.create({
        data: {
            followerId: users[0].id,
            followingId: users[1].id,
        },
    });

    await prisma.follow.create({
        data: {
            followerId: users[1].id,
            followingId: users[2].id,
        },
    });

    console.log('✅ Created follows');

    console.log('🎉 Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
