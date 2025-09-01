// src/components/classes/ClassCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export type ClassCardData = {
  name: string;
  tagline: string;
  slug: string;
  imageUrl: string;
};

type ClassCardProps = {
  classInfo: ClassCardData;
};

export const ClassCard = ({ classInfo }: ClassCardProps) => {
  return (
    // Link now wraps the motion component directly
    <Link href={`/classes/${classInfo.slug}`} className="block group">
      <motion.div
        className="h-full overflow-hidden bg-white shadow-lg dark:bg-brandDark rounded-2xl"
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="relative w-full h-48">
          <Image
            src={classInfo.imageUrl}
            alt={classInfo.name}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="p-6">
          <h3 className="mb-2 text-2xl font-bold text-brandTextLight dark:text-brandTextDark">
            {classInfo.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {classInfo.tagline}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};