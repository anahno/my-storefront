// src/components/BottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const getPage = () => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/categories")) return "categories";
    if (pathname.startsWith("/cart")) return "cart";
    if (pathname.startsWith("/profile")) return "profile";
    return ""; // برای صفحات دیگر مثل صفحه محصول
  };
  const activePage = getPage();

  const inactiveClasses =
    "flex flex-col items-center p-2 rounded-full text-gray-400";
  const activeClasses =
    "flex flex-col items-center p-2 rounded-full text-custom-yellow";
  const inactiveCartClasses =
    "flex flex-col items-center p-2 rounded-full text-gray-400";
  const activeCartClasses =
    "flex flex-col items-center p-4 rounded-full bg-custom-yellow text-black transform -translate-y-6 shadow-lg";

  return (
    <nav className="w-full bg-custom-dark-2 rounded-full flex justify-around items-center p-2">
      <Link
        href="/"
        className={activePage === "home" ? activeClasses : inactiveClasses}
      >
        <span className="material-icons">home</span>
        <span className="text-xs mt-1">خانه</span>
      </Link>
      <Link
        href="/categories"
        className={
          activePage === "categories" ? activeClasses : inactiveClasses
        }
      >
        <span className="material-icons">apps</span>
        <span className="text-xs mt-1">دسته‌بندی‌ها</span>
      </Link>
      <Link
        href="/cart"
        className={
          activePage === "cart" ? activeCartClasses : inactiveCartClasses
        }
      >
        <span className="material-icons">shopping_cart</span>
        <span
          className={`text-xs mt-1 ${
            activePage === "cart" ? "absolute bottom-1" : ""
          }`}
        >
          سبد خرید
        </span>
      </Link>
      <Link
        href="/profile"
        className={activePage === "profile" ? activeClasses : inactiveClasses}
      >
        <span className="material-icons">person</span>
        <span className="text-xs mt-1">پروفایل</span>
      </Link>
    </nav>
  );
}
