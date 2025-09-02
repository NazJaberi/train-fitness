// src/features/community/queries.ts
import { groq } from 'next-sanity';

export const COMMUNITY_EVENTS_QUERY = groq`
  *[_type == "communityEvent"] | order(startDate asc) {
    _id,
    title,
    "slug": slug.current,
    startDate,
    endDate,
    location,
    "imageUrl": image.asset->url,
    summary,
    ctaLabel,
    ctaHref,
    tags
  }
`;

export const COMMUNITY_CHALLENGES_QUERY = groq`
  *[_type == "communityChallenge"] | order(startDate desc) {
    _id,
    title,
    "slug": slug.current,
    startDate,
    endDate,
    "imageUrl": image.asset->url,
    summary,
    reward,
    ctaLabel,
    ctaHref,
    tags
  }
`;

export const MEMBER_HIGHLIGHTS_QUERY = groq`
  *[_type == "memberHighlight"] | order(_createdAt desc) {
    _id,
    memberName,
    "slug": slug.current,
    "photoUrl": photo.asset->url,
    headline
  }
`;

