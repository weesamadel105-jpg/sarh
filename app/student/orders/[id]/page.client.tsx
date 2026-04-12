"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  MessageSquare,
  Calendar,
  Download,
  Upload,
  User,
  Send,
  Star,
  Eye,
  ChevronRight,
  Search,
  TrendingUp,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/shared/Button";

type OrderStatus = "new" | "under_review" | "in_progress" | "awaiting_revision" | "completed" | "delivered" | "pending" | "revision";

interface OrderFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
}

interface OrderDetails {
  id: string;
  title: string;
  service: string;
  status: OrderStatus;
  deadline: string;
  progress: number;
  teacher: string;
  notes: string;
  createdAt: string;
  files: OrderFile[];
}

interface OrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
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
    case "pending": return <Plus className="h-5 w-5" />;
    case "under_review": return <Search className="h-5 w-5" />;
    case "in_progress": return <TrendingUp className="h-5 w-5" />;
    case "awaiting_revision":
    case "revision": return <AlertCircle className="h-5 w-5" />;
    case "completed": return <CheckCircle className="h-5 w-5" />;
    case "delivered": return <Download className="h-5 w-5" />;
    default: return <Clock className="h-5 w-5" />;
  }
};

const timelineSteps: OrderStatus[] = [
  "new",
  "under_review",
  "in_progress",
  "awaiting_revision",
  "completed",
  "delivered"
];

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default function OrderDetailsPage({ params: paramsPromise }: OrderDetailsPageProps) {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [params, setParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    paramsPromise.then(setParams);
  }, [paramsPromise]);

  useEffect(() => {
    if (!params?.id) return;

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/student/orders`);
        if (response.ok) {
          const data = await response.json();
          const order = data.orders.find((o: any) => o.id === params.id);
          
          if (order) {
            setOrderDetails({
              id: order.id,
              title: order.title || "طلب",
              service: order.service || "خدمة",
              status: order.status as OrderStatus || "new",
              deadline: order.deadline || "",
              progress: order.progress || 0,
              teacher: order.teacher || "لم يتم التعيين بعد",
              notes: order.notes || "لا توجد ملاحظات إضافية.",
              createdAt: order.date ? new Date(order.date).toLocaleDateString('ar-SA') : "",
              files: (order.delivered_attachments || []).map((f: any, i: number) => ({
                id: i.toString(),
                name: f.name || `ملف ${i+1}`,
                size: "...",
                type: f.type || "file",
                uploadedAt: ""
              }))
            });
          }
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [params?.id]);

  if (isLoading || !params) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-primary-dark text-white flex flex-col items-center justify-center gap-6 p-4 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-10 w-10 text-text-secondary" />
        </div>
        <h2 className="text-2xl font-black">الطلب غير موجود</h2>
        <p className="text-text-secondary max-w-sm">الطلب الذي تبحث عنه غير موجود أو لا تملك صلاحية الوصول إليه.</p>
        <Link href="/student">
          <Button className="gold-gradient text-primary-dark font-black px-10 py-4 rounded-2xl">
            العودة للوحة التحكم
          </Button>
        </Link>
      </div>
    );
  }

  const currentStepIndex = timelineSteps.indexOf(orderDetails.status);

  return (
    <div dir="rtl" className="min-h-screen bg-primary-dark font-sans">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-gold/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] w-[30%] h-[30%] bg-primary-light/20 rounded-full blur-[100px]" />
      </div>

      <header className="sticky top-0 z-50 glass-card border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/student" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-secondary hover:text-gold hover:bg-white/10 transition-all">
              <ChevronRight className="h-6 w-6" />
            </Link>
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            <h1 className="text-lg sm:text-xl font-black text-white">تفاصيل الطلب <span className="text-gold">#{orderDetails.id.slice(0, 8)}</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/student/chat" className="p-2 text-text-secondary hover:text-gold transition-colors relative">
              <MessageSquare className="h-6 w-6" />
              <span className="absolute top-2 left-2 w-2 h-2 bg-gold rounded-full border-2 border-primary-dark" />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            {/* Status Timeline */}
            <section className="glass-card rounded-[2.5rem] p-8 border border-white/5">
              <h3 className="text-xl font-black text-white mb-8">حالة الطلب</h3>
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-2">
                {/* Timeline background line */}
                <div className="absolute top-1/2 left-[10%] right-[10%] h-1 bg-white/5 -translate-y-1/2 hidden md:block" />
                <div 
                  className="absolute top-1/2 right-[10%] h-1 gold-gradient -translate-y-1/2 hidden md:block transition-all duration-1000" 
                  style={{ width: `${(currentStepIndex / (timelineSteps.length - 1)) * 80}%`, right: '10%' }}
                />

                {timelineSteps.map((step, index) => {
                  const isActive = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  return (
                    <div key={step} className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 w-full md:w-auto">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-4 transition-all duration-500 flex items-center justify-center ${
                        isCurrent 
                          ? "gold-gradient border-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
                          : isActive 
                            ? "bg-gold border-gold" 
                            : "bg-primary-dark border-white/10"
                      }`}>
                        {isActive ? (
                          <CheckCircle className={`h-5 w-5 md:h-6 md:h-6 ${isCurrent ? "text-primary-dark" : "text-primary-dark"}`} />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-white/20" />
                        )}
                      </div>
                      <div className="text-right md:text-center">
                        <p className={`font-bold text-sm md:text-xs lg:text-sm ${isActive ? "text-white" : "text-text-secondary"}`}>
                          {getStatusLabel(step)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Order Info */}
            <section className="glass-card rounded-[2.5rem] p-8 border border-white/5">
              <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8 pb-8 border-b border-white/5">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">{orderDetails.title}</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-gold font-bold">{orderDetails.service}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <span className="text-text-secondary">تاريخ الإنشاء: {orderDetails.createdAt}</span>
                  </div>
                </div>
                <div className={`px-6 py-3 rounded-2xl border flex items-center gap-3 ${getStatusColor(orderDetails.status)}`}>
                  {getStatusIcon(orderDetails.status)}
                  <span className="font-bold">{getStatusLabel(orderDetails.status)}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gold" /> الملاحظات والتفاصيل
                  </h4>
                  <div className="bg-white/5 rounded-3xl p-6 text-text-secondary leading-relaxed border border-white/5">
                    {orderDetails.notes}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                    <p className="text-text-secondary text-sm mb-1 font-bold">الموعد النهائي</p>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gold" />
                      <p className="text-white font-bold text-lg">{orderDetails.deadline}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                    <p className="text-text-secondary text-sm mb-1 font-bold">المعلم المسؤول</p>
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gold" />
                      <p className="text-white font-bold text-lg">{orderDetails.teacher}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Files Section */}
            <section className="glass-card rounded-[2.5rem] p-8 border border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-white">الملفات المرفقة</h3>
                <Button className="bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-2">
                  <Upload className="h-4 w-4" /> رفع ملفات
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orderDetails.files.length > 0 ? (
                  orderDetails.files.map((file) => (
                    <div key={file.id} className="bg-white/5 rounded-3xl p-4 border border-white/5 flex items-center justify-between group hover:border-gold/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm truncate max-w-[150px]">{file.name}</p>
                          <p className="text-text-secondary text-xs">{file.size}</p>
                        </div>
                      </div>
                      <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-secondary hover:text-gold hover:bg-gold/10 transition-all">
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-text-secondary">لا توجد ملفات مرفوعة حالياً.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-8">
            {/* Quick Actions Card */}
            <section className="glass-card rounded-[2.5rem] p-8 border border-white/5">
              <h3 className="text-xl font-black text-white mb-6">إجراءات سريعة</h3>
              <div className="space-y-4">
                <Button 
                  onClick={() => router.push(`/student/chat?requestId=${orderDetails.id}`)}
                  className="w-full gold-gradient text-primary-dark font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-gold/10 hover:scale-[1.02] transition-transform"
                >
                  <MessageSquare className="h-5 w-5" /> تواصل مع المعلم
                </Button>
                <Button className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 border border-white/10 transition-all">
                  <Eye className="h-5 w-5" /> عرض مسودة العمل
                </Button>
                <Button className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 border border-white/10 transition-all">
                  <AlertCircle className="h-5 w-5" /> طلب تعديل
                </Button>
              </div>
            </section>

            {/* Satisfaction Card */}
            <section className="glass-card rounded-[2.5rem] p-8 border border-gold/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 gold-gradient" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                    <Star className="h-6 w-6 fill-gold" />
                  </div>
                  <h3 className="text-lg font-black text-white">ضمان الجودة</h3>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  نحن نضمن لك أفضل جودة أكاديمية. إذا لم تكن راضياً عن النتيجة، يمكنك طلب تعديلات غير محدودة حتى تصل للمستوى المطلوب.
                </p>
                <div className="flex items-center gap-2 text-gold font-bold text-sm">
                  <CheckCircle className="h-4 w-4" /> ضمان منصة صرح
                </div>
              </div>
            </section>

            {/* Help Card */}
            <section className="glass-card rounded-[2.5rem] p-8 border border-white/5">
              <h3 className="text-lg font-black text-white mb-4">هل لديك استفسار؟</h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                إذا واجهت أي مشكلة أو كان لديك استفسار حول هذا الطلب، يمكنك التواصل مع الدعم الفني مباشرة.
              </p>
              <Link href="/contact" className="text-gold font-bold hover:underline flex items-center gap-2">
                تواصل مع الدعم الفني <ChevronRight className="h-4 w-4" />
              </Link>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
