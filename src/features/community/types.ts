// src/features/community/types.ts
export type CommunityEvent = {
  _id: string;
  title: string;
  slug?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  imageUrl?: string;
  summary?: string;
  description?: any; // PortableText
  ctaLabel?: string;
  ctaHref?: string;
  tags?: string[];
};

export type CommunityChallenge = {
  _id: string;
  title: string;
  slug?: string;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  summary?: string;
  reward?: string;
  rules?: any; // PortableText
  ctaLabel?: string;
  ctaHref?: string;
  tags?: string[];
};

export type MemberHighlight = {
  _id: string;
  memberName: string;
  slug?: string;
  photoUrl?: string;
  headline?: string;
  story?: any; // PortableText
};
