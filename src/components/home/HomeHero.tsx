import MediaImage from "@/components/MediaImage";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { Page } from "@/payload-types";

export default function HomeHero({ content }: { content: Page | null }) {
    if (!content) return null;

    const hasHeroVideo = Boolean(content.heroVideoUrl);
    const hasHeroImage =
        content.heroImage && typeof content.heroImage !== "number";

    return (
        <section className="relative bg-studio-white px-4 sm:px-6">
            <div className="relative min-h-[160vh]">
                <div className="relative h-[120vh] overflow-hidden bg-studio-cream">
                    {hasHeroVideo ? (
                        <video
                            src={content.heroVideoUrl || ""}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="h-full w-full object-cover"
                        />
                    ) : hasHeroImage ? (
                        <MediaImage
                            media={content.heroImage}
                            size="hero"
                            fallbackAlt={content.title}
                            priority={true}
                            className="h-full w-full object-cover"
                        />
                    ) : null}
                </div>

                <div className="pointer-events-none absolute inset-0">
                    <div className="sticky top-0 flex h-screen items-end md:items-center">
                        <div className="pointer-events-auto mb-8 w-full max-w-xl bg-studio-white p-6 md:mb-0 md:ml-12 md:max-w-2xl lg:ml-20 lg:max-w-3xl">
                            <h1 className="text-5xl font-medium leading-none text-studio-black md:text-7xl">
                                {content.title}
                            </h1>

                            {content.intro && (
                                <p className="mt-8 max-w-xl text-base leading-relaxed text-studio-black">
                                    {content.intro}
                                </p>
                            )}

                            {content.content && (
                                <div className="mt-8 max-w-xl text-base leading-relaxed text-studio-black">
                                    <RichText data={content.content} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
