import { NextResponse } from 'next/server';
import { getRequests } from '@/lib/db';

export async function GET() {
  try {
    const requests = await getRequests();
    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error('Error reading requests:', error);
    return NextResponse.json({ error: 'Failed to read requests' }, { status: 500 });
  }
}
