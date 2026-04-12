"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  X,
  Calendar,
  MessageSquare,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { services } from "@/lib/services-data";
import { useAuth } from "../../lib/auth/AuthContext";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

export default function NewOrderPage() {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [universityName, setUniversityName] = useState(user?.university || "");
  const [contactNumber, setContactNumber] = useState("");
  const [major, setMajor] = useState("");
  const [subject, setSubject] = useState("");
  const [testNumber, setTestNumber] = useState(""); // For Test Solutions
  const [questionCount, setQuestionCount] = useState(""); // For Test Solutions
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [realFiles, setRealFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle pre-selected service from query param
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const serviceId = params.get('service');
      if (serviceId && services.find(s => s.id === serviceId)) {
        setSelectedService(serviceId);
      }
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setRealFiles(prev => [...prev, ...files]);
  };

  const removeFile = (fileId: string, index: number) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    setRealFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Sync user info when loaded
  useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!universityName) setUniversityName(user.university || "");
    }
  }, [user, name, universityName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const selectedServiceName = services.find((service) => service.id === selectedService)?.title || "طلب جديد";
      
      const formData = new FormData();
      // Use profile data if form fields are hidden
      formData.append("name", name || user?.name || "طالب");
      formData.append("universityName", universityName || user?.university || "غير محدد");
      formData.append("contactNumber", contactNumber);
      formData.append("service", selectedServiceName);
      
      if (selectedService === "term-subscription") {
        formData.append("major", major);
        formData.append("specialization", major); // Extra mapping for clarity
      } else if (selectedService === "test-solutions" || selectedService === "exams-solution") {
        formData.append("subject", subject);
        formData.append("testNumber", testNumber);
        formData.append("questionCount", questionCount);
        formData.append("details", notes);
      } else {
        formData.append("description", notes);
      }

      realFiles.forEach((file) => {
        formData.append("file", file);
      });

      const apiResponse = await fetch("/api/submitRequest", {
        method: "POST",
        body: formData,
      });

      const responseData = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(responseData.error || "حدث خطأ أثناء إرسال الطلب.");
      }

      router.push("/student");
    } catch (submitError: unknown) {
      const message = submitError instanceof Error ? submitError.message : "حدث خطأ أثناء إرسال الطلب.";
      setError(message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = (() => {
    if (!selectedService || !contactNumber) return false;
    
    if (selectedService === "term-subscription") {
      return !!major;
    } else if (selectedService === "test-solutions" || selectedService === "exams-solution") {
      return !!subject && !!questionCount;
    } else {
      return realFiles.length > 0;
    }
  })();

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 font-arial">
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-[#002366] bg-clip-text text-transparent">
                صرح
              </h1>
              <span className="text-slate-400">|</span>
              <span className="text-slate-300">طلب جديد</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">إنشاء طلب جديد</h2>
            <p className="text-slate-300">حدد الخدمة المطلوبة وراجع الملفات للحصول على المساعدة الأكاديمية</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-[#002366] border border-blue-800 rounded-2xl p-6">
              <label className="block text-lg font-semibold text-white mb-4">
                معلومات التواصل والطلب
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-blue-100 text-sm">رقم الواتساب أو التلغرام *</label>
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="مثال: +966..."
                    className="w-full px-4 py-3 bg-white/5 border border-blue-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>

                {selectedService === "term-subscription" && (
                  <div className="space-y-2">
                    <label className="text-blue-100 text-sm">التخصص / المسار *</label>
                    <input
                      type="text"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      placeholder="أدخل تخصصك"
                      className="w-full px-4 py-3 bg-white/5 border border-blue-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      required
                    />
                  </div>
                )}

                {(selectedService === "test-solutions" || selectedService === "exams-solution") && (
                  <>
                    <div className="space-y-2">
                      <label className="text-blue-100 text-sm">المادة الدراسية *</label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="أدخل اسم المادة"
                        className="w-full px-4 py-3 bg-white/5 border border-blue-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-blue-100 text-sm">عدد الأسئلة *</label>
                      <input
                        type="number"
                        value={questionCount}
                        onChange={(e) => setQuestionCount(e.target.value)}
                        placeholder="أدخل عدد الأسئلة"
                        className="w-full px-4 py-3 bg-white/5 border border-blue-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-[#002366] border border-blue-800 rounded-2xl p-6">
              <label className="block text-lg font-semibold text-white mb-4">
                اختر الخدمة المطلوبة
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedService === service.id
                        ? 'border-white bg-white/10'
                        : 'border-blue-700/50 hover:border-blue-600/50 bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedService === service.id
                          ? 'border-white bg-white'
                          : 'border-blue-400'
                      }`}>
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{service.title}</h3>
                        <p className="text-blue-100 text-sm">{service.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedService !== "term-subscription" && selectedService !== "test-solutions" && selectedService !== "exams-solution" && (
              <div className="bg-[#002366] border border-blue-800 rounded-2xl p-6">
                <label className="block text-lg font-semibold text-white mb-4">
                  أضف ملفات الطلب (PDF أو صورة) *
                </label>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-white bg-white/10'
                      : 'border-blue-700/50 hover:border-white/50 bg-white/5'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-4">
                    <Upload className={`h-8 w-8 ${isDragging ? 'text-white' : 'text-blue-200'}`} />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    اسحب الملفات هنا أو اضغط للتصفح
                  </h3>
                  <p className="text-blue-100 mb-4">
                    يدعم رفع الصور والملفات من الهاتف والكمبيوتر
                  </p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-sm text-blue-200">
                      <span className="font-medium text-white">الملفات المرفوعة</span>
                      <span>{uploadedFiles.length} ملف</span>
                    </div>
                    <div className="space-y-3">
                      {uploadedFiles.map((file, index) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-blue-800">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-white" />
                            <div>
                              <p className="text-white text-sm font-medium">{file.name}</p>
                              <p className="text-blue-200 text-xs">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(file.id, index)}
                            className="text-blue-200 hover:text-red-400 transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedService !== "term-subscription" && selectedService !== "test-solutions" && selectedService !== "exams-solution" && (
              <div className="bg-[#002366] border border-blue-800 rounded-2xl p-6">
                <label htmlFor="notes" className="block text-lg font-semibold text-white mb-4">
                  ملاحظات إضافية (اختياري)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute right-3 top-3 h-5 w-5 text-blue-300" />
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="أضف أي تعليمات خاصة أو متطلبات محددة..."
                    className="w-full pr-10 pl-4 py-3 bg-white/5 border border-blue-700/50 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-300">
                {error}
              </div>
            )}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  isFormValid && !isSubmitting
                    ? 'bg-white text-[#002366] hover:bg-blue-50 shadow-lg hover:shadow-xl'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#002366] border-t-transparent rounded-full animate-spin"></div>
                    جاري الإرسال...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    إرسال الطلب
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </div>
          </form>

          {!isFormValid && (
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <p className="text-yellow-400 font-arial">
                  يرجى ملء جميع الحقول المطلوبة للمتابعة
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

