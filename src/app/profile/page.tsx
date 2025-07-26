// src/app/profile/page.tsx
"use client";

import { useQuery, useMutation } from "urql";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

const GET_CUSTOMER_DETAILS_QUERY = `
  query GetCustomerDetails {
    activeCustomer {
      id
      firstName
      lastName
      emailAddress
      phoneNumber
      orders(options: { take: 100 }) {
        items {
          state
          active
        }
        totalItems
      }
      addresses {
        id
        streetLine1
        city
        province
      }
    }
  }
`;

const LOGOUT_MUTATION = `
  mutation Logout {
    logout {
      success
    }
  }
`;

const SettingsLink = ({
  icon,
  text,
  href = "#",
}: {
  icon: string;
  text: string;
  href?: string;
}) => (
  <Link
    href={href}
    className="flex items-center justify-between p-4 bg-custom-dark-2 rounded-lg mb-3"
  >
    <div className="flex items-center">
      <span className="material-icons text-gray-400 ml-4">{icon}</span>
      <span className="text-white">{text}</span>
    </div>
    <span className="material-icons text-gray-400">chevron_left</span>
  </Link>
);

export default function ProfilePage() {
  const router = useRouter();

  // ✅✅ تغییر اصلی اینجاست ✅✅
  // ما به useQuery می‌گوییم که همیشه از شبکه برای گرفتن اطلاعات استفاده کند
  const [getResult, reexecuteQuery] = useQuery({
    query: GET_CUSTOMER_DETAILS_QUERY,
    requestPolicy: "cache-and-network",
  });
  const { data, fetching, error } = getResult;

  const [logoutResult, executeLogout] = useMutation(LOGOUT_MUTATION);

  const handleLogout = async () => {
    await executeLogout({});
    // بعد از خروج، کوئری را دوباره اجرا می‌کنیم تا مطمئن شویم کاربر null است
    reexecuteQuery({ requestPolicy: "network-only" });
    router.push("/");
  };

  if (fetching)
    return <p className="p-8 text-center">در حال بارگذاری اطلاعات...</p>;
  if (error) return <p className="p-8 text-center">خطا: {error.message}</p>;

  if (!data || !data.activeCustomer) {
    return (
      <div className="container mx-auto max-w-sm p-4 text-center flex flex-col justify-center min-h-screen">
        <h1 className="text-xl font-bold mb-4">حساب کاربری</h1>
        <p className="text-gray-400 mb-6">
          برای مشاهده اطلاعات حساب کاربری، لطفا ابتدا وارد شوید.
        </p>
        <Link
          href="/login"
          className="bg-custom-yellow text-black font-bold py-3 px-8 rounded-lg self-center"
        >
          ورود / ثبت‌نام
        </Link>
      </div>
    );
  }

  const customer = data.activeCustomer;
  const fullName = `${customer.firstName || ""} ${
    customer.lastName || ""
  }`.trim();
  const primaryAddress = customer.addresses[0]
    ? `${customer.addresses[0].province}، ${customer.addresses[0].city}، ${customer.addresses[0].streetLine1}`
    : "شما هنوز آدرسی ثبت نکرده‌اید.";
  const orderStats = {
    total: customer.orders.totalItems,
    active: customer.orders.items.filter((o: any) => o.active).length,
    cancelled: customer.orders.items.filter((o: any) => o.state === "Cancelled")
      .length,
  };

  return (
    <div className="container mx-auto max-w-sm p-4 pb-28">
      <header className="flex items-center mb-8 relative">
        <h1 className="text-xl font-bold text-center w-full">حساب کاربری</h1>
      </header>

      <div className="flex items-center mb-8">
        <img
          src={`https://i.pravatar.cc/150?u=${customer.emailAddress}`}
          alt="آواتار کاربر"
          className="w-16 h-16 rounded-full ml-4"
        />
        <div>
          <h2 className="text-lg font-bold text-white">{fullName}</h2>
          <p className="text-sm text-gray-400">{customer.emailAddress}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center mb-10">
        <Link
          href="/profile/orders"
          className="bg-custom-dark-2 p-4 rounded-xl"
        >
          <p className="text-2xl font-bold text-custom-yellow mb-1">
            {orderStats.total}
          </p>
          <p className="text-sm text-gray-300">کل سفارشات</p>
        </Link>
        <Link
          href="/profile/orders?filter=active"
          className="bg-custom-dark-2 p-4 rounded-xl"
        >
          <p className="text-2xl font-bold text-custom-yellow mb-1">
            {orderStats.active}
          </p>
          <p className="text-sm text-gray-300">سفارشات فعال</p>
        </Link>
        <Link
          href="/profile/orders?filter=cancelled"
          className="bg-custom-dark-2 p-4 rounded-xl"
        >
          <p className="text-2xl font-bold text-custom-yellow mb-1">
            {orderStats.cancelled}
          </p>
          <p className="text-sm text-gray-300">سفارشات لغو شده</p>
        </Link>
      </div>

      <div>
        <h3 className="text-gray-400 text-sm mb-3">تنظیمات حساب</h3>
        <SettingsLink
          icon="receipt_long"
          text="سفارشات"
          href="/profile/orders"
        />
        <SettingsLink icon="published_with_changes" text="مرجوعیات" />
        <SettingsLink
          icon="phone_iphone"
          text={`شماره موبایل: ${customer.phoneNumber || "ثبت نشده"}`}
        />
        <SettingsLink icon="email" text={`ایمیل: ${customer.emailAddress}`} />
      </div>

      <div className="mt-8">
        <h3 className="text-gray-400 text-sm mb-3">آدرس من</h3>
        <div className="p-4 bg-custom-dark-2 rounded-lg mb-3">
          <p className="text-white leading-relaxed">{primaryAddress}</p>
          <Link
            href="/profile/addresses"
            className="text-custom-yellow text-sm mt-3 inline-block"
          >
            مدیریت آدرس‌ها
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-gray-400 text-sm mb-3">پشتیبانی</h3>
        <SettingsLink icon="gavel" text="قوانین و شرایط" />
        <SettingsLink icon="shield" text="سیاست حریم خصوصی" />
      </div>

      <div className="mt-8">
        <button
          onClick={handleLogout}
          disabled={logoutResult.fetching}
          className="w-full flex items-center justify-center p-4 bg-custom-dark-2 rounded-lg disabled:opacity-50"
        >
          <span className="material-icons text-red-500 ml-2">logout</span>
          <span className="text-red-500 font-bold">
            {logoutResult.fetching ? "در حال خروج..." : "خروج از حساب کاربری"}
          </span>
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto">
        <BottomNav activePage="profile" />
      </div>
    </div>
  );
}
