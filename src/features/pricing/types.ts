// src/features/pricing/types.ts
export type PricingPlan = {
  _id: string;
  name: string;
  slug?: string;
  category: 'gym' | 'classes' | 'pt' | 'bundles';
  // Legacy single price (optional)
  price?: number;
  currency?: string; // e.g., 'BHD'
  billingPeriod?: 'per month' | 'per week' | 'per year' | 'one‑time' | string;
  // New: multiple purchase options
  options?: Array<{
    label: string; // e.g., "1 year", "1 month", "10 sessions"
    price: number;
    currency?: string;
    note?: string;
  }>;
  description?: any; // PortableTextBlock[]
  features?: string[];
  highlight?: boolean;
  savingsText?: string;
  ctaLabel?: string;
  ctaHref?: string;
};
