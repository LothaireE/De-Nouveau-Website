import { type PortableTextBlock } from "sanity"
import { Category } from "./Category";

export type Project = {
  _id: string;
  _createdAt: string;
  title: string;
  slug: string;
  coverImage: string;
  galleryImages?: string[];
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