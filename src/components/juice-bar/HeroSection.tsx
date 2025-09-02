// src/components/home/HeroSection.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type HeroSectionProps = {
  onExploreClick: () => void;
};

const HeroSection = ({ onExploreClick }: HeroSectionProps) => {
  return (
    // The main section now takes the full screen height and uses flexbox
    <section className="relative flex w-full min-h-screen flex-col md:flex-row bg-black">
      {/* Left Side: Text Content (takes full width on mobile, half on desktop) */}
      <div className="flex items-center justify-center w-full p-8 md:w-1/2 md:p-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl text-center md:text-left"
        >
          <h1 className="text-5xl font-extrabold leading-tight lg:text-7xl text-white">
            Taste the <span className="text-cyan-400">Freshness</span>,
            <br />
            Feel the <span className="text-cyan-500">Boost</span>.
          </h1>
          <p className="mt-6 text-lg text-white/80">
            Discover vibrant, delicious, and healthy smoothies made from 100% natural ingredients. Your daily dose of goodness is just a sip away.
          </p>
          <motion.button
            onClick={onExploreClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 rounded-full bg-cyan-500 px-8 py-3 text-lg font-bold text-black shadow-lg transition-all duration-300 hover:bg-cyan-400"
          >
            Explore Drinks
          </motion.button>
        </motion.div>
      </div>

      {/* Right Side: Image (takes full width on mobile, half on desktop and fills it completely) */}
      <div className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-screen">
        <Image 
          src="https://images.pexels.com/photos/109275/pexels-photo-109275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Colorful smoothies"
          fill
          className="object-cover"
          priority // Tells Next.js to load this image first
        />
        {/* Dark overlay + cyan glow accents */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/60 to-black/70" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 -right-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />
          <div className="absolute bottom-10 right-1/4 h-56 w-56 rounded-full bg-cyan-400/10 blur-[120px]" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
