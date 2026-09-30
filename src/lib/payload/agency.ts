import { cache } from "react";
import { getPayloadClient } from "./payload";

export const getAgencyInfo = cache(async () => {
    const payload = await getPayloadClient();
    const agency = await payload.findGlobal({ slug: "agency-info", depth: 0 });
    // Empty values are intentional: never revive the legacy page coordinates.
    return {
        email: agency.email ?? null,
        phone: agency.phone ?? null,
        address: agency.address ?? null,
        socialMedias: agency.socialMedias ?? [],
    };
});
