import Image from "next/image";

/** Login screen logo: the full De Nouveau wordmark with its signature. */
export function AdminLogo() {
    return (
        <Image
            src="/DE_NOUVEAU/SVG/DE_NOUVEAU_RED_02.svg"
            alt="De Nouveau, architecture et design"
            width={320}
            height={78}
            priority
            style={{ height: "auto", maxWidth: "100%" }}
        />
    );
}
