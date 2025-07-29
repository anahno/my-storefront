// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // فعال کردن حالت سخت‌گیرانه ری‌اکت برای شناسایی بهتر خطاها
  reactStrictMode: true,

  // تنظیمات مربوط به کامپایلر Next.js
  compiler: {
    // حذف تمام console.log ها در نسخه نهایی (production)
    removeConsole: process.env.NODE_ENV === "production",
  },

  // این بخش برای اجازه دادن به دامنه‌های خارجی جهت نمایش تصویر است
  images: {
    remotePatterns: [
      // برای تصاویر از سرور Vendure (localhost)
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/assets/**",
      },
      // برای آواتارهای صفحه پروفایل
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      // برای آواتارهای گوگل (پوشش دادن همه زیردامنه‌ها)
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
