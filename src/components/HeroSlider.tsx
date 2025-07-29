"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// ✅ تعریف تایپ دیتا مستقیماً در خود فایل، دقیقا مثل فایل Categories.tsx
type Collection = {
  id: string;
  name: string;
  slug: string;
  featuredAsset: {
    id: string;
    preview: string;
    width: number;
    height: number;
  } | null;
};

interface HeroSliderProps {
  collections: Collection[];
}

export default function HeroSlider({ collections }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!collections || collections.length === 0) {
      return;
    }
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % collections.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, collections]);

  if (!collections || collections.length === 0) {
    return null;
  }

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="relative h-48 w-full overflow-hidden rounded-2xl mb-8">
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {collections.map((collection, index) => (
          <div
            key={collection.id}
            className="relative h-full w-full flex-shrink-0"
          >
            {collection.featuredAsset?.preview ? (
              <Image
                src={collection.featuredAsset.preview}
                alt={collection.name}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            ) : (
              <div className="w-full h-full bg-custom-dark-2 flex items-center justify-center text-gray-400">
                <span>بدون تصویر</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-start justify-center p-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {collection.name}
              </h2>
              <p className="text-gray-200 mb-4 text-sm">کالکشن جدید</p>
              <Link
                href={`/category/${collection.slug}`}
                className="bg-custom-yellow text-black font-bold py-2 px-4 rounded-lg text-sm hover:bg-yellow-500 transition-colors"
              >
                مشاهده محصولات
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 space-x-reverse">
        {collections.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            aria-label={`Go to slide ${slideIndex + 1}`}
            className={`h-2 w-2 rounded-full transition-colors duration-300 ${
              currentIndex === slideIndex
                ? "bg-white"
                : "bg-white/50 hover:bg-white/75"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
