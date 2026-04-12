"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Plus,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  Bell,
  FileText,
  MessageSquare,
  TrendingUp,
  Star,
  LogOut,
  MessageCircle,
  Download,
  ChevronRight,
  Search,
  LayoutDashboard,
  Settings,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { services } from "@/lib/services-data";

type OrderStatus = "new" | "under_review" | "in_progress" | "awaiting_revision" | "completed" | "delivered" | "pending" | "revision";

interface Order {
  id: string;
  request_id?: string;
  title: string;
  status: OrderStatus;
  deadline: string;
  progress: number;
  teacher?: string;
  delivered_attachments?: any[];
  completion_note?: string;
  date?: string;
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

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case "new":
    case "pending": return <Plus className="h-4 w-4" />;
    case "under_review": return <Search className="h-4 w-4" />;
    case "in_progress": return <TrendingUp className="h-4 w-4" />;
    case "awaiting_revision":
    case "revision": return <AlertCircle className="h-4 w-4" />;
    case "completed": return <CheckCircle className="h-4 w-4" />;
    case "delivered": return <Download className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

import { useAuth } from "../lib/auth/AuthContext";

export default function StudentDashboard() {
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/student/orders');
        if (response.ok) {
          const data = await response.json();
          if (data.orders) {
            setOrders(
              data.orders.map((order: any) => ({
                id: order.id || "",
                request_id: order.request_id,
                title: order.title || "طلب جديد",
                status: (order.status as OrderStatus) || "new",
                deadline: order.deadline ? order.deadline.split("T")[0] : "",
                progress: order.progress ?? 0,
                delivered_attachments: order.delivered_attachments,
                completion_note: order.completion_note,
                date: order.date
              }))
            );
          }
        } else {
          setFetchError("حدث خطأ أثناء تحميل الطلبات.");
        }
      } catch (error) {
        setFetchError("حدث خطأ أثناء تحميل الطلبات.");
      } finally {
        setIsOrdersLoading(false);
      }
    };

    if (!isAuthLoading && user) {
      fetchOrders();
    }
  }, [user, isAuthLoading]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-bold text-xl">صرح</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const unreadChatCount = 0; // Mock for now

  const stats = [
    { label: "إجمالي الطلبات", value: orders.length, icon: FileText, color: "bg-blue-500" },
    { label: "قيد التنفيذ", value: orders.filter(o => ["in_progress", "under_review"].includes(o.status)).length, icon: TrendingUp, color: "bg-purple-500" },
    { label: "مكتملة", value: orders.filter(o => ["completed", "delivered"].includes(o.status)).length, icon: CheckCircle, color: "bg-green-500" },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-primary-dark font-sans selection:bg-gold/30">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-gold/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] w-[30%] h-[30%] bg-primary-light/20 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center shadow-lg shadow-gold/20">
                <span className="text-primary-dark font-black text-xl">ص</span>
              </div>
              <h1 className="text-2xl font-black text-white hidden sm:block">منصة صرح</h1>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <button className="relative p-2 text-text-secondary hover:text-gold transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-2 left-2 w-2 h-2 bg-gold rounded-full border-2 border-primary-dark" />
            </button>
            
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            
            <div className="flex items-center gap-3">
              <div className="text-left hidden sm:block">
                <p className="text-white font-bold text-sm">{user.name}</p>
                <p className="text-text-secondary text-xs">{user.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full gold-gradient p-[2px]">
                <div className="w-full h-full rounded-full bg-primary-dark flex items-center justify-center overflow-hidden">
                  <User className="h-6 w-6 text-gold" />
                </div>
              </div>
            </div>

            <button onClick={handleLogout} className="p-2 text-text-secondary hover:text-danger transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="glass-card rounded-3xl p-4 border border-white/5">
              <nav className="space-y-1">
                {[
                  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
                  { id: "orders", label: "طلباتي", icon: FileText },
                  { id: "chat", label: "الدردشة", icon: MessageCircle, href: "/student/chat" },
                  { id: "subscription", label: "الاشتراك الفصلي", icon: Star, href: "/student/new-order?service=term-subscription" },
                  { id: "settings", label: "الإعدادات", icon: Settings },
                ].map((item) => (
                  item.href ? (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-text-secondary hover:bg-white/5 hover:text-white transition-all group"
                    >
                      <item.icon className="h-5 w-5 group-hover:text-gold transition-colors" />
                      <span className="font-bold">{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group ${
                        activeTab === item.id
                          ? "bg-gold text-primary-dark"
                          : "text-text-secondary hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <item.icon className={`h-5 w-5 transition-colors ${activeTab === item.id ? "text-primary-dark" : "group-hover:text-gold"}`} />
                      <span className="font-bold">{item.label}</span>
                    </button>
                  )
                ))}
              </nav>
            </div>

            {/* Quick Support Card */}
            <div className="glass-card rounded-3xl p-6 border border-gold/10 relative overflow-hidden group">
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-gold/10 rounded-full blur-2xl group-hover:bg-gold/20 transition-all" />
              <div className="relative">
                <h4 className="text-white font-bold mb-2">هل تحتاج مساعدة؟</h4>
                <p className="text-text-secondary text-sm mb-4 leading-relaxed">فريق الدعم الفني متواجد لمساعدتك في أي وقت.</p>
                <Link href="/contact" className="inline-flex items-center gap-2 text-gold font-bold text-sm hover:gap-3 transition-all">
                  تواصل معنا <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-8">
            
            {activeTab === "overview" && (
              <>
                {/* Welcome Section */}
                <section className="relative overflow-hidden rounded-[2rem] p-8 blue-gradient border border-white/10 shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20" />
                  <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
                        مرحباً بك مجدداً، <span className="text-gold">{user.name.split(' ')[0]}</span>!
                      </h2>
                      <p className="text-blue-100/80 text-lg max-w-xl leading-relaxed">
                        نحن هنا لضمان تفوقك الدراسي. ابدأ الآن بطلب خدمة جديدة أو تابع تقدم طلباتك الحالية.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <Button 
                        onClick={() => router.push('/student/new-order')}
                        className="gold-gradient text-primary-dark font-black px-8 py-4 rounded-2xl shadow-xl shadow-gold/20 hover:scale-105 transition-transform"
                      >
                        طلب خدمة جديدة
                      </Button>
                    </div>
                  </div>
                </section>

                {/* Stats Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {stats.map((stat, i) => (
                    <div key={i} className="glass-card rounded-3xl p-6 border border-white/5 flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl ${stat.color}/20 flex items-center justify-center text-white shadow-lg`}>
                        <stat.icon className={`h-7 w-7 ${stat.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div>
                        <p className="text-text-secondary text-sm font-bold">{stat.label}</p>
                        <p className="text-3xl font-black text-white">{isOrdersLoading ? "..." : stat.value}</p>
                      </div>
                    </div>
                  ))}
                </section>

                {/* Top Services - Quick Actions */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black text-white">خدماتنا المميزة</h3>
                    <Link href="/pricing" className="text-gold font-bold hover:underline">عرض جميع الباقات</Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {services.slice(0, 4).map((service) => (
                      <button 
                        key={service.id} 
                        onClick={() => router.push(`/student/new-order?service=${service.id}`)}
                        className="glass-card rounded-3xl p-6 border border-white/5 hover:border-gold/30 transition-all text-center group"
                      >
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-gold/10 transition-all">
                          <service.icon className="h-6 w-6 text-gold" />
                        </div>
                        <h4 className="text-white font-bold text-sm mb-1">{service.title}</h4>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Latest Orders */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black text-white">أحدث الطلبات</h3>
                    <button onClick={() => setActiveTab("orders")} className="text-text-secondary font-bold hover:text-gold transition-colors flex items-center gap-1">
                      عرض الكل <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {fetchError ? (
                      <div className="glass-card rounded-3xl p-12 text-center border-danger/20">
                        <AlertCircle className="h-12 w-12 text-danger mx-auto mb-4" />
                        <p className="text-danger font-bold">{fetchError}</p>
                      </div>
                    ) : isOrdersLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="glass-card h-24 rounded-3xl animate-pulse" />
                        ))}
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="glass-card rounded-[2.5rem] p-12 text-center border-white/5">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                          <FileText className="h-10 w-10 text-text-secondary" />
                        </div>
                        <h4 className="text-white text-xl font-bold mb-2">لا توجد طلبات بعد</h4>
                        <p className="text-text-secondary mb-8 max-w-sm mx-auto">ابدأ رحلتك الأكاديمية معنا الآن واطلب أول خدمة لك بضمان الجودة.</p>
                        <Button onClick={() => router.push('/student/new-order')} className="gold-gradient text-primary-dark font-black px-10 py-4 rounded-2xl">
                          اطلب خدمتك الأولى
                        </Button>
                      </div>
                    ) : (
                      orders.slice(0, 5).map((order) => (
                        <div 
                          key={order.id} 
                          onClick={() => router.push(`/student/orders/${order.id}`)}
                          className="glass-card rounded-3xl p-5 border border-white/5 hover:border-gold/20 transition-all cursor-pointer group"
                        >
                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                            </div>
                            <div className="flex-1 text-center sm:text-right">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                <h4 className="text-white font-bold text-lg group-hover:text-gold transition-colors">{order.title}</h4>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                  {getStatusLabel(order.status)}
                                </span>
                              </div>
                              <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2">
                                <p className="text-text-secondary text-sm flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5" /> الموعد: <span className="text-blue-100">{order.deadline}</span>
                                </p>
                                <p className="text-text-secondary text-sm flex items-center gap-1.5">
                                  <FileText className="h-3.5 w-3.5" /> المعرف: <span className="text-blue-100">{order.id.slice(0, 8)}</span>
                                </p>
                              </div>
                            </div>
                            <div className="w-full sm:w-auto flex items-center gap-4">
                              <div className="flex-1 sm:w-32 bg-white/5 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="h-full gold-gradient transition-all duration-1000" 
                                  style={{ width: `${order.progress}%` }} 
                                />
                              </div>
                              <span className="text-gold font-black text-sm">{order.progress}%</span>
                              <ChevronRight className="h-5 w-5 text-text-secondary group-hover:text-gold transition-all group-hover:translate-x-[-4px]" />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </>
            )}

            {activeTab === "orders" && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white">جميع الطلبات</h3>
                  <div className="flex gap-2">
                    {/* Filters could go here */}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div 
                      key={order.id} 
                      onClick={() => router.push(`/student/orders/${order.id}`)}
                      className="glass-card rounded-3xl p-5 border border-white/5 hover:border-gold/20 transition-all cursor-pointer group"
                    >
                      {/* Reuse the order card design from above */}
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                        </div>
                        <div className="flex-1 text-center sm:text-right">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                            <h4 className="text-white font-bold text-lg group-hover:text-gold transition-colors">{order.title}</h4>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                          <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2">
                            <p className="text-text-secondary text-sm flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" /> الموعد: <span className="text-blue-100">{order.deadline}</span>
                            </p>
                            <p className="text-text-secondary text-sm flex items-center gap-1.5">
                              <FileText className="h-3.5 w-3.5" /> المعرف: <span className="text-blue-100">{order.id.slice(0, 8)}</span>
                            </p>
                          </div>
                        </div>
                        <div className="w-full sm:w-auto flex items-center gap-4">
                          <div className="flex-1 sm:w-32 bg-white/5 h-2 rounded-full overflow-hidden">
                            <div 
                              className="h-full gold-gradient transition-all duration-1000" 
                              style={{ width: `${order.progress}%` }} 
                            />
                          </div>
                          <span className="text-gold font-black text-sm">{order.progress}%</span>
                          <ChevronRight className="h-5 w-5 text-text-secondary group-hover:text-gold transition-all group-hover:translate-x-[-4px]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
