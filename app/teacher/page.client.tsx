"use client";

import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";
import { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  CheckCircle,
  Clock,
  Upload,
  MessageSquare,
  FileText,
  AlertCircle,
  TrendingUp,
  Star,
  Calendar,
  File,
  CloudUpload,
  X,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/shared/Button";

export const metadata: Metadata = getPageMetadata("teacher");

interface Task {
  id: string;
  title: string;
  student: string;
  status: "under-review" | "in-progress" | "completed" | "delivered";
  deadline: string;
  priority: "low" | "medium" | "high";
  subject: string;
  serviceType: string;
  description?: string;
}

interface ChatPreview {
  id: string;
  student: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  avatar: string;
}

const mockTasks: Task[] = [
  {
    id: "TASK-001",
    title: "مراجعة ورقة بحث - التعلم الآلي",
    student: "أحمد محمد",
    status: "in-progress",
    deadline: "2024-04-15",
    priority: "high",
    subject: "علوم الحاسب",
    serviceType: "كتابة أبحاث أكاديمية",
    description: "مراجعة شاملة للورقة البحثية مع التركيز على المنهجية والنتائج"
  },
  {
    id: "TASK-002",
    title: "حلول مجموعة مسائل التفاضل والتكامل",
    student: "فاطمة علي",
    status: "under-review",
    deadline: "2024-04-12",
    priority: "medium",
    subject: "الرياضيات",
    serviceType: "حل الاسايمنت",
    description: "حل جميع المسائل في الفصل الخامس مع شرح مفصل لكل خطوة"
  },
  {
    id: "TASK-003",
    title: "تحليل أدبي - العصر الفيكتوري",
    student: "محمد حسن",
    status: "completed",
    deadline: "2024-04-10",
    priority: "low",
    subject: "الأدب الإنجليزي",
    serviceType: "كتابة المقالات",
    description: "تحليل أعمال تشارلز ديكنز مع التركيز على الرموز الاجتماعية"
  },
  {
    id: "TASK-004",
    title: "مشروع برمجة - تطبيق ويب",
    student: "سارة أحمد",
    status: "delivered",
    deadline: "2024-04-18",
    priority: "high",
    subject: "هندسة البرمجيات",
    serviceType: "تنفيذ البروجكت",
    description: "تطوير تطبيق ويب باستخدام React مع إضافة المزيد من الميزات"
  }
];

const mockChats: ChatPreview[] = [
  {
    id: "1",
    student: "أحمد محمد",
    lastMessage: "شكراً لك على المراجعة الشاملة للورقة البحثية!",
    time: "منذ ساعتين",
    unread: true,
    avatar: "أم"
  },
  {
    id: "2",
    student: "فاطمة علي",
    lastMessage: "هل يمكنني الحصول على توضيح إضافي للمسألة رقم 5؟",
    time: "منذ 5 ساعات",
    unread: false,
    avatar: "فع"
  },
  {
    id: "3",
    student: "سارة أحمد",
    lastMessage: "لقد قمت بإجراء التعديلات المطلوبة على المشروع",
    time: "منذ يوم واحد",
    unread: false,
    avatar: "سأ"
  }
];

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const unreadChatCount = mockChats.filter((chat) => chat.unread).length;
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "under-review": return "text-yellow-400 bg-yellow-400/10";
      case "in-progress": return "text-blue-400 bg-blue-400/10";
      case "completed": return "text-green-400 bg-green-400/10";
      case "delivered": return "text-purple-400 bg-purple-400/10";
      default: return "text-slate-400 bg-slate-400/10";
    }
  };

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "under-review": return <Clock className="h-4 w-4" />;
      case "in-progress": return <AlertCircle className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "delivered": return <Upload className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: Task["status"]) => {
    switch (status) {
      case "under-review": return "قيد المراجعة";
      case "in-progress": return "قيد التنفيذ";
      case "completed": return "مكتمل";
      case "delivered": return "تم التسليم";
      default: return "غير محدد";
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "medium": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "low": return "text-green-400 bg-green-400/10 border-green-400/20";
      default: return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    // In a real app, this would update the backend
    // TODO: Implement backend API call
  };

  const getPriorityText = (priority: Task["priority"]) => {
    switch (priority) {
      case "high": return "عالية";
      case "medium": return "متوسطة";
      case "low": return "منخفضة";
      default: return "غير محدد";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    // In a real app, this would upload files to the server
    // TODO: Implement file upload API
    setUploadedFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-l from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                صرح
              </h1>
              <span className="text-slate-400">|</span>
              <span className="text-slate-300">لوحة تحكم المعلم المميز</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Chat Notifications */}
              <div className="relative">
                <Button variant="ghost" size="sm" className="relative" onClick={() => window.location.href = "/teacher/chat"}>
                  <MessageCircle className="h-5 w-5 text-slate-400" />
                  {unreadChatCount > 0 && (
                    <span className="absolute -top-1 -left-1 h-4 w-4 bg-cyan-500 rounded-full text-xs flex items-center justify-center text-slate-950 font-semibold">
                      {unreadChatCount}
                    </span>
                  )}
                </Button>
              </div>

              {/* Profile */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-l from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-slate-300 font-medium">د. سارة جونسون</div>
                  <div className="text-[11px] uppercase tracking-[0.12em] text-amber-300 font-semibold">عضوية مميزة</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
              <nav className="space-y-2">
                {[
                  { id: "overview", label: "نظرة عامة", icon: User },
                  { id: "tasks", label: "المهام المكلفة", icon: FileText },
                  { id: "chat", label: "الدردشة", icon: MessageSquare, href: "/teacher/chat", badge: mockChats.filter((chat) => chat.unread).length },
                  { id: "analytics", label: "التحليلات", icon: TrendingUp },
                ].map((item) => (
                  item.href ? (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                      {item.badge && item.badge > 0 && (
                        <span className="mr-auto inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-cyan-500 px-2 text-[11px] font-semibold text-slate-950">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all ${
                        activeTab === item.id
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                      {item.badge && item.badge > 0 && (
                        <span className="mr-auto inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-cyan-500 px-2 text-[11px] font-semibold text-slate-950">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )
                ))}
              </nav>

            </div>

            {/* Chat Preview Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mt-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-cyan-400" />
                  الرسائل الأخيرة
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">
                    {mockChats.filter(c => c.unread).length}
                  </span>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="space-y-3">
                {mockChats.slice(0, 3).map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-3 rounded-xl cursor-pointer transition-all hover:bg-slate-800/50 ${
                      chat.unread ? 'bg-cyan-500/5 border border-cyan-500/20' : 'bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-l from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {chat.avatar}
                      </div>
                      <div className="flex-1 text-right">
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-medium text-sm">{chat.student}</h4>
                          {chat.unread && (
                            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs">{chat.time}</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm mb-3 line-clamp-2">{chat.lastMessage}</p>
                    <Link href="/teacher/chat" className="block w-full text-center rounded-2xl bg-gradient-to-l from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 px-3 py-2 text-xs text-white font-semibold">
                      فتح المحادثة
                    </Link>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <Link href="/teacher/chat" className="block w-full text-center rounded-2xl border border-cyan-500/20 bg-slate-900/50 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 text-sm px-4 py-3">
                  عرض جميع الرسائل
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Welcome Header */}
                <div className="bg-gradient-to-l from-cyan-500/10 via-purple-500/5 to-cyan-500/10 border border-cyan-500/20 rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/20 to-transparent rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-2xl"></div>
                  <div className="relative">
                    <h2 className="text-3xl font-bold text-white mb-3">مرحباً بك، د. سارة! 👋</h2>
                    <p className="text-slate-300 text-lg">لديك 4 مهام نشطة و2 رسائل غير مقروءة.</p>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-sm">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      2 مهام قيد التنفيذ
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        2 رسائل جديدة
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/10 rounded-xl">
                        <FileText className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">12</p>
                        <p className="text-slate-400 text-sm">مهام نشطة</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500/10 rounded-xl">
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">8</p>
                        <p className="text-slate-400 text-sm">مكتملة</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-yellow-500/10 rounded-xl">
                        <Clock className="h-6 w-6 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">1</p>
                        <p className="text-slate-400 text-sm">قيد المراجعة</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500/10 rounded-xl">
                        <Upload className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">1</p>
                        <p className="text-slate-400 text-sm">تم التسليم</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-l from-amber-400/10 via-transparent to-yellow-400/5 backdrop-blur-sm border border-amber-300/20 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-400/10 rounded-xl">
                        <Star className="h-6 w-6 text-amber-300" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">4.9</p>
                        <p className="text-slate-300 text-sm">تقييم المعلم المميز</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Upload Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                      <div className="p-2 bg-cyan-500/10 rounded-xl">
                        <CloudUpload className="h-6 w-6 text-cyan-400" />
                      </div>
                      رفع الحلول المكتملة
                    </h3>
                    <Button variant="outline" size="sm" className="border-slate-600/50 text-slate-300 hover:bg-slate-800/50">
                      سجل الرفع
                    </Button>
                  </div>

                  {/* Drag and Drop Area */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                      isDragOver
                        ? 'border-cyan-400 bg-cyan-500/10 scale-105'
                        : 'border-slate-600/50 hover:border-cyan-500/50 hover:bg-slate-800/30'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.zip,.rar,.jpg,.jpeg,.png"
                    />

                    <div className="flex flex-col items-center gap-4">
                      <div className={`p-4 rounded-full ${isDragOver ? 'bg-cyan-500/20' : 'bg-slate-700/50'}`}>
                        <CloudUpload className={`h-12 w-12 ${isDragOver ? 'text-cyan-400' : 'text-slate-400'}`} />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-2">
                          {isDragOver ? 'أفلت الملفات هنا' : 'اسحب وأفلت الملفات هنا'}
                        </h4>
                        <p className="text-slate-400 mb-4">
                          أو انقر لاختيار الملفات يدوياً
                        </p>
                        <p className="text-sm text-slate-500">
                          يدعم: PDF, Word, Images, ZIP, RAR (حجم أقصى: 50MB)
                        </p>
                      </div>
                    </div>

                    {isDragOver && (
                      <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl pointer-events-none"></div>
                    )}
                  </div>

                  {/* Uploaded Files List */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-white mb-4">الملفات المحددة للرفع:</h4>
                      <div className="space-y-3">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-slate-700/50 rounded-lg">
                                <File className="h-5 w-5 text-slate-400" />
                              </div>
                              <div className="text-right">
                                <h5 className="text-white font-medium">{file.name}</h5>
                                <p className="text-slate-400 text-sm">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(index);
                              }}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-4 mt-6">
                        <Button
                          onClick={handleUpload}
                          className="flex-1 bg-gradient-to-l from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          رفع الملفات ({uploadedFiles.length})
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setUploadedFiles([])}
                          className="border-slate-600/50 text-slate-300 hover:bg-slate-800/50"
                        >
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Upload Guidelines */}
                  <div className="mt-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                    <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-cyan-400" />
                      إرشادات الرفع
                    </h5>
                    <ul className="text-sm text-slate-400 space-y-1">
                      <li>• تأكد من أن الملفات تحتوي على الحل النهائي المكتمل</li>
                      <li>• استخدم أسماء واضحة للملفات لسهولة التعرف عليها</li>
                      <li>• يمكن رفع ملفات متعددة لنفس المهمة</li>
                      <li>• سيتم إشعار الطالب عند رفع الملفات بنجاح</li>
                    </ul>
                  </div>
                </motion.div>

                {/* Student Chat Preview */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">محادثات الطلاب</h3>
                    <Button variant="outline" size="sm" className="border-slate-600/50 text-slate-300 hover:bg-slate-800/50">
                      عرض الكل
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {mockChats.map((chat) => (
                      <div key={chat.id} className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                        chat.unread ? 'bg-slate-800/50 border-r-4 border-cyan-500' : 'bg-slate-800/30'
                      }`}>
                        <div className="w-12 h-12 bg-gradient-to-l from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {chat.avatar}
                        </div>
                        <div className="flex-1 text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-medium">{chat.student}</h4>
                            {chat.unread && (
                              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-slate-300 text-sm">{chat.lastMessage}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-slate-400 text-xs">{chat.time}</p>
                          <Button size="sm" className="mt-2 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20">
                            رد
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button className="bg-gradient-to-l from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white p-6 rounded-2xl h-auto">
                    <div className="flex items-center gap-4">
                      <Upload className="h-8 w-8" />
                      <div className="text-right">
                        <h3 className="text-lg font-semibold">رفع العمل المكتمل</h3>
                        <p className="text-sm opacity-90">شارك ملفاتك النهائية</p>
                      </div>
                    </div>
                  </Button>

                  <Button variant="outline" className="border-slate-600/50 text-slate-300 hover:bg-slate-800/50 p-6 rounded-2xl h-auto">
                    <div className="flex items-center gap-4">
                      <Calendar className="h-8 w-8" />
                      <div className="text-right">
                        <h3 className="text-lg font-semibold">جدولة جلسة</h3>
                        <p className="text-sm opacity-90">احجز وقتاً للتعليم مع الطلاب</p>
                      </div>
                    </div>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Tasks Tab */}
            {activeTab === "tasks" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">إدارة المهام</h3>
                  <div className="space-y-4">
                    {mockTasks.map((task) => (
                      <div key={task.id} className="bg-slate-800/30 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="text-right flex-1">
                            <h4 className="text-white font-semibold text-lg">{task.title}</h4>
                            <p className="text-slate-400 text-sm mt-1">{task.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-slate-300">الطالب: {task.student}</span>
                              <span className="text-slate-300">الخدمة: {task.serviceType}</span>
                              <span className="text-slate-300">المادة: {task.subject}</span>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {getPriorityText(task.priority)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${getStatusColor(task.status)}`}>
                              {getStatusIcon(task.status)}
                              <span className="text-sm">{getStatusText(task.status)}</span>
                            </div>
                            <span className="text-slate-400">الموعد النهائي: {task.deadline}</span>
                          </div>

                          <div className="flex gap-2">
                            <select
                              value={task.status}
                              onChange={(e) => updateTaskStatus(task.id, e.target.value as Task["status"])}
                              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            >
                              <option value="under-review">قيد المراجعة</option>
                              <option value="in-progress">قيد التنفيذ</option>
                              <option value="completed">مكتمل</option>
                              <option value="delivered">تم التسليم</option>
                            </select>
                            <Button className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20">
                              <Upload className="h-4 w-4 mr-2" />
                              رفع الملف
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">التحليلات والإحصائيات</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-800/30 rounded-xl p-6">
                      <h4 className="text-white font-semibold mb-4">المهام هذا الشهر</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-300">مكتملة</span>
                          <span className="text-green-400">8</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">قيد التنفيذ</span>
                          <span className="text-blue-400">3</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">في الانتظار</span>
                          <span className="text-yellow-400">1</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800/30 rounded-xl p-6">
                      <h4 className="text-white font-semibold mb-4">متوسط الوقت</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-300">رد على الرسائل</span>
                          <span className="text-cyan-400">2.5 ساعة</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">إكمال المهام</span>
                          <span className="text-cyan-400">3.2 يوم</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">رضا الطلاب</span>
                          <span className="text-green-400">98%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/30 rounded-xl p-6">
                    <h4 className="text-white font-semibold mb-4">المواد الأكثر طلباً</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">علوم الحاسب</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-700 rounded-full h-2">
                            <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <span className="text-cyan-400 text-sm">15</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">الرياضيات</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-700 rounded-full h-2">
                            <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                          <span className="text-cyan-400 text-sm">12</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">الأدب الإنجليزي</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-700 rounded-full h-2">
                            <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                          <span className="text-cyan-400 text-sm">9</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}