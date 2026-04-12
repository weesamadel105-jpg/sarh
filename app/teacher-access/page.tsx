"use client";

import { motion } from "framer-motion";
import { Crown, FileText, Users, Shield, Clock, Star, Award, BookOpen, MessageCircle, Calendar, TrendingUp, Lock } from "lucide-react";
import Link from "next/link";

const features = [
  { icon: Users, title: "إدارة الطلاب", description: "متابعة جميع طلابك في مكان واحد", coming: "قريباً" },
  { icon: FileText, title: "الطلبات الواردة", description: "استقبال وإدارة طلبات الخدمات", coming: "قريباً" },
  { icon: MessageCircle, title: "التواصل المباشر", description: "محادثة فورية مع الطلاب", coming: "قريباً" },
  { icon: Calendar, title: "جدولة المواعيد", description: "تنظيم وقت العمل والمواعيد النهائية", coming: "قريباً" },
  { icon: TrendingUp, title: "الإحصائيات", description: "تتبع الأداء والإيرادات", coming: "قريباً" },
  { icon: Award, title: "نظام التقييم", description: "تقييم الطلاب والخدمات", coming: "قريباً" },
];

const stats = [
  { label: "المعلمون", value: "+50", suffix: "" },
  { label: "الطلبات المتوقعة", value: "+1,000", suffix: "" },
  { label: "الإيرادات المتوقعة", value: "+500", suffix: "K" },
];

export default function TeacherAccessPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white overflow-hidden">
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500,700,800,900&display=swap'); body { font-family: 'Tajawal', sans-serif; }`}</style>
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(13,71,161,0.3),transparent)]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#0D47A1]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#42A5F5]/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-[#0D47A1]/10 backdrop-blur-xl border-b border-[#0D47A1]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0D47A1] via-[#1976D2] to-[#42A5F5] rounded-xl flex items-center justify-center shadow-lg shadow-[#0D47A1]/30">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black bg-gradient-to-l from-[#42A5F5] to-[#90CAF9] bg-clip-text text-transparent">منصة صرح</span>
                <span className="text-slate-400 text-sm mr-2">| بوابة المعلمين</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#0D47A1]/20 border border-[#42A5F5]/30 rounded-full">
              <Lock className="h-4 w-4 text-[#42A5F5]" />
              <span className="text-[#42A5F5] text-sm font-bold">وصول محصور</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#42A5F5]/20 border border-[#42A5F5]/50 rounded-full text-[#42A5F5] text-sm font-bold mb-8">
              <Clock className="h-4 w-4" /> المرحلة الثانية - قيد التطوير
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-l from-[#0D47A1] via-[#1976D2] to-[#42A5F5] bg-clip-text text-transparent">بوابة المعلمين</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              نحن نبني تجربة متميزة للمعلمين والمتخصصين<br className="hidden md:block" />
              للانضمام إلى شبكة صرح الأكاديمية
            </p>

            <div className="flex items-center justify-center gap-3 mb-12">
              <div className="flex -space-x-3 rtl:space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0D47A1] to-[#42A5F5] border-2 border-[#0a0f1a] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="text-slate-400 text-sm">+50 معلم ينتظرون الإطلاق</span>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="bg-[#0D47A1]/10 backdrop-blur-sm border border-[#0D47A1]/30 rounded-2xl p-6 hover:border-[#42A5F5]/50 transition-all">
                <p className="text-4xl md:text-5xl font-black text-[#42A5F5] mb-2">{stat.value}</p>
                <p className="text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12 text-white">المميزات المستقبلية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className="group bg-[#0D47A1]/10 backdrop-blur-sm border border-[#0D47A1]/30 rounded-2xl p-6 hover:border-[#42A5F5]/50 transition-all relative overflow-hidden">
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-[#42A5F5]/20 text-[#42A5F5] text-xs font-bold rounded-full">{feature.coming}</span>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-[#0D47A1] to-[#42A5F5] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#42A5F5] transition-colors">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Notification Signup */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-gradient-to-r from-[#0D47A1]/30 to-[#42A5F5]/20 border border-[#42A5F5]/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
          <div className="relative z-10">
            <Shield className="h-12 w-12 text-[#42A5F5] mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">سجل اهتمامك المبكر</h3>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">كن من أوائل المعلمين الذين ينضمون إلى منصة صرح. احصل على وصول مبكر ومزايا حصرية.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input type="email" placeholder="بريدك الإلكتروني" className="flex-1 px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white text-center focus:border-[#42A5F5] focus:outline-none" readOnly />
            </div>
            <p className="text-slate-500 text-sm mt-4">النظام مغلق حالياً للتسجيل</p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#0D47A1]/30 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0D47A1] via-[#1976D2] to-[#42A5F5] rounded-xl flex items-center justify-center">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black text-white">منصة صرح</span>
          </div>
          <p className="text-slate-500 text-sm">جميع الحقوق محفوظة © 2026 | قيد التطوير</p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <Link href="/preview" className="text-[#42A5F5] hover:text-white transition-colors">الصفحة الرئيسية</Link>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">وصول محصور - المرحلة 2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
