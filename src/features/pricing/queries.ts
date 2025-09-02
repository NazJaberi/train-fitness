// src/features/pricing/queries.ts
import { groq } from 'next-sanity';

export const PRICING_PLANS_QUERY = groq`
  *[_type == "pricingPlan"] | order(category asc, highlight desc, price asc) {
    _id,
    name,
    "slug": slug.current,
    category,
    price,
    currency,
    billingPeriod,
    options[]{ label, price, currency, note },
    description,
    features,
    highlight,
    savingsText,
    ctaLabel,
    ctaHref
  }
`;
