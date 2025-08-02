"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "urql";
import { Collection } from "@/types";

// کوئری برای گرفتن تمام دسته‌بندی‌ها برای نمایش در فیلتر
const GET_ALL_COLLECTIONS_QUERY = `
  query GetAllCollectionsForFilter {
    collections(options: { take: 100 }) {
      items {
        id
        name
      }
    }
  }
`;

// تابع هوشمند برای انتخاب آیکن مناسب بر اساس نام دسته‌بندی
const getSmartIcon = (categoryName: string): string => {
  const name = categoryName.toLowerCase();

  // الکترونیکی و دیجیتال
  if (
    name.includes("electronics") ||
    name.includes("الکترونیک") ||
    name.includes("electronic")
  )
    return "electrical_services";
  if (
    name.includes("laptop") ||
    name.includes("لپ تاپ") ||
    name.includes("computer")
  )
    return "laptop_mac";
  if (
    name.includes("phone") ||
    name.includes("موبایل") ||
    name.includes("mobile")
  )
    return "smartphone";
  if (name.includes("tablet") || name.includes("تبلت")) return "tablet_mac";
  if (name.includes("camera") || name.includes("دوربین")) return "photo_camera";
  if (
    name.includes("headphone") ||
    name.includes("هدفون") ||
    name.includes("audio")
  )
    return "headphones";
  if (name.includes("gaming") || name.includes("بازی") || name.includes("game"))
    return "sports_esports";
  if (
    name.includes("tv") ||
    name.includes("تلویزیون") ||
    name.includes("television")
  )
    return "tv";
  if (
    name.includes("watch") ||
    name.includes("ساعت") ||
    name.includes("smart watch")
  )
    return "watch";

  // پوشاک و مد
  if (
    name.includes("clothing") ||
    name.includes("لباس") ||
    name.includes("apparel")
  )
    return "checkroom";
  if (
    name.includes("shoes") ||
    name.includes("کفش") ||
    name.includes("footwear")
  )
    return "directions_walk";
  if (name.includes("bag") || name.includes("کیف") || name.includes("handbag"))
    return "work_outline";
  if (
    name.includes("accessories") ||
    name.includes("اکسسوری") ||
    name.includes("jewelry")
  )
    return "diamond";
  if (name.includes("men") || name.includes("مردانه")) return "person";
  if (name.includes("women") || name.includes("زنانه")) return "person_outline";
  if (
    name.includes("kids") ||
    name.includes("بچگانه") ||
    name.includes("children")
  )
    return "child_care";

  // خانه و آشپزخانه
  if (name.includes("home") || name.includes("خانه") || name.includes("house"))
    return "home";
  if (
    name.includes("kitchen") ||
    name.includes("آشپزخانه") ||
    name.includes("appliance")
  )
    return "kitchen";
  if (
    name.includes("furniture") ||
    name.includes("مبل") ||
    name.includes("chair")
  )
    return "chair";
  if (
    name.includes("decor") ||
    name.includes("دکوراسیون") ||
    name.includes("decoration")
  )
    return "palette";
  if (name.includes("garden") || name.includes("باغ") || name.includes("plant"))
    return "yard";
  if (name.includes("bathroom") || name.includes("حمام")) return "bathtub";
  if (name.includes("bedroom") || name.includes("اتاق خواب")) return "bed";

  // ورزش و تفریح
  if (
    name.includes("sport") ||
    name.includes("ورزش") ||
    name.includes("fitness")
  )
    return "fitness_center";
  if (
    name.includes("outdoor") ||
    name.includes("کمپینگ") ||
    name.includes("camping")
  )
    return "nature_people";
  if (
    name.includes("bicycle") ||
    name.includes("دوچرخه") ||
    name.includes("bike")
  )
    return "pedal_bike";
  if (name.includes("swimming") || name.includes("شنا")) return "pool";
  if (name.includes("gym") || name.includes("باشگاه")) return "fitness_center";

  // زیبایی و بهداشت
  if (
    name.includes("beauty") ||
    name.includes("زیبایی") ||
    name.includes("cosmetic")
  )
    return "face_retouching_natural";
  if (
    name.includes("health") ||
    name.includes("بهداشت") ||
    name.includes("medical")
  )
    return "medical_services";
  if (
    name.includes("perfume") ||
    name.includes("عطر") ||
    name.includes("fragrance")
  )
    return "fragrance";
  if (name.includes("skincare") || name.includes("مراقبت پوست")) return "spa";

  // کتاب و فرهنگ
  if (
    name.includes("book") ||
    name.includes("کتاب") ||
    name.includes("literature")
  )
    return "menu_book";
  if (
    name.includes("music") ||
    name.includes("موسیقی") ||
    name.includes("instrument")
  )
    return "music_note";
  if (name.includes("art") || name.includes("هنر") || name.includes("craft"))
    return "brush";
  if (
    name.includes("education") ||
    name.includes("آموزش") ||
    name.includes("learning")
  )
    return "school";

  // خودرو و حمل نقل
  if (
    name.includes("car") ||
    name.includes("خودرو") ||
    name.includes("automotive")
  )
    return "directions_car";
  if (
    name.includes("motorcycle") ||
    name.includes("موتور") ||
    name.includes("bike")
  )
    return "motorcycle";
  if (
    name.includes("parts") ||
    name.includes("قطعات") ||
    name.includes("spare")
  )
    return "build";

  // غذا و نوشیدنی
  if (name.includes("food") || name.includes("غذا") || name.includes("snack"))
    return "restaurant";
  if (
    name.includes("drink") ||
    name.includes("نوشیدنی") ||
    name.includes("beverage")
  )
    return "local_cafe";
  if (name.includes("organic") || name.includes("ارگانیک")) return "eco";

  // اسباب بازی و سرگرمی
  if (
    name.includes("toy") ||
    name.includes("اسباب بازی") ||
    name.includes("doll")
  )
    return "toys";
  if (name.includes("board game") || name.includes("بازی فکری"))
    return "extension";
  if (name.includes("puzzle") || name.includes("پازل")) return "puzzle";

  // ابزار و تجهیزات
  if (
    name.includes("tool") ||
    name.includes("ابزار") ||
    name.includes("equipment")
  )
    return "handyman";
  if (name.includes("hardware") || name.includes("سخت افزار"))
    return "hardware";
  if (name.includes("software") || name.includes("نرم افزار")) return "code";

  // پیش‌فرض
  return "category";
};

