"use client";

import { PropsWithChildren, useEffect, useRef, useState } from "react";

export function FadeIn({ children, delay = 0 }: PropsWithChildren<{ delay?: number }>) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setTimeout(() => setV(true), delay * 1000);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: v ? 1 : 0,
        transform: v ? "translateY(0)" : "translateY(8px)",
        transition: "opacity .35s ease, transform .35s ease",
      }}
    >
      {children}
    </div>
  );
}

