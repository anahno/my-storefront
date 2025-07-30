"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Collection } from "@/types"; // ✅ استفاده از تایپ سراسری به جای تایپ محلی

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
    return (
      <div className="h-48 w-full bg-custom-dark-2 rounded-2xl mb-8 flex items-center justify-center">
        <span className="text-gray-400">
          هیچ دسته‌بندی‌ای برای نمایش وجود ندارد
        </span>
      </div>
    );
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
            {/* ✅ بررسی وجود featuredAsset و نمایش تصویر */}
            {collection.featuredAsset?.preview ? (
              <Image
                src={collection.featuredAsset.preview}
                alt={collection.name}
                fill
                className="object-cover"
                priority={index === 0} // فقط تصویر اول priority دارد
                sizes="(max-width: 640px) 100vw, 640px"
              />
            ) : (
              // ✅ در صورت نبود تصویر، یک پس‌زمینه خالی نمایش داده می‌شود
              <div className="w-full h-full bg-gradient-to-br from-custom-dark-2 to-custom-dark flex items-center justify-center">
                <div className="text-center">
                  <span className="material-icons text-6xl text-gray-600 mb-2">
                    category
                  </span>
                  <p className="text-gray-400 text-sm">بدون تصویر</p>
                </div>
              </div>
            )}

            {/* ✅ لایه overlay برای بهتر خوانده شدن متن */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-start justify-end p-6">
              <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                {collection.name}
              </h2>
              <p className="text-gray-200 mb-4 text-sm">کالکشن ویژه</p>
              <Link
                href={`/category/${collection.slug}`}
                className="bg-custom-yellow text-black font-bold py-2 px-4 rounded-lg text-sm hover:bg-yellow-400 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                مشاهده محصولات
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ نقاط ناوبری در پایین اسلایدر */}
      {collections.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 space-x-reverse">
          {collections.map((_, slideIndex) => (
            <button
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              aria-label={`رفتن به اسلاید ${slideIndex + 1}`}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                currentIndex === slideIndex
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}

      {/* ✅ دکمه‌های کنترل اختیاری (در صورت نیاز) */}
      {collections.length > 1 && (
        <>
          <button
            onClick={() =>
              goToSlide(
                (currentIndex - 1 + collections.length) % collections.length
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
            aria-label="اسلاید قبلی"
          >
            <span className="material-icons">chevron_right</span>
          </button>
          <button
            onClick={() => goToSlide((currentIndex + 1) % collections.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
            aria-label="اسلاید بعدی"
          >
            <span className="material-icons">chevron_left</span>
          </button>
        </>
      )}
    </div>
  );
}
