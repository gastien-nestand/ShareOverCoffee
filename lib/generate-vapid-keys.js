const webpush = require('web-push');

// Generate VAPID keys
const vapidKeys = webpush.generateVAPIDKeys();

console.log('\n=================================');
console.log('VAPID Keys Generated Successfully');
console.log('=================================\n');

console.log('Add these to your .env file:\n');
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);

console.log('\n=================================');
console.log('IMPORTANT: Keep the private key secret!');
console.log('=================================\n');
