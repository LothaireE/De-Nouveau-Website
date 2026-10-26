import Link from "next/link";
import LogoSplit from "@/components/layout/LogoSplit";
import HeroNav from "@/components/navigation/HeroNav";

const NotFoundPage = () => {
    return (
        <main className="bg-studio-white text-studio-black">
            <HeroNav variant="page" />

            <LogoSplit fillScreen className="text-statement font-medium">
                <div className="flex flex-col items-start gap-[2.2em]">
                    <div>
                        <h1>Page introuvable</h1>
                        <p className="text-studio-black/60">Erreur 404</p>
                    </div>
                    <Link href="/" className="fill-text">
                        Retour à l’accueil
                        <span aria-hidden="true"> →</span>
                    </Link>
                </div>
            </LogoSplit>
        </main>
    );
};

export default NotFoundPage;
