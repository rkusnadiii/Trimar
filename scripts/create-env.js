const fs = require('fs');
const path = require('path');

// Template untuk file .env
const envTemplate = `# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# MySQL Database Configuration (for lib/db.ts)
DB_HOST=localhost
DB_USER=trimarpr_user
DB_PASS=AdminTrimar1!
DB_NAME=trimarpr_user

# Next.js Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# JWT Secret for Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Production URL (update this for your hosting)
# NEXT_PUBLIC_BASE_URL=https://yourdomain.com
`;

// Template untuk hosting
const envProductionTemplate = `# Production Database Configuration
DATABASE_URL="mysql://your_hosting_user:your_hosting_password@your_hosting_host:3306/your_database_name"

# MySQL Database Configuration (for lib/db.ts)
DB_HOST=localhost
DB_USER=trimarpr_user
DB_PASS=AdminTrimar1!
DB_NAME=trimarpr_profile

# Production URL
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# JWT Secret for Authentication
JWT_SECRET=your-super-secret-jwt-key-here
`;

function createEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  
  console.log('🔧 Creating .env files...');
  
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists');
    console.log('   If you want to recreate it, delete the existing file first');
    return;
  }
  
  try {
    // Create .env file
    fs.writeFileSync(envPath, envTemplate);
    console.log('✅ Created .env file');
    
    // Create .env.example file
    fs.writeFileSync(envExamplePath, envTemplate);
    console.log('✅ Created .env.example file');
    
    console.log('\n📝 Next steps:');
    console.log('1. Edit .env file with your actual database credentials');
    console.log('2. Update DATABASE_URL with your MySQL connection string');
    console.log('3. Update DB_HOST, DB_USER, DB_PASS, DB_NAME');
    console.log('4. Update NEXT_PUBLIC_BASE_URL for your domain');
    console.log('5. Generate a secure JWT_SECRET');
    console.log('\nExample for hosting:');
    console.log('DATABASE_URL="mysql://user:pass@host:3306/dbname"');
    console.log('NEXT_PUBLIC_BASE_URL="https://yourdomain.com"');
    
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    console.log('\n🔧 Manual steps:');
    console.log('1. Create .env file in project root');
    console.log('2. Copy the template above');
    console.log('3. Update with your database credentials');
  }
}

function showDatabaseSetup() {
  console.log('\n🗄️  Database Setup Instructions:');
  console.log('');
  console.log('1. Create MySQL database:');
  console.log('   CREATE DATABASE your_database_name;');
  console.log('');
  console.log('2. Create tables:');
  console.log('   USE your_database_name;');
  console.log('');
  console.log('   CREATE TABLE works (');
  console.log('     id INT AUTO_INCREMENT PRIMARY KEY,');
  console.log('     slug VARCHAR(255) UNIQUE NOT NULL,');
  console.log('     name VARCHAR(255) NOT NULL,');
  console.log('     logo VARCHAR(255),');
  console.log('     year VARCHAR(255),');
  console.log('     img VARCHAR(255),');
  console.log('     description TEXT NOT NULL');
  console.log('   );');
  console.log('');
  console.log('   CREATE TABLE work_gallery (');
  console.log('     id INT AUTO_INCREMENT PRIMARY KEY,');
  console.log('     work_id INT NOT NULL,');
  console.log('     image_url VARCHAR(255) NOT NULL,');
  console.log('     FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE');
  console.log('   );');
  console.log('');
  console.log('3. Insert sample data (optional):');
  console.log('   INSERT INTO works (slug, name, description) VALUES');
  console.log('   ("test-work", "Test Work", "This is a test work");');
}

// Main execution
console.log('🚀 Environment Setup Tool\n');

createEnvFile();
showDatabaseSetup();

console.log('\n✅ Setup complete!');
console.log('   Run: npm run dev');
console.log('   Or: npx tsx scripts/test-db-connection.ts');

