import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const AUTH_SECRET = process.env.AUTH_SECRET || "sarh-super-secret-key-12345";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // Check for admin session first
    let token = cookieStore.get("sarh_admin_session")?.value;
    let isAdmin = !!token;

    // If no admin session, check for student session
    if (!token) {
      token = cookieStore.get("sarh_session")?.value;
      isAdmin = false;
    }

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const parts = token.split(".");
    if (parts.length !== 2) {
      return NextResponse.json({ user: null });
    }

    const sessionStr = Buffer.from(parts[0], "base64").toString("utf8");
    const signature = parts[1];

    const expectedSignature = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(sessionStr)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ user: null });
    }

    const sessionData = JSON.parse(sessionStr);
    
    // Check expiration
    if (new Date(sessionData.expires) < new Date()) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: sessionData.id,
        email: sessionData.email || "",
        name: sessionData.name,
        role: sessionData.role,
      },
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ user: null });
  }
}
