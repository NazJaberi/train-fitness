export type FaqItem = {
  _id: string;
  question: string;
  answer: any; // Sanity PortableTextBlock[]
  category: 'General' | 'Memberships' | 'Classes' | 'Child Safety' | 'Amenities' | 'Personal Training';
};
