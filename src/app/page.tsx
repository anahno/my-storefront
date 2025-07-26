// src/app/page.tsx
"use client";

import { useState } from "react";
import { useQuery } from "urql";
import Bestsellers from "@/components/Bestsellers";
import Categories from "@/components/Categories";

const GET_HOME_PAGE_DATA_QUERY = `
  query GetHomePageData($collectionOptions: CollectionListOptions) {
    products(options: { take: 6 }) { items { id, name, slug, featuredAsset { id, preview }, variants { price } } }
    collections(options: $collectionOptions) { items { id, name, featuredAsset { id, preview } }, totalItems }
  }
`;

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [result] = useQuery({
    query: GET_HOME_PAGE_DATA_QUERY,
    variables: {
      collectionOptions: {
        take: itemsPerPage,
        skip: (currentPage - 1) * itemsPerPage,
      },
    },
  });
  const { data, fetching, error } = result;

  if (fetching) return <p className="p-8 text-center">در حال بارگذاری...</p>;
  if (error)
    return (
      <p className="p-8 text-center">اوه... خطایی رخ داد: {error.message}</p>
    );

  const totalItems = data.collections.totalItems;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    // ✅✅ فقط این کلاس را اضافه کنید ✅✅
    <div className="container mx-auto max-w-sm p-4 pb-28">
      <header className="flex justify-between items-center mb-6">
        <span className="material-icons">apps</span>
        <img
          alt="آواتار کاربر"
          className="w-10 h-10 rounded-full"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRH-ZliZr_u49GbZMyvvkHH02CGOUtSEe0DkrFGCns2pzh-NAtj4Fr3xp-e9k4gUYwdmclRPgAMNCw_PynehO28ieDNtTL_nQP8T7Epqg_d0z8i6iDxqQh9zrjzAUtPosUNX-xNaUd9pBPK0WFQnCcHQZqqoKmlDPmoIkYBytHD1_f9tMrl3Er8pfR8J7SOYayGl_CT2LaDWKi6t3BuCLy0ZAxZS24yv-mzCYDchHNimpT0on03caY8CclpxdZrNS1wpq4pKMv0i7Y"
        />
      </header>

      <div className="relative mb-6">
        <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          search
        </span>
        <input
          className="w-full bg-custom-dark-2 rounded-lg py-3 pr-10 pl-16 border-none focus:ring-0"
          placeholder="جستجو"
          type="text"
        />
        <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-custom-yellow text-black p-2 rounded-lg">
          <span className="material-icons">tune</span>
        </button>
      </div>

      <div className="relative bg-custom-dark-2 rounded-2xl p-6 mb-8 flex items-center h-48 overflow-hidden">
        <div className="z-10">
          <h1 className="text-3xl font-bold mb-2">کالکشن جدید</h1>
          <p className="text-gray-300 mb-4">
            جدیدترین ترندها
            <br />
            در کفش را کشف کنید.
          </p>
          <a
            className="bg-custom-yellow text-black font-bold py-2 px-4 rounded-lg text-sm"
            href="#"
          >
            اکنون خرید کنید
          </a>
        </div>
        <img
          alt="کفش شیک"
          className="absolute left-0 bottom-0 h-40 w-40 object-cover -ml-8 -mb-4 transform rotate-[30deg]"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYy5snilEDJcTSFhIF3SIAijJk1Brd84kprZkiMBRGcoLoz2uPiuxRV6_gbIPfPTyKRr3pGmYriDdVzAvsVhja49FoLadU6IBTLspQJuHzRcZB66bqZvdTW6SWcpIDOe9Cet5lPW6RdFOI4Msa2J5GRzBhz2aoxfICcR676Khuo4yEuINwH4FgAuuyTQ0S2P5zkJJsDjSX_25OxsXU_xCc3A32XUJvhoC3qzEqpRCopKqRZjwc2xdFDQDWNcLHQpSBXBVnUoZaE064"
        />
      </div>

      <Bestsellers products={data.products.items} />
      <Categories
        collections={data.collections.items}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
