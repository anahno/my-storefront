// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // این بخش را برای حل مشکل بارگذاری تصاویر از سرور Vendure اضافه می‌کنیم
  async rewrites() {
    return [
      {
        // هر درخواستی که در فرانت‌اند به آدرس /assets/... ارسال شود
        source: "/assets/:path*",
        // به صورت پشت صحنه به این آدرس در سرور Vendure هدایت خواهد شد
        destination: "http://localhost:3000/assets/:path*",
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
