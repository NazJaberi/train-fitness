// src/components/home/DrinkGrid.tsx
"use client";

import DrinkCard from "./DrinkCard";
import { Drink } from "@/lib/dummyData";
import { AnimatePresence } from "framer-motion";
import { DrinkDetails } from "./DrinkDetails";
import { forwardRef, useRef, useEffect } from "react";

type DrinkGridProps = {
  drinks: Drink[];
  onCardClick: (drink: Drink) => void;
  selectedDrink: Drink | null;
};

// Helper function to chunk array into rows of 4 (desktop layout concept)
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

    // Single ref that will point to whichever details block is currently rendered
    const detailsRef = useRef<HTMLDivElement>(null);

    // Scroll to the correct details block WHEN selection changes
    useEffect(() => {
      if (!selectedDrink) return;

      const isMobile =
        typeof window !== "undefined" &&
        window.matchMedia("(min-width: 768px)").matches === false;

      // Slight delay so layout has rendered
      const t = setTimeout(() => {
        if (detailsRef.current) {
          detailsRef.current.scrollIntoView({
            behavior: "smooth",
            block: isMobile ? "start" : "center",
          });
        }
      }, 100);

      return () => clearTimeout(t);
    }, [selectedDrink]);

    return (
      <section
        ref={ref}
        className="py-20 transition-colors duration-300 bg-brandBgLight dark:bg-brandBgDark"
      >
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {drinkRows.map((row, rowIndex) => (
              // Use a keyed wrapper with "contents" so it doesn't add extra DOM box, but fixes key warning
              <div key={rowIndex} className="contents">
                {row.map((drink) => {
                  const isSelected = selectedDrink?.id === drink.id;

                  return (
                    <div key={drink.id} className="contents">
                      <DrinkCard
                        drink={drink}
                        onClick={() => onCardClick(drink)}
                        isSelected={isSelected}
                      />

                      {/* MOBILE-ONLY details: render immediately AFTER the selected card */}
                      {isSelected && (
                        <div className="col-span-1 md:hidden" ref={detailsRef}>
                          <AnimatePresence>
                            <DrinkDetails drink={drink} />
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* DESKTOP/TABLET details: render once under the row */}
                {selectedDrink && row.some((d) => d.id === selectedDrink.id) && (
                  <div
                    // Hidden on mobile, visible from md+. Keeps your current desktop experience.
                    className="hidden col-span-1 md:block md:col-span-2 lg:col-span-4"
                    ref={detailsRef}
                  >
                    <AnimatePresence>
                      <DrinkDetails drink={selectedDrink} />
                    </AnimatePresence>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

export default DrinkGrid;
