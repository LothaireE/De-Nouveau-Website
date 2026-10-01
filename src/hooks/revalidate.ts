import { revalidatePath } from "next/cache";
import type {
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
    GlobalAfterChangeHook,
    PayloadRequest,
} from "payload";

function invalidate(paths: string[], req: PayloadRequest, layout = false) {
    if (req.context.disableRevalidate) return;
    for (const route of new Set(paths)) {
        try {
            revalidatePath(
                route,
                layout && route === "/" ? "layout" : undefined,
            );
        } catch (error) {
            req.payload.logger.warn({
                err: error,
                msg: `Could not revalidate ${route}`,
            });
        }
    }
}
export const revalidateGlobal =
    (route: string): GlobalAfterChangeHook =>
    ({ doc, req }) => {
        invalidate([route], req, route === "/");
        return doc;
    };
export const revalidatePage: CollectionAfterChangeHook = ({
    doc,
    previousDoc,
    req,
}) => {
    const routes = [doc.slug, previousDoc?.slug]
        .filter(Boolean)
        .map((slug) => (slug === "home" ? "/" : `/${slug}`));
    if (doc.slug === "contact" || previousDoc?.slug === "contact")
        routes.push("/");
    invalidate(routes, req, true);
    return doc;
};
export const revalidatePageDelete: CollectionAfterDeleteHook = ({
    doc,
    req,
}) => {
    invalidate([doc.slug === "home" ? "/" : `/${doc.slug}`, "/"], req, true);
    return doc;
};
export const revalidateProject: CollectionAfterChangeHook = ({
    doc,
    previousDoc,
    req,
}) => {
    invalidate(
        [
            "/",
            "/sitemap.xml",
            `/${doc.slug}`,
            ...(previousDoc?.slug ? [`/${previousDoc.slug}`] : []),
        ],
        req,
        true,
    );
    return doc;
};
export const revalidateProjectDelete: CollectionAfterDeleteHook = ({
    doc,
    req,
}) => {
    invalidate(["/", "/sitemap.xml", `/${doc.slug}`], req, true);
    return doc;
};
export const revalidateRelated: CollectionAfterChangeHook = ({ doc, req }) => {
    invalidate(["/", "/sitemap.xml"], req, true);
    return doc;
};
export const revalidateRelatedDelete: CollectionAfterDeleteHook = ({
    doc,
    req,
}) => {
    invalidate(["/", "/sitemap.xml"], req, true);
    return doc;
};
