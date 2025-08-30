// src/components/home/DrinkDetails.tsx
"use client";

import { Drink } from "@/lib/dummyData";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaBlender } from 'react-icons/fa';

// Helper component for displaying nutrition facts
const NutritionFact = ({ value, unit, label }: { value: string; unit: string; label: string }) => (
  <div>
    <p className="text-3xl font-bold tracking-tighter text-white">
      {value}
      <span className="ml-1 text-lg font-medium">{unit}</span>
    </p>
    <p className="text-sm text-white/70">{label}</p>
  </div>
);

// The full Blending Animation component
const BlendingAnimation = () => (
    <div className="flex flex-col items-center justify-center w-full gap-4 h-96 text-brandPrimary">
        <motion.div
            animate={{ rotate: [0, -20, 20, -20, 20, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        >
            <FaBlender size={48} />
        </motion.div>
        <p className="text-lg font-bold">Blending...</p>
    </div>
);


export const DrinkDetails = ({ drink }: { drink: Drink }) => {
  const [isBlending, setIsBlending] = useState(true);
  const [activeSize, setActiveSize] = useState<'med' | 'ori' | 'jnr'>('med');

  useEffect(() => {
    setIsBlending(true);
    const timer = setTimeout(() => setIsBlending(false), 750);
    return () => clearTimeout(timer);
  }, [drink]);

  // Ensure drink and nutrition data exist before rendering
  if (!drink?.nutrition) {
    return null; // or a fallback UI
  }

  return (
    <motion.div
      layout
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="col-span-1 overflow-hidden md:col-span-2 lg:col-span-4"
    >
      <div className="shadow-xl bg-brandBgLight dark:bg-brandDark rounded-2xl">
        <AnimatePresence mode="wait">
          {isBlending ? (
            <motion.div key="blending">
              <BlendingAnimation />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* --- TOP SECTION --- */}
              <div className="flex flex-col items-center gap-8 p-8 md:flex-row">
                <div className="w-full md:w-1/2">
                  <h2 className="text-5xl font-extrabold tracking-tight text-brandTextLight dark:text-brandTextDark">{drink.name}</h2>
                  <p className="mt-2 text-lg font-medium text-brandPrimary">{drink.ingredients.join(', ')}</p>
                  <div className="flex gap-4 mt-6">
                    {drink.healthBenefits.map(benefit => (
                      <span key={benefit} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative w-full h-64 md:w-1/2 md:h-80">
                  <Image src={drink.images.hero} alt={drink.name} fill style={{ objectFit: 'contain' }} />
                </div>
              </div>

              {/* --- BOTTOM NUTRITION SECTION --- */}
              <div className="p-8 bg-green-500/80">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold tracking-wider text-white">SERVING SIZE</h3>
                    <div className="flex gap-2">
                        {(['ori', 'med', 'jnr'] as const).map(size => (
                            <button 
                                key={size}
                                onClick={() => setActiveSize(size)}
                                className={`px-3 py-1 text-sm rounded-md font-bold transition-colors ${activeSize === size ? 'bg-white text-green-600' : 'bg-transparent text-white/70 hover:bg-white/20'}`}
                            >
                                {drink.nutrition.servingSize[size]}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 text-center md:grid-cols-4 gap-y-6 gap-x-4">
                    <NutritionFact value={drink.nutrition.energy} unit="" label={`(${drink.nutrition.energy_cal}) Energy`} />
                    <NutritionFact value={drink.nutrition.fatTotal} unit="g" label="Fat, total" />
                    <NutritionFact value={drink.nutrition.carbohydrate} unit="g" label="Carbohydrate" />
                    <NutritionFact value={drink.nutrition.dietaryFibre} unit="g" label="Dietary fibre, total" />
                    <NutritionFact value={drink.nutrition.protein} unit="g" label="Protein" />
                    <NutritionFact value={drink.nutrition.fatSaturated} unit="g" label="Fat - saturated" />
                    <NutritionFact value={drink.nutrition.sugars} unit="g" label="Carbohydrate - sugars" />
                    <NutritionFact value={drink.nutrition.sodium} unit="g" label="Sodium" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};