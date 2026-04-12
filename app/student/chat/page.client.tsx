"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  ArrowRight,
  User,
  Bot,
  MoreVertical,
  Search,
  MessageSquare,
  Clock,
  Check
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { useAuth } from "@/app/lib/auth/AuthContext";
import { useSearchParams } from "next/navigation";

interface Message {
  id?: string;
  requestId: string;
  sender: "student" | "admin";
  message: string;
  createdAt: string;
}

export default function StudentChatPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const searchParams = useSearchParams();
  const requestIdFromUrl = searchParams?.get("requestId");
  
  const [currentSelectedRequest, setCurrentSelectedRequest] = useState<{ id: string } | null>(
    requestIdFromUrl && requestIdFromUrl !== "general" ? { id: requestIdFromUrl } : null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showSentIndicator, setShowSentIndicator] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Auto-load latest request if missing or invalid
  useEffect(() => {
    const fetchLatestRequest = async () => {
      if (!user) return;
      if (!currentSelectedRequest?.id || currentSelectedRequest.id === "general") {
        try {
          const res = await fetch('/api/student/orders');
          const data = await res.json();
          if (data.success && data.orders && data.orders.length > 0) {
            const latestId = data.orders[0].id;
            setCurrentSelectedRequest({ id: latestId });
            // Update URL search params without page reload
            const newUrl = `${window.location.pathname}?requestId=${latestId}`;
            window.history.replaceState({ path: newUrl }, '', newUrl);
          }
        } catch (error) {
          console.error("Failed to fetch latest request:", error);
        }
      }
    };

    if (!isAuthLoading && user) {
      fetchLatestRequest();
    }
  }, [user, isAuthLoading, currentSelectedRequest]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isAuthLoading && user && currentSelectedRequest?.id && currentSelectedRequest.id !== "general") {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000); // Poll for new messages
      return () => clearInterval(interval);
    }
  }, [user, isAuthLoading, currentSelectedRequest]);

  const fetchMessages = async () => {
    if (!user || !currentSelectedRequest?.id || currentSelectedRequest.id === "general") return;
    try {
      const url = `/api/chat?requestId=${currentSelectedRequest.id}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Fetch messages failed:", error);
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const inputMessage = newMessage.trim();
    if (!inputMessage || !user || isSending) return;

    // Must use a real requestId, never "general" or empty
    if (!currentSelectedRequest?.id || currentSelectedRequest.id === "general") {
      alert("يرجى اختيار طلب نشط لبدء المحادثة");
      return;
    }

    setIsSending(true);
    const messagePayload = {
      requestId: currentSelectedRequest.id,
      sender: "student",
      message: inputMessage,
    };

    try {
      console.log("[Chat] Sending message:", messagePayload);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messagePayload),
      });

      const data = await res.json();
      console.log("[Chat] Server response:", data);

      if (data.success) {
        // 1) Append message instantly to local thread
        const confirmedMsg = data.message || { ...messagePayload, createdAt: new Date().toISOString() };
        setMessages(prev => [...prev, confirmedMsg]);
        
        // 2) Clear input
        setNewMessage("");
        setShowSentIndicator(true);
        setTimeout(() => setShowSentIndicator(false), 2000);

        // 3) Refresh thread
        fetchMessages();
      } else {
        throw new Error(data.error || "Failed to send");
      }
    } catch (error) {
      console.error("[Chat] Send message failed:", error);
      alert("فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSending(false);
    }
  };

  if (isAuthLoading || isPageLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col" dir="rtl">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <ArrowRight className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg">الدعم الفني المباشر</h1>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs text-slate-400">متاح الآن للمساعدة</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <div className="text-center py-8">
          <div className="bg-slate-900 inline-block px-4 py-2 rounded-full text-xs text-slate-500 border border-slate-800">
            بدأت المحادثة مع الدعم الفني
          </div>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id || (msg.createdAt + msg.message)}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.sender === "student" ? "justify-start" : "justify-end"}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl shadow-lg ${
                msg.sender === "student" 
                  ? "bg-cyan-600 text-white rounded-br-none" 
                  : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700"
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                <div className={`text-[10px] mt-2 flex items-center gap-1 ${
                  msg.sender === "student" ? "text-cyan-200" : "text-slate-500"
                }`}>
                  <Clock className="h-3 w-3" />
                  {new Date(msg.createdAt).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                  {msg.sender === "student" && <Check className="h-3 w-3 ml-1" />}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-slate-950 border-t border-slate-800 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3">
          <button type="button" className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
            <Paperclip className="h-5 w-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
            <AnimatePresence>
              {showSentIndicator && (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 flex items-center gap-1 text-xs font-bold"
                >
                  <Check className="h-4 w-4" />
                  تم الإرسال
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="p-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20"
          >
            <Send className="h-5 w-5 rotate-180" />
          </button>
        </form>
      </footer>
    </div>
  );
}
