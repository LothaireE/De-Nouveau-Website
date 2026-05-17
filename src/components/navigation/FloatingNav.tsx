"use client";

import { NavProjectItem } from "@/types/Navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import LOGO from "../../../public/DE_NOUVEAU/SVG/AAAA_BLACK_02.svg";

const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

export default function FloatingNav({
    projects,
}: {
    projects: NavProjectItem[];
}) {
    const [open, setOpen] = useState(false);

    const navClassName = `overflow-hidden border-studio-sand/50 bg-none text-studio-black shadow-none backdrop-blur-none transition-[width,height,margin,padding,background-color,backdrop-filter,box-shadow] duration-500 ease-out ${
        open
            ? "h-screen w-[46rem] p-6 shadow-xl bg-studio-white/85 shadow-sm backdrop-blur-sm"
            : "mr-4 mt-4 h-18 w-18 p-2"
    }`;

    const logoClassName = `block text-sm font-medium uppercase tracking-[-0.02em] text-studio-black transition-colors `;

    const logoImageClassName = `block text-sm font-medium uppercase tracking-[-0.02em] text-studio-black max-w-14 h-auto transition-rotate duration-500 ease-out  ${open ? "rotate-0" : "rotate-450"}`;

    // const menuLabelClassName = `text-xs uppercase tracking-wide text-studio-wood transition-opacity duration-300 ${
    //     open ? "opacity-100" : "opacity-0"
    // }`;

    // const contentClassName = `mt-16 transition-all duration-500 ease-out ${
    //     open
    //         ? "translate-y-0 opacity-100"
    //         : "pointer-events-none translate-y-4 opacity-0"
    // }`;

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
            onMouseLeave={() => setOpen(false)}
            className="fixed right-0 top-0 z-50 hidden text-sm md:block"
        >
            <nav className={navClassName}>
                <div className="flex items-start justify-between">
                    <Link href="/" className={logoClassName}>
                        <Image
                            src={LOGO}
                            // width={50}
                            // height={50}
                            alt="Logo De Nouveau"
                            className={logoImageClassName}
                        />
                    </Link>
                    {/* <span className={menuLabelClassName}>Menu</span> */}
                </div>

                <div className={contentClassName}>
                    <div className="grid grid-cols-2 gap-10">
                        <div>
                            {/* <p className="mb-4 text-xs uppercase tracking-wide text-studio-wood">
                                Navigation
                            </p> */}

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
                            {/* <p className="mb-4 text-xs uppercase tracking-wide text-studio-wood">
                                Projets
                            </p> */}

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
                    <span>De Nouveau</span>
                    <span>Architecture et Design</span>
                </div>
            </nav>
        </aside>
    );
}
