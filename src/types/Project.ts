import { type PortableTextBlock } from "sanity";
import { Category } from "./Category";
import { SanityImage } from "./Page";

export type GalleryImage = {
    url: string;
    alt?: string;
    caption?: string;
};

export type Project = {
    _id: string;
    _createdAt: string;
    title: string;
    slug: string;
    coverImage: SanityImage;
    galleryImages: SanityImage[];
    video?: string;
    shortDescription: string;
    longDescription?: PortableTextBlock[];
    location?: string;
    year?: number;
    categories?: Category[];
    surface?: string;
    client?: string;
    status?: "completed" | "inProgress" | "concept";
    featured: boolean;
    projectLayout?: "default" | "editorial" | "galleryFocused" | "minimal";
    order: number;
    seoTitle?: string;
    seoDescription?: string;
    language?: "fr" | "en";
    translations?: {
        _id: string;
        title: string;
        slug: string;
        language?: "fr" | "en";
    }[];
};
