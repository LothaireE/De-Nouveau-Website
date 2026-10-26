import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { MediaImageProps } from "@/components/media/MediaImage";
import type { Media, Project } from "@/payload-types";
import { testProjectData } from "@/tests/mocks/testData";
import NextProject from "./NextProject";
import ProjectHero from "./ProjectHero";
import ProjectMedia from "./ProjectMedia";
import ProjectPlans from "./ProjectPlans";
import ProjectSummary from "./ProjectSummary";

vi.mock("next/image", () => ({
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={String(props.src)} alt={props.alt ?? ""} />
    ),
}));

vi.mock("@/components/media/MediaImage", () => ({
    default: ({
        media,
        size,
        variant,
        priority,
        className,
    }: MediaImageProps) => (
        <div
            data-testid="media-image"
            data-media-id={typeof media === "object" ? media?.id : ""}
            data-size={size}
            data-variant={variant}
            data-priority={String(Boolean(priority))}
            data-class-name={className}
        />
    ),
}));

vi.mock("@/components/media/MediaVideo", () => ({
    default: ({ media }: { media: Media }) => (
        <div data-testid="media-video" data-media-id={media?.id} />
    ),
}));

vi.mock("@payloadcms/richtext-lexical/react", () => ({
    RichText: () => <div data-testid="rich-text" />,
}));

const project = testProjectData;

describe("ProjectHero", () => {
    it("sets the title and key facts over a preloaded cover", () => {
        render(<ProjectHero project={project} />);

        expect(
            screen.getByRole("heading", {
                level: 1,
                name: "Concours Bambou U Default",
            }),
        ).toBeInTheDocument();
        expect(screen.getByText("Livré")).toBeInTheDocument();
        expect(screen.getByText("Bali, Indonésie")).toBeInTheDocument();

        const cover = screen.getByTestId("media-image");
        expect(cover).toHaveAttribute("data-media-id", "56");
        expect(cover).toHaveAttribute("data-size", "hero");
        expect(cover).toHaveAttribute("data-priority", "true");
    });

    it("offers the page links and a way home", () => {
        render(<ProjectHero project={project} />);

        const pages = within(screen.getByRole("navigation", { name: "Pages" }));
        expect(
            pages.getAllByRole("link").map((link) => link.textContent),
        ).toEqual(["Accueil", "À propos", "Contact"]);
        expect(
            screen.getByRole("link", { name: "De Nouveau, accueil" }),
        ).toHaveAttribute("href", "/");
    });
});

describe("ProjectSummary", () => {
    it("lists only the facts that are filled in", () => {
        render(
            <ProjectSummary
                project={{ ...project, surface: null, client: null }}
            />,
        );

        expect(
            screen.getAllByRole("term").map((term) => term.textContent),
        ).toEqual(["Statut", "Année", "Lieu"]);
        expect(
            screen.getByText("Une courte description du projet."),
        ).toBeInTheDocument();
        expect(screen.getByTestId("rich-text")).toBeInTheDocument();
    });

    it("renders nothing for an empty project", () => {
        const { container } = render(
            <ProjectSummary project={{ id: 1, title: "Vide" } as Project} />,
        );
        expect(container).toBeEmptyDOMElement();
    });
});

describe("ProjectMedia", () => {
    const [landscape, video, square] = project.galleryMedia ?? [];

    it("crops a regular image to its format", () => {
        const { container } = render(<ProjectMedia item={square} alt="Vue" />);

        expect(container.querySelector("figure")).toHaveClass("aspect-square");
        expect(screen.getByTestId("media-image")).toHaveAttribute(
            "data-size",
            "card",
        );
    });

    it("spans both columns when wide", () => {
        const { container } = render(
            <ProjectMedia item={landscape} alt="Vue" />,
        );

        expect(container.querySelector("figure")).toHaveClass("md:col-span-2");
        expect(screen.getByTestId("media-image")).toHaveAttribute(
            "data-size",
            "hero",
        );
    });

    it("plays videos", () => {
        render(<ProjectMedia item={video} alt="Vue" />);

        expect(screen.getByTestId("media-video")).toHaveAttribute(
            "data-media-id",
            "2",
        );
    });
});

describe("ProjectPlans", () => {
    it("shows every plan whole, with the count and details", () => {
        render(<ProjectPlans project={project} />);

        expect(
            screen.getByRole("heading", { name: "Plans" }),
        ).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
        const plans = screen.getAllByTestId("media-image");
        expect(plans).toHaveLength(2);
        expect(plans[0]).toHaveAttribute(
            "data-class-name",
            "h-auto w-full object-contain",
        );
        expect(screen.getByText("Détails des plans")).toBeInTheDocument();
    });

    it("renders nothing without plans", () => {
        const { container } = render(
            <ProjectPlans project={{ ...project, plans: [] }} />,
        );
        expect(container).toBeEmptyDOMElement();
    });
});

describe("NextProject", () => {
    it("links to the next project by its title", () => {
        render(<NextProject project={project} />);

        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/concours-bambou-u-default");
        expect(link).toHaveTextContent("Projet suivant");
        expect(
            within(link).getByRole("heading", {
                name: "Concours Bambou U Default",
            }),
        ).toBeInTheDocument();
    });
});
