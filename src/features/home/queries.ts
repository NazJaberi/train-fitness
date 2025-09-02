// src/features/home/queries.ts
import { groq } from 'next-sanity';

export const HOME_PAGE_QUERY = groq`
  *[_type == "homePage"][0]{
    heroSlides[]{
      title,
      tagline,
      "imageUrl": image.asset->url
    }
  }
`;
