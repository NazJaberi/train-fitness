// src/app/blog/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { client } from "@/lib/sanityClient";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { BLOG_LIST_QUERY } from "@/features/blog/queries";
import type { BlogCard as BlogCardType } from "@/features/blog/types";
import { BlogCard } from "@/components/blog/BlogCard";

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string>('All');

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

  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach(p => p.tags?.forEach(t => set.add(t)));
    return ['All', ...Array.from(set)];
  }, [posts]);

  const visible = useMemo(() => activeTag === 'All' ? posts : posts.filter(p => p.tags?.includes(activeTag)), [posts, activeTag]);

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

        {tags.length > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {tags.map(t => (
              <button key={t} onClick={() => setActiveTag(t)} className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${activeTag === t ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'}`}>{t}</button>
            ))}
          </div>
        )}
      </section>

      {/* Featured + Grid */}
      <section className="container mx-auto px-4 pb-20">
        {featured ? (
          <div className="grid gap-6 md:grid-cols-3">
            <BlogCard post={featured} large />
            <div className="grid gap-6 md:col-span-1">
              {rest.slice(0, 2).map(p => (<BlogCard key={p._id} post={p} />))}
            </div>
          </div>
        ) : (
          <p className="text-center text-white/70">No posts yet.</p>
        )}

        {rest.length > 2 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {rest.slice(2).map(p => (<BlogCard key={p._id} post={p} />))}
          </div>
        )}
      </section>
    </div>
  );
}

