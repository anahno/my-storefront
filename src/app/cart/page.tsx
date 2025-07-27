// src/app/cart/page.tsx
"use client";

import { useQuery, useMutation } from "urql";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import CartItem from "@/components/CartItem"; // ✅ ایمپورت کامپوننت جدید

// ۱. کوئری برای گرفتن اطلاعات کامل سبد خرید (سفارش فعال)
const GET_ACTIVE_ORDER_QUERY = `
  query GetActiveOrder {
    activeOrder {
      id
      subTotal
      total
      totalQuantity
      lines {
        id
        quantity
        linePrice
        featuredAsset {
          preview
        }
        productVariant {
          name
        }
      }
    }
  }
`;

// ۲. Mutation برای تغییر تعداد یک آیتم
const ADJUST_ORDER_LINE_MUTATION = `
  mutation AdjustOrderLine($lineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $lineId, quantity: $quantity) {
      ... on Order {
        id
      }
    }
  }
`;

// ۳. Mutation برای حذف یک آیتم
const REMOVE_ORDER_LINE_MUTATION = `
  mutation RemoveOrderLine($lineId: ID!) {
    removeOrderLine(orderLineId: $lineId) {
      ... on Order {
        id
      }
    }
  }
`;

// تابع کمکی برای فرمت قیمت
const formatPrice = (price: number) => {
  return `${(price / 10).toLocaleString("fa-IR")} تومان`;
};

export default function CartPage() {
  const [result, reexecuteQuery] = useQuery({
    query: GET_ACTIVE_ORDER_QUERY,
    // ✅ این خط تضمین می‌کند که سبد خرید همیشه به‌روز باشد
    requestPolicy: "cache-and-network",
  });

  const [adjustResult, executeAdjust] = useMutation(ADJUST_ORDER_LINE_MUTATION);
  const [removeResult, executeRemove] = useMutation(REMOVE_ORDER_LINE_MUTATION);

  const { data, fetching, error } = result;

  const handleAdjustQuantity = async (lineId: string, quantity: number) => {
    const result = await executeAdjust({ lineId, quantity });
    if (!result.error) {
      // ✅ بعد از هر تغییر، اطلاعات سبد خرید را دوباره از سرور می‌گیریم
      reexecuteQuery({ requestPolicy: "network-only" });
    }
  };

  const handleRemoveItem = async (lineId: string) => {
    const result = await executeRemove({ lineId });
    if (!result.error) {
      // ✅ بعد از هر تغییر، اطلاعات سبد خرید را دوباره از سرور می‌گیریم
      reexecuteQuery({ requestPolicy: "network-only" });
    }
  };

  if (fetching && !data)
    return <p className="p-8 text-center">در حال بارگذاری سبد خرید...</p>;
  if (error)
    return (
      <p className="p-8 text-center">خطا در دریافت اطلاعات: {error.message}</p>
    );

  const order = data?.activeOrder;

  // اگر سبد خرید خالی بود
  if (!order || order.lines.length === 0) {
    return (
      <div className="container mx-auto max-w-sm p-4 text-center">
        <header className="flex items-center mb-6 relative">
          <h1 className="text-xl font-bold text-center w-full">سبد خرید</h1>
        </header>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <span className="material-icons text-7xl mb-4 text-gray-600">
            shopping_cart_off
          </span>
          <p className="mb-4 text-gray-400">
            سبد خرید شما در حال حاضر خالی است.
          </p>
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

  return (
    <div className="container mx-auto max-w-sm p-4 pb-28">
      <header className="flex items-center mb-6 relative">
        <h1 className="text-xl font-bold text-center w-full">
          سبد خرید ({order.totalQuantity})
        </h1>
      </header>

      {/* لیست آیتم‌های سبد خرید */}
      <div className="space-y-4 mb-8">
        {order.lines.map((line: any) => (
          <CartItem
            key={line.id}
            item={line}
            onAdjust={handleAdjustQuantity}
            onRemove={handleRemoveItem}
          />
        ))}
      </div>

      {/* خلاصه سبد خرید */}
      <div className="bg-custom-dark-2 p-4 rounded-lg space-y-3">
        <div className="flex justify-between text-gray-300">
          <span>جمع کل</span>
          <span>{formatPrice(order.subTotal)}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>هزینه ارسال</span>
          <span>رایگان</span> {/* فعلا ثابت */}
        </div>
        <div className="border-t border-gray-700 my-2"></div>
        <div className="flex justify-between font-bold text-lg">
          <span>مبلغ قابل پرداخت</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      {/* دکمه ادامه خرید */}
      <div className="mt-8">
        <button className="w-full bg-custom-yellow text-black font-bold py-3 rounded-full">
          ادامه فرآیند خرید
        </button>
      </div>
    </div>
  );
}
