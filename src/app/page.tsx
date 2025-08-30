// src/app/page.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import HeroSection from "@/components/home/HeroSection";
import DrinkGrid from "@/components/home/DrinkGrid";
import { Drink, drinks } from "@/lib/dummyData";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { FilterBar } from "@/components/home/FilterBar";

// ----- Typed helpers -----
type HealthBenefit = Drink["healthBenefits"][number];
type DrinkTypeFilter = "All" | Drink["type"];

const DRINK_TYPES: Drink["type"][] = ["Smoothie", "Crushed", "Juiced", "Blended"];
const HEALTH_BENEFITS: HealthBenefit[] = [
  "< 200 Cal",
  "Low Gluten",
  "Low Fat",
  "Source of Protein",
  "Source of Fibre",
  "Dairy Free",
];

const isDrinkTypeFilter = (val: string): val is DrinkTypeFilter =>
  val === "All" || DRINK_TYPES.includes(val as Drink["type"]);

const isHealthBenefit = (val: string): val is HealthBenefit =>
  (HEALTH_BENEFITS as string[]).includes(val);

// ----- Page -----
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);

  // Filters
  const [activeType, setActiveType] = useState<DrinkTypeFilter>("All");
  const [activeHealthBenefits, setActiveHealthBenefits] = useState<HealthBenefit[]>([]);

  const drinksSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const filteredDrinks = useMemo<Drink[]>(() => {
    return drinks
      .filter((drink) => activeType === "All" || drink.type === activeType)
      .filter((drink) =>
        // all selected benefits must be in the drink's benefits
        activeHealthBenefits.every((benefit) => drink.healthBenefits.includes(benefit))
      );
  }, [activeType, activeHealthBenefits]);

  const handleCardClick = (drink: Drink) => {
    setSelectedDrink((prev) => (prev?.id === drink.id ? null : drink));
  };

  // Accept string from FilterBar, but narrow to our union
  const handleTypeChange = (type: string) => {
    if (!isDrinkTypeFilter(type)) return;
    setActiveType(type);
    setSelectedDrink(null);
  };

  // Accept string from FilterBar, but narrow to our union
  const handleHealthBenefitChange = (benefit: string) => {
    if (!isHealthBenefit(benefit)) return;
    setActiveHealthBenefits((prev) =>
      prev.includes(benefit) ? prev.filter((b) => b !== benefit) : [...prev, benefit]
    );
    setSelectedDrink(null);
  };

  const handleScrollToDrinks = () => {
    drinksSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <HeroSection onExploreClick={handleScrollToDrinks} />
      <div className="container px-4 mx-auto">
        <FilterBar
          activeType={activeType}
          onTypeChange={handleTypeChange}
          activeHealthBenefits={activeHealthBenefits}
          onHealthBenefitChange={handleHealthBenefitChange}
        />
      </div>
      <DrinkGrid
        ref={drinksSectionRef}
        drinks={filteredDrinks}
        onCardClick={handleCardClick}
        selectedDrink={selectedDrink}
      />
    </>
  );
}
