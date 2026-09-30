import type { GroupField } from "payload";

const text = (name: string, label: string, description?: string) => ({
    name,
    label,
    type: "text" as const,
    ...(description ? { admin: { description } } : {}),
});

/** Legal notice facts only; the page layout and hosting details stay in code. */
export const legalInfoField: GroupField = {
    name: "legal",
    type: "group",
    label: false,
    admin: {
        description:
            "Ces informations alimentent automatiquement la page « Mentions légales ». Un champ vide n’est pas affiché.",
    },
    fields: [
        {
            type: "row",
            fields: [
                text("companyName", "Raison sociale"),
                text(
                    "legalForm",
                    "Forme juridique",
                    "Ex. : SARL d’architecture",
                ),
            ],
        },
        {
            type: "row",
            fields: [
                text("shareCapital", "Capital social", "Ex. : 10 000 €"),
                text("siret", "SIRET", "14 chiffres"),
            ],
        },
        {
            type: "row",
            fields: [
                text(
                    "rcs",
                    "Immatriculation RCS",
                    "Ex. : RCS Paris 123 456 789",
                ),
                text("vatNumber", "N° de TVA intracommunautaire"),
            ],
        },
        text(
            "architectsRegistration",
            "Inscription à l’Ordre des architectes",
            "Conseil régional et numéro d’inscription. Ex. : Conseil régional d’Île-de-France, n° S12345",
        ),
        text("insurer", "Assureur professionnel"),
        {
            name: "insuranceDetails",
            label: "Détails de l’assurance",
            type: "textarea",
            admin: {
                description:
                    "Adresse de l’assureur, numéro de contrat et couverture géographique.",
            },
        },
        text(
            "publicationDirector",
            "Directeur ou directrice de la publication",
            "Prénom et nom de la personne responsable du contenu du site.",
        ),
    ],
};
