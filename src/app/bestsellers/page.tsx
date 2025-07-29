// src/app/bestsellers/page.tsx
"use client";

import { useQuery } from "urql";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types"; // ✅ ایمپورت کردن تایپ

// کوئری برای گرفتن همه محصولات
const GET_ALL_PRODUCTS_QUERY = `
  query GetAllProducts {
    products(options: { take: 100 }) {
      items {
        id
        name
        slug
        featuredAsset {
          id
          preview
        }
        variants {
          price
        }
      }
    }
  }
`;

export default function BestsellersPage() {
  const [result] = useQuery({ query: GET_ALL_PRODUCTS_QUERY });
  const { data, fetching, error } = result;

  if (fetching)
    return <p className="p-8 text-center">در حال بارگذاری همه محصولات...</p>;
  if (error)
    return (
      <p className="p-8 text-center">اوه... خطایی رخ داد: {error.message}</p>
    );

  return (
    <div className="container mx-auto max-w-sm p-4 pb-28">
      {/* هدر صفحه با عنوان و دکمه بازگشت */}
      <header className="flex items-center mb-6 relative">
        <Link href="/" className="absolute right-0">
          <span className="material-icons text-white">arrow_forward</span>
        </Link>
        <h1 className="text-xl font-bold text-center w-full">محصولات پرفروش</h1>
      </header>

      {/* نمایش محصولات در یک گرید */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {data.products.items.map(
          (
            product: Product // ✅ استفاده از تایپ مشخص
          ) => (
            <ProductCard key={product.id} product={product} />
          )
        )}
      </div>
    </div>
  );
}
