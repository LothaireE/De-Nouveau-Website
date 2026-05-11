import { Project } from "@/types/Project";
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

type Props = {
    project: Project;
};

export function ProjectRenderer({ project }: Props) {
    const Layout = projectLayouts[project.projectLayout ?? "default"];

    return <Layout project={project} />;
}
