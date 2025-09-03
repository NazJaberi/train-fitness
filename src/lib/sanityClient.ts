// src/lib/sanityClient.ts
import {createClient} from '@sanity/client'

export const client = createClient({
  // These now read from environment variables
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production
  apiVersion: '2024-01-01',
})