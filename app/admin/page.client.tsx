"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserCheck,
  FileText,
  DollarSign,
  TrendingUp,
  Calendar,
  Shield,
  Settings,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Download,
  FileImage,
  Bell,
  X,
  Upload,
  Lock,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../lib/auth/AuthContext";
import { Button } from "@/components/shared/Button";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  status: "active" | "inactive";
  joinDate: string;
  ordersCount?: number;
}

interface Order {
  id: string;
  title: string;
  student: string;
  teacher: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  amount: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const { adminLogin, user } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [masterCode, setMasterCode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [realRequests, setRealRequests] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newestRequestId, setNewestRequestId] = useState<string | null>(null);
  const [deliveringRequestId, setDeliveringRequestId] = useState<string | null>(null);
  const [deliveryNote, setDeliveryNote] = useState("");
  const [deliveryFiles, setDeliveryFiles] = useState<File[]>([]);
  const [isDelivering, setIsDelivering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const deliveryFileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      // Trim and ensure case-sensitive comparison on backend
      const result = await adminLogin(masterCode.trim());
      if (result.success) {
        setIsLoggedIn(true);
      } else {
        setLoginError(result.error || "الماستر كي غير صحيح");
      }
    } catch (err) {
      setLoginError("حدث خطأ في الاتصال");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      setIsLoggedIn(true);
    }
  }, [user]);

  // Fetch real requests
  const fetchRequests = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const response = await fetch('/api/admin/requests');
      const data = await response.json();
      if (data.requests) {
        setRealRequests(data.requests);
      }
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Delivery handler
  const handleDeliver = async (requestId: string) => {
    if (deliveryFiles.length === 0) {
      alert("يرجى اختيار ملف واحد على الأقل للتسليم.");
      return;
    }

    setIsDelivering(true);
    try {
      const formData = new FormData();
      formData.append('requestId', requestId);
      formData.append('completionNote', deliveryNote);
      deliveryFiles.forEach(file => formData.append('file', file));

      const response = await fetch('/api/admin/deliver', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert("تم تسليم الملفات بنجاح.");
        setDeliveringRequestId(null);
        setDeliveryNote("");
        setDeliveryFiles([]);
        fetchRequests(); // Refresh table
      } else {
        const err = await response.json();
        alert(err.error || "فشل تسليم الملفات.");
      }
    } catch (err) {
      console.error("Delivery error:", err);
      alert("حدث خطأ فني أثناء التسليم.");
    } finally {
      setIsDelivering(false);
    }
  };

  // Real-time notification listener
  useEffect(() => {
    if (!isLoggedIn) return;
    const eventSource = new EventSource('/api/admin/notifications');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'NEW_REQUEST') {
          const newRequest = data.payload;
          setNotifications(prev => [newRequest, ...prev]);
          if (audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio play failed:", e));
          }
          setNewestRequestId(newRequest.id);
          setTimeout(() => setNewestRequestId(null), 10000);
          fetchRequests();
        }
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [fetchRequests, isLoggedIn]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-400 bg-green-400/10";
      case "inactive": return "text-red-400 bg-red-400/10";
      case "pending": return "text-yellow-400 bg-yellow-400/10";
      case "in-progress": return "text-blue-400 bg-blue-400/10";
      case "completed": return "text-green-400 bg-green-400/10";
      case "cancelled": return "text-red-400 bg-red-400/10";
      default: return "text-slate-400 bg-slate-400/10";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "text-purple-400 bg-purple-400/10";
      case "teacher": return "text-blue-400 bg-blue-400/10";
      case "student": return "text-green-400 bg-green-400/10";
      default: return "text-slate-400 bg-slate-400/10";
    }
  };

  // Download order as PDF
  function downloadOrderAsPDF(order: any) {
    const content = `
طلب رقم: ${order.id}
الطالب: ${order.student || order.name}
الخدمة: ${order.title || order.service}
المعلم: ${order.teacher || "لم يتم التعيين"}
الحالة: ${order.status === "pending" ? "معلقة" : order.status === "in-progress" ? "قيد التنفيذ" : order.status === "completed" ? "مكتملة" : "ملغاة"}
المبلغ: $${order.amount || 0}
تاريخ الإنشاء: ${order.createdAt || order.date}
    `;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `طلب_${order.id}_${order.student || order.name}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  if (!isLoggedIn) {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-arial">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#002366] border border-blue-800 rounded-3xl p-8 w-full max-w-md shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">لوحة تحكم المشرف</h1>
            <p className="text-blue-100">يرجى إدخال كود الوصول للمتابعة</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-blue-200 block">كود الدخول</label>
              <input 
                type="password"
                value={masterCode}
                onChange={(e) => setMasterCode(e.target.value)}
                placeholder="أدخل كود الوصول هنا"
                className="w-full px-4 py-4 bg-white/5 border border-blue-700/50 rounded-xl text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                required
              />
            </div>

            {loginError && (
              <p className="text-red-400 text-sm text-center">{loginError}</p>
            )}

            <Button 
              type="submit"
              className="w-full bg-white text-[#002366] py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2"
            >
              دخول
              <ChevronRight className="h-5 w-5" />
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 font-arial">
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-[#002366] bg-clip-text text-transparent">
                صرح
              </h1>
              <span className="text-slate-400">|</span>
              <span className="text-slate-300">لوحة تحكم المشرف</span>
            </div>
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (showNotifications) {
                      setNotifications([]);
                    }
                  }}
                  className="p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl transition-all relative group"
                >
                  <Bell className={`h-5 w-5 ${notifications.length > 0 ? 'text-white' : 'text-slate-400'}`} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-slate-900">
                      {notifications.length}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                        <h4 className="text-white font-semibold">تنبيهات الطلبات الجديدة</h4>
                        <button 
                          onClick={() => setNotifications([])}
                          className="text-xs text-slate-400 hover:text-white transition-colors"
                        >
                          مسح الكل
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notif, i) => (
                            <div 
                              key={i} 
                              className="p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer"
                              onClick={() => {
                                setActiveTab("orders");
                                setShowNotifications(false);
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                  <FileText className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0 text-right">
                                  <p className="text-sm font-medium text-white truncate">{notif.name}</p>
                                  <p className="text-xs text-slate-400 mt-1">{notif.service}</p>
                                  <p className="text-[10px] text-slate-500 mt-2">
                                    {new Date(notif.date).toLocaleTimeString('ar-SA')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-slate-500">
                            لا توجد تنبيهات جديدة
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#002366] rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="text-slate-300 font-medium">المشرف العام</span>
              </div>
            </div>
          </div>
        </div>
        {/* Hidden Audio for alerts */}
        <audio ref={audioRef} className="hidden" preload="auto">
           <source src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" type="audio/mpeg" />
         </audio>

         {/* Delivery Modal */}
         <AnimatePresence>
           {deliveringRequestId && (
             <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden"
               >
                 <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                   <h3 className="text-xl font-bold text-white">تسليم الطلب النهائي</h3>
                   <button 
                     onClick={() => setDeliveringRequestId(null)}
                     className="text-slate-400 hover:text-white"
                   >
                     <X className="h-6 w-6" />
                   </button>
                 </div>
                 <div className="p-6 space-y-6">
                   <div className="space-y-2 text-right">
                     <label className="text-sm text-slate-400">ملاحظات التسليم (اختياري)</label>
                     <textarea 
                       value={deliveryNote}
                       onChange={(e) => setDeliveryNote(e.target.value)}
                       placeholder="اكتب أي ملاحظات للطالب هنا..."
                       className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[100px] text-right"
                     />
                   </div>

                   <div className="space-y-2 text-right">
                     <label className="text-sm text-slate-400">الملفات النهائية *</label>
                     <div 
                       onClick={() => deliveryFileInputRef.current?.click()}
                       className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-white/50 transition-all cursor-pointer group"
                     >
                       <Upload className="h-8 w-8 text-slate-500 group-hover:text-white mx-auto mb-3" />
                       <p className="text-slate-300 text-sm">انقر لاختيار الملفات النهائية</p>
                       <p className="text-slate-500 text-xs mt-1">PDF, Word, ZIP, Images...</p>
                       <input 
                         type="file" 
                         ref={deliveryFileInputRef}
                         multiple
                         onChange={(e) => setDeliveryFiles(Array.from(e.target.files || []))}
                         className="hidden"
                       />
                     </div>
                     {deliveryFiles.length > 0 && (
                       <div className="mt-4 space-y-2">
                         {deliveryFiles.map((file, idx) => (
                           <div key={idx} className="flex items-center justify-between bg-slate-800 p-2 rounded-lg text-xs text-slate-300">
                             <span className="truncate max-w-[200px]">{file.name}</span>
                             <button onClick={() => setDeliveryFiles(prev => prev.filter((_, i) => i !== idx))}>
                               <X className="h-4 w-4 text-red-400" />
                             </button>
                           </div>
                         ))}
                       </div>
                     )}
                   </div>

                   <Button 
                     onClick={() => handleDeliver(deliveringRequestId)}
                     disabled={isDelivering || deliveryFiles.length === 0}
                     className="w-full bg-[#002366] text-white py-4 text-lg font-bold"
                   >
                     {isDelivering ? "جاري التسليم..." : "إتمام التسليم"}
                   </Button>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>
       </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-[#002366] border border-blue-800 rounded-2xl p-6">
              <nav className="space-y-2">
                {[
                  { id: "overview", label: "نظرة عامة", icon: BarChart3 },
                  { id: "users", label: "المستخدمون", icon: Users },
                  { id: "teachers", label: "المعلمين", icon: UserCheck },
                  { id: "orders", label: "الطلبات", icon: FileText },
                  { id: "analytics", label: "التحليلات", icon: TrendingUp },
                  { id: "settings", label: "الإعدادات", icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all ${
                      activeTab === item.id
                        ? "bg-white/10 text-white border border-white/20"
                        : "text-blue-100 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="bg-[#002366] border border-blue-800 rounded-2xl p-8 relative overflow-hidden">
                  <div className="relative">
                    <h2 className="text-3xl font-bold text-white mb-3">مرحباً بك في لوحة تحكم المشرف 👋</h2>
                    <p className="text-blue-100 text-lg">راجع الأداء، إدارة المستخدمين، وتحليل الطلبات في مكان واحد.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {/* Stats Summary */}
                  {[
                    { label: "إجمالي المستخدمين", value: "1,280", icon: Users, color: "text-blue-400" },
                    { label: "المعلمين النشطين", value: "92", icon: UserCheck, color: "text-green-400" },
                    { label: "إجمالي الطلبات", value: "3,490", icon: FileText, color: "text-purple-400" },
                    { label: "الإيرادات الشهرية", value: "$143K", icon: DollarSign, color: "text-cyan-400" },
                    { label: "الاشتراكات النشطة", value: "876", icon: Calendar, color: "text-amber-400" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#002366] border border-blue-800 rounded-2xl p-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-white/5 rounded-xl">
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-blue-100 text-xs text-center">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Orders List in Overview */}
                <div className="bg-[#002366] border border-blue-800 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">أحدث الطلبات المستلمة</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-right">
                      <thead>
                        <tr className="border-b border-blue-700/50">
                          <th className="py-3 px-4 text-blue-200 font-medium">الطالب</th>
                          <th className="py-3 px-4 text-blue-200 font-medium">الخدمة</th>
                          <th className="py-3 px-4 text-blue-200 font-medium">الحالة</th>
                          <th className="py-3 px-4 text-blue-200 font-medium">الملفات</th>
                          <th className="py-3 px-4 text-blue-200 font-medium">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {realRequests.map((request) => (
                          <tr key={request.id} className="border-b border-blue-800/50">
                            <td className="py-4 px-4 text-white font-medium">{request.name}</td>
                            <td className="py-4 px-4 text-blue-100">{request.service}</td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                {request.status === "pending" ? "معلقة" : request.status === "in-progress" ? "قيد التنفيذ" : request.status === "completed" ? "مكتملة" : "ملغاة"}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                {request.files?.map((f: any, i: number) => (
                                  <a 
                                    key={i} 
                                    href={f.path} 
                                    className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Download className="h-4 w-4" />
                                  </a>
                                ))}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Button 
                                size="sm" 
                                className="bg-white text-[#002366] hover:bg-blue-50"
                                onClick={() => setDeliveringRequestId(request.id)}
                              >
                                تسليم
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Other tabs placeholder */}
            {activeTab !== "overview" && (
              <div className="bg-[#002366] border border-blue-800 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">قسم {activeTab}</h2>
                <p className="text-blue-100">هذا القسم قيد التحديث ليتناسب مع التصميم الجديد.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
