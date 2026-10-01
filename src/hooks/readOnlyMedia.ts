import { APIError, type CollectionBeforeOperationHook } from "payload";
/** Also runs for Local API calls with overrideAccess: true. */
export const protectSharedMedia: CollectionBeforeOperationHook = ({
    operation,
}) => {
    if (["create", "update", "delete"].includes(operation)) {
        throw new APIError(
            "Les médias sont en lecture seule dans cet environnement.",
            403,
        );
    }
};
