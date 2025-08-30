// src/components/home/DrinkCard.tsx
"use client";

import {
  motion,
  useReducedMotion,
  type Variants,
  type Transition,
} from "framer-motion";
import { Drink } from "@/lib/dummyData";
import Image from "next/image";
import { useState } from "react";

// --- Part 4: Timings & Easing (typed) ---
const generalEase = [0.25, 0.1, 0.25, 1] as const; // tuple, not number[]
const heroPopEase = [0.22, 1, 0.36, 1] as const;

const generalTransition: Transition = { duration: 0.26, ease: generalEase };
const popTransition: Transition = { duration: 0.26, ease: heroPopEase };
const revealTransition: Transition = { duration: 0.28 };

// --- Main Component ---
type DrinkCardProps = {
  drink: Drink;
  onClick: () => void;
  isSelected: boolean;
};

export const DrinkCard = ({ drink, onClick, isSelected }: DrinkCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // State C is triggered by hover or selection
  const isRevealed = isHovered || isSelected;

  // --- Part 3: Animation States (A, B, C) defined as variants ---
  const shadowVariants: Variants = {
    rest: { scale: 1, opacity: 1 },
    inView: { scale: 1.06, opacity: 0.85, transition: generalTransition },
    reveal: { scale: 0.98, opacity: 0, transition: revealTransition },
  };

  const cupVariants: Variants = {
    rest: { scale: 1, y: 0 },
    inView: { scale: 1.04, y: -4, transition: { duration: 0.22, ease: generalEase } },
    reveal: { scale: 0.98, opacity: 0, transition: revealTransition },
  };

  const heroVariants: Variants = {
    rest: { opacity: 0, scale: 0.95, y: 8, rotate: 0 },
    inView: { opacity: 1, scale: 1, y: -8, rotate: -2, transition: { ...popTransition, delay: 0.07 } },
    reveal: { scale: 0.98, opacity: 0, transition: revealTransition },
  };

  const ingredientsVariants: Variants = {
    rest: { opacity: 0 },
    inView: { opacity: 0 },
    reveal: { opacity: 1, scale: 1.02, y: 0, transition: { ...revealTransition, delay: 0.05 } },
  };

  // Variants for users who prefer reduced motion (opacity-only)
  const reducedMotionVariants: Variants = {
    rest: { opacity: 1 },
    inView: { opacity: 1 },
    reveal: { opacity: 0 },
  };
  const reducedIngredientsVariants: Variants = {
    rest: { opacity: 0 },
    inView: { opacity: 0 },
    reveal: { opacity: 1 },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-end h-96"
      onViewportEnter={() => setIsInView(true)}
    >
      {/* Make the entire card interactive and focusable */}
      <motion.button
        onClick={onClick}
        className="relative w-full cursor-pointer h-80 focus:outline-none"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        aria-pressed={isSelected}
      >
        {/* Shadow Image (z-10) */}
        <motion.div
          className="absolute inset-0 z-10"
          variants={shouldReduceMotion ? reducedMotionVariants : shadowVariants}
          initial="rest"
          animate={isRevealed ? "reveal" : isInView ? "inView" : "rest"}
        >
          <Image src={drink.images.shadow} alt="" fill style={{ objectFit: "contain" }} priority />
        </motion.div>

        {/* Cup Image (z-20) */}
        <motion.div
          className="absolute inset-0 z-20"
          variants={shouldReduceMotion ? reducedMotionVariants : cupVariants}
          initial="rest"
          animate={isRevealed ? "reveal" : isInView ? "inView" : "rest"}
        >
          <Image src={drink.images.cup} alt={drink.name} fill style={{ objectFit: "contain" }} priority />
        </motion.div>

        {/* Hero Image (z-30) */}
        <motion.div
          className="absolute inset-0 z-30"
          variants={shouldReduceMotion ? reducedMotionVariants : heroVariants}
          initial="rest"
          animate={isRevealed ? "reveal" : isInView ? "inView" : "rest"}
        >
          <Image src={drink.images.hero} alt="" fill style={{ objectFit: "contain" }} />
        </motion.div>

        {/* Ingredients Image (z-40) */}
        <motion.div
          className="absolute inset-0 z-40"
          variants={shouldReduceMotion ? reducedIngredientsVariants : ingredientsVariants}
          initial="rest"
          animate={isRevealed ? "reveal" : isInView ? "inView" : "rest"}
          style={{ willChange: "transform, opacity" }}
        >
          <Image src={drink.images.ingredients} alt={`${drink.name} ingredients`} fill style={{ objectFit: "contain" }} />
        </motion.div>
      </motion.button>

      {/* Drink Name */}
      <h3 className="mt-4 text-lg font-bold text-center text-brandTextLight dark:text-brandTextDark">
        {drink.name}
      </h3>
    </motion.div>
  );
};

export default DrinkCard;
