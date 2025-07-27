// src/components/ProductCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image"; // ✅ ایمپورت کردن کامپوننت Image
import { Product } from "@/types"; // ✅ ایمپورت کردن تایپ Product

// تابع کمکی برای فرمت قیمت
const formatPrice = (price: number) => {
  return `${(price / 10).toLocaleString("fa-IR")} تومان`;
};

// تعریف props برای کامپوننت
interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.slug}`} className="w-full block">
      <div className="relative rounded-lg overflow-hidden mb-2 h-48 bg-custom-dark-2">
        {/* ✅ تگ img با کامپوننت Image جایگزین شد */}
        {product.featuredAsset?.preview && (
          <Image
            alt={product.name}
            src={product.featuredAsset.preview}
            fill
            style={{ objectFit: "cover" }}
            className="w-full h-full"
          />
        )}
        <div className="absolute bottom-2 left-2 bg-custom-yellow text-black w-8 h-8 rounded-full flex items-center justify-center shadow-md">
          <span className="material-icons text-lg">add</span>
        </div>
      </div>
      <h3 className="text-white font-semibold truncate">{product.name}</h3>
      <p className="text-custom-yellow text-sm">
        {product.variants[0] ? formatPrice(product.variants[0].price) : ""}
      </p>
    </Link>
  );
}
