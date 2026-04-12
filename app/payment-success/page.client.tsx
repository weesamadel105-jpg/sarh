"use client";

import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { CheckCircle2, CalendarDays } from "lucide-react";

export const metadata: Metadata = getPageMetadata("paymentSuccess");

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const planName = searchParams?.get("plan") || "الخطة المختارة";
  const endDate = searchParams?.get("end_date") || "غير محدد";

  return (
    <main dir="rtl" className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-3xl rounded-[32px] border border-slate-800 bg-slate-900/80 p-10 shadow-2xl shadow-slate-950/40">
        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/20">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">تم تفعيل الاشتراك</p>
            <h1 className="mt-4 text-4xl font-semibold text-white">تم تفعيل الاشتراك بنجاح</h1>
            <p className="mt-3 text-slate-400 text-base leading-7">
              شكراً لك على اختيار منصة صرح. الآن يمكنك الاستفادة من مزايا الباقة فوراً.
            </p>
          </div>
        </div>

        <div className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <div className="flex items-center justify-between gap-4 rounded-3xl bg-slate-900/80 px-5 py-4">
            <div>
              <p className="text-sm text-slate-400">اسم الباقة</p>
              <p className="mt-1 text-lg font-semibold text-white">{planName}</p>
            </div>
            <CalendarDays className="h-6 w-6 text-cyan-400" />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-3xl bg-slate-900/80 px-5 py-4">
            <div>
              <p className="text-sm text-slate-400">تاريخ الانتهاء</p>
              <p className="mt-1 text-lg font-semibold text-white">{endDate}</p>
            </div>
            <CalendarDays className="h-6 w-6 text-violet-400" />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/student" className="w-full sm:w-auto">
            <Button className="w-full rounded-3xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-400 hover:to-purple-500">
              العودة للوحة الطالب
            </Button>
          </Link>
          <Link href="/pricing" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full rounded-3xl border-slate-700 text-slate-200 hover:border-cyan-500/40 hover:text-white">
              مشاهدة خطط أخرى
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
