// src/app/layout.tsx
"use client"; // ✅ برای استفاده از هوک، این را اضافه کنید

import "./globals.css";
import { Providers } from "./providers";
import BottomNav from "@/components/BottomNav"; // ✅ ایمپورت BottomNav
import { usePathname } from "next/navigation"; // ✅ ایمپورت هوک
import UrqlProvider from "@/components/UrqlProvider"; // ✅ کامپوننتی که ساختیم را وارد می‌کنیم

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // ✅ ما یک لیست از صفحاتی که "نباید" نوار پایین را داشته باشند، تعریف می‌کنیم
  const noNavPages = ["/login", "/register", "/verify"];

  // ✅ چک می‌کنیم که آیا صفحه فعلی در لیست بالا هست یا نه
  const showNav = !noNavPages.some((path) => pathname.startsWith(path));

  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          {children}

          {/* ✅ اگر showNav برابر true بود، نوار پایین را نمایش بده */}
          {showNav && (
            <div className="fixed bottom-4 left-0 right-0 max-w-sm mx-auto z-50 px-4">
              <BottomNav />
            </div>
          )}
        </Providers>
      </body>
    </html>
  );
}
