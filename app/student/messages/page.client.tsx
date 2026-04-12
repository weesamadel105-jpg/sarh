"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageSquare,
  ArrowRight,
  Clock,
  ChevronLeft,
  FileText,
  User,
  Bot
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { useAuth } from "@/app/lib/auth/AuthContext";

interface Request {
  id: string;
  title: string;
  status: string;
  date: string;
}

export default function StudentMessagesPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      try {
        const res = await fetch("/api/student/orders");
        const data = await res.json();
        if (data.orders) {
          setRequests(data.orders);
        }
      } catch (error) {
        console.error("Fetch requests failed:", error);
      } finally {
        setIsPageLoading(false);
      }
    };

    if (user) {
      fetchRequests();
    }
  }, [user]);

  if (isAuthLoading || isPageLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col" dir="rtl">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/student")} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <ArrowRight className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg">مركز الرسائل</h1>
              <span className="text-xs text-slate-400">تواصل مع الدعم الفني لكل طلب</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
        {/* General Support Chat Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => {
            const latestRequestId = requests[0]?.id;
            if (latestRequestId) {
              router.push(`/student/chat?requestId=${latestRequestId}`);
            } else {
              router.push("/student/chat");
            }
          }}
          className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/30 rounded-2xl p-6 cursor-pointer hover:border-cyan-500/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-cyan-500 flex items-center justify-center text-white">
                <Bot className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">الدعم الفني العام</h3>
                <p className="text-slate-400 text-sm">محادثة مباشرة مع فريق الدعم لأي استفسار عام</p>
              </div>
            </div>
            <ChevronLeft className="h-6 w-6 text-slate-500 group-hover:text-white transition-all group-hover:-translate-x-1" />
          </div>
        </motion.div>

        <div className="pt-4">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-400" />
            رسائل الطلبات
          </h2>
          
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                <p className="text-slate-500">لا توجد طلبات نشطة حالياً</p>
              </div>
            ) : (
              requests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => router.push(`/student/chat?requestId=${request.id}`)}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 cursor-pointer hover:bg-slate-800/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-bold">{request.title}</span>
                          <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded-full text-slate-500 border border-slate-700">#{request.id}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {request.date ? new Date(request.date).toLocaleDateString("ar-SA") : ""}</span>
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{request.status}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronLeft className="h-5 w-5 text-slate-600 group-hover:text-white transition-all group-hover:-translate-x-1" />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
