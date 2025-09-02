// src/features/transformations/types.ts
export type Transformation = { /* ... your existing type ... */ };

export type TransformationDetails = {
  memberName: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  testimonialQuote: string;
  fullStory: any; // Sanity Portable Text
  keyStats: {
    statValue: string;
    statLabel: string;
  }[];
  coach?: { // The coach is now an optional object
    name: string;
    slug: string;
  };
};