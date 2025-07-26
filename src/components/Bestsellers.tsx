// src/components/Bestsellers.tsx
"use client";

import ProductCard from "./ProductCard"; // ✅ ایمپورت کامپوننت جدید
import Link from "next/link"; // ✅ برای ناوبری بهینه از Link استفاده می‌کنیم

// تعریف نوع داده‌ها مثل قبل
interface Product {
  id: string;
  name: string;
  featuredAsset?: {
    preview: string;
  };
  variants: {
    price: number;
  }[];
}

interface BestsellersProps {
  products: Product[];
}

export default function Bestsellers({ products }: BestsellersProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">پرفروش‌ها</h2>
        {/* ✅ لینک را به /bestsellers تغییر دادیم */}
        <Link href="/bestsellers" className="text-custom-yellow text-sm">
          مشاهده همه
        </Link>
      </div>
      <div className="flex space-x-4 space-x-reverse overflow-x-auto pb-4 -mb-4">
        {products.map((product) => (
          // ✅ به جای تکرار کد، از کامپوننت ProductCard استفاده می‌کنیم
          <div key={product.id} className="flex-none w-40">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
