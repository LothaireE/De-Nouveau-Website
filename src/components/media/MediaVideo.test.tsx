import { render, screen } from "@testing-library/react";
import MediaVideo from "./MediaVideo";
import type { Media } from "@/payload-types";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/library/utils", () => ({
    getMediaUrl: (filename: string | null) =>
        filename ? `/media/${filename}` : null,
}));

const mockVideo = {
    id: 1,
    filename: "video.mp4",
    mediaType: "video",
    caption: "Ma caption vidéo",
} as unknown as Media;

describe("MediaVideo", () => {
    it("renders a video when media is valid", () => {
        render(<MediaVideo media={mockVideo} />);

        const video = document.querySelector("video");

        expect(video).toBeInTheDocument();
        expect(video).toHaveAttribute("src", "/media/video.mp4");
    });

    it("returns null when media is missing", () => {
        const { container } = render(<MediaVideo media={null} />);

        expect(container).toBeEmptyDOMElement();
    });

    it("returns null when media is a number", () => {
        const { container } = render(<MediaVideo media={123} />);

        expect(container).toBeEmptyDOMElement();
    });

    it("renders the caption when available", () => {
        const { getByText } = render(<MediaVideo media={mockVideo} />);

        expect(getByText("Ma caption vidéo")).toBeInTheDocument();
    });

    it.skip("does not render caption when withCaption is false", () => {
        render(<MediaVideo media={mockVideo} withCaption={false} />);

        expect(screen.queryByText("Ma caption vidéo")).not.toBeInTheDocument();
    });

    it.skip("uses controls mode correctly", () => {
        render(<MediaVideo media={mockVideo} controls />);

        const video = document.querySelector("video");

        expect(video).toHaveAttribute("controls");
        expect(video).not.toHaveAttribute("autoPlay");
        expect(video).not.toHaveAttribute("muted");
        expect(video).not.toHaveAttribute("loop");
    });
});
