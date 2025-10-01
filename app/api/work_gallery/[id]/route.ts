import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// GET /api/work_gallery/[id]
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM work_gallery WHERE id = ?",
    [id]
  );

  return NextResponse.json(rows[0] || null);
}

// PUT /api/work_gallery/[id]
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { work_id, image_url } = await req.json();

  await db.query<ResultSetHeader>(
    "UPDATE work_gallery SET work_id=?, image_url=? WHERE id=?",
    [work_id, image_url, id]
  );

  return NextResponse.json({ success: true });
}

// DELETE /api/work_gallery/[id]
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await db.query<ResultSetHeader>(
    "DELETE FROM work_gallery WHERE id = ?",
    [id]
  );

  return NextResponse.json({ success: true });
}
