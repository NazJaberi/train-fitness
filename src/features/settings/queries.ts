// src/features/settings/queries.ts
import { groq } from 'next-sanity';

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0]{
    "logoUrl": logo.asset->url,
    navigation[]{ label, href },
    stickyCta{ label, href }
  }
`;

