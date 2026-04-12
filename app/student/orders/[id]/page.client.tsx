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
  Eye
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { supabase } from "@/lib/supabase";

interface OrderFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
}

interface TeacherMessage {
  id: string;
  teacher: string;
  message: string;
  time: string;
  isFromTeacher: boolean;
}

interface OrderDetails {
  id: string;
  title: string;
  service: string;
  status: "pending" | "in-progress" | "completed" | "revision";
  deadline: string;
  progress: number;
  teacher: string;
  notes: string;
  createdAt: string;
  files: OrderFile[];
  messages: TeacherMessage[];
}

interface OrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderDetailsPage({ params: paramsPromise }: OrderDetailsPageProps) {
  const router = useRouter();
  const [newMessage, setNewMessage] = useState("");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [params, setParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    paramsPromise.then(setParams);
  }, [paramsPromise]);

  useEffect(() => {
    if (!params?.id) return;

    const fetchOrder = async () => {
      if (!supabase) return;
      
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) return;

        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", params.id)
          .eq("user_id", userData.user.id)
          .single();

        if (data) {
          setOrderDetails({
            id: data.id.toString(),
            title: data.title || data.service || "طلب",
            service: data.service || "خدمة",
            status: data.status || "pending",
            deadline: data.deadline ? data.deadline.split("T")[0] : "",
            progress: data.progress || 0,
            teacher: data.teacher || "لم يتم التعيين",
            notes: data.notes || "",
            createdAt: data.created_at ? new Date(data.created_at).toLocaleDateString('ar-SA') : "",
            files: (data.attachments || []).map((f: any, i: number) => ({
              id: i.toString(),
              name: f.name,
              size: (f.size / 1024).toFixed(1) + " KB",
              type: f.type,
              uploadedAt: ""
            })),
            messages: []
          });
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
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-arial">جاري التحميل...</div>;
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center font-arial gap-4">
        <p>الطلب غير موجود أو لا تملك صلاحية الوصول إليه.</p>
        <Link href="/student">
          <Button className="bg-white text-[#002366]">العودة للوحة التحكم</Button>
        </Link>
      </div>
    );
  }

  const order = orderDetails;

  const getStatusColor = (status: OrderDetails["status"]) => {
    switch (status) {
      case "pending": return "text-yellow-400 bg-yellow-400/10 border-yellow-500/20";
      case "in-progress": return "text-blue-400 bg-blue-400/10 border-blue-500/20";
      case "completed": return "text-green-400 bg-green-400/10 border-green-500/20";
      case "revision": return "text-orange-400 bg-orange-400/10 border-orange-500/20";
      default: return "text-slate-400 bg-slate-400/10 border-slate-500/20";
    }
  };

  const getStatusIcon = (status: OrderDetails["status"]) => {
    switch (status) {
      case "pending": return <Clock className="h-5 w-5" />;
      case "in-progress": return <AlertCircle className="h-5 w-5" />;
      case "completed": return <CheckCircle className="h-5 w-5" />;
      case "revision": return <AlertCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusText = (status: OrderDetails["status"]) => {
    switch (status) {
      case "pending": return "في الانتظار";
      case "in-progress": return "قيد التنفيذ";
      case "completed": return "مكتمل";
      case "revision": return "مراجعة";
      default: return "غير محدد";
    }
  };

  const getFileIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("pdf")) return "📄";
    if (t.includes("word") || t.includes("doc")) return "📝";
    if (t.includes("image") || t.includes("png") || t.includes("jpg")) return "🖼️";
    return "📎";
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 font-arial">
      <header className="bg-[#002366] border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/student" className="text-blue-200 hover:text-white transition-colors">
                <ArrowRight className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-white">
                صرح
              </h1>
              <span className="text-blue-300">|</span>
              <span className="text-blue-100">تفاصيل الطلب</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-blue-200">
                الطلب #{order.id}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#002366] border border-blue-800 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-white mb-2">{order.title}</h2>
                  <p className="text-blue-300 font-medium">{order.service}</p>
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="text-sm font-medium">{getStatusText(order.status)}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-100">التقدم</span>
                  <span className="text-sm text-white font-medium">{order.progress}%</span>
                </div>
                <div className="w-full bg-blue-900 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${order.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-white" />
                  ملاحظات الطلب
                </h3>
                <p className="text-blue-100 leading-relaxed">{order.notes}</p>
              </div>
            </div>

            <div className="bg-[#002366] border border-blue-800 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Upload className="h-5 w-5 text-white" />
                الملفات المرفوعة
              </h3>
              <div className="space-y-4">
                {order.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-blue-800">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{getFileIcon(file.type)}</div>
                      <div className="text-right">
                        <h4 className="text-white font-medium">{file.name}</h4>
                        <p className="text-blue-200 text-sm">{file.size} • {file.uploadedAt}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-blue-800">
                <Button variant="outline" className="border-blue-700 text-blue-100 hover:bg-white/5">
                  <Upload className="h-4 w-4 mr-2" />
                  رفع ملف إضافي
                </Button>
              </div>
            </div>

            <div className="bg-[#002366] border border-blue-800 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-white" />
                المحادثة مع المعلم
              </h3>
              <div className="text-center p-8 bg-white/5 rounded-xl border border-blue-800/50">
                <p className="text-blue-100 mb-6">يمكنك التواصل مباشرة مع المعلم لمناقشة تفاصيل الطلب.</p>
                <Button 
                  onClick={() => router.push(`/student/chat?requestId=${order.id}`)}
                  className="bg-white text-[#002366] hover:bg-blue-50 font-bold px-8 py-4 rounded-xl shadow-lg"
                >
                  <MessageSquare className="h-5 w-5 ml-2" />
                  فتح المحادثة المباشرة
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#002366] border border-blue-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">ملخص الطلب</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">المعلم</span>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-300" />
                    <span className="text-white">{order.teacher}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">تاريخ الإنشاء</span>
                  <span className="text-white">{order.createdAt}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">الموعد النهائي</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-white" />
                    <span className="text-white">{order.deadline}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">الملفات</span>
                  <span className="text-white">{order.files.length} ملف</span>
                </div>
              </div>
            </div>

            <div className="bg-[#002366] border border-blue-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">إجراءات سريعة</h3>
              <div className="space-y-3">
                <Button className="w-full bg-white text-[#002366] hover:bg-blue-50">
                  <Eye className="h-4 w-4 mr-2" />
                  عرض العمل المكتمل
                </Button>
                <Button variant="outline" className="w-full border-blue-700 text-blue-100 hover:bg-white/5">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  طلب مراجعة
                </Button>
                <Button variant="outline" className="w-full border-blue-700 text-blue-100 hover:bg-white/5">
                  <Download className="h-4 w-4 mr-2" />
                  تحميل النتيجة النهائية
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
