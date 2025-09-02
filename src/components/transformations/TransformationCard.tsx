// src/components/transformations/TransformationCard.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { type Transformation } from "@/features/transformations/types";

export const TransformationCard = ({ story }: { story: Transformation }) => {
  return (
    <motion.div 
      className="overflow-hidden bg-white shadow-xl dark:bg-brandDark rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="grid grid-cols-2">
        <div className="relative aspect-square">
          <Image src={story.beforeImageUrl} alt={`Before photo of ${story.memberName}`} fill className="object-cover" />
          <div className="absolute px-2 py-1 text-xs font-bold text-white uppercase rounded-md top-2 left-2 bg-black/50">Before</div>
        </div>
        <div className="relative aspect-square">
          <Image src={story.afterImageUrl} alt={`After photo of ${story.memberName}`} fill className="object-cover" />
          <div className="absolute px-2 py-1 text-xs font-bold text-white uppercase rounded-md top-2 left-2 bg-brandPrimary">After</div>
        </div>
      </div>
      <div className="p-6">
        <blockquote className="pl-4 text-lg italic font-semibold border-l-4 text-brandTextLight dark:text-brandTextDark border-brandPrimary">
          "{story.testimonialQuote}"
        </blockquote>
        <p className="mt-4 font-bold text-right text-brandTextLight dark:text-brandTextDark">- {story.memberName}</p>
        <div className="flex flex-wrap gap-4 pt-4 mt-6 border-t border-black/10 dark:border-white/10">
          {story.keyStats?.map(stat => (
            <div key={stat.statLabel} className="text-center">
              <p className="text-2xl font-bold text-brandPrimary">{stat.statValue}</p>
              <p className="text-xs tracking-wider text-gray-500 uppercase">{stat.statLabel}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};