import { normalizeSeoText } from "./seoContent";

/** Technical information maintained by the developers, not by the client. */
export const SITE_HOSTING = {
    name: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    website: "https://vercel.com",
} as const;

export type LegalNoticeSource = {
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    legal?: {
        companyName?: string | null;
        legalForm?: string | null;
        shareCapital?: string | null;
        siret?: string | null;
        rcs?: string | null;
        vatNumber?: string | null;
        architectsRegistration?: string | null;
        insurer?: string | null;
        insuranceDetails?: string | null;
        publicationDirector?: string | null;
    } | null;
};

export type LegalNoticeSection = {
    title: string;
    items: { label: string; value: string; href?: string }[];
};

const clean = (value: unknown) =>
    typeof value === "string" ? value.trim() : "";

/** Builds only the filled lines: an empty field is never displayed. */
export function getLegalNoticeSections(
    agency: LegalNoticeSource | null,
): LegalNoticeSection[] {
    const legal = agency?.legal ?? {};
    const email = clean(agency?.email);
    const phone = clean(agency?.phone);
    const capital = normalizeSeoText(legal.shareCapital);
    const sections: LegalNoticeSection[] = [
        {
            title: "Éditeur du site",
            items: [
                { label: "Raison sociale", value: clean(legal.companyName) },
                {
                    label: "Forme juridique",
                    value: [
                        clean(legal.legalForm),
                        capital && `au capital de ${capital}`,
                    ]
                        .filter(Boolean)
                        .join(" "),
                },
                { label: "Siège social", value: clean(agency?.address) },
                { label: "SIRET", value: clean(legal.siret) },
                { label: "RCS", value: clean(legal.rcs) },
                {
                    label: "TVA intracommunautaire",
                    value: clean(legal.vatNumber),
                },
                {
                    label: "E-mail",
                    value: email,
                    href: email && `mailto:${email}`,
                },
                {
                    label: "Téléphone",
                    value: phone,
                    href: phone && `tel:${phone.replace(/\s/g, "")}`,
                },
            ],
        },
        {
            title: "Profession réglementée",
            items: [
                {
                    label: "Inscription à l’Ordre des architectes",
                    value: clean(legal.architectsRegistration),
                },
            ],
        },
        {
            title: "Assurance professionnelle",
            items: [
                { label: "Assureur", value: clean(legal.insurer) },
                { label: "Détails", value: clean(legal.insuranceDetails) },
            ],
        },
        {
            title: "Publication",
            items: [
                {
                    label: "Directeur ou directrice de la publication",
                    value: clean(legal.publicationDirector),
                },
            ],
        },
        {
            title: "Hébergement",
            items: [
                { label: "Hébergeur", value: SITE_HOSTING.name },
                { label: "Adresse", value: SITE_HOSTING.address },
                {
                    label: "Site web",
                    value: SITE_HOSTING.website.replace("https://", ""),
                    href: SITE_HOSTING.website,
                },
            ],
        },
    ];
    return sections
        .map((section) => ({
            ...section,
            items: section.items
                .filter((item) => item.value)
                .map(({ href, ...item }) => (href ? { ...item, href } : item)),
        }))
        .filter((section) => section.items.length > 0);
}
