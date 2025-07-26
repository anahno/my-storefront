// src/app/bestsellers/page.tsx
"use client";

import { useQuery } from "urql";
import Link from "next/link";
import ProductCard from "@/components/ProductCard"; // ✅ استفاده مجدد از کارت محصول
import BottomNav from "@/components/BottomNav";

// 1. یک کوئری جدید برای گرفتن همه محصولات
//    اینجا می‌توانیم take را روی عدد بزرگی مثل 100 تنظیم کنیم
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
      {/* 2. هدر صفحه با عنوان و دکمه بازگشت */}
      <header className="flex items-center mb-6 relative">
        <Link href="/" className="absolute right-0">
          <span className="material-icons text-white">arrow_forward</span>
        </Link>
        <h1 className="text-xl font-bold text-center w-full">محصولات پرفروش</h1>
      </header>

      {/* 3. نمایش محصولات در یک گرید */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {data.products.items.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* ناوبری پایین صفحه */}
      <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto">
        <BottomNav activePage="" /> {/* هیچ صفحه‌ای فعال نیست */}
      </div>
    </div>
  );
}
