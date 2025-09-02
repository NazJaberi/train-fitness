// src/components/faq/Accordion.tsx
"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

type AccordionProps = {
  question: string;
  answer: any;
};

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-sm leading-7 text-white/90">{children}</p>
    ),
    h3: ({ children }) => (
      <h3 className="mt-4 text-lg font-bold text-white">{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="ml-5 list-disc space-y-1 text-sm text-white/90">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="ml-5 list-decimal space-y-1 text-sm text-white/90">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-extrabold text-white">{children}</strong>,
    em: ({ children }) => <em className="text-white/90">{children}</em>,
    link: ({ value, children }) => (
      <a href={value?.href} className="font-semibold text-cyan-400 underline underline-offset-4 hover:text-cyan-300" target={value?.href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
        {children}
      </a>
    ),
  },
};

export const Accordion = ({ question, answer }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 shadow-sm transition-colors hover:bg-white/[0.07]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-6 py-3 text-left"
        aria-expanded={isOpen}
        aria-controls={`sect-${id}`}
      >
        <h3 className="text-base font-bold leading-6 text-white">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="grid h-7 w-7 place-items-center rounded-full border border-cyan-500/40 text-lg text-cyan-400"
        >
          +
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`sect-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4 pl-1 pr-2">
              <PortableText value={answer} components={components} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
