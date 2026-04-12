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
  Download
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { services } from "@/lib/services-data";
import { supabase } from "@/lib/supabase";

interface Order {
  id: string;
  request_id?: string;
  title: string;
  status: "pending" | "in-progress" | "completed" | "revision";
  deadline: string;
  progress: number;
  teacher?: string;
  delivered_attachments?: any[];
  completion_note?: string;
}

interface OrderRow {
  id: string | number;
  title?: string;
  service?: string;
  status?: string;
  deadline?: string;
  progress?: number;
  teacher?: string;
  request_id?: string;
  delivered_attachments?: any[];
  completion_note?: string;
}

interface Notification {
  id: string;
  type: "order" | "message" | "system" | "deadline";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

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
      // TODO: Handle logout error
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
                status: (order.status as Order["status"]) || "pending",
                deadline: order.deadline ? order.deadline.split("T")[0] : "",
                progress: order.progress ?? 0,
                delivered_attachments: order.delivered_attachments,
                completion_note: order.completion_note
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
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-arial">جاري التحميل...</div>;
  }

  if (!user) return null;

  const unreadChatCount = 0; // Simplified for now, remove mock dependency

  const totalOrders = orders.length;
  const completedOrders = orders.filter((order) => order.status === "completed").length;
  const inProgressOrders = orders.filter((order) => order.status === "in-progress").length;
  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const revisionOrders = orders.filter((order) => order.status === "revision").length;

  const workflowStatusCards = [
    {
      label: "قيد المراجعة",
      value: pendingOrders,
      description: "طلبك الآن في مرحلة فحص الجودة",
      className: "bg-cyan-600"
    },
    {
      label: "قيد التنفيذ",
      value: inProgressOrders,
      description: "المعلم يعمل على طلبك حالياً",
      className: "bg-purple-600"
    },
    {
      label: "مكتمل",
      value: completedOrders,
      description: "الطلبات المكتملة بنجاح",
      className: "bg-green-600"
    },
    {
      label: "تم المراجعة",
      value: revisionOrders,
      description: "طلبات بانتظار المراجعة",
      className: "bg-amber-600"
    }
  ];

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "text-yellow-400 bg-yellow-400/10";
      case "in-progress": return "text-blue-400 bg-blue-400/10";
      case "completed": return "text-green-400 bg-green-400/10";
      case "revision": return "text-orange-400 bg-orange-400/10";
      default: return "text-slate-400 bg-slate-400/10";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "in-progress": return <TrendingUp className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "revision": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 font-arial">
      {/* Header */}
      <header className="bg-[#002366] border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">
                صرح
              </h1>
              <span className="text-blue-300">|</span>
              <span className="text-blue-100">لوحة تحكم الطالب</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Chat Notifications */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative text-white" 
                  onClick={() => {
                    const latestOrderId = orders[0]?.id;
                    if (latestOrderId) {
                      router.push(`/student/chat?requestId=${latestOrderId}`);
                    } else {
                      router.push("/student/chat");
                    }
                  }}
                >
                  <MessageCircle className="h-5 w-5" />
                  {unreadChatCount > 0 && (
                    <span className="absolute -top-1 -left-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-semibold">
                      {unreadChatCount}
                    </span>
                  )}
                </Button>
              </div>

              {/* Profile */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-white font-medium">{user.name}</span>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-blue-200 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#002366] border border-blue-800 rounded-2xl p-6">
              <nav className="space-y-2">
                {[
                  { id: "overview", label: "نظرة عامة", icon: User },
                  { id: "orders", label: "طلباتي", icon: FileText },
                  { 
                    id: "chat", 
                    label: "الدردشة", 
                    icon: MessageCircle, 
                    href: orders[0]?.id ? `/student/chat?requestId=${orders[0].id}` : "/student/chat", 
                    badge: unreadChatCount 
                  },
                  { id: "messages", label: "الرسائل", icon: MessageSquare, href: "/student/messages" },
                  { id: "subscription", label: "الاشتراك الفصلي", icon: Star, href: "/student/new-order?service=term-subscription" },
                ].map((item) => (
                  item.href ? (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right text-blue-100 hover:bg-white/10 transition-colors"
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                      {item.badge && item.badge > 0 && (
                        <span className="mr-auto inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-red-500 px-2 text-[11px] font-semibold text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-colors ${
                        activeTab === item.id
                          ? "bg-white/20 text-white"
                          : "text-blue-100 hover:bg-white/5"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  )
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Welcome Header */}
                <div className="bg-[#002366] border border-blue-800 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">مرحباً بك، {user.name.split(' ')[0]}! 👋</h2>
                  <p className="text-blue-100 text-lg">إليك نظرة على رحلتك الأكاديمية اليوم.</p>
                </div>

                {/* Service Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                  {services.map((service) => (
                    <div 
                      key={service.id} 
                      onClick={() => router.push(`/student/new-order?service=${service.id}`)}
                      className="bg-[#002366] border border-blue-800 rounded-2xl p-6 cursor-pointer font-arial"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                          <service.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-right">
                          <h3 className="text-lg font-bold text-white mb-1">{service.title}</h3>
                          <p className="text-blue-100 text-sm leading-relaxed">{service.description}</p>
                        </div>
                        <div className="pt-2 flex justify-end">
                          <span className="text-white text-xs font-medium flex items-center gap-1">
                            اطلب الآن <Plus className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#002366] border border-blue-800 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-xl">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{isOrdersLoading ? "..." : totalOrders}</p>
                        <p className="text-blue-100 text-sm">إجمالي الطلبات</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#002366] border border-blue-800 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-xl">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{isOrdersLoading ? "..." : completedOrders}</p>
                        <p className="text-blue-100 text-sm">مكتملة</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#002366] border border-blue-800 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-xl">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{isOrdersLoading ? "..." : inProgressOrders}</p>
                        <p className="text-blue-100 text-sm">قيد التنفيذ</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workflow Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {workflowStatusCards.map((status) => (
                    <div key={status.label} className="bg-[#002366] border border-blue-800 rounded-2xl p-6">
                      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-white ${status.className}`}>
                        {status.label}
                      </div>
                      <p className="text-3xl font-bold text-white mt-6">{status.value}</p>
                      <p className="text-blue-100 text-sm mt-2">{status.description}</p>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link
                    href="/student/new-order"
                    className="block rounded-2xl bg-[#002366] border border-blue-800 text-white p-6 h-full font-arial"
                  >
                    <div className="flex items-center gap-4">
                      <Plus className="h-8 w-8" />
                      <div className="text-right">
                        <h3 className="text-lg font-semibold">إنشاء طلب جديد</h3>
                        <p className="text-sm text-blue-100">ابدأ واجباً جديداً</p>
                      </div>
                    </div>
                  </Link>

                  <div className="block rounded-2xl bg-[#002366] border border-blue-800 text-white p-6 h-full font-arial cursor-pointer">
                    <div className="flex items-center gap-4">
                      <Upload className="h-8 w-8" />
                      <div className="text-right">
                        <h3 className="text-lg font-semibold">رفع الملفات</h3>
                        <p className="text-sm text-blue-100">شارك موادك</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Latest Orders */}
                <div className="bg-[#002366] border border-blue-800 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">أحدث الطلبات</h3>
                  <div className="space-y-4">
                    {fetchError ? (
                      <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-6 text-red-300 text-center">{fetchError}</div>
                    ) : isOrdersLoading ? (
                      <div className="rounded-xl bg-white/5 p-6 text-blue-100 text-center">جارٍ تحميل الطلبات...</div>
                    ) : orders.length === 0 ? (
                      <div className="rounded-xl bg-white/5 p-6 text-blue-100 text-center">لا توجد طلبات جديدة حالياً. يمكنك إنشاء طلب جديد من خلال لوحة التحكم.</div>
                    ) : (
                      orders.slice(0, 5).map((order) => (
                        <div 
                          key={order.id} 
                          onClick={() => router.push(`/student/orders/${order.id}`)}
                          className="p-4 bg-white/5 rounded-xl space-y-4 cursor-pointer border border-transparent"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-lg ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                              </div>
                              <div className="text-right">
                                <h4 className="text-white font-medium">{order.title}</h4>
                                <p className="text-blue-200 text-sm">المعرف: {order.id}</p>
                              </div>
                            </div>
                            <div className="text-left">
                              <p className="text-blue-100 text-sm">الموعد النهائي: {order.deadline}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab !== "overview" && (
              <div className="bg-[#002366] border border-blue-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {activeTab === "orders" ? "الطلبات" : activeTab === "messages" ? "الرسائل" : "الاشتراك"}
                </h2>
                <div className="space-y-4">
                  {activeTab === "orders" ? (
                    <div className="space-y-4">
                      {fetchError ? (
                        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-6 text-red-300 text-center">{fetchError}</div>
                      ) : isOrdersLoading ? (
                        <div className="rounded-xl bg-white/5 p-6 text-blue-100 text-center">جارٍ تحميل الطلبات...</div>
                      ) : orders.length === 0 ? (
                        <div className="rounded-xl bg-white/5 p-6 text-blue-100 text-center">لا توجد طلبات جديدة حالياً. يمكنك إنشاء طلب جديد من خلال لوحة التحكم.</div>
                      ) : (
                        orders.map((order) => (
                          <div 
                            key={order.id} 
                            onClick={() => router.push(`/student/orders/${order.id}`)}
                            className="p-4 bg-white/5 rounded-xl space-y-4 cursor-pointer border border-transparent hover:bg-white/10 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${getStatusColor(order.status)}`}>
                                  {getStatusIcon(order.status)}
                                </div>
                                <div className="text-right">
                                  <h4 className="text-white font-medium">{order.title}</h4>
                                  <p className="text-blue-200 text-sm">المعرف: {order.id}</p>
                                </div>
                              </div>
                              <div className="text-left">
                                <p className="text-blue-100 text-sm">الموعد النهائي: {order.deadline}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
