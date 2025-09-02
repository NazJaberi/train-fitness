// src/app/faq/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { client } from "@/lib/sanityClient";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Accordion } from "@/components/faq/Accordion";
import { FAQ_QUERY } from "@/features/faq/queries";
import { type FaqItem } from "@/features/faq/types";

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState<string>("All");

  useEffect(() => {
    const fetchFaqs = async () => {
      const sanityFaqs = await client.fetch<FaqItem[]>(FAQ_QUERY);
      setFaqs(sanityFaqs ?? []);
      setIsLoading(false);
    };
    fetchFaqs();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    faqs.forEach((f) => set.add(f.category));
    return ["All", ...Array.from(set)];
  }, [faqs]);

  const visible = useMemo(() => (active === "All" ? faqs : faqs.filter((f) => f.category === active)), [faqs, active]);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative">
        <div className="container mx-auto px-4 pt-16 pb-8 sm:pt-20">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-extrabold uppercase tracking-tight text-white">FAQ</h1>
            <p className="mt-3 text-sm sm:text-base font-semibold uppercase tracking-wide text-cyan-400">
              Answers to common questions about TRAIN FITNESS
            </p>
          </div>

          {/* Category tabs */}
          {categories.length > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                    active === c ? "bg-cyan-500 text-black border-cyan-500" : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 pb-20">
        <div className="mx-auto max-w-3xl space-y-3">
          {visible.map((faq) => (
            <Accordion key={faq._id} question={faq.question} answer={faq.answer} />
          ))}
          {visible.length === 0 && (
            <p className="pt-10 text-center text-white/70">No FAQs in this category yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
