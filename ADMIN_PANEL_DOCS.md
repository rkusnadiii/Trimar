# Admin Panel Documentation

## Overview
The admin panel provides a comprehensive interface for managing works/portfolio items with image upload capabilities. It includes authentication, CRUD operations, and image management with a limit of 6 images per work.

## Features

### ✅ Authentication
- JWT-based authentication
- Protected routes for admin operations
- Login/logout functionality
- Token validation middleware

### ✅ Dashboard
- Overview of all works
- Visual cards showing work details
- Quick actions (Edit/Delete)
- Responsive grid layout
- Real-time data updates

### ✅ Create Work
- Form validation
- Image upload (up to 6 images)
- Image previews with remove functionality
- File type validation (images only)
- Automatic file naming and storage

### ✅ Edit Work
- Pre-populated form with existing data
- Manage existing images (remove individual images)
- Add new images (respecting 6-image limit)
- Visual distinction between existing and new images
- Combined gallery management

### ✅ Image Management
- Automatic upload to `/public/uploads/works/`
- Unique file naming with timestamps
- File cleanup on work deletion
- Image previews in admin interface
- Support for multiple image formats

## File Structure

```
app/admin/
├── page.tsx                 # Main dashboard
├── new/page.tsx            # Create work form
├── edit/[id]/page.tsx     # Edit work form
├── login/page.tsx         # Login page
└── register/page.tsx      # Registration page

app/api/works/
├── route.ts               # GET all works, POST new work
└── [slug]/route.ts        # GET/PUT/DELETE individual work

lib/
└── auth.ts                # Authentication middleware

public/uploads/works/      # Image storage directory
```

## API Endpoints

### Public Endpoints
- `GET /api/works` - Get all works
- `GET /api/works/[slug]` - Get work by slug

### Protected Endpoints (Require Authentication)
- `POST /api/works` - Create new work
- `PUT /api/works/[slug]` - Update work
- `DELETE /api/works/[slug]` - Delete work

## Authentication Flow

1. **Login**: User submits credentials to `/api/auth/login`
2. **Token Storage**: JWT token stored in localStorage
3. **Request Headers**: Token sent as `Authorization: Bearer <token>`
4. **Middleware Validation**: `withAuth` wrapper validates token
5. **Access Control**: Protected routes require valid token

## Image Upload Process

### Create Work
1. User selects up to 6 images
2. Images previewed with remove option
3. Form submission sends `FormData` with images
4. Server processes each image:
   - Generates unique filename: `{slug}-{timestamp}-{index}.{ext}`
   - Saves to `/public/uploads/works/`
   - Stores URLs in database

### Edit Work
1. Existing images displayed with remove option
2. New images can be added (respecting 6-image limit)
3. Form sends:
   - `existing_gallery`: JSON array of kept images
   - `new_gallery_0`, `new_gallery_1`, etc.: New image files
4. Server combines existing and new images

## Database Schema

```prisma
model Work {
  id            Int      @id @default(autoincrement())
  slug          String   @unique
  title         String   // Maps to 'name' in API responses
  description   String
  gallery       Json     // Array of image URLs
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/trimar_db"

# JWT Secret
JWT_SECRET="your-secret-key-here"

# Next.js
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## Usage Instructions

### 1. Setup
```bash
# Install dependencies
npm install

# Setup database
npm run db:setup

# Start development server
npm run dev
```

### 2. Access Admin Panel
1. Navigate to `/admin/login`
2. Login with admin credentials
3. Access dashboard at `/admin`

### 3. Create New Work
1. Click "Add New Work" button
2. Fill in required fields (slug, name, description)
3. Upload 1-6 images
4. Preview images before submission
5. Click "Create Work"

### 4. Edit Existing Work
1. Click "Edit" on any work card
2. Modify text fields as needed
3. Remove existing images by clicking ×
4. Add new images (respecting 6-image limit)
5. Click "Update Work"

### 5. Delete Work
1. Click "Delete" on work card
2. Confirm deletion
3. Work and associated images are permanently removed

## Security Features

- **Authentication Required**: All admin operations require valid JWT token
- **File Validation**: Only image files accepted for upload
- **File Cleanup**: Images deleted when work is removed
- **Input Validation**: Required fields validated on both client and server
- **Error Handling**: Comprehensive error handling and user feedback

## Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Grid Layout**: Responsive grid adapts to screen size
- **Touch-Friendly**: Large buttons and touch targets
- **Dark Theme**: Consistent with site design

## Error Handling

- **Network Errors**: Graceful handling of API failures
- **Validation Errors**: Clear error messages for invalid input
- **File Upload Errors**: Feedback for upload failures
- **Authentication Errors**: Redirect to login on token expiry

## Performance Optimizations

- **Image Optimization**: Next.js Image component for optimized loading
- **Lazy Loading**: Images loaded on demand
- **SWR Caching**: Efficient data fetching and caching
- **File Compression**: Automatic image optimization

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **File API**: Drag & drop support where available
- **ES6+ Features**: Modern JavaScript features used
- **Progressive Enhancement**: Graceful degradation for older browsers

