// src/components/blog/BlogCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogCard as BlogCardType } from "@/features/blog/types";

export function BlogCard({ post, large = false }: { post: BlogCardType; large?: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className={`group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl ${large ? 'md:col-span-2' : ''}`}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className={`relative ${large ? 'h-80' : 'h-56'} w-full overflow-hidden`}>
          {post.coverImageUrl ? (
            <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="h-full w-full bg-white/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute left-4 right-4 bottom-4">
            <div className="mb-1 flex flex-wrap gap-1">
              {post.tags?.slice(0, 2).map((t) => (
                <span key={t} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/90">{t}</span>
              ))}
            </div>
            <h3 className={`font-extrabold text-white ${large ? 'text-3xl' : 'text-xl'}`}>{post.title}</h3>
            <p className="mt-1 text-xs text-white/70">
              {formatMeta(post.publishedAt, post.author, post.readTime)}
            </p>
          </div>
        </div>
        {/* Keep cards compact; skip excerpt on featured */}
        {!large && post.excerpt && (
          <p className="px-4 pb-4 pt-3 text-sm text-white/80">{post.excerpt}</p>
        )}
      </Link>
    </motion.article>
  );
}

function formatMeta(date?: string, author?: string, readTime?: number) {
  const bits: string[] = [];
  if (date) bits.push(new Date(date).toLocaleDateString());
  if (author) bits.push(author);
  if (readTime) bits.push(`${readTime} min read`);
  return bits.join(' • ');
}
