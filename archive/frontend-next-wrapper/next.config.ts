import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isProd ? "/servicios-elpaisano" : "",
  assetPrefix: isProd ? "/servicios-elpaisano/" : "",
};

export default nextConfig;
