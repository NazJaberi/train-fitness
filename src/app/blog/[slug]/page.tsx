// src/app/blog/[slug]/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
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
  const [progress, setProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

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

  // Reading progress bar
  useEffect(() => {
    const onScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight * 0.4; // a bit before end
      const scrolled = Math.min(Math.max(window.scrollY - (el.offsetTop - window.innerHeight * 0.2), 0), total);
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      setProgress(Math.max(0, Math.min(100, pct)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [post]);

  if (isLoading) return <LoadingScreen />;
  if (error) return <div className="py-24 text-center text-red-500">{error}</div>;
  if (!post) return <div className="py-24 text-center text-white">Post not found.</div>;

  return (
    <div className="min-h-screen bg-black">
      {/* Reading progress */}
      <div className="fixed left-0 top-0 z-40 h-1 w-full bg-black/40">
        <div className="h-full bg-cyan-500" style={{ width: `${progress}%` }} />
      </div>
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

      {/* Content + Sidebar */}
      <section className="container mx-auto grid gap-8 px-4 pb-20 lg:grid-cols-3">
        {/* Sidebar */}
        <aside className="order-2 lg:order-1 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-extrabold text-white">About this post</h3>
            <ul className="mt-3 space-y-1 text-sm text-white/80">
              {post.author && <li><span className="text-white/60">Author:</span> {post.author}</li>}
              {post.publishedAt && <li><span className="text-white/60">Published:</span> {new Date(post.publishedAt).toLocaleDateString()}</li>}
              {post.readTime && <li><span className="text-white/60">Read time:</span> {post.readTime} min</li>}
            </ul>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {post.tags.map(t => (
                  <span key={t} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/90">{t}</span>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <div ref={contentRef} className="order-1 lg:order-2 lg:col-span-2">
          <div className="prose prose-invert max-w-none">
            <PortableText value={post.content} components={components} />
          </div>
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
