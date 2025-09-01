"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export const GalleryCarousel = ({
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
            className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-black/50 text-white hover:bg-black/60"
          >
            ‹
          </button>
          <button
            aria-label="Next image"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-black/50 text-white hover:bg-black/60"
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

