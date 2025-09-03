// src/features/coaches/queries.ts
import { groq } from "next-sanity";

// List query used by the coaches index page and carousel
export const COACH_LIST_QUERY = groq`
  *[_type == "coach"] | order(name asc) {
    name,
    "slug": slug.current,
    "photoUrl": photo.asset->url,
    specialties,
    featured
  }
`;

// Details query for a single coach by slug
export const COACH_DETAILS_QUERY = groq`
  *[_type == "coach" && slug.current == $slug][0]{
    name,
    "photoUrl": photo.asset->url,
    bio,
    specialties,
    certifications
  }
`;
