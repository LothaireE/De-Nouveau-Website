import { Project } from "@/payload-types";
import DefaultProjectLayout from "./layouts/DefaultProjectLayout";
import EditorialProjectLayout from "./layouts/EditorialProjectLayout";
import GalleryFocusedProjectLayout from "./layouts/GalleryFocusedProjectLayout";
import MinimalProjectLayout from "./layouts/MinimalProjectLayout";

const projectLayouts = {
    default: DefaultProjectLayout,
    editorial: EditorialProjectLayout,
    galleryFocused: GalleryFocusedProjectLayout,
    minimal: MinimalProjectLayout,
};

export function getMediaItemClass(layout?: string) {
    switch (layout) {
        case "portrait":
            return "md:col-span-1 mx-auto w-full max-w-xl";

        case "square":
            return "md:col-span-1 w-full";

        case "landscape":
            return "md:col-span-2 w-full";

        case "full":
            return "md:col-span-2 w-full";

        case "auto":
        default:
            return "";
    }
}

export function getMediaImageProps(layout?: string) {
    switch (layout) {
        case "portrait":
            return {
                size: "large" as const,
                variant: "contained" as const,
                className: "h-auto w-full object-contain",
            };

        case "square":
            return {
                size: "card" as const,
                variant: "grid" as const,
                className: "aspect-square w-full object-cover",
            };

        case "landscape":
            return {
                size: "hero" as const,
                variant: "full" as const,
                className: "h-auto w-full object-cover",
            };

        case "full":
            return {
                size: "hero" as const,
                variant: "full" as const,
                className: "h-auto w-full object-cover",
            };

        case "auto":
        default:
            return {
                size: "card" as const,
                variant: "half" as const,
                className: "h-auto w-full object-cover",
            };
    }
}

export function ProjectRenderer({ project }: { project: Project }) {
    const Layout = projectLayouts[project.projectLayout ?? "default"];

    return <Layout project={project} />;
}
