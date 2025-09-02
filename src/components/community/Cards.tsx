// src/components/community/Cards.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { CommunityEvent, CommunityChallenge, MemberHighlight } from "@/features/community/types";

export function EventCard({ evt }: { evt: CommunityEvent }) {
  return (
    <motion.article initial={{opacity:0, y:16}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:.35}}
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl">
      <div className="relative h-44 w-full">
        {evt.imageUrl ? (
          <Image src={evt.imageUrl} alt={evt.title} fill className="object-cover" />
        ) : (
          <div className="h-full w-full bg-white/5" />
        )}
        <div className="absolute left-3 top-3 rounded-md bg-cyan-500 px-2 py-1 text-[11px] font-bold uppercase text-black">Event</div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-extrabold text-white">{evt.title}</h3>
        <p className="mt-1 text-xs text-white/70">{formatDateRange(evt.startDate, evt.endDate)}{evt.location ? ` • ${evt.location}` : ''}</p>
        {evt.summary && <p className="mt-2 line-clamp-3 text-sm text-white/80">{evt.summary}</p>}
        <div className="mt-3 flex gap-2">
          {evt.ctaHref && (
            <Link href={evt.ctaHref} className="rounded-full bg-cyan-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-400">{evt.ctaLabel ?? 'Join'}</Link>
          )}
          {evt.slug && (
            <Link href={`/community/events/${evt.slug}`} className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10">Details</Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function ChallengeCard({ ch }: { ch: CommunityChallenge }) {
  return (
    <motion.article initial={{opacity:0, y:16}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:.35}}
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl">
      <div className="relative h-44 w-full">
        {ch.imageUrl ? (
          <Image src={ch.imageUrl} alt={ch.title} fill className="object-cover" />
        ) : (
          <div className="h-full w-full bg-white/5" />
        )}
        <div className="absolute left-3 top-3 rounded-md bg-white/10 px-2 py-1 text-[11px] font-bold uppercase text-white">Challenge</div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-extrabold text-white">{ch.title}</h3>
        <p className="mt-1 text-xs text-white/70">{formatDateRange(ch.startDate, ch.endDate)}{ch.reward ? ` • ${ch.reward}` : ''}</p>
        {ch.summary && <p className="mt-2 line-clamp-3 text-sm text-white/80">{ch.summary}</p>}
        <div className="mt-3 flex gap-2">
          {ch.ctaHref && (
            <Link href={ch.ctaHref} className="rounded-full bg-cyan-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-400">{ch.ctaLabel ?? 'Join'}</Link>
          )}
          {ch.slug && (
            <Link href={`/community/challenges/${ch.slug}`} className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10">Details</Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function HighlightCard({ h }: { h: MemberHighlight }) {
  return (
    <motion.article initial={{opacity:0, y:16}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:.35}}
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl">
      <div className="relative h-44 w-full">
        {h.photoUrl ? (
          <Image src={h.photoUrl} alt={h.memberName} fill className="object-cover" />
        ) : (
          <div className="h-full w-full bg-white/5" />
        )}
        <div className="absolute left-3 top-3 rounded-md bg-white/10 px-2 py-1 text-[11px] font-bold uppercase text-white">Member</div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-extrabold text-white">{h.memberName}</h3>
        {h.headline && <p className="mt-1 text-sm text-white/80">{h.headline}</p>}
        {h.slug && (
          <div className="mt-3">
            <Link href={`/community/members/${h.slug}`} className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10">Read More</Link>
          </div>
        )}
      </div>
    </motion.article>
  );
}

function formatDateRange(start?: string, end?: string) {
  if (!start) return '';
  try {
    const s = new Date(start);
    const e = end ? new Date(end) : undefined;
    const sFmt = s.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (!e) return sFmt;
    const eFmt = e.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return `${sFmt} – ${eFmt}`;
  } catch {
    return start;
  }
}

