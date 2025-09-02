// src/app/blog/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanityClient";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { BLOG_DETAILS_QUERY } from "@/features/blog/queries";
import type { BlogPost } from "@/features/blog/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-white/90 leading-7">{children}</p>,
    h2: ({ children }) => <h2 className="mt-6 text-2xl font-extrabold text-white">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-5 text-xl font-bold text-white">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-cyan-500 pl-4 text-white/90 italic">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="ml-5 list-disc space-y-1 text-white/90">{children}</ul>,
    number: ({ children }) => <ol className="ml-5 list-decimal space-y-1 text-white/90">{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} className="text-cyan-400 underline underline-offset-4 hover:text-cyan-300" target={value?.href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{children}</a>
    )
  },
  types: {
    image: ({ value }) => (
      <div className="relative my-6 aspect-video overflow-hidden rounded-2xl border border-white/10">
        {value?.asset?._ref && <Image src={(value as any).asset?.url || ''} alt="" fill className="object-cover" />}
      </div>
    )
  }
};

export default function BlogDetailsPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await client.fetch<BlogPost>(BLOG_DETAILS_QUERY, { slug: params.slug });
        setPost(res);
      } catch (e) {
        console.error(e);
        setError('Could not load this post.');
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [params.slug]);

  if (isLoading) return <LoadingScreen />;
  if (error) return <div className="py-24 text-center text-red-500">{error}</div>;
  if (!post) return <div className="py-24 text-center text-white">Post not found.</div>;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative">
        {post.coverImageUrl && (
          <div className="absolute inset-0">
            <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
          </div>
        )}
        <div className="relative container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-3xl">
            <div className="mb-2 flex flex-wrap gap-1">
              {post.tags?.slice(0, 3).map(t => (
                <span key={t} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/90">{t}</span>
              ))}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white">{post.title}</h1>
            <p className="mt-2 text-sm text-white/70">{formatMeta(post.publishedAt, post.author, post.readTime)}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 pb-20">
        <div className="prose prose-invert max-w-3xl">
          <PortableText value={post.content} components={components} />
        </div>
      </section>
    </div>
  );
}

function formatMeta(date?: string, author?: string, readTime?: number) {
  const bits: string[] = [];
  if (date) bits.push(new Date(date).toLocaleDateString());
  if (author) bits.push(author);
  if (readTime) bits.push(`${readTime} min read`);
  return bits.join(' • ');
}

