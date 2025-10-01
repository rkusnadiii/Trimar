# Works API and Frontend Setup Guide

## Issues Fixed

1. **Database Configuration**: Updated from MySQL2 to Prisma with PostgreSQL support
2. **API Schema Mismatch**: Fixed field names and structure to match frontend expectations
3. **Frontend Data Source**: Updated individual work pages to use API instead of static data
4. **Error Handling**: Added proper error handling and loading states
5. **Type Safety**: Added TypeScript interfaces for better type safety

## Database Setup

### Option 1: PostgreSQL (Recommended)

1. Install PostgreSQL on your system
2. Create a database named `trimar_db`
3. Update the `.env` file with your database credentials:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/trimar_db"
   ```

### Option 2: MySQL

1. Install MySQL on your system
2. Create a database named `trimar_db`
3. Update the `.env` file with your database credentials:
   ```
   DATABASE_URL="mysql://username:password@localhost:3306/trimar_db"
   ```

## Quick Setup

1. **Copy environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

2. **Run the setup script**:
   ```bash
   chmod +x scripts/setup-db.sh
   ./scripts/setup-db.sh
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## Manual Setup

If you prefer manual setup:

1. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

2. **Push database schema**:
   ```bash
   npx prisma db push
   ```

3. **Run migration script**:
   ```bash
   npx tsx scripts/migrate-works.ts
   ```

## API Endpoints

- `GET /api/works` - Get all works
- `POST /api/works` - Create a new work
- `GET /api/works/[slug]` - Get work by slug
- `PUT /api/works/[slug]` - Update work by slug
- `DELETE /api/works/[slug]` - Delete work by slug

## Frontend Pages

- `/works` - Works gallery page
- `/works/[slug]` - Individual work detail page

## Features

- ✅ Dynamic data loading from API
- ✅ Error handling and loading states
- ✅ Responsive design
- ✅ Image lightbox gallery
- ✅ TypeScript support
- ✅ Prisma ORM integration
- ✅ SEO-friendly URLs with slugs

