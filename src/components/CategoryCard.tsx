// src/components/CategoryCard.tsx
"use client";

// تعریف نوع داده برای یک دسته‌بندی (کالکشن)
interface Collection {
  id: string;
  name: string;
  featuredAsset?: {
    preview: string;
  };
}

// تعریف props کامپوننت
interface CategoryCardProps {
  collection: Collection;
}

export default function CategoryCard({ collection }: CategoryCardProps) {
  return (
    <div className="relative rounded-lg overflow-hidden h-40">
      <img
        alt={collection.name}
        className="w-full h-full object-cover"
        src={collection.featuredAsset?.preview}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-3">
        <span className="text-white font-semibold">{collection.name}</span>
      </div>
    </div>
  );
}
