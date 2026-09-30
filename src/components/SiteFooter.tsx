import Link from "next/link";

export default function SiteFooter() {
    return (
        <footer className="bg-studio-white px-5 py-6 text-xs text-studio-black/60 md:px-12">
            <Link
                href="/mentions-legales"
                className="transition hover:text-studio-black"
            >
                Mentions légales
            </Link>
        </footer>
    );
}
