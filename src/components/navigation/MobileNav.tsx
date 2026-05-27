"use client";

import type { NavProjectItem } from "@/types/Navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
// import LOGO_WHITE from "../../../public/DE_NOUVEAU/SVG/AAAA_WHITE_02.svg";
import LOGO_BLACK from "../../../public/DE_NOUVEAU/SVG/AAAA_BLACK_02.svg";
import { frNavItems } from "@/library/navItems";

export default function MobileNav({
    projects,
}: {
    projects: NavProjectItem[];
}) {
    const [open, setOpen] = useState(false);

    const navClassName = ` fixed right-0 top-0 z-50 block text-sm md:hidden`;

    const panelClassName = ` fixed right-0 top-0 overflow-hidden text-studio-black transition-[width,height,padding,background-color,backdrop-filter,box-shadow] duration-500 ease-out ${
        open
            ? "h-screen w-screen p-6 bg-studio-white/90 shadow-xl backdrop-blur-sm"
            : "h-0 w-0 p-0"
    }`;

    const logoImageClassName = `block max-w-14 h-auto transition-transform duration-500 ease-in-out ${
        open ? "rotate-0" : "rotate-180"
    }`;

    const contentClassName = `mt-16 transition-all duration-500 ease-out ${
        open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
    }`;

    const mainLinkClassName =
        "block text-4xl font-medium leading-none tracking-[-0.04em] text-studio-black transition-colors hover:text-studio-red-muted";

    const projectLinkClassName =
        "group block pb-2 text-studio-moss transition-colors hover:text-studio-red-muted";

    const footerClassName = `absolute bottom-6 left-6 right-6 flex justify-between gap-6 border-studio-sand/60 pt-4 text-xs uppercase tracking-wide text-studio-wood transition-opacity duration-500 ${
        open ? "opacity-100" : "opacity-0"
    }`;

    const logo = LOGO_BLACK; //open ? LOGO_BLACK : LOGO_WHITE;

    return (
        <aside className={navClassName}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={open}
                className="fixed right-4 top-4 z-50"
            >
                <Image
                    src={logo}
                    alt="Logo De Nouveau"
                    className={logoImageClassName}
                />
            </button>
            <nav className={panelClassName}>
                <div className={contentClassName}>
                    <div className="grid gap-14">
                        <div>
                            <div className="space-y-3">
                                {frNavItems.map((navItem) => (
                                    <Link
                                        key={navItem.href}
                                        href={navItem.href}
                                        onClick={() => setOpen(false)}
                                        className={mainLinkClassName}
                                    >
                                        {navItem.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="space-y-2">
                                {projects.map((project) => (
                                    <Link
                                        key={project._id}
                                        href={`/${project.slug}`}
                                        onClick={() => setOpen(false)}
                                        className={projectLinkClassName}
                                    >
                                        <span className="block truncate text-lg leading-tight">
                                            {project.title}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={footerClassName}>
                    <span>De Nouveau</span>
                    <span>Architecture et Design</span>
                </div>
            </nav>
        </aside>
    );
}
