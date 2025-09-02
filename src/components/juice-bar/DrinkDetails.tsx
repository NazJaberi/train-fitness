"use client";

import { Drink, NutritionInfo } from "@/lib/dummyData";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaBlender } from "react-icons/fa";

// (NutritionFact and BlendingAnimation components are unchanged)
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

  // --- THIS IS THE FIX ---
  // The state now defaults to the FIRST nutrition entry from the Sanity data array.
  const [activeNutrition, setActiveNutrition] = useState<NutritionInfo | undefined>(
    drink.nutritionByServingSize?.[0]
  );

  useEffect(() => {
    setIsBlending(true);
    // Also update the default when the drink itself changes.
    setActiveNutrition(drink.nutritionByServingSize?.[0]);
    const t = setTimeout(() => setIsBlending(false), 650);
    return () => clearTimeout(t);
  }, [drink]);
  
  // (The rest of the component is the same as your latest version)

  if (!drink?.nutritionByServingSize) return null;

  const split = (raw: string = "") => {
    const m = raw.trim().match(/^([<>\d.,\s]+)\s*([A-Za-z%μ]+)?$/);
    if (!m) return { value: raw, unit: "" };
    return { value: m[1].trim(), unit: m[2] || "" };
  };

  const handleSizeChange = (sizeString: string) => {
    const newNutrition = drink.nutritionByServingSize.find(n => n.servingSize === sizeString);
    setActiveNutrition(newNutrition);
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
      <div className="rounded-2xl border border-white/10 bg-white/5 shadow-xl">
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
                <div className="w-full md:w-1/2">
                  <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                    {drink.name}
                  </h2>
                  <p className="mt-2 text-sm font-medium text-cyan-400 sm:text-base">
                    {drink.ingredients?.join(", ")}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {drink.healthBenefits?.map((b) => (
                      <span key={b} className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/10">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative w-full md:w-1/2">
                  <div className="relative w-full aspect-square">
                    <Image
                      src={drink.images.ingredients || "/placeholder-ingredients.png"}
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
              {activeNutrition && (
                <div className="p-4 sm:p-6 md:p-8 border border-cyan-500/20 bg-white/5 rounded-2xl">
                  <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-sm font-extrabold tracking-wider text-white sm:text-base">SERVING SIZE</h3>
                    <div className="inline-flex rounded-md bg-white/10 p-1">
                      {drink.nutritionByServingSize.map((n) => (
                        <button
                          key={n.servingSize}
                          onClick={() => handleSizeChange(n.servingSize)}
                          className={`px-3 py-1.5 text-xs sm:text-sm rounded-md font-bold transition ${
                            activeNutrition.servingSize === n.servingSize
                              ? "bg-white text-cyan-700 shadow"
                              : "text-white/80 hover:bg-white/15"
                          }`}
                        >
                          {n.servingSize}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-center sm:grid-cols-3 md:grid-cols-4">
                    <NutritionFact {...split(activeNutrition.energy)} label={`Energy (${activeNutrition.energy_cal})`} />
                    <NutritionFact {...split(activeNutrition.protein)} label="Protein" />
                    <NutritionFact {...split(activeNutrition.fatTotal)} label="Fat, total" />
                    <NutritionFact {...split(activeNutrition.fatSaturated)} label="Fat - saturated" />
                    <NutritionFact {...split(activeNutrition.carbohydrate)} label="Carbohydrate" />
                    <NutritionFact {...split(activeNutrition.sugars)} label="Carbohydrate - sugars" />
                    <NutritionFact {...split(activeNutrition.dietaryFibre)} label="Dietary fibre, total" />
                    <NutritionFact {...split(activeNutrition.sodium)} label="Sodium" />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