// تعریف پراپرتی‌های ورودی کامپوننت
interface FilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: { collectionIds: string[] }) => void;
  initialCollectionIds?: string[];
}

export default function FilterDropdown({
  isOpen,
  onClose,
  onApplyFilters,
  initialCollectionIds = [],
}: FilterDropdownProps) {
  const [result] = useQuery({ query: GET_ALL_COLLECTIONS_QUERY });
  const { data, fetching, error } = result;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedCollectionIds, setSelectedCollectionIds] =
    useState<string[]>(initialCollectionIds);

  useEffect(() => {
    setSelectedCollectionIds(initialCollectionIds);
  }, [JSON.stringify(initialCollectionIds)]);

  // بستن dropdown هنگام کلیک خارج از آن
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleToggleCollection = (id: string) => {
    setSelectedCollectionIds((prev) =>
      prev.includes(id) ? prev.filter((colId) => colId !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    onApplyFilters({ collectionIds: selectedCollectionIds });
    onClose();
  };

  const handleClear = () => {
    setSelectedCollectionIds([]);
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 mt-2 w-80 bg-custom-dark-2/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50 z-[100] overflow-hidden"
      style={{ minWidth: "320px" }}
    >
      {/* هدر فیلتر */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-custom-dark/90 backdrop-blur-sm">
        <h3 className="font-bold text-white text-lg">فیلتر دسته‌بندی‌ها</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-600/50 rounded-full"
        >
          <span className="material-icons text-xl">close</span>
        </button>
      </div>

      {/* محتوای فیلتر */}
      <div className="max-h-64 overflow-y-auto">
        {fetching && (
          <div className="p-6 text-center text-gray-400">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-custom-yellow border-t-transparent rounded-full animate-spin"></div>
              <span>در حال بارگذاری دسته‌بندی‌ها...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-6 text-center text-red-400">
            <span className="material-icons text-2xl mb-2">error_outline</span>
            <div>خطا در دریافت دسته‌بندی‌ها</div>
          </div>
        )}

        {data?.collections.items && (
          <div className="p-4 space-y-2">
            {data.collections.items.map((collection: Collection) => (
              <label
                key={collection.id}
                className="flex items-center gap-3 cursor-pointer hover:bg-custom-dark/60 p-3 rounded-lg transition-all duration-200 group backdrop-blur-sm"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedCollectionIds.includes(collection.id)}
                    onChange={() => handleToggleCollection(collection.id)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-sm border-2 cursor-pointer transition-all duration-200 ${
                      selectedCollectionIds.includes(collection.id)
                        ? "bg-custom-yellow border-custom-yellow"
                        : "border-gray-600 bg-transparent hover:border-gray-400"
                    }`}
                  ></div>
                </div>

                {/* آیکن هوشمند */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                    selectedCollectionIds.includes(collection.id)
                      ? "bg-custom-yellow/20 text-custom-yellow"
                      : "bg-gray-700/50 text-gray-400 group-hover:text-gray-300"
                  }`}
                >
                  <span className="material-icons text-lg">
                    {getSmartIcon(collection.name)}
                  </span>
                </div>

                <span className="text-white text-sm flex-1 group-hover:text-custom-yellow transition-colors">
                  {collection.name}
                </span>
                {selectedCollectionIds.includes(collection.id) && (
                  <div className="w-2 h-2 bg-custom-yellow rounded-sm shadow-lg"></div>
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* فوتر با دکمه‌ها */}
      <div className="flex items-center gap-3 p-4 border-t border-gray-700/50 bg-custom-dark/90 backdrop-blur-sm">
        <button
          onClick={handleApply}
          className="flex-1 bg-custom-yellow text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          <span className="flex items-center justify-center gap-1">
            <span className="material-icons text-sm">done</span>
            اعمال فیلتر
            {selectedCollectionIds.length > 0 && (
              <span className="bg-black text-custom-yellow text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {selectedCollectionIds.length}
              </span>
            )}
          </span>
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-600/80 backdrop-blur-sm text-white py-3 px-4 rounded-lg hover:bg-gray-500/80 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="flex items-center gap-1">
            <span className="material-icons text-sm">clear</span>
            پاک کردن
          </span>
        </button>
      </div>
    </div>
  );
}
