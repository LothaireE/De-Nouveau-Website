import { ProjectRenderer } from "@/components/projects/ProjectsRenderer";
import { getSingleProject } from "@/library/sanity/fetchers";
import { notFound } from "next/navigation";

export default async function SingleProjectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const project = await getSingleProject(slug);

    if (!project) notFound();

    return (
        <div>
            <ProjectRenderer project={project} />
        </div>
    );
}
