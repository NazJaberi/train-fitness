// src/features/home/queries.ts
import { groq } from 'next-sanity';

export const HOME_PAGE_QUERY = groq`
  *[_type == "homePage"][0]{
    heroSlides[]{
      title,
      tagline,
      "imageUrl": image.asset->url
    },
    featureTiles[]{
      title,
      subtitle,
      "imageUrl": image.asset->url,
      href
    },
    primaryCta{ label, href },
    secondaryCta{ label, href },
    services[]{
      "iconUrl": icon.asset->url,
      title,
      blurb,
      href
    },
    features[]{
      "iconUrl": icon.asset->url,
      title,
      description,
      metric
    },
    testimonials[]{
      "photoUrl": photo.asset->url,
      name,
      since,
      quote
    },
    announcement{ label, text, href, cta },
    highlight{ title, blurb },
    memberCount,
    yearsOfExperience,
    classesPerWeek
  }
`;
