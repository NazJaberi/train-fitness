// src/features/coaches/types.ts
export type CoachCardData = {
  name: string;
  slug: string;
  photoUrl?: string;
  specialties?: string[];
};

export type CoachDetails = {
  name: string;
  photoUrl?: string;
  bio?: any; // Sanity's Portable Text
  specialties?: string[];
  certifications?: string[];
};