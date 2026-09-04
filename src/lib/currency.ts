export type CurrencyCode = "NGN" | "USD" | "GBP";

type CurrencyMeta = {
  code: CurrencyCode;
  symbol: string;
  label: string;
  locale: string;
  /** Units of this currency per 1 NGN. Fixed, approximate rates — this app
   * has no live FX feed. Update these if they drift too far from market. */
  rateFromNgn: number;
};

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  NGN: { code: "NGN", symbol: "₦", label: "NGN (₦)", locale: "en-NG", rateFromNgn: 1 },
  USD: { code: "USD", symbol: "$", label: "USD ($)", locale: "en-US", rateFromNgn: 1 / 1600 },
  GBP: { code: "GBP", symbol: "£", label: "GBP (£)", locale: "en-GB", rateFromNgn: 1 / 2050 },
};

export const CURRENCY_CODES: CurrencyCode[] = ["NGN", "USD", "GBP"];

/** All monetary values in this app (wallet balance, shipment/ride/shop prices) are stored in NGN. */
export function convertFromNgn(amountNgn: number, code: CurrencyCode): number {
  return amountNgn * CURRENCIES[code].rateFromNgn;
}

/** Inverse of convertFromNgn — for turning a user-entered amount (e.g. a top-up) back into the NGN the backend expects. */
export function convertToNgn(amount: number, code: CurrencyCode): number {
  return amount / CURRENCIES[code].rateFromNgn;
}

export function formatCurrency(amountNgn: number, code: CurrencyCode): string {
  const meta = CURRENCIES[code];
  const converted = convertFromNgn(amountNgn, code);
  const fractionDigits = code === "NGN" ? 0 : 2;
  return `${meta.symbol}${converted.toLocaleString(meta.locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}
