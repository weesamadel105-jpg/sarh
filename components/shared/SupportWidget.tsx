"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Clock, Check, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/lib/auth/AuthContext";

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

  // Auto-fetch latest request to link chat
  useEffect(() => {
    if (user && isOpen && !currentRequestId) {
      const fetchLatestRequest = async () => {
        try {
          const res = await fetch('/api/student/orders');
          const data = await res.json();
          if (data.success && data.orders && data.orders.length > 0) {
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
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, currentRequestId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending || !currentRequestId) return;

    setIsSending(true);
    const text = newMessage.trim();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: currentRequestId,
          sender: "student",
          message: text
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        setNewMessage("");
      }
    } catch (error) {
      alert("فشل الإرسال");
    } finally {
      setIsSending(false);
    }
  };

  if (isAuthLoading || !user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" dir="rtl">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-cyan-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">الدعم الفني المباشر</h3>
                  <p className="text-[10px] text-cyan-100">نحن متصلون لمساعدتك</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-6">
                  <MessageCircle className="h-12 w-12 mb-2 opacity-20" />
                  <p className="text-sm">كيف يمكننا مساعدتك اليوم؟</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === "student" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.sender === "student" 
                        ? "bg-cyan-600 text-white rounded-br-none" 
                        : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700"
                    }`}>
                      {msg.message}
                      <div className="text-[9px] mt-1 opacity-50 flex items-center gap-1">
                        <Clock className="h-2 w-2" />
                        {new Date(msg.createdAt).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="اكتب رسالتك..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || isSending}
                className="p-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-500 disabled:opacity-50 transition-all"
              >
                <Send className="h-5 w-5 rotate-180" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-110 active:scale-95 ${
          isOpen ? "bg-slate-800 text-white" : "bg-cyan-600 text-white shadow-cyan-500/20"
        }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
      </button>
    </div>
  );
}
