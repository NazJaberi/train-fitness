// src/components/home/DrinkCard.tsx
"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Drink } from "@/lib/dummyData";
import Image from "next/image";
import { useState } from "react";

type DrinkCardProps = {
  drink: Drink;
  onClick: () => void;
  isSelected: boolean;
};

export const DrinkCard = ({ drink, onClick, isSelected }: DrinkCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Define the three distinct animation states
  const animateState = isSelected ? "selected" : isHovered ? "hover" : "default";

  // Define variants for each image layer based on the state
  const cupVariants: Variants = {
    default: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
    selected: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  };

  const heroVariants: Variants = {
    default: { opacity: 0, y: 20, scale: 0.95 },
    hover: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, delay: 0.1 } },
    selected: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
  };

  const ingredientsVariants: Variants = {
    default: { opacity: 0, scale: 0.95 },
    hover: { opacity: 0, scale: 0.95 },
    selected: { opacity: 1, scale: 1.05, transition: { duration: 0.3, delay: 0.1 } },
  };

  const shadowVariants: Variants = {
    default: { opacity: 1, scale: 1 },
    hover: { opacity: 0.8, scale: 1.05 },
    selected: { opacity: 0.5, scale: 1.1 },
  };

  // Simplified variants for users who prefer reduced motion
  const reducedMotionVariants = (isVisible: boolean): Variants => ({
    default: { opacity: isVisible ? 1 : 0 },
    hover: { opacity: isVisible ? 1 : 0 },
    selected: { opacity: isVisible ? 1 : 0 },
  });

  return (
    <motion.div className="flex flex-col items-center justify-end h-96">
      <motion.button
        type="button"
        onClick={onClick}
        className="relative w-full cursor-pointer h-80 focus:outline-none"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        aria-pressed={isSelected}
      >
        {/* Layer 1: Shadow */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          variants={shadowVariants}
          animate={animateState}
        >
          <Image src={drink.images.shadow} alt="" fill style={{ objectFit: "contain" }} priority />
        </motion.div>

        {/* Layer 2: Cup Image (Default) */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          variants={shouldReduceMotion ? reducedMotionVariants(true) : cupVariants}
          animate={animateState}
        >
          <Image src={drink.images.cup} alt={drink.name} fill style={{ objectFit: "contain" }} priority />
        </motion.div>

        {/* Layer 3: Hero Image (Hover) */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none"
          variants={shouldReduceMotion ? reducedMotionVariants(false) : heroVariants}
          animate={animateState}
        >
          <Image src={drink.images.hero} alt="" fill style={{ objectFit: "contain" }} />
        </motion.div>

        {/* Layer 4: Ingredients Image (Selected) */}
        <motion.div
          className="absolute inset-0 z-40 pointer-events-none"
          variants={shouldReduceMotion ? reducedMotionVariants(false) : ingredientsVariants}
          animate={animateState}
        >
          <Image src={drink.images.ingredients} alt={`${drink.name} ingredients`} fill style={{ objectFit: "contain" }} />
        </motion.div>
      </motion.button>

      <h3 className="mt-4 text-lg font-bold text-center text-brandTextLight dark:text-brandTextDark">
        {drink.name}
      </h3>
    </motion.div>
  );
};

export default DrinkCard;