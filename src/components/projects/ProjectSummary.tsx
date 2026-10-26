import type { Project } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getStatusLabel } from "@/library/projectDisplay";

/** Key facts in a ruled row, then the short and long descriptions. */
export default function ProjectSummary({ project }: { project: Project }) {
    const facts = [
        { label: "Statut", value: getStatusLabel(project.projectStatus) },
        { label: "Année", value: project.year ? String(project.year) : null },
        { label: "Lieu", value: project.location },
        { label: "Surface", value: project.surface },
        { label: "Client", value: project.client },
    ].filter((fact): fact is { label: string; value: string } =>
        Boolean(fact.value),
    );

    if (!facts.length && !project.shortDescription && !project.longDescription)
        return null;

    return (
        <section className="px-4 pt-10 sm:px-6 lg:px-10">
            {facts.length > 0 && (
                <dl className="grid grid-cols-2 gap-4 border-t border-studio-black pt-4 text-small md:grid-cols-5 md:gap-6">
                    {facts.map((fact) => (
                        <div key={fact.label}>
                            <dt className="text-label uppercase tracking-wide text-studio-black/60">
                                {fact.label}
                            </dt>
                            <dd className="mt-1">{fact.value}</dd>
                        </div>
                    ))}
                </dl>
            )}

            {(project.shortDescription || project.longDescription) && (
                <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-12 md:gap-6 md:py-24">
                    {project.shortDescription && (
                        <p className="text-heading font-normal md:col-span-7">
                            {project.shortDescription}
                        </p>
                    )}
                    {project.longDescription && (
                        <div className="max-w-prose text-body md:col-span-4 md:col-start-9">
                            <RichText data={project.longDescription} />
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
