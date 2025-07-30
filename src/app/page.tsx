"use client";

import { useState } from "react";
import { useQuery, gql } from "urql";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Bestsellers from "@/components/Bestsellers";
import Categories from "@/components/Categories";
import FilterDropdown from "@/components/FilterDropdown"; // ✅ ایمپورت جدید
import HeroSlider from "@/components/HeroSlider";

// کوئری کامل و اصلاح شده
const GET_HOME_PAGE_DATA_QUERY = gql`
  query GetHomePageData {
    products(options: { take: 6 }) {
      items {
        id
        name
        slug
        featuredAsset {
          id
          preview
          width
          height
        }
        variants {
          price
        }
      }
    }
    collections(options: { take: 12 }) {
      items {
        id
        name
        slug
        featuredAsset {
          id
          preview
          width
          height
        }
      }
    }
  }
`;

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setFilterOpen] = useState(false);
  const router = useRouter();

  const [result] = useQuery({
    query: GET_HOME_PAGE_DATA_QUERY,
    requestPolicy: "cache-and-network",
  });
  const { data, fetching, error } = result;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?term=${searchTerm.trim()}`);
    }
  };

  const handleApplyFiltersFromHome = (filters: { collectionIds: string[] }) => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set("term", searchTerm.trim());
    }
    if (filters.collectionIds.length > 0) {
      params.set("collectionId", filters.collectionIds.join(","));
    }
    router.push(`/search?${params.toString()}`);
  };

  if (fetching) {
    return (
      <p className="p-8 text-center text-lg text-white">در حال بارگذاری...</p>
    );
  }
  if (error) {
    return (
      <p className="p-8 text-center text-red-400">
        اوه... خطایی رخ داد: {error.message}
      </p>
    );
  }

  const allProducts = data?.products?.items || [];
  const allCollections = data?.collections?.items || [];
  const collectionsForSlider = allCollections.slice(0, 4);

  return (
    <div className="bg-black text-white container mx-auto max-w-sm p-4 pb-28">
      <header className="flex justify-between items-center mb-6">
        <span className="material-icons">apps</span>
        <Image
          alt="آواتار کاربر"
          className="w-10 h-10 rounded-full"
          src="https://i.pravatar.cc/40"
          width={40}
          height={40}
        />
      </header>

      {/* ✅ فرم جستجو با dropdown positioning */}
      <div className="relative mb-6">
        <form onSubmit={handleSearch} className="relative">
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
          >
            <span className="material-icons">search</span>
          </button>
          <input
            className="w-full bg-custom-dark-2 rounded-lg py-3 pr-10 pl-28 border-none focus:ring-0 text-white"
            placeholder="جستجو"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* ✅ دکمه فیلتر با relative positioning */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <button
              onClick={() => setFilterOpen(!isFilterOpen)}
              type="button"
              className={`bg-custom-dark text-custom-yellow px-3 py-2 rounded-lg flex items-center gap-1 text-sm transition-colors ${
                isFilterOpen ? "bg-custom-yellow text-black" : ""
              }`}
            >
              <span className="material-icons text-base">tune</span>
              <span>فیلترها</span>
            </button>

            {/* ✅ FilterDropdown جدید */}
            <FilterDropdown
              isOpen={isFilterOpen}
              onClose={() => setFilterOpen(false)}
              onApplyFilters={handleApplyFiltersFromHome}
            />
          </div>
        </form>
      </div>

      <HeroSlider collections={collectionsForSlider} />

      <Bestsellers products={allProducts} />

      <Categories collections={allCollections} />
    </div>
  );
}
