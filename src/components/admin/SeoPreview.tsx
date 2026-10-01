"use client";

import { useFormFields } from "@payloadcms/ui";
import {
    getProjectSeo,
    getStaticPageSeo,
    type SeoPreviewKind,
} from "@/library/seoContent";
import { SITE_URL } from "@/library/seo";

export function SeoPreview({ kind }: { kind: SeoPreviewKind }) {
    const title = useFormFields(([fields]) => fields.title?.value);
    const shortDescription = useFormFields(
        ([fields]) => fields.shortDescription?.value,
    );
    const slug = useFormFields(([fields]) => fields.slug?.value);
    const seoTitle = useFormFields(([fields]) => fields.seoTitle?.value);
    const seoDescription = useFormFields(
        ([fields]) => fields.seoDescription?.value,
    );
    const seo =
        kind === "project"
            ? getProjectSeo({ title, shortDescription })
            : getStaticPageSeo(kind, { seoTitle, seoDescription });
    const path =
        kind === "project"
            ? typeof slug === "string" && slug
                ? `/${slug}`
                : "/nom-du-projet"
            : getStaticPageSeo(kind).path;
    return (
        <section
            aria-label="Aperçu du référencement"
            style={{
                border: "1px solid var(--theme-elevation-150)",
                borderRadius: 4,
                padding: 20,
                marginBottom: 24,
            }}
        >
            <h3 style={{ margin: "0 0 8px" }}>Référencement automatique</h3>
            <p
                style={{
                    margin: "0 0 16px",
                    color: "var(--theme-elevation-600)",
                }}
            >
                {kind === "project"
                    ? "Le titre, la description courte et la couverture du projet alimentent automatiquement son référencement et ses partages."
                    : "Cette page possède un titre et une description prédéfinis. Aucun champ SEO à remplir."}
            </p>
            <div style={{ overflowWrap: "anywhere", maxWidth: 650 }}>
                <small>
                    {SITE_URL}
                    {path === "/" ? "" : path}
                </small>
                <p style={{ fontSize: 20, margin: "6px 0", fontWeight: 600 }}>
                    {seo.title}
                </p>
                <p style={{ margin: 0, lineHeight: 1.5 }}>{seo.description}</p>
            </div>
            <p
                style={{
                    margin: "12px 0 0",
                    fontSize: 12,
                    color: "var(--theme-elevation-600)",
                }}
            >
                Aperçu indicatif des valeurs qui seront utilisées après
                enregistrement. Les moteurs de recherche peuvent afficher un
                autre extrait.
            </p>
        </section>
    );
}
