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
  Check,
  ChevronRight,
  Image as ImageIcon,
  Smile,
  FileText
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { useAuth } from "@/app/lib/auth/AuthContext";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

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
  
  const [currentSelectedRequest, setCurrentSelectedRequest] = useState<{ id: string; title?: string } | null>(
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
          if (data.orders && data.orders.length > 0) {
            const latest = data.orders[0];
            setCurrentSelectedRequest({ id: latest.id, title: latest.title });
            // Update URL search params without page reload
            const newUrl = `${window.location.pathname}?requestId=${latest.id}`;
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

  // Realtime subscription
  useEffect(() => {
    if (!currentSelectedRequest?.id || currentSelectedRequest.id === "general") return;

    // Initial fetch
    fetchMessages();

    const channel = supabase
      .channel(`chat:${currentSelectedRequest.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `requestId=eq.${currentSelectedRequest.id}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentSelectedRequest?.id]);

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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messagePayload),
      });

      const data = await res.json();
      if (data.success) {
        // 1) Append message instantly to local thread
        const confirmedMsg = data.message || { ...messagePayload, createdAt: new Date().toISOString() };
        setMessages(prev => {
          if (prev.some(m => m.id === confirmedMsg.id)) return prev;
          return [...prev, confirmedMsg];
        });
        
        // 2) Clear input
        setNewMessage("");
        setShowSentIndicator(true);
        setTimeout(() => setShowSentIndicator(false), 2000);
      }
    } catch (error) {
      console.error("[Chat] Send message failed:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (isAuthLoading || isPageLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-primary-dark text-white flex flex-col font-sans" dir="rtl">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-gold/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] w-[30%] h-[30%] bg-primary-light/20 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="glass-card border-b border-white/10 p-4 sm:p-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/student')} 
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-secondary hover:text-gold hover:bg-white/10 transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="h-10 w-px bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center text-primary-dark shadow-lg shadow-gold/20">
              <Bot className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-black text-lg leading-tight">الدعم الفني المباشر</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">متواجدون الآن لمساعدتك</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {currentSelectedRequest && (
            <div className="hidden md:flex flex-col items-end">
              <p className="text-[10px] text-text-secondary font-bold uppercase">الطلب الحالي</p>
              <p className="text-sm font-bold text-gold">#{currentSelectedRequest.id.slice(0, 8)}</p>
            </div>
          )}
          <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-secondary hover:text-gold hover:bg-white/10 transition-all">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 max-w-5xl mx-auto w-full relative z-10 scroll-smooth">
        <div className="text-center py-4">
          <p className="inline-block px-4 py-1.5 bg-white/5 rounded-full text-[10px] text-text-secondary font-bold uppercase tracking-widest border border-white/5 shadow-sm">
            تشفير تام للخصوصية بضمان منصة صرح
          </p>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isStudent = msg.sender === "student";
            return (
              <motion.div
                key={msg.id || i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${isStudent ? "justify-start" : "justify-end"}`}
              >
                <div className={`relative max-w-[85%] sm:max-w-[70%] group`}>
                  <div className={`p-4 sm:p-5 rounded-[2rem] shadow-xl ${
                    isStudent 
                      ? "bg-primary text-white rounded-br-none border border-white/10" 
                      : "glass-card-light text-slate-800 rounded-bl-none border border-white/20"
                  }`}>
                    <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    <div className={`text-[10px] mt-2 flex items-center gap-1.5 font-bold ${
                      isStudent ? "text-blue-100/70" : "text-slate-400"
                    }`}>
                      <Clock className="h-3 w-3" />
                      {new Date(msg.createdAt).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                      {isStudent && <Check className="h-3 w-3 ml-1 text-gold" />}
                    </div>
                  </div>
                  {/* Bubble Tail */}
                  <div className={`absolute bottom-0 ${isStudent ? "right-[-8px] text-primary" : "left-[-8px] text-white/95"}`}>
                    {/* Simplified tail representation */}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </main>

      {/* Footer / Input Area */}
      <footer className="p-4 sm:p-8 glass-card border-t border-white/10 sticky bottom-0 z-50">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3 sm:gap-4">
            <div className="flex gap-2">
              <button 
                type="button" 
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-text-secondary hover:text-gold hover:bg-white/10 transition-all flex items-center justify-center group"
              >
                <Paperclip className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 px-6 text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-gold/30 focus:bg-white/10 transition-all"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button type="button" className="text-text-secondary hover:text-gold transition-colors">
                  <Smile className="h-5 w-5" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="w-14 h-14 rounded-2xl gold-gradient text-primary-dark flex items-center justify-center shadow-xl shadow-gold/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all group"
            >
              <Send className="h-6 w-6 rotate-180 group-hover:translate-x-[-2px] transition-transform" />
            </button>
          </form>
          
          <div className="mt-4 flex items-center justify-center gap-6">
             <p className="text-[10px] text-text-secondary font-bold uppercase flex items-center gap-1.5">
               <FileText className="h-3 w-3" /> حل الاسايمنت
             </p>
             <p className="text-[10px] text-text-secondary font-bold uppercase flex items-center gap-1.5">
               <FileText className="h-3 w-3" /> حل الامتحانات
             </p>
             <p className="text-[10px] text-text-secondary font-bold uppercase flex items-center gap-1.5">
               <FileText className="h-3 w-3" /> تنفيذ البروجكت
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
