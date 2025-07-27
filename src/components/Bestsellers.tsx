// src/components/Bestsellers.tsx
"use client";

import ProductCard from "./ProductCard";
import Link from "next/link";
import { Product } from "@/types"; // ✅ ایمپورت کردن تایپ صحیح از فایل مرکزی

// ❌ اینترفیس محلی و ناقص حذف شد
// interface Product { ... }

interface BestsellersProps {
  products: Product[]; // ✅ حالا از تایپ صحیح استفاده می‌کند
}

export default function Bestsellers({ products }: BestsellersProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">پرفروش‌ها</h2>
        <Link href="/bestsellers" className="text-custom-yellow text-sm">
          مشاهده همه
        </Link>
      </div>
      <div className="flex space-x-4 space-x-reverse overflow-x-auto pb-4 -mb-4">
        {products.map((product) => (
          <div key={product.id} className="flex-none w-40">
            {/* حالا product شامل slug است و خطایی رخ نمی‌دهد */}
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
