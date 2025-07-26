// src/components/Categories.tsx
"use client";

import Link from "next/link"; // ✅ برای ناوبری سریع
import CategoryCard from "./CategoryCard"; // ✅ ایمپورت کامپوننت جدید

// تعریف نوع داده‌ها
interface Collection {
  id: string;
  name: string;
  featuredAsset?: {
    preview: string;
  };
}

interface CategoriesProps {
  collections: Collection[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Categories({
  collections,
  totalPages,
  currentPage,
  onPageChange,
}: CategoriesProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">دسته‌بندی‌ها</h2>
        {/* ✅ لینک را به /categories تغییر دادیم */}
        <Link href="/categories" className="text-custom-yellow text-sm">
          مشاهده همه
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* ✅ به جای تکرار کد، از کامپوننت CategoryCard استفاده می‌کنیم */}
        {collections.map((collection) => (
          <CategoryCard key={collection.id} collection={collection} />
        ))}
      </div>

      {/* بخش صفحه‌بندی بدون تغییر باقی می‌ماند */}
      <div className="flex justify-center items-center space-x-2 space-x-reverse mb-8">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currentPage === page
                ? "bg-custom-yellow text-black"
                : "bg-custom-dark-2 text-white"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </>
  );
}
