"use client";

import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Send,
  Paperclip,
  MessageCircle,
  FileText,
  FilePlus
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = getPageMetadata("teacherChat");

interface Conversation {
  id: string;
  student: string;
  course: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
}

interface Message {
  id: string;
  content: string;
  sender: "teacher" | "student";
  timestamp: string;
  type: "text" | "file";
  fileName?: string;
}

interface ChatMessageRow {
  id: string;
  content: string;
  sender: "teacher" | "student";
  created_at: string;
  type: "text" | "file";
  file_name?: string;
}

const students: Conversation[] = [
  {
    id: "1",
    student: "أحمد محمد",
    course: "علوم الحاسب",
    lastMessage: "شكراً لك، سأنتظر التحديثات.",
    time: "الآن",
    unread: 2,
    avatar: "أم"
  },
  {
    id: "2",
    student: "فاطمة علي",
    course: "الرياضيات",
    lastMessage: "هل يمكنك إضافة المزيد من الشروحات؟",
    time: "قبل 20 دقيقة",
    unread: 1,
    avatar: "فع"
  },
  {
    id: "3",
    student: "سارة أحمد",
    course: "الأدب الإنجليزي",
    lastMessage: "تم ارسال الملف، شكراً.",
    time: "منذ ساعة",
    unread: 0,
    avatar: "سأ"
  }
];

const quickReplies = [
  "سأراجع الملف وأعود إليك قريباً.",
  "يرجى التحقق من المرفقات والإرسال مرة أخرى.",
  "الميعاد النهائي هو يوم الخميس.",
  "تم استلام الطلب وسيتم العمل عليه الآن."
];

