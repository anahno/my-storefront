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
      className="absolute top-full left-0 right-0 mt-2 bg-custom-dark-2 rounded-2xl shadow-2xl border border-gray-700 z-50 overflow-hidden"
    >
      {/* هدر فیلتر */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="font-bold text-white">فیلتر دسته‌بندی‌ها</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <span className="material-icons text-sm">close</span>
        </button>
      </div>

      {/* محتوای فیلتر */}
      <div className="max-h-64 overflow-y-auto">
        {fetching && (
          <div className="p-4 text-center text-gray-400">
            در حال بارگذاری دسته‌بندی‌ها...
          </div>
        )}

        {error && (
          <div className="p-4 text-center text-red-400">
            خطا در دریافت دسته‌بندی‌ها
          </div>
        )}

        {data?.collections.items && (
          <div className="p-4 space-y-3">
            {data.collections.items.map((collection: Collection) => (
              <label
                key={collection.id}
                className="flex items-center gap-3 cursor-pointer hover:bg-custom-dark p-2 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedCollectionIds.includes(collection.id)}
                  onChange={() => handleToggleCollection(collection.id)}
                  className="w-4 h-4 rounded bg-custom-dark border-gray-600 text-custom-yellow focus:ring-custom-yellow focus:ring-1"
                />
                <span className="text-white text-sm">{collection.name}</span>
                {selectedCollectionIds.includes(collection.id) && (
                  <span className="material-icons text-custom-yellow text-sm">
                    check
                  </span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* فوتر با دکمه‌ها */}
      <div className="flex items-center gap-3 p-4 border-t border-gray-700 bg-custom-dark">
        <button
          onClick={handleApply}
          className="flex-1 bg-custom-yellow text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors"
        >
          اعمال فیلتر
          {selectedCollectionIds.length > 0 && (
            <span className="mr-1">({selectedCollectionIds.length})</span>
          )}
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors"
        >
          پاک کردن
        </button>
      </div>
    </div>
  );
}
