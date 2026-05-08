import { groq } from "next-sanity";

export const allProjectsQuery = groq`
    *[_type == "project"] | order(order asc) {
        _id,
        _createdAt,
        title,
        "slug": slug.current,
        "coverImage": coverImage.asset->url,
        "galleryImages": galleryImages[].asset->url,
        video,
        shortDescription,
        longDescription,
        location,
        year,
        surface,
        client,
        status,
        featured,
        projectLayout,
        order,
        seoTitle,
        seoDescription,
        language,
        "categories": categories[]->{
            _id,
            title,
            "slug": slug.current,
        },
        "translations": translations[]->{
            _id,
            title,
            "slug": slug.current,
            language
        }
    }`;

//            "galleryImages": galleryImages[].asset->url,
// "coverImage": coverImage.asset->url,
// "galleryImages": galleryImages[],
// "coverImage": coverImage.asset->url,
export const singleProjectQuery = groq`
    *[_type == "project" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        "slug": slug.current,
        coverImage,
        galleryImages,
        video,
        shortDescription,
        longDescription,
        location,
        year,
        surface,
        client,
        status,
        featured,
        projectLayout,
        order,
        seoTitle,
        seoDescription,
        language,
        "categories": categories[]->{
            _id,
            title,
            "slug": slug.current,
        },
        "translations": translations[]->{
            _id,
            title,
            "slug": slug.current,
            language
        }
    }`;

export const pageQuery = groq`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    pageType,
    intro,
    content,
    heroImage,
    portrait,
    heroVideoUrl,
    email,
    phone,
    address
  }
`;

export const navQuery = groq`
 *[_type == "project"] | order(order asc) {
        _id,
        _createdAt,
        title,
        "slug": slug.current,
    }`;
