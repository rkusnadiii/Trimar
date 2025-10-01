#!/usr/bin/env node

// Simple setup script to help with initial configuration
const fs = require('fs');
const path = require('path');

console.log('🚀 Trimar Production Works Setup');
console.log('================================');

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file...');
  const envContent = `# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/trimar_db"

# Next.js Configuration  
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# JWT Secret (for authentication)
JWT_SECRET="your-secret-key-here"

# Database Connection Details (for MySQL fallback)
DB_HOST="localhost"
DB_USER="your-username"
DB_PASS="your-password"
DB_NAME="trimar_db"
`;
  
  fs.writeFileSync('.env', envContent);
  console.log('✅ .env file created');
  console.log('⚠️  Please edit .env with your actual database credentials');
} else {
  console.log('✅ .env file already exists');
}

// Check if Prisma client exists
const prismaClientPath = path.join('app', 'generated', 'prisma', 'index.js');
if (!fs.existsSync(prismaClientPath)) {
  console.log('🔧 Prisma client not found. Please run:');
  console.log('   npm run db:generate');
} else {
  console.log('✅ Prisma client found');
}

console.log('\n📋 Next Steps:');
console.log('1. Edit .env file with your database credentials');
console.log('2. Run: npm run db:generate');
console.log('3. Run: npm run db:push');
console.log('4. Run: npm run dev');
console.log('\n🎉 Happy coding!');

