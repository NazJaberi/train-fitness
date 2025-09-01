// =====================================
// File: src/app/classes/[slug]/page.tsx
// =====================================
"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanityClient";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { motion } from "framer-motion";

// Types mirrored from Sanity
export type ClassDetail = {
  name: string;
  tagline?: string;
  description: any; // PortableTextBlock[]
  mainImageUrl?: string;
  intensityLevel?: string;
  duration?: string;
  caloriesBurned?: string;
  keyBenefits?: { benefitText: string; iconUrl?: string }[];
  whatToBring?: { itemText: string; iconUrl?: string }[];
  schedule?: { day: string; startTime: string; endTime: string; instructor?: { name?: string } }[];
};

const Stat = ({ label, value }: { label: string; value?: string }) => (
  <div className="px-4 py-3 border rounded-xl border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur">
    <div className="text-[11px] uppercase tracking-wider text-gray-500 mb-0.5">{label}</div>
    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{value ?? "—"}</div>
  </div>
);

const InfoChip = ({ text, iconUrl }: { text: string; iconUrl?: string }) => (
  <div className="flex items-center gap-3 p-2 pr-3 border rounded-xl border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur">
    {iconUrl && (
      <div className="relative flex-shrink-0 w-6 h-6">
        <Image src={iconUrl} alt="" fill className="object-contain" />
      </div>
    )}
    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{text}</span>
  </div>
);

export default function ClassDetailsPage({ params }: { params: { slug: string } }) {
  const [classData, setClassData] = useState<ClassDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!params.slug) return;

    const fetchClassData = async () => {
      const query = `*[_type == "class" && slug.current == $slug][0]{
        name,
        tagline,
        description,
        "mainImageUrl": mainImage.asset->url,
        intensityLevel,
        duration,
        caloriesBurned,
        keyBenefits[]{ benefitText, "iconUrl": icon.asset->url },
        whatToBring[]{ itemText, "iconUrl": icon.asset->url },
        schedule[]{ day, startTime, endTime, instructor->{name} }
      }`;

      const data = await client.fetch<ClassDetail>(query, { slug: params.slug });
      setClassData(data);
      setIsLoading(false);
    };

    fetchClassData();
  }, [params.slug]);

  if (isLoading) return <LoadingScreen />;
  if (!classData) return <div className="py-24 text-center">Class not found.</div>;

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-b from-brandBgLight to-white dark:from-brandBgDark dark:to-black">
      {/* Hero */}
      <section className="relative">
        <div className="container px-4 pt-10 pb-6 mx-auto sm:pt-14">
          <div className="grid items-start gap-10 lg:grid-cols-3">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden border rounded-3xl border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur lg:col-span-2"
            >
              <div className="relative h-[360px] w-full sm:h-[460px]">
                {classData.mainImageUrl ? (
                  <Image
                    src={classData.mainImageUrl}
                    alt={classData.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">No image</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-white/80 dark:bg-black/60 text-gray-800 dark:text-gray-100">
                    {classData.intensityLevel ?? "Fitness"}
                  </div>
                  <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                    {classData.name}
                  </h1>
                  {classData.tagline && (
                    <p className="mt-1.5 text-sm text-white/80 max-w-2xl">{classData.tagline}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Sticky sidebar */}
            <div className="lg:sticky lg:top-24">
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-3">
                  <Stat label="Intensity" value={classData.intensityLevel} />
                  <Stat label="Duration" value={classData.duration} />
                  <Stat label="Calories" value={classData.caloriesBurned} />
                </div>

                {classData.keyBenefits && classData.keyBenefits.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-bold tracking-wide text-gray-900 uppercase dark:text-gray-100">
                      Key benefits
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {classData.keyBenefits.map((b) => (
                        <InfoChip key={b.benefitText} text={b.benefitText} iconUrl={b.iconUrl} />
                      ))}
                    </div>
                  </div>
                )}

                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.99 }}
                  href="#schedule"
                  className="inline-flex items-center justify-center w-full h-12 font-semibold text-white shadow-lg rounded-xl bg-brandPrimary"
                >
                  Book This Class
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container px-4 pb-20 mx-auto">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Description */}
          <div className="lg:col-span-2">
            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:scroll-mt-24">
              <PortableText value={classData.description} />
            </div>

            {/* What to bring */}
            {classData.whatToBring && classData.whatToBring.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">
                  What to bring
                </h2>
                <div className="flex flex-wrap gap-2">
                  {classData.whatToBring.map((i) => (
                    <InfoChip key={i.itemText} text={i.itemText} iconUrl={i.iconUrl} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Schedule */}
          <div id="schedule" className="lg:col-span-1">
            <div className="p-4 border rounded-2xl border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur">
              <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-gray-100">Weekly schedule</h3>
              {classData.schedule && classData.schedule.length > 0 ? (
                <ul className="space-y-2">
                  {classData.schedule.map((slot) => (
                    <li key={`${slot.day}-${slot.startTime}`} className="p-3 border rounded-xl bg-white/80 dark:bg-white/5 border-black/5 dark:border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {slot.day}
                        </span>
                        <span className="text-xs text-gray-500">
                          {slot.startTime} – {slot.endTime}
                        </span>
                      </div>
                      {slot.instructor?.name && (
                        <div className="mt-1 text-xs text-gray-500">Instructor: {slot.instructor.name}</div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No schedule published yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
