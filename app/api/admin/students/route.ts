import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "uploads", "users.json");

export async function GET(req: NextRequest) {
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    const users = JSON.parse(data);
    const students = users.filter((u: any) => u.role === "student");
    return NextResponse.json({ success: true, students });
  } catch (error) {
    console.error("Fetch students error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
