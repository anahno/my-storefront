// next.config.ts

import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // این بخش برای حل مشکل بارگذاری تصاویر از سرور Vendure است
  async rewrites() {
    return [
      {
        source: "/assets/:path*",
        destination: "http://localhost:3000/assets/:path*",
      },
    ];
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
        protocol: "http",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
