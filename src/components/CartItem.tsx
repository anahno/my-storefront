// src/components/CartItem.tsx
"use client";

import { useState } from "react";

// تابع کمکی برای فرمت قیمت
const formatPrice = (price: number) => {
  return `${(price / 10).toLocaleString("fa-IR")} تومان`;
};

// تعریف نوع داده برای یک آیتم در سبد خرید
interface OrderLine {
  id: string;
  quantity: number;
  linePrice: number;
  featuredAsset: {
    preview: string;
  };
  productVariant: {
    name: string;
  };
}

// تعریف props کامپوننت
interface CartItemProps {
  item: OrderLine;
  onAdjust: (lineId: string, quantity: number) => Promise<void>;
  onRemove: (lineId: string) => Promise<void>;
}

export default function CartItem({ item, onAdjust, onRemove }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (action: "increase" | "decrease" | "remove") => {
    setIsUpdating(true);
    if (action === "increase") {
      await onAdjust(item.id, item.quantity + 1);
    }
    if (action === "decrease") {
      if (item.quantity > 1) {
        await onAdjust(item.id, item.quantity - 1);
      } else {
        await onRemove(item.id);
      }
    }
    if (action === "remove") {
      await onRemove(item.id);
    }
    setIsUpdating(false);
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg bg-custom-dark-2 transition-opacity ${
        isUpdating ? "opacity-50" : "opacity-100"
      }`}
    >
      <img
        src={item.featuredAsset.preview}
        alt={item.productVariant.name}
        className="w-20 h-20 object-cover rounded-md"
      />
      <div className="flex-grow">
        <p className="font-bold">{item.productVariant.name}</p>
        <p className="text-sm text-custom-yellow">
          {formatPrice(item.linePrice)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleUpdate("increase")}
          disabled={isUpdating}
          className="bg-custom-dark p-1 rounded-md"
        >
          +
        </button>
        <span className="font-bold w-6 text-center">{item.quantity}</span>
        <button
          onClick={() => handleUpdate("decrease")}
          disabled={isUpdating}
          className="bg-custom-dark p-1 rounded-md"
        >
          -
        </button>
      </div>
    </div>
  );
}
