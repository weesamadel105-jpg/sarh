"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, Clock, Check, User, Paperclip, Image as ImageIcon, Smile, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/lib/auth/AuthContext";
import { supabase } from "@/lib/supabase";

interface Message {
  id?: string;
  requestId: string;
  sender: "student" | "admin";
  message: string;
  createdAt: string;
}

export default function SupportWidget() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isAuthPage = typeof window !== 'undefined' && 
    (window.location.pathname.includes('/login') || 
     window.location.pathname.includes('/register') || 
     window.location.pathname === '/');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Auto-fetch latest request to link chat
  useEffect(() => {
    if (user && isOpen && !currentRequestId) {
      const fetchLatestRequest = async () => {
        try {
          const res = await fetch('/api/student/orders');
          const data = await res.json();
          if (data.orders && data.orders.length > 0) {
            setCurrentRequestId(data.orders[0].id);
          } else {
            setCurrentRequestId("general-support");
          }
        } catch (error) {
          setCurrentRequestId("general-support");
        }
      };
      fetchLatestRequest();
    }
  }, [user, isOpen, currentRequestId]);

  // Fetch messages when open
  useEffect(() => {
    if (isOpen && currentRequestId) {
      const fetchMessages = async () => {
        try {
          const res = await fetch(`/api/chat?requestId=${currentRequestId}`);
          const data = await res.json();
          if (data.success) setMessages(data.messages);
        } catch (error) {
          console.error("Fetch failed", error);
        }
      };
      
      fetchMessages();

      const channel = supabase
        .channel(`support_widget:${currentRequestId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `requestId=eq.${currentRequestId}`
          },
          (payload) => {
            const newMessage = payload.new as Message;
            setMessages((prev) => {
              if (prev.some(m => m.id === newMessage.id)) return prev;
              return [...prev, newMessage];
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isOpen, currentRequestId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending || !currentRequestId) return;

    setIsSending(true);
    const text = newMessage.trim();
    setNewMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: currentRequestId,
          sender: "student",
          message: text,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Optimistic update already handled by realtime if it works, 
        // but adding here for faster feedback
        const confirmedMsg = data.message || {
          requestId: currentRequestId,
          sender: "student",
          message: text,
          createdAt: new Date().toISOString()
        };
        setMessages(prev => {
          if (prev.some(m => m.id === confirmedMsg.id)) return prev;
          return [...prev, confirmedMsg];
        });
      }
    } catch (error) {
      console.error("Send failed", error);
    } finally {
      setIsSending(false);
    }
  };

  // Only show if logged in and not on auth pages (except for landing)
  if (!user || isAuthPage) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[9999] font-sans" dir="rtl">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: -20 }}
            className="absolute bottom-20 left-0 w-[350px] sm:w-[400px] h-[550px] glass-card-light rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-white/20"
          >
            {/* Header */}
            <div className="gold-gradient p-6 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-dark flex items-center justify-center text-gold shadow-inner border border-gold/20">
                  <Bot className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-primary-dark font-black text-lg leading-tight">الدعم الفني المباشر</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="text-[10px] text-primary-dark/80 font-bold uppercase tracking-wider">متواجدون الآن</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-primary-dark/10 rounded-xl transition-all text-primary-dark"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              <div className="text-center mb-6">
                <p className="inline-block px-4 py-1.5 bg-white/80 rounded-full text-[10px] text-slate-500 font-bold uppercase tracking-widest shadow-sm border border-slate-100">
                  تشفير تام للخصوصية
                </p>
              </div>

              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-60">
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
                    <MessageCircle className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-bold">كيف يمكننا مساعدتك اليوم؟</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === "student" ? "justify-start" : "justify-end"}`}
                  >
                    <div className={`relative max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${
                      msg.sender === "student"
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-white text-slate-800 rounded-bl-none border border-slate-100"
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                      <div className={`flex items-center gap-1 mt-1 text-[9px] font-bold ${
                        msg.sender === "student" ? "text-blue-100/70" : "text-slate-400"
                      }`}>
                        <Clock className="h-2.5 w-2.5" />
                        {new Date(msg.createdAt).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                        {msg.sender === "student" && <Check className="h-2.5 w-2.5 ml-1 text-gold" />}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <div className="flex-1 flex items-center bg-slate-100 rounded-2xl px-4 py-1.5 border border-transparent focus-within:border-gold/30 focus-within:bg-white transition-all">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="اكتب رسالتك هنا..."
                    className="flex-1 bg-transparent border-none outline-none py-2 text-sm text-slate-800 placeholder-slate-400"
                  />
                  <div className="flex items-center gap-1 text-slate-400">
                    <button type="button" className="p-1.5 hover:text-gold transition-colors">
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <button type="button" className="p-1.5 hover:text-gold transition-colors">
                      <ImageIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  className="w-12 h-12 rounded-2xl gold-gradient text-primary-dark flex items-center justify-center shadow-lg shadow-gold/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                >
                  <Send className="h-5 w-5 rotate-180" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full gold-gradient text-primary-dark shadow-[0_10px_30px_-10px_rgba(212,175,55,0.6)] flex items-center justify-center relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-7 w-7 relative z-10" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <MessageCircle className="h-7 w-7 relative z-10" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-bounce" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
