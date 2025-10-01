import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { withAuth, verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

// Handle CORS preflight requests
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// GET all works (public)
export async function GET() {
  try {
    const works = await (prisma as any).works.findMany({
      orderBy: {
        id: 'desc'
      }
    });

    // Ensure works is an array
    if (!Array.isArray(works)) {
      console.error('Works is not an array:', works);
      const response = NextResponse.json([], { status: 200 });
      // Add CORS headers
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return response;
    }

    // Map response for frontend compatibility
    const mappedWorks = works.map((work: any) => ({
      id: work.id || 0,
      slug: work.slug || '',
      name: work.name || 'Untitled Work',
      logo: work.logo || null,
      year: work.year || null,
      img: work.img || null,
      description: work.description || '',
      logo_url: work.logo || "/images/gallery1.webp",
      thumbnail_url: work.img || "/images/gallery1.webp",
      gallery: [] // Temporarily empty until Prisma client is regenerated
    }));
    
    const response = NextResponse.json(mappedWorks);
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  } catch (error) {
    console.error('Error fetching works:', error);
    return NextResponse.json({ error: 'Failed to fetch works' }, { status: 500 });
  }
}

// CREATE new work (protected)
export const POST = withAuth(async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const slug = formData.get('slug') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    
    if (!slug || !name || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Handle gallery images
    const galleryUrls: string[] = [];
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'works');
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Handle banner upload
    let bannerUrl: string | null = null;
    const bannerFile = formData.get('banner') as File;
    if (bannerFile) {
      const bytes = await bannerFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${slug}-banner-${Date.now()}.${bannerFile.name.split('.').pop()}`;
      const filePath = join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      bannerUrl = `/uploads/works/${fileName}`;
    }

    // Process gallery images
    for (let i = 0; i < 6; i++) {
      const file = formData.get(`gallery_${i}`) as File;
      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${slug}-${Date.now()}-${i}.${file.name.split('.').pop()}`;
        const filePath = join(uploadDir, fileName);
        
        await writeFile(filePath, buffer);
        galleryUrls.push(`/uploads/works/${fileName}`);
      }
    }

    if (galleryUrls.length === 0) {
      return NextResponse.json({ error: 'At least one gallery image is required' }, { status: 400 });
    }

    if (!bannerUrl) {
      return NextResponse.json({ error: 'Banner image is required' }, { status: 400 });
    }
    
    const work = await (prisma as any).works.create({
      data: {
        slug,
        name,
        description,
        img: bannerUrl // Use img field for banner until banner_url is added
        // images: {
        //   create: galleryUrls.map(url => ({
        //     image_url: url
        //   }))
        // }
      }
    });
    
    return NextResponse.json({ success: true, work });
  } catch (error) {
    console.error('Error creating work:', error);
    return NextResponse.json({ error: 'Failed to create work' }, { status: 500 });
  }
});
