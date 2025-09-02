// src/features/about/types.ts
export type AboutPage = {
  title: string;
  subtitle?: string;
  heroImageUrl?: string;
  intro?: any; // PortableText
  mission?: any; // PortableText
  values?: { title: string; description?: string; iconUrl?: string }[];
  stats?: { label: string; value: string }[];
  gallery?: { url: string }[];
};

