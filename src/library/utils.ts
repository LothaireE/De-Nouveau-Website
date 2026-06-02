export function getMediaUrl(filename: string | null) {
    if (!filename) return null;

    const baseUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_DEV_URL;
    const prefix = "media"; // match prefix defined in src/payload.config.ts

    if (!baseUrl) return null;

    return `${baseUrl}/${prefix}/${encodeURIComponent(filename)}`;
}
