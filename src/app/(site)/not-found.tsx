import Link from "next/link";

const NotFoundPage = () => {
    return (
        <main className="flex min-h-screen items-center bg-studio-white px-6 py-16 text-studio-black md:px-10">
            <section className="grid w-full grid-cols-1 gap-10 md:grid-cols-2">
                <div>
                    <p className="m-6 text-small uppercase tracking-wide text-studio-wood">
                        Erreur 404
                    </p>

                    <h1 className="max-w-2xl text-display font-medium text-studio-black md:text-center">
                        Page introuvable
                    </h1>
                </div>

                <div>
                    <p className="m-6 max-w-xl text-body text-studio-black">
                        La page que vous recherchez n’existe pas, a été déplacée
                        ou n’est plus disponible.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4 text-small uppercase tracking-wide">
                        <Link
                            href="/"
                            className="border border-studio-black px-5 py-3 text-studio-black transition hover:bg-studio-black hover:text-studio-white"
                        >
                            Retour à l’accueil
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default NotFoundPage;
