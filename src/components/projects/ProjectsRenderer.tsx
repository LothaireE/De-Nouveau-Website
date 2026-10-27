import type { Project } from "@/payload-types";
import DefaultProjectLayout from "./layouts/DefaultProjectLayout";
import EditorialProjectLayout from "./layouts/EditorialProjectLayout";
import GalleryFocusedProjectLayout from "./layouts/GalleryFocusedProjectLayout";
import MinimalProjectLayout from "./layouts/MinimalProjectLayout";
import NextProject from "./NextProject";
import ProjectLightbox from "./ProjectLightbox";
import ProjectHero from "./ProjectHero";
import ProjectPlans from "./ProjectPlans";
import ProjectSummary from "./ProjectSummary";

// Each layout only arranges the gallery; hero, summary, plans and the next
// project are shared by every project page.
const projectLayouts = {
    default: DefaultProjectLayout,
    editorial: EditorialProjectLayout,
    galleryFocused: GalleryFocusedProjectLayout,
    minimal: MinimalProjectLayout,
};

export function ProjectRenderer({
    project,
    nextProject = null,
}: {
    project: Project;
    nextProject?: Project | null;
}) {
    const Layout = projectLayouts[project.projectLayout ?? "default"];

    return (
        <main className="bg-studio-white text-studio-black">
            <ProjectHero project={project} />
            <ProjectSummary project={project} />
            <ProjectLightbox>
                <Layout project={project} />
            </ProjectLightbox>
            <ProjectPlans project={project} />
            {nextProject && <NextProject project={nextProject} />}
        </main>
    );
}
