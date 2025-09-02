// src/components/pricing/PricingCard.tsx
"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { PricingPlan } from "@/features/pricing/types";
import { useState } from "react";

const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-sm leading-6 text-white/80">{children}</p>
    )
  },
  list: {
    bullet: ({ children }) => (
      <ul className="ml-5 list-disc space-y-1 text-sm text-white/80">{children}</ul>
    )
  }
};

export function PricingCard({ plan }: { plan: PricingPlan }) {
  const highlighted = Boolean(plan.highlight);
  const hasOptions = Array.isArray(plan.options) && plan.options.length > 0;
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className={`relative rounded-3xl border p-6 shadow-xl ${
        highlighted ? 'border-cyan-500 bg-white/10' : 'border-white/10 bg-white/5'
      }`}
    >
      {plan.savingsText && (
        <div className="absolute right-4 top-4 rounded-full bg-cyan-500 px-3 py-1 text-[11px] font-bold uppercase text-black">
          {plan.savingsText}
        </div>
      )}
      <div className="text-xs font-bold uppercase tracking-wider text-white/60">{labelForCategory(plan.category)}</div>
      <h3 className="mt-1 text-2xl font-extrabold uppercase tracking-wide text-white">{plan.name}</h3>
      {!hasOptions && plan.price != null && (
        <div className="mt-4 flex items-end gap-2 text-white">
          <div className="text-4xl font-extrabold text-cyan-400">
            {formatCurrency(plan.price!, plan.currency ?? 'BHD')}
          </div>
          {plan.billingPeriod && (
            <div className="pb-1 text-xs uppercase tracking-wider text-white/70">{plan.billingPeriod}</div>
          )}
        </div>
      )}

      {hasOptions && (
        <div className="mt-4 space-y-2">
          {plan.options!.map((opt) => (
            <div key={opt.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white">
              <div>
                <div className="text-sm font-bold uppercase tracking-wide">{opt.label}</div>
                {opt.note && <div className="text-xs text-white/70">{opt.note}</div>}
              </div>
              <div className="text-lg font-extrabold text-cyan-400">{formatCurrency(opt.price, opt.currency ?? plan.currency ?? 'BHD')}</div>
            </div>
          ))}
        </div>
      )}

      {plan.features && plan.features.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm text-white/90">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex items-center gap-3">
        {plan.ctaHref ? (
          <Link href={plan.ctaHref} className={`inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-bold uppercase tracking-wider ${
            highlighted ? 'bg-cyan-500 text-black hover:bg-cyan-400' : 'bg-white/10 text-white hover:bg-white/15'
          }`}>
            {plan.ctaLabel ?? 'Choose Plan'}
          </Link>
        ) : (
          <span className="inline-flex h-11 items-center justify-center rounded-full bg-white/10 px-5 text-sm font-bold uppercase tracking-wider text-white opacity-70">
            {plan.ctaLabel ?? 'Choose Plan'}
          </span>
        )}
        {(plan.description || (plan.features && plan.features.length > 0)) && (
          <button onClick={() => setOpen(true)} className="h-11 rounded-full border border-white/20 px-5 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10">
            More Info
          </button>
        )}
      </div>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="max-h-[75vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-black p-6 shadow-2xl">
          <h3 className="text-2xl font-extrabold uppercase tracking-wide text-white">{plan.name}</h3>
          <div className="mt-1 text-xs font-bold uppercase tracking-wider text-white/60">{labelForCategory(plan.category)}</div>
          {plan.description && (
            <div className="prose mt-4 max-w-none prose-invert">
              <PortableText value={plan.description} components={ptComponents} />
            </div>
          )}
          {plan.features && plan.features.length > 0 && (
            <ul className="mt-4 space-y-2 text-sm text-white/90">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 text-right">
            <button onClick={() => setOpen(false)} className="rounded-full bg-white/10 px-5 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/15">Close</button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

function labelForCategory(category: PricingPlan['category']): string {
  switch (category) {
    case 'gym':
      return 'Regular Gym';
    case 'classes':
      return 'Classes';
    case 'pt':
      return 'Personal Training';
    case 'bundles':
      return 'Bundles & Offers';
    default:
      return 'Plan';
  }
}

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

// Simple modal component
import { createPortal } from 'react-dom';
import { useEffect, useState as useReactState } from 'react';

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  const [mounted, setMounted] = useReactState(false);
  useEffect(() => {
    setMounted(true);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open || !mounted) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-[92vw] max-w-2xl">{children}</div>
    </div>,
    document.body
  );
}
