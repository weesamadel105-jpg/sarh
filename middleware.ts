import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_ROUTE = "/sarh-core-ops-927";
const AUTH_SECRET = process.env.AUTH_SECRET || "sarh-super-secret-key-12345";

// Edge-compatible HMAC verification using Web Crypto API
async function verifyToken(token: string | undefined): Promise<any | null> {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const sessionStr = Buffer.from(parts[0], "base64").toString("utf8");
    const signature = parts[1];

    const encoder = new TextEncoder();
    const keyData = encoder.encode(AUTH_SECRET);
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Convert hex signature to Uint8Array
    const sigArray = new Uint8Array(
      signature.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigArray,
      encoder.encode(sessionStr)
    );

    if (!isValid) return null;

    const sessionData = JSON.parse(sessionStr);
    if (new Date(sessionData.expires) < new Date()) return null;

    return sessionData;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Get tokens from cookies
  const adminToken = request.cookies.get("sarh_admin_session")?.value;
  const studentToken = request.cookies.get("sarh_session")?.value;

  // 2. Handle legacy /admin redirect
  if (pathname === "/admin") {
    return NextResponse.redirect(new URL(ADMIN_ROUTE, request.url));
  }

  // 3. Admin Route Protection
  const isAdminRoute = pathname.startsWith(ADMIN_ROUTE);
  if (isAdminRoute) {
    const session = await verifyToken(adminToken);
    if (!session || session.role !== "admin") {
      if (pathname !== ADMIN_ROUTE) {
        return NextResponse.redirect(new URL(ADMIN_ROUTE, request.url));
      }
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  // 4. Student Route Protection
  const isStudentRoute = pathname.startsWith("/student");
  if (isStudentRoute) {
    const session = await verifyToken(studentToken);
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      const response = NextResponse.redirect(loginUrl);
      if (studentToken) response.cookies.delete("sarh_session");
      return response;
    }
    return NextResponse.next();
  }

  // 5. Redirect logged-in students away from student login pages
  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage) {
    const session = await verifyToken(studentToken);
    if (session) {
      return NextResponse.redirect(new URL("/student", request.url));
    }
    // If token exists but is invalid, clear it
    if (studentToken) {
      const response = NextResponse.next();
      response.cookies.delete("sarh_session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next (internal files)
     * - static (public files like images)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next|static|favicon.ico).*)",
  ],
};
