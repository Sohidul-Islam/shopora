import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string) {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_CODE || "BDT";
  const locale = process.env.NEXT_PUBLIC_CURRENCY_LOCALE || "en-BD";
  const num = Number(price) || 0;

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `${currency} ${num.toFixed(2)}`;
  }
}
