import { NextResponse } from "next/server";
import mysql, { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import bcrypt from "bcryptjs";

async function getConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
}

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const conn = await getConnection();

    // ✅ SELECT -> pakai RowDataPacket[]
    const [rows] = await conn.execute<RowDataPacket[]>(
      "SELECT id FROM admins WHERE username = ?",
      [username]
    );

    if (rows.length > 0) {
      await conn.end();
      return NextResponse.json(
        { success: false, message: "Username sudah digunakan" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ INSERT -> pakai ResultSetHeader
    const [result] = await conn.execute<ResultSetHeader>(
      "INSERT INTO admins (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );

    await conn.end();

    return NextResponse.json({
      success: true,
      message: "User berhasil didaftarkan",
      user: {
        id: result.insertId, // ResultSetHeader ada insertId
        username,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
