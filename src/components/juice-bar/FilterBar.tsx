// src/components/home/FilterBar.tsx
"use client";

import { FaLeaf, FaTint, FaBolt, FaSeedling, FaFire, FaBreadSlice } from 'react-icons/fa';
import { IconType } from 'react-icons';

// ... (FilterBar component remains the same, but we update the healthBenefits array)
type FilterBarProps = {
  activeType: string;
  onTypeChange: (type: string) => void;
  activeHealthBenefits: string[];
  onHealthBenefitChange: (benefit: string) => void;
};
const drinkTypes = ['All', 'Smoothie', 'Crushed', 'Juiced'];

// --- UPDATED Health Benefits List ---
const healthBenefits: { name: string; icon: IconType }[] = [
  { name: '< 200 Cal', icon: FaFire },
  { name: 'Low Gluten', icon: FaBreadSlice },
  { name: 'Low Fat', icon: FaLeaf },
  { name: 'Dairy Free', icon: FaTint },
  { name: 'Source of Fibre', icon: FaSeedling },
  { name: 'Source of Protein', icon: FaBolt },
];
// ... (The rest of the component is the same as before)
const FilterButton = ({ label, onClick, isActive, icon: Icon }: { label: string; onClick: () => void; isActive: boolean; icon?: IconType }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition-colors ${
      isActive ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white/80 hover:bg-white/10'
    }`}
  >
    {Icon && <Icon />}
    {label}
  </button>
);

export const FilterBar = ({ activeType, onTypeChange, activeHealthBenefits, onHealthBenefitChange }: FilterBarProps) => {
  return (
    <div className="py-8 text-white">
      {/* Drink Type Filters */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        <h3 className="mr-4 font-bold text-white">Drink Type:</h3>
        {drinkTypes.map(type => (
          <FilterButton
            key={type}
            label={type}
            onClick={() => onTypeChange(type)}
            isActive={activeType === type}
          />
        ))}
      </div>

      {/* Health Benefit Filters */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <h3 className="mr-4 font-bold text-white">Health Benefits:</h3>
        {healthBenefits.map(benefit => (
          <FilterButton
            key={benefit.name}
            label={benefit.name}
            onClick={() => onHealthBenefitChange(benefit.name)}
            isActive={activeHealthBenefits.includes(benefit.name)}
            icon={benefit.icon}
          />
        ))}
      </div>
    </div>
  );
};
