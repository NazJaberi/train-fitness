// src/features/home/types.ts
export type HomePageData = {
  heroSlides: { title?: string; tagline?: string; imageUrl: string }[];
  featureTiles?: { title: string; subtitle?: string; imageUrl?: string; href?: string }[];
  primaryCta?: { label?: string; href?: string };
  secondaryCta?: { label?: string; href?: string };
  services?: { iconUrl?: string; title: string; blurb?: string; href?: string }[];
  features?: { iconUrl?: string; title?: string; description?: string; metric?: string }[];
  testimonials?: { photoUrl?: string; name?: string; since?: string; quote?: string }[];
  announcement?: { label?: string; text?: string; href?: string; cta?: string };
  highlight?: { title?: string; blurb?: string };
  memberCount?: number;
  yearsOfExperience?: number;
  classesPerWeek?: number;
};
