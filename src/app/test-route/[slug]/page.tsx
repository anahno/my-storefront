import { createClient, gql, cacheExchange, fetchExchange } from "urql";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Product } from "@/types";

// ✅ ۱. تایپ params را دقیقاً مطابق با انتظار خطا، به عنوان Promise تعریف می‌کنیم
interface PageProps {
  params: Promise<{ slug: string }>;
}

// کوئری‌ها (بدون تغییر)
const GET_COLLECTION_QUERY = gql`
  query GetSingleCollection($slug: String!) {
    collection(slug: $slug) {
      id
      name
      description
      featuredAsset {
        id
        preview
        width
        height
      }
    }
  }
`;
const GET_PRODUCTS_BY_COLLECTION_ID_QUERY = gql`
  query GetProductsByCollectionId($collectionId: ID!) {
    products(options: { filter: { collectionId: { eq: $collectionId } } }) {
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

// تابع گرفتن دیتا (بدون تغییر)
async function getCategoryData(slug: string) {
  const client = createClient({
    url:
      process.env.NEXT_PUBLIC_VENDURE_API_URL ||
      "http://localhost:3000/shop-api",
    exchanges: [cacheExchange, fetchExchange],
  });
  const collectionResult = await client
    .query(GET_COLLECTION_QUERY, { slug })
    .toPromise();
  const collectionData = collectionResult.data?.collection;
  if (!collectionData) return null;
  const productsResult = await client
    .query(GET_PRODUCTS_BY_COLLECTION_ID_QUERY, {
      collectionId: collectionData.id,
    })
    .toPromise();
  const productsData = productsResult.data?.products?.items || [];
  return { collection: collectionData, products: productsData };
}

// کامپوننت اصلی صفحه
export default async function CategoryPage({ params }: PageProps) {
  // ✅ ۲. چون params یک Promise است، ابتدا آن را await می‌کنیم تا به مقدارش برسیم
  const resolvedParams = await params;
  const data = await getCategoryData(resolvedParams.slug);

  if (!data) {
    notFound();
  }
  const { collection, products } = data;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold mb-2">{collection.name}</h1>
        {collection.description && (
          <p className="text-lg text-gray-600">{collection.description}</p>
        )}
      </header>
      {collection.featuredAsset && (
        <div className="mb-12 rounded-lg overflow-hidden relative aspect-video">
          <Image
            src={collection.featuredAsset.preview}
            alt={`تصویر ${collection.name}`}
            fill
            className="w-full h-full object-cover"
            priority
          />
        </div>
      )}
      <main>
        <h2 className="text-2xl font-semibold mb-6">محصولات این دسته‌بندی</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
              >
                <div className="aspect-square bg-gray-100 relative">
                  {product.featuredAsset && (
                    <Image
                      src={product.featuredAsset.preview}
                      alt={product.name}
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800">{product.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            محصولی در این دسته‌بندی یافت نشد.
          </p>
        )}
      </main>
    </div>
  );
}
