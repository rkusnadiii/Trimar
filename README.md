# Trimar Production Website

A professional event management company website built with Next.js 15, featuring portfolio management, authentication system, and modern responsive design.

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.0 with App Router
- **Runtime**: Node.js 20.19.5+ (required)
- **Database**: MySQL 9.4.0
- **ORM**: Prisma 6.16.1
- **Styling**: Tailwind CSS
- **Authentication**: JWT with bcrypt
- **Animations**: Framer Motion
- **Build Tool**: Turbopack

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 20.19.5 or higher installed
- MySQL 9.4.0 or compatible version
- npm or yarn package manager

### Installing Node.js

**Windows**
```bash
# Option 1: Download from official website
# Visit https://nodejs.org and download the LTS version

# Option 2: Using Chocolatey
choco install nodejs

# Option 3: Using Scoop
scoop install nodejs

# Option 4: Using nvm-windows (recommended for version management)
# 1. Download nvm-windows from: https://github.com/coreybutler/nvm-windows
# 2. Install and restart terminal
nvm install 20.19.5
nvm use 20.19.5
```

**macOS**
```bash
# Option 1: Using Homebrew
brew install node@20

# Option 2: Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20.19.5
nvm use 20.19.5
```

**Linux**
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20.19.5
nvm use 20.19.5

# Or using package manager (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository (if applicable)
cd /path/to/trimar-production-website

# Install dependencies
npm install
```

### 2. Database Setup

#### Install MySQL

**macOS (with Homebrew)**
```bash
# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Secure MySQL installation
mysql_secure_installation
```

**Windows**
```bash
# Option 1: Using Chocolatey (recommended)
choco install mysql

# Option 2: Download MySQL Installer
# 1. Download MySQL Installer from https://dev.mysql.com/downloads/installer/
# 2. Run the installer and choose "Developer Default"
# 3. Follow the installation wizard
# 4. Set root password during installation

# Start MySQL service (run as Administrator)
net start mysql80

# OR using MySQL Workbench/Services panel to start MySQL
```

**Linux (Ubuntu/Debian)**
```bash
# Update package list
sudo apt update

# Install MySQL server
sudo apt install mysql-server

# Start MySQL service
sudo systemctl start mysql

# Secure MySQL installation
sudo mysql_secure_installation
```

#### Create Database and User

**All Platforms (macOS/Windows/Linux)**
```bash
# Connect to MySQL as root
mysql -u root -p

# Create database and user
CREATE DATABASE trimarpr_profile;
CREATE USER 'trimarpr_user'@'localhost' IDENTIFIED BY 'AdminTrimar1!';
GRANT ALL PRIVILEGES ON trimarpr_profile.* TO 'trimarpr_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Windows Alternative (using MySQL Workbench)**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Execute the SQL commands above in a new query tab
4. Or use the GUI to create database and user through the interface

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="mysql://trimarpr_user:AdminTrimar1!@localhost:3306/trimarpr_profile"
DB_HOST=localhost
DB_USERNAME=trimarpr_user
DB_PASSWORD=AdminTrimar1!
DB_DATABASE=trimarpr_profile

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars
```

### 4. Database Schema Setup with Prisma

The project uses Prisma for database schema management. The schema file is located at `prisma/schema.prisma`.

```bash
# Generate Prisma client
npx prisma generate

# Reset database and apply current schema (development)
npx prisma migrate reset --force

# OR create new migration if schema changed
npx prisma migrate dev --name update-schema

# For production deployment
npx prisma migrate deploy
```

#### Current Prisma Schema

The `prisma/schema.prisma` includes:
- **Work model**: Portfolio projects with title, slug, description, banner_url, gallery (JSON string)
- **Admin model**: Authentication for admin users
- **MySQL provider**: Configured for MySQL database

#### Seed Data (Optional)

After running migrations, you can add sample data:

```bash
# Create admin user
mysql -u trimarpr_user -pAdminTrimar1! -D trimarpr_profile -e "
INSERT INTO admins (username, password) VALUES 
('admin', '\$2b\$12\$5xABKhLwcOcQP7MZ.FgBdOAAZO7FVc8n73EvhItUGmqB9gfhfx8eO')
ON DUPLICATE KEY UPDATE password = VALUES(password);"

