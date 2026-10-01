import type { HomePage, Project } from "@/payload-types";
import { getPayloadClient } from "./payload";
import { getAllProjects } from "./projects";

export async function getHomeProjects(
    selection?: HomePage["featuredProjects"],
): Promise<Project[]> {
    if (!selection?.length) return getAllProjects();
    const ids = [
        ...new Set(
            selection
                .map((row) =>
                    typeof row.project === "number"
                        ? row.project
                        : row.project?.id,
                )
                .filter((id): id is number => typeof id === "number"),
        ),
    ].slice(0, 3);
    // A nonempty selection that becomes unavailable must not reveal other projects.
    if (!ids.length) return [];
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
        collection: "projects",
        depth: 2,
        limit: 3,
        draft: false,
        where: {
            and: [
                { id: { in: ids } },
                { _status: { equals: "published" } },
                { visibility: { equals: "show" } },
            ],
        },
    });
    const available = new Map(
        docs
            .filter(
                (project) =>
                    project._status === "published" &&
                    project.visibility === "show",
            )
            .map((project) => [project.id, project]),
    );
    return ids.flatMap((id) => {
        const project = available.get(id);
        return project ? [project] : [];
    });
}
