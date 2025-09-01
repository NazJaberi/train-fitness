"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanityClient";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { COACH_DETAILS_QUERY } from "@/features/coaches/queries";
import { type CoachDetails } from "@/features/coaches/types";
import { motion } from "framer-motion";

export default function CoachDetailsPage({ params }: { params: { slug: string } }) {
  const [coachData, setCoachData] = useState<CoachDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        const data = await client.fetch<CoachDetails>(COACH_DETAILS_QUERY, { slug: params.slug });
        setCoachData(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoachData();
  }, [params.slug]);

  if (isLoading) return <LoadingScreen />;
  if (!coachData) return <div className="py-24 text-center text-white">Coach not found.</div>;

  const firstThreeSpecialties = coachData.specialties?.slice(0, 3) ?? [];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-10%] h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[120px]" />
        </div>

        <div className="container mx-auto grid grid-cols-1 items-end gap-8 px-4 pt-16 sm:pt-24 md:grid-cols-2">
          <div className="pb-8">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-5xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-6xl"
            >
              {coachData.name}
            </motion.h1>

            {coachData.specialties && coachData.specialties.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {coachData.specialties.map((s) => (
                  <span key={s} className="rounded-full border border-cyan-500/40 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-300">
                    {s}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 text-sm font-semibold uppercase tracking-wide text-white/60">
              Train with excellence — inside and outside the studio
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative mx-auto h-[380px] w-[320px] sm:h-[460px] sm:w-[380px] md:h-[520px] md:w-[440px]"
          >
            {coachData.photoUrl ? (
              <Image
                src={coachData.photoUrl}
                alt={coachData.name}
                fill
                priority
                className="select-none object-contain object-bottom [filter:drop-shadow(0_28px_48px_rgba(0,0,0,0.5))]"
              />
            ) : (
              <div className="h-full w-full rounded-3xl bg-white/5" />)
            }
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* About */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-white/70">About</span>
              </div>
              {/* Section title removed per request */}
              {coachData.bio ? (
                <div className="prose mt-4 max-w-none text-white/90 prose-invert">
                  <PortableText value={coachData.bio} />
                </div>
              ) : (
                <p className="mt-4 text-white/80">Bio coming soon.</p>
              )}
            </div>

            {/* Why train with me - map up to 3 specialties */}
            {firstThreeSpecialties.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 text-2xl font-extrabold text-white">Why train with me</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  {firstThreeSpecialties.map((s, idx) => (
                    <div key={s} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <div className="text-cyan-400">{String(idx + 1).padStart(2, "0")}.</div>
                      <div className="mt-2 text-lg font-bold text-white">{s}</div>
                      <p className="mt-1 text-sm text-white/70">Personalized coaching focused on {s.toLowerCase()} with measurable progress.</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Certifications */}
          <div>
            <div className="sticky top-24 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
              <h3 className="text-xl font-extrabold text-white">Certifications</h3>
              {coachData.certifications && coachData.certifications.length > 0 ? (
                <ul className="mt-3 space-y-2 text-sm text-white/80">
                  {coachData.certifications.map((c) => (
                    <li key={c} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-white/70">No certifications listed.</p>
              )}
              <div className="mt-5">
                <a href="/coaches" className="inline-flex items-center rounded-full bg-cyan-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-400">
                  Back to all coaches
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
