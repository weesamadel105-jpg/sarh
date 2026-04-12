"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
  ChevronRight,
  Clock,
  MessageSquare,
  Search,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Filter,
  ArrowUpRight,
  Activity,
  Plus
} from "lucide-react";
import { useAuth } from "../lib/auth/AuthContext";
import { Button } from "@/components/shared/Button";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type OrderStatus = "new" | "under_review" | "in_progress" | "awaiting_revision" | "completed" | "delivered" | "pending" | "revision";

interface User {
  id: string;
  name?: string;
  email: string;
  role: "student" | "teacher" | "admin";
  status: "active" | "inactive";
  joinDate: string;
  ordersCount?: number;
  createdAt?: string;
}

interface Order {
  id: string;
  name: string;
  email: string;
  service: string;
  status: OrderStatus;
  date: string;
  files?: any[];
  [key: string]: any;
}

const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case "new":
    case "pending": return "جديد";
    case "under_review": return "قيد المراجعة";
    case "in_progress": return "جاري التنفيذ";
    case "awaiting_revision":
    case "revision": return "بانتظار التعديل";
    case "completed": return "مكتمل";
    case "delivered": return "تم التسليم";
    default: return "غير معروف";
  }
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "new":
    case "pending": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    case "under_review": return "text-cyan-400 bg-cyan-400/10 border-cyan-400/20";
    case "in_progress": return "text-purple-400 bg-purple-400/10 border-purple-400/20";
    case "awaiting_revision":
    case "revision": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    case "completed": return "text-green-400 bg-green-400/10 border-green-400/20";
    case "delivered": return "text-gold bg-gold/10 border-gold/20";
    default: return "text-slate-400 bg-slate-400/10 border-slate-400/20";
  }
};

