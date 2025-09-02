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

  useEffect(() => {
    const fetchStories = async () => {
      const sanityStories = await client.fetch<Transformation[]>(TRANSFORMATIONS_QUERY);
      setStories(sanityStories ?? []);
      setIsLoading(false);
    };
    fetchStories();
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="transition-colors duration-300 bg-brandBgLight dark:bg-brandBgDark">
      <div className="container px-4 py-20 mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-brandTextLight dark:text-brandTextDark">
            Real Members, Real Results
          </h1>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-500 dark:text-gray-400">
            See the incredible transformations our members have achieved with the help of our dedicated coaches and supportive community.
          </p>
        </div>

        <div className="grid max-w-5xl grid-cols-1 gap-10 mx-auto md:grid-cols-2">
          {stories.map(story => (
            <TransformationCard key={story._id} story={story} />
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-brandTextLight dark:text-brandTextDark">Ready for Your Own Transformation?</h2>
          <a href="/pricing" className="inline-block px-8 py-3 mt-6 text-lg font-bold text-white transition-all duration-300 rounded-full shadow-lg bg-brandPrimary hover:bg-brandAccent hover:text-brandDark">
            View Membership Plans
          </a>
        </div>
      </div>
    </div>
  );
}