// src/components/CategoryCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { Collection } from "@/types"; // ✅ تایپ صحیح از فایل types.ts خوانده می‌شود

// ✅ تعریف پراپ‌ها اصلاح شد تا پراپ `category` را بپذیرد
interface CategoryCardProps {
  category: Collection;
}

const CategoryCard: FC<CategoryCardProps> = ({ category }) => {
  if (!category) {
    return null;
  }

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group block border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all"
    >
      <div className="aspect-square bg-gray-100 relative">
        {category.featuredAsset ? (
          <Image
            src={category.featuredAsset.preview}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
            بدون عکس
          </div>
        )}
      </div>
      <div className="p-3 bg-white">
        <h3 className="font-semibold text-base text-gray-800 truncate">
          {category.name}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
