"use client";

import Navbar from "@/components/shared/Navbar";
import { 
  Zap, 
  ShieldCheck, 
  Award, 
  MessageCircle, 
  Users, 
  Star, 
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  UserCheck
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/shared/Button";

export default function WhySarhClient() {
  const features = [
    {
      title: "سرعة التسليم",
      description: "نحن نقدر وقتك. نضمن لك تسليم جميع التكليفات في الموعد المحدد أو قبله، مهما كانت ضيقة.",
      icon: <Clock className="w-10 h-10 text-gold" />,
      delay: 0.1
    },
    {
      title: "جودة أكاديمية عالية",
      description: "نخبة من الأكاديميين المتخصصين يعملون على طلباتك لضمان الحصول على أعلى التقييمات.",
      icon: <Award className="w-10 h-10 text-gold" />,
      delay: 0.2
    },
    {
      title: "خصوصية وأمان",
      description: "بياناتك وهويتك في أمان تام. نعتمد أعلى معايير التشفير والسرية لضمان خصوصية رحلتك الأكاديمية.",
      icon: <ShieldCheck className="w-10 h-10 text-gold" />,
      delay: 0.3
    },
    {
      title: "دعم مباشر 24/7",
      description: "فريق دعم فني متواجد على مدار الساعة للإجابة على استفساراتك ومتابعة طلباتك لحظة بلحظة.",
      icon: <MessageCircle className="w-10 h-10 text-gold" />,
      delay: 0.4
    },
    {
      title: "متخصصين لكل مادة",
      description: "لدينا شبكة واسعة من الخبراء في مختلف المجالات العلمية والأدبية لضمان التخصص الدقيق.",
      icon: <UserCheck className="w-10 h-10 text-gold" />,
      delay: 0.5
    },
    {
      title: "نسبة رضا مرتفعة",
      description: "نفخر بخدمة أكثر من 10,000 طالب بمعدل رضا يتجاوز 98%، مما يجعلنا الخيار الأول.",
      icon: <Star className="w-10 h-10 text-gold fill-gold" />,
      delay: 0.6
    }
  ];

  const reviews = [
    {
      name: "أحمد المري",
      university: "جامعة الكويت",
      text: "منصة صرح كانت المنقذ لي في السنة الأخيرة. جودة البحث كانت مذهلة والسرية تامة.",
      rating: 5
    },
    {
      name: "سارة العتيبي",
      university: "جامعة الملك سعود",
      text: "التزام بالموعد واحترافية عالية في التعامل. أنصح بها كل طالب يبحث عن التميز.",
      rating: 5
    },
    {
      name: "فهد الدوسري",
      university: "جامعة قطر",
      text: "خدمة العملاء سريعة جداً والاشتراك الفصلي وفر علي الكثير من الجهد والمال.",
      rating: 5
    }
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-primary-dark text-white font-sans selection:bg-gold/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-gold/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-primary-light/10 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <Sparkles className="w-5 h-5 text-gold" />
            <span className="text-gold font-black text-sm uppercase tracking-widest">لماذا يختارنا الطلاب؟</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-8 leading-[1.1]"
          >
            نحن لا نقدم خدمات فقط، بل نصنع <span className="text-gold">قصص نجاح</span> أكاديمية.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            منصة صرح هي الشريك الأكاديمي الأول للطلاب في الخليج العربي، نجمع بين الخبرة، السرعة، والخصوصية التامة.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto px-12 py-5 gold-gradient text-primary-dark font-black rounded-2xl text-xl shadow-2xl shadow-gold/20 hover:scale-105 transition-all">
                ابدأ رحلة التميز الآن
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: feature.delay }}
                viewport={{ once: true }}
                className="glass-card rounded-[2.5rem] p-10 border border-white/5 hover:border-gold/30 transition-all group"
              >
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-gold/10 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 text-white group-hover:text-gold transition-colors">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto glass-card rounded-[3rem] p-12 md:p-20 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 gold-gradient opacity-30" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
            <div>
              <p className="text-5xl md:text-7xl font-black text-gold mb-2">+10k</p>
              <p className="text-xl font-bold text-white">طالب مستفيد</p>
            </div>
            <div>
              <p className="text-5xl md:text-7xl font-black text-gold mb-2">98%</p>
              <p className="text-xl font-bold text-white">نسبة رضا العملاء</p>
            </div>
            <div>
              <p className="text-5xl md:text-7xl font-black text-gold mb-2">+500</p>
              <p className="text-xl font-bold text-white">خبير أكاديمي</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">ماذا يقول طلابنا؟</h2>
            <p className="text-text-secondary text-lg">آراء حقيقية من طلاب حققوا طموحاتهم مع صرح</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="glass-card rounded-[2.5rem] p-8 border border-white/5 flex flex-col"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-lg text-white font-medium mb-8 flex-grow leading-relaxed italic">"{review.text}"</p>
                <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                  <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-primary-dark font-black">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-black text-white">{review.name}</p>
                    <p className="text-text-secondary text-xs">{review.university}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-gold/5 rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8">جاهز لبدء رحلة النجاح؟</h2>
          <p className="text-xl text-text-secondary mb-12">انضم لآلاف الطلاب الذين وثقوا بصرح وحققوا أفضل النتائج الأكاديمية.</p>
          <Link href="/login">
            <Button className="px-16 py-6 gold-gradient text-primary-dark font-black rounded-2xl text-2xl shadow-2xl shadow-gold/30 hover:scale-110 transition-all">
              انضم إلينا الآن
            </Button>
          </Link>
          <div className="mt-12 flex items-center justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
             <div className="flex items-center gap-2 font-black text-white">
               <ShieldCheck className="w-6 h-6" /> ضمان الخصوصية
             </div>
             <div className="flex items-center gap-2 font-black text-white">
               <CheckCircle className="w-6 h-6" /> جودة مضمونة
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
                <span className="text-primary-dark font-black text-xl">ص</span>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">منصة صرح</span>
            </Link>
            <div className="flex gap-8">
              <Link href="/" className="text-text-secondary hover:text-gold font-bold">الرئيسية</Link>
              <Link href="/pricing" className="text-text-secondary hover:text-gold font-bold">الباقات</Link>
              <Link href="/contact" className="text-text-secondary hover:text-gold font-bold">اتصل بنا</Link>
            </div>
          </div>
          <p className="text-text-secondary text-sm">© 2026 منصة صرح العالمية - تجربة تعليمية فاخرة</p>
        </div>
      </footer>
    </div>
  );
}
