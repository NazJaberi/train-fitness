// src/components/coaches/CoachCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { type CoachCardData } from "@/features/coaches/types";

export const CoachCard = ({ coach }: { coach: CoachCardData }) => {
  const primarySpecialty = coach.specialties?.[0];

  return (
    <Link href={`/coaches/${coach.slug}`} className="block group focus:outline-none focus-visible:ring-4 ring-brandPrimary/30 rounded-3xl">
      <motion.article
        whileHover={{ y: -4 }}
        className="relative h-96 w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm transition-shadow hover:shadow-2xl"
      >
        {coach.photoUrl ? (
          <Image
            src={coach.photoUrl}
            alt={coach.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-sm text-gray-400">No photo</div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 transition-opacity group-hover:opacity-95" />

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-extrabold uppercase tracking-wide">
            {coach.name}
          </h3>
          {primarySpecialty && (
            <p className="mt-1 text-sm font-semibold tracking-wide text-cyan-400">
              {primarySpecialty}
            </p>
          )}
          <div className="mt-3">
            <span className="inline-flex items-center rounded-full bg-cyan-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">View Profile</span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
};
