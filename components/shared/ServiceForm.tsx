"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Phone, Upload, FileText, Hash, BookOpen, Layers } from 'lucide-react';

interface ServiceFormProps {
  serviceId: string;
  serviceName: string;
}

export default function ServiceForm({ serviceId, serviceName }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    contact: '',
    file: null as File | null,
    description: '',
    specialization: '', // For Term Subscription
    subject: '',        // For Test Solutions
    count: '',          // For Test Solutions
    number: '',         // For Test Solutions (Order Number/ID)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target.type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files) {
        setFormData({ ...formData, [name]: fileInput.files[0] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formPayload.append(key, value);
      }
    });
    formPayload.append('serviceId', serviceId);
    formPayload.append('serviceName', serviceName);

    try {
      const res = await fetch('/api/submitRequest', {
        method: 'POST',
        body: formPayload,
      });

      if (res.ok) {
        alert('تم إرسال طلبك بنجاح!');
        setFormData({
          contact: '',
          file: null,
          description: '',
          specialization: '',
          subject: '',
          count: '',
          number: '',
        });
      } else {
        alert('حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى');
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert('حدث خطأ في الاتصال');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTermSubscription = serviceId === 'term-subscription';
  const isTestSolutions = serviceId === 'test-solutions' || serviceId === 'exams-solution';

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl text-white" dir="rtl">
      <h2 className="text-xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
        {serviceName}
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Common Field: Contact */}
        <div className="space-y-1">
          <label className="text-sm text-slate-400 block mr-1">رقم الواتس أو التلجرام *</label>
          <div className="relative">
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input 
              name="contact" 
              placeholder="مثال: +966..." 
              value={formData.contact} 
              onChange={handleChange} 
              required 
              className="w-full pr-10 pl-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" 
            />
          </div>
        </div>

        {/* Conditional Fields for Term Subscription */}
        {isTermSubscription && (
          <div className="space-y-1">
            <label className="text-sm text-slate-400 block mr-1">التخصص الدراسي *</label>
            <div className="relative">
              <Layers className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input 
                name="specialization" 
                placeholder="أدخل تخصصك الدراسي" 
                value={formData.specialization} 
                onChange={handleChange} 
                required 
                className="w-full pr-10 pl-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" 
              />
            </div>
          </div>
        )}

        {/* Conditional Fields for Test Solutions */}
        {isTestSolutions && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-slate-400 block mr-1">المادة الدراسية *</label>
                <div className="relative">
                  <BookOpen className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input 
                    name="subject" 
                    placeholder="اسم المادة" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    required 
                    className="w-full pr-10 pl-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-400 block mr-1">عدد الأسئلة *</label>
                <div className="relative">
                  <Hash className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input 
                    name="count" 
                    type="number"
                    placeholder="عدد الأسئلة" 
                    value={formData.count} 
                    onChange={handleChange} 
                    required 
                    className="w-full pr-10 pl-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" 
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-400 block mr-1">رقم الاختبار/المعرف</label>
              <div className="relative">
                <FileText className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input 
                  name="number" 
                  placeholder="رقم الاختبار إن وجد" 
                  value={formData.number} 
                  onChange={handleChange} 
                  className="w-full pr-10 pl-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" 
                />
              </div>
            </div>
          </>
        )}

        {/* Common Field: File Upload (Except Term Subscription) */}
        {!isTermSubscription && (
          <div className="space-y-1">
            <label className="text-sm text-slate-400 block mr-1">إرفاق ملف الطلب *</label>
            <div 
              className="relative border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:bg-white/5 transition-all cursor-pointer group"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="h-6 w-6 text-slate-500 mx-auto mb-2 group-hover:text-cyan-400" />
              <p className="text-sm text-slate-400">{formData.file ? formData.file.name : 'اختر ملفاً أو اسحبه هنا'}</p>
              <input 
                id="file-upload"
                type="file" 
                name="file" 
                onChange={handleChange} 
                accept=".pdf,.doc,.docx,image/*" 
                className="hidden"
                required={!isTermSubscription}
              />
            </div>
          </div>
        )}

        {/* Common Field: Notes (Optional) */}
        <div className="space-y-1">
          <label className="text-sm text-slate-400 block mr-1">ملاحظات إضافية (اختياري)</label>
          <textarea 
            name="description" 
            placeholder="أضف أي تفاصيل أخرى تود إخبارنا بها..." 
            value={formData.description} 
            onChange={handleChange} 
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all min-h-[100px] text-right"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-xl hover:from-cyan-600 hover:to-blue-700 font-bold transition-all shadow-lg mt-2 disabled:opacity-50"
        >
          {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب الآن'}
        </button>
      </form>
    </div>
  );
}