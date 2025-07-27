// src/components/CategoryCard.tsx
"use client";

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
  // ۱. آدرس کامل را از featuredAsset می‌گیریم
  const fullImageUrl = collection.featuredAsset?.preview;

  // ۲. بخش "http://localhost:3000" را از ابتدای آن حذف می‌کنیم
  //    تا به یک آدرس نسبی مثل "/assets/preview/..." تبدیل شود
  const imageUrl = fullImageUrl
    ? fullImageUrl.replace("http://localhost:3000", "")
    : undefined;

  return (
    <div className="relative rounded-lg overflow-hidden h-40 bg-custom-dark-2">
      {imageUrl ? (
        <img
          alt={collection.name}
          className="w-full h-full object-cover"
          src={imageUrl}
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
