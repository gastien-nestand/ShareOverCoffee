// Test script to check DATABASE_URL
console.log('DATABASE_URL from .env:');
console.log(process.env.DATABASE_URL);
console.log('\nLength:', process.env.DATABASE_URL?.length);
console.log('Starts with postgresql://?', process.env.DATABASE_URL?.startsWith('postgresql://'));
