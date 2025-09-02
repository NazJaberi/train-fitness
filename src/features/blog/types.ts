// src/features/blog/types.ts
export type BlogCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImageUrl?: string;
  publishedAt?: string;
  author?: string;
  readTime?: number;
  tags?: string[];
  featured?: boolean;
};

export type BlogPost = {
  title: string;
  slug: string;
  coverImageUrl?: string;
  excerpt?: string;
  publishedAt?: string;
  author?: string;
  readTime?: number;
  tags?: string[];
  content: any; // PortableTextBlock[]
};

