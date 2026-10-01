import type { ArrayField } from "payload";

export const featuredProjectsField: ArrayField = {
    name: "featuredProjects",
    label: "Projets à la une",
    type: "array",
    maxRows: 3,
    labels: { singular: "Projet à la une", plural: "Projets à la une" },
    admin: {
        description:
            "Choisissez jusqu’à 3 projets et réordonnez les lignes par glisser-déposer. Sans sélection, la galerie habituelle est affichée. Un projet masqué ou dépublié disparaît de cette sélection sur le site.",
    },
    validate: (rows) => {
        if (!rows) return true;
        if (rows.length > 3) return "Sélectionnez au maximum 3 projets.";
        const ids = rows.map((row) => {
            const project =
                row && typeof row === "object" && "project" in row
                    ? row.project
                    : null;
            const id =
                project && typeof project === "object" && "id" in project
                    ? project.id
                    : project;
            return typeof id === "number" || typeof id === "string"
                ? String(id) || null
                : null;
        });
        if (ids.some((id) => id === null))
            return "Choisissez un projet pour chaque ligne.";
        return (
            new Set(ids).size === ids.length ||
            "Chaque projet ne peut être sélectionné qu’une fois."
        );
    },
    fields: [
        {
            name: "project",
            label: "Projet",
            type: "relationship",
            relationTo: "projects",
            // Nullable in SQL so deleting a project can safely leave an unavailable reference.
            // Keep IDs in public Global responses; fetch published projects separately.
            maxDepth: 0,
            filterOptions: {
                and: [
                    { _status: { equals: "published" } },
                    { visibility: { equals: "show" } },
                ],
            },
        },
    ],
};
