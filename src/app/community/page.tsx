// src/app/community/page.tsx
"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanityClient";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { COMMUNITY_EVENTS_QUERY, COMMUNITY_CHALLENGES_QUERY, MEMBER_HIGHLIGHTS_QUERY } from "@/features/community/queries";
import type { CommunityEvent, CommunityChallenge, MemberHighlight } from "@/features/community/types";
import { EventCard, ChallengeCard, HighlightCard } from "@/components/community/Cards";

export default function CommunityPage() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [challenges, setChallenges] = useState<CommunityChallenge[]>([]);
  const [highlights, setHighlights] = useState<MemberHighlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const [ev, ch, hi] = await Promise.all([
          client.fetch<CommunityEvent[]>(COMMUNITY_EVENTS_QUERY),
          client.fetch<CommunityChallenge[]>(COMMUNITY_CHALLENGES_QUERY),
          client.fetch<MemberHighlight[]>(MEMBER_HIGHLIGHTS_QUERY),
        ]);
        setEvents(ev ?? []);
        setChallenges(ch ?? []);
        setHighlights(hi ?? []);
      } catch (e) {
        console.error(e);
        setError('Could not load community content.');
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, []);

  if (isLoading) return <LoadingScreen />;
  if (error) return <div className="py-24 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-black">
      <section className="container mx-auto px-4 pt-16 pb-10 sm:pt-20">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold uppercase tracking-tight text-white">Community</h1>
          <p className="mt-3 text-sm sm:text-base font-semibold uppercase tracking-wide text-cyan-400">Events, challenges, and member highlights</p>
        </div>
      </section>

      {events.length > 0 && (
        <section className="container mx-auto px-4 pb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white">Upcoming Events</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (<EventCard key={e._id} evt={e} />))}
          </div>
        </section>
      )}

      {challenges.length > 0 && (
        <section className="container mx-auto px-4 pb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white">Challenges</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((c) => (<ChallengeCard key={c._id} ch={c} />))}
          </div>
        </section>
      )}

      {highlights.length > 0 && (
        <section className="container mx-auto px-4 pb-20">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white">Member Highlights</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((h) => (<HighlightCard key={h._id} h={h} />))}
          </div>
        </section>
      )}
    </div>
  );
}

