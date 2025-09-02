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

function smoothScrollToEl(el: HTMLElement, offset = 0) {
  // A small top margin for better spacing
  const y = window.scrollY + el.getBoundingClientRect().top - offset - 16;
  window.scrollTo({ top: y, behavior: "smooth" });
}

const DrinkGrid = forwardRef<HTMLElement, DrinkGridProps>(
  ({ drinks, onCardClick, selectedDrink }, ref) => {
    const drinkRows = chunkArray(drinks, 4);

    // --- FIX 1: Create two separate refs ---
    const mobileDetailsRef = useRef<HTMLDivElement>(null);
    const desktopDetailsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!selectedDrink) return;

      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const header = document.querySelector("header");
      const headerH = header ? header.getBoundingClientRect().height : 0;

      // --- FIX 2: Choose the correct ref based on screen size ---
      const targetRef = isMobile ? mobileDetailsRef : desktopDetailsRef;

      const t = setTimeout(() => {
        if (targetRef.current) {
          requestAnimationFrame(() => {
            smoothScrollToEl(targetRef.current!, headerH);
          });
        }
      }, 50);

      return () => clearTimeout(t);
    }, [selectedDrink]);

    return (
      <section ref={ref} className="relative bg-black py-20">
        {/* Cyan glows background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-[120px]" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {drinkRows.map((row, rowIndex) => (
              <div key={rowIndex} className="contents">
                {row.map((drink) => {
                  const isSelected = sameId(selectedDrink?.id, drink.id);
                  return (
                    <div key={String(drink.id)} className="contents">
                      <DrinkCard
                        drink={drink}
                        onClick={() => onCardClick(drink)}
                        isSelected={isSelected}
                      />
                      {/* --- FIX 3: Attach the correct ref to each element --- */}
                      {isSelected && (
                        <div className="col-span-1 md:hidden" ref={mobileDetailsRef}>
                          <AnimatePresence>
                            <DrinkDetails drink={drink} />
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  );
                })}
                {selectedDrink && row.some((d) => sameId(d.id, selectedDrink.id)) && (
                  <div className="hidden col-span-1 md:block md:col-span-2 lg:col-span-4" ref={desktopDetailsRef}>
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

DrinkGrid.displayName = "DrinkGrid";
export default DrinkGrid;
