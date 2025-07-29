// src/components/FilterModal.tsx
"use client";

import { useState, useEffect } from "react";
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
interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: { collectionIds: string[] }) => void;
  initialCollectionIds?: string[];
}

export default function FilterModal({
  isOpen,
  onClose,
  onApplyFilters,
  initialCollectionIds = [],
}: FilterModalProps) {
  const [result] = useQuery({ query: GET_ALL_COLLECTIONS_QUERY });
  const { data, fetching, error } = result;

  const [selectedCollectionIds, setSelectedCollectionIds] =
    useState<string[]>(initialCollectionIds);

  useEffect(() => {
    setSelectedCollectionIds(initialCollectionIds);
  }, [JSON.stringify(initialCollectionIds)]);

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
    // ✅ تغییر از items-end به items-center برای نمایش در وسط صفحه
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      {/* ✅ تغییر استایل‌ها برای نمایش بهتر مودال */}
      <div
        className="bg-custom-dark-2 w-full max-w-sm rounded-2xl p-4 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between pb-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">فیلترها</h2>
          <button onClick={onClose} className="material-icons">
            close
          </button>
        </header>

        <main className="flex-grow overflow-y-auto py-4">
          <h3 className="font-bold mb-3">دسته‌بندی‌ها</h3>
          {fetching && <p>در حال بارگذاری دسته‌بندی‌ها...</p>}
          {error && <p>خطا در دریافت دسته‌بندی‌ها.</p>}
          <div className="space-y-3">
            {data?.collections.items.map((collection: Collection) => (
              <label
                key={collection.id}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCollectionIds.includes(collection.id)}
                  onChange={() => handleToggleCollection(collection.id)}
                  className="w-5 h-5 rounded bg-custom-dark border-gray-600 accent-custom-yellow"
                />
                <span className="text-white">{collection.name}</span>
              </label>
            ))}
          </div>
        </main>

        <footer className="flex items-center gap-4 pt-4 border-t border-gray-700">
          <button
            onClick={handleApply}
            className="flex-grow bg-custom-yellow text-black font-bold py-3 rounded-lg"
          >
            اعمال فیلتر
          </button>
          <button
            onClick={handleClear}
            className="bg-custom-dark text-white py-3 px-4 rounded-lg"
          >
            پاک کردن
          </button>
        </footer>
      </div>
    </div>
  );
}
