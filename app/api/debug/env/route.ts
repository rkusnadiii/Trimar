import { NextResponse } from "next/server";

export async function GET() {
  // Only show this in development or with a special query param for security
  const isDev = process.env.NODE_ENV === 'development';
  
  if (!isDev) {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasDbHost: !!process.env.DB_HOST,
    hasDbUser: !!process.env.DB_USERNAME,
    hasDbPassword: !!process.env.DB_PASSWORD,
    hasDbName: !!process.env.DB_DATABASE,
    hasDbPort: !!process.env.DB_PORT,
    timestamp: new Date().toISOString()
  });
}
