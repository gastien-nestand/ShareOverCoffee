import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const newTags = [
    { name: 'Psychology', slug: 'psychology' },
    { name: 'Business Intelligence', slug: 'business-intelligence' },
    { name: 'Systems Analysis', slug: 'systems-analysis' },
    { name: 'Technology', slug: 'technology' },
    { name: 'Finance', slug: 'finance' },
    { name: 'Stories', slug: 'stories' },
];

async function updateTags() {
    console.log('🏷️  Updating tags...');

    try {
        // Delete all existing post-tag relationships
        await prisma.postTag.deleteMany();
        console.log('✅ Cleared post-tag relationships');

        // Delete all existing tags
        await prisma.tag.deleteMany();
        console.log('✅ Cleared existing tags');

        // Create new tags
        for (const tag of newTags) {
            await prisma.tag.create({
                data: tag,
            });
            console.log(`✅ Created tag: ${tag.name}`);
        }

        console.log('🎉 Tags updated successfully!');
    } catch (error) {
        console.error('❌ Error updating tags:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

updateTags();
