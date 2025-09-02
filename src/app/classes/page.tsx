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
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(40rem_40rem_at_50%_-10%,theme(colors.brandPrimary/30),transparent_60%)]" />
        <div className="container px-4 pb-8 mx-auto pt-14 sm:pt-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
              Find Your Next Class
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/80">
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
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-4 ring-cyan-500/30"
                />
                <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 select-none text-xs text-white/40 sm:block">⌘K</span>
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-white/80 transition-colors hover:bg-white/10"
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
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                      activeIntensity === lvl
                        ? "bg-cyan-500 text-black border-cyan-500"
                        : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
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
      <section className="container mx-auto px-4 pb-20">
        {fullyFiltered.length === 0 ? (
          <p className="pt-20 text-center text-white/70">
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
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm transition-shadow hover:shadow-xl"
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
                    <div className="absolute left-4 top-4 flex gap-2">
                      {c.intensityLevel && (
                        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                          {c.intensityLevel}
                        </span>
                      )}
                      {typeof c.duration === "number" && (
                        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                          {c.duration} min
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white">
                      {c.name}
                    </h3>
                    {c.tagline && (
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-white/80">
                        {c.tagline}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-5">
                      <div className="text-xs text-white/70">Tap to view details</div>
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
