// src/app/search/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "urql";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Product, Asset } from "@/types";
import { Suspense, useState } from "react";
import FilterDropdown from "@/components/FilterDropdown"; // ✅ ایمپورت جدید

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

      {/* ✅ نوار فیلتر و نتایج */}
      <div className="relative mb-6">
        <div className="flex items-center justify-between p-3 bg-custom-dark-2 rounded-lg">
          <p className="text-sm">
            {data?.search.totalItems || 0} محصول یافت شد
          </p>
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-1 text-sm transition-colors px-3 py-1 rounded-lg ${
                isFilterOpen
                  ? "bg-custom-yellow text-black"
                  : "text-custom-yellow hover:bg-custom-dark"
              }`}
            >
              <span className="material-icons text-base">tune</span>
              <span>فیلترها</span>
              {initialCollectionIds.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {initialCollectionIds.length}
                </span>
              )}
            </button>

            {/* ✅ FilterDropdown جدید */}
            <FilterDropdown
              isOpen={isFilterOpen}
              onClose={() => setFilterOpen(false)}
              onApplyFilters={handleApplyFilters}
              initialCollectionIds={initialCollectionIds}
            />
          </div>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {products.map((product) => (
            <ProductCard key={product.variantId} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-12">
          محصولی مطابق با جستجوی شما یافت نشد.
        </p>
      )}
    </div>
  );
}

// استفاده از Suspense برای حل مشکل useSearchParams در زمان build
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <p className="p-8 text-center">در حال بارگذاری صفحه جستجو...</p>
      }
    >
      <SearchComponent />
    </Suspense>
  );
}
