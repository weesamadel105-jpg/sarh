"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Sparkles,
  ShieldCheck,
  Zap,
  Award,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/app/lib/auth/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "لماذا صرح؟", href: "/why-sarh" },
    { 
      name: "خدماتنا", 
      href: "#",
      dropdown: [
        { id: "assignments-solution", name: "حل الاسايمنت", href: "/student/new-order?service=assignments-solution" },
        { id: "exams-solution", name: "حل الامتحانات", href: "/student/new-order?service=exams-solution" },
        { id: "projects", name: "تنفيذ البروجكت", href: "/student/new-order?service=projects" },
        { id: "research", name: "إعداد البحوث", href: "/student/new-order?service=research" },
        { id: "term-subscription", name: "الاشتراك الفصلي", href: "/student/new-order?service=term-subscription" }
      ]
    },
    { name: "الباقات", href: "/pricing" },
  ];

  return (
    <nav
      dir="rtl"
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled
          ? "py-3 bg-primary/80 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/20"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl gold-gradient shadow-xl shadow-gold/20 group-hover:scale-110 transition-transform duration-500">
              <span className="text-primary-dark font-black text-2xl">ص</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white tracking-tight leading-none">منصة صرح</span>
              <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em] mt-1 opacity-80">LUXURY EDUCATION</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                {link.dropdown ? (
                  <div
                    className="flex items-center gap-1.5 text-white/90 hover:text-gold font-bold transition-all cursor-pointer py-2 group/link"
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    <span>{link.name}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
                    
                    <AnimatePresence>
                      {isServicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-full right-[-20px] mt-2 w-72 glass-card rounded-3xl shadow-2xl py-4 z-50 border border-white/10 overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-full h-1 gold-gradient opacity-50" />
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center justify-between px-6 py-3.5 text-white/80 hover:text-gold hover:bg-white/5 transition-all text-right font-bold group/item"
                            >
                              <span>{item.name}</span>
                              <ChevronRight className="h-4 w-4 opacity-0 group-hover/item:opacity-100 transition-all translate-x-4 group-hover/item:translate-x-0" />
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className="text-white/90 hover:text-gold font-bold transition-all py-2 relative"
                  >
                    {link.name}
                    <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full" />
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  href="/student" 
                  className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                >
                  <div className="w-8 h-8 rounded-full gold-gradient p-[1.5px]">
                    <div className="w-full h-full rounded-full bg-primary flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-gold" />
                    </div>
                  </div>
                  <span>لوحة التحكم</span>
                </Link>
                <button 
                  onClick={() => logout()}
                  className="p-2.5 text-white/60 hover:text-danger transition-colors"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login" 
                  className="text-white font-bold px-6 py-2.5 hover:text-gold transition-colors"
                >
                  تسجيل الدخول
                </Link>
                <Link 
                  href="/login" 
                  className="gold-gradient text-primary-dark font-black px-8 py-3 rounded-2xl shadow-lg shadow-gold/20 hover:scale-105 active:scale-95 transition-all"
                >
                  ابدأ الآن
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white hover:text-gold transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-primary border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              {navLinks.map((link) => (
                <div key={link.name} className="space-y-4">
                  {link.dropdown ? (
                    <>
                      <div className="text-gold font-black text-xs uppercase tracking-widest">{link.name}</div>
                      <div className="grid grid-cols-1 gap-3 pr-4 border-r border-white/10">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 font-bold hover:text-gold transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block text-xl font-black text-white hover:text-gold transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              
              <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
                {user ? (
                  <Link
                    href="/student"
                    onClick={() => setIsOpen(false)}
                    className="w-full gold-gradient text-primary-dark font-black py-4 rounded-2xl text-center shadow-lg"
                  >
                    لوحة التحكم
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full gold-gradient text-primary-dark font-black py-4 rounded-2xl text-center shadow-lg"
                  >
                    ابدأ الآن مجاناً
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
