import Link from "next/link";

export default function OrdersPage() {
  return (
    <div className="container mx-auto max-w-sm p-4">
      <header className="flex items-center mb-6 relative">
        <Link href="/profile" className="absolute right-0">
          <span className="material-icons text-white">arrow_forward</span>
        </Link>
        <h1 className="text-xl font-bold text-center w-full">سفارشات من</h1>
      </header>
      <p className="text-center text-gray-400">
        لیست سفارشات شما در اینجا نمایش داده خواهد شد.
      </p>
    </div>
  );
}
