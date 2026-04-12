"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/shared/Button";
import { supabase } from "@/lib/supabase";
import { getPageMetadata } from "@/lib/seo";
import { Star, Sparkles } from "lucide-react";

export const metadata: Metadata = getPageMetadata("pricing");

interface Plan {
  name: string;
  price: string;
  period: string;
  highlight: boolean;
  description: string;
  durationDays: number;
  features: string[];
}

const plans: Plan[] = [
  {
    name: "الأساسية",
    price: "",
    period: "",
    highlight: false,
    description: "حزمة البداية المناسبة للطلاب الذين يحتاجون دعمًا منتظمًا.",
    durationDays: 30,
    features: [
      "متابعة 3 مهام شهريًا",
      "مراجعة نصوص وأبحاث قصيرة",
      "دعم عبر الرسائل الالكترونية",
      "رفع ملفات حتى 10 ميجا",
    ],
  },
  {
    name: "الاحترافية",
    price: "",
    period: "",
    highlight: true,
    description: "الخطة الأكثر شهرة للطلاب الجادين الباحثين عن نتائج أسرع ودعم أعمق.",
    durationDays: 30,
    features: [
      "متابعة 10 مهام شهريًا",
      "كتابة أبحاث ومقالات احترافية",
      "دعم فوري وأولوية رد",
      "رفع ملفات حتى 50 ميجا",
      "تعديلات مجانية مرتين شهريًا",
    ],
  },
  {
    name: "الفصلية",
    price: "",
    period: "",
    highlight: false,
    description: "خطة شاملة تغطي جميع خدماتك الأكاديمية طوال الفصل الدراسي.",
    durationDays: 90,
    features: [
      "عدد غير محدود من الطلبات",
      "جلسات مراجعة أسبوعية",
      "تقارير تقدم دورية",
      "دعم أكاديمي كامل",
    ],
  },
  {
    name: "VIP",
    price: "",
    period: "",
    highlight: false,
    description: "التجربة الفاخرة مع مدير حساب خاص ودعم شامل لكل التفاصيل التعليمية.",
    durationDays: 30,
    features: [
      "مدير حساب شخصي",
      "دعم 24/7 عبر واتساب ومكالمات",
      "مراجعات لا نهائية",
      "خطة دراسة مخصصة",
      "تسليم فائق السرعة",
    ],
  },
];

export default function PricingPage() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubscribe = async (plan: Plan) => {
    router.push(`/student/new-order?service=term-subscription`);
  };

  return (
    <main dir="rtl" className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden bg-slate-950 py-20">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              <Sparkles className="h-4 w-4" /> خدماتنا المتميزة
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              اختر الخدمة المناسبة لنجاحك الأكاديمي
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400 text-lg leading-8">
              نقدم لك باقات احترافية مصممة لخدمات تعليمية عالية الجودة، من الدعم الشهري إلى تجربة VIP المخصصة بالكامل.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr]">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative overflow-hidden rounded-[32px] border p-8 shadow-2xl transition-all duration-300 ${
                  plan.highlight
                    ? "border-cyan-500/40 bg-slate-900/90 shadow-cyan-500/10"
                    : "border-slate-800/70 bg-slate-900/80 hover:border-slate-600/70"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-cyan-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950 shadow-lg shadow-cyan-500/20">
                    مُوصى بها
                  </div>
                )}

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                      {plan.name}
                    </p>
                  </div>
                  {plan.highlight ? (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 shadow-inner shadow-cyan-500/10">
                      <Star className="h-6 w-6" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                      <span className="text-lg font-semibold">{plan.name[0]}</span>
                    </div>
                  )}
                </div>

                <p className="mt-6 text-slate-400 leading-relaxed">{plan.description}</p>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-slate-300">
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300">
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan)}
                  className={`mt-10 w-full rounded-3xl px-5 py-4 text-sm font-semibold transition-all duration-300 ${
                    plan.highlight
                      ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-xl shadow-cyan-500/20 hover:from-cyan-400 hover:to-purple-500"
                      : "bg-slate-700 text-white hover:bg-slate-600"
                  }`}
                >
                  طلب الخدمة
                </Button>
              </div>
            ))}
          </div>

          {statusMessage && (
            <div className="mb-6 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-5 text-cyan-100">
              {statusMessage}
            </div>
          )}

          <div className="mt-12 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-300">
            <h2 className="text-xl font-semibold text-white">لماذا تختار صرح؟</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-5">
                <p className="text-sm text-cyan-300">دعم احترافي</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">فريق متخصص يدعمك في كل مرحلة دراسية.</p>
              </div>
              <div className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-5">
                <p className="text-sm text-cyan-300">مرونة كاملة</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">اختر الخطة التي تناسب جدولك الدراسي واحتياجاتك.</p>
              </div>
              <div className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-5">
                <p className="text-sm text-cyan-300">أمان وخصوصية</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">حماية بياناتك وملفاتك مع أعلى معايير الخصوصية.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
