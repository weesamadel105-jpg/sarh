import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, verifyPassword } from "@/lib/db";
import { cookies } from "next/headers";
import crypto from "crypto";

const AUTH_SECRET = process.env.AUTH_SECRET || "sarh-super-secret-key-12345";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    console.log(`[Login Attempt] Email: ${email}`);

    if (!email || !password) {
      return NextResponse.json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      console.log(`[Login Failed] User not found: ${email}`);
      return NextResponse.json({ error: "البريد أو كلمة المرور غير صحيحة" }, { status: 401 });
    }

    // Use passwordHash from user record, handle potential missing field
    const hash = user.passwordHash;
    if (!hash) {
      console.error(`[Login Error] User ${email} has no password hash`);
      return NextResponse.json({ error: "حدث خطأ داخلي في الخادم" }, { status: 500 });
    }

    const isValid = await verifyPassword(password, hash);
    if (!isValid) {
      console.log(`[Login Failed] Invalid password for: ${email}`);
      return NextResponse.json({ error: "البريد أو كلمة المرور غير صحيحة" }, { status: 401 });
    }

    // Create session data
    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name || user.email.split("@")[0],
      role: user.role || "student",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
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
    cookieStore.set("sarh_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    console.log(`[Login Success] User: ${email}, Role: ${sessionData.role}`);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: sessionData.name,
        role: sessionData.role,
      },
    });
  } catch (error: any) {
    console.error("Login server-side error:", error);
    return NextResponse.json({ 
      error: "حدث خطأ داخلي في الخادم",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    }, { status: 500 });
  }
}
