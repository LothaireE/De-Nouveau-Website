import MediaImage from "@/components/media/MediaImage";
import type { Project } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { isWideMedia } from "./mediaLayout";

/** Plans and drawings: shown whole on the page ground, never cropped. */
export default function ProjectPlans({ project }: { project: Project }) {
    const plans = (project.plans ?? []).filter(
        (item) => item.image && typeof item.image !== "number",
    );

    if (!plans.length) return null;

    return (
        <section
            aria-labelledby="project-plans-title"
            className="px-4 py-16 sm:px-6 md:py-24 lg:px-10"
        >
            <div className="mb-10 flex justify-between border-t border-studio-black pt-4 text-label uppercase tracking-wide text-studio-black/60">
                <h2 id="project-plans-title">Plans</h2>
                <span>{plans.length}</span>
            </div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                {plans.map((item, index) => (
                    <figure
                        key={item.id ?? index}
                        className={`m-0 ${isWideMedia(item.layout) ? "md:col-span-2" : ""}`}
                    >
                        <MediaImage
                            media={item.image}
                            size="large"
                            variant={isWideMedia(item.layout) ? "full" : "half"}
                            fallbackAlt={`Plan ${project.title} ${index + 1}`}
                            quality={90}
                            className="h-auto w-full object-contain"
                        />
                    </figure>
                ))}
            </div>

            {project.planDetails && (
                <div className="mt-16 grid grid-cols-1 gap-8 border-t border-studio-black/15 pt-10 md:grid-cols-12 md:gap-6">
                    <p className="text-label uppercase tracking-wide text-studio-black/60 md:col-span-3">
                        Détails des plans
                    </p>
                    <div className="max-w-prose text-body md:col-span-6">
                        <RichText data={project.planDetails} />
                    </div>
                </div>
            )}
        </section>
    );
}
