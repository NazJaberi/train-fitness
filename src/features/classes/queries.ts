export const CLASS_LIST_QUERY = `*[_type == "class"]{
  name,
  tagline,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  intensityLevel,
  duration
} | order(name asc)`;

export const CLASS_DETAIL_QUERY = `*[_type == "class" && slug.current == $slug][0]{
  name,
  tagline,
  description,
  "mainImageUrl": mainImage.asset->url,
  intensityLevel,
  duration,
  caloriesBurned,
  keyBenefits[]{ benefitText, "iconUrl": icon.asset->url },
  whatToBring[]{ itemText, "iconUrl": icon.asset->url },
  schedule[]{ day, startTime, endTime, instructor->{name} },
  gallery[]{ "url": asset->url }
}`;

