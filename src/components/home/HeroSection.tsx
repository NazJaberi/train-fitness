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
    <section className="relative flex flex-col w-full min-h-screen md:flex-row bg-brandBgLight dark:bg-brandBgDark">
      {/* Left Side: Text Content (takes full width on mobile, half on desktop) */}
      <div className="flex items-center justify-center w-full p-8 md:w-1/2 md:p-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl text-center md:text-left"
        >
          <h1 className="text-5xl font-extrabold leading-tight lg:text-7xl text-brandTextLight dark:text-brandTextDark">
            Taste the <span className="text-brandPrimary">Freshness</span>,
            <br />
            Feel the <span className="text-brandAccent">Boost</span>.
          </h1>
          <p className="mt-6 text-lg text-gray-500 dark:text-gray-400">
            Discover vibrant, delicious, and healthy smoothies made from 100% natural ingredients. Your daily dose of goodness is just a sip away.
          </p>
          <motion.button
            onClick={onExploreClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 mt-8 text-lg font-bold text-white transition-all duration-300 rounded-full shadow-lg bg-brandPrimary hover:bg-brandAccent hover:text-brandDark"
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
        {/* Optional: Add a subtle overlay to the image */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
    </section>
  );
};

export default HeroSection;