// src/components/blog/BlogHero.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogCard as BlogCardType } from "@/features/blog/types";

export function BlogHero({ post }: { post: BlogCardType }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-[380px] w-full sm:h-[460px] lg:h-[520px]">
          {post.coverImageUrl && (
            <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" priority />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/90" />

          <div className="absolute bottom-6 left-6 right-6">
            <div className="mb-2 flex flex-wrap gap-1">
              {post.tags?.slice(0, 3).map(t => (
                <span key={t} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/90">{t}</span>
              ))}
            </div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">{post.title}</h2>
            <p className="mt-2 text-xs text-white/70">{formatMeta(post.publishedAt, post.author, post.readTime)}</p>
          </div>
        </div>
      </Link>
    </motion.section>
  );
}

function formatMeta(date?: string, author?: string, readTime?: number) {
  const bits: string[] = [];
  if (date) bits.push(new Date(date).toLocaleDateString());
  if (author) bits.push(author);
  if (readTime) bits.push(`${readTime} min read`);
  return bits.join(' • ');
}

