"use client";

import type { NavProjectItem } from "@/types/Navigation";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { frNavItems } from "@/library/navItems";

const LOGO_BLACK_SRC = "/DE_NOUVEAU/SVG/AAAA_BLACK_02.svg";
const MENU_ID = "desktop-navigation-panel";

export default function DesktopNav({
    projects,
}: {
    projects: NavProjectItem[];
}) {
    const [open, setOpen] = useState(false);
    const [pinnedOpen, setPinnedOpen] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const hasFocusWithin = useRef(false);

    function closeMenu() {
        setPinnedOpen(false);
        setOpen(false);
    }

    function toggleMenu() {
        if (open) {
            closeMenu();
            return;
        }

        setPinnedOpen(true);
        setOpen(true);
    }

    const navClassName = `overflow-hidden border-studio-sand/50 bg-none text-studio-black shadow-none backdrop-blur-none transition-[width,height,margin,padding,background-color,backdrop-filter,box-shadow] duration-500 ease-out ${
        open
            ? "h-screen w-[46rem] p-6 shadow-xl bg-studio-white/85 shadow-sm backdrop-blur-sm"
            : "mr-4 mt-4 h-18 w-18 p-2"
    }`;

    const logoImageClassName = `block text-sm font-medium uppercase tracking-[-0.02em] text-studio-black max-w-14 h-auto transition-rotate duration-500 ease-out  ${open ? "rotate-0" : "rotate-450"}`;

    const contentClassName = `mt-16 transition-[width,height,margin,padding] duration-500 ease-out ${
        open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
    }`;

    const mainLinkClassName =
        "block text-3xl font-medium leading-none tracking-[-0.04em] text-studio-black transition-colors hover:text-studio-red-muted";

    const projectLinkClassName =
        "group block pb-2 text-studio-moss transition-colors hover:text-studio-red-muted";

    const footerClassName = `absolute bottom-6 left-6 right-6 flex justify-between  border-studio-sand/60 pt-4 text-xs uppercase tracking-wide text-studio-wood transition-opacity duration-500 ${
        open ? "opacity-100" : "opacity-0"
    }`;

    return (
        <aside
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => {
                if (!pinnedOpen && !hasFocusWithin.current) setOpen(false);
            }}
            onFocusCapture={(event) => {
                hasFocusWithin.current = true;
                if (event.target !== menuButtonRef.current) setOpen(true);
            }}
            onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    hasFocusWithin.current = false;
                }

                if (!pinnedOpen && !hasFocusWithin.current) {
                    setOpen(false);
                }
            }}
            onKeyDown={(event) => {
                if (event.key !== "Escape") return;

                menuButtonRef.current?.focus();
                closeMenu();
            }}
            className="fixed right-0 top-0 z-50 hidden text-sm md:block"
        >
            <nav aria-label="Navigation principale" className={navClassName}>
                <div className="flex items-start justify-between">
                    <button
                        ref={menuButtonRef}
                        type="button"
                        onClick={toggleMenu}
                        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                        aria-expanded={open}
                        aria-controls={MENU_ID}
                        className="text-studio-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-studio-red-muted"
                    >
                        <Image
                            src={LOGO_BLACK_SRC}
                            alt=""
                            className={logoImageClassName}
                            width={56}
                            height={56}
                            priority
                        />
                    </button>
                </div>

                <div
                    id={MENU_ID}
                    className={contentClassName}
                    aria-hidden={!open}
                    inert={!open}
                >
                    <div className="grid grid-cols-2 gap-10">
                        <div>
                            <div className="space-y-2">
                                {frNavItems.map((navItem) => (
                                    <Link
                                        key={navItem.href}
                                        href={navItem.href}
                                        onClick={closeMenu}
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
                                        onClick={closeMenu}
                                        className={projectLinkClassName}
                                    >
                                        <span className="block truncate text-base leading-tight">
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
