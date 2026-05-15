import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        qualities: [75, 90],
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "3000",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: `pub-21e71c5d37fe470cbb75999dac7d8b83.r2.dev`,
            },
        ],
    },
};

export default withPayload(nextConfig);

// {
//     protocol: "http",
//     hostname: "localhost",
//     port: "3000",
//     pathname: "/api/media/file/**",
// },
// {
//     protocol: "https",
//     hostname: "de-nouveau.com",
//     pathname: "/api/media/file/**",
// },
