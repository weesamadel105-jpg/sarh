import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, verifyStudentSession } from "@/lib/auth";
import { getChatMessages, saveChatMessage, ChatMessage } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const adminSession = await verifyAdminSession();
    const studentSession = await verifyStudentSession();

    if (!adminSession && !studentSession) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get("requestId");

    if (!requestId) {
      return NextResponse.json({ success: false, error: "Missing requestId" }, { status: 400 });
    }

    const messages = await getChatMessages(requestId);

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Chat GET error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminSession = await verifyAdminSession();
    const studentSession = await verifyStudentSession();

    if (!adminSession && !studentSession) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { requestId, sender, text, message } = body;
    const finalMessage = text || message;

    if (!requestId || !sender || !finalMessage) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const newMessage: ChatMessage = {
      requestId,
      sender, // "student" | "admin"
      message: finalMessage,
      createdAt: new Date().toISOString()
    };

    await saveChatMessage(newMessage);

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Chat POST error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
