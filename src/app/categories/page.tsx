"use client";

import { useQuery, gql } from "urql";
import { Collection } from "@/types"; // ✅ این ایمپورت برای تعریف نوع لازم است
import CategoryCard from "@/components/CategoryCard";

const ALL_COLLECTIONS_QUERY = gql`
  query GetAllCollections {
    collections {
      items {
        id
        name
        slug
        featuredAsset {
          id
          preview
          width
          height
        }
      }
    }
  }
`;

export default function CategoriesPage() {
  const [result] = useQuery({ query: ALL_COLLECTIONS_QUERY });
  const { data, fetching, error } = result;

  if (fetching)
    return <p className="p-8 text-center text-lg">در حال بارگذاری...</p>;
  if (error)
    return <p className="p-8 text-center text-red-600">خطا: {error.message}</p>;

  const collections = data?.collections?.items || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold my-8 text-center">همه دسته‌بندی‌ها</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* ✅ مشکل اینجا حل شد: نوع متغیر collection مشخص شد */}
        {collections.map((collection: Collection) => (
          <CategoryCard key={collection.id} category={collection} />
        ))}
      </div>
    </div>
  );
}
