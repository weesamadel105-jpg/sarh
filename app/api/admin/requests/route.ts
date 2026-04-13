import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminSession } from '@/lib/auth';
import { getRequests } from '@/lib/db';

/**
 * Fetch all student requests from DB layer (Supabase or JSON)
 */
export async function GET() {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const requests = await getRequests();
    const IS_VERCEL = process.env.VERCEL === "1" || !!process.env.VERCEL_URL;
    
    // Add file existence validation for each request (only meaningful in non-Vercel)
    const validatedRequests = requests.map((req: any) => {
      if (req.files && Array.isArray(req.files)) {
        req.files = req.files.map((file: any) => {
          let exists = false;
          if (!IS_VERCEL) {
            const filePath = path.join(process.cwd(), 'uploads', file.savedName);
            exists = fs.existsSync(filePath);
          } else {
            // In Vercel, we assume the record exists even if disk doesn't have the file
            // (Files should ideally be in S3/Supabase Storage, but for now we just show the record)
            exists = true; 
          }
          
          let sanitizedPath = file.path;
          if (!sanitizedPath || !sanitizedPath.startsWith('/api/download')) {
            sanitizedPath = `/api/download?type=uploads&requestId=${req.id}&fileName=${file.savedName}`;
          }

          return {
            ...file,
            path: sanitizedPath,
            exists: exists
          };
        });
      }
      return req;
    });

    return NextResponse.json({ requests: validatedRequests });
  } catch (error: any) {
    console.error('[Admin Requests GET Error] Stack Trace:', error.stack);
    return NextResponse.json({ error: 'حدث خطأ فني في جلب الطلبات', details: error.message }, { status: 500 });
  }
}
