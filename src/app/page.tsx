"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import HeroSection from "@/components/home/HeroSection";
import DrinkGrid from "@/components/home/DrinkGrid";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { FilterBar } from "@/components/home/FilterBar";
import { Drink } from "@/lib/dummyData";          // Type only
import { client } from "@/lib/sanityClient";      // Sanity client

// ---- Typed helpers ----
type HealthBenefit = Drink["healthBenefits"][number];
type DrinkTypeFilter = "All" | Drink["type"];

const DRINK_TYPES: Drink["type"][] = ["Smoothie", "Crushed", "Juiced", "Blended"];
const HEALTH_BENEFITS: HealthBenefit[] = [
  "< 200 Cal", "Low Gluten", "Low Fat", "Source of Protein", "Source of Fibre", "Dairy Free",
];

const isDrinkTypeFilter = (val: string): val is DrinkTypeFilter =>
  val === "All" || DRINK_TYPES.includes(val as Drink["type"]);

const isHealthBenefit = (val: string): val is HealthBenefit =>
  (HEALTH_BENEFITS as string[]).includes(val);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [drinks, setDrinks] = useState<Drink[]>([]);

  const [activeType, setActiveType] = useState<DrinkTypeFilter>("All");
  const [activeHealthBenefits, setActiveHealthBenefits] = useState<HealthBenefit[]>([]);
  const drinksSectionRef = useRef<HTMLElement | null>(null);

  // Fetch from Sanity once
  useEffect(() => {
    const fetchDrinks = async () => {
      // This query now fetches the new nutritionByServingSize field
      const query = `*[_type == "drink"] | order(drinkId asc){
        "id": drinkId,
        name,
        "images": {
          "cup": images.cup.asset->url,
          "shadow": images.shadow.asset->url,
          "hero": images.hero.asset->url,
          "ingredients": images.ingredients.asset->url
        },
        "type": drinkType,
        healthBenefits,
        ingredients,
        nutritionByServingSize // <-- THIS LINE IS UPDATED
      }`;
      const sanityDrinks = await client.fetch<Drink[]>(query);
      setDrinks(sanityDrinks);
      setIsLoading(false);
    };
    fetchDrinks();
  }, []);

  // Filtering logic
  const filteredDrinks = useMemo<Drink[]>(() => {
    return drinks
      .filter((drink) => activeType === "All" || drink.type === activeType)
      .filter((drink) => activeHealthBenefits.every((b) => drink.healthBenefits?.includes(b)));
  }, [activeType, activeHealthBenefits, drinks]);

  // Event Handlers
  const handleCardClick = (drink: Drink) => {
    setSelectedDrink((prev) => (prev && String(prev.id) === String(drink.id) ? null : drink));
  };

  const handleTypeChange = (type: string) => {
    if (!isDrinkTypeFilter(type)) return;
    setActiveType(type);
    setSelectedDrink(null);
  };

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