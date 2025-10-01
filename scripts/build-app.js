const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Building Next.js application...\n');

try {
  // Change to project directory
  process.chdir(__dirname);
  
  console.log('📁 Current directory:', process.cwd());
  
  // Run build command
  console.log('🔨 Running: npm run build');
  const output = execSync('npm run build', { 
    encoding: 'utf8',
    stdio: 'inherit',
    shell: true
  });
  
  console.log('\n✅ Build completed successfully!');
  
} catch (error) {
  console.error('\n❌ Build failed:');
  console.error(error.message);
  
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Check if all dependencies are installed: npm install');
  console.log('2. Check for TypeScript errors');
  console.log('3. Check for missing files');
  console.log('4. Try running: npx next build');
  
  process.exit(1);
}

