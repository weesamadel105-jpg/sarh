import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminSession, verifyStudentSession } from '@/lib/auth';

/**
 * Download API - Handles file downloads for students and admins
 * Supported types: uploads (original student files) or delivered (admin final files)
 */
export async function GET(req: NextRequest) {
  const adminSession = await verifyAdminSession();
  const studentSession = await verifyStudentSession();
  
  if (!adminSession && !studentSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    const requestId = url.searchParams.get('requestId');
    const fileName = url.searchParams.get('fileName');

    if (!requestId || !fileName || !type) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    let filePath = '';
    
    if (type === 'uploads') {
      filePath = path.join(process.cwd(), 'uploads', fileName);
    } else if (type === 'delivered') {
      filePath = path.join(process.cwd(), 'uploads', 'delivered', requestId, fileName);
    } else {
      return NextResponse.json({ error: 'Invalid download type' }, { status: 400 });
    }

    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return NextResponse.json({ error: 'File not found on server' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    
    // Improved original name extraction: use the prefix before the timestamp/random suffix
    // Format was: ${sanitizedOriginalName.replace(originalExt, '')}-${uniqueSuffix}${originalExt}
    let originalFileName = fileName;
    const parts = fileName.split('-');
    if (parts.length > 2) {
      // Reconstruct original name from parts before the last two (timestamp and random)
      const ext = path.extname(fileName);
      originalFileName = parts.slice(0, parts.length - 2).join('-') + ext;
    }

    // Determine MIME type based on extension if not provided
    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.doc': 'application/msword',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
      '.7z': 'application/x-7z-compressed',
      '.txt': 'text/plain',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        // Force download with Content-Disposition: attachment
        'Content-Disposition': `attachment; filename="${encodeURIComponent(originalFileName)}"; filename*=UTF-8''${encodeURIComponent(originalFileName)}`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Error in download API:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}
