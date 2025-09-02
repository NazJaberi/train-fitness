// src/features/about/queries.ts
import { groq } from 'next-sanity';

export const ABOUT_PAGE_QUERY = groq`
  *[_type == "aboutPage"][0]{
    title,
    subtitle,
    "heroImageUrl": heroImage.asset->url,
    intro,
    mission,
    values[]{ title, description, "iconUrl": icon.asset->url },
    stats[]{ label, value },
    gallery[]{ "url": asset->url }
  }
`;

