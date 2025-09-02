// src/components/home/HeroCarousel.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type Slide = { title?: string; tagline?: string; imageUrl: string };

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const hasSlides = Array.isArray(slides) && slides.length > 0;

  // autoplay
  useEffect(() => {
    if (!hasSlides) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides, hasSlides]);

  if (!hasSlides) return null;

  const current = slides[index];

  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div key={current.imageUrl} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0">
          <Image src={current.imageUrl} alt={current.title || 'Hero'} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 top-16 h-[45vh] w-[45vh] rounded-full bg-cyan-500/20 blur-[140px]" />
            <div className="absolute -right-24 -top-10 h-[36vh] w-[36vh] rounded-full bg-cyan-400/10 blur-[140px]" />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative container mx-auto px-4 pt-24 pb-14 sm:pt-36 sm:pb-20">
        <div className="max-w-2xl">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-5xl font-extrabold uppercase tracking-tight text-white sm:text-6xl">
            {current.title || 'Train Smarter. Get Stronger.'}
          </motion.h1>
          {current.tagline && (
            <p className="mt-4 max-w-xl text-white/80">{current.tagline}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/pricing" className="rounded-full bg-cyan-500 px-6 py-3 font-bold text-black hover:bg-cyan-400">Join Now</Link>
            <Link href="/tour" className="rounded-full border border-white/20 px-6 py-3 font-bold text-white hover:bg-white/10">VR Tour</Link>
            <Link href="/classes" className="rounded-full border border-white/20 px-6 py-3 font-bold text-white hover:bg-white/10">Explore Classes</Link>
          </div>
        </div>

        {/* dots */}
        {slides.length > 1 && (
          <div className="mt-6 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setIndex(i)} aria-label={`Go to slide ${i+1}`} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-8 bg-cyan-500' : 'w-3 bg-white/40'}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

