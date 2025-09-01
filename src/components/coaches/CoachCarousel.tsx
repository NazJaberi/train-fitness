"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CoachCardData } from "@/features/coaches/types";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export const CoachCarousel = ({ coaches }: { coaches: CoachCardData[] }) => {
  const [index, setIndex] = useState(0);

  const nextCoach = () => setIndex((prev) => (prev + 1) % coaches.length);
  const prevCoach = () => setIndex((prev) => (prev - 1 + coaches.length) % coaches.length);

  // Keyboard navigation for a tighter UX
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextCoach();
      if (e.key === "ArrowLeft") prevCoach();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!coaches || coaches.length === 0) {
    return (
      <div className="h-[640px] flex items-center justify-center bg-white">
        <p className="text-gray-500">No coaches have been added yet.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[640px] md:min-h-[720px] flex items-center justify-center overflow-hidden bg-white">
      {/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 0.08, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 text-[12vw] md:text-[10vw] leading-none font-extrabold tracking-tight uppercase pointer-events-none text-black select-none"
      >
        OUR TEAM
      </motion.h2>
      {/* Subheads (light cyan) */}
      <div className="absolute top-28 hidden w-full max-w-6xl justify-between px-6 text-center md:flex">
        <p className="max-w-sm text-xs font-semibold tracking-wider text-cyan-400/80 uppercase">
          We would like to introduce you to our powerful team of professional trainers
        </p>
        <p className="max-w-sm text-xs font-semibold tracking-wider text-cyan-400/80 uppercase">
          We would like to introduce you to our powerful team of professional trainers
        </p>
      </div>

      {/* Desktop/tablet: scaled baseline lineup */}
      <AnimatePresence>
        {/* Straight-line row with baseline alignment; all coaches visible */}
        <div className="relative hidden h-full w-full items-end justify-center px-6 md:flex">
          <div className="mb-16 flex w-full max-w-7xl items-end justify-center gap-6 md:gap-8 lg:gap-10">
            {coaches.map((coach, i) => {
              // circular distance from current focus
              const raw = Math.abs(i - index);
              const dist = Math.min(raw, coaches.length - raw);
              const isCenter = dist === 0;
              const scale = isCenter ? 1.35 : Math.max(0.8, 1.15 - dist * 0.12);
              const opacity = isCenter ? 1 : dist === 1 ? 0.9 : 0.7;
              const zIndex = isCenter ? 30 : 20 - dist;

              return (
                <motion.div
                  key={coach.slug}
                  className="relative flex cursor-pointer flex-col items-center origin-bottom"
                  initial={{ scale, opacity, zIndex }}
                  animate={{ scale, opacity, zIndex }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                >
                  <Link href={`/coaches/${coach.slug}`} className="block">
                    <div className="relative h-[420px] w-40 md:h-[480px] md:w-48 lg:h-[520px] lg:w-56">
                      {coach.photoUrl ? (
                        <Image
                          src={coach.photoUrl}
                          alt={coach.name}
                          fill
                          className="select-none object-contain object-bottom [filter:drop-shadow(0_18px_28px_rgba(0,0,0,0.25))]"
                          sizes="(max-width: 1024px) 20vw, 200px"
                          priority={isCenter}
                        />
                      ) : (
                        <div className="h-full w-full rounded-lg bg-gray-200" />
                      )}
                    </div>
                  </Link>

                  <div className="mt-3 text-center">
                    <h3 className={`font-extrabold uppercase text-black ${isCenter ? "text-lg" : "text-base"}`}>
                      {coach.name}
                    </h3>
                    <p className={`text-[11px] tracking-wide text-cyan-600 ${isCenter ? "opacity-100" : "opacity-80"}`}>
                      {coach.specialties?.[0] ?? "Coach"}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AnimatePresence>

      {/* Mobile: stacked display cards matching logo palette (black/white + cyan) */}
      <div className="relative w-full px-4 pb-8 md:hidden">
        <div className="mx-auto max-w-md space-y-5">
          {coaches.map((coach) => (
            <Link
              key={coach.slug}
              href={`/coaches/${coach.slug}`}
              className="block rounded-2xl border border-black/10 bg-white shadow-sm active:scale-[0.998]"
            >
              <div className="p-4">
                <div className="relative mx-auto h-56 w-full">
                  {coach.photoUrl ? (
                    <Image
                      src={coach.photoUrl}
                      alt={coach.name}
                      fill
                      className="select-none object-contain object-bottom [filter:drop-shadow(0_12px_18px_rgba(0,0,0,0.25))]"
                      sizes="(max-width: 480px) 100vw, 420px"
                    />
                  ) : (
                    <div className="h-full w-full rounded-lg bg-gray-200" />
                  )}
                </div>
                <div className="mt-3 text-center">
                  <h3 className="text-base font-extrabold uppercase text-black">{coach.name}</h3>
                  <p className="text-[11px] font-semibold tracking-wide text-cyan-600">{coach.specialties?.[0] ?? "Coach"}</p>
                </div>
                <div className="mt-4 flex justify-center">
                  <span className="inline-flex items-center justify-center rounded-full border border-cyan-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-600">
                    View Profile
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden items-center gap-3 md:flex">
        <button
          onClick={prevCoach}
          aria-label="Previous coach"
          className="grid h-10 w-10 place-items-center rounded-full bg-black text-white hover:bg-black/90"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={nextCoach}
          aria-label="Next coach"
          className="grid h-10 w-10 place-items-center rounded-full bg-black text-white hover:bg-black/90"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};
