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
        className="relative w-full overflow-hidden transition-shadow border shadow-sm h-96 group rounded-3xl border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur hover:shadow-xl"
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
        <div className="absolute inset-0 transition-opacity bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90" />

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold">
            {coach.name}
          </h3>
          {primarySpecialty && (
            <p className="mt-1 text-sm text-white/80">
              {primarySpecialty}
            </p>
          )}
        </div>
      </motion.article>
    </Link>
  );
};