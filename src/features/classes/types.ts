export type ClassCardData = {
  name: string;
  tagline?: string;
  slug: string;
  imageUrl?: string;
  intensityLevel?: "Low" | "Medium" | "High";
  duration?: number; // minutes
};

export type ClassDetail = {
  name: string;
  tagline?: string;
  description: unknown; // PortableTextBlock[]
  mainImageUrl?: string;
  intensityLevel?: string;
  duration?: number; // minutes
  caloriesBurned?: string;
  keyBenefits?: { benefitText: string; iconUrl?: string }[];
  whatToBring?: { itemText: string; iconUrl?: string }[];
  schedule?: { day: string; startTime: string; endTime: string; instructor?: { name?: string } }[];
  gallery?: { url: string }[];
};
