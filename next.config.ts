import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "placehold.co",
                port: "",
                search: "",
                pathname: "**",
            },
        ],
    },
};

export default nextConfig;