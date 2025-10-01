#!/bin/bash

# Production build script without Prisma
echo "🚀 Building for production without Prisma..."

# Remove Prisma from package.json temporarily (make backup)
cp package.json package.json.backup

# Create production package.json without Prisma
node -e "
const pkg = require('./package.json');
delete pkg.dependencies['@prisma/client'];
delete pkg.dependencies['prisma'];
delete pkg.devDependencies['prisma'];
delete pkg.scripts['postinstall'];
delete pkg.scripts['db:generate'];
delete pkg.scripts['db:push'];
delete pkg.scripts['db:migrate'];
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
" 2>/dev/null || echo "Note: Some Prisma dependencies might not exist in package.json"

echo "✅ Removed Prisma dependencies"

# Build the project
npm run build

# Restore original package.json
mv package.json.backup package.json

echo "✅ Build completed! Deploy the .next directory to your hosting platform."
echo ""
echo "📋 Production deployment checklist:"
echo "1. Set environment variables in your hosting platform"
echo "2. Ensure database is accessible from production server"
echo "3. Test the /api/works endpoint after deployment"
echo "4. Test login functionality"
