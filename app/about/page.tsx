import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";
import { Button } from "@/components/shared/Button";
import { Award, Globe2, ShieldCheck, Sparkles, BookOpen, Users, Rocket } from "lucide-react";

export const metadata: Metadata = getPageMetadata("about");

const services = [
  {
    title: "خدمات تعليمية متكاملة",
    description: "نقدم كتابة أبحاث، تحضير امتحانات، حل واجبات، ودعم أكاديمي متواصل بكل احترافية.",
    icon: BookOpen,
  },
  {
    title: "دعم شخصي بأعلى جودة",
    description: "تواصل مباشر مع معلمين وخبراء لتلبية احتياجاتك الأكاديمية بسرعة وسهولة.",
    icon: Users,
  },
  {
    title: "منصة سحابية ذكية",
    description: "واجهة سلسة وعصرية تم تصميمها لتجربة عربية متميزة على الجوال والويب.",
    icon: Globe2,
  },
];

const reasons = [
  {
    title: "تركيز كامل على اللغة العربية",
    description: "منصة صرح مصممة للطالب العربي باحتياجاته التعليمية والثقافية.",
    icon: Sparkles,
  },
  {
    title: "أمن وخصوصية متطورة",
    description: "نحافظ على بياناتك التعليمية مع بنية آمنة وتجربة موثوقة.",
    icon: ShieldCheck,
  },
  {
    title: "خبراء أكاديميون معتمدون",
    description: "فريق من المعلمين والمستشارين الأكاديميين لتقديم أفضل نتائج.",
    icon: Award,
  },
];

export default function AboutPage() {
  return (
    <main className="bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),_transparent_25%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
              🚀 منصة صرح | تجربة SaaS عربية فاخرة
            </span>
            <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              الرؤية المستقبلية لدعم التعليم العربي بأعلى معايير الجودة.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              نصنع تجربة تعليمية سحابية متكاملة للمعلّم والطالب، تجمع بين التقنية الحديثة، خدمات أكاديمية متقدمة، وتصميم عربي أنيق.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/30">
                ابدأ الآن
              </Button>
              <Button variant="outline" className="border-cyan-500/30 text-cyan-200 hover:border-cyan-400/50 hover:bg-cyan-500/10 px-8 py-4 rounded-2xl">
                تعرف على خدماتنا
              </Button>
            </div>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_-80px_rgba(56,189,248,0.65)]">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-500/15 text-cyan-300">
                <Rocket className="h-6 w-6" />
              </div>
              <p className="mt-6 text-4xl font-semibold text-white">رؤية SaaS</p>
              <p className="mt-4 text-slate-300 leading-relaxed">
                تقديم منصة تعليمية سحابية عربية تدعم المؤسسات والطلاب في بناء تجربة تعليمية أكثر ذكاءً، سرعةً، واحترافية.
              </p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_-80px_rgba(168,85,247,0.45)]">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-violet-500/15 text-violet-300">
                <Users className="h-6 w-6" />
              </div>
              <p className="mt-6 text-4xl font-semibold text-white">منصة متكاملة</p>
              <p className="mt-4 text-slate-300 leading-relaxed">
                نظام إدارة طلبات، محادثات فورية، اشتراكات، وتقارير ذكية مصممة لتجربة تعليمية مرنة.
              </p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_-80px_rgba(112,211,255,0.35)]">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/15 text-sky-300">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="mt-6 text-4xl font-semibold text-white">ثقة وأمان</p>
              <p className="mt-4 text-slate-300 leading-relaxed">
                نضمن بيئة آمنة لحماية بياناتك الشخصية والأكاديمية مع التزام تام بالخصوصية.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="vision" className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">رؤيتنا</p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                تمكين كل طالب ومعلم عربي لتجربة تعليمية غير مسبوقة.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                نؤمن بأن التعلم الذكي والمصمم باللغة العربية يجب أن يكون متاحًا للجميع. لذلك نطوّر منصة سحابية تحمل أعلى معايير التصميم والنموذج الأكاديمي لدعم النجاح المستدام.
              </p>
              <div className="mt-10 space-y-4">
                <p className="text-slate-300/90">- دعم تعليمي مخصص لكل مستوى دراسي.</p>
                <p className="text-slate-300/90">- حلول سريعة وموثوقة مع واجهة حديثة وسهلة الاستخدام.</p>
                <p className="text-slate-300/90">- خدمات متكاملة تربط الطلاب بالخبراء وتوفر تجربة تعليمية متقدمة.</p>
              </div>
            </div>

            <div className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 shadow-xl shadow-slate-900/60">
              <div className="rounded-3xl bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10 p-8">
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">مهمتنا</p>
                <h3 className="mt-4 text-2xl font-semibold text-white">تقديم الدعم الأكاديمي الكامل عبر تكنولوجيا ذكية.</h3>
                <p className="mt-4 text-slate-300 leading-relaxed">
                  نسعى لبناء تجربة مهنية للطلاب والمعلمين مع حلول تعليمية مرنة ترفع من جودة النتائج وتسرع وتيرة الإنجاز.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950/95 p-6 border border-white/10">
                  <p className="text-4xl font-semibold text-white">24/7</p>
                  <p className="mt-3 text-slate-300">دعم متواصل ووجود دائم عبر المنصة.</p>
                </div>
                <div className="rounded-3xl bg-slate-950/95 p-6 border border-white/10">
                  <p className="text-4xl font-semibold text-white">98%</p>
                  <p className="mt-3 text-slate-300">سجل نجاح عالي في رضا العملاء والنتائج الدراسية.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="bg-slate-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-300">الخدمات</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              خدمات متطورة مصممة لكل حاجات التعليم العربي.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              منصة صرح تجمع بين حلول المحتوى الأكاديمي، الدعم الشخصي، والأنظمة الذكية لإدارة الطلبات والاشتراكات.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 transition hover:border-cyan-400/30 hover:bg-slate-900/80">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/20">
                  <service.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-white">{service.title}</h3>
                <p className="mt-4 text-slate-300 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">لماذا اختر صرح</p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                منصة تعليمية عربية تمتاز بالاحترافية والمرونة.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                صرح تجمع بين خبرة التعليم الرقمي والتقنية السحابية لتمنحك خدمة أسرع، أكثر أمانًا، وأفضل تنظيمًا لجميع احتياجاتك الدراسية.
              </p>
            </div>

            <div className="grid gap-5">
              {reasons.map((reason) => (
                <div key={reason.title} className="group rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 transition hover:border-cyan-400/30">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
                    <reason.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">{reason.title}</h3>
                  <p className="mt-3 text-slate-300 leading-relaxed">{reason.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/80 p-12 shadow-2xl shadow-slate-950/80">
            <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-300">انطلق معنا</p>
                <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                  انضم إلى أشهر منصة SaaS تعليمية عربية الآن.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                  سواء كنت طالبًا يسعى للنجاح أو معلّمًا يقدم خبرته، صرح توفر لك الحلول الأكاديمية المتقدمة بتصميم فاخر ومزايا ذكية.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
                <Button className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white px-8 py-4 rounded-2xl shadow-lg shadow-cyan-500/20">
                  ابدأ الآن
                </Button>
                <Button variant="outline" className="border-cyan-500/30 text-cyan-200 hover:border-cyan-400/50 hover:bg-cyan-500/10 px-8 py-4 rounded-2xl">
                  تعرف على العروض
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
