const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Enter admin password to hash:');
rl.question('', (password) => {
  if (!password || password.trim() === '') {
    console.error('Password cannot be empty');
    rl.close();
    process.exit(1);
  }
  const hash = bcrypt.hashSync(password, 10);
  console.log('\nCopy this to your environment variables:');
  console.log('ADMIN_HASH=' + hash);
  console.log('\nAlso set ADMIN_PASSWORD=' + password);
  rl.close();
});
