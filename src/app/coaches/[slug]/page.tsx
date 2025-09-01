// src/app/coaches/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanityClient";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { COACH_DETAILS_QUERY } from "@/features/coaches/queries";
import { type CoachDetails } from "@/features/coaches/types";

export default function CoachDetailsPage({ params }: { params: { slug: string } }) {
  const [coachData, setCoachData] = useState<CoachDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoachData = async () => {
      const data = await client.fetch<CoachDetails>(COACH_DETAILS_QUERY, { slug: params.slug });
      setCoachData(data);
      setIsLoading(false);
    };
    fetchCoachData();
  }, [params.slug]);

  if (isLoading) return <LoadingScreen />;
  if (!coachData) return <div>Coach not found.</div>;

  return (
    <div className="transition-colors duration-300 bg-brandBgLight dark:bg-brandBgDark">
      <div className="container px-4 py-20 mx-auto">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Left Column: Photo */}
          <div className="md:col-span-1">
            <div className="relative overflow-hidden shadow-lg aspect-square rounded-2xl">
              {coachData.photoUrl && (
                <Image src={coachData.photoUrl} alt={coachData.name} fill className="object-cover" />
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="md:col-span-2">
            <h1 className="text-5xl font-extrabold text-brandTextLight dark:text-brandTextDark">{coachData.name}</h1>

            {coachData.specialties && (
              <div className="flex flex-wrap gap-2 mt-4">
                {coachData.specialties.map(s => (
                  <span key={s} className="px-3 py-1 text-xs font-semibold rounded-full bg-brandPrimary/10 text-brandPrimary">
                    {s}
                  </span>
                ))}
              </div>
            )}

            {coachData.bio && (
              <div className="mt-8 prose dark:prose-invert">
                <PortableText value={coachData.bio} />
              </div>
            )}

            {coachData.certifications && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-brandTextLight dark:text-brandTextDark">Certifications</h3>
                <ul className="mt-2 text-gray-600 list-disc list-inside dark:text-gray-400">
                  {coachData.certifications.map(c => <li key={c}>{c}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}