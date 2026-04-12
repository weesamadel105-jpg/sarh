"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Crown,
  FileText,
  RefreshCw,
  Star,
  TrendingUp,
  Zap
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { supabase } from "@/lib/supabase";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
  popular?: boolean;
  requests: number;
}

interface CurrentSubscription {
  plan: string;
  status: "active" | "expiring" | "expired";
  expiryDate: string;
  totalRequests: number;
  usedRequests: number;
  autoRenew: boolean;
  nextBillingDate: string;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "الأساسي",
    price: 0,
    currency: "",
    period: "",
    requests: 5,
    features: [
      "5 طلبات شهرياً",
      "دعم أساسي",
      "تسليم خلال 48 ساعة",
      "مراجعة واحدة مجانية"
    ]
  },
  {
    id: "pro",
    name: "برو فصلي",
    price: 0,
    currency: "",
    period: "",
    requests: 15,
    popular: true,
    features: [
      "15 طلب شهرياً",
      "أولوية في التنفيذ",
      "تسليم خلال 24 ساعة",
      "مراجعات غير محدودة",
      "دعم مباشر 24/7",
      "خصومات على الخدمات الإضافية"
    ]
  },
  {
    id: "premium",
    name: "بريميوم",
    price: 0,
    currency: "",
    period: "",
    requests: 30,
    features: [
      "30 طلب شهرياً",
      "أولوية قصوى",
      "تسليم خلال 12 ساعة",
      "مراجعات غير محدودة",
      "دعم VIP",
      "استشارات مجانية",
      "خصومات تصل إلى 50%"
    ]
  }
];

const currentSubscription: CurrentSubscription = {
  plan: "برو فصلي",
  status: "active",
  expiryDate: "31 ديسمبر 2024",
  totalRequests: 15,
  usedRequests: 3,
  autoRenew: true,
  nextBillingDate: "1 يناير 2025"
};

const usageHistory = [
  { month: "يناير", used: 12, total: 15 },
  { month: "فبراير", used: 8, total: 15 },
  { month: "مارس", used: 15, total: 15 },
  { month: "أبريل", used: 3, total: 15 }
];

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const remainingRequests = currentSubscription.totalRequests - currentSubscription.usedRequests;
  const usagePercentage = (currentSubscription.usedRequests / currentSubscription.totalRequests) * 100;

  const getStatusColor = (status: CurrentSubscription["status"]) => {
    switch (status) {
      case "active": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "expiring": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "expired": return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getStatusText = (status: CurrentSubscription["status"]) => {
    switch (status) {
      case "active": return "نشط";
      case "expiring": return "ينتهي قريباً";
      case "expired": return "منتهي الصلاحية";
      default: return "غير محدد";
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/student" className="text-slate-400 hover:text-white transition-colors">
                <ArrowRight className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-l from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                صرح
              </h1>
              <span className="text-slate-400">|</span>
              <span className="text-slate-300">الاشتراك</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Subscription */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">الاشتراك الحالي</h2>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(currentSubscription.status)}`}>
                  <div className={`w-2 h-2 rounded-full ${
                    currentSubscription.status === "active" ? "bg-green-400" :
                    currentSubscription.status === "expiring" ? "bg-amber-400" : "bg-red-400"
                  }`}></div>
                  <span className="text-sm font-medium">{getStatusText(currentSubscription.status)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-l from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Crown className="h-8 w-8 text-cyan-400" />
                    <div>
                      <h3 className="text-xl font-semibold text-white">{currentSubscription.plan}</h3>
                      <p className="text-slate-400">الخطة النشطة</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">الطلبات المستخدمة</span>
                      <span className="text-white font-semibold">{currentSubscription.usedRequests} / {currentSubscription.totalRequests}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-l from-cyan-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${usagePercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">المتبقي</span>
                      <span className="text-cyan-400 font-semibold">{remainingRequests} طلب</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Calendar className="h-8 w-8 text-amber-400" />
                    <div>
                      <h3 className="text-xl font-semibold text-white">تواريخ مهمة</h3>
                      <p className="text-slate-400">جدولة الاشتراك</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-slate-400 text-sm">ينتهي في</p>
                      <p className="text-white font-semibold">{currentSubscription.expiryDate}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">التجديد التالي</p>
                      <p className="text-white font-semibold">{currentSubscription.nextBillingDate}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <RefreshCw className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm">التجديد التلقائي مفعل</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1 bg-gradient-to-l from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  تجديد الاشتراك
                </Button>
                <Button variant="outline" className="border-slate-600/50 text-slate-300 hover:bg-slate-800/50">
                  <CreditCard className="h-4 w-4 mr-2" />
                  إدارة الدفع
                </Button>
              </div>
            </motion.div>

            {/* Usage History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                تاريخ الاستخدام
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {usageHistory.map((month) => (
                  <div key={month.month} className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <h4 className="text-white font-semibold mb-2">{month.month}</h4>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-cyan-400">{month.used}</div>
                      <div className="text-xs text-slate-400">من {month.total}</div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-l from-cyan-500 to-purple-600 h-2 rounded-full"
                          style={{ width: `${(month.used / month.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Available Plans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-6">خطط الاشتراك المتاحة</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative bg-slate-800/50 border rounded-2xl p-6 transition-all hover:border-cyan-500/50 ${
                      plan.popular ? "border-cyan-500/50 bg-gradient-to-b from-cyan-500/5 to-transparent" : "border-slate-700/50"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-l from-cyan-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                          الأكثر شعبية
                        </div>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h4 className="text-xl font-semibold text-white mb-2">{plan.name}</h4>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3 text-slate-300 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${
                        plan.id === "pro"
                          ? "bg-gradient-to-l from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                          : "border-slate-600/50 text-slate-300 hover:bg-slate-800/50"
                      }`}
                      variant={plan.id === "pro" ? "default" : "outline"}
                    >
                      {plan.id === "pro" ? "الخطة الحالية" : "ترقية"}
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">إحصائيات سريعة</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-cyan-400" />
                    <span className="text-slate-400">إجمالي الطلبات</span>
                  </div>
                  <span className="text-white font-semibold">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-slate-400">مكتملة</span>
                  </div>
                  <span className="text-white font-semibold">42</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-amber-400" />
                    <span className="text-slate-400">قيد التنفيذ</span>
                  </div>
                  <span className="text-white font-semibold">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="text-slate-400">متوسط التقييم</span>
                  </div>
                  <span className="text-white font-semibold">4.8</span>
                </div>
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-b from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-cyan-400" />
                مزايا الاشتراك
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">أولوية في معالجة الطلبات</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">تسليم أسرع بنسبة 50%</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">دعم فني على مدار 24 ساعة</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">خصومات على الخدمات الإضافية</span>
                </li>
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center"
            >
              <h3 className="text-lg font-semibold text-white mb-2">تحتاج مساعدة؟</h3>
              <p className="text-slate-400 text-sm mb-4">فريق الدعم متاح 24/7</p>
              <Button className="w-full bg-gradient-to-l from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                تواصل مع الدعم
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}