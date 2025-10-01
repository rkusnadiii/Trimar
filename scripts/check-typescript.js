const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Running TypeScript check...\n');

try {
  // Change to project directory
  process.chdir(__dirname);
  
  console.log('📁 Current directory:', process.cwd());
  
  // Run TypeScript check
  console.log('🔨 Running: npx tsc --noEmit');
  const output = execSync('npx tsc --noEmit', { 
    encoding: 'utf8',
    stdio: 'inherit',
    shell: true
  });
  
  console.log('\n✅ TypeScript check passed! No errors found.');
  
} catch (error) {
  console.error('\n❌ TypeScript errors found:');
  console.error(error.stdout?.toString() || error.message);
  
  console.log('\n🔧 Common fixes:');
  console.log('1. Fix TypeScript errors in the files above');
  console.log('2. Check for missing type definitions');
  console.log('3. Ensure all imports are correct');
  
  process.exit(1);
}

