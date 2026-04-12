import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminSession } from '@/lib/auth';

/**
 * Admin Delivery API - Handles uploading final completed files
 * Updates requests.json and Supabase order if linked
 */
export async function POST(req: NextRequest) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const requestId = formData.get('requestId')?.toString();
    const completionNote = formData.get('completionNote')?.toString() || "";

    if (!requestId) {
      return NextResponse.json({ error: 'Missing requestId' }, { status: 400 });
    }

    // 1. Define delivery directory
    const deliveryDir = path.join(process.cwd(), 'uploads', 'delivered', requestId);
    if (!fs.existsSync(deliveryDir)) {
      fs.mkdirSync(deliveryDir, { recursive: true });
    }

    const deliveredFiles: any[] = [];

    // 2. Process final files
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (value.size === 0) continue;

        try {
          const bytes = await value.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const originalExt = path.extname(value.name) || '.bin';
          const sanitizedName = value.name.replace(/[^a-zA-Z0-9.]/g, '_');
          const fileName = `FINAL-${sanitizedName.replace(originalExt, '')}-${uniqueSuffix}${originalExt}`;
          const filePath = path.join(deliveryDir, fileName);
          
          fs.writeFileSync(filePath, buffer);
          
          deliveredFiles.push({
            originalName: value.name,
            savedName: fileName,
            path: `/api/download?type=delivered&requestId=${requestId}&fileName=${fileName}`, // Public download link
            size: value.size,
            type: value.type,
            deliveredAt: new Date().toISOString()
          });
        } catch (fileErr) {
          console.error(`Error saving delivered file ${value.name}:`, fileErr);
        }
      }
    }

    // 3. Update requests.json
    const requestsFile = path.join(process.cwd(), 'uploads', 'requests.json');
    if (fs.existsSync(requestsFile)) {
      const fileContent = fs.readFileSync(requestsFile, 'utf8');
      const requests = JSON.parse(fileContent);
      
      const requestIndex = requests.findIndex((r: any) => r.id === requestId);
      if (requestIndex !== -1) {
        requests[requestIndex].status = 'completed';
        requests[requestIndex].completedAt = new Date().toISOString();
        requests[requestIndex].completionNote = completionNote;
        requests[requestIndex].deliveredFiles = deliveredFiles;
        
        fs.writeFileSync(requestsFile, JSON.stringify(requests, null, 2), 'utf8');
      }
    }

    // 4. Update Supabase (Student Dashboard History)
    try {
      const { supabase } = await import("@/lib/supabase");
      if (supabase) {
        await supabase
          .from("orders")
          .update({ 
            status: "completed",
            progress: 100,
            completion_note: completionNote,
            delivered_attachments: deliveredFiles,
            completed_at: new Date().toISOString()
          })
          .eq("request_id", requestId);
      }
    } catch (supabaseErr) {
      console.error("Non-critical: Supabase update failed during delivery.", supabaseErr);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'تم تسليم الطلب بنجاح وتحديث الحالة.',
      deliveredFiles
    }, { status: 200 });

  } catch (error) {
    console.error('CRITICAL: Error in delivery pipeline:', error);
    return NextResponse.json({ error: 'Internal server error during delivery' }, { status: 500 });
  }
}
