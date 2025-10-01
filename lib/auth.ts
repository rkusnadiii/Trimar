import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function verifyToken(request: NextRequest): { valid: boolean; payload?: any; error?: string } {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { valid: false, error: "No token provided" };
    }

    const token = authHeader.substring(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    
    return { valid: true, payload };
  } catch (error) {
    return { valid: false, error: "Invalid token" };
  }
}

export function withAuth(handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
    const { valid, error } = verifyToken(req);
    
    if (!valid) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }
    
    return handler(req, ...args);
  };
}

