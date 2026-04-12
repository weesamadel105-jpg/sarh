import { createClient } from "@supabase/supabase-js";

// Use NEXT_PUBLIC_ for browser-side accessibility in Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debugging (Remove in production)
if (typeof window !== 'undefined') {
  console.log("[Supabase Debug] URL:", supabaseUrl);
  console.log("[Supabase Debug] Key exists:", !!supabaseAnonKey);
}

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.error("CRITICAL: Supabase credentials missing in browser! Ensure NEXT_PUBLIC_ prefix is used in .env");
  } else {
    console.warn("Supabase credentials missing in server environment.");
  }
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co", // Avoid empty string to prevent fetch to current domain (HTML response)
  supabaseAnonKey || "placeholder-key"
);

// TypeScript Types for the requested tables
export interface SupabaseUser {
  id?: string;
  email: string;
  password?: string; // Updated from password_hash to password as per request
  created_at?: string;
}

export interface SupabaseRequest {
  id?: string;
  name: string;
  contact: string;
  serviceType: string; // Updated from service_type to serviceType as per request
  note: string;
  created_at?: string;
}
