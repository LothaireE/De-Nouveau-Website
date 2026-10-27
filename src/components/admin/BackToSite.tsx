import Link from "next/link";

/**
 * Under the login form: a way back to the public site, styled like the
 * admin's own "Mot de passe oublié ?" link.
 */
export function BackToSite() {
    return (
        <p className="back-to-site">
            <Link href="/">Retour au site</Link>
        </p>
    );
}
