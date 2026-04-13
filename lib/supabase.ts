import { createClient } from "@supabase/supabase-js";

// Use NEXT_PUBLIC_ for browser-side accessibility in Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured = !!(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("placeholder"));

if (!isConfigured) {
  const envType = typeof window !== 'undefined' ? 'browser' : 'server';
  console.warn(`[Supabase Warning] Credentials missing or placeholder in ${envType}. Fallback to local storage may be active.`);
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
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
