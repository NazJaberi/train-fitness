// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import { client } from "@/lib/sanityClient";
import { LoadingScreen } from "@/components/layout/LoadingScreen";

// Coaches
import { COACH_LIST_QUERY } from "@/features/coaches/queries";
import type { CoachCardData } from "@/features/coaches/types";
import { CoachCarousel } from "@/components/coaches/CoachCarousel";

// Classes
import { CLASS_LIST_QUERY } from "@/features/classes/queries";
import type { ClassCardData } from "@/features/classes/types";

// Transformations
import { TRANSFORMATIONS_QUERY } from "@/features/transformations/queries";
import type { Transformation } from "@/features/transformations/types";
import { TransformationCard } from "@/components/transformations/TransformationCard";

// Pricing
import { PRICING_PLANS_QUERY } from "@/features/pricing/queries";
import type { PricingPlan } from "@/features/pricing/types";
import { PricingCard } from "@/components/pricing/PricingCard";

// Blog
import { BLOG_LIST_QUERY } from "@/features/blog/queries";
import type { BlogCard as BlogCardType } from "@/features/blog/types";
import { BlogCard } from "@/components/blog/BlogCard";

// Community
import { COMMUNITY_EVENTS_QUERY } from "@/features/community/queries";
import type { CommunityEvent } from "@/features/community/types";
import { EventCard } from "@/components/community/Cards";
// Home
import { HOME_PAGE_QUERY } from "@/features/home/queries";
import type { HomePageData } from "@/features/home/types";
import { HeroCarousel } from "@/components/home/HeroCarousel";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [home, setHome] = useState<HomePageData | null>(null);

  const [coaches, setCoaches] = useState<CoachCardData[]>([]);
  const [classes, setClasses] = useState<ClassCardData[]>([]);
  const [stories, setStories] = useState<Transformation[]>([]);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [posts, setPosts] = useState<BlogCardType[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const [hp, co, cl, tr, pl, po, ev] = await Promise.all([
          client.fetch<HomePageData>(HOME_PAGE_QUERY),
          client.fetch<CoachCardData[]>(COACH_LIST_QUERY),
          client.fetch<ClassCardData[]>(CLASS_LIST_QUERY),
          client.fetch<Transformation[]>(TRANSFORMATIONS_QUERY),
          client.fetch<PricingPlan[]>(PRICING_PLANS_QUERY),
          client.fetch<BlogCardType[]>(BLOG_LIST_QUERY),
          client.fetch<CommunityEvent[]>(COMMUNITY_EVENTS_QUERY),
        ]);
        setHome(hp || null);
        setCoaches(co ?? []);
        setClasses(cl ?? []);
        setStories(tr ?? []);
        setPlans(pl ?? []);
        setPosts(po ?? []);
        setEvents(ev ?? []);
      } catch (e) {
        console.error(e);
        setError("Could not load home showcase data.");
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, []);

  if (isLoading) return <LoadingScreen />;
  if (error) return <div className="py-24 text-center text-red-500">{error}</div>;

  const topClasses = classes.slice(0, 3);
  const topPlans = (plans.filter(p => p.highlight).length ? plans.filter(p => p.highlight) : plans).slice(0, 3);
  const topPosts = posts.slice(0, 3);
  const topEvents = events.slice(0, 3);
  const topStories = stories.slice(0, 2);

  return (
    <div className="min-h-screen bg-black">
      {/* HERO CAROUSEL fed by CMS */}
      <HeroCarousel slides={(home?.heroSlides?.length ? home!.heroSlides : [{ imageUrl: posts[0]?.coverImageUrl || classes[0]?.imageUrl || coaches[0]?.photoUrl || '/placeholder-hero.jpg', title: 'Train Smarter. Get Stronger.', tagline: 'World‑class coaching, electrifying classes, and a supportive community.' }]) as any} />

      {/* COACHES */}
      {coaches.length > 0 && (
        <section className="container mx-auto px-4 pb-10">
          <h2 className="mb-4 text-center text-xl font-extrabold text-white">Our Team</h2>
          <CoachCarousel coaches={coaches} />
        </section>
      )}

      {/* CLASSES */}
      {topClasses.length > 0 && (
        <section className="container mx-auto px-4 pb-16">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white">Popular Classes</h2>
            <Link href="/classes" className="text-sm font-bold text-cyan-400 hover:text-cyan-300">View all</Link>
          </div>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
            {topClasses.map((c, idx) => (
              <motion.article key={c.slug} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:idx*0.04}} className="group relative h-64 w-72 flex-shrink-0 snap-start overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm">
                <Link href={`/classes/${c.slug}`} className="block h-full w-full">
                  <div className="relative h-full w-full">
                    {c.imageUrl ? (
                      <Image src={c.imageUrl} alt={c.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (<div className="h-full w-full bg-white/5" />)}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute left-4 top-4 flex gap-2">
                      {c.intensityLevel && <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">{c.intensityLevel}</span>}
                      {typeof c.duration === 'number' && <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">{c.duration} min</span>}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-bold text-white">{c.name}</h3>
                      {c.tagline && <p className="mt-1 line-clamp-2 text-sm text-white/80">{c.tagline}</p>}
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      {/* TRANSFORMATIONS */}
      {topStories.length > 0 && (
        <section className="container mx-auto px-4 pb-16">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white">Member Transformations</h2>
            <Link href="/transformations" className="text-sm font-bold text-cyan-400 hover:text-cyan-300">See more</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {topStories.map((s) => (<TransformationCard key={s._id} story={s} />))}
          </div>
        </section>
      )}

      {/* PRICING PREVIEW */}
      {topPlans.length > 0 && (
        <section className="container mx-auto px-4 pb-16">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white">Memberships</h2>
            <Link href="/pricing" className="text-sm font-bold text-cyan-400 hover:text-cyan-300">All plans</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topPlans.map((p) => (<PricingCard key={p._id} plan={p} />))}
          </div>
        </section>
      )}

      {/* EVENTS (moved above blog) */}
      {topEvents.length > 0 && (
        <section className="container mx-auto px-4 pb-20">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white">Upcoming Events</h2>
            <Link href="/community" className="text-sm font-bold text-cyan-400 hover:text-cyan-300">View community</Link>
          </div>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
            {topEvents.map((e) => (<EventCard key={e._id} evt={e} />))}
          </div>
        </section>
      )}

      {/* BLOG (last) */}
      {topPosts.length > 0 && (
        <section className="container mx-auto px-4 pb-16">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white">Latest from the Blog</h2>
            <Link href="/blog" className="text-sm font-bold text-cyan-400 hover:text-cyan-300">Read more</Link>
          </div>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
            {topPosts.map((p) => (<BlogCard key={p._id} post={p} />))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-xl">
          <h3 className="text-2xl font-extrabold text-white sm:text-3xl">Ready to start your journey?</h3>
          <p className="mt-2 text-white/80">Join TRAIN FITNESS today or take a VR Tour of our facilities.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/pricing" className="rounded-full bg-cyan-500 px-6 py-3 font-bold text-black hover:bg-cyan-400">Join Now</Link>
            <Link href="/tour" className="rounded-full border border-white/20 px-6 py-3 font-bold text-white hover:bg-white/10">VR Tour</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
