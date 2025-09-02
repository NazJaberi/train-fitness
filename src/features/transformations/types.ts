// src/features/transformations/types.ts
export type Transformation = {
  _id: string;
  memberName: string;
  slug?: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  testimonialQuote: string;
  keyStats?: {
    statValue: string;
    statLabel: string;
  }[];
};

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
