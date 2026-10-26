import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Project } from "@/payload-types";
import { testProjectData } from "@/tests/mocks/testData";
import DefaultProjectLayout from "./DefaultProjectLayout";
import EditorialProjectLayout from "./EditorialProjectLayout";
import GalleryFocusedProjectLayout from "./GalleryFocusedProjectLayout";
import MinimalProjectLayout from "./MinimalProjectLayout";

vi.mock("../ProjectMedia", () => ({
    default: ({
        item,
        alt,
        wide,
        className,
    }: {
        item: {
            layout?: string | null;
            media?: { id?: number } | number | null;
        };
        alt: string;
        wide?: boolean;
        className?: string;
    }) => (
        <div
            data-testid="project-media"
            data-media-id={typeof item.media === "object" ? item.media?.id : ""}
            data-layout={item.layout ?? ""}
            data-wide={String(Boolean(wide))}
            data-alt={alt}
            data-class-name={className ?? ""}
        />
    ),
}));

const project = testProjectData;
const noGallery = { ...testProjectData, galleryMedia: [] } as Project;
const items = () => screen.getAllByTestId("project-media");
const attr = (name: string) => items().map((item) => item.getAttribute(name));

describe("GalleryFocusedProjectLayout", () => {
    it("lays every media out in the grid, wide only for wide formats", () => {
        render(<GalleryFocusedProjectLayout project={project} />);

        expect(attr("data-media-id")).toEqual(["1", "2", "3", "4"]);
        // landscape, then three halves: the last one would sit alone.
        expect(attr("data-wide")).toEqual(["true", "false", "false", "true"]);
        expect(attr("data-alt")).toEqual([
            "Concours Bambou U Default 1",
            "Concours Bambou U Default 2",
            "Concours Bambou U Default 3",
            "Concours Bambou U Default 4",
        ]);
    });

    it("renders nothing without a gallery", () => {
        const { container } = render(
            <GalleryFocusedProjectLayout project={noGallery} />,
        );
        expect(container).toBeEmptyDOMElement();
    });
});

describe("DefaultProjectLayout", () => {
    it("opens with a full-width image", () => {
        render(<DefaultProjectLayout project={project} />);

        expect(attr("data-wide")).toEqual(["true", "false", "false", "true"]);
    });
});

describe("EditorialProjectLayout", () => {
    it("shows one wide image, a pair, then alternating single images", () => {
        render(<EditorialProjectLayout project={project} />);

        expect(attr("data-wide")).toEqual(["true", "false", "false", "false"]);
        expect(attr("data-layout").slice(1)).toEqual(["auto", "auto", "auto"]);
        expect(items()[3]).toHaveAttribute(
            "data-class-name",
            "w-full md:w-1/2 md:mr-auto",
        );
    });

    it("does not form a pair from a single remaining image", () => {
        render(
            <EditorialProjectLayout
                project={
                    {
                        ...project,
                        galleryMedia: project.galleryMedia?.slice(0, 2),
                    } as Project
                }
            />,
        );

        expect(items()[1]).toHaveAttribute(
            "data-class-name",
            "w-full md:w-1/2 md:mr-auto",
        );
    });
});

describe("MinimalProjectLayout", () => {
    it("shows at most three images, each full width", () => {
        render(<MinimalProjectLayout project={project} />);

        expect(attr("data-media-id")).toEqual(["1", "2", "3"]);
        expect(attr("data-layout")).toEqual(["full", "full", "full"]);
    });
});
