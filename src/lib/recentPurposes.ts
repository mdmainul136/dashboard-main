import { type BusinessPurpose } from "@/types/businessPurpose";

const RECENT_KEY = "recent_business_purposes";
const MAX_RECENT = 5;

export function getRecentPurposes(): BusinessPurpose[] {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(RECENT_KEY);
    return saved ? JSON.parse(saved) : [];
}

export function saveRecentPurpose(id: BusinessPurpose) {
    if (typeof window === "undefined") return;
    const recent = getRecentPurposes();
    const updated = [id, ...recent.filter((r) => r !== id)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}
