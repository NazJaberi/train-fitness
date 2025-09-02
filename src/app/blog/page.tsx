// src/app/blog/page.tsx
"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanityClient";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { BLOG_LIST_QUERY } from "@/features/blog/queries";
import type { BlogCard as BlogCardType } from "@/features/blog/types";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogHero } from "@/components/blog/BlogHero";

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await client.fetch<BlogCardType[]>(BLOG_LIST_QUERY);
        setPosts(res ?? []);
      } catch (e) {
        console.error(e);
        setError('Could not load blog posts.');
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, []);

  const visible = posts;

  if (isLoading) return <LoadingScreen />;
  if (error) return <div className="py-24 text-center text-red-500">{error}</div>;

  const [featured, ...rest] = visible;

  return (
    <div className="min-h-screen bg-black">
      <section className="container mx-auto px-4 pt-16 pb-8 sm:pt-20">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold uppercase tracking-tight text-white">Blog</h1>
          <p className="mt-3 text-sm sm:text-base font-semibold uppercase tracking-wide text-cyan-400">Training, nutrition, recovery and mindset</p>
        </div>

        {/* Tag filters removed for a simpler, cleaner index */}
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4">
        {featured ? <BlogHero post={featured} /> : <p className="text-center text-white/70">No posts yet.</p>}
      </section>

      {/* Grid */}
      {rest.length > 0 && (
        <section className="container mx-auto px-4 pb-20 pt-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map(p => (<BlogCard key={p._id} post={p} />))}
          </div>
        </section>
      )}
    </div>
  );
}
