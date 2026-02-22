export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // rate relative to BDT
}

export interface TaxConfig {
  id: string;
  name: string;
  category: string;
  rate: number;
  type: "VAT" | "GST" | "Custom";
  active: boolean;
}

export const currencies: Currency[] = [
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", rate: 1 },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", rate: 0.98 },
  { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب", rate: 0.10 },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", rate: 0.082 },
  { code: "OMR", name: "Omani Rial", symbol: "ر.ع.", rate: 0.103 },
  { code: "QAR", name: "Qatari Riyal", symbol: "ر.ق", rate: 0.97 },
  { code: "USD", name: "US Dollar", symbol: "$", rate: 0.27 },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.25 },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.21 },
];

export const taxConfigs: TaxConfig[] = [
  { id: "t1", name: "Standard VAT", category: "Electronics", rate: 15, type: "VAT", active: true },
  { id: "t2", name: "Reduced VAT", category: "Office", rate: 7.5, type: "VAT", active: true },
  { id: "t3", name: "Zero Rate", category: "Accessories", rate: 0, type: "VAT", active: true },
  { id: "t4", name: "GST Standard", category: "Audio", rate: 18, type: "GST", active: false },
];

export function convertCurrency(amount: number, from: string, to: string): number {
  const fromCur = currencies.find(c => c.code === from);
  const toCur = currencies.find(c => c.code === to);
  if (!fromCur || !toCur) return amount;
  const bdtAmount = amount / fromCur.rate;
  return bdtAmount * toCur.rate;
}
