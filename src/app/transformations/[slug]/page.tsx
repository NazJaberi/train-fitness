// src/app/transformations/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanityClient";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { TRANSFORMATION_DETAILS_QUERY } from "@/features/transformations/queries";
import { type TransformationDetails } from "@/features/transformations/types";

export default function TransformationDetailsPage({ params }: { params: { slug: string } }) {
  const [story, setStory] = useState<TransformationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const data = await client.fetch<TransformationDetails>(TRANSFORMATION_DETAILS_QUERY, { slug: params.slug });
        setStory(data);
      } catch (err) {
        console.error("Failed to fetch transformation details:", err);
        setError("Could not load this story right now.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStory();
  }, [params.slug]);

  if (isLoading) return <LoadingScreen />;
  if (error) return <div className="py-24 text-center text-red-500">{error}</div>;
  if (!story) return <div className="py-24 text-center text-white">Story not found.</div>;

  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className="text-base leading-7 text-white/90">{children}</p>
      ),
      h2: ({ children }) => (
        <h2 className="mt-6 text-2xl font-extrabold text-white">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="mt-5 text-xl font-bold text-white">{children}</h3>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="ml-5 list-disc space-y-1 text-base text-white/90">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="ml-5 list-decimal space-y-1 text-base text-white/90">{children}</ol>
      ),
    },
    marks: {
      strong: ({ children }) => (
        <strong className="font-extrabold text-white">{children}</strong>
      ),
      em: ({ children }) => <em className="text-white/90">{children}</em>,
      link: ({ value, children }) => (
        <a
          href={value?.href}
          className="font-semibold text-cyan-400 underline underline-offset-4 hover:text-cyan-300"
          target={value?.href?.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
        >
          {children}
        </a>
      ),
    },
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container px-4 py-20 mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold uppercase tracking-tight text-white">{story.memberName}</h1>
          <p className="mt-4 text-lg italic text-white/80">"{story.testimonialQuote}"</p>
        </div>

        {/* Before & After Images */}
        <div className="grid max-w-5xl grid-cols-1 gap-8 mx-auto md:grid-cols-2">
          <div className="relative aspect-square">
            <Image src={story.beforeImageUrl} alt={`Before photo of ${story.memberName}`} fill className="rounded-2xl object-cover shadow-2xl" />
            <div className="absolute left-3 top-3 rounded-md bg-black/60 px-3 py-1 text-sm font-bold uppercase text-white">Before</div>
          </div>
          <div className="relative aspect-square">
            <Image src={story.afterImageUrl} alt={`After photo of ${story.memberName}`} fill className="rounded-2xl object-cover shadow-2xl" />
            <div className="absolute left-3 top-3 rounded-md bg-cyan-500 px-3 py-1 text-sm font-bold uppercase text-black">After</div>
          </div>
        </div>

        {/* Full Story & Stats */}
        <div className="grid max-w-6xl grid-cols-1 gap-12 mx-auto mt-16 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <PortableText value={story.fullStory} components={components} />
          </div>
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
              <h3 className="mb-4 border-b border-white/10 pb-3 text-2xl font-extrabold text-white">Key Results</h3>
              <div className="space-y-4">
                {story.keyStats?.map(stat => (
                  <div key={stat.statLabel} className="rounded-lg bg-white/5 p-4 text-center">
                    <p className="text-3xl font-extrabold text-cyan-400">{stat.statValue}</p>
                    <p className="text-xs uppercase tracking-wider text-white/70">{stat.statLabel}</p>
                  </div>
                ))}
              </div>
              {story.coach && (
                 <p className="mt-6 text-center text-sm text-white/80">
                   Coached by: <a href={`/coaches/${story.coach.slug}`} className="font-semibold text-cyan-400 hover:underline">{story.coach.name}</a>
                 </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
