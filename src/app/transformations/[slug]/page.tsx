// src/app/transformations/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanityClient";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { TRANSFORMATION_DETAILS_QUERY } from "@/features/transformations/queries";
import { type TransformationDetails } from "@/features/transformations/types";

export default function TransformationDetailsPage({ params }: { params: { slug: string } }) {
  const [story, setStory] = useState<TransformationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      const data = await client.fetch<TransformationDetails>(TRANSFORMATION_DETAILS_QUERY, { slug: params.slug });
      setStory(data);
      setIsLoading(false);
    };
    fetchStory();
  }, [params.slug]);

  if (isLoading) return <LoadingScreen />;
  if (!story) return <div>Story not found.</div>;

  return (
    <div className="transition-colors duration-300 bg-brandBgLight dark:bg-brandBgDark">
      <div className="container px-4 py-20 mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-brandTextLight dark:text-brandTextDark">{story.memberName}'s Story</h1>
          <p className="mt-4 text-xl italic text-gray-600 dark:text-gray-400">"{story.testimonialQuote}"</p>
        </div>

        {/* Before & After Images */}
        <div className="grid max-w-5xl grid-cols-1 gap-8 mx-auto md:grid-cols-2">
          <div className="relative aspect-square">
            <Image src={story.beforeImageUrl} alt={`Before photo of ${story.memberName}`} fill className="object-cover shadow-lg rounded-2xl" />
            <div className="absolute px-3 py-1 text-sm font-bold text-white uppercase rounded-md top-3 left-3 bg-black/50">Before</div>
          </div>
          <div className="relative aspect-square">
            <Image src={story.afterImageUrl} alt={`After photo of ${story.memberName}`} fill className="object-cover shadow-lg rounded-2xl" />
            <div className="absolute px-3 py-1 text-sm font-bold text-white uppercase rounded-md top-3 left-3 bg-brandPrimary">After</div>
          </div>
        </div>

        {/* Full Story & Stats */}
        <div className="grid max-w-6xl grid-cols-1 gap-12 mx-auto mt-16 lg:grid-cols-3">
          <div className="prose prose-lg lg:col-span-2 dark:prose-invert">
            <PortableText value={story.fullStory} />
          </div>
          <div className="lg:col-span-1">
            <div className="p-6 bg-white shadow-xl dark:bg-brandDark rounded-2xl">
              <h3 className="pb-3 mb-4 text-2xl font-bold border-b text-brandTextLight dark:text-brandTextDark border-black/10 dark:border-white/10">Key Results</h3>
              <div className="space-y-4">
                {story.keyStats?.map(stat => (
                  <div key={stat.statLabel} className="p-4 text-center bg-gray-100 rounded-lg dark:bg-black/20">
                    <p className="text-3xl font-bold text-brandPrimary">{stat.statValue}</p>
                    <p className="text-sm tracking-wider text-gray-500 uppercase">{stat.statLabel}</p>
                  </div>
                ))}
              </div>
              {story.coach && (
                 <p className="mt-6 text-sm text-center text-gray-500 dark:text-gray-400">
                   Coached by: <a href={`/coaches/${story.coach.slug}`} className="font-semibold text-brandPrimary hover:underline">{story.coach.name}</a>
                 </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}