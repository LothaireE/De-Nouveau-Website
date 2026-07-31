import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import JsonLd, { serializeJsonLd } from "@/components/seo/JsonLd";

describe("JsonLd", () => {
    it("escapes HTML opening characters from Payload content", () => {
        const data = {
            "@context": "https://schema.org",
            name: "</script><script>alert('xss')</script>",
        };

        const serialized = serializeJsonLd(data);

        expect(serialized).not.toContain("<");
        expect(serialized).toContain("\\u003c/script>");
        expect(JSON.parse(serialized)).toEqual(data);
    });

    it("renders a native JSON-LD script", () => {
        const data = {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "De Nouveau",
        };
        const { container } = render(<JsonLd data={data} />);
        const script = container.querySelector(
            'script[type="application/ld+json"]',
        );

        expect(script).toBeInTheDocument();
        expect(JSON.parse(script?.textContent ?? "")).toEqual(data);
    });
});
