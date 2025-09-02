// src/app/tour/page.tsx
"use client";

import { useState } from "react";

const TOUR_URL = "https://trainfitness.s3.me-south-1.amazonaws.com/index.htm";

export default function TourPage() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <section className="container mx-auto px-4 pt-16 pb-4 sm:pt-20">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold uppercase tracking-tight text-white">VR Tour</h1>
          <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-cyan-400">Explore TRAIN FITNESS in 360°</p>
        </div>
      </section>

      {/* 360 Viewer */}
      <section className="container mx-auto px-4 pb-10">
        <div className="relative w-full rounded-2xl border border-white/10 bg-black shadow-xl">
          {/* Responsive height: taller on desktop, optimized for mobile */}
          <div className="relative w-full overflow-hidden rounded-2xl h-[70vh] sm:h-[calc(100vh-140px)]">
            {!failed ? (
              <iframe
                src={TOUR_URL}
                className="absolute inset-0 h-full w-full"
                allow="fullscreen; xr-spatial-tracking; autoplay"
                allowFullScreen
                loading="eager"
                onError={() => setFailed(true)}
                title="TRAIN FITNESS Virtual Tour"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center p-6 text-center">
                <div>
                  <p className="text-white/80">We couldn't load the tour in an embedded view.</p>
                  <a
                    href={TOUR_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex rounded-full bg-cyan-500 px-5 py-2 font-bold text-black hover:bg-cyan-400"
                  >
                    Open Tour in New Tab
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-white/50">
          Tip: Use your mouse or touch to look around. Click the fullscreen icon for the best experience.
        </p>
      </section>
    </div>
  );
}
