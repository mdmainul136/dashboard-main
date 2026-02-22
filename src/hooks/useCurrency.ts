import { useCallback, useSyncExternalStore } from "react";
import { currencies, type Currency } from "@/data/currencies";

// Global state for selected currency
let currentCurrency: Currency = currencies[0]; // Default SAR
type Listener = () => void;
const listeners = new Set<Listener>();

function notify() { listeners.forEach(fn => fn()); }

export function setGlobalCurrency(code: string) {
  const found = currencies.find(c => c.code === code);
  if (found) { currentCurrency = found; notify(); }
}

function getSnapshot() { return currentCurrency; }

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function useCurrency() {
  const currency = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const formatAmount = useCallback((amount: number, opts?: { compact?: boolean }) => {
    if (opts?.compact) {
      if (amount >= 1_000_000) return `${currency.symbol}${(amount / 1_000_000).toFixed(1)}M`;
      if (amount >= 1_000) return `${currency.symbol}${(amount / 1_000).toFixed(0)}K`;
    }
    return `${currency.symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currency]);

  const formatShort = useCallback((amount: number) => {
    return `${currency.symbol}${amount.toLocaleString()}`;
  }, [currency]);

  return { currency, formatAmount, formatShort, setCurrency: setGlobalCurrency };
}
