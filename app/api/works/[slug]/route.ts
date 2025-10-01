import { NextResponse, NextRequest } from "next/server";
import mysql, { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { writeFile, mkdir, unlink } from "fs/promises";
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

// GET work by slug (public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    console.log('📋 Fetching work by slug:', slug);
    
    const conn = await getConnection();
    
    // Get work details
    const [works] = await conn.execute<RowDataPacket[]>(
      `SELECT id, slug, name, logo, year, img, description 
       FROM works 
       WHERE slug = ?`,
      [slug]
    );
    
    if (works.length === 0) {
      await conn.end();
      return NextResponse.json({ error: 'Work not found' }, { status: 404 });
    }
    
    const work = works[0];
    
    // Get gallery images
    const [gallery] = await conn.execute<RowDataPacket[]>(
      `SELECT image_url 
       FROM work_gallery 
       WHERE work_id = ?
       ORDER BY id`,
      [work.id]
    );
    
    await conn.end();
    console.log('✅ Found work with', gallery.length, 'gallery images');

    // Map response for frontend compatibility
    const mappedWork = {
      id: work.id,
      slug: work.slug,
      name: work.name,
      logo: work.logo,
      year: work.year,
      img: work.img,
      description: work.description,
      logo_url: work.logo || "/images/gallery1.webp",
      thumbnail_url: work.img || "/images/gallery1.webp",
      gallery: gallery.map((g: any) => g.image_url)
    };

    return NextResponse.json(mappedWork);
  } catch (error) {
    console.error('❌ Error fetching work:', error);
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
    console.log('✏️ Updating work by slug:', slug);
    
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const existingGalleryJson = formData.get('existing_gallery') as string;
    const existingBanner = formData.get('existing_banner') as string;
    
    if (!name || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const conn = await getConnection();
    
    // Check if work exists
    const [works] = await conn.execute<RowDataPacket[]>(
      `SELECT id FROM works WHERE slug = ?`,
      [slug]
    );

    if (works.length === 0) {
      await conn.end();
      return NextResponse.json({ error: 'Work not found' }, { status: 404 });
    }

    const workId = works[0].id;

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

    // Update work in database
    await conn.execute(
      `UPDATE works SET name = ?, description = ?, img = ? WHERE id = ?`,
      [name, description, finalBannerUrl, workId]
    );

    // Update gallery - delete existing and insert new
    if (newGalleryUrls.length > 0) {
      // Delete existing gallery
      await conn.execute(
        `DELETE FROM work_gallery WHERE work_id = ?`,
        [workId]
      );

      // Combine existing and new gallery
      const finalGallery = [...existingGallery, ...newGalleryUrls];

      // Insert new gallery
      for (const imageUrl of finalGallery) {
        await conn.execute(
          `INSERT INTO work_gallery (work_id, image_url) VALUES (?, ?)`,
          [workId, imageUrl]
        );
      }
    }

    await conn.end();
    console.log('✅ Work updated successfully');

    return NextResponse.json({ 
      success: true, 
      work: {
        id: workId,
        slug,
        name,
        description,
        img: finalBannerUrl
      }
    });
  } catch (error) {
    console.error('❌ Error updating work:', error);
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
    console.log('🗑️ Deleting work by slug:', slug);
    
    const conn = await getConnection();
    
    // Get work details first to delete associated files
    const [works] = await conn.execute<RowDataPacket[]>(
      `SELECT id, img FROM works WHERE slug = ?`,
      [slug]
    );

    if (works.length === 0) {
      await conn.end();
      return NextResponse.json({ error: 'Work not found' }, { status: 404 });
    }

    const work = works[0];
    const workId = work.id;

    // Get gallery images for file deletion
    const [gallery] = await conn.execute<RowDataPacket[]>(
      `SELECT image_url FROM work_gallery WHERE work_id = ?`,
      [workId]
    );

    // Delete gallery images first (foreign key constraint)
    await conn.execute(
      `DELETE FROM work_gallery WHERE work_id = ?`,
      [workId]
    );
    
    // Delete the work
    const [result] = await conn.execute<ResultSetHeader>(
      `DELETE FROM works WHERE id = ?`,
      [workId]
    );
    
    await conn.end();

    // Delete associated image files
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'works');
    
    // Delete banner file if exists
    if (work.img) {
      try {
        const fileName = work.img.split('/').pop();
        if (fileName) {
          const filePath = join(uploadDir, fileName);
          await unlink(filePath);
        }
      } catch (error) {
        console.error('Error deleting banner file:', error);
      }
    }

    // Delete gallery files
    for (const img of gallery) {
      try {
        const fileName = img.image_url.split('/').pop();
        if (fileName) {
          const filePath = join(uploadDir, fileName);
          await unlink(filePath);
        }
      } catch (error) {
        console.error('Error deleting gallery file:', error);
      }
    }

    console.log('✅ Work deleted successfully');
    return NextResponse.json({ 
      success: true, 
      message: 'Work deleted successfully',
      deletedRows: result.affectedRows
    });
  } catch (error) {
    console.error('❌ Error deleting work:', error);
    return NextResponse.json({ error: 'Failed to delete work' }, { status: 500 });
  }
});
