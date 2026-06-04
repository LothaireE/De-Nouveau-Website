import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const r2Hostname: string = process.env.R2_PUBLIC_HOSTNAME || "";

const nextConfig: NextConfig = {
    images: {
        qualities: [75, 80, 90],
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "3000",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "denouveau.fr",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "www.denouveau.fr",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: r2Hostname,
            },
        ],
    },
};

export default withPayload(nextConfig);
