// In-memory review store with subscriber pattern
export interface Review {
  id: string;
  productId: string;
  productName: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  status: "published" | "pending" | "rejected";
  helpful: number;
}

type Listener = () => void;
const listeners = new Set<Listener>();

const initialReviews: Review[] = [
  { id: "r1", productId: "p1", productName: "Wireless Mouse", author: "আহমেদ", rating: 5, comment: "Excellent mouse, very smooth and responsive!", date: "2026-02-10", status: "published", helpful: 12 },
  { id: "r2", productId: "p1", productName: "Wireless Mouse", author: "রিমা", rating: 4, comment: "Good quality but battery drains fast", date: "2026-02-12", status: "published", helpful: 8 },
  { id: "r3", productId: "p2", productName: "Mechanical Keyboard", author: "করিম", rating: 5, comment: "Best keyboard I've ever used. Cherry MX keys are amazing!", date: "2026-02-08", status: "published", helpful: 20 },
  { id: "r4", productId: "p4", productName: "Webcam HD", author: "ফাতিমা", rating: 4, comment: "Clear video quality, good for meetings", date: "2026-02-14", status: "published", helpful: 3 },
  { id: "r5", productId: "p5", productName: "Desk Lamp", author: "সাকিব", rating: 3, comment: "Decent lamp but could be brighter", date: "2026-02-11", status: "pending", helpful: 1 },
  { id: "r6", productId: "p9", productName: "Headphones Pro", author: "নাফিসা", rating: 5, comment: "Amazing sound quality! Worth every penny", date: "2026-02-15", status: "published", helpful: 15 },
  { id: "r7", productId: "p9", productName: "Headphones Pro", author: "তানভীর", rating: 4, comment: "Comfortable for long use, noise cancellation is great", date: "2026-02-16", status: "published", helpful: 7 },
  { id: "r8", productId: "p10", productName: "Bluetooth Speaker", author: "জাহিদ", rating: 4, comment: "Great portable speaker, loud enough for outdoor use", date: "2026-02-13", status: "published", helpful: 5 },
  { id: "r9", productId: "p3", productName: "USB-C Hub", author: "মিতু", rating: 3, comment: "Works fine but gets hot after prolonged use", date: "2026-02-09", status: "rejected", helpful: 0 },
  { id: "r10", productId: "p11", productName: "Phone Case", author: "রাশেদ", rating: 5, comment: "Perfect fit, premium look and feel!", date: "2026-02-17", status: "published", helpful: 10 },
];

let reviews = [...initialReviews];

export function getReviews(): Review[] {
  return reviews;
}

export function getProductReviews(productId: string): Review[] {
  return reviews.filter(r => r.productId === productId);
}

export function getProductRating(productId: string): { avg: number; count: number } {
  const pr = reviews.filter(r => r.productId === productId);
  if (pr.length === 0) return { avg: 0, count: 0 };
  return { avg: pr.reduce((s, r) => s + r.rating, 0) / pr.length, count: pr.length };
}

export function addReview(review: Omit<Review, "id" | "date">) {
  const newReview: Review = {
    ...review,
    id: `r${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
  };
  reviews = [newReview, ...reviews];
  listeners.forEach(fn => fn());
}

export function updateReview(id: string, data: Partial<Review>) {
  reviews = reviews.map((r) => (r.id === id ? { ...r, ...data } : r));
  listeners.forEach(fn => fn());
}

export function subscribeReviews(listener: Listener): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
