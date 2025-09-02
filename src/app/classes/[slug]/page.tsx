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
  duration?: number; // minutes
  caloriesBurned?: string;
  keyBenefits?: { benefitText: string; iconUrl?: string }[];
  whatToBring?: { itemText: string; iconUrl?: string }[];
  schedule?: { day: string; startTime: string; endTime: string; instructor?: { name?: string } }[];
  gallery?: { url: string }[];
};

const Stat = ({ label, value }: { label: string; value?: string | number }) => {
  const display = (() => {
    if (value === undefined || value === null || value === "") return "—";
    if (label === "Duration" && typeof value === "number") return `${value} min`;
    return String(value);
  })();
  return (
    <div className="px-4 py-3 border rounded-xl border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur">
      <div className="text-[11px] uppercase tracking-wider text-gray-500 mb-0.5">{label}</div>
      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{display}</div>
    </div>
  );
};

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

// Larger, more visual item for benefits/bring lists
const LargeInfoItem = ({ text, iconUrl }: { text: string; iconUrl?: string }) => (
  <div className="flex items-center gap-4 p-5 border rounded-xl border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur">
    <div className="relative flex-shrink-0 w-16 h-16 overflow-hidden rounded-2xl bg-black/5 dark:bg-white/10">
      {iconUrl ? (
        <Image src={iconUrl} alt="" fill className="object-contain p-3" />
      ) : (
        <span className="sr-only">item</span>
      )}
    </div>
    <span className="text-xl font-extrabold text-gray-900 sm:text-2xl dark:text-gray-100">{text}</span>
  </div>
);

// Simple fade carousel for gallery images
const GalleryCarousel = ({
  images,
  name,
}: {
  images: { url: string }[];
  name: string;
}) => {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  if (count === 0) return null;

  return (
    <div className="relative w-full overflow-hidden border rounded-2xl border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur">
      <div className="relative h-64 sm:h-80">
        <motion.div
          key={images[index]?.url}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, info) => {
            if (info.offset.x < -50) next();
            else if (info.offset.x > 50) prev();
          }}
        >
          <Image
            src={images[index].url}
            alt={`${name} photo ${index + 1}`}
            fill
            className="object-cover select-none"
            sizes="(max-width: 640px) 100vw, 66vw"
            priority={index === 0}
          />
        </motion.div>
      </div>
      {/* Controls */}
      {count > 1 && (
        <>
          <button
            aria-label="Previous image"
            onClick={prev}
            className="absolute grid text-white -translate-y-1/2 rounded-full left-3 top-1/2 h-9 w-9 place-items-center bg-black/50 hover:bg-black/60"
          >
            ‹
          </button>
          <button
            aria-label="Next image"
            onClick={next}
            className="absolute grid text-white -translate-y-1/2 rounded-full right-3 top-1/2 h-9 w-9 place-items-center bg-black/50 hover:bg-black/60"
          >
            ›
          </button>
          <div className="absolute left-0 right-0 flex justify-center gap-1.5 bottom-3">
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to image ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2 bg-white/60"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

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
        schedule[]{ day, startTime, endTime, instructor->{name} },
        gallery[]{ "url": asset->url }
      }`;

      const data = await client.fetch<ClassDetail>(query, { slug: params.slug });
      setClassData(data);
      setIsLoading(false);
    };

    fetchClassData();
  }, [params.slug]);

  if (isLoading) return <LoadingScreen />;
  if (!classData) return <div className="py-24 text-center text-white">Class not found.</div>;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative">
        <div className="container px-4 pt-10 pb-6 mx-auto sm:pt-14">
          <div className="mb-3">
            <a href="/classes" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white">
              <span aria-hidden>←</span> Back to classes
            </a>
          </div>
          <div className="grid items-start gap-10 lg:grid-cols-3">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur lg:col-span-2"
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
                  <div className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
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

                {/* Benefits moved below into larger panels */}

                {/* Moved Description/Overview here between stats and CTA */}
                {classData.description && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <h3 className="mb-2 text-sm font-extrabold text-white">Overview</h3>
                    <div className="max-h-56 overflow-y-auto pr-1 text-sm leading-relaxed text-white/90">
                      <PortableText value={classData.description} />
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
      <section className="container mx-auto px-4 pb-20">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left column */}
          <div className="order-2 lg:order-1 lg:col-span-2">
            {/* Prominent Benefits & What to Bring */}
            {(!!classData.keyBenefits?.length || !!classData.whatToBring?.length) && (
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {classData.keyBenefits && classData.keyBenefits.length > 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                    <h2 className="text-xl font-extrabold text-white sm:text-2xl">Health Benefits</h2>
                    <div className="mt-4 space-y-2 sm:space-y-3">
                      {classData.keyBenefits.map((b) => (
                        <LargeInfoItem key={b.benefitText} text={b.benefitText} iconUrl={b.iconUrl} />
                      ))}
                    </div>
                  </div>
                )}

                {classData.whatToBring && classData.whatToBring.length > 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                    <h2 className="text-xl font-extrabold text-white sm:text-2xl">What To Bring</h2>
                    <div className="mt-4 space-y-2 sm:space-y-3">
                      {classData.whatToBring.map((i) => (
                        <LargeInfoItem key={i.itemText} text={i.itemText} iconUrl={i.iconUrl} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Gallery (moved below benefits/bring) */}
            {classData.gallery && classData.gallery.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-white sm:text-2xl">Gallery</h2>
                  <span className="text-xs text-white/60">{classData.gallery.length} photos</span>
                </div>
                <div className="mt-4">
                  <GalleryCarousel images={classData.gallery} name={classData.name} />
                </div>
              </div>
            )}

            {/* (Description moved to sidebar above CTA) */}
          </div>

          {/* Schedule */}
          <div id="schedule" className="order-1 lg:order-2 lg:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <h3 className="mb-3 text-lg font-extrabold text-white">Weekly Schedule</h3>
              {classData.schedule && classData.schedule.length > 0 ? (
                <ul className="space-y-2">
                  {classData.schedule.map((slot) => (
                    <li key={`${slot.day}-${slot.startTime}`} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">
                          {slot.day}
                        </span>
                        <span className="text-xs text-white/70">
                          {slot.startTime} – {slot.endTime}
                        </span>
                      </div>
                      {slot.instructor?.name && (
                        <div className="mt-1 text-xs text-white/70">Instructor: {slot.instructor.name}</div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-white/70">No schedule published yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
