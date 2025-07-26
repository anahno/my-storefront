// src/app/cart/page.tsx
"use client";

import BottomNav from "@/components/BottomNav";
import Link from "next/link";

export default function CartPage() {
  return (
    <div className="container mx-auto max-w-sm p-4 pb-28">
      <header className="flex items-center mb-6 relative">
        <h1 className="text-xl font-bold text-center w-full">سبد خرید</h1>
      </header>

      <div className="text-center text-gray-400">
        <span className="material-icons text-7xl mb-4">shopping_cart_off</span>
        <p className="mb-4">سبد خرید شما در حال حاضر خالی است.</p>
        <Link
          href="/"
          className="bg-custom-yellow text-black font-bold py-2 px-6 rounded-lg"
        >
          مشاهده محصولات
        </Link>
      </div>
    </div>
  );
}
