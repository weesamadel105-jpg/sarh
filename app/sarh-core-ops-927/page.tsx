"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, FileText, LogOut, Upload, Download, MessageCircle, 
  Search, Eye, X, Send, CheckCircle, XCircle, AlertCircle, 
  Clock, CheckCircle2, FileUp, FileDown, Calendar, User, 
  Shield, Lock, Key, ChevronDown, Printer, Trash2, RefreshCw, 
  BarChart3, Users, CreditCard, TrendingUp, Filter, MoreVertical, Edit3 
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "../lib/auth/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";

type RequestStatus = "pending" | "in-progress" | "review" | "completed" | "cancelled";
type FileType = "pdf" | "docx" | "png" | "jpg" | "zip" | "other";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: FileType;
  url: string;
  uploadedBy: "student" | "admin";
  uploadedAt: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "student" | "admin";
  content: string;
  timestamp: string;
}

interface Request {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  service: string;
  description: string;
  status: RequestStatus;
  files: UploadedFile[];
  finalFiles: UploadedFile[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  price?: string;
  notes?: string;
  universityName?: string;
  contactNumber?: string;
  major?: string;
  subject?: string;
  details?: string;
}

function Toast({ message, type, onClose }: { message: string; type: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const colors = { success: "bg-emerald-500", error: "bg-red-500", info: "bg-blue-500", warning: "bg-amber-500" };
  return (
    <motion.div initial={{ opacity: 0, y: -50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -50, x: "-50%" }} className={`fixed top-4 left-1/2 z-[100] px-6 py-3 ${colors[type as keyof typeof colors]} text-white rounded-xl shadow-2xl flex items-center gap-2`}>
      {type === "success" ? <CheckCircle className="h-5 w-5" /> : type === "error" ? <XCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
      <span>{message}</span>
    </motion.div>
  );
}

export default function AdminControlRoom() {
  const { user, adminLogin, logout, isLoading: isAuthLoading } = useAuth();
  const [adminCode, setAdminCode] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [requests, setRequests] = useState<Request[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterService, setFilterService] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<RequestStatus | "all">("all");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [selectedStudentForChat, setSelectedStudentForChat] = useState<any>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const showToast = (message: string, type: string) => setToast({ message, type });

  // Fetch real requests from API
  const fetchRequests = useCallback(async () => {
    if (!user || user.role !== "admin") return;
    try {
      const response = await fetch('/api/admin/requests');
      if (response.ok) {
        const data = await response.json();
        if (data.requests) {
          const apiRequests: Request[] = data.requests.map((r: any) => ({
            id: r.id || `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            studentId: r.studentId || 'unknown',
            studentName: r.name || 'غير معروف',
            studentEmail: r.email || '',
            service: r.service || 'غير محدد',
            description: r.description || r.subject || r.details || '',
            universityName: r.universityName || r.university || '',
            contactNumber: r.contactNumber || r.contact || '',
            major: r.major || '',
            subject: r.subject || '',
            details: r.details || '',
            status: r.status || 'pending',
            notes: r.adminNote || '',
            files: (r.files || []).map((f: any) => ({
              id: f.savedName,
              name: f.originalName,
              size: f.size,
              type: f.type?.includes('pdf') ? 'pdf' : 'other',
              url: f.path || `/api/download?type=uploads&requestId=${r.id}&fileName=${encodeURIComponent(f.savedName)}`,
              uploadedBy: 'student',
              uploadedAt: r.date
            })),
            finalFiles: [],
            messages: [],
            createdAt: r.date ? new Date(r.date).toLocaleDateString('ar-SA') : 'تاريخ غير معروف',
            updatedAt: r.date || new Date().toISOString(),
          }));
          setRequests(apiRequests);
        }
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      showToast("خطأ في جلب الطلبات من السيرفر", "error");
    }
  }, [user]);

  // Fetch all students
  const fetchStudents = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/students");
      const data = await res.json();
      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error("Fetch students failed:", error);
    }
  }, []);

  // Fetch chat messages for a student or request
  const fetchChatMessages = useCallback(async (studentId?: string, requestId?: string) => {
    setIsChatLoading(true);
    try {
      let url = "/api/chat";
      if (requestId) url += `?requestId=${requestId}`;
      else if (studentId) url += `?studentId=${studentId}`;
      else return;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setChatMessages(data.messages);
      }
    } catch (error) {
      console.error("Fetch chat failed:", error);
    } finally {
      setIsChatLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchRequests();
      fetchStudents();
    }
  }, [user, fetchRequests, fetchStudents]);

  useEffect(() => {
    if (activeTab === "chat" && selectedStudentForChat) {
      fetchChatMessages(selectedStudentForChat.id);
      const interval = setInterval(() => fetchChatMessages(selectedStudentForChat.id), 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab, selectedStudentForChat, fetchChatMessages]);

  useEffect(() => {
    if (showChat && selectedRequest) {
      fetchChatMessages(undefined, selectedRequest.id);
      const interval = setInterval(() => fetchChatMessages(undefined, selectedRequest.id), 5000);
      return () => clearInterval(interval);
    }
  }, [showChat, selectedRequest, fetchChatMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, showChat]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const studentId = selectedRequest?.studentId || selectedStudentForChat?.id;
    const requestId = selectedRequest?.id || "general";

    if (!studentId) return;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          requestId,
          senderRole: "admin",
          content: newMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages([...chatMessages, data.message]);
        setNewMessage("");
      }
    } catch (error) {
      showToast("فشل إرسال الرسالة", "error");
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      // Trim and ensure case-sensitive comparison on backend
      const result = await adminLogin(adminCode.trim());
      if (result.success) {
        showToast("تم الدخول لغرفة التحكم", "success");
      } else {
        showToast(result.error || "كود الأدمن غير صحيح", "error");
      }
    } catch (err) {
      showToast("حدث خطأ في الاتصال", "error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const updateStatus = async (requestId: string, newStatus: RequestStatus) => {
    try {
      const response = await fetch('/api/adminActions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'update_status',
          requestId, 
          status: newStatus 
        }),
      });
      if (response.ok) {
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r));
        if (selectedRequest?.id === requestId) {
          setSelectedRequest(prev => prev ? { ...prev, status: newStatus } : null);
        }
        showToast("تم تحديث حالة الطلب", "success");
      } else {
        showToast("فشل تحديث الحالة", "error");
      }
    } catch (error) {
      showToast("خطأ في الاتصال", "error");
    }
  };

  const deleteRequest = async (requestId: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الطلب نهائياً؟")) return;
    try {
      const response = await fetch('/api/adminActions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'delete',
          requestId 
        }),
      });
      if (response.ok) {
        setRequests(prev => prev.filter(r => r.id !== requestId));
        setShowDetail(false);
        setSelectedRequest(null);
        showToast("تم حذف الطلب بنجاح", "success");
      } else {
        showToast("فشل حذف الطلب", "error");
      }
    } catch (error) {
      showToast("خطأ في الاتصال", "error");
    }
  };

  if (isAuthLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">جاري التحميل...</div>;
  }

  // If not authenticated as admin, show the Master Key login screen
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <AnimatePresence>
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </AnimatePresence>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
          <div className="bg-cyan-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="h-10 w-10 text-cyan-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">غرفة تحكم صرح</h1>
          <p className="text-slate-400 mb-8">يرجى إدخال الماستر كي للمتابعة</p>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input 
                type="password" 
                value={adminCode} 
                onChange={(e) => setAdminCode(e.target.value)} 
                placeholder="الماستر كي السري" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                required
              />
            </div>
            <Button type="submit" disabled={isLoggingIn} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-bold transition-all">
              {isLoggingIn ? "جاري التحقق..." : "دخول النظام"}
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ... rest of the component (Dashboard UI)
  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.studentName.includes(searchQuery) || r.id.includes(searchQuery) || r.service.includes(searchQuery);
    const matchesService = filterService === "all" || r.service === filterService;
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    return matchesSearch && matchesService && matchesStatus;
  });

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case "pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "in-progress": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "review": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "completed": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const getStatusText = (status: RequestStatus) => {
    switch (status) {
      case "pending": return "قيد الانتظار";
      case "in-progress": return "قيد التنفيذ";
      case "review": return "قيد المراجعة";
      case "completed": return "مكتمل";
      case "cancelled": return "ملغي";
      default: return status;
    }
  };

  // Main UI
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans" dir="rtl">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="fixed right-0 top-0 bottom-0 w-64 bg-slate-900 border-l border-slate-800 z-50 hidden lg:block">
        <div className="p-6">
          <Link href="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-10">صرح</h1>
          </Link>
          
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "overview" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:bg-slate-800"}`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>لوحة التحكم</span>
            </button>
            <button 
              onClick={() => setActiveTab("requests")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "requests" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:bg-slate-800"}`}
            >
              <FileText className="h-5 w-5" />
              <span>الطلبات</span>
            </button>
            <button 
              onClick={() => setActiveTab("students")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "students" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:bg-slate-800"}`}
            >
              <Users className="h-5 w-5" />
              <span>الطلاب</span>
            </button>
            <button 
              onClick={() => setActiveTab("chat")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "chat" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:bg-slate-800"}`}
            >
              <MessageCircle className="h-5 w-5" />
              <span>الدردشة</span>
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "settings" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:bg-slate-800"}`}
            >
              <Shield className="h-5 w-5" />
              <span>الإعدادات</span>
            </button>
          </nav>
        </div>

        <div className="absolute bottom-6 right-6 left-6">
          <button onClick={() => logout().then(() => router.push("/"))} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all border border-red-400/20">
            <LogOut className="h-5 w-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:mr-64 p-4 lg:p-8">
        {activeTab === "overview" || activeTab === "requests" ? (
          <>
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">إدارة الطلبات</h2>
                <p className="text-slate-400">أهلاً بك، {user?.name}. لديك {requests.length} طلب إجمالي.</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button onClick={fetchRequests} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
            </header>

            {/* Filters & Search */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              <div className="relative md:col-span-2">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="البحث بالاسم، الرقم، أو الخدمة..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pr-10 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
              
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="all">كل الحالات</option>
                <option value="pending">قيد الانتظار</option>
                <option value="in-progress">قيد التنفيذ</option>
                <option value="review">قيد المراجعة</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>

            {/* Requests Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                      <th className="px-6 py-4 font-semibold">رقم الطلب</th>
                      <th className="px-6 py-4 font-semibold">الطالب</th>
                      <th className="px-6 py-4 font-semibold">الخدمة</th>
                      <th className="px-6 py-4 font-semibold">التاريخ</th>
                      <th className="px-6 py-4 font-semibold">الحالة</th>
                      <th className="px-6 py-4 font-semibold text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-all group">
                        <td className="px-6 py-4 font-mono text-cyan-400 text-sm">{request.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-white font-medium">{request.studentName}</span>
                            <span className="text-slate-500 text-xs">{request.contactNumber}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs border border-slate-700">{request.service}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-sm">{request.createdAt}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(request.status)}`}>
                            {getStatusText(request.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => { setSelectedRequest(request); setShowDetail(true); }}
                              className="p-2 bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-400 rounded-lg transition-all"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => { router.push(`/admin/chat?requestId=${request.id}`); }}
                              className="p-2 bg-slate-800 hover:bg-purple-500/20 hover:text-purple-400 rounded-lg transition-all"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredRequests.length === 0 && (
                <div className="p-20 text-center">
                  <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-slate-500" />
                  </div>
                  <p className="text-slate-400">لا توجد طلبات تطابق بحثك</p>
                </div>
              )}
            </div>
          </>
        ) : activeTab === "students" ? (
          <div className="space-y-6">
            <header className="mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">إدارة الطلاب</h2>
              <p className="text-slate-400">قائمة الطلاب المسجلين في المنصة ({students.length} طالب)</p>
            </header>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                    <th className="px-6 py-4 font-semibold">اسم الطالب</th>
                    <th className="px-6 py-4 font-semibold">البريد الإلكتروني</th>
                    <th className="px-6 py-4 font-semibold">الجامعة</th>
                    <th className="px-6 py-4 font-semibold">رقم التواصل</th>
                    <th className="px-6 py-4 font-semibold">تاريخ التسجيل</th>
                    <th className="px-6 py-4 font-semibold text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-all">
                      <td className="px-6 py-4 text-white font-medium">{student.name}</td>
                      <td className="px-6 py-4 text-slate-400">{student.email}</td>
                      <td className="px-6 py-4 text-slate-400">{student.university}</td>
                      <td className="px-6 py-4 text-slate-400">{student.phone}</td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {student.createdAt ? new Date(student.createdAt).toLocaleDateString("ar-SA") : "غير متوفر"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => { setSelectedStudentForChat(student); setActiveTab("chat"); }}
                            className="p-2 bg-slate-800 hover:bg-purple-500/20 hover:text-purple-400 rounded-lg transition-all"
                            title="فتح الدردشة"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {students.length === 0 && (
                <div className="p-20 text-center">
                  <p className="text-slate-500 text-lg">لا يوجد طلاب مسجلون حالياً</p>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === "chat" ? (
          <div className="h-[calc(100vh-160px)] flex flex-col lg:flex-row gap-6">
            {/* Conversations List */}
            <div className="w-full lg:w-80 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white mb-4">المحادثات</h3>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="بحث في الطلاب..." 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pr-9 pl-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {students.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudentForChat(student)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-slate-800/50 transition-all border-b border-slate-800/50 ${selectedStudentForChat?.id === student.id ? "bg-slate-800 border-r-4 border-r-cyan-500" : ""}`}
                  >
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                      <User className="h-6 w-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium text-sm">{student.name}</div>
                      <div className="text-slate-500 text-xs truncate max-w-[120px]">{student.university}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
              {selectedStudentForChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-white font-bold">{selectedStudentForChat.name}</div>
                        <div className="text-slate-400 text-xs">{selectedStudentForChat.university} | {selectedStudentForChat.phone}</div>
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {chatMessages.length === 0 && !isChatLoading && (
                      <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                        <MessageCircle className="h-16 w-16 mb-4" />
                        <p>لا توجد رسائل سابقة. ابدأ المحادثة الآن!</p>
                      </div>
                    )}
                    {isChatLoading && chatMessages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-slate-400">جاري التحميل...</div>
                    ) : (
                      chatMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.senderRole === "admin" ? "justify-start" : "justify-end"}`}>
                          <div className={`max-w-[70%] p-3 rounded-2xl ${msg.senderRole === "admin" ? "bg-cyan-600 text-white rounded-br-none" : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700"}`}>
                            <p className="text-sm">{msg.content}</p>
                            <div className={`text-[10px] mt-1 ${msg.senderRole === "admin" ? "text-cyan-200" : "text-slate-500"}`}>
                              {new Date(msg.timestamp).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t border-slate-800">
                    <form onSubmit={handleSendChatMessage} className="flex gap-3">
                      <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="اكتب ردك هنا..." 
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                      <button 
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                      >
                        <Send className="h-5 w-5 rotate-180" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-10 text-center">
                  <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                    <MessageCircle className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">الدردشة المباشرة مع الطلاب</h3>
                  <p className="max-w-md">اختر طالباً من القائمة الجانبية لبدء المحادثة وتقديم الدعم الفني المباشر.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <header className="mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">إعدادات النظام</h2>
              <p className="text-slate-400">تخصيص إعدادات منصة سرح وتأمين الوصول</p>
            </header>

            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-cyan-400" />
                  إعدادات الوصول (Master Key)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-500 mb-2">الماستر كي الحالي</label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono">
                        SARH-ADMIN-2026
                      </div>
                      <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 transition-all">
                        <Edit3 className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">هذا الكود هو المفتاح الوحيد للدخول لغرفة التحكم. يرجى الحفاظ عليه سرياً.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  إحصائيات عامة
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="text-slate-500 text-xs mb-1">إجمالي الطلاب</div>
                    <div className="text-2xl font-bold text-white">{students.length}</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="text-slate-500 text-xs mb-1">إجمالي الطلبات</div>
                    <div className="text-2xl font-bold text-white">{requests.length}</div>
                  </div>
                </div>
              </div>

              <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  منطقة الخطر
                </h3>
                <p className="text-slate-400 text-sm mb-6">هذه الإجراءات لا يمكن التراجع عنها. يرجى الحذر عند الاستخدام.</p>
                <button className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-bold transition-all">
                  مسح جميع ملفات الكاش
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Request Detail Modal */}
      <AnimatePresence>
        {showDetail && selectedRequest && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDetail(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
              <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md p-6 border-b border-slate-800 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl border ${getStatusColor(selectedRequest.status)}`}>
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">تفاصيل الطلب: {selectedRequest.id}</h3>
                    <p className="text-slate-400 text-sm">تم الاستلام في: {selectedRequest.createdAt}</p>
                  </div>
                </div>
                <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-slate-800 rounded-full transition-all text-slate-400">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-slate-500 text-sm mb-2 flex items-center gap-2"><User className="h-4 w-4" /> معلومات الطالب</h4>
                      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                        <p className="text-white font-bold mb-1">{selectedRequest.studentName}</p>
                        <p className="text-slate-400 text-sm">{selectedRequest.contactNumber}</p>
                        <p className="text-slate-400 text-sm">{selectedRequest.universityName}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-slate-500 text-sm mb-2 flex items-center gap-2"><Shield className="h-4 w-4" /> الخدمة والوصف</h4>
                      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                        <p className="text-cyan-400 font-bold mb-2">{selectedRequest.service}</p>
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedRequest.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-slate-500 text-sm mb-2">تغيير حالة الطلب</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {(["pending", "in-progress", "review", "completed", "cancelled"] as RequestStatus[]).map(status => (
                          <button 
                            key={status}
                            onClick={() => updateStatus(selectedRequest.id, status)}
                            className={`px-4 py-2 rounded-xl text-xs border transition-all ${selectedRequest.status === status ? getStatusColor(status) : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600"}`}
                          >
                            {getStatusText(status)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                      <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                        إجراءات سريعة
                      </h4>
                      <div className="space-y-3">
                        <button 
                          onClick={() => {
                            router.push(`/admin/chat?requestId=${selectedRequest.id}`);
                          }}
                          className="w-full py-3 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-xl font-bold hover:bg-purple-500/20 transition-all flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="h-5 w-5" />
                          مراسلة الطالب
                        </button>
                        <button className="w-full py-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl font-bold hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          إرسال رابط الدفع
                        </button>
                        <button onClick={() => deleteRequest(selectedRequest.id)} className="w-full py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold hover:bg-red-500/20 transition-all flex items-center justify-center gap-2">
                          <Trash2 className="h-5 w-5" />
                          حذف الطلب نهائياً
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Files Section */}
                <div>
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Upload className="h-5 w-5 text-cyan-400" />
                    الملفات المرفقة ({selectedRequest.files.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedRequest.files.map(file => (
                      <div key={file.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-700 p-2 rounded-lg text-slate-300">
                            {file.type === "pdf" ? <FileText className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white text-sm font-medium truncate max-w-[150px]">{file.name}</span>
                            <span className="text-slate-500 text-xs">{(file.size / 1024).toFixed(1)} KB</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = file.url;
                            link.download = file.name;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="p-2 bg-slate-700 hover:bg-cyan-500/20 hover:text-cyan-400 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
