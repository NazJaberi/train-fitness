// src/components/community/Cards.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { CommunityEvent, CommunityChallenge, MemberHighlight } from "@/features/community/types";
import { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-sm leading-6 text-white/90">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="ml-5 list-disc space-y-1 text-sm text-white/90">{children}</ul>,
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} className="text-cyan-400 underline underline-offset-4 hover:text-cyan-300" target={value?.href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{children}</a>
    )
  }
};

export function EventCard({ evt }: { evt: CommunityEvent }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.article initial={{opacity:0, y:16}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:.35}}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl hover:bg-white/10 transition-colors">
      <div className="relative h-44 w-full">
        {evt.imageUrl ? (
          <Image src={evt.imageUrl} alt={evt.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="h-full w-full bg-white/5" />
        )}
        <div className="absolute left-3 top-3 rounded-md bg-cyan-500 px-2 py-1 text-[11px] font-bold uppercase text-black shadow">Event</div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-extrabold text-white">{evt.title}</h3>
        <p className="mt-1 text-xs text-white/70">{formatDateRange(evt.startDate, evt.endDate)}{evt.location ? ` • ${evt.location}` : ''}</p>
        {evt.summary && <p className="mt-2 line-clamp-3 text-sm text-white/80">{evt.summary}</p>}
        <div className="mt-3 flex gap-2">
          {evt.ctaHref && (
            <Link href={evt.ctaHref} className="rounded-full bg-cyan-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-400">{evt.ctaLabel ?? 'Join'}</Link>
          )}
          <button onClick={() => setOpen(true)} className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10">Details</button>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="max-h-[75vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-black p-6 shadow-2xl">
          <div className="relative h-48 w-full overflow-hidden rounded-xl">
            {evt.imageUrl && <Image src={evt.imageUrl} alt={evt.title} fill className="object-cover" />}
            <div className="absolute left-3 top-3 rounded-md bg-cyan-500 px-2 py-1 text-[11px] font-bold uppercase text-black">Event</div>
          </div>
          <h3 className="mt-4 text-2xl font-extrabold text-white">{evt.title}</h3>
          <p className="mt-1 text-xs text-white/70">{formatDateRange(evt.startDate, evt.endDate)}{evt.location ? ` • ${evt.location}` : ''}</p>
          {evt.description ? (
            <div className="prose mt-4 max-w-none prose-invert">
              <PortableText value={evt.description} components={ptComponents} />
            </div>
          ) : evt.summary ? (
            <p className="mt-4 text-white/80">{evt.summary}</p>
          ) : null}
          <div className="mt-5 text-right">
            <button onClick={() => setOpen(false)} className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/15">Close</button>
          </div>
        </div>
      </Modal>
    </motion.article>
  );
}

export function ChallengeCard({ ch }: { ch: CommunityChallenge }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.article initial={{opacity:0, y:16}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:.35}}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl hover:bg-white/10 transition-colors">
      <div className="relative h-44 w-full">
        {ch.imageUrl ? (
          <Image src={ch.imageUrl} alt={ch.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
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
          <button onClick={() => setOpen(true)} className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10">Details</button>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="max-h-[75vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-black p-6 shadow-2xl">
          <div className="relative h-48 w-full overflow-hidden rounded-xl">
            {ch.imageUrl && <Image src={ch.imageUrl} alt={ch.title} fill className="object-cover" />}
            <div className="absolute left-3 top-3 rounded-md bg-white/10 px-2 py-1 text-[11px] font-bold uppercase text-white">Challenge</div>
          </div>
          <h3 className="mt-4 text-2xl font-extrabold text-white">{ch.title}</h3>
          <p className="mt-1 text-xs text-white/70">{formatDateRange(ch.startDate, ch.endDate)}{ch.reward ? ` • ${ch.reward}` : ''}</p>
          {ch.rules ? (
            <div className="prose mt-4 max-w-none prose-invert">
              <PortableText value={ch.rules} components={ptComponents} />
            </div>
          ) : ch.summary ? (
            <p className="mt-4 text-white/80">{ch.summary}</p>
          ) : null}
          <div className="mt-5 text-right">
            <button onClick={() => setOpen(false)} className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/15">Close</button>
          </div>
        </div>
      </Modal>
    </motion.article>
  );
}

export function HighlightCard({ h }: { h: MemberHighlight }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.article initial={{opacity:0, y:16}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:.35}}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl hover:bg-white/10 transition-colors">
      <div className="relative h-44 w-full">
        {h.photoUrl ? (
          <Image src={h.photoUrl} alt={h.memberName} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="h-full w-full bg-white/5" />
        )}
        <div className="absolute left-3 top-3 rounded-md bg-white/10 px-2 py-1 text-[11px] font-bold uppercase text-white">Member</div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-extrabold text-white">{h.memberName}</h3>
        {h.headline && <p className="mt-1 text-sm text-white/80">{h.headline}</p>}
        <div className="mt-3">
          <button onClick={() => setOpen(true)} className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10">Read More</button>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="max-h-[75vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-black p-6 shadow-2xl">
          <div className="relative h-48 w-full overflow-hidden rounded-xl">
            {h.photoUrl && <Image src={h.photoUrl} alt={h.memberName} fill className="object-cover" />}
            <div className="absolute left-3 top-3 rounded-md bg-white/10 px-2 py-1 text-[11px] font-bold uppercase text-white">Member</div>
          </div>
          <h3 className="mt-4 text-2xl font-extrabold text-white">{h.memberName}</h3>
          {h.headline && <p className="mt-1 text-sm text-white/80">{h.headline}</p>}
          {h.story ? (
            <div className="prose mt-4 max-w-none prose-invert">
              <PortableText value={h.story} components={ptComponents} />
            </div>
          ) : null}
          <div className="mt-5 text-right">
            <button onClick={() => setOpen(false)} className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/15">Close</button>
          </div>
        </div>
      </Modal>
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
