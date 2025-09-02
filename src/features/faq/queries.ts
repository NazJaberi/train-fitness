import { groq } from "next-sanity";

export const FAQ_QUERY = groq`
  *[_type == "faqItem"] | order(_createdAt asc) {
    _id,
    question,
    answer,
    category
  }
`;