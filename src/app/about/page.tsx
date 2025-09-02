// src/app/about/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { client } from "@/lib/sanityClient";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { ABOUT_PAGE_QUERY } from "@/features/about/queries";
import type { AboutPage as AboutType } from "@/features/about/types";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { motion, useInView } from "framer-motion";

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

  // Helpers: animated counters for stats
  const StatCard = ({ value, label }: { value: string; label: string }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    const parsed = useMemo(() => {
      const num = parseFloat((value ?? "0").toString().replace(/[^\d.]/g, "")) || 0;
      const suffix = (value ?? "").toString().replace(/[0-9.,\s]+/g, "");
      return { num, suffix };
    }, [value]);
    const [current, setCurrent] = useState(0);
    useEffect(() => {
      if (!isInView) return;
      const duration = 1200;
      const start = performance.now();
      let raf = 0;
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / duration);
        setCurrent(Math.round(parsed.num * p));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [isInView, parsed.num]);
    return (
      <div ref={ref} className="rounded-xl bg-white/5 p-4 text-center border border-white/10">
        <div className="text-3xl font-extrabold text-cyan-400">
          {new Intl.NumberFormat().format(current)}{parsed.suffix}
        </div>
        <div className="text-xs uppercase tracking-wider text-white/70">{label}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background hero image covers the entire section */}
        {data.heroImageUrl && (
          <motion.div
            key={data.heroImageUrl}
            initial={{ scale: 1, opacity: 0.85 }}
            animate={{ scale: 1.06, opacity: 1 }}
            transition={{ duration: 8, ease: 'easeOut' }}
            className="absolute inset-0"
            aria-hidden
          >
            <Image src={data.heroImageUrl} alt="" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
          </motion.div>
        )}
        {/* Cyan glow accents */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-[40vh] w-[40vh] rounded-full bg-cyan-500/20 blur-[120px]" />
          <div className="absolute -right-24 top-0 h-[36vh] w-[36vh] rounded-full bg-cyan-400/10 blur-[120px]" />
        </div>
        <div className="relative container mx-auto grid items-end gap-8 px-4 pt-16 pb-12 sm:pt-24 md:grid-cols-2">
          <div className="max-w-2xl">
            <motion.h1 initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.4}} className="text-5xl sm:text-6xl font-extrabold uppercase tracking-tight text-white">
              {data.title}
            </motion.h1>
            {data.subtitle && <p className="mt-3 text-sm sm:text-base font-semibold uppercase tracking-wide text-cyan-400">{data.subtitle}</p>}
          </div>
          {/* Right column kept empty for balance on large screens */}
          <div className="hidden md:block" />
        </div>
      </section>

      {/* Intro + Mission */}
      <section className="container mx-auto grid gap-8 px-4 pb-10 lg:grid-cols-3">
        <motion.div whileInView={{opacity:1,y:0}} initial={{opacity:0,y:16}} transition={{duration:.4}} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl lg:col-span-2">
          {data.intro && <PortableText value={data.intro} components={components} />}
        </motion.div>
        <motion.div whileInView={{opacity:1,y:0}} initial={{opacity:0,y:16}} transition={{duration:.4, delay:.05}} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
          <h3 className="text-xl font-extrabold text-white">Our Mission</h3>
          {data.mission ? (
            <div className="mt-3">
              <PortableText value={data.mission} components={components} />
            </div>
          ) : (
            <p className="mt-3 text-white/80">Coming soon.</p>
          )}
        </motion.div>
      </section>

      {/* Values + Stats */}
      {(data.values && data.values.length > 0) || (data.stats && data.stats.length > 0) ? (
        <section className="container mx-auto grid gap-6 px-4 pb-16 md:grid-cols-2">
          {data.values && data.values.length > 0 && (
            <motion.div whileInView={{opacity:1,y:0}} initial={{opacity:0,y:16}} transition={{duration:.4}} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
              <h3 className="text-xl font-extrabold text-white">Our Values</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {data.values.map((v, i) => (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                  >
                    {v.iconUrl && (
                      <motion.div initial={{scale:0.9,opacity:0}} whileInView={{scale:1,opacity:1}} viewport={{once:true}} transition={{duration:.3}} className="relative h-10 w-10 flex-shrink-0">
                        <Image src={v.iconUrl} alt="" fill className="object-contain" />
                      </motion.div>
                    )}
                    <div>
                      <div className="font-bold text-white">{v.title}</div>
                      {v.description && <div className="text-sm text-white/80">{v.description}</div>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          {data.stats && data.stats.length > 0 && (
            <motion.div whileInView={{opacity:1,y:0}} initial={{opacity:0,y:16}} transition={{duration:.4, delay:.05}} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
              <h3 className="text-xl font-extrabold text-white">By the Numbers</h3>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {data.stats.map((s, i) => (
                  <motion.div key={s.label} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.3, delay:i*0.05}}>
                    <StatCard value={s.value} label={s.label} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </section>
      ) : null}

      {/* Gallery */}
      {data.gallery && data.gallery.length > 0 && (
        <section className="container mx-auto px-4 pb-20">
          <h3 className="mb-4 text-center text-xl font-extrabold text-white">Inside TRAIN FITNESS</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {data.gallery.map((g, i) => (
              <motion.div key={g.url + i} initial={{opacity:0, scale:.98}} whileInView={{opacity:1, scale:1}} viewport={{once:true}} transition={{duration:.3, delay:i*0.03}} className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <Image src={g.url} alt="Gallery" fill className="object-cover transition-transform duration-300 hover:scale-105" />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
