import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyStudentSession } from '@/lib/auth';

/**
 * Fetch orders for the logged-in student from requests.json
 */
export async function GET() {
  const session = await verifyStudentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const requestsFile = path.join(process.cwd(), 'uploads', 'requests.json');
    
    if (!fs.existsSync(requestsFile)) {
      return NextResponse.json({ orders: [] });
    }

    const fileContent = fs.readFileSync(requestsFile, 'utf8');
    const requests = JSON.parse(fileContent);
    
    // Filter requests for this student by email or ID
    const studentOrders = requests
      .filter((req: any) => 
        req.email?.toLowerCase() === session.email?.toLowerCase() || 
        req.studentId === session.id
      )
      .map((req: any) => ({
        id: req.id,
        request_id: req.id,
        title: req.service || "طلب جديد",
        status: req.status || "pending",
        deadline: req.deadline || "",
        progress: req.status === "completed" ? 100 : (req.status === "in-progress" ? 50 : 0),
        date: req.date,
        delivered_attachments: req.deliveredFiles || [],
        completion_note: req.completionNote || ""
      }));

    // Sort by date (newest first)
    studentOrders.sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({ orders: studentOrders });
  } catch (error) {
    console.error('Error fetching student orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
