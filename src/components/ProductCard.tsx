// src/components/ProductCard.tsx
"use client";

// تعریف می‌کنیم که یک محصول چه فیلدهایی دارد
interface Product {
  id: string;
  name: string;
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

// تابع کمکی برای فرمت قیمت
const formatPrice = (price: number) => {
  return `${(price / 10).toLocaleString("fa-IR")} تومان`;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    // این div عرض کارت را در گرید کنترل می‌کند
    <div className="w-full">
      <div className="relative rounded-lg overflow-hidden mb-2">
        <img
          alt={product.name}
          className="w-full h-48 object-cover" // ارتفاع کارت را کمی بیشتر کردم
          src={product.featuredAsset?.preview}
        />
        <button className="absolute bottom-2 left-2 bg-custom-yellow text-black w-8 h-8 rounded-full flex items-center justify-center shadow-md">
          <span className="material-icons text-lg">add</span>
        </button>
      </div>
      <h3 className="text-white font-semibold truncate">{product.name}</h3>
      <p className="text-custom-yellow text-sm">
        {product.variants[0] ? formatPrice(product.variants[0].price) : ""}
      </p>
    </div>
  );
}
