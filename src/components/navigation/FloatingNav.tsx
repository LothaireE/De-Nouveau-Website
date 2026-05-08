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

    const mainNavClassName = `overflow-hidden p-4 transition-all duration-500 ${open ? "bg-studio-sand backdrop-blur-md w-2xl shadow-lg" : "w-28"}`;

    const toggleNavClassname = `h-screen mt-8 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`;

    const mainLinkClassName = `p-2 block text-foreground hover:text-studio-red-muted ${open ? "" : "bg-white"}`;

    return (
        <aside
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className="fixed right-6 top-14 z-50 hidden text-sm md:block"
        >
            <nav className={mainNavClassName}>
                <div className="self-end flex justify-end mb-6">
                    <Link href="/" className={mainLinkClassName}>
                        DNV
                    </Link>
                </div>

                <div className={toggleNavClassname}>
                    <div className="mb-6 block space-y-2">
                        <Link
                            href="/"
                            className="block hover:text-studio-red-muted"
                        >
                            home
                        </Link>
                        <Link
                            href="/about"
                            className="block hover:text-studio-red-muted"
                        >
                            about
                        </Link>
                        <Link
                            href="/contact"
                            className="block hover:text-studio-red-muted"
                        >
                            contact
                        </Link>
                    </div>
                    <p className="mb-3 text-xs uppercase tracking-wide text-neutral-400">
                        Projects
                    </p>

                    <div className="space-y-2">
                        {projects.map((project) => (
                            <Link
                                key={project._id}
                                href={`/${project.slug}`}
                                className="block truncate hover:text-studio-red-muted"
                            >
                                {project.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </aside>
    );
}