export default function TeacherChatPage() {
  // Add safe fallback for supabase
  if (!supabase) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">الخدمة مؤقتًا غير متاحة</div>;
  }

  const [activeConversation, setActiveConversation] = useState<Conversation>(students[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!supabase) return;
    let chatChannel: any = null;

    const loadConversation = async () => {
      if (!supabase) return;
      const roomId = activeConversation.id;

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", roomId)
        .order("created_at", { ascending: true });

      if (error) {
        // TODO: Handle load conversation error
        return;
      }

      if (data) {
        setMessages(
          data.map((message) => ({
            id: message.id,
            content: message.content,
            sender: message.sender,
            timestamp: new Date(message.created_at).toLocaleTimeString("ar-SA", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            }),
            type: message.type,
            fileName: message.file_name ?? undefined
          }))
        );
      }

      chatChannel = supabase
        .channel(`room-${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${roomId}`
          },
          (payload) => {
            const message = payload.new as ChatMessageRow;
            setMessages((prev) => [
              ...prev,
              {
                id: message.id,
                content: message.content,
                sender: message.sender,
                timestamp: new Date(message.created_at).toLocaleTimeString("ar-SA", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false
                }),
                type: message.type,
                fileName: message.file_name ?? undefined
              }
            ]);
          }
        )
        .subscribe();
    };

    loadConversation();

    return () => {
      if (chatChannel && supabase) {
        supabase.removeChannel(chatChannel);
      }
    };
  }, [activeConversation.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleConversationChange = (conversation: Conversation) => {
    setActiveConversation(conversation);
    setSelectedFile(null);
    setFileName("");
  };

  const handleSend = async () => {
    if (!inputValue.trim() && !selectedFile) return;
    if (!supabase) return;

    setIsSending(true);
    const content = selectedFile ? `تم إرسال الملف ${selectedFile.name}` : inputValue.trim();
    const messagePayload = {
      conversation_id: activeConversation.id,
      content,
      sender: "teacher",
      type: selectedFile ? "file" : "text",
      file_name: selectedFile ? selectedFile.name : undefined
    };

    const { error } = await supabase.from("messages").insert([messagePayload]);

    if (error) {
      // TODO: Handle send message error
    }

    setInputValue("");
    setSelectedFile(null);
    setFileName("");
    setIsSending(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950">
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/teacher" className="text-slate-300 hover:text-white text-sm inline-flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                مساحة المحادثة
              </Link>
            </div>
            <div className="text-slate-300 text-sm">قائمة الطلاب والمحادثات</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
          <aside className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-3xl p-5 h-fit">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">الطلاب</h2>
                <p className="text-slate-400 text-sm">اختر محادثة للرد بسرعة</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold">
                {students.filter(student => student.unread).length} غير مقروءة
              </div>
            </div>

            <div className="space-y-3">
              {students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => handleConversationChange(student)}
                  className={`w-full text-right p-4 rounded-3xl transition-all border ${
                    student.id === activeConversation.id ? "border-cyan-500 bg-cyan-500/10" : "border-slate-700 bg-slate-900/50 hover:border-cyan-500/30 hover:bg-slate-800/70"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-gradient-to-l from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {student.avatar}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{student.student}</h3>
                        <p className="text-slate-400 text-xs">{student.course}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-[11px]">{student.time}</p>
                      {student.unread > 0 && (
                        <div className="mt-2 inline-flex items-center justify-center px-2 py-1 bg-cyan-500 text-slate-950 text-[11px] font-semibold rounded-full">
                          {student.unread}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mt-3 line-clamp-2">{student.lastMessage}</p>
                </button>
              ))}
            </div>
          </aside>

          <section className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-3xl flex flex-col overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-800/50 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">محادثة نشطة</p>
                <h2 className="text-xl font-semibold text-white">{activeConversation.student}</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-slate-800/70 rounded-2xl px-3 py-2 text-slate-300 text-sm">
                  {activeConversation.course}
                </div>
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-white">
                  <FileText className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === "teacher" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-xl ${message.sender === "teacher" ? "text-right" : "text-left"}`}>
                    <div className={`inline-flex flex-col gap-2 px-5 py-4 rounded-3xl shadow-sm ${message.sender === "teacher" ? "bg-gradient-to-l from-cyan-500 to-purple-600 text-white" : "bg-slate-800/70 text-slate-200 border border-slate-700/60"}`}>
                      {message.type === "file" && (
                        <div className="flex items-center gap-3 bg-slate-900/70 p-3 rounded-2xl border border-slate-700/60">
                          <FilePlus className="w-5 h-5 text-cyan-400" />
                          <div>
                            <p className="text-sm font-medium">{message.fileName}</p>
                            <p className="text-xs text-slate-400">ملف مرفق</p>
                          </div>
                        </div>
                      )}
                      <p className="text-sm leading-6">{message.content}</p>
                    </div>
                    <div className="mt-2 text-slate-500 text-[11px]">{message.timestamp}</div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-slate-800/50 p-5 space-y-4">
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto]">
                <div className="flex items-center gap-3 rounded-3xl bg-slate-800/70 border border-slate-700/60 px-4 py-3">
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="inline-flex items-center gap-2 text-slate-300 hover:text-cyan-300"
                  >
                    <Paperclip className="h-5 w-5" />
                    إرفاق ملف
                  </button>
                  <div className="flex-1">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="اكتب ردك هنا..."
                      className="w-full resize-none bg-transparent outline-none text-white placeholder:text-slate-500 text-sm"
                      rows={1}
                    />
                  </div>
                  <Button
                    onClick={handleSend}
                    disabled={isSending || (!inputValue.trim() && !selectedFile)}
                    className="bg-gradient-to-l from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white px-4 py-3 rounded-3xl transition-all duration-300"
                  >
                    {isSending ? (
                      <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="rounded-3xl bg-slate-800/70 border border-slate-700/60 p-4">
                  <p className="text-slate-400 text-sm mb-3">إجابات سريعة</p>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleQuickReply(reply)}
                        className="rounded-full border border-slate-700/60 bg-slate-900/70 px-4 py-2 text-xs text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {fileName && (
                <div className="flex items-center justify-between gap-3 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-slate-200">
                  <div>
                    <p className="text-sm font-medium">{fileName}</p>
                    <p className="text-xs text-slate-400">تم اختيار ملف للمشاركة</p>
                  </div>
                  <Button variant="ghost" className="text-cyan-400 hover:text-white" onClick={() => { setSelectedFile(null); setFileName(""); }}>
                    إزالة
                  </Button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
