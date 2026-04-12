import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { getUsers } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const users = await getUsers();
    // In our simplified schema, all non-admin users can be treated as students
    const students = users.filter((u: any) => u.role !== "admin");
    
    return NextResponse.json({ success: true, students });
  } catch (error) {
    console.error("Fetch students error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
