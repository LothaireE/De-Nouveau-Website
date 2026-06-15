import { render, screen } from "@testing-library/react";
import type { Media } from "@/payload-types";
import MediaImage from "./MediaImage";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} alt={props.alt ?? ""} />;
    },
}));

vi.mock("@/library/utils", () => ({
    getMediaUrl: (filename: string | null) =>
        filename ? `/media/${filename}` : null,
}));

const mockImage: Partial<Media> = {
    filename: "photo.jpg",
    alt: "Photo test",
    caption: "Ma caption image",
    width: 1200,
    height: 800,
};

describe("MediaImage", () => {
    it("renders an image", () => {
        render(<MediaImage media={mockImage as Media} />);
        const image = screen.getByRole("img");

        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute("src", "/media/photo.jpg");
        expect(image).toHaveAttribute("alt", "Photo test");
    });

    it("uses fallbackAlt when alt is missing", () => {
        render(
            <MediaImage
                media={{ ...mockImage, alt: undefined } as Media}
                fallbackAlt="Fallback alt"
            />,
        );

        expect(screen.getByRole("img")).toHaveAttribute("alt", "Fallback alt");
    });

    it("renders caption when available", () => {
        render(<MediaImage media={mockImage as Media} />);

        expect(screen.getByText("Ma caption image")).toBeInTheDocument();
    });

    it("does not render caption when withCaption is false", () => {
        render(<MediaImage media={mockImage as Media} withCaption={false} />);

        expect(screen.queryByText("Ma caption image")).not.toBeInTheDocument();
    });

    it("returns null when media is null", () => {
        const { container } = render(
            <MediaImage media={null as unknown as Media} />,
        );

        expect(container).toBeEmptyDOMElement();
    });

    it("returns null when media is a number", () => {
        const { container } = render(
            <MediaImage media={123 as unknown as Media} />,
        );

        expect(container).toBeEmptyDOMElement();
    });
});
