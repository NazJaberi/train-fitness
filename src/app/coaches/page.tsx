// src/app/coaches/page.tsx
"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanityClient";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { COACH_LIST_QUERY } from "@/features/coaches/queries";
import { type CoachCardData } from "@/features/coaches/types";
import { CoachCarousel } from "@/components/coaches/CoachCarousel"; // Import the new carousel

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

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen pt-12 transition-colors duration-300 bg-brandBgLight dark:bg-brandBgDark">
      <CoachCarousel coaches={coaches} />
    </div>
  );
}