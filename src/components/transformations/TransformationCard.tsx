// src/components/transformations/TransformationCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { type Transformation } from "@/features/transformations/types";

export const TransformationCard = ({ story }: { story: Transformation }) => {
  const CardInner = (
    <motion.div
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="grid grid-cols-2">
        <div className="relative aspect-square">
          <Image src={story.beforeImageUrl} alt={`Before photo of ${story.memberName}`} fill className="object-cover" />
          <div className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-1 text-[11px] font-bold uppercase text-white">Before</div>
        </div>
        <div className="relative aspect-square">
          <Image src={story.afterImageUrl} alt={`After photo of ${story.memberName}`} fill className="object-cover" />
          <div className="absolute left-2 top-2 rounded-md bg-cyan-500 px-2 py-1 text-[11px] font-bold uppercase text-black">After</div>
        </div>
      </div>
      <div className="p-6">
        <blockquote className="border-l-4 border-cyan-500 pl-4 text-lg font-semibold italic text-white">
          "{story.testimonialQuote}"
        </blockquote>
        <p className="mt-4 text-right font-bold text-white/90">- {story.memberName}</p>
        <div className="mt-6 flex flex-wrap gap-4 border-t border-white/10 pt-4">
          {story.keyStats?.map((stat) => (
            <div key={stat.statLabel} className="text-center">
              <p className="text-2xl font-extrabold text-cyan-400">{stat.statValue}</p>
              <p className="text-xs uppercase tracking-wider text-white/70">{stat.statLabel}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return story.slug ? (
    <Link href={`/transformations/${story.slug}`}>{CardInner}</Link>
  ) : (
    CardInner
  );
};
