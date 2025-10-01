#!/bin/bash

# Database Setup Script for Trimar Production Works API

echo "Setting up Trimar Production Works Database..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Database Configuration
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
EOF
    echo "Please edit .env file with your actual database credentials"
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push database schema
echo "Pushing database schema..."
npx prisma db push

# Run migration script
echo "Running works migration..."
npx tsx scripts/migrate-works.ts

echo "Database setup completed!"
echo "You can now run 'npm run dev' to start the development server"

