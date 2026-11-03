const { execSync } = require('child_process');

console.log('=== [Gaming Arena] Starting Automated Build Process ===');

// 1. Generate Prisma Client
console.log('-> Generating Prisma Client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✓ Prisma Client generated.');
} catch (err) {
  console.error('Error generating Prisma client:', err);
  process.exit(1);
}

// 2. Automatically sync database schema to Cloud PostgreSQL if DATABASE_URL is present
if (process.env.DATABASE_URL) {
  console.log('-> DATABASE_URL detected. Synchronizing PostgreSQL schema...');
  try {
    execSync('npx prisma db push --skip-generate --accept-data-loss', { stdio: 'inherit' });
    console.log('✓ Cloud Database schema synchronized successfully.');
  } catch (err) {
    console.warn('⚠️ Warning: Prisma db push could not connect to database (or database is not ready yet). Build will continue.');
  }
} else {
  console.log('-> No DATABASE_URL configured. Skipping database schema sync.');
}

// 3. Compile Next.js production build
console.log('-> Building Next.js application...');
try {
  execSync('next build', { stdio: 'inherit' });
  console.log('✓ Next.js build completed successfully.');
} catch (err) {
  console.error('Next.js build failed:', err);
  process.exit(1);
}
