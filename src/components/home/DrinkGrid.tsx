// juice-bar-website/src/components/home/DrinkGrid.tsx

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

const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < array.length; i += size) out.push(array.slice(i, i + size));
  return out;
};

const sameId = (a?: string | number | null, b?: string | number | null) =>
  a != null && b != null ? String(a) === String(b) : false;

const DrinkGrid = forwardRef<HTMLElement, DrinkGridProps>(
  ({ drinks, onCardClick, selectedDrink }, ref) => {
    const drinkRows = chunkArray(drinks, 4);
    const detailsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!selectedDrink) return;
      const isMobile =
        typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches === false;

      const t = setTimeout(() => {
        detailsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: isMobile ? "start" : "center",
        });
      }, 120);
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
              <div key={rowIndex} className="contents">
                {row.map((drink) => {
                  const isSelected = sameId(selectedDrink?.id as any, drink.id as any);

                  return (
                    <div key={String(drink.id)} className="contents">
                      <DrinkCard
                        drink={drink}
                        onClick={() => onCardClick(drink)}
                        isSelected={isSelected}
                      />

                      {/* Mobile-only: details right after the tapped card */}
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

                {/* Desktop/tablet: details span the row */}
                {selectedDrink &&
                  row.some((d) => sameId(d.id as any, selectedDrink.id as any)) && (
                    <div
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

// ESLint happiness
DrinkGrid.displayName = "DrinkGrid";

export default DrinkGrid;
