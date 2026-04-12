"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/shared/Button";
import { Mail, MessageCircle, Phone, Send } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      // TODO: Handle contact form submission error
      setStatus("error");
    }
  };

  return (
    <main className="bg-slate-950 text-slate-100 min-h-screen">
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),_transparent_20%)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 shadow-2xl shadow-slate-950/80 backdrop-blur-xl">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">تواصل معنا</p>
                <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
                  فريق صرح جاهز لدعمك عبر البريد والإتصال الفوري.
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-300">
                  احصل على مساعدة تعليمية سريعة مع تجربة عربية فاخرة، سواء عبر واتساب، تيليجرام أو البريد الإلكتروني.
                </p>
              </div>

              <div className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-950/90 p-8">
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">واتساب</p>
                    <a
                      href="https://wa.me/966500000000?text=مرحبا%20منصة%20صرح"
                      target="_blank"
                      rel="noreferrer"
                      className="text-white underline"
                    >
                      تواصل عبر واتساب الآن
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-violet-500/10 text-violet-300">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-violet-300">تيليجرام</p>
                    <a
                      href="https://t.me/sarh_platform"
                      target="_blank"
                      rel="noreferrer"
                      className="text-white underline"
                    >
                      تواصل عبر تيليجرام
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-10 shadow-xl shadow-slate-950/60">
              <div className="flex items-center gap-3 text-cyan-300">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-500/10">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em]">البريد الإلكتروني</p>
                  <p className="text-white">contact@sarh.com</p>
                </div>
              </div>
              <div className="mt-10 space-y-6">
                <div className="rounded-3xl bg-slate-950/95 p-6 border border-white/10">
                  <p className="text-2xl font-semibold text-white">دعم فوري</p>
                  <p className="mt-3 text-slate-300 leading-relaxed">
                    أرسل لنا رسالة بالأسفل وسنعاود الاتصال بك في أسرع وقت ممكن.
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-950/95 p-6 border border-white/10">
                  <p className="text-2xl font-semibold text-white">تصميم فاخر</p>
                  <p className="mt-3 text-slate-300 leading-relaxed">
                    واجهة مستخدم داكنة وعصرية تناسب منصة SaaS عربية متميزة.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-10 shadow-xl shadow-slate-950/50"
            >
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-300">ارسل لنا</p>
                <h2 className="mt-4 text-3xl font-semibold text-white">نحن هنا لاستقبال استفساراتك.</h2>
              </div>

              <div className="space-y-6">
                <label className="block text-sm font-medium text-slate-300">
                  الاسم الكامل
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل اسمك"
                    required
                    className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-300">
                  البريد الإلكتروني
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-300">
                  الرسالة
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="أخبرنا بما تحتاجه"
                    required
                    rows={6}
                    className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                <Button className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white px-6 py-3 rounded-2xl shadow-lg shadow-cyan-500/20">
                  إرسال الرسالة
                  <Send className="h-4 w-4" />
                </Button>
                <div className="text-sm text-slate-400">
                  {status === "success" && "تم إرسال الرسالة بنجاح! سنرد قريبًا."}
                  {status === "error" && "حدث خطأ، حاول مرة أخرى."}
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
