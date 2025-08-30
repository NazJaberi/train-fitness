// src/components/home/DrinkDetails.tsx
"use client";

import { Drink } from "@/lib/dummyData";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaBlender } from "react-icons/fa";

// Nutrition fact display
const NutritionFact = ({ value, unit, label }: { value: string; unit: string; label: string }) => (
  <div>
    <p className="text-2xl font-bold tracking-tight text-white md:text-3xl">
      {value}
      {unit && <span className="ml-1 text-base font-medium md:text-lg">{unit}</span>}
    </p>
    <p className="text-xs md:text-sm text-white/70">{label}</p>
  </div>
);

const BlendingAnimation = () => (
  <div className="flex flex-col items-center justify-center w-full gap-4 h-72 md:h-96 text-brandPrimary">
    <motion.div
      animate={{ rotate: [0, -20, 20, -20, 20, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <FaBlender size={40} />
    </motion.div>
    <p className="text-base font-bold md:text-lg">Blending...</p>
  </div>
);

export const DrinkDetails = ({ drink }: { drink: Drink }) => {
  const [isBlending, setIsBlending] = useState(true);
  const [activeSize, setActiveSize] = useState<"med" | "ori" | "jnr">("med");

  useEffect(() => {
    setIsBlending(true);
    const t = setTimeout(() => setIsBlending(false), 650);
    return () => clearTimeout(t);
  }, [drink]);

  if (!drink?.nutrition) return null;

  // Helper to split value+unit (e.g. "1110 kJ")
  const split = (raw: string) => {
    const m = raw.trim().match(/^([<>\d.,\s]+)\s*([A-Za-z%μ]+)?$/);
    if (!m) return { value: raw, unit: "" };
    return { value: m[1].trim(), unit: m[2] || "" };
  };

  return (
    <motion.div
      layout
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      className="col-span-1 overflow-hidden md:col-span-2 lg:col-span-4"
    >
      <div className="shadow-xl rounded-2xl bg-brandBgLight dark:bg-brandDark">
        <AnimatePresence mode="wait">
          {isBlending ? (
            <motion.div key="blending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BlendingAnimation />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* --- TOP SECTION --- */}
              <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8 md:flex-row md:items-start">
                {/* Text info */}
                <div className="w-full md:w-1/2">
                  <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-brandTextLight dark:text-brandTextDark">
                    {drink.name}
                  </h2>

                  <p className="mt-2 text-sm font-medium sm:text-base text-brandPrimary">
                    {drink.ingredients.join(", ")}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {drink.healthBenefits.map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-brandPrimary/10 text-brandPrimary ring-1 ring-brandPrimary/20"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Single final image (ingredients) */}
                <div className="relative w-full md:w-1/2">
                  <div className="relative w-full aspect-square">
                    <Image
                      src={drink.images.ingredients}
                      alt={`${drink.name} ingredients`}
                      fill
                      sizes="(max-width: 768px) 90vw, (max-width: 1280px) 40vw, 35vw"
                      priority
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>
              </div>

              {/* --- NUTRITION --- */}
              <div className="p-4 sm:p-6 md:p-8 bg-green-500/85">
                <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-sm font-extrabold tracking-wider text-white sm:text-base">SERVING SIZE</h3>
                  <div className="inline-flex p-1 rounded-md bg-white/10">
                    {(["ori", "med", "jnr"] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setActiveSize(size)}
                        className={`px-3 py-1.5 text-xs sm:text-sm rounded-md font-bold transition ${
                          activeSize === size
                            ? "bg-white text-green-700 shadow"
                            : "text-white/80 hover:bg-white/15"
                        }`}
                      >
                        {drink.nutrition.servingSize[size]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 text-center sm:grid-cols-3 md:grid-cols-4 gap-y-6 gap-x-4">
                  <NutritionFact {...split(drink.nutrition.energy)} label={`Energy (${drink.nutrition.energy_cal})`} />
                  <NutritionFact {...split(drink.nutrition.protein)} label="Protein" />
                  <NutritionFact {...split(drink.nutrition.fatTotal)} label="Fat, total" />
                  <NutritionFact {...split(drink.nutrition.fatSaturated)} label="Fat - saturated" />
                  <NutritionFact {...split(drink.nutrition.carbohydrate)} label="Carbohydrate" />
                  <NutritionFact {...split(drink.nutrition.sugars)} label="Carbohydrate - sugars" />
                  <NutritionFact {...split(drink.nutrition.dietaryFibre)} label="Dietary fibre, total" />
                  <NutritionFact {...split(drink.nutrition.sodium)} label="Sodium" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
