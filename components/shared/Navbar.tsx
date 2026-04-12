"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/app/lib/auth/AuthContext";

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
    { 
      name: "خدماتنا", 
      href: "#",
      dropdown: [
        { id: "assignments-solution", name: "حل الاسايمنت", href: "/#services" },
        { id: "exams-solution", name: "حل الامتحانات", href: "/#services" },
        { id: "projects", name: "تنفيذ البروجكت", href: "/#services" },
        { id: "research", name: "إعداد البحوث", href: "/#services" },
        { id: "term-subscription", name: "الاشتراك الفصلي", href: "/#services" }
      ]
    },
    { name: "لوحة الطالب", href: "/student" },
    { name: "الباقات", href: "/pricing" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0D47A1]/95 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00BCD4] shadow-lg">
              <span className="text-white font-black text-2xl">ص</span>
            </div>
            <span className="text-2xl font-black text-[#00BCD4] tracking-tight">منصة صرح</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                {link.dropdown ? (
                  <div
                    className="flex items-center gap-1 text-white/90 hover:text-[#00BCD4] font-bold transition-colors cursor-pointer py-2"
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    <span>{link.name}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
                    
                    {isServicesOpen && (
                      <div
                        className="absolute top-full right-0 mt-2 w-64 bg-[#0D47A1] border border-white/10 rounded-xl shadow-2xl py-3 z-50"
                        onMouseEnter={() => setIsServicesOpen(true)}
                        onMouseLeave={() => setIsServicesOpen(false)}
                      >
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            href={`/student/new-order?service=${item.id}`}
                            className="block px-6 py-3 text-white/80 hover:text-[#00BCD4] hover:bg-white/5 transition-all text-right font-medium"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className="text-white/90 hover:text-[#00BCD4] font-bold transition-colors py-2"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
                    {user.name?.[0]?.toUpperCase() || "S"}
                  </div>
                  <span className="text-white font-bold">{user.name}</span>
                </div>
                <div className="w-[1px] h-6 bg-white/20 mx-1" />
                <button
                  onClick={() => logout()}
                  className="p-2 text-white/70 hover:text-white transition-colors"
                  title="تسجيل الخروج"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-8 py-3 bg-[#00BCD4] hover:bg-[#00ACC1] text-white font-black rounded-full transition-all shadow-lg"
              >
                دخول الطالب
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#0D47A1] border-t border-white/10 shadow-2xl">
          <div className="px-4 pt-4 pb-8 space-y-4">
            {navLinks.map((link) => (
              <div key={link.name}>
                {link.dropdown ? (
                  <div className="space-y-3">
                    <div className="text-white/60 text-sm font-bold px-4 pt-2">{link.name}</div>
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.name}
                        href={`/student/new-order?service=${item.id}`}
                        className="block px-8 py-2 text-white hover:text-[#00BCD4] font-bold"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className="block px-4 py-3 text-white hover:text-[#00BCD4] font-bold text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-6 border-t border-white/10 mt-6">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 px-4 py-3 bg-white/5 rounded-2xl border border-white/10">
                    <div className="h-12 w-12 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xl font-bold">
                      {user.name?.[0]?.toUpperCase() || "S"}
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">{user.name}</div>
                      <div className="text-white/50 text-sm">{user.email || user.role}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-2xl transition-all border border-red-500/20"
                  >
                    <LogOut className="h-6 w-6" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block w-full text-center px-6 py-4 bg-[#00BCD4] hover:bg-[#00ACC1] text-white font-black rounded-2xl shadow-xl text-xl"
                  onClick={() => setIsOpen(false)}
                >
                  دخول الطالب
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
