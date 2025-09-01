// =============================
// File: src/app/classes/page.tsx
// =============================
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/lib/sanityClient";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { motion } from "framer-motion";

export type ClassCardData = {
  name: string;
  tagline?: string;
  slug: string;
  imageUrl?: string;
};

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const q = `*[_type == "class"]{
          name,
          tagline,
          "slug": slug.current,
          "imageUrl": mainImage.asset->url
        } | order(name asc)`;
        const sanityClasses = await client.fetch<ClassCardData[]>(q);
        setClasses(sanityClasses ?? []);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
        setError("Could not load classes at this time. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const filtered = useMemo(() => {
    if (!query) return classes;
    const q = query.toLowerCase();
    return classes.filter((c) =>
      [c.name, c.tagline].filter(Boolean).some((t) => t!.toLowerCase().includes(q))
    );
  }, [classes, query]);

  if (isLoading) return <LoadingScreen />;
  if (error) return <div className="py-20 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-b from-brandBgLight to-white dark:from-brandBgDark dark:to-black">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(40rem_40rem_at_50%_-10%,theme(colors.brandPrimary/30),transparent_60%)]" />
        <div className="container px-4 pb-8 mx-auto pt-14 sm:pt-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-brandTextLight dark:text-brandTextDark">
              Find Your Next Class
            </h1>
            <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-300">
              From high-intensity training to mindful yoga—discover sessions that match your goals and vibe.
            </p>

            {/* Search / Filter */}
            <div className="flex items-center gap-3 mt-8">
              <div className="relative w-full">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by class or focus..."
                  className="w-full px-4 py-3 text-sm border rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur border-black/5 dark:border-white/10 focus:outline-none focus:ring-4 ring-brandPrimary/30"
                />
                <span className="absolute text-xs text-gray-400 -translate-y-1/2 select-none right-3 top-1/2">⌘K</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container px-4 pb-20 mx-auto">
        {filtered.length === 0 ? (
          <p className="pt-20 text-center text-gray-500 dark:text-gray-400">
            No classes match your search.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c, idx) => (
              <motion.article
                key={c.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="relative overflow-hidden transition-shadow border shadow-sm group rounded-3xl border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur hover:shadow-xl"
              >
                <Link href={`/classes/${c.slug}`} className="block focus:outline-none focus-visible:ring-4 ring-brandPrimary/30 rounded-3xl">
                  <div className="relative w-full h-56">
                    {c.imageUrl ? (
                      <Image
                        src={c.imageUrl}
                        alt={c.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={idx < 3}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-sm text-gray-400">No image</div>
                    )}

                    {/* Overlay gradient + badge */}
                    <div className="absolute inset-0 transition-opacity bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-80" />
                    <div className="absolute left-4 top-4 text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/80 dark:bg-black/60 text-gray-800 dark:text-gray-100">
                      Class
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {c.name}
                    </h3>
                    {c.tagline && (
                      <p className="mt-1 text-sm leading-relaxed text-gray-600 line-clamp-2 dark:text-gray-300">
                        {c.tagline}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-5">
                      <div className="text-xs text-gray-500">Tap to view details</div>
                      <div className="inline-flex items-center gap-1 text-sm font-semibold transition-transform group-hover:translate-x-1">
                        View <span aria-hidden>→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
