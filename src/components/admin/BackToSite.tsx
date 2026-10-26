import { Button } from "@payloadcms/ui";

/** Under the login form: a way back to the public site. */
export function BackToSite() {
    return (
        <Button
            el="anchor"
            url="/"
            buttonStyle="secondary"
            size="large"
            className="back-to-site"
        >
            Retour au site
        </Button>
    );
}
