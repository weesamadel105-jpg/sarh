import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/lib/db";
import { cookies } from "next/headers";
import crypto from "crypto";

const AUTH_SECRET = process.env.AUTH_SECRET || "sarh-super-secret-key-12345";

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (parseError: any) {
      console.error("[Signup Error] JSON Parse Failed:", parseError.message);
      return NextResponse.json({ error: "خطأ في بيانات الطلب" }, { status: 400 });
    }

    const { email, password } = body;
    console.log(`[Signup Attempt] Email: ${email}`);

    if (!email || !password) {
      console.error("[Signup Error] Missing fields:", { hasEmail: !!email, hasPassword: !!password });
      return NextResponse.json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" }, { status: 400 });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      console.log(`[Signup Failed] Email already in use: ${email}`);
      return NextResponse.json({ error: "البريد مستخدم مسبقاً" }, { status: 400 });
    }

    // Create user with minimal schema: email, password, createdAt
    let newUser;
    try {
      newUser = await createUser(email, password);
    } catch (dbError: any) {
      console.error("[Signup Error] Database creation failed:", dbError.message, dbError.stack);
      throw dbError; // Rethrow to be caught by outer catch
    }

    // Create session data
    const sessionData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name || newUser.email.split("@")[0],
      role: newUser.role || "student",
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
    try {
      const cookieStore = await cookies();
      cookieStore.set("sarh_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });
    } catch (cookieError: any) {
      console.error("[Signup Error] Setting cookie failed:", cookieError.message);
      // We don't necessarily throw here if we want to allow the response, 
      // but usually this is critical for auth.
    }

    console.log(`[Signup Success] User: ${email}`);

    return NextResponse.json({
      success: true,
      message: "تم إنشاء الحساب بنجاح",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: sessionData.name,
        role: sessionData.role,
      },
    });
  } catch (error: any) {
    console.error("[Signup Critical Error] Full Error Details:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
      name: error.name
    });
    
    return NextResponse.json({ 
      error: "حدث خطأ داخلي في الخادم",
      details: process.env.NODE_ENV === "development" ? error.message : "Internal Server Error"
    }, { status: 500 });
  }
}
