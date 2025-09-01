"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CoachCardData } from "@/features/coaches/types"; // This line is fixed
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export const CoachCarousel = ({ coaches }: { coaches: CoachCardData[] }) => {
  const [index, setIndex] = useState(0);

  const nextCoach = () => setIndex(prev => (prev + 1) % coaches.length);
  const prevCoach = () => setIndex(prev => (prev - 1 + coaches.length) % coaches.length);

  // Return null if there are no coaches to display
  if (!coaches || coaches.length === 0) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <p className="text-gray-500">No coaches have been added yet.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Title */}
      <motion.h2
        key={coaches[index]?.name}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 0.05, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute font-extrabold tracking-widest uppercase pointer-events-none text-9xl text-brandTextLight dark:text-brandTextDark"
      >
        OUR TEAM
      </motion.h2>

      <AnimatePresence>
        <div className="relative flex items-center justify-center w-full h-full">
          {[-2, -1, 0, 1, 2].map(offset => {
            const i = (index + offset + coaches.length) % coaches.length;
            const coach = coaches[i];
            if (!coach) return null;

            const isCenter = offset === 0;
            const scale = isCenter ? 1 : 0.7;
            const x = isCenter ? 0 : Math.sign(offset) * 350;
            const zIndex = isCenter ? 3 : 1;
            const opacity = isCenter ? 1 : 0.5;

            return (
              <motion.div
                key={coach.slug}
                className="absolute w-80 h-[500px] flex flex-col items-center cursor-pointer"
                initial={{ x, scale, opacity, zIndex }}
                animate={{ x, scale, opacity, zIndex }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <Link href={`/coaches/${coach.slug}`} className="block w-full h-full">
                  <div className="relative w-full h-full">
                    {coach.photoUrl ? (
                      <Image src={coach.photoUrl} alt={coach.name} fill className="object-contain" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-lg" />
                    )}
                  </div>
                </Link>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-bold text-brandTextLight dark:text-brandTextDark">{coach.name}</h3>
                  <p className="text-sm text-gray-500">{coach.specialties?.[0]}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
      
      {/* Navigation Arrows */}
      <button onClick={prevCoach} className="absolute z-10 p-3 transition-colors rounded-full left-10 bg-white/50 dark:bg-black/50 hover:bg-white/70 dark:hover:bg-black/70"><FaArrowLeft /></button>
      <button onClick={nextCoach} className="absolute z-10 p-3 transition-colors rounded-full right-10 bg-white/50 dark:bg-black/50 hover:bg-white/70 dark:hover:bg-black/70"><FaArrowRight /></button>
    </div>
  );
};