export default function AdminDashboard() {
  const { adminLogin, user } = useAuth();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [masterCode, setMasterCode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [realRequests, setRealRequests] = useState<Order[]>([]);
  const [allStudents, setAllStudents] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [deliveringRequestId, setDeliveringRequestId] = useState<string | null>(null);
  const [deliveryNote, setDeliveryNote] = useState("");
  const [deliveryFiles, setDeliveryFiles] = useState<File[]>([]);
  const [isDelivering, setIsDelivering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const deliveryFileInputRef = useRef<HTMLInputElement>(null);

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalRequests = realRequests.length;
    const completed = realRequests.filter(r => ["completed", "delivered"].includes(r.status)).length;
    const pending = realRequests.filter(r => ["new", "under_review", "pending"].includes(r.status)).length;
    const inProgress = realRequests.filter(r => r.status === "in_progress").length;
    const completionRate = totalRequests > 0 ? Math.round((completed / totalRequests) * 100) : 0;
    
    // Group by service
    const serviceCounts: Record<string, number> = {};
    realRequests.forEach(r => {
      serviceCounts[r.service] = (serviceCounts[r.service] || 0) + 1;
    });
    const topServices = Object.entries(serviceCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return { totalRequests, completed, pending, inProgress, completionRate, topServices };
  }, [realRequests]);

  const fetchRequests = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const response = await fetch('/api/admin/requests');
      const data = await response.json();
      if (data.requests) setRealRequests(data.requests);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  }, [isLoggedIn]);

  const fetchStudents = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const response = await fetch('/api/admin/students');
      const data = await response.json();
      if (data.students) setAllStudents(data.students);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchRequests();
      fetchStudents();
    }
  }, [isLoggedIn, fetchRequests, fetchStudents]);

  const handleUpdateStatus = async (requestId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchRequests();
    } catch (err) {
      console.error("Update status failed:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
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

  if (!isLoggedIn) {
    return (
      <div dir="rtl" className="min-h-screen bg-primary-dark flex items-center justify-center p-4 font-sans">
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
          <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-gold/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] -left-[10%] w-[30%] h-[30%] bg-primary-light/20 rounded-full blur-[100px]" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl relative border border-white/10"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 gold-gradient rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-gold/20">
              <Lock className="h-10 w-10 text-primary-dark" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">منصة صرح</h1>
            <p className="text-text-secondary font-bold">لوحة تحكم المشرف الرئيسي</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-sm text-text-secondary font-bold uppercase tracking-widest block mr-1">كود الوصول الذهبي</label>
              <input 
                type="password"
                value={masterCode}
                onChange={(e) => setMasterCode(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-5 bg-white/5 border border-white/10 rounded-2xl text-white text-center text-3xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all placeholder:tracking-normal placeholder:text-white/10"
                required
              />
            </div>

            {loginError && (
              <p className="text-danger text-sm text-center font-bold bg-danger/10 p-3 rounded-xl border border-danger/20">{loginError}</p>
            )}

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full gold-gradient text-primary-dark py-5 rounded-2xl text-xl font-black flex items-center justify-center gap-3 shadow-xl shadow-gold/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              {isLoading ? "جاري التحقق..." : "فتح اللوحة"}
              <ChevronRight className="h-6 w-6" />
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-primary-dark font-sans selection:bg-gold/30">
      <header className="sticky top-0 z-50 glass-card border-b border-white/10 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center shadow-lg shadow-gold/20">
                <span className="text-primary-dark font-black text-xl">ص</span>
              </div>
              <h1 className="text-2xl font-black text-white">لوحة الإشراف</h1>
            </Link>
            
            <div className="h-8 w-px bg-white/10 hidden lg:block" />
            
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-500 text-xs font-black uppercase">النظام يعمل بكفاءة</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-text-secondary hover:text-gold transition-colors">
              <Bell className="h-6 w-6" />
              {notifications.length > 0 && <span className="absolute top-2 left-2 w-2 h-2 bg-gold rounded-full border-2 border-primary-dark" />}
            </button>
            
            <div className="flex items-center gap-3">
              <div className="text-left hidden sm:block">
                <p className="text-white font-bold text-sm">المشرف الرئيسي</p>
                <p className="text-gold text-[10px] font-black uppercase tracking-widest text-right">MASTER ACCESS</p>
              </div>
              <div className="w-10 h-10 rounded-full gold-gradient p-[2px]">
                <div className="w-full h-full rounded-full bg-primary-dark flex items-center justify-center">
                  <Shield className="h-6 w-6 text-gold" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <aside className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-3 border border-white/5">
              <nav className="space-y-1">
                {[
                  { id: "overview", label: "الرئيسية", icon: BarChart3 },
                  { id: "orders", label: "الطلبات", icon: FileText },
                  { id: "users", label: "الطلاب", icon: Users },
                  { id: "chats", label: "المحادثات", icon: MessageSquare },
                  { id: "services", label: "الخدمات", icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group ${
                      activeTab === item.id
                        ? "gold-gradient text-primary-dark shadow-lg shadow-gold/10"
                        : "text-text-secondary hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${activeTab === item.id ? "text-primary-dark" : "group-hover:text-gold"}`} />
                    <span className="font-bold">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary-light/10 rounded-full blur-2xl" />
              <div className="relative">
                <h4 className="text-white font-bold text-sm mb-3">إحصائيات سريعة</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary text-xs">معدل الإنجاز</span>
                    <span className="text-gold font-black text-xs">{analytics.completionRate}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full gold-gradient" style={{ width: `${analytics.completionRate}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-10 space-y-8">
            
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* KPI Cards */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "إجمالي الطلبات", value: analytics.totalRequests, icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10", trend: "+12%" },
                    { label: "طلاب مسجلون", value: allStudents.length, icon: Users, color: "text-purple-400", bg: "bg-purple-400/10", trend: "+5%" },
                    { label: "طلبات معلقة", value: analytics.pending, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10", trend: "-2%" },
                    { label: "معدل النجاح", value: `${analytics.completionRate}%`, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10", trend: "Stable" },
                  ].map((stat, i) => (
                    <div key={i} className="glass-card rounded-3xl p-6 border border-white/5 group hover:border-gold/20 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} shadow-lg`}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {stat.trend}
                        </span>
                      </div>
                      <h4 className="text-text-secondary text-sm font-bold mb-1">{stat.label}</h4>
                      <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
                    </div>
                  ))}
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Activity Table */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black text-white">آخر الطلبات المستلمة</h3>
                      <button onClick={() => setActiveTab("orders")} className="text-gold font-bold text-sm hover:underline">عرض جميع الطلبات</button>
                    </div>
                    <div className="glass-card rounded-[2.5rem] border border-white/5 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse">
                          <thead>
                            <tr className="bg-white/5">
                              <th className="px-6 py-4 text-xs font-black text-text-secondary uppercase tracking-wider">الطالب</th>
                              <th className="px-6 py-4 text-xs font-black text-text-secondary uppercase tracking-wider">الخدمة</th>
                              <th className="px-6 py-4 text-xs font-black text-text-secondary uppercase tracking-wider">الحالة</th>
                              <th className="px-6 py-4 text-xs font-black text-text-secondary uppercase tracking-wider">الإجراءات</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {realRequests.slice(0, 8).map((req) => (
                              <tr key={req.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white">
                                      {req.name[0]}
                                    </div>
                                    <div>
                                      <p className="text-white font-bold text-sm">{req.name}</p>
                                      <p className="text-text-secondary text-[10px]">{req.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-white font-bold text-sm">{req.service}</p>
                                  <p className="text-text-secondary text-[10px]">{req.date}</p>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black border ${getStatusColor(req.status)}`}>
                                    {getStatusLabel(req.status)}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => router.push(`/admin/chat?requestId=${req.id}`)}
                                      className="p-2 bg-white/5 rounded-xl text-text-secondary hover:text-gold hover:bg-gold/10 transition-all"
                                    >
                                      <MessageSquare className="h-4 w-4" />
                                    </button>
                                    <button className="p-2 bg-white/5 rounded-xl text-text-secondary hover:text-white transition-all">
                                      <MoreVertical className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Analytics & Distribution */}
                  <div className="space-y-8">
                    <div className="glass-card rounded-[2.5rem] p-8 border border-white/5">
                      <h3 className="text-xl font-black text-white mb-6">توزيع الخدمات</h3>
                      <div className="space-y-6">
                        {analytics.topServices.map(([service, count], i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-white font-bold">{service}</span>
                              <span className="text-gold font-black">{count} طلب</span>
                            </div>
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full gold-gradient rounded-full" 
                                style={{ width: `${(count / analytics.totalRequests) * 100}%` }} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card rounded-[2.5rem] p-8 border border-gold/10 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-1 gold-gradient" />
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                          <Activity className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-white font-black">أداء المنصة</h4>
                          <p className="text-text-secondary text-[10px] uppercase font-bold tracking-wider">تقرير الأسبوع الحالي</p>
                        </div>
                      </div>
                      <div className="flex items-end gap-2 h-20 px-2">
                        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                          <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group/bar">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              className="absolute bottom-0 left-0 right-0 gold-gradient rounded-t-lg transition-all"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-center text-gold font-black text-xs mt-4">نمو بنسبة 14% مقارنة بالشهر الماضي</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black text-white">إدارة الطلبات</h3>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                      <input 
                        type="text" 
                        placeholder="ابحث عن طلب..."
                        className="bg-white/5 border border-white/10 rounded-2xl py-2.5 pr-10 pl-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/30 w-64 transition-all"
                      />
                    </div>
                    <Button className="bg-white/5 text-white border border-white/10 px-6 rounded-2xl flex items-center gap-2">
                      <Filter className="h-4 w-4" /> تصفية
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {realRequests.map(order => (
                    <div key={order.id} className="glass-card rounded-[2rem] p-6 border border-white/5 hover:border-gold/20 transition-all group">
                      <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${getStatusColor(order.status)}`}>
                            <FileText className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="text-white font-black text-lg group-hover:text-gold transition-colors">{order.service}</h4>
                            <p className="text-text-secondary text-sm font-bold">{order.name} • {order.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-text-secondary text-[10px] font-black uppercase">الحالة الحالية</p>
                            <select 
                              value={order.status}
                              onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                              className={`bg-transparent border-none font-black text-sm cursor-pointer outline-none ${getStatusColor(order.status).split(' ')[0]}`}
                            >
                              <option value="new">جديد</option>
                              <option value="under_review">قيد المراجعة</option>
                              <option value="in_progress">جاري التنفيذ</option>
                              <option value="awaiting_revision">بانتظار التعديل</option>
                              <option value="completed">مكتمل</option>
                              <option value="delivered">تم التسليم</option>
                            </select>
                          </div>
                          <div className="text-right hidden sm:block">
                            <p className="text-text-secondary text-[10px] font-black uppercase">تاريخ الطلب</p>
                            <p className="text-white font-bold text-sm">{order.date}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              onClick={() => router.push(`/admin/chat?requestId=${order.id}`)}
                              className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold"
                            >
                              محادثة
                            </Button>
                            <button className="p-2.5 text-danger hover:bg-danger/10 rounded-xl transition-colors">
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Other tabs placeholders */}
            {["users", "chats", "services", "settings"].includes(activeTab) && (
              <div className="glass-card rounded-[2.5rem] p-20 text-center border border-white/5">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Activity className="h-10 w-10 text-gold animate-pulse" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">هذا القسم قيد التحديث</h2>
                <p className="text-text-secondary max-w-md mx-auto">نحن نقوم بترقية هذا القسم ليتناسب مع الهوية الجديدة الفاخرة لمنصة صرح. سيتم تفعيله قريباً.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
