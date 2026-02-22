import { useSyncExternalStore } from "react";
import { getReviews, subscribeReviews, type Review } from "@/data/reviews";

export function useReviews(): Review[] {
  return useSyncExternalStore(subscribeReviews, getReviews, getReviews);
}
