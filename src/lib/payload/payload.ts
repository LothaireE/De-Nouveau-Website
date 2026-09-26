import { getPayload } from "payload";
import { type Payload } from "payload";
import config from "@/payload.config";

let payloadInstance: Payload | null = null;

export async function getPayloadClient(): Promise<Payload> {
    if (!payloadInstance) {
        payloadInstance = await getPayload({ config });
    }

    return payloadInstance;
}
