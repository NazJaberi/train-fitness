// src/features/transformations/queries.ts
import { groq } from "next-sanity";

export const TRANSFORMATIONS_QUERY = groq`
  *[_type == "transformation"] | order(_createdAt desc) {
    _id,
    memberName,
    "slug": slug.current,
    "beforeImageUrl": beforeImage.asset->url,
    "afterImageUrl": afterImage.asset->url,
    testimonialQuote,
    keyStats
  }
`;

export const TRANSFORMATION_DETAILS_QUERY = groq`
  *[_type == "transformation" && slug.current == $slug][0]{
    memberName,
    "beforeImageUrl": beforeImage.asset->url,
    "afterImageUrl": afterImage.asset->url,
    testimonialQuote,
    fullStory,
    keyStats,
    coach->{
      name,
      "slug": slug.current
    }
  }
`;
