import { AuthProvider } from "./lib/auth/AuthContext";
import "./globals.css";
import SupportWidget from "@/components/shared/SupportWidget";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthProvider>
          {children}
          <SupportWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
