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

export function ProjectRenderer({ project }: { project: Project }) {
    const Layout = projectLayouts[project.projectLayout ?? "default"];

    return <Layout project={project} />;
}
