import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import ProjectLightbox from "./ProjectLightbox";

vi.mock("next/image", () => ({
    default: ({
        src,
        alt,
        onClick,
    }: React.ImgHTMLAttributes<HTMLImageElement>) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={String(src)} alt={alt ?? ""} onClick={onClick} />
    ),
}));

// jsdom has no modal dialogs nor matchMedia.
beforeAll(() => {
    HTMLDialogElement.prototype.showModal = function () {
        this.open = true;
    };
    HTMLDialogElement.prototype.close = function () {
        this.open = false;
    };
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
});

function Thumbnail({ n, caption }: { n: number; caption?: string }) {
    return (
        <button
            type="button"
            aria-label={`Agrandir : Vue ${n}`}
            data-lightbox-src={`https://media.test/vue-${n}.jpg`}
            data-lightbox-width="1600"
            data-lightbox-height="1067"
            data-lightbox-alt={`Vue ${n}`}
            data-lightbox-caption={caption}
        />
    );
}

function renderGallery() {
    render(
        <ProjectLightbox>
            <Thumbnail n={1} caption="Le séjour" />
            <Thumbnail n={2} />
            <Thumbnail n={3} />
        </ProjectLightbox>,
    );
}

const dialog = () => screen.getByRole("dialog", { hidden: true });
const photo = () => screen.getByRole("img", { hidden: true });
const openAt = async (n: number) => {
    fireEvent.click(
        screen.getByRole("button", { name: `Agrandir : Vue ${n}` }),
    );
    await vi.waitFor(() => expect(dialog()).toHaveAttribute("open"));
};

describe("ProjectLightbox", () => {
    it("opens on the clicked photo with its position and caption", async () => {
        renderGallery();
        await openAt(1);

        expect(photo()).toHaveAttribute("src", "https://media.test/vue-1.jpg");
        expect(photo()).toHaveAttribute("alt", "Vue 1");
        expect(screen.getByText("01 / 03")).toBeInTheDocument();
        expect(screen.getByText("Le séjour")).toBeInTheDocument();
        expect(document.documentElement.style.overflow).toBe("hidden");
    });

    it("steps through the photos and wraps around", async () => {
        renderGallery();
        await openAt(3);

        fireEvent.click(
            screen.getByRole("button", { name: "Suivant", hidden: true }),
        );
        await vi.waitFor(() =>
            expect(photo()).toHaveAttribute(
                "src",
                "https://media.test/vue-1.jpg",
            ),
        );

        fireEvent.keyDown(dialog(), { key: "ArrowLeft" });
        await vi.waitFor(() =>
            expect(screen.getByText("03 / 03")).toBeInTheDocument(),
        );
    });

    it("closes and gives the focus back to the thumbnail", async () => {
        renderGallery();
        await openAt(2);

        fireEvent.click(
            screen.getByRole("button", { name: "Fermer", hidden: true }),
        );
        await vi.waitFor(() => expect(dialog()).not.toHaveAttribute("open"));

        expect(document.activeElement).toHaveAccessibleName("Agrandir : Vue 2");
        expect(document.documentElement.style.overflow).toBe("");
    });
});
