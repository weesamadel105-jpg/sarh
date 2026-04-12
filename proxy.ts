import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";

const ADMIN_ROUTE = "/sarh-core-ops-927";
const AUTH_SECRET = process.env.AUTH_SECRET || "sarh-super-secret-key-12345";

export function proxy(request: NextRequest) {
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
    if (!adminToken) {
      // Allow only the login page (ADMIN_ROUTE itself) to load without a token
      if (pathname !== ADMIN_ROUTE) {
        return NextResponse.redirect(new URL(ADMIN_ROUTE, request.url));
      }
      return NextResponse.next();
    } else {
      try {
        const parts = adminToken.split(".");
        if (parts.length !== 2) throw new Error("Invalid token");

        const sessionStr = Buffer.from(parts[0], "base64").toString("utf8");
        const signature = parts[1];

        const expectedSignature = crypto
          .createHmac("sha256", AUTH_SECRET)
          .update(sessionStr)
          .digest("hex");

        if (signature !== expectedSignature) throw new Error("Invalid signature");

        const sessionData = JSON.parse(sessionStr);
        if (new Date(sessionData.expires) < new Date()) throw new Error("Token expired");
        if (sessionData.role !== "admin") throw new Error("Not an admin");

        return NextResponse.next();
      } catch (error) {
        if (pathname !== ADMIN_ROUTE) {
          return NextResponse.redirect(new URL(ADMIN_ROUTE, request.url));
        }
      }
    }
  }

  // 4. Student Route Protection
  const isStudentRoute = pathname.startsWith("/student");
  if (isStudentRoute) {
    if (!studentToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    try {
      const parts = studentToken.split(".");
      if (parts.length !== 2) throw new Error("Invalid token");

      const sessionStr = Buffer.from(parts[0], "base64").toString("utf8");
      const signature = parts[1];

      const expectedSignature = crypto
        .createHmac("sha256", AUTH_SECRET)
        .update(sessionStr)
        .digest("hex");

      if (signature !== expectedSignature) throw new Error("Invalid signature");

      const sessionData = JSON.parse(sessionStr);
      if (new Date(sessionData.expires) < new Date()) throw new Error("Token expired");

      return NextResponse.next();
    } catch (e) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 5. Redirect logged-in students away from student login pages
  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage && studentToken) {
    return NextResponse.redirect(new URL("/student", request.url));
  }

  return NextResponse.next();
}

export default proxy;

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
