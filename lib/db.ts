import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { supabase } from "./supabase";

const USERS_FILE = path.join(process.cwd(), "uploads", "users.json");
const IS_VERCEL = process.env.VERCEL === "1" || !!process.env.VERCEL_URL;

// Determine if we should use Supabase as the SINGLE auth system
const USE_SUPABASE = !!(
  supabase && 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
);

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  name?: string;
  role?: string;
  university?: string;
  phone?: string;
  password?: string;
}

export async function getUsers(): Promise<UserRecord[]> {
  if (USE_SUPABASE) {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.error("[Supabase Error] getUsers:", error.message);
        return [];
      }
      return (data || []).map(u => ({
        id: u.id,
        email: u.email,
        passwordHash: u.password,
        createdAt: u.created_at,
        name: u.name,
        role: u.role || "student"
      }));
    } catch (err) {
      console.error("[Auth Error] Supabase fetch failed:", err);
      return [];
    }
  }

  // Fallback to local JSON ONLY if Supabase is NOT configured
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    if (!data || data.trim() === "") return [];
    const users = JSON.parse(data);
    return Array.isArray(users) ? users : [];
  } catch (error: any) {
    return [];
  }
}

export async function saveUsers(users: UserRecord[]): Promise<void> {
  // If using Supabase, we don't save to JSON.
  // Actually, individual user creation is handled by createUser.
  if (USE_SUPABASE || IS_VERCEL) return;

  try {
    const dir = path.dirname(USERS_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error: any) {
    console.error("[DB Error] Saving users failed:", error.message);
    throw error;
  }
}

export async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  if (!email) return undefined;
  
  if (USE_SUPABASE) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email.toLowerCase())
        .single();
      
      if (!error && data) {
        return {
          id: data.id,
          email: data.email,
          passwordHash: data.password,
          createdAt: data.created_at,
          name: data.name,
          role: data.role || "student"
        };
      }
      if (error && error.code !== "PGRST116") {
        console.error("[Supabase Error] findUserByEmail:", error.message);
      }
      return undefined;
    } catch (err) {
      console.error("[Auth Error] Supabase findUserByEmail failed:", err);
      return undefined;
    }
  }

  // Local JSON only if Supabase not used
  const users = await getUsers();
  return users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
}

export async function createUser(email: string, passwordPlain: string, name?: string): Promise<UserRecord> {
  const passwordHash = await bcrypt.hash(passwordPlain, 10);
  const createdAt = new Date().toISOString();

  if (USE_SUPABASE) {
    try {
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            email: email.toLowerCase(),
            password: passwordHash,
            created_at: createdAt,
            name: name || email.split("@")[0],
            role: "student"
          }
        ])
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          email: data.email,
          passwordHash: data.password,
          createdAt: data.created_at,
          name: data.name,
          role: data.role || "student"
        };
      }
      if (error) {
        console.error("[Supabase Signup Error]", error.message);
        throw new Error(error.message);
      }
    } catch (err: any) {
      console.error("[Auth Error] Supabase createUser failed:", err);
      throw err;
    }
  }

  // Local JSON only if Supabase not used
  const users = await getUsers();
  const newUser: UserRecord = {
    id: Math.random().toString(36).substring(2, 15),
    email: email.toLowerCase(),
    passwordHash,
    createdAt,
    name: name || email.split("@")[0],
    role: "student"
  };

  users.push(newUser);
  await saveUsers(users);
  return newUser;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    return false;
  }
}

// --- Request (Orders) Logic ---

export interface RequestRecord {
  id: string;
  name: string;
  email: string;
  studentId: string;
  service: string;
  contactNumber: string;
  files: any[];
  date: string;
  status: string;
  note?: string;
  [key: string]: any;
}

const REQUESTS_FILE = path.join(process.cwd(), "uploads", "requests.json");

