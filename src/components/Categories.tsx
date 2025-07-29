"use client";

import { useState } from "react";
import CategoryCard from "./CategoryCard";
import { Collection } from "@/types"; // ✅ از تایپ سراسری استفاده می‌کنیم

// تعریف پراپ‌ها با استفاده از تایپ صحیح و سراسری
interface CategoriesProps {
  collections: Collection[];
}

// ❌ دیگر به تعریف تایپ محلی در اینجا نیازی نیست
// type Category = { ... };

export default function Categories({ collections }: CategoriesProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  if (!collections || collections.length === 0) {
    return (
      <p className="text-center text-gray-500 my-8">
        هیچ دسته‌بندی برای نمایش وجود ندارد.
      </p>
    );
  }

  const totalPages = Math.ceil(collections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCollections = collections.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">دسته‌بندی‌ها</h2>
        <a href="#" className="text-sm text-yellow-500 hover:text-yellow-600">
          مشاهده همه
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 min-h-[450px]">
        {paginatedCollections.map((collection) => (
          // ✅ اینجا دیگر خطایی رخ نمی‌دهد چون تایپ‌ها هماهنگ هستند
          <CategoryCard key={collection.id} category={collection} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-8 gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-yellow-400 text-white rounded-md shadow-sm hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            قبلی
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-md transition-colors ${
                currentPage === page
                  ? "bg-yellow-500 text-white font-bold shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-yellow-400 text-white rounded-md shadow-sm hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            بعدی
          </button>
        </div>
      )}
    </section>
  );
}
