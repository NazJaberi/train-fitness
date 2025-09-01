// src/features/coaches/queries.ts
import { groq } from "next-sanity";

export const COACH_LIST_QUERY = groq`...`; // Your existing query is here

export const COACH_DETAILS_QUERY = groq`
  *[_type == "coach" && slug.current == $slug][0]{
    name,
    "photoUrl": photo.asset->url,
    bio,
    specialties,
    certifications
  }
`;