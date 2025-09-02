// src/app/about/page.tsx
"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanityClient";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { ABOUT_PAGE_QUERY } from "@/features/about/queries";
import type { AboutPage as AboutType } from "@/features/about/types";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { motion } from "framer-motion";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-white/90 leading-7">{children}</p>,
    h2: ({ children }) => <h2 className="text-2xl font-extrabold text-white mt-6">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold text-white mt-5">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="ml-5 list-disc space-y-1 text-white/90">{children}</ul>,
    number: ({ children }) => <ol className="ml-5 list-decimal space-y-1 text-white/90">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="text-white font-extrabold">{children}</strong>,
    em: ({ children }) => <em className="text-white/90">{children}</em>,
    link: ({ value, children }) => (
      <a href={value?.href} className="text-cyan-400 underline underline-offset-4 hover:text-cyan-300" target={value?.href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{children}</a>
    ),
  },
};

export default function AboutPage() {
  const [data, setData] = useState<AboutType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await client.fetch<AboutType>(ABOUT_PAGE_QUERY);
        setData(res);
      } catch (e) {
        console.error(e);
        setError('Could not load About page.');
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, []);

  if (isLoading) return <LoadingScreen />;
  if (error) return <div className="py-24 text-center text-red-500">{error}</div>;
  if (!data) return <div className="py-24 text-center text-white">No content yet.</div>;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {data.heroImageUrl && (
          <div className="absolute inset-0 opacity-20">
            <Image src={data.heroImageUrl} alt="" fill className="object-cover" />
          </div>
        )}
        <div className="relative container mx-auto px-4 pt-16 pb-12 sm:pt-24">
          <motion.h1 initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.4}} className="text-5xl sm:text-6xl font-extrabold uppercase tracking-tight text-white">
            {data.title}
          </motion.h1>
          {data.subtitle && <p className="mt-3 text-sm sm:text-base font-semibold uppercase tracking-wide text-cyan-400">{data.subtitle}</p>}
        </div>
      </section>

      {/* Intro + Mission */}
      <section className="container mx-auto grid gap-8 px-4 pb-10 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl lg:col-span-2">
          {data.intro && <PortableText value={data.intro} components={components} />}
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
          <h3 className="text-xl font-extrabold text-white">Our Mission</h3>
          {data.mission ? (
            <div className="mt-3">
              <PortableText value={data.mission} components={components} />
            </div>
          ) : (
            <p className="mt-3 text-white/80">Coming soon.</p>
          )}
        </div>
      </section>

      {/* Values + Stats */}
      {(data.values && data.values.length > 0) || (data.stats && data.stats.length > 0) ? (
        <section className="container mx-auto grid gap-6 px-4 pb-16 md:grid-cols-2">
          {data.values && data.values.length > 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
              <h3 className="text-xl font-extrabold text-white">Our Values</h3>
              <div className="mt-4 space-y-3">
                {data.values.map(v => (
                  <div key={v.title} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    {v.iconUrl && (
                      <div className="relative h-10 w-10 flex-shrink-0">
                        <Image src={v.iconUrl} alt="" fill className="object-contain" />
                      </div>
                    )}
                    <div>
                      <div className="text-white font-bold">{v.title}</div>
                      {v.description && <div className="text-sm text-white/80">{v.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.stats && data.stats.length > 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
              <h3 className="text-xl font-extrabold text-white">By the Numbers</h3>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {data.stats.map(s => (
                  <div key={s.label} className="rounded-xl bg-white/5 p-4 text-center">
                    <div className="text-3xl font-extrabold text-cyan-400">{s.value}</div>
                    <div className="text-xs uppercase tracking-wider text-white/70">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : null}

      {/* Gallery */}
      {data.gallery && data.gallery.length > 0 && (
        <section className="container mx-auto px-4 pb-20">
          <h3 className="mb-4 text-center text-xl font-extrabold text-white">Inside TRAIN FITNESS</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {data.gallery.map((g, i) => (
              <div key={g.url + i} className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <Image src={g.url} alt="Gallery" fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

