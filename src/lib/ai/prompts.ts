import type { MediaTextContext, MediaTextField, ProjectContext } from "./types";

/** Lengths shared by the prompts, the post-processing and the fallback. */
export const MAX_LENGTH: Record<MediaTextField, number> = {
    caption: 60,
    alt: 125,
};

/** Generous token budgets: the answers are one short line. */
export const MAX_TOKENS: Record<MediaTextField, number> = {
    caption: 40,
    alt: 90,
};

const STATUS_LABELS: Record<string, string> = {
    délivré: "livré",
    "en cours": "en cours",
    concept: "concept (non construit)",
};

const CAPTION_SYSTEM = `Tu rédiges la légende d'une image pour le site d'une agence d'architecture française.
La légende donne le contexte de l'image ; elle est affichée sous la photo.

Règles :
- Un groupe nominal court en français, ${MAX_LENGTH.caption} caractères maximum.
- Pas de verbe conjugué, pas de point final, pas de guillemets.
- Style des légendes existantes : « Toiture en bambou de nuit », « Vue aérienne concours Bambou U ».
- N'utilise QUE des faits présents dans les données du projet ou clairement visibles sur l'image.
- N'invente jamais de lieu, de date, de client ni de phase de projet.
- Si les données ne suffisent pas, nomme simplement l'élément principal visible.
- Ne commence pas par « Image de », « Photo de » ou « Vue de l'image ».

Réponds uniquement par la légende, sans commentaire.`;

const ALT_SYSTEM = `Tu rédiges le texte alternatif d'une image pour le site d'une agence d'architecture française.
Le texte alternatif est lu par les lecteurs d'écran et sert au référencement : il décrit ce qu'on voit.

Règles :
- Une seule phrase factuelle en français, ${MAX_LENGTH.alt} caractères maximum.
- Ne commence pas par « Image de », « Photo de », « Une image montrant » ou équivalent.
- Décris ce qui est visible : sujet, matières, lumière, cadrage, composition.
- Utilise la légende et le projet comme contexte et vocabulaire, mais ne répète PAS la légende :
  un lecteur d'écran lit la légende juste après, décris donc ce qu'elle ne dit pas.
- Ne décris que ce qui est clairement visible : en cas de doute sur un élément
  (matériau, mobilier, aménagement), ne le mentionne pas.
- Si des personnes sont présentes et occupent une place notable dans l'image,
  mentionne-les brièvement (par exemple « une personne cuisine »), sans décrire
  leur apparence physique.
- N'invente rien qui ne soit pas visible ou présent dans les données.

Réponds uniquement par le texte alternatif, sans guillemets ni commentaire.`;

export function getSystemPrompt(field: MediaTextField): string {
    return field === "caption" ? CAPTION_SYSTEM : ALT_SYSTEM;
}

const clean = (value: unknown) =>
    typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";

/** Project facts as lines, empty when nothing is known. */
export function describeProject(project?: ProjectContext | null): string[] {
    if (!project) return [];
    const lines: string[] = [];
    const title = clean(project.title);
    const location = clean(project.location);
    const description = clean(project.shortDescription);
    const status = clean(project.projectStatus);
    const year =
        project.year === null || project.year === undefined
            ? ""
            : String(project.year).trim();
    const categories = (project.categories ?? []).map(clean).filter(Boolean);

    if (title) lines.push(`- Titre : ${title}`);
    if (location) lines.push(`- Lieu : ${location}`);
    if (year) lines.push(`- Année : ${year}`);
    if (status) lines.push(`- Statut : ${STATUS_LABELS[status] ?? status}`);
    if (categories.length)
        lines.push(`- Catégories : ${categories.join(", ")}`);
    if (description) lines.push(`- Description courte : ${description}`);
    return lines;
}

export function getUserPrompt(
    field: MediaTextField,
    context: MediaTextContext,
): string {
    const parts: string[] = [];
    const project = describeProject(context.project);
    parts.push(
        project.length
            ? `Données du projet :\n${project.join("\n")}`
            : "Aucune donnée de projet : appuie-toi uniquement sur l'image.",
    );

    const caption = clean(context.caption);
    const alt = clean(context.alt);

    if (field === "alt") {
        parts.push(
            caption
                ? `Légende déjà affichée avec l'image (à ne pas répéter) : « ${caption} »`
                : "L'image n'a pas encore de légende.",
        );
        parts.push(
            `Rédige le texte alternatif de cette image (${MAX_LENGTH.alt} caractères maximum).`,
        );
    } else {
        if (alt)
            parts.push(
                `Description existante de l'image (indication seulement) : « ${alt} »`,
            );
        parts.push(
            `Rédige la légende de cette image (${MAX_LENGTH.caption} caractères maximum).`,
        );
    }
    return parts.join("\n\n");
}
