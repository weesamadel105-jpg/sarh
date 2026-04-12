import type { Metadata } from "next";

const baseUrl = "https://sarh-edu.sa";
const siteName = "منصة صرح";
const siteDescription = "منصة صرح للخدمات التعليمية الأكاديمية تقدم حل الواجبات، كتابة الأبحاث، مراجعة الاختبارات، ودعم الطلاب والمعلمين باللغة العربية.";

const defaultKeywords = [
  "منصة صرح",
  "خدمات تعليمية",
  "كتابة أبحاث",
  "حل واجبات",
  "تحضير امتحانات",
  "دعم طلاب",
  "تعليم خصوصي",
  "اشتراك تعليمي",
  "طلبة",
  "معلمون"
];

export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteName,
    template: "%s | منصة صرح"
  },
  description: siteDescription,
  keywords: defaultKeywords,
  authors: [{ name: "منصة صرح" }],
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: baseUrl,
    siteName,
    type: "website",
    locale: "ar_AR",
    images: [
      {
        url: `${baseUrl}/og-image.svg`,
        alt: "منصة صرح للخدمات التعليمية"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    creator: "@sarh_platform",
    images: [`${baseUrl}/og-image.svg`]
  },
  robots: {
    index: true,
    follow: true
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": siteName,
      "url": baseUrl,
      "description": siteDescription,
      "sameAs": [
        // Add social media links if available
      ]
    })
  }
};

const pageMap: Record<
  string,
  {
    title: string;
    description: string;
    path: string;
    keywords?: string[];
  }
> = {
  home: {
    title: "الرئيسية",
    description: "اكتشف خدمات صرح التعليمية الاحترافية لتنفيذ الأبحاث، حل الواجبات، وتحضير الاختبارات بسهولة وموثوقية.",
    path: "/",
    keywords: [...defaultKeywords, "الرئيسية", "منصة تعليمية"]
  },
  pricing: {
    title: "الخطط والأسعار",
    description: "اطلع على خطط صرح المميزة واختر الاشتراك الأمثل للمسار الأكاديمي الخاص بك.",
    path: "/pricing",
    keywords: [...defaultKeywords, "خطط", "أسعار", "اشتراك"]
  },
  login: {
    title: "تسجيل الدخول",
    description: "قم بتسجيل الدخول إلى حسابك في منصة صرح للطلبة والمعلمين للوصول إلى لوحة التحكم والخدمات.",
    path: "/login",
    keywords: [...defaultKeywords, "تسجيل دخول", "حساب"]
  },
  register: {
    title: "إنشاء حساب",
    description: "سجل الآن في منصة صرح وابدأ استخدام خدمات الدعم الأكاديمي والاشتراكات التعليمية بسهولة.",
    path: "/register",
    keywords: [...defaultKeywords, "تسجيل حساب", "تسجيل مستخدم"]
  },
  admin: {
    title: "لوحة التحكم الإدارية",
    description: "إدارة المستخدمين، الطلبات، والإحصائيات داخل منصة صرح من خلال لوحة تحكم إدارية سهلة الاستخدام.",
    path: "/admin",
    keywords: [...defaultKeywords, "إدارة", "لوحة تحكم", "مشرف"]
  },
  teacher: {
    title: "مساحة المعلمين",
    description: "تابع طلباتك التعليمية، تواصل مع الطلاب، وقدم خدمات مخصصة عبر منصة صرح للمعلمين.",
    path: "/teacher",
    keywords: [...defaultKeywords, "معلم", "تواصل", "طلبة"]
  },
  teacherChat: {
    title: "محادثة المعلم",
    description: "تواصل فوري مع الطلاب وشارك الملفات والتعليمات عبر مساحة المحادثة المخصصة للمعلمين.",
    path: "/teacher/chat",
    keywords: [...defaultKeywords, "محادثة", "دردشة", "ملفات"]
  },
  student: {
    title: "مساحة الطالب",
    description: "تابع طلباتك التعليمية، المدفوعات، والمحادثات داخل منصة صرح الذكية للطلاب.",
    path: "/student",
    keywords: [...defaultKeywords, "طالب", "طلب", "حالة الطلب"]
  },
  studentChat: {
    title: "محادثة الطالب",
    description: "تواصل مع المعلم مباشرة واطرح استفساراتك عبر نظام المراسلة الخاص بالطلاب.",
    path: "/student/chat",
    keywords: [...defaultKeywords, "دردشة", "استفسار", "طالب"]
  },
  studentSubscription: {
    title: "الاشتراك الدراسي",
    description: "تعرف على خطط الاشتراك الفصلي في صرح واستفد من دعم تعليمي متواصل طوال الفصل.",
    path: "/student/subscription",
    keywords: [...defaultKeywords, "اشتراك", "فصل", "تعليمي"]
  },
  studentNewOrder: {
    title: "طلب جديد",
    description: "قدّم طلباً جديداً لخدمات صرح مثل كتابة الأبحاث، حل الواجبات، وتحضير الاختبارات.",
    path: "/student/new-order",
    keywords: [...defaultKeywords, "طلب جديد", "خدمة", "أبحاث"]
  },
  studentPayments: {
    title: "المدفوعات",
    description: "راجع دفعاتك، اشتراكاتك، وتاريخ الدفع داخل حسابك في منصة صرح.",
    path: "/student/payments",
    keywords: [...defaultKeywords, "مدفوعات", "فاتورة", "اشتراك"]
  },
  studentOrders: {
    title: "تفاصيل الطلب",
    description: "عرض حالة الطلب، المراسلات، والملفات المرفقة ضمن طلباتك التعليمية في صرح.",
    path: "/student/orders",
    keywords: [...defaultKeywords, "تفاصيل الطلب", "حالة الطلب", "طلب"]
  },
  paymentSuccess: {
    title: "نجاح الدفع",
    description: "تم تسجيل دفعتك بنجاح. تابع حالة طلبك واستمتع بخدمات منصة صرح التعليمية.",
    path: "/payment-success",
    keywords: [...defaultKeywords, "نجاح الدفع", "إيصال", "دفع"]
  },
  about: {
    title: "من نحن",
    description: "تعرف على رؤية منصة صرح ورسالتها في تقديم خدمات تعليمية أكاديمية متميزة باللغة العربية.",
    path: "/about",
    keywords: [...defaultKeywords, "من نحن", "رؤية", "رسالة", "فريق"]
  },
  contact: {
    title: "اتصل بنا",
    description: "تواصل مع فريق صرح عبر واتساب، تيليجرام أو البريد الإلكتروني للحصول على دعم تعليمي فوري.",
    path: "/contact",
    keywords: [...defaultKeywords, "اتصل بنا", "دعم", "خدمة عملاء", "واتساب", "تيليجرام"]
  }
};

export function getPageMetadata(key: string): Metadata {
  const page = pageMap[key];

  if (!page) {
    return defaultMetadata;
  }

  return {
    ...defaultMetadata,
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: page.title,
      description: page.description,
      url: `${baseUrl}${page.path}`
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: page.title,
      description: page.description
    },
    alternates: {
      canonical: `${baseUrl}${page.path}`
    }
  };
}
