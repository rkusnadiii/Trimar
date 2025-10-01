import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all gallery items
export async function GET() {
  const [rows] = await db.query(
    "SELECT wg.*, w.name as work_name FROM work_gallery wg JOIN works w ON wg.work_id = w.id"
  );
  return NextResponse.json(rows);
}

// CREATE new gallery item
export async function POST(req: Request) {
  const { work_id, image_url } = await req.json();
  await db.query(
    "INSERT INTO work_gallery (work_id, image_url) VALUES (?, ?)",
    [work_id, image_url]
  );
  return NextResponse.json({ success: true });
}