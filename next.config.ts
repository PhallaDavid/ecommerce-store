import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "zand.sgp1.cdn.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "rakiestore.onrender.com",
      },
    ],
  },
};

export default nextConfig;
