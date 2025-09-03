// src/app/page.tsx
// Server component homepage (optimized)
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FaDumbbell, FaHeartbeat, FaLeaf, FaUserShield } from "react-icons/fa";

import { client } from "@/lib/sanityClient";

// Components (client under the hood)
import { CoachCard } from "@/components/coaches/CoachCard";
import { BlogCard } from "@/components/blog/BlogCard";
import { PricingCard } from "@/components/pricing/PricingCard";
import { EventCard } from "@/components/community/Cards";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { FeatureTiles } from "@/components/home/FeatureTiles";
import { TransformationCard } from "@/components/transformations/TransformationCard";

// Queries & types
import { HOME_PAGE_QUERY } from "@/features/home/queries";
import type { HomePageData } from "@/features/home/types";

// Coaches
import { COACH_LIST_QUERY } from "@/features/coaches/queries";
import type { CoachCardData } from "@/features/coaches/types";

// Classes
import { CLASS_LIST_QUERY } from "@/features/classes/queries";
import type { ClassCardData } from "@/features/classes/types";

// Transformations
import { TRANSFORMATIONS_QUERY } from "@/features/transformations/queries";
import type { Transformation } from "@/features/transformations/types";

// Pricing
import { PRICING_PLANS_QUERY } from "@/features/pricing/queries";
import type { PricingPlan } from "@/features/pricing/types";

// Blog
import { BLOG_LIST_QUERY } from "@/features/blog/queries";
import type { BlogCard as BlogCardType } from "@/features/blog/types";

// Community
import { COMMUNITY_EVENTS_QUERY } from "@/features/community/queries";
import type { CommunityEvent } from "@/features/community/types";
// ----- Brand token -----
const BRAND = { blue: "#0DBAF5" };

export const metadata: Metadata = {
  title: "TRAIN FITNESS — Manama’s Premier Destination for Fitness & Wellness",
  description:
    "World-class coaching, electrifying classes, and a supportive community. Claim your free 3-day pass at TRAIN FITNESS.",
  openGraph: {
    title: "TRAIN FITNESS",
    description:
      "World-class coaching, electrifying classes, and a supportive community.",
    type: "website",
  },
};

export const revalidate = 60;

async function fetchHomeData() {
  const [home, coaches, classes, stories, plans, posts, events] = await Promise.all([
    client.fetch<HomePageData>(HOME_PAGE_QUERY),
    client.fetch<CoachCardData[]>(COACH_LIST_QUERY),
    client.fetch<ClassCardData[]>(CLASS_LIST_QUERY),
    client.fetch<Transformation[]>(TRANSFORMATIONS_QUERY),
    client.fetch<PricingPlan[]>(PRICING_PLANS_QUERY),
    client.fetch<BlogCardType[]>(BLOG_LIST_QUERY),
    client.fetch<CommunityEvent[]>(COMMUNITY_EVENTS_QUERY),
  ]);
  return { home, coaches, classes, stories, plans, posts, events };
}

