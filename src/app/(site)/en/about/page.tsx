import { createMetadata } from "@/library/seo";

export const metadata = createMetadata({
    title: "About — De Nouveau",
    description:
        "Discover De Nouveau, its approach, projects and architectural vision.",
    path: "/en/about",
    locale: "en_US",
    image: "/images/about.jpg",
});

export default function AboutPage() {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">About De Nouveau</h2>
        </div>
    );
}
