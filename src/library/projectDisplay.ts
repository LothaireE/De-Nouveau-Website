import type { Project } from "@/payload-types";

const STATUS_LABELS: Record<NonNullable<Project["projectStatus"]>, string> = {
    délivré: "Livré",
    "en cours": "En cours",
    concept: "Concept",
};

export function getStatusLabel(status?: Project["projectStatus"]) {
    return status ? STATUS_LABELS[status] : null;
}

/** Short line shown under a project title: status, then year. */
export function getProjectMeta(project: Project): string[] {
    return [
        getStatusLabel(project.projectStatus),
        project.year ? String(project.year) : null,
    ].filter((value): value is string => Boolean(value));
}

/**
 * Two-column grids run edge to edge, so a half-width item must never sit
 * alone in its row: the last half of an odd run becomes full width.
 */
export function fillLoneHalves(wide: boolean[]): boolean[] {
    const result = [...wide];
    let halves = 0;

    result.forEach((isWide, index) => {
        if (!isWide) {
            halves += 1;
            return;
        }
        if (halves % 2 === 1) result[index - 1] = true;
        halves = 0;
    });

    if (halves % 2 === 1) result[result.length - 1] = true;

    return result;
}

/** Home grid rhythm: two pairs, then one full-width tile. */
export function getHomeTileWidths(count: number): boolean[] {
    return fillLoneHalves(
        Array.from({ length: count }, (_, index) => index % 5 === 4),
    );
}
