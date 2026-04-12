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
  ArrowRight,
  Sparkles,
  ChevronRight,
  Star,
  CheckCircle,
  Clock,
  MessageCircle,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/shared/Button";

export default function HomePage() {
  const services = [
    {
      id: "assignments-solution",
      title: "حل الاسايمنت",
      description: "تنفيذ أكاديمي دقيق لجميع التكليفات الجامعية بجودة عالية وتسليم منظم.",
      icon: <FileText className="w-10 h-10 text-gold" />
    },
    {
      id: "exams-solution",
      title: "حل الامتحانات",
      description: "دعم احترافي للاختبارات والاختبارات القصيرة مع متابعة كاملة.",
      icon: <PenTool className="w-10 h-10 text-gold" />
    },
    {
      id: "projects",
      title: "تنفيذ البروجكت",
      description: "تنفيذ المشاريع الجامعية باحترافية مع عرض منظم ونتائج مميزة.",
      icon: <Layout className="w-10 h-10 text-gold" />
    },
    {
      id: "research",
      title: "إعداد البحوث",
      description: "إعداد بحوث أكاديمية موثقة ومنسقة بأسلوب علمي حديث.",
      icon: <Search className="w-10 h-10 text-gold" />
    },
    {
      id: "term-subscription",
      title: "الاشتراك الفصلي",
      description: "خطة متكاملة تغطي جميع خدماتك الأكاديمية طوال الفصل الدراسي.",
      icon: <Calendar className="w-10 h-10 text-gold" />
    },
  ];

  const trustItems = [
    {
      title: "سرية تامة",
      description: "تشفير كامل لجميع بياناتك وتكليفاتك بضمان الخصوصية.",
      icon: <ShieldCheck className="w-14 h-14 text-gold mb-6" />
    },
    {
      title: "تسليم سريع",
      description: "نلتزم بمواعيدك مهما كانت ضيقة، تسليم فوري ودقيق.",
      icon: <Zap className="w-14 h-14 text-gold mb-6" />
    },
    {
      title: "جودة أكاديمية",
      description: "نخبة من الأكاديميين المتخصصين لضمان أعلى التقييمات.",
      icon: <Award className="w-14 h-14 text-gold mb-6" />
    }
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-primary-dark text-white font-sans selection:bg-gold/30 overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-gold/10 rounded-full blur-[180px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-primary-light/20 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] opacity-5" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-10 shadow-xl"
          >
            <Sparkles className="w-5 h-5 text-gold animate-pulse" />
            <span className="text-gold font-black text-xs uppercase tracking-[0.3em]">الخيار الأول لطلاب الخليج</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-10 leading-[1.05] tracking-tight"
          >
            ارتقِ بتجربتك <br /> 
            <span className="text-gold">الأكاديمية</span> للقمة.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-text-secondary mb-14 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            منصة صرح تقدم خدمات تعليمية فاخرة بلمسة احترافية، نضمن لك التميز، السرعة، والخصوصية التامة في كل خطوة.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto px-14 py-6 gold-gradient text-primary-dark font-black rounded-[1.5rem] text-2xl shadow-2xl shadow-gold/30 hover:scale-105 active:scale-95 transition-all">
                ابدأ رحلة النجاح
              </Button>
            </Link>
            <Link href="/why-sarh" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto px-14 py-6 bg-white/5 border border-white/10 text-white font-black rounded-[1.5rem] text-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                لماذا صرح؟ <ChevronRight className="h-6 w-6" />
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.6 }}
            className="mt-24 flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
          >
            <div className="flex items-center gap-3 font-black text-lg">
              <Users className="h-6 w-6 text-gold" /> +10,000 طالب
            </div>
            <div className="flex items-center gap-3 font-black text-lg">
              <Star className="h-6 w-6 text-gold fill-gold" /> 4.9/5 تقييم
            </div>
            <div className="flex items-center gap-3 font-black text-lg">
              <ShieldCheck className="h-6 w-6 text-gold" /> 100% سرية تامة
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Quick View */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
             { label: "تسليم سريع", value: "24h", icon: Clock },
             { label: "جودة مضمونة", value: "A+", icon: Award },
             { label: "دعم مباشر", value: "Live", icon: MessageCircle },
             { label: "دفع آمن", value: "SSL", icon: ShieldCheck }
           ].map((item, i) => (
             <div key={i} className="flex flex-col items-center gap-2">
               <item.icon className="h-8 w-8 text-gold opacity-50 mb-2" />
               <p className="text-3xl font-black text-white">{item.value}</p>
               <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest">{item.label}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">خدماتنا <span className="text-gold">الاستثنائية</span></h2>
            <p className="text-text-secondary text-xl max-w-2xl mx-auto leading-relaxed">نقدم باقة متكاملة من الخدمات الأكاديمية المصممة بعناية لتلبية طموحاتك وتحقيق أعلى الدرجات.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-[2.5rem] p-10 border border-white/5 hover:border-gold/30 transition-all group relative overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold/5 rounded-full blur-2xl group-hover:bg-gold/10 transition-all" />
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-gold/10 transition-all duration-500">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-gold transition-colors">{service.title}</h3>
                  <p className="text-text-secondary text-lg mb-8 leading-relaxed">{service.description}</p>
                  <Link 
                    href={`/student/new-order?service=${service.id}`} 
                    className="inline-flex items-center gap-2 text-gold font-black text-sm uppercase tracking-widest group/link"
                  >
                    اطلب الآن <ArrowRight className="h-4 w-4 group-hover/link:translate-x-[-6px] transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32 px-6 bg-white/[0.02] relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {trustItems.map((item, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-center p-10 flex flex-col items-center"
              >
                <div className="hover:scale-110 transition-transform duration-500">{item.icon}</div>
                <h3 className="text-3xl font-black mb-4 text-white">{item.title}</h3>
                <p className="text-text-secondary text-lg leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-gold/5 rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-10 leading-tight">ابدأ رحلتك الدراسية <br /> <span className="text-gold">الاستثنائية</span> اليوم.</h2>
          <p className="text-2xl text-text-secondary mb-14 max-w-2xl mx-auto leading-relaxed">انضم لأكثر من 10,000 طالب وثقوا بصرح كشريك لنجاحهم الأكاديمي.</p>
          <Link href="/login">
            <Button className="px-16 py-7 gold-gradient text-primary-dark font-black rounded-[1.5rem] text-3xl shadow-[0_20px_60px_-15px_rgba(212,175,55,0.4)] hover:scale-110 active:scale-95 transition-all">
              انضم إلينا الآن
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-primary-dark relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-8 group">
                <div className="w-12 h-12 gold-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-gold/20">
                  <span className="text-primary-dark font-black text-2xl">ص</span>
                </div>
                <span className="text-3xl font-black text-white tracking-tight">منصة صرح</span>
              </Link>
              <p className="text-text-secondary text-lg leading-relaxed max-w-md">نحن في صرح نسعى لتقديم تجربة تعليمية فاخرة تضمن لطلابنا التميز والنجاح بأعلى معايير الجودة والخصوصية.</p>
            </div>
            
            <div>
              <h4 className="text-white font-black text-lg mb-8 uppercase tracking-widest">روابط سريعة</h4>
              <ul className="space-y-4">
                <li><Link href="/why-sarh" className="text-text-secondary hover:text-gold transition-colors font-bold">لماذا صرح؟</Link></li>
                <li><Link href="/pricing" className="text-text-secondary hover:text-gold transition-colors font-bold">باقات الاشتراك</Link></li>
                <li><Link href="/contact" className="text-text-secondary hover:text-gold transition-colors font-bold">تواصل معنا</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-black text-lg mb-8 uppercase tracking-widest">الدعم الفني</h4>
              <ul className="space-y-4">
                <li><Link href="/faq" className="text-text-secondary hover:text-gold transition-colors font-bold">الأسئلة الشائعة</Link></li>
                <li><Link href="/privacy" className="text-text-secondary hover:text-gold transition-colors font-bold">سياسة الخصوصية</Link></li>
                <li><Link href="/terms" className="text-text-secondary hover:text-gold transition-colors font-bold">شروط الخدمة</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-text-secondary text-sm font-bold tracking-wider">© 2026 منصة صرح العالمية - تجربة تعليمية فاخرة</p>
            <div className="flex gap-6">
               {/* Social Icons Placeholder */}
               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-secondary hover:text-gold transition-all cursor-pointer border border-white/10 hover:border-gold/30">
                 <span className="font-black">X</span>
               </div>
               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-secondary hover:text-gold transition-all cursor-pointer border border-white/10 hover:border-gold/30">
                 <span className="font-black">IG</span>
               </div>
               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-secondary hover:text-gold transition-all cursor-pointer border border-white/10 hover:border-gold/30">
                 <span className="font-black">WA</span>
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
