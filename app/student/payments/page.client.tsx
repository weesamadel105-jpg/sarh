"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/shared/Button";
import { ArrowLeft, ShieldCheck } from "lucide-react";

interface PaymentRecord {
  id: string;
  amount: string;
  status: string;
  created_at: string;
  payment_type: string;
  description: string | null;
  subscription: { plan_name: string } | null;
}

interface PaymentRow {
  id: string;
  invoiceNumber: string;
  planName: string;
  amount: string;
  status: string;
  date: string;
}

const statusLabels: Record<string, { label: string; classes: string }> = {
  completed: { label: "مكتمل", classes: "bg-emerald-500/10 text-emerald-300" },
  pending: { label: "قيد الانتظار", classes: "bg-amber-500/10 text-amber-300" },
  failed: { label: "فشل", classes: "bg-red-500/10 text-red-300" },
  refunded: { label: "مسترد", classes: "bg-violet-500/10 text-violet-300" },
  cancelled: { label: "ملغي", classes: "bg-slate-500/10 text-slate-300" },
};

export default function StudentPaymentsPage() {
  // Add safe fallback for supabase
  if (!supabase) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">الخدمة مؤقتًا غير متاحة</div>;
  }

  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadPayments = async () => {
      if (!supabase) return;
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        router.push("/login?redirect=/student/payments");
        return;
      }

      const { data, error } = await supabase
        .from("payments")
        .select("id, amount, status, created_at, payment_type, description")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        // TODO: Handle payments loading error
        setErrorMessage("حدث خطأ أثناء تحميل الفواتير. حاول مرة أخرى لاحقًا.");
      } else if (data) {
        setPayments(
          data.map((payment) => {
            const invoiceNumber = payment.id.split("-")[0].toUpperCase();
            const planName = payment.description || (payment.payment_type === "subscription" ? "اشتراك" : "دفعة" );
            const amount = `${payment.amount}`;
            const date = new Date(payment.created_at).toLocaleDateString("ar-SA", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });

            return {
              id: payment.id,
              invoiceNumber,
              planName,
              amount,
              status: payment.status,
              date,
            };
          })
        );
      }

      setIsLoading(false);
    };

    loadPayments();
  }, [router]);

  return (
    <main dir="rtl" className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">الفواتير</p>
            <h1 className="mt-3 text-4xl font-bold text-white">سجل المدفوعات والاشتراكات</h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              راجع جميع فواتيرك الأخيرة وتحقق من حالة الدفع لكل باقة تم تفعيلها عبر المنصة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/student" className="inline-flex items-center gap-2 rounded-3xl border border-slate-800 bg-slate-900/70 px-5 py-3 text-sm text-slate-200 transition hover:border-cyan-500/40 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> الرجوع إلى لوحة الطالب
            </Link>
            <Button className="rounded-3xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-400 hover:to-purple-500">
              ادفع فاتورة جديدة
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/20">
          <div className="mb-6 flex items-center justify-between gap-4 rounded-3xl bg-slate-950/80 px-5 py-4 text-slate-300">
            <div>
              <p className="text-sm text-slate-400">إجمالي الفواتير</p>
              <p className="mt-1 text-3xl font-semibold text-white">{payments.length}</p>
            </div>
            <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-800/80 px-4 py-3 text-slate-300">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
              <span>عناوين مشفرة وآمنة لجميع المدفوعات</span>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-3xl border border-slate-800/60 bg-slate-950/80 p-10 text-center text-slate-400">
              جاري تحميل الفواتير...
            </div>
          ) : errorMessage ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-red-200">
              {errorMessage}
            </div>
          ) : payments.length === 0 ? (
            <div className="rounded-3xl border border-slate-800/60 bg-slate-950/80 p-10 text-center text-slate-400">
              لا يوجد فواتير لعرضها بعد. قم بتفعيل اشتراك جديد أو اطلب خدمة اليوم.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-3 text-sm">
                <thead>
                  <tr className="text-right text-xs uppercase tracking-[0.2em] text-slate-500">
                    <th className="px-4 py-3">رقم الفاتورة</th>
                    <th className="px-4 py-3">الباقة</th>
                    <th className="px-4 py-3">المبلغ</th>
                    <th className="px-4 py-3">الحالة</th>
                    <th className="px-4 py-3">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="bg-slate-900/80 text-slate-200 shadow-sm shadow-slate-950/20">
                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-white">#{payment.invoiceNumber}</td>
                      <td className="px-4 py-4">{payment.planName}</td>
                      <td className="px-4 py-4">{payment.amount}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusLabels[payment.status]?.classes || "bg-slate-700 text-slate-200"}`}>
                          {statusLabels[payment.status]?.label || payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">{payment.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
