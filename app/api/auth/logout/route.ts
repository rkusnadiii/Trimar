import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = NextResponse.json({ success: true, message: "Logged out successfully" });
    
    // Clear the authentication token cookie
    res.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "lax",
      path: "/",
      maxAge: 0, // This expires the cookie immediately
    });
    
    return res;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
