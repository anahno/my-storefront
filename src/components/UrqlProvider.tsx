"use client";

// ✅ cacheExchange و fetchExchange از urql ایمپورت شدند
import { createClient, Provider, cacheExchange, fetchExchange } from "urql";
import { ReactNode } from "react";

// ✅ exchanges به تنظیمات کلاینت اضافه شد
const client = createClient({
  url:
    process.env.NEXT_PUBLIC_VENDURE_API_URL || "http://localhost:3000/shop-api",
  exchanges: [cacheExchange, fetchExchange],
});

export default function UrqlProvider({ children }: { children: ReactNode }) {
  return <Provider value={client}>{children}</Provider>;
}
