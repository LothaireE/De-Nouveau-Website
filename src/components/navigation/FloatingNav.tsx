"use client";

import { NavProjectItem } from "@/types/Navigation";
import Link from "next/link";
import { useState } from "react";

export default function FloatingNav({
    projects,
}: {
    projects: NavProjectItem[];
}) {
    const [open, setOpen] = useState(false);

    const navClassName = `overflow-hidden border-studio-sand/50 bg-studio-white/85 text-studio-black shadow-sm backdrop-blur-md transition-[width,height,margin,padding] duration-500 ease-out ${
        open
            ? "border h-screen w-[46rem] p-6 shadow-xl"
            : "mr-4 mt-4 h-14 w-24 p-2"
    }`;

    const logoClassName =
        "block text-sm font-medium uppercase tracking-[-0.02em] text-studio-black transition-colors hover:text-studio-red-muted";

    const menuLabelClassName = `text-xs uppercase tracking-wide text-studio-wood transition-opacity duration-300 ${
        open ? "opacity-100" : "opacity-0"
    }`;

    const contentClassName = `mt-16 transition-all duration-500 ease-out ${
        open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
    }`;

    const mainLinkClassName =
        "block text-3xl font-medium leading-none tracking-[-0.04em] text-studio-black transition-colors hover:text-studio-red-muted";

    const projectLinkClassName =
        "group block border-b border-studio-sand/40 pb-2 text-studio-moss transition-colors hover:text-studio-red-muted";

    const footerClassName = `absolute bottom-6 left-6 right-6 flex justify-between border-t border-studio-sand/60 pt-4 text-xs uppercase tracking-wide text-studio-wood transition-opacity duration-500 ${
        open ? "opacity-100" : "opacity-0"
    }`;

    const navItems = [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
    ];

    return (
        <aside
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className="fixed right-0 top-0 z-50 hidden text-sm md:block"
        >
            <nav className={navClassName}>
                <div className="flex items-start justify-between">
                    <Link href="/" className={logoClassName}>
                        DNV
                    </Link>

                    <span className={menuLabelClassName}>Menu</span>
                </div>

                <div className={contentClassName}>
                    <div className="grid grid-cols-2 gap-10">
                        <div>
                            <p className="mb-4 text-xs uppercase tracking-wide text-studio-wood">
                                Navigation
                            </p>

                            <div className="space-y-2">
                                {navItems.map((navItem) => (
                                    <Link
                                        key={navItem.href}
                                        href={navItem.href}
                                        className={mainLinkClassName}
                                    >
                                        {navItem.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="mb-4 text-xs uppercase tracking-wide text-studio-wood">
                                Projects
                            </p>

                            <div className="space-y-2">
                                {projects.map((project) => (
                                    <Link
                                        key={project._id}
                                        href={`/${project.slug}`}
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
                    <span>DeNouveau</span>
                    <span>Studio</span>
                </div>
            </nav>
        </aside>
    );
}
