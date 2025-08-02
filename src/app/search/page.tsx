// src/app/search/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "urql";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Product, Asset } from "@/types";
import { Suspense, useState } from "react";
import FilterDropdown from "@/components/FilterDropdown";

// کوئری برای جستجو و فیلتر کردن محصولات
const SEARCH_PRODUCTS_QUERY = `
  query SearchProducts($input: SearchInput!) {
    search(input: $input) {
      items {
        productId
        productName
        productVariantId
        productVariantName
        slug
        productAsset {
          id
          preview
        }
        price {
          ... on PriceRange {
            min
          }
          ... on SinglePrice {
            value
          }
        }
      }
      totalItems
    }
  }
`;

// تعریف یک تایپ مشخص برای آیتم‌های نتیجه جستجو
interface SearchResultItem {
  productId: string;
  productVariantId: string;
  productName: string;
  slug: string;
  productAsset: Asset;
  price: {
    min?: number;
    value?: number;
  };
}

// کامپوننت اصلی که منطق جستجو را در خود دارد
function SearchComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("term") || "";
  const initialCollectionIds =
    searchParams.get("collectionId")?.split(",") || [];

  const [isFilterOpen, setFilterOpen] = useState(false);

  const [result] = useQuery({
    query: SEARCH_PRODUCTS_QUERY,
    variables: {
      input: {
        term: searchTerm,
        facetValueIds: initialCollectionIds,
        groupByProduct: true,
      },
    },
  });

  const { data, fetching, error } = result;

  // تابعی برای اعمال فیلترها و به‌روزرسانی URL
  const handleApplyFilters = (filters: { collectionIds: string[] }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filters.collectionIds.length > 0) {
      params.set("collectionId", filters.collectionIds.join(","));
    } else {
      params.delete("collectionId");
    }
    router.replace(`/search?${params.toString()}`);
  };

  if (fetching) return <p className="p-8 text-center">در حال جستجو...</p>;
  if (error) return <p className="p-8 text-center">خطا: {error.message}</p>;

  const searchResults = data?.search.items || [];

  // تبدیل نتایج جستجو به فرمتی که کامپوننت ProductCard انتظار دارد
  const products: (Product & { variantId: string })[] = searchResults.map(
    (item: SearchResultItem) => ({
      id: item.productId,
      variantId: item.productVariantId,
      name: item.productName,
      slug: item.slug,
      featuredAsset: item.productAsset
        ? {
            id: item.productAsset.id,
            preview: item.productAsset.preview,
          }
        : undefined,
      variants: [
        {
          id: item.productVariantId,
          price: item.price.min || item.price.value || 0,
        },
      ],
    })
  );

  return (
    <div className="container mx-auto max-w-sm p-4 pb-28">
      <header className="flex items-center mb-6 relative">
        <Link href="/" className="absolute right-0">
          <span className="material-icons text-white">arrow_forward</span>
        </Link>
        <h1 className="text-xl font-bold text-center w-full">
          نتایج جستجو برای: &quot;{searchTerm}&quot;
        </h1>
      </header>

      {/* نوار فیلتر و نتایج - با positioning بهتر */}
      <div className="mb-6">
        <div className="flex items-center justify-between p-4 bg-custom-dark-2 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="material-icons text-custom-yellow text-sm">
              search
            </span>
            <p className="text-sm text-white">
              {data?.search.totalItems || 0} محصول یافت شد
            </p>
          </div>

          {/* Container برای دکمه فیلتر و dropdown */}
          <div className="relative z-[90]">
            <button
              onClick={() => setFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 text-sm transition-all duration-200 px-4 py-2 rounded-lg font-medium ${
                isFilterOpen
                  ? "bg-custom-yellow text-black shadow-lg"
                  : "text-custom-yellow hover:bg-custom-dark border border-custom-yellow/30"
              }`}
            >
              <span className="material-icons text-base">tune</span>
              <span>فیلترها</span>
              {initialCollectionIds.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {initialCollectionIds.length}
                </span>
              )}
            </button>

            {/* FilterDropdown */}
            <FilterDropdown
              isOpen={isFilterOpen}
              onClose={() => setFilterOpen(false)}
              onApplyFilters={handleApplyFilters}
              initialCollectionIds={initialCollectionIds}
            />
          </div>
        </div>

        {/* نمایش فیلترهای فعال */}
        {initialCollectionIds.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {initialCollectionIds.map((id, index) => (
              <span
                key={id}
                className="inline-flex items-center gap-1 bg-custom-yellow/20 text-custom-yellow px-3 py-1 rounded-full text-xs border border-custom-yellow/30"
              >
                <span className="material-icons text-xs">label</span>
                فیلتر {index + 1}
                <button
                  onClick={() => {
                    const newIds = initialCollectionIds.filter(
                      (colId) => colId !== id
                    );
                    handleApplyFilters({ collectionIds: newIds });
                  }}
                  className="hover:text-red-400 transition-colors"
                >
                  <span className="material-icons text-xs">close</span>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {products.map((product) => (
            <ProductCard key={product.variantId} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-16">
          <span className="material-icons text-6xl mb-4 text-gray-600">
            search_off
          </span>
          <p className="text-lg mb-2">محصولی یافت نشد</p>
          <p className="text-sm">لطفاً کلمات کلیدی دیگری امتحان کنید</p>
        </div>
      )}
    </div>
  );
}

// استفاده از Suspense برای حل مشکل useSearchParams در زمان build
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-custom-yellow border-t-transparent rounded-full animate-spin"></div>
            <span>در حال بارگذاری صفحه جستجو...</span>
          </div>
        </div>
      }
    >
      <SearchComponent />
    </Suspense>
  );
}
