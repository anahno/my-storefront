// src/components/CategoryCard.tsx
"use client";

import Image from "next/image"; // ✅ ایمپورت کردن کامپوننت Image

interface Collection {
  id: string;
  name: string;
  featuredAsset?: {
    preview: string;
  };
}

interface CategoryCardProps {
  collection: Collection;
}

export default function CategoryCard({ collection }: CategoryCardProps) {
  // ✅ آدرس کامل را مستقیماً از API بگیرید. دیگر نیازی به هیچ‌گونه پردازشی نیست.
  const imageUrl = collection.featuredAsset?.preview;

  return (
    <div className="relative rounded-lg overflow-hidden h-40 bg-custom-dark-2">
      {imageUrl ? (
        // ✅ جایگزینی تگ <img> با کامپوننت Image
        <Image
          alt={collection.name}
          src={imageUrl} // آدرس کامل و اصلی از API را به آن بدهید
          fill
          style={{ objectFit: "cover" }} // معادل کلاس object-cover
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="material-icons text-gray-500 text-4xl">image</span>
        </div>
      )}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-3">
        <span className="text-white font-semibold">{collection.name}</span>
      </div>
    </div>
  );
}
