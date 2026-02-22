import { useSyncExternalStore } from "react";
import { getProducts, subscribe, type Product } from "@/data/products";

export function useProducts(): Product[] {
  return useSyncExternalStore(subscribe, getProducts, getProducts);
}