# Add sample portfolio works
mysql -u trimarpr_user -pAdminTrimar1! -D trimarpr_profile -e "
INSERT IGNORE INTO works (title, slug, description, banner_url, gallery) VALUES 
('Corporate Event Jakarta', 'corporate-event-jakarta', 'Professional corporate event management', '/images/gallery1.webp', '[\"gallery1.webp\", \"gallery2.webp\"]'),
('Wedding Celebration', 'wedding-celebration-bali', 'Beautiful wedding ceremony in Bali', '/images/gallery4.webp', '[\"gallery4.webp\", \"gallery5.webp\"]'),
('Product Launch Event', 'product-launch-event', 'Grand product launch with media coverage', '/images/gallery7.webp', '[\"gallery7.webp\", \"gallery8.webp\"]');"
```

## 🏃‍♂️ Running the Application

### 1. Switch to Node.js 20 (if using nvm)
```bash
nvm use 20
```

### 2. Start Development Server
```bash
npm run dev
```

The application will be available at:
- **Website**: http://localhost:3000 (or next available port)
- **Admin Panel**: http://localhost:3000/admin/login

## 🔐 Admin Access

### Login Credentials
- **Username**: `admin`
- **Password**: `admin123`

### Admin Features
- Portfolio works management (Create, Read, Update, Delete)
- Dashboard with statistics
- Image gallery management
- Secure JWT authentication

## 📊 Database Connection (DBeaver/External Tools)

Use these credentials to connect with database management tools:

- **Host**: localhost
- **Port**: 3306
- **Database**: trimarpr_profile
- **Username**: trimarpr_user
- **Password**: AdminTrimar1!

## 🗂️ Project Structure

```
├── app/
│   ├── admin/              # Admin dashboard pages
│   │   ├── login/          # Admin login
│   │   ├── edit/[id]/      # Edit portfolio work
│   │   ├── new/            # Create new work
│   │   └── page.tsx        # Admin dashboard
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   └── works/          # Portfolio CRUD endpoints
│   ├── about/              # About page
│   ├── contact/            # Contact page
│   ├── team/               # Team page
│   ├── works/              # Portfolio pages
│   └── layout.tsx          # Root layout
├── components/             # Reusable React components
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
└── middleware.ts           # Authentication middleware
```

## 🔧 Key Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Portfolio Management**: Full CRUD operations for project portfolio
- **Authentication**: Secure JWT-based admin authentication
- **Image Galleries**: Dynamic image gallery management
- **SEO Optimized**: Meta tags and structured data
- **Performance**: Optimized with Next.js 15 and Turbopack

## 🚀 Deployment

For production deployment:

1. Set up production database
2. Update environment variables
3. Build the application: `npm run build`
4. Deploy to your preferred platform (Vercel, AWS, etc.)

## 🐛 Troubleshooting

### Common Issues

1. **Node.js Version**: Ensure you're using Node.js 20+
2. **Database Connection**: Verify MySQL is running and credentials are correct
3. **Port Conflicts**: If port 3000 is in use, Next.js will automatically use the next available port
4. **JWT Issues**: Ensure JWT_SECRET is set in environment variables
5. **Prisma Issues**: 
   - Run `npx prisma generate` if you see Prisma client errors
   - Use `npx prisma migrate reset --force` to reset database and reapply migrations
   - Check `prisma/migrations/` folder for existing migration files
6. **Database Schema Drift**: If you see schema drift warnings, run `npx prisma migrate dev` to create a new migration
7. **Windows Specific Issues**:
   - Use PowerShell or Command Prompt as Administrator for MySQL commands
   - If MySQL service won't start, check Windows Services panel
   - For path issues, ensure MySQL bin directory is in PATH environment variable
   - Use `mysql.exe` explicitly if `mysql` command is not recognized

### Support

For technical support or questions about this project, please check:
- Next.js documentation: https://nextjs.org/docs
- MySQL documentation: https://dev.mysql.com/doc/
- Prisma documentation: https://www.prisma.io/docs

## 📦 Sharing This Project

### Creating a ZIP for Distribution

When sharing this project as a ZIP file, follow these steps:

#### Files to EXCLUDE from ZIP:
```
node_modules/          # Dependencies (large, can be reinstalled)
.git/                  # Git history (optional, exclude if not needed)
.next/                 # Next.js build cache
dist/                  # Build output
*.log                  # Log files
.DS_Store             # macOS system files
.env                  # Environment variables (security)
```

#### Files to INCLUDE:
```
app/                  # Source code
components/           # React components
prisma/              # Database schema
public/              # Static assets
package.json         # Dependencies list
package-lock.json    # Dependency lock file
next.config.ts       # Next.js configuration
tailwind.config.js   # Tailwind configuration
tsconfig.json        # TypeScript configuration
middleware.ts        # Authentication middleware
README.md            # This documentation
.env.example         # Environment template
```

### For Recipients of ZIP File

If you received this project as a ZIP file, follow the complete installation guide above, starting from:

1. **Extract the ZIP file** to your desired location
2. **Follow the Prerequisites section** to install Node.js and MySQL
3. **Run the Installation & Setup steps** starting from step 1
4. **Create your own `.env` file** based on `.env.example` template

### Pre-ZIP Checklist

Before creating the ZIP file:

- [ ] Remove `node_modules/` folder (saves ~400MB)
- [ ] Remove `.next/` folder (build cache)
- [ ] Remove `.git/` folder (if not sharing version history)
- [ ] Create `.env.example` with template values ✅
- [ ] Remove actual `.env` file (contains passwords)
- [ ] Update README.md with project-specific notes ✅
- [ ] Test that the project works after fresh installation

### ZIP Creation Commands

**macOS/Linux:**
```bash
# Navigate to parent directory
cd /Users/mekari/Downloads

# Create ZIP excluding unnecessary files
zip -r trimar-production-website.zip next/ \
  -x "next/node_modules/*" \
  -x "next/.next/*" \
  -x "next/.git/*" \
  -x "next/*.log" \
  -x "next/.DS_Store" \
  -x "next/.env"
```

**Windows (PowerShell):**
```powershell
# Navigate to project directory
cd C:\path\to\next

# Create ZIP using built-in compression
Compress-Archive -Path . -DestinationPath ..\trimar-production-website.zip -Exclude node_modules,.next,.git,*.log,.env
```
