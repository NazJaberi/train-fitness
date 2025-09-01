// src/app/coaches/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { client } from "@/lib/sanityClient";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { COACH_LIST_QUERY } from "@/features/coaches/queries";
import { type CoachCardData } from "@/features/coaches/types";
import { CoachCard } from "@/components/coaches/CoachCard";

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<CoachCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const sanityCoaches = await client.fetch<CoachCardData[]>(COACH_LIST_QUERY);
        setCoaches(sanityCoaches ?? []);
      } catch (err) {
        console.error("Failed to fetch coaches:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoaches();
  }, []);

  const filtered = coaches; // No search/filter by request

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative">
        <div className="container mx-auto px-4 pt-16 pb-10 sm:pt-20">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-extrabold uppercase tracking-tight text-white">
              Our Team
            </h1>
            <p className="mt-3 text-sm sm:text-base font-semibold tracking-wide uppercase text-cyan-400">
              Stronger together — meet the coaches behind TRAIN FITNESS
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 pb-20">
        {filtered.length === 0 ? (
          <p className="pt-16 text-center text-white/70">No coaches match your criteria.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c) => (
              <CoachCard key={c.slug} coach={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
