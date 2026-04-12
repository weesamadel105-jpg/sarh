import { NextRequest, NextResponse } from 'next/server';
import { notificationManager } from '@/lib/notifications';
import { verifyAdminSession } from '@/lib/auth';

/**
 * SSE Route for Admin Notifications
 * Admins subscribe to this endpoint to receive real-time request notifications
 */
export async function GET(req: NextRequest) {
  const session = await verifyAdminSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const listener = (request: any) => {
        const data = JSON.stringify({
          type: 'NEW_REQUEST',
          payload: {
            id: request.id,
            name: request.name,
            service: request.service,
            date: request.date
          }
        });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      // Listen for new requests
      notificationManager.on('newRequest', listener);

      // Handle stream closure
      req.signal.addEventListener('abort', () => {
        notificationManager.off('newRequest', listener);
        controller.close();
      });

      // Keep connection alive with heartbeats
      const heartbeatInterval = setInterval(() => {
        controller.enqueue(encoder.encode(': heartbeat\n\n'));
      }, 30000);

      req.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval);
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
