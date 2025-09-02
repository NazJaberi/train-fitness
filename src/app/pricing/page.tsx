// src/app/pricing/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { client } from "@/lib/sanityClient";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { PRICING_PLANS_QUERY } from "@/features/pricing/queries";
import type { PricingPlan } from "@/features/pricing/types";
import { PricingCard } from "@/components/pricing/PricingCard";

export default function PricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<'all' | PricingPlan['category']>('all');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const sanityPlans = await client.fetch<PricingPlan[]>(PRICING_PLANS_QUERY);
        setPlans(sanityPlans ?? []);
      } catch (err) {
        console.error('Failed to fetch pricing plans:', err);
        setError('Could not load pricing right now. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const categories: Array<'all' | PricingPlan['category']> = useMemo(() => {
    const set = new Set<PricingPlan['category']>();
    plans.forEach((p) => set.add(p.category));
    return ['all', ...Array.from(set)];
  }, [plans]);

  const visible = useMemo(() => (active === 'all' ? plans : plans.filter((p) => p.category === active)), [plans, active]);

  if (isLoading) return <LoadingScreen />;
  if (error) return <div className="py-24 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative">
        <div className="container mx-auto px-4 pt-16 pb-8 sm:pt-20">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-extrabold uppercase tracking-tight text-white">Pricing</h1>
            <p className="mt-3 text-sm sm:text-base font-semibold uppercase tracking-wide text-cyan-400">Flexible options for gym, classes, trainers, and bundles</p>
          </div>

          {/* Category filters */}
          {categories.length > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                    active === c ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {labelForTab(c)}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Plans grid */}
      <section className="container mx-auto px-4 pb-20">
        {visible.length === 0 ? (
          <p className="pt-16 text-center text-white/70">No plans available yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((plan) => (
              <PricingCard key={plan._id} plan={plan} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function labelForTab(tab: 'all' | PricingPlan['category']) {
  switch (tab) {
    case 'all':
      return 'All';
    case 'gym':
      return 'Regular Gym';
    case 'classes':
      return 'Classes';
    case 'pt':
      return 'Personal Training';
    case 'bundles':
      return 'Bundles & Offers';
    default:
      return 'Other';
  }
}

