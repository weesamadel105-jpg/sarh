import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Award
} from 'lucide-react';
import { services } from '@/lib/services-data';

export default function Home() {
  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 font-arial text-white overflow-x-hidden">
      {/* Hero Section */}
      <header className="relative bg-[#002366] py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-white drop-shadow-lg">
            منصة صرح العالمية
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            جميع خدمات الطلاب الجامعيين في مكان واحد<br />
            بأسلوب احترافي وسري وسريع
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/student" 
              className="w-full sm:w-auto px-12 py-4 bg-white text-[#002366] font-bold text-lg rounded-2xl shadow-xl flex items-center justify-center gap-2"
            >
              دخول الطلاب
              <ArrowRight className="h-6 w-6" />
            </Link>
            <Link 
              href="#services" 
              className="w-full sm:w-auto px-12 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white font-bold text-lg rounded-2xl flex items-center justify-center"
            >
              استعرض الخدمات
            </Link>
          </div>
        </div>
      </header>

      {/* Trust Section */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-6 bg-[#002366]/30 rounded-2xl border border-blue-900/50">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <ShieldCheck className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">سرية تامة</h3>
                <p className="text-slate-400 text-sm">نحافظ على خصوصية بياناتك بأعلى معايير الأمان الأكاديمية.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-[#002366]/30 rounded-2xl border border-blue-900/50">
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">تسليم سريع</h3>
                <p className="text-slate-400 text-sm">نلتزم بالمواعيد مع ضمان الجودة والتميز في كل طلب مقدم.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-[#002366]/30 rounded-2xl border border-blue-900/50">
              <div className="bg-amber-500/20 p-3 rounded-xl">
                <Award className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">جودة أكاديمية</h3>
                <p className="text-slate-400 text-sm">فريق متخصص من الخبراء الأكاديميين لضمان التميز والنجاح.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">خدماتنا المتميزة</h2>
            <div className="w-20 h-1.5 bg-blue-500 mx-auto rounded-full"></div>
            <p className="text-lg text-blue-100/70 mt-4 max-w-2xl mx-auto">نقدم لك مجموعة شاملة من الخدمات الأكاديمية بجودة عالية</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 max-w-6xl mx-auto">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="bg-[#002366] border border-blue-800 rounded-2xl p-6 text-center shadow-lg transition-none flex flex-col items-center justify-between"
              >
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <service.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-base font-bold mb-2 text-white">{service.title}</h3>
                <p className="text-blue-100 text-[11px] mb-4 leading-relaxed line-clamp-2">{service.description}</p>
                <Link 
                  href={`/student/new-order?service=${service.id}`}
                  className="w-full px-3 py-2 bg-white text-[#002366] text-xs font-bold rounded-lg shadow-md flex items-center justify-center gap-1 mt-auto"
                >
                  طلب الخدمة
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 px-4 bg-[#002366]/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">ابدأ رحلتك الدراسية معنا</h2>
          <Link 
            href="/student" 
            className="inline-block px-12 py-4 bg-white text-[#002366] font-bold text-lg rounded-2xl shadow-xl transition-all hover:bg-blue-50"
          >
            دخول الطلاب
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#002366] rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-white">ص</span>
            </div>
            <h2 className="text-2xl font-bold text-white">منصة صرح</h2>
          </div>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            جميع الحقوق محفوظة © 2026. نحن هنا لخدمتكم وتطوير مسيرتكم التعليمية.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">سياسة الخصوصية</Link>
            <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">الشروط والأحكام</Link>
            <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">اتصل بنا</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
