import { cookies } from "next/headers";
import crypto from "crypto";

const AUTH_SECRET = process.env.AUTH_SECRET || "sarh-super-secret-key-12345";

export async function verifyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sarh_admin_session")?.value;

  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const sessionStr = Buffer.from(parts[0], "base64").toString("utf8");
    const signature = parts[1];

    const expectedSignature = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(sessionStr)
      .digest("hex");

    if (signature !== expectedSignature) return null;

    const sessionData = JSON.parse(sessionStr);
    
    // Check expiration
    if (new Date(sessionData.expires) < new Date()) return null;

    if (sessionData.role !== "admin") return null;

    return sessionData;
  } catch (error) {
    return null;
  }
}

export async function verifyStudentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sarh_session")?.value;

  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const sessionStr = Buffer.from(parts[0], "base64").toString("utf8");
    const signature = parts[1];

    const expectedSignature = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(sessionStr)
      .digest("hex");

    if (signature !== expectedSignature) return null;

    const sessionData = JSON.parse(sessionStr);
    
    // Check expiration
    if (new Date(sessionData.expires) < new Date()) return null;

    return sessionData;
  } catch (error) {
    return null;
  }
}
