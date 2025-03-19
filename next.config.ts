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
            {
                protocol: "https",
                hostname: "yubybchcsxgpqpc6.public.blob.vercel-storage.com",
                pathname: "**"
            }
        ],
    },
};

export default nextConfig;