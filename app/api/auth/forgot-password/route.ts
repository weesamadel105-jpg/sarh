import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "البريد الإلكتروني مطلوب" }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    
    // Safety rule: Always return success to prevent email enumeration
    // In a real app, this would trigger an actual email send
    return NextResponse.json({ 
      success: true, 
      message: "إذا كان البريد الإلكتروني مسجلاً، فستتلقى تعليمات استعادة كلمة المرور قريباً." 
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "حدث خطأ داخلي في الخادم" }, { status: 500 });
  }
}
