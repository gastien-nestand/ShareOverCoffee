import { prisma } from '../prisma';

async function main() {
    console.log('🧹 Cleaning database completely...');

    // Delete all data in order (respecting foreign key constraints)
    await prisma.follow.deleteMany();
    await prisma.bookmark.deleteMany();
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.postTag.deleteMany();
    await prisma.post.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    await prisma.verificationToken.deleteMany();

    console.log('✅ Database completely cleaned!');
    console.log('\n📊 All tables are now empty.');
    console.log('   - Users: 0');
    console.log('   - Posts: 0');
    console.log('   - Comments: 0');
    console.log('   - Likes: 0');
    console.log('   - Tags: 0');
    console.log('   - All other data: 0\n');
}

main()
    .catch((e) => {
        console.error('❌ Error cleaning database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
