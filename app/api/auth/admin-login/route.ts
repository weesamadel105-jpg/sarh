import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const AUTH_SECRET = process.env.AUTH_SECRET || "sarh-super-secret-key-12345";

// Valid Master Key for Admin
const MASTER_KEY = "SARH-ADMIN-2026";

export async function POST(req: NextRequest) {
  try {
    const { adminCode } = await req.json();

    if (!adminCode) {
      return NextResponse.json({ error: "يرجى إدخال الماستر كي" }, { status: 400 });
    }

    // Check if code matches the master key (exact case-sensitive match with trim)
    if (adminCode.trim() !== MASTER_KEY) {
      return NextResponse.json({ error: "الماستر كي غير صحيح" }, { status: 401 });
    }

    // Create session data for admin
    const sessionData = {
      id: "admin-master",
      name: "Admin",
      role: "admin",
      adminCode: adminCode,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours for admins
    };

    // Sign the session data
    const sessionStr = JSON.stringify(sessionData);
    const signature = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(sessionStr)
      .digest("hex");
    
    const token = `${Buffer.from(sessionStr).toString("base64")}.${signature}`;

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("sarh_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return NextResponse.json({
      success: true,
      admin: {
        id: sessionData.id,
        name: sessionData.name,
        role: sessionData.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "حدث خطأ داخلي في الخادم" }, { status: 500 });
  }
}
