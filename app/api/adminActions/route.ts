import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminSession } from '@/lib/auth';
import { getRequests, saveRequest, RequestRecord, supabase } from '@/lib/db';

const uploadsDir = path.join(process.cwd(), 'uploads');

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, requestId, status, note } = await req.json();
    const IS_VERCEL = process.env.VERCEL === "1" || !!process.env.VERCEL_URL;
    const USE_SUPABASE = !!(supabase && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder"));

    if (USE_SUPABASE) {
      if (action === 'update_status') {
        const { error } = await supabase
          .from("requests")
          .update({ status, updated_at: new Date().toISOString() })
          .eq("id", requestId);
        if (error) throw error;
      } else if (action === 'delete') {
        const { error } = await supabase
          .from("requests")
          .delete()
          .eq("id", requestId);
        if (error) throw error;
      }
      return NextResponse.json({ success: true });
    }

    // Local JSON fallback
    const requestsFile = path.join(uploadsDir, 'requests.json');
    if (!fs.existsSync(requestsFile)) {
      return NextResponse.json({ error: 'Requests file not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(requestsFile, 'utf8');
    let requests = JSON.parse(fileContent);

    if (action === 'update_status') {
      requests = requests.map((r: any) => 
        r.id === requestId ? { ...r, status, updatedAt: new Date().toISOString() } : r
      );
    } else if (action === 'delete') {
      const requestToDelete = requests.find((r: any) => r.id === requestId);
      if (requestToDelete && requestToDelete.files) {
        requestToDelete.files.forEach((file: any) => {
          const filePath = path.join(uploadsDir, file.savedName);
          if (fs.existsSync(filePath)) {
            try { fs.unlinkSync(filePath); } catch (e) {}
          }
        });
      }
      requests = requests.filter((r: any) => r.id !== requestId);
    }

    fs.writeFileSync(requestsFile, JSON.stringify(requests, null, 2));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Admin Actions POST Error] Stack Trace:', error.stack);
    return NextResponse.json({ 
      error: 'حدث خطأ فني في تنفيذ الإجراء', 
      details: error.message 
    }, { status: 500 });
  }
}
