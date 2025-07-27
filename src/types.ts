// src/types.ts

export interface Asset {
  id: string;
  preview: string;
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

export interface Collection {
  id: string;
  name: string;
  featuredAsset?: Asset;
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

// ✅ این دو اینترفیس اضافه شدند
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
