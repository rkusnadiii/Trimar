# Quick Setup Guide

## Prisma Client Error Fix

If you're getting the error "Cannot find module './app/generated/prisma'", follow these steps:

### 1. Generate Prisma Client
```bash
npm run db:generate
```

### 2. Setup Database (if not done yet)
```bash
# Create .env file with your database credentials
# Then run:
npm run db:setup
```

### 3. Alternative Manual Setup
```bash
# Step 1: Generate Prisma client
npx prisma generate

# Step 2: Push schema to database
npx prisma db push

# Step 3: Run migration (optional)
npx tsx scripts/migrate-works.ts
```

## Environment Variables Required

Create a `.env` file in the root directory with:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/trimar_db"

# Next.js Configuration  
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# JWT Secret (for authentication)
JWT_SECRET="your-secret-key-here"
```

## Troubleshooting

1. **Prisma Client Not Found**: Run `npm run db:generate`
2. **Database Connection Error**: Check your DATABASE_URL in .env
3. **Migration Fails**: Ensure database exists and is accessible
4. **Build Errors**: Run `npm run db:generate` before building

## Development Workflow

1. **First Time Setup**:
   ```bash
   npm install
   npm run db:setup
   npm run dev
   ```

2. **Regular Development**:
   ```bash
   npm run dev
   ```

3. **After Schema Changes**:
   ```bash
   npm run db:generate
   npm run db:push
   ```

