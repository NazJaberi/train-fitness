// src/lib/sanityClient.ts
import {createClient} from '@sanity/client'

export const client = createClient({
  // --- THIS IS THE FIX ---
  projectId: '5j9851v0', 

  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
})