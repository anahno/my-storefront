// src/app/providers.tsx
"use client";
// ✅  این import ها تغییر کرده است
import { createClient, Provider, cacheExchange, fetchExchange } from "urql";

// آدرس Shop API سرور Vendure شما
const client = createClient({
  url: "http://localhost:3000/shop-api",
  // ✅  این خط اضافه شده است
  exchanges: [cacheExchange, fetchExchange],
});

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider value={client}>{children}</Provider>;
}
