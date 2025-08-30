// src/app/page.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import HeroSection from "@/components/home/HeroSection";
import DrinkGrid from "@/components/home/DrinkGrid";
import { Drink, drinks } from "@/lib/dummyData";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { FilterBar } from "@/components/home/FilterBar";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  
  // --- New Filter States ---
  const [activeType, setActiveType] = useState('All');
  const [activeHealthBenefits, setActiveHealthBenefits] = useState<string[]>([]);
  
  const drinksSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const filteredDrinks = useMemo(() => {
    return drinks
      .filter(drink => activeType === 'All' || drink.type === activeType)
      .filter(drink => 
        activeHealthBenefits.every(benefit => drink.healthBenefits.includes(benefit as any))
      );
  }, [activeType, activeHealthBenefits]);

  const handleCardClick = (drink: Drink) => {
    setSelectedDrink((prev) => (prev?.id === drink.id ? null : drink));
  };
  
  const handleTypeChange = (type: string) => {
    setActiveType(type);
    setSelectedDrink(null);
  }

  const handleHealthBenefitChange = (benefit: string) => {
    setActiveHealthBenefits(prev => 
      prev.includes(benefit) 
        ? prev.filter(b => b !== benefit) // Remove if it exists
        : [...prev, benefit] // Add if it doesn't
    );
    setSelectedDrink(null);
  }

  const handleScrollToDrinks = () => {
    drinksSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

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