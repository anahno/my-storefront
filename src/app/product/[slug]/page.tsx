// src/app/product/[slug]/page.tsx
"use client";

import { useState, use } from "react";
import { useQuery, useMutation } from "urql";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

// ... کوئری‌ها و توابع کمکی (GET_PRODUCT_DETAIL_QUERY, ADD_TO_CART_MUTATION, formatPrice, AccordionItem) بدون تغییر ...
const GET_PRODUCT_DETAIL_QUERY = `
  query GetProductBySlug($slug: String!) {
    product(slug: $slug) { id, name, description, assets { id, preview }, optionGroups { id, name, options { id, name } }, variants { id, name, price, options { id, name } } }
    products(options: { take: 6 }) { items { id, name, slug, featuredAsset { id, preview }, variants { price } } }
  }
`;
const ADD_TO_CART_MUTATION = `
  mutation AddItemToOrder($variantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $variantId, quantity: $quantity) { ... on Order { id, totalQuantity } }
  }
`;
const formatPrice = (price: number) =>
  `${(price / 10).toLocaleString("fa-IR")} تومان`;
const AccordionItem = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <details className="border-t border-gray-700 py-2 group">
    <summary className="flex cursor-pointer items-center justify-between py-2 list-none">
      <span className="font-medium">{title}</span>
      <span className="material-icons transition-transform duration-300 group-open:rotate-180">
        expand_more
      </span>
    </summary>
    <div className="text-gray-400 text-sm leading-relaxed pb-2">{children}</div>
  </details>
);

function ProductDetails({ slug }: { slug: string }) {
  // ... تمام State ها و منطق handleAddToCart مثل قبل ...
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addToCartMessage, setAddToCartMessage] = useState("");
  const [result] = useQuery({
    query: GET_PRODUCT_DETAIL_QUERY,
    variables: { slug },
  });
  const [cartResult, executeAddToCart] = useMutation(ADD_TO_CART_MUTATION);
  const { data, fetching, error } = result;

  const handleOptionSelect = (optionGroupId: string, optionId: string) =>
    setSelectedOptions((prev) => ({ ...prev, [optionGroupId]: optionId }));
  const handleAddToCart = async () => {
    const selectedVariant = data?.product?.variants.find((v: any) =>
      v.options.every((o: any) => Object.values(selectedOptions).includes(o.id))
    );
    if (!selectedVariant) {
      setAddToCartMessage("لطفاً تمام گزینه‌ها را انتخاب کنید.");
      setTimeout(() => setAddToCartMessage(""), 2000);
      return;
    }
    setAddToCartMessage("");
    const res = await executeAddToCart({
      variantId: selectedVariant.id,
      quantity: 1,
    });
    if (res.data?.addItemToOrder.__typename === "Order") {
      setAddToCartMessage("محصول به سبد خرید اضافه شد!");
      setTimeout(() => setAddToCartMessage(""), 2000);
    } else {
      setAddToCartMessage("خطا در افزودن به سبد خرید.");
      setTimeout(() => setAddToCartMessage(""), 2000);
    }
  };

  if (fetching)
    return <p className="p-8 text-center">در حال بارگذاری محصول...</p>;
  if (error || !data?.product)
    return <p className="p-8 text-center">محصول یافت نشد.</p>;

  const { product, products: recommendedProducts } = data;

  return (
    // ✅✅ کلاس pb-28 را به این div اضافه می‌کنیم ✅✅
    <div className="bg-custom-dark text-white pb-28">
      <header className="fixed top-0 left-0 right-0 max-w-sm mx-auto z-20 flex items-center p-4 justify-between">
        <Link
          href="/"
          className="text-white bg-black bg-opacity-30 p-2 rounded-full flex items-center justify-center"
        >
          <span className="material-icons">arrow_forward</span>
        </Link>
        <Link
          href="/cart"
          className="text-white bg-black bg-opacity-30 p-2 rounded-full flex items-center justify-center"
        >
          <span className="material-icons">shopping_cart</span>
        </Link>
      </header>

      {/* محتوای اصلی صفحه محصول */}
      <div>
        <div className="relative bg-black">
          <img
            src={product.assets[activeImageIndex]?.preview}
            alt={product.name}
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {product.assets.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === activeImageIndex ? "bg-white" : "bg-white/50"
                }`}
              ></button>
            ))}
          </div>
        </div>
        <div className="p-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-bold text-custom-yellow my-4">
            {formatPrice(product.variants[0]?.price || 0)}
          </p>
          {product.optionGroups.map((group: any) => (
            <div key={group.id} className="mb-6">
              <h3 className="font-bold mb-3">{group.name}</h3>
              <div className="flex flex-wrap gap-3">
                {group.options.map((option: any) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(group.id, option.id)}
                    className={`px-5 py-2 rounded-full border text-sm transition-colors ${
                      selectedOptions[group.id] === option.id
                        ? "bg-custom-yellow text-black border-custom-yellow"
                        : "bg-transparent border-gray-600"
                    }`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <AccordionItem title="توضیحات محصول">
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </AccordionItem>
          <AccordionItem title="مشخصات و اندازه‌ها">
            <p>اطلاعات مربوط به سایزبندی در اینجا قرار می‌گیرد.</p>
          </AccordionItem>
          <AccordionItem title="نحوه ارسال و بازگشت">
            <p>قوانین مربوط به ارسال و بازگشت کالا در اینجا قرار می‌گیرد.</p>
          </AccordionItem>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold px-4 mb-4">پیشنهاد ما برای شما</h2>
          <div className="flex space-x-4 space-x-reverse overflow-x-auto pb-4 -mb-4 px-4">
            {recommendedProducts.items
              .filter((p: any) => p.id !== product.id)
              .map((p: any) => (
                <div key={p.id} className="flex-none w-40">
                  <ProductCard product={p} />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* ✅ فقط دکمه افزودن به سبد خرید باقی می‌ماند (BottomNav حذف شد) */}
      <div className="fixed bottom-24 left-0 right-0 max-w-sm mx-auto z-30 p-4 pt-2">
        <button
          onClick={handleAddToCart}
          disabled={cartResult.fetching}
          className="w-full bg-custom-yellow text-black font-bold py-4 rounded-full flex items-center justify-center gap-2 disabled:bg-gray-500 shadow-lg"
        >
          <span className="material-icons">add_shopping_cart</span>
          <span>افزودن به سبد خرید</span>
        </button>
      </div>

      {/* موقعیت پیام */}
      {addToCartMessage && (
        <div className="fixed bottom-40 left-1/2 -translate-x-1/2 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg z-40">
          {addToCartMessage}
        </div>
      )}
    </div>
  );
}

// کامپوننت Wrapper بدون تغییر
export default function ProductDetailPageWrapper({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  return <ProductDetails slug={resolvedParams.slug} />;
}
