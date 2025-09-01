// src/lib/dummyData.ts

// A single object for one serving size's nutrition
export type NutritionInfo = {
  servingSize: string;
  energy: string;
  energy_cal: string;
  protein: string;
  fatTotal: string;
  fatSaturated: string;
  carbohydrate: string;
  sugars: string;
  sodium: string;
  dietaryFibre: string;
};

// The main Drink type now uses an array of NutritionInfo
export type Drink = {
  id: number;
  name: string;
  images: {
    cup: string;
    shadow: string;
    hero: string;
    ingredients: string;
  };
  type: 'Smoothie' | 'Crushed' | 'Juiced' | 'Blended';
  healthBenefits: string[];
  ingredients: string[];
  nutritionByServingSize: NutritionInfo[]; // This is the updated field
};

export type Class = {
  name: string;
  tagline: string;
  description: unknown[]; // Sanity's block content
  mainImageUrl: string;
  intensityLevel: string;
  duration: number;
  caloriesBurned: string;
  whatToBring: {
    itemText: string;
    iconUrl: string;
  }[];
  keyBenefits: {
    benefitText: string;
    iconUrl: string;
  }[];
};
