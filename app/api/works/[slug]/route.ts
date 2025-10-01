import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { withAuth } from "@/lib/auth";

const prisma = new PrismaClient();

// GET work by slug (public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const work = await (prisma as any).works.findUnique({
      where: {
        slug: slug
      }
    });

    if (!work) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 });
    }

    // Map response for frontend compatibility
    const mappedWork = {
      ...work,
      logo_url: (work as any).logo,
      thumbnail_url: (work as any).img,
      gallery: [] // Temporarily empty until Prisma client is regenerated
    };

    return NextResponse.json(mappedWork);
  } catch (error) {
    console.error('Error fetching work:', error);
    return NextResponse.json({ error: 'Failed to fetch work' }, { status: 500 });
  }
}

// UPDATE work by slug (protected)
export const PUT = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const { slug } = await params;
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const existingGalleryJson = formData.get('existing_gallery') as string;
    const existingBanner = formData.get('existing_banner') as string;
    
    if (!name || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Parse existing gallery
    let existingGallery: string[] = [];
    try {
      existingGallery = JSON.parse(existingGalleryJson || '[]');
    } catch (error) {
      console.error('Error parsing existing gallery:', error);
    }

    // Handle new gallery images
    const newGalleryUrls: string[] = [];
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'works');
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Handle new banner upload
    let newBannerUrl: string | null = null;
    const newBannerFile = formData.get('new_banner') as File;
    if (newBannerFile) {
      const bytes = await newBannerFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${slug}-banner-${Date.now()}.${newBannerFile.name.split('.').pop()}`;
      const filePath = join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      newBannerUrl = `/uploads/works/${fileName}`;
    }

    // Determine final banner URL
    const finalBannerUrl = newBannerUrl || existingBanner || null;

    // Process new gallery images
    for (let i = 0; i < 6; i++) {
      const file = formData.get(`new_gallery_${i}`) as File;
      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${slug}-${Date.now()}-${i}.${file.name.split('.').pop()}`;
        const filePath = join(uploadDir, fileName);
        
        await writeFile(filePath, buffer);
        newGalleryUrls.push(`/uploads/works/${fileName}`);
      }
    }

    // Combine existing and new gallery
    const finalGallery = [...existingGallery, ...newGalleryUrls];

    if (finalGallery.length === 0) {
      return NextResponse.json({ error: 'At least one image is required' }, { status: 400 });
    }
    
    const work = await (prisma as any).works.update({
      where: {
        slug: slug
      },
      data: {
        name,
        description,
        img: finalBannerUrl // Use img field for banner until banner_url is added
        // images: {
        //   deleteMany: {}, // Delete all existing images
        //   create: finalGallery.map(url => ({
        //     image_url: url
        //   }))
        // }
      }
    });

    return NextResponse.json({ success: true, work });
  } catch (error) {
    console.error('Error updating work:', error);
    return NextResponse.json({ error: 'Failed to update work' }, { status: 500 });
  }
});

// DELETE work by slug (protected)
export const DELETE = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const { slug } = await params;
    
    // Get work data first to delete associated files
    const work = await (prisma as any).works.findUnique({
      where: { slug }
    });

    if (work) {
      // Delete associated image files
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'works');
      
      // Delete banner file if exists
      if ((work as any).img) {
        try {
          const fileName = (work as any).img.split('/').pop();
          if (fileName) {
            const filePath = join(uploadDir, fileName);
            await unlink(filePath);
          }
        } catch (error) {
          console.error('Error deleting banner file:', error);
        }
      }
      
      // TODO: Delete gallery files when images relation is available
    }

    await (prisma as any).works.delete({
      where: {
        slug: slug
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting work:', error);
    return NextResponse.json({ error: 'Failed to delete work' }, { status: 500 });
  }
});
