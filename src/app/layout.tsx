import type { Metadata } from "next";
import "./globals.css";
// providers.tsx را از مرحله قبل نگه می‌داریم
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "اپلیکیشن فروشگاهی",
  description: "فروشگاه آنلاین گیلاس",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* افزودن فونت وزیرمتن و آیکون‌های متریال */}
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
