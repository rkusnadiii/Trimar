import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    console.log('🔐 Login attempt started');
    const { username, password } = await req.json();

    if (!username || !password) {
      console.log('❌ Missing credentials');
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    console.log('🔍 Connecting to database...');
    const conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>(
      "SELECT * FROM admins WHERE username = ?",
      [username]
    );
    await conn.end();
    console.log('📊 Database query completed, found', rows.length, 'users');

    if (rows.length === 0) {
      console.log('❌ User not found');
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }

    const user = rows[0];
    console.log('🔒 Verifying password...');
    const valid = await bcrypt.compare(password, user.password as string);

    if (!valid) {
      console.log('❌ Invalid password');
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    console.log('🎫 Generating JWT token...');
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET not configured');
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      jwtSecret,
      { expiresIn: "7d" } // Extended for production
    );

    console.log('✅ Token generated successfully');

    // Set cookie and return success response with token
    const res = NextResponse.json({ 
      success: true,
      token: token, // Include token in response for localStorage
      user: {
        id: user.id,
        username: user.username
      }
    });
    
    // Set HTTP-only cookie with production-safe settings
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
    
    console.log('🚀 Login successful');
    return res;
  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
