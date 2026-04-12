"use client";

import Navbar from "@/components/shared/Navbar";
import { 
  FileText, 
  PenTool, 
  BookOpen, 
  Layout, 
  Search, 
  ClipboardList, 
  Edit3, 
  FileSearch, 
  Image as ImageIcon, 
  Calendar,
  ShieldCheck,
  Zap,
  Award,
  ArrowRight
} from "lucide-react";

export default function HomePage() {
  const services = [
    {
      title: "حل الاسايمنت",
      description: "تنفيذ أكاديمي دقيق لجميع التكليفات الجامعية بجودة عالية وتسليم منظم.",
      icon: <FileText className="w-10 h-10 text-[#00BCD4]" />
    },
    {
      title: "حل الامتحانات",
      description: "دعم احترافي للاختبارات والاختبارات القصيرة مع متابعة كاملة.",
      icon: <PenTool className="w-10 h-10 text-[#00BCD4]" />
    },
    {
      title: "حل الواجبات",
      description: "إنجاز الواجبات اليومية والأسبوعية بشكل احترافي وسريع.",
      icon: <BookOpen className="w-10 h-10 text-[#00BCD4]" />
    },
    {
      title: "تنفيذ البروجكت",
      description: "تنفيذ المشاريع الجامعية باحترافية مع عرض منظم ونتائج مميزة.",
      icon: <Layout className="w-10 h-10 text-[#00BCD4]" />
    },
    {
      title: "إعداد البحوث",
      description: "إعداد بحوث أكاديمية موثقة ومنسقة بأسلوب علمي حديث.",
      icon: <Search className="w-10 h-10 text-[#00BCD4]" />
    },
    {
      title: "كتابة التقارير",
      description: "صياغة تقارير احترافية واضحة ومنظمة حسب متطلبات الجامعة.",
      icon: <ClipboardList className="w-10 h-10 text-[#00BCD4]" />
    },
    {
      title: "كتابة المقالات",
      description: "مقالات أكاديمية وأدبية بأسلوب قوي ولغة احترافية مميزة.",
      icon: <Edit3 className="w-10 h-10 text-[#00BCD4]" />
    },
    {
      title: "التلخيصات الاحترافية",
      description: "تلخيص شامل للمحاضرات والملفات بطريقة ذكية وسهلة الفهم.",
      icon: <FileSearch className="w-10 h-10 text-[#00BCD4]" />
    },
    {
      title: "تصميم البوسترات",
      description: "تصميم بوسترات تعليمية ومشاريع عرض جذابة بمستوى عالمي.",
      icon: <ImageIcon className="w-10 h-10 text-[#00BCD4]" />
    },
    {
      title: "الاشتراك الفصلي",
      description: "خطة متكاملة تغطي جميع خدماتك الأكاديمية طوال الفصل الدراسي.",
      icon: <Calendar className="w-10 h-10 text-[#00BCD4]" />
    },
  ];

  const trustItems = [
    {
      title: "سرية تامة",
      icon: <ShieldCheck className="w-12 h-12 text-[#00BCD4] mb-4" />
    },
    {
      title: "تسليم سريع",
      icon: <Zap className="w-12 h-12 text-[#00BCD4] mb-4" />
    },
    {
      title: "جودة أكاديمية عالية",
      icon: <Award className="w-12 h-12 text-[#00BCD4] mb-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D47A1] text-white font-[Arial]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">منصة صرح العالمية</h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-10 leading-relaxed">
            جميع خدمات الطلاب الجامعيين في مكان واحد بأسلوب احترافي وسري وسريع
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <a 
              href="/login" 
              className="w-full md:w-auto px-10 py-4 bg-[#00BCD4] hover:bg-[#00ACC1] text-white font-bold rounded-full transition-colors text-lg"
            >
              ابدأ طلبك الآن
            </a>
            <a 
              href="#services" 
              className="w-full md:w-auto px-10 py-4 border-2 border-[#00BCD4] text-[#00BCD4] hover:bg-[#00BCD4] hover:text-white font-bold rounded-full transition-colors text-lg"
            >
              استعرض الخدمات
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">خدماتنا الاحترافية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 justify-center">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl"
              >
                <div className="mb-6">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-slate-300 text-sm mb-6 flex-grow">{service.description}</p>
                <a 
                  href="/login" 
                  className="w-full py-2 bg-[#00BCD4] hover:bg-[#00ACC1] text-white font-bold rounded-lg transition-colors"
                >
                  طلب الخدمة
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 bg-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustItems.map((item, index) => (
              <div 
                key={index} 
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-10 flex flex-col items-center text-center shadow-xl"
              >
                {item.icon}
                <h3 className="text-2xl font-bold">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">ابدأ رحلتك الدراسية معنا</h2>
          <a 
            href="/login" 
            className="inline-block px-12 py-5 bg-[#00BCD4] hover:bg-[#00ACC1] text-white font-extrabold rounded-full transition-colors text-xl shadow-2xl"
          >
            دخول الطالب
          </a>
        </div>
      </section>

      {/* Footer (keeping it clean) */}
      <footer className="py-10 border-t border-white/10 text-center text-slate-400">
        <p>© 2026 منصة صرح العالمية - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
