import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Token verification request received');
    
    // Check for token in Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log('❌ No authorization header or invalid format');
      return NextResponse.json(
        { valid: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    console.log('🎫 Token extracted, length:', token.length);
    
    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET not configured');
      return NextResponse.json(
        { valid: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    console.log('🔐 Verifying JWT token...');
    const payload = jwt.verify(token, jwtSecret) as any;
    console.log('✅ Token verified successfully for user:', payload.username);
    
    return NextResponse.json({
      valid: true,
      user: {
        id: payload.id || payload.userId,
        username: payload.username
      }
    });

  } catch (error) {
    console.error("❌ Token verification error:", error);
    
    if (error instanceof jwt.TokenExpiredError) {
      console.log('⏰ Token expired');
      return NextResponse.json(
        { valid: false, message: "Token expired" },
        { status: 401 }
      );
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      console.log('🚫 Invalid token format');
      return NextResponse.json(
        { valid: false, message: "Invalid token" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { valid: false, message: "Token verification failed" },
      { status: 401 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
