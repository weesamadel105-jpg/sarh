import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminSession } from '@/lib/auth';

const uploadsDir = path.join(process.cwd(), 'uploads');
const requestsFile = path.join(uploadsDir, 'requests.json');

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, requestId, status, note } = await req.json();

    if (!fs.existsSync(requestsFile)) {
      return NextResponse.json({ error: 'Requests file not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(requestsFile, 'utf8');
    let requests = JSON.parse(fileContent);

    if (action === 'update_status') {
      requests = requests.map((r: any) => 
        r.id === requestId ? { ...r, status, updatedAt: new Date().toISOString() } : r
      );
    } else if (action === 'add_note') {
      requests = requests.map((r: any) => 
        r.id === requestId ? { ...r, adminNote: note, updatedAt: new Date().toISOString() } : r
      );
    } else if (action === 'delete') {
      // Find the request to delete its files
      const requestToDelete = requests.find((r: any) => r.id === requestId);
      if (requestToDelete && requestToDelete.files) {
        requestToDelete.files.forEach((file: any) => {
          const filePath = path.join(uploadsDir, file.savedName);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
      requests = requests.filter((r: any) => r.id !== requestId);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    fs.writeFileSync(requestsFile, JSON.stringify(requests, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in admin actions API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
