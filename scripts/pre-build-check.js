const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for build errors...\n');

// Check if .env file exists
function checkEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.log('⚠️  .env file not found');
    console.log('   Run: npm run create-env');
    return false;
  }
  console.log('✅ .env file exists');
  return true;
}

// Check if Prisma client exists
function checkPrismaClient() {
  const prismaPath = path.join(__dirname, '..', 'app', 'generated', 'prisma');
  if (!fs.existsSync(prismaPath)) {
    console.log('⚠️  Prisma client not found');
    console.log('   Run: npx prisma generate');
    return false;
  }
  console.log('✅ Prisma client exists');
  return true;
}

// Check for TypeScript errors
function checkTypeScriptErrors() {
  console.log('🔍 Checking TypeScript errors...');
  try {
    const { execSync } = require('child_process');
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log('✅ No TypeScript errors');
    return true;
  } catch (error) {
    console.log('❌ TypeScript errors found:');
    console.log(error.stdout?.toString() || error.message);
    return false;
  }
}

// Check for missing dependencies
function checkDependencies() {
  console.log('🔍 Checking dependencies...');
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
  
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('❌ node_modules not found');
    console.log('   Run: npm install');
    return false;
  }
  
  console.log('✅ Dependencies installed');
  return true;
}

// Main check function
async function main() {
  console.log('🚀 Pre-build Check\n');
  
  const checks = [
    { name: 'Environment File', check: checkEnvFile },
    { name: 'Prisma Client', check: checkPrismaClient },
    { name: 'Dependencies', check: checkDependencies },
    { name: 'TypeScript', check: checkTypeScriptErrors },
  ];
  
  let allPassed = true;
  
  for (const { name, check } of checks) {
    console.log(`\n📋 ${name}:`);
    const passed = check();
    if (!passed) {
      allPassed = false;
    }
  }
  
  console.log('\n📊 Summary:');
  if (allPassed) {
    console.log('✅ All checks passed! Ready to build.');
    console.log('\n🚀 You can now run:');
    console.log('   npm run build');
    console.log('   or');
    console.log('   node scripts/build-app.js');
  } else {
    console.log('❌ Some checks failed. Please fix the issues above.');
    console.log('\n🔧 Common fixes:');
    console.log('1. Create .env file: npm run create-env');
    console.log('2. Install dependencies: npm install');
    console.log('3. Generate Prisma client: npx prisma generate');
    console.log('4. Fix TypeScript errors');
  }
}

main().catch(console.error);

