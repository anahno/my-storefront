// src/app/categories/page.tsx
"use client";

import { useQuery } from "urql";
import Link from "next/link";
import CategoryCard from "@/components/CategoryCard";

// ✅ کوئری را برای دریافت فیلد صحیح featuredAsset اصلاح می‌کنیم
const GET_ALL_COLLECTIONS_QUERY = `
  query GetAllCollections {
    collections(options: { take: 100 }) {
      items {
        id
        name
        featuredAsset {
          id
          preview
        }
      }
    }
  }
`;

export default function AllCategoriesPage() {
  const [result] = useQuery({ query: GET_ALL_COLLECTIONS_QUERY });
  const { data, fetching, error } = result;

  if (fetching)
    return <p className="p-8 text-center">در حال بارگذاری دسته‌بندی‌ها...</p>;
  if (error)
    return (
      <p className="p-8 text-center">اوه... خطایی رخ داد: {error.message}</p>
    );

  return (
    <div className="container mx-auto max-w-sm p-4 pb-28">
      <header className="flex items-center mb-6 relative">
        <Link href="/" className="absolute right-0">
          <span className="material-icons text-white">arrow_forward</span>
        </Link>
        <h1 className="text-xl font-bold text-center w-full">
          همه دسته‌بندی‌ها
        </h1>
      </header>
      <div className="grid grid-cols-2 gap-4">
        {data.collections.items.map((collection: any) => (
          <CategoryCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
}