export async function getRequests(): Promise<RequestRecord[]> {
  try {
    if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (!error && data) {
        return data.map(req => ({
          id: req.id,
          name: req.name,
          email: req.email || "",
          studentId: req.student_id || "guest",
          service: req.serviceType || req.service,
          contactNumber: req.contact,
          files: req.files || [],
          date: req.created_at,
          status: req.status || "pending",
          note: req.note
        }));
      }
      if (error) console.error("[Supabase Error] getRequests:", error.message);
    }
  } catch (err) {
    console.error("[Auth Error] Supabase getRequests failed:", err);
  }

  try {
    const data = await fs.readFile(REQUESTS_FILE, "utf-8");
    if (!data || data.trim() === "") return [];
    const requests = JSON.parse(data);
    return Array.isArray(requests) ? requests : [];
  } catch (error: any) {
    return [];
  }
}

export async function saveRequest(request: RequestRecord): Promise<void> {
  try {
    if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      const { error } = await supabase
        .from("requests")
        .insert([
          {
            name: request.name,
            contact: request.contactNumber,
            serviceType: request.service,
            note: request.note || "",
            email: request.email,
            student_id: request.studentId === "guest" ? null : request.studentId,
            files: request.files,
            created_at: request.date,
            status: request.status
          }
        ]);

      if (!error) return;
      console.error("[Supabase Request Error]", error.message);
    }
  } catch (err) {
    console.error("[Auth Error] Supabase saveRequest failed:", err);
  }

  const requests = await getRequests();
  requests.push(request);
  
  try {
    const dir = path.dirname(REQUESTS_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(REQUESTS_FILE, JSON.stringify(requests, null, 2));
  } catch (error: any) {
    throw error;
  }
}

// --- Chat Logic ---

export interface ChatMessage {
  id?: string;
  requestId: string;
  sender: "student" | "admin";
  message: string;
  createdAt: string;
}

export async function getChatMessages(requestId: string): Promise<ChatMessage[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("requestId", requestId)
      .order("createdAt", { ascending: true });
    
    if (!error && data) {
      return data.map(m => ({
        id: m.id,
        requestId: m.requestId,
        sender: m.sender,
        message: m.message,
        createdAt: m.createdAt
      }));
    }
    if (error) console.error("[Supabase Chat Error] getMessages:", error.message);
  }

  // Fallback to local file if needed (though requested to use Supabase)
  const CHAT_FILE = path.join(process.cwd(), "uploads", "chat.json");
  try {
    const data = await fs.readFile(CHAT_FILE, "utf-8");
    const allMessages = JSON.parse(data);
    return allMessages
      .filter((m: any) => m.requestId === requestId)
      .map((m: any) => ({
        requestId: m.requestId,
        sender: m.sender,
        message: m.text || m.message,
        createdAt: new Date(m.timestamp || m.createdAt).toISOString()
      }))
      .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } catch {
    return [];
  }
}

export async function saveChatMessage(msg: ChatMessage): Promise<void> {
  if (supabase) {
    const { error } = await supabase
      .from("chat_messages")
      .insert([
        {
          requestId: msg.requestId,
          sender: msg.sender,
          message: msg.message,
          createdAt: msg.createdAt || new Date().toISOString()
        }
      ]);

    if (!error) return;
    console.error("[Supabase Chat Error] saveMessage:", error.message);
  }

  // Local fallback
  const CHAT_FILE = path.join(process.cwd(), "uploads", "chat.json");
  try {
    const data = await fs.readFile(CHAT_FILE, "utf-8");
    const messages = JSON.parse(data);
    messages.push({
      requestId: msg.requestId,
      sender: msg.sender,
      text: msg.message,
      timestamp: new Date(msg.createdAt).getTime(),
      status: "sent"
    });
    await fs.writeFile(CHAT_FILE, JSON.stringify(messages, null, 2));
  } catch {
    // If file doesn't exist, create it
    await fs.writeFile(CHAT_FILE, JSON.stringify([{
      requestId: msg.requestId,
      sender: msg.sender,
      text: msg.message,
      timestamp: new Date(msg.createdAt).getTime(),
      status: "sent"
    }], null, 2));
  }
}