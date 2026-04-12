import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { verifyAdminSession, verifyStudentSession } from "@/lib/auth";

const CHAT_FILE = path.join(process.cwd(), "uploads", "chat.json");

async function ensureChatFile() {
  try {
    await fs.access(CHAT_FILE);
  } catch {
    await fs.writeFile(CHAT_FILE, JSON.stringify([]));
  }
}

export async function GET(req: NextRequest) {
  try {
    const adminSession = await verifyAdminSession();
    const studentSession = await verifyStudentSession();

    if (!adminSession && !studentSession) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await ensureChatFile();
    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get("requestId");

    const data = await fs.readFile(CHAT_FILE, "utf-8");
    let messages = JSON.parse(data);

    if (requestId) {
      messages = messages.filter((m: any) => m.requestId === requestId);
    }

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

    await ensureChatFile();
    const body = await req.json();
    const { requestId, sender, text } = body;

    if (!requestId || !sender || !text) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const data = await fs.readFile(CHAT_FILE, "utf-8");
    const messages = JSON.parse(data);

    const newMessage = {
      requestId,
      sender, // "student" | "admin"
      text,
      timestamp: Date.now(),
      status: "sent",
    };

    messages.push(newMessage);
    await fs.writeFile(CHAT_FILE, JSON.stringify(messages, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Chat POST error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
