// src/components/ProductCard.tsx
"use client";

import Link from "next/link";

// تابع کمکی برای فرمت قیمت
const formatPrice = (price: number) => {
  return `${(price / 10).toLocaleString("fa-IR")} تومان`;
};

// تعریف می‌کنیم که یک محصول چه فیلدهایی دارد
interface Product {
  id: string;
  name: string;
  slug: string; // slug برای ساختن لینک لازم است
  featuredAsset?: {
    preview: string;
  };
  variants: {
    price: number;
  }[];
}

// تعریف props برای کامپوننت
interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    // ✅ کل کارت را داخل یک تگ Link قرار می‌دهیم
    <Link href={`/product/${product.slug}`} className="w-full block">
      <div className="relative rounded-lg overflow-hidden mb-2">
        <img
          alt={product.name}
          className="w-full h-48 object-cover"
          src={product.featuredAsset?.preview}
        />
        {/* این دکمه فعلا کاری انجام نمی‌دهد چون کل کارت لینک است */}
        <div className="absolute bottom-2 left-2 bg-custom-yellow text-black w-8 h-8 rounded-full flex items-center justify-center shadow-md">
          <span className="material-icons text-lg">add</span>
        </div>
      </div>
      <h3 className="text-white font-semibold truncate">{product.name}</h3>
      <p className="text-custom-yellow text-sm">
        {product.variants[0] ? formatPrice(product.variants[0].price) : ""}
      </p>
    </Link> // ✅✅ این تگ بسته شدن جا افتاده بود ✅✅
  );
}
