import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Arrow from "./Arrow";

describe("Arrow", () => {
    it("points right by default and stays hidden from assistive technology", () => {
        const { container } = render(<Arrow />);
        const svg = container.querySelector("svg");

        expect(svg).toHaveAttribute("aria-hidden", "true");
        expect(svg?.style.rotate).toBe("");
        expect(svg).toHaveClass("h-5", "w-5");
    });

    it.each([45, 90, 135, 180, 270] as const)(
        "rotates clockwise by %i degrees",
        (rotation) => {
            const { container } = render(<Arrow rotation={rotation} />);
            expect(container.querySelector("svg")?.style.rotate).toBe(
                `${rotation}deg`,
            );
        },
    );

    it("accepts custom classes", () => {
        const { container } = render(<Arrow className="h-4 w-4" />);
        expect(container.querySelector("svg")).toHaveClass("h-4", "w-4");
    });
});
