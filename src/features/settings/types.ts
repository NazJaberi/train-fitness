// src/features/settings/types.ts
export type NavItem = { label: string; href: string };
export type SiteSettings = {
  logoUrl?: string;
  navigation?: NavItem[];
  stickyCta?: { label?: string; href?: string };
};

