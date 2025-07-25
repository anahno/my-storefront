// src/components/BottomNav.tsx

// یک prop به نام activePage اضافه می‌کنیم
export default function BottomNav({ activePage }: { activePage: string }) {
  // استایل‌های ثابت و متغیر را تعریف می‌کنیم تا کد تمیزتر باشد
  const inactiveClasses =
    "flex flex-col items-center p-2 rounded-full text-gray-400";
  const activeClasses =
    "flex flex-col items-center p-2 rounded-full text-custom-yellow";

  const inactiveCartClasses =
    "flex flex-col items-center p-2 rounded-full text-gray-400"; // سبد خرید در حالت عادی
  const activeCartClasses =
    "flex flex-col items-center p-4 rounded-full bg-custom-yellow text-black transform -translate-y-6 shadow-lg"; // سبد خرید در حالت فعال

  return (
    <nav className="bg-custom-dark-2 rounded-full flex justify-around items-center p-2 mt-auto fixed bottom-4 left-4 right-4 max-w-sm mx-auto z-50">
      {/* برای هر دکمه چک می‌کنیم که آیا صفحه فعال با نام آن یکی است یا نه */}
      <a
        className={activePage === "home" ? activeClasses : inactiveClasses}
        href="#"
      >
        <span className="material-icons">home</span>
        <span className="text-xs mt-1">خانه</span>
      </a>

      <a
        className={
          activePage === "categories" ? activeClasses : inactiveClasses
        }
        href="#"
      >
        <span className="material-icons">apps</span>
        <span className="text-xs mt-1">دسته‌بندی‌ها</span>
      </a>

      <a
        className={
          activePage === "cart" ? activeCartClasses : inactiveCartClasses
        }
        href="#"
      >
        <span className="material-icons">shopping_cart</span>
        {/* این بخش را هم کمی تغییر دادیم تا در هر دو حالت درست نمایش داده شود */}
        <span
          className={`text-xs mt-1 ${
            activePage === "cart" ? "absolute bottom-1" : ""
          }`}
        >
          سبد خرید
        </span>
      </a>

      <a
        className={activePage === "profile" ? activeClasses : inactiveClasses}
        href="#"
      >
        <span className="material-icons">person</span>
        <span className="text-xs mt-1">پروفایل</span>
      </a>
    </nav>
  );
}
