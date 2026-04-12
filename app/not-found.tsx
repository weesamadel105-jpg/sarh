import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/shared/Button";

export const metadata: Metadata = {
  title: "404 | منصة صرح",
  description: "عذرًا، الصفحة غير موجودة على منصة صرح.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-24">
      <div className="relative max-w-4xl rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 shadow-2xl shadow-slate-950/80 backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_16%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_20%)] rounded-[2rem]" />
        <div className="relative grid gap-10 lg:grid-cols-[0.7fr_0.3fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">خطأ 404</p>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              عذرًا، الصفحة غير موجودة
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              ربما تم تغيير الرابط أو الصفحة لم تعد متوفرة. عد إلى الصفحة الرئيسية أو تواصل معنا عبر الدعم للحصول على مساعدة فورية.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/">
                <Button className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white px-8 py-4 rounded-2xl shadow-lg shadow-cyan-500/20">
                  العودة إلى الرئيسية
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-cyan-500/30 text-cyan-200 hover:border-cyan-400/50 hover:bg-cyan-500/10 px-8 py-4 rounded-2xl">
                  تواصل معنا
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 text-center shadow-xl shadow-slate-950/40">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 text-white text-3xl font-bold">
              404
            </div>
            <p className="mt-8 text-base leading-7 text-slate-300">
              تصفح بقية الموقع عبر الروابط أعلاه أو راجع الرابط الذي أدخلته.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
