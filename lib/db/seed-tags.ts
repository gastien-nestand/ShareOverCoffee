import { prisma } from '../prisma';

async function main() {
    console.log('🌱 Seeding database with categories...');

    // First, delete all existing tags
    await prisma.tag.deleteMany();
    console.log('🧹 Cleared existing categories');

    // Create default tags/categories
    const defaultTags = [
        { name: 'Business Analysis', slug: 'business-analysis' },
        { name: 'Technology', slug: 'technology' },
        { name: 'Finance', slug: 'finance' },
        { name: 'Psychology', slug: 'psychology' },
        { name: 'Stories', slug: 'stories' },
        { name: 'Over Coffee Talk', slug: 'over-coffee-talk' },
        { name: 'Self-Development', slug: 'self-development' },
    ];

    for (const tag of defaultTags) {
        await prisma.tag.create({
            data: tag,
        });
    }

    const tagCount = await prisma.tag.count();
    console.log(`✅ Created ${tagCount} categories`);
    console.log('   Categories:', defaultTags.map(t => t.name).join(', '));
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
