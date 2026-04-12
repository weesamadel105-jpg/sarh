"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  ArrowRight,
  User,
  MessageCircle,
  Clock,
  Check,
  Search,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/app/lib/auth/AuthContext";

interface Message {
  requestId: string;
  sender: "student" | "admin";
  text: string;
  timestamp: number;
  status: "sent";
}

export default function AdminChatClient() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const searchParams = useSearchParams();
  const requestId = searchParams?.get("requestId");
  const studentIdFromUrl = searchParams?.get("studentId");
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = useCallback(async () => {
    if (!requestId) return;
    try {
      const res = await fetch(`/api/chat?requestId=${requestId}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Fetch messages failed:", error);
    } finally {
      setIsPageLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    if (!isAuthLoading && user && user.role === "admin" && requestId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 4000);
      return () => clearInterval(interval);
    }
  }, [user, isAuthLoading, requestId, fetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !requestId || isSending) return;

    setIsSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          sender: "admin",
          text: newMessage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Send message failed:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (isAuthLoading || (requestId && isPageLoading)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    router.push("/sarh-core-ops-927");
    return null;
  }

  if (!requestId) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4" dir="rtl">
        <MessageCircle className="h-16 w-16 text-slate-700 mb-4" />
        <h1 className="text-xl font-bold mb-2">لم يتم تحديد طلب</h1>
        <p className="text-slate-400 mb-6 text-center">يرجى الانتقال إلى إدارة الطلبات واختيار "مراسلة الطالب" لفتح المحادثة.</p>
        <button 
          onClick={() => router.push("/sarh-core-ops-927")}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-all font-bold"
        >
          العودة لإدارة الطلبات
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col" dir="rtl">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/sarh-core-ops-927")} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <ArrowRight className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-cyan-500 border border-slate-700">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg">محادثة الطالب | طلب #{requestId}</h1>
              <span className="text-xs text-slate-400">رد على استفسارات الطالب مباشرة</span>
            </div>
          </div>
        </div>
        <button onClick={fetchMessages} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
          <RefreshCw className="h-5 w-5" />
        </button>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50 py-20">
            <MessageCircle className="h-16 w-16 mb-4" />
            <p>لا توجد رسائل في هذا الطلب بعد</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.timestamp + msg.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === "admin" ? "justify-start" : "justify-end"}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl shadow-lg ${
                  msg.sender === "admin" 
                    ? "bg-cyan-600 text-white rounded-br-none" 
                    : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700"
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <div className={`text-[10px] mt-2 flex items-center gap-1 ${
                    msg.sender === "admin" ? "text-cyan-200" : "text-slate-500"
                  }`}>
                    <Clock className="h-3 w-3" />
                    {new Date(msg.timestamp).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                    {msg.sender === "admin" && <Check className="h-3 w-3 ml-1" />}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-slate-950 border-t border-slate-800 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="اكتب ردك هنا..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="p-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-500 disabled:opacity-50 transition-all"
          >
            <Send className="h-5 w-5 rotate-180" />
          </button>
        </form>
      </footer>
    </div>
  );
}
