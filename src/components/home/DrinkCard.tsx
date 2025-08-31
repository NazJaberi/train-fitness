// juice-bar-website/src/components/home/DrinkCard.tsx

"use client";

import {
  motion,
  useReducedMotion,
  useInView,
  type Variants,
  type Transition,
} from "framer-motion";
import { Drink } from "@/lib/dummyData";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

// --- Timings & Easing (slowed down) ---
const generalEase = [0.25, 0.1, 0.25, 1] as const;
const heroPopEase = [0.22, 1, 0.36, 1] as const;

const generalTransition: Transition = { duration: 0.36, ease: generalEase };
const popTransition: Transition = { duration: 0.38, ease: heroPopEase, delay: 0.3 }; // hero enters later
const revealTransition: Transition = { duration: 0.3 };

// --- Main Component ---
type DrinkCardProps = {
  drink: Drink;
  onClick: () => void;
  isSelected: boolean;
};

export const DrinkCard = ({ drink, onClick, isSelected }: DrinkCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Use IntersectionObserver with a higher threshold so hero waits until card is mostly visible
  const cardRef = useRef<HTMLButtonElement | null>(null);
  const inView = useInView(cardRef, { amount: 0.7, margin: "0px 0px -10% 0px", once: true });
  const shouldReduceMotion = useReducedMotion();

  // State C is triggered by hover or selection
  const isRevealed = isHovered || isSelected;

  // --- Animation States ---
  // A: rest (cup + shadow only)
  // B: inView (hero pops in, cup lifts a touch)
  // C: reveal (ingredients take over; others fade)
  const shadowVariants: Variants = {
    rest: { scale: 1, opacity: 1 },
    inView: { scale: 1.05, opacity: 0.88, transition: generalTransition },
    reveal: { scale: 0.98, opacity: 0, transition: revealTransition },
  };

  const cupVariants: Variants = {
    rest: { scale: 1, y: 0, opacity: 1 },
    inView: { scale: 1.03, y: -4, opacity: 1, transition: generalTransition },
    reveal: { scale: 0.98, opacity: 0, transition: revealTransition },
  };

  const heroVariants: Variants = {
    rest: { opacity: 0, scale: 0.95, y: 10, rotate: 0 },
    inView: { opacity: 1, scale: 1, y: -6, rotate: -2, transition: popTransition },
    reveal: { scale: 0.98, opacity: 0, transition: revealTransition },
  };

  const ingredientsVariants: Variants = {
    rest: { opacity: 0 },
    inView: { opacity: 0 },
    reveal: { opacity: 1, scale: 1.02, y: 0, transition: { ...revealTransition, delay: 0.05 } },
  };

  // Reduced motion = opacity-only
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

  // Decide state without relying on intermediate state setters
  const layerState: "rest" | "inView" | "reveal" = isRevealed ? "reveal" : inView ? "inView" : "rest";

  return (
    <motion.div className="flex flex-col items-center justify-end h-96">
      {/* Entire card interactive and focusable */}
      <motion.button
        ref={cardRef}
        type="button"
        onClick={onClick}
        className="relative w-full cursor-pointer h-80 focus:outline-none"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        aria-pressed={isSelected}
        // Let Framer handle in-view internally too (safety if IntersectionObserver fallback)
        initial="rest"
        whileInView="inView"
        viewport={{ amount: 0.7, once: true }}
      >
        {/* Shadow (z-10) */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          variants={shouldReduceMotion ? reducedMotionVariants : shadowVariants}
          animate={layerState}
        >
          <Image
            src={drink.images.shadow || "/placeholder-shadow.png"}
            alt=""
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </motion.div>

        {/* Cup (z-20) */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          variants={shouldReduceMotion ? reducedMotionVariants : cupVariants}
          animate={layerState}
        >
          <Image
            src={drink.images.cup}
            alt={drink.name}
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </motion.div>

        {/* Hero (z-30) */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none"
          variants={shouldReduceMotion ? reducedMotionVariants : heroVariants}
          animate={layerState}
        >
          <Image
            src={drink.images.hero || "/placeholder-hero.png"}
            alt=""
            fill
            style={{ objectFit: "contain" }}
          />
        </motion.div>

        {/* Ingredients (z-40) */}
        <motion.div
          className="absolute inset-0 z-40 pointer-events-none"
          variants={shouldReduceMotion ? reducedIngredientsVariants : ingredientsVariants}
          animate={layerState}
          style={{ willChange: "transform, opacity" }}
        >
          <Image
            src={drink.images.ingredients || "/placeholder-ingredients.png"}
            alt={`${drink.name} ingredients`}
            fill
            style={{ objectFit: "contain" }}
          />
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
