import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyStudentSession } from '@/lib/auth';
import { saveRequest, RequestRecord } from '@/lib/db';

/**
 * API Submission Route - Handles student requests with multiple files
 * Saves requests via db layer (Supabase in Vercel, requests.json locally)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await verifyStudentSession();
    const formData = await req.formData();
    
    // Define and create uploads directory if not exists
    const uploadsDir = path.join(process.cwd(), 'uploads');
    // Note: fs operations will still fail in Vercel but we try/catch them
    // and they only affect the local disk which is read-only.
    const IS_VERCEL = process.env.VERCEL === "1" || !!process.env.VERCEL_URL;

    const data: Record<string, any> = {};
    const filesInfo: any[] = [];

    // 1. Backend Validation & Processing
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString() || session?.email || "";
    const service = formData.get('service')?.toString();
    const contact = formData.get('contactNumber')?.toString() || formData.get('contact')?.toString();
    
    if (!name || !service || !contact) {
      return NextResponse.json({ 
        error: 'بيانات غير مكتملة: الاسم، الخدمة، ورقم التواصل مطلوبة.' 
      }, { status: 400 });
    }

    // Generate Request ID early for file paths
    const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // 2. Process all formData fields and files
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (value.size === 0) continue;

        try {
          const bytes = await value.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const originalExt = path.extname(value.name) || '.bin';
          const sanitizedOriginalName = value.name.replace(/[^a-zA-Z0-9.]/g, '_');
          const fileName = `${sanitizedOriginalName.replace(originalExt, '')}-${uniqueSuffix}${originalExt}`;
          
          // Only attempt disk write if NOT on Vercel
          if (!IS_VERCEL) {
            if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
            const filePath = path.join(uploadsDir, fileName);
            fs.writeFileSync(filePath, buffer);
          }
          
          filesInfo.push({
            originalName: value.name,
            savedName: fileName,
            path: `/api/download?type=uploads&requestId=${requestId}&fileName=${fileName}`,
            size: value.size,
            type: value.type || 'application/octet-stream',
            uploadedAt: new Date().toISOString()
          });
        } catch (fileErr) {
          console.error(`Error processing file ${value.name}:`, fileErr);
        }
      } else {
        data[key] = value;
      }
    }

    // 3. Persistent Storage via DB Layer (Supabase in Vercel, local JSON elsewhere)
    const newRequest: RequestRecord = { 
      id: requestId,
      ...data,
      name,
      email,
      studentId: session?.id || "guest",
      service,
      contactNumber: contact,
      files: filesInfo, 
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    await saveRequest(newRequest);

    // 4. Trigger Instant Admin Notification
    try {
      const { notificationManager } = require('@/lib/notifications');
      notificationManager.notifyNewRequest(newRequest);
    } catch (notifyErr) {
      console.error("Non-critical: Notification failed to trigger.", notifyErr);
    }

    // 5. Return success
    return NextResponse.json({ 
      success: true, 
      message: 'تم استلام طلبك بنجاح وسيتم التواصل معك قريباً.',
      requestId: newRequest.id
    }, { status: 200 });

  } catch (error: any) {
    console.error('CRITICAL: Error in submitRequest pipeline:', error);
    return NextResponse.json({ 
      error: 'حدث خطأ فني في السيرفر أثناء إرسال الطلب. يرجى المحاولة لاحقاً.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
