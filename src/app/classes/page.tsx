// =============================
// File: src/app/classes/page.tsx
// =============================
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/lib/sanityClient";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { motion } from "framer-motion";
import { CLASS_LIST_QUERY } from "@/features/classes/queries";
import { ClassCardData } from "@/features/classes/types";

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const sanityClasses = await client.fetch<ClassCardData[]>(CLASS_LIST_QUERY);
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

  // Search + filter
  const filtered = useMemo(() => {
    if (!query) return classes;
    const q = query.toLowerCase();
    return classes.filter((c) =>
      [c.name, c.tagline].filter(Boolean).some((t) => t!.toLowerCase().includes(q))
    );
  }, [classes, query]);

  // Intensity filters derived from data
  type Intensity = NonNullable<ClassCardData["intensityLevel"]>;

  const allIntensities = useMemo(() => {
    const set = new Set<string>();
    classes.forEach((c) => c.intensityLevel && set.add(c.intensityLevel));
    return Array.from(set) as Array<Intensity>;
  }, [classes]);

  const [activeIntensity, setActiveIntensity] = useState<Intensity | "All">("All");

  const intensityOptions: Array<"All" | Intensity> = useMemo(
    () => ["All", ...allIntensities],
    [allIntensities]
  );

  const fullyFiltered = useMemo(() => {
    if (activeIntensity === "All") return filtered;
    return filtered.filter((c) => c.intensityLevel === activeIntensity);
  }, [filtered, activeIntensity]);

  // Cmd/Ctrl+K to focus search
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      if ((isMac && e.metaKey && e.key.toLowerCase() === "k") || (!isMac && e.ctrlKey && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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

            {/* Search */}
            <div className="flex items-center gap-3 mt-8">
              <div className="relative w-full">
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by class or focus..."
                  className="w-full px-4 py-3 text-sm border rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur border-black/5 dark:border-white/10 focus:outline-none focus:ring-4 ring-brandPrimary/30"
                />
                <span className="absolute hidden text-xs text-gray-400 -translate-y-1/2 select-none right-3 top-1/2 sm:block">⌘K</span>
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute px-2 py-1 text-xs transition-colors -translate-y-1/2 rounded-md right-2 top-1/2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20"
                    aria-label="Clear search"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Intensity filter */}
            {allIntensities.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                {intensityOptions.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setActiveIntensity(lvl)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors backdrop-blur ${
                      activeIntensity === lvl
                        ? "text-white bg-brandPrimary border-brandPrimary"
                        : "text-gray-700 dark:text-gray-300 border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-white/80"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container px-4 pb-20 mx-auto">
        {fullyFiltered.length === 0 ? (
          <p className="pt-20 text-center text-gray-500 dark:text-gray-400">
            No classes match your filters.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fullyFiltered.map((c, idx) => (
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
                    <div className="absolute flex gap-2 left-4 top-4">
                      {c.intensityLevel && (
                        <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/80 dark:bg-black/60 text-gray-800 dark:text-gray-100">
                          {c.intensityLevel}
                        </span>
                      )}
                      {typeof c.duration === "number" && (
                        <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/80 dark:bg-black/60 text-gray-800 dark:text-gray-100">
                          {c.duration} min
                        </span>
                      )}
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