export default async function HomePage() {
  const { home, coaches, classes, stories, plans, posts, events } = await fetchHomeData();

  const featuredCoaches = (coaches?.filter((c: any) => c.featured) ?? []).slice(0, 3);
  const fallbackCoaches = (coaches ?? []).slice(0, 3);
  const useCoaches = featuredCoaches.length === 3 ? featuredCoaches : fallbackCoaches;

  const latestPosts = [...(posts ?? [])]
    .sort((a, b) => (new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()))
    .slice(0, 3);
  const topClasses = (classes ?? []).slice(0, 6);
  const topPlans = (((plans ?? []).filter((p) => p.highlight).length ? (plans ?? []).filter((p) => p.highlight) : (plans ?? []))).slice(0, 3);
  const topEvents = (events ?? []).slice(0, 3);
  const topStories = (stories ?? []).slice(0, 2);

  // Prepare hero content (use first slide or sensible defaults)
  const heroSlide = (home?.heroSlides && home.heroSlides[0]) || {
    title: "Workout or Work Less",
    tagline:
      "World‑class coaching, electrifying classes, and a supportive community.",
    imageUrl:
      latestPosts?.[0]?.coverImageUrl ||
      topClasses?.[0]?.imageUrl ||
      useCoaches?.[0]?.photoUrl ||
      "/placeholder-hero.jpg",
  };

  const expertCount = Math.max(coaches?.length || 0, 25);
  const memberCount = Math.max(home?.memberCount || 0, 500);

  return (
    <div className="min-h-screen bg-black">
      {/* JSON-LD: LocalBusiness */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HealthClub",
            name: "TRAIN FITNESS",
            url: "https://your-domain.example",
            address: { "@type": "PostalAddress", addressLocality: "Manama", addressCountry: "BH" },
          }),
        }}
      />

      {/* HERO CAROUSEL (full-bleed cover with CTAs) */}
      <HeroCarousel
        slides={(home?.heroSlides?.length
          ? home!.heroSlides
          : [
              {
                imageUrl:
                  latestPosts?.[0]?.coverImageUrl ||
                  topClasses?.[0]?.imageUrl ||
                  useCoaches?.[0]?.photoUrl ||
                  "/placeholder-hero.jpg",
                title: "Train Smarter. Get Stronger.",
                tagline:
                  "World‑class coaching, electrifying classes, and a supportive community.",
              },
            ]) as any}
        primaryCta={{ label: "Get Started", href: "#benefit" }}
        secondaryCta={home?.secondaryCta}
      />

      {/* Feature Tiles under hero */}
      {home?.featureTiles && home.featureTiles.length > 0 && (
        <>
          <section className="container mx-auto px-4 pt-2 text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold">Ignite Your Routine</h2>
            <p className="mx-auto mt-1 max-w-2xl text-sm text-white/80">
              Choose your path — Classes, Trainers, Memberships, and more. Everything you need to level up.
            </p>
          </section>
          <FeatureTiles tiles={home.featureTiles} />
        </>
      )}

      {/* Services Overview */}
      {home?.services && home.services.length > 0 && (
        <section className="container px-4 pb-12 mx-auto text-center">
          <div className="mb-3 text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold">What We Offer</h2>
            <p className="mx-auto mt-1 max-w-2xl text-sm text-white/80">
              From high-voltage classes to one‑on‑one coaching and a recovery‑friendly juice bar — we’ve got you covered.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {home.services.slice(0,4).map((s, i) => (
              <a key={s.title + i} href={s.href || '#'} className="block p-5 border group rounded-2xl border-white/10 bg-white/5 hover:bg-white/10">
                <div className="flex items-center gap-3">
                  {s.iconUrl ? (
                    <span className="relative inline-block w-10 h-10 overflow-hidden rounded-lg bg-white/10">
                      <Image src={s.iconUrl} alt="" fill className="object-contain p-2" />
                    </span>
                  ) : (<span className="w-10 h-10 rounded-lg bg-white/10" />)}
                  <div className="text-lg font-extrabold text-white">{s.title}</div>
                </div>
                {s.blurb && <p className="mt-2 text-sm text-white/80">{s.blurb}</p>}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Divider */}
      <div className="container h-px mx-auto my-6 bg-white/10" />

      {/* Testimonials */}
      {home?.testimonials && home.testimonials.length > 0 && (
        <section className="container px-4 pb-16 mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-white">What our members say</h2>
            <Link href="/transformations" className="text-sm font-bold text-cyan-400 hover:text-cyan-300">See Success Stories</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {home.testimonials.slice(0,3).map((t, i) => (
              <div key={(t.name||'')+i} className="p-5 border rounded-3xl border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  {t.photoUrl && <span className="relative inline-block w-12 h-12 overflow-hidden rounded-full bg-white/10"><Image src={t.photoUrl} alt="" fill className="object-cover" /></span>}
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    {t.since && <div className="text-xs text-white/70">Member since {t.since}</div>}
                  </div>
                </div>
                {t.quote && <p className="mt-3 text-sm text-white/90">“{t.quote}”</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Why Us Features */}
      {home?.features && home.features.length > 0 && (
        <section className="container px-4 pb-16 mx-auto">
          <h3 className="mb-6 text-sm font-extrabold tracking-widest text-center uppercase text-white/70">We give the best standards</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {home.features.slice(0,6).map((f, i) => (
              <div key={(f.title||'')+i} className="p-4 text-center border rounded-2xl border-white/10 bg-white/5">
                {f.iconUrl && <span className="relative block w-10 h-10 mx-auto overflow-hidden rounded-lg bg-white/10"><Image src={f.iconUrl} alt="" fill className="object-contain p-2" /></span>}
                <div className="mt-2 font-bold text-white">{f.title}</div>
                {f.metric && <div className="text-xs text-cyan-400">{f.metric}</div>}
                {f.description && <div className="text-xs text-white/70">{f.description}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Highlight Card (Unlimited Group & PT) */}
      <section id="benefit" className="container px-4 pb-16 mx-auto">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-6 border shadow-xl rounded-3xl border-white/10 bg-cyan-500/15 md:col-span-2">
            <h3 className="text-2xl font-extrabold text-white sm:text-3xl">Unlimited Group & Personal Training</h3>
            <p className="max-w-xl mt-2 text-sm text-white/80">Push harder with electrifying group sessions or get tailored 1:1 coaching to reach goals faster.</p>
            <div className="flex gap-3 mt-5">
              <Link href="/pricing" className="px-5 py-2 font-bold text-black rounded-full bg-cyan-500 hover:bg-cyan-400">View Plans</Link>
              <Link href="/coaches" className="px-5 py-2 font-bold text-white border rounded-full border-white/20 hover:bg-white/10">Meet Coaches</Link>
            </div>
          </div>
          <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
            <div className="text-3xl font-extrabold text-white">500+</div>
            <p className="mt-1 text-sm text-white/80">Members smashing their goals</p>
          </div>
        </div>
      </section>

      {/* COACHES */}
      {!!useCoaches.length && (
        <section className="container px-4 pb-16 mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-white">Our Team</h2>
            <Link href="/coaches" className="text-sm font-bold text-cyan-400 hover:text-cyan-300">Meet all coaches</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {useCoaches.map((c) => (
              <CoachCard key={c.slug} coach={c} />
            ))}
          </div>
        </section>
      )}

      {/* CLASSES */}
      {topClasses.length > 0 && (
        <section className="container px-4 pb-16 mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-white">Popular Classes</h2>
            <Link href="/classes" className="text-sm font-bold text-cyan-400 hover:text-cyan-300">View all</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.slice(0, 6).map((c, idx) => (
              <article key={c.slug} className="relative h-56 overflow-hidden border shadow-sm group rounded-3xl border-white/10 bg-white/5">
                <Link href={`/classes/${c.slug}`} className="block w-full h-full">
                  <div className="relative w-full h-full">
                    {c.imageUrl ? (
                      <Image src={c.imageUrl} alt={c.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (<div className="w-full h-full bg-white/5" />)}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute flex gap-2 left-4 top-4">
                      {c.intensityLevel && <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">{c.intensityLevel}</span>}
                      {typeof c.duration === 'number' && <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">{c.duration} min</span>}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-bold text-white">{c.name}</h3>
                      {c.tagline && <p className="mt-1 text-sm line-clamp-2 text-white/80">{c.tagline}</p>}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Standards / Pillars */}
      <section className="container px-4 pb-16 mx-auto">
        <h3 className="mb-6 text-sm font-extrabold tracking-widest text-center uppercase text-white/70">We set the highest standards</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { Icon: FaDumbbell, title: 'Elite Equipment', text: 'Train with premium gear.' },
            { Icon: FaUserShield, title: 'Certified Coaches', text: 'Personal plans for results.' },
            { Icon: FaHeartbeat, title: 'Holistic Approach', text: 'Strength, cardio, recovery.' },
            { Icon: FaLeaf, title: 'Nutrition Guidance', text: 'Support to fuel progress.' },
          ].map((f, i) => (
            <div key={f.title} className="p-4 text-center border rounded-2xl border-white/10 bg-white/5">
              <f.Icon className="w-6 h-6 mx-auto text-cyan-400" />
              <div className="mt-2 font-bold text-white">{f.title}</div>
              <div className="text-xs text-white/70">{f.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TRANSFORMATIONS */}
      {topStories.length > 0 && (
        <section className="container px-4 pb-16 mx-auto">
          <div className="flex items-center justify-between mb-4">
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
        <section className="container px-4 pb-16 mx-auto">
          <div className="flex items-center justify-between mb-4">
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
        <section className="container px-4 pb-20 mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-white">Upcoming Events</h2>
            <Link href="/community" className="text-sm font-bold text-cyan-400 hover:text-cyan-300">View community</Link>
          </div>
          <div className="flex gap-4 pb-2 overflow-x-auto snap-x snap-mandatory">
            {topEvents.map((e) => (<EventCard key={e._id} evt={e} />))}
          </div>
        </section>
      )}

      {/* BLOG (last) */}
      {!!latestPosts.length && (
        <section className="container px-4 pb-16 mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-white">Latest from the Blog</h2>
            <Link href="/blog" className="text-sm font-bold text-cyan-400 hover:text-cyan-300">Read more</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((p) => (<BlogCard key={p._id} post={p} />))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container px-4 pb-20 mx-auto">
        <div className="relative p-8 overflow-hidden text-center border shadow-xl rounded-3xl border-white/10 bg-white/5">
          <h3 className="text-2xl font-extrabold text-white sm:text-3xl">Ready to start your journey?</h3>
          <p className="mt-2 text-white/80">Join TRAIN FITNESS today or take a VR Tour of our facilities.</p>
          <div className="flex flex-wrap justify-center gap-3 mt-5">
            <Link href="/pricing" className="px-6 py-3 font-bold text-black rounded-full" style={{ backgroundColor: BRAND.blue }}>Join Now</Link>
            <Link href="/tour" className="px-6 py-3 font-bold text-white border rounded-full border-white/20 hover:bg-white/10">VR Tour</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
