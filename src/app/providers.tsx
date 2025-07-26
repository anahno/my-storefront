// src/app/providers.tsx
"use client";

import { createClient, Provider, cacheExchange, fetchExchange } from "urql";

const client = createClient({
  url: "http://localhost:3000/shop-api",
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: {
    credentials: "include",
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider value={client}>{children}</Provider>;
}
