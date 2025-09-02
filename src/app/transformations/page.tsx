// src/app/transformations/page.tsx
"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanityClient";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { TransformationCard } from "@/components/transformations/TransformationCard";
import { TRANSFORMATIONS_QUERY } from "@/features/transformations/queries";
import { type Transformation } from "@/features/transformations/types";

export default function TransformationsPage() {
  const [stories, setStories] = useState<Transformation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const sanityStories = await client.fetch<Transformation[]>(TRANSFORMATIONS_QUERY);
        setStories(sanityStories ?? []);
      } catch (err) {
        console.error("Failed to fetch transformations:", err);
        setError("Could not load transformations right now. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStories();
  }, []);

  if (isLoading) return <LoadingScreen />;
  if (error) return <div className="py-24 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-black">
      <div className="container px-4 py-20 mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold uppercase tracking-tight text-white">Transformations</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base font-semibold uppercase tracking-wide text-cyan-400">
            Real members. Real results.
          </p>
        </div>

        <div className="grid max-w-5xl grid-cols-1 gap-10 mx-auto md:grid-cols-2">
          {stories.map(story => (
            <TransformationCard key={story._id} story={story} />
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-extrabold text-white">Ready for Your Own Transformation?</h2>
          <a href="/pricing" className="mt-6 inline-block rounded-full bg-cyan-500 px-8 py-3 text-lg font-bold text-black transition-colors hover:bg-cyan-400">
            View Membership Plans
          </a>
        </div>
      </div>
    </div>
  );
}
