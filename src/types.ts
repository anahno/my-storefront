// src/types.ts

// ✅ تعریف Asset کامل شد
export interface Asset {
  id: string;
  preview: string;
  width: number;
  height: number;
}

export interface ProductVariant {
  id: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  featuredAsset?: Asset;
  variants: ProductVariant[];
}

// ✅ تعریف تکراری حذف و یک تعریف کامل جایگزین شد
export interface Collection {
  id: string;
  name: string;
  slug: string;
  featuredAsset?: Asset | null;
}

export interface OrderLine {
  id: string;
  quantity: number;
  linePrice: number;
  featuredAsset: Asset;
  productVariant: {
    name: string;
  };
}

export interface Order {
  state: string;
  active: boolean;
}

export interface Address {
  id: string;
  streetLine1: string;
  city: string;
  province: string;
}

export interface Customer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string;
  phoneNumber: string | null;
  orders: {
    items: Order[];
    totalItems: number;
  };
  addresses: Address[];
}
