import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import DesktopNav from "@/components/navigation/DesktopNav";

const projects = [
    {
        _id: "project-1",
        _createdAt: "2026-07-31T10:00:00.000Z",
        title: "Maison contemporaine",
        slug: "maison-contemporaine",
    },
];

describe("DesktopNav", () => {
    beforeEach(() => {
        render(<DesktopNav projects={projects} />);
    });

    it("opens on hover and closes when the pointer leaves", () => {
        const menuButton = screen.getByRole("button", {
            name: "Ouvrir le menu",
        });
        const navigation = screen.getByRole("navigation", {
            name: "Navigation principale",
        });

        fireEvent.mouseEnter(navigation.parentElement!);
        expect(menuButton).toHaveAttribute("aria-expanded", "true");

        fireEvent.mouseLeave(navigation.parentElement!);
        expect(menuButton).toHaveAttribute("aria-expanded", "false");
    });

    it("keeps the menu open after a click when the pointer leaves", () => {
        const menuButton = screen.getByRole("button", {
            name: "Ouvrir le menu",
        });
        const navigation = screen.getByRole("navigation", {
            name: "Navigation principale",
        });

        fireEvent.click(menuButton);
        fireEvent.mouseLeave(navigation.parentElement!);

        expect(menuButton).toHaveAttribute("aria-expanded", "true");
        expect(menuButton).toHaveAccessibleName("Fermer le menu");
    });

    it("opens from the focused button and closes with Escape", () => {
        const menuButton = screen.getByRole("button", {
            name: "Ouvrir le menu",
        });
        const navigation = screen.getByRole("navigation", {
            name: "Navigation principale",
        });

        fireEvent.focus(menuButton);
        expect(menuButton).toHaveAttribute("aria-expanded", "false");

        fireEvent.click(menuButton);
        expect(menuButton).toHaveAttribute("aria-expanded", "true");

        fireEvent.keyDown(navigation.parentElement!, { key: "Escape" });
        expect(menuButton).toHaveAttribute("aria-expanded", "false");
        expect(menuButton).toHaveFocus();
    });

    it("keeps navigation links inert while the menu is closed", () => {
        const homeLink = screen.getByRole("link", {
            name: "Accueil",
            hidden: true,
        });
        const content = homeLink.closest("[inert]");

        expect(content).toHaveAttribute("aria-hidden", "true");
        expect(content).toHaveAttribute("inert");
    });

    it("closes after following a navigation link", () => {
        const menuButton = screen.getByRole("button", {
            name: "Ouvrir le menu",
        });

        fireEvent.click(menuButton);
        fireEvent.click(screen.getByRole("link", { name: "Accueil" }));

        expect(menuButton).toHaveAttribute("aria-expanded", "false");
    });
});
