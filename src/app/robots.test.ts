import { describe, expect, it } from "vitest";
import robots from "@/app/robots";

describe("robots", () => {
    it("publishes the sitemap and excludes private application routes", () => {
        expect(robots()).toEqual({
            rules: {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin/", "/api/"],
            },
            sitemap: "https://www.denouveau.fr/sitemap.xml",
            host: "https://www.denouveau.fr",
        });
    });
});
