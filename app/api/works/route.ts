import { NextResponse, NextRequest } from "next/server";
import mysql, { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { withAuth } from "@/lib/auth";

// Database connection function
async function getConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
}

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
    console.log('📋 Fetching works from database...');
    const conn = await getConnection();
    
    const [works] = await conn.execute<RowDataPacket[]>(
      `SELECT 
        id, slug, name, logo, year, img, description 
       FROM works 
       ORDER BY id DESC`
    );
    
    await conn.end();
    console.log('✅ Found', works.length, 'works');

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
      gallery: [] // Will be populated when needed
    }));
    
    const response = NextResponse.json(mappedWorks);
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  } catch (error) {
    console.error('❌ Error fetching works:', error);
    return NextResponse.json({ error: 'Failed to fetch works' }, { status: 500 });
  }
}

// CREATE new work (protected)
export const POST = withAuth(async (req: NextRequest) => {
  try {
    console.log('📝 Creating new work...');
    const formData = await req.formData();
    const slug = formData.get('slug') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    
    if (!slug || !name || !description) {
      console.log('❌ Missing required fields');
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
      console.log('❌ No gallery images provided');
      return NextResponse.json({ error: 'At least one gallery image is required' }, { status: 400 });
    }

    if (!bannerUrl) {
      console.log('❌ No banner image provided');
      return NextResponse.json({ error: 'Banner image is required' }, { status: 400 });
    }
    
    // Insert work into database
    console.log('💾 Inserting work into database...');
    const conn = await getConnection();
    
    const [result] = await conn.execute<ResultSetHeader>(
      `INSERT INTO works (slug, name, description, img) 
       VALUES (?, ?, ?, ?)`,
      [slug, name, description, bannerUrl]
    );
    
    // Insert gallery images
    for (const imageUrl of galleryUrls) {
      await conn.execute(
        `INSERT INTO work_gallery (work_id, image_url) VALUES (?, ?)`,
        [result.insertId, imageUrl]
      );
    }
    
    await conn.end();
    console.log('✅ Work created successfully with ID:', result.insertId);
    
    return NextResponse.json({ 
      success: true, 
      work: {
        id: result.insertId,
        slug,
        name,
        description,
        img: bannerUrl,
        gallery: galleryUrls
      }
    });
  } catch (error) {
    console.error('❌ Error creating work:', error);
    return NextResponse.json({ error: 'Failed to create work' }, { status: 500 });
  }
});
