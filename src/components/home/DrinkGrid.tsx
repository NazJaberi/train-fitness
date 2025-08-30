// src/components/home/DrinkGrid.tsx
"use client";

import DrinkCard from "./DrinkCard";
import { Drink } from "@/lib/dummyData";
import { AnimatePresence, motion } from "framer-motion";
import { DrinkDetails } from "./DrinkDetails";
import { forwardRef, useRef, useEffect } from "react";

type DrinkGridProps = {
  drinks: Drink[];
  onCardClick: (drink: Drink) => void;
  selectedDrink: Drink | null;
};

// Helper function to chunk array into rows
const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunkedArr: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
};

const DrinkGrid = forwardRef<HTMLElement, DrinkGridProps>(
  ({ drinks, onCardClick, selectedDrink }, ref) => {
    const drinkRows = chunkArray(drinks, 4);
    const detailsRef = useRef<HTMLDivElement>(null);

    // Scroll to details when it opens
    useEffect(() => {
        if (selectedDrink && detailsRef.current) {
            setTimeout(() => {
                detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100); // Small delay to allow layout to shift
        }
    }, [selectedDrink]);

    return (
      <section ref={ref} className="py-20 transition-colors duration-300 bg-brandBgLight dark:bg-brandBgDark">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {drinkRows.map((row, rowIndex) => (
              <>
                {row.map(drink => (
<DrinkCard
  key={drink.id}
  drink={drink}
  onClick={() => onCardClick(drink)}
  isSelected={selectedDrink?.id === drink.id} // Add this line
/>
                ))}
                
                {selectedDrink && row.some(d => d.id === selectedDrink.id) && (
                  <div ref={detailsRef} className="col-span-1 md:col-span-2 lg:col-span-4">
                      <AnimatePresence>
                        <DrinkDetails drink={selectedDrink} />
                      </AnimatePresence>
                  </div>
                )}

              </>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

export default DrinkGrid;