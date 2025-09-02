// src/features/blog/queries.ts
import { groq } from 'next-sanity';

export const BLOG_LIST_QUERY = groq`
  *[_type == "blogPost"] | order(featured desc, publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "coverImageUrl": coverImage.asset->url,
    publishedAt,
    author,
    readTime,
    tags,
    featured
  }
`;

export const BLOG_DETAILS_QUERY = groq`
  *[_type == "blogPost" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    "coverImageUrl": coverImage.asset->url,
    excerpt,
    publishedAt,
    author,
    readTime,
    tags,
    content
  }
`;

